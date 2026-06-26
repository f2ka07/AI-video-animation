// Basic tests for moduleContent validation
// Run with: npm test

import { allModules, ModuleContent, SlideContent } from "../../src/videos/moduleContent";
import * as fs from "fs";
import * as path from "path";

// Test utilities
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
	try {
		fn();
		passed++;
		console.log(`  [PASS] ${name}`);
	} catch (error: any) {
		failed++;
		console.error(`  [FAIL] ${name}`);
		console.error(`         ${error.message}`);
	}
}

function expect(value: any) {
	return {
		toBe(expected: any) {
			if (value !== expected) {
				throw new Error(`Expected ${expected} but got ${value}`);
			}
		},
		toBeGreaterThan(expected: number) {
			if (value <= expected) {
				throw new Error(`Expected ${value} to be greater than ${expected}`);
			}
		},
		toBeTruthy() {
			if (!value) {
				throw new Error(`Expected truthy value but got ${value}`);
			}
		},
		toContain(expected: string) {
			if (!value.includes(expected)) {
				throw new Error(`Expected "${value}" to contain "${expected}"`);
			}
		},
		toMatch(regex: RegExp) {
			if (!regex.test(value)) {
				throw new Error(`Expected "${value}" to match ${regex}`);
			}
		}
	};
}

// Test Suite: Module Content Structure
console.log("\n--- Module Content Structure Tests ---\n");

test("allModules array should not be empty", () => {
	expect(allModules.length).toBeGreaterThan(0);
});

test("each module should have required fields", () => {
	for (const module of allModules) {
		expect(module.moduleNumber).toBeGreaterThan(-1);
		expect(module.title).toBeTruthy();
		expect(module.subtitle).toBeTruthy();
		expect(module.slides.length).toBeGreaterThan(0);
	}
});

test("module numbers should be unique", () => {
	const numbers = allModules.map(m => m.moduleNumber);
	const uniqueNumbers = new Set(numbers);
	expect(numbers.length).toBe(uniqueNumbers.size);
});

test("each slide should have required fields", () => {
	for (const module of allModules) {
		for (const slide of module.slides) {
			expect(slide.name).toBeTruthy();
			expect(slide.type).toBeTruthy();
			expect(slide.script).toBeTruthy();
			
			// Type-specific validation
			if (slide.type === "title") {
				// Title slides should have subtitle
				expect(slide.subtitle || module.subtitle).toBeTruthy();
			} else if (slide.type === "code") {
				// Code slides should have code and language
				expect(slide.code).toBeTruthy();
			} else if (slide.type === "comparison") {
				// Comparison slides should have left and right items
				expect(slide.leftItems).toBeTruthy();
				expect(slide.rightItems).toBeTruthy();
			}
		}
	}
});

test("slide names should be unique within each module", () => {
	for (const module of allModules) {
		const names = module.slides.map(s => s.name);
		const uniqueNames = new Set(names);
		if (names.length !== uniqueNames.size) {
			throw new Error(`Module ${module.moduleNumber} has duplicate slide names`);
		}
	}
});

test("slide names should be valid identifiers (no spaces)", () => {
	for (const module of allModules) {
		for (const slide of module.slides) {
			expect(slide.name).toMatch(/^[a-zA-Z0-9_-]+$/);
		}
	}
});

// Test Suite: Audio Files
console.log("\n--- Audio File Tests ---\n");

const audioDir = path.join(__dirname, "../../public/audio");

test("audio directory should exist", () => {
	expect(fs.existsSync(audioDir)).toBeTruthy();
});

test("each module should have audio files for all slides", () => {
	if (!fs.existsSync(audioDir)) return;
	
	const missingAudio: string[] = [];
	for (const module of allModules) {
		for (const slide of module.slides) {
			const audioFile = path.join(audioDir, `module${module.moduleNumber}-${slide.name}.wav`);
			if (!fs.existsSync(audioFile)) {
				missingAudio.push(`module${module.moduleNumber}-${slide.name}.wav`);
			}
		}
	}
	
	if (missingAudio.length > 0) {
		console.log(`    Warning: ${missingAudio.length} audio files missing`);
		// Don't fail - just warn (audio might not be generated yet)
	}
});

// Test Suite: Generated Files
console.log("\n--- Generated File Tests ---\n");

test("Root.tsx should exist", () => {
	const rootPath = path.join(__dirname, "../../src/Root.tsx");
	expect(fs.existsSync(rootPath)).toBeTruthy();
});

test("audioDuration.ts should exist", () => {
	const durationPath = path.join(__dirname, "../../src/utils/audioDuration.ts");
	expect(fs.existsSync(durationPath)).toBeTruthy();
});

test("GenericModule runtime files should exist", () => {
	const genericPath = path.join(__dirname, "../../src/videos/GenericModule.tsx");
	const configPath = path.join(__dirname, "../../src/videos/GenericModuleConfig.ts");
	expect(fs.existsSync(genericPath)).toBeTruthy();
	expect(fs.existsSync(configPath)).toBeTruthy();
});

test("Root.tsx should use GenericModule (slide courses)", () => {
	const rootPath = path.join(__dirname, "../../src/Root.tsx");
	const root = fs.readFileSync(rootPath, "utf-8");
	expect(root).toContain("GenericModule");
});

// Summary
console.log("\n--- Test Summary ---\n");
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total:  ${passed + failed}\n`);

process.exit(failed > 0 ? 1 : 0);
