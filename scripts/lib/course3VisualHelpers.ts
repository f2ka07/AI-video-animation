// Premium diagram helpers for Course 3 (network-operations-automated-networks)

import { buildVisualPanelSvg } from "./premiumVisualPanel";
import type { VisualResult } from "./premiumVisualArchetypes";

export const FONT = "Inter,Segoe UI,Arial,sans-serif";

export function panel(ariaLabel: string, content: string, groupIds: string[]): VisualResult {
	return {
		svg: buildVisualPanelSvg({ ariaLabel, visualContent: content }),
		groupIds,
	};
}

export function header(tag: string, title: string, subtitle?: string): string {
	return `
    <text x="48" y="58" fill="#049FD9" font-family="${FONT}" font-size="11" font-weight="800" letter-spacing="0.14em">${tag}</text>
    <text x="48" y="84" fill="#f8fafc" font-family="${FONT}" font-size="14" font-weight="800">${title}</text>
    ${subtitle ? `<text x="48" y="104" fill="#9fb3c8" font-family="${FONT}" font-size="11">${subtitle}</text>` : ""}`;
}

export function arrow(x1: number, y1: number, x2: number, y2: number, id?: string, dashed = false): string {
	const dash = dashed ? ' stroke-dasharray="6 5"' : "";
	const idAttr = id ? ` id="${id}"` : "";
	return `<line${idAttr} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#049FD9" stroke-width="3" stroke-linecap="round"${dash}/>`;
}

export function panelBox(
	id: string,
	x: number,
	y: number,
	w: number,
	h: number,
	title: string,
	accent: string,
	inner: string,
	fill = "#081827"
): string {
	return `<g id="${id}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${accent}" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + 28}" fill="${accent}" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">${title}</text>
    ${inner}
  </g>`;
}

export function codeBlock(x: number, y: number, w: number, h: number, lines: string[]): string {
	const body = lines
		.map((line, i) => {
			const color = line.startsWith("$") ? "#6CC04A" : line.startsWith("#") ? "#64748b" : "#9fb3c8";
			return `<text x="${x + 16}" y="${y + 24 + i * 18}" fill="${color}" font-family="monospace" font-size="9">${line}</text>`;
		})
		.join("");
	return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#020617" stroke="#35536f" stroke-width="1.5"/>${body}`;
}

export function routerIcon(cx: number, cy: number, label: string, id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<g${idAttr}>
    <rect x="${cx - 44}" y="${cy - 30}" width="88" height="60" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
    <path d="M${cx - 18} ${cy + 14}h36M${cx} ${cy - 6}v36" stroke="#12b5e5" stroke-width="2" stroke-linecap="round"/>
    <text x="${cx}" y="${cy + 48}" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">${label}</text>
  </g>`;
}

export function collectorIcon(cx: number, cy: number, label: string, id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<g${idAttr}>
    <rect x="${cx - 52}" y="${cy - 34}" width="104" height="68" rx="12" fill="#0b2237" stroke="#6CC04A" stroke-width="2"/>
    <rect x="${cx - 36}" y="${cy - 16}" width="72" height="32" rx="6" fill="#112115" stroke="#35536f"/>
    <text x="${cx}" y="${cy + 52}" fill="#6CC04A" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">${label}</text>
  </g>`;
}

export function comparePanels(
	ariaLabel: string,
	left: { id: string; title: string; accent: string; lines: string[]; fill?: string },
	right: { id: string; title: string; accent: string; lines: string[]; fill?: string }
): VisualResult {
	const renderSide = (side: typeof left, x: number) => {
		const inner = side.lines
			.map(
				(line, i) =>
					`<text x="${x + 24}" y="${148 + i * 22}" fill="${i === 0 ? "#9fb3c8" : "#64748b"}" font-family="${FONT}" font-size="${i === 0 ? 11 : 10}"${i === 0 ? ' font-weight="700"' : ""}>${line}</text>`
			)
			.join("");
		return panelBox(side.id, x, 108, 296, 248, side.title, side.accent, inner, side.fill ?? "#081827");
	};
	return panel(
		ariaLabel,
		`${header("COMPARE", ariaLabel)}${renderSide(left, 48)}${renderSide(right, 376)}`,
		[left.id, right.id]
	);
}

export function bridgeTitle(
	ariaLabel: string,
	from: string,
	to: string,
	middle: string,
	ids: string[]
): VisualResult {
	return panel(
		ariaLabel,
		`
    ${header("COURSE 3", ariaLabel)}
    <g id="${ids[0]}">
      <rect x="56" y="120" width="180" height="100" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="146" y="158" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">${from}</text>
      <text x="146" y="182" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Courses 1-2 complete</text>
    </g>
    ${arrow(236, 170, 300, 170, `${ids[1]}-line`)}
    <g id="${ids[1]}">
      <rect x="300" y="120" width="180" height="100" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="390" y="158" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">${middle}</text>
      <text x="390" y="182" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">New question</text>
    </g>
    <g id="${ids[2]}">
      <rect x="500" y="120" width="180" height="100" rx="14" fill="#112115" stroke="#f59e0b" stroke-width="2"/>
      <text x="590" y="158" fill="#f59e0b" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">${to}</text>
      <text x="590" y="182" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Operate domain 3.x</text>
    </g>
    <rect x="72" y="280" width="576" height="52" rx="12" fill="#0b2237" stroke="#049FD9" stroke-width="1.5"/>
    <text x="360" y="312" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Deploy success is not proof of health</text>`,
		ids
	);
}

export function fourStepFlow(
	ariaLabel: string,
	steps: Array<{ id: string; label: string; accent: string }>,
	caption: string
): VisualResult {
	const xs = [100, 250, 400, 550];
	const content = steps
		.map((s, i) => {
			const x = xs[i];
			const line = i < steps.length - 1 ? arrow(x + 50, 200, xs[i + 1] - 50, 200) : "";
			return `${line}
      <g id="${s.id}">
        <circle cx="${x}" cy="200" r="34" fill="#082f49" stroke="${s.accent}" stroke-width="3"/>
        <text x="${x}" y="206" fill="#f8fafc" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">${i + 1}</text>
        <text x="${x}" y="256" fill="${s.accent}" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">${s.label}</text>
      </g>`;
		})
		.join("");
	return panel(
		ariaLabel,
		`${header("ARCHITECTURE", ariaLabel)}${content}
    <text x="360" y="320" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">${caption}</text>`,
		steps.map((s) => s.id)
	);
}

export function examAlignment(objective: string, ids = ["viz-exam-1", "viz-exam-2", "viz-exam-3", "viz-badge"]): VisualResult {
	return panel(
		"CCNP exam alignment",
		`
    ${header("EXAM ALIGN", "CCNP Automation domain 3.x")}
    ${arrow(120, 200, 540, 200, "viz-exam-line")}
    <g id="viz-exam-1"><circle cx="160" cy="200" r="32" fill="#082f49" stroke="#12b5e5" stroke-width="3"/>
      <text x="160" y="248" fill="#f8fafc" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Learn</text></g>
    <g id="viz-exam-2"><circle cx="360" cy="200" r="32" fill="#163119" stroke="#6CC04A" stroke-width="3"/>
      <text x="360" y="248" fill="#f8fafc" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Lab</text></g>
    <g id="viz-exam-3"><circle cx="560" cy="200" r="32" fill="#3a2508" stroke="#f59e0b" stroke-width="3"/>
      <text x="560" y="248" fill="#f8fafc" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Exam</text></g>
    <g id="viz-badge">
      <rect x="200" y="290" width="320" height="88" rx="16" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="322" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="900" text-anchor="middle">AUTOCOR objective ${objective}</text>
      <text x="360" y="348" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Mapped to lab workflow end to end</text>
    </g>`,
		ids
	);
}

export function labWorkspace(
	ariaLabel: string,
	folder: string,
	files: string[],
	terminalLines: string[],
	ids = ["viz-folder", "viz-terminal", "viz-check"]
): VisualResult {
	const fileLines = files
		.map((f, i) => `<text x="120" y="${158 + i * 22}" fill="#9fb3c8" font-family="monospace" font-size="11">${f}</text>`)
		.join("");
	return panel(
		ariaLabel,
		`
    ${header("LAB", ariaLabel)}
    <g id="${ids[0]}">
      <rect x="56" y="120" width="220" height="200" rx="14" fill="#081827" stroke="#203a56" stroke-width="1.5"/>
      <text x="80" y="148" fill="#12b5e5" font-family="monospace" font-size="12" font-weight="700">${folder}/</text>
      ${fileLines}
    </g>
    <g id="${ids[1]}">
      <rect x="320" y="120" width="340" height="200" rx="12" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="344" cy="142" r="5" fill="#ef4444"/><circle cx="360" cy="142" r="5" fill="#f59e0b"/><circle cx="376" cy="142" r="5" fill="#6CC04A"/>
      ${codeBlock(336, 152, 308, 120, terminalLines)}
    </g>
    <g id="${ids[2]}">
      <circle cx="360" cy="360" r="22" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <path d="M350 360l6 6 14-16" fill="none" stroke="#6CC04A" stroke-width="3" stroke-linecap="round"/>
    </g>`,
		ids
	);
}

export function moduleHandoff(nextLabel: string, ids = ["viz-done", "viz-arrow", "viz-next"]): VisualResult {
	return panel(
		"Module handoff",
		`
    ${header("CHECKPOINT", "Ready for next module")}
    <g id="${ids[0]}">
      <rect x="80" y="150" width="200" height="120" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="180" y="190" fill="#6CC04A" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">Module complete</text>
      <text x="180" y="218" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Lab verified</text>
    </g>
    ${arrow(280, 210, 360, 210, ids[1])}
    <g id="${ids[2]}">
      <rect x="360" y="150" width="280" height="120" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="500" y="190" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">${nextLabel}</text>
      <text x="500" y="218" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Same lab folder pattern</text>
    </g>`,
		ids
	);
}

export function recapPath(items: string[], ids: string[]): VisualResult {
	const boxes = items
		.map((item, i) => {
			const x = 70 + i * 170;
			return `<g id="${ids[i]}">
        <rect x="${x}" y="160" width="140" height="64" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
        <text x="${x + 70}" y="198" fill="#9fb3c8" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">${item}</text>
      </g>${i < items.length - 1 ? arrow(x + 140, 192, x + 170, 192) : ""}`;
		})
		.join("");
	return panel("Theory recap checkpoint", `${header("RECAP", "Theory complete — lab next")}${boxes}`, ids);
}

export function domainBar(text: string, sub: string, id = "viz-objective", y = 388): string {
	return `<g id="${id}">
    <rect x="48" y="${y}" width="624" height="44" rx="12" fill="#0b2237" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="360" y="${y + 20}" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">${text}</text>
    <text x="360" y="${y + 36}" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">${sub}</text>
  </g>`;
}

/** Shorter header for title-slide diagrams (less vertical space). */
export function compactHeader(tag: string, title: string): string {
	return `
    <text x="48" y="52" fill="#049FD9" font-family="${FONT}" font-size="11" font-weight="800" letter-spacing="0.14em">${tag}</text>
    <text x="48" y="74" fill="#f8fafc" font-family="${FONT}" font-size="13" font-weight="800">${title}</text>`;
}
