// Browser-based script to measure actual audio file durations
// Run this in the browser console while Remotion Studio is running
// Or save as HTML and open in browser

const audioFiles = [
	"module1-title",
	"module1-whyIaC",
	"module1-comparison",
	"module1-workflow",
	"module1-initCode",
	"module1-whyTypeScript",
	"module1-typescriptCode",
	"module1-summary",
];

async function measureAudioDuration(fileName) {
	return new Promise((resolve, reject) => {
		const audio = new Audio(`/audio/${fileName}.wav`);
		
		audio.addEventListener("loadedmetadata", () => {
			resolve({
				name: fileName,
				duration: Math.round(audio.duration * 100) / 100, // Round to 2 decimals
			});
		});
		
		audio.addEventListener("error", (e) => {
			reject(new Error(`Failed to load ${fileName}: ${e.message}`));
		});
		
		audio.load();
	});
}

async function measureAllAudio() {
	console.log("Measuring audio file durations...\n");
	
	const results = {};
	
	for (const fileName of audioFiles) {
		try {
			const result = await measureAudioDuration(fileName);
			results[result.name] = result.duration;
			console.log(`${result.name}: ${result.duration} seconds`);
		} catch (error) {
			console.error(`Error measuring ${fileName}:`, error);
		}
	}
	
	console.log("\n=== Copy this into src/utils/audioDuration.ts ===\n");
	console.log("export const audioDurations: Record<string, number> = {");
	audioFiles.forEach((name) => {
		const duration = results[name] || 0;
		console.log(`\t"${name}": ${duration},`);
	});
	console.log("};");
	
	return results;
}

// Run if in browser
if (typeof window !== "undefined") {
	measureAllAudio();
}

// Export for use in Node.js
if (typeof module !== "undefined" && module.exports) {
	module.exports = { measureAllAudio, measureAudioDuration };
}
