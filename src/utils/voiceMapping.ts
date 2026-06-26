// Voice mapping between different TTS services
// Maps common voice names to service-specific voice IDs

export interface VoiceMapping {
	runpod?: string; // Chatterbox voice name
	minimax?: string; // Minimax voice_id
	elevenlabs?: string; // ElevenLabs voice ID
}

/**
 * Voice mappings for common voice names
 * Maps user-friendly names to service-specific identifiers
 */
const VOICE_MAPPINGS: Record<string, VoiceMapping> = {
	andy: {
		runpod: "andy",
		minimax: "English_expressive_narrator",
		elevenlabs: "21m00Tcm4TlvDq8ikWAM",
	},
	sarah: {
		runpod: "sarah",
		minimax: "presenter_female",
		elevenlabs: "EXAVITQu4vr4xnSDxMaL",
	},
	tom: {
		runpod: "tom",
		minimax: "presenter_male",
		elevenlabs: "pNInz6obpgDQGcFmaJgB",
	},
	lucy: {
		runpod: "lucy",
		minimax: "audiobook_female_1",
		elevenlabs: "EXAVITQu4vr4xnSDxMaL",
	},
	francis: {
		runpod: "andy",
		minimax: "moss_audio_302ca737-f4d5-11f0-89d3-26cb62c33ed5",
		elevenlabs: "21m00Tcm4TlvDq8ikWAM",
	},
};
export function getVoiceForService(
	voiceName: string,
	service: "runpod" | "minimax" | "elevenlabs"
): string {
	const mapping = VOICE_MAPPINGS[voiceName.toLowerCase()];
	
	if (mapping && mapping[service]) {
		return mapping[service]!;
	}
	
	// Fallback: use the voice name as-is (might be a service-specific ID already)
	// Or use service defaults
	switch (service) {
		case "runpod":
			return voiceName || "andy"; // Default Chatterbox voice
		case "minimax":
			// If voice name looks like a Minimax voice ID (contains underscore), use it directly
			// Otherwise use default
			if (voiceName && voiceName.includes("_")) {
				return voiceName;
			}
			return "moss_audio_302ca737-f4d5-11f0-89d3-26cb62c33ed5";
		case "elevenlabs":
			return "21m00Tcm4TlvDq8ikWAM"; // Default ElevenLabs voice (Rachel)
		default:
			return voiceName || "andy";
	}
}

/**
 * Get all available voice names
 */
export function getAvailableVoices(): string[] {
	return Object.keys(VOICE_MAPPINGS);
}
