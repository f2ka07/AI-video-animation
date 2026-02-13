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
		runpod: "andy", // Chatterbox voice
		minimax: "Wise_Woman", // Minimax voice (using Wise_Woman as default - verify available voices)
		elevenlabs: "21m00Tcm4TlvDq8ikWAM", // Rachel (similar tone)
	},
	sarah: {
		runpod: "sarah", // Chatterbox voice
		minimax: "Wise_Woman", // Minimax voice (female, professional)
		elevenlabs: "EXAVITQu4vr4xnSDxMaL", // Bella (female)
	},
	tom: {
		runpod: "tom", // Chatterbox voice
		minimax: "Wise_Woman", // Minimax voice (using Wise_Woman as default - verify available voices)
		elevenlabs: "pNInz6obpgDQGcFmaJgB", // Adam (male)
	},
	lucy: {
		runpod: "lucy", // Chatterbox voice
		minimax: "Wise_Woman", // Minimax voice (female, friendly)
		elevenlabs: "EXAVITQu4vr4xnSDxMaL", // Bella (female)
	},
};

/**
 * Get the appropriate voice ID for a specific service
 */
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
			return "Wise_Woman"; // Default Minimax voice (adjust if this doesn't exist)
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
