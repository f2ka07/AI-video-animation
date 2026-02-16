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

export const Module10: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-10-title": staticFile("audio/agentic-ai-for-beginners/module10-module-10-title.wav"),
		"module-10-concept": staticFile("audio/agentic-ai-for-beginners/module10-module-10-concept.wav"),
		"module-10-architecture": staticFile("audio/agentic-ai-for-beginners/module10-module-10-architecture.wav"),
		"module-10-application": staticFile("audio/agentic-ai-for-beginners/module10-module-10-application.wav"),
		"module-10-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module10-module-10-exam-mapping.wav"),
		"module-10-recap": staticFile("audio/agentic-ai-for-beginners/module10-module-10-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-10-title": getAudioDuration("agentic-ai-for-beginners/module10-module-10-title"),
		"module-10-concept": getAudioDuration("agentic-ai-for-beginners/module10-module-10-concept"),
		"module-10-architecture": getAudioDuration("agentic-ai-for-beginners/module10-module-10-architecture"),
		"module-10-application": getAudioDuration("agentic-ai-for-beginners/module10-module-10-application"),
		"module-10-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module10-module-10-exam-mapping"),
		"module-10-recap": getAudioDuration("agentic-ai-for-beginners/module10-module-10-recap"),
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
	const addSegment = (audioDuration: number, isLastInGroup: boolean, isLastInModule: boolean, buffer: number) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		currentFrame += slideDuration * fps + (isLastInGroup && !isLastInModule ? whooshDuration * fps : 0);
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const seg0 = addSegment(35.35, true, false, 1);
	const seg1 = addSegment(10.00, false, false, 1);
	const seg2 = addSegment(10.00, false, false, 1);
	const seg3 = addSegment(10.00, false, false, 1);
	const seg4 = addSegment(10.00, false, false, 1);
	const seg5 = addSegment(10.00, false, false, 1);
	const seg6 = addSegment(10.00, false, false, 1);
	const seg7 = addSegment(10.00, false, false, 1);
	const seg8 = addSegment(10.00, false, false, 1);
	const seg9 = addSegment(10.00, false, false, 1);
	const seg10 = addSegment(10.00, false, false, 1);
	const seg11 = addSegment(5.26, true, false, 1);
	const seg12 = addSegment(10.00, false, false, 1);
	const seg13 = addSegment(10.00, false, false, 1);
	const seg14 = addSegment(10.00, false, false, 1);
	const seg15 = addSegment(10.00, false, false, 1);
	const seg16 = addSegment(10.00, false, false, 1);
	const seg17 = addSegment(10.00, false, false, 1);
	const seg18 = addSegment(10.00, false, false, 1);
	const seg19 = addSegment(10.00, false, false, 1);
	const seg20 = addSegment(6.43, true, false, 1);
	const seg21 = addSegment(10.00, false, false, 1);
	const seg22 = addSegment(10.00, false, false, 1);
	const seg23 = addSegment(10.00, false, false, 1);
	const seg24 = addSegment(10.00, false, false, 1);
	const seg25 = addSegment(10.00, false, false, 1);
	const seg26 = addSegment(10.00, false, false, 1);
	const seg27 = addSegment(10.00, false, false, 1);
	const seg28 = addSegment(8.72, true, false, 1);
	const seg29 = addSegment(32.76, true, false, 1);
	const seg30 = addSegment(10.00, false, false, 1);
	const seg31 = addSegment(10.00, false, false, 1);
	const seg32 = addSegment(10.00, false, false, 1);
	const seg33 = addSegment(10.00, false, false, 1);
	const seg34 = addSegment(0.54, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Knowledge Integration and RAG */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-10-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Knowledge Integration and RAG" 
					subtitle="Knowledge Integration and RAG"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg0.start + seg0.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg1.start}
				durationInFrames={seg1.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's define the retrieval pipeline end to end Ingestion Documents web pages or data sources enter the system"
					]}
					slideName="module-10-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={10}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Chunk size matters too small"
					]}
					slideName="module-10-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Typical chunk sizes range from 256 to 1024",
					"Metadata is attached"
					]}
					slideName="module-10-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"ID This metadata enables filtering later Embedding",
					"Each chunk is converted to a vector"
					]}
					slideName="module-10-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"The vector captures semantic meaning",
					"Similar content maps to similar vectors Embeddings are stored in a vector"
					]}
					slideName="module-10-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Pinecone Weaviate Chroma or similar",
					"Search When the agent needs context it embeds the query and runs a similarity"
					]}
					slideName="module-10-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Top k retrieval returns the k most similar chunks Hybrid search combines vector similarity with keyword matching"
					]}
					slideName="module-10-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Reranking can refine the results a cross encoder",
					"scores the top candidates and reorders them",
					"The goal return"
					]}
					slideName="module-10-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={70.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(80.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Context injection",
					"Retrieved chunks are formatted and inserted into the model's prompt"
					]}
					slideName="module-10-concept"
					audioDuration={seg9.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={80.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(90.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"This is grounding The model's response is anchored in the retrieved facts not just its parametric knowledge Citations"
					]}
					slideName="module-10-concept"
					audioDuration={seg10.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={90.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-10-concept"]} startFrom={Math.round(100.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"This reduces hallucination and enables verification"
					]}
					slideName="module-10-concept"
					audioDuration={seg11.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={100.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg11.start + seg11.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"When do you use retrieval versus tool calls",
					"Retrieval Use it when the agent needs to search over a knowledge base",
					"What does our policy"
					]}
					slideName="module-10-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={10}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Find relevant documentation for this error",
					"Retrieval is read only semantic and typically fast",
					"What Does Our Policy Say About Refunds"
					]}
					slideName="module-10-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"gets chunks it doesn't execute actions",
					"Tool calls Use it when the agent needs to perform an action or fetch live data"
					]}
					slideName="module-10-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Run this SQL query",
					"Send this email Tools are functions with defined inputs and outputs They can have side",
					"Get The Current Stock Price"
					]}
					slideName="module-10-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"They require validation retries and error handling",
					"Often you need both The agent retrieves context to ground its reasoning"
					]}
					slideName="module-10-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Based on the policy I retrieved I'll process this refund by calling",
					"Structured outputs"
					]}
					slideName="module-10-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"When the model returns a tool call validate the arguments against a schema Reject malformed"
					]}
					slideName="module-10-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"JSON with specific fields enforce the schema",
					"The model might output a stock price"
					]}
					slideName="module-10-architecture"
					audioDuration={seg19.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={70.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-10-architecture"]} startFrom={Math.round(80.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Schema enforcement plus only return data from tool results prevents"
					]}
					slideName="module-10-architecture"
					audioDuration={seg20.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={80.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg20.start + seg20.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-10-application"]} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"How do you build a RAG pipeline from PDFs and web pages Ingestion Extract text from PDFs using",
					"For model matters"
					]}
					slideName="module-10-application"
					audioDuration={seg21.audioDuration}
					moduleNumber={10}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-10-application"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"HTML and keeps content Chunk with overlap for example",
					"tokens per"
					]}
					slideName="module-10-application"
					audioDuration={seg22.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-10-application"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Store metadata source URL page number date Embedding and search Use an embedding"
					]}
					slideName="module-10-application"
					audioDuration={seg23.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-10-application"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"OpenAI Cohere or open source like sentence transformers Store",
					"DB At query time embed"
					]}
					slideName="module-10-application"
					audioDuration={seg24.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-10-application"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"optionally",
					"Return chunks with citations Context injection Format chunks for the prompt"
					]}
					slideName="module-10-application"
					audioDuration={seg25.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-10-application"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"According to Source 1 According to Source 2 Include the source in the output so the user can"
					]}
					slideName="module-10-application"
					audioDuration={seg26.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-10-application"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Validation and retry For tool calls validate inputs against the function schema If invalid return an error"
					]}
					slideName="module-10-application"
					audioDuration={seg27.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-10-application"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Use timeouts and retries for external APIs",
					"Idempotency for actions that shouldn't run twice"
					]}
					slideName="module-10-application"
					audioDuration={seg28.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={70.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg28.start + seg28.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-10-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The certification will test when to use retrieval when to call a tool and how structured outputs guarantee",
					"RAG retrieval augmented generation tool calling schema enforcement validation retry You'll need to explain the retrie..."
					]}
					slideName="module-10-exam-mapping"
					audioDuration={seg29.audioDuration}
					moduleNumber={10}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg29.start + seg29.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-10-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"The retrieval pipeline ingest chunk embed search inject",
					"Each step affects quality Chunk Use"
					]}
					slideName="module-10-recap"
					audioDuration={seg30.audioDuration}
					moduleNumber={10}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-10-recap"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"size top k and reranking are tunable",
					"Ground responses in retrieved facts and cite sources"
					]}
					slideName="module-10-recap"
					audioDuration={seg31.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-10-recap"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Use tools for actions and live data Use both when the agent needs context"
					]}
					slideName="module-10-recap"
					audioDuration={seg32.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-10-recap"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Validate retry and handle errors That's how agents connect to real data without"
					]}
					slideName="module-10-recap"
					audioDuration={seg33.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-10-recap"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"The retrieval pipeline ingest chunk embed search inject",
					"Each step affects quality Chunk size top k and reranking are tunable",
					"Ground responses in retrieved facts and cite sources Use",
					"Use tools for actions and live data Use both when the agent needs context"
					]}
					slideName="module-10-recap"
					audioDuration={seg34.audioDuration}
					moduleNumber={10}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
