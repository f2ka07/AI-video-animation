// Git deploy policy: only the activated course is tracked; archived courses are detached.
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

function buildCoursesGitignoreLines(activatedCourseId) {
	const lines = [
		'courses/*',
		'!courses/.gitkeep',
	];
	if (activatedCourseId) {
		lines.push(`!courses/${activatedCourseId}/`);
	}
	return lines;
}

function buildAudioGitignoreLines(activatedCourseId) {
	const lines = [
		'public/audio/*',
		'!public/audio/whoosh.wav',
	];
	if (activatedCourseId) {
		lines.push(`!public/audio/${activatedCourseId}/`);
	}
	return lines;
}

function buildTimingsGitignoreLines() {
	return ['public/timings/'];
}

function applyGitignorePolicy(repoRoot, activatedCourseId) {
	const gitignorePath = path.join(repoRoot, '.gitignore');
	let content = readFileSafe(gitignorePath);
	if (!content) {
		throw new Error('.gitignore not found');
	}

	content = replaceSection(content, MARKERS.courses, buildCoursesGitignoreLines(activatedCourseId));
	content = replaceSection(content, MARKERS.audio, buildAudioGitignoreLines(activatedCourseId));
	content = replaceSection(content, MARKERS.timings, buildTimingsGitignoreLines());

	fs.writeFileSync(gitignorePath, content.endsWith('\n') ? content : `${content}\n`);

	const coursesKeepPath = path.join(repoRoot, 'courses', '.gitkeep');
	if (!fs.existsSync(coursesKeepPath)) {
		fs.mkdirSync(path.dirname(coursesKeepPath), { recursive: true });
		fs.writeFileSync(coursesKeepPath, '');
	}
}

function writeDeployManifest(repoRoot, activatedCourseId) {
	const manifestDir = path.join(repoRoot, 'workspace');
	const manifestPath = path.join(manifestDir, 'deploy-manifest.json');
	if (!fs.existsSync(manifestDir)) {
		fs.mkdirSync(manifestDir, { recursive: true });
	}
	const manifest = {
		activatedCourseId,
		updatedAt: new Date().toISOString(),
		policy: 'only-activated-course-deployed',
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
		return [...dirs];
	} catch {
		return [];
	}
}

function pruneGitCourseIndex(repoRoot, activatedCourseId) {
	if (!fs.existsSync(path.join(repoRoot, '.git'))) {
		return { pruned: [], skipped: true };
	}

	const tracked = listTrackedCourseDirs(repoRoot);
	const pruned = [];
	for (const courseId of tracked) {
		if (courseId === activatedCourseId) {
			continue;
		}
		try {
			execSync(`git rm -r --cached --ignore-unmatch "courses/${courseId}"`, {
				cwd: repoRoot,
				stdio: 'pipe',
			});
			pruned.push(courseId);
		} catch (error) {
			console.warn(`[courseDeployPolicy] git rm --cached failed for ${courseId}:`, error.message);
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
	const activatedCourseId = options.activatedCourseId !== undefined
		? options.activatedCourseId
		: getActivatedCourseId(root);

	applyGitignorePolicy(root, activatedCourseId);
	writeDeployManifest(root, activatedCourseId);

	let pruneResult = { pruned: [], skipped: true };
	if (options.pruneGit) {
		pruneResult = pruneGitCourseIndex(root, activatedCourseId);
	}

	return {
		activatedCourseId,
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
		activatedCourseId: wasActivated ? null : getActivatedCourseId(root),
		pruneGit: !!options.pruneGit,
	});

	return {
		courseId,
		wasActivated,
		runtimeRemoved,
		policy,
	};
}

function verifyDeployPolicy(repoRoot) {
	const root = repoRoot || getRepoRoot(__dirname);
	const activatedCourseId = getActivatedCourseId(root);
	const tracked = listTrackedCourseDirs(root);
	const errors = [];

	if (!activatedCourseId) {
		if (tracked.length > 0) {
			errors.push(`No activated course but git still tracks: ${tracked.join(', ')}`);
		}
	} else if (tracked.length !== 1 || tracked[0] !== activatedCourseId) {
		errors.push(
			`Activated course is "${activatedCourseId}" but git tracks: ${tracked.join(', ') || '(none)'}`
		);
	}

	const gitignore = readFileSafe(path.join(root, '.gitignore'));
	if (!gitignore.includes(MARKERS.courses.start)) {
		errors.push('Missing managed courses section in .gitignore');
	}
	if (activatedCourseId && !gitignore.includes(`!courses/${activatedCourseId}/`)) {
		errors.push(`.gitignore does not whitelist courses/${activatedCourseId}/`);
	}

	return {
		ok: errors.length === 0,
		activatedCourseId,
		trackedCourses: tracked,
		errors,
	};
}

module.exports = {
	MARKERS,
	getActivatedCourseId,
	applyCourseDeployPolicy,
	detachArchivedCourse,
	detachCourseRuntime,
	clearActivatedModuleContent,
	clearPublicTimings,
	verifyDeployPolicy,
	pruneGitCourseIndex,
};
