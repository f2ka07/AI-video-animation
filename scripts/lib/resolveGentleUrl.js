// Resolve a reachable Gentle API base URL for local dev and Docker deploy.
const fs = require('fs');
const { getFetch } = require('./httpFetch.js');

function getGentleHostPort() {
	const port = parseInt(process.env.GENTLE_HOST_PORT || '8765', 10);
	return Number.isFinite(port) && port > 0 ? port : 8765;
}

function getHostGentleCandidates() {
	const port = getGentleHostPort();
	return [`http://localhost:${port}`, `http://127.0.0.1:${port}`];
}

const DOCKER_CANDIDATES = [
	'http://gentle:8765',
];

function isLikelyDockerRuntime() {
	return fs.existsSync('/.dockerenv') || process.env.RUNNING_IN_DOCKER === '1';
}

function normalizeGentleBaseUrl(url) {
	const trimmed = String(url || '').trim().replace(/\/+$/, '');
	if (!trimmed) {
		return '';
	}
	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}
	return `http://${trimmed}`;
}

function getGentleUrlCandidates() {
	const candidates = [];
	const envUrl = normalizeGentleBaseUrl(process.env.GENTLE_URL);
	const inDocker = isLikelyDockerRuntime();

	if (inDocker) {
		if (envUrl) candidates.push(envUrl);
		for (const url of DOCKER_CANDIDATES) candidates.push(url);
		for (const url of getHostGentleCandidates()) candidates.push(url);
	} else {
		// Host GUI: Docker Gentle is published on localhost (see GENTLE_HOST_PORT).
		for (const url of getHostGentleCandidates()) candidates.push(url);
		if (envUrl && !envUrl.includes('gentle:')) candidates.push(envUrl);
		for (const url of DOCKER_CANDIDATES) candidates.push(url);
	}

	return [...new Set(candidates)];
}

async function probeGentleUrl(baseUrl, timeoutMs = 5000) {
	const fetch = getFetch();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		await fetch(`${baseUrl}/transcriptions?async=false`, {
			method: 'GET',
			signal: controller.signal,
		});
		// Any HTTP response means the server is reachable (GET may return 4xx).
		return true;
	} catch {
		return false;
	} finally {
		clearTimeout(timer);
	}
}

async function resolveGentleUrl(options = {}) {
	const candidates = getGentleUrlCandidates();
	const tried = [];
	const configuredUrl = normalizeGentleBaseUrl(process.env.GENTLE_URL) || null;
	const timeoutMs = options.timeoutMs ?? 5000;

	for (const url of candidates) {
		tried.push(url);
		if (await probeGentleUrl(url, timeoutMs)) {
			return {
				url,
				tried,
				configuredUrl,
				fallback: Boolean(configuredUrl && url !== configuredUrl),
			};
		}
	}

	return {
		url: null,
		tried,
		configuredUrl,
		fallback: false,
	};
}

function formatGentleConnectionHelp(triedUrls) {
	const tried = Array.isArray(triedUrls) && triedUrls.length > 0
		? triedUrls
		: getGentleUrlCandidates();
	return [
		'Cannot connect to Gentle. Tried:',
		...tried.map((url) => `  - ${url}`),
		'',
		'To start Gentle locally:',
		'  docker run -p 8765:8765 lowerquality/gentle',
		'',
		'In Docker Compose, ensure slides-gentle is healthy on slides-network.',
		'On Windows/Mac host (GUI outside Docker): use GENTLE_URL=http://localhost:8765',
		'  docker compose up -d gentle',
		'Port 8765 already allocated: docker ps --filter publish=8765  then docker stop <name>',
		'  Or set GENTLE_HOST_PORT=8766 in .env and recreate: docker compose up -d --force-recreate gentle',
	].join('\n');
}

module.exports = {
	getGentleHostPort,
	getHostGentleCandidates,
	DOCKER_CANDIDATES,
	isLikelyDockerRuntime,
	normalizeGentleBaseUrl,
	getGentleUrlCandidates,
	probeGentleUrl,
	resolveGentleUrl,
	formatGentleConnectionHelp,
};
