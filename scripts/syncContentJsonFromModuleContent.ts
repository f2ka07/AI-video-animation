// Sync content.json from moduleContent.ts for a course
// Run: npx tsx scripts/syncContentJsonFromModuleContent.ts agentic-ai-labs-deep-dive

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";

const courseId = process.argv[2] || "agentic-ai-labs-deep-dive";
const modules = allModules.filter((m) => m.courseId === courseId);
if (modules.length === 0) {
	console.error(`No modules found for course: ${courseId}`);
	process.exit(1);
}

const courseNames: Record<string, string> = {
	"agentic-ai-labs-deep-dive": "Agentic AI Labs Deep Dive",
};
const plan = {
	courseName: courseNames[courseId] || courseId,
	courseId,
	modules: modules.map((m) => ({
		moduleNumber: m.moduleNumber,
		title: m.title,
		subtitle: m.subtitle,
		slides: m.slides.map((s) => ({
			name: s.name,
			type: s.type,
			script: s.script,
			title: s.title,
			subtitle: s.subtitle,
			points: s.points,
			code: s.code,
			language: s.language,
			imageSrc: s.imageSrc,
			leftTitle: s.leftTitle,
			leftItems: s.leftItems,
			rightTitle: s.rightTitle,
			rightItems: s.rightItems,
			scene: s.scene,
		})),
	})),
	savedAt: new Date().toISOString(),
};

const contentPath = path.join(__dirname, "../courses", courseId, "content.json");
fs.writeFileSync(contentPath, JSON.stringify(plan, null, 2), "utf-8");
console.log(`Wrote ${contentPath} with ${modules.length} modules and ${modules.reduce((n, m) => n + m.slides.length, 0)} slides`);
