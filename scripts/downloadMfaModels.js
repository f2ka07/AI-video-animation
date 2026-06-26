#!/usr/bin/env node
// Download MFA acoustic model + dictionary into the Docker model volume (one-time setup).

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { ensureMfaDockerModels, resolveMfaDocker, getModelVolumeName } = require('./lib/mfaDocker.js');
const { getMfaConfig } = require('./lib/resolveMfa.js');

async function main() {
	const resolution = await resolveMfaDocker({ pull: true });
	if (!resolution.available) {
		console.error(resolution.error || 'Docker is not available for MFA.');
		if (resolution.help) {
			console.error(`\n${resolution.help}`);
		}
		process.exit(1);
	}

	const config = getMfaConfig();
	console.log(`Downloading MFA models into Docker volume ${getModelVolumeName()}...`);
	console.log(`  acoustic: ${config.acousticModel}`);
	console.log(`  dictionary: ${config.dictionary}`);
	console.log('(First run may take several minutes.)\n');

	await ensureMfaDockerModels(config.dictionary, config.acousticModel);
	console.log('\nDone. Use method=mfa in the GUI or: npm run extract-timings-mfa -- 1 <courseId>');
}

main().catch((error) => {
	console.error(error.message || error);
	console.error(
		'\nIf permissions persist, reset the volume:\n' +
			'  docker volume rm my-slides_mfa-models\n' +
			'  npm run mfa:download-models'
	);
	process.exit(1);
});
