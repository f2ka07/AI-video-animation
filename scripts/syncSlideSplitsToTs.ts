// Sync courses/*/slide-splits.json into src/utils/slideSplitsData.ts
// Run: npx tsx scripts/syncSlideSplitsToTs.ts
// Called after saving slide splits via GUI or when Finalize runs

import * as fs from "fs";
import * as path from "path";

const coursesDir = path.join(__dirname, "../courses");
const outputPath = path.join(__dirname, "../src/utils/slideSplitsData.ts");

if (!fs.existsSync(coursesDir)) {
	console.log("[syncSlideSplitsToTs] No courses directory, skipping");
	process.exit(0);
}

const courseDirs = fs.readdirSync(coursesDir);
const result: Record<string, unknown> = {};

for (const courseId of courseDirs) {
	const splitsPath = path.join(coursesDir, courseId, "slide-splits.json");
	if (!fs.existsSync(splitsPath)) continue;
	try {
		const raw = JSON.parse(fs.readFileSync(splitsPath, "utf-8"));
		const filtered: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(raw)) {
			if (key.startsWith("_")) continue;
			const v = val as { splitAt?: number[] };
			if (v && Array.isArray(v.splitAt) && v.splitAt.length >= 1) {
				filtered[key] = v;
			}
		}
		if (Object.keys(filtered).length > 0) {
			result[courseId] = filtered;
		}
	} catch (e) {
		console.warn(`[syncSlideSplitsToTs] Failed to read ${splitsPath}:`, e);
	}
}

const content = `// Slide splits per course - synced from courses/{courseId}/slide-splits.json
// Run: npx tsx scripts/syncSlideSplitsToTs.ts
// Used by GenericModule at runtime (browser-compatible)

import type { SlideSplitsConfig } from "./expandSlidesWithSplits";

export const slideSplitsByCourse: Record<string, SlideSplitsConfig> = ${JSON.stringify(result, null, 2)};
`;

fs.writeFileSync(outputPath, content, "utf-8");
console.log(`[syncSlideSplitsToTs] Wrote ${outputPath} with ${Object.keys(result).length} course(s)`);
