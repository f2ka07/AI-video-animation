#!/usr/bin/env node
// Sync git deploy policy: only the activated course is deployable.
//
// Usage:
//   node scripts/syncCourseDeployPolicy.js
//   node scripts/syncCourseDeployPolicy.js --prune-git
//   node scripts/syncCourseDeployPolicy.js --check
//   node scripts/syncCourseDeployPolicy.js --course=my-course-id --prune-git

const path = require('path');
const {
	getActivatedCourseId,
	applyCourseDeployPolicy,
	verifyDeployPolicy,
} = require('./lib/courseDeployPolicy.js');

const repoRoot = path.join(__dirname, '..');
const args = process.argv.slice(2);
const pruneGit = args.includes('--prune-git');
const checkOnly = args.includes('--check');
const courseArg = args.find((arg) => arg.startsWith('--course='));
const courseOverride = courseArg ? courseArg.split('=')[1] : null;

if (checkOnly) {
	const result = verifyDeployPolicy(repoRoot);
	if (result.ok) {
		console.log(`Deploy policy OK (activated: ${result.activatedCourseId || 'none'})`);
		process.exit(0);
	}
	console.error('Deploy policy check failed:');
	for (const error of result.errors) {
		console.error(`  - ${error}`);
	}
	process.exit(1);
}

const activatedCourseId = courseOverride || getActivatedCourseId(repoRoot);
const result = applyCourseDeployPolicy(repoRoot, {
	activatedCourseId,
	pruneGit,
});

console.log('Course deploy policy updated');
console.log(`  Activated course: ${result.activatedCourseId || '(none)'}`);
if (result.pruneResult.pruned.length > 0) {
	console.log(`  Removed from git index: ${result.pruneResult.pruned.join(', ')}`);
} else if (pruneGit && !result.pruneResult.skipped) {
	console.log('  Git index already clean');
}
