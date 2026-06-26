// Sync premium display bullets into slide-splits.json segment points.
// Keeps splitAt boundaries unchanged; distributes slide-level premium bullets per segment.
//
// Usage: npx tsx scripts/premiumizeSlideSplits.ts infrastructure-as-code-versioned-networks

import * as fs from "fs";
import * as path from "path";
import { toPremiumBullets } from "../src/utils/premiumDisplayPoints";

const courseId = process.argv[2] || "infrastructure-as-code-versioned-networks";
const courseDir = path.join(__dirname, "../courses", courseId);
const contentPath = path.join(courseDir, "content.json");
const splitsPath = path.join(courseDir, "slide-splits.json");

interface SlideRecord {
	name: string;
	script?: string;
	keyPhrases?: string[];
	type?: string;
	beat?: string;
	points?: string[];
}

function main() {
	const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	const splits = JSON.parse(fs.readFileSync(splitsPath, "utf-8"));

	const slideByName = new Map<string, SlideRecord>();
	for (const mod of content.modules || []) {
		for (const slide of mod.slides || []) {
			slideByName.set(slide.name, slide);
		}
	}

	let updated = 0;
	for (const [slideName, splitDef] of Object.entries(splits)) {
		if (slideName.startsWith("_")) continue;
		const def = splitDef as { splitAt?: number[]; segments?: Array<Record<string, unknown>> };
		if (!def.segments?.length) continue;

		const slide = slideByName.get(slideName);
		const slidePoints = toPremiumBullets(slide?.points ?? [], {
			script: slide?.script,
			keyPhrases: slide?.keyPhrases,
			slideType: slide?.type,
			beat: slide?.beat,
			maxBullets: 4,
			allowLabDense: slideName.includes("lab-setup"),
		});

		const nSeg = def.segments.length;

		if (slidePoints.length > 0) {
			// One new bullet per segment for accumulating segmented slides
			def.segments = def.segments.map((seg, i) => {
				const point =
					slidePoints.length === nSeg
						? [slidePoints[i]]
						: slidePoints.length > nSeg
							? [slidePoints[Math.min(i, slidePoints.length - 1)]]
							: i < slidePoints.length
								? [slidePoints[i]]
								: [];
				return { ...seg, points: point.filter(Boolean) };
			});
		} else {
			def.segments = def.segments.map((seg) => {
				const raw = (seg.points as string[] | undefined) ?? [];
				const premium = toPremiumBullets(raw, {
					script: slide?.script,
					keyPhrases: slide?.keyPhrases,
					slideType: slide?.type,
					beat: slide?.beat,
					maxBullets: 2,
				});
				return { ...seg, points: premium };
			});
		}
		updated++;
	}

	fs.writeFileSync(splitsPath, JSON.stringify(splits, null, 2), "utf-8");
	console.log(`Updated segment points for ${updated} slides in slide-splits.json`);
}

main();
