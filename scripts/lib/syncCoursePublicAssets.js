// Copy course timings + diagram SVGs into public/ for Remotion staticFile().
// Remotion resolves staticFile("assets/...") -> public/assets/... (NOT an absolute URL).
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyTimingsToPublic(courseId, repoRoot) {
	const timingsDir = path.join(repoRoot, 'courses', courseId, 'timings');
	const publicTimingsDir = path.join(repoRoot, 'public', 'timings');

	if (!fs.existsSync(timingsDir)) {
		return { copied: 0, warning: `No timings dir: courses/${courseId}/timings/` };
	}

	if (!fs.existsSync(publicTimingsDir)) {
		fs.mkdirSync(publicTimingsDir, { recursive: true });
	}

	for (const file of fs.readdirSync(publicTimingsDir)) {
		if (file.endsWith('.json')) {
			fs.unlinkSync(path.join(publicTimingsDir, file));
		}
	}

	let copied = 0;
	for (const file of fs.readdirSync(timingsDir)) {
		if (!file.endsWith('.json')) continue;
		fs.copyFileSync(path.join(timingsDir, file), path.join(publicTimingsDir, file));
		copied++;
	}
	return { copied };
}

function copySvgsToPublic(courseId, repoRoot) {
	const scriptPath = path.join(repoRoot, 'scripts', 'copySvgsToPublic.ts');
	if (!fs.existsSync(scriptPath)) {
		throw new Error('copySvgsToPublic.ts not found');
	}
	execSync(`npx tsx "${scriptPath}" ${courseId}`, {
		cwd: repoRoot,
		stdio: 'pipe',
		encoding: 'utf-8',
	});
}

function countSvgs(courseId, repoRoot) {
	const assetsDir = path.join(repoRoot, 'public', 'assets', courseId);
	if (!fs.existsSync(assetsDir)) return 0;
	let count = 0;
	const walk = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (entry.name.endsWith('.svg')) count++;
		}
	};
	walk(assetsDir);
	return count;
}

/**
 * Sync everything Remotion needs from courses/{id}/ into public/.
 * Must run before render — public/assets and public/timings are not in the Docker image.
 */
function syncCoursePublicAssets(courseId, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	if (!courseId) {
		throw new Error('courseId is required for syncCoursePublicAssets');
	}

	const courseDir = path.join(root, 'courses', courseId);
	if (!fs.existsSync(courseDir)) {
		throw new Error(`Course not found: courses/${courseId}/`);
	}

	console.log(`[syncCoursePublicAssets] Syncing public assets for ${courseId}...`);

	const timingsResult = copyTimingsToPublic(courseId, root);
	if (timingsResult.warning) {
		console.warn(`[syncCoursePublicAssets] ${timingsResult.warning}`);
	} else {
		console.log(`[syncCoursePublicAssets] Copied ${timingsResult.copied} timing file(s) -> public/timings/`);
	}

	copySvgsToPublic(courseId, root);

	const svgCount = countSvgs(courseId, root);
	if (svgCount === 0) {
		throw new Error(
			`No SVG files in public/assets/${courseId}/ after sync. ` +
			`Check courses/${courseId}/course/diagrams/svg/ exists.`
		);
	}

	console.log(`[syncCoursePublicAssets] ${svgCount} SVG(s) ready at public/assets/${courseId}/`);
	return { courseId, timingsCopied: timingsResult.copied || 0, svgCount };
}

function verifySampleAsset(courseId, repoRoot, relativePath) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const fullPath = path.join(root, 'public', relativePath);
	return fs.existsSync(fullPath);
}

module.exports = {
	syncCoursePublicAssets,
	copyTimingsToPublic,
	countSvgs,
	verifySampleAsset,
};
