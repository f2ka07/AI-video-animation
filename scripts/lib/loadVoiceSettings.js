const fs = require("fs");
const path = require("path");

const FRANCIS_MINIMAX_VOICE_ID = "moss_audio_302ca737-f4d5-11f0-89d3-26cb62c33ed5";

function resolveVoiceSettingsPath() {
	const workspacePath = path.join(__dirname, "../../workspace/config/voice-settings.json");
	const legacyPath = path.join(__dirname, "../../voice-settings.json");
	if (fs.existsSync(workspacePath)) return workspacePath;
	if (fs.existsSync(legacyPath)) return legacyPath;
	return workspacePath;
}

function loadVoiceSettings() {
	try {
		const settingsPath = resolveVoiceSettingsPath();
		if (fs.existsSync(settingsPath)) {
			return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
		}
	} catch (error) {
		console.error("[voice-settings] Error loading:", error);
	}
	return {
		provider: "minimax",
		customVoices: [],
		defaultVoice: {
			runpod: "andy",
			minimax: FRANCIS_MINIMAX_VOICE_ID,
			openai: "onyx",
		},
		audioMode: "per-module",
	};
}

function getDefaultProvider() {
	const settings = loadVoiceSettings();
	return settings.provider || "minimax";
}

function getDefaultVoice(provider) {
	const settings = loadVoiceSettings();
	const resolvedProvider = provider || settings.provider || "minimax";
	return settings.defaultVoice?.[resolvedProvider] || FRANCIS_MINIMAX_VOICE_ID;
}

module.exports = {
	FRANCIS_MINIMAX_VOICE_ID,
	loadVoiceSettings,
	getDefaultProvider,
	getDefaultVoice,
};
