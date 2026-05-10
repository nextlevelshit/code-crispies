#!/usr/bin/env node
/**
 * Captures README hero screenshots via headless chromium.
 *
 * Run locally before committing README changes:
 *   npm run preview &  # serves dist/ at http://localhost:4173
 *   node scripts/capture-screenshots.mjs
 *
 * Output: public/screenshots/*.png — committed to repo so the README
 * renders on github without build steps. The CI doesn't need chromium.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "screenshots");
const ORIGIN = process.env.CC_PREVIEW_ORIGIN || "https://cc.cloud.librete.ch";

mkdirSync(OUT, { recursive: true });

// 3 hero shots: landing → lesson → blog. 1280×720 fits well in README cards.
// ?_screenshot=1 suppresses the onboarding tour (it'd otherwise overlay
// every shot since the headless chromium has empty localStorage).
const shots = [
	{ name: "landing", path: "/?_screenshot=1", waitMs: 1500 },
	{ name: "lesson", path: "/css-basic-selectors/0/?_screenshot=1", waitMs: 2500 },
	{ name: "blog", path: "/blog/?_screenshot=1", waitMs: 1500 }
];

for (const s of shots) {
	const url = ORIGIN + s.path;
	const out = join(OUT, `${s.name}.png`);
	console.log(`→ ${url}`);
	try {
		execFileSync("chromium", [
			"--headless",
			"--no-sandbox",
			"--hide-scrollbars",
			"--disable-gpu",
			"--lang=en-US",
			"--accept-lang=en-US,en",
			"--window-size=1280,720",
			"--virtual-time-budget=" + s.waitMs,
			`--screenshot=${out}`,
			url
		], { stdio: "pipe" });
		console.log(`  wrote ${out}`);
	} catch (e) {
		console.error(`  fail: ${e.message.split("\n")[0]}`);
	}
}

console.log(`\n✓ wrote ${shots.length} README screenshot(s) to public/screenshots/`);
