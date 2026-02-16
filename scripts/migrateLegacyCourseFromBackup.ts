// Migrate a legacy course (e.g. aws-pulumi) from a moduleContent backup file.
// The AWS Pulumi course was created before the archive/restore system and has no
// courses/aws-pulumi/content.json. This script creates it from a backup.
//
// Run: npx tsx scripts/migrateLegacyCourseFromBackup.ts aws-pulumi [backupPath]
// Example: npx tsx scripts/migrateLegacyCourseFromBackup.ts aws-pulumi

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

const courseId = process.argv[2] || "aws-pulumi";
const backupArg = process.argv[3];

const COURSE_NAMES: Record<string, string> = {
	"aws-pulumi": "AWS Infrastructure as Code with Pulumi",
};

const COURSE_MODULE_MAPPING: Record<string, number[]> = {
	"aws-pulumi": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

function findPulumiBackup(dir: string): string | null {
	const files = fs.readdirSync(dir).filter((f) => f.startsWith("moduleContent.backup.") && f.endsWith(".ts"));
	for (const f of files) {
		const p = path.join(dir, f);
		const content = fs.readFileSync(p, "utf-8");
		if (content.includes("AWS Infrastructure as Code with Pulumi") && content.includes("module1Content")) {
			return p;
		}
	}
	return files.length > 0 ? path.join(dir, files.sort().pop()!) : null;
}

function toContentJsonSlide(s: any): any {
	const out: any = { name: s.name, type: s.type, script: s.script };
	if (s.title) out.title = s.title;
	if (s.subtitle) out.subtitle = s.subtitle;
	if (s.points?.length) out.points = s.points;
	if (s.code) out.code = s.code;
	if (s.language) out.language = s.language;
	if (s.imageSrc) out.imageSrc = s.imageSrc;
	if (s.leftTitle) out.leftTitle = s.leftTitle;
	if (s.leftItems?.length) out.leftItems = s.leftItems;
	if (s.rightTitle) out.rightTitle = s.rightTitle;
	if (s.rightItems?.length) out.rightItems = s.rightItems;
	if (s.scene) out.scene = typeof s.scene === "object" && s.scene.id ? s.scene.id : s.scene;
	return out;
}

async function main() {
	const videosDir = path.join(__dirname, "../src/videos");
	const backupPath = backupArg
		? path.resolve(process.cwd(), backupArg)
		: findPulumiBackup(videosDir);

	if (!backupPath || !fs.existsSync(backupPath)) {
		console.error("No Pulumi backup found. Specify: npx tsx scripts/migrateLegacyCourseFromBackup.ts aws-pulumi src/videos/moduleContent.backup.1769257946818.ts");
		process.exit(1);
	}

	const moduleNumbers = COURSE_MODULE_MAPPING[courseId] || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const backupFullPath = path.isAbsolute(backupPath) ? backupPath : path.resolve(process.cwd(), backupPath);
	const backupModule = await import(pathToFileURL(backupFullPath).href);

	const modules: any[] = [];
	for (const num of moduleNumbers) {
		const mod = (backupModule as any)[`module${num}Content`];
		if (!mod) {
			console.warn(`Module ${num} not found in backup`);
			continue;
		}
		modules.push({
			moduleNumber: mod.moduleNumber,
			title: mod.title,
			subtitle: mod.subtitle,
			slides: (mod.slides || []).map(toContentJsonSlide),
		});
	}

	if (modules.length === 0) {
		console.error("No modules extracted.");
		process.exit(1);
	}

	const plan = {
		courseName: COURSE_NAMES[courseId] || courseId,
		courseId,
		modules,
		savedAt: new Date().toISOString(),
	};

	const courseDir = path.join(__dirname, "../courses", courseId);
	fs.mkdirSync(courseDir, { recursive: true });
	fs.mkdirSync(path.join(courseDir, "timings"), { recursive: true });

	const contentPath = path.join(courseDir, "content.json");
	fs.writeFileSync(contentPath, JSON.stringify(plan, null, 2), "utf-8");

	const totalSlides = modules.reduce((n, m) => n + (m.slides?.length || 0), 0);
	console.log(`Wrote ${contentPath} with ${modules.length} modules and ${totalSlides} slides`);
	console.log(`You can now restore the course from the GUI or: POST /api/courses/${courseId}/restore`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
