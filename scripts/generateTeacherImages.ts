// Generate teacher images using RunPod API
// Based on TEACHER.md specifications
// Usage: npx tsx scripts/generateTeacherImages.ts

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const STYLE_BASE = "A simple black-and-white stick-figure school teacher, wearing glasses, a neck tie and standing in front of a wide rectangular whiteboard. Minimal cartoon line art, no shading. Camera: straight-on mid-shot. High-resolution, transparent PNG background.";

interface TeacherAsset {
	id: string;
	prompt: string;
}

const assets: TeacherAsset[] = [
	{
		id: "teacher_body",
		prompt: `${STYLE_BASE}
Draw the teacher's full body and whiteboard, but WITHOUT any arms, WITHOUT any face, and WITHOUT any bullet points or text. Just the teacher's torso, legs, and the whiteboard behind them. Leave space on the left side of the frame for text that will be added separately. Transparent background.`
	},
	{
		id: "arm_0",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's right arm holding a pointer stick. The arm should be positioned so the pointer stick extends toward the LEFT side of the frame, pointing to where the TOP bullet point would be (but do NOT draw any bullet points - just the arm and pointer). The arm should be positioned to align with a teacher's body when layered. Do not draw the rest of the body, no face, no whiteboard. Transparent background.`
	},
	{
		id: "arm_1",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's right arm holding a pointer stick. The arm should be positioned so the pointer stick extends toward the LEFT side of the frame, pointing to where the SECOND bullet point would be (but do NOT draw any bullet points - just the arm and pointer). The arm should be positioned to align with a teacher's body when layered. Do not draw the rest of the body, no face, no whiteboard. Transparent background.`
	},
	{
		id: "arm_2",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's right arm holding a pointer stick. The arm should be positioned so the pointer stick extends toward the LEFT side of the frame, pointing to where the THIRD bullet point would be (but do NOT draw any bullet points - just the arm and pointer). The arm should be positioned to align with a teacher's body when layered. Do not draw the rest of the body, no face, no whiteboard. Transparent background.`
	},
	{
		id: "arm_3",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's right arm holding a pointer stick. The arm should be positioned so the pointer stick extends toward the LEFT side of the frame, pointing to where the FOURTH bullet point would be (but do NOT draw any bullet points - just the arm and pointer). The arm should be positioned to align with a teacher's body when layered. Do not draw the rest of the body, no face, no whiteboard. Transparent background.`
	},
	{
		id: "arm_4",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's right arm holding a pointer stick. The arm should be positioned so the pointer stick extends toward the LEFT side of the frame, pointing to where the FIFTH bullet point would be (but do NOT draw any bullet points - just the arm and pointer). The arm should be positioned to align with a teacher's body when layered. Do not draw the rest of the body, no face, no whiteboard. Transparent background.`
	},
	{
		id: "face_neutral",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's head with a neutral expression (no emotion), no body, no arms, no whiteboard. The head should be positioned to align with a teacher's body when layered. Transparent background.`
	},
	{
		id: "face_happy",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's head with a happy encouraging expression, no body, no arms, no whiteboard. The head should be positioned to align with a teacher's body when layered. Transparent background.`
	},
	{
		id: "face_confused",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's head with a confused / thinking expression, no body, no arms, no whiteboard. The head should be positioned to align with a teacher's body when layered. Transparent background.`
	},
	{
		id: "face_serious",
		prompt: `${STYLE_BASE}
Draw ONLY the teacher's head with a serious / strict expression, no body, no arms, no whiteboard. The head should be positioned to align with a teacher's body when layered. Transparent background.`
	}
];

async function generateImage(asset: TeacherAsset): Promise<void> {
	const apiKey = process.env.RUNPOD_API_KEY;
	if (!apiKey) {
		throw new Error("RUNPOD_API_KEY not found in .env file");
	}

	console.log(`\nGenerating ${asset.id}...`);

	try {
		// Submit job to RunPod
		const response = await fetch("https://api.runpod.ai/v2/wan-2-6-t2i/run", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				input: {
					prompt: asset.prompt,
					size: "1024*1024",
					seed: -1,
					enable_safety_checker: true
				}
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`RunPod API request failed: ${response.status} - ${errorText}`);
		}

		const data = await response.json();

		// Check if job was submitted (returns job ID)
		if (data.id) {
			console.log(`  Job submitted: ${data.id}`);
			console.log(`  Polling for results...`);

			// Poll for completion
			const jobId = data.id;
			const baseUrl = "https://api.runpod.ai/v2/wan-2-6-t2i";
			const statusUrl = `${baseUrl}/status/${jobId}`;

			let attempts = 0;
			const maxAttempts = 60; // Poll for up to 2 minutes

			while (attempts < maxAttempts) {
				await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

				const statusResponse = await fetch(statusUrl, {
					headers: {
						"Authorization": `Bearer ${apiKey}`
					}
				});

				if (!statusResponse.ok) {
					throw new Error(`Status check failed: ${statusResponse.status}`);
				}

				const statusData = await statusResponse.json();
				const status = statusData.status;

				if (status === "COMPLETED") {
					console.log(`  Job completed!`);

					// Extract image from output
					const output = statusData.output;
					
					// RunPod returns image URL in output.result
					const imageData = output?.result;
					
					if (!imageData) {
						console.error(`  Full response:`, JSON.stringify(statusData, null, 2));
						throw new Error("No image URL found in output.result");
					}

					// Save image
					const outputDir = path.join(__dirname, "../public/assets/teacher");
					if (!fs.existsSync(outputDir)) {
						fs.mkdirSync(outputDir, { recursive: true });
					}

					const imagePath = path.join(outputDir, `${asset.id}.png`);

					// Handle base64 or URL
					if (imageData.startsWith("data:image")) {
						// Base64 data URL
						const base64Data = imageData.split(",")[1];
						const buffer = Buffer.from(base64Data, "base64");
						fs.writeFileSync(imagePath, buffer);
					} else if (imageData.startsWith("http")) {
						// URL - download it
						const imageResponse = await fetch(imageData);
						if (!imageResponse.ok) {
							throw new Error(`Failed to download image: ${imageResponse.status}`);
						}
						const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
						fs.writeFileSync(imagePath, imageBuffer);
					} else {
						// Assume it's base64 without data URL prefix
						const buffer = Buffer.from(imageData, "base64");
						fs.writeFileSync(imagePath, buffer);
					}

					console.log(`  Saved: ${imagePath}`);
					return;
				} else if (status === "FAILED" || status === "TIMED_OUT") {
					throw new Error(`Job ${jobId} failed with status: ${status}`);
				}

				attempts++;
			}

			throw new Error(`Job ${jobId} timed out after ${maxAttempts} attempts`);
		} else if (data.output?.image) {
			// Image returned immediately
			console.log(`  Image received immediately`);

			const outputDir = path.join(__dirname, "../public/assets/teacher");
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}

			const imagePath = path.join(outputDir, `${asset.id}.png`);

			// Handle base64 or URL
			if (data.output.image.startsWith("data:image")) {
				const base64Data = data.output.image.split(",")[1];
				const buffer = Buffer.from(base64Data, "base64");
				fs.writeFileSync(imagePath, buffer);
			} else if (data.output.image.startsWith("http")) {
				const imageResponse = await fetch(data.output.image);
				const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
				fs.writeFileSync(imagePath, imageBuffer);
			} else {
				const buffer = Buffer.from(data.output.image, "base64");
				fs.writeFileSync(imagePath, buffer);
			}

			console.log(`  Saved: ${imagePath}`);
		} else {
			throw new Error(`Unexpected response format: ${JSON.stringify(data)}`);
		}
	} catch (error) {
		console.error(`  Error generating ${asset.id}:`, error);
		throw error;
	}
}

async function main() {
	console.log("Generating teacher images using RunPod API...");
	console.log(`Total assets: ${assets.length}\n`);

	const outputDir = path.join(__dirname, "../public/assets/teacher");
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
		console.log(`Created directory: ${outputDir}\n`);
	}

	for (const asset of assets) {
		try {
			await generateImage(asset);
		} catch (error) {
			console.error(`Failed to generate ${asset.id}:`, error);
			console.log("Continuing with next image...\n");
		}
	}

	console.log("\n✅ Teacher image generation complete!");
	console.log(`Images saved to: public/assets/teacher/`);
}

main().catch(console.error);
