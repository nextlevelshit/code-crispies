#!/usr/bin/env node
/**
 * Generates dist/sitemap.xml from lessons/*.json after vite build.
 *
 * URL inventory:
 * - / (home)
 * - /<section> for each section landing
 * - /reference, /reference/<refId>
 * - /<moduleId>/<lessonIndex> for every lesson
 *
 * Skips localized lesson directories (ar/, de/, ...) — they share
 * the same URL paths in this SPA; multi-language sitemap support
 * with hreflang alternates is a separate task.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LESSONS_DIR = join(ROOT, "lessons");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://codecrispi.es";

const SECTIONS = ["css", "html", "markdown", "javascript"];
const REFERENCE_IDS = ["css", "html", "flexbox", "grid", "selectors"];

function loadModules() {
	const out = [];
	for (const f of readdirSync(LESSONS_DIR)) {
		if (!f.endsWith(".json")) continue;
		try {
			const m = JSON.parse(readFileSync(join(LESSONS_DIR, f), "utf8"));
			if (!m.id || !Array.isArray(m.lessons)) continue;
			out.push({ id: m.id, lessonCount: m.lessons.length });
		} catch (e) {
			console.warn(`skip ${f}: ${e.message}`);
		}
	}
	return out;
}

function urlEntry(loc, priority = "0.5", changefreq = "monthly") {
	return `  <url>\n    <loc>${ORIGIN}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function buildSitemap(modules) {
	const urls = [];

	// Home (highest priority, most-frequent change)
	urls.push(urlEntry("/", "1.0", "weekly"));

	// Section landings
	for (const sec of SECTIONS) {
		urls.push(urlEntry(`/${sec}`, "0.8", "weekly"));
	}

	// Reference index + per-id pages
	urls.push(urlEntry("/reference", "0.6", "monthly"));
	for (const ref of REFERENCE_IDS) {
		urls.push(urlEntry(`/reference/${ref}`, "0.6", "monthly"));
	}

	// Per-lesson URLs
	for (const m of modules) {
		for (let i = 0; i < m.lessonCount; i++) {
			urls.push(urlEntry(`/${m.id}/${i}`, "0.7", "monthly"));
		}
	}

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

const modules = loadModules();
const sitemap = buildSitemap(modules);

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

const totalUrls = sitemap.match(/<loc>/g).length;
console.log(`✓ wrote dist/sitemap.xml (${modules.length} modules, ${totalUrls} URLs)`);
