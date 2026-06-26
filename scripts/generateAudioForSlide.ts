// Generate audio for a single slide
// Usage: tsx scripts/generateAudioForSlide.ts <moduleNumber> <slideName>

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { UnifiedVoiceService } from "../src/utils/unifiedVoiceService";
import { saveWordTimings, generateMappingHelper } from "./saveWordTimings";
import { allModules } from "../src/videos/moduleContent";

dotenv.config({ path: path.join(__dirname, "../.env") });

async function generateSlideAudio(moduleNumber: number, slideName: string, voice?: string, provider?: "runpod" | "minimax" | "elevenlabs") {
	// UnifiedVoiceService automatically selects the best service based on audio length
	// and falls back to alternatives if needed (RunPod for ≤10s, Minimax for >10s)
	// If provider is specified, it will be used as the preferred service
	const voiceService = new UnifiedVoiceService();

	// Find the module and slide
	const module = allModules.find(m => m.moduleNumber === moduleNumber);
	if (!module) {
		throw new Error(`Module ${moduleNumber} not found`);
	}

	const slide = module.slides.find(s => s.name === slideName || slideName.startsWith(s.name + "-"));
	if (!slide) {
		throw new Error(`Slide "${slideName}" not found in Module ${moduleNumber}`);
	}

	const scripts = (slide.scripts && slide.scripts.length >= 1) ? slide.scripts : (slide.script ? [slide.script] : []);
	const chunkMatch = slideName.match(/^(.+)-(\d+)$/);
	const baseName = slide.name;
	const chunkIndex = chunkMatch && chunkMatch[1] === baseName ? parseInt(chunkMatch[2]) - 1 : -1;

	let scriptToUse: string;
	let audioFileName: string;
	if (slide.type === "code" && scripts.length > 1) {
		if (chunkIndex >= 0 && chunkIndex < scripts.length) {
			scriptToUse = scripts[chunkIndex];
			audioFileName = `module${moduleNumber}-${baseName}-${chunkIndex + 1}`;
		} else {
			throw new Error(`Multi-audio slide "${baseName}" requires chunk suffix -1, -2, etc. (e.g. ${baseName}-1)`);
		}
	} else {
		scriptToUse = scripts[0] || "";
		audioFileName = `module${moduleNumber}-${baseName}`;
	}

	console.log(`Generating audio for Module ${moduleNumber}, Slide: ${slideName}`);
	console.log(`Script: ${scriptToUse.substring(0, 80)}...\n`);

	const courseId = module.courseId || 'default';
	const outputDir = path.join(__dirname, "../public/audio", courseId);

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const outputPath = path.join(outputDir, `${audioFileName}.wav`);

	const force = process.argv.includes('--force');
	const finalVoice = voice || 'andy';

	if (!force && fs.existsSync(outputPath)) {
		const stats = fs.statSync(outputPath);
		if (stats.size > 0) {
			console.log(`Audio file already exists (${(stats.size / 1024).toFixed(1)}KB). Use --force to regenerate`);
			return;
		}
	}

	try {
		const result = await voiceService.generateAudio({
			prompt: scriptToUse,
			voice: finalVoice,
			format: "wav",
			provider: provider,
		});

		console.log(`   Service used: ${result.serviceUsed}`);

		if (result.audioData) {
			const base64 = result.audioData.includes(",") ? result.audioData.split(",")[1] : result.audioData;
			fs.writeFileSync(outputPath, Buffer.from(base64, "base64"));
		} else if (result.audioUrl) {
			const response = await fetch(result.audioUrl);
			const buffer = await response.arrayBuffer();
			fs.writeFileSync(outputPath, Buffer.from(buffer));
		} else {
			throw new Error("No audio data or URL returned");
		}

		if (result.words && result.words.length > 0 && chunkIndex < 0) {
			saveWordTimings(baseName, result.words);
			generateMappingHelper(baseName, result.words);
		}

		const stats = fs.statSync(outputPath);
		console.log(`✅ Completed: ${audioFileName}.wav (${(stats.size / 1024).toFixed(1)}KB, ${result.serviceUsed})`);
	} catch (error: any) {
		console.error(`✗ Failed:`, error.message);
		throw error;
	}
}

// Get arguments from command line
const moduleNumber = parseInt(process.argv[2], 10);
const slideName = process.argv[3];
// Voice is 4th arg, but check if it's a flag
const voiceArg = process.argv[4];
const voice = voiceArg && !voiceArg.startsWith('--') ? voiceArg : undefined;
// Provider is 5th arg
const providerArg = process.argv[5];
const provider = providerArg && !providerArg.startsWith('--') 
	? providerArg as "runpod" | "minimax" | "elevenlabs" 
	: undefined;
const force = process.argv.includes('--force');

if (Number.isNaN(moduleNumber) || !slideName) {
	console.error("Usage: tsx scripts/generateAudioForSlide.ts <moduleNumber> <slideName> [voice] [provider] [--force]");
	process.exit(1);
}

generateSlideAudio(moduleNumber, slideName, voice, provider).catch((error) => {
	console.error(error);
	process.exit(1);
});
