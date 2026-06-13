// Shared CPU-aware Remotion concurrency for gui-server and CLI scripts
const fs = require('fs');
const os = require('os');

/**
 * Effective CPUs visible to this process (respects Docker/cgroup limits).
 * os.cpus().length often reports the HOST count inside containers; Remotion uses cgroup.
 */
function getCpuCount() {
	const fromCgroup = readCgroupCpuLimit();
	if (fromCgroup > 0) {
		return fromCgroup;
	}
	return os.cpus().length;
}

function readCgroupCpuLimit() {
	const candidates = [
		'/sys/fs/cgroup/cpu.max',
		'/sys/fs/cgroup/cpu/cpu.max',
	];

	for (const filePath of candidates) {
		try {
			const raw = fs.readFileSync(filePath, 'utf8').trim();
			const [quotaStr, periodStr] = raw.split(/\s+/);
			if (quotaStr && quotaStr !== 'max') {
				const quota = parseInt(quotaStr, 10);
				const period = parseInt(periodStr, 10) || 100000;
				if (quota > 0 && period > 0) {
					return Math.max(1, Math.floor(quota / period));
				}
			}
		} catch {
			// try next path
		}
	}

	// cgroup v1
	try {
		const quota = parseInt(
			fs.readFileSync('/sys/fs/cgroup/cpu/cpu.cfs_quota_us', 'utf8'),
			10
		);
		const period = parseInt(
			fs.readFileSync('/sys/fs/cgroup/cpu/cpu.cfs_period_us', 'utf8'),
			10
		);
		if (quota > 0 && period > 0) {
			return Math.max(1, Math.floor(quota / period));
		}
	} catch {
		// not in cgroup v1
	}

	return 0;
}

/**
 * Optimal Remotion --concurrency for the current host.
 * Reserves cores for the GUI, Gentle, and OS unless REMOTION_CPU_RESERVE=0.
 */
function getOptimalRenderConcurrency(requested) {
	const cpus = getCpuCount();
	const reserve = parseInt(process.env.REMOTION_CPU_RESERVE || '1', 10);
	const envCap = process.env.REMOTION_CONCURRENCY
		? parseInt(process.env.REMOTION_CONCURRENCY, 10)
		: null;

	let auto = Math.max(1, cpus - (Number.isNaN(reserve) ? 1 : reserve));
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
