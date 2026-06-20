// Resolve a reachable Gentle API base URL for local dev and Docker deploy.
const DEFAULT_CANDIDATES = [
	'http://localhost:8765',
	'http://127.0.0.1:8765',
	'http://gentle:8765',
];

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
	if (envUrl) {
		candidates.push(envUrl);
	}
	for (const url of DEFAULT_CANDIDATES) {
		candidates.push(url);
	}
	return [...new Set(candidates)];
}

async function probeGentleUrl(baseUrl, timeoutMs = 5000) {
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
		'Set GENTLE_URL to override the first candidate; localhost and gentle are tried automatically.',
	].join('\n');
}

module.exports = {
	DEFAULT_CANDIDATES,
	normalizeGentleBaseUrl,
	getGentleUrlCandidates,
	probeGentleUrl,
	resolveGentleUrl,
	formatGentleConnectionHelp,
};
