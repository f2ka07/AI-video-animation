// Script to automatically measure all audio files and update the configuration
// Run with: npm run measure-and-update
// This will measure all .wav files and automatically update src/utils/audioDuration.ts

import * as fs from "fs";
import * as path from "path";
const mm = require("music-metadata");

interface AudioMeasurement {
	name: string;
	duration: number;
}

// Parse WAV file duration using music-metadata
async function parseWavDuration(filePath: string): Promise<number | null> {
	try {
		const metadata = await mm.parseFile(filePath);
		const duration = metadata.format.duration;
		
		if (duration && isFinite(duration) && duration > 0) {
			return Math.round(duration * 100) / 100; // Round to 2 decimals
		}
		
		return null;
	} catch (error) {
		return null;
	}
}

async function measureAllAudio(): Promise<AudioMeasurement[]> {
	const audioDir = path.join(__dirname, "../public/audio");
	
	if (!fs.existsSync(audioDir)) {
		throw new Error(`Audio directory not found: ${audioDir}`);
	}
	
	const files = fs.readdirSync(audioDir).filter(f => f.endsWith(".wav"));
	
	if (files.length === 0) {
		throw new Error("No .wav files found in public/audio");
	}
	
	console.log(`Found ${files.length} audio files. Measuring durations...\n`);
	
	const results: AudioMeasurement[] = [];
	
	for (const file of files) {
		const filePath = path.join(audioDir, file);
		const name = file.replace(".wav", "");
		
		const duration = await parseWavDuration(filePath);
		
		if (duration !== null) {
			results.push({ name, duration });
			console.log(`✓ ${name}: ${duration} seconds`);
		} else {
			console.log(`✗ ${name}: Could not measure (using default 10s)`);
			results.push({ name, duration: 10 }); // Default fallback
		}
	}
	
	return results.sort((a, b) => {
		// Sort by expected order
		const order = [
			"module1-title", "module1-whyIaC", "module1-comparison", "module1-workflow",
			"module1-initCode", "module1-whyTypeScript", "module1-typescriptCode", "module1-summary"
		];
		return order.indexOf(a.name) - order.indexOf(b.name);
	});
}

function updateAudioDurationFile(measurements: AudioMeasurement[]) {
	const configPath = path.join(__dirname, "../src/utils/audioDuration.ts");
	
	// Read current file
	let currentContent = fs.readFileSync(configPath, "utf-8");
	
	// Generate new audioDurations object with comments
	const durationsObject = measurements
		.map(m => `\t"${m.name}": ${m.duration}, // Auto-measured`)
		.join("\n");
	
	// Replace the audioDurations object
	const regex = /export const audioDurations: Record<string, number> = \{[\s\S]*?\};/;
	
	if (!regex.test(currentContent)) {
		throw new Error("Could not find audioDurations object in config file");
	}
	
	const newContent = currentContent.replace(
		regex,
		`export const audioDurations: Record<string, number> = {\n${durationsObject}\n};`
	);
	
	fs.writeFileSync(configPath, newContent);
	console.log("\n✓ Updated src/utils/audioDuration.ts");
}

async function main() {
	try {
		console.log("=== Auto-Measure Audio Durations ===\n");
		
		const measurements = await measureAllAudio();
		await updateAudioDurationFile(measurements);
		
		console.log("\n=== Summary ===");
		const totalAudio = measurements.reduce((sum, m) => sum + m.duration, 0);
		const totalWithTransitions = totalAudio + (measurements.length - 1) * 1; // 1s transition between slides
		
		console.log(`Total audio duration: ${totalAudio.toFixed(2)} seconds`);
		console.log(`With 1s transitions: ${totalWithTransitions.toFixed(2)} seconds`);
		console.log(`Total frames (30fps): ${Math.ceil(totalWithTransitions * 30)}`);
		console.log("\n✓ Configuration updated! Restart Remotion Studio to see changes.");
	} catch (error) {
		console.error("\n✗ Error:", error);
		process.exit(1);
	}
}

main();
