/**
 * Apply full narration scripts to Course 4 content.json
 * Usage: npx tsx scripts/applyCourse4Narration.ts
 */
import * as fs from "fs";
import * as path from "path";
import { COURSE4_NARRATION_SCRIPTS, COURSE4_SLIDE_POLISH } from "./lib/course4NarrationScripts";

const COURSE_ID = "ai-in-automation-networks";
const contentPath = path.join(__dirname, "../courses", COURSE_ID, "content.json");

const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
let updated = 0;
let polished = 0;
let missing: string[] = [];

for (const mod of content.modules || []) {
	for (const slide of mod.slides || []) {
		const script = COURSE4_NARRATION_SCRIPTS[slide.name];
		if (script) {
			slide.script = script;
			updated++;
		} else if (slide.script) {
			missing.push(slide.name);
		}

		const polish = COURSE4_SLIDE_POLISH[slide.name];
		if (polish) {
			if (polish.title) slide.title = polish.title;
			if (polish.points) slide.points = polish.points;
			if (polish.leftItems) slide.leftItems = polish.leftItems;
			if (polish.rightItems) slide.rightItems = polish.rightItems;
			polished++;
		}
	}
}

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + "\n", "utf-8");

console.log(`Updated ${updated} narration scripts and ${polished} slide titles/points in ${COURSE_ID}/content.json`);
if (missing.length) {
	console.warn(`Slides with scripts not in map (${missing.length}):`, missing.join(", "));
}

const mapKeys = Object.keys(COURSE4_NARRATION_SCRIPTS);
const slideNames = new Set(
	(content.modules || []).flatMap((m: { slides?: { name: string }[] }) =>
		(m.slides || []).map((s) => s.name)
	)
);
const unused = mapKeys.filter((k) => !slideNames.has(k));
if (unused.length) {
	console.warn(`Unused script keys (${unused.length}):`, unused.join(", "));
}
