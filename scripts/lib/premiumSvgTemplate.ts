// Premium diagram SVG template for IaC course slides (Remotion-safe: no filters)

export interface PremiumSvgOptions {
	ariaLabel: string;
	kicker: string;
	title: string;
	subtitle: string;
	footer: string;
	/** SVG markup placed inside the main card (coordinates relative to card at 0,0) */
	cardContent: string;
	cardHeight?: number;
}

const FONT = "Inter,Segoe UI,Arial,sans-serif";

export function buildPremiumSvg(opts: PremiumSvgOptions): string {
	const cardH = opts.cardHeight ?? 610;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" role="img" aria-label="${escapeAttr(opts.ariaLabel)}">
  <rect width="800" height="900" fill="#0b1f33"/>
  <circle cx="690" cy="110" r="170" fill="#049FD9" opacity="0.08"/>
  <circle cx="105" cy="790" r="190" fill="#6CC04A" opacity="0.07"/>

  <text x="44" y="58" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="900" letter-spacing="0.17em">${escapeXml(opts.kicker)}</text>
  <text x="44" y="103" fill="#f8fafc" font-family="${FONT}" font-size="32" font-weight="900">${escapeXml(opts.title)}</text>
  <text x="44" y="132" fill="#9fb3c8" font-family="${FONT}" font-size="16">${escapeXml(opts.subtitle)}</text>

  <g transform="translate(44 178)">
    <rect width="712" height="${cardH}" rx="28" fill="#0b1728" stroke="#203a56" stroke-width="1.5"/>
    ${opts.cardContent}
  </g>

  <text x="400" y="835" fill="#9fb3c8" font-family="${FONT}" font-size="13" text-anchor="middle">${escapeXml(opts.footer)}</text>
</svg>`;
}

export function rowCard(
	y: number,
	accent: string,
	bg: string,
	iconPath: string,
	label: string,
	body: string,
	height = 76
): string {
	return `<g transform="translate(56 ${y})">
      <rect width="600" height="${height}" rx="18" fill="${bg}" stroke="${accent}" stroke-width="1.5" opacity="0.95"/>
      <rect x="18" y="18" width="42" height="42" rx="12" fill="#081827"/>
      <path d="${iconPath}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="78" y="31" fill="${accent}" font-family="${FONT}" font-size="16" font-weight="800">${escapeXml(label)}</text>
      <text x="78" y="55" fill="#9fb3c8" font-family="${FONT}" font-size="15">${escapeXml(body)}</text>
    </g>`;
}

export function footerStrip(y: number, text: string): string {
	return `<g transform="translate(56 ${y})">
      <rect width="600" height="34" rx="17" fill="#081827" stroke="#263f5c"/>
      <circle cx="22" cy="17" r="6" fill="#6CC04A"/>
      <text x="42" y="22" fill="#9fb3c8" font-family="${FONT}" font-size="13">${escapeXml(text)}</text>
    </g>`;
}

export function compareColumns(
	leftTitle: string,
	leftItems: string[],
	rightTitle: string,
	rightItems: string[]
): string {
	const item = (x: number, y: number, text: string, accent: string, bg: string) =>
		`<rect x="${x}" y="${y}" width="260" height="52" rx="14" fill="${bg}" stroke="${accent}" stroke-width="1.5"/>
      <text x="${x + 16}" y="${y + 32}" fill="#f8fafc" font-family="${FONT}" font-size="14" font-weight="600">${escapeXml(text)}</text>`;

	let leftRows = leftItems
		.map((t, i) => item(24, 120 + i * 64, t, "#ef4444", "#1a1215"))
		.join("\n    ");
	let rightRows = rightItems
		.map((t, i) => item(316, 120 + i * 64, t, "#6CC04A", "#112115"))
		.join("\n    ");

	return `
    <text x="154" y="72" fill="#ef4444" font-family="${FONT}" font-size="18" font-weight="800" text-anchor="middle">${escapeXml(leftTitle)}</text>
    <text x="446" y="72" fill="#6CC04A" font-family="${FONT}" font-size="18" font-weight="800" text-anchor="middle">${escapeXml(rightTitle)}</text>
    <line x1="356" y1="48" x2="356" y2="340" stroke="#35536f" stroke-width="2"/>
    <text x="356" y="200" fill="#64748b" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">vs</text>
    ${leftRows}
    ${rightRows}`;
}

function escapeXml(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
	return escapeXml(s);
}
