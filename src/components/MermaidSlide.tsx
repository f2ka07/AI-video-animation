// Mermaid diagram slide - renders Mermaid flowchart as SVG illustration
import React, { useEffect, useState, useRef } from "react";
import { useVideoConfig } from "remotion";
import mermaid from "mermaid";

/** Fix common Mermaid parse errors: <br/>, unescaped double quotes in node labels */
function sanitizeMermaidSource(source: string): string {
	let s = source.replace(/<br\s*\/>/gi, "<br>");
	// Replace " with #quote; inside node labels [...]. Preserve ["..."] delimiter format.
	s = s.replace(/\[([^\]]*)\]/g, (_, content) => {
		if (content.startsWith('"') && content.endsWith('"') && content.length >= 2) {
			const inner = content.slice(1, -1).replace(/"/g, "#quote;");
			return '["' + inner + '"]';
		}
		return "[" + content.replace(/"/g, "#quote;") + "]";
	});
	return s;
}

interface MermaidSlideProps {
	title: string;
	mermaidSource: string;
	slideName: string;
	audioDuration?: number;
	moduleNumber?: number;
}

export const MermaidSlide: React.FC<MermaidSlideProps> = ({
	title,
	mermaidSource,
	slideName,
	moduleNumber = 1,
}) => {
	const [svg, setSvg] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const { width, height } = useVideoConfig();

	useEffect(() => {
		let cancelled = false;

		async function renderDiagram() {
			try {
				mermaid.initialize({
					startOnLoad: false,
					theme: "base",
					themeVariables: {
						darkMode: true,
						background: "#0f172a",
						primaryColor: "#1e3a5f",
						primaryTextColor: "#e2e8f0",
						primaryBorderColor: "#3b82f6",
						secondaryColor: "#0f4c5c",
						secondaryTextColor: "#94a3b8",
						tertiaryColor: "#1e293b",
						lineColor: "#64748b",
						textColor: "#f1f5f9",
						fontSize: "16px",
						fontFamily: "system-ui, sans-serif",
						clusterBkg: "#1e293b",
						clusterBorder: "#475569",
						titleColor: "#38bdf8",
						nodeBorder: "#334155",
						edgeLabelBackground: "#1e3a5f",
					},
				});

				const id = `mermaid-${slideName.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}`;
				const sanitized = sanitizeMermaidSource(mermaidSource.trim());
				const { svg: renderedSvg } = await mermaid.render(id, sanitized);

				if (!cancelled) {
					let processedSvg = renderedSvg.replace(
						/<svg /,
						'<svg style="width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain" '
					);
					// Keep text upright - remove rotation/transform that can slant labels
					processedSvg = processedSvg.replace(
						"</style>",
						"svg text{transform:none !important;font-style:normal !important;}\n</style>"
					);
					setSvg(processedSvg);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : String(err));
				}
			}
		}

		renderDiagram();
		return () => {
			cancelled = true;
		};
	}, [mermaidSource, slideName]);

	if (error) {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#0f172a",
					color: "#ef4444",
					padding: 40,
					fontFamily: "system-ui",
				}}
			>
				<div>
					<div style={{ fontSize: 24, marginBottom: 16 }}>Mermaid render error</div>
					<pre style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{error}</pre>
				</div>
			</div>
		);
	}

	if (!svg) {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#0f172a",
					color: "#94a3b8",
					fontFamily: "system-ui",
				}}
			>
				Loading diagram...
			</div>
		);
	}

	const titleHeight = 100;
	const padding = 48;
	const diagramAreaWidth = width - padding * 2;
	const diagramAreaHeight = height - titleHeight - padding * 2;

	return (
		<div
			ref={containerRef}
			style={{
				width: "100%",
				height: "100%",
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
				display: "flex",
				flexDirection: "column",
				fontFamily: "system-ui",
			}}
		>
			<div
				style={{
					padding: `${padding}px ${padding}px 16px`,
					fontSize: 36,
					fontWeight: 600,
					color: "#f1f5f9",
				}}
			>
				{title}
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: `0 ${padding}px ${padding}px`,
				}}
			>
				<div
					dangerouslySetInnerHTML={{ __html: svg }}
					style={{
						width: diagramAreaWidth,
						height: diagramAreaHeight,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				/>
			</div>
		</div>
	);
};
