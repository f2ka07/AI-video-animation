// Render all modules in a course sequentially
// 
// Usage:
//   npm run render:course                    # Full quality, all modules
//   npm run render:course -- --modules=1,2,3 # Specific modules
//   npm run render:course -- --preset=draft  # Quick draft quality
//   npm run render:course -- --preset=fast   # Balanced speed/quality
//   npm run render:course -- --preset=max    # Maximum quality
//
// Custom options:
//   --scale=0.5        Half resolution (540p)
//   --concurrency=6    Number of render threads
//   --quality=80       JPEG quality (1-100)
//   --muted            Skip audio processing

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { allModules } from "../src/videos/moduleContent";

const args = process.argv.slice(2);
let moduleNumbers: number[] = [];

// Presets for common use cases
const presets: Record<string, { scale: number; concurrency: number; quality: number; muted: boolean; everyNth?: number }> = {
	draft: { scale: 0.5, concurrency: 6, quality: 60, muted: true, everyNth: 2 },  // Fastest, preview only
	fast: { scale: 0.75, concurrency: 6, quality: 75, muted: false },              // Good speed, decent quality
	normal: { scale: 1, concurrency: 4, quality: 85, muted: false },               // Balanced
	max: { scale: 1, concurrency: 8, quality: 95, muted: false },                  // Best quality, slowest
};

// Parse --preset argument
const presetArg = args.find(a => a.startsWith('--preset='));
const presetName = presetArg ? presetArg.split('=')[1] : 'normal';
const preset = presets[presetName] || presets.normal;

// Parse --modules=1,2,3 argument
const modulesArg = args.find(a => a.startsWith('--modules='));
if (modulesArg) {
	const modulesStr = modulesArg.split('=')[1];
	moduleNumbers = modulesStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
} else {
	// Default: all modules
	moduleNumbers = allModules.map(m => m.moduleNumber);
}

// Parse individual overrides (override preset values)
const concurrencyArg = args.find(a => a.startsWith('--concurrency='));
const requestedConcurrency = concurrencyArg ? parseInt(concurrencyArg.split('=')[1]) : preset.concurrency;
const maxCores = os.cpus().length;
const concurrency = Math.min(requestedConcurrency, maxCores);

const scaleArg = args.find(a => a.startsWith('--scale='));
const scale = scaleArg ? parseFloat(scaleArg.split('=')[1]) : preset.scale;

const qualityArg = args.find(a => a.startsWith('--quality='));
const quality = qualityArg ? parseInt(qualityArg.split('=')[1]) : preset.quality;

const muted = args.includes('--muted') || preset.muted;
const everyNth = preset.everyNth;

const baseOutDir = path.join(__dirname, '../out');

// Calculate estimated time based on preset
const estimatedMinutesPerModule: Record<string, number> = {
	draft: 2, fast: 5, normal: 10, max: 20
};
const estPerModule = estimatedMinutesPerModule[presetName] || 10;
const totalEstimate = moduleNumbers.length * estPerModule;

console.log('='.repeat(60));
console.log('BATCH VIDEO RENDER');
console.log('='.repeat(60));
console.log(`Preset: ${presetName.toUpperCase()}`);
console.log(`Modules: ${moduleNumbers.join(', ')} (${moduleNumbers.length} total)`);
console.log(`Settings:`);
console.log(`  - Resolution: ${scale === 1 ? '1080p' : Math.round(1080 * scale) + 'p'} (scale=${scale})`);
console.log(`  - Concurrency: ${concurrency} threads`);
console.log(`  - JPEG Quality: ${quality}%`);
console.log(`  - Audio: ${muted ? 'DISABLED' : 'enabled'}`);
if (everyNth) console.log(`  - Frame skip: every ${everyNth} frames`);
console.log(`Output: ${baseOutDir}/{courseId}/`);
console.log(`Estimated time: ~${totalEstimate} minutes`);
console.log('='.repeat(60));
console.log('');

const startTime = Date.now();
const results: { module: number; success: boolean; duration: number; error?: string }[] = [];

for (const moduleNumber of moduleNumbers) {
	const moduleStartTime = Date.now();
	const compositionId = `module-${moduleNumber}`;
	const suffix = presetName !== 'normal' && presetName !== 'max' ? `-${presetName}` : '';
	
	// Get courseId for this module
	const moduleData = allModules.find(m => m.moduleNumber === moduleNumber);
	const courseId = moduleData?.courseId || 'default';
	
	// Create course-specific output directory
	const outDir = path.join(baseOutDir, courseId);
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}
	
	const outputPath = path.join(outDir, `${compositionId}${suffix}.mp4`);
	
	console.log(`\n[${'='.repeat(50)}]`);
	console.log(`Rendering Module ${moduleNumber}...`);
	console.log(`Output: ${outputPath}`);
	console.log(`Started at: ${new Date().toLocaleTimeString()}`);
	
	try {
		// Build render command with all options
		let cmd = `npx remotion render src/index.tsx ${compositionId} "${outputPath}"`;
		cmd += ` --concurrency=${concurrency}`;
		cmd += ` --jpeg-quality=${quality}`;
		if (scale !== 1) cmd += ` --scale=${scale}`;
		if (muted) cmd += ` --muted`;
		if (everyNth) cmd += ` --every-nth-frame=${everyNth}`;
		
		// Run render with inherited stdio so we can see progress
		try {
			execSync(cmd, { 
				cwd: path.join(__dirname, '..'),
				stdio: 'inherit',
				timeout: 0 // No timeout
			});
		} catch (execError: any) {
			// On Windows, EPERM errors can occur when Remotion tries to kill child processes
			// even if the render actually succeeded. Check if output file exists.
			if (execError.code === 'EPERM' || execError.message?.includes('EPERM')) {
				// Wait a moment for file system to catch up
				setTimeout(() => {}, 1000);
				
				// Check if the output file was actually created
				if (fs.existsSync(outputPath)) {
					const fileSize = fs.statSync(outputPath).size;
					if (fileSize > 0) {
						console.log(`\n⚠️  Warning: EPERM error occurred, but output file was created successfully`);
						console.log(`   This is a known Windows issue with process cleanup.`);
						// Continue as success
					} else {
						throw execError; // File exists but is empty, treat as failure
					}
				} else {
					throw execError; // File doesn't exist, treat as failure
				}
			} else {
				throw execError; // Not an EPERM error, re-throw
			}
		}
		
		const duration = Math.round((Date.now() - moduleStartTime) / 1000);
		const fileSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
		
		if (fileSize === 0) {
			throw new Error('Output file is empty or was not created');
		}
		
		console.log(`\nModule ${moduleNumber} completed in ${duration}s`);
		console.log(`File size: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);
		
		results.push({ module: moduleNumber, success: true, duration });
		
	} catch (error: any) {
		const duration = Math.round((Date.now() - moduleStartTime) / 1000);
		const fileSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
		
		// If file was created despite error, it might still be valid
		if (fileSize > 0 && (error.code === 'EPERM' || error.message?.includes('EPERM'))) {
			console.log(`\n⚠️  Module ${moduleNumber} had EPERM error but file was created (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);
			console.log(`   Treating as success (Windows process cleanup issue)`);
			results.push({ module: moduleNumber, success: true, duration });
		} else {
			console.error(`\nModule ${moduleNumber} FAILED after ${duration}s`);
			console.error(`Error: ${error.message}`);
			
			results.push({ module: moduleNumber, success: false, duration, error: error.message });
		}
	}
}

// Print summary
const totalDuration = Math.round((Date.now() - startTime) / 1000);
const successful = results.filter(r => r.success).length;
const failed = results.filter(r => !r.success).length;

console.log('\n');
console.log('='.repeat(60));
console.log('BATCH RENDER COMPLETE');
console.log('='.repeat(60));
console.log(`Total time: ${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`);
console.log(`Successful: ${successful}/${moduleNumbers.length}`);
console.log(`Failed: ${failed}/${moduleNumbers.length}`);
console.log('');

if (failed > 0) {
	console.log('Failed modules:');
	results.filter(r => !r.success).forEach(r => {
		console.log(`  - Module ${r.module}: ${r.error}`);
	});
}

console.log('\nOutput files:');
results.filter(r => r.success).forEach(r => {
	const moduleData = allModules.find(m => m.moduleNumber === r.module);
	const courseId = moduleData?.courseId || 'default';
	const rOutDir = path.join(baseOutDir, courseId);
	const suffix = presetName !== 'normal' && presetName !== 'max' ? `-${presetName}` : '';
	const filePath = path.join(rOutDir, `module-${r.module}${suffix}.mp4`);
	const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
	console.log(`  - module-${r.module}${suffix}.mp4 (${(fileSize / 1024 / 1024).toFixed(1)} MB) - ${r.duration}s`);
});

console.log('='.repeat(60));

process.exit(failed > 0 ? 1 : 0);
