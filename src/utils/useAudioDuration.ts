// Hook to measure audio duration at runtime in Remotion
// This allows slides to automatically adjust to actual audio file lengths

import { useEffect, useState } from "react";

export function useAudioDuration(audioSrc: string): number | null {
	const [duration, setDuration] = useState<number | null>(null);

	useEffect(() => {
		if (!audioSrc) {
			setDuration(null);
			return;
		}

		const audio = new Audio(audioSrc);
		
		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
		};
		
		const handleError = () => {
			console.warn(`Failed to load audio: ${audioSrc}`);
			setDuration(null);
		};

		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("error", handleError);
		audio.load();

		return () => {
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("error", handleError);
		};
	}, [audioSrc]);

	return duration;
}
