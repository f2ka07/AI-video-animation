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

export const Module11: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		title: staticFile("audio/aws-pulumi/module11-title.wav"),
		vpcPeeringBasics: staticFile("audio/aws-pulumi/module11-vpcPeeringBasics.wav"),
		createVPCPeering: staticFile("audio/aws-pulumi/module11-createVPCPeering.wav"),
		transitGatewayBasics: staticFile("audio/aws-pulumi/module11-transitGatewayBasics.wav"),
		createTransitGateway: staticFile("audio/aws-pulumi/module11-createTransitGateway.wav"),
		summary: staticFile("audio/aws-pulumi/module11-summary.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		title: getAudioDuration("aws-pulumi/module11-title"),
		vpcPeeringBasics: getAudioDuration("aws-pulumi/module11-vpcPeeringBasics"),
		createVPCPeering: getAudioDuration("aws-pulumi/module11-createVPCPeering"),
		transitGatewayBasics: getAudioDuration("aws-pulumi/module11-transitGatewayBasics"),
		createTransitGateway: getAudioDuration("aws-pulumi/module11-createTransitGateway"),
		summary: getAudioDuration("aws-pulumi/module11-summary"),
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
	const vpcPeeringBasicsSlide = addSlide(audioDurations["vpcPeeringBasics"], false, 1.0);
	const createVPCPeeringSlide = addSlide(audioDurations["createVPCPeering"], false, 1.0);
	const transitGatewayBasicsSlide = addSlide(audioDurations["transitGatewayBasics"], false, 1.0);
	const createTransitGatewaySlide = addSlide(audioDurations["createTransitGateway"], false, 1.0);
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
					title="Advanced Networking Patterns" 
					subtitle="VPC Peering and Transit Gateway"
					
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

			{/* VPC Peering: Direct VPC Connections */}
			<Sequence
				from={vpcPeeringBasicsSlide.start}
				durationInFrames={vpcPeeringBasicsSlide.duration}
			>
				<Audio src={audioFiles["vpcPeeringBasics"]} />
				<CrossFadeWrapper
					totalDuration={vpcPeeringBasicsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="VPC Peering: Direct VPC Connections"
					points={[
						"Direct connection between two VPCs",
					"One-to-one relationship (non-transitive)",
					"Works within same region or across regions",
					"Cost-effective for simple connections",
					"Requires route table configuration"
					]}
					slideName="vpcPeeringBasics"
					audioDuration={vpcPeeringBasicsSlide.audioDuration}
					moduleNumber={11}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={vpcPeeringBasicsSlide.start + vpcPeeringBasicsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create VPC Peering Connection */}
			<Sequence
				from={createVPCPeeringSlide.start}
				durationInFrames={createVPCPeeringSlide.duration}
			>
				<Audio src={audioFiles["createVPCPeering"]} />
				<CrossFadeWrapper
					totalDuration={createVPCPeeringSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create VPC Peering Connection"
					code={`// VPC Peering between two VPCs
const vpc1 = new aws.ec2.Vpc("vpc1", {
    cidrBlock: "10.0.0.0/16",
    // ... configuration ...
});

const vpc2 = new aws.ec2.Vpc("vpc2", {
    cidrBlock: "10.1.0.0/16",
    // ... configuration ...
});

// Create peering connection
const peering = new aws.ec2.VpcPeeringConnection("vpc-peering", {
    vpcId: vpc1.id,
    peerVpcId: vpc2.id,
    autoAccept: true, // Auto-accept if same account
    tags: {
        Name: "vpc1-to-vpc2",
    },
});

// Add routes in VPC1 to reach VPC2
const vpc1Route = new aws.ec2.Route("vpc1-to-vpc2", {
    routeTableId: vpc1RouteTable.id,
    destinationCidrBlock: "10.1.0.0/16", // VPC2's CIDR
    vpcPeeringConnectionId: peering.id,
});

// Add routes in VPC2 to reach VPC1
const vpc2Route = new aws.ec2.Route("vpc2-to-vpc1", {
    routeTableId: vpc2RouteTable.id,
    destinationCidrBlock: "10.0.0.0/16", // VPC1's CIDR
    vpcPeeringConnectionId: peering.id,
});`}
					language="typescript"
					slideName="createVPCPeering"
					audioStartFrame={createVPCPeeringSlide.start}
					audioDuration={createVPCPeeringSlide.audioDuration}
					moduleNumber={11}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createVPCPeeringSlide.start + createVPCPeeringSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Transit Gateway: Centralized Hub */}
			<Sequence
				from={transitGatewayBasicsSlide.start}
				durationInFrames={transitGatewayBasicsSlide.duration}
			>
				<Audio src={audioFiles["transitGatewayBasics"]} />
				<CrossFadeWrapper
					totalDuration={transitGatewayBasicsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Transit Gateway: Centralized Hub"
					points={[
						"Central hub for connecting multiple VPCs",
					"Transitive routing (hub-and-spoke topology)",
					"Supports VPCs, VPNs, and Direct Connect",
					"Scales to thousands of attachments",
					"Centralized routing and management"
					]}
					slideName="transitGatewayBasics"
					audioDuration={transitGatewayBasicsSlide.audioDuration}
					moduleNumber={11}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={transitGatewayBasicsSlide.start + transitGatewayBasicsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create Transit Gateway with VPC Attachments */}
			<Sequence
				from={createTransitGatewaySlide.start}
				durationInFrames={createTransitGatewaySlide.duration}
			>
				<Audio src={audioFiles["createTransitGateway"]} />
				<CrossFadeWrapper
					totalDuration={createTransitGatewaySlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create Transit Gateway with VPC Attachments"
					code={`// Create Transit Gateway
const tgw = new aws.ec2.TransitGateway("main-tgw", {
    description: "Main Transit Gateway",
    amazonSideAsn: 64512,
    tags: {
        Name: "main-tgw",
    },
});

// Attach VPC1 to Transit Gateway
const vpc1Attachment = new aws.ec2.TransitGatewayVpcAttachment("vpc1-attachment", {
    subnetIds: [vpc1Subnet1.id, vpc1Subnet2.id],
    transitGatewayId: tgw.id,
    vpcId: vpc1.id,
    tags: {
        Name: "vpc1-attachment",
    },
});

// Attach VPC2 to Transit Gateway
const vpc2Attachment = new aws.ec2.TransitGatewayVpcAttachment("vpc2-attachment", {
    subnetIds: [vpc2Subnet1.id, vpc2Subnet2.id],
    transitGatewayId: tgw.id,
    vpcId: vpc2.id,
    tags: {
        Name: "vpc2-attachment",
    },
});

// Create Transit Gateway route table
const tgwRouteTable = new aws.ec2.TransitGatewayRouteTable("main-tgw-rt", {
    transitGatewayId: tgw.id,
    tags: {
        Name: "main-tgw-rt",
    },
});

// Associate attachments with route table
const vpc1Association = new aws.ec2.TransitGatewayRouteTableAssociation("vpc1-assoc", {
    transitGatewayAttachmentId: vpc1Attachment.id,
    transitGatewayRouteTableId: tgwRouteTable.id,
});

const vpc2Association = new aws.ec2.TransitGatewayRouteTableAssociation("vpc2-assoc", {
    transitGatewayAttachmentId: vpc2Attachment.id,
    transitGatewayRouteTableId: tgwRouteTable.id,
});

// Add routes in VPC route tables to reach other VPCs via TGW
const vpc1ToVpc2Route = new aws.ec2.Route("vpc1-to-vpc2-via-tgw", {
    routeTableId: vpc1RouteTable.id,
    destinationCidrBlock: "10.1.0.0/16",
    transitGatewayId: tgw.id,
});`}
					language="typescript"
					slideName="createTransitGateway"
					audioStartFrame={createTransitGatewaySlide.start}
					audioDuration={createTransitGatewaySlide.audioDuration}
					moduleNumber={11}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createTransitGatewaySlide.start + createTransitGatewaySlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Module 11 Summary */}
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
						"VPC Peering: Direct, one-to-one VPC connections",
					"Transit Gateway: Centralized hub for multiple VPCs",
					"Both require route table configuration",
					"Choose peering for simple, TGW for complex architectures",
					"Next: CI/CD Integration and Best Practices"
					]}
					slideName="summary"
					audioDuration={summarySlide.audioDuration}
					moduleNumber={11}
					
					imageSrc="assets/vpc.svg"
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
