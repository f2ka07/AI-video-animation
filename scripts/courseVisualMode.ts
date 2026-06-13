// Shared helpers: scene (SVG) courses vs slide (Mermaid) courses
import * as fs from "fs";
import * as path from "path";

export function courseUsesSceneVisuals(courseId: string): boolean {
	if (!courseId) return false;
	const coursesPath = path.join(__dirname, "../courses.json");
	if (fs.existsSync(coursesPath)) {
		try {
			const data = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
			const course = data.courses?.find((c: { id: string; visualMode?: string }) => c.id === courseId);
			if (course?.visualMode === "scenes") return true;
		} catch {
			// fall through
		}
	}
	const scenesPath = path.join(__dirname, "../courses", courseId, "course", "remotion", "scenes");
	return fs.existsSync(scenesPath);
}

export function getCourseModuleRange(courseId: string): string {
	const coursesPath = path.join(__dirname, "../courses.json");
	if (fs.existsSync(coursesPath)) {
		try {
			const data = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
			const nums: number[] = data.courseModuleMapping?.[courseId] || [];
			if (nums.length > 0) {
				const sorted = [...nums].sort((a, b) => a - b);
				if (sorted.length === 1) return String(sorted[0]);
				return `${sorted[0]}-${sorted[sorted.length - 1]}`;
			}
		} catch {
			// fall through
		}
	}
	return "1-6";
}

export function stripMermaidFromContentPlan(plan: { modules?: Array<{ slides?: Array<Record<string, unknown>> }> }): void {
	for (const mod of plan.modules || []) {
		for (const slide of mod.slides || []) {
			if (slide.mermaidSource) delete slide.mermaidSource;
			if (slide.type === "mermaid") slide.type = "content-single";
		}
	}
}
