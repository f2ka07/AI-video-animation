// Extract word timings using Montreal Forced Aligner (MFA) forced alignment.
// Best accuracy for TTS + exact script; requires local MFA install (conda).

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { saveSlideTimings, loadModuleTimings } from "./saveTimingsJson";
import { parseModuleContent, ModuleContent } from "./parseModuleContent";
import { validateSlideTimings } from "./validateWordTimingsQuality";
import { createRequire } from "module";
import { alignTimingsToScript } from "./lib/wordAlignment";

const require = createRequire(import.meta.url);
const { resolveMfaCli, formatMfaInstallHelp } = require("./lib/resolveMfa.js");
const { callMfaAlignSingle } = require("./lib/mfaClient.js");
const { bootstrapMfaDockerForExtraction } = require("./lib/mfaDocker.js");
const {
	countModuleAudioFiles,
	formatMissingAudioHelp,
} = require("./lib/timingAudioCheck.js");

dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.stdout.isTTY && (process.stdout as any)._handle?.setBlocking) {
	(process.stdout as any)._handle.setBlocking(true);
}

console.log("Starting MFA word timing extraction...");

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

let mfaBin = "mfa";
let mfaMode: string = "local";
let mfaDictionary = "english_us_arpa";
let mfaAcousticModel = "english_mfa";

function parseModuleRange(input: string, allModules: Array<{ moduleNumber: number }>): number[] {
	if (input === "all" || !input) {
		return allModules.map((m) => m.moduleNumber);
	}

	const modules: number[] = [];
	const parts = input.split(",");

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed.includes("-")) {
			const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
			if (isNaN(start) || isNaN(end)) {
				throw new Error(`Invalid range: ${trimmed}`);
			}
			for (let i = start; i <= end; i++) {
				modules.push(i);
			}
		} else {
			const num = parseInt(trimmed);
			if (isNaN(num)) {
				throw new Error(`Invalid module number: ${trimmed}`);
			}
			modules.push(num);
		}
	}

	return [...new Set(modules)].sort((a, b) => a - b);
}

async function callMfaAPI(
	audioPath: string,
	transcript: string,
	slideName: string
): Promise<WordTiming[]> {
	console.log(`   Running MFA align_one (typically 30-120 seconds)...`);

	const rawWords = await callMfaAlignSingle(audioPath, transcript, slideName, {
		bin: mfaBin,
		mode: mfaMode,
		dictionary: mfaDictionary,
		acousticModel: mfaAcousticModel,
	});
	return alignTimingsToScript(transcript, rawWords);
}

function calculateTranscriptMatch(transcript: string, script: string): number {
	const normalize = (text: string): string[] => {
		return text
			.toLowerCase()
			.replace(/[^\w\s]/g, " ")
			.split(/\s+/)
			.filter((w) => w.length > 0);
	};

	const transcriptWords = normalize(transcript);
	const scriptWords = normalize(script);

	if (scriptWords.length === 0) return 1.0;

	let matches = 0;
	let transcriptIndex = 0;

	for (const scriptWord of scriptWords) {
		let found = false;
		for (let i = transcriptIndex; i < Math.min(transcriptIndex + 5, transcriptWords.length); i++) {
			if (transcriptWords[i] === scriptWord) {
				matches++;
				transcriptIndex = i + 1;
				found = true;
				break;
			}
		}
		if (!found) {
			for (let i = transcriptIndex; i < Math.min(transcriptIndex + 5, transcriptWords.length); i++) {
				if (transcriptWords[i].slice(0, 3) === scriptWord.slice(0, 3)) {
					matches++;
					transcriptIndex = i + 1;
					break;
				}
			}
		}
	}

	return matches / scriptWords.length;
}

async function loadModulesFromScripts(courseId: string): Promise<Array<ModuleContent & { courseId: string }>> {
	const scriptsDir = path.join(__dirname, "../courses", courseId, "course/scripts");
	if (!fs.existsSync(scriptsDir)) {
		return [];
	}

	const scriptFiles = fs
		.readdirSync(scriptsDir)
		.filter((f) => f.match(/^module\d+\.txt$/i))
		.sort((a, b) => {
			const numA = parseInt(a.match(/\d+/)?.[0] || "0");
			const numB = parseInt(b.match(/\d+/)?.[0] || "0");
			return numA - numB;
		});

	if (scriptFiles.length === 0) {
		return [];
	}

	const modules: Array<ModuleContent & { courseId: string }> = [];
	const sectionToSlideName: Record<string, string> = {
		"CINEMATIC INTRO": "module-{N}-title",
		CONCEPT: "module-{N}-concept",
		ARCHITECTURE: "module-{N}-architecture",
		APPLICATION: "module-{N}-application",
		"EXAM MAPPING": "module-{N}-exam-mapping",
		RECAP: "module-{N}-recap",
	};

	for (const file of scriptFiles) {
		const moduleNumber = parseInt(file.match(/\d+/)?.[0] || "0");
		if (moduleNumber === 0) continue;

		const scriptPath = path.join(scriptsDir, file);
		const content = fs.readFileSync(scriptPath, "utf-8");
		const slides: Array<{ name: string; type: string; script: string; title?: string }> = [];
		const sectionRegex = /\[([^\]]+)\]\s*\n([\s\S]*?)(?=\n---|\n\[|$)/g;
		let match;
		while ((match = sectionRegex.exec(content)) !== null) {
			const sectionName = match[1].trim();
			const sectionText = match[2].trim();
			if (!sectionText) continue;

			const slideNameTemplate = sectionToSlideName[sectionName];
			if (!slideNameTemplate) continue;

			const slideName = slideNameTemplate.replace("{N}", moduleNumber.toString());
			const slideType = sectionName === "CINEMATIC INTRO" ? "title" : "content-two-card";
			slides.push({
				name: slideName,
				type: slideType,
				script: sectionText,
				title: sectionName === "CINEMATIC INTRO" ? `Module ${moduleNumber} Title` : sectionName,
			});
		}

		if (slides.length > 0) {
			const firstLine = content.split("\n")[0];
			const titleMatch = firstLine.match(/Module\s+\d+:\s*(.+)/i);
			const title = titleMatch ? titleMatch[1].trim() : `Module ${moduleNumber}`;
			modules.push({
				moduleNumber,
				courseId,
				title,
				subtitle: `Module ${moduleNumber}`,
				slides: slides as any,
			});
		}
	}

	return modules;
}

async function extractWordTimingsFromContentMfa(moduleRange?: string, courseIdFilter?: string) {
	const baseAudioDir = path.join(__dirname, "../public/audio");

	console.log("Checking MFA availability (local CLI or Docker)...");
	const mfaResolution = await resolveMfaCli({ pull: false, timeoutMs: 20000 });
	if (!mfaResolution.available) {
		console.error(`❌ ${formatMfaInstallHelp()}`);
		if (mfaResolution.error) {
			console.error(`\nLocal: ${mfaResolution.error}`);
		}
		if (mfaResolution.dockerError) {
			console.error(`Docker: ${mfaResolution.dockerError}`);
		}
		if (mfaResolution.dockerHelp) {
			console.error(`\n${mfaResolution.dockerHelp}`);
		}
		process.exit(1);
	}

	mfaBin = mfaResolution.bin;
	mfaDictionary = mfaResolution.dictionary;
	mfaAcousticModel = mfaResolution.acousticModel;
	mfaMode = mfaResolution.mode || 'local';

	if (mfaMode === 'docker') {
		console.log('Preparing MFA Docker volume (one-time per run, not per slide)...');
		await bootstrapMfaDockerForExtraction();
	}

	console.log("Loading course modules...");
	const { allModules } = await import("../src/videos/moduleContent");

	let filteredModules: Array<ModuleContent & { courseId?: string }> = [];

	if (courseIdFilter) {
		filteredModules = allModules.filter((m) => m.courseId === courseIdFilter);

		if (filteredModules.length === 0) {
			const contentJsonPath = path.join(__dirname, "../courses", courseIdFilter, "content.json");
			if (fs.existsSync(contentJsonPath)) {
				console.log(`   Course not in moduleContent.ts, loading from content.json...`);
				const modulesFromJson = parseModuleContent(contentJsonPath);
				filteredModules = modulesFromJson.map((m) => ({ ...m, courseId: courseIdFilter }));
				console.log(`   Loaded ${filteredModules.length} module(s) from content.json`);
			} else {
				const scriptsDir = path.join(__dirname, "../courses", courseIdFilter, "course/scripts");
				if (fs.existsSync(scriptsDir)) {
					filteredModules = await loadModulesFromScripts(courseIdFilter);
					if (filteredModules.length === 0) {
						console.error(`❌ Could not load modules from scripts for course: ${courseIdFilter}`);
						process.exit(1);
					}
					console.log(`   Loaded ${filteredModules.length} module(s) from script files`);
				} else {
					console.error(`❌ No modules found for course: ${courseIdFilter}`);
					process.exit(1);
				}
			}
		} else {
			console.log(`   Found ${filteredModules.length} module(s) in moduleContent.ts for course: ${courseIdFilter}`);
		}
	} else {
		filteredModules = allModules;
	}

	let modulesToProcess = filteredModules;
	if (moduleRange) {
		try {
			const moduleNumbers = parseModuleRange(moduleRange, allModules);
			modulesToProcess = filteredModules.filter((m) => moduleNumbers.includes(m.moduleNumber));
			if (modulesToProcess.length === 0) {
				throw new Error(`No modules found for: ${moduleRange}${courseIdFilter ? ` in course ${courseIdFilter}` : ""}`);
			}
		} catch (error: any) {
			console.error(`❌ Error: ${error.message}`);
			process.exit(1);
		}
	}

	console.log("Extracting word timings using Montreal Forced Aligner (MFA)...\n");
	if (mfaResolution.mode === 'docker') {
		console.log(`MFA via Docker: ${mfaResolution.image || 'mmcauliffe/montreal-forced-aligner:latest'}`);
		if (mfaResolution.fallbackFromLocal && mfaResolution.localError) {
			console.log(`   (local mfa unavailable: ${mfaResolution.localError})`);
		}
	} else {
		console.log(`MFA: ${mfaBin} (${mfaResolution.version || "unknown version"})`);
	}
	console.log(`Dictionary: ${mfaDictionary}, Acoustic model: ${mfaAcousticModel}`);
	console.log(`Processing ${modulesToProcess.length} module(s)...\n`);

	let totalProcessed = 0;
	let totalSkipped = 0;

	for (const module of modulesToProcess) {
		console.log(`\n=== Module ${module.moduleNumber}: ${module.title} ===`);

		const courseId = module.courseId || "default";
		const audioDir = path.join(baseAudioDir, courseId);
		const audioCount = countModuleAudioFiles(audioDir, module.moduleNumber);
		if (audioCount === 0) {
			console.error(`\n${formatMissingAudioHelp(courseId, module.moduleNumber, audioDir)}\n`);
			totalSkipped += module.slides.length;
			continue;
		}
		console.log(`   Found ${audioCount} audio file(s) for module ${module.moduleNumber}`);

		const existingTimings = loadModuleTimings(courseId, module.moduleNumber, module.title);

		for (const slide of module.slides) {
			const audioPath = path.join(audioDir, `module${module.moduleNumber}-${slide.name}.wav`);
			if (!fs.existsSync(audioPath)) {
				console.log(`⚠ Skipping ${slide.name}: audio file not found`);
				totalSkipped++;
				continue;
			}

			const existingSlideTimings = existingTimings.slides[slide.name];
			if (existingSlideTimings?.words?.length) {
				const validation = validateSlideTimings(slide.name, existingSlideTimings.words);
				const qualityScore = validation.qualityScore;
				let transcriptMatch = 1.0;
				if (slide.script?.trim()) {
					const transcriptText = existingSlideTimings.words.map((w) => w.text).join(" ");
					transcriptMatch = calculateTranscriptMatch(transcriptText, slide.script);
				}

				if (qualityScore >= 80 && transcriptMatch >= 0.8) {
					console.log(
						`⏭ Skipping ${slide.name}: timings already exist with good quality (${existingSlideTimings.words.length} words, structural: ${qualityScore.toFixed(1)}%, transcript match: ${(transcriptMatch * 100).toFixed(1)}%)`
					);
					totalSkipped++;
					continue;
				}

				console.log(`⚠ Re-extracting ${slide.name}: existing timings have poor quality`);
			}

			if (!slide.script?.trim()) {
				console.log(`⚠ Skipping ${slide.name}: no script text (required for MFA)`);
				totalSkipped++;
				continue;
			}

			try {
				console.log(`Processing ${slide.name}...`);
				console.log(`   Audio: ${path.basename(audioPath)}`);
				console.log(`   Script length: ${slide.script.length} characters`);

				const words = await callMfaAPI(audioPath, slide.script, slide.name);
				if (words.length === 0) {
					console.log(`⚠ No words extracted for ${slide.name}`);
					totalSkipped++;
					continue;
				}

				saveSlideTimings(courseId, module.moduleNumber, slide.name, words, module.title);
				console.log(`✓ Processed ${words.length} words for ${slide.name}`);
				const lastWord = words[words.length - 1];
				if (lastWord?.end !== undefined) {
					console.log(`   Duration: ${lastWord.end.toFixed(2)}s\n`);
				}
				totalProcessed++;
			} catch (error: any) {
				console.error(`\n✗ Failed for ${slide.name}:`, error.message);
				const msg = String(error.message || "");
				if (/model mismatch|MFA model download|pretrained_models/i.test(msg)) {
					console.error(`   Run once: npm run mfa:download-models\n`);
				} else if (/invalid ilabel|phone list|disambig symbols/i.test(msg)) {
					console.error(
						`   Likely dictionary/acoustic mismatch. Use matching MFA_DICTIONARY and MFA_ACOUSTIC_MODEL in .env, then npm run mfa:download-models\n`
					);
				} else if (/Another MFA alignment is already running/i.test(msg)) {
					console.error(`   Delete stale lock if no MFA job is running: workspace/.mfa-docker.lock\n`);
				}
				totalSkipped++;
			}
		}
	}

	console.log("\n✅ Word timing extraction complete!");
	console.log(`   Processed: ${totalProcessed} slides (new timings)`);
	console.log(`   Skipped: ${totalSkipped} slides`);
	if (totalProcessed === 0) {
		console.error(
			"\n❌ No new timings were saved. Generate audio for the selected module(s) first, then retry."
		);
	}

	if (totalProcessed > 0) {
		console.log("\n🔍 Extracting bullet start times...");
		for (const module of modulesToProcess) {
			const courseId = module.courseId || "default";
			const moduleNumber = module.moduleNumber;
			if (typeof moduleNumber !== "number" || isNaN(moduleNumber) || !courseId || courseId === "all") {
				continue;
			}
			try {
				const bulletExtractor = await import("./extractBulletStartsFromTimings");
				bulletExtractor.extractModuleBulletStarts(courseId, moduleNumber);
			} catch (error: any) {
				console.warn(`⚠ Failed to extract bullet starts for module ${moduleNumber}: ${error.message}`);
			}
		}
	}

	console.log("\nNext step: Activate the course to copy timings for Remotion\n");
}

const moduleRange = process.argv[2];
const courseId = process.argv[3];
extractWordTimingsFromContentMfa(moduleRange, courseId).catch(console.error);
