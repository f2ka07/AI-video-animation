// Auto-generate ModuleX.tsx and ModuleXConfig.ts from content scripts
// This allows full automation: just add content, run script, get modules

import * as fs from "fs";
import * as path from "path";

interface ModuleContent {
	moduleNumber: number;
	title: string;
	subtitle: string;
	slides: Array<{
		name: string;
		type: "title" | "content-two-card" | "content-single" | "code" | "comparison";
		title: string;
		points?: string[];
		code?: string;
		language?: string;
		leftItems?: string[];
		rightItems?: string[];
		leftTitle?: string;
		rightTitle?: string;
		imageSrc?: string;
	}>;
}

// Read all module scripts from slideScripts.ts
function extractModuleScripts(): Record<string, Record<string, string>> {
	const scriptsPath = path.join(__dirname, "../src/videos/slideScripts.ts");
	if (!fs.existsSync(scriptsPath)) {
		throw new Error(`slideScripts.ts not found at ${scriptsPath}`);
	}

	const content = fs.readFileSync(scriptsPath, "utf-8");
	const modules: Record<string, Record<string, string>> = {};

	// Extract module1Scripts, module2Scripts, etc.
	const moduleRegex = /export const (module\d+)Scripts = \{([^}]+)\};/gs;
	let match;
	while ((match = moduleRegex.exec(content)) !== null) {
		const moduleName = match[1];
		const scriptsContent = match[2];
		const scripts: Record<string, string> = {};

		// Extract individual script entries
		const scriptRegex = /(\w+):\s*"([^"]+)"/g;
		let scriptMatch;
		while ((scriptMatch = scriptRegex.exec(scriptsContent)) !== null) {
			scripts[scriptMatch[1]] = scriptMatch[2];
		}

		modules[moduleName] = scripts;
	}

	return modules;
}

// Generate ModuleXConfig.ts
function generateModuleConfig(moduleNumber: number, slideNames: string[]): string {
	const audioDurations = slideNames
		.map((name) => `\tgetAudioDuration("module${moduleNumber}-${name}")`)
		.join(",\n");

	return `// Configuration for Module ${moduleNumber} video
// Auto-generated from content scripts

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
${audioDurations}
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module${moduleNumber}Config = {
	id: "module-${moduleNumber}",
	title: "Module ${moduleNumber}: [TITLE]",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
`;
}

// Generate ModuleX.tsx from content
function generateModuleFile(moduleNumber: number, content: ModuleContent): string {
	const slideNames = content.slides.map((s) => s.name);
	const audioFiles = slideNames
		.map((name) => `\t\t${name}: staticFile("audio/module${moduleNumber}-${name}.wav"),`)
		.join("\n");

	const audioDurations = slideNames
		.map((name) => `\t\t${name}: getAudioDuration("module${moduleNumber}-${name}"),`)
		.join("\n");

	const slideTimings = slideNames
		.map((name, index) => {
			const isLast = index === slideNames.length - 1;
			const buffer = isLast ? ", true, 0.5" : "";
			return `\tconst ${name}Slide = addSlide(audioDurations.${name}${buffer});`;
		})
		.join("\n");

	// Generate slide sequences
	const sequences = content.slides
		.map((slide, index) => {
			const isFirst = index === 0;
			const isLast = index === content.slides.length - 1;
			const slideVar = `${slide.name}Slide`;

			let slideComponent = "";
			switch (slide.type) {
				case "title":
					slideComponent = `<TitleSlide title="${slide.title}" subtitle="${content.subtitle}" />`;
					break;
			case "content-two-card":
				const points = slide.points?.map((p) => `"${p}"`).join(",\n\t\t\t\t\t") || "";
				slideComponent = `<AnimatedContentSlide
\t\t\t\t\ttitle="${slide.title}"
\t\t\t\t\tpoints={[
\t\t\t\t\t\t${points}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\timageSrc="${slide.imageSrc || ""}"
\t\t\t\t\taudioDuration={audioDurations.${slide.name}}
\t\t\t\t/>`;
				break;
			case "content-single":
				const pointsSingle = slide.points?.map((p) => `"${p}"`).join(",\n\t\t\t\t\t") || "";
				slideComponent = `<AnimatedContentSlide
\t\t\t\t\ttitle="${slide.title}"
\t\t\t\t\tpoints={[
\t\t\t\t\t\t${pointsSingle}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioDuration={audioDurations.${slide.name}}
\t\t\t\t/>`;
				break;
				case "code":
					slideComponent = `<AnimatedCodeSlide
\t\t\t\t\ttitle="${slide.title}"
\t\t\t\t\tcode={\`${slide.code?.replace(/`/g, "\\`") || ""}\`}
\t\t\t\t\tlanguage="${slide.language || "typescript"}"
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\taudioStartFrame={${slideVar}.start}
\t\t\t\tmoduleNumber={${moduleNumber}}
\t\t\t\taudioDuration={audioDurations["${slide.name}"]}
\t\t\t/>`;
				break;
		case "comparison":
				const leftItems = slide.leftItems?.map((i) => `"${i}"`).join(",\n\t\t\t\t\t\t") || "";
				const rightItems = slide.rightItems?.map((i) => `"${i}"`).join(",\n\t\t\t\t\t\t") || "";
				slideComponent = `<AnimatedComparisonSlide
\t\t\t\t\ttitle="${slide.title}"
\t\t\t\t\tleftTitle="${slide.leftTitle || ""}"
\t\t\t\t\tleftItems={[
\t\t\t\t\t\t${leftItems}
\t\t\t\t\t]}
\t\t\t\t\trightTitle="${slide.rightTitle || ""}"
\t\t\t\t\trightItems={[
\t\t\t\t\t\t${rightItems}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioDuration={audioDurations.${slide.name}}
\t\t\t/>`;
				break;
			}

			const fadeOut = isLast ? "fadeOutDuration={0}" : `fadeOutDuration={crossFadeDuration}`;
			const fadeIn = isFirst ? "fadeInDuration={0.5}" : `fadeInDuration={crossFadeDuration}`;
			const durationProp = isLast ? "durationInFrames={summarySlide.duration}" : `durationInFrames={${slideVar}.audioDuration * fps}`;
			const totalDurationProp = isLast ? "totalDuration={summarySlide.slideDuration}" : `totalDuration={${slideVar}.audioDuration}`;

			return `\t\t\t{/* ${slide.title} */}
\t\t\t<Sequence
\t\t\t\tfrom={${slideVar}.start}
\t\t\t\t${durationProp}
\t\t\t>
\t\t\t\t<Audio src={audioFiles.${slide.name}} />
\t\t\t\t<CrossFadeWrapper
\t\t\t\t\t${totalDurationProp}
\t\t\t\t\t${fadeIn}
\t\t\t\t\t${fadeOut}
\t\t\t>
\t\t\t\t\t${slideComponent}
\t\t\t\t</CrossFadeWrapper>
\t\t\t</Sequence>
${isLast ? "" : `\t\t\t{/* Whoosh transition */}
\t\t\t<Sequence
\t\t\t\tfrom={${slideVar}.start + ${slideVar}.audioDuration * fps}
\t\t\t\tdurationInFrames={whooshDuration * fps}
\t\t\t>
\t\t\t\t<Audio src={audioFiles.whoosh} startFrom={0} />
\t\t\t</Sequence>
`}`;
		})
		.join("\n");

	return `import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { getAudioDuration } from "../utils/audioDuration";

export const Module${moduleNumber}: React.FC = () => {
\tconst { fps } = useVideoConfig();
\tconst crossFadeDuration = 0.3;
\tconst whooshDuration = 0.57;

\tconst audioFiles = {
${audioFiles}
\t\twhoosh: staticFile("audio/whoosh.wav"),
\t};

\tconst audioDurations = {
${audioDurations}
\t};

\tlet currentFrame = 0;

\tconst addSlide = (audioDuration: number, isLast: boolean = false, buffer: number = 0) => {
\t\tconst slideDuration = audioDuration + buffer;
\t\tconst start = currentFrame;
\t\tif (!isLast) {
\t\t\tcurrentFrame += (slideDuration + whooshDuration) * fps;
\t\t} else {
\t\t\tcurrentFrame += slideDuration * fps;
\t\t}
\t\treturn { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
\t};

${slideTimings}

\treturn (
\t\t<div
\t\t\tstyle={{
\t\t\t\twidth: "100%",
\t\t\t\theight: "100%",
\t\t\t\tbackground: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
\t\t\t\tposition: "relative",
\t\t\t}}
\t\t>
${sequences}
\t\t</div>
\t);
};
`;
}

// Main function
function main() {
	console.log("Generating module files from content scripts...\n");

	const modules = extractModuleScripts();
	console.log(`Found ${Object.keys(modules).length} modules in slideScripts.ts\n`);

	for (const [moduleName, scripts] of Object.entries(modules)) {
		const moduleNumber = parseInt(moduleName.replace("module", ""));
		const slideNames = Object.keys(scripts);

		console.log(`Generating Module ${moduleNumber}...`);
		console.log(`  Slides: ${slideNames.join(", ")}`);

		// Generate config file
		const configPath = path.join(__dirname, `../src/videos/Module${moduleNumber}Config.ts`);
		const configContent = generateModuleConfig(moduleNumber, slideNames);
		fs.writeFileSync(configPath, configContent);
		console.log(`  ✓ Created ${configPath}`);

		// Note: ModuleX.tsx generation requires content structure
		// For now, this is a template - full automation would need content metadata
		console.log(`  ⚠ Module${moduleNumber}.tsx needs manual content structure`);
		console.log(`     Use MODULE_TEMPLATE_GUIDE.md as reference\n`);
	}

	console.log("✅ Module config files generated!");
	console.log("\nNext steps:");
	console.log("1. Add content structure to generate ModuleX.tsx automatically");
	console.log("2. Or manually create ModuleX.tsx using the template");
}

main();
