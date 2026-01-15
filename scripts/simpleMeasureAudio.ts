// Simple script to measure WAV file durations
// Uses file size and basic WAV header parsing

import * as fs from "fs";
import * as path from "path";

function measureWavDuration(filePath: string): number | null {
	try {
		const stats = fs.statSync(filePath);
		const fileSize = stats.size;
		
		// Read first 44 bytes (WAV header)
		const buffer = Buffer.alloc(44);
		const fd = fs.openSync(filePath, "r");
		fs.readSync(fd, buffer, 0, 44, 0);
		fs.closeSync(fd);
		
		// Check RIFF header
		if (buffer.toString("ascii", 0, 4) !== "RIFF") {
			return null;
		}
		
		// Read sample rate (offset 24)
		const sampleRate = buffer.readUInt32LE(24);
		const channels = buffer.readUInt16LE(22);
		const bitsPerSample = buffer.readUInt16LE(34);
		
		if (sampleRate === 0) return null;
		
		// Calculate duration from file size
		// Approximate: (fileSize - headerSize) / (sampleRate * channels * bytesPerSample)
		const headerSize = 44; // Standard WAV header
		const dataSize = fileSize - headerSize;
		const bytesPerSample = bitsPerSample / 8;
		const duration = dataSize / (sampleRate * channels * bytesPerSample);
		
		if (isFinite(duration) && duration > 0 && duration < 3600) {
			return Math.round(duration * 100) / 100;
		}
		
		return null;
	} catch (error) {
		return null;
	}
}

async function main() {
	const audioDir = path.join(__dirname, "../public/audio");
	const files = fs.readdirSync(audioDir).filter(f => f.endsWith(".wav"));
	
	console.log("Measuring audio durations...\n");
	
	const results: Array<{ name: string; duration: number }> = [];
	
	for (const file of files) {
		const filePath = path.join(audioDir, file);
		const name = file.replace(".wav", "");
		const duration = measureWavDuration(filePath);
		
		if (duration !== null) {
			results.push({ name, duration });
			console.log(`✓ ${name}: ${duration} seconds`);
		} else {
			console.log(`✗ ${name}: Could not measure`);
			results.push({ name, duration: 10 });
		}
	}
	
	// Sort by expected order
	const order = [
		"module1-title", "module1-whyIaC", "module1-comparison", "module1-workflow",
		"module1-initCode", "module1-whyTypeScript", "module1-typescriptCode", "module1-summary"
	];
	results.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
	
	// Update config file
	const configPath = path.join(__dirname, "../src/utils/audioDuration.ts");
	let content = fs.readFileSync(configPath, "utf-8");
	
	const newDurations = results.map(r => `\t"${r.name}": ${r.duration},`).join("\n");
	content = content.replace(
		/export const audioDurations: Record<string, number> = \{[\s\S]*?\};/,
		`export const audioDurations: Record<string, number> = {\n${newDurations}\n};`
	);
	
	fs.writeFileSync(configPath, content);
	
	console.log("\n✓ Updated src/utils/audioDuration.ts");
	console.log("\nTotal duration:", results.reduce((sum, r) => sum + r.duration, 0) + (results.length - 1), "seconds");
}

main().catch(console.error);
