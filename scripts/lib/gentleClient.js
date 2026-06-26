// Shared Gentle forced-alignment client with timeout and retries.

const fs = require('fs');
const FormData = require('form-data');
const { getFetch } = require('./httpFetch.js');

const fetch = getFetch();

const DEFAULT_TIMEOUT_MS = parseInt(process.env.GENTLE_TIMEOUT_MS || '600000', 10); // 10 min per slide
const MAX_RETRIES = parseInt(process.env.GENTLE_RETRIES || '2', 10);

function parseTimeoutMs(value) {
	const n = parseInt(value, 10);
	return Number.isFinite(n) && n > 0 ? n : DEFAULT_TIMEOUT_MS;
}

async function callGentleApi(baseUrl, audioPath, transcript, options = {}) {
	if (!fs.existsSync(audioPath)) {
		throw new Error(`Audio file not found: ${audioPath}`);
	}

	const timeoutMs = parseTimeoutMs(options.timeoutMs);
	const retries = options.retries ?? MAX_RETRIES;
	let lastError;

	for (let attempt = 1; attempt <= retries; attempt++) {
		const form = new FormData();
		form.append('audio', fs.createReadStream(audioPath));
		form.append('transcript', transcript);

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);

		try {
			const response = await fetch(`${baseUrl}/transcriptions?async=false`, {
				method: 'POST',
				body: form,
				headers: form.getHeaders(),
				signal: controller.signal,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Gentle API error (${response.status}): ${errorText.slice(0, 500)}`);
			}

			const result = await response.json();
			return (result.words || [])
				.filter((w) => w.word !== null && w.start !== null && w.end !== null)
				.map((w) => ({
					text: String(w.word),
					start: typeof w.start === 'number' ? w.start : parseFloat(w.start) || 0,
					end: typeof w.end === 'number' ? w.end : parseFloat(w.end) || 0,
				}));
		} catch (error) {
			lastError = error;
			const retryable =
				error.name === 'AbortError' ||
				/ECONNRESET|ECONNREFUSED|ETIMEDOUT|fetch failed|network/i.test(error.message || '');

			if (attempt < retries && retryable) {
				const waitMs = attempt * 2000;
				await new Promise((resolve) => setTimeout(resolve, waitMs));
				continue;
			}
			if (error.name === 'AbortError') {
				throw new Error(
					`Gentle timed out after ${Math.round(timeoutMs / 1000)}s. ` +
						'Try a shorter slide, increase GENTLE_TIMEOUT_MS, or use MFA method.'
				);
			}
			throw error;
		} finally {
			clearTimeout(timer);
		}
	}

	throw lastError;
}

module.exports = {
	callGentleApi,
	DEFAULT_TIMEOUT_MS,
};
