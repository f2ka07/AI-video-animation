// Git deploy policy: all active (non-archived) courses + their audio are tracked in git.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MARKERS = {
	courses: {
		start: '# --- deploy: courses (managed by courseDeployPolicy) ---',
		end: '# --- end deploy: courses ---',
	},
	audio: {
		start: '# --- deploy: audio (managed by courseDeployPolicy) ---',
		end: '# --- end deploy: audio ---',
	},
	timings: {
		start: '# --- deploy: timings (managed by courseDeployPolicy) ---',
		end: '# --- end deploy: timings ---',
	},
};

function getRepoRoot(fromDir) {
	return path.join(fromDir || __dirname, '..', '..');
}

function readFileSafe(filePath) {
	if (!fs.existsSync(filePath)) {
		return '';
	}
	return fs.readFileSync(filePath, 'utf-8');
}

function readCoursesJson(repoRoot) {
	const coursesJsonPath = path.join(repoRoot, 'courses.json');
	if (!fs.existsSync(coursesJsonPath)) {
		return { courses: [] };
	}
	try {
		return JSON.parse(fs.readFileSync(coursesJsonPath, 'utf-8'));
	} catch (error) {
		console.warn('[courseDeployPolicy] Could not read courses.json:', error.message);
		return { courses: [] };
	}
}

function getDeployableCourseIds(repoRoot) {
	const data = readCoursesJson(repoRoot);
	return (data.courses || [])
		.filter((course) => course.status === 'active' && course.id)
		.map((course) => course.id)
		.sort();
}

function getActivatedCourseId(repoRoot) {
	const moduleContentPath = path.join(repoRoot, 'src', 'videos', 'moduleContent.ts');
	if (!fs.existsSync(moduleContentPath)) {
		return null;
	}
	try {
		const content = fs.readFileSync(moduleContentPath, 'utf-8');
		const headerMatch = content.match(/\/\/\s*Course ID:\s*([a-zA-Z0-9_-]+)/);
		if (headerMatch) {
			return headerMatch[1];
		}
		const courseIdMatch = content.match(/courseId:\s*["']([a-zA-Z0-9_-]+)["']/);
		if (courseIdMatch) {
			return courseIdMatch[1];
		}
	} catch (error) {
		console.warn('[courseDeployPolicy] Could not read moduleContent.ts:', error.message);
	}
	return null;
}

function replaceSection(content, marker, lines) {
	const start = marker.start;
	const end = marker.end;
	const block = [start, ...lines, end].join('\n');
	const pattern = new RegExp(
		`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`,
		'm'
	);
	if (pattern.test(content)) {
		return content.replace(pattern, block);
	}
	return `${content.trimEnd()}\n\n${block}\n`;
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildCoursesGitignoreLines(deployableCourseIds) {
	const lines = [
		'courses/*',
		'!courses/.gitkeep',
	];
	for (const courseId of deployableCourseIds) {
		lines.push(`!courses/${courseId}/`);
	}
	return lines;
}

function buildAudioGitignoreLines(deployableCourseIds) {
	const lines = [
		'public/audio/*',
		'!public/audio/whoosh.wav',
	];
	for (const courseId of deployableCourseIds) {
		lines.push(`!public/audio/${courseId}/`);
	}
	return lines;
}

function buildTimingsGitignoreLines() {
	return ['public/timings/'];
}

function applyGitignorePolicy(repoRoot, deployableCourseIds) {
	const gitignorePath = path.join(repoRoot, '.gitignore');
	if (!fs.existsSync(gitignorePath)) {
		// Docker images omit .gitignore (.dockerignore); runtime activate must not fail.
		return { skipped: true, reason: 'no-gitignore' };
	}
	let content = readFileSafe(gitignorePath);
	if (!content) {
		return { skipped: true, reason: 'empty-gitignore' };
	}

	content = replaceSection(content, MARKERS.courses, buildCoursesGitignoreLines(deployableCourseIds));
	content = replaceSection(content, MARKERS.audio, buildAudioGitignoreLines(deployableCourseIds));
	content = replaceSection(content, MARKERS.timings, buildTimingsGitignoreLines());

	fs.writeFileSync(gitignorePath, content.endsWith('\n') ? content : `${content}\n`);

	const coursesKeepPath = path.join(repoRoot, 'courses', '.gitkeep');
	if (!fs.existsSync(coursesKeepPath)) {
		fs.mkdirSync(path.dirname(coursesKeepPath), { recursive: true });
		fs.writeFileSync(coursesKeepPath, '');
	}
	return { skipped: false };
}

function writeDeployManifest(repoRoot, deployableCourseIds, activatedCourseId) {
	const manifestDir = path.join(repoRoot, 'workspace');
	const manifestPath = path.join(manifestDir, 'deploy-manifest.json');
	if (!fs.existsSync(manifestDir)) {
		fs.mkdirSync(manifestDir, { recursive: true });
	}
	const manifest = {
		activatedCourseId,
		deployableCourseIds,
		updatedAt: new Date().toISOString(),
		policy: 'all-active-courses-deployed',
	};
	fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function listTrackedCourseDirs(repoRoot) {
	try {
		const output = execSync('git ls-files courses/', {
			cwd: repoRoot,
			encoding: 'utf-8',
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		const dirs = new Set();
		for (const line of output.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed.startsWith('courses/')) {
				continue;
			}
			const parts = trimmed.split('/');
			if (parts.length >= 2 && parts[1] && parts[1] !== '.gitkeep') {
				dirs.add(parts[1]);
			}
		}
		return [...dirs].sort();
	} catch {
		return [];
	}
}

function listTrackedAudioCourseDirs(repoRoot) {
	try {
		const output = execSync('git ls-files public/audio/', {
			cwd: repoRoot,
			encoding: 'utf-8',
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		const dirs = new Set();
		for (const line of output.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed.startsWith('public/audio/')) {
				continue;
			}
			const parts = trimmed.split('/');
			if (parts.length >= 3 && parts[2] && parts[2] !== 'whoosh.wav') {
				dirs.add(parts[2]);
			}
		}
		return [...dirs].sort();
	} catch {
		return [];
	}
}

function pruneGitCourseIndex(repoRoot, deployableCourseIds) {
	if (!fs.existsSync(path.join(repoRoot, '.git'))) {
		return { pruned: [], skipped: true };
	}

	const deployableSet = new Set(deployableCourseIds);
	const pruned = [];

	const trackedCourses = listTrackedCourseDirs(repoRoot);
	for (const courseId of trackedCourses) {
		if (deployableSet.has(courseId)) {
			continue;
		}
		try {
			execSync(`git rm -r --cached --ignore-unmatch "courses/${courseId}"`, {
				cwd: repoRoot,
				stdio: 'pipe',
			});
			pruned.push(`courses/${courseId}`);
		} catch (error) {
			console.warn(`[courseDeployPolicy] git rm --cached failed for ${courseId}:`, error.message);
		}
	}

	const trackedAudio = listTrackedAudioCourseDirs(repoRoot);
	for (const courseId of trackedAudio) {
		if (deployableSet.has(courseId)) {
			continue;
		}
		try {
			execSync(`git rm -r --cached --ignore-unmatch "public/audio/${courseId}"`, {
				cwd: repoRoot,
				stdio: 'pipe',
			});
			pruned.push(`public/audio/${courseId}`);
		} catch (error) {
			console.warn(`[courseDeployPolicy] git rm --cached failed for public/audio/${courseId}:`, error.message);
		}
	}

	const timingFiles = execSync('git ls-files public/timings/', {
		cwd: repoRoot,
		encoding: 'utf-8',
		stdio: ['ignore', 'pipe', 'ignore'],
	}).split('\n').map((line) => line.trim()).filter(Boolean);

	for (const file of timingFiles) {
		try {
			execSync(`git rm --cached --ignore-unmatch "${file}"`, {
				cwd: repoRoot,
				stdio: 'pipe',
			});
			pruned.push(file);
		} catch (error) {
			console.warn(`[courseDeployPolicy] git rm --cached failed for ${file}:`, error.message);
		}
	}

	return { pruned, skipped: false };
}

function removeDirIfExists(dirPath) {
	if (fs.existsSync(dirPath)) {
		fs.rmSync(dirPath, { recursive: true, force: true });
		return true;
	}
	return false;
}

function detachCourseRuntime(repoRoot, courseId) {
	const removed = [];
	if (removeDirIfExists(path.join(repoRoot, 'public', 'audio', courseId))) {
		removed.push(`public/audio/${courseId}`);
	}
	if (removeDirIfExists(path.join(repoRoot, 'public', 'assets', courseId))) {
		removed.push(`public/assets/${courseId}`);
	}
	return removed;
}

function clearPublicTimings(repoRoot) {
	const timingsDir = path.join(repoRoot, 'public', 'timings');
	if (!fs.existsSync(timingsDir)) {
		return 0;
	}
	const files = fs.readdirSync(timingsDir).filter((file) => file.endsWith('.json'));
	for (const file of files) {
		fs.unlinkSync(path.join(timingsDir, file));
	}
	return files.length;
}

function clearActivatedModuleContent(repoRoot) {
	const moduleContentPath = path.join(repoRoot, 'src', 'videos', 'moduleContent.ts');
	const stub = `// No activated course (archived or detached from deploy)
// Activate a course to regenerate this file.

export interface SlideContent {
	name: string;
	type: "title" | "content-two-card" | "content-single" | "code" | "comparison";
	script?: string;
	title?: string;
	subtitle?: string;
	points?: string[];
}

export interface ModuleContent {
	moduleNumber: number;
	courseId: string;
	title: string;
	subtitle: string;
	slides: SlideContent[];
}

export const allModules: ModuleContent[] = [];
`;
	fs.writeFileSync(moduleContentPath, stub);
}

function applyCourseDeployPolicy(repoRoot, options = {}) {
	const root = repoRoot || getRepoRoot(__dirname);
	const deployableCourseIds = options.deployableCourseIds !== undefined
		? [...options.deployableCourseIds].sort()
		: getDeployableCourseIds(root);
	const activatedCourseId = options.activatedCourseId !== undefined
		? options.activatedCourseId
		: getActivatedCourseId(root);

	const gitignoreResult = applyGitignorePolicy(root, deployableCourseIds);
	if (gitignoreResult.skipped) {
		console.log(
			`[courseDeployPolicy] Skipped .gitignore update (${gitignoreResult.reason}) — normal in Docker/runtime`
		);
	} else {
		writeDeployManifest(root, deployableCourseIds, activatedCourseId);
	}

	let pruneResult = { pruned: [], skipped: true };
	if (options.pruneGit) {
		pruneResult = pruneGitCourseIndex(root, deployableCourseIds);
	}

	return {
		activatedCourseId,
		deployableCourseIds,
		gitignoreSkipped: !!gitignoreResult.skipped,
		pruneResult,
	};
}

function detachArchivedCourse(repoRoot, courseId, options = {}) {
	const root = repoRoot || getRepoRoot(__dirname);
	const wasActivated = getActivatedCourseId(root) === courseId;
	const runtimeRemoved = detachCourseRuntime(root, courseId);

	if (wasActivated) {
		clearPublicTimings(root);
		if (options.clearModuleContent !== false) {
			clearActivatedModuleContent(root);
		}
	}

	const policy = applyCourseDeployPolicy(root, {
		pruneGit: !!options.pruneGit,
	});

	return {
		courseId,
		wasActivated,
		runtimeRemoved,
		policy,
	};
}

function setsEqual(a, b) {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

function verifyDeployPolicy(repoRoot) {
	const root = repoRoot || getRepoRoot(__dirname);
	const activatedCourseId = getActivatedCourseId(root);
	const deployableCourseIds = getDeployableCourseIds(root);
	const trackedCourses = listTrackedCourseDirs(root);
	const trackedAudio = listTrackedAudioCourseDirs(repoRoot);
	const errors = [];

	if (!setsEqual(trackedCourses, deployableCourseIds)) {
		const missing = deployableCourseIds.filter((id) => !trackedCourses.includes(id));
		const extra = trackedCourses.filter((id) => !deployableCourseIds.includes(id));
		if (missing.length > 0) {
			errors.push(`Active courses not in git index (git add required): ${missing.join(', ')}`);
		}
		if (extra.length > 0) {
			errors.push(`Git tracks non-active courses (run sync:deploy-policy --prune-git): ${extra.join(', ')}`);
		}
	}

	if (!setsEqual(trackedAudio, deployableCourseIds)) {
		const missingAudio = deployableCourseIds.filter((id) => !trackedAudio.includes(id));
		const extraAudio = trackedAudio.filter((id) => !deployableCourseIds.includes(id));
		if (missingAudio.length > 0) {
			errors.push(`Active course audio not in git index (git add required): ${missingAudio.join(', ')}`);
		}
		if (extraAudio.length > 0) {
			errors.push(`Git tracks audio for non-active courses: ${extraAudio.join(', ')}`);
		}
	}

	const gitignore = readFileSafe(path.join(root, '.gitignore'));
	if (!gitignore.includes(MARKERS.courses.start)) {
		errors.push('Missing managed courses section in .gitignore');
	}
	for (const courseId of deployableCourseIds) {
		if (!gitignore.includes(`!courses/${courseId}/`)) {
			errors.push(`.gitignore does not whitelist courses/${courseId}/`);
		}
		if (!gitignore.includes(`!public/audio/${courseId}/`)) {
			errors.push(`.gitignore does not whitelist public/audio/${courseId}/`);
		}
	}

	if (activatedCourseId && !deployableCourseIds.includes(activatedCourseId)) {
		errors.push(
			`Activated course "${activatedCourseId}" is not active in courses.json — activate or archive it`
		);
	}

	return {
		ok: errors.length === 0,
		activatedCourseId,
		deployableCourseIds,
		trackedCourses,
		trackedAudio,
		errors,
	};
}

module.exports = {
	MARKERS,
	getDeployableCourseIds,
	getActivatedCourseId,
	applyCourseDeployPolicy,
	detachArchivedCourse,
	detachCourseRuntime,
	clearActivatedModuleContent,
	clearPublicTimings,
	verifyDeployPolicy,
	pruneGitCourseIndex,
};
