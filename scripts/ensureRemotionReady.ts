/**
 * Run before Remotion Studio (npm start) so previews always match the active course:
 * - Sync timings + SVGs from courses/{id}/ to public/
 * - Warn when SLIDES_COURSE_ID in .env disagrees with moduleContent.ts
 *
 * Usage: npx tsx scripts/ensureRemotionReady.ts
 */

import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { syncCoursePublicAssets } = require("./lib/syncCoursePublicAssets.js");

function readActiveCourseId(): string | null {
	const moduleContentPath = path.join(__dirname, "../src/videos/moduleContent.ts");
	if (!fs.existsSync(moduleContentPath)) return null;
	const text = fs.readFileSync(moduleContentPath, "utf-8");
	const match = text.match(/courseId:\s*"([^"]+)"/);
	return match?.[1] ?? null;
}

function readEnvCourseId(): string | null {
	const envPath = path.join(__dirname, "../.env");
	if (!fs.existsSync(envPath)) return null;
	const line = fs
		.readFileSync(envPath, "utf-8")
		.split("\n")
		.find((l) => l.startsWith("SLIDES_COURSE_ID="));
	if (!line) return null;
	return line.split("=")[1]?.trim().replace(/^["']|["']$/g, "") || null;
}

function main() {
	const repoRoot = path.join(__dirname, "..");
	const activeCourseId = readActiveCourseId();
	const envCourseId = readEnvCourseId();

	if (!activeCourseId) {
		console.warn(
			"[ensureRemotionReady] No courseId in moduleContent.ts — activate a course first:\n" +
				"  npx tsx scripts/activateCourse.ts infrastructure-as-code-versioned-networks"
		);
		process.exit(0);
	}

	if (envCourseId && envCourseId !== activeCourseId) {
		console.warn(
			`[ensureRemotionReady] SLIDES_COURSE_ID in .env is "${envCourseId}" but moduleContent.ts is "${activeCourseId}".\n` +
				`  ./start.sh will re-activate the wrong course and break SVGs/code slides.\n` +
				`  Fix .env: SLIDES_COURSE_ID=${activeCourseId}`
		);
	}

	const courseDir = path.join(repoRoot, "courses", activeCourseId);
	if (!fs.existsSync(courseDir)) {
		console.warn(`[ensureRemotionReady] Course folder missing: courses/${activeCourseId}/`);
		process.exit(0);
	}

	try {
		syncCoursePublicAssets(activeCourseId, repoRoot);
		console.log(`[ensureRemotionReady] Ready for Remotion: ${activeCourseId}`);
	} catch (e) {
		console.warn("[ensureRemotionReady] Asset sync failed:", (e as Error).message);
	}
}

main();
