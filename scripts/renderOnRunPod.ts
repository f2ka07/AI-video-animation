// Ephemeral RunPod rendering: create CPU pod, render, download, destroy
//
// Usage:
//   npm run render:runpod                           # Use existing image
//   npm run render:runpod -- --build                 # Build and push image first
//   npm run render:runpod -- --preset=fast           # Quality preset
//   npm run render:runpod -- --modules=1,2,3         # Specific modules
//   npm run render:runpod -- --no-destroy            # Keep pod after render
//
// Required env: RUNPOD_API_KEY
// Optional env: SLIDES_IMAGE, RUNPOD_REGISTRY_AUTH_ID, RUNPOD_SSH_KEY_PATH, RUNPOD_DATA_CENTERS
// Optional env: RUNPOD_USE_GPU=true (use GPU pod for more vCPU/RAM; ~$0.60+/hr vs CPU)
// Optional env: RUNPOD_MIN_VCPU=9 (min vCPUs; for GPU pods use minVCPUPerGPU)

require("dotenv").config();

import { execSync, spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const RUNPOD_API = "https://rest.runpod.io/v1";
const POLL_INTERVAL_MS = 10000;
const POLL_MAX_ITERATIONS = 90;
const SSH_RETRY_ATTEMPTS = 18;
const SSH_RETRY_DELAY_MS = 15000;

const args = process.argv.slice(2);
const doBuild = args.includes("--build");
const noDestroy = args.includes("--no-destroy");
if (args.includes("--gpu")) {
	process.env.RUNPOD_USE_GPU = "true";
}
const presetArg = args.find((a) => a.startsWith("--preset="));
const modulesArg = args.find((a) => a.startsWith("--modules="));

const renderArgs = args.filter(
	(a) => a !== "--build" && a !== "--no-destroy" && a !== "--gpu" && !a.startsWith("--preset=") && !a.startsWith("--modules=") && !a.startsWith("--concurrency=")
);
if (presetArg) renderArgs.push(presetArg);
if (modulesArg) renderArgs.push(modulesArg);
// GPU pods: use high concurrency to utilize all vCPUs (default 28 for 32 vCPU)
const runpodConcurrency = process.env.RUNPOD_CONCURRENCY || (process.env.RUNPOD_USE_GPU === "true" ? "28" : "");
if (runpodConcurrency) renderArgs.push(`--concurrency=${runpodConcurrency}`);
// Optional: lower scale for speed (0.75 = 810p, 0.5 = 540p)
const runpodScale = process.env.RUNPOD_SCALE;
if (runpodScale) renderArgs.push(`--scale=${runpodScale}`);

function requireEnv(name: string): string {
	const v = process.env[name];
	if (!v) {
		console.error(`Error: ${name} is required. Set it in .env or export it.`);
		process.exit(1);
	}
	return v;
}

function getSshPublicKey(): string {
	const basePath = process.env.RUNPOD_SSH_KEY_PATH || path.join(os.homedir(), ".ssh", "id_ed25519");
	const keyPath = basePath.endsWith(".pub") ? basePath : basePath + ".pub";
	if (!fs.existsSync(keyPath)) {
		console.error(`Error: SSH public key not found at ${keyPath}`);
		console.error("Generate one with: ssh-keygen -t ed25519 -C your@email.com");
		console.error("Add it to RunPod: https://www.console.runpod.io/user/settings");
		process.exit(1);
	}
	return fs.readFileSync(keyPath, "utf-8").trim();
}

function getSlidesImage(): string {
	const img = process.env.SLIDES_IMAGE;
	if (!img) {
		console.error("Error: SLIDES_IMAGE is required.");
		console.error("Set it to your image, e.g. ghcr.io/owner/my-slides:latest");
		console.error("Use --build to build and push before creating the pod.");
		process.exit(1);
	}
	return img;
}

async function runpodFetch(
	endpoint: string,
	opts: { method?: string; body?: object } = {}
): Promise<any> {
	const apiKey = requireEnv("RUNPOD_API_KEY");
	const url = endpoint.startsWith("http") ? endpoint : `${RUNPOD_API}${endpoint}`;
	const res = await fetch(url, {
		method: opts.method || "GET",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: opts.body ? JSON.stringify(opts.body) : undefined,
	});
	const text = await res.text();
	if (!res.ok) {
		throw new Error(`RunPod API ${res.status}: ${text}`);
	}
	return text ? JSON.parse(text) : null;
}

async function buildAndPush(image: string): Promise<void> {
	console.log("Building and pushing image...");
	execSync(`docker build -t ${image} .`, {
		cwd: path.join(__dirname, ".."),
		stdio: "inherit",
	});
	execSync(`docker push ${image}`, { stdio: "inherit" });
	console.log("Image pushed successfully.");
}

async function createPod(
	image: string,
	sshPublicKey: string
): Promise<{ id: string; publicIp: string; sshPort: number }> {
	const useGpu = process.env.RUNPOD_USE_GPU === "true" || process.env.RUNPOD_USE_GPU === "1";
	const minVcpu = parseInt(process.env.RUNPOD_MIN_VCPU || "16", 10) || 16;

	const body: Record<string, unknown> = {
		imageName: image,
		name: "slides-render-ephemeral",
		containerDiskInGb: 20,
		ports: ["22/tcp"],
		supportPublicIp: true,
		cloudType: "SECURE",
		...(process.env.RUNPOD_DATA_CENTERS && {
			dataCenterIds: process.env.RUNPOD_DATA_CENTERS.split(",").map((s) => s.trim()),
			dataCenterPriority: "custom",
		}),
		env: {
			SSH_PUBLIC_KEY: sshPublicKey,
		},
		dockerStartCmd: [
			"sh",
			"-c",
			[
				"mkdir -p /root/.ssh",
				"chmod 700 /root/.ssh",
				'echo "$SSH_PUBLIC_KEY" >> /root/.ssh/authorized_keys',
				"chmod 600 /root/.ssh/authorized_keys",
				"service ssh start 2>/dev/null || /usr/sbin/sshd",
				"sleep infinity",
			].join(" && "),
		],
	};

	if (useGpu) {
		body.computeType = "GPU";
		body.gpuCount = 1;
		body.gpuTypeIds = ["NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4080", "NVIDIA L40S"];
		body.gpuTypePriority = "availability";
		body.minVCPUPerGPU = minVcpu;
		body.minRAMPerGPU = 16;
	} else {
		body.computeType = "CPU";
		body.cpuFlavorIds = ["cpu5g", "cpu5m", "cpu5c", "cpu3g", "cpu3m", "cpu3c"];
		body.cpuFlavorPriority = "custom";
	}

	const authId = process.env.RUNPOD_REGISTRY_AUTH_ID;
	if (authId) {
		body.containerRegistryAuthId = authId;
	}

	const pod = await runpodFetch("/pods", { method: "POST", body });
	if (!pod?.id) {
		throw new Error("RunPod API did not return pod id");
	}
	const podType = useGpu ? "GPU" : "CPU";
	const vcpu = pod.vcpuCount ?? pod.machine?.cpuCount ?? "?";
	const mem = pod.memoryInGb ?? pod.machine?.memoryInGb ?? "?";
	console.log(`Created ${podType} pod ${pod.id} (${vcpu} vCPU, ${mem} GB)`);
	return {
		id: pod.id,
		publicIp: pod.publicIp || pod.machine?.publicIp || "",
		sshPort: pod.portMappings?.["22"] ?? 22,
	};
}

async function waitForRunning(podId: string): Promise<{ publicIp: string; sshPort: number }> {
	for (let i = 0; i < POLL_MAX_ITERATIONS; i++) {
		const pod = await runpodFetch(`/pods/${podId}`);
		const publicIp = pod.publicIp || pod.machine?.publicIp || "";
		const sshPort = pod.portMappings?.["22"] ?? 22;
		if (pod.desiredStatus === "RUNNING" && publicIp) {
			return { publicIp, sshPort };
		}
		console.log(`Waiting for pod to be ready... (${i * (POLL_INTERVAL_MS / 1000)}s)`);
		await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
	}
	throw new Error("Pod did not become ready in time");
}

async function destroyPod(podId: string): Promise<void> {
	try {
		await runpodFetch(`/pods/${podId}`, { method: "DELETE" });
		console.log("Pod destroyed.");
	} catch (e: any) {
		console.error("Failed to destroy pod:", e.message);
	}
}

function getSshKeyPath(): string {
	const base = process.env.RUNPOD_SSH_KEY_PATH || path.join(os.homedir(), ".ssh", "id_ed25519");
	return base.endsWith(".pub") ? base.slice(0, -4) : base;
}

function sshExec(
	publicIp: string,
	sshPort: number,
	command: string
): { code: number; stdout: string; stderr: string } {
	const keyPath = getSshKeyPath();
	const sshCmd = `ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=10 -i "${keyPath}" -p ${sshPort} root@${publicIp} ${command}`;
	try {
		const out = execSync(sshCmd, {
			encoding: "utf-8",
			timeout: 0,
			maxBuffer: 50 * 1024 * 1024,
		});
		return { code: 0, stdout: out, stderr: "" };
	} catch (e: any) {
		return {
			code: e.status ?? e.code ?? 1,
			stdout: e.stdout || "",
			stderr: e.stderr || e.message || "",
		};
	}
}

function sshExecStream(
	publicIp: string,
	sshPort: number,
	command: string
): Promise<number> {
	return new Promise((resolve) => {
		const keyPath = getSshKeyPath();
		const args = [
			"-o", "StrictHostKeyChecking=no",
			"-o", "UserKnownHostsFile=/dev/null",
			"-o", "ConnectTimeout=10",
			"-i", keyPath,
			"-p", String(sshPort),
			`root@${publicIp}`,
			command,
		];
		const proc = spawn("ssh", args, { stdio: "inherit", shell: process.platform === "win32" });
		proc.on("close", (code) => resolve(code ?? 0));
	});
}

function scpFromPod(publicIp: string, sshPort: number, remotePath: string, localPath: string): void {
	const keyPath = getSshKeyPath();
	const cmd = `scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r -P ${sshPort} -i "${keyPath}" "root@${publicIp}:${remotePath}" "${localPath}"`;
	execSync(cmd, { stdio: "inherit" });
}

async function main(): Promise<void> {
	console.log("=".repeat(60));
	console.log("RUNPOD EPHEMERAL RENDER");
	console.log("=".repeat(60));

	const image = getSlidesImage();
	const sshPublicKey = getSshPublicKey();

	if (doBuild) {
		await buildAndPush(image);
	}

	const useGpu = process.env.RUNPOD_USE_GPU === "true" || process.env.RUNPOD_USE_GPU === "1";
	console.log(`Creating RunPod ${useGpu ? "GPU" : "CPU"} pod...`);
	let podInfo: { id: string; publicIp: string; sshPort: number };
	try {
		podInfo = await createPod(image, sshPublicKey);
	} catch (e: any) {
		console.error("Failed to create pod:", e.message);
		process.exit(1);
	}

	let publicIp = podInfo.publicIp;
	let sshPort = podInfo.sshPort;

	if (!publicIp || !sshPort) {
		console.log("Waiting for pod to be ready...");
		try {
			const ready = await waitForRunning(podInfo.id);
			publicIp = ready.publicIp;
			sshPort = ready.sshPort;
		} catch (e: any) {
			console.error(e.message);
			if (!noDestroy) await destroyPod(podInfo.id);
			process.exit(1);
		}
	}

	if (!publicIp) {
		console.error("Could not get pod public IP. Check RunPod console.");
		if (!noDestroy) await destroyPod(podInfo.id);
		process.exit(1);
	}

	console.log(`Pod ready. SSH: root@${publicIp} -p ${sshPort}`);

	for (let attempt = 0; attempt < SSH_RETRY_ATTEMPTS; attempt++) {
		const r = sshExec(publicIp, sshPort, "echo ok");
		if (r.code === 0 && r.stdout.trim() === "ok") {
			console.log("SSH connection verified.");
			break;
		}
		if (attempt === SSH_RETRY_ATTEMPTS - 1) {
			console.error("SSH connection failed after retries.");
			if (!noDestroy) await destroyPod(podInfo.id);
			process.exit(1);
		}
		console.log(`SSH not ready, retrying in ${SSH_RETRY_DELAY_MS / 1000}s...`);
		await new Promise((r) => setTimeout(r, SSH_RETRY_DELAY_MS));
	}

	const remoteCmd = `cd /app && npx tsx scripts/renderAllModules.ts ${renderArgs.join(" ")}`;
	console.log("Running render on pod... (output streams below)");
	console.log("Render args:", renderArgs.join(" "));
	const renderCode = await sshExecStream(publicIp, sshPort, remoteCmd);

	const localOut = path.join(__dirname, "..", "out");
	const remoteOut = "/app/out";
	console.log("Downloading rendered videos...");
	try {
		fs.mkdirSync(localOut, { recursive: true });
		scpFromPod(publicIp, sshPort, remoteOut + "/.", localOut);
	} catch (e: any) {
		console.error("SCP download failed:", e.message);
	}

	if (!noDestroy) {
		console.log("Destroying pod...");
		await destroyPod(podInfo.id);
	} else {
		console.log("Pod kept (--no-destroy). Manual cleanup: RunPod console or API.");
	}

	console.log("=".repeat(60));
	console.log("Done.");
	process.exit(renderCode);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
