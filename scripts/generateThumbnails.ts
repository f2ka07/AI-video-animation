// Generate YouTube thumbnails (1280x720) for each module
// Uses thumbnailText from module content (max 3 words per expert blueprint)
// Output: out/{courseId}/thumbnails/module-{n}.png
//
// Usage:
//   npx tsx scripts/generateThumbnails.ts              # All modules
//   npx tsx scripts/generateThumbnails.ts --course=X  # Specific course
//   npx tsx scripts/generateThumbnails.ts --modules=1,2,3

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { allModules, ModuleContent } from "../src/videos/moduleContent";

function deriveThumbnailText(module: ModuleContent): string {
	const mod = module as ModuleContent & { thumbnailText?: string };
	if (mod.thumbnailText && mod.thumbnailText.trim()) {
		return mod.thumbnailText.trim().split(/\s+/).slice(0, 3).join(" ");
	}
	const words = (module.title || "Video")
		.replace(/[^a-zA-Z0-9\s]/g, " ")
		.split(/\s+/)
		.filter((w) => w.length > 0)
		.slice(0, 3);
	return words.length > 0 ? words.join(" ").toUpperCase() : "VIDEO";
}

function main(): void {
	const args = process.argv.slice(2);
	const courseArg = args.find((a) => a.startsWith("--course="));
	const modulesArg = args.find((a) => a.startsWith("--modules="));

	let modules = allModules;
	if (courseArg) {
		const courseId = courseArg.split("=")[1];
		modules = modules.filter((m) => m.courseId === courseId);
	}
	if (modulesArg) {
		const nums = modulesArg
			.split("=")[1]
			.split(",")
			.map((n) => parseInt(n.trim()))
			.filter((n) => !isNaN(n));
		modules = modules.filter((m) => nums.includes(m.moduleNumber));
	}

	if (modules.length === 0) {
		console.error("No modules to process. Check --course= or --modules=.");
		process.exit(1);
	}

	const projectRoot = path.join(__dirname, "..");
	const indexPath = path.join(projectRoot, "src", "index.tsx");

	console.log("=".repeat(60));
	console.log("THUMBNAIL GENERATION");
	console.log("=".repeat(60));
	console.log(`Modules: ${modules.map((m) => `module-${m.moduleNumber}`).join(", ")}`);
	console.log(`Output: out/{courseId}/thumbnails/`);
	console.log("=".repeat(60));

	for (const module of modules) {
		const courseId = module.courseId || "default";
		const thumbnailText = deriveThumbnailText(module);
		const outDir = path.join(projectRoot, "out", courseId, "thumbnails");
		const outputPath = path.join(outDir, `module-${module.moduleNumber}.png`);

		fs.mkdirSync(outDir, { recursive: true });

		const propsPath = path.join(outDir, `module-${module.moduleNumber}-props.json`);
		fs.writeFileSync(propsPath, JSON.stringify({ thumbnailText }));

		const cmd = `npx remotion still "${indexPath}" thumbnail "${outputPath}" --props="${propsPath}"`;

		console.log(`\nModule ${module.moduleNumber}: "${thumbnailText}" -> ${outputPath}`);
		try {
			execSync(cmd, {
				cwd: projectRoot,
				stdio: "inherit",
			});
			console.log(`  Done`);
		} catch (err) {
			console.error(`  Failed:`, err);
			process.exit(1);
		}
	}

	console.log("\n" + "=".repeat(60));
	console.log("THUMBNAIL GENERATION COMPLETE");
	console.log("=".repeat(60));
}

main();
