// Direct test of Gentle API to debug the issue
// Run: tsx scripts/testGentleDirect.ts

import * as fs from "fs";
import * as path from "path";

const FormData = require("form-data");

// Use node-fetch for Node.js compatibility
let fetch: any;
try {
	// Try built-in fetch first (Node 18+)
	fetch = globalThis.fetch;
	if (!fetch) {
		fetch = require("node-fetch");
	}
} catch {
	// Fallback
	fetch = require("node-fetch");
}

async function testGentle() {
	const gentleUrl = "http://localhost:8765";
	const audioPath = path.join(__dirname, "../public/audio/module1-title.wav");
	const script = "If you deploy on AWS and you're still clicking around in the console, you're wasting time and introducing risk.";
	
	if (!fs.existsSync(audioPath)) {
		console.error(`Audio file not found: ${audioPath}`);
		return;
	}
	
	console.log("Testing Gentle API directly...\n");
	console.log(`Audio: ${audioPath}`);
	console.log(`Script: ${script}\n`);
	
	// Try both approaches: stream and buffer
	const useBuffer = process.argv.includes("--buffer");
	
	const formData = new FormData();
	
	if (useBuffer) {
		// Read file as buffer
		const audioBuffer = fs.readFileSync(audioPath);
		formData.append("audio", audioBuffer, {
			filename: "module1-title.wav",
			contentType: "audio/wav",
		});
		console.log("Using buffer approach...\n");
	} else {
		// Use stream (default)
		formData.append("audio", fs.createReadStream(audioPath), {
			filename: "module1-title.wav",
			contentType: "audio/wav",
		});
		console.log("Using stream approach...\n");
	}
	
	formData.append("transcript", script);
	
	const headers = formData.getHeaders();
	
	try {
		console.log("Sending request to Gentle...");
		const response = await fetch(`${gentleUrl}/transcriptions?async=false`, {
			method: "POST",
			body: formData,
			headers,
		});
		
		console.log(`Response status: ${response.status} ${response.statusText}`);
		
		const text = await response.text();
		console.log(`Response length: ${text.length} bytes\n`);
		
		if (response.ok) {
			const data = JSON.parse(text);
			console.log("✅ Success!");
			console.log(`Words found: ${data.words?.length || 0}\n`);
			
			if (data.words && data.words.length > 0) {
				console.log("First few words:");
				data.words.slice(0, 5).forEach((w: any) => {
					console.log(`  "${w.word}" at ${w.start.toFixed(2)}s - ${w.end.toFixed(2)}s`);
				});
			}
		} else {
			console.error("❌ Error response:");
			console.error(text.substring(0, 2000));
			
			// Try to extract Python error if present
			const errorMatch = text.match(/<div class="error">([^<]+)<\/div>/);
			if (errorMatch) {
				console.error("\nPython Error:", errorMatch[1]);
			}
		}
	} catch (error: any) {
		console.error("❌ Request failed:");
		console.error(error.message);
		console.error("\nMake sure Gentle is running:");
		console.error("  docker ps | grep gentle");
		console.error("  or: npm run check-gentle");
	}
}

testGentle().catch(console.error);
