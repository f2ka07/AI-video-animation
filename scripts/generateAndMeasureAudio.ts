// Generate audio segments and measure durations in alternating workflow
// For each slide: generate audio (if needed) -> measure duration -> update config
// Run with: npm run generate-and-measure [module-range] [voice] [provider]
// Provider options: runpod, minimax, elevenlabs, openai
// When provider is specified, NO FALLBACK to other providers (for voice consistency)

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { UnifiedVoiceService } from "../src/utils/unifiedVoiceService";
import { saveWordTimings, generateMappingHelper } from "./saveWordTimings";
import { allModules } from "../src/videos/moduleContent";

dotenv.config({ path: path.join(__dirname, "../.env") });

function getScripts(slide: { script?: string; scripts?: string[] }): string[] {
	if (slide.scripts && slide.scripts.length >= 1) return slide.scripts;
	if (slide.script) return [slide.script];
	return [];
}

function isMultiAudioCodeSlide(slide: { type: string; scripts?: string[] }): boolean {
	return slide.type === "code" && slide.scripts && slide.scripts.length > 1;
}

interface AudioMeasurement {
	name: string;
	duration: number;
}

function parseModuleRange(input: string): number[] {
	if (input === "all" || !input) {
		return allModules.map((m) => m.moduleNumber);
	}

	const modules: number[] = [];
	const parts = input.split(",");

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed.includes("-")) {
			const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
			if (isNaN(start) || isNaN(end)) {
				throw new Error(`Invalid range: ${trimmed}`);
			}
			for (let i = start; i <= end; i++) {
				modules.push(i);
			}
		} else {
			const num = parseInt(trimmed);
			if (isNaN(num)) {
				throw new Error(`Invalid module number: ${trimmed}`);
			}
			modules.push(num);
		}
	}

	return [...new Set(modules)].sort((a, b) => a - b);
}

async function parseWavDuration(filePath: string): Promise<number | null> {
	// Dynamic import for ESM-only package
	const { parseFile } = await import("music-metadata");
	try {
		const metadata = await parseFile(filePath);
		const duration = metadata.format.duration;
		
		if (duration && isFinite(duration) && duration > 0) {
			return Math.round(duration * 100) / 100;
		}
		
		return null;
	} catch (error) {
		return null;
	}
}

function updateAudioDurationFile(measurements: AudioMeasurement[]) {
	const configPath = path.join(__dirname, "../src/utils/audioDuration.ts");
	
	if (!fs.existsSync(configPath)) {
		// Create file if it doesn't exist
		const durationsObject = measurements
			.map(m => `\t"${m.name}": ${m.duration},`)
			.join("\n");
		const content = `// Utility to get audio duration from files
// This will be used to dynamically adjust slide durations based on actual audio length

export interface AudioInfo {
	path: string;
	duration: number; // in seconds
}

// Audio durations in seconds - measured from actual audio files
export const audioDurations: Record<string, number> = {
${durationsObject}
};

export function getAudioDuration(audioFileName: string): number {
	const duration = audioDurations[audioFileName];
	if (duration === undefined) {
		throw new Error(
			\`Audio duration not found for "\${audioFileName}". Run: npm run measure-actual-audio\`
		);
	}
	return duration;
}

export function calculateSlideDuration(
	audioDuration: number,
	transitionDuration: number = 1
): number {
	return audioDuration + transitionDuration;
}
`;
		fs.writeFileSync(configPath, content);
		return;
	}
	
	let currentContent = fs.readFileSync(configPath, "utf-8");
	
	// Sort measurements by name for consistency
	const sortedMeasurements = [...measurements].sort((a, b) => a.name.localeCompare(b.name));
	
	const durationsObject = sortedMeasurements
		.map(m => `\t"${m.name}": ${m.duration},`)
		.join("\n");
	
	const regex = /export const audioDurations: Record<string, number> = \{[\s\S]*?\};/;
	
	if (!regex.test(currentContent)) {
		throw new Error("Could not find audioDurations object in config file");
	}
	
	const newContent = currentContent.replace(
		regex,
		`export const audioDurations: Record<string, number> = {\n${durationsObject}\n};`
	);
	
	fs.writeFileSync(configPath, newContent);
}

async function generateAndMeasureAudio(moduleRange?: string, voice?: string, provider?: string) {
	// When provider is specified, UnifiedVoiceService uses ONLY that provider (no fallback)
	// This maintains voice consistency across all audio files
	const voiceService = new UnifiedVoiceService();
	const selectedProvider = provider as "runpod" | "minimax" | "elevenlabs" | "openai" | undefined;
	
	if (selectedProvider) {
		console.log(`[Config] Provider: ${selectedProvider} (strict mode - no fallback)`);
	} else {
		console.log(`[Config] Provider: auto-select with fallback`);
	}
	const baseOutputDir = path.join(__dirname, "../public/audio");

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
			console.error("  tsx scripts/generateAndMeasureAudio.ts [module-range] [voice]");
			console.error("\nExamples:");
			console.error("  tsx scripts/generateAndMeasureAudio.ts 1        # Module 1 only");
			console.error("  tsx scripts/generateAndMeasureAudio.ts 1-3     # Modules 1, 2, 3");
			console.error("  tsx scripts/generateAndMeasureAudio.ts 1,3,5  # Modules 1, 3, 5");
			console.error("  tsx scripts/generateAndMeasureAudio.ts all     # All modules (default)");
			process.exit(1);
		}
	}

	console.log(`Processing ${modulesToProcess.length} module(s) with alternating generate/measure workflow...\n`);

	let totalGenerated = 0;
	let totalMeasured = 0;
	let totalSkipped = 0;
	const failedSlides: string[] = [];
	const allMeasurements: AudioMeasurement[] = [];

	// Load existing measurements to preserve them
	const configPath = path.join(__dirname, "../src/utils/audioDuration.ts");
	if (fs.existsSync(configPath)) {
		try {
			const content = fs.readFileSync(configPath, "utf-8");
			const match = content.match(/export const audioDurations: Record<string, number> = \{([\s\S]*?)\};/);
			if (match) {
				const existingEntries = match[1].trim();
				const entries = existingEntries.split("\n").filter(line => line.trim());
				for (const entry of entries) {
					// Remove comments from line (everything after //)
					const cleanEntry = entry.split('//')[0].trim();
					const nameMatch = cleanEntry.match(/"([^"]+)":\s*([\d.]+)/);
					if (nameMatch) {
						const duration = parseFloat(nameMatch[2]);
						if (!isNaN(duration)) {
							allMeasurements.push({
								name: nameMatch[1],
								duration: duration
							});
						}
					}
				}
			}
		} catch (error) {
			console.warn(`Warning: Could not load existing measurements: ${error}`);
		}
	}

	for (const module of modulesToProcess) {
		console.log(`\n=== Module ${module.moduleNumber}: ${module.title} ===`);
		console.log(`Processing ${module.slides.length} slides...\n`);

		// Create course-specific output directory
		const courseId = module.courseId || 'default';
		const outputDir = path.join(baseOutputDir, courseId);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		for (const slide of module.slides) {
			const scripts = getScripts(slide);

			if (isMultiAudioCodeSlide(slide)) {
				for (let i = 0; i < slide.scripts!.length; i++) {
					const chunkNum = i + 1;
					const audioFileName = `module${module.moduleNumber}-${slide.name}-${chunkNum}`;
					const audioKey = `${courseId}/${audioFileName}`;
					const outputPath = path.join(outputDir, `${audioFileName}.wav`);

					let needsGeneration = !fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0;
					const needsMeasurement = needsGeneration || !allMeasurements.find(m => m.name === audioKey)?.duration;

					if (needsGeneration) {
						console.log(`[GENERATE] ${audioFileName}`);
						console.log(`   Script: ${slide.scripts![i].substring(0, 60)}...`);
						try {
							const result = await voiceService.generateAudio({
								prompt: slide.scripts![i],
								voice: voice || "andy",
								format: "wav",
								provider: selectedProvider,
							});
							if (result.audioData) {
								const base64 = result.audioData.includes(",") ? result.audioData.split(",")[1] : result.audioData;
								fs.writeFileSync(outputPath, Buffer.from(base64, "base64"));
							} else if (result.audioUrl) {
								const resp = await fetch(result.audioUrl);
								fs.writeFileSync(outputPath, Buffer.from(await resp.arrayBuffer()));
							} else throw new Error("No audio data or URL returned");
							console.log(`   Generated (${result.serviceUsed})`);
							totalGenerated++;
						} catch (error) {
							console.error(`   Failed: ${error}`);
							failedSlides.push(`${audioFileName}: ${error}`);
							// Continue with next slide so user can run again for remaining
						}
					} else {
						console.log(`[SKIP GENERATE] ${audioFileName} (exists)`);
					}

					if ((needsMeasurement || needsGeneration) && fs.existsSync(outputPath)) {
						const duration = await parseWavDuration(outputPath) ?? 10;
						const idx = allMeasurements.findIndex(m => m.name === audioKey);
						if (idx >= 0) allMeasurements[idx].duration = duration;
						else allMeasurements.push({ name: audioKey, duration });
						updateAudioDurationFile(allMeasurements);
						totalMeasured++;
						console.log(`[MEASURE] ${audioFileName}: ${duration}s`);
					} else {
						totalSkipped++;
					}
					console.log("");
				}
				continue;
			}

			const audioFileName = `module${module.moduleNumber}-${slide.name}`;
			const audioKey = `${courseId}/${audioFileName}`;
			const outputPath = path.join(outputDir, `${audioFileName}.wav`);
			const script = scripts[0] || "";

			let needsGeneration = !fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0;
			const needsMeasurement = needsGeneration || !allMeasurements.find(m => m.name === audioKey)?.duration;

			if (needsGeneration) {
				console.log(`[GENERATE] ${audioFileName}`);
				console.log(`   Script: ${script.substring(0, 80)}...`);
				try {
					const result = await voiceService.generateAudio({
						prompt: script,
						voice: voice || "andy",
						format: "wav",
						provider: selectedProvider,
					});
					if (result.audioData) {
						const base64 = result.audioData.includes(",") ? result.audioData.split(",")[1] : result.audioData;
						fs.writeFileSync(outputPath, Buffer.from(base64, "base64"));
					} else if (result.audioUrl) {
						const resp = await fetch(result.audioUrl);
						fs.writeFileSync(outputPath, Buffer.from(await resp.arrayBuffer()));
					} else throw new Error("No audio data or URL returned");
					if (result.words?.length) {
						saveWordTimings(slide.name, result.words);
						generateMappingHelper(slide.name, result.words);
					}
					console.log(`   Generated (${result.serviceUsed})`);
					totalGenerated++;
				} catch (error) {
					console.error(`   Failed: ${error}`);
					failedSlides.push(`${audioFileName}: ${error}`);
					// Continue with next slide so user can run again for remaining
				}
			} else {
				console.log(`[SKIP GENERATE] ${audioFileName} (exists)`);
			}

			if ((needsMeasurement || needsGeneration) && fs.existsSync(outputPath)) {
				const duration = (await parseWavDuration(outputPath)) ?? 10;
				const idx = allMeasurements.findIndex(m => m.name === audioKey);
				if (idx >= 0) allMeasurements[idx].duration = duration;
				else allMeasurements.push({ name: audioKey, duration });
				updateAudioDurationFile(allMeasurements);
				totalMeasured++;
				console.log(`[MEASURE] ${audioFileName}: ${duration}s`);
			} else {
				totalSkipped++;
			}
			console.log("");
		}
	}

	console.log("\n=== Summary ===");
	console.log(`   Generated: ${totalGenerated} files`);
	console.log(`   Measured: ${totalMeasured} files`);
	console.log(`   Skipped: ${totalSkipped} files (already exist)`);
	if (failedSlides.length > 0) {
		console.log(`   Failed: ${failedSlides.length} (run again to generate only remaining)`);
		failedSlides.forEach((f) => console.log(`      - ${f}`));
	}
	console.log(`   Total measurements: ${allMeasurements.length}`);
	
	const totalAudio = allMeasurements.reduce((sum, m) => sum + m.duration, 0);
	const totalWithTransitions = totalAudio + (allMeasurements.length - 1) * 1;
	
	console.log(`\n   Total audio duration: ${totalAudio.toFixed(2)} seconds`);
	console.log(`   With 1s transitions: ${totalWithTransitions.toFixed(2)} seconds`);
	console.log(`   Total frames (30fps): ${Math.ceil(totalWithTransitions * 30)}`);
	console.log("\nConfiguration updated in src/utils/audioDuration.ts");
	if (failedSlides.length > 0) {
		process.exitCode = 1;
	}
}

const moduleRange = process.argv[2];
const voice = process.argv[3];
const provider = process.argv[4];
generateAndMeasureAudio(moduleRange, voice, provider).catch((error) => {
	console.error("\n✗ Fatal error:", error);
	process.exit(1);
});
