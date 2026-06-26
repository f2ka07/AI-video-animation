// Preflight checks before forced-alignment timing extraction.

const fs = require('fs');
const path = require('path');

function countModuleAudioFiles(audioDir, moduleNumber) {
	if (!fs.existsSync(audioDir)) {
		return 0;
	}
	const prefix = `module${moduleNumber}-`;
	return fs
		.readdirSync(audioDir)
		.filter((name) => name.startsWith(prefix) && name.endsWith('.wav')).length;
}

function formatMissingAudioHelp(courseId, moduleNumber, audioDir) {
	return [
		`❌ No audio files for module ${moduleNumber} (${courseId}).`,
		`   Expected: ${path.join(audioDir, `module${moduleNumber}-<slide-name>.wav`)}`,
		'   Generate audio first (GUI Step 3 / Generate Audio for Module), then run timings again.',
	].join('\n');
}

module.exports = {
	countModuleAudioFiles,
	formatMissingAudioHelp,
};
