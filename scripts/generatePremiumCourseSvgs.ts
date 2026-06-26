// Generate visual-only diagram SVGs + staggered animation specs from content.json
// Usage: npx tsx scripts/generatePremiumCourseSvgs.ts <courseId> [moduleRange]

import * as fs from "fs";
import * as path from "path";
import { writeAnimationSpec } from "./lib/buildVisualAnimationSpec";
import { premiumVisualFromSlide, type ContentSlide } from "./lib/premiumSvgFromSlide";

function parseModuleRange(input: string, modules: number[]): number[] {
	if (!input || input === "all") return modules;
	if (input.includes("-")) {
		const [a, b] = input.split("-").map(Number);
		return modules.filter((n) => n >= a && n <= b);
	}
	const n = parseInt(input, 10);
	return modules.includes(n) ? [n] : [];
}

function main() {
	const courseId = process.argv[2];
	const moduleInput = process.argv[3] || "all";

	if (!courseId) {
		console.error("Usage: npx tsx scripts/generatePremiumCourseSvgs.ts <courseId> [moduleRange]");
		process.exit(1);
	}

	const contentPath = path.join(__dirname, "../courses", courseId, "content.json");
	if (!fs.existsSync(contentPath)) {
		console.error("content.json not found:", contentPath);
		process.exit(1);
	}

	const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	const allModuleNums = (content.modules || []).map((m: { moduleNumber: number }) => m.moduleNumber);
	const moduleNums = parseModuleRange(moduleInput, allModuleNums);

	let count = 0;
	for (const mod of content.modules || []) {
		if (!moduleNums.includes(mod.moduleNumber)) continue;
		const moduleDir = `module${String(mod.moduleNumber).padStart(2, "0")}`;
		const outDir = path.join(__dirname, "../courses", courseId, "course/diagrams/svg", moduleDir);
		if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

		for (const slide of mod.slides || []) {
			if (!slide.imageSrc) continue;
			const { svg, groupIds, svgFileName } = premiumVisualFromSlide(slide as ContentSlide, {
				courseId,
				moduleNumber: mod.moduleNumber,
			});
			const svgPath = path.join(outDir, svgFileName);
			fs.writeFileSync(svgPath, svg.trim() + "\n", "utf-8");

			const animSpec = writeAnimationSpec(svgFileName, groupIds);
			fs.writeFileSync(
				path.join(outDir, svgFileName.replace(".svg", ".animation.json")),
				JSON.stringify(animSpec, null, 2) + "\n",
				"utf-8"
			);

			console.log(`  ${moduleDir}/${svgFileName}`);
			count++;
		}
	}

	console.log(`\nGenerated ${count} visual-panel SVGs (+ animation specs) for ${courseId}`);
}

main();
