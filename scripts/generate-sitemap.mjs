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
const BLOG_DIR = join(ROOT, "blog");
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

function loadBlogSlugs() {
	const out = [];
	let files;
	try {
		files = readdirSync(BLOG_DIR);
	} catch {
		return out;
	}
	for (const f of files) {
		if (!f.endsWith(".md")) continue;
		const raw = readFileSync(join(BLOG_DIR, f), "utf8");
		const m = raw.match(/^---\n([\s\S]*?)\n---/);
		if (!m) continue;
		const slug = m[1].match(/^slug:\s*(.+)$/m);
		const date = m[1].match(/^date:\s*(.+)$/m);
		if (slug) out.push({ slug: slug[1].trim(), date: date ? date[1].trim() : "" });
	}
	return out;
}

function urlEntry(loc, priority = "0.5", changefreq = "monthly") {
	return `  <url>\n    <loc>${ORIGIN}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function buildSitemap(modules, blogPosts) {
	const urls = [];

	urls.push(urlEntry("/", "1.0", "weekly"));

	for (const sec of SECTIONS) {
		urls.push(urlEntry(`/${sec}`, "0.8", "weekly"));
	}

	urls.push(urlEntry("/reference", "0.6", "monthly"));
	for (const ref of REFERENCE_IDS) {
		urls.push(urlEntry(`/reference/${ref}`, "0.6", "monthly"));
	}

	for (const m of modules) {
		for (let i = 0; i < m.lessonCount; i++) {
			urls.push(urlEntry(`/${m.id}/${i}`, "0.7", "monthly"));
		}
	}

	// Blog index + per-post (high priority — these are pre-rendered content)
	if (blogPosts.length > 0) {
		urls.push(urlEntry("/blog/", "0.9", "weekly"));
		for (const p of blogPosts) {
			urls.push(urlEntry(`/blog/${p.slug}/`, "0.8", "monthly"));
		}
	}

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

const modules = loadModules();
const blogPosts = loadBlogSlugs();
const sitemap = buildSitemap(modules, blogPosts);

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

const totalUrls = sitemap.match(/<loc>/g).length;
console.log(`✓ wrote dist/sitemap.xml (${modules.length} modules, ${blogPosts.length} blog posts, ${totalUrls} URLs)`);
