// Remotion configuration for video rendering
// This file configures browser settings for CLI rendering

import { Config } from "@remotion/cli/config";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { getOptimalRenderConcurrency, getCpuCount } = require("./scripts/lib/renderConcurrency.js");

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
