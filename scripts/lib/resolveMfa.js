// Resolve Montreal Forced Aligner (MFA): local CLI or official Docker image.

const { execFile } = require('child_process');
const { promisify } = require('util');
const { resolveMfaDocker } = require('./mfaDocker.js');

const execFileAsync = promisify(execFile);

/** Acoustic model and dictionary must share the same phone set (MFA docs). */
const MFA_MODEL_PAIRS = {
	english_mfa: 'english_mfa',
	english_us_arpa: 'english_us_arpa',
};

function normalizeMfaModelPair(dictionary, acousticModel) {
	const acoustic = acousticModel || 'english_mfa';
	const expectedDictionary = MFA_MODEL_PAIRS[acoustic];
	if (!expectedDictionary) {
		return { dictionary: dictionary || acoustic, acousticModel: acoustic };
	}
	const dict = dictionary || expectedDictionary;
	if (dict !== expectedDictionary) {
		throw new Error(
			`MFA model mismatch: acoustic "${acoustic}" requires dictionary "${expectedDictionary}", ` +
				`but MFA_DICTIONARY="${dict}". ` +
				`Set MFA_DICTIONARY=${expectedDictionary} (or use MFA_ACOUSTIC_MODEL=${dict}) in .env, then run npm run mfa:download-models`
		);
	}
	return { dictionary: dict, acousticModel: acoustic };
}

function getMfaConfig() {
	const useDockerEnv = String(process.env.MFA_USE_DOCKER || 'auto').toLowerCase();
	const { dictionary, acousticModel } = normalizeMfaModelPair(
		process.env.MFA_DICTIONARY,
		process.env.MFA_ACOUSTIC_MODEL
	);
	return {
		bin: process.env.MFA_BIN || 'mfa',
		dictionary,
		acousticModel,
		timeoutMs: parseInt(process.env.MFA_TIMEOUT_MS || '900000', 10),
		useDocker: useDockerEnv === '1' || useDockerEnv === 'true' || useDockerEnv === 'yes',
		useDockerAuto: useDockerEnv === 'auto' || useDockerEnv === '',
	};
}

async function resolveLocalMfaCli(config, timeoutMs) {
	console.log('Checking for local MFA CLI...');
	try {
		const { stdout } = await execFileAsync(config.bin, ['version'], {
			timeout: timeoutMs,
			windowsHide: true,
		});
		return {
			available: true,
			mode: 'local',
			bin: config.bin,
			version: String(stdout || '').trim().split('\n')[0],
			dictionary: config.dictionary,
			acousticModel: config.acousticModel,
			timeoutMs: config.timeoutMs,
		};
	} catch (error) {
		return {
			available: false,
			mode: 'local',
			bin: config.bin,
			error: error.message,
			dictionary: config.dictionary,
			acousticModel: config.acousticModel,
		};
	}
}

async function resolveMfaCli(options = {}) {
	const config = getMfaConfig();
	const timeoutMs = options.timeoutMs ?? 15000;

	if (config.useDocker) {
		const dockerResolution = await resolveMfaDocker({ timeoutMs, pull: options.pull });
		return {
			...dockerResolution,
			dictionary: config.dictionary,
			acousticModel: config.acousticModel,
			timeoutMs: config.timeoutMs,
		};
	}

	const local = await resolveLocalMfaCli(config, timeoutMs);
	if (local.available) {
		return local;
	}

	if (config.useDockerAuto) {
		console.log('Local MFA not found; checking Docker...');
		const dockerResolution = await resolveMfaDocker({ timeoutMs, pull: options.pull });
		if (dockerResolution.available) {
			return {
				...dockerResolution,
				dictionary: config.dictionary,
				acousticModel: config.acousticModel,
				timeoutMs: config.timeoutMs,
				fallbackFromLocal: true,
				localError: local.error,
			};
		}
		return {
			...local,
			dockerError: dockerResolution.error,
			dockerHelp: dockerResolution.help,
		};
	}

	return local;
}

function formatMfaInstallHelp() {
	return [
		'Montreal Forced Aligner (MFA) is not available.',
		'',
		'Option A - Docker (recommended on Windows):',
		'  npm run docker:pull          # gentle + mfa images only',
		'  docker compose up -d         # Gentle on localhost:8765',
		'  npm run mfa:download-models  # one-time MFA model download',
		'  # MFA uses compose run only (no long-running MFA container)',
		'',
		'Option B - Conda (native CLI, fastest per slide):',
		'  conda create -n aligner -c conda-forge montreal-forced-aligner',
		'  conda activate aligner',
		'  mfa model download acoustic english_mfa',
		'  mfa model download dictionary english_mfa',
		'  # acoustic and dictionary names must match (english_mfa+english_mfa or english_us_arpa+english_us_arpa)',
		'  MFA_USE_DOCKER=0',
	].join('\n');
}

module.exports = {
	getMfaConfig,
	normalizeMfaModelPair,
	resolveMfaCli,
	formatMfaInstallHelp,
};
