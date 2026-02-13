import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { getAudioDuration } from "../utils/audioDuration";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY
export const Module10: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		title: staticFile("audio/module10-title.wav"),
		stackConfigBasics: staticFile("audio/module10-stackConfigBasics.wav"),
		createStackConfig: staticFile("audio/module10-createStackConfig.wav"),
		manageSecrets: staticFile("audio/module10-manageSecrets.wav"),
		deployMultipleEnvironments: staticFile("audio/module10-deployMultipleEnvironments.wav"),
		summary: staticFile("audio/module10-summary.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		title: getAudioDuration("module10-title"),
		stackConfigBasics: getAudioDuration("module10-stackConfigBasics"),
		createStackConfig: getAudioDuration("module10-createStackConfig"),
		manageSecrets: getAudioDuration("module10-manageSecrets"),
		deployMultipleEnvironments: getAudioDuration("module10-deployMultipleEnvironments"),
		summary: getAudioDuration("module10-summary"),
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

	const titleSlide = addSlide(audioDurations["title"]);
	const stackConfigBasicsSlide = addSlide(audioDurations["stackConfigBasics"]);
	const createStackConfigSlide = addSlide(audioDurations["createStackConfig"]);
	const manageSecretsSlide = addSlide(audioDurations["manageSecrets"]);
	const deployMultipleEnvironmentsSlide = addSlide(audioDurations["deployMultipleEnvironments"]);
	const summarySlide = addSlide(audioDurations["summary"], true, 0.5);

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
					<TitleSlide title="Multi-Environment Management" subtitle="Module 10: Dev, Staging, and Production" />
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={titleSlide.start + titleSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Pulumi Stacks: Isolated Environments */}
			<Sequence
				from={stackConfigBasicsSlide.start}
				durationInFrames={stackConfigBasicsSlide.duration}
			>
				<Audio src={audioFiles["stackConfigBasics"]} />
				<CrossFadeWrapper
					totalDuration={stackConfigBasicsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Pulumi Stacks: Isolated Environments"
					points={[
						"Each stack is an isolated infrastructure instance",
					"Separate state files and configuration per stack",
					"Same code, different configurations per environment",
					"Configuration stored in Pulumi.{stack}.yaml",
					"Enables dev, staging, and production deployments"
					]}
					slideName="stackConfigBasics"
					imageSrc="assets/vpc.svg"
					audioDuration={audioDurations["stackConfigBasics"]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={stackConfigBasicsSlide.start + stackConfigBasicsSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create Stack Configuration Files */}
			<Sequence
				from={createStackConfigSlide.start}
				durationInFrames={createStackConfigSlide.duration}
			>
				<Audio src={audioFiles["createStackConfig"]} />
				<CrossFadeWrapper
					totalDuration={createStackConfigSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create Stack Configuration Files"
					code={`// Read stack configuration
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

// Environment-specific configuration with defaults
const environment = config.get("environment") || "dev";
const instanceType = config.get("instanceType") || "t3.micro";
const dbInstanceClass = config.get("dbInstanceClass") || "db.t3.micro";
const enableMultiAz = config.getBoolean("enableMultiAz") || false;
const minInstances = config.getNumber("minInstances") || 1;
const maxInstances = config.getNumber("maxInstances") || 2;

// Use configuration in resources
const webServer = new aws.ec2.Instance("web-server", {
    instanceType: instanceType, // From config
    // ... other configuration ...
});

// Pulumi.dev.yaml
// config:
//   environment: dev
//   instanceType: t3.micro
//   dbInstanceClass: db.t3.micro
//   enableMultiAz: false
//   minInstances: 1
//   maxInstances: 2

// Pulumi.prod.yaml
// config:
//   environment: production
//   instanceType: t3.large
//   dbInstanceClass: db.r5.large
//   enableMultiAz: true
//   minInstances: 2
//   maxInstances: 10`}
					language="typescript"
					slideName="createStackConfig"
				audioStartFrame={createStackConfigSlide.start}
				moduleNumber={10}
				audioDuration={audioDurations["createStackConfig"]}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createStackConfigSlide.start + createStackConfigSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Manage Secrets Securely */}
			<Sequence
				from={manageSecretsSlide.start}
				durationInFrames={manageSecretsSlide.duration}
			>
				<Audio src={audioFiles["manageSecrets"]} />
				<CrossFadeWrapper
					totalDuration={manageSecretsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Manage Secrets Securely"
					code={`// Read secrets from configuration
const dbPassword = config.requireSecret("dbPassword");
const apiKey = config.requireSecret("apiKey");

// Use secrets in resources
const dbInstance = new aws.rds.Instance("db", {
    password: dbPassword, // Automatically encrypted
    // ... other configuration ...
});

// Set secrets via CLI (encrypted automatically)
// pulumi config set --secret dbPassword "MySecurePassword123!"
// pulumi config set --secret apiKey "sk-1234567890abcdef"

// Or in Pulumi.{stack}.yaml (encrypted by Pulumi service)
// config:
//   dbPassword:
//     secure: AAABAKdJZXl... (encrypted value)`}
					language="typescript"
					slideName="manageSecrets"
				audioStartFrame={manageSecretsSlide.start}
				moduleNumber={10}
				audioDuration={audioDurations["manageSecrets"]}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={manageSecretsSlide.start + manageSecretsSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Deploy to Multiple Environments */}
			<Sequence
				from={deployMultipleEnvironmentsSlide.start}
				durationInFrames={deployMultipleEnvironmentsSlide.duration}
			>
				<Audio src={audioFiles["deployMultipleEnvironments"]} />
				<CrossFadeWrapper
					totalDuration={deployMultipleEnvironmentsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Deploy to Multiple Environments"
					code={`// Create stacks for each environment
// pulumi stack init dev
// pulumi stack init staging
// pulumi stack init prod

// Set configuration per environment
// pulumi stack select dev
// pulumi config set instanceType t3.micro
// pulumi config set --secret dbPassword dev-password
// pulumi up

// pulumi stack select staging
// pulumi config set instanceType t3.small
// pulumi config set --secret dbPassword staging-password
// pulumi up

// pulumi stack select prod
// pulumi config set instanceType t3.large
// pulumi config set --secret dbPassword prod-password
// pulumi config set enableMultiAz true
// pulumi up

// All use the same code, different configuration!`}
					language="bash"
					slideName="deployMultipleEnvironments"
				audioStartFrame={deployMultipleEnvironmentsSlide.start}
				moduleNumber={10}
				audioDuration={audioDurations["deployMultipleEnvironments"]}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={deployMultipleEnvironmentsSlide.start + deployMultipleEnvironmentsSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Module 10 Summary */}
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
					title="Module 10 Summary"
					points={[
						"Stacks provide isolated environments with separate configuration",
					"Same code, different configs per environment",
					"Secrets are encrypted and handled securely",
					"Write once, deploy everywhere pattern",
					"Next: Advanced Networking Patterns"
					]}
					slideName="summary"
					imageSrc="assets/vpc.svg"
					audioDuration={audioDurations["summary"]}
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
