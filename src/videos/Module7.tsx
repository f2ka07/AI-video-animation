import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { BulletsAndCodeSlide } from "../components/BulletsAndCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { SequentialBulletSlide } from "../components/SequentialBulletSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { getAudioDuration } from "../utils/audioDuration";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

export const Module7: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		title: staticFile("audio/aws-pulumi/module7-title.wav"),
		albBasics: staticFile("audio/aws-pulumi/module7-albBasics.wav"),
		createTargetGroup: staticFile("audio/aws-pulumi/module7-createTargetGroup.wav"),
		createLoadBalancer: staticFile("audio/aws-pulumi/module7-createLoadBalancer.wav"),
		registerTargets: staticFile("audio/aws-pulumi/module7-registerTargets.wav"),
		createListener: staticFile("audio/aws-pulumi/module7-createListener.wav"),
		summary: staticFile("audio/aws-pulumi/module7-summary.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		title: getAudioDuration("aws-pulumi/module7-title"),
		albBasics: getAudioDuration("aws-pulumi/module7-albBasics"),
		createTargetGroup: getAudioDuration("aws-pulumi/module7-createTargetGroup"),
		createLoadBalancer: getAudioDuration("aws-pulumi/module7-createLoadBalancer"),
		registerTargets: getAudioDuration("aws-pulumi/module7-registerTargets"),
		createListener: getAudioDuration("aws-pulumi/module7-createListener"),
		summary: getAudioDuration("aws-pulumi/module7-summary"),
	};

	let currentFrame = 0;

	const addSlide = (audioDuration: number, isLast: boolean = false, buffer: number = 0) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		if (!isLast) {
			currentFrame += (slideDuration + whooshDuration) * fps;
		} else {
			currentFrame += slideDuration * fps;
		}
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const titleSlide = addSlide(audioDurations["title"], false, 1.0);
	const albBasicsSlide = addSlide(audioDurations["albBasics"], false, 1.0);
	const createTargetGroupSlide = addSlide(audioDurations["createTargetGroup"], false, 1.0);
	const createLoadBalancerSlide = addSlide(audioDurations["createLoadBalancer"], false, 1.0);
	const registerTargetsSlide = addSlide(audioDurations["registerTargets"], false, 1.0);
	const createListenerSlide = addSlide(audioDurations["createListener"], false, 1.0);
	const summarySlide = addSlide(audioDurations["summary"], true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* title */}
			<Sequence
				from={titleSlide.start}
				durationInFrames={titleSlide.duration}
			>
				<Audio src={audioFiles["title"]} />
				<CrossFadeWrapper
					totalDuration={titleSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Application Load Balancer" 
					subtitle="Distributing Traffic"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={titleSlide.start + titleSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application Load Balancer: Layer 7 Routing */}
			<Sequence
				from={albBasicsSlide.start}
				durationInFrames={albBasicsSlide.duration}
			>
				<Audio src={audioFiles["albBasics"]} />
				<CrossFadeWrapper
					totalDuration={albBasicsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application Load Balancer: Layer 7 Routing"
					points={[
						"Operates at Layer 7 (HTTP/HTTPS)",
					"Content-based routing (path, host, headers)",
					"Highly available across multiple AZs",
					"SSL termination with ACM integration",
					"Supports WebSocket and HTTP/2"
					]}
					slideName="albBasics"
					audioDuration={albBasicsSlide.audioDuration}
					moduleNumber={7}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={albBasicsSlide.start + albBasicsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create Target Group for EC2 Instances */}
			<Sequence
				from={createTargetGroupSlide.start}
				durationInFrames={createTargetGroupSlide.duration}
			>
				<Audio src={audioFiles["createTargetGroup"]} />
				<CrossFadeWrapper
					totalDuration={createTargetGroupSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create Target Group for EC2 Instances"
					code={`// Target Group defines which instances receive traffic
const webTargetGroup = new aws.lb.TargetGroup("web-targets", {
    port: 80,
    protocol: "HTTP",
    vpcId: vpc.id,
    targetType: "instance",
    healthCheck: {
        enabled: true,
        path: "/",
        protocol: "HTTP",
        healthyThreshold: 2,
        unhealthyThreshold: 2,
        timeout: 5,
        interval: 30,
        matcher: "200",
    },
    tags: {
        Name: "web-target-group",
    },
});`}
					language="typescript"
					slideName="createTargetGroup"
					audioStartFrame={createTargetGroupSlide.start}
					audioDuration={createTargetGroupSlide.audioDuration}
					moduleNumber={7}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createTargetGroupSlide.start + createTargetGroupSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create Application Load Balancer */}
			<Sequence
				from={createLoadBalancerSlide.start}
				durationInFrames={createLoadBalancerSlide.duration}
			>
				<Audio src={audioFiles["createLoadBalancer"]} />
				<CrossFadeWrapper
					totalDuration={createLoadBalancerSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create Application Load Balancer"
					code={`// Application Load Balancer in public subnets
const webAlb = new aws.lb.LoadBalancer("web-alb", {
    name: "web-alb",
    loadBalancerType: "application",
    subnets: [publicSubnet1.id, publicSubnet2.id],
    securityGroups: [webSg.id],
    enableDeletionProtection: false, // Set to true in production
    enableHttp2: true,
    tags: {
        Name: "web-alb",
    },
});`}
					language="typescript"
					slideName="createLoadBalancer"
					audioStartFrame={createLoadBalancerSlide.start}
					audioDuration={createLoadBalancerSlide.audioDuration}
					moduleNumber={7}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createLoadBalancerSlide.start + createLoadBalancerSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Register EC2 Instances with Target Group */}
			<Sequence
				from={registerTargetsSlide.start}
				durationInFrames={registerTargetsSlide.duration}
			>
				<Audio src={audioFiles["registerTargets"]} />
				<CrossFadeWrapper
					totalDuration={registerTargetsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Register EC2 Instances with Target Group"
					code={`// Register web server instances with target group
const webTarget1 = new aws.lb.TargetGroupAttachment("web-target-1", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer1.id,
    port: 80,
});

const webTarget2 = new aws.lb.TargetGroupAttachment("web-target-2", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer2.id,
    port: 80,
});`}
					language="typescript"
					slideName="registerTargets"
					audioStartFrame={registerTargetsSlide.start}
					audioDuration={registerTargetsSlide.audioDuration}
					moduleNumber={7}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={registerTargetsSlide.start + registerTargetsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create Load Balancer Listener */}
			<Sequence
				from={createListenerSlide.start}
				durationInFrames={createListenerSlide.duration}
			>
				<Audio src={audioFiles["createListener"]} />
				<CrossFadeWrapper
					totalDuration={createListenerSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create Load Balancer Listener"
					code={`// Listener defines how ALB handles incoming traffic
const webListener = new aws.lb.Listener("web-listener", {
    loadBalancerArn: webAlb.arn,
    port: 80,
    protocol: "HTTP",
    defaultActions: [{
        type: "forward",
        targetGroupArn: webTargetGroup.arn,
    }],
});

// Export ALB DNS name for easy access
export const albDnsName = webAlb.dnsName;`}
					language="typescript"
					slideName="createListener"
					audioStartFrame={createListenerSlide.start}
					audioDuration={createListenerSlide.audioDuration}
					moduleNumber={7}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createListenerSlide.start + createListenerSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Module 7 Summary */}
			<Sequence
				from={summarySlide.start}
				durationInFrames={summarySlide.duration}
			>
				<Audio src={audioFiles["summary"]} />
				<CrossFadeWrapper
					totalDuration={summarySlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Conclusion"
					points={[
						"Target Groups define which instances receive traffic",
					"Health checks automatically detect and remove unhealthy instances",
					"ALB distributes traffic across AZs for high availability",
					"Listeners route traffic based on rules",
					"Next: RDS Database in private subnets"
					]}
					slideName="summary"
					audioDuration={summarySlide.audioDuration}
					moduleNumber={7}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
