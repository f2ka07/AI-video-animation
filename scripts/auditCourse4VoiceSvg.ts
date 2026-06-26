/**
 * Audit Course 4: voice script vs SVG diagram text alignment
 */
import * as fs from "fs";
import * as path from "path";

const COURSE_ID = "ai-in-automation-networks";
const content = JSON.parse(
	fs.readFileSync(path.join(__dirname, "../courses", COURSE_ID, "content.json"), "utf-8")
);
const svgRoot = path.join(__dirname, "../courses", COURSE_ID, "course/diagrams/svg");

interface Issue {
	module: number;
	slide: string;
	title: string;
	kind: string;
	detail: string;
}

const issues: Issue[] = [];
let audited = 0;

for (const mod of content.modules || []) {
	for (const slide of mod.slides || []) {
		if (!slide.imageSrc) continue;
		audited++;

		const rel = slide.imageSrc.replace(`assets/${COURSE_ID}/`, "");
		const svgPath = path.join(svgRoot, rel);
		if (!fs.existsSync(svgPath)) {
			issues.push({
				module: mod.moduleNumber,
				slide: slide.name,
				title: slide.title,
				kind: "missing-svg",
				detail: rel,
			});
			continue;
		}

		const svg = fs.readFileSync(svgPath, "utf-8");
		const aria = (svg.match(/aria-label="([^"]+)"/) || [])[1] || "";
		const texts = [...svg.matchAll(/<text[^>]*>([^<]{2,120})<\/text>/g)].map((m) =>
			m[1].replace(/\s+/g, " ").trim()
		);
		const svgBlob = `${aria} ${texts.join(" ")}`.toLowerCase();
		const script = (slide.script || "").toLowerCase();
		const points = (slide.points || []).join(" ").toLowerCase();

		// Stale exam/syllabus labels in SVG while voice was de-syllabused
		const staleSvg = [/exam 4\./i, /autocor/i, /objective 4/i, /4\.1/, /four point/i, /cert prep/i];
		for (const re of staleSvg) {
			if (re.test(svg) && !re.test(script)) {
				issues.push({
					module: mod.moduleNumber,
					slide: slide.name,
					title: slide.title,
					kind: "stale-svg-syllabus",
					detail: `SVG contains ${re} but script does not`,
				});
				break;
			}
		}

		// Script emphasizes topics absent from diagram
		const topicChecks: Array<{ key: string; svgNeedles: string[] }> = [
			{ key: "prompt injection", svgNeedles: ["inject", "prompt"] },
			{ key: "check mode", svgNeedles: ["check", "ansible-playbook"] },
			{ key: "ansible-lint", svgNeedles: ["lint", "ansible"] },
			{ key: "fastmcp", svgNeedles: ["fastmcp", "mcp"] },
			{ key: "think", svgNeedles: ["think"] },
			{ key: "observe", svgNeedles: ["observe"] },
			{ key: "golden", svgNeedles: ["golden", "benchmark", "q&a", "scenario"] },
			{ key: "approval", svgNeedles: ["approv", "human"] },
		];

		for (const { key, svgNeedles } of topicChecks) {
			if (!script.includes(key)) continue;
			if (!svgNeedles.some((n) => svgBlob.includes(n))) {
				issues.push({
					module: mod.moduleNumber,
					slide: slide.name,
					title: slide.title,
					kind: "script-topic-not-in-svg",
					detail: `Script mentions "${key}" but SVG lacks ${svgNeedles.join("/")}`,
				});
			}
		}

		// Title vs aria-label drift
		if (aria && slide.title && !aria.toLowerCase().includes(slide.title.toLowerCase().slice(0, 12))) {
			const titleStart = slide.title.toLowerCase().slice(0, 8);
			if (!aria.toLowerCase().includes(titleStart) && titleStart.length > 5) {
				issues.push({
					module: mod.moduleNumber,
					slide: slide.name,
					title: slide.title,
					kind: "title-aria-drift",
					detail: `title="${slide.title}" aria-label="${aria}"`,
				});
			}
		}

		// Points on slide not reflected in SVG text
		for (const p of slide.points || []) {
			const words = p
				.toLowerCase()
				.split(/[^a-z0-9]+/)
				.filter((w: string) => w.length > 4);
			const hits = words.filter((w: string) => svgBlob.includes(w));
			if (words.length >= 2 && hits.length === 0) {
				issues.push({
					module: mod.moduleNumber,
					slide: slide.name,
					title: slide.title,
					kind: "points-not-in-svg",
					detail: `bullet "${p}" not echoed in diagram text`,
				});
			}
		}
	}
}

console.log(`Audited ${audited} slides with SVGs`);
console.log(`Found ${issues.length} potential voice/SVG alignment issues\n`);

const byKind: Record<string, Issue[]> = {};
for (const i of issues) {
	(byKind[i.kind] ||= []).push(i);
}

for (const [kind, list] of Object.entries(byKind).sort()) {
	console.log(`## ${kind} (${list.length})`);
	for (const i of list.slice(0, 15)) {
		console.log(`  M${i.module} ${i.slide}: ${i.detail}`);
	}
	if (list.length > 15) console.log(`  ... and ${list.length - 15} more`);
	console.log();
}
