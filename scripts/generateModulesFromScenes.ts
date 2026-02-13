// Generate Remotion modules from pre-built course scene components
// Uses the course's own scene components (Intro, Diagram1-3, Recap) instead of generic slides
// Run: npx tsx scripts/generateModulesFromScenes.ts [courseId] [moduleRange]

import * as fs from "fs";
import * as path from "path";

interface ModuleScene {
	name: string;
	component: string;
	importPath: string;
}

interface CourseConfig {
	courseId: string;
	modulesPath: string;
	scenesPath: string;
	audioPath: string;
	timingsPath: string;
}

// Get audio duration from audioDuration.ts
function getAudioDurations(courseId: string): Record<string, number> {
	const durationPath = path.join(__dirname, "../src/utils/audioDuration.ts");
	if (!fs.existsSync(durationPath)) {
		console.warn("audioDuration.ts not found, using defaults");
		return {};
	}

	const content = fs.readFileSync(durationPath, "utf-8");
	const durations: Record<string, number> = {};

	// Parse the audioDurations object
	const match = content.match(/export const audioDurations.*?=\s*\{([\s\S]*?)\};/);
	if (match) {
		const entries = match[1].matchAll(/"([^"]+)":\s*([\d.]+)/g);
		for (const entry of entries) {
			if (entry[1].startsWith(courseId)) {
				durations[entry[1]] = parseFloat(entry[2]);
			}
		}
	}

	return durations;
}

// Parse timings JSON for cue points
function getTimings(courseId: string, moduleNumber: number): Record<string, any> {
	const timingsPath = path.join(__dirname, "../courses", courseId, "timings", `module${moduleNumber}.json`);
	if (!fs.existsSync(timingsPath)) {
		return {};
	}
	try {
		return JSON.parse(fs.readFileSync(timingsPath, "utf-8"));
	} catch {
		return {};
	}
}

// Convert word timings to cuePoints (frame indices)
// cuePoints are frame indices where key animations should trigger
function convertTimingsToCuePoints(
	timings: Record<string, any>,
	sceneName: string,
	audioFiles: Array<{ key: string; duration: number }>,
	fps: number
): number[] {
	const cuePoints: number[] = [];
	
	if (!timings.slides) {
		return cuePoints;
	}

	// Map scene name to slide name patterns
	const slidePatterns: Record<string, string[]> = {
		intro: ["title"],
		diagram1: ["concept"],
		diagram2: ["architecture"],
		diagram3: ["application"],
		recap: ["recap", "exam-mapping"],
	};

	const patterns = slidePatterns[sceneName] || [];
	let cumulativeOffset = 0; // Track offset for sequential audio files
	
	// Process each audio file in order
	for (const audioFile of audioFiles) {
		// Extract slide name from audio file key
		// Audio key format: "module1-module-1-title" or "agentic-ai-for-beginners/module1-module-1-title"
		// Timings slide format: "module-1-title"
		const keyParts = audioFile.key.split("/");
		const keyName = keyParts[keyParts.length - 1]; // Get last part
		
		// Match patterns like "module1-module-1-title" -> "module-1-title"
		const slideNameMatch = keyName.match(/module\d+-module-(\d+)-(.+)/);
		if (!slideNameMatch) continue;
		
		const moduleNum = slideNameMatch[1];
		const slidePart = slideNameMatch[2];
		const slideName = `module-${moduleNum}-${slidePart}`;
		const slideData = timings.slides[slideName];
		
		if (!slideData) continue;
		
		const words = (slideData as any).words || [];
		
		// Convert word start times to frame indices (relative to scene start)
		// Use every 5th word to avoid too many cue points
		for (let i = 0; i < words.length; i += 5) {
			const word = words[i];
			if (word && typeof word.start === 'number') {
				// Add cumulative offset for sequential audio files
				const frameIndex = Math.floor((word.start + cumulativeOffset) * fps);
				cuePoints.push(frameIndex);
			}
		}
		
		// Update cumulative offset for next audio file
		cumulativeOffset += audioFile.duration;
	}

	// Sort and deduplicate
	return [...new Set(cuePoints)].sort((a, b) => a - b);
}

// Find scene components for a module
function findSceneComponents(coursePath: string, moduleNumber: number): ModuleScene[] {
	// Try both module01 and module1 formats
	const paddedNum = moduleNumber.toString().padStart(2, "0");
	let moduleDir = path.join(coursePath, "course", "remotion", "scenes", `module${paddedNum}`);
	let folderName = `module${paddedNum}`;
	
	if (!fs.existsSync(moduleDir)) {
		// Try without padding
		moduleDir = path.join(coursePath, "course", "remotion", "scenes", `module${moduleNumber}`);
		folderName = `module${moduleNumber}`;
		
		if (!fs.existsSync(moduleDir)) {
			console.warn(`Scene directory not found: ${moduleDir}`);
			return [];
		}
	}

	const scenes: ModuleScene[] = [];
	const files = fs.readdirSync(moduleDir).filter(f => f.endsWith(".tsx") && f !== "index.ts");

	// Sort scenes in order: Intro, Diagram1, Diagram2, Diagram3, Recap
	const order = ["Intro", "Diagram1", "Diagram2", "Diagram3", "Recap"];
	files.sort((a, b) => {
		const aOrder = order.findIndex(o => a.includes(o));
		const bOrder = order.findIndex(o => b.includes(o));
		return aOrder - bOrder;
	});

	for (const file of files) {
		const componentName = file.replace(".tsx", "");
		// Extract scene name (intro, diagram1, etc.)
		const sceneNameMatch = componentName.match(/Module\d+(Intro|Diagram\d|Recap)/i);
		const sceneName = sceneNameMatch ? sceneNameMatch[1].toLowerCase() : componentName.toLowerCase();
		
		scenes.push({
			name: sceneName,
			component: componentName,
			importPath: `../../courses/${path.basename(coursePath)}/course/remotion/scenes/${folderName}/${componentName}`,
		});
	}

	console.log(`  Found ${scenes.length} scenes for module ${moduleNumber}: ${scenes.map(s => s.name).join(", ")}`);
	return scenes;
}

// Scene to audio file mapping
interface SceneAudioMapping {
	sceneName: string;
	audioFiles: Array<{ key: string; duration: number }>; // List of audio files with durations
	totalDuration: number;
}

// Map audio file names to scene names
function mapAudioToScenes(
	scenes: ModuleScene[],
	audioDurations: Record<string, number>,
	courseId: string,
	moduleNumber: number
): SceneAudioMapping[] {
	// For this course, each module has 5 scenes (Intro, Diagram1-3, Recap)
	// Audio is per-slide from moduleContent.ts
	// We need to map audio files to scenes

	const sceneMap: Record<string, { audioFiles: Array<{ key: string; duration: number }>; totalDuration: number }> = {
		intro: { audioFiles: [], totalDuration: 0 },
		diagram1: { audioFiles: [], totalDuration: 0 },
		diagram2: { audioFiles: [], totalDuration: 0 },
		diagram3: { audioFiles: [], totalDuration: 0 },
		recap: { audioFiles: [], totalDuration: 0 },
	};

	const prefix = `${courseId}/module${moduleNumber}-`;

	// Group audio by scene type
	// First pass: collect all audio files and identify duplicates
	const allAudioFiles: Array<{ key: string; slideName: string; duration: number; isPart: boolean; baseName: string }> = [];
	
	for (const [key, duration] of Object.entries(audioDurations)) {
		if (key.startsWith(prefix)) {
			const slideName = key.replace(prefix, "").replace(`module-${moduleNumber}-`, "");
			const audioKey = key.replace(`${courseId}/`, "");
			const isPart = slideName.includes("-part");
			const baseName = slideName.replace(/-part\d+$/, "");
			
			allAudioFiles.push({ key: audioKey, slideName, duration, isPart, baseName });
		}
	}
	
	// Second pass: filter duplicates - prefer full files over parts
	// Strategy: For each base slide name, if both full and parts exist, use only the full file
	const slideGroups = new Map<string, { full?: typeof allAudioFiles[0]; parts: typeof allAudioFiles[] }>();
	
	// Group by base name
	for (const audioFile of allAudioFiles) {
		if (!slideGroups.has(audioFile.baseName)) {
			slideGroups.set(audioFile.baseName, { parts: [] });
		}
		const group = slideGroups.get(audioFile.baseName)!;
		if (audioFile.isPart) {
			group.parts.push(audioFile);
		} else {
			group.full = audioFile;
		}
	}
	
	// Third pass: add to scene map, preferring full over parts
	// Also verify files actually exist before including them
	const audioPath = path.join(__dirname, "../public/audio", courseId);
	
	for (const [baseName, group] of slideGroups.entries()) {
		let filesToUse: typeof allAudioFiles;
		
		if (group.full) {
			// Check if full file actually exists
			const fullFilePath = path.join(audioPath, `${group.full.key}.wav`);
			if (fs.existsSync(fullFilePath)) {
				// Full file exists - use only full, skip all parts
				filesToUse = [group.full];
				if (group.parts.length > 0) {
					console.log(`  Using full file for ${baseName}, skipping ${group.parts.length} part file(s)`);
				}
			} else {
				// Full file doesn't exist - check if parts exist
				const existingParts = group.parts.filter(part => {
					const partFilePath = path.join(audioPath, `${part.key}.wav`);
					return fs.existsSync(partFilePath);
				});
				if (existingParts.length > 0) {
					filesToUse = existingParts.sort((a, b) => {
						const aNum = parseInt(a.slideName.match(/-part(\d+)$/)?.[1] || "0");
						const bNum = parseInt(b.slideName.match(/-part(\d+)$/)?.[1] || "0");
						return aNum - bNum;
					});
					console.warn(`  Warning: Full file for ${baseName} not found, using ${existingParts.length} part file(s)`);
				} else {
					console.warn(`  Warning: No audio files found for ${baseName} (full or parts)`);
					continue; // Skip this slide - no audio files exist
				}
			}
		} else if (group.parts.length > 0) {
			// Only parts exist - verify they actually exist
			const existingParts = group.parts.filter(part => {
				const partFilePath = path.join(audioPath, `${part.key}.wav`);
				return fs.existsSync(partFilePath);
			});
			if (existingParts.length > 0) {
				filesToUse = existingParts.sort((a, b) => {
					const aNum = parseInt(a.slideName.match(/-part(\d+)$/)?.[1] || "0");
					const bNum = parseInt(b.slideName.match(/-part(\d+)$/)?.[1] || "0");
					return aNum - bNum;
				});
			} else {
				console.warn(`  Warning: Part files for ${baseName} listed in audioDuration.ts but files don't exist`);
				continue; // Skip this slide - no audio files exist
			}
		} else {
			continue; // Should not happen
		}
		
		// Map slide names to scene names
		for (const audioFile of filesToUse) {
			if (baseName.includes("title")) {
				sceneMap.intro.audioFiles.push({ key: audioFile.key, duration: audioFile.duration });
				sceneMap.intro.totalDuration += audioFile.duration;
			} else if (baseName.includes("concept")) {
				sceneMap.diagram1.audioFiles.push({ key: audioFile.key, duration: audioFile.duration });
				sceneMap.diagram1.totalDuration += audioFile.duration;
			} else if (baseName.includes("architecture")) {
				sceneMap.diagram2.audioFiles.push({ key: audioFile.key, duration: audioFile.duration });
				sceneMap.diagram2.totalDuration += audioFile.duration;
			} else if (baseName.includes("application")) {
				sceneMap.diagram3.audioFiles.push({ key: audioFile.key, duration: audioFile.duration });
				sceneMap.diagram3.totalDuration += audioFile.duration;
			} else if (baseName.includes("recap") || baseName.includes("exam")) {
				sceneMap.recap.audioFiles.push({ key: audioFile.key, duration: audioFile.duration });
				sceneMap.recap.totalDuration += audioFile.duration;
			}
		}
	}

	// Convert to array matching scene order
	return scenes.map(scene => ({
		sceneName: scene.name,
		audioFiles: sceneMap[scene.name]?.audioFiles || [],
		totalDuration: sceneMap[scene.name]?.totalDuration || 30,
	}));
}

function generateModuleFromScenes(
	courseId: string,
	moduleNumber: number,
	coursePath: string
): string {
	const scenes = findSceneComponents(coursePath, moduleNumber);
	const audioDurations = getAudioDurations(courseId);
	const sceneAudioMappings = mapAudioToScenes(scenes, audioDurations, courseId, moduleNumber);
	const timings = getTimings(courseId, moduleNumber);

	if (scenes.length === 0) {
		throw new Error(`No scene components found for module ${moduleNumber}`);
	}

	// Generate imports
	const imports = [
		'import React from "react";',
		'import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";',
		'import { getAudioDuration } from "../utils/audioDuration";',
		...scenes.map(s => `import { ${s.component} } from "${s.importPath}";`),
	];

	// Generate audio file references - use only the audio files that are actually used in scenes
	// This prevents including duplicate part files when full files exist
	// Also verify files actually exist before including them
	const audioFilesList: string[] = [];
	const usedAudioKeys = new Set<string>();
	
	// Collect all audio keys used in scene mappings
	for (const mapping of sceneAudioMappings) {
		for (const audioFile of mapping.audioFiles) {
			usedAudioKeys.add(audioFile.key);
		}
	}
	
	// Verify files exist before including them
	const audioPath = path.join(__dirname, "../public/audio", courseId);
	const existingAudioKeys = new Set<string>();
	
	for (const audioKey of usedAudioKeys) {
		const audioFilePath = path.join(audioPath, `${audioKey}.wav`);
		if (fs.existsSync(audioFilePath)) {
			existingAudioKeys.add(audioKey);
		} else {
			console.warn(`  Warning: Audio file not found, skipping: ${audioKey}.wav`);
		}
	}
	
	console.log(`  Audio keys for module ${moduleNumber}: ${existingAudioKeys.size} files (${usedAudioKeys.size} requested, ${Object.keys(audioDurations).filter(k => k.startsWith(`${courseId}/module${moduleNumber}-`)).length} in duration list)`);
	
	// Only include audio files that actually exist
	for (const audioKey of Array.from(existingAudioKeys).sort()) {
		audioFilesList.push(`\t\t"${audioKey}": staticFile("audio/${courseId}/${audioKey}.wav"),`);
	}
	audioFilesList.push(`\t\twhoosh: staticFile("audio/whoosh.wav"),`);
	
	// Log audio mapping for debugging
	console.log(`  Scene audio mapping:`);
	for (const mapping of sceneAudioMappings) {
		const fileNames = mapping.audioFiles.map(f => f.key.split("/").pop()).join(", ");
		console.log(`    ${mapping.sceneName}: ${mapping.audioFiles.length} files (${fileNames}), ${mapping.totalDuration.toFixed(1)}s`);
	}

	// Generate scene sequences with audio
	let currentFrame = 0;
	const fps = 30;
	const sequences: string[] = [];

	for (let i = 0; i < scenes.length; i++) {
		const scene = scenes[i];
		const mapping = sceneAudioMappings[i];
		
		// Calculate total duration ensuring all sequential audio files fit
		// For sequential audio, we need: sum of all durations + small buffer
		let totalAudioDuration = 0;
		for (const audioFile of mapping.audioFiles) {
			totalAudioDuration += audioFile.duration;
		}
		const duration = totalAudioDuration > 0 ? totalAudioDuration : (mapping.totalDuration || 30);
		// Add 0.5s buffer to ensure audio doesn't get cut off
		const durationWithBuffer = duration + 0.5;
		const durationInFrames = Math.ceil(durationWithBuffer * fps);

		// Generate cuePoints from word timings for this scene
		const cuePoints = convertTimingsToCuePoints(timings, scene.name, mapping.audioFiles, fps);
		const cuePointsStr = cuePoints.length > 0 
			? `[${cuePoints.join(", ")}]` 
			: "[]";
		
		if (cuePoints.length > 0) {
			console.log(`    ${scene.name}: Generated ${cuePoints.length} cuePoints`);
		}

		const hasAudio = mapping.audioFiles.length > 0;
		
		// For single audio file: put Audio inside Scene Sequence
		// For multiple audio files: create separate Scene Sequence for EACH audio (matching duration)
		if (mapping.audioFiles.length === 1) {
			// Single audio - include it in the scene Sequence
			const audioFile = mapping.audioFiles[0];
			sequences.push(`
		{/* ${scene.component} */}
		<Sequence
			from={${currentFrame}}
			durationInFrames={${durationInFrames}}
		>
			<${scene.component}
				durationInFrames={${durationInFrames}}
				cuePoints={${cuePointsStr}}
			/>
			<Audio src={audioFiles["${audioFile.key}"]} />
		</Sequence>`);
			// Update currentFrame for single audio case
			currentFrame += durationInFrames;
		} else if (mapping.audioFiles.length > 1) {
			// Multiple audio files - create separate Scene Sequence for EACH audio
			// Each Scene Sequence matches its audio duration (like single audio scenes)
			let audioStartFrame = 0;
			
			for (let idx = 0; idx < mapping.audioFiles.length; idx++) {
				const audioFile = mapping.audioFiles[idx];
				const audioDurationFrames = Math.ceil(audioFile.duration * fps);
				
				// Generate cuePoints for this specific audio (slice from full cuePoints)
				// For now, use all cuePoints but they'll be relative to this audio's start
				const audioCuePoints = idx === 0 ? cuePoints : []; // Only first audio gets cuePoints for now
				const audioCuePointsStr = audioCuePoints.length > 0 
					? `[${audioCuePoints.join(", ")}]` 
					: "[]";
				
				// Create Scene Sequence matching this audio's duration
				sequences.push(`
		{/* ${scene.component} - ${audioFile.key.split("/").pop()} */}
		<Sequence
			from={${currentFrame + audioStartFrame}}
			durationInFrames={${audioDurationFrames}}
		>
			<${scene.component}
				durationInFrames={${audioDurationFrames}}
				cuePoints={${audioCuePointsStr}}
			/>
			<Audio src={audioFiles["${audioFile.key}"]} />
		</Sequence>`);
				
				audioStartFrame += audioDurationFrames;
			}
			
			// Log audio timing for debugging
			console.log(`    ${scene.name}: Sequential scenes - ${mapping.audioFiles.length} files, total ${totalAudioDuration.toFixed(1)}s`);
			console.log(`      Scene frames: ${mapping.audioFiles.map(f => Math.ceil(f.duration * fps)).join(" + ")} = ${audioStartFrame} frames`);
			
			// Update currentFrame using total audio duration (not durationWithBuffer)
			// Each Scene Sequence already accounts for its audio duration
			currentFrame += audioStartFrame;
		} else {
			// No audio - just the scene
			sequences.push(`
		{/* ${scene.component} */}
		<Sequence
			from={${currentFrame}}
			durationInFrames={${durationInFrames}}
		>
			<${scene.component}
				durationInFrames={${durationInFrames}}
				cuePoints={${cuePointsStr}}
			/>
		</Sequence>`);
			// Update currentFrame for single audio and no audio cases
			currentFrame += durationInFrames;
		}

		// Add whoosh transition between scenes (except after last)
		if (i < scenes.length - 1) {
			const whooshFrames = Math.ceil(0.57 * fps);
			sequences.push(`
		{/* Transition */}
		<Sequence from={${currentFrame}} durationInFrames={${whooshFrames}}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>`);
			currentFrame += whooshFrames;
		}
	}

	// Generate the full module component
	const moduleCode = `${imports.join("\n")}

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: ${courseId}, Module: ${moduleNumber}
export const Module${moduleNumber}: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
${audioFilesList.join("\n")}
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				position: "relative",
			}}
		>
${sequences.join("\n")}
		</div>
	);
};
`;

	return moduleCode;
}

// Main execution
async function main() {
	const courseId = process.argv[2];
	const moduleRange = process.argv[3];

	if (!courseId) {
		console.error("Usage: npx tsx scripts/generateModulesFromScenes.ts <courseId> [moduleRange]");
		console.error("Example: npx tsx scripts/generateModulesFromScenes.ts agentic-ai-for-beginners 1-6");
		process.exit(1);
	}

	const coursePath = path.join(__dirname, "../courses", courseId);
	if (!fs.existsSync(coursePath)) {
		console.error(`Course not found: ${coursePath}`);
		process.exit(1);
	}

	// Parse module range
	let modules: number[] = [];
	if (moduleRange) {
		if (moduleRange.includes("-")) {
			const [start, end] = moduleRange.split("-").map(Number);
			for (let i = start; i <= end; i++) modules.push(i);
		} else {
			modules = moduleRange.split(",").map(Number);
		}
	} else {
		// Default to modules 1-6
		modules = [1, 2, 3, 4, 5, 6];
	}

	console.log(`Generating modules from scene components for: ${courseId}`);
	console.log(`Modules: ${modules.join(", ")}`);

	const outputDir = path.join(__dirname, "../src/videos");
	let generated = 0;
	let failed = 0;

	for (const moduleNumber of modules) {
		try {
			const outputPath = path.join(outputDir, `Module${moduleNumber}.tsx`);
			const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf-8") : "";

			if (existing && /\/\/\s*PRESERVE_MANUAL_EDITS/i.test(existing)) {
				console.log(`  Skipped Module${moduleNumber}.tsx (PRESERVE_MANUAL_EDITS)`);
				continue;
			}

			const code = generateModuleFromScenes(courseId, moduleNumber, coursePath);

			if (existing) {
				const backupPath = outputPath.replace(".tsx", `.backup.${Date.now()}.tsx`);
				fs.copyFileSync(outputPath, backupPath);
				console.log(`  Backed up existing Module${moduleNumber}.tsx`);
			}

			fs.writeFileSync(outputPath, code);
			console.log(`Generated Module${moduleNumber}.tsx using scene components`);
			generated++;
		} catch (error) {
			console.error(`Failed to generate Module ${moduleNumber}:`, error);
			failed++;
		}
	}

	console.log(`\nSummary: ${generated} generated, ${failed} failed`);

	if (generated > 0) {
		console.log("\nNext steps:");
		console.log("1. Review generated modules in src/videos/");
		console.log("2. Run Remotion preview: npm run dev");
		console.log("3. Render videos: npm run render");
	}
}

main().catch(console.error);
