// Preflight: verify diagram SVGs and animation specs exist in public/ before render.
const fs = require('fs');
const path = require('path');
const { syncCoursePublicAssets } = require('./syncCoursePublicAssets.js');
const { allSlidesHaveWordTimings, getModuleTimingCoverage } = require('./timingCoverage.js');

function moduleFolder(moduleNumber) {
	return `module${String(moduleNumber).padStart(2, '0')}`;
}

function extractAssetPathsFromScene(filePath) {
	if (!fs.existsSync(filePath)) {
		return [];
	}
	const content = fs.readFileSync(filePath, 'utf-8');
	const paths = [];
	const patterns = [
		/svgPath="([^"]+)"/g,
		/animationSpecPath="([^"]+)"/g,
	];
	for (const pattern of patterns) {
		let match;
		while ((match = pattern.exec(content)) !== null) {
			paths.push(match[1]);
		}
	}
	return paths;
}

function collectContentJsonAssetPaths(courseId, moduleNumbers, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const contentPath = path.join(root, 'courses', courseId, 'content.json');
	if (!fs.existsSync(contentPath)) {
		return [];
	}

	let plan;
	try {
		plan = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
	} catch {
		return [];
	}

	const moduleSet = new Set(moduleNumbers.map((n) => Number(n)));
	const assetPaths = new Set();

	for (const mod of plan.modules || []) {
		if (!moduleSet.has(Number(mod.moduleNumber))) continue;
		for (const slide of mod.slides || []) {
			if (!slide.imageSrc || typeof slide.imageSrc !== 'string') continue;
			const normalized = slide.imageSrc.replace(/^\/+/, '');
			assetPaths.add(normalized);
			if (normalized.endsWith('.svg')) {
				assetPaths.add(normalized.replace(/\.svg$/, '.animation.json'));
			}
		}
	}

	return [...assetPaths];
}

function collectSceneAssetPaths(courseId, moduleNumbers, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const scenesBase = path.join(
		root,
		'courses',
		courseId,
		'course',
		'remotion',
		'scenes'
	);
	const assetPaths = new Set();

	for (const moduleNumber of moduleNumbers) {
		const folder = moduleFolder(moduleNumber);
		const prefix = `Module${String(moduleNumber).padStart(2, '0')}`;
		for (const diagramIndex of [1, 2, 3]) {
			const sceneFile = path.join(
				scenesBase,
				folder,
				`${prefix}Diagram${diagramIndex}.tsx`
			);
			for (const assetPath of extractAssetPathsFromScene(sceneFile)) {
				assetPaths.add(assetPath);
			}
		}
	}

	return [...assetPaths];
}

function verifyPublicAssets(assetPaths, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const missing = [];

	for (const assetPath of assetPaths) {
		const normalized = assetPath.replace(/^\/+/, '');
		const fullPath = path.join(root, 'public', normalized);
		if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size === 0) {
			missing.push(normalized);
		}
	}

	return missing;
}

/**
 * Sync course assets then verify all diagram SVGs/specs referenced by scenes exist in public/.
 * @param {string} courseId
 * @param {number[]} moduleNumbers - modules to render
 * @param {string} repoRoot
 * @returns {{ ok: boolean, missing: string[], svgCount?: number, syncWarning?: string }}
 */
function validateRenderAssets(courseId, moduleNumbers, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');

	if (!courseId || courseId === 'default') {
		return { ok: true, missing: [] };
	}

	let syncResult;
	try {
		syncResult = syncCoursePublicAssets(courseId, root);
	} catch (err) {
		return { ok: false, missing: [], error: err.message };
	}

	const scenePaths = collectSceneAssetPaths(courseId, moduleNumbers, root);
	const contentPaths = collectContentJsonAssetPaths(courseId, moduleNumbers, root);
	const assetPaths = [...new Set([...scenePaths, ...contentPaths])];
	const missing = verifyPublicAssets(assetPaths, root);

	// Slide-based courses: require at least synced SVGs even when no scene .tsx refs exist
	if (assetPaths.length === 0 && (syncResult?.svgCount || 0) === 0) {
		return {
			ok: false,
			missing: [],
			error: `No diagram assets found for ${courseId}. Run Finalize Video to sync SVGs.`,
			svgCount: syncResult?.svgCount,
		};
	}

	return {
		ok: missing.length === 0,
		missing,
		assetCount: assetPaths.length,
		svgCount: syncResult?.svgCount,
	};
}

module.exports = {
	validateRenderAssets,
	collectSceneAssetPaths,
	collectContentJsonAssetPaths,
	verifyPublicAssets,
	extractAssetPathsFromScene,
};
