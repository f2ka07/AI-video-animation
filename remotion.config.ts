// Remotion configuration for video rendering
// This file configures browser settings for CLI rendering

import { Config } from "@remotion/cli/config";
import os from "os";

// Use Remotion's bundled Chromium (null = auto-detect)
Config.setBrowserExecutable(null);

// PERFORMANCE TUNING
// Your system: 4 cores / 8 threads (logical processors)
// Recommended: Use 75% of logical processors for rendering
// Higher = faster but may freeze system. Lower = slower but usable PC.
const cpuCount = os.cpus().length; // Returns logical processors (8 on your system)
const concurrency = Math.min(8, Math.max(2, Math.floor(cpuCount * 0.75)));
Config.setConcurrency(concurrency);

// JPEG is ~30% faster than PNG with minimal quality loss
Config.setVideoImageFormat("jpeg");

// Webpack optimizations for faster bundling
Config.overrideWebpackConfig((config) => {
	return {
		...config,
		// Suppress large asset warnings
		performance: {
			...config.performance,
			hints: false,
		},
		// Filesystem cache speeds up re-bundles significantly
		cache: {
			type: "filesystem",
		},
		// Faster source maps for development
		devtool: false,
	};
});

// Log the configuration
console.log(`[Remotion Config] Concurrency: ${concurrency} threads (of ${cpuCount} available)`);
