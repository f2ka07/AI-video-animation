// Remotion configuration for video rendering
// Note: Remotion loads this file as CJS — do not use import.meta here.

import { Config } from "@remotion/cli/config";
import fs from "fs";
import os from "os";

function readCgroupCpuLimit(): number {
	const candidates = [
		"/sys/fs/cgroup/cpu.max",
		"/sys/fs/cgroup/cpu/cpu.max",
	];
	for (const filePath of candidates) {
		try {
			const raw = fs.readFileSync(filePath, "utf8").trim();
			const [quotaStr, periodStr] = raw.split(/\s+/);
			if (quotaStr && quotaStr !== "max") {
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
	try {
		const quota = parseInt(fs.readFileSync("/sys/fs/cgroup/cpu/cpu.cfs_quota_us", "utf8"), 10);
		const period = parseInt(fs.readFileSync("/sys/fs/cgroup/cpu/cpu.cfs_period_us", "utf8"), 10);
		if (quota > 0 && period > 0) {
			return Math.max(1, Math.floor(quota / period));
		}
	} catch {
		// not in cgroup v1
	}
	return 0;
}

function getCpuCount(): number {
	const fromCgroup = readCgroupCpuLimit();
	return fromCgroup > 0 ? fromCgroup : os.cpus().length;
}

function getOptimalRenderConcurrency(): number {
	const cpus = getCpuCount();
	const reserve = parseInt(process.env.REMOTION_CPU_RESERVE || "1", 10);
	const envCap = process.env.REMOTION_CONCURRENCY
		? parseInt(process.env.REMOTION_CONCURRENCY, 10)
		: null;
	let auto = Math.max(1, cpus - (Number.isNaN(reserve) ? 1 : reserve));
	if (envCap && !Number.isNaN(envCap)) {
		auto = Math.min(auto, envCap);
	}
	return Math.min(auto, cpus);
}

// Use Remotion's bundled Chromium (null = auto-detect)
Config.setBrowserExecutable(null);

const cpuCount = getCpuCount();
const concurrency = getOptimalRenderConcurrency();
Config.setConcurrency(concurrency);

// JPEG is ~30% faster than PNG with minimal quality loss
Config.setVideoImageFormat("jpeg");

// Pin Studio port only when REMOTION_STUDIO_PORT is set; otherwise Remotion picks a free port
// (avoids crash when 3000 is already in use by a running Studio instance)
const studioPort = process.env.REMOTION_STUDIO_PORT;
if (studioPort) {
	Config.setStudioPort(Number(studioPort));
}

// Webpack optimizations for faster bundling
Config.overrideWebpackConfig((config) => {
	// Filesystem cache can serve stale moduleContent.ts after course activation in Studio.
	// Keep it for render/bundle commands only.
	const isRenderOrBundle = process.argv.some(
		(arg) => arg === "render" || arg.includes("bundle") || arg.includes("still")
	);
	return {
		...config,
		// Suppress large asset warnings
		performance: {
			...config.performance,
			hints: false,
		},
		cache: isRenderOrBundle ? { type: "filesystem" } : false,
		// Source maps required for Remotion Studio timeline (Sequence source location)
		devtool: "eval-source-map",
	};
});

// Log the configuration
console.log(`[Remotion Config] Concurrency: ${concurrency} threads (of ${cpuCount} available)`);
