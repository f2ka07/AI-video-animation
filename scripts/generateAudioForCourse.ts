// Generate audio for course SSML files
// Supports: RunPod, MiniMax API, or manual upload preparation
//
// Usage:
//   npx tsx scripts/generateAudioForCourse.ts <course-id> [options]
//
// Examples:
//   npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners
//   npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --module 1
//   npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --module 1-3
//   npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --provider minimax
//   npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --manual
//   npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --voice andy

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

// Import voice service if available
let UnifiedVoiceService: any;
try {
	UnifiedVoiceService = require("../src/utils/unifiedVoiceService").UnifiedVoiceService;
} catch (e) {
	console.log("Note: UnifiedVoiceService not available, manual mode only");
}

interface CourseConfig {
	courseId: string;
	coursePath: string;
	ssmlDir: string;
	outputDir: string;
}

interface GenerationOptions {
	courseId: string;
	moduleRange?: string;
	provider?: "runpod" | "minimax" | "elevenlabs";
	voice?: string;
	manual?: boolean;
	force?: boolean;
}

// Strip SSML tags to get plain text for TTS services that don't support SSML
function stripSSML(ssmlContent: string): string {
	let text = ssmlContent;

	// Remove XML declaration
	text = text.replace(/<\?xml[^?]*\?>/g, "");

	// Remove speak wrapper
	text = text.replace(/<\/?speak[^>]*>/g, "");

	// Remove voice tags
	text = text.replace(/<\/?voice[^>]*>/g, "");

	// Remove prosody tags
	text = text.replace(/<\/?prosody[^>]*>/g, "");

	// Convert breaks to pauses (periods or commas based on duration)
	text = text.replace(/<break\s+time="(\d+)ms"\s*\/>/g, (match, ms) => {
		const duration = parseInt(ms);
		if (duration >= 600) return ". ";
		if (duration >= 300) return ", ";
		return " ";
	});

	// Remove emphasis tags but keep content
	text = text.replace(/<emphasis[^>]*>([^<]*)<\/emphasis>/g, "$1");

	// Remove any remaining tags
	text = text.replace(/<[^>]+>/g, "");

	// Clean up whitespace
	text = text.replace(/\s+/g, " ").trim();

	// Fix spacing around punctuation
	text = text.replace(/\s+([.,!?])/g, "$1");
	text = text.replace(/([.,!?])\s*([.,!?])/g, "$1$2");

	return text;
}

// Parse module range (e.g., "1", "1-3", "1,3,5", "all")
function parseModuleRange(input: string, availableModules: number[]): number[] {
	if (input === "all" || !input) {
		return availableModules;
	}

	const modules: number[] = [];
	const parts = input.split(",");

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed.includes("-")) {
			const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
			if (!isNaN(start) && !isNaN(end)) {
				for (let i = start; i <= end; i++) {
					if (availableModules.includes(i)) {
						modules.push(i);
					}
				}
			}
		} else {
			const num = parseInt(trimmed);
			if (!isNaN(num) && availableModules.includes(num)) {
				modules.push(num);
			}
		}
	}

	return [...new Set(modules)].sort((a, b) => a - b);
}

// Find all SSML files in the course
function findSSMLFiles(ssmlDir: string): { moduleNumber: number; filePath: string }[] {
	if (!fs.existsSync(ssmlDir)) {
		return [];
	}

	const files = fs.readdirSync(ssmlDir);
	const ssmlFiles: { moduleNumber: number; filePath: string }[] = [];

	for (const file of files) {
		const match = file.match(/module(\d+)\.ssml$/);
		if (match) {
			ssmlFiles.push({
				moduleNumber: parseInt(match[1]),
				filePath: path.join(ssmlDir, file),
			});
		}
	}

	return ssmlFiles.sort((a, b) => a.moduleNumber - b.moduleNumber);
}

// Generate audio using the unified voice service
async function generateWithAPI(
	text: string,
	outputPath: string,
	provider?: string,
	voice?: string
): Promise<{ success: boolean; service?: string; error?: string }> {
	if (!UnifiedVoiceService) {
		return { success: false, error: "Voice service not available" };
	}

	try {
		const voiceService = new UnifiedVoiceService();
		const result = await voiceService.generateAudio({
			prompt: text,
			voice: voice || "andy",
			provider: provider as any,
		});

		// Save the audio file
		if (result.audioData) {
			const buffer = Buffer.from(result.audioData, "base64");
			fs.writeFileSync(outputPath, buffer);
			return { success: true, service: result.serviceUsed };
		} else if (result.audioUrl) {
			// Download from URL
			const response = await fetch(result.audioUrl);
			const arrayBuffer = await response.arrayBuffer();
			fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
			return { success: true, service: result.serviceUsed };
		}

		return { success: false, error: "No audio data returned" };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

// Create manifest for manual upload
function createManualManifest(
	ssmlFiles: { moduleNumber: number; filePath: string }[],
	outputDir: string,
	config: CourseConfig
): void {
	const manifest: any = {
		course: config.courseId,
		generatedAt: new Date().toISOString(),
		instructions: [
			"1. Use a TTS service to generate audio for each module",
			"2. Save audio files as WAV or MP3 format",
			"3. Name files as: module01.wav, module02.wav, etc.",
			"4. Place files in: " + outputDir,
			"5. Run the timings extraction script after uploading",
		],
		modules: [] as any[],
	};

	for (const file of ssmlFiles) {
		const ssmlContent = fs.readFileSync(file.filePath, "utf-8");
		const plainText = stripSSML(ssmlContent);
		const wordCount = plainText.split(/\s+/).length;
		const estimatedDuration = Math.ceil(wordCount / 2.5); // ~150 words/min

		manifest.modules.push({
			moduleNumber: file.moduleNumber,
			ssmlFile: path.relative(config.coursePath, file.filePath),
			expectedOutput: `module${String(file.moduleNumber).padStart(2, "0")}.wav`,
			wordCount,
			estimatedDurationSeconds: estimatedDuration,
			plainTextPreview: plainText.substring(0, 200) + "...",
		});
	}

	// Write manifest
	const manifestPath = path.join(outputDir, "upload-manifest.json");
	fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
	console.log(`\nManifest created: ${manifestPath}`);

	// Write plain text files for easy copy/paste
	const textsDir = path.join(outputDir, "plain_text");
	if (!fs.existsSync(textsDir)) {
		fs.mkdirSync(textsDir, { recursive: true });
	}

	for (const file of ssmlFiles) {
		const ssmlContent = fs.readFileSync(file.filePath, "utf-8");
		const plainText = stripSSML(ssmlContent);
		const textPath = path.join(textsDir, `module${String(file.moduleNumber).padStart(2, "0")}.txt`);
		fs.writeFileSync(textPath, plainText);
	}
	console.log(`Plain text files created in: ${textsDir}`);
}

// Main generation function
async function generateAudioForCourse(options: GenerationOptions): Promise<void> {
	// Setup paths
	const coursePath = path.join(__dirname, "../courses", options.courseId);
	const ssmlDir = path.join(coursePath, "course/audio_ssml");
	const outputDir = path.join(coursePath, "course/audio_final");

	const config: CourseConfig = {
		courseId: options.courseId,
		coursePath,
		ssmlDir,
		outputDir,
	};

	// Validate course exists
	if (!fs.existsSync(coursePath)) {
		console.error(`Course not found: ${options.courseId}`);
		console.error(`Expected path: ${coursePath}`);
		process.exit(1);
	}

	// Find SSML files
	const ssmlFiles = findSSMLFiles(ssmlDir);
	if (ssmlFiles.length === 0) {
		console.error(`No SSML files found in: ${ssmlDir}`);
		process.exit(1);
	}

	console.log(`\nCourse: ${options.courseId}`);
	console.log(`Found ${ssmlFiles.length} SSML files\n`);

	// Filter by module range
	const availableModules = ssmlFiles.map((f) => f.moduleNumber);
	const modulesToProcess = options.moduleRange
		? parseModuleRange(options.moduleRange, availableModules)
		: availableModules;

	const filesToProcess = ssmlFiles.filter((f) => modulesToProcess.includes(f.moduleNumber));
	console.log(`Processing modules: ${modulesToProcess.join(", ")}\n`);

	// Create output directory
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
		console.log(`Created output directory: ${outputDir}\n`);
	}

	// Manual mode - just create manifest
	if (options.manual) {
		console.log("=== MANUAL UPLOAD MODE ===\n");
		createManualManifest(filesToProcess, outputDir, config);
		console.log("\nManual upload preparation complete!");
		console.log("Upload your audio files and run timings extraction.");
		return;
	}

	// API mode - generate audio
	console.log(`=== API GENERATION MODE ===`);
	console.log(`Provider: ${options.provider || "auto"}`);
	console.log(`Voice: ${options.voice || "andy"}\n`);

	let generated = 0;
	let skipped = 0;
	let failed = 0;

	for (const file of filesToProcess) {
		const moduleNum = String(file.moduleNumber).padStart(2, "0");
		const outputPath = path.join(outputDir, `module${moduleNum}.wav`);

		// Skip if exists and not forcing
		if (fs.existsSync(outputPath) && !options.force) {
			console.log(`[Module ${moduleNum}] Skipped (exists): ${path.basename(outputPath)}`);
			skipped++;
			continue;
		}

		console.log(`[Module ${moduleNum}] Generating audio...`);

		// Read and strip SSML
		const ssmlContent = fs.readFileSync(file.filePath, "utf-8");
		const plainText = stripSSML(ssmlContent);
		const wordCount = plainText.split(/\s+/).length;

		console.log(`  Words: ${wordCount}, Est. duration: ~${Math.ceil(wordCount / 2.5)}s`);

		// Generate audio
		const result = await generateWithAPI(plainText, outputPath, options.provider, options.voice);

		if (result.success) {
			console.log(`  Success! Service: ${result.service}`);
			generated++;
		} else {
			console.error(`  Failed: ${result.error}`);
			failed++;
		}
	}

	// Summary
	console.log("\n=== SUMMARY ===");
	console.log(`Generated: ${generated}`);
	console.log(`Skipped: ${skipped}`);
	console.log(`Failed: ${failed}`);
	console.log(`\nOutput directory: ${outputDir}`);

	if (generated > 0) {
		console.log("\nNext steps:");
		console.log("1. Review generated audio files");
		console.log("2. Extract word timings for animation sync");
		console.log("3. Update Remotion scenes with actual durations");
	}
}

// Parse CLI arguments
function parseArgs(): GenerationOptions {
	const args = process.argv.slice(2);

	if (args.length === 0 || args[0] === "--help") {
		console.log(`
Usage: npx tsx scripts/generateAudioForCourse.ts <course-id> [options]

Options:
  --module <range>     Module range (e.g., "1", "1-3", "1,3,5", "all")
  --provider <name>    TTS provider: runpod, minimax, elevenlabs
  --voice <name>       Voice name (default: andy)
  --manual             Prepare for manual upload (no API calls)
  --force              Regenerate even if files exist

Examples:
  npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners
  npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --module 1
  npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --provider minimax
  npx tsx scripts/generateAudioForCourse.ts agentic-ai-for-beginners --manual
`);
		process.exit(0);
	}

	const options: GenerationOptions = {
		courseId: args[0],
	};

	for (let i = 1; i < args.length; i++) {
		switch (args[i]) {
			case "--module":
				options.moduleRange = args[++i];
				break;
			case "--provider":
				options.provider = args[++i] as any;
				break;
			case "--voice":
				options.voice = args[++i];
				break;
			case "--manual":
				options.manual = true;
				break;
			case "--force":
				options.force = true;
				break;
		}
	}

	return options;
}

// Run
const options = parseArgs();
generateAudioForCourse(options).catch((error) => {
	console.error("Error:", error.message);
	process.exit(1);
});
