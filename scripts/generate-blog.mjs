#!/usr/bin/env node
/**
 * Pre-renders blog/*.md to dist/blog/<slug>/index.html (one HTML file
 * per post) plus dist/blog/index.html (post list) plus
 * dist/blog/rss.xml.
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
 * Markdown rendered with `marked`; code blocks get syntax tokens via
 * highlight.js so the .hljs-* classes can be themed at the post level.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import hljs from "highlight.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "blog");
const OG_SRC_DIR = join(BLOG_DIR, "og");
const DIST = join(ROOT, "dist", "blog");
const ORIGIN = "https://codecrispi.es";

// Wire highlight.js into marked: detect language from fence, fall
// back to auto-detect, leave classes in place so the post stylesheet
// can theme them. Each code block also gets a copy-to-clipboard
// button (data-raw stores the unescaped source for clipboard write).
marked.use({
	renderer: {
		code({ text, lang }) {
			const langClass = lang ? lang.replace(/[^a-z0-9-]/gi, "") : "";
			let html;
			try {
				if (langClass && hljs.getLanguage(langClass)) {
					html = hljs.highlight(text, { language: langClass, ignoreIllegals: true }).value;
				} else {
					html = hljs.highlightAuto(text).value;
				}
			} catch {
				html = text
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;");
			}
			const cls = langClass ? ` language-${langClass}` : "";
			const langLabel = langClass ? `<span class="cb-lang">${langClass}</span>` : "";
			const rawAttr = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
			return `<div class="code-block-wrap"><pre class="hljs"><code class="hljs${cls}">${html}</code></pre>${langLabel}<button class="cb-copy" type="button" data-raw="${rawAttr}" aria-label="Copy code">copy</button></div>\n`;
		}
	}
});

function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { meta: {}, body: raw };

	const meta = {};
	for (const line of match[1].split("\n")) {
		const m = line.match(/^([a-z_]+):\s*(.+)$/i);
		if (!m) continue;
		let [, key, value] = m;
		value = value.trim();
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
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

function readingTime(text) {
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}

const SHARED_STYLES = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; color: #1f2937; max-width: 720px; margin: 0 auto; padding: 1.5rem 1.25rem 4rem; background: #fafafa; }
  a { color: #4f46e5; }
  a:hover { color: #4338ca; }
  header.site { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid #e5e7eb; }
  header.site .brand { display: flex; align-items: center; gap: .6rem; color: inherit; text-decoration: none; font-weight: 800; letter-spacing: -.02em; font-size: 1.05rem; }
  header.site .brand img { width: 36px; height: 36px; }
  header.site .brand span { color: #4f46e5; }
  header.site nav { font-size: .9rem; }
  header.site nav a { margin-left: .9rem; text-decoration: none; color: #4b5563; font-weight: 500; }
  header.site nav a:hover { color: #4f46e5; }
  footer.site { margin-top: 3.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: .9rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  /* highlight.js base — github-light theme tokens, trimmed */
  .code-block-wrap { position: relative; margin: 1.25rem 0; }
  .code-block-wrap pre.hljs { margin: 0; }
  .cb-lang { position: absolute; top: 8px; right: 64px; font-size: .7rem; font-family: "SFMono-Regular", monospace; color: rgba(226,232,240,.5); letter-spacing: .05em; text-transform: uppercase; pointer-events: none; }
  .cb-copy { position: absolute; top: 8px; right: 8px; padding: 3px 10px; font-size: .75rem; font-family: inherit; background: rgba(255,255,255,.08); color: #e2e8f0; border: 1px solid rgba(255,255,255,.15); border-radius: 4px; cursor: pointer; opacity: 0; transition: opacity .15s, background .15s; }
  .code-block-wrap:hover .cb-copy, .cb-copy:focus-visible { opacity: 1; }
  .cb-copy:hover { background: rgba(255,255,255,.18); }
  .cb-copy.copied { background: #10b981; border-color: #10b981; color: white; opacity: 1; }
  pre.hljs { background: #0f172a; color: #e2e8f0; padding: 1rem 1.25rem; border-radius: 8px; overflow-x: auto; font-size: .9rem; line-height: 1.55; }
  pre.hljs code { background: transparent; padding: 0; color: inherit; font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
  .hljs-keyword, .hljs-selector-tag, .hljs-meta { color: #c4b5fd; }
  .hljs-string, .hljs-attr-value, .hljs-symbol, .hljs-bullet { color: #86efac; }
  .hljs-comment, .hljs-quote { color: #94a3b8; font-style: italic; }
  .hljs-number, .hljs-literal { color: #fda4af; }
  .hljs-attr, .hljs-attribute, .hljs-title, .hljs-name, .hljs-section { color: #fcd34d; }
  .hljs-tag, .hljs-property, .hljs-built_in, .hljs-selector-class, .hljs-selector-id, .hljs-selector-pseudo { color: #93c5fd; }
  .hljs-variable, .hljs-template-variable { color: #fbbf24; }
  .hljs-deletion { color: #fda4af; }
  .hljs-addition { color: #86efac; }
`;

function postPagе(post) {
	const title = `${post.meta.title} — Code Crispies Blog`;
	const desc = post.meta.description || "";
	const url = `${ORIGIN}/blog/${post.meta.slug}/`;
	const tags = Array.isArray(post.meta.tags) ? post.meta.tags : [];
	const minutes = readingTime(post.body);
	const lang = post.meta.lang || "en";
	const ogLocale = lang === "de" ? "de_DE" : lang === "es" ? "es_ES" : "en_US";
	// Per-post OG image if generated by scripts/generate-blog-og-images.mjs;
	// else fall back to the global brand image.
	const ogImage = existsSync(join(OG_SRC_DIR, `${post.meta.slug}.png`))
		? `${ORIGIN}/blog/${post.meta.slug}/og.png`
		: `${ORIGIN}/og-image.png`;

	// Suggest a related practice link if a tag matches a known module.
	// Map keys = post tags, values = module IDs that are actually loaded
	// in src/config/lessons.js moduleStoreEN. Wrong values send users to
	// a 404 / fallback page (user-reported regression).
	const tagToModule = {
		html: "html-elements",
		css: "css-basic-selectors",
		selectors: "css-basic-selectors",
		typography: "typography-fonts",
		layout: "flexbox",
		responsive: "responsive-design",
		animation: "transitions-animations",
		scroll: "transitions-animations",
		color: "colors-backgrounds",
		grid: "grid",
		flexbox: "flexbox",
		ux: "html-details-summary"
	};
	const practiceTag = tags.find((t) => tagToModule[t]);
	const practiceLink = practiceTag
		? `<p>Want to practice <strong>${escapeHtml(practiceTag)}</strong> hands-on? <a href="/${tagToModule[practiceTag]}/0">Open the ${escapeHtml(practiceTag)} module →</a></p>`
		: '<p>Practice in the browser at <a href="/">codecrispi.es</a> — 135 free interactive lessons.</p>';

	return `<!doctype html>
<html lang="${lang}">
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
<meta property="og:image" content="${ogImage}">
<meta property="og:locale" content="${ogLocale}">
<meta property="article:published_time" content="${post.meta.date}">
${tags.map((t) => `<meta property="article:tag" content="${escapeHtml(t)}">`).join("\n")}
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/rss+xml" title="Code Crispies Blog" href="/blog/rss.xml">
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      headline: post.meta.title,
      datePublished: post.meta.date,
      description: desc,
      url,
      inLanguage: lang,
      author: { "@type": "Organization", name: "LibreTECH", url: "https://librete.ch" },
      publisher: { "@type": "Organization", name: "Code Crispies", url: ORIGIN },
      mainEntityOfPage: url,
      keywords: tags.join(", "),
      image: ogImage
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: ORIGIN + "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: ORIGIN + "/blog/" },
        { "@type": "ListItem", position: 3, name: post.meta.title, item: url }
      ]
    }
  ]
})}
</script>
<link rel="icon" href="/favicon.ico">
<style>${SHARED_STYLES}
  h1 { font-size: 2.25rem; line-height: 1.15; letter-spacing: -.03em; margin: 0 0 .75rem; }
  .meta { color: #6b7280; font-size: .9rem; margin: 0 0 2.25rem; display: flex; gap: .9rem; flex-wrap: wrap; align-items: center; }
  .meta time { color: inherit; }
  .tag { background: #eef2ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: .8rem; }
  article h2 { margin-top: 2.5rem; font-size: 1.5rem; letter-spacing: -.02em; }
  article h3 { margin-top: 2rem; font-size: 1.2rem; }
  article p, article li { font-size: 1.05rem; }
  article :not(pre) > code { background: #eef2ff; color: #312e81; padding: 1px 6px; border-radius: 4px; font-size: .92em; font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
  article kbd { background: #f3f4f6; border: 1px solid #d1d5db; border-bottom-width: 2px; padding: 1px 6px; border-radius: 4px; font-size: .85em; font-family: inherit; }
  article hr { border: 0; border-top: 1px solid #e5e7eb; margin: 2.5rem 0; }
  article blockquote { border-left: 3px solid #4f46e5; padding-left: 1rem; color: #4b5563; font-style: italic; }
  .practice-cta { margin-top: 3rem; padding: 1.25rem 1.5rem; background: linear-gradient(135deg, #eef2ff 0%, #fef3c7 100%); border-radius: 12px; border: 1px solid #c7d2fe; }
  .practice-cta p { margin: 0; }
</style>
</head>
<body>
<header class="site">
  <a class="brand" href="/"><img src="/bowl.png" alt=""><span>CODE CRISPIES</span></a>
  <nav><a href="/blog/">Blog</a> <a href="/">Try it</a></nav>
</header>
<h1>${escapeHtml(post.meta.title)}</h1>
<p class="meta">
  <time datetime="${post.meta.date}">${post.meta.date}</time>
  <span>${minutes} min read</span>
  ${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
</p>
<article>${marked.parse(post.body)}</article>
<aside class="practice-cta">${practiceLink}</aside>
<footer class="site">
  <span>← <a href="/blog/">All posts</a></span>
  <span><a href="/blog/rss.xml">RSS</a> · <a href="https://github.com/nextlevelshit/code-crispies">Source</a></span>
</footer>
<script>
// Code-block copy buttons. Inline so blog pages stay self-contained
// (no extra HTTP request). Decodes data-raw entities and writes to
// clipboard; flashes "copied" for 1.5s.
document.querySelectorAll(".cb-copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const raw = (btn.dataset.raw || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
    try {
      await navigator.clipboard.writeText(raw);
      btn.classList.add("copied");
      const old = btn.textContent;
      btn.textContent = "copied";
      setTimeout(() => { btn.classList.remove("copied"); btn.textContent = old; }, 1500);
    } catch {
      btn.textContent = "press Ctrl+C";
    }
  });
});
</script>
</body>
</html>
`;
}

function indexPage(posts) {
	const items = posts
		.map(
			(p) => `  <li>
    <a href="/blog/${p.meta.slug}/">
      <h2>${escapeHtml(p.meta.title)}</h2>
      <p class="meta"><time datetime="${p.meta.date}">${p.meta.date}</time> · ${readingTime(p.body)} min read</p>
      <p class="excerpt">${escapeHtml(p.meta.description || "")}</p>
    </a>
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
<link rel="alternate" type="application/rss+xml" title="Code Crispies Blog" href="/blog/rss.xml">
<style>${SHARED_STYLES}
  h1 { font-size: 2rem; margin: 0 0 .5rem; letter-spacing: -.02em; }
  .lede { color: #6b7280; margin: 0 0 2rem; font-size: 1.05rem; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin-bottom: 1.25rem; }
  li a { display: block; padding: 1.25rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; text-decoration: none; color: inherit; transition: border-color .15s, transform .15s; }
  li a:hover { border-color: #818cf8; transform: translateY(-1px); }
  li h2 { margin: 0 0 .25rem; font-size: 1.3rem; letter-spacing: -.01em; color: #1f2937; }
  li a:hover h2 { color: #4f46e5; }
  li .meta { color: #9ca3af; font-size: .85rem; margin: 0 0 .5rem; }
  li .excerpt { color: #4b5563; margin: 0; font-size: .98rem; }
</style>
</head>
<body>
<header class="site">
  <a class="brand" href="/"><img src="/bowl.png" alt=""><span>CODE CRISPIES</span></a>
  <nav><a href="/">Try it</a></nav>
</header>
<h1>Blog</h1>
<p class="lede">Hands-on web-development tutorials. Each post is short, code-first, and links back to a Code Crispies module to practice.</p>
<ul>
${items}
</ul>
<footer class="site">
  <span>${posts.length} post${posts.length === 1 ? "" : "s"}</span>
  <span><a href="/blog/rss.xml">RSS</a> · <a href="https://github.com/nextlevelshit/code-crispies">Source</a></span>
</footer>
</body>
</html>
`;
}

function rssFeed(posts) {
	const lastBuild = new Date().toUTCString();
	const items = posts
		.slice(0, 20)
		.map((p) => {
			const url = `${ORIGIN}/blog/${p.meta.slug}/`;
			const pubDate = new Date(`${p.meta.date}T12:00:00Z`).toUTCString();
			return `    <item>
      <title>${escapeHtml(p.meta.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeHtml(p.meta.description || "")}</description>
    </item>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Code Crispies Blog</title>
    <link>${ORIGIN}/blog/</link>
    <description>Hands-on web-development tutorials from the Code Crispies team.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${ORIGIN}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
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

	// Copy per-post OG image into dist if it exists in the source tree.
	const ogSrc = join(OG_SRC_DIR, `${post.meta.slug}.png`);
	if (existsSync(ogSrc)) copyFileSync(ogSrc, join(dir, "og.png"));
}

writeFileSync(join(DIST, "index.html"), indexPage(posts));
writeFileSync(join(DIST, "rss.xml"), rssFeed(posts));

console.log(`✓ wrote ${posts.length} blog post(s) + index + RSS to dist/blog/`);
