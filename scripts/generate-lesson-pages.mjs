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

function loadModules() {
	const out = [];
	for (const f of readdirSync(LESSONS_DIR)) {
		if (!f.endsWith(".json")) continue;
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

function lessonJsonLd({ moduleObj, lesson, lessonIndex, canonical }) {
	return {
		"@context": "https://schema.org",
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
	};
}

function moduleJsonLd({ moduleObj, canonical }) {
	return {
		"@context": "https://schema.org",
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
			"url": `${ORIGIN}/${moduleObj.id}/${i}`
		}))
	};
}

function sectionJsonLd({ sectionId, canonical, modules }) {
	const meta = SECTIONS[sectionId];
	return {
		"@context": "https://schema.org",
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
	const canonical = `${ORIGIN}/${sectionId}`;
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
	const html = rewriteHead(shellHtml, {
		title: `${meta.title} — Code Crispies`,
		description: meta.description,
		canonical,
		jsonLd: sectionJsonLd({ sectionId, canonical, modules: sectionModules })
	});
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

	const moduleHtml = rewriteHead(shellHtml, {
		title: moduleTitle,
		description: moduleDesc,
		canonical: moduleCanonical,
		jsonLd: moduleJsonLd({ moduleObj: m, canonical: moduleCanonical })
	});
	const moduleDir = join(DIST, m.id);
	mkdirSync(moduleDir, { recursive: true });
	writeFileSync(join(moduleDir, "index.html"), moduleHtml);
	modulePages++;

	for (let i = 0; i < m.lessons.length; i++) {
		const lesson = m.lessons[i];
		if (!lesson) continue;
		const canonical = `${ORIGIN}/${m.id}/${i}`;
		const title = `${lesson.title} — ${m.title || m.id} | Code Crispies`;
		const description = stripHtml(lesson.task || lesson.description || moduleDesc).slice(0, 200) || moduleDesc;

		const html = rewriteHead(shellHtml, {
			title,
			description,
			canonical,
			jsonLd: lessonJsonLd({ moduleObj: m, lesson, lessonIndex: i, canonical })
		});
		const lessonDir = join(DIST, m.id, String(i));
		mkdirSync(lessonDir, { recursive: true });
		writeFileSync(join(lessonDir, "index.html"), html);
		lessonPages++;
	}
}

console.log(`✓ wrote ${sectionPages} section + ${modulePages} module + ${lessonPages} lesson pages`);
