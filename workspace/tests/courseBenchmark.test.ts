// Benchmark compliance tests (Modules 1-12 premium standard)
// Run with: npm test

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
	try {
		fn();
		passed++;
		console.log(`  [PASS] ${name}`);
	} catch (error: unknown) {
		failed++;
		const message = error instanceof Error ? error.message : String(error);
		console.error(`  [FAIL] ${name}`);
		console.error(`         ${message}`);
	}
}

function expect(value: unknown) {
	return {
		toBeTruthy() {
			if (!value) throw new Error(`Expected truthy value but got ${value}`);
		},
		toContain(expected: string) {
			if (typeof value !== "string" || !value.includes(expected)) {
				throw new Error(`Expected string to contain "${expected}"`);
			}
		},
	};
}

const ROOT = path.join(__dirname, "../..");

console.log("\n--- Course benchmark tests (Modules 1-12) ---\n");

test("courses/BENCHMARK.md exists", () => {
	expect(fs.existsSync(path.join(ROOT, "courses/BENCHMARK.md"))).toBeTruthy();
});

test("courses.json declares benchmark module", () => {
	const data = JSON.parse(fs.readFileSync(path.join(ROOT, "courses.json"), "utf-8"));
	expect(data.benchmark?.courseId).toBeTruthy();
	expect(data.benchmark?.moduleNumber === 1).toBeTruthy();
});

test("sceneModuleTiming.ts exports benchmark constants", () => {
	const timing = fs.readFileSync(path.join(ROOT, "scripts/sceneModuleTiming.ts"), "utf-8");
	expect(timing).toContain("LAST_TAIL_BUFFER_SECONDS = 1.5");
	expect(timing).toContain("agentic-ai-for-beginners");
});

test("Modules 1-12 diagram scenes use immersive layout", () => {
	for (const moduleNumber of Array.from({ length: 12 }, (_, i) => i + 1)) {
		const folder = `module${String(moduleNumber).padStart(2, "0")}`;
		const prefix = `Module${String(moduleNumber).padStart(2, "0")}`;
		for (const n of [1, 2, 3]) {
			const file = path.join(
				ROOT,
				`courses/agentic-ai-for-beginners/course/remotion/scenes/${folder}`,
				`${prefix}Diagram${n}.tsx`
			);
			const src = fs.readFileSync(file, "utf-8");
			expect(src).toContain('layout="immersive"');
			expect(src).toContain("-premium.svg");
		}
	}
});

test("Modules 1-12 pass validate-benchmark", () => {
	for (const moduleNumber of Array.from({ length: 12 }, (_, i) => i + 1)) {
		execSync(`npx tsx scripts/validateCourseBenchmark.ts agentic-ai-for-beginners ${moduleNumber}`, {
			cwd: ROOT,
			stdio: "pipe",
		});
	}
});

console.log(`\nBenchmark tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
