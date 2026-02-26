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

export const Module12: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		title: staticFile("audio/aws-pulumi/module12-title.wav"),
		cicdBasics: staticFile("audio/aws-pulumi/module12-cicdBasics.wav"),
		githubActionsWorkflow: staticFile("audio/aws-pulumi/module12-githubActionsWorkflow.wav"),
		testingStrategies: staticFile("audio/aws-pulumi/module12-testingStrategies.wav"),
		securityBestPractices: staticFile("audio/aws-pulumi/module12-securityBestPractices.wav"),
		productionChecklist: staticFile("audio/aws-pulumi/module12-productionChecklist.wav"),
		summary: staticFile("audio/aws-pulumi/module12-summary.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		title: getAudioDuration("aws-pulumi/module12-title"),
		cicdBasics: getAudioDuration("aws-pulumi/module12-cicdBasics"),
		githubActionsWorkflow: getAudioDuration("aws-pulumi/module12-githubActionsWorkflow"),
		testingStrategies: getAudioDuration("aws-pulumi/module12-testingStrategies"),
		securityBestPractices: getAudioDuration("aws-pulumi/module12-securityBestPractices"),
		productionChecklist: getAudioDuration("aws-pulumi/module12-productionChecklist"),
		summary: getAudioDuration("aws-pulumi/module12-summary"),
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
	const cicdBasicsSlide = addSlide(audioDurations["cicdBasics"], false, 1.0);
	const githubActionsWorkflowSlide = addSlide(audioDurations["githubActionsWorkflow"], false, 1.0);
	const testingStrategiesSlide = addSlide(audioDurations["testingStrategies"], false, 1.0);
	const securityBestPracticesSlide = addSlide(audioDurations["securityBestPractices"], false, 1.0);
	const productionChecklistSlide = addSlide(audioDurations["productionChecklist"], false, 1.0);
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
					title="CI/CD Integration and Best Practices" 
					subtitle="Production-Ready Workflows"
					
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

			{/* CI/CD for Infrastructure as Code */}
			<Sequence
				from={cicdBasicsSlide.start}
				durationInFrames={cicdBasicsSlide.duration}
			>
				<Audio src={audioFiles["cicdBasics"]} />
				<CrossFadeWrapper
					totalDuration={cicdBasicsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="CI/CD for Infrastructure as Code"
					points={[
						"Automate infrastructure deployments",
					"Run tests and validation on every change",
					"Consistent, repeatable deployment process",
					"Infrastructure changes go through code review",
					"Reduces human error and deployment time"
					]}
					slideName="cicdBasics"
					audioDuration={cicdBasicsSlide.audioDuration}
					moduleNumber={12}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={cicdBasicsSlide.start + cicdBasicsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* GitHub Actions Workflow for Pulumi */}
			<Sequence
				from={githubActionsWorkflowSlide.start}
				durationInFrames={githubActionsWorkflowSlide.duration}
			>
				<Audio src={audioFiles["githubActionsWorkflow"]} />
				<CrossFadeWrapper
					totalDuration={githubActionsWorkflowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="GitHub Actions Workflow for Pulumi"
					code={`# .github/workflows/pulumi.yml
name: Pulumi Infrastructure

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM for drift detection

jobs:
  preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Pulumi CLI
        uses: pulumi/actions@v3
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Pulumi Preview
        run: pulumi preview --stack dev
        env:
          PULUMI_ACCESS_TOKEN: \${{ secrets.PULUMI_ACCESS_TOKEN }}

  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: []
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Pulumi CLI
        uses: pulumi/actions@v3
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Pulumi Up
        run: pulumi up --stack dev --yes
        env:
          PULUMI_ACCESS_TOKEN: \${{ secrets.PULUMI_ACCESS_TOKEN }}`}
					language="yaml"
					slideName="githubActionsWorkflow"
					audioStartFrame={githubActionsWorkflowSlide.start}
					audioDuration={githubActionsWorkflowSlide.audioDuration}
					moduleNumber={12}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={githubActionsWorkflowSlide.start + githubActionsWorkflowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Infrastructure Testing Strategies */}
			<Sequence
				from={testingStrategiesSlide.start}
				durationInFrames={testingStrategiesSlide.duration}
			>
				<Audio src={audioFiles["testingStrategies"]} />
				<CrossFadeWrapper
					totalDuration={testingStrategiesSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Infrastructure Testing Strategies"
					points={[
						"Unit tests: Validate resources and functions",
					"Integration tests: Deploy and verify in test environment",
					"Policy as Code: Enforce security and compliance",
					"Catch errors before production deployment",
					"Ensure infrastructure correctness and security"
					]}
					slideName="testingStrategies"
					audioDuration={testingStrategiesSlide.audioDuration}
					moduleNumber={12}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={testingStrategiesSlide.start + testingStrategiesSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Security Best Practices */}
			<Sequence
				from={securityBestPracticesSlide.start}
				durationInFrames={securityBestPracticesSlide.duration}
			>
				<Audio src={audioFiles["securityBestPractices"]} />
				<CrossFadeWrapper
					totalDuration={securityBestPracticesSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Security Best Practices"
					code={`// Security Best Practices Checklist:

// 1. Use Pulumi secrets for sensitive values
const dbPassword = config.requireSecret("dbPassword");

// 2. Enable deletion protection on critical resources
const db = new aws.rds.Instance("db", {
    deletionProtection: true, // Prevent accidental deletion
    // ...
});

// 3. Use least privilege IAM roles
const role = new aws.iam.Role("role", {
    // Only grant necessary permissions
});

// 4. Enable encryption
const s3Bucket = new aws.s3.Bucket("bucket", {
    serverSideEncryptionConfiguration: {
        rule: {
            applyServerSideEncryptionByDefault: {
                sseAlgorithm: "AES256",
            },
        },
    },
});

// 5. Use separate stacks per environment
// pulumi stack init dev
// pulumi stack init prod

// 6. Enable audit logging
// Configure in Pulumi Cloud or use AWS CloudTrail

// 7. Review preview before applying
// Always run: pulumi preview --stack prod`}
					language="typescript"
					slideName="securityBestPractices"
					audioStartFrame={securityBestPracticesSlide.start}
					audioDuration={securityBestPracticesSlide.audioDuration}
					moduleNumber={12}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={securityBestPracticesSlide.start + securityBestPracticesSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Production Readiness Checklist */}
			<Sequence
				from={productionChecklistSlide.start}
				durationInFrames={productionChecklistSlide.duration}
			>
				<Audio src={audioFiles["productionChecklist"]} />
				<CrossFadeWrapper
					totalDuration={productionChecklistSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Production Readiness Checklist"
					points={[
						"Version control and code reviews for all infrastructure",
					"CI/CD pipelines for automated deployments",
					"Separate stacks per environment",
					"Monitoring, alerting, and disaster recovery",
					"Documentation and team training"
					]}
					slideName="productionChecklist"
					audioDuration={productionChecklistSlide.audioDuration}
					moduleNumber={12}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={productionChecklistSlide.start + productionChecklistSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Course Summary and Next Steps */}
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
					title="Course Summary and Next Steps"
					points={[
						"Complete AWS infrastructure with Pulumi and TypeScript",
					"Production-ready patterns and best practices",
					"Multi-environment management and CI/CD integration",
					"Security, testing, and monitoring strategies",
					"Ready to build real-world infrastructure!"
					]}
					slideName="summary"
					audioDuration={summarySlide.audioDuration}
					moduleNumber={12}
					
					imageSrc="assets/region.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
