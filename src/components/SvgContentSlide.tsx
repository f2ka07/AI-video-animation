// SVG Content Slide - Content on left, presenter on right (SVG, video, or stick teacher)
// Works with your existing SVG-based slide system
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring, staticFile, Img, Video } from "remotion";

type PresenterMode = "svg" | "video" | "stick";

interface SvgContentSlideProps {
	title: string;
	points: string[];
	slideName: string;
	audioDuration?: number;
	moduleNumber?: number;
	// Presenter mode and sources
	presenterMode?: PresenterMode;
	svgPath?: string; // Path to your SVG file (when presenterMode === "svg")
	videoSrc?: string; // Path to video file (when presenterMode === "video")
	teacherSrc?: string; // Deprecated - teacher images are now layered automatically
}

export const SvgContentSlide: React.FC<SvgContentSlideProps> = ({
	title,
	points,
	slideName,
	audioDuration,
	moduleNumber = 1,
	presenterMode = "svg",
	svgPath,
	videoSrc,
	teacherSrc,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Spring animations
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.6,
	});

	const svgSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.2,
		durationInFrames: fps * 0.7,
	});

	const getPointSpring = (index: number) => {
		const staggerDelay = fps * 0.15;
		const baseDelay = fps * 0.4;
		return spring({
			frame,
			fps,
			config: { damping: 14, stiffness: 90 },
			delay: baseDelay + index * staggerDelay,
			durationInFrames: fps * 0.5,
		});
	};

	// Progressive highlighting based on audio
	const currentTimeSeconds = frame / fps;
	const entranceTime = 0.3;
	
	const getPointHighlight = (index: number): number => {
		if (!audioDuration || audioDuration <= 0) return 0;
		if (currentTimeSeconds < entranceTime) return 0;
		
		const introTime = audioDuration * 0.15;
		const contentDuration = audioDuration * 0.80;
		const timePerPoint = contentDuration / points.length;
		
		const pointStartTime = entranceTime + introTime + index * timePerPoint;
		const pointEndTime = pointStartTime + timePerPoint;
		
		if (currentTimeSeconds < pointStartTime) return 0;
		if (currentTimeSeconds > pointEndTime) return 0.12;
		
		const progress = (currentTimeSeconds - pointStartTime) / timePerPoint;
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	// Camera movements
	const cameraZoom = 1 + Math.sin(frame / 140) * 0.01;
	const cameraPanX = Math.sin(frame / 160) * 4;
	const cameraPanY = Math.cos(frame / 200) * 3;

	// Calculate font sizes - larger since we have more space
	const leftWidth = width * 0.5; // 50% for content
	const padding = 80;
	const titleAreaHeight = 150;
	const availableHeight = height - padding * 2 - titleAreaHeight;
	
	const titleFontSize = Math.min(72, Math.max(40, (leftWidth - padding * 2) / title.length * 0.6));
	const pointFontSize = Math.min(42, Math.max(24, availableHeight / (points.length * 2.5)));

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "row",
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				position: "relative",
				overflow: "hidden",
				transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
				transformOrigin: "center center",
			}}
		>
			{/* Background effects */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.04 + Math.sin(frame / 60) * 0.02,
					backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
					backgroundSize: "40px 40px",
					transform: `translateY(${Math.sin(frame / 100) * 8}px)`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 80) * 20}% ${50 + Math.cos(frame / 60) * 15}%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)`,
					pointerEvents: "none",
				}}
			/>

			{/* Left side: Content */}
			<div
				style={{
					width: "50%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					padding: padding,
					position: "relative",
					zIndex: 1,
					borderRight: "2px solid rgba(59, 130, 246, 0.2)",
				}}
			>
				<h2
					style={{
						fontSize: titleFontSize,
						margin: 0,
						marginBottom: 60,
						opacity: titleSpring,
						transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
						fontWeight: 800,
						color: "#ffffff",
						letterSpacing: "-0.02em",
						lineHeight: 1.2,
					}}
				>
					{title}
				</h2>

				<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
					{points.map((point, index) => {
						const pointSpring = getPointSpring(index);
						const pointOpacity = pointSpring;
						const pointX = interpolate(pointSpring, [0, 1], [-30, 0]);
						const pointScale = interpolate(pointSpring, [0, 1], [0.95, 1]);
						
						const highlight = getPointHighlight(index);
						const isActive = highlight > 0.5;
						const breathe = isActive ? Math.sin(frame / 15) * 0.02 : 0;
						const activeScale = 1 + highlight * 0.03 + breathe;
						const glowSize = 20 + highlight * 25;
						const glowOpacity = highlight * 0.8;
						const floatY = Math.sin((frame + index * 10) / 40) * 2;

						return (
							<div
								key={index}
								style={{
									opacity: pointOpacity,
									transform: `translateX(${pointX}px) translateY(${floatY}px) scale(${pointScale * activeScale})`,
									display: "flex",
									alignItems: "flex-start",
									gap: 20,
									padding: "20px 24px",
									backgroundColor: highlight > 0.3
										? `rgba(59, 130, 246, ${0.18 + highlight * 0.25})`
										: "rgba(30, 41, 59, 0.65)",
									borderRadius: 14,
									borderLeft: `4px solid rgba(59, 130, 246, ${0.7 + highlight * 0.3})`,
									boxShadow: highlight > 0.3
										? `0 0 ${glowSize}px rgba(59, 130, 246, ${glowOpacity}), 0 0 ${glowSize * 1.5}px rgba(139, 92, 246, ${glowOpacity * 0.4}), 0 8px 16px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
										: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
									transformOrigin: "left center",
									backdropFilter: "blur(10px)",
								}}
							>
								<div
									style={{
										width: 12,
										height: 12,
										backgroundColor: isActive ? "#60a5fa" : "#3b82f6",
										borderRadius: "50%",
										marginTop: 8,
										flexShrink: 0,
										boxShadow: `0 0 ${15 + highlight * 20}px rgba(59, 130, 246, ${0.6 + highlight * 0.6})`,
									}}
								/>
								<p
									style={{
										fontSize: pointFontSize,
										margin: 0,
										lineHeight: 1.6,
										flex: 1,
										color: isActive ? "#e0f2fe" : "#f1f5f9",
										fontWeight: isActive ? 500 : 400,
									}}
								>
									{point}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Right side: Presenter area (SVG, video, or stick teacher) */}
			<div
				style={{
					width: "50%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
					opacity: svgSpring,
					transform: `translateX(${interpolate(svgSpring, [0, 1], [40, 0])}px) scale(${interpolate(svgSpring, [0, 1], [0.95, 1])})`,
					background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
					padding: presenterMode === "video" ? 12 : 40,
				}}
			>
				{presenterMode === "svg" && svgPath && (
					<Img
						src={staticFile(svgPath)}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
							filter: `drop-shadow(0 0 ${30 * svgSpring}px rgba(59, 130, 246, 0.3))`,
						}}
					/>
				)}

				{presenterMode === "video" && videoSrc && (
					<div
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 20,
							boxShadow: "0 16px 50px rgba(15,23,42,0.24)",
							background:
								"linear-gradient(145deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 45%, rgba(37,99,235,1) 100%)",
							padding: 12,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							position: "relative",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								height: 6,
								background:
									"linear-gradient(90deg, #38bdf8 0%, #22c55e 35%, #eab308 70%, #f97316 100%)",
								opacity: 0.9,
							}}
						/>
						<Video
							src={staticFile(videoSrc)}
							volume={0}
							muted
							loop
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								borderRadius: 20,
								backgroundColor: "black",
							}}
						/>
						<div
							style={{
								position: "absolute",
								bottom: 14,
								right: 20,
								padding: "6px 12px",
								borderRadius: 999,
								backgroundColor: "rgba(15,23,42,0.85)",
								color: "rgba(248,250,252,0.9)",
								fontSize: 18,
								fontWeight: 500,
							}}
						>
							Instructor View
						</div>
					</div>
				)}

				{presenterMode === "stick" && (() => {
					// Calculate which bullet point is currently most active
					let maxHighlight = 0;
					let activeBulletIndex = -1;
					
					for (let i = 0; i < points.length; i++) {
						const highlight = getPointHighlight(i);
						if (highlight > maxHighlight) {
							maxHighlight = highlight;
							activeBulletIndex = i;
						}
					}
					
					// Teacher should appear once content starts and stay visible
					// Don't tie teacher visibility to individual bullet highlights (that causes flickering)
					const introTime = audioDuration ? audioDuration * 0.15 : 0;
					const contentStartTime = entranceTime + introTime;
					const teacherShouldShow = currentTimeSeconds >= contentStartTime - 0.3;
					
					// Smooth fade-in when content starts
					const teacherOpacity = teacherShouldShow
						? interpolate(
								currentTimeSeconds,
								[contentStartTime - 0.3, contentStartTime],
								[0, 1],
								{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
						  )
						: 0;
					
					// Entrance animation - slide in from right (only on first appearance)
					const entranceProgress = interpolate(
						currentTimeSeconds,
						[contentStartTime - 0.3, contentStartTime],
						[0, 1],
						{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
					);
					const slideInX = interpolate(entranceProgress, [0, 1], [50, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					});
					
					// Only render teacher if it should be visible
					if (!teacherShouldShow || teacherOpacity < 0.1) {
						return null;
					}
					
					return (
						<div
							style={{
								width: "100%",
								height: "100%",
								borderRadius: 20,
								boxShadow: "0 16px 50px rgba(15,23,42,0.24)",
								background:
									"linear-gradient(145deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 45%, rgba(37,99,235,1) 100%)",
								padding: 12,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								position: "relative",
								overflow: "hidden",
								opacity: teacherOpacity,
								transform: `translateX(${slideInX}px)`,
							}}
						>
							<div
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: 6,
									background:
										"linear-gradient(90deg, #38bdf8 0%, #22c55e 35%, #eab308 70%, #f97316 100%)",
									opacity: 0.9,
								}}
							/>
							
							{/* Layered Teacher Images - Proper implementation */}
							{/* teacher_body: body + whiteboard, NO arms, NO face, NO bullets */}
							{/* arm_0 to arm_4: ONLY the arm pointing (no body, no bullets) */}
							{/* face_neutral: ONLY the face (no body) */}
							{/* The teacher points at the ACTUAL bullets in Remotion, not at dots in the image */}
							<div
								style={{
									position: "relative",
									width: "80%",
									height: "auto",
									aspectRatio: "1 / 1",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									transform: `translateY(${5 * Math.sin(frame / 30)}px)`,
								}}
							>
								{/* Base layer: Teacher body (no arms, no face) */}
								<Img
									src={staticFile("assets/teacher/teacher_body.png")}
									style={{
										position: "absolute",
										width: "100%",
										height: "100%",
										objectFit: "contain",
										zIndex: 1,
									}}
								/>
								
								{/* Arms layer: Show only the arm for the currently active bullet */}
								{points.slice(0, 5).map((_, index) => {
									const highlight = getPointHighlight(index);
									
									// Only show arm when its bullet is significantly active
									if (highlight < 0.2) return null;
									
									// Calculate opacity - fade in/out smoothly
									const armOpacity = interpolate(
										highlight,
										[0.2, 0.4, 0.6, 0.8, 1],
										[0, 0.5, 0.9, 1, 1],
										{
											extrapolateLeft: "clamp",
											extrapolateRight: "clamp",
										}
									);
									
									return (
										<Img
											key={`arm-${index}`}
											src={staticFile(`assets/teacher/arm_${index}.png`)}
											style={{
												position: "absolute",
												width: "100%",
												height: "100%",
												objectFit: "contain",
												opacity: armOpacity,
												zIndex: 2 + index, // Higher zIndex so arms appear on top
												pointerEvents: "none",
											}}
										/>
									);
								})}
								
								{/* Face layer: Always on top */}
								<Img
									src={staticFile("assets/teacher/face_neutral.png")}
									style={{
										position: "absolute",
										width: "100%",
										height: "100%",
										objectFit: "contain",
										zIndex: 10,
										pointerEvents: "none",
									}}
								/>
							</div>
							
							<div
								style={{
									position: "absolute",
									bottom: 14,
									right: 20,
									padding: "6px 12px",
									borderRadius: 999,
									backgroundColor: "rgba(15,23,42,0.85)",
									color: "rgba(248,250,252,0.9)",
									fontSize: 18,
									fontWeight: 500,
								}}
							>
								Instructor View
							</div>
						</div>
					);
				})()}
			</div>
		</div>
	);
};
