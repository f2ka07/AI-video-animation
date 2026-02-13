// Enhanced ComparisonSlide with spring animations
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

interface AnimatedComparisonSlideProps {
	title: string;
	leftTitle: string;
	leftItems: string[];
	rightTitle: string;
	rightItems: string[];
	slideName: string;
	audioStartFrame?: number;
	audioDuration?: number; // Total audio duration in seconds for proper sync
}

export const AnimatedComparisonSlide: React.FC<AnimatedComparisonSlideProps> = ({
	title,
	leftTitle,
	leftItems,
	rightTitle,
	rightItems,
	slideName,
	audioStartFrame = 0,
	audioDuration,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Spring animation for title
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.6,
	});

	// Spring for left column
	const leftColumnSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.3,
		durationInFrames: fps * 0.6,
	});

	// Spring for right column (delayed)
	const rightColumnSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.5,
		durationInFrames: fps * 0.6,
	});

	// Decorative spring
	const decorSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 60 },
		delay: fps * 0.2,
	});

	// Dynamic camera movements
	const cameraZoom = 1 + Math.sin(frame / 125) * 0.01;
	const cameraPanX = Math.sin(frame / 155) * 5;
	const cameraPanY = Math.cos(frame / 185) * 4;

	// Particle system
	const particleCount = 12;
	const particles = Array.from({ length: particleCount }, (_, i) => {
		const baseX = (i * 137.5) % 100;
		const baseY = (i * 97.3) % 100;
		const speed = 0.25 + (i % 3) * 0.1;
		const size = 2.5 + (i % 3) * 1;
		return {
			x: baseX + Math.sin(frame / (65 + i * 6)) * 14,
			y: baseY + Math.cos(frame / (75 + i * 7)) * 12,
			size,
			opacity: 0.15 + Math.sin(frame / (45 + i * 4)) * 0.1,
			speed,
		};
	});

	// Spring for each item (staggered)
	const getItemSpring = (index: number, side: "left" | "right") => {
		const baseDelay = side === "left" ? fps * 0.5 : fps * 0.7;
		const staggerDelay = fps * 0.12;
		return spring({
			frame,
			fps,
			config: { damping: 14, stiffness: 90 },
			delay: baseDelay + index * staggerDelay,
			durationInFrames: fps * 0.4,
		});
	};

	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [25, 0]);
	const titleScale = interpolate(titleSpring, [0, 1], [0.95, 1]);

	const getItemOpacity = (index: number, side: "left" | "right") => {
		return getItemSpring(index, side);
	};

	const getItemX = (index: number, side: "left" | "right") => {
		const itemSpring = getItemSpring(index, side);
		const direction = side === "left" ? -1 : 1;
		return interpolate(itemSpring, [0, 1], [25 * direction, 0]);
	};

	// Get item scale for spring effect
	const getItemScale = (index: number, side: "left" | "right") => {
		const itemSpring = getItemSpring(index, side);
		return interpolate(itemSpring, [0, 1], [0.95, 1]);
	};

	// Progressive highlighting - only if audioDuration is provided
	const currentTimeSeconds = frame / fps;
	// Entrance animations complete around 0.5s, audio starts at 0s  
	const entranceTime = 0.4; // Minimal delay to let slide appear
	
	const getItemHighlight = (index: number, side: "left" | "right"): number => {
		// If no audio duration provided, don't highlight
		if (!audioDuration || audioDuration <= 0) return 0;
		
		if (currentTimeSeconds < entranceTime) return 0;
		
		// Narrator intro ~15%, left items ~40%, right items ~40%, outro ~5%
		const introTime = audioDuration * 0.12;
		const leftDuration = audioDuration * 0.40;
		const rightDuration = audioDuration * 0.40;
		
		const leftTimePerItem = leftDuration / leftItems.length;
		const rightTimePerItem = rightDuration / rightItems.length;
		
		let itemStartTime: number;
		let timePerItem: number;
		
		if (side === "left") {
			itemStartTime = entranceTime + introTime + index * leftTimePerItem;
			timePerItem = leftTimePerItem;
		} else {
			itemStartTime = entranceTime + introTime + leftDuration + index * rightTimePerItem;
			timePerItem = rightTimePerItem;
		}
		
		const itemEndTime = itemStartTime + timePerItem;
		
		if (currentTimeSeconds < itemStartTime) return 0;
		if (currentTimeSeconds > itemEndTime) return 0.12; // Subtle glow for passed items
		
		const progress = (currentTimeSeconds - itemStartTime) / timePerItem;
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				flex: 1,
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				color: "white",
				display: "flex",
				flexDirection: "column",
				padding: 60,
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				position: "relative",
				overflow: "hidden",
				transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
				transformOrigin: "center center",
			}}
		>
			{/* Multi-layer animated background pattern */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.03 + Math.sin(frame / 70) * 0.015,
					backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
					backgroundSize: "40px 40px",
					transform: `translateY(${Math.sin(frame / 90) * 6}px) translateX(${Math.cos(frame / 100) * 4}px)`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.02 + Math.cos(frame / 80) * 0.01,
					backgroundImage: `radial-gradient(circle at 1px 1px, #8b5cf6 0.5px, transparent 0)`,
					backgroundSize: "55px 55px",
					transform: `translateY(${Math.cos(frame / 95) * 5}px) translateX(${Math.sin(frame / 110) * 3}px)`,
				}}
			/>
			
			{/* Floating particles */}
			{particles.map((particle, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: particle.size,
						height: particle.size,
						borderRadius: "50%",
						background: `radial-gradient(circle, rgba(99, 102, 241, ${particle.opacity}) 0%, transparent 70%)`,
						boxShadow: `0 0 ${particle.size * 3.5}px rgba(99, 102, 241, ${particle.opacity * 0.5})`,
						pointerEvents: "none",
					}}
				/>
			))}
			
			{/* Moving gradient spotlight with multiple layers */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 70) * 25}% ${50 + Math.cos(frame / 50) * 20}%, rgba(99, 102, 241, 0.08) 0%, transparent 45%)`,
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${30 + Math.cos(frame / 60) * 20}% ${70 + Math.sin(frame / 55) * 18}%, rgba(239, 68, 68, 0.05) 0%, transparent 40%)`,
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${70 + Math.sin(frame / 65) * 22}% ${30 + Math.cos(frame / 58) * 17}%, rgba(34, 197, 94, 0.05) 0%, transparent 40%)`,
					pointerEvents: "none",
				}}
			/>

			{/* Animated accent line with glow */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: "50%",
					transform: "translateX(-50%)",
					width: `${interpolate(decorSpring, [0, 1], [0, 100])}%`,
					height: 4,
					background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #22c55e 100%)",
					boxShadow: `0 0 ${22 * decorSpring}px rgba(59, 130, 246, ${0.7 * decorSpring}), 0 0 ${45 * decorSpring}px rgba(139, 92, 246, ${0.4 * decorSpring})`,
				}}
			/>

			{/* Animated scan line */}
			<div
				style={{
					position: "absolute",
					top: `${(frame / 2.3) % 100}%`,
					left: 0,
					right: 0,
					height: 2,
					background: "linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.35) 50%, transparent 100%)",
					opacity: 0.45,
					pointerEvents: "none",
				}}
			/>

			{/* Floating decorative orbs with pulsing */}
			<div
				style={{
					position: "absolute",
					top: "20%",
					left: "5%",
					width: 100,
					height: 100,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
					opacity: decorSpring * 0.6,
					transform: `scale(${0.8 + decorSpring * 0.3 + Math.sin(frame / 28) * 0.08}) translateY(${Math.sin(frame / 30) * 10}px) translateX(${Math.cos(frame / 35) * 6}px)`,
					boxShadow: `0 0 ${30 + Math.sin(frame / 24) * 20}px rgba(239, 68, 68, ${0.3 + Math.sin(frame / 28) * 0.2})`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "20%",
					right: "5%",
					width: 120,
					height: 120,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)",
					opacity: decorSpring * 0.6,
					transform: `scale(${0.8 + decorSpring * 0.3 + Math.cos(frame / 26) * 0.08}) translateY(${Math.sin(frame / 25 + 1) * 12}px) translateX(${Math.sin(frame / 32) * 7}px)`,
					boxShadow: `0 0 ${35 + Math.cos(frame / 22) * 22}px rgba(34, 197, 94, ${0.3 + Math.cos(frame / 26) * 0.2})`,
				}}
			/>

			<div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
				<h2
					style={{
						fontSize: 64,
						margin: 0,
						marginBottom: 50,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px) scale(${titleScale})`,
						fontWeight: 800,
						textAlign: "center",
						color: "#ffffff",
						letterSpacing: "-0.02em",
					}}
				>
					{title}
				</h2>
				<div
					style={{
						flex: 1,
						display: "flex",
						gap: 40,
					}}
				>
					{/* Left Column */}
					<div 
						style={{ 
							flex: 1, 
							display: "flex", 
							flexDirection: "column",
							opacity: leftColumnSpring,
							transform: `translateX(${interpolate(leftColumnSpring, [0, 1], [-30, 0])}px)`,
						}}
					>
						<h3
							style={{
								fontSize: 44,
								margin: 0,
								marginBottom: 32,
								color: "#ef4444",
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<span
								style={{
									width: interpolate(leftColumnSpring, [0, 1], [0, 8]),
									height: interpolate(leftColumnSpring, [0, 1], [0, 8]),
									backgroundColor: "#ef4444",
									borderRadius: "50%",
									boxShadow: `0 0 ${12 * leftColumnSpring}px rgba(239, 68, 68, 0.6)`,
								}}
							/>
							{leftTitle}
						</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{leftItems.map((item, index) => {
								const itemOpacity = getItemOpacity(index, "left");
								const itemX = getItemX(index, "left");
								const itemScale = getItemScale(index, "left");
								const highlight = getItemHighlight(index, "left");
								const isActive = highlight > 0.5;
								const breathe = isActive ? Math.sin(frame / 15) * 0.015 : 0;
								const floatY = Math.sin((frame + index * 10) / 38) * 1.5;
								const floatX = Math.cos((frame + index * 8) / 32) * 1;

								return (
									<div
										key={index}
										style={{
											opacity: itemOpacity,
											transform: `translateX(${itemX + floatX}px) translateY(${floatY}px) scale(${itemScale * (1 + highlight * 0.03 + breathe)})`,
											fontSize: 32,
											lineHeight: 1.6,
											padding: 24,
											backgroundColor: highlight > 0.3
												? `rgba(239, 68, 68, ${0.18 + highlight * 0.25})`
												: "rgba(30, 41, 59, 0.75)",
											borderRadius: 14,
											borderLeft: `4px solid rgba(239, 68, 68, ${0.7 + highlight * 0.3})`,
											boxShadow: highlight > 0.3
												? `0 0 ${18 + highlight * 20}px rgba(239, 68, 68, ${highlight * 0.6}), 0 0 ${(18 + highlight * 20) * 1.5}px rgba(239, 68, 68, ${highlight * 0.3}), 0 8px 16px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
												: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
											transformOrigin: "left center",
											backdropFilter: "blur(10px)",
											transition: "all 0.3s ease",
										}}
									>
										{item}
									</div>
								);
							})}
						</div>
					</div>
					{/* Center divider with animation */}
					<div
						style={{
							width: 2,
							background: "linear-gradient(180deg, transparent 0%, #3b82f6 50%, transparent 100%)",
							opacity: decorSpring * 0.5,
							transform: `scaleY(${interpolate(decorSpring, [0, 1], [0, 1])})`,
						}}
					/>
					{/* Right Column */}
					<div 
						style={{ 
							flex: 1, 
							display: "flex", 
							flexDirection: "column",
							opacity: rightColumnSpring,
							transform: `translateX(${interpolate(rightColumnSpring, [0, 1], [30, 0])}px)`,
						}}
					>
						<h3
							style={{
								fontSize: 44,
								margin: 0,
								marginBottom: 32,
								color: "#22c55e",
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<span
								style={{
									width: interpolate(rightColumnSpring, [0, 1], [0, 8]),
									height: interpolate(rightColumnSpring, [0, 1], [0, 8]),
									backgroundColor: "#22c55e",
									borderRadius: "50%",
									boxShadow: `0 0 ${12 * rightColumnSpring}px rgba(34, 197, 94, 0.6)`,
								}}
							/>
							{rightTitle}
						</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{rightItems.map((item, index) => {
								const itemOpacity = getItemOpacity(index, "right");
								const itemX = getItemX(index, "right");
								const itemScale = getItemScale(index, "right");
								const highlight = getItemHighlight(index, "right");
								const isActive = highlight > 0.5;
								const breathe = isActive ? Math.sin(frame / 15) * 0.015 : 0;
								const floatY = Math.sin((frame + index * 10) / 38) * 1.5;
								const floatX = Math.cos((frame + index * 8) / 32) * 1;

								return (
									<div
										key={index}
										style={{
											opacity: itemOpacity,
											transform: `translateX(${itemX + floatX}px) translateY(${floatY}px) scale(${itemScale * (1 + highlight * 0.03 + breathe)})`,
											fontSize: 32,
											lineHeight: 1.6,
											padding: 24,
											backgroundColor: highlight > 0.3
												? `rgba(34, 197, 94, ${0.18 + highlight * 0.25})`
												: "rgba(30, 41, 59, 0.75)",
											borderRadius: 14,
											borderLeft: `4px solid rgba(34, 197, 94, ${0.7 + highlight * 0.3})`,
											boxShadow: highlight > 0.3
												? `0 0 ${18 + highlight * 20}px rgba(34, 197, 94, ${highlight * 0.6}), 0 0 ${(18 + highlight * 20) * 1.5}px rgba(34, 197, 94, ${highlight * 0.3}), 0 8px 16px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
												: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
											transformOrigin: "left center",
											backdropFilter: "blur(10px)",
											transition: "all 0.3s ease",
										}}
									>
										{item}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
