/**
 * Remotion headless often ignores embedded SVG <style> blocks and may not
 * apply presentation attributes (fill=) reliably on text loaded via innerHTML.
 * Inline class rules and fill/stroke as element style attributes.
 */

type CssMap = Record<string, string>;

function parseEmbeddedSvgClassRules(svg: string): Record<string, CssMap> {
	const styleMatch = svg.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
	if (!styleMatch) return {};

	const rules: Record<string, CssMap> = {};
	const ruleRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g;
	let match: RegExpExecArray | null;

	while ((match = ruleRegex.exec(styleMatch[1])) !== null) {
		const className = match[1];
		const decls: CssMap = {};
		for (const part of match[2].split(';')) {
			const colon = part.indexOf(':');
			if (colon === -1) continue;
			const prop = part.slice(0, colon).trim();
			const val = part.slice(colon + 1).trim();
			if (prop && val) decls[prop] = val;
		}
		if (Object.keys(decls).length > 0) {
			rules[className] = decls;
		}
	}

	return rules;
}

function mergeCssDecls(existing: string, additions: CssMap): string {
	const map = new Map<string, string>();
	for (const part of existing.split(';')) {
		const colon = part.indexOf(':');
		if (colon === -1) continue;
		const prop = part.slice(0, colon).trim();
		const val = part.slice(colon + 1).trim();
		if (prop && val) map.set(prop, val);
	}
	for (const [prop, val] of Object.entries(additions)) {
		map.set(prop, val);
	}
	return Array.from(map.entries())
		.map(([prop, val]) => `${prop}: ${val}`)
		.join('; ');
}

function readAttr(attrs: string, name: string): string | undefined {
	const re = new RegExp(`\\b${name}=["']([^"']+)["']`, 'i');
	return re.exec(attrs)?.[1];
}

/** Remotion may not resolve url(#gradient) fills; use the gradient's end stop as a solid fallback. */
function resolveGradientFillUrls(svg: string): string {
	const gradientEndColor = new Map<string, string>();
	const gradientRegex =
		/<linearGradient\s+id=["']([^"']+)["'][\s\S]*?<\/linearGradient>/gi;
	let gradMatch: RegExpExecArray | null;

	while ((gradMatch = gradientRegex.exec(svg)) !== null) {
		const stops = [...gradMatch[0].matchAll(/stop-color=["']([^"']+)["']/gi)].map((m) => m[1]);
		if (stops.length > 0) {
			gradientEndColor.set(gradMatch[1], stops[stops.length - 1]);
		}
	}

	if (gradientEndColor.size === 0) return svg;

	return svg.replace(/fill=["']url\(#([^"']+)\)["']/gi, (full, id: string) => {
		const solid = gradientEndColor.get(id);
		return solid ? `fill="${solid}"` : full;
	});
}

const INLINE_TAGS = 'text|tspan|rect|path|circle|ellipse|polygon|line';

/** XML 1.0 allows only #x9, #xA, #xD among C0 controls; strip others (e.g. pasted 0x14). */
function stripInvalidXmlControlChars(svg: string): string {
	return svg.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

/** Remove SVG filters — they often break when the file is loaded via <img> in Remotion/Chromium. */
function stripSvgFilters(svg: string): string {
	let out = svg.replace(/\sfilter=["']url\([^"']+\)["']/gi, '');
	out = out.replace(/<filter[\s\S]*?<\/filter>/gi, '');
	return out;
}

export function prepareSvgForRemotion(svg: string): string {
	if (!svg?.trim()) return svg;

	let out = stripInvalidXmlControlChars(stripSvgFilters(resolveGradientFillUrls(svg)));
	const classRules = parseEmbeddedSvgClassRules(out);

	out = out.replace(
		new RegExp(`<(${INLINE_TAGS})\\b([^>]*?)(\\/?)>`, 'gi'),
		(full, tag: string, rawAttrs: string, selfClose: string) => {
			let attrs = rawAttrs.trim();
			if (attrs.endsWith('/')) {
				attrs = attrs.slice(0, -1).trim();
			}

			const classes = readAttr(attrs, 'class')?.trim().split(/\s+/) ?? [];
			const styleProps: CssMap = {};

			for (const cls of classes) {
				const rules = classRules[cls];
				if (!rules) continue;
				for (const [prop, val] of Object.entries(rules)) {
					if (prop === 'filter' && val.startsWith('url(')) {
						continue;
					}
					styleProps[prop] = val;
				}
			}

			const fill = readAttr(attrs, 'fill');
			if (fill) styleProps.fill = fill;

			const stroke = readAttr(attrs, 'stroke');
			if (stroke) styleProps.stroke = stroke;

			const strokeWidth = readAttr(attrs, 'stroke-width');
			if (strokeWidth) styleProps['stroke-width'] = strokeWidth;

			const strokeOpacity = readAttr(attrs, 'stroke-opacity');
			if (strokeOpacity) styleProps['stroke-opacity'] = strokeOpacity;

			const opacity = readAttr(attrs, 'opacity');
			if (opacity) styleProps.opacity = opacity;

			const fontSize = readAttr(attrs, 'font-size');
			if (fontSize) styleProps['font-size'] = fontSize;

			const fontWeight = readAttr(attrs, 'font-weight');
			if (fontWeight) styleProps['font-weight'] = fontWeight;

			const fontFamily = readAttr(attrs, 'font-family');
			if (fontFamily) styleProps['font-family'] = fontFamily;

			if (Object.keys(styleProps).length === 0) {
				return full;
			}

			const existingStyle = readAttr(attrs, 'style') ?? '';
			const merged = mergeCssDecls(existingStyle, styleProps);
			let newAttrs = attrs.replace(/\bstyle=["'][^"']*["']/gi, '').trim();
			newAttrs = `${newAttrs} style="${merged}"`.replace(/\s+/g, ' ').trim();
			const close = selfClose === '/' ? ' />' : '>';
			return `<${tag} ${newAttrs}${close}`;
		},
	);

	out = out.replace(/<svg(\s[^>]*?)>/i, (_, attrs: string) => {
		const existingStyle = readAttr(attrs, 'style') ?? '';
		const merged = mergeCssDecls(existingStyle, { color: '#0f172a' });
		let newAttrs = attrs.replace(/\bstyle=["'][^"']*["']/gi, '').trim();
		newAttrs = `${newAttrs} style="${merged}"`.trim();
		return `<svg ${newAttrs}>`;
	});

	return out;
}
