// Visual-only diagram panel for the right side of slides (no title/bullet duplication)

const FONT = "Inter,Segoe UI,Arial,sans-serif";

export interface VisualPanelOptions {
	ariaLabel: string;
	visualContent: string;
}

/** Square panel sized for SvgDiagramFrame — no slide title or bullet text. */
export function buildVisualPanelSvg(opts: VisualPanelOptions): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 640" role="img" aria-label="${escapeAttr(opts.ariaLabel)}">
  <rect width="720" height="640" fill="#0b1f33"/>
  <circle cx="620" cy="80" r="120" fill="#049FD9" opacity="0.07"/>
  <circle cx="90" cy="560" r="130" fill="#6CC04A" opacity="0.06"/>
  <g id="viz-main">
    <rect x="24" y="24" width="672" height="592" rx="24" fill="#0b1728" stroke="#203a56" stroke-width="1.5"/>
    ${opts.visualContent}
  </g>
</svg>`;
}

export function g(id: string, transform: string, inner: string): string {
	return `<g id="${id}" transform="${transform}">${inner}</g>`;
}

export function nodeCircle(
	id: string,
	cx: number,
	cy: number,
	r: number,
	stroke: string,
	fill: string,
	iconPath: string,
	label: string
): string {
	return `<g id="${id}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    <path d="${iconPath}" fill="none" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" transform="translate(${cx - 20} ${cy - 20})"/>
    <text x="${cx}" y="${cy + r + 22}" fill="#f8fafc" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">${escapeXml(label)}</text>
  </g>`;
}

export function connector(id: string, x1: number, y1: number, x2: number, y2: number, dashed = false): string {
	const dash = dashed ? ' stroke-dasharray="6 8"' : "";
	return `<line id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#049FD9" stroke-width="3" stroke-linecap="round"${dash}/>`;
}

export function deviceBox(x: number, y: number, label: string, accent: string): string {
	return `<g>
    <rect x="${x}" y="${y}" width="56" height="40" rx="8" fill="#081827" stroke="${accent}" stroke-width="2"/>
    <path d="M${x + 14} ${y + 28}h28M${x + 28} ${y + 14}v28" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
    <text x="${x + 28}" y="${y + 58}" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">${escapeXml(label)}</text>
  </g>`;
}

export function caption(id: string, x: number, y: number, text: string): string {
	return `<text id="${id}" x="${x}" y="${y}" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">${escapeXml(text)}</text>`;
}

function escapeXml(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
	return escapeXml(s);
}
