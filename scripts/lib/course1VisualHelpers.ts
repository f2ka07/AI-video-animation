// Shared SVG helpers for course 1 hand-tuned module visuals

import { buildVisualPanelSvg } from "./premiumVisualPanel";
import type { VisualResult } from "./premiumVisualArchetypes";

export const FONT = "Inter,Segoe UI,Arial,sans-serif";

export function panel(ariaLabel: string, content: string, groupIds: string[] = []): VisualResult {
	return {
		svg: buildVisualPanelSvg({ ariaLabel, visualContent: content }),
		groupIds,
	};
}

export function box(
	x: number,
	y: number,
	w: number,
	h: number,
	label: string,
	accent: string,
	id?: string,
	fontSize = 14
): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<g${idAttr}>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#081827" stroke="${accent}" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + h / 2 + 5}" fill="${accent}" font-family="${FONT}" font-size="${fontSize}" font-weight="700" text-anchor="middle">${label}</text>
  </g>`;
}

export function arrow(x1: number, y1: number, x2: number, y2: number, accent = "#049FD9", id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<line${idAttr} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>`;
}

export function switchIcon(cx: number, cy: number, label = "SW1", id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<g${idAttr}>
    <rect x="${cx - 40}" y="${cy - 28}" width="80" height="56" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
    <path d="M${cx - 20} ${cy + 12}h40M${cx} ${cy - 8}v40" stroke="#12b5e5" stroke-width="2" stroke-linecap="round"/>
    <text x="${cx}" y="${cy + 44}" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">${label}</text>
  </g>`;
}

export function pythonFile(
	x: number,
	y: number,
	w: number,
	h: number,
	id?: string,
	options?: { filename?: string; lines?: string[] }
): string {
	const idAttr = id ? ` id="${id}"` : "";
	const filename = options?.filename ?? "script.py";
	const lines = options?.lines ?? ["import netmiko", "send_config_set()"];
	const cx = x + w / 2;
	const lineStartY = y + 44;
	const lineEls = lines
		.map(
			(line, i) =>
				`<text x="${cx}" y="${lineStartY + i * 16}" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">${line}</text>`
		)
		.join("\n    ");
	return `<g${idAttr}>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
    <text x="${cx}" y="${y + 26}" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">${filename}</text>
    ${lineEls}
  </g>`;
}

export function httpVerb(x: number, y: number, verb: string, accent: string, id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	const w = Math.max(56, verb.length * 9 + 20);
	return `<g${idAttr}>
    <rect x="${x}" y="${y}" width="${w}" height="32" rx="8" fill="#0b2237" stroke="${accent}" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + 21}" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">${verb}</text>
  </g>`;
}

export function statusBadge(x: number, y: number, code: string, label: string, accent: string, id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<g${idAttr}>
    <rect x="${x}" y="${y}" width="88" height="52" rx="10" fill="#081827" stroke="${accent}" stroke-width="2"/>
    <text x="${x + 44}" y="${y + 24}" fill="${accent}" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">${code}</text>
    <text x="${x + 44}" y="${y + 42}" fill="#9fb3c8" font-family="${FONT}" font-size="9" text-anchor="middle">${label}</text>
  </g>`;
}

export function terminalBlock(
	x: number,
	y: number,
	w: number,
	h: number,
	lines: string[],
	id?: string,
	accent = "#12b5e5"
): string {
	const idAttr = id ? ` id="${id}"` : "";
	const lineEls = lines
		.map((l, i) => {
			const color = l.startsWith("$") || l.startsWith("(env)") ? "#6CC04A" : l.startsWith("#") ? "#64748b" : "#9fb3c8";
			return `<text x="${x + 20}" y="${y + 48 + i * 24}" fill="${color}" font-family="monospace" font-size="12">${l}</text>`;
		})
		.join("\n    ");
	return `<g${idAttr}>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#020617" stroke="${accent}" stroke-width="2"/>
    <circle cx="${x + 28}" cy="${y + 28}" r="6" fill="#ef4444"/><circle cx="${x + 48}" cy="${y + 28}" r="6" fill="#f59e0b"/><circle cx="${x + 68}" cy="${y + 28}" r="6" fill="#6CC04A"/>
    ${lineEls}
  </g>`;
}

export function dataFile(x: number, y: number, ext: string, accent: string, lines: string[], id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	const lineEls = lines
		.map((l, i) => `<text x="${x + 14}" y="${y + 36 + i * 18}" fill="#9fb3c8" font-family="monospace" font-size="11">${l}</text>`)
		.join("");
	return `<g${idAttr}>
    <rect x="${x}" y="${y}" width="160" height="${40 + lines.length * 18}" rx="10" fill="#081827" stroke="${accent}" stroke-width="2"/>
    <text x="${x + 14}" y="${y + 20}" fill="${accent}" font-family="monospace" font-size="12" font-weight="700">${ext}</text>
    ${lineEls}
  </g>`;
}
