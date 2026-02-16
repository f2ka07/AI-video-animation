// Create a RunPod pod that runs the GUI server (access via browser)
//
// Usage: npm run gui:runpod
//
// Required env: RUNPOD_API_KEY, SLIDES_IMAGE
// Optional: RUNPOD_REGISTRY_AUTH_ID, RUNPOD_SSH_KEY_PATH

require("dotenv").config();

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const RUNPOD_API = "https://rest.runpod.io/v1";
const POLL_INTERVAL_MS = 5000;

function requireEnv(name: string): string {
	const v = process.env[name];
	if (!v) {
		console.error(`Error: ${name} is required.`);
		process.exit(1);
	}
	return v;
}

function getSshPublicKey(): string {
	const basePath = process.env.RUNPOD_SSH_KEY_PATH || path.join(os.homedir(), ".ssh", "id_ed25519");
	const keyPath = basePath.endsWith(".pub") ? basePath : basePath + ".pub";
	if (!fs.existsSync(keyPath)) {
		console.error(`Error: SSH public key not found at ${keyPath}`);
		process.exit(1);
	}
	return fs.readFileSync(keyPath, "utf-8").trim();
}

async function runpodFetch(endpoint: string, opts: { method?: string; body?: object } = {}): Promise<any> {
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
	if (!res.ok) throw new Error(`RunPod API ${res.status}: ${text}`);
	return text ? JSON.parse(text) : null;
}

function getSshPrivateKey(): string {
	const basePath = process.env.RUNPOD_SSH_KEY_PATH || path.join(os.homedir(), ".ssh", "id_ed25519");
	const keyPath = basePath.endsWith(".pub") ? basePath.slice(0, -4) : basePath;
	if (!fs.existsSync(keyPath)) {
		throw new Error(`SSH private key not found at ${keyPath}`);
	}
	return fs.readFileSync(keyPath, "utf-8").trim();
}

async function main() {
	const image = requireEnv("SLIDES_IMAGE");
	const apiKey = requireEnv("RUNPOD_API_KEY");
	const sshPublicKey = getSshPublicKey();
	const sshPrivateKeyB64 = Buffer.from(getSshPrivateKey(), "utf-8").toString("base64");

	const body: Record<string, unknown> = {
		computeType: "CPU",
		cpuFlavorIds: ["cpu5g", "cpu5m", "cpu3g"],
		cpuFlavorPriority: "availability",
		imageName: image,
		name: "slides-gui",
		containerDiskInGb: 20,
		ports: ["3001/http", "22/tcp"],
		supportPublicIp: true,
		cloudType: "SECURE",
		env: Object.assign(
			{
				SSH_PUBLIC_KEY: sshPublicKey,
				RUNPOD_API_KEY: apiKey,
				SLIDES_IMAGE: image,
				RUNPOD_SSH_PRIVATE_KEY_B64: sshPrivateKeyB64,
			},
			process.env.RUNPOD_REGISTRY_AUTH_ID
				? { RUNPOD_REGISTRY_AUTH_ID: process.env.RUNPOD_REGISTRY_AUTH_ID }
				: {}
		),
		dockerStartCmd: [
			"sh",
			"-c",
			[
				"mkdir -p /root/.ssh",
				"chmod 700 /root/.ssh",
				'echo "$SSH_PUBLIC_KEY" >> /root/.ssh/authorized_keys',
				"chmod 600 /root/.ssh/authorized_keys",
				'echo "$RUNPOD_SSH_PRIVATE_KEY_B64" | base64 -d > /root/.ssh/id_ed25519',
				"chmod 600 /root/.ssh/id_ed25519",
				"service ssh start 2>/dev/null || /usr/sbin/sshd",
				"exec npx tsx gui-server.js",
			].join(" && "),
		],
	};

	const authId = process.env.RUNPOD_REGISTRY_AUTH_ID;
	if (authId) body.containerRegistryAuthId = authId;

	console.log("Creating RunPod pod for GUI...");
	const pod = await runpodFetch("/pods", { method: "POST", body });
	if (!pod?.id) throw new Error("No pod id returned");

	console.log(`Created pod ${pod.id}`);
	console.log("Waiting for pod to be ready...");

	for (let i = 0; i < 60; i++) {
		const p = await runpodFetch(`/pods/${pod.id}`);
		const ip = p.publicIp || p.machine?.publicIp || "";
		const port3001 = p.portMappings?.["3001"];
		const port22 = p.portMappings?.["22"];

		if (p.desiredStatus === "RUNNING") {
			console.log("");
			console.log("=".repeat(50));
			console.log("GUI is ready. Open in your browser:");
			console.log(`  https://${pod.id}-3001.proxy.runpod.net`);
			if (ip && port3001) {
				console.log(`  Or via TCP: http://${ip}:${port3001}`);
			}
			console.log("=".repeat(50));
			console.log("");
			console.log("Use 'Render on: RunPod' to render on a separate GPU pod.");
			console.log("To stop: delete the pod in RunPod console.");
			return;
		}
		await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
	}

	console.log("Pod created but not ready yet. Check RunPod console:");
	console.log(`  https://www.runpod.io/console/pods`);
	console.log(`  Pod ID: ${pod.id}`);
	console.log(`  When ready, open: https://${pod.id}-3001.proxy.runpod.net`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
