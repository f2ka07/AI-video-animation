/**
 * Move retired code and generated noise into store/ so src/ stays lean.
 * Safe to re-run: only moves files that still exist in src/.
 *
 * Usage: npx tsx scripts/archiveToStore.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.join(__dirname, "..");
const STORE = path.join(ROOT, "store");

const ARCHIVED_COMPONENTS = [
	"AnimatedDiagramScene.tsx",
	"EnhancedSvgAnimation.tsx",
	"WordDrivenSvgSlide.tsx",
	"SvgSequentialSlide.tsx",
	"SvgContentSlide.tsx",
	"StickTeacherBulletSlide.tsx",
];

const ARCHIVED_UTILS = ["svgElementMappings.ts"];

const ARCHIVED_SCRIPTS: Array<{ file: string; note: string }> = [
	{ file: "generateAllModules.ts", note: "Superseded by generateModulesFromContent.ts" },
	{ file: "generate-svg-mappings.ts", note: "Superseded by animation.json + generateAnimationSpecs.ts" },
	{ file: "extractBulletStarts.ts", note: "Superseded by extractBulletStartsFromTimings.ts" },
	{ file: "manualBulletStarts.ts", note: "One-off manual overrides" },
	{ file: "extractModule1Timings.ts", note: "Module-specific one-off" },
	{ file: "alignModule1Timings.ts", note: "Module-specific one-off" },
	{ file: "extractModule2WordTimings.ts", note: "Module-specific one-off" },
];

function ensureDir(dir: string): void {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function moveFile(src: string, destDir: string): boolean {
	if (!fs.existsSync(src)) return false;
	ensureDir(destDir);
	const dest = path.join(destDir, path.basename(src));
	if (fs.existsSync(dest)) {
		fs.unlinkSync(dest);
	}
	fs.renameSync(src, dest);
	return true;
}

function moveMatching(dir: string, pattern: RegExp, destDir: string): number {
	if (!fs.existsSync(dir)) return 0;
	let count = 0;
	for (const name of fs.readdirSync(dir)) {
		if (!pattern.test(name)) continue;
		if (moveFile(path.join(dir, name), destDir)) count++;
	}
	return count;
}

function writeScriptsManifest(): void {
	const manifestDir = path.join(STORE, "archived-scripts");
	const lines = [
		"# Archived scripts",
		"",
		"These are kept for reference. Use the replacement listed below.",
		"",
		"| Archived | Use instead |",
		"|----------|-------------|",
		...ARCHIVED_SCRIPTS.map(
			(s) => `| ${s.file} | ${s.note} |`
		),
		"",
	];
	fs.writeFileSync(path.join(manifestDir, "README.md"), lines.join("\n"), "utf-8");
}

function main(): void {
	console.log("\nArchiving retired code to store/\n");

	let moved = 0;

	for (const name of ARCHIVED_COMPONENTS) {
		if (moveFile(path.join(ROOT, "src/components", name), path.join(STORE, "archived-components"))) {
			console.log(`  component: ${name}`);
			moved++;
		}
	}

	for (const name of ARCHIVED_UTILS) {
		if (moveFile(path.join(ROOT, "src/utils", name), path.join(STORE, "archived-utils"))) {
			console.log(`  util: ${name}`);
			moved++;
		}
	}

	for (const { file } of ARCHIVED_SCRIPTS) {
		if (moveFile(path.join(ROOT, "scripts", file), path.join(STORE, "archived-scripts"))) {
			console.log(`  script: ${file}`);
			moved++;
		}
	}
	writeScriptsManifest();

	const videosDir = path.join(ROOT, "src/videos");
	for (const name of fs.readdirSync(videosDir)) {
		if (/^Module\d+\.tsx$/i.test(name) || /^Module\d+Config\.ts$/i.test(name)) {
			if (moveFile(path.join(videosDir, name), path.join(STORE, "archived-videos"))) {
				console.log(`  video: ${name}`);
				moved++;
			}
		}
	}

	const backupCount = moveMatching(/\.backup\./i, videosDir, path.join(STORE, "archived-backups", "videos"));
	if (backupCount > 0) {
		console.log(`  backups: ${backupCount} files from src/videos/`);
		moved += backupCount;
	}

	console.log(`\nDone. Moved ${moved} items into store/.\n`);
}

main();
