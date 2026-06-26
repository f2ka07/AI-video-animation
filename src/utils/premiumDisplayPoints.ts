// Converts raw JSON points into premium slide-native display bullets

const FILLER_PATTERNS = [
	/^pause\.?\s*/i,
	/^you have seen\b/i,
	/^this module\b/i,
	/^welcome to the\b/i,
	/^next we\b/i,
	/^module \d+ maps to\b/i,
	/^exam objective\b/i,
];

const TRAILING_FRAGMENTS = new Set([
	"network", "exam", "module", "git", "yaml", "ansible", "never", "two", "point",
	"changes", "you", "the", "and", "or", "dot", "ce",
]);

const INCOMPLETE_ENDINGS = new Set([
	"the", "to", "when", "that", "and", "or", "for", "in", "at", "with", "from",
	"into", "a", "an", "is", "are", "was", "were", "it", "if", "as", "on",
]);

export interface PremiumBulletOptions {
	script?: string;
	keyPhrases?: string[];
	slideType?: string;
	beat?: string;
	maxBullets?: number;
	allowLabDense?: boolean;
}

export interface PointCardGroup {
	title: string;
	subPoints?: string[];
}

function normalizeWhitespace(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}

function capitalizeFirst(text: string): string {
	if (!text) return text;
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function wordCount(text: string): number {
	return text.split(/\s+/).filter(Boolean).length;
}

function stripFiller(text: string, slideType?: string, beat?: string): string {
	let t = normalizeWhitespace(text);
	for (const pat of FILLER_PATTERNS) {
		t = t.replace(pat, "").trim();
	}
	if (slideType === "story-beat" && beat === "recap") {
		t = t.replace(/^pause\.?\s*/i, "").trim();
	}
	return t;
}

function trimToWordRange(text: string, minWords = 4, maxWords = 9): string {
	const words = text.split(/\s+/).filter(Boolean);
	if (words.length <= maxWords) {
		while (words.length > 1 && INCOMPLETE_ENDINGS.has(words[words.length - 1].toLowerCase())) {
			words.pop();
		}
		return words.join(" ");
	}
	let trimmed = words.slice(0, maxWords).join(" ");
	while (trimmed.split(/\s+/).length > minWords) {
		const last = trimmed.split(/\s+/).pop()?.toLowerCase() ?? "";
		if (!INCOMPLETE_ENDINGS.has(last) && !TRAILING_FRAGMENTS.has(last)) break;
		trimmed = trimmed.split(/\s+/).slice(0, -1).join(" ");
	}
	return trimmed;
}

export function cleanDisplayBullet(text: string, slideType?: string, beat?: string): string {
	let t = stripFiller(text, slideType, beat);
	t = t.replace(/\s*[-—]\s*/g, " — ").replace(/\.\.\./g, "").trim();
	t = t.replace(/\bgit\s+add\b/gi, "git add").replace(/\bgit\s+commit\b/gi, "git commit");
	if (wordCount(t) > 9) {
		t = trimToWordRange(t, 4, 9);
	}
	if (t.length > 0 && t.length < 80) {
		t = capitalizeFirst(t);
	}
	return t;
}

function dedupeBullets(bullets: string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const b of bullets) {
		const key = b.toLowerCase().replace(/[^a-z0-9]/g, "");
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(b);
	}
	return out;
}

function extractFromScript(script: string, maxBullets: number): string[] {
	const sentences = script.match(/[^.!?]+[.!?]+/g) || [script];
	const bullets: string[] = [];
	for (const s of sentences) {
		const cleaned = cleanDisplayBullet(s);
		if (cleaned.length < 12 || wordCount(cleaned) < 3) continue;
		bullets.push(trimToWordRange(cleaned, 4, 9));
		if (bullets.length >= maxBullets) break;
	}
	return bullets;
}

function isWeakBullet(text: string): boolean {
	const w = wordCount(text);
	if (w < 2) return true;
	if (w <= 3 && text.length < 15) return true;
	if (TRAILING_FRAGMENTS.has(text.split(/\s+/).pop()?.toLowerCase() ?? "")) return true;
	if (text.length > 70) return true;
	return false;
}

export function toPremiumBullets(
	input: string[] | undefined,
	options: PremiumBulletOptions = {}
): string[] {
	const maxBullets = options.maxBullets ?? (options.allowLabDense ? 4 : 3);
	const slideType = options.slideType;
	const beat = options.beat;

	let candidates = (input ?? [])
		.map((p) => cleanDisplayBullet(p, slideType, beat))
		.filter((p) => p.length >= 8);

	candidates = dedupeBullets(candidates);

	const weakCount = candidates.filter(isWeakBullet).length;
	if (candidates.length === 0 || weakCount > candidates.length / 2) {
		const fromPhrases = (options.keyPhrases ?? [])
			.map((p) => cleanDisplayBullet(p, slideType, beat))
			.filter((p) => p.length >= 8);
		if (fromPhrases.length >= 2) {
			candidates = dedupeBullets([...candidates.filter((c) => !isWeakBullet(c)), ...fromPhrases]);
		}
	}

	if (candidates.length < 2 && options.script) {
		const fromScript = extractFromScript(options.script, maxBullets);
		candidates = dedupeBullets([...candidates, ...fromScript]);
	}

	candidates = candidates
		.map((p) => trimToWordRange(p, 3, 9))
		.filter((p) => p.length >= 8);

	return dedupeBullets(candidates).slice(0, maxBullets);
}

export function toPremiumComparisonItems(
	left: string[],
	right: string[]
): { leftItems: string[]; rightItems: string[] } {
	const cleanSide = (items: string[]) =>
		dedupeBullets(
			items
				.map((p) => cleanDisplayBullet(p))
				.map((p) => trimToWordRange(p, 3, 7))
				.filter((p) => p.length >= 6)
		).slice(0, 3);

	return {
		leftItems: cleanSide(left),
		rightItems: cleanSide(right),
	};
}

export function needsGroupedCards(points: string[]): boolean {
	if (points.length > 3) return true;
	return points.some((p) => p.length > 55);
}

export function groupPointsIntoCards(points: string[]): PointCardGroup[] {
	const cleaned = points.map((p) => cleanDisplayBullet(p)).filter((p) => p.length >= 6);
	if (cleaned.length <= 3) {
		return cleaned.map((title) => ({ title }));
	}
	const groups: PointCardGroup[] = [];
	const chunkSize = Math.ceil(cleaned.length / 2);
	for (let i = 0; i < cleaned.length; i += chunkSize) {
		const chunk = cleaned.slice(i, i + chunkSize);
		if (chunk.length === 1) {
			groups.push({ title: chunk[0] });
		} else {
			groups.push({ title: chunk[0], subPoints: chunk.slice(1) });
		}
	}
	return groups.slice(0, 3);
}
