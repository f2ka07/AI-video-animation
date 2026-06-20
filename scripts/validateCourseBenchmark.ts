/**
 * Validate a scene module against the Module 1 benchmark.
 * Run: npx tsx scripts/validateCourseBenchmark.ts agentic-ai-for-beginners 1
 */
import * as fs from "fs";
import * as path from "path";
import { SCENE_MODULE_BENCHMARK, segmentDurationFrames } from "./sceneModuleTiming";

const ROOT = path.join(__dirname, "..");

type Check = { ok: boolean; message: string };

function read(filePath: string): string {
	return fs.readFileSync(filePath, "utf-8");
}

function exists(filePath: string): boolean {
	return fs.existsSync(filePath);
}

function moduleFolder(moduleNumber: number): string {
	return `module${String(moduleNumber).padStart(2, "0")}`;
}

function validatePremiumSvgLayout(svgPublicPath: string, moduleNumber: number): Check[] {
	const svgPath = path.join(ROOT, "public", svgPublicPath);
	if (!exists(svgPath)) {
		return [];
	}

	const svg = read(svgPath);
	const checks: Check[] = [];

	checks.push({
		ok: /viewBox\s*=\s*["']0\s+0\s+1920\s+1080["']/.test(svg),
		message: `Premium SVG viewBox 1920x1080 (${path.basename(svgPath)})`,
	});

	if (svg.includes('id="card-1"')) {
		checks.push({
			ok: /<rect x="744" y="220" width="2"/.test(svg),
			message: `Column divider at x=744 (${path.basename(svgPath)})`,
		});
	}

	const hasModeBadge = />\s*[A-Za-z]+\s+mode\s*</i.test(svg);
	if (hasModeBadge) {
		const legacyBadge = /<rect[^>]*\by="(?:180|232)"[^>]*>[\s\S]{0,400}?mode\s*</i.test(svg);
		const headerBadge = /<rect[^>]*\by="122"[^>]*>[\s\S]{0,400}?mode\s*</i.test(svg);
		checks.push({
			ok: headerBadge && !legacyBadge,
			message: headerBadge && !legacyBadge
				? `Mode badge in header y=122 (${path.basename(svgPath)})`
				: `Mode badge must be in header at y=122, not y=180/y=232 (${path.basename(svgPath)})`,
		});
	}

	if (svg.includes('id="card-1"') && moduleNumber >= 4) {
		const usesForeignObject = /<foreignObject[^>]*\bx="884"/.test(svg);
		checks.push({
			ok: usesForeignObject,
			message: usesForeignObject
				? `Card bullets use foreignObject wrap (${path.basename(svgPath)})`
				: `Card bullets should use foreignObject at x=884 for text wrap (${path.basename(svgPath)})`,
		});
	}

	return checks;
}

function validateDiagramScene(
	courseId: string,
	moduleNumber: number,
	diagramIndex: 1 | 2 | 3,
	slideSuffix: "concept" | "architecture" | "application"
): Check[] {
	const folder = moduleFolder(moduleNumber);
	const scenePath = path.join(
		ROOT,
		"courses",
		courseId,
		"course",
		"remotion",
		"scenes",
		folder,
		`Module${String(moduleNumber).padStart(2, "0")}Diagram${diagramIndex}.tsx`
	);
	const checks: Check[] = [];

	if (!exists(scenePath)) {
		return [{ ok: false, message: `Missing scene: ${scenePath}` }];
	}

	const source = read(scenePath);
	const immersive = /layout\s*=\s*["']immersive["']/.test(source);
	const baseDiagram = /BaseDiagramScene/.test(source);
	const slideName = `module-${moduleNumber}-${slideSuffix}`;
	const slideRef = new RegExp(`slideName\\s*=\\s*["']${slideName}["']`).test(source);
	const premiumSvg = /-premium\.svg/.test(source);
	const animationJson = /\.animation\.json/.test(source);

	checks.push({
		ok: baseDiagram,
		message: baseDiagram ? "Uses BaseDiagramScene" : "Must use BaseDiagramScene",
	});
	checks.push({
		ok: immersive,
		message: immersive ? 'layout="immersive"' : 'Must use layout="immersive" (Module 1 standard)',
	});
	checks.push({
		ok: slideRef,
		message: slideRef ? `slideName="${slideName}"` : `Must set slideName="${slideName}"`,
	});
	checks.push({
		ok: premiumSvg,
		message: premiumSvg ? "Uses -premium.svg asset" : "SVG path should use -premium.svg suffix",
	});
	checks.push({
		ok: animationJson,
		message: animationJson ? "References .animation.json spec" : "Must reference .animation.json",
	});

	const svgMatch = source.match(/svgPath\s*=\s*["']([^"']+)["']/);
	if (svgMatch) {
		const publicSvg = path.join(ROOT, "public", svgMatch[1]);
		checks.push({
			ok: exists(publicSvg),
			message: exists(publicSvg)
				? `Public asset present: ${svgMatch[1]}`
				: `Run copySvgsToPublic - missing: public/${svgMatch[1]}`,
		});
	}

	const animMatch = source.match(/animationSpecPath\s*=\s*["']([^"']+)["']/);
	if (animMatch) {
		const publicAnim = path.join(ROOT, "public", animMatch[1]);
		checks.push({
			ok: exists(publicAnim),
			message: exists(publicAnim)
				? `Public animation spec: ${animMatch[1]}`
				: `Missing public animation spec: ${animMatch[1]}`,
		});
	}

	if (svgMatch) {
		checks.push(...validatePremiumSvgLayout(svgMatch[1], moduleNumber));
	}

	return checks;
}

function validateModule(courseId: string, moduleNumber: number, strict: boolean): Check[] {
	const folder = moduleFolder(moduleNumber);
	const checks: Check[] = [];
	const scenesDir = path.join(ROOT, "courses", courseId, "course", "remotion", "scenes", folder);
	const expectedScenes = ["Intro", "Diagram1", "Diagram2", "Diagram3", "Recap"];
	const prefix = `Module${String(moduleNumber).padStart(2, "0")}`;

	for (const scene of expectedScenes) {
		const file = path.join(scenesDir, `${prefix}${scene}.tsx`);
		checks.push({
			ok: exists(file),
			message: exists(file) ? `Scene ${prefix}${scene}.tsx` : `Missing ${prefix}${scene}.tsx`,
		});
	}

	checks.push({
		ok: exists(path.join(ROOT, "courses", courseId, "timings", `module${moduleNumber}.json`)),
		message: `Timings file module${moduleNumber}.json`,
	});

	const moduleTsx = path.join(ROOT, "src", "videos", `Module${moduleNumber}.tsx`);
	checks.push({
		ok: exists(moduleTsx),
		message: exists(moduleTsx) ? `Generated Module${moduleNumber}.tsx` : `Missing src/videos/Module${moduleNumber}.tsx`,
	});

	if (exists(moduleTsx)) {
		const wrapper = read(moduleTsx);
		const recapBlockMatch = wrapper.match(
			/Module01Recap - module1-module-1-recap[\s\S]*?durationInFrames=\{(\d+)\}/
		);
		if (moduleNumber === 1 && recapBlockMatch) {
			const recapFrames = Number(recapBlockMatch[1]);
			const minRecap = segmentDurationFrames(57.2, true, true);
			checks.push({
				ok: recapFrames >= minRecap,
				message: `Recap tail buffer: ${recapFrames} frames (min ${minRecap})`,
			});
		}
	}

	const rootTsx = path.join(ROOT, "src", "Root.tsx");
	if (exists(rootTsx) && exists(moduleTsx) && moduleNumber === 1) {
		const wrapper = read(moduleTsx);
		const root = read(rootTsx);
		const rootDurMatch = root.match(/id="module-1"[\s\S]*?durationInFrames=\{(\d+)\}/);
		const lastSeqMatch = wrapper.match(
			/Module01Recap - module1-module-1-recap[\s\S]*?from=\{(\d+)\}[\s\S]*?durationInFrames=\{(\d+)\}/
		);
		if (rootDurMatch && lastSeqMatch) {
			const expected = Number(lastSeqMatch[1]) + Number(lastSeqMatch[2]);
			const actual = Number(rootDurMatch[1]);
			checks.push({
				ok: actual === expected,
				message: `Root duration ${actual} matches last frame ${expected}`,
			});
		}
	}

	checks.push(
		...validateDiagramScene(courseId, moduleNumber, 1, "concept"),
		...validateDiagramScene(courseId, moduleNumber, 2, "architecture"),
		...validateDiagramScene(courseId, moduleNumber, 3, "application")
	);

	if (strict) {
		return checks;
	}
	return checks;
}

function main(): void {
	const courseId = process.argv[2] ?? SCENE_MODULE_BENCHMARK.courseId;
	const moduleNumber = Number(process.argv[3] ?? SCENE_MODULE_BENCHMARK.moduleNumber);
	const strict =
		moduleNumber === SCENE_MODULE_BENCHMARK.moduleNumber &&
		courseId === SCENE_MODULE_BENCHMARK.courseId;

	if (!Number.isFinite(moduleNumber) || moduleNumber < 1) {
		console.error("Usage: npx tsx scripts/validateCourseBenchmark.ts <courseId> <moduleNumber>");
		process.exit(1);
	}

	console.log(`\nBenchmark: ${SCENE_MODULE_BENCHMARK.courseId} module ${SCENE_MODULE_BENCHMARK.moduleNumber}`);
	console.log(`Checking:  ${courseId} module ${moduleNumber}${strict ? " (strict)" : ""}\n`);

	const checks = validateModule(courseId, moduleNumber, strict);
	let failed = 0;

	for (const check of checks) {
		const tag = check.ok ? "ok" : "FAIL";
		console.log(`  [${tag}] ${check.message}`);
		if (!check.ok) failed++;
	}

	console.log(`\n${checks.length - failed}/${checks.length} checks passed`);

	if (strict && failed > 0) {
		console.error("\nBenchmark module must pass all checks. See courses/BENCHMARK.md");
		process.exit(1);
	}

	if (failed > 0) {
		console.log("\nSome checks failed. Upgrade this module to match courses/BENCHMARK.md");
		process.exit(strict ? 1 : 0);
	}

	console.log("\nModule matches the scene course benchmark.");
}

main();
