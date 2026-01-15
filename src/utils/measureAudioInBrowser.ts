// Utility to measure audio duration in the browser
// This can be used in Remotion to get actual audio durations at runtime

export async function measureAudioDuration(audioSrc: string): Promise<number> {
	return new Promise((resolve, reject) => {
		const audio = new Audio(audioSrc);
		
		audio.addEventListener("loadedmetadata", () => {
			resolve(audio.duration);
		});
		
		audio.addEventListener("error", (e) => {
			reject(new Error(`Failed to load audio: ${audioSrc}`));
		});
		
		// Trigger loading
		audio.load();
	});
}
