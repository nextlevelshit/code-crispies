#!/usr/bin/env node
/**
 * Pre-renders blog/*.md to dist/blog/<slug>/index.html (one HTML file
 * per post) plus dist/blog/index.html (post list).
 *
 * Frontmatter format:
 *   ---
 *   title: ...
 *   description: ...
 *   date: YYYY-MM-DD
 *   slug: kebab-case
 *   tags: [a, b]
 *   ---
 *
 * Markdown rendered with `marked` (already a runtime dep). Output is
 * fully static — Google sees real content, no JS required.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "blog");
const DIST = join(ROOT, "dist", "blog");
const ORIGIN = "https://codecrispi.es";

function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { meta: {}, body: raw };

	const meta = {};
	for (const line of match[1].split("\n")) {
		const m = line.match(/^([a-z_]+):\s*(.+)$/i);
		if (!m) continue;
		let [, key, value] = m;
		value = value.trim();
		// Strip wrapping quotes
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		// Array syntax [a, b, c]
		if (value.startsWith("[") && value.endsWith("]")) {
			value = value
				.slice(1, -1)
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
		}
		meta[key] = value;
	}
	return { meta, body: match[2] };
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function postPagе(post) {
	const title = `${post.meta.title} — Code Crispies Blog`;
	const desc = post.meta.description || "";
	const url = `${ORIGIN}/blog/${post.meta.slug}/`;
	const tags = Array.isArray(post.meta.tags) ? post.meta.tags : [];

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(post.meta.title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}/og-image.png">
<meta property="article:published_time" content="${post.meta.date}">
${tags.map((t) => `<meta property="article:tag" content="${escapeHtml(t)}">`).join("\n")}
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BlogPosting","headline":${JSON.stringify(post.meta.title)},"datePublished":"${post.meta.date}","description":${JSON.stringify(desc)},"url":"${url}","author":{"@type":"Organization","name":"LibreTECH","url":"https://librete.ch"},"publisher":{"@type":"Organization","name":"Code Crispies","url":"${ORIGIN}"},"mainEntityOfPage":"${url}","keywords":${JSON.stringify(tags.join(", "))}}
</script>
<link rel="icon" href="/favicon.ico">
<style>
  body { font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; color: #1f2937; max-width: 720px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
  header { display: flex; align-items: center; gap: .75rem; margin-bottom: 2rem; }
  header img { width: 40px; height: 40px; }
  header a { color: inherit; text-decoration: none; font-weight: 700; letter-spacing: -.02em; }
  header a span { color: #4f46e5; }
  h1 { font-size: 2.25rem; line-height: 1.15; letter-spacing: -.03em; margin: 0 0 .5rem; }
  .meta { color: #6b7280; font-size: .9rem; margin-bottom: 2rem; }
  .meta time + .tags { margin-left: .75rem; }
  .tag { background: #eef2ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: .8rem; margin-right: .25rem; }
  article { margin-top: 1rem; }
  article h2 { margin-top: 2.5rem; font-size: 1.5rem; letter-spacing: -.02em; }
  article h3 { margin-top: 2rem; font-size: 1.2rem; }
  article p, article li { font-size: 1.05rem; }
  article a { color: #4f46e5; }
  article code { background: #f3f4f6; padding: 1px 5px; border-radius: 3px; font-size: .92em; }
  article pre { background: #1f2937; color: #f9fafb; padding: 1rem 1.25rem; border-radius: 8px; overflow-x: auto; font-size: .9rem; }
  article pre code { background: transparent; padding: 0; color: inherit; }
  article kbd { background: #f3f4f6; border: 1px solid #d1d5db; border-bottom-width: 2px; padding: 1px 6px; border-radius: 4px; font-size: .85em; font-family: inherit; }
  article hr { border: 0; border-top: 1px solid #e5e7eb; margin: 2.5rem 0; }
  article blockquote { border-left: 3px solid #4f46e5; padding-left: 1rem; color: #4b5563; }
  footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: .9rem; }
  footer a { color: #4f46e5; }
</style>
</head>
<body>
<header>
  <a href="/"><img src="/bowl.png" alt=""> CODE <span>CRISPIES</span></a>
</header>
<h1>${escapeHtml(post.meta.title)}</h1>
<p class="meta">
  <time datetime="${post.meta.date}">${post.meta.date}</time>
  <span class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</span>
</p>
<article>${marked.parse(post.body)}</article>
<footer>
  <p>← <a href="/blog">All posts</a> · <a href="/">Try Code Crispies</a></p>
</footer>
</body>
</html>
`;
}

function indexPage(posts) {
	const items = posts
		.map(
			(p) => `  <li>
    <a href="/blog/${p.meta.slug}/"><h2>${escapeHtml(p.meta.title)}</h2></a>
    <p class="meta"><time datetime="${p.meta.date}">${p.meta.date}</time></p>
    <p>${escapeHtml(p.meta.description || "")}</p>
  </li>`
		)
		.join("\n");

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog — Code Crispies</title>
<meta name="description" content="Hands-on web-development tutorials from the Code Crispies team. HTML, CSS, Tailwind, JavaScript, and Markdown.">
<link rel="canonical" href="${ORIGIN}/blog/">
<meta property="og:type" content="website">
<meta property="og:title" content="Code Crispies Blog">
<meta property="og:description" content="Hands-on web-development tutorials.">
<meta property="og:url" content="${ORIGIN}/blog/">
<meta property="og:image" content="${ORIGIN}/og-image.png">
<link rel="icon" href="/favicon.ico">
<style>
  body { font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; color: #1f2937; max-width: 720px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
  header { display: flex; align-items: center; gap: .75rem; margin-bottom: 2rem; }
  header img { width: 40px; height: 40px; }
  header a { color: inherit; text-decoration: none; font-weight: 700; letter-spacing: -.02em; }
  header a span { color: #4f46e5; }
  h1 { font-size: 2rem; margin: 0 0 .5rem; letter-spacing: -.02em; }
  .lede { color: #6b7280; margin-bottom: 2rem; }
  ul { list-style: none; padding: 0; }
  li { padding: 1.25rem 0; border-bottom: 1px solid #e5e7eb; }
  li a { text-decoration: none; color: inherit; }
  li a:hover h2 { color: #4f46e5; }
  li h2 { margin: 0 0 .25rem; font-size: 1.35rem; letter-spacing: -.01em; }
  .meta { color: #9ca3af; font-size: .85rem; margin: 0 0 .5rem; }
  li p:last-child { color: #4b5563; margin: 0; }
</style>
</head>
<body>
<header>
  <a href="/"><img src="/bowl.png" alt=""> CODE <span>CRISPIES</span></a>
</header>
<h1>Blog</h1>
<p class="lede">Hands-on web-development tutorials. Each post is short, code-first, and links back to a Code Crispies module to practice.</p>
<ul>
${items}
</ul>
</body>
</html>
`;
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
const posts = files
	.map((f) => parseFrontmatter(readFileSync(join(BLOG_DIR, f), "utf8")))
	.sort((a, b) => (b.meta.date || "").localeCompare(a.meta.date || ""));

mkdirSync(DIST, { recursive: true });

for (const post of posts) {
	if (!post.meta.slug) {
		console.warn(`skip post without slug: ${post.meta.title || "(untitled)"}`);
		continue;
	}
	const dir = join(DIST, post.meta.slug);
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, "index.html"), postPagе(post));
}

writeFileSync(join(DIST, "index.html"), indexPage(posts));

console.log(`✓ wrote ${posts.length} blog post(s) + index to dist/blog/`);
