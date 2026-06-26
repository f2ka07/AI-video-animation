// Simple Express server for the GUI
// Runs on port 3001, separate from Remotion Studio (port 3000)

const express = require('express');
const { exec, execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

// Load environment variables from .env file
require('dotenv').config();

const crypto = require('crypto');
const { getCpuCount, getOptimalRenderConcurrency } = require('./scripts/lib/renderConcurrency.js');
const { getGentleUrlCandidates, resolveGentleUrl } = require('./scripts/lib/resolveGentleUrl.js');
const { resolveMfaCli } = require('./scripts/lib/resolveMfa.js');
const { resolveDockerStackStatus } = require('./scripts/lib/resolveDockerServices.js');
const {
	getRemotionStudioUrlCandidates,
	resolveRemotionStudioUrl,
	buildRemotionStudioOpenUrl,
	getRemotionStudioStartHint,
	getConfiguredRemotionStudioUrl,
} = require('./scripts/lib/resolveRemotionStudioUrl.js');
const {
	detachArchivedCourse,
	applyCourseDeployPolicy,
	getActivatedCourseId,
} = require('./scripts/lib/courseDeployPolicy.js');
const { syncCoursePublicAssets } = require('./scripts/lib/syncCoursePublicAssets.js');
const { normalizePlanSlides } = require('./scripts/lib/normalizePlanSlides.js');
const {
	getModuleFrameCount,
	createJobTimer,
	buildMetricsRow,
	appendRenderMetricsRow,
	readRenderMetricsCsv,
	ensureMetricsDir,
	getMetricsCsvPath,
	parseRemotionStdoutLine,
	createRemotionParseState,
} = require('./scripts/lib/renderMetrics.js');
const { validateRenderAssets } = require('./scripts/lib/validateRenderAssets.js');
const {
	allSlidesHaveWordTimings,
	getModuleTimingCoverage,
	getCourseTimingCoverage,
} = require('./scripts/lib/timingCoverage.js');

function runPostExtractTimingsSync(courseId, moduleRange, callback) {
	const range = String(moduleRange || 'all').trim() || 'all';
	const cmd = `npx tsx scripts/postExtractTimingsSync.ts ${courseId} ${range}`;
	exec(cmd, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, callback);
}

const MFA_DOCKER_LOCK_PATH = path.join(__dirname, 'workspace', '.mfa-docker.lock');
const mfaExtractState = {
	inProgress: false,
	child: null,
	startedAt: null,
	moduleRange: null,
	courseId: null,
};

function isProcessAlive(pid) {
	if (!pid || Number.isNaN(pid)) {
		return false;
	}
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}

function clearMfaDockerLockFile() {
	try {
		if (fs.existsSync(MFA_DOCKER_LOCK_PATH)) {
			fs.unlinkSync(MFA_DOCKER_LOCK_PATH);
		}
	} catch {
		// Best-effort.
	}
}

function releaseMfaExtractLock() {
	mfaExtractState.inProgress = false;
	mfaExtractState.child = null;
	mfaExtractState.startedAt = null;
	mfaExtractState.moduleRange = null;
	mfaExtractState.courseId = null;
}

function cancelMfaExtraction(reason = 'cancelled') {
	const child = mfaExtractState.child;
	if (child && !child.killed) {
		try {
			child.kill('SIGTERM');
		} catch (e) {
			console.warn('[mfa-extract] Could not kill child process:', e.message);
		}
	}
	clearMfaDockerLockFile();
	releaseMfaExtractLock();
	console.log(`[mfa-extract] Released MFA lock (${reason})`);
	return { cancelled: true, reason };
}

function getMfaExtractionStatus() {
	if (!mfaExtractState.inProgress) {
		return { inProgress: false };
	}
	const child = mfaExtractState.child;
	const elapsedMs = mfaExtractState.startedAt ? Date.now() - mfaExtractState.startedAt : null;
	const baseStatus = {
		startedAt: mfaExtractState.startedAt,
		moduleRange: mfaExtractState.moduleRange,
		courseId: mfaExtractState.courseId,
		elapsedMs,
	};

	if (!child) {
		if (elapsedMs != null && elapsedMs < 15000) {
			return { inProgress: true, starting: true, ...baseStatus };
		}
		cancelMfaExtraction('stale lock cleared (child never started)');
		return { inProgress: false, staleLockCleared: true };
	}

	const childAlive = !child.killed && isProcessAlive(child.pid);
	if (!childAlive) {
		cancelMfaExtraction('stale lock cleared (child not running)');
		return { inProgress: false, staleLockCleared: true };
	}
	return {
		inProgress: true,
		pid: child.pid,
		...baseStatus,
	};
}

function reserveMfaExtraction(meta = {}) {
	if (getMfaExtractionStatus().inProgress) {
		return false;
	}
	mfaExtractState.inProgress = true;
	mfaExtractState.child = null;
	mfaExtractState.startedAt = Date.now();
	mfaExtractState.moduleRange = meta.moduleRange || null;
	mfaExtractState.courseId = meta.courseId || null;
	return true;
}

function attachMfaExtractionChild(child) {
	mfaExtractState.child = child;
}

function formatProcessExitMessage(code, signal) {
	if (code === 0) {
		return null;
	}
	if (code === null && signal) {
		return (
			`Process was stopped (${signal}). ` +
			'This usually means the browser tab closed, the connection dropped, or MFA was cancelled. Retry Step 4.'
		);
	}
	if (code === null) {
		return 'Process ended unexpectedly (no exit code). Check the gui-server terminal and Docker Desktop, then retry Step 4.';
	}
	return `Process exited with code ${code}. Check the gui-server terminal for details.`;
}

function isDockerComposeProgressOutput(text) {
	const value = String(text || '').trim();
	if (!value) {
		return true;
	}
	const progressPatterns = [
		/\bContainer\b.*\b(Creating|Created|Starting|Started|Running|Stopping|Stopped|Removing|Removed|Waiting)\b/i,
		/\bVolume\b.*\b(Creating|Created)\b/i,
		/\bNetwork\b.*\b(Creating|Created)\b/i,
		/\bPulling\b/i,
		/\bDigest:\b/i,
		/\bStatus:\s*Downloaded\b/i,
	];
	return progressPatterns.some((pattern) => pattern.test(value));
}

function classifyTimingStderrLine(line) {
	const trimmed = String(line || '').trim();
	if (!trimmed) {
		return { kind: 'skip' };
	}
	if (/DeprecationWarning|punycode/i.test(trimmed)) {
		return { kind: 'skip' };
	}
	if (isDockerComposeProgressOutput(trimmed)) {
		return { kind: 'skip' };
	}
	if (/^npm warn\b/i.test(trimmed)) {
		return { kind: 'skip' };
	}
	if (/✗ Failed|❌|Traceback|FATAL|Error:/i.test(trimmed)) {
		return { kind: 'error', message: trimmed };
	}
	return { kind: 'warning', message: trimmed };
}

function isRenderRunpodEnabled() {
	return process.env.RENDER_RUNPOD_ENABLED === 'true';
}

function persistRenderMetrics({
	jobId,
	courseId,
	moduleNumber,
	instanceLabel,
	concurrency,
	timer,
	costPerHourUsd,
	preset,
	success,
	outputFileMb,
	error,
}) {
	try {
		const framesTotal = getModuleFrameCount(moduleNumber, __dirname);
		const row = buildMetricsRow({
			jobId,
			courseId,
			moduleNumber,
			instanceLabel,
			concurrency,
			timer,
			framesTotal,
			costPerHourUsd,
			preset,
			success,
			outputFileMb,
			error,
		});
		appendRenderMetricsRow(row, __dirname);
		return row;
	} catch (err) {
		console.error('[render-metrics] Failed to write row:', err.message);
		return null;
	}
}

function requiresAuth() {
	return Boolean(process.env.GUI_AUTH_PASSWORD);
}

function getSessionSecret() {
	if (process.env.GUI_SESSION_SECRET) {
		return process.env.GUI_SESSION_SECRET;
	}
	if (process.env.GUI_AUTH_PASSWORD) {
		return crypto
			.createHash('sha256')
			.update(`${process.env.GUI_AUTH_PASSWORD}:gui-session`)
			.digest('hex');
	}
	return null;
}

function isAuthenticated(req) {
	if (!requiresAuth()) {
		return true;
	}
	const secret = getSessionSecret();
	const token = req.headers['x-gui-token'];
	if (secret && token && token === secret) {
		return true;
	}
	const header = req.headers.authorization || '';
	if (header.startsWith('Basic ')) {
		const decoded = Buffer.from(header.slice(6), 'base64').toString();
		const colon = decoded.indexOf(':');
		const user = colon >= 0 ? decoded.slice(0, colon) : decoded;
		const pass = colon >= 0 ? decoded.slice(colon + 1) : '';
		const expectedUser = process.env.GUI_AUTH_USERNAME || 'admin';
		if (user === expectedUser && pass === process.env.GUI_AUTH_PASSWORD) {
			return true;
		}
	}
	return false;
}

const AUTH_OPEN_EXACT = new Set(['/api/health', '/api/auth/status', '/login.html', '/auth-guard.js', '/styles.css']);

function guiAuthMiddleware(req, res, next) {
	if (!requiresAuth()) {
		return next();
	}
	if (req.method === 'OPTIONS') {
		return next();
	}
	// GUI HTML/JS/CSS: auth via client sessionStorage + X-Gui-Token on fetch.
	// Browser navigation cannot send custom headers, so do not block page loads here.
	if (!req.path.startsWith('/api/')) {
		return next();
	}
	if (req.path === '/api/auth/login' && req.method === 'POST') {
		return next();
	}
	if (AUTH_OPEN_EXACT.has(req.path)) {
		return next();
	}
	if (isAuthenticated(req)) {
		return next();
	}
	return res.status(401).json({ error: 'Unauthorized', authRequired: true });
}

// Configure multer for audio uploads
const audioUpload = multer({ 
	dest: path.join(__dirname, 'public', 'audio', 'temp'),
	limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Configure multer for image uploads
const imageUpload = multer({ 
	dest: path.join(__dirname, 'public', 'assets', 'temp'),
	limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

const app = express();
const PORT = 3001;

try {
	ensureMetricsDir(__dirname);
} catch (err) {
	console.warn('[render-metrics] Metrics directory not writable:', err.message);
}

app.use(cors());
app.use(express.json());
app.use(guiAuthMiddleware);
// Disable caching for GUI HTML/JS/CSS so changes are visible without hard refresh
app.use((req, res, next) => {
	if (/\.(html|js|css)$/.test(req.path)) {
		res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
	}
	next();
});
app.use(express.static(path.join(__dirname, 'gui')));
// Serve audio files from public/audio
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));
// Serve rendered videos (for GUI on RunPod - download from server)
app.use('/out', express.static(path.join(__dirname, 'out')));

// Course storage file path
const COURSES_JSON_PATH = path.join(__dirname, 'courses.json');

// Helper: Read courses from courses.json
function readCoursesJson() {
	try {
		if (fs.existsSync(COURSES_JSON_PATH)) {
			const data = JSON.parse(fs.readFileSync(COURSES_JSON_PATH, 'utf-8'));
			return data;
		}
	} catch (e) {
		console.error('Error reading courses.json:', e);
	}
	// Return default structure if file doesn't exist or is invalid
	return {
		courses: [{ id: 'default', title: 'Default Course', description: '', moduleCount: 0, status: 'active', archivedAt: null }],
		courseModuleMapping: { 'default': [] }
	};
}

function getCourseRecord(courseId) {
	const data = readCoursesJson();
	return data.courses?.find((c) => c.id === courseId) || null;
}

function courseUsesSceneVisuals(courseId) {
	const course = getCourseRecord(courseId);
	if (course?.visualMode === 'scenes') return true;
	const scenesPath = path.join(__dirname, 'courses', courseId, 'course', 'remotion', 'scenes');
	return fs.existsSync(scenesPath);
}

function getCourseAudioMode(courseId) {
	const course = getCourseRecord(courseId);
	if (course?.audioMode) return course.audioMode;
	if (courseUsesSceneVisuals(courseId)) return 'per-module';
	return 'per-slide';
}

// Remove auto-Mermaid from slide-splits (scene courses use SVG scenes, not Mermaid)
function stripMermaidFromSlideSplits(courseId) {
	const splitsPath = path.join(__dirname, 'courses', courseId, 'slide-splits.json');
	if (!fs.existsSync(splitsPath)) return 0;
	let splits;
	try {
		splits = JSON.parse(fs.readFileSync(splitsPath, 'utf-8'));
	} catch {
		return 0;
	}
	let stripped = 0;
	for (const key of Object.keys(splits)) {
		if (key.startsWith('_')) continue;
		const entry = splits[key];
		if (!entry || typeof entry !== 'object') continue;
		if (Array.isArray(entry.segments)) {
			for (const seg of entry.segments) {
				if (seg && seg.mermaidSource) {
					delete seg.mermaidSource;
					stripped++;
				}
			}
		}
	}
	if (stripped > 0) {
		fs.writeFileSync(splitsPath, JSON.stringify(splits, null, 2), 'utf-8');
		try {
			execSync('npx tsx scripts/syncSlideSplitsToTs.ts', { cwd: __dirname, stdio: 'pipe' });
		} catch (e) {
			console.warn('[stripMermaid] syncSlideSplitsToTs failed:', e?.message || e);
		}
		console.log(`[stripMermaid] Removed ${stripped} mermaid segment(s) from ${courseId}`);
	}
	return stripped;
}

// Helper: Get module range string for a course (e.g. "1-12" or "1,2,3")
// Uses courseStructure.ts first, then courses.json as fallback
function getModuleRangeForCourse(courseId) {
	if (!courseId) return null;
	let moduleNumbers = [];
	try {
		const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
		if (fs.existsSync(coursePath)) {
			const courseContent = fs.readFileSync(coursePath, 'utf-8');
			const mappingMatch = courseContent.match(new RegExp(`'${courseId.replace(/'/g, "\\'")}':\\s*\\[([\\d,\\s]+)\\]`));
			if (mappingMatch) {
				moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
			}
		}
		if (moduleNumbers.length === 0) {
			const coursesData = readCoursesJson();
			moduleNumbers = coursesData.courseModuleMapping?.[courseId] || [];
		}
		if (moduleNumbers.length > 0) {
			return moduleNumbers.length === 1 ? moduleNumbers[0].toString() : `${Math.min(...moduleNumbers)}-${Math.max(...moduleNumbers)}`;
		}
	} catch (e) {
		console.error('Error getting course modules:', e);
	}
	return null;
}

// Helper: Get active course from moduleContent.ts (source of truth for Remotion)
// Returns the courseId Remotion is actually using, or null if file missing/invalid
function getActiveCourseFromModuleContent() {
	const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
	if (!fs.existsSync(moduleContentPath)) return null;
	try {
		const content = fs.readFileSync(moduleContentPath, 'utf-8');
		// Match "// Course ID: comprehensive-wireless-networks"
		const headerMatch = content.match(/\/\/\s*Course ID:\s*([a-zA-Z0-9_-]+)/);
		if (headerMatch) return headerMatch[1];
		// Fallback: first courseId: "xxx" in module content
		const courseIdMatch = content.match(/courseId:\s*["']([a-zA-Z0-9_-]+)["']/);
		if (courseIdMatch) return courseIdMatch[1];
	} catch (e) {
		console.error('[getActiveCourse] Error reading moduleContent.ts:', e.message);
	}
	return null;
}

function resolveCourseIdForGeneration(requestedCourseId) {
	return requestedCourseId || getActiveCourseFromModuleContent();
}

function runActivateCourseScript(courseId) {
	const courseDir = path.join(__dirname, 'courses', courseId);
	const contentJsonPath = path.join(courseDir, 'content.json');
	const scriptsDir = path.join(courseDir, 'course/scripts');

	if (courseUsesSceneVisuals(courseId)) {
		stripMermaidFromSlideSplits(courseId);
	}

	if (fs.existsSync(contentJsonPath)) {
		return execSync(`npx tsx scripts/activateCourse.ts ${courseId}`, {
			cwd: __dirname,
			stdio: 'pipe',
			encoding: 'utf-8',
		});
	}
	if (fs.existsSync(scriptsDir)) {
		return execSync(`npx tsx scripts/activateCourseFromSSML.ts ${courseId}`, {
			cwd: __dirname,
			stdio: 'pipe',
			encoding: 'utf-8',
		});
	}
	throw new Error(`Course not found: ${courseId}. Expected content.json or course/scripts/`);
}

function runSceneModuleGeneration(courseId, moduleRange) {
	const range = moduleRange || getModuleRangeForCourse(courseId) || '1-6';
	console.log(`[scene-modules] Generating from SVG scenes for ${courseId} (${range})`);
	return execSync(`npx tsx scripts/generateModulesFromScenes.ts ${courseId} ${range}`, {
		cwd: __dirname,
		stdio: 'pipe',
		encoding: 'utf-8',
	});
}

// Ensure moduleContent.ts matches the requested course (writes to disk, copies timings)
function ensureCourseActiveSync(courseId) {
	const activeCourseId = getActiveCourseFromModuleContent();
	if (activeCourseId === courseId) {
		return { alreadyActive: true, courseId, previousCourseId: activeCourseId };
	}

	console.log(`[ensureCourseActive] Activating "${courseId}" (was "${activeCourseId || 'none'}")`);

	runActivateCourseScript(courseId);

	const verified = getActiveCourseFromModuleContent();
	if (verified !== courseId) {
		throw new Error(`Activation failed: expected "${courseId}" in moduleContent.ts, found "${verified || 'none'}"`);
	}

	return { alreadyActive: false, courseId, previousCourseId: activeCourseId || null };
}

// Align Remotion moduleContent.ts with the course the user selected in the GUI.
function resolveCourseForProcessing(requestedCourseId, { autoActivate = false } = {}) {
	const targetCourseId = requestedCourseId || getActiveCourseFromModuleContent();
	if (!targetCourseId) {
		const err = new Error(
			'No course selected and moduleContent.ts has no active course. Select a video in the wizard or run: npx tsx scripts/activateCourse.ts <courseId>'
		);
		err.code = 'NO_ACTIVE_COURSE';
		throw err;
	}

	const activeCourseId = getActiveCourseFromModuleContent();
	if (!activeCourseId) {
		if (!autoActivate) {
			const err = new Error(
				`moduleContent.ts is missing or has no courseId. Activate "${targetCourseId}" before processing audio or timings.`
			);
			err.code = 'NO_MODULE_CONTENT';
			err.selectedCourseId = targetCourseId;
			throw err;
		}
		const activation = ensureCourseActiveSync(targetCourseId);
		return {
			courseId: targetCourseId,
			activated: true,
			previousCourseId: activation.previousCourseId,
		};
	}

	if (activeCourseId !== targetCourseId) {
		if (!autoActivate) {
			const err = new Error(
				`Selected course "${targetCourseId}" does not match Remotion active course "${activeCourseId}". Activate the course you want to process first.`
			);
			err.code = 'COURSE_MISMATCH';
			err.activeCourseId = activeCourseId;
			err.selectedCourseId = targetCourseId;
			throw err;
		}
		const activation = ensureCourseActiveSync(targetCourseId);
		return {
			courseId: targetCourseId,
			activated: !activation.alreadyActive,
			previousCourseId: activation.previousCourseId,
		};
	}

	return {
		courseId: targetCourseId,
		activated: false,
		previousCourseId: activeCourseId,
	};
}

function clearRemotionWebpackCache() {
	const cacheDir = path.join(__dirname, 'node_modules', '.cache');
	if (fs.existsSync(cacheDir)) {
		fs.rmSync(cacheDir, { recursive: true, force: true });
		console.log('[clearRemotionCache] Removed node_modules/.cache');
	}
	const remotionDir = path.join(__dirname, '.remotion');
	if (fs.existsSync(remotionDir)) {
		fs.rmSync(remotionDir, { recursive: true, force: true });
		console.log('[clearRemotionCache] Removed .remotion');
	}
}

// Helper: Write courses to courses.json
function writeCoursesJson(data) {
	try {
		fs.writeFileSync(COURSES_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
		return true;
	} catch (e) {
		console.error('Error writing courses.json:', e);
		return false;
	}
}

// Helper: Extract slides array content using bracket counting
// This properly handles nested arrays/objects and template literals
function extractSlidesContent(moduleBody) {
	const slidesStart = moduleBody.indexOf('slides:');
	if (slidesStart === -1) return null;
	
	const bracketStart = moduleBody.indexOf('[', slidesStart);
	if (bracketStart === -1) return null;
	
	let bracketDepth = 0;
	let inBacktick = false;
	let slidesEnd = -1;
	
	for (let i = bracketStart; i < moduleBody.length; i++) {
		const char = moduleBody[i];
		const prevChar = i > 0 ? moduleBody[i - 1] : '';
		
		if (char === '`' && prevChar !== '\\') {
			inBacktick = !inBacktick;
			continue;
		}
		
		if (inBacktick) continue;
		
		if (char === '[') {
			bracketDepth++;
		} else if (char === ']') {
			bracketDepth--;
			if (bracketDepth === 0) {
				slidesEnd = i;
				break;
			}
		}
	}
	
	if (slidesEnd === -1) return null;
	return moduleBody.substring(bracketStart + 1, slidesEnd);
}

// Helper: Extract slide names from slides content
function extractSlideNames(slidesContent) {
	const names = [];
	const nameMatches = slidesContent.match(/name:\s*"([^"]+)"/g) || [];
	names.push(...nameMatches.map(m => m.match(/"([^"]+)"/)[1]));
	return names;
}

function getModuleContentMatch(moduleContentText, moduleNumber) {
	const moduleMatches = moduleContentText.match(/export const module\d+Content: ModuleContent = \{[\s\S]*?\};/g) || [];
	for (const match of moduleMatches) {
		const numMatch = match.match(/export const module(\d+)Content:/);
		if (numMatch && parseInt(numMatch[1], 10) === moduleNumber) return match;
	}
	return null;
}

function isModuleRegisteredInRoot(rootContent, courseId, moduleNumber) {
	if (!rootContent) return false;
	const escaped = courseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const pattern = new RegExp(
		`courseId:\\s*["']${escaped}["'][\\s\\S]*?moduleNumber:\\s*${moduleNumber}`
	);
	return pattern.test(rootContent);
}

// Slide courses use GenericModule + moduleContent.ts (no ModuleNConfig.ts).
function isModuleGeneratedForCourse(courseId, moduleNumber, { moduleContentText, rootContent, contentJson, videosDir }) {
	if (courseUsesSceneVisuals(courseId)) {
		const moduleFile = path.join(videosDir, `Module${moduleNumber}.tsx`);
		const configFile = path.join(videosDir, `Module${moduleNumber}Config.ts`);
		return fs.existsSync(moduleFile) && fs.existsSync(configFile);
	}
	const match = getModuleContentMatch(moduleContentText, moduleNumber);
	if (match) {
		const moduleCourseId = match.match(/courseId:\s*["']([^"']+)["']/)?.[1];
		if (moduleCourseId === courseId) return true;
	}
	if (contentJson?.modules) {
		const mod = contentJson.modules.find((m) => m.moduleNumber === moduleNumber);
		if (mod?.slides?.length > 0) return true;
	}
	return isModuleRegisteredInRoot(rootContent, courseId, moduleNumber);
}

// Word limit constants for AI planner (course: Udemy-quality depth; shorts/video: tighter)
const MAX_WORDS_PER_SLIDE = 90;  // Allow deeper explanations per slide
const MAX_SECONDS_PER_SLIDE = 40; // ~90 words at 2.5 wps

// Helper: Count words in text
function countWords(text) {
	if (text == null || typeof text !== 'string') return 0;
	const trimmed = text.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).filter(w => w.length > 0).length;
}

function slideWordCount(slide) {
	if (!slide) return 0;
	if (Array.isArray(slide.scripts) && slide.scripts.length > 0) {
		return slide.scripts.reduce((sum, s) => sum + countWords(s), 0);
	}
	return countWords(slide.script);
}

// Helper: Estimate speaking duration
function estimateDuration(text) {
	return Math.ceil(countWords(text) / 2.5);
}

/** Parse module query param; 0 is valid (course preview). Returns null if missing/invalid. */
function parseModuleNumberParam(value) {
	if (value === undefined || value === null || value === '') return null;
	const n = parseInt(String(value), 10);
	return Number.isNaN(n) ? null : n;
}

/** True when module number is present; 0 is valid (course preview). */
function isModuleNumberProvided(value) {
	return parseModuleNumberParam(value) !== null;
}

// API: Plan a course using AI
app.post('/api/plan-course', async (req, res) => {
	try {
		const { prompt, title, description, targetAudience, keyTopics, moduleCount, contentType } = req.body;
		// Normalize: accept contentType from body (frontend must send it); default course if missing
		const rawType = (contentType || req.body.content_type || '').toString().toLowerCase();
		const contentKind = rawType === 'marketing' ? 'marketing'
			: rawType === 'shorts' ? 'shorts'
			: (rawType === 'video' ? 'video' : 'course');
		console.log('[plan-course] Request contentType:', contentType, '-> contentKind:', contentKind);
		
		if (!prompt && !title) {
			return res.status(400).json({ error: 'Either prompt or title is required' });
		}
		
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
		}
		
		let systemPrompt;
		let userPrompt;
		
		if (contentKind === 'shorts') {
			// Shorts: essay-style, dense prose like high-quality scripted shorts (see SAMPLE.md)
			systemPrompt = `You are an expert short-form video scriptwriter. Create shorts that read like a tight, insightful ESSAY: each "slide" is one complete thought that builds the argument. Target the quality of a strong editorial script (dense, no filler, no marketing). Match this voice and structure.

TARGET VOICE (essay-style, like this):
- "AI tools are not replacing developers. They are changing what a developer is."
- "The bottleneck is no longer writing code. It is deciding what should exist."
- "The speed jump is not magic. It is cognitive offloading."
- "AI does not reward memorization. It rewards taste."
- "The future developer is not a typist. It is a systems thinker with a compiler assistant."
- "Learn to guide tools, not compete with them."
Use contrast and parallel structure when possible: "X is not Y. It is Z." / "The real shift is A." / "But the tradeoff is B." Each slide = one full sentence (or two short clauses). Script carries the meaning; no reliance on bullets.

QUALITY BAR:
- One flowing argument per short. Slide 2 follows from slide 1, etc. By the end the viewer can state the thesis.
- Every slide adds a new idea or consequence. No filler, no restating.
- End with a line worth remembering: insight, rule, or soft takeaway. Not "Follow for more!" or "That's it."
- Tone: editorial, thoughtful. NOT marketing (no hype, no hard CTAs).

HOOK-FIRST (mandatory):
- First slide MUST name the topic and state a thesis or tension. No vague "it" or "this."
- Never open with "Here's what you need to know" or "Let me explain." Lead with the insight or contrast.

CLOSING LINE (mandatory):
- Last slide MUST be a quotable insight or takeaway. Not "Follow for more!" or "That's it."
- The viewer should be able to quote the closing line. Soft close, not ad.

CLARITY:
- Prefer concrete over abstract. Full thoughts over fragments.

BANNED:
- Generic hooks: "Here's what you need to know", "Let me explain"
- Filler: "That's it.", "Let that sink in.", slides that rephrase the previous
- Marketing: "10x", "level up", "Follow now!", "Start today!"
- Bullet-heavy slides where the script is just a label; script must be the main content

AUDIO CONSTRAINTS FOR SHORTS:
- Target: 15-22 words per slide (one full essay-style sentence). Each slide = one complete thought.
- Maximum: 25 words per slide
- 5-10 slides per short so the argument can build (not just 3-4 punchy lines)

AUDIO / NARRATION OPTIMIZATION:
- Scripts will be spoken aloud (TTS or voiceover). Write for the ear, not the eye.
- Use contractions (it's, we're, don't) - they sound more natural when spoken.
- Spell out acronyms on first use when it helps (e.g., "RAG, or Retrieval-Augmented Generation").
- Avoid tongue-twisters and dense jargon. One clear idea per sentence.
- End with a line worth remembering - a phrase the listener can quote.

SLIDE TYPES:
1. "title" - Script = one or two full sentences (the hook). Title field = short label for the slide.
2. "content-two-card" - Script = the main content (one full sentence). points[] OPTIONAL: 0-2 phrases only if they add clarity; script carries the meaning.
3. "code" / "comparison" - Only if the topic needs it. Script = one complete thought.

BULLETS: Optional. Prefer 0-2 points per slide; use only when they clarify. The script is the primary content.

SHORTS STRUCTURE:
- Each module = one short. 5-10 slides. One flowing argument: hook -> 3-7 beats that build the case -> one memorable closing line.
- First slide: name the topic and state the thesis or opening contrast (hook-first).
- Middle: each slide one new idea, consequence, or twist. Build; do not repeat. Each slide builds on the previous.
- Last slide: quotable insight or takeaway. Not "Follow for more!" - a line the viewer could remember and quote.

MODULE TITLE AND SUBTITLE FOR SHORTS (mandatory):
- Each module = one short. The module "title" is the SHORT'S TITLE (like a YouTube Short or TikTok title), NOT a course chapter title.
- Do NOT use "Module 1:", "Module 2:", "Part 1:", "Introduction to...", "Foundations of...", or any course-style naming.
- Good title examples: "Why Agentic AI Changes Everything", "The Clawdbot in 60 Seconds", "One Tip That Saves Hours"
- Bad title examples: "Module 1: Foundations of Agentic AI", "Introduction to Agentic AI and the Clawdbot"
- Subtitle: one punchy line or hook (e.g. "Save this before you build another bot"). Optional "Short 1:" only if you need order; prefer no number.
- courseName: series/playlist name (e.g. "Agentic AI Shorts"), not a course title.

OUTPUT FORMAT (same JSON shape as courses):
{
  "courseName": "Series or Playlist Name",
  "courseId": "series-id-with-dashes",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Punchy Short Title (like a TikTok caption)",
      "subtitle": "One-line hook or leave minimal",
      "slides": [
        {
          "name": "unique-slide-name",
          "type": "title|content-single|content-two-card|code|code-diagram|comparison|bullets-code|sequential-bullet",
          "script": "One full essay-style sentence (15-22 words). Complete thought.",
          "title": "Slide Title",
          "points": ["short phrase", "another"],
          "code": "// if code type",
          "language": "javascript"
        }
      ]
    }
  ]
}

SCRIPT STYLE FOR SHORTS (mandatory):
- Essay-style: each slide = one complete thought (15-22 words). Use contrast: "X is not Y. It is Z." Build one flowing argument.
- Tone: editorial, thoughtful. NOT marketing. No hype, no hard CTAs.
- 5-10 slides per short. Script carries the meaning; bullets optional (0-2 per slide). End with a line worth remembering.`;
			
			userPrompt = '';
			if (prompt && !title) {
				userPrompt = `Create a series of SHORTS (short-form videos) based on this request:

"${prompt}"

Requirements:
- Essay-style voice (like SAMPLE.md): each slide = one full sentence (15-22 words). Use contrast: "X is not Y. It is Z." Build one flowing argument.
- 5-10 slides per short. Script carries the meaning; bullets optional (0-2 per slide). Editorial tone, NOT marketing.
- Each module = one short. First slide names the topic; each slide adds one new idea; end with a line worth remembering.
${moduleCount ? `- Generate exactly ${moduleCount} shorts (${moduleCount} modules).\n` : '- Generate as many shorts as fit the topic (each module is one short).\n'}
- 15-22 words per slide (one complete thought per slide). Same JSON output format as above`;
			} else {
				userPrompt = 'Create a series of SHORTS with the following specifications:\n\n';
				if (title) userPrompt += `Series/Title: ${title}\n`;
				if (description) userPrompt += `Description: ${description}\n`;
				if (targetAudience) userPrompt += `Target Audience: ${targetAudience}\n`;
				if (keyTopics && keyTopics.length) userPrompt += `Key Topics:\n${keyTopics.map(t => `- ${t}`).join('\n')}\n`;
				if (moduleCount) userPrompt += `Number of shorts (modules): ${moduleCount}\n`;
				userPrompt += `\nEssay-style (like SAMPLE.md): each slide = one full sentence (15-22 words). 5-10 slides per short. Script carries meaning; bullets optional. Editorial tone, NOT marketing. Same JSON format as above.`;
			}
		} else if (contentKind === 'marketing') {
			systemPrompt = `You are an expert course marketing scriptwriter. Create a MARKETING PACK with exactly 3 modules for one course or product.

OUTPUTS (mandatory — exactly 3 modules):
1. Module 1: YouTube Short (portrait) — videoCategory: "short", outputPlatform: "youtube-shorts"
2. Module 2: Facebook Reel (portrait) — videoCategory: "short", outputPlatform: "facebook-reel"
3. Module 3: Udemy landscape trailer — videoCategory: "standard", outputPlatform: "udemy-trailer"

TRADEMARK RULE (mandatory):
- Do NOT mention company or product trademarks: no NVIDIA, Cisco, AWS, Azure, Google, ChatGPT, Claude, OpenAI, Meta, etc.
- Use generic terms: "language models", "chat AI", "cloud platforms", "enterprise systems", "leading providers"

TONE:
- Marketing-focused: clear value, urgency, benefits, enrollment CTAs
- Confident but not sleazy. No fake stats. No "10x" or "level up"
- Portrait modules (1-2): punchy hooks, 15-22 words per slide, 6 slides each (~30 seconds)
- Landscape module (3): fuller narration, 8 slides, 40-80 words per slide (~90-120 seconds)

PORTRAIT SLIDES (modules 1-2):
- 6 slides each. Fixed 5-second pacing. One idea per slide.
- Last slide CTA: Module 1 ends with "link in description" (YouTube). Module 2 ends with "link in bio" (Facebook).
- Slide types: "title" for hook and CTA, "content-two-card" for middle beats with 1-2 points

SLIDE FIELDS (mandatory — never use "content" without "script"):
- name: unique id (e.g. yt-hook, fb-cta, udemy-curriculum)
- script: spoken narration text
- title: short on-screen headline
- type: only "title" or "content-two-card"

LANDSCAPE SLIDE (module 3):
- 8 slides. Hook, problem, definition, architecture, curriculum, audience, outcomes, enroll CTA.
- Include thumbnailText: max 3 words for Udemy thumbnail

JSON SHAPE:
{
  "courseName": "Course Name — Marketing",
  "courseId": "course-id-marketing",
  "marketingPack": true,
  "outputs": [
    { "moduleNumber": 1, "platform": "youtube-shorts", "format": "portrait", "filename": "youtube-short.mp4" },
    { "moduleNumber": 2, "platform": "facebook-reel", "format": "portrait", "filename": "facebook-reel.mp4" },
    { "moduleNumber": 3, "platform": "udemy-trailer", "format": "landscape", "filename": "udemy-trailer.mp4" }
  ],
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Punchy Short Title",
      "subtitle": "YouTube Short — Course Name",
      "videoCategory": "short",
      "outputPlatform": "youtube-shorts",
      "slides": [ ... ]
    },
    ...
  ]
}`;

			userPrompt = prompt
				? `Create a 3-output marketing pack based on:\n\n"${prompt}"\n\nExactly 3 modules: YouTube Short, Facebook Reel, Udemy landscape trailer. No vendor trademarks. Marketing tone with clear CTAs.`
				: `Create a 3-output marketing pack.\n\nTitle: ${title || 'Course'}\nDescription: ${description || ''}\nAudience: ${targetAudience || 'Developers and architects'}\nTopics: ${(keyTopics || []).join(', ')}\n\nExactly 3 modules. No vendor trademarks.`;
		} else if (contentKind === 'video') {
			// Video: YouTube long-form - EXPERT BLUEPRINT (Tech Education YouTube Blueprint)
			// Structure and psychology first; uniform rhythm kills retention
			systemPrompt = `You are an expert YouTube long-form video content planner for tech education (AI, cloud, cert topics). Create high-retention VIDEO content. Apply the Tech Education YouTube Blueprint strictly.

1. TITLE FORMULA (mandatory):
Every video title MUST contain: [Pain OR Result] + [Specific Mechanism] + Optional Time/Speed

Valid patterns:
- Result: "Build Production RAG Without Hallucinations"
- Pain: "Your AI Lies Because You Skip This RAG Step"
- Exam: "Answer 70% of Agent Design Questions Using This Pattern"
- Speed: "Understand Multi Agent Routing in 9 Minutes"

FORBIDDEN in titles (kill CTR): explained, introduction, overview, complete guide, everything about

2. THUMBNAIL TEXT (per module, max 3 words):
Each module MUST include "thumbnailText": "MAX THREE WORDS" - one concept only. No diagrams, no dense visuals in the text.
Examples: "AI MEMORY", "WRONG AGENT", "PASS EXAM"

3. SCRIPT OPENING RULE (mandatory):
Scripts MUST open with a real developer pain, confusion, or failure BEFORE naming the concept.
Concept definitions appear ONLY after the viewer understands why the problem exists.
Never lead with "X is..." or "Let's learn about X". Lead with the consequence, then reveal the concept.

4. CONSEQUENCE-DRIVEN LANGUAGE (mandatory):
Use phrases like: "This means your AI...", "This is why systems fail...", "So when you..."
NOT neutral academic phrasing like "RAG is a technique that..." or "In this context..."
Every slide should feel like uncovering something hidden, not delivering a lecture.
Prioritize revealing useful insights over systematically covering the topic.

BANNED openings: "X is...", "Let's learn about X", "In this video we'll cover...", "First, let me explain..."

5. VIDEO STRUCTURE (MANDATORY timeline):

0-8 seconds - ATTACK HOOK: First slide MUST start with a problem or failure. NOT greeting, NOT topic, NOT definition.
Good: "If your AI gives confident wrong answers, this is why."
Bad: "Today we are going to learn about RAG."

8-20 seconds - THE PROMISE: One sentence stating viewer outcome.
"By the end of this video you'll know the exact architecture production teams use."

20-60 seconds - SHOW FINAL RESULT FIRST: Show diagram/architecture BEFORE explanation. Viewers stay when they see payoff early.

MAIN BODY (repeat every 60-90 seconds per concept):
- Problem (pain/failure first)
- Tiny explanation (consequence-driven: "this means...", "this is why...")
- Concrete example
- Why it matters in production
Then immediately next concept. Never stack theory first. Never define before the viewer feels the problem.

EVERY 2 MINUTES - PATTERN INTERRUPT (mandatory): Insert one of: common mistake, real production story, exam trap, interview question, myth correction. Without interrupts retention drops.

LAST 30 SECONDS - STRATEGIC CLOSE: Answer "When do I use this?" - NOT summary.
Example: "If you remember one thing, RAG is just giving AI searchable memory. Any time answers must be factual, you use it."

6. PACING (variable - uniform rhythm kills retention):
- 8-12 words: punch statement slide
- 18-30 words: fast explanation slide
- 30-45 words: deeper explanation slide
Vary slide lengths. Never force all slides to same duration.

7. CONTENT PRIORITY (top down, not bottom up):
- Most useful insight first
- Most common mistake second
- Simple model third
- Technical detail last

SLIDE TYPES: title, content-two-card, content-single, code, code-diagram, comparison, bullets-code, sequential-bullet, story-beat
BULLET POINTS: Extract from script, 3-8 words each, max 4 per slide.

CODE SLIDE RULES (student-friendly):
- Max 5-8 lines per code slide. Split long code into multiple slides with scripts array (one script per chunk).
- Include codeContext (e.g. "index.ts") so students know where the code lives.
- Include visibleLineRange [start, end] when code block exceeds 8 lines - show only relevant lines.
- Separate bash/CLI commands from application code: use different slides or clearly labeled sections.
- Step-by-step pattern: Slide 1: Create file + import. Slide 2: Add resource. Slide 3: Add tags. Slide 4: Export.
- MANDATORY: Code slide script MUST walk through the code. "Line one imports X. Line two creates Y." NOT "Let's look at this example. Notice how it works." - that skips the explanation. Every code slide script explains specific lines.

AUDIO: Scripts spoken aloud. Use contractions. Spell out acronyms on first use. One clear idea per sentence.

CRITICAL - GROUNDING (no hallucination):
- Stay to the topic the user requested. If they mention a product (e.g. ClawdBot), cover it.
- Do NOT invent features, capabilities, or claims about products you may not have reliable knowledge of.
- For evaluative questions ("Is X the most powerful?"): use an analytical framework (what makes an AI tool powerful, evaluation criteria, tradeoffs) rather than asserting unverified facts about X.
- Only use real, verifiable technical concepts. No vague marketing speak or made-up feature lists.

CRITICAL - SCRIPT FIELD:
- The "script" field = EXACTLY what the narrator says. No meta-instructions.
- WRONG: "8-12 words. Your AI stumbles on complex tasks? Here's why."
- RIGHT: "If your AI gives confident wrong answers, this is why."
- Never include "8-12 words", "18-30 words", or format hints in the script. Only the spoken content.

CRITICAL - SUBSTANCE:
- Each video: 6-25 slides for 5-20 minutes. NOT 3 slides.
- Every slide needs real content. No placeholder scripts. No generic "discover how X solves Y."
- Include actual code, diagrams, or concrete mechanisms when the topic requires it.

OUTPUT FORMAT (script = spoken words only, no instructions):
{
  "courseName": "Series Title",
  "courseId": "series-id-with-dashes",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Pain/Result + Mechanism",
      "subtitle": "Descriptive one-liner",
      "thumbnailText": "MAX THREE WORDS",
      "slides": [
        {
          "name": "attack-hook",
          "type": "title",
          "script": "If your AI gives confident wrong answers, this is why.",
          "title": "Slide Title",
          "points": []
        },
        {
          "name": "the-promise",
          "type": "content-two-card",
          "script": "By the end of this video you'll know the exact architecture production teams use to fix it.",
          "title": "Slide Title",
          "points": ["exact architecture production teams use"]
        },
        {
          "name": "show-result-first",
          "type": "code-diagram",
          "script": "Here's the flow. User query hits the retriever. Chunks get injected into the prompt. The model answers with real context, not hallucinations.",
          "title": "RAG Architecture",
          "points": [],
          "code": "// actual code if code type",
          "language": "javascript",
          "codeContext": "index.ts"
        }
      ]
    }
  ]
}

REALITY CHECK: Would a tired developer at 11pm instantly know what problem this video solves? If not, rewrite title.`;

			if (prompt && !title) {
				userPrompt = `Create YouTube long-form VIDEO content (not a course) based on this request:

"${prompt}"

VIDEO BLUEPRINT REQUIREMENTS:
- GROUNDING: Cover the topic/product the user requested. Do NOT invent features or unverifiable claims. For "Is X the best?" questions, use analytical framework (criteria, tradeoffs) not made-up factoids.
- SCRIPT: "script" field = exactly what the narrator says. NO "8-12 words" or format hints in the output. Only spoken content.
- SUBSTANCE: Each video 6-25 slides (5-20 min). No 3-slide skeletons. Every slide needs real content.
- OPENING: Scripts open with developer pain/failure BEFORE naming the concept.
- LANGUAGE: Consequence-driven ("this means your AI...", "this is why systems fail..."). NOT academic.
- TITLE: [Pain OR Result] + [Specific Mechanism]. NO: explained, introduction, overview, complete guide.
- THUMBNAIL: Each module needs "thumbnailText" - max 3 words.
- STRUCTURE: 0-8s attack hook; 8-20s promise; 20-60s show result first; main body: problem->explanation->example->production; every 2 min pattern interrupt; last 30s "When do I use this?"
- PACING: Vary 8-12 (punch), 18-30 (fast), 30-45 (deeper) words per slide.
${moduleCount ? `- Generate exactly ${moduleCount} videos.\n` : '- Exhaust the topic; 20+ videos is fine.\n'}
- Same JSON format with thumbnailText per module.`;
			} else {
				userPrompt = 'Create YouTube long-form VIDEO content with these specifications:\n\n';
				if (title) userPrompt += `Title: ${title}\n`;
				if (description) userPrompt += `Description: ${description}\n`;
				if (targetAudience) userPrompt += `Target Audience: ${targetAudience}\n`;
				if (keyTopics && keyTopics.length) userPrompt += `Key Topics:\n${keyTopics.map(t => `- ${t}`).join('\n')}\n`;
				if (moduleCount) userPrompt += `Number of videos (modules): ${moduleCount}\n`;
				userPrompt += `\nApply VIDEO BLUEPRINT: cover user's topic (no invented features/claims); script = spoken words only (no "8-12 words" in output); 6-25 slides per video; open with pain/failure; consequence-driven language; attack hook first; show result before explanation; variable pacing; pattern interrupts every 2 min; thumbnailText (max 3 words) per module. Same JSON format.`;
			}
		} else {
			// Course: Udemy-quality, story-driven, comprehensive, beginner-friendly
			systemPrompt = `You are an expert course content planner. Create UDEMY-QUALITY courses: comprehensive, beginner-friendly, and ready to publish with no further editing. Use STORY-DRIVEN narrative so students learn through curiosity and discovery, not lecture-style delivery.

NARRATIVE ARC (mandatory):
- Each module follows: Problem -> Attempt -> Insight -> Resolution (or similar story beat).
- Scripts open with a question, failure, or tension BEFORE naming the concept.
- BANNED openings: "X is...", "Let's learn about X.", "Let's see...", "Let's look at...", "Understanding X is...", "X occurs when...", "In this module we'll..."
- Use consequence-driven language: "this means...", "this is why...", "so when you..." instead of neutral definitions.
- Every 8-10 slides: insert a "story-beat" slide (type: "story-beat", beat: "pattern-interrupt") for common mistake, real story, or "here's where most people get it wrong."
- Every 5-7 slides: include a brief recap ("Where we are", "What we've built so far") - use type "story-beat" with beat: "recap" when it is a narrative beat.

QUALITY TARGET:
- Output should be publishable as-is. No "we'll cover this later" or shallow placeholders.
- Every concept is explained fully. A beginner with zero prior knowledge should understand.
- Depth over breadth: prefer thorough coverage of fewer topics than superficial coverage of many.
- Split complex concepts across multiple slides rather than cramming. One idea per slide, fully explained.

SCRIPT LENGTH (per slide):
- Use 50-90 words per slide. Use as many words as needed to explain the concept completely.
- Do NOT rush. Short scripts (under 40 words) feel shallow. When a concept needs more, use more.
- Maximum ${MAX_WORDS_PER_SLIDE} words per slide. If a concept needs more, split it into 2-3 slides.
- Each slide teaches ONE thing completely. The viewer should not need to guess or infer.

SLIDE TYPES:
1. "title" - Module intro (what we'll learn, why it matters). Open with problem or tension, not definition.
2. "content-single" - Single-column bullet layout. Use when no comparison or code. Pure conceptual explanation.
3. "content-two-card" - Two-panel layout (e.g. text + image or animation). Use when you have an image or animation.
4. "code" - Code example WITH full explanation in script (title, script, code, language). Max 5-8 lines per slide; use codeContext (e.g. "index.ts") and visibleLineRange when code exceeds 8 lines.
5. "code-diagram" - Code with visual (title, script, code, language, scene)
6. "comparison" - Two-column (title, script, leftTitle, leftItems[], rightTitle, rightItems[])
7. "bullets-code" - Bullets on left, code on right. Use for "here's the idea" + "here's the code" side-by-side.
8. "sequential-bullet" - Bullets appear one at a time. Use for step-by-step processes.
9. "story-beat" - Narrative moment: pattern interrupt, recap, twist, or common mistake. Use beat: "pattern-interrupt" | "recap" | "twist" | "resolution".

SLIDE TYPE SELECTION (choose based on content):
- "comparison": When comparing two approaches, options, or tradeoffs (e.g. "SaaS vs On-Prem", "X vs Y"). Use leftTitle/leftItems, rightTitle/rightItems.
- "code": When the slide teaches or demonstrates code. Include actual code in the "code" field. Use for: commands, snippets, implementations.
- "code-diagram": When code is shown alongside a visual diagram (e.g. architecture, flow).
- "bullets-code": When explaining a concept with a code example side-by-side (bullets left, code right).
- "content-single" or "content-two-card": For pure conceptual explanation with bullet points. Use content-single for single-column; content-two-card when you have an image.
- "sequential-bullet": When bullets should appear one at a time (e.g. step-by-step process).
- "story-beat": For pattern interrupts ("here's where most people get it wrong"), recaps ("what we've built so far"), or "here's the twist" moments. Include beat field.

MANDATORY VARIETY:
- Technical courses: At least 35% code, code-diagram, or bullets-code slides. Every concept that involves code MUST have a code slide.
- When comparing two things: use "comparison", not content-single.
- Avoid long content-single slides (over 60s). Prefer splitting or using comparison/code to break up.

BULLET POINTS (for timing sync):
- Extract from script using EXACT phrases (3-8 words each). Max 4 per slide.
- Bullets must appear verbatim in the script so narration can sync.

SLIDE COUNT AND STRUCTURE:
- 10-18 slides per module for technical topics. Err on more slides rather than fewer.
- At least 35% code slides for technical courses. Every concept needs working code.
- Pattern: Concept (with analogy) -> Code example -> Line-by-line explanation -> Common pitfalls or best practices -> Next concept
- For code slides: ALWAYS include the actual code in the "code" field. No placeholders. Show real, runnable snippets.

CODE SLIDE SCRIPTS - MANDATORY (never skip):
- Every code or bullets-code slide script MUST walk through the code line by line or chunk by chunk.
- GOOD: "The first line imports Fernet. The second generates a key. The third creates the cipher suite. Line four holds our plain text. Line five encrypts it. The hash at the end is the encrypted result."
- BAD: "Let's see a simple example. Notice how this demonstrates the concept. This highlights the need for X." (summary without walking through code = FORBIDDEN)
- BANNED phrases on code slides: "Let's look at", "Notice how", "This demonstrates", "This highlights" without then explaining each line. If you say "notice how" you MUST follow with "Line one does X. Line two does Y."
- Split long code into multiple slides (scripts array, 5-8 lines each). Each slide's script explains ONLY those lines.
- Never skip from concept to "here's the code" without the narrator actually explaining what each part does.

CONTENT DEPTH:
- Define every term before using it. "Docker is a platform that..." not "Docker uses..."
- Use analogies: "Think of it like a shipping container for software."
- Include "why" and "when to use" not just "what".
- Common mistakes: mention what beginners get wrong and how to avoid it.

MODULE TITLE AND SUBTITLE:
- No "Module 1", "Part 1", or numbers. Use topic title + descriptive subtitle.
- Example: title "Introduction to Docker", subtitle "What Containers Are and Why They Matter"

MODULE 0 — COURSE PREVIEW (mandatory for every new course):
- Always include moduleNumber: 0 as the FIRST module in the modules array, before module 1.
- Title: "Course Preview". Subtitle: one line on audience and exam/career positioning.
- 6-8 slides only. Total narration MUST stay under 2 minutes when spoken (~250-300 words across all slides).
- Purpose: lead-conversion preview video (course page / trailer). Sell the path; do not re-teach module 1 content.
- Audience: students and working engineers with assumed baseline (define clearly — e.g. CCNA-level networking, basic automation literacy).
- Position as premium exam prep + labs overview, NOT a beginner-from-zero networking course.
- No third-party platform or vendor brand names except Cisco (e.g. no Udemy, AWS, Google, Microsoft in scripts).
- Use title and content-single/content-two-card slides with imageSrc placeholders under module00/ (no code slides).
- Last slide: clear CTA to start with this course and work labs in order.
- Teaching modules (moduleNumber 1+) follow all rules below; module 0 is exempt from 10-18 slide count and 35% code rules.

OUTPUT FORMAT (JSON):
{
  "courseName": "Course Title",
  "courseId": "course-id-with-dashes",
  "modules": [
    {
      "moduleNumber": 0,
      "title": "Course Preview",
      "subtitle": "Who this path serves and what you will build",
      "slides": [ ... 6-8 preview slides, module00/ imageSrc, under 2 minutes total ... ]
    },
    {
      "moduleNumber": 1,
      "title": "Topic Title",
      "subtitle": "Descriptive one-liner",
      "slides": [
        {
          "name": "unique-slide-name",
          "type": "title|content-single|content-two-card|code|code-diagram|comparison|bullets-code|sequential-bullet|story-beat",
          "script": "50-90 word narration. Explain fully. No jargon without definition.",
          "title": "Slide Title",
          "points": ["phrase from script", "another phrase"],
          "code": "actual code here for code slides",
          "language": "python|javascript|bash|etc",
          "codeContext": "index.ts (for code slides - file path)",
          "visibleLineRange": [1, 5],
          "beat": "pattern-interrupt|recap|twist|resolution (for story-beat only)"
        }
      ]
    }
  ]
}

LAST SLIDE - CONCLUSION:
- Creative title (e.g. "The Big Takeaway", "What This Means for You"). No "Module Summary" or numbers.
- Professor-level insight, simple language. One memorable takeaway. Stands alone.
- No "In the next module...". Close the segment.

SCRIPT STYLE:
- Conversational, like explaining to a friend who knows nothing.
- "Think of it like...", "In simple terms...", "The key insight is..."
- For code: "This line does X. The next line does Y. Together they..."
- Never: "In this slide we will..." - just explain.

AUDIO / NARRATION OPTIMIZATION:
- Scripts will be spoken aloud (TTS or voiceover). Write for the ear, not the eye.
- Vary sentence length: mix short punchy sentences with longer explanatory ones. Avoid long run-ons.
- Hook the first sentence of each slide: start with the insight or question, not setup.
- Spell out acronyms on first use when it helps clarity (e.g., "RAG, or Retrieval-Augmented Generation").
- Use contractions (it's, we're, don't) - they sound more natural when spoken.
- Avoid tongue-twisters and dense jargon clusters. If technical, follow with plain-language restatement.
- End key slides with a clear takeaway phrase the listener can remember.
- Optional: Add SSML for emphasis (e.g. <emphasis level="strong">key term</emphasis>) or pauses (<break time="500ms"/>) before punchlines. Story-beat pattern-interrupt slides get an automatic pause.

CRITICAL - AVOID:
- Shallow slides (under 40 words when concept needs more)
- Code slides without actual code
- Code slides whose script summarizes instead of walking through: "This demonstrates X" without "Line one does A. Line two does B."
- Jargon without definition
- Skipping "why" and "when"
- Assuming prior knowledge

CRITICAL - CODE EXPLANATION:
- Code slide script = narrator walks through the code. Not "here's an example" and stop. The script must reference specific lines or blocks and explain what they do.
- If the code has 5 lines, the script must explain at least 3-4 of them. No exceptions.`;

			// Build user prompt for course only
			const promptLower = (prompt || '').toLowerCase();
			const isTechnicalHint = /\b(hands-on|with code|developer|programming|coding|implementation|tutorial)\b/.test(promptLower);
			const isConceptualHint = /\b(conceptual|overview|introduction|theory)\b/.test(promptLower);
			if (prompt && !title) {
				let techNote = '';
				if (isTechnicalHint) {
					techNote = '\n- CRITICAL: This is a technical course. Use 35%+ code/bullets-code/code-diagram slides. Include actual code for every code slide. Every code slide script MUST walk through the code line by line - "Line one imports X. Line two creates Y." NOT "Let\'s look at this example. Notice how it works." Use comparison slides for "X vs Y" topics.';
				} else if (isConceptualHint) {
					techNote = '\n- Use comparison slides when comparing two approaches (e.g. "SaaS vs On-Prem"). Vary slide types; avoid long content-single slides.';
				}
				userPrompt = `Create a Udemy-quality video course based on this request:

"${prompt}"

Requirements:
- ALWAYS include moduleNumber 0 (Course Preview) as the first module: 6-8 slides, under 2 minutes total, no third-party brand names except Cisco.
- Generate ${moduleCount || '6-12'} teaching modules (moduleNumber 1+) depending on topic complexity. Comprehensive topics need more modules.
- Each module: 10-18 slides. Err on more slides for depth.
- Udemy quality: comprehensive, beginner-friendly, publishable as-is. No editing needed.
- Do NOT use "Module 1", "Module 2", etc. in title or subtitle
- Last slide of each module: strategic conclusion with creative title (no "Summary"). Professor-level insight.
- 35%+ code slides for technical topics. Every concept needs working code - include actual code, not placeholders. Every code slide script must walk through the code (explain specific lines), not just summarize.
- 50-90 words per slide. Use as many as needed to explain fully.
- Assume zero prior knowledge. Define every term. Include analogies and "why".
- Depth over breadth. Split complex concepts across multiple slides.${techNote}`;
			} else {
				userPrompt = 'Create a Udemy-quality video course with the following specifications:\n\n';
				if (title) userPrompt += `Title: ${title}\n`;
				if (description) userPrompt += `Description: ${description}\n`;
				if (targetAudience) userPrompt += `Target Audience: ${targetAudience}\n`;
				if (keyTopics && keyTopics.length) userPrompt += `Key Topics:\n${keyTopics.map(t => `- ${t}`).join('\n')}\n`;
				if (moduleCount) userPrompt += `Number of Modules: ${moduleCount}\n`;
				
				userPrompt += `\nUdemy quality: comprehensive, beginner-friendly, publishable as-is.
- 10-18 slides per module. 50-90 words per slide. 35%+ code slides for technical content.
- Include actual code for every code slide. No placeholders. Code slide scripts must walk through the code line by line, not summarize.
- Depth over breadth. Assume zero prior knowledge. Define every term.`;
			}
		}
		
		console.log('[plan-course] Calling OpenAI GPT-4...', contentKind);
		
		// Create AbortController with extended timeout for connection and request
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 seconds for comprehensive courses
		
		let response;
		try {
			response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: 'gpt-4o',
					messages: [
						{ role: 'system', content: systemPrompt },
						{ role: 'user', content: userPrompt }
					],
					temperature: 0.6,
					max_completion_tokens: 16384,
					response_format: { type: 'json_object' }
				}),
				signal: controller.signal
			});
		} catch (error) {
			clearTimeout(timeoutId);
			if (error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT') {
				console.error('[plan-course] Connection timeout error:', error.message);
				return res.status(504).json({ 
					error: 'Connection timeout: Unable to reach OpenAI API. Please check your internet connection and try again.' 
				});
			}
			console.error('[plan-course] Network error:', error.message);
			return res.status(500).json({ 
				error: `Network error: ${error.message}` 
			});
		} finally {
			clearTimeout(timeoutId);
		}
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('[plan-course] OpenAI error:', errorText);
			return res.status(500).json({ error: `OpenAI API error: ${response.status}` });
		}
		
		const data = await response.json();
		const content = data.choices[0].message.content;
		const planOutput = JSON.parse(content);

		normalizePlanSlides(planOutput);

		if (contentKind === 'marketing' && Array.isArray(planOutput.modules)) {
			planOutput.marketingPack = true;
			for (const mod of planOutput.modules) {
				if (mod.moduleNumber === 1 || mod.moduleNumber === 2) {
					mod.videoCategory = mod.videoCategory || 'short';
					mod.outputPlatform = mod.outputPlatform || (mod.moduleNumber === 1 ? 'youtube-shorts' : 'facebook-reel');
				} else if (mod.moduleNumber >= 3) {
					mod.videoCategory = mod.videoCategory || 'standard';
					mod.outputPlatform = mod.outputPlatform || 'udemy-trailer';
				}
			}
		}
		
		// Post-process: Fix backslash issues and validate scripts
		const maxWordsDefault = contentKind === 'shorts' ? 25 : (contentKind === 'video' ? 45 : MAX_WORDS_PER_SLIDE);
		const minWordsDefault = contentKind === 'shorts' ? 10 : (contentKind === 'video' ? 8 : 35);
		const warnings = [];
		for (const mod of planOutput.modules || []) {
			for (const slide of mod.slides || []) {
				// Fix improperly escaped backslashes in scripts
				if (slide.script) {
					slide.script = slide.script.replace(/\\(?![nrt"\\])/g, '\\\\');
					// Strip format instruction prefixes (e.g. "8-12 words. " or "18-30 words. ") that AI sometimes copies
					slide.script = slide.script.replace(/^\s*\d+-\d+\s*words\.?\s*/i, '').trim();
				}
				if (slide.code) {
					// Code blocks may have intentional backslashes, leave as-is
				}

				const isMarketingShort = contentKind === 'marketing' && mod.videoCategory === 'short';
				const maxWordsForSlide = isMarketingShort ? 25 : (contentKind === 'marketing' ? 90 : maxWordsDefault);
				const minWordsForSlide = isMarketingShort ? 10 : (contentKind === 'marketing' ? 15 : minWordsDefault);
				
				const words = slideWordCount(slide);
				
				// Check for truncated scripts
				const scriptText = slide.script || '';
				const endsWithBackslash = scriptText.endsWith('\\');
				const isTooShort = words < minWordsForSlide && slide.type !== 'title';
				
				if (endsWithBackslash) {
					warnings.push({
						type: 'truncated',
						module: mod.moduleNumber,
						slide: slide.name,
						message: 'Script may be truncated (ends with backslash)',
						words: words
					});
				}
				
				if (isTooShort) {
					warnings.push({
						type: 'short',
						module: mod.moduleNumber,
						slide: slide.name,
						message: `Script too short (${words} words, minimum ${minWordsForSlide})`,
						words: words
					});
				}
				
				if (words > maxWordsForSlide) {
					warnings.push({
						type: 'long',
						module: mod.moduleNumber,
						slide: slide.name,
						words: words,
						maxWords: maxWordsForSlide,
						message: `Script too long (${words} words, max ${maxWordsForSlide})`,
						estimatedSeconds: estimateDuration(slide.script)
					});
				}

				// Slide type validation: suggest comparison when script compares two things
				if (contentKind === 'course' && slide.type === 'content-single' && slide.script) {
					const scriptLower = slide.script.toLowerCase();
					if (/\b(vs\.?|versus|compared to|either\.\.\.or|on one hand|on the other)\b/.test(scriptLower) ||
						(/\bvs\b/.test(scriptLower) && scriptLower.includes(' and '))) {
						warnings.push({
							type: 'slide-type',
							module: mod.moduleNumber,
							slide: slide.name,
							message: 'Consider changing to "comparison" slide - script compares two approaches',
							suggestedType: 'comparison'
						});
					}
				}
			}
		}

		// Video: warn if modules have too few slides (skeleton output)
		if (contentKind === 'video' && planOutput.modules) {
			for (const mod of planOutput.modules) {
				if ((mod.slides || []).length < 6) {
					warnings.push({
						type: 'skeleton',
						module: mod.moduleNumber,
						message: `Module has only ${(mod.slides || []).length} slides. Videos need 6-25 slides (5-20 min). Consider regenerating with more substance.`
					});
				}
			}
		}

		// Course: validate slide type variety (code-like slides for technical content)
		if (contentKind === 'course' && planOutput.modules) {
			let totalSlides = 0;
			let codeLikeSlides = 0;
			const codeTypes = ['code', 'code-diagram', 'bullets-code'];
			for (const mod of planOutput.modules) {
				for (const slide of mod.slides || []) {
					totalSlides++;
					if (codeTypes.includes(slide.type)) codeLikeSlides++;
				}
			}
			const codePct = totalSlides > 0 ? codeLikeSlides / totalSlides : 0;
			if (totalSlides >= 10 && codePct < 0.35) {
				const promptLower = (req.body.prompt || '').toLowerCase();
				const isTechnical = /\b(hands-on|with code|developer|programming|coding|implementation|tutorial|docker|aws|api)\b/.test(promptLower);
				if (isTechnical) {
					warnings.push({
						type: 'variety',
						message: `Only ${Math.round(codePct * 100)}% code/bullets-code slides. Technical courses should have 35%+ code slides for engagement.`,
						codeLikeSlides,
						totalSlides
					});
				}
			}
		}
		
		// Calculate stats
		let totalSlides = 0;
		let totalWords = 0;
		for (const mod of planOutput.modules || []) {
			for (const slide of mod.slides || []) {
				totalSlides += 1;
				totalWords += slideWordCount(slide);
			}
		}
		
		console.log(`[plan-course] Generated: ${planOutput.modules.length} modules, ${totalSlides} slides`);
		
		res.json({
			success: true,
			plan: planOutput,
			stats: {
				modules: planOutput.modules.length,
				slides: totalSlides,
				totalWords: totalWords,
				estimatedDuration: Math.ceil(totalWords / 2.5 / 60) + ' minutes'
			},
			warnings: warnings
		});
		
	} catch (error) {
		console.error('[plan-course] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Save a planned course to moduleContent.ts
app.post('/api/save-plan', (req, res) => {
	try {
		const { plan, contentType } = req.body;
		
		if (!plan || !plan.modules || !plan.courseName) {
			return res.status(400).json({ error: 'Invalid plan structure' });
		}

		normalizePlanSlides(plan);
		
		const contentKind = contentType === 'marketing' ? 'marketing'
			: contentType === 'shorts' ? 'shorts'
			: (contentType === 'video' ? 'video' : 'course');
		
		// Extract courseId from plan
		const courseId = plan.courseId || plan.courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		
		// Normalize: remove "Module N:" / "Video N:" from subtitles and "Module N Summary" from conclusion slide titles (multi-purpose video)
		for (const mod of plan.modules) {
			if (mod.subtitle && (/^Module \d+:\s*/i.test(mod.subtitle) || /^Video \d+:\s*/i.test(mod.subtitle))) {
				mod.subtitle = mod.subtitle.replace(/^(Module|Video) \d+:\s*/i, '').trim();
			}
			const slides = mod.slides || [];
			if (slides.length > 0) {
				const lastSlide = slides[slides.length - 1];
				if (lastSlide.title && /^Module \d+\s*Summary\s*:?\s*/i.test(lastSlide.title)) {
					const after = lastSlide.title.replace(/^Module \d+\s*Summary\s*:?\s*/i, '').trim();
					lastSlide.title = after || 'Conclusion';
				}
			}
		}
		
		// Generate moduleContent.ts code
		const lines = [
			`// Auto-generated course content by AI Planner`,
			`// Course: ${plan.courseName}`,
			`// Generated: ${new Date().toISOString()}`,
			``,
			`export interface SlideContent {`,
			`	name: string;`,
			`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison" | "story-beat";`,
			`	script: string;`,
			`	title?: string;`,
			`	subtitle?: string;`,
			`	points?: string[];`,
			`	code?: string;`,
			`	language?: string;`,
			`	imageSrc?: string;`,
			`	leftTitle?: string;`,
			`	leftItems?: string[];`,
			`	rightTitle?: string;`,
			`	rightItems?: string[];`,
			`	scene?: string;`,
			`	scripts?: string[];`,
			`	visibleLineRange?: [number, number];`,
			`	codeContext?: string;`,
			`	filePath?: string;`,
			`	beat?: string;`,
			`}`,
			``,
			`export interface ModuleContent {`,
			`	moduleNumber: number;`,
			`	courseId: string;  // Course this module belongs to (for audio/video paths)`,
			`	title: string;`,
			`	subtitle: string;`,
			`	slides: SlideContent[];`,
			`	videoCategory?: "standard" | "short"; // "short" = portrait 1080x1920, 5s per slide`,
			`	thumbnailText?: string; // Max 3 words for YouTube thumbnail (video content)`,
			`}`,
			``
		];
		
		// Generate each module (include videoCategory for shorts so rendering uses portrait/5s)
		for (const mod of plan.modules) {
			lines.push(`export const module${mod.moduleNumber}Content: ModuleContent = {`);
			lines.push(`	moduleNumber: ${mod.moduleNumber},`);
			lines.push(`	courseId: ${JSON.stringify(courseId)},`);
			lines.push(`	title: ${JSON.stringify(mod.title)},`);
			lines.push(`	subtitle: ${JSON.stringify(mod.subtitle)},`);
			if (mod.videoCategory === 'short' || mod.videoCategory === 'standard') {
				lines.push(`	videoCategory: ${JSON.stringify(mod.videoCategory)},`);
			} else if (contentKind === 'shorts') {
				lines.push(`	videoCategory: "short",`);
			}
			if (mod.outputPlatform) {
				lines.push(`	outputPlatform: ${JSON.stringify(mod.outputPlatform)},`);
			}
			if (mod.thumbnailText) {
				lines.push(`	thumbnailText: ${JSON.stringify(mod.thumbnailText)},`);
			}
			lines.push(`	slides: [`);
			
			for (const slide of mod.slides) {
				lines.push(`		{`);
				lines.push(`			name: ${JSON.stringify(slide.name)},`);
				lines.push(`			type: ${JSON.stringify(slide.type)},`);
				if (slide.scripts && slide.scripts.length >= 1) {
					lines.push(`			scripts: ${JSON.stringify(slide.scripts)},`);
				} else {
					lines.push(`			script: ${JSON.stringify(slide.script || '')},`);
				}
				
				if (slide.title) lines.push(`			title: ${JSON.stringify(slide.title)},`);
				if (slide.subtitle) lines.push(`			subtitle: ${JSON.stringify(slide.subtitle)},`);
				if (slide.points) lines.push(`			points: ${JSON.stringify(slide.points)},`);
				if (slide.code) lines.push(`			code: ${JSON.stringify(slide.code)},`);
				if (slide.language) lines.push(`			language: ${JSON.stringify(slide.language)},`);
				if (slide.imageSrc) lines.push(`			imageSrc: ${JSON.stringify(slide.imageSrc)},`);
				if (slide.leftTitle) lines.push(`			leftTitle: ${JSON.stringify(slide.leftTitle)},`);
				if (slide.leftItems) lines.push(`			leftItems: ${JSON.stringify(slide.leftItems)},`);
				if (slide.rightTitle) lines.push(`			rightTitle: ${JSON.stringify(slide.rightTitle)},`);
				if (slide.rightItems) lines.push(`			rightItems: ${JSON.stringify(slide.rightItems)},`);
				if (slide.visibleLineRange) lines.push(`			visibleLineRange: ${JSON.stringify(slide.visibleLineRange)},`);
				if (slide.codeContext) lines.push(`			codeContext: ${JSON.stringify(slide.codeContext)},`);
				if (slide.filePath) lines.push(`			filePath: ${JSON.stringify(slide.filePath)},`);
				if (slide.beat) lines.push(`			beat: ${JSON.stringify(slide.beat)},`);
				
				lines.push(`		},`);
			}
			
			lines.push(`	]`);
			lines.push(`};`);
			lines.push(``);
		}
		
		// Generate allModules export
		const moduleNames = plan.modules.map(m => `module${m.moduleNumber}Content`);
		lines.push(`export const allModules: ModuleContent[] = [`);
		lines.push(`	${moduleNames.join(',\n\t')}`);
		lines.push(`];`);
		
		const code = lines.join('\n');
		const outputPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		// Save content.json to course directory for future reference
		const courseDir = path.join(__dirname, 'courses', courseId);
		fs.mkdirSync(courseDir, { recursive: true });
		fs.mkdirSync(path.join(courseDir, 'timings'), { recursive: true });
		
		const contentJsonPath = path.join(courseDir, 'content.json');
		const contentJson = {
			...plan,
			courseId,
			savedAt: new Date().toISOString()
		};
		fs.writeFileSync(contentJsonPath, JSON.stringify(contentJson, null, 2));
		console.log(`[save-plan] Saved content.json to ${contentJsonPath}`);
		
		// Backup existing moduleContent.ts
		if (fs.existsSync(outputPath)) {
			const backupPath = outputPath.replace('.ts', `.backup.${Date.now()}.ts`);
			fs.copyFileSync(outputPath, backupPath);
			console.log(`[save-plan] Backed up to ${path.basename(backupPath)}`);
		}
		
		fs.writeFileSync(outputPath, code);
		console.log(`[save-plan] Written to ${outputPath}`);
		
		// Update courses.json
		const coursesData = readCoursesJson();
		const existingIndex = coursesData.courses.findIndex(c => c.id === courseId);
		
		const courseEntry = {
			id: courseId,
			title: plan.courseName,
			description: contentKind === 'marketing' ? `Marketing: ${plan.courseName}`
				: contentKind === 'shorts' ? `Shorts: ${plan.courseName}`
				: (contentKind === 'video' ? `Video: ${plan.courseName}` : `AI-generated course: ${plan.courseName}`),
			moduleCount: plan.modules.length,
			status: 'active',
			archivedAt: null,
			contentType: contentKind
		};
		
		if (existingIndex >= 0) {
			coursesData.courses[existingIndex] = courseEntry;
		} else {
			coursesData.courses.push(courseEntry);
		}
		
		coursesData.courseModuleMapping[courseId] = plan.modules.map(m => m.moduleNumber);
		writeCoursesJson(coursesData);
		
		res.json({
			success: true,
			message: `Saved ${plan.modules.length} modules to moduleContent.ts and courses/${courseId}/content.json`,
			courseId: courseId,
			path: outputPath,
			contentJsonPath: contentJsonPath
		});
		
	} catch (error) {
		console.error('[save-plan] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Create new course
app.post('/api/courses', (req, res) => {
	try {
		const { id, title, description } = req.body;
		
		if (!id || !title || !description) {
			return res.status(400).json({ error: 'Course ID, title, and description are required' });
		}
		
		// Validate course ID format
		if (!/^[a-z0-9-]+$/.test(id)) {
			return res.status(400).json({ error: 'Course ID must contain only lowercase letters, numbers, and hyphens' });
		}
		
		// Read current courses data
		const data = readCoursesJson();
		
		// Check if course already exists
		if (data.courses.some(c => c.id === id)) {
			return res.status(400).json({ error: 'Course with this ID already exists' });
		}
		
		// Add new course
		const newCourse = {
			id,
			title,
			description,
			moduleCount: 0,
			status: 'active',
			archivedAt: null
		};
		data.courses.push(newCourse);
		
		// Add course to mapping
		data.courseModuleMapping[id] = [];
		
		if (!writeCoursesJson(data)) {
			return res.status(500).json({ error: 'Failed to save course data' });
		}
		
		console.log(`Created new course: ${id}`);
		res.json({ success: true, courseId: id, course: newCourse });
	} catch (error) {
		console.error('Error creating course:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get active course from moduleContent (source of truth for video processing)
app.get('/api/active-course', (req, res) => {
	const activeCourseId = getActiveCourseFromModuleContent();
	res.json({ activeCourseId });
});

// API: Get all courses (with optional status filter)
// Query params:
//   ?status=active (default) - get active courses only
//   ?status=archived - get archived courses only
//   ?status=all - get all courses
app.get('/api/courses', (req, res) => {
	try {
		const statusFilter = req.query.status || 'active'; // Default to active only
		const data = readCoursesJson();
		
		let courses = data.courses || [];
		console.log(`[api/courses] Found ${courses.length} total courses, filter: ${statusFilter}`);
		
		// Filter by status
		if (statusFilter === 'active') {
			courses = courses.filter(c => c.status === 'active');
		} else if (statusFilter === 'archived') {
			courses = courses.filter(c => c.status === 'archived');
		}
		// Ensure each course has contentType (default 'course' for legacy entries)
		courses = courses.map(c => ({ ...c, contentType: c.contentType || 'course' }));
		
		console.log(`[api/courses] Returning ${courses.length} courses after filter`);
		res.json({ courses, filter: statusFilter });
	} catch (error) {
		console.error('[api/courses] Error reading courses:', error);
		res.status(500).json({ error: error.message, courses: [] });
	}
});

// API: Archive a course (also deactivates from Remotion)
app.post('/api/courses/:id/archive', (req, res) => {
	try {
		const courseId = req.params.id;
		const data = readCoursesJson();
		
		const courseIndex = data.courses.findIndex(c => c.id === courseId);
		if (courseIndex === -1) {
			return res.status(404).json({ error: 'Course not found' });
		}
		
		if (data.courses[courseIndex].status === 'archived') {
			return res.status(400).json({ error: 'Course is already archived' });
		}
		
		console.log(`[archive] Archiving course: ${courseId}`);
		
		const wasActivated = getActivatedCourseId(__dirname) === courseId;
		
		// Step 1: Detach from runtime, git deploy, and Remotion (if this was the activated course)
		try {
			const detachResult = detachArchivedCourse(__dirname, courseId, {
				pruneGit: true,
				clearModuleContent: true,
			});
			console.log(`[archive] Detached runtime paths: ${detachResult.runtimeRemoved.join(', ') || '(none)'}`);
			if (wasActivated) {
				console.log('[archive] Cleared activated moduleContent.ts and public/timings/');
			}
		} catch (deactivateError) {
			console.warn('[archive] Warning: Could not fully detach course:', deactivateError.message);
		}
		
		// Step 2: Archive the course in courses.json
		data.courses[courseIndex].status = 'archived';
		data.courses[courseIndex].archivedAt = new Date().toISOString();
		
		if (!writeCoursesJson(data)) {
			return res.status(500).json({ error: 'Failed to save course data' });
		}
		
		console.log(`[archive] Course "${data.courses[courseIndex].title}" archived successfully`);
		
		res.json({ 
			success: true, 
			message: `Course "${data.courses[courseIndex].title}" archived and detached from deploy`,
			course: data.courses[courseIndex],
			detachedFromGit: true,
			wasActivated,
			note: wasActivated
				? 'Activate another course before rendering. Commit after running: npm run sync:deploy-policy -- --prune-git'
				: 'Archived course removed from git deploy policy. Commit after running: npm run sync:deploy-policy -- --prune-git'
		});
	} catch (error) {
		console.error('Error archiving course:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Restore an archived course (also activates it)
app.post('/api/courses/:id/restore', async (req, res) => {
	const courseId = req.params.id;
	console.log(`[restore] Restoring and activating course: ${courseId}`);
	
	const courseDir = path.join(__dirname, 'courses', courseId);
	const contentJsonPath = path.join(courseDir, 'content.json');
	const scriptsDir = path.join(courseDir, 'course/scripts');
	const timingsDir = path.join(courseDir, 'timings');
	const publicTimingsDir = path.join(__dirname, 'public', 'timings');
	
	// Check if course directory exists
	if (!fs.existsSync(courseDir)) {
		return res.status(404).json({ 
			error: `Course not found: ${courseId}`,
			details: `Expected course directory at: ${courseDir}`
		});
	}
	
	try {
		const data = readCoursesJson();
		const courseIndex = data.courses.findIndex(c => c.id === courseId);
		if (courseIndex === -1) {
			return res.status(404).json({ error: 'Course not found in courses.json' });
		}
		
		if (data.courses[courseIndex].status === 'active') {
			return res.status(400).json({ error: 'Course is already active' });
		}
		
		const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		// Backup existing file
		if (fs.existsSync(moduleContentPath)) {
			const backupPath = moduleContentPath.replace('.ts', `.backup.${Date.now()}.ts`);
			fs.copyFileSync(moduleContentPath, backupPath);
			console.log(`[restore] Backed up to: ${path.basename(backupPath)}`);
		}
		
		let modulesGenerated = 0;
		let courseName = data.courses[courseIndex].title;
		
		// Check which activation method to use
		if (fs.existsSync(contentJsonPath)) {
			// Method 1: Use content.json (standard courses)
			console.log(`[restore] Using content.json activation method`);
			const plan = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
			courseName = plan.courseName || courseName;
			console.log(`[restore] Loaded: ${courseName} (${plan.modules?.length || 0} modules)`);
			
			// Generate moduleContent.ts code
			const lines = [
				`// Auto-generated course content by restoreCourse API`,
				`// Course: ${courseName}`,
				`// Course ID: ${courseId}`,
				`// Restored: ${new Date().toISOString()}`,
				``,
				`export interface SlideContent {`,
				`	name: string;`,
				`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison" | "story-beat";`,
				`	script: string;`,
				`	title?: string;`,
				`	subtitle?: string;`,
				`	points?: string[];`,
				`	code?: string;`,
				`	language?: string;`,
				`	imageSrc?: string;`,
				`	leftTitle?: string;`,
				`	leftItems?: string[];`,
				`	rightTitle?: string;`,
				`	rightItems?: string[];`,
				`	scene?: string;`,
				`	scripts?: string[];`,
				`	visibleLineRange?: [number, number];`,
				`	codeContext?: string;`,
				`	filePath?: string;`,
				`	beat?: string;`,
				`}`,
				``,
				`export interface ModuleContent {`,
				`	moduleNumber: number;`,
				`	courseId: string;`,
				`	title: string;`,
				`	subtitle: string;`,
				`	slides: SlideContent[];`,
				`}`,
				``
			];
			
			for (const mod of plan.modules) {
				lines.push(`export const module${mod.moduleNumber}Content: ModuleContent = {`);
				lines.push(`	moduleNumber: ${mod.moduleNumber},`);
				lines.push(`	courseId: ${JSON.stringify(courseId)},`);
				lines.push(`	title: ${JSON.stringify(mod.title)},`);
				lines.push(`	subtitle: ${JSON.stringify(mod.subtitle)},`);
				lines.push(`	slides: [`);
				
				for (const slide of mod.slides) {
					lines.push(`		{`);
					lines.push(`			name: ${JSON.stringify(slide.name)},`);
					lines.push(`			type: ${JSON.stringify(slide.type)},`);
					if (slide.scripts && slide.scripts.length >= 1) {
						lines.push(`			scripts: ${JSON.stringify(slide.scripts)},`);
					} else {
						lines.push(`			script: ${JSON.stringify(slide.script || '')},`);
					}
					
					if (slide.title) lines.push(`			title: ${JSON.stringify(slide.title)},`);
					if (slide.subtitle) lines.push(`			subtitle: ${JSON.stringify(slide.subtitle)},`);
					if (slide.points) lines.push(`			points: ${JSON.stringify(slide.points)},`);
					if (slide.code) lines.push(`			code: ${JSON.stringify(slide.code)},`);
					if (slide.language) lines.push(`			language: ${JSON.stringify(slide.language)},`);
					if (slide.imageSrc) lines.push(`			imageSrc: ${JSON.stringify(slide.imageSrc)},`);
					if (slide.leftTitle) lines.push(`			leftTitle: ${JSON.stringify(slide.leftTitle)},`);
					if (slide.leftItems) lines.push(`			leftItems: ${JSON.stringify(slide.leftItems)},`);
					if (slide.rightTitle) lines.push(`			rightTitle: ${JSON.stringify(slide.rightTitle)},`);
					if (slide.rightItems) lines.push(`			rightItems: ${JSON.stringify(slide.rightItems)},`);
					if (slide.visibleLineRange) lines.push(`			visibleLineRange: ${JSON.stringify(slide.visibleLineRange)},`);
					if (slide.codeContext) lines.push(`			codeContext: ${JSON.stringify(slide.codeContext)},`);
					if (slide.filePath) lines.push(`			filePath: ${JSON.stringify(slide.filePath)},`);
					if (slide.beat) lines.push(`			beat: ${JSON.stringify(slide.beat)},`);
					
					lines.push(`		},`);
				}
				
				lines.push(`	]`);
				lines.push(`};`);
				lines.push(``);
			}
			
			const moduleNames = plan.modules.map(m => `module${m.moduleNumber}Content`);
			lines.push(`export const allModules: ModuleContent[] = [`);
			lines.push(`	${moduleNames.join(',\n\t')}`);
			lines.push(`];`);
			
			fs.writeFileSync(moduleContentPath, lines.join('\n'));
			modulesGenerated = plan.modules?.length || 0;
			console.log(`[restore] Written: moduleContent.ts (${modulesGenerated} modules)`);
			
		} else if (fs.existsSync(scriptsDir)) {
			// Method 2: Use script files (SSML-based courses like agentic-ai-for-beginners)
			console.log(`[restore] Using script files activation method`);
			try {
				// Run the activation script
				const result = execSync(`npx tsx scripts/activateCourseFromSSML.ts ${courseId}`, { 
					cwd: __dirname, 
					stdio: ['ignore', 'pipe', 'pipe'],
					encoding: 'utf-8'
				});
				console.log(`[restore] Script output:`, result);
				
				// Wait a moment for file system to sync
				await new Promise(resolve => setTimeout(resolve, 500));
				
				// Verify the file was actually updated
				if (!fs.existsSync(moduleContentPath)) {
					throw new Error('moduleContent.ts was not created');
				}
				
				const generatedContent = fs.readFileSync(moduleContentPath, 'utf-8');
				
				// Verify it contains the correct courseId
				const hasCorrectCourseId = generatedContent.includes(`courseId: "${courseId}"`) || 
				                           generatedContent.includes(`courseId: '${courseId}'`);
				
				if (!hasCorrectCourseId) {
					console.error(`[restore] ERROR: Generated file does not contain correct courseId "${courseId}"`);
					console.error(`[restore] File content preview (first 1000 chars):`, generatedContent.substring(0, 1000));
					throw new Error(`Generated moduleContent.ts does not contain courseId "${courseId}". The activation script may have failed.`);
				}
				
				// Count modules
				const moduleMatches = generatedContent.match(/export const module\d+Content/g);
				modulesGenerated = moduleMatches ? moduleMatches.length : 0;
				console.log(`[restore] Successfully generated moduleContent.ts from scripts (${modulesGenerated} modules for course "${courseId}")`);
			} catch (scriptErr) {
				console.error('[restore] Failed to activate from scripts:', scriptErr);
				const errorMsg = scriptErr.message || scriptErr.toString();
				const errorOutput = scriptErr.stderr || scriptErr.stdout || '';
				return res.status(500).json({ 
					error: 'Failed to activate course from scripts',
					details: errorMsg,
					output: errorOutput
				});
			}
		} else {
			return res.status(404).json({ 
				error: `Course structure not recognized: ${courseId}`,
				details: `Expected either content.json or course/scripts/ directory`
			});
		}
		
		// Step 3: Copy timings to public/timings/
		if (!fs.existsSync(publicTimingsDir)) {
			fs.mkdirSync(publicTimingsDir, { recursive: true });
		}
		
		// Clear existing timings
		const existingFiles = fs.readdirSync(publicTimingsDir).filter(f => f.endsWith('.json'));
		for (const file of existingFiles) {
			fs.unlinkSync(path.join(publicTimingsDir, file));
		}
		console.log(`[restore] Cleared ${existingFiles.length} existing timing files`);
		
		// Copy course timings
		let timingsCopied = 0;
		if (fs.existsSync(timingsDir)) {
			const timingFiles = fs.readdirSync(timingsDir).filter(f => f.endsWith('.json'));
			for (const file of timingFiles) {
				fs.copyFileSync(
					path.join(timingsDir, file),
					path.join(publicTimingsDir, file)
				);
				timingsCopied++;
			}
			console.log(`[restore] Copied ${timingsCopied} timing files`);
		}
		
		// Step 3.5: Align diagram phases (generate animation specs, copy SVGs)
		try {
			execSync(`npx tsx scripts/generateAnimationSpecs.ts ${courseId}`, { cwd: __dirname, stdio: 'pipe' });
			execSync(`npx tsx scripts/copySvgsToPublic.ts ${courseId}`, { cwd: __dirname, stdio: 'pipe' });
			console.log('[restore] Diagram phases aligned');
		} catch (alignErr) {
			console.warn('[restore] Align diagram phases skipped or failed:', alignErr?.message || alignErr);
		}
		
		// Step 4: Update courses.json (restore status)
		data.courses[courseIndex].status = 'active';
		data.courses[courseIndex].archivedAt = null;
		
		if (!writeCoursesJson(data)) {
			return res.status(500).json({ error: 'Failed to save course data' });
		}

		const policy = applyCourseDeployPolicy(__dirname, { pruneGit: true });
		
		res.json({
			success: true,
			message: `Course "${courseName}" has been restored, activated, and added to deployable courses`,
			course: data.courses[courseIndex],
			courseId,
			modulesGenerated,
			timingsCopied,
			deployableCourseIds: policy.deployableCourseIds,
			note: 'All active courses are deployable. Commit after: npm run sync:deploy-policy -- --prune-git'
		});
		
	} catch (error) {
		console.error('[restore] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Activate a course (scene-safe: uses activateCourse.ts script)
app.post('/api/courses/:id/activate', (req, res) => {
	const courseId = req.params.id;
	console.log(`[activate] Activating course: ${courseId}`);

	const courseDir = path.join(__dirname, 'courses', courseId);
	const contentJsonPath = path.join(courseDir, 'content.json');
	const scriptsDir = path.join(courseDir, 'course', 'scripts');

	if (!fs.existsSync(contentJsonPath) && !fs.existsSync(scriptsDir)) {
		return res.status(404).json({
			error: `Course not found: ${courseId}`,
			details: `Expected content.json or course/scripts/ under courses/${courseId}/`,
		});
	}

	try {
		const output = runActivateCourseScript(courseId);
		const policy = applyCourseDeployPolicy(__dirname, { pruneGit: false });
		res.json({
			success: true,
			message: courseUsesSceneVisuals(courseId)
				? `Course "${courseId}" activated with SVG scene modules (not GenericModule)`
				: `Course "${courseId}" activated successfully`,
			courseId,
			visualMode: courseUsesSceneVisuals(courseId) ? 'scenes' : 'slides',
			output: output || undefined,
			deployableCourseIds: policy.deployableCourseIds,
			note: 'Restart Remotion Studio. Before git push: npm run sync:deploy-policy -- --prune-git',
		});
	} catch (error) {
		console.error('[activate] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get all modules (optionally filtered by course)
app.get('/api/modules', (req, res) => {
	try {
		const courseId = req.query.course; // Optional - if not provided, return all modules
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Extract module data using regex (simple approach)
		const moduleMatches = content.match(/export const module\d+Content: ModuleContent = \{[\s\S]*?\};/g);
		
		if (!moduleMatches) {
			return res.json({ modules: [], courseId: courseId || 'all' });
		}
		
		// Get course-to-module mappings from courses.json
		const coursesData = readCoursesJson();
		const courseModuleMap = coursesData.courseModuleMapping || {};
		
		// If courseId is specified, filter to that course's modules
		let moduleNumbers = [];
		if (courseId && courseModuleMap[courseId]) {
			moduleNumbers = courseModuleMap[courseId];
		}
		
		const modules = moduleMatches
			.map((match) => {
				// Extract actual module number from the export statement
				const moduleNumberMatch = match.match(/export const module(\d+)Content:/);
				if (!moduleNumberMatch) {
					return null;
				}
				const moduleNumber = parseInt(moduleNumberMatch[1]);

				// Match courseId inside this module block (source of truth when course is selected)
				const blockCourseIdMatch = match.match(/courseId:\s*["']([a-zA-Z0-9_-]+)["']/);
				const blockCourseId = blockCourseIdMatch ? blockCourseIdMatch[1] : null;

				// If courseId is specified, only include modules that belong to that course
				if (courseId) {
					if (blockCourseId) {
						if (blockCourseId !== courseId) return null;
					} else if (moduleNumbers.length > 0 && !moduleNumbers.includes(moduleNumber)) {
						return null;
					}
				}
				
				// Find which course(s) this module belongs to
				const moduleCourseIds = [];
				for (const [cId, modNums] of Object.entries(courseModuleMap)) {
					if (modNums.includes(moduleNumber)) {
						moduleCourseIds.push(cId);
					}
				}
				// If module doesn't belong to any course, assign to first course or 'uncategorized'
				const assignedCourseId = moduleCourseIds.length > 0 ? moduleCourseIds[0] : (courseId || 'uncategorized');
				
				const titleMatch = match.match(/title:\s*"([^"]+)"/);
				const subtitleMatch = match.match(/subtitle:\s*"([^"]+)"/);
				const slidesContent = extractSlidesContent(match);
				
				// Check if module is ready for Remotion (needs: module files, audio files, audio durations)
				const moduleFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}.tsx`);
				const configFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}Config.ts`);
				const hasModuleFiles = fs.existsSync(moduleFile) && fs.existsSync(configFile);
				
				// Check audio files (use course-specific directory)
				const course = courseId || 'default';
				const audioDir = path.join(__dirname, 'public', 'audio', course);
				const slideNames = slidesContent ? extractSlideNames(slidesContent) : [];
				const audioFiles = slideNames.map(name => path.join(audioDir, `module${moduleNumber}-${name}.wav`));
				const hasAllAudio = audioFiles.length > 0 && audioFiles.every(file => fs.existsSync(file) && fs.statSync(file).size > 0);
				const audioComplete = audioFiles.filter(file => fs.existsSync(file) && fs.statSync(file).size > 0).length;
				
				// Check audio durations (with course prefix)
				const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
				let hasAudioDurations = false;
				if (fs.existsSync(audioDurationPath)) {
					const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
					// Audio duration keys now include course prefix: {courseId}/module{N}-{name}
					const audioKeys = slideNames.map(name => `${course}/module${moduleNumber}-${name}`);
					hasAudioDurations = audioKeys.every(key => {
						const keyPattern = new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
						return keyPattern.test(audioDurationContent);
					});
				}
				
				// Check word timings from course-specific JSON (REQUIRED for fully animated)
				const courseTimingsDir = path.join(__dirname, 'courses', course, 'timings');
				const timingsJsonPath = path.join(courseTimingsDir, `module${moduleNumber}.json`);
				let hasTimings = false;
				let timingsComplete = false; // All slides have word timings
				if (fs.existsSync(timingsJsonPath)) {
					try {
						const moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
						if (moduleTimings.slides) {
							// Check if ALL slides have word timings
							const slidesWithTimings = slideNames.filter(slideName => {
								const slideTimings = moduleTimings.slides[slideName];
								return slideTimings && slideTimings.words && slideTimings.words.length > 0;
							});
							hasTimings = slidesWithTimings.length > 0;
							timingsComplete = slidesWithTimings.length === slideNames.length;
						}
					} catch (e) {
						// Invalid JSON
					}
				}
				
				// Basic preview: Steps 1-3 complete (can view in Remotion but animations won't sync)
				const basicPreview = hasModuleFiles && hasAllAudio && hasAudioDurations;
				// Fully animated: All steps complete including word timings (animations sync properly)
				const fullyAnimated = basicPreview && timingsComplete;
				
				// Legacy: readyForRemotion = basicPreview (for backward compatibility)
				// New: animationStatus clearly distinguishes the two states
				const readyForRemotion = basicPreview;
				
				return {
					moduleNumber,
					courseId: assignedCourseId,
					courseIds: moduleCourseIds, // All courses this module belongs to
					title: titleMatch ? titleMatch[1] : `Module ${moduleNumber}`,
					subtitle: subtitleMatch ? subtitleMatch[1] : '',
					slideCount: slideNames.length,
					readyForRemotion,
					// NEW: Clear animation status
					animationStatus: fullyAnimated ? 'fullyAnimated' : (basicPreview ? 'basicPreview' : 'incomplete'),
					// Step status for UI indicators
					stepStatus: {
						segmentGenerated: hasModuleFiles,
						audioGenerated: hasAllAudio,
						audioMeasured: hasAudioDurations,
						timingsExtracted: timingsComplete // Changed: now requires ALL slides
					},
					audioComplete,
					audioTotal: slideNames.length
				};
			})
			.filter(m => m !== null);
		
		res.json({ modules, courseId: courseId || 'all' });
	} catch (error) {
		console.error('Error reading modules:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get full module content (parsed)
app.get('/api/modules/:moduleNumber', async (req, res) => {
	try {
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Try to use the TypeScript parser if available, otherwise return raw
		try {
			const { execSync } = require('child_process');
			// Use tsx to run the parser
			const parserPath = path.join(__dirname, 'scripts', 'parseModuleContent.ts');
			const result = execSync(`npx tsx ${parserPath}`, { encoding: 'utf-8', cwd: __dirname });
			// For now, return raw content - full parsing integration coming
			res.json({ content, parsed: false });
		} catch {
			// Fallback to raw content
			res.json({ content, parsed: false });
		}
	} catch (error) {
		console.error('Error reading module:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get slide splits for a course
app.get('/api/slide-splits', (req, res) => {
	try {
		const courseId = req.query.course;
		if (!courseId) {
			return res.status(400).json({ error: 'course query parameter is required' });
		}
		const splitsPath = path.join(__dirname, 'courses', courseId, 'slide-splits.json');
		if (!fs.existsSync(splitsPath)) {
			return res.json({ splits: {}, courseId });
		}
		const raw = JSON.parse(fs.readFileSync(splitsPath, 'utf-8'));
		const splits = {};
		for (const [key, val] of Object.entries(raw)) {
			if (key.startsWith('_')) continue;
			if (val && Array.isArray(val.splitAt) && val.splitAt.length >= 1) {
				splits[key] = val;
			}
		}
		res.json({ splits, courseId });
	} catch (error) {
		console.error('[slide-splits] GET error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Save slide splits for a course
app.post('/api/slide-splits', (req, res) => {
	try {
		const { courseId, splits } = req.body;
		if (!courseId) {
			return res.status(400).json({ error: 'courseId is required' });
		}
		const courseDir = path.join(__dirname, 'courses', courseId);
		if (!fs.existsSync(courseDir)) {
			return res.status(404).json({ error: `Course not found: ${courseId}` });
		}
		const splitsPath = path.join(courseDir, 'slide-splits.json');
		let existing = {};
		if (fs.existsSync(splitsPath)) {
			try {
				existing = JSON.parse(fs.readFileSync(splitsPath, 'utf-8'));
			} catch (e) { /* ignore */ }
		}
		const toWrite = { _comment: existing._comment || 'Define slide splits. splitAt = seconds where to cut. Omit segments to auto-distribute points.' };
		if (splits && typeof splits === 'object') {
			for (const [key, val] of Object.entries(splits)) {
				if (key.startsWith('_')) continue;
				if (val && Array.isArray(val.splitAt) && val.splitAt.length >= 1) {
					const prev = existing[key];
					toWrite[key] = {
						splitAt: val.splitAt,
						segments: val.segments ?? prev?.segments,
						keyWords: val.keyWords ?? prev?.keyWords,
					};
				}
			}
		}
		fs.writeFileSync(splitsPath, JSON.stringify(toWrite, null, 2), 'utf-8');
		// Sync to slideSplitsData.ts for GenericModule (inline - no subprocess)
		try {
			const coursesDir = path.join(__dirname, 'courses');
			const slideSplitsDataPath = path.join(__dirname, 'src', 'utils', 'slideSplitsData.ts');
			const result = {};
			if (fs.existsSync(coursesDir)) {
				for (const cid of fs.readdirSync(coursesDir)) {
					const sp = path.join(coursesDir, cid, 'slide-splits.json');
					if (!fs.existsSync(sp)) continue;
					try {
						const raw = JSON.parse(fs.readFileSync(sp, 'utf-8'));
						const filtered = {};
						for (const [k, v] of Object.entries(raw)) {
							if (k.startsWith('_')) continue;
							if (v && Array.isArray(v.splitAt) && v.splitAt.length >= 1) filtered[k] = v;
						}
						if (Object.keys(filtered).length > 0) result[cid] = filtered;
					} catch (e) { console.warn('[slide-splits] read', sp, e.message); }
				}
			}
			const tsContent = `// Slide splits per course - synced from courses/{courseId}/slide-splits.json
// Updated when Save Splits is clicked in the wizard
// Used by GenericModule at runtime (browser-compatible)

import type { SlideSplitsConfig } from "./expandSlidesWithSplits";

export const slideSplitsByCourse: Record<string, SlideSplitsConfig> = ${JSON.stringify(result, null, 2)};
`;
			fs.writeFileSync(slideSplitsDataPath, tsContent, 'utf-8');
			console.log('[slide-splits] Synced to slideSplitsData.ts:', Object.keys(result).length, 'course(s)');
		} catch (e) {
			console.warn('[slide-splits] sync to slideSplitsData.ts failed:', e.message);
		}
		res.json({ success: true, courseId, splits: toWrite });
	} catch (error) {
		console.error('[slide-splits] POST error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Helper: Parse audio durations from audioDuration.ts
function getAudioDurationsMap() {
	const audioPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
	if (!fs.existsSync(audioPath)) return {};
	const content = fs.readFileSync(audioPath, 'utf-8');
	const map = {};
	const regex = /"([^"]+)"\s*:\s*([\d.]+)/g;
	let m;
	while ((m = regex.exec(content)) !== null) {
		map[m[1]] = parseFloat(m[2]);
	}
	return map;
}

// API: Get slides with durations for a course/module (for slide splits UI)
app.get('/api/slides-with-durations', (req, res) => {
	try {
		const courseId = req.query.course;
		const moduleNumber = req.query.module ? parseInt(req.query.module, 10) : null;
		if (!courseId) {
			return res.status(400).json({ error: 'course query parameter is required' });
		}
		const contentPath = path.join(__dirname, 'courses', courseId, 'content.json');
		if (!fs.existsSync(contentPath)) {
			return res.status(404).json({ error: `content.json not found for course: ${courseId}` });
		}
		const plan = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
		const durationsMap = getAudioDurationsMap();
		const slides = [];
		const modules = plan.modules || [];
		const modsToProcess = moduleNumber != null ? modules.filter(m => m.moduleNumber === moduleNumber) : modules;
		for (const mod of modsToProcess) {
			const modNum = mod.moduleNumber;
			for (const slide of mod.slides || []) {
				const key = `${courseId}/module${modNum}-${slide.name}`;
				const duration = durationsMap[key];
				const canSplit = slide.type === 'content-single' || slide.type === 'content-two-card';
				slides.push({
					name: slide.name,
					title: slide.title || slide.name,
					type: slide.type,
					moduleNumber: modNum,
					durationSeconds: duration != null ? duration : null,
					canSplit,
				});
			}
		}
		res.json({ slides, courseId });
	} catch (error) {
		console.error('[slides-with-durations] error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Create new module
app.post('/api/modules', (req, res) => {
	try {
		const { courseId, moduleNumber, title, subtitle, videoCategory, slides } = req.body;
		
		if (!courseId || !isModuleNumberProvided(moduleNumber) || !title || !subtitle) {
			return res.status(400).json({ error: 'Course ID, module number, title, and subtitle are required' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Check if module already exists
		if (content.includes(`export const module${moduleNumber}Content:`)) {
			return res.status(400).json({ error: `Module ${moduleNumber} already exists` });
		}
		
		// Build slides array
		let slidesCode = '';
		if (slides && Array.isArray(slides) && slides.length > 0) {
			// Use provided slides (validate they're complete)
			slidesCode = slides.filter(slide => slide && slide.name && slide.type && slide.script).map(slide => {
				let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${(slide.script || '').replace(/"/g, '\\"')}"`;
				
				if (slide.type === 'title' && slide.subtitle) {
					slideCode += `,\n\t\t\tsubtitle: "${(slide.subtitle || '').replace(/"/g, '\\"')}"`;
				}
				
				if (slide.title) {
					slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
				}
				
				if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
					const pointsCode = slide.points
						.filter(p => p && p.trim())
						.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
						.join(',\n');
					slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
				}
				
				slideCode += '\n\t\t}';
				return slideCode;
			}).join(',\n');
		} else {
			// Default: just title slide
			slidesCode = `\t\t{
\t\t\tname: "title",
\t\t\ttype: "title",
\t\t\tscript: "Welcome to ${title}",
\t\t\tsubtitle: "${subtitle.replace(/"/g, '\\"')}",
\t\t}`;
		}
		
		// Create new module content
		const videoCategoryLine = videoCategory && videoCategory !== 'standard' 
			? `\tvideoCategory: "${videoCategory}",\n` 
			: '';
		const newModule = `// ============================================================================
// MODULE ${moduleNumber}: ${title}
// ============================================================================
export const module${moduleNumber}Content: ModuleContent = {
\tmoduleNumber: ${moduleNumber},
\ttitle: "${title.replace(/"/g, '\\"')}",
\tsubtitle: "${subtitle.replace(/"/g, '\\"')}",
\tslides: [
${slidesCode}
\t]
};`;
		
		// Add module before allModules array
		const allModulesMatch = content.match(/(export const allModules: ModuleContent\[\] = \[)/);
		if (allModulesMatch) {
			content = content.replace(
				/(export const allModules: ModuleContent\[\] = \[)/,
				`${newModule}$1`
			);
			
			// Add module to allModules array
			const moduleArrayMatch = content.match(/export const allModules: ModuleContent\[\] = \[([\s\S]*?)\];/);
			if (moduleArrayMatch) {
				const modulesContent = moduleArrayMatch[1].trim();
				const newModulesContent = modulesContent
					? `${modulesContent},\n\tmodule${moduleNumber}Content`
					: `\n\tmodule${moduleNumber}Content\n\t`;
				content = content.replace(
					/export const allModules: ModuleContent\[\] = \[[\s\S]*?\];/,
					`export const allModules: ModuleContent[] = [${newModulesContent}\n];`
				);
			}
		}
		
		// Update course structure to include this module
		const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
		let courseContent = fs.readFileSync(coursePath, 'utf-8');
		
		// Find the course mapping and add module number
		const mappingRegex = new RegExp(`('${courseId.replace(/'/g, "\\'")}':\\s*\\[)([\\s\\S]*?)(\\])`);
		const mappingMatch = courseContent.match(mappingRegex);
		if (mappingMatch) {
			const modulesList = mappingMatch[2].trim();
			const newModulesList = modulesList
				? `${modulesList}, ${moduleNumber}`
				: `${moduleNumber}`;
			courseContent = courseContent.replace(
				mappingRegex,
				`$1${newModulesList}$3`
			);
			
			// Update moduleCount for the course
			const courseRegex = new RegExp(`(id:\\s*'${courseId.replace(/'/g, "\\'")}'[\\s\\S]*?moduleCount:\\s*)(\\d+)`);
			const courseMatch = courseContent.match(courseRegex);
			if (courseMatch) {
				const currentCount = parseInt(courseMatch[2]) || 0;
				courseContent = courseContent.replace(courseRegex, `$1${currentCount + 1}`);
			}
		}
		
		fs.writeFileSync(contentPath, content);
		fs.writeFileSync(coursePath, courseContent);
		console.log(`Created new module: ${moduleNumber} for course: ${courseId}`);
		
		res.json({ success: true, moduleNumber });
	} catch (error) {
		console.error('Error creating module:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Improve module - add new slides based on instructions (only new slides need audio/timings)
app.post('/api/modules/:moduleNumber/improve', async (req, res) => {
	try {
		const moduleNumber = parseInt(req.params.moduleNumber);
		const { moduleData, improvementInstructions } = req.body;

		if (!moduleData || !improvementInstructions || typeof improvementInstructions !== 'string') {
			return res.status(400).json({
				error: 'moduleData and improvementInstructions (string) are required'
			});
		}

		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
		}

		const slides = moduleData.slides || [];
		if (slides.length === 0) {
			return res.status(400).json({ error: 'Module has no slides' });
		}

		const systemPrompt = `You are an expert course/video content editor. Your task is to ADD new slides to an existing module based on improvement instructions. You must NOT remove or modify any existing slides. Only add new slides.

RULES:
- Preserve ALL existing slides exactly as given (same name, type, script, title, points, code, etc.)
- Add NEW slides only, inserted in the most relevant section of the module
- New slide names must be unique (e.g. "detail-architecture", "example-auth-flow", "clarification-X")
- Scripts: single paragraph, 40-55 words for standard courses; 15-22 for shorts
- Follow the same slide types: title, content-two-card, content-single, code, comparison, code-diagram, sequential-bullet
- Scripts: 40-55 words per slide for standard; 15-22 for shorts
- Bullet points: extract from script, 3-8 words each, max 4 per slide
- Return valid JSON only: { "slides": [ ... ] } with the full slides array (existing + new, in order)`;

		const userPrompt = `Current module "${moduleData.title}" (${slides.length} slides):

${JSON.stringify(slides, null, 2)}

IMPROVEMENT INSTRUCTIONS:
${improvementInstructions.trim()}

Return the complete slides array as JSON: { "slides": [ ... ] }. Include all existing slides unchanged plus new slides in the appropriate positions.`;

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-4o',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userPrompt }
				],
				temperature: 0.5,
				response_format: { type: 'json_object' }
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
		}

		const json = await response.json();
		const content = json.choices?.[0]?.message?.content;
		if (!content) {
			return res.status(500).json({ error: 'Empty response from AI' });
		}

		let parsed;
		try {
			parsed = JSON.parse(content);
		} catch (e) {
			return res.status(500).json({
				error: 'Invalid JSON from AI',
				details: content.substring(0, 500)
			});
		}

		if (!parsed.slides || !Array.isArray(parsed.slides)) {
			return res.status(500).json({ error: 'AI response missing slides array' });
		}

		const originalNames = new Set(slides.map(s => s.name));
		const newSlides = parsed.slides.filter(s => s && s.name && !originalNames.has(s.name));
		const keptCount = parsed.slides.length - newSlides.length;

		console.log(`[improve-module] Module ${moduleNumber}: ${newSlides.length} new slides added, ${keptCount} existing preserved`);

		res.json({
			success: true,
			moduleNumber,
			slides: parsed.slides,
			title: moduleData.title,
			subtitle: moduleData.subtitle,
			newSlidesCount: newSlides.length,
			message: `Added ${newSlides.length} new slide(s). Save to apply. Only new slides will need audio and timings.`
		});
	} catch (error) {
		console.error('[improve-module] Error:', error);
		res.status(500).json({
			error: error.message || 'Failed to improve module'
		});
	}
});

// API: Save module
app.post('/api/modules/:moduleNumber', (req, res) => {
	try {
		const moduleNumber = parseInt(req.params.moduleNumber);
		const { title, subtitle, slides } = req.body;
		
		if (!title || !subtitle || !slides || !Array.isArray(slides)) {
			return res.status(400).json({ error: 'Title, subtitle, and slides array are required' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find the module
		const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
		const moduleMatch = content.match(moduleRegex);
		
		if (!moduleMatch) {
			return res.status(404).json({ error: `Module ${moduleNumber} not found` });
		}
		
		// Extract existing courseId to preserve it
		const existingModuleBody = moduleMatch[1];
		const courseIdMatch = existingModuleBody.match(/courseId:\s*"([^"]+)"/);
		const courseId = courseIdMatch ? courseIdMatch[1] : 'default';
		
		// Build new module content
		const escapeScript = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
		const slidesCode = slides.map(slide => {
			let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${escapeScript(slide.script)}"`;
			
			if (slide.type === 'title' && slide.subtitle) {
				slideCode += `,\n\t\t\tsubtitle: "${(slide.subtitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.title) {
				slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
				const pointsCode = slide.points
					.filter(p => p && p.trim())
					.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
			}
			
			if (slide.code) {
				slideCode += `,\n\t\t\tcode: \`${slide.code.replace(/`/g, '\\`')}\``;
			}
			
			if (slide.language) {
				slideCode += `,\n\t\t\tlanguage: "${slide.language}"`;
			}
			
			if (slide.leftItems && Array.isArray(slide.leftItems)) {
				const leftItemsCode = slide.leftItems
					.filter(i => i && i.trim())
					.map(i => `\t\t\t\t"${i.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\tleftItems: [\n${leftItemsCode}\n\t\t\t]`;
			}
			
			if (slide.rightItems && Array.isArray(slide.rightItems)) {
				const rightItemsCode = slide.rightItems
					.filter(i => i && i.trim())
					.map(i => `\t\t\t\t"${i.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\trightItems: [\n${rightItemsCode}\n\t\t\t]`;
			}
			
			if (slide.leftTitle) {
				slideCode += `,\n\t\t\tleftTitle: "${(slide.leftTitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.rightTitle) {
				slideCode += `,\n\t\t\trightTitle: "${(slide.rightTitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.imageSrc) {
				slideCode += `,\n\t\t\timageSrc: "${(slide.imageSrc || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.svgPath) {
				slideCode += `,\n\t\t\tsvgPath: "${(slide.svgPath || '').replace(/"/g, '\\"')}"`;
			}
			
			slideCode += '\n\t\t}';
			return slideCode;
		}).join(',\n');
		
		const newModuleContent = `export const module${moduleNumber}Content: ModuleContent = {
\tmoduleNumber: ${moduleNumber},
	courseId: "${courseId}",
\ttitle: "${title.replace(/"/g, '\\"')}",
\tsubtitle: "${subtitle.replace(/"/g, '\\"')}",
\tslides: [
${slidesCode}
\t]
};`;
		
		// Replace the module in the file
		content = content.replace(moduleRegex, newModuleContent);
		
		fs.writeFileSync(contentPath, content);
		console.log(`Saved module ${moduleNumber}`);
		
		res.json({ success: true, moduleNumber });
	} catch (error) {
		console.error('Error saving module:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Save module (old placeholder - keeping for backward compatibility)
app.post('/api/modules/:moduleNumber/old', (req, res) => {
	try {
		const { moduleData } = req.body;
		// TODO: Implement proper TypeScript file writing
		// This is complex - need to parse, modify, and rewrite the file
		// For now, return success
		res.json({ success: true, message: 'Save functionality coming soon' });
	} catch (error) {
		console.error('Error saving module:', error);
		res.status(500).json({ error: error.message });
	}
});

// Pre-flight validation before running module generation script
function validateBeforeModuleGeneration(course, moduleRange) {
	const validation = { valid: true, errors: [], warnings: [] };
	try {
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		if (!fs.existsSync(contentPath)) {
			validation.valid = false;
			validation.errors.push('moduleContent.ts not found. Save a plan from the Video tab first.');
		}
		if (course) {
			const coursesData = readCoursesJson();
			const found = coursesData.courses?.some(c => c.id === course);
			if (!found) {
				validation.warnings.push(`Course "${course}" not in courses.json; generation may still run from moduleContent.ts.`);
			}
		}
	} catch (err) {
		validation.valid = false;
		validation.errors.push(String(err.message));
	}
	return validation;
}

// API: Generate modules
app.post('/api/generate-modules', (req, res) => {
	let { moduleRange, course, audioMode } = req.body;

	if (!course) {
		return res.status(400).json({
			error: 'Course is required',
			details: 'Select a video/course before generating modules. Plain GenericModule generation without a course is disabled.',
		});
	}

	let activationInfo;
	try {
		activationInfo = resolveCourseForProcessing(course, { autoActivate: true });
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			code: err.code,
			activeCourseId: err.activeCourseId,
			selectedCourseId: err.selectedCourseId,
		});
	}
	course = activationInfo.courseId;

	console.log(`[generate-modules] Received request:`, {
		moduleRange,
		course,
		audioMode,
		courseActivated: activationInfo.activated,
		bodyKeys: Object.keys(req.body)
	});
	
	// Derive audioMode from course when not provided (match regenerate-modules behavior)
	if (!audioMode) {
		audioMode = getCourseAudioMode(course);
	}
	
	// If course is provided, get module range from course
	let finalModuleRange = moduleRange || getModuleRangeForCourse(course);
	
	// Pre-flight validation: Check audio files and durations before generating modules
	const validation = validateBeforeModuleGeneration(course, finalModuleRange);
	if (!validation.valid) {
		return res.status(400).json({ 
			error: 'Pre-flight validation failed',
			validation: validation,
			message: validation.errors.join('; ')
		});
	}
	
	if (validation.warnings.length > 0) {
		console.warn('[generate-modules] Pre-flight warnings:', validation.warnings);
	}
	
	const useScenes = courseUsesSceneVisuals(course);
	if (useScenes) {
		audioMode = 'per-module';
		stripMermaidFromSlideSplits(course);
		console.log(`[generate-modules] Scene course "${course}" - using SVG scene generator only`);
	}

	// Choose script based on visual mode / audio mode
	let scriptPath;
	let scriptArgs;
	
	console.log(`[generate-modules] Checking audioMode: "${audioMode}", course: "${course}", useScenes: ${useScenes}`);

	if (useScenes || (audioMode === 'per-module' && course)) {
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromScenes.ts');
		scriptArgs = `${course} ${finalModuleRange || getModuleRangeForCourse(course) || '1-6'}`;
		console.log(`[generate-modules] Using scene-based generator for ${course} with range: ${finalModuleRange || '1-6'}`);
	} else {
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromContent.ts');
		scriptArgs = finalModuleRange || 'all';
		console.log(`[generate-modules] Using slide-based generator with range: ${finalModuleRange || 'all'}`);
	}
	
	const command = `npx tsx "${scriptPath}" ${scriptArgs}`;
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			console.error('Module generation error:', error);
			return res.status(500).json({ error: error.message, stderr: stderr || stdout });
		}
		// Sync slide splits to slideSplitsData.ts for GenericModule
		try {
			require('child_process').execSync('npx tsx scripts/syncSlideSplitsToTs.ts', { cwd: __dirname, stdio: 'pipe' });
		} catch (e) {
			console.warn('[generate-modules] syncSlideSplitsToTs failed:', e.message);
		}
		// Also regenerate line mappings to ensure code highlighting works (skip for per-module mode)
		if (audioMode !== 'per-module') {
			const lineMappingScript = path.join(__dirname, 'scripts', 'generateLineMappingsFromContent.ts');
			const lineMappingCommand = finalModuleRange 
				? `npx tsx "${lineMappingScript}" ${finalModuleRange}`
				: `npx tsx "${lineMappingScript}" all`;
			
			exec(lineMappingCommand, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err, lineMappingStdout, lineMappingStderr) => {
				// Line mapping errors are non-fatal - just log them
				if (err) {
					console.error('Line mapping generation warning:', err.message);
				}
				res.json({ 
					success: true, 
					output: stdout,
					lineMappings: lineMappingStdout || 'Line mappings regenerated',
					audioMode: audioMode || 'per-slide',
					validation: validation,
					courseId: course,
					courseActivated: activationInfo.activated,
					previousCourseId: activationInfo.previousCourseId,
				});
			});
		} else {
			res.json({ 
				success: true, 
				output: stdout,
				audioMode: 'per-module',
				message: 'Scene-based modules generated',
				validation: validation,
				courseId: course,
				courseActivated: activationInfo.activated,
				previousCourseId: activationInfo.previousCourseId,
			});
		}
	});
});

// API: Generate audio (bulk - supports OpenAI, MiniMax, RunPod)
app.post('/api/generate-audio', async (req, res) => {
	const { moduleRange, force, course, provider, voice } = req.body;

	if (!course) {
		return res.status(400).json({
			error: 'Course is required',
			details: 'Select a video/course in the GUI. Audio is generated from moduleContent.ts for that course.',
		});
	}

	let activationInfo;
	try {
		activationInfo = resolveCourseForProcessing(course, { autoActivate: true });
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			code: err.code,
			activeCourseId: err.activeCourseId,
			selectedCourseId: err.selectedCourseId,
		});
	}
	
	const settings = loadVoiceSettings();
	const finalProvider = provider || settings.provider || 'openai';
	const finalVoice = voice || settings.defaultVoice?.[finalProvider] || 'onyx';
	const finalModuleRange = moduleRange || getModuleRangeForCourse(activationInfo.courseId) || 'all';
	
	console.log(`[generate-audio] Provider: ${finalProvider}, Voice: ${finalVoice}, Modules: ${finalModuleRange}, Course: ${activationInfo.courseId}${activationInfo.activated ? ' (activated)' : ''}`);
	
	const scriptPath = path.join(__dirname, 'scripts', 'generateAudioFromContent.ts');
	let command = `npx tsx "${scriptPath}" ${finalModuleRange} "${finalVoice}" ${finalProvider}`;
	if (force) {
		console.warn('[generate-audio] force=true requested but generateAudioFromContent skips existing files by design');
	}
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			return res.status(500).json({ error: error.message, stderr, output: stdout });
		}
		const generatedMatch = stdout.match(/Generated:\s*(\d+)/);
		const skippedMatch = stdout.match(/Skipped:\s*(\d+)/);
		const failedMatch = stdout.match(/Failed:\s*(\d+)/);
		res.json({
			success: true,
			output: stdout,
			generated: generatedMatch ? parseInt(generatedMatch[1], 10) : 0,
			skipped: skippedMatch ? parseInt(skippedMatch[1], 10) : 0,
			failed: failedMatch ? parseInt(failedMatch[1], 10) : 0,
			canResume: failedMatch ? parseInt(failedMatch[1], 10) > 0 : false,
			courseId: activationInfo.courseId,
			courseActivated: activationInfo.activated,
			previousCourseId: activationInfo.previousCourseId,
		});
	});
});

// API: Generate audio for specific module (supports OpenAI, MiniMax, RunPod)
app.post('/api/generate-audio-module', async (req, res) => {
	const { moduleNumber, provider, voice, force, course } = req.body;
	if (!isModuleNumberProvided(moduleNumber)) {
		return res.status(400).json({ error: 'Module number is required' });
	}
	if (!course) {
		return res.status(400).json({
			error: 'Course is required',
			details: 'Pass the selected course id so moduleContent.ts can be activated before TTS runs.',
		});
	}

	let activationInfo;
	try {
		activationInfo = resolveCourseForProcessing(course, { autoActivate: true });
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			code: err.code,
			activeCourseId: err.activeCourseId,
			selectedCourseId: err.selectedCourseId,
		});
	}
	
	const settings = loadVoiceSettings();
	const finalProvider = provider || settings.provider || 'openai';
	const finalVoice = voice || settings.defaultVoice?.[finalProvider] || 'onyx';
	
	console.log(`[generate-audio-module] Module ${moduleNumber}, Course: ${activationInfo.courseId}, Provider: ${finalProvider}, Voice: ${finalVoice}`);
	
	const scriptPath = path.join(__dirname, 'scripts', 'generateAudioFromContent.ts');
	let command = `npx tsx "${scriptPath}" ${moduleNumber} "${finalVoice}" ${finalProvider}`;
	if (force) {
		console.warn('[generate-audio-module] force=true requested but generateAudioFromContent skips existing files by design');
	}
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			console.error('Audio generation error:', error);
			return res.status(500).json({ error: error.message, stderr: stderr || stdout, output: stdout });
		}
		res.json({
			success: true,
			module: moduleNumber,
			output: stdout,
			courseId: activationInfo.courseId,
			courseActivated: activationInfo.activated,
			previousCourseId: activationInfo.previousCourseId,
		});
	});
});

// API: Measure audio durations
app.post('/api/measure-audio', (req, res) => {
	const course = req.query.course || req.body.course;
	// Note: measure-audio script processes all audio files, course filtering is handled at display level
	const scriptPath = path.join(__dirname, 'scripts', 'measureActualAudio.ts');
	const command = `npx tsx "${scriptPath}"`;
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			console.error('Audio measurement error:', error);
			return res.status(500).json({ error: error.message, stderr: stderr || stdout });
		}
		res.json({ success: true, output: stdout });
	});
});

// API: Regenerate modules from moduleContent.ts
app.post('/api/regenerate-modules', (req, res) => {
	const { moduleRange, courseId } = req.body;
	
	// Determine audio mode from course
	let audioMode = 'per-slide'; // default
	if (courseId) {
		try {
			const coursesData = readCoursesJson();
			const course = coursesData.courses?.find(c => c.id === courseId);
			if (course && course.audioMode) {
				audioMode = course.audioMode;
			}
		} catch (e) {
			console.error('Error reading course audio mode:', e);
		}
	}
	
	let finalModuleRange = moduleRange || (courseId ? getModuleRangeForCourse(courseId) : null);
	
	// Choose script based on audio mode / visual mode
	let scriptPath;
	let scriptArgs;

	const useScenes = courseId && courseUsesSceneVisuals(courseId);
	if (useScenes) {
		audioMode = 'per-module';
		stripMermaidFromSlideSplits(courseId);
	}

	if ((audioMode === 'per-module' && courseId) || useScenes) {
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromScenes.ts');
		scriptArgs = `${courseId} ${finalModuleRange || getModuleRangeForCourse(courseId) || '1-6'}`;
		console.log(`[regenerate-modules] Scene course - using generateModulesFromScenes for ${courseId}`);
	} else {
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromContent.ts');
		scriptArgs = finalModuleRange || 'all';
	}
	
	// Pre-flight validation: Check audio files and durations before generating modules
	const validation = validateBeforeModuleGeneration(courseId, finalModuleRange);
	if (!validation.valid) {
		return res.status(400).json({ 
			error: 'Pre-flight validation failed',
			validation: validation,
			message: validation.errors.join('; ')
		});
	}
	
	if (validation.warnings.length > 0) {
		console.warn('[generate-modules] Pre-flight warnings:', validation.warnings);
	}
	
	const runModuleGen = () => {
		const command = `npx tsx "${scriptPath}" ${scriptArgs}`;
		exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
			if (error) {
				console.error('Module regeneration error:', error);
				return res.status(500).json({ error: error.message, stderr: stderr || stdout });
			}
			res.json({ success: true, output: stdout, validation: validation });
		});
	};
	
	if (courseId) {
		const copyPath = path.join(__dirname, 'scripts', 'copySvgsToPublic.ts');
		const runAfterAssets = () => runModuleGen();

		if (useScenes) {
			console.log('[regenerate-modules] Scene course - skipping generateAnimationSpecs (hand-tuned .animation.json)');
			exec(`npx tsx "${copyPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err2) => {
				if (err2) console.warn('copySvgsToPublic (pre-regenerate):', err2.message);
				runAfterAssets();
			});
		} else {
			const genSpecPath = path.join(__dirname, 'scripts', 'generateAnimationSpecs.ts');
			exec(`npx tsx "${genSpecPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err1) => {
				if (err1) {
					console.warn('align-diagram-phases (pre-regenerate):', err1.message);
				}
				exec(`npx tsx "${copyPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err2) => {
					if (err2) console.warn('copySvgsToPublic (pre-regenerate):', err2.message);
					runAfterAssets();
				});
			});
		}
	} else {
		runModuleGen();
	}
});

// API: Align diagram phases to narration (generate animation specs from word timings, then copy SVGs)
app.post('/api/align-diagram-phases', (req, res) => {
	const { courseId } = req.body;
	if (!courseId) {
		return res.status(400).json({ error: 'courseId required' });
	}
	if (courseUsesSceneVisuals(courseId)) {
		return res.status(400).json({
			error: 'Diagram pipeline disabled for SVG scene courses',
			details: 'This course uses hand-tuned SVG scenes and .animation.json files. Use Activate Course or Regenerate Modules (Per-module) instead of align-diagram-phases.',
			visualMode: 'scenes',
		});
	}
	const genSpecPath = path.join(__dirname, 'scripts', 'generateAnimationSpecs.ts');
	const copyPath = path.join(__dirname, 'scripts', 'copySvgsToPublic.ts');
	exec(`npx tsx "${genSpecPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err1, out1, stderr1) => {
		if (err1) {
			console.error('align-diagram-phases: generateAnimationSpecs error:', err1);
			return res.status(500).json({ error: err1.message, output: stderr1 || out1 });
		}
		exec(`npx tsx "${copyPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err2, out2, stderr2) => {
			if (err2) {
				console.error('align-diagram-phases: copySvgsToPublic error:', err2);
				return res.status(500).json({ error: err2.message, output: stderr2 || out2 });
			}
			res.json({ success: true, output: (out1 || '') + '\n' + (out2 || '') });
		});
	});
});

// API: Validate module content for missing properties
app.post('/api/validate-content', (req, res) => {
	const scriptPath = path.join(__dirname, 'scripts', 'validateModuleContent.ts');
	const command = `npx tsx "${scriptPath}"`;
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024, timeout: 60000 }, (error, stdout, stderr) => {
		// Exit code 1 means issues found, not an error
		const hasIssues = error && error.code === 1;
		res.json({ 
			success: true, 
			hasIssues: hasIssues,
			output: stdout 
		});
	});
});

// API: Export all scripts to a text file for manual audio generation
app.get('/api/export-scripts', (req, res) => {
	try {
		const courseId = req.query.course || 'default';
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		if (!fs.existsSync(contentPath)) {
			return res.status(404).json({ error: 'moduleContent.ts not found' });
		}
		
		// Use "Video" vs "Module" in labels based on course contentType (from courses.json)
		let segmentLabel = 'Module';
		try {
			const coursesData = readCoursesJson();
			const course = coursesData.courses.find(c => c.id === courseId);
			const contentType = (course && course.contentType) ? course.contentType : 'course';
			if (contentType === 'video' || contentType === 'shorts') {
				segmentLabel = 'Video';
			}
		} catch (e) {
			// Keep default "Module"
		}
		
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find all modules for this course
		const moduleRegex = /export const module(\d+)Content: ModuleContent = \{([\s\S]*?)\n\};/g;
		let match;
		const scripts = [];
		
		while ((match = moduleRegex.exec(content)) !== null) {
			const moduleNumber = match[1];
			const moduleBody = match[2];
			
			// Check if this module belongs to the requested course
			const courseIdMatch = moduleBody.match(/courseId:\s*"([^"]+)"/);
			const moduleCourseId = courseIdMatch ? courseIdMatch[1] : 'default';
			
			if (moduleCourseId !== courseId && courseId !== 'all') {
				continue;
			}
			
			// Extract slides
			const slidesStart = moduleBody.indexOf('slides:');
			if (slidesStart === -1) continue;
			
			// Find slide names and scripts
			const slideRegex = /\{\s*name:\s*"([^"]+)"[\s\S]*?script:\s*"([^"]+)"/g;
			let slideMatch;
			
			while ((slideMatch = slideRegex.exec(moduleBody)) !== null) {
				const slideName = slideMatch[1];
				const script = slideMatch[2].replace(/\\n/g, '\n').replace(/\\"/g, '"');
				
				scripts.push({
					fileName: `${moduleCourseId}/module${moduleNumber}-${slideName}.wav`,
					moduleNumber: parseInt(moduleNumber),
					slideName,
					script
				});
			}
		}
		
		if (scripts.length === 0) {
			return res.status(404).json({ error: `No scripts found for course: ${courseId}` });
		}
		
		const uniqueModules = [...new Set(scripts.map(s => s.moduleNumber))].sort((a, b) => a - b);
		const segmentCount = uniqueModules.length;
		
		// Generate text file content: header uses segment label (Video/Module) from selected course
		let textContent = `SCRIPTS FOR: ${courseId}\n`;
		textContent += `Generated: ${new Date().toISOString()}\n`;
		textContent += `Total: ${scripts.length} scripts across ${segmentCount} ${segmentLabel.toLowerCase()}${segmentCount !== 1 ? 's' : ''}\n`;
		textContent += `${'='.repeat(60)}\n\n`;
		
		let lastModuleNumber = null;
		for (const item of scripts) {
			if (lastModuleNumber !== item.moduleNumber) {
				textContent += `--- ${segmentLabel} ${item.moduleNumber} ---\n\n`;
				lastModuleNumber = item.moduleNumber;
			}
			textContent += `FILE: ${item.fileName}\n`;
			textContent += `${'-'.repeat(40)}\n`;
			textContent += `${item.script}\n`;
			textContent += `\n${'='.repeat(60)}\n\n`;
		}
		
		// Send as downloadable text file
		const fileName = `scripts-${courseId}-${Date.now()}.txt`;
		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
		res.send(textContent);
		
	} catch (error) {
		console.error('[export-scripts] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Voice Settings File (workspace/config with legacy root fallback)
function resolveVoiceSettingsPath() {
	const workspacePath = path.join(__dirname, 'workspace', 'config', 'voice-settings.json');
	const legacyPath = path.join(__dirname, 'voice-settings.json');
	if (fs.existsSync(workspacePath)) {
		return workspacePath;
	}
	if (fs.existsSync(legacyPath)) {
		return legacyPath;
	}
	return workspacePath;
}

const voiceSettingsPath = resolveVoiceSettingsPath();

function loadVoiceSettings() {
	try {
		if (fs.existsSync(voiceSettingsPath)) {
			return JSON.parse(fs.readFileSync(voiceSettingsPath, 'utf-8'));
		}
	} catch (error) {
		console.error('[voice-settings] Error loading:', error);
	}
	return {
		provider: 'minimax',
		customVoices: [],
		defaultVoice: { runpod: 'andy', minimax: 'moss_audio_302ca737-f4d5-11f0-89d3-26cb62c33ed5', openai: 'onyx' }
	};
}

function saveVoiceSettings(settings) {
	const dir = path.dirname(voiceSettingsPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	fs.writeFileSync(voiceSettingsPath, JSON.stringify(settings, null, 2));
}

// Default OpenAI TTS voices
const OPENAI_TTS_VOICES = [
	{ id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
	{ id: 'echo', name: 'Echo', description: 'Warm, conversational male' },
	{ id: 'fable', name: 'Fable', description: 'Expressive, storytelling' },
	{ id: 'onyx', name: 'Onyx', description: 'Deep, authoritative male' },
	{ id: 'nova', name: 'Nova', description: 'Friendly, upbeat female' },
	{ id: 'shimmer', name: 'Shimmer', description: 'Clear, professional female' },
];

// Default Minimax voices
const MINIMAX_DEFAULT_VOICES = [
	{ id: 'male-qn-qingse', name: 'Qingse (Male)', description: 'Young male voice' },
	{ id: 'male-qn-jingying', name: 'Jingying (Male)', description: 'Professional male' },
	{ id: 'female-shaonv', name: 'Shaonv (Female)', description: 'Young female voice' },
	{ id: 'female-yujie', name: 'Yujie (Female)', description: 'Mature female voice' },
	{ id: 'female-chengshu', name: 'Chengshu (Female)', description: 'Calm female voice' },
	{ id: 'male-qn-badao', name: 'Badao (Male)', description: 'Deep male voice' },
	{ id: 'presenter_male', name: 'Presenter (Male)', description: 'News presenter style' },
	{ id: 'presenter_female', name: 'Presenter (Female)', description: 'News presenter style' },
	{ id: 'audiobook_male_1', name: 'Audiobook (Male)', description: 'Storyteller voice' },
	{ id: 'audiobook_female_1', name: 'Audiobook (Female)', description: 'Storyteller voice' },
];

// RunPod/Chatterbox default voices
const RUNPOD_DEFAULT_VOICES = [
	{ id: 'andy', name: 'Andy (Male)', description: 'Professional male voice' },
	{ id: 'sarah', name: 'Sarah (Female)', description: 'Professional female voice' },
	{ id: 'tom', name: 'Tom (Male)', description: 'Casual male voice' },
	{ id: 'lucy', name: 'Lucy (Female)', description: 'Friendly female voice' },
];

// API: Get voice settings
app.get('/api/voice-settings', (req, res) => {
	try {
		const settings = loadVoiceSettings();
		res.json(settings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Update voice settings
app.post('/api/voice-settings', (req, res) => {
	try {
		const { provider, defaultVoice, audioMode } = req.body;
		const settings = loadVoiceSettings();
		
		if (provider) settings.provider = provider;
		if (defaultVoice) settings.defaultVoice = { ...settings.defaultVoice, ...defaultVoice };
		if (audioMode) settings.audioMode = audioMode;
		
		saveVoiceSettings(settings);
		res.json({ success: true, settings });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Check if course has pre-built scene components
app.get('/api/check-scene-components', (req, res) => {
	try {
		const courseId = req.query.course;
		if (!courseId) {
			return res.status(400).json({ error: 'course parameter required' });
		}
		
		const scenesPath = path.join(__dirname, 'courses', courseId, 'course', 'remotion', 'scenes');
		
		if (!fs.existsSync(scenesPath)) {
			return res.json({ hasScenes: false, sceneCount: 0, moduleCount: 0 });
		}
		
		// Count scene components
		let sceneCount = 0;
		let moduleCount = 0;
		
		const items = fs.readdirSync(scenesPath, { withFileTypes: true });
		for (const item of items) {
			if (item.isDirectory() && item.name.startsWith('module')) {
				moduleCount++;
				const moduleDir = path.join(scenesPath, item.name);
				const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');
				sceneCount += files.length;
			}
		}
		
		res.json({
			hasScenes: sceneCount > 0,
			sceneCount,
			moduleCount,
			visualMode: getCourseRecord(courseId)?.visualMode || (sceneCount > 0 ? 'scenes' : 'slides'),
			audioMode: getCourseAudioMode(courseId),
			usesSceneVisuals: courseUsesSceneVisuals(courseId),
			scenesPath: `courses/${courseId}/course/remotion/scenes/`
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Get available voices for current provider
app.get('/api/voices', (req, res) => {
	try {
		const settings = loadVoiceSettings();
		const provider = req.query.provider || settings.provider;
		
		let voices = [];
		if (provider === 'minimax') {
			voices = [...MINIMAX_DEFAULT_VOICES];
			// Add custom voices
			const customMinimax = settings.customVoices.filter(v => v.provider === 'minimax');
			voices.push(...customMinimax.map(v => ({ ...v, isCustom: true })));
		} else if (provider === 'openai') {
			voices = [...OPENAI_TTS_VOICES];
		} else {
			voices = [...RUNPOD_DEFAULT_VOICES];
			const customRunpod = settings.customVoices.filter(v => v.provider === 'runpod');
			voices.push(...customRunpod.map(v => ({ ...v, isCustom: true })));
		}
		
		res.json({ provider, voices, defaultVoice: settings.defaultVoice[provider] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Add custom voice
app.post('/api/voices/custom', (req, res) => {
	try {
		const { id, name, description, provider } = req.body;
		
		if (!id || !name) {
			return res.status(400).json({ error: 'Voice ID and name are required' });
		}
		
		const settings = loadVoiceSettings();
		const targetProvider = provider || settings.provider;
		
		// Check for duplicates
		const exists = settings.customVoices.find(v => v.id === id && v.provider === targetProvider);
		if (exists) {
			return res.status(400).json({ error: 'Voice with this ID already exists' });
		}
		
		settings.customVoices.push({
			id,
			name,
			description: description || 'Custom voice',
			provider: targetProvider,
			addedAt: new Date().toISOString()
		});
		
		saveVoiceSettings(settings);
		res.json({ success: true, voice: { id, name, description, provider: targetProvider } });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Delete custom voice
app.delete('/api/voices/custom/:id', (req, res) => {
	try {
		const { id } = req.params;
		const provider = req.query.provider;
		
		const settings = loadVoiceSettings();
		const initialLength = settings.customVoices.length;
		
		settings.customVoices = settings.customVoices.filter(v => {
			if (provider) {
				return !(v.id === id && v.provider === provider);
			}
			return v.id !== id;
		});
		
		if (settings.customVoices.length === initialLength) {
			return res.status(404).json({ error: 'Custom voice not found' });
		}
		
		saveVoiceSettings(settings);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Test voice (generate sample audio)
app.post('/api/voices/test', async (req, res) => {
	try {
		const { voiceId, provider, testText } = req.body;
		
		if (!voiceId) {
			return res.status(400).json({ error: 'Voice ID is required' });
		}
		
		const settings = loadVoiceSettings();
		const targetProvider = provider || settings.provider;
		const text = testText || 'This is a voice test. Hello, how does this voice sound to you?';
		
		console.log(`[voice-test] Testing voice: ${voiceId} with provider: ${targetProvider}`);
		
		if (targetProvider === 'openai') {
			// Use OpenAI TTS API
			const apiKey = process.env.OPENAI_API_KEY;
			
			if (!apiKey) {
				return res.status(400).json({ 
					error: 'OpenAI API key not configured. Set OPENAI_API_KEY in .env' 
				});
			}
			
			console.log(`[voice-test] Calling OpenAI TTS with voice: ${voiceId}`);
			
			const response = await fetch('https://api.openai.com/v1/audio/speech', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: 'tts-1',
					voice: voiceId,
					input: text,
					response_format: 'mp3'
				})
			});
			
			if (!response.ok) {
				const errorText = await response.text();
				console.log(`[voice-test] OpenAI error: ${response.status} - ${errorText}`);
				return res.status(400).json({ 
					success: false, 
					error: `OpenAI TTS error: ${response.status} - ${errorText}` 
				});
			}
			
			// OpenAI returns audio directly as binary
			const audioBuffer = await response.arrayBuffer();
			const audioBase64 = Buffer.from(audioBuffer).toString('base64');
			
			console.log(`[voice-test] OpenAI success, audio size: ${audioBuffer.byteLength} bytes`);
			
			res.json({
				success: true,
				audio: audioBase64,
				format: 'mp3',
				voiceId,
				provider: targetProvider
			});
			
		} else if (targetProvider === 'minimax') {
			// Use Minimax Direct API
			const apiKey = process.env.MINIMAX_API_KEY;
			const groupId = process.env.MINIMAX_GROUP_ID;
			
			// Debug logging
			console.log(`[voice-test] MINIMAX_API_KEY loaded: ${apiKey ? 'Yes (' + apiKey.substring(0, 10) + '...)' : 'No'}`);
			console.log(`[voice-test] MINIMAX_GROUP_ID loaded: ${groupId ? 'Yes (' + groupId + ')' : 'No'}`);
			
			if (!apiKey || !groupId) {
				return res.status(400).json({ 
					error: 'Minimax credentials not configured. Set MINIMAX_API_KEY and MINIMAX_GROUP_ID in .env' 
				});
			}
			
			// MiniMax v2 API: use api.minimax.io domain (not .chat)
			const requestUrl = `https://api.minimax.io/v1/t2a_v2?GroupId=${encodeURIComponent(groupId)}`;
			console.log(`[voice-test] Calling: ${requestUrl}`);
			
			const response = await fetch(requestUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: 'speech-02-hd',
					text: text,
					stream: false,
					output_format: 'hex',
					voice_setting: {
						voice_id: voiceId,
						speed: 1,
						vol: 1,
						pitch: 0
					},
					audio_setting: {
						sample_rate: 32000,
						bitrate: 128000,
						format: 'wav',
						channel: 1
					}
				})
			});
			
			if (!response.ok) {
				const errorText = await response.text();
				console.log(`[voice-test] Minimax HTTP error: ${response.status} - ${errorText}`);
				return res.status(400).json({ 
					success: false, 
					error: `Minimax API error: ${response.status} - ${errorText}` 
				});
			}
			
			const data = await response.json();
			console.log(`[voice-test] Minimax response keys:`, Object.keys(data));
			
			// Check for error in v2 response format
			if (data.status_code && data.status_code !== 0) {
				console.log(`[voice-test] Minimax error code: ${data.status_code}, msg: ${data.status_msg}`);
				return res.status(400).json({ 
					success: false, 
					error: `Minimax error: ${data.status_msg || 'Unknown error'}` 
				});
			}
			
			// Also check base_resp format
			if (data.base_resp?.status_code !== 0 && data.base_resp?.status_code !== undefined) {
				console.log(`[voice-test] Minimax base_resp error: ${data.base_resp?.status_code}, msg: ${data.base_resp?.status_msg}`);
				return res.status(400).json({ 
					success: false, 
					error: `Minimax error: ${data.base_resp?.status_msg || 'Unknown error'}` 
				});
			}
			
			// Try multiple audio field locations
			const audioHex = data.data?.audio || data.audio_file || data.audio;
			
			if (audioHex) {
				// Convert hex to base64
				const audioBuffer = Buffer.from(audioHex, 'hex');
				const audioBase64 = audioBuffer.toString('base64');
				
				console.log(`[voice-test] Minimax audio received: ${audioBuffer.length} bytes`);
				
				res.json({ 
					success: true, 
					audioData: audioBase64,
					format: 'wav',
					voiceId,
					provider: targetProvider
				});
			} else {
				console.log(`[voice-test] Minimax no audio in response:`, JSON.stringify(data).substring(0, 500));
				res.status(400).json({ success: false, error: 'No audio data returned from Minimax' });
			}
		} else {
			// Use RunPod/existing service
			const apiKey = process.env.RESEMBLE_API_KEY || process.env.RUNPOD_API_KEY;
			
			if (!apiKey) {
				return res.status(400).json({ 
					error: 'RunPod API key not configured. Set RESEMBLE_API_KEY or RUNPOD_API_KEY in .env' 
				});
			}
			
			// For RunPod, we'd use the existing voice service
			// Simplified test - just validate the voice exists in our list
			const validVoices = RUNPOD_DEFAULT_VOICES.map(v => v.id);
			const customVoices = settings.customVoices.filter(v => v.provider === 'runpod').map(v => v.id);
			
			if (!validVoices.includes(voiceId) && !customVoices.includes(voiceId)) {
				return res.status(400).json({ 
					success: false, 
					error: `Voice '${voiceId}' not found. Available: ${validVoices.join(', ')}` 
				});
			}
			
			// For now, return success without actual audio for RunPod testing
			// Full implementation would call the RunPod API
			res.json({ 
				success: true, 
				message: `Voice '${voiceId}' is valid for RunPod`,
				voiceId,
				provider: targetProvider,
				note: 'RunPod voice test requires full audio generation'
			});
		}
	} catch (error) {
		console.error('[voice-test] Error:', error);
		res.status(500).json({ success: false, error: error.message });
	}
});

// API: Upload audio file for a specific slide
app.post('/api/upload-audio', audioUpload.single('audio'), (req, res) => {
	try {
		const { moduleNumber, slideName, courseId } = req.body;
		const file = req.file;
		
		if (!file) {
			return res.status(400).json({ error: 'No audio file provided' });
		}
		
		if (!isModuleNumberProvided(moduleNumber) || !slideName) {
			// Clean up temp file
			fs.unlinkSync(file.path);
			return res.status(400).json({ error: 'Module number and slide name are required' });
		}
		
		// Use course-specific audio directory
		const course = courseId || 'default';
		const audioDir = path.join(__dirname, 'public', 'audio', course);
		const targetFileName = `module${moduleNumber}-${slideName}.wav`;
		const targetPath = path.join(audioDir, targetFileName);
		
		// Ensure audio directory exists
		if (!fs.existsSync(audioDir)) {
			fs.mkdirSync(audioDir, { recursive: true });
		}
		
		// Convert to WAV format using ffmpeg
		try {
			execSync(
				`ffmpeg -y -i "${file.path}" -acodec pcm_s16le -ar 44100 "${targetPath}"`,
				{ stdio: 'pipe' }
			);
			// Clean up temp file
			fs.unlinkSync(file.path);
			
			console.log(`Audio uploaded and converted: ${targetFileName}`);
			res.json({ success: true, fileName: targetFileName });
		} catch (ffmpegError) {
			// Clean up temp file
			if (fs.existsSync(file.path)) {
				fs.unlinkSync(file.path);
			}
			console.error('FFmpeg error:', ffmpegError.message);
			res.status(500).json({ error: 'Failed to convert audio file. Ensure ffmpeg is installed.' });
		}
	} catch (error) {
		console.error('Upload error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Add slides to existing module
app.post('/api/modules/:moduleNumber/add-slides', (req, res) => {
	try {
		const moduleNumber = parseInt(req.params.moduleNumber);
		const { slides } = req.body;
		
		if (!slides || !Array.isArray(slides) || slides.length === 0) {
			return res.status(400).json({ error: 'Slides array is required and must not be empty' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find the module
		const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
		const moduleMatch = content.match(moduleRegex);
		
		if (!moduleMatch) {
			return res.status(404).json({ error: `Module ${moduleNumber} not found` });
		}
		
		const existingModuleBody = moduleMatch[1];
		
		// Extract existing slides array
		const slidesMatch = existingModuleBody.match(/slides:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
		if (!slidesMatch) {
			return res.status(400).json({ error: 'Could not find slides array in module' });
		}
		
		const existingSlidesContent = slidesMatch[1];
		const slidesEndPos = existingModuleBody.indexOf(']', existingModuleBody.indexOf('slides:'));
		
		// Build new slides code
		const newSlidesCode = slides.map(slide => {
			let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${(slide.script || '').replace(/"/g, '\\"')}"`;
			
			if (slide.type === 'title' && slide.subtitle) {
				slideCode += `,\n\t\t\tsubtitle: "${(slide.subtitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.title) {
				slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
				const pointsCode = slide.points
					.filter(p => p && p.trim())
					.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
			}
			
			if (slide.code) {
				slideCode += `,\n\t\t\tcode: \`${slide.code.replace(/`/g, '\\`')}\``;
			}
			
			if (slide.language) {
				slideCode += `,\n\t\t\tlanguage: "${slide.language}"`;
			}
			
			if (slide.imageSrc) {
				slideCode += `,\n\t\t\timageSrc: "${(slide.imageSrc || '').replace(/"/g, '\\"')}"`;
			}
			
			slideCode += '\n\t\t}';
			return slideCode;
		}).join(',\n');
		
		// Insert new slides before the closing bracket
		// Find the position of the closing bracket in the slides array
		const moduleStart = content.indexOf(moduleMatch[0]);
		const slidesArrayStart = content.indexOf('slides: [', moduleStart);
		const slidesArrayEnd = content.indexOf(']', slidesArrayStart);
		
		// Check if there are existing slides (need comma)
		const hasExistingSlides = existingSlidesContent.trim().length > 0;
		const separator = hasExistingSlides ? ',\n' : '';
		
		// Insert new slides
		content = content.substring(0, slidesArrayEnd) + separator + newSlidesCode + content.substring(slidesArrayEnd);
		
		fs.writeFileSync(contentPath, content);
		console.log(`Added ${slides.length} slides to module ${moduleNumber}`);
		
		res.json({ success: true, moduleNumber, slidesAdded: slides.length });
	} catch (error) {
		console.error('Error adding slides:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Split audio file into chunks
app.post('/api/split-audio', audioUpload.single('audio'), (req, res) => {
	try {
		const { chunkSize = 10, courseId, moduleNumber, slideName, autoCreateSlides = false } = req.body;
		const file = req.file;
		
		if (!file) {
			return res.status(400).json({ error: 'No audio file provided' });
		}

		const scriptPath = path.join(__dirname, 'scripts', 'splitAudioIntoChunks.ts');
		const outputDir = courseId 
			? path.join(__dirname, 'public', 'audio', courseId)
			: path.dirname(file.path);

		// Build command arguments
		const args = [
			'tsx',
			scriptPath,
			file.path,
			`--chunk-size=${chunkSize || 10}`
		];

		if (outputDir) {
			args.push(`--output-dir=${outputDir}`);
		}
		if (courseId) {
			args.push(`--course-id=${courseId}`);
		}
		if (moduleNumber) {
			args.push(`--module=${moduleNumber}`);
		}
		if (slideName) {
			args.push(`--slide-name=${slideName}`);
		}

		// Execute split script
		exec(`npx ${args.join(' ')}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, async (error, stdout, stderr) => {
			// Clean up temp file
			if (fs.existsSync(file.path)) {
				fs.unlinkSync(file.path);
			}

			if (error) {
				console.error('Audio split error:', error);
				return res.status(500).json({ 
					error: error.message, 
					stderr: stderr || stdout 
				});
			}

			// Parse output to get chunk filenames
			const chunkMatches = stdout.match(/✓ Chunk \d+\/\d+: ([^\s]+)/g) || [];
			const chunks = chunkMatches.map(match => {
				const filename = match.match(/✓ Chunk \d+\/\d+: ([^\s]+)/)[1];
				return filename;
			});

			const result = { 
				success: true, 
				chunks,
				output: stdout 
			};

			// Auto-create slides if requested (using internal function call)
			if (autoCreateSlides === 'true' || autoCreateSlides === true) {
				if (!isModuleNumberProvided(moduleNumber) || !slideName) {
					result.warning = 'Cannot auto-create slides: module number and slide name required';
				} else {
					try {
						// Generate slide entries from chunks
						const newSlides = chunks.map((chunk, index) => {
							// Extract part number from filename (e.g., "module1-concept-part01.wav" -> "part01")
							const partMatch = chunk.match(/-part(\d+)\.wav$/);
							const partNum = partMatch ? partMatch[1] : String(index + 1).padStart(2, '0');
							
							// Generate slide name: module-{N}-{slideName}-part{NN}
							const slideNameFormatted = `module-${moduleNumber}-${slideName}-part${partNum}`;
							
							return {
								name: slideNameFormatted,
								type: 'content-single',
								script: `[TODO: Add script for ${slideName} part ${index + 1}]`,
								title: `${slideName.charAt(0).toUpperCase() + slideName.slice(1)} - Part ${index + 1}`,
								points: []
							};
						});

						// Call add-slides function directly (internal)
						const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
						let content = fs.readFileSync(contentPath, 'utf-8');
						
						const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
						const moduleMatch = content.match(moduleRegex);
						
						if (!moduleMatch) {
							result.warning = `Module ${moduleNumber} not found in moduleContent.ts`;
						} else {
							const existingModuleBody = moduleMatch[1];
							const slidesMatch = existingModuleBody.match(/slides:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
							
							if (!slidesMatch) {
								result.warning = 'Could not find slides array in module';
							} else {
								const existingSlidesContent = slidesMatch[1];
								const hasExistingSlides = existingSlidesContent.trim().length > 0;
								const separator = hasExistingSlides ? ',\n' : '';
								
								// Build new slides code
								const newSlidesCode = newSlides.map(slide => {
									let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${(slide.script || '').replace(/"/g, '\\"')}"`;
									
									if (slide.title) {
										slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
									}
									
									if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
										const pointsCode = slide.points
											.filter(p => p && p.trim())
											.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
											.join(',\n');
										slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
									}
									
									slideCode += '\n\t\t}';
									return slideCode;
								}).join(',\n');
								
								// Insert new slides before the closing bracket
								const moduleStart = content.indexOf(moduleMatch[0]);
								const slidesArrayStart = content.indexOf('slides: [', moduleStart);
								const slidesArrayEnd = content.indexOf(']', slidesArrayStart);
								
								content = content.substring(0, slidesArrayEnd) + separator + newSlidesCode + content.substring(slidesArrayEnd);
								
								fs.writeFileSync(contentPath, content);
								console.log(`Auto-created ${newSlides.length} slides in module ${moduleNumber}`);
								
								result.slidesCreated = newSlides.length;
								result.message = `Created ${newSlides.length} slides in module ${moduleNumber}`;
							}
						}
					} catch (slideError) {
						console.error('Error auto-creating slides:', slideError);
						result.warning = `Audio split successful, but failed to create slides: ${slideError.message}`;
					}
				}
			}

			res.json(result);
		});
	} catch (error) {
		console.error('Split audio error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Upload image for a slide
app.post('/api/upload-image', imageUpload.single('image'), (req, res) => {
	try {
		const { moduleNumber, slideName, courseId } = req.body;
		const file = req.file;
		
		if (!file) {
			return res.status(400).json({ error: 'No image file provided' });
		}
		
		if (!isModuleNumberProvided(moduleNumber) || !slideName) {
			fs.unlinkSync(file.path);
			return res.status(400).json({ error: 'Module number and slide name are required' });
		}
		
		// Determine file extension from mimetype
		const mimeToExt = {
			'image/png': '.png',
			'image/jpeg': '.jpg',
			'image/jpg': '.jpg',
			'image/gif': '.gif',
			'image/webp': '.webp',
			'image/svg+xml': '.svg'
		};
		const ext = mimeToExt[file.mimetype] || path.extname(file.originalname) || '.png';
		
		// Create course-specific assets directory
		const course = courseId || 'default';
		const assetsDir = path.join(__dirname, 'public', 'assets', course);
		const targetFileName = `module${moduleNumber}-${slideName}${ext}`;
		const targetPath = path.join(assetsDir, targetFileName);
		
		// Ensure assets directory exists
		if (!fs.existsSync(assetsDir)) {
			fs.mkdirSync(assetsDir, { recursive: true });
		}
		
		// Move file to assets directory
		fs.renameSync(file.path, targetPath);
		
		// Update moduleContent.ts with new imageSrc
		const relativePath = `assets/${course}/${targetFileName}`;
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find the slide and update imageSrc
		const slidePattern = new RegExp(
			`(name:\\s*"${slideName}"[^}]*?)(imageSrc:\\s*"[^"]*")`,
			'g'
		);
		
		if (content.match(slidePattern)) {
			// Update existing imageSrc
			content = content.replace(slidePattern, `$1imageSrc: "${relativePath}"`);
		} else {
			// Add imageSrc if not present (before the closing bracket of the slide)
			const addPattern = new RegExp(
				`(name:\\s*"${slideName}"[^}]*?)(\\n\\s*\\})`,
				'g'
			);
			content = content.replace(addPattern, `$1,\n\t\t\timageSrc: "${relativePath}"$2`);
		}
		
		fs.writeFileSync(contentPath, content);
		
		console.log(`Image uploaded: ${targetFileName} -> ${relativePath}`);
		res.json({ 
			success: true, 
			fileName: targetFileName, 
			imageSrc: relativePath,
			message: `Image saved. Regenerate modules to apply changes.`
		});
	} catch (error) {
		console.error('Image upload error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get slide images for a module
app.get('/api/slide-images', (req, res) => {
	try {
		const { module: moduleNumber, course } = req.query;
		const courseId = course || 'default';
		
		// Read moduleContent.ts to find slides with images
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find module content
		const modulePattern = new RegExp(
			`module${moduleNumber}Content[\\s\\S]*?slides:\\s*\\[([\\s\\S]*?)\\]\\s*\\}`,
			'g'
		);
		const moduleMatch = modulePattern.exec(content);
		
		if (!moduleMatch) {
			return res.json({ slides: [] });
		}
		
		// Extract slides with their imageSrc
		const slides = [];
		const slideRegex = /name:\s*"([^"]+)"[^}]*?(?:imageSrc:\s*"([^"]+)")?[^}]*?\}/g;
		let slideMatch;
		
		while ((slideMatch = slideRegex.exec(moduleMatch[1])) !== null) {
			slides.push({
				name: slideMatch[1],
				imageSrc: slideMatch[2] || null,
				hasImage: !!slideMatch[2] && !slideMatch[2].includes('placeholder')
			});
		}
		
		res.json({ slides, courseId });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Validate and convert audio files (fix MP3s renamed to .wav) - with streaming progress
app.post('/api/validate-audio', (req, res) => {
	const scriptPath = path.join(__dirname, 'scripts', 'validateAndConvertAudio.ts');
	
	// Get active course from request or from courses.json
	let courseId = req.body?.courseId || null;
	if (!courseId) {
		const coursesData = readCoursesJson();
		const activeCourse = coursesData.courses?.find(c => c.status === 'active');
		courseId = activeCourse?.id || 'default';
	}
	
	console.log(`[validate-audio] Using course: ${courseId}`);
	
	// Set headers for streaming
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	const { spawn } = require('child_process');
	// Pass course ID as argument to script
	const childProcess = spawn('npx', ['tsx', scriptPath, courseId], { 
		cwd: __dirname,
		shell: true 
	});
	
	let buffer = '';
	let totalFiles = 0;
	let processedFiles = 0;
	let convertedFiles = 0;
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: 'Starting audio validation...' })}\n\n`);
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Parse file counts
			if (line.includes('.wav files')) {
				const match = line.match(/Found (\d+) \.wav files/);
				if (match) {
					totalFiles += parseInt(match[1]);
					res.write(`data: ${JSON.stringify({ 
						type: 'info', 
						message: line.trim(),
						total: totalFiles
					})}\n\n`);
				}
			} else if (line.includes('.mp3 files')) {
				const match = line.match(/Found (\d+) \.mp3 files/);
				if (match) {
					totalFiles += parseInt(match[1]);
					res.write(`data: ${JSON.stringify({ 
						type: 'info', 
						message: line.trim(),
						total: totalFiles
					})}\n\n`);
				}
			}
			// Parse file processing
			else if (line.includes('...')) {
				processedFiles++;
				const percent = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: line.trim(),
					processed: processedFiles,
					total: totalFiles,
					percent: percent
				})}\n\n`);
				
				if (line.includes('converted')) {
					convertedFiles++;
				}
			}
			// Summary lines
			else if (line.includes('Summary:') || line.includes('Converted:') || line.includes('All audio files are valid')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'info', 
					message: line.trim()
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		console.error('[validate-audio] stderr:', data.toString());
	});
	
	childProcess.on('close', (code) => {
		res.write(`data: ${JSON.stringify({ 
			type: 'done', 
			success: code === 0,
			converted: convertedFiles,
			total: totalFiles,
			message: code === 0 ? 'Validation complete' : 'Validation failed'
		})}\n\n`);
		res.end();
	});
	
	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: error.message 
		})}\n\n`);
		res.end();
	});
});

// API: Generate and measure audio in alternating workflow
app.post('/api/generate-and-measure-audio', (req, res) => {
	const { moduleRange, course, voice, provider } = req.body;

	if (!course) {
		return res.status(400).json({
			error: 'Course is required',
			details: 'Select a video in the processing wizard. Audio is generated from moduleContent.ts for the selected course.',
		});
	}

	let activationInfo;
	try {
		activationInfo = resolveCourseForProcessing(course, { autoActivate: true });
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			code: err.code,
			activeCourseId: err.activeCourseId,
			selectedCourseId: err.selectedCourseId,
		});
	}
	
	let finalModuleRange = moduleRange || getModuleRangeForCourse(activationInfo.courseId) || null;
	
	const scriptPath = path.join(__dirname, 'scripts', 'generateAndMeasureAudio.ts');
	const finalVoice = voice || 'andy';
	const finalProvider = provider || '';
	
	// Build command with provider argument
	let command = finalModuleRange
		? `npx tsx "${scriptPath}" ${finalModuleRange} ${finalVoice}`
		: `npx tsx "${scriptPath}" all ${finalVoice}`;
	
	// Add provider if specified (for strict mode - no fallback)
	if (finalProvider) {
		command += ` ${finalProvider}`;
		console.log(`[generate-and-measure-audio] Using provider: ${finalProvider} (strict mode)`);
	}
	
	// Set headers for streaming progress
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	// Count total slides for progress tracking
	let totalSlides = 0;
	try {
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		const slideMatches = content.match(/name:\s*"/g);
		totalSlides = slideMatches ? slideMatches.length : 0;
	} catch (e) {
		console.error('Could not count slides:', e);
	}
	
	const childProcess = exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 });
	
	let buffer = '';
	let currentModule = '';
	let currentSlide = '';
	let processedSlides = 0;
	let skippedSlides = 0;
	
	res.write(`data: ${JSON.stringify({ 
		type: 'start', 
		message: activationInfo.activated
			? `Activated "${activationInfo.courseId}" in Remotion — starting audio generation...`
			: 'Starting audio generation...',
		total: totalSlides,
		courseId: activationInfo.courseId,
		courseActivated: activationInfo.activated,
		previousCourseId: activationInfo.previousCourseId,
	})}\n\n`);
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Parse module start
			if (line.includes('=== Module')) {
				const match = line.match(/=== Module (\d+): (.+) ===/);
				if (match) {
					currentModule = match[1];
					const title = match[2].trim();
					res.write(`data: ${JSON.stringify({ 
						type: 'module', 
						module: currentModule,
						title: title,
						message: `Module ${currentModule}: ${title}`
					})}\n\n`);
				}
			}
			
			// Parse generation
			if (line.includes('[GENERATE]')) {
				const match = line.match(/\[GENERATE\] (.+)/);
				if (match) {
					processedSlides++;
					currentSlide = match[1];
					const progress = totalSlides > 0 ? Math.round((processedSlides / totalSlides) * 100) : 0;
					res.write(`data: ${JSON.stringify({ 
						type: 'generate', 
						module: currentModule,
						slide: currentSlide,
						current: processedSlides,
						total: totalSlides,
						percent: progress,
						message: `Generating ${processedSlides}/${totalSlides}: ${currentSlide}`
					})}\n\n`);
				}
			}
			
			// Parse skip (already exists)
			if (line.includes('[SKIP GENERATE]')) {
				skippedSlides++;
				const match = line.match(/\[SKIP GENERATE\] (.+)/);
				if (match) {
					currentSlide = match[1].replace(' (already exists)', '');
					res.write(`data: ${JSON.stringify({ 
						type: 'skip', 
						module: currentModule,
						slide: currentSlide,
						current: processedSlides + skippedSlides,
						total: totalSlides,
						message: `Skipped ${currentSlide} (exists)`
					})}\n\n`);
				}
			}
			
			// Parse measurement
			if (line.includes('[MEASURE]')) {
				const match = line.match(/\[MEASURE\] (.+)/);
				if (match) {
					currentSlide = match[1];
					res.write(`data: ${JSON.stringify({ 
						type: 'measure', 
						module: currentModule,
						slide: currentSlide,
						message: `Measuring audio: ${currentSlide}`
					})}\n\n`);
				}
			}
			
			// Parse duration result
			if (line.includes('Duration:')) {
				const match = line.match(/Duration:\s*([\d.]+)\s*seconds/);
				if (match) {
					res.write(`data: ${JSON.stringify({ 
						type: 'duration', 
						module: currentModule,
						slide: currentSlide,
						duration: parseFloat(match[1]),
						message: `Duration: ${match[1]} seconds`
					})}\n\n`);
				}
			}
			
			// Parse completion messages
			if (line.includes('Generated successfully') || line.includes('Updated audioDuration.ts')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse summary
			if (line.includes('Generated:') || line.includes('Measured:') || line.includes('Skipped:')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'summary', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse errors
			if (line.includes('Failed:') || line.includes('✗') || line.includes('Fatal error:')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'error', 
					message: line.trim()
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const errorMsg = data.toString().trim();
		// Ignore deprecation warnings (they're not real errors)
		if (errorMsg.includes('DeprecationWarning') || errorMsg.includes('punycode')) {
			return;
		}
		console.error('[generate-and-measure] stderr:', errorMsg);
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: errorMsg
		})}\n\n`);
	});
	
	childProcess.on('close', (code) => {
		if (code === 0) {
			res.write(`data: ${JSON.stringify({ 
				type: 'done', 
				success: true,
				message: 'Generate and measure workflow complete!'
			})}\n\n`);
		} else {
			res.write(`data: ${JSON.stringify({ 
				type: 'done', 
				success: false,
				message: `Some slides failed (exit code ${code}). Run "Generate ALL Audio" again to generate only the remaining files. Existing files are never overwritten.`
			})}\n\n`);
		}
		res.end();
	});
	
	childProcess.on('error', (error) => {
		console.error('Child process error:', error);
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: `Failed to start process: ${error.message}`
		})}\n\n`);
		res.write(`data: ${JSON.stringify({ 
			type: 'done', 
			success: false,
			message: error.message
		})}\n\n`);
		res.end();
	});
});

// API: Extract word timings with progress streaming
app.post('/api/extract-timings', (req, res) => {
	const { moduleRange, course, courseId, method = 'whisper' } = req.body;
	const targetCourseId = courseId || course; // Support both 'course' and 'courseId' for compatibility

	if (!targetCourseId) {
		return res.status(400).json({
			error: 'Course is required',
			details: 'Select a video in the processing wizard before extracting word timings.',
		});
	}

	let activationInfo;
	try {
		activationInfo = resolveCourseForProcessing(targetCourseId, { autoActivate: true });
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			code: err.code,
			activeCourseId: err.activeCourseId,
			selectedCourseId: err.selectedCourseId,
		});
	}
	const effectiveCourseId = activationInfo.courseId;
	const finalModuleRange = moduleRange || getModuleRangeForCourse(effectiveCourseId);

	if (method === 'mfa' && !reserveMfaExtraction({
		moduleRange: finalModuleRange,
		courseId: effectiveCourseId,
	})) {
		const mfaStatus = getMfaExtractionStatus();
		return res.status(409).json({
			error: 'MFA extraction already in progress',
			details:
				'Only one MFA alignment run can run at a time (each slide takes 1-3 minutes). ' +
				'Wait for the current run to finish, or POST /api/cancel-mfa-extraction to stop a stuck job.',
			...mfaStatus,
		});
	}

	// Choose script based on method
	let scriptName;
	if (method === 'gentle') {
		scriptName = 'extractWordTimingsFromContentGentle.ts';
	} else if (method === 'mfa') {
		scriptName = 'extractWordTimingsFromContentMfa.ts';
	} else {
		scriptName = 'extractWordTimingsFromContent.ts';
	}
	const scriptPath = path.join(__dirname, 'scripts', scriptName);
	
	// Build command - Gentle/MFA need courseId; Whisper uses allModules from moduleContent
	let command;
	if (method === 'gentle' || method === 'mfa') {
		command = finalModuleRange
			? `npx tsx "${scriptPath}" ${finalModuleRange} ${effectiveCourseId}`
			: `npx tsx "${scriptPath}" all ${effectiveCourseId}`;
	} else {
		// Whisper script uses allModules from moduleContent (course already enforced above)
		command = finalModuleRange
			? `npx tsx "${scriptPath}" ${finalModuleRange}`
			: `npx tsx "${scriptPath}" all`;
	}
	// On Linux/Mac: stdbuf -oL makes stdout line-buffered so GUI gets progress in real time
	if (process.platform !== 'win32') {
		command = `stdbuf -oL ${command}`;
	}
	
	// Set headers for Server-Sent Events
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	// Parse progress from stdout
	const childProcess = exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 });
	let responseFinished = false;
	if (method === 'mfa') {
		attachMfaExtractionChild(childProcess);
	}
	const releaseMfaExtractLockForRequest = () => {
		if (method === 'mfa' && mfaExtractState.child === childProcess) {
			releaseMfaExtractLock();
		}
	};

	const writeSse = (payload) => {
		if (responseFinished || res.writableFinished) {
			return false;
		}
		try {
			res.write(`data: ${JSON.stringify(payload)}\n\n`);
			return true;
		} catch {
			return false;
		}
	};

	// Keep MFA running if the browser disconnects (same as batch render).
	res.on('close', () => {
		if (method === 'mfa' && !responseFinished && !res.writableFinished) {
			console.log('[extract-timings] Client disconnected — MFA extraction continues in background');
		}
	});
	
	let buffer = '';
	let stderrBuffer = '';
	let currentModule = '';
	let currentSlide = '';
	let totalSlides = 0;
	let processedSlides = 0;
	let moduleSlides = 0;
	
	// Send initial progress with method info
	const methodLabels = { gentle: 'Gentle', mfa: 'MFA', whisper: 'Whisper' };
	const methodName = methodLabels[method] || 'Whisper';
	const startMessage = activationInfo.activated
		? `Activated "${effectiveCourseId}" in Remotion — extracting timings with ${methodName}...`
		: `Starting word timing extraction using ${methodName}...`;
	res.write(`data: ${JSON.stringify({
		type: 'start',
		message: startMessage,
		courseId: effectiveCourseId,
		courseActivated: activationInfo.activated,
		previousCourseId: activationInfo.previousCourseId,
	})}\n\n`);

	// Heartbeat: if no stdout for 12s, send staged loading hints
	let gotFirstOutput = false;
	let heartbeatCount = 0;
	const heartbeatMessages = method === 'mfa'
		? [
			'Starting MFA script...',
			'Checking MFA / Docker (tsx compile can take 30-60s)...',
			'Still waiting for first output...',
			'If stuck >2 min: ensure Docker Desktop engine is running (docker version shows Server)',
		]
		: [
			'Loading script and modules... (first output can take 30-60 seconds)',
			'Still loading modules...',
			'If stuck >2 min, check the terminal or server logs',
		];
	const heartbeat = setInterval(() => {
		if (!gotFirstOutput && !childProcess.killed) {
			const idx = Math.min(heartbeatCount++, heartbeatMessages.length - 1);
			res.write(`data: ${JSON.stringify({ type: 'progress', message: heartbeatMessages[idx] })}\n\n`);
		}
	}, 12000);

	childProcess.stdout.on('data', (data) => {
		gotFirstOutput = true;
		clearInterval(heartbeat);
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || ''; // Keep incomplete line in buffer
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// MFA / Docker setup progress
			if (
				line.includes('Starting MFA') ||
				line.includes('Checking MFA') ||
				line.includes('Checking Docker') ||
				line.includes('Checking for local MFA') ||
				line.includes('Checking for MFA image') ||
				line.includes('Local MFA not found') ||
				line.includes('Loading course modules') ||
				line.includes('Preparing MFA Docker') ||
				line.includes('Docker MFA align_one') ||
				line.includes('Running MFA align_one') ||
				line.includes('Pulling MFA Docker image') ||
				line.includes('Downloading MFA')
			) {
				res.write(`data: ${JSON.stringify({ type: 'progress', message: line.trim() })}\n\n`);
			}

			// Parse early "Extracting..." / "Processing N module(s)..." for immediate feedback
			if (line.includes('Extracting word timings')) {
				res.write(`data: ${JSON.stringify({ type: 'progress', message: `Script started. Loading modules...` })}\n\n`);
			}
			if (line.match(/Processing \d+ module\(s\)/)) {
				const n = line.match(/Processing (\d+) module\(s\)/)?.[1] || '?';
				res.write(`data: ${JSON.stringify({ type: 'progress', message: `Processing ${n} module(s)...` })}\n\n`);
			}
			
			// Parse module start
			if (line.includes('=== Module')) {
				const match = line.match(/=== Module (\d+): (.+) ===/);
				if (match) {
					currentModule = match[1];
					const title = match[2].trim();
					moduleSlides = 0;
					res.write(`data: ${JSON.stringify({ 
						type: 'module', 
						module: currentModule,
						title: title,
						message: `📚 Module ${currentModule}: ${title}`
					})}\n\n`);
				}
			}
			
			// Parse slide processing start (slide names can have hyphens, e.g. intro-wireless-networks)
			if (line.includes('Processing') && line.includes('...') && !line.includes('Extracted') && !line.includes('Processed')) {
				const match = line.match(/Processing ([\w-]+)\.\.\./);
				if (match) {
					currentSlide = match[1];
					moduleSlides++;
					processedSlides++;
					const slideEta = method === 'mfa' ? '30-120 seconds' : '1-3 minutes';
					res.write(`data: ${JSON.stringify({ 
						type: 'slide', 
						module: currentModule,
						slide: currentSlide,
						processed: processedSlides,
						total: totalSlides,
						message: `Processing ${currentSlide}... (this takes ${slideEta})`
					})}\n\n`);
				}
			}
			
			// Parse slide completion (scripts output "Processed" not "Extracted")
			if (line.includes('✓ Processed') || line.includes('✓ Extracted')) {
				const match = line.match(/✓ (?:Processed|Extracted) (\d+) words for ([\w-]+)/);
				if (match) {
					res.write(`data: ${JSON.stringify({ 
						type: 'complete', 
						module: currentModule,
						slide: match[2],
						words: parseInt(match[1]),
						message: `✓ Completed ${match[2]} - ${match[1]} words extracted`
					})}\n\n`);
				}
			}
			
			if (line.includes('❌ No audio') || line.includes('No new timings were saved') || line.includes('Generate audio first')) {
				res.write(`data: ${JSON.stringify({ type: 'error', message: line.trim() })}\n\n`);
			}

			// Parse warnings
			if (line.includes('⚠ Skipping') || line.includes('⚠ No words')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'warning', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse errors
			if (line.includes('✗ Failed')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'error', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse final summary
			if (line.includes('Processed:') || line.includes('Skipped:')) {
				const match = line.match(/(Processed|Skipped):\s*(\d+)/);
				if (match) {
					if (match[1] === 'Processed') {
						totalSlides = parseInt(match[2]) + (totalSlides || 0);
					}
					res.write(`data: ${JSON.stringify({ 
						type: 'summary', 
						message: line.trim()
					})}\n\n`);
				}
			}
			
			// Parse completion message
			if (line.includes('✅ Word timing extraction complete!')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'summary', 
					message: '✅ Extraction complete!'
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		stderrBuffer += data.toString();
		const lines = stderrBuffer.split('\n');
		stderrBuffer = lines.pop() || '';

		for (const line of lines) {
			const classified = classifyTimingStderrLine(line);
			if (classified.kind === 'skip') {
				continue;
			}
			gotFirstOutput = true;
			clearInterval(heartbeat);
			res.write(`data: ${JSON.stringify({ 
				type: classified.kind === 'error' ? 'error' : 'warning', 
				message: classified.message
			})}\n\n`);
		}
	});
	
	childProcess.on('close', (code, signal) => {
		clearInterval(heartbeat);
		releaseMfaExtractLockForRequest();

		if (responseFinished || res.writableFinished) {
			return;
		}
		if (method === 'mfa' && mfaExtractState.child !== childProcess && code !== 0) {
			console.log('[extract-timings] Ignoring exit from superseded MFA run');
			responseFinished = true;
			return;
		}

		if (code === 0) {
			res.write(`data: ${JSON.stringify({ 
				type: 'summary', 
				message: 'Syncing bullets, line highlights, and Remotion content...'
			})}\n\n`);
			
			runPostExtractTimingsSync(effectiveCourseId, finalModuleRange, (err, stdout, stderr) => {
				if (err) {
					console.error('Post-extract sync error:', err);
					res.write(`data: ${JSON.stringify({ 
						type: 'warning', 
						message: 'Post-timing sync had issues (line highlights or bullets may be incomplete)'
					})}\n\n`);
				} else {
					res.write(`data: ${JSON.stringify({ 
						type: 'summary', 
						message: 'Line mappings, bullets, and course activation complete'
					})}\n\n`);
				}
				
				res.write(`data: ${JSON.stringify({ 
					type: 'done', 
					success: true,
					message: 'Word timings, line highlights, and bullets synced!'
				})}\n\n`);
				responseFinished = true;
				res.end();
			});
		} else {
			const exitMessage = formatProcessExitMessage(code, signal);
			if (code === null && signal) {
				console.warn(`[extract-timings] MFA child stopped: signal=${signal}`);
			} else if (code !== 0) {
				console.warn(`[extract-timings] MFA child failed: code=${code} signal=${signal || 'none'}`);
			}
			writeSse({
				type: 'done',
				success: false,
				message: exitMessage,
			});
			responseFinished = true;
			try {
				res.end();
			} catch {
				// Client already disconnected.
			}
		}
	});
	
	childProcess.on('error', (error) => {
		clearInterval(heartbeat);
		releaseMfaExtractLockForRequest();
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: error.message
		})}\n\n`);
		responseFinished = true;
		res.end();
	});
});

app.get('/api/mfa-extraction-status', (req, res) => {
	res.json(getMfaExtractionStatus());
});

app.post('/api/cancel-mfa-extraction', (req, res) => {
	const status = getMfaExtractionStatus();
	if (!status.inProgress) {
		clearMfaDockerLockFile();
		return res.json({ success: true, cancelled: false, message: 'No MFA extraction was running (cleared docker lock if present).' });
	}
	const result = cancelMfaExtraction('user cancelled');
	res.json({ success: true, ...result, previous: status });
});

// API: Check if timings are extracted (now checks course-specific JSON files)
app.get('/api/check-timings', (req, res) => {
	try {
		const course = req.query.course || 'default';
		const courseTimingsDir = path.join(__dirname, 'courses', course, 'timings');
		let hasTimings = false;
		
		// Get module numbers for this course from courses.json
		let moduleNumbers = [];
		try {
			const coursesData = readCoursesJson();
			if (coursesData.courseModuleMapping && coursesData.courseModuleMapping[course]) {
				moduleNumbers = coursesData.courseModuleMapping[course];
			}
		} catch (e) {
			// If can't get course modules, check all timings
		}
		
		// Check JSON timing files in course directory
		if (fs.existsSync(courseTimingsDir)) {
			for (const moduleNum of moduleNumbers) {
				const jsonPath = path.join(courseTimingsDir, `module${moduleNum}.json`);
				if (fs.existsSync(jsonPath)) {
					try {
						const content = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
						if (content.slides && Object.keys(content.slides).length > 0) {
							// Check if any slide has words
							for (const slide of Object.values(content.slides)) {
								if (slide.words && slide.words.length > 0) {
									hasTimings = true;
									break;
								}
							}
						}
					} catch (e) {
						// Invalid JSON, skip
					}
					if (hasTimings) break;
				}
			}
		}
		
		res.json({ hasTimings });
	} catch (error) {
		res.json({ hasTimings: false });
	}
});

// API: Get slide statuses for a module
app.get('/api/slide-statuses', (req, res) => {
	try {
		const moduleNumber = parseModuleNumberParam(req.query.module);
		const courseId = req.query.course || 'aws-pulumi';
		
		if (moduleNumber === null) {
			return res.status(400).json({ error: 'Module number is required' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Extract module content
		const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
		const match = content.match(moduleRegex);
		
		if (!match) {
			return res.json({ slides: [] });
		}
		
		const moduleBody = match[1];
		
		// Find slides array using bracket counting (handles nested arrays/objects)
		const slidesStart = moduleBody.indexOf('slides:');
		if (slidesStart === -1) {
			return res.json({ slides: [] });
		}
		
		// Find the opening bracket
		const bracketStart = moduleBody.indexOf('[', slidesStart);
		if (bracketStart === -1) {
			return res.json({ slides: [] });
		}
		
		// Count brackets to find the matching closing bracket
		// Also track backticks to skip braces/brackets inside template literals
		let bracketDepth = 0;
		let inBacktickArray = false;
		let slidesEnd = -1;
		
		for (let i = bracketStart; i < moduleBody.length; i++) {
			const char = moduleBody[i];
			const prevChar = i > 0 ? moduleBody[i - 1] : '';
			
			// Toggle backtick state (but not for escaped backticks)
			if (char === '`' && prevChar !== '\\') {
				inBacktickArray = !inBacktickArray;
				continue;
			}
			
			// Skip bracket counting while inside template literals
			if (inBacktickArray) continue;
			
			if (char === '[') {
				bracketDepth++;
			} else if (char === ']') {
				bracketDepth--;
				if (bracketDepth === 0) {
					slidesEnd = i;
					break;
				}
			}
		}
		
		if (slidesEnd === -1) {
			return res.json({ slides: [] });
		}
		
		const slidesContent = moduleBody.substring(bracketStart + 1, slidesEnd);
		
		// Better parsing: split by slide boundaries
		// Handles nested objects AND template literals (backticks with braces inside)
		const slideTexts = [];
		let depth = 0;
		let currentSlide = '';
		let inSlide = false;
		let inBacktick = false; // Track if we're inside a template literal
		
		for (let i = 0; i < slidesContent.length; i++) {
			const char = slidesContent[i];
			const prevChar = i > 0 ? slidesContent[i - 1] : '';
			
			// Toggle backtick state (but not for escaped backticks)
			if (char === '`' && prevChar !== '\\') {
				inBacktick = !inBacktick;
				if (inSlide) currentSlide += char;
				continue;
			}
			
			// Skip brace counting while inside template literals
			if (inBacktick) {
				if (inSlide) currentSlide += char;
				continue;
			}
			
			if (char === '{') {
				if (depth === 0) {
					// Starting a new slide
					inSlide = true;
					currentSlide = '{';
				} else {
					currentSlide += char;
				}
				depth++;
			} else if (char === '}') {
				depth--;
				currentSlide += char;
				if (depth === 0 && inSlide) {
					// Finished a slide
					slideTexts.push(currentSlide);
					currentSlide = '';
					inSlide = false;
				}
			} else if (inSlide) {
				currentSlide += char;
			}
		}
		
		const slideMatches = slideTexts;
		
		// Use course-specific directories
		const course = courseId || 'default';
		const audioDir = path.join(__dirname, 'public', 'audio', course);
		const courseTimingsDir = path.join(__dirname, 'courses', course, 'timings');
		let moduleTimings = null;
		
		// Load timings from course-specific JSON file
		const timingsJsonPath = path.join(courseTimingsDir, `module${moduleNumber}.json`);
		console.log(`[slide-statuses] Checking: ${timingsJsonPath}`);
		if (fs.existsSync(timingsJsonPath)) {
			try {
				moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
				console.log(`[slide-statuses] Loaded timings for module ${moduleNumber}, slides: ${Object.keys(moduleTimings.slides || {}).join(', ')}`);
			} catch (e) {
				console.error(`[slide-statuses] Failed to parse JSON:`, e.message);
			}
		} else {
			console.log(`[slide-statuses] JSON file not found`);
		}
		
		const slides = [];
		
		if (slideMatches) {
			slideMatches.forEach((slideStr) => {
				const nameMatch = slideStr.match(/name:\s*"([^"]+)"/);
				const typeMatch = slideStr.match(/type:\s*"([^"]+)"/);
				const scriptMatch = slideStr.match(/script:\s*"([^"]+)"/);
				const titleMatch = slideStr.match(/title:\s*"([^"]+)"/);
				const imageSrcMatch = slideStr.match(/imageSrc:\s*"([^"]+)"/);
				
				if (!nameMatch) return;
				
				const slideName = nameMatch[1];
				const audioFileName = `module${moduleNumber}-${slideName}.wav`;
				const audioPath = path.join(audioDir, audioFileName);
				
				// Check audio status
				let audioStatus = 'missing';
				let audioSize = 0;
				if (fs.existsSync(audioPath)) {
					const stats = fs.statSync(audioPath);
					audioSize = stats.size;
					audioStatus = stats.size > 0 ? 'complete' : 'missing';
				}
				
				// Check timings status from JSON
				let timingsStatus = 'missing';
				
				if (moduleTimings && moduleTimings.slides && moduleTimings.slides[slideName]) {
					const slideTimings = moduleTimings.slides[slideName];
					if (slideTimings.words && slideTimings.words.length > 0) {
						timingsStatus = 'complete';
					}
				}
				
				// Video status: scene courses use ModuleN.tsx; slide courses use GenericModule + moduleContent
				let videoStatus = 'pending';
				const rootPath = path.join(__dirname, 'src', 'Root.tsx');
				const rootContent = fs.existsSync(rootPath) ? fs.readFileSync(rootPath, 'utf-8') : '';
				const contentJsonPath = path.join(__dirname, 'courses', courseId, 'content.json');
				let contentJson = null;
				if (fs.existsSync(contentJsonPath)) {
					try {
						contentJson = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
					} catch (e) { /* ignore */ }
				}
				const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
				const moduleContentText = fs.existsSync(moduleContentPath)
					? fs.readFileSync(moduleContentPath, 'utf-8')
					: '';
				const videosDir = path.join(__dirname, 'src', 'videos');
				const moduleRegistered = isModuleGeneratedForCourse(courseId, moduleNumber, {
					moduleContentText,
					rootContent,
					contentJson,
					videosDir,
				});
				if (moduleRegistered) {
					videoStatus = 'complete';
				} else {
					const moduleFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}.tsx`);
					const configFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}Config.ts`);
					if (fs.existsSync(moduleFile) && fs.existsSync(configFile)) {
						const moduleFileContent = fs.readFileSync(moduleFile, 'utf-8');
						if (moduleFileContent.includes(slideName) || moduleFileContent.includes(`"${slideName}"`)) {
							videoStatus = 'complete';
						}
					}
				}
				
				slides.push({
					name: slideName,
					type: typeMatch ? typeMatch[1] : 'content-single',
					title: titleMatch ? titleMatch[1] : '',
					script: scriptMatch ? scriptMatch[1] : '',
					imageSrc: imageSrcMatch ? imageSrcMatch[1] : null,
					audioStatus,
					audioSize,
					timingsStatus,
					videoStatus
				});
			});
		}
		
		res.json({ slides });
	} catch (error) {
		console.error('Error getting slide statuses:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get workflow status (check what's complete/incomplete)
app.get('/api/workflow-status', (req, res) => {
	let courseId = req.query.course || 'default';
	// When course is default/null/empty, use active course from moduleContent (where timings actually live)
	if (!courseId || courseId === 'default') {
		const activeCourse = getActiveCourseFromModuleContent();
		if (activeCourse) courseId = activeCourse;
	}
	try {
		// Use course-specific audio directory
		const audioDir = path.join(__dirname, 'public', 'audio', courseId);
		const videosDir = path.join(__dirname, 'src', 'videos');
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		// Read module content and Root.tsx (slide courses register GenericModule here)
		const content = fs.readFileSync(contentPath, 'utf-8');
		const rootPath = path.join(__dirname, 'src', 'Root.tsx');
		const rootContent = fs.existsSync(rootPath) ? fs.readFileSync(rootPath, 'utf-8') : '';
		
		const workflowStatus = {
			modules: [],
			summary: {
				totalModules: 0,
				modulesGenerated: 0,
				audioFilesGenerated: 0,
				totalAudioFiles: 0
			}
		};
		
		// Get module numbers for this course
		let moduleNumbers = [];
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${courseId.replace(/'/g, "\\'")}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
				}
			}
			if (moduleNumbers.length === 0) {
				const coursesData = readCoursesJson();
				moduleNumbers = coursesData.courseModuleMapping?.[courseId] || [];
			}
		} catch (e) {
			// Fallback: include all modules
		}
		
		// If no course mapping, derive from content.json or include all modules
		if (moduleNumbers.length === 0) {
			const contentJsonPath = path.join(__dirname, 'courses', courseId, 'content.json');
			if (fs.existsSync(contentJsonPath)) {
				try {
					const cj = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
					if (cj.modules) moduleNumbers = cj.modules.map((m) => m.moduleNumber).filter((n) => !isNaN(n));
				} catch (e2) { /* ignore */ }
			}
			if (moduleNumbers.length === 0) {
				const moduleMatches = content.match(/export const module\d+Content: ModuleContent = \{[\s\S]*?\};/g) || [];
				moduleNumbers = moduleMatches.map((_, i) => i + 1);
			}
		}
		
		// Load content.json for course (fallback when moduleContent has different course)
		let contentJson = null;
		const contentJsonPath = path.join(__dirname, 'courses', courseId, 'content.json');
		if (fs.existsSync(contentJsonPath)) {
			try {
				contentJson = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
			} catch (e) { /* ignore */ }
		}

		// Check each module in this course (from mapping or content.json)
		moduleNumbers.forEach((moduleNumber) => {
			const match = getModuleContentMatch(content, moduleNumber);
			const moduleCourseId = match?.match(/courseId:\s*["']([^"']+)["']/)?.[1];
			// Prefer slide names from moduleContent when course matches; else use content.json
			let slideNames = [];
			if (match && moduleCourseId === courseId) {
				const slidesContent = extractSlidesContent(match);
				slideNames = slidesContent ? extractSlideNames(slidesContent) : [];
			}
			if (slideNames.length === 0 && contentJson?.modules) {
				const mod = contentJson.modules.find((m) => m.moduleNumber === moduleNumber);
				if (mod?.slides) slideNames = mod.slides.map((s) => s.name).filter(Boolean);
			}
			if (slideNames.length === 0 && match) {
				const slidesContent = extractSlidesContent(match);
				slideNames = slidesContent ? extractSlideNames(slidesContent) : [];
			}
			const titleFromContent = contentJson?.modules?.find((m) => m.moduleNumber === moduleNumber)?.title;
			const titleMatch = match?.match(/title:\s*"([^"]+)"/);
			
			const moduleGenerated = isModuleGeneratedForCourse(courseId, moduleNumber, {
				moduleContentText: content,
				rootContent,
				contentJson,
				videosDir,
			});
			
			// Check audio files (always list every slide, even when the course audio folder is new/empty)
			const audioFiles = [];
			let audioComplete = 0;
			
			slideNames.forEach(slideName => {
				const audioFileName = `module${moduleNumber}-${slideName}.wav`;
				const audioPath = path.join(audioDir, audioFileName);
				const exists = fs.existsSync(audioPath);
				const size = exists ? fs.statSync(audioPath).size : 0;
				
				audioFiles.push({
					name: slideName,
					fileName: audioFileName,
					exists,
					size,
				});
				
				if (exists && size > 0) {
					audioComplete++;
				}
			});
			
			// Check audio durations (with course prefix)
			const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
			let audioMeasured = false;
			if (fs.existsSync(audioDurationPath)) {
				const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
				// Audio duration keys now include course prefix: {courseId}/module{N}-{name}
				const audioKeys = slideNames.map(name => `${courseId}/module${moduleNumber}-${name}`);
				// Check that each key exists and has a numeric value
				audioMeasured = audioKeys.length > 0 && audioKeys.every(key => {
					const keyPattern = new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
					return keyPattern.test(audioDurationContent);
				});
			}
			
			// Check word timings from course-specific directory
			const timingCoverage = getModuleTimingCoverage(courseId, moduleNumber, slideNames, __dirname);
			const timingsExtracted = timingCoverage.timingsExtracted;
			
			// layoutPreview: content registered (preview in Remotion without audio/timings)
			// basicPreview: Steps 1-3 (audio + durations)
			// fullyAnimated: Step 4 (word timings)
			const layoutPreview = moduleGenerated;
			const basicPreview = layoutPreview && audioComplete === slideNames.length && slideNames.length > 0 && audioMeasured;
			const fullyAnimated = basicPreview && timingsExtracted;
			const animationStatus = fullyAnimated
				? 'fullyAnimated'
				: (basicPreview ? 'basicPreview' : (layoutPreview ? 'layoutPreview' : 'incomplete'));
			
			workflowStatus.modules.push({
				moduleNumber,
				title: titleFromContent || (titleMatch ? titleMatch[1] : `Module ${moduleNumber}`),
				moduleGenerated,
				audioFiles,
				audioComplete,
				audioTotal: slideNames.length,
				audioProgress: slideNames.length > 0 ? (audioComplete / slideNames.length) * 100 : 0,
				audioMeasured,
				timingsExtracted,
				timingsFileExists: timingCoverage.timingsFileExists,
				timingSlidesComplete: timingCoverage.timingSlidesComplete,
				timingSlidesTotal: timingCoverage.timingSlidesTotal,
				missingTimingSlides: timingCoverage.missingTimingSlides,
				layoutPreview,
				readyForRemotion: layoutPreview || basicPreview,
				animationStatus
			});
			
			if (moduleGenerated) workflowStatus.summary.modulesGenerated++;
			workflowStatus.summary.audioFilesGenerated += audioComplete;
			workflowStatus.summary.totalAudioFiles += slideNames.length;
		});
		
		workflowStatus.summary.totalModules = workflowStatus.modules.length;

		const timingSlidesComplete = workflowStatus.modules.reduce(
			(n, m) => n + (m.timingSlidesComplete || 0),
			0
		);
		const timingSlidesTotal = workflowStatus.modules.reduce(
			(n, m) => n + (m.timingSlidesTotal || 0),
			0
		);
		workflowStatus.summary.timingSlidesComplete = timingSlidesComplete;
		workflowStatus.summary.timingSlidesTotal = timingSlidesTotal;
		workflowStatus.summary.timingsModulesComplete = workflowStatus.modules.filter(
			(m) => m.timingsExtracted
		).length;
		workflowStatus.summary.timingsModulesMissing = workflowStatus.modules
			.filter((m) => !m.timingsExtracted)
			.map((m) => ({
				moduleNumber: m.moduleNumber,
				title: m.title,
				missingCount: (m.missingTimingSlides || []).length,
				missingTimingSlides: m.missingTimingSlides || [],
				timingsFileExists: m.timingsFileExists,
			}));
		
		// Calculate overall progress
		workflowStatus.summary.overallProgress = workflowStatus.summary.totalModules > 0
			? ((workflowStatus.summary.modulesGenerated / workflowStatus.summary.totalModules) * 50 +
			   (workflowStatus.summary.audioFilesGenerated / workflowStatus.summary.totalAudioFiles) * 50)
			: 0;

		// Diagram pipeline (Step 5) - course-level
		const courseDir = path.join(__dirname, 'courses', courseId);
		const classificationPath = path.join(courseDir, 'slide-visual-classification.json');
		const splitsPath = path.join(courseDir, 'slide-splits.json');
		let diagramPipelineComplete = false;
		if (courseUsesSceneVisuals(courseId)) {
			// Scene courses use SVG scenes, not Mermaid pipeline
			const scenesPath = path.join(courseDir, 'course', 'remotion', 'scenes');
			diagramPipelineComplete = fs.existsSync(scenesPath);
		} else if (fs.existsSync(classificationPath) && fs.existsSync(splitsPath)) {
			try {
				const splits = JSON.parse(fs.readFileSync(splitsPath, 'utf-8'));
				diagramPipelineComplete = Object.values(splits).some((v) => {
					if (!v || typeof v !== 'object') return false;
					const segs = v.segments;
					return Array.isArray(segs) && segs.some((s) => s && s.mermaidSource);
				});
			} catch (e) { /* ignore */ }
		}
		workflowStatus.summary.diagramPipelineComplete = diagramPipelineComplete;
		workflowStatus.usesSceneVisuals = courseUsesSceneVisuals(courseId);
		workflowStatus.summary.usesSceneVisuals = courseUsesSceneVisuals(courseId);
		// Propagate to all modules for consistency
		workflowStatus.modules.forEach((m) => { m.diagramPipelineComplete = diagramPipelineComplete; });

		const activeCourseId = getActiveCourseFromModuleContent();
		workflowStatus.activeCourseId = activeCourseId;
		workflowStatus.selectedCourseId = courseId;
		workflowStatus.courseMismatch = Boolean(activeCourseId && courseId && activeCourseId !== courseId);
		if (workflowStatus.courseMismatch) {
			workflowStatus.courseMismatchMessage =
				`Remotion is using "${activeCourseId}" but you selected "${courseId}". Audio and timings run from moduleContent.ts — Step 2 will auto-activate the selected course, or click Activate below.`;
		}
		
		res.json(workflowStatus);
	} catch (error) {
		console.error('Error getting workflow status:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Word timing coverage for one course or all active courses (GUI panels)
app.get('/api/timings-coverage', (req, res) => {
	try {
		const scope = req.query.scope || 'course';
		const courseId = req.query.course;

		if (scope === 'all-active') {
			const data = readCoursesJson();
			const activeCourses = (data.courses || []).filter((c) => c.status === 'active');
			const courses = activeCourses.map((c) => getCourseTimingCoverage(c.id, __dirname));
			res.json({
				scope: 'all-active',
				courses,
			});
			return;
		}

		let targetCourseId = courseId;
		if (!targetCourseId || targetCourseId === 'default') {
			targetCourseId = getActiveCourseFromModuleContent();
		}
		if (!targetCourseId) {
			return res.status(400).json({
				error: 'No course selected',
				details: 'Pass ?course=<id> or activate a course first.',
			});
		}

		res.json({
			scope: 'course',
			...getCourseTimingCoverage(targetCourseId, __dirname),
		});
	} catch (error) {
		console.error('Error getting timings coverage:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Check OpenAI API key and quota before running diagram pipeline
app.get('/api/check-openai', async (req, res) => {
	try {
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return res.json({ ok: false, error: 'OPENAI_API_KEY not set in .env' });
		}
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [{ role: 'user', content: 'Say OK' }],
				max_tokens: 5,
			}),
		});
		if (!response.ok) {
			const errText = await response.text();
			let msg = `OpenAI API error: ${response.status}`;
			if (response.status === 429) {
				msg = 'OpenAI rate limit or quota exceeded (429). Add credits at platform.openai.com or wait and retry.';
			} else if (errText.toLowerCase().includes('insufficient_quota')) {
				msg = 'OpenAI account has insufficient quota. Add credits at platform.openai.com.';
			} else if (errText) {
				try {
					const err = JSON.parse(errText);
					msg = err.error?.message || msg;
				} catch (_) {}
			}
			return res.json({ ok: false, error: msg });
		}
		res.json({ ok: true });
	} catch (err) {
		res.json({ ok: false, error: err.message || 'Failed to reach OpenAI API' });
	}
});

// API: Run diagram pipeline (Step 5) - streaming progress
// Body: { course, courseId, improve?, module? }
// If module is set, run pipeline for that module only (lower cost, incremental progress).
app.post('/api/diagram-pipeline', (req, res) => {
	const { course, courseId, module: moduleNum } = req.body;
	const targetCourseId = courseId || course || 'default';
	const runForModule = moduleNum != null && moduleNum !== '' ? parseInt(String(moduleNum), 10) : null;

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('X-Accel-Buffering', 'no');
	res.flushHeaders();

	const send = (type, message) => {
		res.write(`data: ${JSON.stringify({ type, message })}\n\n`);
		if (typeof res.flush === 'function') res.flush();
	};

	const courseDir = path.join(__dirname, 'courses', targetCourseId);
	const contentPath = path.join(courseDir, 'content.json');
	const splitsPath = path.join(courseDir, 'slide-splits.json');
	const courseTimingsDir = path.join(courseDir, 'timings');
	const publicTimingsDir = path.join(__dirname, 'public', 'timings');

	if (!fs.existsSync(contentPath)) {
		send('error', `content.json not found for course: ${targetCourseId}`);
		res.end();
		return;
	}

	if (courseUsesSceneVisuals(targetCourseId)) {
		send('error', `Course "${targetCourseId}" uses SVG scene visuals (visualMode: scenes). The Mermaid diagram pipeline is disabled. Use Per-module mode in Step 1 to generate scene-based modules instead.`);
		res.end();
		return;
	}

	(async () => {
		try {
			send('progress', runForModule != null ? `Starting diagram pipeline for Module ${runForModule}...` : 'Starting diagram pipeline...');
			console.log('[diagram-pipeline] Starting for course:', targetCourseId, runForModule != null ? `(module ${runForModule} only)` : '(all modules)');

			// Map author bullets to phrase times (ensures bullet highlights sync with narration)
			try {
				send('progress', 'Mapping phrase times for bullet sync...');
				const modArgMap = runForModule != null ? ` ${runForModule}` : ' all';
				execSync(`npx tsx scripts/mapPhraseTimes.ts ${targetCourseId}${modArgMap}`, { cwd: __dirname, stdio: 'pipe' });
			} catch (e) {
				console.warn('[diagram-pipeline] mapPhraseTimes skipped:', e?.message || e);
			}

			// Copy course timings to public/timings so scripts can find them
			if (fs.existsSync(courseTimingsDir)) {
				send('progress', 'Copying timings to public...');
				if (!fs.existsSync(publicTimingsDir)) fs.mkdirSync(publicTimingsDir, { recursive: true });
				const files = fs.readdirSync(courseTimingsDir).filter((f) => f.endsWith('.json'));
				for (const f of files) {
					fs.copyFileSync(path.join(courseTimingsDir, f), path.join(publicTimingsDir, f));
				}
				send('progress', `Copied ${files.length} timing file(s)`);
			}

			// Bootstrap slide-splits.json if missing
			if (!fs.existsSync(splitsPath)) {
				send('progress', 'Bootstrapping slide-splits.json...');
				const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
				const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
				const audioContent = fs.existsSync(audioDurationPath) ? fs.readFileSync(audioDurationPath, 'utf-8') : '';
				const splits = { _comment: 'Auto-bootstrapped from content + audio durations' };
				for (const mod of content.modules || []) {
					for (const slide of mod.slides || []) {
						if (slide.type !== 'content-single' && slide.type !== 'content-two-card') continue;
						const key = `${targetCourseId}/module${mod.moduleNumber}-${slide.name}`;
						const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
						const match = audioContent.match(new RegExp(`"${escaped}"\\s*:\\s*([\\d.]+)`));
						const dur = match ? parseFloat(match[1]) : 60;
						splits[slide.name] = { splitAt: [dur / 2] };
					}
				}
				fs.writeFileSync(splitsPath, JSON.stringify(splits, null, 2), 'utf-8');
				send('progress', 'Bootstrap complete');
			}

			// Improve mode: skip derive-boundaries and derive-bullets to preserve existing mermaid.
			// Only re-classify and add/improve mermaid (add highlighting, convert more slides to diagrams).
			const improveMode = !!req.body.improve;
			const modArg = runForModule != null ? ` --module ${runForModule}` : '';
			const modArgBullets = runForModule != null ? ` ${runForModule}` : ' all';
			const steps = improveMode
				? [
					{ name: 'classify-slide-visual', cmd: `npx tsx scripts/classifySlideVisual.ts ${targetCourseId} --refine${modArg}`, timeoutMs: 10 * 60 * 1000 },
					{ name: 'generate-mermaid-segments', cmd: `npx tsx scripts/generateMermaidSegments.ts ${targetCourseId} --include-content --add-highlights${modArg}`, timeoutMs: 30 * 60 * 1000 },
					{ name: 'sync-slide-splits', cmd: 'npx tsx scripts/syncSlideSplitsToTs.ts', timeoutMs: 60 * 1000 },
					{ name: 'activate', cmd: `npx tsx scripts/activateCourse.ts ${targetCourseId}`, timeoutMs: 2 * 60 * 1000 }
				]
				: [
					{ name: 'derive-boundaries-from-script', cmd: `npx tsx scripts/deriveBoundariesFromScript.ts ${targetCourseId}${modArg}`, timeoutMs: 5 * 60 * 1000 },
					{ name: 'derive-bullets', cmd: `npx tsx scripts/deriveBulletsFromWordTimings.ts ${targetCourseId}${modArgBullets}`, timeoutMs: 5 * 60 * 1000 },
					{ name: 'classify-slide-visual', cmd: `npx tsx scripts/classifySlideVisual.ts ${targetCourseId} --refine${modArg}`, timeoutMs: 10 * 60 * 1000 },
					{ name: 'generate-mermaid-segments', cmd: `npx tsx scripts/generateMermaidSegments.ts ${targetCourseId} --include-content${modArg}`, timeoutMs: 30 * 60 * 1000 },
					{ name: 'sync-slide-splits', cmd: 'npx tsx scripts/syncSlideSplitsToTs.ts', timeoutMs: 60 * 1000 },
					{ name: 'activate', cmd: `npx tsx scripts/activateCourse.ts ${targetCourseId}`, timeoutMs: 2 * 60 * 1000 }
				];
			// NOTE: activateCourse.ts now uses scene generator for visualMode:scenes courses

			const runStep = (step, i) => new Promise((resolve, reject) => {
				const stepTimeout = step.timeoutMs ?? 5 * 60 * 1000;
				send('progress', `Running ${step.name} (${i + 1}/${steps.length})...`);
				const proc = spawn(step.cmd, [], {
					cwd: __dirname,
					stdio: ['ignore', 'pipe', 'pipe'],
					shell: true
				});
				let stdout = '';
				let stderr = '';
				const timeout = setTimeout(() => {
					proc.kill('SIGTERM');
					reject(new Error(`${step.name} timed out after ${stepTimeout / 1000}s`));
				}, stepTimeout);
				proc.stdout.on('data', (chunk) => {
					const s = String(chunk).trim();
					if (s) {
						stdout += s + '\n';
						send('progress', `[${step.name}] ${s.split('\n')[0]}`);
					}
				});
				proc.stderr.on('data', (chunk) => {
					const s = String(chunk).trim();
					if (s) stderr += s + '\n';
				});
				proc.on('close', (code) => {
					clearTimeout(timeout);
					if (code === 0) {
						send('progress', `${step.name} done`);
						resolve();
					} else {
						reject(new Error(`${step.name} exited ${code}${stderr ? '\n' + stderr.trim().slice(-500) : ''}`));
					}
				});
				proc.on('error', (err) => {
					clearTimeout(timeout);
					reject(err);
				});
			});

			for (let i = 0; i < steps.length; i++) {
				try {
					await runStep(steps[i], i);
				} catch (e) {
					send('error', `${steps[i].name} failed: ${e.message || e}`);
					console.error('[diagram-pipeline]', steps[i].name, 'failed:', e.message);
					res.end();
					return;
				}
			}

			send('complete', 'Diagram pipeline completed successfully');
		} catch (err) {
			send('error', err.message || String(err));
		} finally {
			res.end();
		}
	})();
});

// API: Get checkpoint status for batch operations
app.get('/api/checkpoint-status', (req, res) => {
	try {
		const { operation, course } = req.query;
		const checkpointPath = path.join(__dirname, '.checkpoints', `${operation}-${course || 'default'}.json`);
		
		if (!fs.existsSync(checkpointPath)) {
			return res.json({ exists: false });
		}
		
		const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'));
		return res.json({
			exists: true,
			started: checkpoint.started,
			completed: checkpoint.completed?.length || 0,
			failed: checkpoint.failed?.length || 0,
			skipped: checkpoint.skipped?.length || 0,
			failedItems: checkpoint.failed || [],
			canResume: (checkpoint.failed?.length || 0) > 0
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Clear checkpoint
app.post('/api/clear-checkpoint', (req, res) => {
	try {
		const { operation, course } = req.body;
		const checkpointPath = path.join(__dirname, '.checkpoints', `${operation}-${course || 'default'}.json`);
		
		if (fs.existsSync(checkpointPath)) {
			fs.unlinkSync(checkpointPath);
			res.json({ success: true, message: 'Checkpoint cleared' });
		} else {
			res.json({ success: true, message: 'No checkpoint to clear' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Generate audio for single slide (supports OpenAI, MiniMax, RunPod)
// For multi-audio code slides: pass base name to generate all chunks (-1, -2, -3)
app.post('/api/generate-audio-slide', async (req, res) => {
	const { moduleNumber, slideName, force, voice, provider, course } = req.body;
	
	const parsedModuleNumber = parseModuleNumberParam(moduleNumber);
	if (parsedModuleNumber === null || !slideName) {
		return res.status(400).json({ error: 'Module number and slide name are required' });
	}
	if (!course) {
		return res.status(400).json({
			error: 'Course is required',
			details: 'Select a video in the wizard so moduleContent.ts matches before generating slide audio.',
		});
	}

	let activationInfo;
	try {
		activationInfo = resolveCourseForProcessing(course, { autoActivate: true });
	} catch (err) {
		return res.status(400).json({
			error: err.message,
			code: err.code,
			activeCourseId: err.activeCourseId,
			selectedCourseId: err.selectedCourseId,
		});
	}
	
	const settings = loadVoiceSettings();
	const finalProvider = provider || settings.provider || 'openai';
	const finalVoice = voice || settings.defaultVoice?.[finalProvider] || 'onyx';
	
	console.log(`[generate-audio-slide] Course: ${activationInfo.courseId}, Module ${parsedModuleNumber}, Slide: ${slideName}, Provider: ${finalProvider}, Voice: ${finalVoice}${activationInfo.activated ? ' (activated)' : ''}`);
	
	const scriptPath = path.join(__dirname, 'scripts', 'generateAudioForSlide.ts');
	const flags = force ? '--force' : '';
	const cmd = `npx tsx "${scriptPath}" ${parsedModuleNumber} ${slideName} "${finalVoice}" ${finalProvider}${flags ? ` ${flags}` : ''}`;
	
	exec(cmd, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			console.error('[generate-audio-slide] Error:', stderr || error.message);
			return res.status(500).json({ error: stderr || error.message, output: stdout });
		}

		const output = `${stdout || ''}\n${stderr || ''}`;
		const skipped = /already exists/i.test(output);
		const completedMatch = output.match(/Completed:\s*(\S+\.wav)\s*\(([\d.]+)KB/i);
		const audioFileName = completedMatch
			? completedMatch[1]
			: `module${parsedModuleNumber}-${slideName}.wav`;
		const audioPath = path.join(__dirname, 'public', 'audio', activationInfo.courseId, audioFileName);
		let size = 0;
		if (fs.existsSync(audioPath)) {
			size = fs.statSync(audioPath).size;
		}

		res.json({
			success: !skipped,
			skipped,
			output: stdout,
			provider: finalProvider,
			courseId: activationInfo.courseId,
			courseActivated: activationInfo.activated,
			previousCourseId: activationInfo.previousCourseId,
			audioFile: audioFileName,
			size,
		});
	});
});

// Helper: Validate exported video
function validateExportedVideo(moduleNumber, courseId, videoPath, fileSize) {
	const validation = {
		valid: true,
		errors: [],
		warnings: [],
		checks: {}
	};
	
	try {
		// Check 1: File exists and has reasonable size
		if (fileSize < 1000) { // Less than 1KB is suspicious
			validation.valid = false;
			validation.errors.push(`Video file is too small (${(fileSize / 1024).toFixed(1)}KB) - likely corrupted or incomplete`);
		} else if (fileSize < 100000) { // Less than 100KB is very small
			validation.warnings.push(`Video file is very small (${(fileSize / 1024).toFixed(1)}KB) - may be incomplete`);
		}
		validation.checks.fileSize = { valid: fileSize >= 1000, size: fileSize, sizeMB: (fileSize / 1024 / 1024).toFixed(2) };
		
		// Check 2: Verify expected duration matches (if config exists)
		const configPath = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}Config.ts`);
		if (fs.existsSync(configPath)) {
			try {
				const configContent = fs.readFileSync(configPath, 'utf-8');
				const durationMatch = configContent.match(/totalDuration:\s*([\d.]+)/);
				if (durationMatch) {
					const expectedDuration = parseFloat(durationMatch[1]);
					validation.checks.expectedDuration = expectedDuration;
					// Note: Actual video duration would require ffprobe/ffmpeg, which we don't have here
					// This is a limitation - we can only check file size, not actual duration
					validation.warnings.push('Video duration validation requires ffprobe (not available) - manually verify duration matches expected');
				}
			} catch (e) {
				validation.warnings.push('Could not read module config to verify expected duration');
			}
		}
		
		// Check 3: Verify module content matches (check slide count)
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		if (fs.existsSync(contentPath)) {
			try {
				const content = fs.readFileSync(contentPath, 'utf-8');
				const moduleMatch = content.match(new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`));
				if (moduleMatch) {
					const slidesContent = extractSlidesContent(moduleMatch[1]);
					if (slidesContent) {
						const slideNames = extractSlideNames(slidesContent);
						validation.checks.slideCount = slideNames.length;
						validation.checks.slides = slideNames;
					}
				}
			} catch (e) {
				validation.warnings.push('Could not verify slide count from module content');
			}
		}
		
		// Check 4: Verify audio files exist for all slides
		const audioDir = path.join(__dirname, 'public', 'audio', courseId);
		if (validation.checks.slides && fs.existsSync(audioDir)) {
			const missingAudio = [];
			validation.checks.slides.forEach(slideName => {
				const audioFile = path.join(audioDir, `module${moduleNumber}-${slideName}.wav`);
				if (!fs.existsSync(audioFile) || fs.statSync(audioFile).size === 0) {
					missingAudio.push(slideName);
				}
			});
			if (missingAudio.length > 0) {
				validation.warnings.push(`Missing audio files for ${missingAudio.length} slide(s): ${missingAudio.slice(0, 3).join(', ')}${missingAudio.length > 3 ? '...' : ''}`);
			}
			validation.checks.audioFiles = { total: validation.checks.slides.length, missing: missingAudio.length };
		}
		
		// Overall validation
		if (validation.errors.length > 0) {
			validation.valid = false;
		}
		
	} catch (error) {
		validation.valid = false;
		validation.errors.push(`Validation error: ${error.message}`);
	}
	
	return validation;
}

// API: Render video to MP4
app.post('/api/render-video', (req, res) => {
	const {
		moduleNumber,
		courseId,
		concurrency: requestedConcurrency,
		costPerHour,
		instanceLabel,
	} = req.body;
	const concurrency = getOptimalRenderConcurrency(requestedConcurrency);
	const jobId = crypto.randomUUID();
	const timer = createJobTimer();
	let parseState = createRemotionParseState();
	const preset = 'gui-default';
	const costPerHourUsd = costPerHour !== undefined && costPerHour !== null ? String(costPerHour) : '';
	console.log(`[render-video] LOCAL RENDER - ${concurrency} threads (Chromium + ffmpeg) job=${jobId}`);
	if (!isModuleNumberProvided(moduleNumber)) {
		return res.status(400).json({ error: 'Module number is required' });
	}
	
	// Use course-specific output directory
	const course = courseId || getActiveCourseFromModuleContent() || 'default';

	if (course !== 'default') {
		try {
			const activation = ensureCourseActiveSync(course);
			if (!activation.alreadyActive) {
				console.log(`[render-video] Auto-activated "${course}" before render`);
			}
		} catch (activateErr) {
			console.error('[render-video] Course activation failed:', activateErr.message);
			return res.status(400).json({
				error: 'Could not activate course for render',
				details: activateErr.message,
				hint: 'Open Processing Wizard, select this course, and click Finalize Video.',
			});
		}
	}

	if (course !== 'default') {
		const preflight = validateRenderAssets(course, [Number(moduleNumber)], __dirname);
		timer.mark('syncDone');
		if (!preflight.ok) {
			console.error('[render-video] Asset preflight failed:', preflight.missing || preflight.error);
			return res.status(400).json({
				error: 'Course assets not ready for render',
				details: preflight.error || `Missing ${preflight.missing.length} asset(s) in public/`,
				missing: preflight.missing || [],
				hint: 'Run ./start.sh or Finalize Video to sync SVGs and timings before render.',
			});
		}
	} else {
		timer.mark('syncDone');
	}

	const outDir = path.join(__dirname, 'out', course);
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}
	
	const compositionId = `module-${moduleNumber}`;
	const outputPath = path.join(outDir, `${compositionId}.mp4`);
	const indexPath = path.join(__dirname, 'src', 'index.tsx');
	
	// Set headers for streaming progress
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	// Build render command with options for better compatibility
	// --timeout increases browser connection timeout (default 30000)
	const command = `npx remotion render "${indexPath}" ${compositionId} "${outputPath}" --timeout=120000 --concurrency=${concurrency} --jpeg-quality=80 --public-dir=public`;
	
	const childProcess = exec(command, { 
		cwd: __dirname, 
		maxBuffer: 10 * 1024 * 1024,
		timeout: 0, // No timeout for the exec itself (rendering can take a while)
		env: { 
			...process.env, 
			NODE_ENV: 'production',
			// Increase Puppeteer timeout for browser connection
			PUPPETEER_TIMEOUT: '120000'
		}
	});
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: `Starting video render for Module ${moduleNumber}...` })}\n\n`);
	
	console.log(`[render-video] Starting render for ${compositionId}`);
	
	let buffer = '';
	let stderrBuffer = '';
	let phase = 'bundling'; // 'bundling' or 'rendering'
	let lastBundlePercent = 0;
	let lastRenderPercent = 0;

	const finalizeDoneEvent = (success, message, extra = {}) => {
		const outputFileMb =
			extra.fileSize !== undefined ? extra.fileSize / 1024 / 1024 : null;
		const metricsRow = persistRenderMetrics({
			jobId,
			courseId: course,
			moduleNumber,
			instanceLabel,
			concurrency,
			timer,
			costPerHourUsd,
			preset,
			success,
			outputFileMb,
			error: success ? '' : message,
		});
		res.write(`data: ${JSON.stringify({
			type: 'done',
			success,
			message,
			metrics: metricsRow,
			metricsCsvUrl: '/api/render-metrics/download',
			...extra,
		})}\n\n`);
		res.end();
	};
	
	// Helper to send phase-aware progress
	// Phases: bundling (0-30%), copying (30-35%), rendering (35-90%), encoding (90-99%), complete (100%)
	const sendProgress = (percent, message, currentPhase) => {
		let overallPercent;
		if (currentPhase === 'bundling') {
			overallPercent = Math.round(percent * 0.30); // 0-30%
		} else if (currentPhase === 'copying') {
			overallPercent = 32;
		} else if (currentPhase === 'rendering') {
			overallPercent = 35 + Math.round(percent * 0.55); // 35-90%
		} else if (currentPhase === 'encoding') {
			overallPercent = 90 + Math.round(percent * 0.09); // 90-99%
		} else {
			overallPercent = 100;
		}
		res.write(`data: ${JSON.stringify({ 
			type: 'progress', 
			message: `[${currentPhase.toUpperCase()}] ${message}`,
			percent: overallPercent,
			phase: currentPhase
		})}\n\n`);
	};
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split(/\r|\n/);
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			parseState = parseRemotionStdoutLine(line, timer, parseState);
			
			// Parse bundling progress (e.g., "Bundling 45%")
			const bundleMatch = line.match(/Bundling\s+(\d+)%/i);
			if (bundleMatch) {
				const percent = parseInt(bundleMatch[1]);
				if (percent > lastBundlePercent) {
					lastBundlePercent = percent;
					sendProgress(percent, `Bundling ${percent}%`, 'bundling');
				}
				continue;
			}
			
			// Parse "Copying public dir" phase (between bundling and rendering)
			if (line.includes('Copying public dir')) {
				phase = 'copying';
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: '[PREPARING] Copying assets...',
					percent: 32,
					phase: 'copying'
				})}\n\n`);
				continue;
			}
			
			// Parse "Getting compositions" - about to start rendering
			if (line.includes('Getting compositions') || line.includes('Composition')) {
				phase = 'rendering';
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: '[RENDERING] Starting frame render...',
					percent: 35,
					phase: 'rendering'
				})}\n\n`);
				continue;
			}
			
			// Parse rendering progress: "Rendered X/Y" format
			// Only send updates every 5% to reduce noise
			const frameMatch = line.match(/Rendered\s+(\d+)\/(\d+)/i);
			if (frameMatch) {
				phase = 'rendering';
				const current = parseInt(frameMatch[1]);
				const total = parseInt(frameMatch[2]);
				const percent = Math.round((current / total) * 100);
				// Only update on 5% milestones to reduce verbosity
				if (percent >= lastRenderPercent + 5 || percent === 100) {
					lastRenderPercent = percent;
					const overallPercent = 35 + Math.round(percent * 0.55);
					res.write(`data: ${JSON.stringify({ 
						type: 'progress', 
						message: `Rendering ${percent}%`,
						percent: overallPercent,
						phase: 'rendering'
					})}\n\n`);
				}
				continue;
			}
			
			// Parse encoding progress: "Encoded X/Y"
			// Only send updates every 10% to reduce noise
			const encodedMatch = line.match(/Encoded\s+(\d+)\/(\d+)/i);
			if (encodedMatch) {
				phase = 'encoding';
				const current = parseInt(encodedMatch[1]);
				const total = parseInt(encodedMatch[2]);
				const percent = Math.round((current / total) * 100);
				// Only update on 10% milestones
				const lastEncodingMilestone = Math.floor(lastRenderPercent / 10) * 10;
				const currentMilestone = Math.floor(percent / 10) * 10;
				if (currentMilestone > lastEncodingMilestone || percent === 100) {
					const overallPercent = 90 + Math.round(percent * 0.09);
					res.write(`data: ${JSON.stringify({ 
						type: 'progress', 
						message: `Encoding ${percent}%`,
						percent: overallPercent,
						phase: 'encoding'
					})}\n\n`);
				}
				continue;
			}
			
			// Parse final output line (e.g., "+   out/test.mp4 300 kB")
			if (line.includes('.mp4') && (line.includes('kB') || line.includes('MB'))) {
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: '[COMPLETE] Video file created',
					percent: 100,
					phase: 'complete'
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const rawMessage = data.toString();
		const lines = rawMessage.split('\n');
		
		for (const line of lines) {
			const message = line.trim();
			if (!message) continue;
			stderrBuffer += message + '\n';
			if (message.includes('Symbol(') || 
			    message.includes('delayRender') || 
			    message.includes('CONSOLE') ||
			    message.includes('handle was cleared') ||
			    message.includes('source: http://localhost')) {
				continue; // Filter out verbose debug messages
			}
			
			// Parse rendering progress from stderr (Remotion outputs progress here)
			// Format: "Rendering frame 50/1000" or "Rendered 50 frames" or "(50%)"
			const frameMatch = message.match(/(?:Render(?:ing|ed)?)\s*(?:frame)?\s*(\d+)\s*(?:\/|of)\s*(\d+)/i);
			if (frameMatch) {
				phase = 'rendering';
				const current = parseInt(frameMatch[1]);
				const total = parseInt(frameMatch[2]);
				const percent = Math.round((current / total) * 100);
				if (percent >= lastRenderPercent) {
					lastRenderPercent = percent;
					sendProgress(percent, `Rendering frame ${current}/${total} (${percent}%)`, 'rendering');
				}
				continue;
			}
			
			// Also check for "Stitching" or encoding phase
			if (message.includes('Stitching') || message.includes('Encoding') || message.includes('stitching')) {
				phase = 'rendering';
				sendProgress(95, 'Stitching video...', 'rendering');
				continue;
			}
			
			// Check for "Rendered X frames" summary
			const renderedMatch = message.match(/Rendered\s+(\d+)\s+frames/i);
			if (renderedMatch) {
				phase = 'rendering';
				sendProgress(90, `Rendered ${renderedMatch[1]} frames`, 'rendering');
				continue;
			}
			
			// Classify errors
			const isError = message.includes('Error') || message.includes('error:') || 
			                message.includes('TimeoutError') || message.includes('failed') ||
			                message.includes('ENOENT') || message.includes('Cannot');
			
			if (isError) {
				console.error('[render-video] Error:', message);
				res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
			} else if (message.includes('Render') || message.includes('frame') || message.includes('video')) {
				// Log other rendering-related messages
				console.log('[render-video] Info:', message);
				phase = 'rendering';
				res.write(`data: ${JSON.stringify({ type: 'progress', message: '[RENDERING] ' + message, phase: 'rendering' })}\n\n`);
			}
		}
	});
	
	childProcess.on('close', (code) => {
		// Check if output file exists (even on non-zero exit code)
		// Windows EPERM errors can occur during cleanup even when render succeeds
		const fileExists = fs.existsSync(outputPath);
		const hasEpermError = stderrBuffer.includes('EPERM') || stderrBuffer.includes('kill EPERM');
		
		if (code === 0 || (fileExists && hasEpermError)) {
			// Wait a moment for file system to catch up (Windows)
			setTimeout(() => {
				if (fs.existsSync(outputPath)) {
					const stats = fs.statSync(outputPath);
					if (stats.size > 0) {
						// Validate exported video
						const validation = validateExportedVideo(moduleNumber, course, outputPath, stats.size);
						
						const message = hasEpermError && code !== 0
							? `Video rendered successfully! (Windows cleanup warning ignored)`
							: `Video rendered successfully!`;
						
						finalizeDoneEvent(true, message, {
							filePath: outputPath,
							fileSize: stats.size,
							downloadUrl: `/api/download-video?module=${moduleNumber}&course=${course}`,
							validation: validation,
						});
					} else {
						finalizeDoneEvent(false, 'Output file is empty');
					}
				} else {
					finalizeDoneEvent(false, 'Render completed but output file not found');
				}
			}, hasEpermError ? 1000 : 0);
		} else {
			// Check one more time if file exists (might have been created)
			if (fileExists) {
				const stats = fs.statSync(outputPath);
				if (stats.size > 0) {
					// Validate exported video
					const validation = validateExportedVideo(moduleNumber, course, outputPath, stats.size);
					
					finalizeDoneEvent(true, `Video rendered successfully! (Non-zero exit code but file exists)`, {
						filePath: outputPath,
						fileSize: stats.size,
						downloadUrl: `/api/download-video?module=${moduleNumber}&course=${course}`,
						validation: validation,
					});
				} else {
					finalizeDoneEvent(false, `Render failed with exit code ${code}`);
				}
			} else {
				finalizeDoneEvent(false, `Render failed with exit code ${code}`);
			}
		}
	});
	
	childProcess.on('error', (error) => {
		persistRenderMetrics({
			jobId,
			courseId: course,
			moduleNumber,
			instanceLabel,
			concurrency,
			timer,
			costPerHourUsd,
			preset,
			success: false,
			outputFileMb: null,
			error: error.message,
		});
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: `Render error: ${error.message}` 
		})}\n\n`);
		res.end();
	});
});

// API: Render metrics (benchmark CSV)
app.get('/api/render-metrics/download', (req, res) => {
	try {
		ensureMetricsDir(__dirname);
	} catch (err) {
		return res.status(503).json({
			error: err.message || 'Render metrics directory is not writable. Fix volume permissions.',
		});
	}
	let header;
	let rows;
	let csvPath;
	try {
		({ header, rows, path: csvPath } = readRenderMetricsCsv(__dirname));
	} catch (err) {
		if (err.code === 'EACCES' || err.code === 'EPERM') {
			return res.status(503).json({
				error: `Cannot read render metrics CSV (permission denied). Path: ${getMetricsCsvPath(__dirname)}`,
			});
		}
		throw err;
	}
	if (!rows.length && !fs.existsSync(csvPath)) {
		return res.status(404).json({ error: 'No render metrics recorded yet. Run a local render first.' });
	}
	const content = rows.length ? `${header}\n${rows.join('\n')}\n` : `${header}\n`;
	res.setHeader('Content-Type', 'text/csv; charset=utf-8');
	res.setHeader('Content-Disposition', 'attachment; filename="render-results.csv"');
	res.send(content);
});

app.get('/api/render-metrics', (req, res) => {
	const limit = Math.min(parseInt(req.query.limit, 10) || 20, 200);
	const { header, rows } = readRenderMetricsCsv(__dirname);
	const recent = rows.slice(-limit).reverse();
	res.json({
		header: header.split(','),
		rows: recent.map((line) => line.split(',')),
		total: rows.length,
	});
});

// API: Download rendered video
app.get('/api/download-video', (req, res) => {
	const { module } = req.query;
	
	if (!module) {
		return res.status(400).json({ error: 'Module number is required' });
	}
	
	const course = req.query.course || 'default';
	const videoPath = path.join(__dirname, 'out', course, `module-${module}.mp4`);
	
	if (!fs.existsSync(videoPath)) {
		return res.status(404).json({ error: 'Video file not found. Please render it first.' });
	}
	
	res.download(videoPath, `module-${module}.mp4`, (err) => {
		if (err) {
			console.error('Download error:', err);
			res.status(500).json({ error: 'Failed to download video' });
		}
	});
});

// API: List rendered videos (for GUI on RunPod - browse/download from server)
app.get('/api/rendered-videos', (req, res) => {
	const course = req.query.course || 'default';
	const outDir = path.join(__dirname, 'out', course);
	const videos = [];
	if (fs.existsSync(outDir)) {
		const files = fs.readdirSync(outDir);
		for (const f of files) {
			if (f.endsWith('.mp4')) {
				const stat = fs.statSync(path.join(outDir, f));
				videos.push({
					name: f,
					url: `/out/${course}/${f}`,
					size: stat.size,
					mtime: stat.mtimeMs
				});
			}
		}
		videos.sort((a, b) => a.name.localeCompare(b.name));
	}
	res.json({ course, videos });
});

// API: Generate preview modules (fixed durations, no audio) and prepare for Remotion
// Lets user view segments in Remotion Studio before generating audio
app.post('/api/generate-preview-modules', async (req, res) => {
	try {
		const { course } = req.body;
		if (!course) {
			return res.status(400).json({
				error: 'Course is required',
				details: 'Select a video in the processing wizard before viewing segments in Remotion.'
			});
		}

		const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		if (!fs.existsSync(moduleContentPath)) {
			return res.status(400).json({
				error: 'No course content found',
				details: 'Save a plan and activate a course first. moduleContent.ts is missing.'
			});
		}

		ensureCourseActiveSync(course);
		clearRemotionWebpackCache();

		if (courseUsesSceneVisuals(course)) {
			stripMermaidFromSlideSplits(course);
			const moduleRange = getModuleRangeForCourse(course) || '1-12';
			console.log(`[generate-preview-modules] Scene course - generating from scene components (${moduleRange})`);
			runSceneModuleGeneration(course, moduleRange);
		} else {
			const command = `npx tsx scripts/generateModulesFromContent.ts all --preview`;
			console.log(`[generate-preview-modules] Slide course - preview mode: ${command}`);
			execSync(command, {
				cwd: __dirname,
				stdio: 'pipe',
				encoding: 'utf-8'
			});
		}

		const activeCourseId = getActiveCourseFromModuleContent();
		const studioResolution = await resolveRemotionStudioUrl({ timeoutMs: 2000 });
		const studioBase = studioResolution.reachable ? studioResolution.url : getConfiguredRemotionStudioUrl();
		let previewModule = 1;
		try {
			const coursesData = readCoursesJson();
			const mapped = coursesData.courseModuleMapping?.[course];
			if (Array.isArray(mapped) && mapped.length > 0) {
				previewModule = mapped[0];
			}
		} catch (e) { /* ignore */ }
		console.log('[generate-preview-modules] Preview modules generated successfully');
		res.json({
			success: true,
			message: courseUsesSceneVisuals(course)
				? `Scene modules ready for "${activeCourseId}". Start Remotion (npm start or docker compose --profile studio up -d remotion), then open module-${previewModule}.`
				: `Preview ready for "${activeCourseId}". Start Remotion (npm start or docker compose --profile studio up -d remotion), then open module-${previewModule}.`,
			courseId: activeCourseId,
			previewModule,
			visualMode: courseUsesSceneVisuals(course) ? 'scenes' : 'slides',
			requiresRemotionRestart: true,
			remotionStudioUrl: buildRemotionStudioOpenUrl(studioBase, previewModule, activeCourseId),
		});
	} catch (error) {
		console.error('[generate-preview-modules] Error:', error);
		const details = (error.stderr || error.stdout || '').toString();
		res.status(500).json({
			error: error.message || 'Failed to generate preview modules',
			details: details || undefined
		});
	}
});

// API: Render all modules (batch/overnight rendering)
app.post('/api/render-course', (req, res) => {
	const {
		modules,
		concurrency,
		scale,
		course,
		preset,
		force,
		costPerHour,
		instanceLabel,
	} = req.body;
	const optimalConcurrency = getOptimalRenderConcurrency(concurrency);
	const courseId = course || getActiveCourseFromModuleContent() || 'default';
	const batchPreset = preset || 'fast';
	const costPerHourUsd = costPerHour !== undefined && costPerHour !== null ? String(costPerHour) : '';
	const batchJobId = crypto.randomUUID();
	console.log(`[render-course] LOCAL BATCH RENDER - ${optimalConcurrency} threads job=${batchJobId}`);

	if (courseId !== 'default') {
		try {
			const activation = ensureCourseActiveSync(courseId);
			if (!activation.alreadyActive) {
				console.log(`[render-course] Auto-activated "${courseId}" before batch render`);
			}
		} catch (activateErr) {
			console.error('[render-course] Course activation failed:', activateErr.message);
			return res.status(400).json({
				error: 'Could not activate course for render',
				details: activateErr.message,
				hint: 'Open Processing Wizard, select this course, and click Finalize Video.',
			});
		}
	}

	let modulesToValidate = [];
	if (modules && Array.isArray(modules) && modules.length > 0) {
		modulesToValidate = modules.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
	} else if (courseId !== 'default') {
		try {
			const coursesPath = path.join(__dirname, 'courses.json');
			if (fs.existsSync(coursesPath)) {
				const data = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));
				const mapped = data.courseModuleMapping?.[courseId];
				if (Array.isArray(mapped) && mapped.length > 0) {
					modulesToValidate = mapped.map((n) => Number(n));
				} else {
					const courseEntry = data.courses?.find((c) => c.id === courseId);
					if (courseEntry?.moduleCount > 0) {
						modulesToValidate = Array.from(
							{ length: courseEntry.moduleCount },
							(_, i) => i + 1
						);
					}
				}
			}
		} catch (e) {
			console.warn('[render-course] Could not resolve module list for preflight:', e.message);
		}
	}

	if (courseId !== 'default' && modulesToValidate.length > 0) {
		const preflight = validateRenderAssets(courseId, modulesToValidate, __dirname);
		if (!preflight.ok) {
			console.error('[render-course] Asset preflight failed:', preflight.missing || preflight.error);
			return res.status(400).json({
				error: 'Course assets not ready for render',
				details: preflight.error || `Missing ${preflight.missing.length} asset(s) in public/`,
				missing: preflight.missing || [],
				hint: 'Run ./start.sh or Finalize Video to sync SVGs and timings before render.',
			});
		}
	} else if (courseId !== 'default') {
		try {
			syncCoursePublicAssets(courseId, __dirname);
		} catch (syncErr) {
			console.error('[render-course] Asset sync failed:', syncErr.message);
			return res.status(400).json({
				error: 'Course assets not ready for render',
				details: syncErr.message,
			});
		}
	}

	// Build command arguments
	let args = [];
	if (courseId) {
		args.push(`--course=${courseId}`);
	}
	if (force) {
		args.push('--force');
	}
	if (modules && Array.isArray(modules) && modules.length > 0) {
		args.push(`--modules=${modules.join(',')}`);
	}
	args.push(`--preset=${batchPreset}`);
	args.push(`--concurrency=${optimalConcurrency}`);
	if (scale && scale !== 1) {
		args.push(`--scale=${scale}`);
	}
	
	const scriptPath = path.join(__dirname, 'scripts', 'renderAllModules.ts');
	const command = `npx tsx "${scriptPath}" ${args.join(' ')}`;
	
	console.log(`[render-course] Starting batch render: ${command}`);
	
	// Set headers for streaming
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: 'Starting batch video render...' })}\n\n`);
	
	const childProcess = exec(command, { 
		cwd: __dirname, 
		maxBuffer: 50 * 1024 * 1024,
		timeout: 0
	});
	
	let currentModule = '';
	let totalModules = 0;
	let completedModules = 0;
	let currentModulePercent = 0;
	const moduleJobMeta = {};

	const recordModuleMetrics = (modNum, success, errorText, outputFileMb) => {
		const meta = moduleJobMeta[String(modNum)];
		const timer = meta?.timer || createJobTimer();
		persistRenderMetrics({
			jobId: meta?.jobId || `${batchJobId}-m${modNum}`,
			courseId,
			moduleNumber: modNum,
			instanceLabel,
			concurrency: optimalConcurrency,
			timer,
			costPerHourUsd,
			preset: batchPreset,
			success,
			outputFileMb,
			error: errorText || '',
		});
	};

	const resolveModuleOutputPath = (modNum) => {
		const suffix = batchPreset !== 'normal' && batchPreset !== 'max' ? `-${batchPreset}` : '';
		return path.join(__dirname, 'out', courseId, `module-${modNum}${suffix}.mp4`);
	};

	const sendBatchProgress = (percent, message, moduleNum) => {
		const clamped = Math.max(0, Math.min(100, Math.round(percent)));
		const modPct = Math.max(0, Math.min(100, Math.round(currentModulePercent)));
		res.write(`data: ${JSON.stringify({
			type: 'progress',
			module: moduleNum || currentModule,
			message,
			percent: clamped,
			modulePercent: modPct,
		})}\n\n`);
	};

	const computeOverallPercent = () => {
		if (totalModules <= 0) return 0;
		const moduleSlice = 100 / totalModules;
		return (completedModules * moduleSlice) + (currentModulePercent / 100 * moduleSlice);
	};

	childProcess.stdout.on('data', (data) => {
		const lines = data.toString().split(/\r|\n/);
		for (const line of lines) {
			if (!line.trim()) continue;

			if (line.startsWith('BATCH_INFO:')) {
				try {
					const info = JSON.parse(line.slice('BATCH_INFO:'.length));
					totalModules = info.total || 0;
					res.write(`data: ${JSON.stringify({
						type: 'batch_info',
						total: totalModules,
						modules: info.modules || [],
						skipExisting: info.skipExisting !== false,
					})}\n\n`);
				} catch (_) { /* ignore */ }
				continue;
			}

			// Parse module start
			if (line.includes('Rendering Module')) {
				const match = line.match(/Rendering Module (\d+)/);
				if (match) {
					currentModule = match[1];
					currentModulePercent = 0;
					moduleJobMeta[currentModule] = {
						jobId: `${batchJobId}-m${currentModule}`,
						timer: createJobTimer(),
						parseState: createRemotionParseState(),
					};
					res.write(`data: ${JSON.stringify({
						type: 'module_start',
						module: currentModule,
						message: `Starting Module ${currentModule}...`,
						modulePercent: 0,
					})}\n\n`);
					sendBatchProgress(
						computeOverallPercent(),
						`Module ${currentModule}: bundling (first minutes have little visible progress)`,
						currentModule,
					);
				}
				continue;
			}

			// Parse skipped module
			if (line.includes('skipped (output exists')) {
				const match = line.match(/Module (\d+) skipped/);
				if (match) {
					completedModules += 1;
					currentModulePercent = 100;
					recordModuleMetrics(match[1], true, 'skipped_existing', null);
                    res.write(`data: ${JSON.stringify({
						type: 'module_skipped',
						module: match[1],
						message: line.trim(),
						modulePercent: 100,
					})}\n\n`);
					sendBatchProgress(computeOverallPercent(), line.trim(), match[1]);
				}
				continue;
			}

			// Parse module complete
			if (line.includes('completed in')) {
				const match = line.match(/Module (\d+) completed in (\d+)s/);
				if (match) {
					completedModules += 1;
					currentModulePercent = 100;
					const modNum = match[1];
					const outPath = resolveModuleOutputPath(modNum);
					const fileSize = fs.existsSync(outPath) ? fs.statSync(outPath).size : 0;
					recordModuleMetrics(
						modNum,
						true,
						'',
						fileSize > 0 ? fileSize / 1024 / 1024 : null
					);
					res.write(`data: ${JSON.stringify({
						type: 'module_complete',
						module: match[1],
						duration: parseInt(match[2], 10),
						message: `Module ${match[1]} completed in ${match[2]}s`,
						modulePercent: 100,
					})}\n\n`);
					sendBatchProgress(computeOverallPercent(), `Module ${match[1]} complete`, match[1]);
				}
				continue;
			}

			// Remotion frame progress within current module
			const frameMatch = line.match(/Rendered\s+(\d+)\/(\d+)/i);
			if (frameMatch && currentModule) {
				const meta = moduleJobMeta[currentModule];
				if (meta) {
					meta.parseState = parseRemotionStdoutLine(line, meta.timer, meta.parseState);
				}
				const current = parseInt(frameMatch[1], 10);
				const total = parseInt(frameMatch[2], 10);
				currentModulePercent = total > 0 ? Math.round((current / total) * 100) : 0;
				sendBatchProgress(
					computeOverallPercent(),
					`Module ${currentModule}: rendering ${currentModulePercent}%`,
					currentModule,
				);
				continue;
			}

			const bundleMatch = line.match(/Bundling\s+(\d+)%/i);
			if (bundleMatch && currentModule) {
				const meta = moduleJobMeta[currentModule];
				if (meta) {
					meta.parseState = parseRemotionStdoutLine(line, meta.timer, meta.parseState);
				}
				currentModulePercent = Math.round(parseInt(bundleMatch[1], 10) * 0.15);
				sendBatchProgress(
					computeOverallPercent(),
					`Module ${currentModule}: bundling ${bundleMatch[1]}%`,
					currentModule,
				);
				continue;
			}

			const encodedMatch = line.match(/Encoded\s+(\d+)\/(\d+)/i);
			if (encodedMatch && currentModule) {
				const encCurrent = parseInt(encodedMatch[1], 10);
				const encTotal = parseInt(encodedMatch[2], 10);
				const encPct = encTotal > 0 ? Math.round((encCurrent / encTotal) * 100) : 0;
				currentModulePercent = 90 + Math.round(encPct * 0.1);
				sendBatchProgress(
					computeOverallPercent(),
					`Module ${currentModule}: encoding ${encPct}%`,
					currentModule,
				);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const lines = data.toString().split('\n');
		for (const line of lines) {
			const message = line.trim();
			if (!message) continue;
			if (message.includes('Symbol(') || message.includes('CONSOLE')) continue;

			console.error('[render-course] stderr:', message);

			const failedMatch = message.match(/Module (\d+) FAILED/i);
			if (failedMatch) {
				recordModuleMetrics(failedMatch[1], false, message, null);
				res.write(`data: ${JSON.stringify({
					type: 'module_failed',
					module: failedMatch[1],
					message,
				})}\n\n`);
				continue;
			}
			if (message.includes('Error:') || message.includes('Maximum for --concurrency')) {
				res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
			}
		}
	});
	
	childProcess.on('close', (code) => {
		res.write(`data: ${JSON.stringify({ 
			type: 'done', 
			success: code === 0,
			message: code === 0 ? 'Batch render complete!' : `Batch render failed with code ${code}`,
			metricsCsvUrl: '/api/render-metrics/download',
		})}\n\n`);
		res.end();
	});
	
	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
		res.end();
	});

	// Browser refresh closes the SSE stream; keep rendering on the server.
	req.on('close', () => {
		console.log('[render-course] Client disconnected — batch render continues in background');
	});
});

// API: Render on RunPod (ephemeral GPU/CPU pod)
app.post('/api/render-runpod', (req, res) => {
	const { modules, course, preset, useGpu } = req.body;
	console.log('[render-runpod] REMOTE RENDER - spawning RunPod GPU pod');
	let resolvedModules = modules && Array.isArray(modules) && modules.length > 0
		? modules
		: null;
	if (!resolvedModules && course) {
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${course}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					resolvedModules = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
				}
			}
		} catch (e) {
			console.error('[render-runpod] Error getting course modules:', e);
		}
	}

	let args = [];
	if (resolvedModules && resolvedModules.length > 0) {
		args.push(`--modules=${resolvedModules.join(',')}`);
	}
	if (preset) {
		args.push(`--preset=${preset}`);
	}

	const spawnEnv = { ...process.env };
	if (useGpu) {
		spawnEnv.RUNPOD_USE_GPU = 'true';
		spawnEnv.RUNPOD_MIN_VCPU = spawnEnv.RUNPOD_MIN_VCPU || '16';
		spawnEnv.RUNPOD_CONCURRENCY = spawnEnv.RUNPOD_CONCURRENCY || '28';
	} else {
		delete spawnEnv.RUNPOD_USE_GPU;
	}

	const scriptPath = path.join(__dirname, 'scripts', 'renderOnRunPod.ts');
	const command = `npx tsx "${scriptPath}" ${args.join(' ')}`;

	console.log('[render-runpod] Starting:', command, 'useGpu:', !!useGpu);

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');

	res.write(`data: ${JSON.stringify({ type: 'start', message: 'Starting RunPod render...' })}\n\n`);

	const childProcess = exec(command, {
		cwd: __dirname,
		maxBuffer: 50 * 1024 * 1024,
		timeout: 0,
		env: spawnEnv
	});

	let currentModule = '';

	function sendLine(line, isStderr = false) {
		if (!line.trim()) return;
		res.write(`data: ${JSON.stringify({ type: 'progress', message: line.trim(), isStderr })}\n\n`);

		const modStart = line.match(/Rendering Module (\d+)/);
		if (modStart) {
			currentModule = modStart[1];
			res.write(`data: ${JSON.stringify({ type: 'module_start', module: currentModule })}\n\n`);
		}
		const modComplete = line.match(/Module (\d+) completed in (\d+)s/);
		if (modComplete) {
			res.write(`data: ${JSON.stringify({ type: 'module_complete', module: modComplete[1], duration: parseInt(modComplete[2]) })}\n\n`);
		}
	}

	childProcess.stdout.on('data', (data) => {
		data.toString().split('\n').forEach(line => sendLine(line));
	});

	childProcess.stderr.on('data', (data) => {
		data.toString().split('\n').forEach(line => sendLine(line, true));
	});

	childProcess.on('close', (code) => {
		res.write(`data: ${JSON.stringify({
			type: 'done',
			success: code === 0,
			message: code === 0 ? 'RunPod render complete!' : `RunPod render failed with code ${code}`
		})}\n\n`);
		res.end();
	});

	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
		res.end();
	});
});

// API: Generate timings for single slide
app.post('/api/generate-timings-slide', (req, res) => {
	const { moduleNumber, slideName } = req.body;
	
	const parsedModuleNumber = parseModuleNumberParam(moduleNumber);
	if (parsedModuleNumber === null || !slideName) {
		return res.status(400).json({ error: 'Module number and slide name are required' });
	}
	
	const command = `npx tsx scripts/extractTimingsForSlide.ts ${parsedModuleNumber} ${slideName}`;
	
	// Set headers for streaming
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	const childProcess = exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 });
	
	let buffer = '';
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: `Extracting timings for ${slideName}...` })}\n\n`);
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Log all output for debugging
			console.log(`[extract-timings] ${line.trim()}`);
			
			if (line.includes('✅ Extracted') || line.includes('✓ Saved')) {
				res.write(`data: ${JSON.stringify({ type: 'complete', message: line.trim() })}\n\n`);
			} else if (line.includes('✗ Failed') || line.includes('⚠') || line.includes('Error')) {
				res.write(`data: ${JSON.stringify({ type: 'warning', message: line.trim() })}\n\n`);
			} else if (line.includes('Processing') || line.includes('Extracting')) {
				res.write(`data: ${JSON.stringify({ type: 'progress', message: line.trim() })}\n\n`);
			} else {
				// Send all other output as info
				res.write(`data: ${JSON.stringify({ type: 'info', message: line.trim() })}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const errorMsg = data.toString().trim();
		console.error(`[extract-timings stderr] ${errorMsg}`);
		res.write(`data: ${JSON.stringify({ type: 'error', message: errorMsg })}\n\n`);
	});
	
	childProcess.on('close', (code) => {
		if (code === 0) {
			const activeCourseId = getActiveCourseFromModuleContent();
			res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Syncing bullets and line highlights...' })}\n\n`);
			
			runPostExtractTimingsSync(activeCourseId, moduleNumber, (err) => {
				if (err) {
					console.error('Post-extract sync error:', err);
				}
				res.write(`data: ${JSON.stringify({ type: 'done', success: true, message: 'Timings, bullets, and line mappings synced!' })}\n\n`);
				res.end();
			});
		} else {
			res.write(`data: ${JSON.stringify({ type: 'done', success: false, message: `Process exited with code ${code}` })}\n\n`);
			res.end();
		}
	});
	
	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
		res.end();
	});
});

// API: Get detailed module status (for finalize button)
// Supports multi-audio code slides (scripts array -> -1, -2, -3 audio files)
app.get('/api/module-status', (req, res) => {
	const moduleNumber = parseModuleNumberParam(req.query.moduleNumber);
	const courseId = req.query.course || 'default';
	if (moduleNumber === null) {
		return res.status(400).json({ error: 'Module number is required' });
	}

	function getAudioItemsForModule(modules, modNum, cId) {
		const mod = modules.find(m => m.moduleNumber === modNum);
		if (!mod) return [];
		const items = [];
		for (const slide of mod.slides) {
			const isMulti = slide.type === 'code' && slide.scripts && slide.scripts.length > 1;
			if (isMulti) {
				for (let i = 0; i < slide.scripts.length; i++) {
					items.push({
						displayName: `${slide.name}-${i + 1}`,
						audioFileName: `module${modNum}-${slide.name}-${i + 1}`,
						audioKey: `${cId}/module${modNum}-${slide.name}-${i + 1}`,
						timingsKey: slide.name
					});
				}
			} else {
				items.push({
					displayName: slide.name,
					audioFileName: `module${modNum}-${slide.name}`,
					audioKey: `${cId}/module${modNum}-${slide.name}`,
					timingsKey: slide.name
				});
			}
		}
		return items;
	}

	try {
		const rootPath = path.join(__dirname, 'src', 'Root.tsx');
		const rootContent = fs.existsSync(rootPath) ? fs.readFileSync(rootPath, 'utf-8') : '';
		const contentJsonPath = path.join(__dirname, 'courses', courseId, 'content.json');
		let contentJson = null;
		if (fs.existsSync(contentJsonPath)) {
			try {
				contentJson = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
			} catch (e) { /* ignore */ }
		}
		const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const moduleContentText = fs.existsSync(moduleContentPath)
			? fs.readFileSync(moduleContentPath, 'utf-8')
			: '';
		const videosDir = path.join(__dirname, 'src', 'videos');
		const hasModuleFiles = isModuleGeneratedForCourse(courseId, moduleNumber, {
			moduleContentText,
			rootContent,
			contentJson,
			videosDir,
		});

		let audioItems = [];
		try {
			const { allModules } = require(path.join(__dirname, 'src', 'videos', 'moduleContent.ts'));
			audioItems = getAudioItemsForModule(allModules, moduleNumber, courseId);
		} catch (e) {
			const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
			const content = fs.readFileSync(contentPath, 'utf-8');
			const moduleMatch = content.match(new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`));
			if (moduleMatch) {
				const slidesContent = extractSlidesContent(moduleMatch[1]);
				const names = slidesContent ? extractSlideNames(slidesContent) : [];
				audioItems = names.map(name => ({
					displayName: name,
					audioFileName: `module${moduleNumber}-${name}`,
					audioKey: `${courseId}/module${moduleNumber}-${name}`,
					timingsKey: name
				}));
			}
		}

		const slideNames = [...new Set(audioItems.map(i => i.timingsKey))];
		const audioDir = path.join(__dirname, 'public', 'audio', courseId);
		const missingAudioFiles = [];
		const existingAudioFiles = [];
		audioItems.forEach(item => {
			const audioFile = path.join(audioDir, `${item.audioFileName}.wav`);
			if (fs.existsSync(audioFile) && fs.statSync(audioFile).size > 0) {
				existingAudioFiles.push(item.displayName);
			} else {
				missingAudioFiles.push(item.displayName);
			}
		});

		const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
		const missingAudioDurations = [];
		if (fs.existsSync(audioDurationPath)) {
			const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
			audioItems.forEach(item => {
				const keyPattern = new RegExp(`"${item.audioKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
				if (!keyPattern.test(audioDurationContent)) {
					missingAudioDurations.push(item.displayName);
				}
			});
		} else {
			missingAudioDurations.push(...audioItems.map(i => i.displayName));
		}

		const timingsJsonPath = path.join(__dirname, 'courses', courseId, 'timings', `module${moduleNumber}.json`);
		let hasAllTimings = false;
		const missingTimings = [];
		if (fs.existsSync(timingsJsonPath)) {
			try {
				const moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
				if (moduleTimings.slides) {
					slideNames.forEach(slideName => {
						const slideTimings = moduleTimings.slides[slideName];
						if (!slideTimings || !slideTimings.words || slideTimings.words.length === 0) {
							missingTimings.push(slideName);
						}
					});
					hasAllTimings = missingTimings.length === 0;
				} else {
					missingTimings.push(...slideNames);
				}
			} catch (e) {
				missingTimings.push(...slideNames);
			}
		} else {
			missingTimings.push(...slideNames);
		}

		const layoutPreview = hasModuleFiles;
		const basicPreview = layoutPreview && missingAudioFiles.length === 0 && missingAudioDurations.length === 0;
		const fullyAnimated = basicPreview && hasAllTimings;
		const animationStatus = fullyAnimated
			? 'fullyAnimated'
			: (basicPreview ? 'basicPreview' : (layoutPreview ? 'layoutPreview' : 'incomplete'));

		res.json({
			moduleNumber,
			hasModuleFiles,
			layoutPreview,
			missingAudioFiles,
			existingAudioFiles,
			missingAudioDurations,
			missingTimings,
			readyForRemotion: layoutPreview || basicPreview,
			animationStatus,
			canFinalize: fullyAnimated
		});
	} catch (error) {
		console.error('Error checking module status:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Diagnostic endpoint - check what's preventing Remotion from working
app.get('/api/diagnose', (req, res) => {
	try {
		const { moduleNumber, course } = req.query;
		const courseId = course || 'default';
		const parsedDiagnoseModule = parseModuleNumberParam(moduleNumber);
		const diagnostics = {
			moduleNumber: parsedDiagnoseModule !== null ? parsedDiagnoseModule : 'all',
			courseId: courseId,
			issues: [],
			warnings: [],
			success: []
		};

		// Check if module files exist and are valid
		if (isModuleNumberProvided(moduleNumber)) {
			const modNum = parseModuleNumberParam(moduleNumber);
			const moduleFile = path.join(__dirname, 'src', 'videos', `Module${modNum}.tsx`);
			const configFile = path.join(__dirname, 'src', 'videos', `Module${modNum}Config.ts`);
			
			if (!fs.existsSync(moduleFile)) {
				diagnostics.issues.push(`Module${modNum}.tsx does not exist`);
			} else {
				// Check for common syntax errors
				const content = fs.readFileSync(moduleFile, 'utf-8');
				if (content.includes('summarySlide') && !content.includes('const summarySlide')) {
					diagnostics.issues.push(`Module${modNum}.tsx references undefined 'summarySlide' variable`);
				}
				if (content.match(/const\s+[\w-]+-\w+\s*=/)) {
					diagnostics.issues.push(`Module${modNum}.tsx has invalid variable names with hyphens (e.g., 'slide-2Slide')`);
				}
				if (content.match(/audioFiles\.\w+-\w+/)) {
					diagnostics.issues.push(`Module${modNum}.tsx uses invalid property access (e.g., 'audioFiles.slide-2' should be 'audioFiles["slide-2"]')`);
				}
			}
			
			if (!fs.existsSync(configFile)) {
				diagnostics.issues.push(`Module${modNum}Config.ts does not exist`);
			}
			
			// Check if module is in Root.tsx
			const rootPath = path.join(__dirname, 'src', 'Root.tsx');
			if (fs.existsSync(rootPath)) {
				const rootContent = fs.readFileSync(rootPath, 'utf-8');
				if (!rootContent.includes(`Module${modNum}`)) {
					diagnostics.issues.push(`Module${modNum} is not registered in Root.tsx`);
				} else {
					diagnostics.success.push(`Module${modNum} is registered in Root.tsx`);
				}
			}
			
			// Check audio files and durations (use course-specific directory)
			const audioDir = path.join(__dirname, 'public', 'audio', courseId);
			const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
			let moduleMatch = null;
			if (fs.existsSync(contentPath)) {
				const content = fs.readFileSync(contentPath, 'utf-8');
				moduleMatch = content.match(new RegExp(`export const module${modNum}Content: ModuleContent = \\{([\\s\\S]*?)\\};`));
			}
			if (moduleMatch && moduleMatch[1]) {
				const slidesContent = moduleMatch[1];
				const nameMatches = slidesContent.match(/name:\s*"([^"]+)"/g) || [];
				const slideNames = nameMatches.map(m => m.match(/"([^"]+)"/)[1]);
				
				// Check audio files
				const missingAudio = [];
				slideNames.forEach(name => {
					const audioFile = path.join(audioDir, `module${modNum}-${name}.wav`);
					if (!fs.existsSync(audioFile) || (fs.existsSync(audioFile) && fs.statSync(audioFile).size === 0)) {
						missingAudio.push(name);
					}
				});
				
				// Check audio durations (with course prefix)
				const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
				const audioKeys = slideNames.map(name => `${courseId}/module${modNum}-${name}`);
				const missingDurations = [];
				
				if (fs.existsSync(audioDurationPath)) {
					const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
					audioKeys.forEach(key => {
						const keyPattern = new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
						if (!keyPattern.test(audioDurationContent)) {
							missingDurations.push(key);
						}
					});
				} else {
					// If file doesn't exist, all durations are missing
					audioKeys.forEach(key => missingDurations.push(key));
				}
				
				// Report issues
				if (missingAudio.length > 0) {
					diagnostics.issues.push(`Missing audio files: ${missingAudio.join(', ')}. Run "Generate Audio" step.`);
				}
				
				if (missingDurations.length > 0) {
					diagnostics.issues.push(`Missing audio durations: ${missingDurations.join(', ')}. Run "Measure Audio" step.`);
				}
				
				// Only report success if BOTH audio files AND durations exist
				if (missingAudio.length === 0 && missingDurations.length === 0) {
					diagnostics.success.push(`All audio files exist`);
					diagnostics.success.push(`All audio durations exist`);
				} else if (missingAudio.length === 0) {
					diagnostics.success.push(`All audio files exist`);
				}
				// Note: We don't report durations as existing if audio files are missing
				// The missing audio files issue is already reported above
			}
		} else {
			// Check Root.tsx
			const rootPath = path.join(__dirname, 'src', 'Root.tsx');
			if (fs.existsSync(rootPath)) {
				const rootContent = fs.readFileSync(rootPath, 'utf-8');
				// Check for syntax errors
				if (rootContent.includes('summarySlide')) {
					diagnostics.warnings.push('Root.tsx may reference undefined variables');
				}
			}
		}

		diagnostics.status = diagnostics.issues.length === 0 ? 'ok' : 'error';
		res.json(diagnostics);
	} catch (error) {
		res.status(500).json({ error: error.message, issues: ['Failed to run diagnostics'] });
	}
});

// Auth status and login
app.get('/api/auth/status', (req, res) => {
	res.json({
		authRequired: requiresAuth(),
		username: process.env.GUI_AUTH_USERNAME || 'admin',
	});
});

app.post('/api/auth/login', (req, res) => {
	if (!requiresAuth()) {
		return res.json({ ok: true, token: null, authRequired: false });
	}
	const { username, password } = req.body || {};
	const expectedUser = process.env.GUI_AUTH_USERNAME || 'admin';
	if (username === expectedUser && password === process.env.GUI_AUTH_PASSWORD) {
		return res.json({
			ok: true,
			token: getSessionSecret(),
			authRequired: true,
		});
	}
	res.status(401).json({ ok: false, error: 'Invalid credentials' });
});

// Host CPU info for render tuning
app.get('/api/system-info', async (req, res) => {
	const stack = await resolveDockerStackStatus({ timeoutMs: 3000 });
	const gentleResolution = { url: stack.gentle.url, tried: stack.gentle.candidates };
	const mfaResolution = stack.mfa;
	const studioResolution = stack.remotion;
	res.json({
		cpus: getCpuCount(),
		recommendedConcurrency: getOptimalRenderConcurrency(),
		renderRunpodEnabled: isRenderRunpodEnabled(),
		dockerEngineRunning: stack.dockerEngineRunning,
		dockerStackReady: stack.stackReady,
		dockerPreviewReady: stack.previewReady,
		dockerServices: stack,
		gentleUrl: stack.gentle.url || process.env.GENTLE_URL || 'http://localhost:8765',
		gentleUrlConfigured: process.env.GENTLE_URL || null,
		gentleUrlCandidates: stack.gentle.candidates,
		gentleUrlReachable: stack.gentle.reachable,
		gentleStartHint: stack.gentle.startHint,
		mfaAvailable: stack.mfa.available,
		mfaMode: stack.mfa.mode || null,
		mfaBin: stack.mfa.bin || null,
		mfaVersion: stack.mfa.version || null,
		mfaDictionary: stack.mfa.dictionary,
		mfaAcousticModel: stack.mfa.acousticModel,
		mfaError: stack.mfa.available ? null : stack.mfa.error,
		mfaStartHint: stack.mfa.startHint,
		remotionStudioUrl: stack.remotion.reachable ? stack.remotion.url : stack.remotion.configuredUrl,
		remotionStudioUrlConfigured: process.env.REMOTION_STUDIO_URL || null,
		remotionStudioUrlCandidates: stack.remotion.candidates,
		remotionStudioReachable: stack.remotion.reachable,
		remotionStudioStartHint: stack.remotion.startHint,
		remotionServiceUrl: process.env.REMOTION_URL || null,
		authRequired: requiresAuth(),
		cpuReserve: parseInt(process.env.REMOTION_CPU_RESERVE || '2', 10),
	});
});

// Health check - verify this is the GUI server, not Remotion
app.get('/api/health', (req, res) => {
	res.json({ service: 'skilleo-gui', port: PORT, remotionPort: 3000, authRequired: requiresAuth() });
});

// Serve GUI (SPA fallback - must be after all API routes)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'gui', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Skilleo AI GUI Server running on http://localhost:${PORT}`);
	console.log(`Remotion Studio should be on http://localhost:3000`);
}).on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`\nERROR: Port ${PORT} is already in use.`);
		console.error('Another app (often a second Remotion Studio) may be bound to 3001.');
		console.error('Stop it with: netstat -ano | findstr ":3001" then taskkill /PID <pid> /F');
		console.error('Then run: npm run gui\n');
	} else {
		console.error('GUI server failed to start:', err.message);
	}
	process.exit(1);
});
