#!/usr/bin/env node
/**
 * Generates dist/<moduleId>/<index>/index.html for every lesson, plus
 * dist/<moduleId>/index.html for module landings, and dist/<section>/
 * index.html for section pages.
 *
 * Each generated page is the SPA shell (dist/index.html) with the
 * <head> rewritten so that:
 *   - <title>, <meta description>, canonical, og:*, twitter:* are
 *     specific to that lesson/module/section
 *   - schema.org LearningResource (per lesson) or CollectionPage
 *     (per module/section) is embedded
 *
 * The <body> is untouched — the SPA bootstraps as usual and hydrates
 * over it. Search engines see real per-page metadata; users see the
 * normal interactive app.
 *
 * Run after `vite build` so dist/index.html exists.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LESSONS_DIR = join(ROOT, "lessons");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://codecrispi.es";

const SECTIONS = {
	css: { title: "CSS", description: "Master CSS through hands-on lessons covering selectors, box model, flexbox, grid, custom properties, transitions, gradients, filters, and more." },
	html: { title: "HTML", description: "Learn semantic HTML through interactive exercises: forms, validation, native elements, dialog, popover, tables, SVG." },
	tailwind: { title: "Tailwind CSS", description: "Practice Tailwind utility classes with live preview and instant validation." },
	javascript: { title: "JavaScript", description: "Hands-on JavaScript fundamentals: variables, DOM manipulation, events." },
	markdown: { title: "Markdown", description: "Learn Markdown syntax through interactive exercises with live rendering." }
};

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function stripHtml(s) {
	return String(s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Read src/config/lessons.js and return the set of English module
 * file basenames that are actually wired into the app. Anything not
 * imported there is invisible to the SPA — generating a static page
 * for it would let users land on a lesson the app can't load.
 */
function getPublishedFileNames() {
	const src = readFileSync(join(ROOT, "src/config/lessons.js"), "utf8");
	const re = /import\s+\w+\s+from\s+["']\.\.\/\.\.\/lessons\/([0-9a-z][^"']+\.json)["']/g;
	const out = new Set();
	for (const m of src.matchAll(re)) out.add(m[1]);
	return out;
}

function loadModules() {
	const published = getPublishedFileNames();
	const out = [];
	for (const f of readdirSync(LESSONS_DIR)) {
		if (!f.endsWith(".json")) continue;
		if (!published.has(f)) continue;
		try {
			const m = JSON.parse(readFileSync(join(LESSONS_DIR, f), "utf8"));
			if (!m.id || !Array.isArray(m.lessons)) continue;
			out.push(m);
		} catch (e) {
			console.warn(`skip ${f}: ${e.message}`);
		}
	}
	return out;
}

/**
 * Replace the SPA shell <head> tags with page-specific ones.
 * Uses regex on a small set of known tags so we don't reparse HTML.
 * If a tag is missing, append it.
 */
/**
 * Inject crawler-visible content into <aside id="cc-prerender"> in the body.
 * The SPA hides it post-hydration via body.cc-hydrated CSS rule, so users
 * never see this content (it's purely for crawlers + no-JS browsers).
 *
 * Replaces an empty <aside id="cc-prerender" ...></aside> in the shell with
 * one whose content slot is filled. If the placeholder is missing, the
 * function is a no-op (defensive against shell edits).
 */
function fillPrerender(html, contentHtml) {
	const placeholderRe = /<aside\s+id="cc-prerender"[^>]*>(\s*)<\/aside>/i;
	if (!placeholderRe.test(html)) return html;
	return html.replace(
		placeholderRe,
		`<aside id="cc-prerender" class="cc-prerender" aria-hidden="true">\n${contentHtml}\n\t\t</aside>`
	);
}

function rewriteHead(shellHtml, { title, description, canonical, jsonLd }) {
	let html = shellHtml;

	// Title
	html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

	// Description meta
	const descRe = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i;
	const newDesc = `<meta name="description" content="${escapeHtml(description)}" />`;
	if (descRe.test(html)) html = html.replace(descRe, newDesc);
	else html = html.replace("</head>", `\t\t${newDesc}\n\t</head>`);

	// Canonical — strip ALL existing, then add one. Source HTML may
	// have a duplicate canonical from earlier edits.
	const canonReAll = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>\s*/gi;
	html = html.replace(canonReAll, "");
	const newCanon = `<link rel="canonical" href="${canonical}" />`;
	html = html.replace("</head>", `\t\t${newCanon}\n\t</head>`);

	// og:url
	html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
		`<meta property="og:url" content="${canonical}" />`);

	// og:title + twitter:title
	html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
		`<meta property="og:title" content="${escapeHtml(title)}" />`);
	html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
		`<meta name="twitter:title" content="${escapeHtml(title)}" />`);

	// og:description + twitter:description
	html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
		`<meta property="og:description" content="${escapeHtml(description)}" />`);
	html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
		`<meta name="twitter:description" content="${escapeHtml(description)}" />`);

	// Replace existing JSON-LD block (the shell has the home one; we
	// substitute a per-page one).
	html = html.replace(
		/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
		`<script type="application/ld+json">\n${JSON.stringify(jsonLd)}\n</script>`
	);

	return html;
}

/**
 * Heuristic: which section does a module belong to?
 * Used for breadcrumbs.
 */
function sectionFor(moduleObj) {
	const id = moduleObj.id || "";
	const mode = (moduleObj.mode || "").toLowerCase();
	if (id.startsWith("html-")) return "html";
	if (id.startsWith("markdown-") || id.startsWith("md-")) return "markdown";
	if (id.startsWith("js-")) return "javascript";
	if (id.includes("tailwind") || mode === "tailwind") return "tailwind";
	return "css";
}

function breadcrumbList(crumbs) {
	return {
		"@type": "BreadcrumbList",
		"itemListElement": crumbs.map((c, i) => ({
			"@type": "ListItem",
			"position": i + 1,
			"name": c.name,
			"item": c.url
		}))
	};
}

function lessonJsonLd({ moduleObj, lesson, lessonIndex, canonical }) {
	const sectionId = sectionFor(moduleObj);
	const sectionName = SECTIONS[sectionId]?.title || sectionId;
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "LearningResource",
				"name": lesson.title,
				"description": stripHtml(lesson.task || lesson.description || ""),
				"url": canonical,
				"learningResourceType": "Activity",
				"educationalLevel": moduleObj.difficulty || "Beginner",
				"isAccessibleForFree": true,
				"inLanguage": "en",
				"teaches": moduleObj.title || moduleObj.id,
				"isPartOf": {
					"@type": "Course",
					"@id": `${ORIGIN}/${moduleObj.id}/`,
					"name": moduleObj.title || moduleObj.id
				},
				"position": lessonIndex + 1,
				"author": {
					"@type": "Organization",
					"name": "LibreTECH",
					"url": "https://librete.ch"
				}
			},
			breadcrumbList([
				{ name: "Home", url: ORIGIN + "/" },
				{ name: sectionName, url: `${ORIGIN}/${sectionId}/` },
				{ name: moduleObj.title || moduleObj.id, url: `${ORIGIN}/${moduleObj.id}/` },
				{ name: lesson.title, url: canonical }
			])
		]
	};
}

function moduleJsonLd({ moduleObj, canonical }) {
	const sectionId = sectionFor(moduleObj);
	const sectionName = SECTIONS[sectionId]?.title || sectionId;
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Course",
				"name": moduleObj.title || moduleObj.id,
				"description": stripHtml(moduleObj.description || ""),
				"url": canonical,
				"provider": {
					"@type": "Organization",
					"name": "LibreTECH",
					"url": "https://librete.ch"
				},
				"educationalLevel": moduleObj.difficulty || "Beginner",
				"isAccessibleForFree": true,
				"inLanguage": "en",
				"hasPart": moduleObj.lessons.map((l, i) => ({
					"@type": "LearningResource",
					"name": l.title,
					"position": i + 1,
					"url": `${ORIGIN}/${moduleObj.id}/${i}/`
				}))
			},
			breadcrumbList([
				{ name: "Home", url: ORIGIN + "/" },
				{ name: sectionName, url: `${ORIGIN}/${sectionId}/` },
				{ name: moduleObj.title || moduleObj.id, url: canonical }
			])
		]
	};
}

/**
 * Build crawler-visible HTML for a single lesson page. Includes the
 * lesson title, task description, the static preview HTML (so search
 * engines see the actual code context), and a link back to the module.
 */
function lessonPrerender({ moduleObj, lesson, lessonIndex }) {
	const sectionId = sectionFor(moduleObj);
	const sectionName = SECTIONS[sectionId]?.title || sectionId;
	const taskHtml = lesson.task ? `<p>${escapeHtml(stripHtml(lesson.task))}</p>` : "";
	const hint = lesson.hint ? `<p><strong>Hint:</strong> ${escapeHtml(stripHtml(lesson.hint))}</p>` : "";
	const initialCode = lesson.initialCode
		? `<h2>Starting code</h2><pre><code>${escapeHtml(lesson.initialCode)}</code></pre>`
		: "";
	const previewHtml = lesson.previewHTML
		? `<h2>Preview markup</h2><pre><code>${escapeHtml(lesson.previewHTML)}</code></pre>`
		: "";
	const navLinks = `
			<p>
				Lesson ${lessonIndex + 1} of ${moduleObj.lessons.length} in
				<a href="/${moduleObj.id}/">${escapeHtml(moduleObj.title || moduleObj.id)}</a>
				(<a href="/${sectionId}/">${escapeHtml(sectionName)}</a> section).
			</p>`;
	return `
			<h1>${escapeHtml(lesson.title)}</h1>${navLinks}
			${taskHtml}
			${hint}
			${initialCode}
			${previewHtml}
			<p>Open this lesson in your browser to write live code with instant feedback. <a href="/">Code Crispies</a> is a free, open-source learning platform — no signup required.</p>`;
}

function modulePrerender({ moduleObj }) {
	const sectionId = sectionFor(moduleObj);
	const sectionName = SECTIONS[sectionId]?.title || sectionId;
	const desc = stripHtml(moduleObj.description || "");
	const lessons = moduleObj.lessons
		.map((l, i) => `<li><a href="/${moduleObj.id}/${i}/">${escapeHtml(l.title || `Lesson ${i + 1}`)}</a></li>`)
		.join("");
	return `
			<h1>${escapeHtml(moduleObj.title || moduleObj.id)}</h1>
			<p>Part of the <a href="/${sectionId}/">${escapeHtml(sectionName)}</a> section. Difficulty: ${escapeHtml(moduleObj.difficulty || "beginner")}. ${moduleObj.lessons.length} lessons.</p>
			${desc ? `<p>${escapeHtml(desc)}</p>` : ""}
			<h2>Lessons</h2>
			<ol>${lessons}</ol>
			<p>Open any lesson to start coding. Hands-on, instant feedback, no signup.</p>`;
}

function sectionPrerender({ sectionId, modules }) {
	const meta = SECTIONS[sectionId];
	const moduleList = modules
		.map((m) => `<li><a href="/${m.id}/">${escapeHtml(m.title || m.id)}</a> — ${m.lessons?.length || 0} lessons (${escapeHtml(m.difficulty || "beginner")})</li>`)
		.join("");
	return `
			<h1>${escapeHtml(meta.title)} on Code Crispies</h1>
			<p>${escapeHtml(meta.description)}</p>
			<h2>Modules</h2>
			<ul>${moduleList}</ul>
			<p>Each module breaks down into 3–10 short lessons with a live preview. Pick one to start; progress saves locally.</p>`;
}

function sectionJsonLd({ sectionId, canonical, modules }) {
	const meta = SECTIONS[sectionId];
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "CollectionPage",
				"name": `${meta.title} — Code Crispies`,
				"description": meta.description,
				"url": canonical,
				"inLanguage": "en",
				"hasPart": modules.map((m) => ({
					"@type": "Course",
					"name": m.title || m.id,
					"url": `${ORIGIN}/${m.id}/`
				}))
			},
			breadcrumbList([
				{ name: "Home", url: ORIGIN + "/" },
				{ name: meta.title, url: canonical }
			])
		]
	};
}

const shellHtml = readFileSync(join(DIST, "index.html"), "utf8");
const modules = loadModules();

let lessonPages = 0;
let modulePages = 0;
let sectionPages = 0;

// Per-section landings
for (const sectionId of Object.keys(SECTIONS)) {
	const meta = SECTIONS[sectionId];
	const canonical = `${ORIGIN}/${sectionId}/`;
	// Filter modules that match this section by mode (or accept all if mode missing)
	const sectionModules = modules.filter((m) => {
		const mode = (m.mode || "").toLowerCase();
		if (sectionId === "html") return m.id?.startsWith("html-");
		if (sectionId === "markdown") return m.id?.startsWith("markdown-") || m.id?.includes("md-");
		if (sectionId === "javascript") return m.id?.startsWith("js-");
		if (sectionId === "tailwind") return m.id?.includes("tailwind") || mode === "tailwind";
		if (sectionId === "css") {
			const id = m.id || "";
			return !id.startsWith("html-") && !id.startsWith("md-") && !id.startsWith("markdown-") && !id.startsWith("js-") && !id.includes("tailwind");
		}
		return false;
	});
	let html = rewriteHead(shellHtml, {
		title: `${meta.title} — Code Crispies`,
		description: meta.description,
		canonical,
		jsonLd: sectionJsonLd({ sectionId, canonical, modules: sectionModules })
	});
	html = fillPrerender(html, sectionPrerender({ sectionId, modules: sectionModules }));
	const dir = join(DIST, sectionId);
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, "index.html"), html);
	sectionPages++;
}

// Per-module + per-lesson pages
for (const m of modules) {
	const moduleCanonical = `${ORIGIN}/${m.id}/`;
	const moduleTitle = `${m.title || m.id} — Code Crispies`;
	const moduleDesc = stripHtml(m.description || `Interactive lessons covering ${m.title || m.id}.`).slice(0, 200);

	let moduleHtml = rewriteHead(shellHtml, {
		title: moduleTitle,
		description: moduleDesc,
		canonical: moduleCanonical,
		jsonLd: moduleJsonLd({ moduleObj: m, canonical: moduleCanonical })
	});
	moduleHtml = fillPrerender(moduleHtml, modulePrerender({ moduleObj: m }));
	const moduleDir = join(DIST, m.id);
	mkdirSync(moduleDir, { recursive: true });
	writeFileSync(join(moduleDir, "index.html"), moduleHtml);
	modulePages++;

	for (let i = 0; i < m.lessons.length; i++) {
		const lesson = m.lessons[i];
		if (!lesson) continue;
		const canonical = `${ORIGIN}/${m.id}/${i}/`;
		const title = `${lesson.title} — ${m.title || m.id} | Code Crispies`;
		const description = stripHtml(lesson.task || lesson.description || moduleDesc).slice(0, 200) || moduleDesc;

		let html = rewriteHead(shellHtml, {
			title,
			description,
			canonical,
			jsonLd: lessonJsonLd({ moduleObj: m, lesson, lessonIndex: i, canonical })
		});
		html = fillPrerender(html, lessonPrerender({ moduleObj: m, lesson, lessonIndex: i }));
		const lessonDir = join(DIST, m.id, String(i));
		mkdirSync(lessonDir, { recursive: true });
		writeFileSync(join(lessonDir, "index.html"), html);
		lessonPages++;
	}
}

console.log(`✓ wrote ${sectionPages} section + ${modulePages} module + ${lessonPages} lesson pages`);
