// Test script to extract and display bulletStarts for a specific slide
// Usage: npx tsx scripts/testBulletStarts.ts [courseId] [moduleNumber] [slideName]
// Example: npx tsx scripts/testBulletStarts.ts agentic-ai-for-beginners 1 module-1-concept

import * as path from "path";
import * as fs from "fs";
import { loadModuleTimings } from "./saveTimingsJson";
import { extractModuleBulletStarts, getModuleContentForBullets } from "./extractBulletStartsFromTimings";

const courseId = process.argv[2] || "agentic-ai-for-beginners";
const moduleNumber = parseInt(process.argv[3] || "1");
const slideName = process.argv[4] || "module-1-concept";

console.log("=".repeat(80));
console.log(`Testing BulletStarts Extraction`);
console.log("=".repeat(80));
console.log(`Course: ${courseId}`);
console.log(`Module: ${moduleNumber}`);
console.log(`Slide: ${slideName}\n`);

// Load module content (content.json, moduleContent.ts, or scripts + ModuleN.tsx)
const module = getModuleContentForBullets(courseId, moduleNumber);
if (!module) {
	console.error(`❌ No module content found for ${courseId} module ${moduleNumber}`);
	console.error(`   Check: content.json, moduleContent.ts, or course/scripts + Module${moduleNumber}.tsx`);
	process.exit(1);
}

const slide = module.slides.find(s => s.name === slideName);
if (!slide) {
	console.error(`❌ Slide ${slideName} not found in module ${moduleNumber}`);
	console.error(`   Available slides: ${module.slides.map(s => s.name).join(", ")}`);
	process.exit(1);
}

if (!slide.points || slide.points.length < 5) {
	console.error(`❌ Slide ${slideName} doesn't have 5 bullet points`);
	console.error(`   Found ${slide.points?.length || 0} points`);
	process.exit(1);
}

console.log(`\n📋 Bullet Points:`);
slide.points.slice(0, 5).forEach((point, i) => {
	const first3Words = point.split(/\s+/).slice(0, 3).join(" ");
	console.log(`   ${i + 1}. ${first3Words}...`);
});

// Load word timings
const timings = loadModuleTimings(courseId, moduleNumber);
if (!timings || !timings.slides[slideName] || !timings.slides[slideName].words) {
	console.error(`\n❌ No word timings found for ${slideName}`);
	console.error(`   Run: npm run extract-timings-gentle ${moduleNumber} ${courseId}`);
	process.exit(1);
}

const words = timings.slides[slideName].words;
console.log(`\n📊 Word Timings:`);
console.log(`   Total words: ${words.length}`);
console.log(`   Duration: ${words[words.length - 1].end.toFixed(2)}s`);
console.log(`   First 10 words: ${words.slice(0, 10).map(w => w.text).join(" ")}`);

// Extract bulletStarts
console.log(`\n🔍 Extracting bulletStarts...\n`);
extractModuleBulletStarts(courseId, moduleNumber);

// Load and display results
const bulletStartsPath = path.join(
	__dirname,
	"../courses",
	courseId,
	"timings",
	`module${moduleNumber}-bulletStarts.json`
);

if (fs.existsSync(bulletStartsPath)) {
	const bulletStartsData = JSON.parse(fs.readFileSync(bulletStartsPath, "utf-8"));
	const starts = bulletStartsData[slideName];
	
	if (starts && starts.length === 5) {
		console.log("\n" + "=".repeat(80));
		console.log(`✅ BulletStarts for ${slideName}:`);
		console.log("=".repeat(80));
		console.log(`\nbulletStarts={[${starts.map((t: number) => t.toFixed(2)).join(", ")}]}\n`);
		
		console.log(`Bullet Points with Timings:`);
		slide.points.slice(0, 5).forEach((point, i) => {
			const first3Words = point.split(/\s+/).slice(0, 3).join(" ");
			console.log(`   ${i + 1}. [${starts[i].toFixed(2)}s] ${first3Words}...`);
		});
		
		console.log(`\n💡 Copy this to Module${moduleNumber}.tsx:`);
		console.log(`   bulletStarts={[${starts.map((t: number) => t.toFixed(2)).join(", ")}]}`);
	} else {
		console.error(`❌ Invalid bulletStarts for ${slideName}`);
	}
} else {
	console.error(`❌ BulletStarts file not found: ${bulletStartsPath}`);
}
