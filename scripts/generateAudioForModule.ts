// Generate audio for any module (not just module1)
// Usage: tsx scripts/generateAudioForModule.ts module2

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { UnifiedVoiceService } from "../src/utils/unifiedVoiceService";
import { saveWordTimings, generateMappingHelper } from "./saveWordTimings";

dotenv.config({ path: path.join(__dirname, "../.env") });

async function generateModuleAudio(moduleNumber: number) {
	// UnifiedVoiceService automatically selects the best service based on audio length
	// and falls back to alternatives if needed
	const voiceService = new UnifiedVoiceService();

	// Read scripts from slideScripts.ts
	const scriptsPath = path.join(__dirname, "../src/videos/slideScripts.ts");
	const content = fs.readFileSync(scriptsPath, "utf-8");

	// Extract module scripts
	const moduleName = `module${moduleNumber}`;
	const regex = new RegExp(`export const ${moduleName}Scripts = \\{([^}]+)\\};`, "s");
	const match = content.match(regex);

	if (!match) {
		throw new Error(`Module ${moduleNumber} scripts not found in slideScripts.ts`);
	}

	const scriptsContent = match[1];
	const scripts: Record<string, string> = {};
	const scriptRegex = /(\w+):\s*"([^"]+)"/g;
	let scriptMatch;
	while ((scriptMatch = scriptRegex.exec(scriptsContent)) !== null) {
		scripts[scriptMatch[1]] = scriptMatch[2];
	}

	console.log(`Generating audio for Module ${moduleNumber}...`);
	console.log(`Found ${Object.keys(scripts).length} slides\n`);
	const outputDir = path.join(__dirname, "../public/audio");

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

		for (const [slideName, script] of Object.entries(scripts)) {
		console.log(`Generating: module${moduleNumber}-${slideName}`);
		try {
			const result = await voiceService.generateAudio({
				prompt: script,
				voice: "andy",
				format: "wav",
			});

			console.log(`   Service used: ${result.serviceUsed}`);

			const outputPath = path.join(outputDir, `module${moduleNumber}-${slideName}.wav`);

			if (result.audioData) {
				const base64 = result.audioData.includes(",") ? result.audioData.split(",")[1] : result.audioData;
				fs.writeFileSync(outputPath, Buffer.from(base64, "base64"));
			} else if (result.audioUrl) {
				const response = await fetch(result.audioUrl);
				const buffer = await response.arrayBuffer();
				fs.writeFileSync(outputPath, Buffer.from(buffer));
			}

			if (result.words && result.words.length > 0) {
				saveWordTimings(slideName, result.words);
				generateMappingHelper(slideName, result.words);
			}

			console.log(`✓ Completed: ${slideName} (${result.serviceUsed})\n`);
		} catch (error) {
			console.error(`✗ Failed for ${slideName}:`, error);
		}
	}

	console.log(`✅ Module ${moduleNumber} audio generation complete!`);
}

// Get module number from command line
const moduleNumber = parseInt(process.argv[2], 10);
if (Number.isNaN(moduleNumber)) {
	console.error("Usage: tsx scripts/generateAudioForModule.ts <moduleNumber>");
	console.error("Example: tsx scripts/generateAudioForModule.ts 2");
	process.exit(1);
}

generateModuleAudio(moduleNumber).catch(console.error);
