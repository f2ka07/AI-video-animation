// Generate audio for all modules from moduleContent.ts
// This reads from moduleContent.ts instead of slideScripts.ts

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { UnifiedVoiceService } from "../src/utils/unifiedVoiceService";
import { injectPauseForStoryBeat } from "../src/utils/ssmlUtils";
import { saveWordTimings, generateMappingHelper } from "./saveWordTimings";
import { allModules } from "../src/videos/moduleContent";

dotenv.config({ path: path.join(__dirname, "../.env") });

/** Legacy: script as string -> scripts array */
function getScripts(slide: { script?: string; scripts?: string[] }): string[] {
	if (slide.scripts && slide.scripts.length >= 1) return slide.scripts;
	if (slide.script) return [slide.script];
	return [];
}

function isMultiAudioCodeSlide(slide: { type: string; scripts?: string[] }): boolean {
	return slide.type === "code" && slide.scripts && slide.scripts.length > 1;
}

function parseModuleRange(input: string): number[] {
	// Parse "1", "1-5", "1,3,5", or "all"
	if (input === "all" || !input) {
		return allModules.map((m) => m.moduleNumber);
	}

	const modules: number[] = [];
	const parts = input.split(",");

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed.includes("-")) {
			// Range like "1-5"
			const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
			if (isNaN(start) || isNaN(end)) {
				throw new Error(`Invalid range: ${trimmed}`);
			}
			for (let i = start; i <= end; i++) {
				modules.push(i);
			}
		} else {
			// Single number
			const num = parseInt(trimmed);
			if (isNaN(num)) {
				throw new Error(`Invalid module number: ${trimmed}`);
			}
			modules.push(num);
		}
	}

	return [...new Set(modules)].sort((a, b) => a - b);
}

async function generateAllAudio(
	moduleRange?: string,
	voice?: string,
	provider?: "runpod" | "minimax" | "elevenlabs" | "openai"
) {
	const apiKey =
		process.env.OPENAI_API_KEY ||
		process.env.RESEMBLE_API_KEY ||
		process.env.MINIMAX_API_KEY ||
		process.env.RUNPOD_API_KEY ||
		process.env.API_KEY;

	if (!apiKey) {
		throw new Error("API key environment variable is required");
	}

	const voiceService = new UnifiedVoiceService();
	const selectedProvider = provider;
	const selectedVoice = voice || "andy";
	const baseOutputDir = path.join(__dirname, "../public/audio");

	if (selectedProvider) {
		console.log(`[Config] Provider: ${selectedProvider} (strict mode - no fallback)`);
	}

	let modulesToProcess = allModules;
	if (moduleRange) {
		try {
			const moduleNumbers = parseModuleRange(moduleRange);
			modulesToProcess = allModules.filter((m) => moduleNumbers.includes(m.moduleNumber));
			if (modulesToProcess.length === 0) {
				throw new Error(`No modules found for: ${moduleRange}`);
			}
		} catch (error: any) {
			console.error(`Error: ${error.message}`);
			console.error("\nUsage:");
			console.error("  tsx scripts/generateAudioFromContent.ts [module-range] [voice] [provider]");
			process.exit(1);
		}
	}

	console.log(`Generating audio for ${modulesToProcess.length} module(s)...\n`);

	let totalGenerated = 0;
	let totalSkipped = 0;
	const failedSlides: string[] = [];

	for (const module of modulesToProcess) {
		console.log(`\n=== Module ${module.moduleNumber}: ${module.title} ===`);
		console.log(`Processing ${module.slides.length} slides...\n`);

		// Create course-specific output directory
		const courseId = module.courseId || 'default';
		const outputDir = path.join(baseOutputDir, courseId);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
			console.log(`Created audio directory: ${outputDir}`);
		}

		for (const slide of module.slides) {
			const scripts = getScripts(slide);

			if (isMultiAudioCodeSlide(slide)) {
				for (let i = 0; i < slide.scripts!.length; i++) {
					const chunkNum = i + 1;
					const audioFileName = `module${module.moduleNumber}-${slide.name}-${chunkNum}`;
					const outputPath = path.join(outputDir, `${audioFileName}.wav`);

					if (fs.existsSync(outputPath)) {
						const stats = fs.statSync(outputPath);
						if (stats.size > 0) {
							console.log(`  Skipping ${audioFileName} (already exists)`);
							totalSkipped++;
							continue;
						}
					}

					console.log(`Generating: ${audioFileName}`);
					const scriptChunk = injectPauseForStoryBeat(slide.scripts![i], slide);
					console.log(`  Script: ${scriptChunk.substring(0, 60)}...`);

					try {
						const result = await voiceService.generateAudio({
							prompt: scriptChunk,
							voice: selectedVoice,
							format: "wav",
							provider: selectedProvider,
						});

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

						console.log(`  Completed: ${audioFileName} (${result.serviceUsed})\n`);
						totalGenerated++;
					} catch (error) {
						console.error(`  Failed for ${audioFileName}:`, error);
						failedSlides.push(`${audioFileName}: ${error}`);
					}
				}
				continue;
			}

			const audioFileName = `module${module.moduleNumber}-${slide.name}`;
			const outputPath = path.join(outputDir, `${audioFileName}.wav`);

			if (fs.existsSync(outputPath)) {
				const stats = fs.statSync(outputPath);
				if (stats.size > 0) {
					console.log(`  Skipping ${audioFileName} (already exists, ${(stats.size / 1024).toFixed(1)}KB)`);
					totalSkipped++;
					continue;
				}
			}

			console.log(`Generating: ${audioFileName}`);
			const script = injectPauseForStoryBeat(scripts[0] || "", slide);
			console.log(`  Script: ${script.substring(0, 80)}...`);

			try {
				const result = await voiceService.generateAudio({
					prompt: script,
					voice: selectedVoice,
					format: "wav",
					provider: selectedProvider,
				});

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

				if (result.words && result.words.length > 0) {
					saveWordTimings(slide.name, result.words);
					generateMappingHelper(slide.name, result.words);
				}

				console.log(`  Completed: ${slide.name} (${result.serviceUsed})\n`);
				totalGenerated++;
			} catch (error) {
				console.error(`  Failed for ${slide.name}:`, error);
				failedSlides.push(`${audioFileName}: ${error}`);
			}
		}
	}

	console.log("\nAudio generation complete!");
	console.log(`   Generated: ${totalGenerated} files`);
	console.log(`   Skipped: ${totalSkipped} files (already exist)`);
	if (failedSlides.length > 0) {
		console.log(`   Failed: ${failedSlides.length} (run again to generate only remaining)`);
		failedSlides.forEach((f) => console.log(`      - ${f}`));
		process.exitCode = 1;
	}
}

const moduleRange = process.argv[2];
const voice = process.argv[3];
const provider = process.argv[4] as "runpod" | "minimax" | "elevenlabs" | "openai" | undefined;
generateAllAudio(moduleRange, voice, provider).catch(console.error);
