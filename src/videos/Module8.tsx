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
export const Module8: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		title: staticFile("audio/module8-title.wav"),
		rdsBasics: staticFile("audio/module8-rdsBasics.wav"),
		createDBSubnetGroup: staticFile("audio/module8-createDBSubnetGroup.wav"),
		createDBParameterGroup: staticFile("audio/module8-createDBParameterGroup.wav"),
		createDBInstance: staticFile("audio/module8-createDBInstance.wav"),
		summary: staticFile("audio/module8-summary.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		title: getAudioDuration("module8-title"),
		rdsBasics: getAudioDuration("module8-rdsBasics"),
		createDBSubnetGroup: getAudioDuration("module8-createDBSubnetGroup"),
		createDBParameterGroup: getAudioDuration("module8-createDBParameterGroup"),
		createDBInstance: getAudioDuration("module8-createDBInstance"),
		summary: getAudioDuration("module8-summary"),
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
	const rdsBasicsSlide = addSlide(audioDurations["rdsBasics"]);
	const createDBSubnetGroupSlide = addSlide(audioDurations["createDBSubnetGroup"]);
	const createDBParameterGroupSlide = addSlide(audioDurations["createDBParameterGroup"]);
	const createDBInstanceSlide = addSlide(audioDurations["createDBInstance"]);
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
					<TitleSlide title="RDS Database in Private Subnets" subtitle="Module 8: Secure Database Deployment" />
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={titleSlide.start + titleSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Amazon RDS: Managed Database Service */}
			<Sequence
				from={rdsBasicsSlide.start}
				durationInFrames={rdsBasicsSlide.duration}
			>
				<Audio src={audioFiles["rdsBasics"]} />
				<CrossFadeWrapper
					totalDuration={rdsBasicsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Amazon RDS: Managed Database Service"
					points={[
						"Managed service for relational databases",
					"Supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server",
					"Automatic backups, patching, and monitoring",
					"Multi-AZ for high availability",
					"Always deploy in private subnets"
					]}
					slideName="rdsBasics"
					imageSrc="assets/vpc.svg"
					audioDuration={audioDurations["rdsBasics"]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={rdsBasicsSlide.start + rdsBasicsSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create DB Subnet Group */}
			<Sequence
				from={createDBSubnetGroupSlide.start}
				durationInFrames={createDBSubnetGroupSlide.duration}
			>
				<Audio src={audioFiles["createDBSubnetGroup"]} />
				<CrossFadeWrapper
					totalDuration={createDBSubnetGroupSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create DB Subnet Group"
					code={`// DB Subnet Group defines which subnets RDS can use
// Must span at least 2 AZs for high availability
const dbSubnetGroup = new aws.rds.SubnetGroup("db-subnet-group", {
    name: "main-db-subnet-group",
    subnetIds: [privateSubnet1.id, privateSubnet2.id],
    tags: {
        Name: "main-db-subnet-group",
    },
});`}
					language="typescript"
					slideName="createDBSubnetGroup"
				audioStartFrame={createDBSubnetGroupSlide.start}
				moduleNumber={8}
				audioDuration={audioDurations["createDBSubnetGroup"]}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createDBSubnetGroupSlide.start + createDBSubnetGroupSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create DB Parameter Group */}
			<Sequence
				from={createDBParameterGroupSlide.start}
				durationInFrames={createDBParameterGroupSlide.duration}
			>
				<Audio src={audioFiles["createDBParameterGroup"]} />
				<CrossFadeWrapper
					totalDuration={createDBParameterGroupSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create DB Parameter Group"
					code={`// Parameter Group customizes database engine settings
const dbParameterGroup = new aws.rds.ParameterGroup("db-params", {
    family: "mysql8.0",
    name: "main-db-params",
    parameters: [
        {
            name: "max_connections",
            value: "100",
        },
        {
            name: "character_set_server",
            value: "utf8mb4",
        },
    ],
    tags: {
        Name: "main-db-params",
    },
});`}
					language="typescript"
					slideName="createDBParameterGroup"
				audioStartFrame={createDBParameterGroupSlide.start}
				moduleNumber={8}
				audioDuration={audioDurations["createDBParameterGroup"]}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createDBParameterGroupSlide.start + createDBParameterGroupSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Create RDS MySQL Database Instance */}
			<Sequence
				from={createDBInstanceSlide.start}
				durationInFrames={createDBInstanceSlide.duration}
			>
				<Audio src={audioFiles["createDBInstance"]} />
				<CrossFadeWrapper
					totalDuration={createDBInstanceSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Create RDS MySQL Database Instance"
					code={`// RDS MySQL database instance in private subnets
const dbInstance = new aws.rds.Instance("main-db", {
    engine: "mysql",
    engineVersion: "8.0",
    instanceClass: "db.t3.micro",
    allocatedStorage: 20,
    storageType: "gp3",
    
    dbName: "appdb",
    username: "admin",
    password: "ChangeMe123!", // Use Pulumi secrets in production
    
    dbSubnetGroupName: dbSubnetGroup.name,
    vpcSecurityGroupIds: [dbSg.id],
    parameterGroupName: dbParameterGroup.name,
    
    publiclyAccessible: false, // Security best practice
    multiAz: false, // Enable for production
    backupRetentionPeriod: 7,
    backupWindow: "03:00-04:00",
    maintenanceWindow: "sun:04:00-sun:05:00",
    
    deletionProtection: false, // Set to true in production
    skipFinalSnapshot: true, // Set to false in production
    
    tags: {
        Name: "main-database",
    },
});

// Export database endpoint for application connection
export const dbEndpoint = dbInstance.endpoint;`}
					language="typescript"
					slideName="createDBInstance"
				audioStartFrame={createDBInstanceSlide.start}
				moduleNumber={8}
				audioDuration={audioDurations["createDBInstance"]}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={createDBInstanceSlide.start + createDBInstanceSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Module 8 Summary */}
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
					title="Module 8 Summary"
					points={[
						"DB Subnet Group spans private subnets in multiple AZs",
					"DB Parameter Group customizes database engine settings",
					"RDS instance in private subnets with database security group",
					"Automated backups and Multi-AZ support available",
					"Next: Outputs and Stack References"
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
