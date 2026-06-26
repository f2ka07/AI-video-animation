// Regenerate course 2 module01 visual-panel SVGs from content.json
// Usage: npx tsx scripts/generatePremiumModule01Svgs.ts

import { execSync } from "child_process";
import * as path from "path";

const script = path.join(__dirname, "generatePremiumCourseSvgs.ts");
execSync(`npx tsx "${script}" infrastructure-as-code-versioned-networks 1`, {
	stdio: "inherit",
	cwd: path.join(__dirname, ".."),
});
