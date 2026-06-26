/**
 * Restructure Course 4 as a teaching course (not syllabus summary).
 * - Removes per-module certification checkpoint slides
 * - Applies problem-first narration and learning-focused subtitles
 *
 * Usage: npx tsx scripts/restructureCourse4Teaching.ts
 */
import * as fs from "fs";
import * as path from "path";
import { COURSE4_NARRATION_SCRIPTS, COURSE4_SLIDE_POLISH } from "./lib/course4NarrationScripts";
import { COURSE4_MODULE_SUBTITLES, COURSE4_REMOVED_SLIDES } from "./lib/course4ModuleSubtitles";

const COURSE_ID = "ai-in-automation-networks";
const contentPath = path.join(__dirname, "../courses", COURSE_ID, "content.json");

const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
let removed = 0;
let updated = 0;
let polished = 0;

for (const mod of content.modules || []) {
	if (COURSE4_MODULE_SUBTITLES[mod.moduleNumber]) {
		mod.subtitle = COURSE4_MODULE_SUBTITLES[mod.moduleNumber];
	}

	const kept: typeof mod.slides = [];
	for (const slide of mod.slides || []) {
		if (COURSE4_REMOVED_SLIDES.has(slide.name)) {
			removed++;
			continue;
		}

		const script = COURSE4_NARRATION_SCRIPTS[slide.name];
		if (script) {
			slide.script = script;
			updated++;
		}

		const polish = COURSE4_SLIDE_POLISH[slide.name];
		if (polish) {
			if (polish.title) slide.title = polish.title;
			if (polish.points) slide.points = polish.points;
			if (polish.leftItems) slide.leftItems = polish.leftItems;
			if (polish.rightItems) slide.rightItems = polish.rightItems;
			polished++;
		}

		kept.push(slide);
	}
	mod.slides = kept;
}

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + "\n", "utf-8");

const slideNames = new Set(
	(content.modules || []).flatMap((m: { slides?: { name: string }[] }) =>
		(m.slides || []).map((s) => s.name)
	)
);
const missingScripts = [...slideNames].filter((n) => !COURSE4_NARRATION_SCRIPTS[n]);

console.log(`Course 4 teaching restructure for ${COURSE_ID}:`);
console.log(`  Removed ${removed} syllabus checkpoint slides`);
console.log(`  Updated ${updated} narration scripts`);
console.log(`  Polished ${polished} slide titles/points`);
console.log(`  Total slides remaining: ${slideNames.size}`);
if (missingScripts.length) {
	console.warn(`  Missing scripts (${missingScripts.length}):`, missingScripts.join(", "));
}
