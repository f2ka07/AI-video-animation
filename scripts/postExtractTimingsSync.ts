/**
 * Run after Step 4 (extract word timings):
 * 1. Copy timings to public/ (derive-bullets reads public/timings)
 * 2. Activate course (moduleContent must match course being processed)
 * 3. Bootstrap slide-splits.json if missing
 * 4. Derive boundaries + bullets from word timings
 * 5. Line mappings for code slides (Line N from audio + code phrases)
 * 6. Activate again (bullets updated content.json)
 * 7. Copy timings + assets to public/
 *
 * Usage: npx tsx scripts/postExtractTimingsSync.ts <courseId> [moduleRange]
 */

import { execSync } from "child_process";
import * as path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { bootstrapSlideSplits } = require("./lib/bootstrapSlideSplits.js");
const {
	copyTimingsToPublic,
	syncCoursePublicAssets,
} = require("./lib/syncCoursePublicAssets.js");

const repoRoot = path.join(__dirname, "..");

function run(cmd: string, label: string) {
	console.log(`\n[postExtractTimingsSync] ${label}...`);
	console.log(`  ${cmd}`);
	execSync(cmd, { cwd: repoRoot, stdio: "inherit", encoding: "utf-8" });
}

function tryRun(cmd: string, label: string) {
	try {
		run(cmd, label);
		return true;
	} catch (e) {
		console.warn(`[postExtractTimingsSync] ${label} skipped:`, (e as Error).message);
		return false;
	}
}

function main() {
	const courseId = process.argv[2];
	const moduleRange = process.argv[3] || "all";

	if (!courseId) {
		console.error(
			"Usage: npx tsx scripts/postExtractTimingsSync.ts <courseId> [moduleRange]"
		);
		process.exit(1);
	}

	const modArg = moduleRange === "all" ? " all" : ` ${moduleRange}`;
	const modFlag =
		moduleRange !== "all" && !moduleRange.includes(",")
			? ` --module ${moduleRange.split("-")[0]}`
			: "";

	console.log(`[postExtractTimingsSync] Course: ${courseId}, modules: ${moduleRange}`);

	const timingsCopy = copyTimingsToPublic(courseId, repoRoot);
	if (timingsCopy.warning) {
		console.warn(`[postExtractTimingsSync] ${timingsCopy.warning}`);
	} else {
		console.log(
			`[postExtractTimingsSync] Copied ${timingsCopy.copied} timing file(s) to public/timings/`
		);
	}

	run(`npx tsx scripts/activateCourse.ts ${courseId}`, "Activate course (sync moduleContent)");

	const boot = bootstrapSlideSplits(courseId, repoRoot);
	if (boot.created) {
		console.log(
			`[postExtractTimingsSync] Bootstrapped slide-splits.json (${boot.slides} slides)`
		);
	} else {
		console.log(`[postExtractTimingsSync] slide-splits: ${boot.reason}`);
	}

	tryRun(
		`npx tsx scripts/deriveBoundariesFromScript.ts ${courseId}${modFlag}`,
		"Derive slide boundaries from script"
	);

	run(
		`npx tsx scripts/deriveBulletsFromWordTimings.ts ${courseId}${modArg}`,
		"Derive bullets from word timings"
	);

	tryRun(
		`npx tsx scripts/mapPhraseTimes.ts ${courseId}${modArg}`,
		"Map phrase times for bullet and comparison highlights"
	);

	run(
		`npx tsx scripts/generateLineMappingsFromContent.ts ${moduleRange}`,
		"Generate line mappings"
	);

	run(
		`npx tsx scripts/activateCourse.ts ${courseId}`,
		"Activate course (apply derived bullets)"
	);

	syncCoursePublicAssets(courseId, repoRoot);

	console.log("\n[postExtractTimingsSync] Done. Restart Remotion Studio to preview.");
}

main();
