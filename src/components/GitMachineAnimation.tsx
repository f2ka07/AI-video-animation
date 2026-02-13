// Git Version Control Machine Animation for Remotion
// Converted from animate.html - syncs animation phases with narration timing

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface GitMachineAnimationProps {
	audioDuration?: number;
	phase?: number; // Override phase manually (0-4)
}

export const GitMachineAnimation: React.FC<GitMachineAnimationProps> = ({
	audioDuration,
	phase: manualPhase,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentTime = frame / fps;

	// Calculate phase based on audio timing (if audioDuration provided)
	// Phase 0: Idle (first 0.5s)
	// Phase 1: Input highlighted (0.5s - 25%)
	// Phase 2: Engine active (25% - 50%)
	// Phase 3: History glowing (50% - 75%)
	// Phase 4: Output glowing (75% - 100%)
	let phase = manualPhase ?? 0;
	
	if (manualPhase === undefined && audioDuration && audioDuration > 0) {
		const progress = currentTime / audioDuration;
		if (progress < 0.05) phase = 0;
		else if (progress < 0.25) phase = 1;
		else if (progress < 0.50) phase = 2;
		else if (progress < 0.75) phase = 3;
		else phase = 4;
	}

	// Animation values
	const cogRotation = (frame * 3) % 360; // Continuous rotation
	const beltOffset = (frame * 2) % 40; // Belt flow
	const pulseScale = 1 + Math.sin(frame / 10) * 0.03;
	
	// Spring animations for phase transitions
	const inputGlow = phase === 1 ? 1 : 0;
	const engineGlow = phase === 2 ? 1 : 0;
	const historyGlow = phase === 3 ? 1 : 0;
	const outputGlow = phase === 4 ? 1 : 0;

	// Smooth transitions
	const inputTransform = inputGlow ? -4 : 0;
	const outputTransform = outputGlow ? -4 : 0;

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "radial-gradient(circle at top left, #111827, #020617)",
				borderRadius: 24,
				boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6)",
				padding: 32,
				boxSizing: "border-box",
				position: "relative",
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<svg viewBox="0 0 380 260" style={{ width: "100%", height: "100%" }}>
				{/* Background halo */}
				<defs>
					<radialGradient id="bgHalo" cx="0.3" cy="0.1" r="0.9">
						<stop offset="0%" stopColor="#1f2937" stopOpacity="1" />
						<stop offset="100%" stopColor="#020617" stopOpacity="0" />
					</radialGradient>
					<filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="4" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="4" result="blur" />
						<feFlood floodColor="#22c55e" floodOpacity="0.6" />
						<feComposite in2="blur" operator="in" />
						<feMerge>
							<feMergeNode />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<filter id="glowOrange" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="4" result="blur" />
						<feFlood floodColor="#f97316" floodOpacity="0.6" />
						<feComposite in2="blur" operator="in" />
						<feMerge>
							<feMergeNode />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<rect x="0" y="0" width="380" height="260" fill="url(#bgHalo)" />

				{/* Ground */}
				<rect
					x="20"
					y="190"
					width="340"
					height="30"
					rx="8"
					fill="#020617"
					stroke="#374151"
					strokeWidth="1.3"
				/>

				{/* Input tray (edits) */}
				<g
					style={{
						transform: `translateY(${inputTransform}px)`,
						filter: inputGlow ? "drop-shadow(0 0 12px rgba(56, 189, 248, 0.9))" : "none",
						transition: "transform 0.4s ease, filter 0.4s ease",
					}}
				>
					<rect
						x="30"
						y="150"
						width="80"
						height="32"
						rx="6"
						fill="#0f172a"
						stroke={inputGlow ? "#38bdf8" : "#4b5563"}
						strokeWidth={inputGlow ? 2 : 1}
					/>
					<rect x="36" y="144" width="68" height="10" rx="4" fill="#1f2937" />
					{/* files */}
					<rect x="38" y="120" width="26" height="18" rx="3" fill={inputGlow ? "#38bdf8" : "#6b7280"} />
					<rect x="62" y="112" width="26" height="18" rx="3" fill={inputGlow ? "#60a5fa" : "#9ca3af"} />
					<rect x="86" y="118" width="26" height="18" rx="3" fill={inputGlow ? "#38bdf8" : "#6b7280"} />
				</g>

				{/* Belt from input to engine */}
				<line
					x1="110"
					y1="166"
					x2="160"
					y2="166"
					stroke={engineGlow ? "#38bdf8" : "#4b5563"}
					strokeWidth="4"
					strokeLinecap="round"
					strokeDasharray={engineGlow ? "4 4" : "none"}
					strokeDashoffset={engineGlow ? beltOffset : 0}
				/>

				{/* Version control engine (cog) */}
				<g
					style={{
						transformOrigin: "190px 140px",
						transform: engineGlow ? `rotate(${cogRotation}deg)` : "none",
						filter: engineGlow ? "drop-shadow(0 0 12px rgba(96, 165, 250, 0.9))" : "none",
					}}
				>
					<circle cx="190" cy="140" r="30" fill="#111827" stroke="#60a5fa" strokeWidth="2" />
					{/* teeth */}
					<g stroke="#60a5fa" strokeWidth="3">
						<line x1="190" y1="102" x2="190" y2="110" />
						<line x1="190" y1="178" x2="190" y2="170" />
						<line x1="152" y1="140" x2="160" y2="140" />
						<line x1="228" y1="140" x2="220" y2="140" />
						<line x1="216" y1="166" x2="209" y2="159" />
						<line x1="164" y1="166" x2="171" y2="159" />
						<line x1="216" y1="114" x2="209" y2="121" />
						<line x1="164" y1="114" x2="171" y2="121" />
					</g>
					<circle cx="190" cy="140" r="10" fill={engineGlow ? "#3b82f6" : "#1d4ed8"} />
				</g>

				{/* Belt from engine to archive/output */}
				<line
					x1="220"
					y1="166"
					x2="270"
					y2="166"
					stroke={engineGlow ? "#38bdf8" : "#4b5563"}
					strokeWidth="4"
					strokeLinecap="round"
					strokeDasharray={engineGlow ? "4 4" : "none"}
					strokeDashoffset={engineGlow ? beltOffset : 0}
				/>

				{/* Archive stack (history) */}
				<g
					style={{
						transform: historyGlow ? "translateY(-2px)" : "none",
						filter: historyGlow ? "drop-shadow(0 0 12px rgba(34, 197, 94, 0.9))" : "none",
						transition: "transform 0.4s ease, filter 0.4s ease",
					}}
				>
					<rect x="260" y="70" width="80" height="20" rx="4" fill="#111827" stroke={historyGlow ? "#22c55e" : "#4b5563"} strokeWidth="1" />
					<rect x="265" y="76" width="70" height="10" rx="3" fill={historyGlow ? "#166534" : "#1f2937"} />

					<rect x="260" y="98" width="80" height="20" rx="4" fill="#111827" stroke={historyGlow ? "#22c55e" : "#6b7280"} strokeWidth="1" />
					<rect x="265" y="104" width="70" height="10" rx="3" fill={historyGlow ? "#166534" : "#1f2937"} />

					<rect x="260" y="126" width="80" height="20" rx="4" fill="#111827" stroke={historyGlow ? "#22c55e" : "#9ca3af"} strokeWidth="1.2" />
					<rect x="265" y="132" width="70" height="10" rx="3" fill={historyGlow ? "#166534" : "#1f2937"} />
				</g>

				{/* Output box (current version) */}
				<g
					style={{
						transform: `translateY(${outputTransform}px)`,
						filter: outputGlow ? "drop-shadow(0 0 14px rgba(249, 115, 22, 0.9))" : "none",
						transition: "transform 0.4s ease, filter 0.4s ease",
					}}
				>
					<rect
						x="150"
						y="190"
						width="80"
						height="26"
						rx="6"
						fill="#0f172a"
						stroke={outputGlow ? "#f97316" : "#4b5563"}
						strokeWidth={outputGlow ? 2 : 1}
					/>
					<rect x="156" y="182" width="68" height="12" rx="4" fill="#1f2937" />
					{/* file icon */}
					<rect x="168" y="176" width="22" height="14" rx="2" fill="#f97316" style={{ transform: outputGlow ? `scale(${pulseScale})` : "none", transformOrigin: "179px 183px" }} />
					<line x1="171" y1="180" x2="187" y2="180" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
				</g>

				{/* Labels */}
				<text x="70" y="210" fontSize="10" fill={inputGlow ? "#38bdf8" : "#9ca3af"} textAnchor="middle">
					Edits / commits in
				</text>
				<text x="190" y="90" fontSize="10" fill={engineGlow ? "#60a5fa" : "#9ca3af"} textAnchor="middle">
					Git engine
				</text>
				<text x="300" y="60" fontSize="10" fill={historyGlow ? "#22c55e" : "#9ca3af"} textAnchor="middle">
					Commit history
				</text>
				<text x="190" y="232" fontSize="10" fill={outputGlow ? "#f97316" : "#9ca3af"} textAnchor="middle">
					Clean working copy
				</text>

				{/* Git badge */}
				<g transform="translate(32 36)">
					<rect x="0" y="0" width="90" height="20" rx="10" fill="#0f172a" stroke="#4b5563" strokeWidth="1" />
					<circle cx="14" cy="10" r="6" fill="#ef4444" />
					<text x="30" y="13" fontSize="9" fill="#e5e7eb">Git machine</text>
				</g>
			</svg>
		</div>
	);
};
