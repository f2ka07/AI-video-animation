// Per-slide / per-module word timing coverage for GUI status panels.
const fs = require('fs');
const path = require('path');

function slideNamesForModule(contentJson, moduleNumber) {
	if (!contentJson?.modules) return [];
	const mod = contentJson.modules.find((m) => m.moduleNumber === moduleNumber);
	if (!mod?.slides?.length) return [];
	return mod.slides.map((s) => s.name).filter(Boolean);
}

function slideHasWordTimings(moduleTimings, slideName) {
	const slideTimings = moduleTimings?.slides?.[slideName];
	return Boolean(slideTimings?.words?.length > 0);
}

function getModuleTimingCoverage(courseId, moduleNumber, slideNames, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const timingsJsonPath = path.join(root, 'courses', courseId, 'timings', `module${moduleNumber}.json`);
	const result = {
		moduleNumber,
		timingsFileExists: false,
		timingSlidesComplete: 0,
		timingSlidesTotal: slideNames.length,
		missingTimingSlides: [],
		timingsExtracted: false,
	};

	if (slideNames.length === 0) {
		result.timingsExtracted = false;
		return result;
	}

	if (!fs.existsSync(timingsJsonPath)) {
		result.missingTimingSlides = [...slideNames];
		return result;
	}

	result.timingsFileExists = true;
	let moduleTimings;
	try {
		moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
	} catch {
		result.missingTimingSlides = [...slideNames];
		return result;
	}

	for (const slideName of slideNames) {
		if (slideHasWordTimings(moduleTimings, slideName)) {
			result.timingSlidesComplete++;
		} else {
			result.missingTimingSlides.push(slideName);
		}
	}

	result.timingsExtracted =
		result.timingSlidesComplete === slideNames.length && slideNames.length > 0;
	return result;
}

function getCourseTimingCoverage(courseId, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const contentJsonPath = path.join(root, 'courses', courseId, 'content.json');
	if (!fs.existsSync(contentJsonPath)) {
		return {
			courseId,
			found: false,
			modules: [],
			summary: {
				modulesComplete: 0,
				modulesTotal: 0,
				slidesComplete: 0,
				slidesTotal: 0,
				missingModules: [],
			},
		};
	}

	let contentJson;
	try {
		contentJson = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
	} catch {
		return {
			courseId,
			found: false,
			modules: [],
			summary: {
				modulesComplete: 0,
				modulesTotal: 0,
				slidesComplete: 0,
				slidesTotal: 0,
				missingModules: [],
			},
		};
	}

	const modules = (contentJson.modules || []).map((mod) => {
		const slideNames = slideNamesForModule(contentJson, mod.moduleNumber);
		const coverage = getModuleTimingCoverage(courseId, mod.moduleNumber, slideNames, root);
		return {
			moduleNumber: mod.moduleNumber,
			title: mod.title || `Module ${mod.moduleNumber}`,
			...coverage,
		};
	});

	const slidesComplete = modules.reduce((n, m) => n + m.timingSlidesComplete, 0);
	const slidesTotal = modules.reduce((n, m) => n + m.timingSlidesTotal, 0);
	const modulesComplete = modules.filter((m) => m.timingsExtracted).length;
	const missingModules = modules
		.filter((m) => !m.timingsExtracted)
		.map((m) => ({
			moduleNumber: m.moduleNumber,
			title: m.title,
			missingCount: m.missingTimingSlides.length,
			missingTimingSlides: m.missingTimingSlides,
			timingsFileExists: m.timingsFileExists,
		}));

	return {
		courseId,
		found: true,
		courseName: contentJson.courseName || courseId,
		modules,
		summary: {
			modulesComplete,
			modulesTotal: modules.length,
			slidesComplete,
			slidesTotal,
			missingModules,
			fullyComplete: modules.length > 0 && modulesComplete === modules.length,
		},
	};
}

function allSlidesHaveWordTimings(moduleTimings, slideNames) {
	if (!moduleTimings?.slides || slideNames.length === 0) return false;
	return slideNames.every((slideName) => slideHasWordTimings(moduleTimings, slideName));
}

module.exports = {
	slideNamesForModule,
	slideHasWordTimings,
	getModuleTimingCoverage,
	getCourseTimingCoverage,
	allSlidesHaveWordTimings,
};
