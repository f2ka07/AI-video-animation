// Example implementation for Module 2: Project Setup and AWS Credentials
// This demonstrates how to create subsequent modules following the same pattern

import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { ContentSlide } from "../components/ContentSlide";
import { CodeSlide } from "../components/CodeSlide";
import { TransitionSlide } from "../components/TransitionSlide";

export const Module2Example: React.FC = () => {
	const { fps } = useVideoConfig();
	const slideDuration = 8;
	const transitionDuration = 1;

	let currentFrame = 0;

	const addSlide = (duration: number) => {
		const start = currentFrame;
		currentFrame += duration * fps;
		return { start, duration: duration * fps };
	};

	const addTransition = (duration: number) => {
		const start = currentFrame;
		currentFrame += duration * fps;
		return { start, duration: duration * fps };
	};

	return (
		<>
			{/* Title Slide */}
			<Sequence
				from={addSlide(slideDuration).start}
				durationInFrames={addSlide(slideDuration).duration}
			>
				<TitleSlide
					title="Project Setup and AWS Credentials"
					subtitle="Module 2: Getting Started with Pulumi"
				/>
			</Sequence>

			{/* Install Pulumi CLI */}
			<Sequence
				from={addTransition(transitionDuration).start}
				durationInFrames={addTransition(transitionDuration).duration}
			>
				<TransitionSlide text="Installing Pulumi CLI" />
			</Sequence>

			<Sequence
				from={addSlide(slideDuration).start}
				durationInFrames={addSlide(slideDuration).duration}
			>
				<CodeSlide
					title="Install Pulumi CLI"
					code={`# macOS / Linux
curl -fsSL https://get.pulumi.com | sh

# Windows (PowerShell)
(New-Object Net.WebClient).DownloadFile(
  "https://get.pulumi.com/install.ps1",
  "$env:USERPROFILE\\install-pulumi.ps1"
)
& "$env:USERPROFILE\\install-pulumi.ps1"

# Verify installation
pulumi version`}
					language="bash"
				/>
			</Sequence>

			{/* Configure AWS Credentials */}
			<Sequence
				from={addTransition(transitionDuration).start}
				durationInFrames={addTransition(transitionDuration).duration}
			>
				<TransitionSlide text="Configure AWS Credentials" />
			</Sequence>

			<Sequence
				from={addSlide(slideDuration).start}
				durationInFrames={addSlide(slideDuration).duration}
			>
				<CodeSlide
					title="AWS CLI Configuration"
					code={`# Configure AWS CLI with credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1

# Verify configuration
aws sts get-caller-identity`}
					language="bash"
				/>
			</Sequence>

			{/* Create New Project */}
			<Sequence
				from={addTransition(transitionDuration).start}
				durationInFrames={addTransition(transitionDuration).duration}
			>
				<TransitionSlide text="Create New Pulumi Project" />
			</Sequence>

			<Sequence
				from={addSlide(slideDuration * 1.2).start}
				durationInFrames={addSlide(slideDuration * 1.2).duration}
			>
				<CodeSlide
					title="Initialize Pulumi Project"
					code={`# Create a new Pulumi project
pulumi new aws-typescript

# This will prompt for:
# - project name
# - project description
# - stack name (default: dev)

# Project structure created:
# - index.ts          (main infrastructure code)
# - Pulumi.yaml       (project metadata)
# - Pulumi.dev.yaml   (stack configuration)
# - package.json      (dependencies)
# - tsconfig.json     (TypeScript config)`}
					language="bash"
				/>
			</Sequence>

			{/* Initial Deploy */}
			<Sequence
				from={addTransition(transitionDuration).start}
				durationInFrames={addTransition(transitionDuration).duration}
			>
				<TransitionSlide text="Initial Deployment Test" />
			</Sequence>

			<Sequence
				from={addSlide(slideDuration).start}
				durationInFrames={addSlide(slideDuration).duration}
			>
				<ContentSlide
					title="Verify Connectivity"
					points={[
						"Run pulumi preview to see planned changes",
						"Review the execution plan carefully",
						"Run pulumi up to deploy infrastructure",
						"Confirm resources in AWS Console",
						"Test that everything works as expected",
					]}
				/>
			</Sequence>

			{/* Summary */}
			<Sequence
				from={addTransition(transitionDuration).start}
				durationInFrames={addTransition(transitionDuration).duration}
			>
				<TransitionSlide text="Module 2 Summary" />
			</Sequence>

			<Sequence
				from={addSlide(slideDuration).start}
				durationInFrames={addSlide(slideDuration).duration}
			>
				<ContentSlide
					title="Module 2 Summary"
					points={[
						"Pulumi CLI installed and configured",
						"AWS credentials configured for access",
						"New project initialized with TypeScript template",
						"Initial deployment verified connectivity",
						"Next: Provision a VPC stack",
					]}
				/>
			</Sequence>
		</>
	);
};
