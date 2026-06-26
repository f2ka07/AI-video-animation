// Resolve connectivity from the host GUI to Docker helper services (Gentle, MFA, Remotion).

const { resolveGentleUrl, getGentleUrlCandidates } = require('./resolveGentleUrl.js');
const { resolveMfaCli } = require('./resolveMfa.js');
const {
	resolveRemotionStudioUrl,
	getRemotionStudioUrlCandidates,
	getRemotionStudioStartHint,
} = require('./resolveRemotionStudioUrl.js');
const { probeDocker } = require('./mfaDocker.js');

async function resolveDockerStackStatus(options = {}) {
	const timeoutMs = options.timeoutMs ?? 3000;

	const [gentle, mfa, remotion, docker] = await Promise.all([
		resolveGentleUrl({ timeoutMs }),
		resolveMfaCli({ pull: false, timeoutMs: Math.max(timeoutMs, 8000) }),
		resolveRemotionStudioUrl({ timeoutMs }),
		probeDocker(timeoutMs),
	]);

	const gentleReachable = Boolean(gentle.url);
	const mfaReachable = Boolean(mfa.available);
	const remotionReachable = remotion.reachable === true;

	let remotionStartHint = getRemotionStudioStartHint();
	if (!remotionReachable && docker.ok) {
		remotionStartHint = [
			'Remotion Studio is not running on port 3000.',
			'Option 1 (host): npm start',
			'Option 2 (Docker): docker compose --profile studio up -d --build remotion',
			'Then refresh this page — both bind http://localhost:3000',
		].join(' ');
	}

	let gentleStartHint = null;
	if (!gentleReachable) {
		gentleStartHint = [
			'Gentle is not reachable for word timings.',
			'Start: docker compose up -d gentle',
			'If port 8765 is in use: docker ps --filter publish=8765',
			'  then docker stop <container>  OR set GENTLE_HOST_PORT=8766 in .env',
		].join(' ');
	}

	let mfaStartHint = null;
	if (!mfaReachable) {
		mfaStartHint = [
			'MFA is not available.',
			'Ensure Docker is running, then: npm run mfa:download-models',
			'(Models download via docker compose run; no long-running MFA container needed.)',
		].join(' ');
	}

	return {
		dockerEngineRunning: docker.ok === true,
		gentle: {
			reachable: gentleReachable,
			url: gentle.url,
			configuredUrl: gentle.configuredUrl || null,
			candidates: getGentleUrlCandidates(),
			startHint: gentleStartHint,
		},
		mfa: {
			available: mfaReachable,
			mode: mfa.mode || null,
			bin: mfa.bin || null,
			version: mfa.version || null,
			dictionary: mfa.dictionary,
			acousticModel: mfa.acousticModel,
			error: mfa.available ? null : mfa.error || mfa.dockerError,
			startHint: mfaStartHint,
		},
		remotion: {
			reachable: remotionReachable,
			url: remotion.url,
			configuredUrl: remotion.configuredUrl,
			candidates: getRemotionStudioUrlCandidates(),
			fallback: remotion.fallback === true,
			startHint: remotionStartHint,
		},
		stackReady: gentleReachable && mfaReachable,
		previewReady: remotionReachable,
	};
}

module.exports = {
	resolveDockerStackStatus,
};
