// Script to measure actual audio file durations
// Run with: npm run measure-audio
// This will output the actual durations that you can copy into audioDuration.ts

import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface AudioFile {
	name: string;
	path: string;
}

async function getAudioDuration(filePath: string): Promise<number> {
	try {
		// Use ffprobe to get audio duration (if available)
		// Otherwise, we'll need to load and measure in browser
		const { stdout } = await execAsync(
			`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
		);
		const duration = parseFloat(stdout.trim());
		return isNaN(duration) ? 0 : duration;
	} catch (error) {
		// ffprobe not available, return 0 to indicate manual measurement needed
		console.warn(`Could not measure ${filePath}: ${error}`);
		return 0;
	}
}

async function measureAllAudio() {
	const audioDir = path.join(__dirname, "../public/audio");
	
	if (!fs.existsSync(audioDir)) {
		console.error("Audio directory not found:", audioDir);
		return;
	}

	const files = fs.readdirSync(audioDir).filter(f => f.endsWith(".wav"));
	
	console.log("Measuring audio file durations...\n");
	console.log("If ffprobe is not available, you'll need to measure manually.\n");

	const results: Array<{ name: string; duration: number }> = [];

	for (const file of files) {
		const filePath = path.join(audioDir, file);
		const name = file.replace(".wav", "");
		const duration = await getAudioDuration(filePath);
		
		results.push({ name, duration });
		
		if (duration > 0) {
			console.log(`${name}: ${duration.toFixed(2)} seconds`);
		} else {
			console.log(`${name}: [Manual measurement needed]`);
		}
	}

	console.log("\n--- Copy this into src/utils/audioDuration.ts ---\n");
	console.log("export const audioDurations: Record<string, number> = {");
	results.forEach(({ name, duration }) => {
		if (duration > 0) {
			console.log(`\t"${name}": ${duration.toFixed(2)},`);
		} else {
			console.log(`\t"${name}": 0, // TODO: Measure manually`);
		}
	});
	console.log("};");
}

measureAllAudio().catch(console.error);
