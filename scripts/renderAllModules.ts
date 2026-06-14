// Render all modules in a course sequentially
//
// Usage:
//   npm run render:course -- --course=agentic-ai-for-beginners
//   npm run render:course -- --course=agentic-ai-for-beginners --modules=1,2,3
//   npm run render:course -- --preset=fast
//
// Options:
//   --course=ID        Course id from courses.json (output -> out/{courseId}/)
//   --modules=1,2,3    Subset of modules
//   --preset=draft|fast|normal|max
//   --concurrency=N    Override thread count (capped by CPU detection)
//   --scale=0.5        Resolution scale
//   --quality=80       JPEG quality
//   --muted            Skip audio
//   --skip-existing    Skip modules that already have a valid MP4 (default)
//   --force            Re-render even when output MP4 already exists

import { createRequire } from "module";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { allModules } from "../src/videos/moduleContent";

const require = createRequire(import.meta.url);
const { getOptimalRenderConcurrency } = require("./lib/renderConcurrency.js");
const { syncCoursePublicAssets } = require("./lib/syncCoursePublicAssets.js");

const args = process.argv.slice(2);
const repoRoot = path.join(__dirname, "..");

const presets: Record<string, { scale: number; concurrency: number; quality: number; muted: boolean; everyNth?: number }> = {
	draft: { scale: 0.5, concurrency: 6, quality: 60, muted: true, everyNth: 2 },
	fast: { scale: 1, concurrency: 6, quality: 80, muted: false },
	normal: { scale: 1, concurrency: 4, quality: 85, muted: false },
	max: { scale: 1, concurrency: 8, quality: 95, muted: false },
};

const presetArg = args.find((a) => a.startsWith("--preset="));
const presetName = presetArg ? presetArg.split("=")[1] : "fast";
const preset = presets[presetName] || presets.fast;

const courseArg = args.find((a) => a.startsWith("--course="));
const courseId = courseArg ? courseArg.split("=")[1] : null;

function loadModulesForCourse(id: string | null): number[] | null {
	if (!id) return null;
	const coursesPath = path.join(repoRoot, "courses.json");
	if (!fs.existsSync(coursesPath)) return null;
	const data = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
	const mapped = data.courseModuleMapping?.[id];
	if (Array.isArray(mapped) && mapped.length > 0) {
		return mapped.map((n: number) => Number(n)).filter((n: number) => !Number.isNaN(n));
	}
	const course = data.courses?.find((c: { id: string }) => c.id === id);
	if (course?.moduleCount > 0) {
		return Array.from({ length: course.moduleCount }, (_, i) => i + 1);
	}
	return null;
}

let moduleNumbers: number[] = [];
const modulesArg = args.find((a) => a.startsWith("--modules="));
if (modulesArg) {
	const modulesStr = modulesArg.split("=")[1];
	moduleNumbers = modulesStr.split(",").map((n) => parseInt(n.trim(), 10)).filter((n) => !Number.isNaN(n));
} else if (courseId) {
	const fromCourse = loadModulesForCourse(courseId);
	moduleNumbers = fromCourse ?? [];
	if (moduleNumbers.length === 0) {
		console.error(`No modules found for course: ${courseId}`);
		process.exit(1);
	}
} else {
	moduleNumbers = allModules.map((m) => m.moduleNumber);
}

const concurrencyArg = args.find((a) => a.startsWith("--concurrency="));
const requestedConcurrency = concurrencyArg ? parseInt(concurrencyArg.split("=")[1], 10) : preset.concurrency;
const concurrency = getOptimalRenderConcurrency(requestedConcurrency);

const scaleArg = args.find((a) => a.startsWith("--scale="));
const scale = scaleArg ? parseFloat(scaleArg.split("=")[1]) : preset.scale;

const qualityArg = args.find((a) => a.startsWith("--quality="));
const quality = qualityArg ? parseInt(qualityArg.split("=")[1], 10) : preset.quality;

const muted = args.includes("--muted") || preset.muted;
const everyNth = preset.everyNth;
const forceRender = args.includes("--force");
const skipExisting = forceRender ? false : !args.includes("--no-skip-existing");

const MIN_VALID_MP4_BYTES = 100_000;

const baseOutDir = path.join(repoRoot, "out");
const outputCourseId = courseId || "default";

if (outputCourseId && outputCourseId !== "default") {
	try {
		syncCoursePublicAssets(outputCourseId, repoRoot);
	} catch (error: any) {
		console.error(`\nAsset sync failed: ${error.message}`);
		console.error("Run: npx tsx scripts/activateCourse.ts", outputCourseId);
		process.exit(1);
	}
}

const estimatedMinutesPerModule: Record<string, number> = {
	draft: 2,
	fast: 5,
	normal: 10,
	max: 20,
};
const estPerModule = estimatedMinutesPerModule[presetName] || 10;
const totalEstimate = moduleNumbers.length * estPerModule;

console.log("=".repeat(60));
console.log("BATCH VIDEO RENDER");
console.log("=".repeat(60));
console.log(`Course: ${outputCourseId}`);
console.log(`Preset: ${presetName.toUpperCase()}`);
console.log(`Modules: ${moduleNumbers.join(", ")} (${moduleNumbers.length} total)`);
console.log(`CPU cores: ${os.cpus().length}`);
console.log("Settings:");
console.log(`  - Resolution: ${scale === 1 ? "1080p" : Math.round(1080 * scale) + "p"} (scale=${scale})`);
console.log(`  - Concurrency: ${concurrency} threads`);
console.log(`  - JPEG Quality: ${quality}%`);
console.log(`  - Audio: ${muted ? "DISABLED" : "enabled"}`);
if (skipExisting) console.log(`  - Skip existing MP4s: yes (use --force to re-render all)`);
if (everyNth) console.log(`  - Frame skip: every ${everyNth} frames`);
console.log(`Output: ${path.join(baseOutDir, outputCourseId)}/`);
console.log(`Estimated time: ~${totalEstimate} minutes`);
console.log("=".repeat(60));
console.log("");

const startTime = Date.now();
const results: { module: number; success: boolean; duration: number; error?: string; skipped?: boolean }[] = [];

// Machine-readable line for GUI batch progress (parsed by gui-server)
console.log(`BATCH_INFO:${JSON.stringify({ total: moduleNumbers.length, modules: moduleNumbers, skipExisting })}`);

function runRemotionRender(renderArgs: string[]): Promise<{ code: number; stderr: string }> {
	return new Promise((resolve, reject) => {
		const child = spawn("npx", renderArgs, {
			cwd: repoRoot,
			stdio: ["ignore", "pipe", "pipe"],
			shell: process.platform === "win32",
		});

		let stderr = "";

		child.stdout?.on("data", (chunk: Buffer) => {
			process.stdout.write(chunk);
		});
		child.stderr?.on("data", (chunk: Buffer) => {
			stderr += chunk.toString();
			process.stderr.write(chunk);
		});

		child.on("error", reject);
		child.on("close", (code) => {
			resolve({ code: code ?? 1, stderr });
		});
	});
}

async function renderAll(): Promise<void> {
for (const moduleNumber of moduleNumbers) {
	const moduleStartTime = Date.now();
	const compositionId = `module-${moduleNumber}`;
	const suffix = presetName !== "normal" && presetName !== "max" ? `-${presetName}` : "";

	const outDir = path.join(baseOutDir, outputCourseId);
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}

	const outputPath = path.join(outDir, `${compositionId}${suffix}.mp4`);

	if (skipExisting && fs.existsSync(outputPath)) {
		const existingSize = fs.statSync(outputPath).size;
		if (existingSize >= MIN_VALID_MP4_BYTES) {
			const sizeMb = (existingSize / 1024 / 1024).toFixed(1);
			console.log(`Module ${moduleNumber} skipped (output exists, ${sizeMb} MB). Use --force to re-render.`);
			results.push({ module: moduleNumber, success: true, duration: 0, skipped: true });
			continue;
		}
	}

	console.log(`\n[${"=".repeat(50)}]`);
	console.log(`Rendering Module ${moduleNumber}...`);
	console.log(`Output: ${outputPath}`);
	console.log(`Started at: ${new Date().toLocaleTimeString()}`);

	try {
		const renderArgs = [
			"remotion", "render", "src/index.tsx", compositionId, outputPath,
			"--public-dir=public",
			`--concurrency=${concurrency}`,
			`--jpeg-quality=${quality}`,
			"--timeout=120000",
		];
		if (scale !== 1) renderArgs.push(`--scale=${scale}`);
		if (muted) renderArgs.push("--muted");
		if (everyNth) renderArgs.push(`--every-nth-frame=${everyNth}`);

		const renderResult = await runRemotionRender(renderArgs);

		if (renderResult.code !== 0) {
			const errMsg = renderResult.stderr || `remotion exited with code ${renderResult.code}`;
			if (errMsg.includes("EPERM")) {
				if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
					console.log("\nWarning: EPERM during cleanup but output file exists.");
				} else {
					throw new Error(errMsg);
				}
			} else {
				throw new Error(errMsg);
			}
		}

		const duration = Math.round((Date.now() - moduleStartTime) / 1000);
		const fileSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
		if (fileSize === 0) {
			throw new Error("Output file is empty or was not created");
		}

		console.log(`\nModule ${moduleNumber} completed in ${duration}s`);
		console.log(`File size: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);
		results.push({ module: moduleNumber, success: true, duration });
	} catch (error: any) {
		const duration = Math.round((Date.now() - moduleStartTime) / 1000);
		const fileSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
		if (fileSize > 0 && (error.code === "EPERM" || error.message?.includes("EPERM"))) {
			results.push({ module: moduleNumber, success: true, duration });
		} else {
			console.error(`\nModule ${moduleNumber} FAILED after ${duration}s`);
			console.error(`Error: ${error.message}`);
			results.push({ module: moduleNumber, success: false, duration, error: error.message });
		}
	}
}

await renderAll();

const totalDuration = Math.round((Date.now() - startTime) / 1000);
const successful = results.filter((r) => r.success).length;
const failed = results.filter((r) => !r.success).length;

console.log("\n");
console.log("=".repeat(60));
console.log("BATCH RENDER COMPLETE");
console.log("=".repeat(60));
console.log(`Total time: ${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`);
console.log(`Successful: ${successful}/${moduleNumbers.length}`);
console.log(`Failed: ${failed}/${moduleNumbers.length}`);
const skipped = results.filter((r) => r.skipped).length;
if (skipped > 0) {
	console.log(`Skipped (already rendered): ${skipped}`);
}

if (failed > 0) {
	console.log("\nFailed modules:");
	results.filter((r) => !r.success).forEach((r) => {
		console.log(`  - Module ${r.module}: ${r.error}`);
	});
}

console.log("\nOutput files:");
results.filter((r) => r.success).forEach((r) => {
	const suffix = presetName !== "normal" && presetName !== "max" ? `-${presetName}` : "";
	const filePath = path.join(baseOutDir, outputCourseId, `module-${r.module}${suffix}.mp4`);
	const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
	console.log(`  - module-${r.module}${suffix}.mp4 (${(fileSize / 1024 / 1024).toFixed(1)} MB) - ${r.duration}s`);
});

console.log("=".repeat(60));
process.exit(failed > 0 ? 1 : 0);
