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

export const Module9: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		title: staticFile("audio/aws-pulumi/module9-title.wav"),
		outputsBasics: staticFile("audio/aws-pulumi/module9-outputsBasics.wav"),
		createNetworkStack: staticFile("audio/aws-pulumi/module9-createNetworkStack.wav"),
		createAppStack: staticFile("audio/aws-pulumi/module9-createAppStack.wav"),
		stackDependencies: staticFile("audio/aws-pulumi/module9-stackDependencies.wav"),
		summary: staticFile("audio/aws-pulumi/module9-summary.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		title: getAudioDuration("aws-pulumi/module9-title"),
		outputsBasics: getAudioDuration("aws-pulumi/module9-outputsBasics"),
		createNetworkStack: getAudioDuration("aws-pulumi/module9-createNetworkStack"),
		createAppStack: getAudioDuration("aws-pulumi/module9-createAppStack"),
		stackDependencies: getAudioDuration("aws-pulumi/module9-stackDependencies"),
		summary: getAudioDuration("aws-pulumi/module9-summary"),
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
	const outputsBasicsSlide = addSlide(audioDurations["outputsBasics"], false, 1.0);
	const createNetworkStackSlide = addSlide(audioDurations["createNetworkStack"], false, 1.0);
	const createAppStackSlide = addSlide(audioDurations["createAppStack"], false, 1.0);
	const stackDependenciesSlide = addSlide(audioDurations["stackDependencies"], false, 1.0);
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
					title="Outputs and Stack References" 
					subtitle="Sharing Resources Between Stacks"
					
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

			{/* Stack Outputs: Exporting Values */}
			<Sequence
				from={outputsBasicsSlide.start}
				durationInFrames={outputsBasicsSlide.duration}
			>
				<Audio src={audioFiles["outputsBasics"]} />
				<CrossFadeWrapper
					totalDuration={outputsBasicsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Stack Outputs: Exporting Values"
					points={[
						"Export values from a stack for reuse",
					"Accessible via pulumi stack output command",
					"Can be simple values or complex objects",
					"Displayed after successful deployment",
					"Enable sharing between stacks"
					]}
					slideName="outputsBasics"
					audioDuration={outputsBasicsSlide.audioDuration}
					moduleNumber={9}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={outputsBasicsSlide.start + outputsBasicsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create Network Stack with Outputs */}
			<Sequence
				from={createNetworkStackSlide.start}
				durationInFrames={createNetworkStackSlide.duration}
			>
				<Audio src={audioFiles["createNetworkStack"]} />
				<CrossFadeWrapper
					totalDuration={createNetworkStackSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create Network Stack with Outputs"
					code={`// Network stack - exports VPC and subnet information
// This stack manages all networking resources

// ... (VPC, subnets, gateways, route tables created here) ...

// Export values for other stacks to use
export const vpcId = vpc.id;
export const publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];
export const privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];
export const webSecurityGroupId = webSg.id;
export const appSecurityGroupId = appSg.id;
export const dbSecurityGroupId = dbSg.id;
export const natGatewayId = natGateway.id;`}
					language="typescript"
					slideName="createNetworkStack"
					audioStartFrame={createNetworkStackSlide.start}
					audioDuration={createNetworkStackSlide.audioDuration}
					moduleNumber={9}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createNetworkStackSlide.start + createNetworkStackSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create Application Stack with Stack References */}
			<Sequence
				from={createAppStackSlide.start}
				durationInFrames={createAppStackSlide.duration}
			>
				<Audio src={audioFiles["createAppStack"]} />
				<CrossFadeWrapper
					totalDuration={createAppStackSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create Application Stack with Stack References"
					code={`// Application stack - references network stack
import * as pulumi from "@pulumi/pulumi";

// Reference the network stack
const networkStack = new pulumi.StackReference("network", {
    name: "your-org/network-stack/dev", // Format: org/project/stack
});

// Get outputs from network stack
const vpcId = networkStack.requireOutput("vpcId");
const publicSubnetIds = networkStack.requireOutput("publicSubnetIds") as pulumi.Output<string[]>;
const webSgId = networkStack.requireOutput("webSecurityGroupId");

// Create resources using referenced values
const webServer = new aws.ec2.Instance("web-server", {
    // Use subnet from network stack
    subnetId: publicSubnetIds.apply(ids => ids[0]),
    vpcSecurityGroupIds: [webSgId],
    // ... other configuration ...
});

// Export application-specific outputs
export const webServerId = webServer.id;`}
					language="typescript"
					slideName="createAppStack"
					audioStartFrame={createAppStackSlide.start}
					audioDuration={createAppStackSlide.audioDuration}
					moduleNumber={9}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createAppStackSlide.start + createAppStackSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Stack Dependencies and Best Practices */}
			<Sequence
				from={stackDependenciesSlide.start}
				durationInFrames={stackDependenciesSlide.duration}
			>
				<Audio src={audioFiles["stackDependencies"]} />
				<CrossFadeWrapper
					totalDuration={stackDependenciesSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Stack Dependencies and Best Practices"
					points={[
						"Stack references create automatic dependencies",
					"Pulumi ensures dependent stacks are up to date",
					"Each stack has a clear, single responsibility",
					"Enables modular, maintainable infrastructure",
					"Supports team collaboration and separation of concerns"
					]}
					slideName="stackDependencies"
					audioDuration={stackDependenciesSlide.audioDuration}
					moduleNumber={9}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={stackDependenciesSlide.start + stackDependenciesSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Module 9 Summary */}
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
						"Stack outputs export values for reuse",
					"Stack references import values from other stacks",
					"Automatic dependency management between stacks",
					"Modular architecture with clear responsibilities",
					"Next: Multi-Environment Management"
					]}
					slideName="summary"
					audioDuration={summarySlide.audioDuration}
					moduleNumber={9}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
