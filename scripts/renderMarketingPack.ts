#!/usr/bin/env npx tsx
/**
 * Render all 3 marketing outputs for a marketing pack course.
 *
 * Usage:
 *   npx tsx scripts/renderMarketingPack.ts
 *   npx tsx scripts/renderMarketingPack.ts --course=agentic-ai-marketing
 *   npx tsx scripts/renderMarketingPack.ts --preset=fast
 *
 * Requires: activate the marketing course first (Finalize in wizard), then audio generated.
 * Output: out/{courseId}/youtube-short.mp4, facebook-reel.mp4, udemy-trailer.mp4
 */

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { getOptimalRenderConcurrency } = require("./lib/renderConcurrency.js");

const repoRoot = path.join(__dirname, "..");
const args = process.argv.slice(2);

const courseArg = args.find((a) => a.startsWith("--course="));
const courseId = courseArg ? courseArg.split("=")[1] : "agentic-ai-marketing";

const presetArg = args.find((a) => a.startsWith("--preset="));
const presetName = presetArg ? presetArg.split("=")[1] : "fast";

const presets: Record<string, { scale: number; quality: number }> = {
	draft: { scale: 0.5, quality: 60 },
	fast: { scale: 1, quality: 80 },
	max: { scale: 1, quality: 95 },
};
const preset = presets[presetName] || presets.fast;

const contentPath = path.join(repoRoot, "courses", courseId, "content.json");
if (!fs.existsSync(contentPath)) {
	console.error(`Marketing course not found: ${contentPath}`);
	process.exit(1);
}

const plan = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
const outputs: Array<{ moduleNumber: number; platform: string; filename: string }> =
	plan.outputs ??
	plan.modules?.map((m: { moduleNumber: number; outputPlatform?: string; videoCategory?: string }) => ({
		moduleNumber: m.moduleNumber,
		platform: m.outputPlatform ?? `module-${m.moduleNumber}`,
		filename:
			m.outputPlatform === "youtube-shorts"
				? "youtube-short.mp4"
				: m.outputPlatform === "facebook-reel"
					? "facebook-reel.mp4"
					: m.outputPlatform === "udemy-trailer"
						? "udemy-trailer.mp4"
						: `module-${m.moduleNumber}.mp4`,
	})) ??
	[];

if (outputs.length === 0) {
	console.error("No outputs defined in content.json (outputs[] or modules with outputPlatform)");
	process.exit(1);
}

const outDir = path.join(repoRoot, "out", courseId);
fs.mkdirSync(outDir, { recursive: true });

const concurrency = getOptimalRenderConcurrency();

function renderModule(moduleNumber: number, outputFile: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const outputPath = path.join(outDir, outputFile);
		const compositionId = `module-${moduleNumber}`;
		console.log(`\nRendering ${compositionId} -> ${outputPath}`);

		const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
		const renderArgs = [
			"remotion",
			"render",
			"src/index.tsx",
			compositionId,
			outputPath,
			`--concurrency=${concurrency}`,
			`--jpeg-quality=${preset.quality}`,
			"--timeout=12000",
		];
		if (preset.scale !== 1) {
			renderArgs.push(`--scale=${preset.scale}`);
		}

		const child = spawn(cmd, renderArgs, {
			cwd: repoRoot,
			stdio: "inherit",
			shell: process.platform === "win32",
		});

		child.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`Render failed for ${compositionId} (exit ${code})`));
		});
	});
}

async function main() {
	console.log(`Marketing pack render: ${courseId}`);
	console.log(`Output directory: ${outDir}`);
	console.log(`Preset: ${presetName}, concurrency: ${concurrency}`);

	for (const out of outputs.sort((a, b) => a.moduleNumber - b.moduleNumber)) {
		await renderModule(out.moduleNumber, out.filename);
	}

	console.log("\nDone. Marketing outputs:");
	for (const out of outputs) {
		console.log(`  ${out.platform}: out/${courseId}/${out.filename}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
