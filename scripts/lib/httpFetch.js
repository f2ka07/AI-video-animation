// Reliable fetch for CommonJS scripts (Node 18+ global fetch; node-fetch v3 is ESM-only).
function getFetch() {
	if (typeof globalThis.fetch === 'function') {
		return globalThis.fetch.bind(globalThis);
	}
	throw new Error(
		'Global fetch is not available. Use Node.js 18 or newer (or run scripts via tsx/npx tsx).'
	);
}

module.exports = {
	getFetch,
};
