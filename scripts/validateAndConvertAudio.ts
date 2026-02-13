// Validate and convert audio files to proper WAV format
// 1. Finds .mp3 files and converts them to .wav
// 2. Checks .wav files and converts any that are actually MP3 or other formats
// Usage: npx tsx validateAndConvertAudio.ts [courseId]
// If courseId is provided, only validates that course's audio directory

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// Get course ID from command line (if provided)
const courseId = process.argv[2] || null;
const BASE_AUDIO_DIR = path.join(__dirname, "../public/audio");
// If course specified, only check that course's audio directory
const AUDIO_DIR = courseId ? path.join(BASE_AUDIO_DIR, courseId) : BASE_AUDIO_DIR;

interface AudioFileInfo {
	file: string;
	format: string;
	isValid: boolean;
	duration?: number;
}

function getAudioFormat(filePath: string): { format: string; duration: number } | null {
	try {
		const result = execSync(
			`ffprobe -v quiet -show_format -print_format json "${filePath}"`,
			{ encoding: "utf-8" }
		);
		const data = JSON.parse(result);
		return {
			format: data.format?.format_name || "unknown",
			duration: parseFloat(data.format?.duration || "0"),
		};
	} catch (error) {
		return null;
	}
}

function convertToWav(inputPath: string, outputPath?: string): boolean {
	const targetPath = outputPath || inputPath;
	const tempPath = targetPath.replace(".wav", "-converting.wav");
	try {
		// Convert to proper PCM WAV format
		execSync(
			`ffmpeg -y -i "${inputPath}" -acodec pcm_s16le -ar 44100 "${tempPath}"`,
			{ encoding: "utf-8", stdio: "pipe" }
		);
		// If output is different from input, keep the original
		if (outputPath && outputPath !== inputPath) {
			fs.renameSync(tempPath, outputPath);
		} else {
			// Replace original with converted file
			fs.unlinkSync(inputPath);
			fs.renameSync(tempPath, inputPath);
		}
		return true;
	} catch (error) {
		// Clean up temp file if it exists
		if (fs.existsSync(tempPath)) {
			fs.unlinkSync(tempPath);
		}
		return false;
	}
}

// Get all audio files recursively from all course directories
function getAllAudioFiles(dir: string): { file: string; fullPath: string; relativePath: string }[] {
	const results: { file: string; fullPath: string; relativePath: string }[] = [];
	
	const items = fs.readdirSync(dir, { withFileTypes: true });
	
	for (const item of items) {
		const fullPath = path.join(dir, item.name);
		const relativePath = path.relative(AUDIO_DIR, fullPath);
		
		if (item.isDirectory()) {
			// Skip backup directories and subdirectories when scanning a specific course
			if (item.name === 'backup' || item.name === 'backup1' || item.name === 'temp' || 
			    item.name === 'back' || item.name === 'mp3') {
				console.log(`  Skipping directory: ${item.name}/`);
				continue;
			}
			// Only recurse into course directories if we're scanning all courses
			if (!courseId) {
				results.push(...getAllAudioFiles(fullPath));
			}
		} else if (item.isFile()) {
			results.push({ file: item.name, fullPath, relativePath });
		}
	}
	
	return results;
}

async function main() {
	if (courseId) {
		console.log(`Validating audio files for course: ${courseId}`);
		console.log(`Directory: public/audio/${courseId}/\n`);
	} else {
		console.log("Validating audio files in public/audio (all courses)...\n");
	}

	if (!fs.existsSync(AUDIO_DIR)) {
		console.error(`Audio directory not found: ${AUDIO_DIR}`);
		if (courseId) {
			console.error(`Make sure the course "${courseId}" has audio files generated.`);
		}
		process.exit(1);
	}

	const allAudioFiles = getAllAudioFiles(AUDIO_DIR);
	const wavFiles = allAudioFiles.filter((f) => f.file.endsWith(".wav"));
	const mp3Files = allAudioFiles.filter((f) => f.file.endsWith(".mp3"));
	
	console.log(`Found ${wavFiles.length} .wav files`);
	console.log(`Found ${mp3Files.length} .mp3 files\n`);

	let totalConverted = 0;
	let totalFailed = 0;

	// Step 1: Convert MP3 files to WAV
	if (mp3Files.length > 0) {
		console.log("Converting MP3 files to WAV:");
		console.log("─".repeat(60));
		
		for (const { file, fullPath, relativePath } of mp3Files) {
			const wavPath = fullPath.replace(".mp3", ".wav");
			const wavRelativePath = relativePath.replace(".mp3", ".wav");
			
			// Check if WAV already exists
			if (fs.existsSync(wavPath)) {
				console.log(`  ${relativePath} -> (WAV already exists, skipping)`);
				continue;
			}
			
			process.stdout.write(`  ${relativePath} -> ${wavRelativePath} ... `);
			
			if (convertToWav(fullPath, wavPath)) {
				console.log("converted");
				totalConverted++;
			} else {
				console.log("FAILED");
				totalFailed++;
			}
		}
		console.log("─".repeat(60));
	}

	// Step 2: Check WAV files for wrong format (MP3s renamed to .wav)
	const invalidFiles: (AudioFileInfo & { fullPath: string })[] = [];
	const validFiles: AudioFileInfo[] = [];
	const failedFiles: string[] = [];

	// Re-read WAV files (may have new ones from MP3 conversion)
	const updatedWavFiles = getAllAudioFiles(AUDIO_DIR).filter((f) => f.file.endsWith(".wav"));

	for (const { file, fullPath, relativePath } of updatedWavFiles) {
		const info = getAudioFormat(fullPath);

		if (!info) {
			failedFiles.push(relativePath);
			continue;
		}

		// WAV files should have format_name "wav" or "pcm_s16le" or similar
		// MP3 files renamed to .wav will show "mp3"
		const isWav = info.format.includes("wav") || info.format.includes("pcm");
		
		if (isWav) {
			validFiles.push({ file: relativePath, format: info.format, isValid: true, duration: info.duration });
		} else {
			invalidFiles.push({ file: relativePath, format: info.format, isValid: false, duration: info.duration, fullPath });
		}
	}

	// Report and convert invalid WAV files
	if (invalidFiles.length > 0) {
		console.log(`\nWAV files with wrong format (need conversion): ${invalidFiles.length}`);
		console.log("─".repeat(60));

		for (const { file, format, duration, fullPath } of invalidFiles) {
			process.stdout.write(`  ${file} (${format}, ${duration?.toFixed(2)}s) ... `);
			
			if (convertToWav(fullPath)) {
				console.log("converted");
				totalConverted++;
			} else {
				console.log("FAILED");
				totalFailed++;
			}
		}
		console.log("─".repeat(60));
	}

	// Report failed probes
	if (failedFiles.length > 0) {
		console.log(`\nCould not probe (possibly corrupt): ${failedFiles.length}`);
		failedFiles.forEach((f) => console.log(`  - ${f}`));
	}

	// Summary
	console.log("\n" + "=".repeat(60));
	console.log(`Summary${courseId ? ` for course: ${courseId}` : ' (all courses)'}:`);
	console.log(`  WAV files found:      ${wavFiles.length}`);
	console.log(`  MP3 files found:      ${mp3Files.length}`);
	console.log(`  Valid WAV:            ${validFiles.length}`);
	console.log(`  Converted:            ${totalConverted}`);
	console.log(`  Failed:               ${totalFailed}`);
	console.log(`  Failed to probe:      ${failedFiles.length}`);
	console.log("=".repeat(60));

	if (totalConverted > 0) {
		console.log("\nRun 'npm run measure-actual-audio' to update durations.");
	} else if (mp3Files.length === 0 && invalidFiles.length === 0 && wavFiles.length > 0) {
		console.log(`\nAll ${wavFiles.length} audio files are valid WAV format.`);
	} else if (wavFiles.length === 0 && mp3Files.length === 0) {
		console.log("\nNo audio files found. Generate audio first.");
	}
}

main().catch(console.error);
