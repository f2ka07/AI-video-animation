// Split audio files into 10-second chunks
// Usage: npx tsx scripts/splitAudioIntoChunks.ts <audio-file> [options]
// Options:
//   --chunk-size=10    Duration of each chunk in seconds (default: 10)
//   --output-dir=path  Output directory (default: same as input file)
//   --prefix=name      Prefix for output files (default: input filename without extension)
//   --course-id=id     Course ID for organizing output
//   --module=N         Module number for naming
//   --slide-name=name  Slide name for naming

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface SplitOptions {
	chunkSize: number;
	outputDir?: string;
	prefix?: string;
	courseId?: string;
	moduleNumber?: number;
	slideName?: string;
}

function parseArgs(): { inputFile: string; options: SplitOptions } {
	const args = process.argv.slice(2);
	
	if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
		console.log(`
Split audio files into 10-second chunks

Usage:
  npx tsx scripts/splitAudioIntoChunks.ts <audio-file> [options]

Options:
  --chunk-size=<seconds>    Duration of each chunk (default: 10)
  --output-dir=<path>      Output directory (default: same as input file)
  --prefix=<name>          Prefix for output files (default: input filename)
  --course-id=<id>         Course ID for organizing output
  --module=<N>              Module number for naming
  --slide-name=<name>       Slide name for naming

Examples:
  # Split into 10-second chunks (default)
  npx tsx scripts/splitAudioIntoChunks.ts audio.wav

  # Split into 5-second chunks
  npx tsx scripts/splitAudioIntoChunks.ts audio.wav --chunk-size=5

  # Split with course/module naming
  npx tsx scripts/splitAudioIntoChunks.ts audio.wav \\
    --course-id=agentic-ai-for-beginners \\
    --module=1 \\
    --slide-name=concept

  # Output to specific directory
  npx tsx scripts/splitAudioIntoChunks.ts audio.wav \\
    --output-dir=public/audio/agentic-ai-for-beginners
		`);
		process.exit(0);
	}

	const inputFile = args[0];
	const options: SplitOptions = {
		chunkSize: 10,
	};

	for (let i = 1; i < args.length; i++) {
		const arg = args[i];
		if (arg.startsWith('--chunk-size=')) {
			options.chunkSize = parseFloat(arg.split('=')[1]);
		} else if (arg.startsWith('--output-dir=')) {
			options.outputDir = arg.split('=')[1];
		} else if (arg.startsWith('--prefix=')) {
			options.prefix = arg.split('=')[1];
		} else if (arg.startsWith('--course-id=')) {
			options.courseId = arg.split('=')[1];
		} else if (arg.startsWith('--module=')) {
			options.moduleNumber = parseInt(arg.split('=')[1]);
		} else if (arg.startsWith('--slide-name=')) {
			options.slideName = arg.split('=')[1];
		}
	}

	return { inputFile, options };
}

function getAudioDuration(filePath: string): number {
	try {
		const output = execSync(
			`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
			{ encoding: 'utf-8' }
		);
		return parseFloat(output.trim());
	} catch (error) {
		console.error(`Failed to get audio duration: ${error}`);
		throw error;
	}
}

function splitAudio(
	inputFile: string,
	options: SplitOptions
): { chunks: string[]; totalDuration: number } {
	if (!fs.existsSync(inputFile)) {
		throw new Error(`Audio file not found: ${inputFile}`);
	}

	// Get audio duration
	const totalDuration = getAudioDuration(inputFile);
	console.log(`Audio duration: ${totalDuration.toFixed(2)} seconds`);

	// Determine output directory
	const inputDir = path.dirname(inputFile);
	const outputDir = options.outputDir || inputDir;
	
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
		console.log(`Created output directory: ${outputDir}`);
	}

	// Determine file prefix
	let prefix: string;
	if (options.prefix) {
		prefix = options.prefix;
	} else if (options.moduleNumber && options.slideName) {
		// Use module-slide naming
		prefix = `module${options.moduleNumber}-${options.slideName}`;
	} else {
		// Use input filename without extension
		prefix = path.basename(inputFile, path.extname(inputFile));
	}

	// Calculate number of chunks
	const numChunks = Math.ceil(totalDuration / options.chunkSize);
	console.log(`Splitting into ${numChunks} chunks of ${options.chunkSize} seconds each\n`);

	const chunks: string[] = [];

	// Split audio using ffmpeg
	for (let i = 0; i < numChunks; i++) {
		const startTime = i * options.chunkSize;
		const endTime = Math.min(startTime + options.chunkSize, totalDuration);
		const actualChunkSize = endTime - startTime;

		// Generate output filename
		const chunkNumber = String(i + 1).padStart(2, '0');
		const outputFileName = `${prefix}-part${chunkNumber}.wav`;
		const outputPath = path.join(outputDir, outputFileName);

		// Skip if chunk is too short (less than 0.5 seconds)
		if (actualChunkSize < 0.5) {
			console.log(`Skipping chunk ${i + 1} (too short: ${actualChunkSize.toFixed(2)}s)`);
			continue;
		}

		try {
			// Extract chunk using ffmpeg
			execSync(
				`ffmpeg -y -i "${inputFile}" -ss ${startTime} -t ${actualChunkSize} -acodec pcm_s16le -ar 44100 "${outputPath}"`,
				{ encoding: 'utf-8', stdio: 'pipe' }
			);

			chunks.push(outputPath);
			console.log(`✓ Chunk ${i + 1}/${numChunks}: ${outputFileName} (${actualChunkSize.toFixed(2)}s)`);
		} catch (error) {
			console.error(`✗ Failed to create chunk ${i + 1}: ${error}`);
		}
	}

	return { chunks, totalDuration };
}

function generateSlideSuggestions(
	chunks: string[],
	options: SplitOptions
): void {
	if (!options.moduleNumber || !options.slideName) {
		return;
	}

	console.log('\n=== Slide Configuration Suggestions ===\n');
	console.log('Add these slides to your moduleContent.ts:\n');

	chunks.forEach((chunkPath, index) => {
		const chunkFileName = path.basename(chunkPath, '.wav');
		const slideName = chunkFileName.replace(`module${options.moduleNumber}-`, '');
		
		console.log(`{
	name: "${slideName}",
	type: "content-single",
	script: "", // Add script for this segment
	title: "Part ${index + 1}",
	points: [
		// Add bullet points for this segment
	]
},`);
	});

	console.log('\nNote: Update the script and points for each slide segment.');
}

async function main() {
	try {
		const { inputFile, options } = parseArgs();

		console.log(`\n=== Splitting Audio File ===\n`);
		console.log(`Input: ${inputFile}`);
		console.log(`Chunk size: ${options.chunkSize} seconds\n`);

		const { chunks, totalDuration } = splitAudio(inputFile, options);

		console.log(`\n✓ Successfully created ${chunks.length} chunks`);
		console.log(`Total duration: ${totalDuration.toFixed(2)} seconds`);
		console.log(`Output directory: ${path.dirname(chunks[0])}\n`);

		// Generate slide suggestions if module/slide info provided
		if (options.moduleNumber && options.slideName) {
			generateSlideSuggestions(chunks, options);
		}

		// If course ID provided, suggest next steps
		if (options.courseId) {
			console.log('\n=== Next Steps ===');
			console.log('1. Review the generated audio chunks');
			console.log('2. Add slides to moduleContent.ts (see suggestions above)');
			console.log('3. Extract word timings: npm run extract-timings-from-content');
			console.log('4. Measure audio durations: npm run measure-actual-audio');
			console.log('5. Regenerate modules: npm run generate-modules\n');
		}
	} catch (error: any) {
		console.error(`\n✗ Error: ${error.message}`);
		process.exit(1);
	}
}

main();
