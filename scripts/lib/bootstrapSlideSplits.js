// Create slide-splits.json from content.json + audio durations when missing.
const fs = require('fs');
const path = require('path');

function bootstrapSlideSplits(courseId, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const courseDir = path.join(root, 'courses', courseId);
	const splitsPath = path.join(courseDir, 'slide-splits.json');
	const contentPath = path.join(courseDir, 'content.json');

	if (!fs.existsSync(contentPath)) {
		return { created: false, reason: 'content.json missing' };
	}
	if (fs.existsSync(splitsPath)) {
		return { created: false, reason: 'already exists' };
	}

	const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
	const audioDurationPath = path.join(root, 'src', 'utils', 'audioDuration.ts');
	const audioContent = fs.existsSync(audioDurationPath)
		? fs.readFileSync(audioDurationPath, 'utf-8')
		: '';

	const splits = {
		_comment:
			'Auto-bootstrapped from content + audio durations. Run derive-boundaries-from-script after timings.',
	};

	for (const mod of content.modules || []) {
		for (const slide of mod.slides || []) {
			if (
				slide.type !== 'content-single' &&
				slide.type !== 'content-two-card' &&
				slide.type !== 'story-beat'
			) {
				continue;
			}
			const key = `${courseId}/module${mod.moduleNumber}-${slide.name}`;
			const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const match = audioContent.match(new RegExp(`"${escaped}"\\s*:\\s*([\\d.]+)`));
			const dur = match ? parseFloat(match[1]) : 60;
			const pointCount = Math.max(2, slide.points?.length || 3);
			const splitAt = [];
			for (let i = 1; i < pointCount; i++) {
				splitAt.push(Math.round((dur * (i / pointCount)) * 100) / 100);
			}
			splits[slide.name] = { splitAt };
		}
	}

	fs.writeFileSync(splitsPath, JSON.stringify(splits, null, 2), 'utf-8');
	return { created: true, slides: Object.keys(splits).length - 1 };
}

module.exports = { bootstrapSlideSplits };
