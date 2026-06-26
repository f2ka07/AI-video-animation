// Browser-facing Remotion Studio URL (local preview). Distinct from REMOTION_URL
// used inside Docker networks for service discovery during optional studio container.

const DEFAULT_STUDIO_URL = 'http://localhost:3000';

function normalizeStudioBaseUrl(url) {
	const trimmed = String(url || '').trim().replace(/\/+$/, '');
	if (!trimmed) {
		return '';
	}
	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}
	return `http://${trimmed}`;
}

function getRemotionStudioUrlCandidates() {
	const candidates = [];
	const envUrl = normalizeStudioBaseUrl(process.env.REMOTION_STUDIO_URL);
	if (envUrl) {
		candidates.push(envUrl);
	}
	candidates.push(DEFAULT_STUDIO_URL);
	candidates.push('http://127.0.0.1:3000');
	return [...new Set(candidates)];
}

function getConfiguredRemotionStudioUrl() {
	return normalizeStudioBaseUrl(process.env.REMOTION_STUDIO_URL) || DEFAULT_STUDIO_URL;
}

async function probeRemotionStudioUrl(baseUrl, timeoutMs = 3000) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const response = await fetch(baseUrl, {
			method: 'GET',
			signal: controller.signal,
			headers: { Accept: 'text/html' },
		});
		if (!response.ok) {
			return false;
		}
		const html = await response.text();
		return /remotion/i.test(html);
	} catch {
		return false;
	} finally {
		clearTimeout(timer);
	}
}

async function resolveRemotionStudioUrl(options = {}) {
	const candidates = getRemotionStudioUrlCandidates();
	const tried = [];
	const configuredUrl = getConfiguredRemotionStudioUrl();
	const timeoutMs = options.timeoutMs ?? 3000;

	for (const url of candidates) {
		tried.push(url);
		if (await probeRemotionStudioUrl(url, timeoutMs)) {
			return {
				url,
				tried,
				configuredUrl,
				fallback: url !== configuredUrl,
				reachable: true,
			};
		}
	}

	return {
		url: configuredUrl,
		tried,
		configuredUrl,
		fallback: false,
		reachable: false,
	};
}

function buildRemotionStudioOpenUrl(baseUrl, moduleNumber, courseId) {
	const mod =
		moduleNumber !== undefined && moduleNumber !== null && moduleNumber !== ''
			? moduleNumber
			: 1;
	const params = new URLSearchParams({
		composition: `module-${mod}`,
		t: String(Date.now()),
	});
	if (courseId) {
		params.set('course', courseId);
	}
	return `${normalizeStudioBaseUrl(baseUrl)}?${params.toString()}`;
}

function getRemotionStudioStartHint(options = {}) {
	const dockerAvailable = options.dockerAvailable === true;
	const lines = [
		'Remotion Studio is not running on http://localhost:3000.',
		'Option 1 (host, preferred): npm start',
	];
	if (dockerAvailable) {
		lines.push('Option 2 (Docker fallback): docker compose --profile studio up -d --build remotion');
	}
	lines.push('Headless renders still run from the GUI on the host (no Studio required).');
	return lines.join(' ');
}

module.exports = {
	DEFAULT_STUDIO_URL,
	normalizeStudioBaseUrl,
	getRemotionStudioUrlCandidates,
	getConfiguredRemotionStudioUrl,
	probeRemotionStudioUrl,
	resolveRemotionStudioUrl,
	buildRemotionStudioOpenUrl,
	getRemotionStudioStartHint,
};
