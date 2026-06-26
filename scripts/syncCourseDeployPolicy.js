#!/usr/bin/env node
// Sync git deploy policy: all active (non-archived) courses + audio are deployable.
//
// Usage:
//   node scripts/syncCourseDeployPolicy.js
//   node scripts/syncCourseDeployPolicy.js --prune-git
//   node scripts/syncCourseDeployPolicy.js --check

const path = require('path');
const {
	getDeployableCourseIds,
	applyCourseDeployPolicy,
	verifyDeployPolicy,
} = require('./lib/courseDeployPolicy.js');

const repoRoot = path.join(__dirname, '..');
const args = process.argv.slice(2);
const pruneGit = args.includes('--prune-git');
const checkOnly = args.includes('--check');

if (checkOnly) {
	const result = verifyDeployPolicy(repoRoot);
	if (result.ok) {
		console.log(`Deploy policy OK (${result.deployableCourseIds.length} active course(s))`);
		console.log(`  Deployable: ${result.deployableCourseIds.join(', ')}`);
		if (result.activatedCourseId) {
			console.log(`  Remotion activated: ${result.activatedCourseId}`);
		}
		process.exit(0);
	}
	console.error('Deploy policy check failed:');
	for (const error of result.errors) {
		console.error(`  - ${error}`);
	}
	process.exit(1);
}

const result = applyCourseDeployPolicy(repoRoot, { pruneGit });

console.log('Course deploy policy updated');
console.log(`  Deployable courses: ${result.deployableCourseIds.join(', ') || '(none)'}`);
if (result.activatedCourseId) {
	console.log(`  Remotion activated: ${result.activatedCourseId}`);
}
if (result.pruneResult.pruned.length > 0) {
	console.log(`  Removed from git index: ${result.pruneResult.pruned.join(', ')}`);
} else if (pruneGit && !result.pruneResult.skipped) {
	console.log('  Git index already clean');
}
console.log('  Next: git add courses/ public/audio/ for active courses, then commit');
