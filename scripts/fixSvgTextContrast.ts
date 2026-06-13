/**
 * Fix diagram SVG text contrast using text position vs rect/circle fills.
 * Run: npx tsx scripts/fixSvgTextContrast.ts agentic-ai-for-beginners
 */
import * as fs from 'fs';
import * as path from 'path';

const courseId = process.argv[2] ?? 'agentic-ai-for-beginners';
const svgRoot = path.join('courses', courseId, 'course', 'diagrams', 'svg');

type Shape = { x: number; y: number; w: number; h: number; fill: string };

function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace('#', '').slice(0, 6);
	return [
		parseInt(h.slice(0, 2), 16),
		parseInt(h.slice(2, 4), 16),
		parseInt(h.slice(4, 6), 16),
	];
}

function relativeLuminance(hex: string): number {
	const [r, g, b] = hexToRgb(hex).map((c) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function saturation(hex: string): number {
	const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	if (max === 0) return 0;
	return (max - min) / max;
}

function isLightBackground(fill: string): boolean {
	if (fill === 'none' || fill === 'transparent') return true;
	const f = fill.toLowerCase();
	if (/f59e0b|fbbf24|eab308|facc15|fde047|fcd34d|fef3c7|fed7aa/.test(f)) {
		return true;
	}
	const lum = relativeLuminance(fill);
	if (lum > 0.58) return true;
	if (lum < 0.22) return false;
	// Mid luminance: pale tints are light; saturated hues are treated as dark panels
	return saturation(fill) < 0.28;
}

function bodyTextForDarkFill(fill: string): string {
	const f = fill.toLowerCase();
	if (f.includes('3b82f6') || f.includes('2563eb') || f.includes('1d4ed8') || f.includes('06b6d4') || f.includes('0891b2')) {
		return '#dbeafe';
	}
	if (f.includes('8b5cf6') || f.includes('7c3aed') || f.includes('6d28d9')) {
		return '#ede9fe';
	}
	if (f.includes('10b981') || f.includes('059669') || f.includes('047857')) {
		return '#d1fae5';
	}
	if (f.includes('ef4444') || f.includes('dc2626') || f.includes('b91c1c')) {
		return '#fecaca';
	}
	if (f.includes('64748b') || f.includes('475569') || f.includes('334155')) {
		return '#e2e8f0';
	}
	if (f.includes('f59e0b') || f.includes('d97706') || f.includes('ea580c') || f.includes('b45309')) {
		return '#ffedd5';
	}
	return '#e2e8f0';
}

function titleTextForLightFill(fill: string): string {
	const f = fill.toLowerCase();
	if (f.includes('dbeafe') || f.includes('eff6ff')) return '#1e3a8a';
	if (f.includes('ede9fe') || f.includes('f5f3ff')) return '#5b21b6';
	if (f.includes('d1fae5') || f.includes('ecfdf5')) return '#047857';
	if (f.includes('fef3c7') || f.includes('fff7ed')) return '#78350f';
	if (f.includes('fecaca') || f.includes('fee2e2')) return '#991b1b';
	if (f.includes('fed7aa')) return '#9a3412';
	if (f.includes('f1f5f9') || f.includes('e2e8f0')) return '#0f172a';
	return '#0f172a';
}

function textColorForBackground(fill: string, isBold: boolean): string {
	if (isLightBackground(fill)) {
		return isBold ? titleTextForLightFill(fill) : '#334155';
	}
	return isBold ? '#ffffff' : bodyTextForDarkFill(fill);
}

function parseNum(v: string | undefined, fallback: number): number {
	return v !== undefined ? parseFloat(v) : fallback;
}

function extractShapes(svg: string): Shape[] {
	const shapes: Shape[] = [];

	const rectRe = /<rect\s+([^>]*?)(?:\/>|>)/gi;
	let m: RegExpExecArray | null;
	while ((m = rectRe.exec(svg)) !== null) {
		const attrs = m[1];
		const fill = attrs.match(/fill="(#[0-9a-fA-F]{3,8})"/)?.[1];
		if (!fill || fill.toLowerCase() === '#f8fafc') continue;
		shapes.push({
			x: parseNum(attrs.match(/\bx="([^"]+)"/)?.[1], 0),
			y: parseNum(attrs.match(/\by="([^"]+)"/)?.[1], 0),
			w: parseNum(attrs.match(/\bwidth="([^"]+)"/)?.[1], 0),
			h: parseNum(attrs.match(/\bheight="([^"]+)"/)?.[1], 0),
			fill,
		});
	}

	const circleRe = /<circle\s+([^>]*?)(?:\/>|>)/gi;
	while ((m = circleRe.exec(svg)) !== null) {
		const attrs = m[1];
		const fill = attrs.match(/fill="(#[0-9a-fA-F]{3,8})"/)?.[1];
		if (!fill || fill === 'none') continue;
		const cx = parseNum(attrs.match(/\bcx="([^"]+)"/)?.[1], 0);
		const cy = parseNum(attrs.match(/\bcy="([^"]+)"/)?.[1], 0);
		const r = parseNum(attrs.match(/\br="([^"]+)"/)?.[1], 0);
		shapes.push({ x: cx - r, y: cy - r, w: r * 2, h: r * 2, fill });
	}

	return shapes;
}

function shapeAtPoint(shapes: Shape[], x: number, y: number): Shape | null {
	const hits = shapes.filter((s) => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h);
	if (hits.length === 0) return null;
	// Prefer darkest fill when shapes stack (card header over card body)
	return hits.sort((a, b) => relativeLuminance(a.fill) - relativeLuminance(b.fill))[0];
}

function fixSvgContent(content: string): string {
	const shapes = extractShapes(content);

	return content.replace(/<text\s+([^>]*?)>([^<]*)<\/text>/g, (full, attrs: string, text: string) => {
		if (!text.trim()) return full;

		const x = parseNum(attrs.match(/\bx="([^"]+)"/)?.[1], NaN);
		const y = parseNum(attrs.match(/\by="([^"]+)"/)?.[1], NaN);
		if (Number.isNaN(x) || Number.isNaN(y)) return full;

		const shape = shapeAtPoint(shapes, x, y);
		if (!shape) return full;

		const isBold = /font-weight="(?:600|700|800)"/.test(attrs);
		const newFill = textColorForBackground(shape.fill, isBold);
		const updatedAttrs = /fill="[^"]*"/.test(attrs)
			? attrs.replace(/fill="[^"]*"/, `fill="${newFill}"`)
			: `${attrs} fill="${newFill}"`;

		return `<text ${updatedAttrs}>${text}</text>`;
	});
}

function walk(dir: string): string[] {
	const out: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(p));
		else if (entry.name.endsWith('.svg')) out.push(p);
	}
	return out;
}

const files = walk(svgRoot);
let changed = 0;
for (const file of files) {
	const raw = fs.readFileSync(file, 'utf8');
	const fixed = fixSvgContent(raw);
	if (fixed !== raw) {
		fs.writeFileSync(file, fixed, 'utf8');
		changed++;
		console.log(`  fixed ${path.relative(svgRoot, file)}`);
	}
}
console.log(`\nDone: ${changed} of ${files.length} SVG(s) updated.`);
