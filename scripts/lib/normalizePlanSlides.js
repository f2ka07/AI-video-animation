/**
 * Normalize AI planner output into valid slide records for moduleContent.ts / TTS.
 * Fixes common planner mistakes: content instead of script, missing name, invalid type.
 */

const VALID_SLIDE_TYPES = new Set([
	'title',
	'content-two-card',
	'content-single',
	'code',
	'code-diagram',
	'comparison',
	'bullets-code',
	'sequential-bullet',
	'story-beat',
	'mermaid',
]);

const MARKETING_TYPE_MAP = {
	hook: 'title',
	problem: 'content-two-card',
	definition: 'content-two-card',
	architecture: 'content-two-card',
	curriculum: 'content-two-card',
	audience: 'content-two-card',
	outcomes: 'content-two-card',
	'enroll cta': 'title',
	'enroll-cta': 'title',
	cta: 'title',
};

function slugify(value) {
	return (
		String(value || 'slide')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 36) || 'slide'
	);
}

function pickScript(slide) {
	const candidates = [slide.script, slide.content, slide.text, slide.narration, slide.body];
	for (const c of candidates) {
		if (typeof c === 'string' && c.trim()) return c.trim();
	}
	if (Array.isArray(slide.scripts) && slide.scripts.length > 0) {
		return slide.scripts.map((s) => String(s).trim()).filter(Boolean).join(' ');
	}
	if (typeof slide.title === 'string' && slide.title.trim()) return slide.title.trim();
	return '';
}

function normalizeSlideType(rawType, slideIndex, moduleNumber) {
	const key = String(rawType || '').trim();
	if (VALID_SLIDE_TYPES.has(key)) return key;
	const mapped = MARKETING_TYPE_MAP[key.toLowerCase()];
	if (mapped) return mapped;
	if (slideIndex === 0) return 'title';
	if (moduleNumber === 3 && key.toLowerCase().includes('cta')) return 'title';
	return 'content-two-card';
}

/** Drop or fix visibleLineRange so small code blocks are never truncated. */
function normalizeCodeSlideVisibleRange(slide) {
	if ((slide.type !== 'code' && slide.type !== 'code-diagram') || !slide.code) return;
	const lineCount = String(slide.code).trim().split('\n').length;
	if (lineCount < 1) return;

	const range = slide.visibleLineRange;
	if (!Array.isArray(range) || range.length !== 2) {
		delete slide.visibleLineRange;
		return;
	}

	const start = Math.max(1, Math.min(Number(range[0]) || 1, lineCount));
	const end = Math.max(start, Math.min(Number(range[1]) || lineCount, lineCount));

	// Full snippet or small block: omit visibleLineRange (AnimatedCodeSlide shows all lines).
	if (end >= lineCount || lineCount <= 12) {
		delete slide.visibleLineRange;
		return;
	}

	slide.visibleLineRange = [start, end];
}

/**
 * @param {object} plan - course plan with modules[].slides[]
 * @returns {object} same plan, mutated in place
 */
function normalizePlanSlides(plan) {
	if (!plan?.modules?.length) return plan;

	for (const mod of plan.modules) {
		if (!Array.isArray(mod.slides)) mod.slides = [];
		const usedNames = new Set();

		mod.slides.forEach((slide, idx) => {
			if (!slide || typeof slide !== 'object') {
				mod.slides[idx] = {
					name: `module-${mod.moduleNumber}-slide-${idx + 1}`,
					type: 'content-two-card',
					script: '',
					title: `Slide ${idx + 1}`,
				};
				return;
			}

			slide.script = pickScript(slide);
			slide.type = normalizeSlideType(slide.type, idx, mod.moduleNumber);

			if (!slide.name || !String(slide.name).trim() || slide.name === 'undefined') {
				const typeSlug = slugify(slide.type);
				let base = `module-${mod.moduleNumber}-${typeSlug}-${idx + 1}`;
				let suffix = 2;
				while (usedNames.has(base)) {
					base = `module-${mod.moduleNumber}-${typeSlug}-${idx + 1}-${suffix++}`;
				}
				slide.name = base;
			}
			usedNames.add(slide.name);

			if (!slide.title?.trim() && slide.script) {
				const firstSentence = slide.script.split(/[.!?]/)[0]?.trim();
				slide.title = (firstSentence || slide.script).slice(0, 80);
			}

			normalizeCodeSlideVisibleRange(slide);

			// Drop planner-only fields so content.json stays canonical
			delete slide.content;
			delete slide.text;
			delete slide.narration;
			delete slide.body;
		});
	}

	return plan;
}

module.exports = { normalizePlanSlides, normalizeCodeSlideVisibleRange, pickScript, normalizeSlideType };
