// Utility to measure all audio files at runtime and return their durations
// This can be used to dynamically calculate slide durations

import { staticFile } from "remotion";

export interface AudioFile {
	name: string;
	path: string;
}

export const audioFiles: AudioFile[] = [
	{ name: "module1-title", path: staticFile("audio/module1-title.wav") },
	{ name: "module1-whyIaC", path: staticFile("audio/module1-whyIaC.wav") },
	{ name: "module1-comparison", path: staticFile("audio/module1-comparison.wav") },
	{ name: "module1-workflow", path: staticFile("audio/module1-workflow.wav") },
	{ name: "module1-initCode", path: staticFile("audio/module1-initCode.wav") },
	{ name: "module1-whyTypeScript", path: staticFile("audio/module1-whyTypeScript.wav") },
	{ name: "module1-typescriptCode", path: staticFile("audio/module1-typescriptCode.wav") },
	{ name: "module1-summary", path: staticFile("audio/module1-summary.wav") },
];

export async function measureAudioDuration(audioSrc: string): Promise<number> {
	return new Promise((resolve, reject) => {
		const audio = new Audio(audioSrc);
		
		audio.addEventListener("loadedmetadata", () => {
			resolve(audio.duration);
		});
		
		audio.addEventListener("error", (e) => {
			reject(new Error(`Failed to load audio: ${audioSrc}`));
		});
		
		audio.load();
	});
}
