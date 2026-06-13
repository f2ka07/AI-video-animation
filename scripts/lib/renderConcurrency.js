// Shared CPU-aware Remotion concurrency for gui-server and CLI scripts
const os = require('os');

function getCpuCount() {
	return os.cpus().length;
}

/**
 * Optimal Remotion --concurrency for the current host.
 * Reserves cores for the GUI, Gentle, and OS unless REMOTION_CPU_RESERVE=0.
 */
function getOptimalRenderConcurrency(requested) {
	const cpus = getCpuCount();
	const reserve = parseInt(process.env.REMOTION_CPU_RESERVE || '2', 10);
	const envCap = process.env.REMOTION_CONCURRENCY
		? parseInt(process.env.REMOTION_CONCURRENCY, 10)
		: null;

	let auto = Math.max(1, cpus - (Number.isNaN(reserve) ? 2 : reserve));
	if (envCap && !Number.isNaN(envCap)) {
		auto = Math.min(auto, envCap);
	}
	auto = Math.min(auto, cpus);

	if (requested !== undefined && requested !== null && !Number.isNaN(Number(requested))) {
		return Math.max(1, Math.min(Number(requested), auto, cpus));
	}
	return auto;
}

module.exports = { getCpuCount, getOptimalRenderConcurrency };
