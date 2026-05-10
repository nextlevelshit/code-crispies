#!/usr/bin/env node
/**
 * Generates one OpenGraph image per blog post by rendering an HTML
 * template into a 1200×630 PNG via headless chromium.
 *
 * Run locally before committing new posts:
 *   node scripts/generate-blog-og-images.mjs
 *
 * Output: blog/og/<slug>.png — committed to repo so the build step
 * doesn't need chromium in CI. Posts with missing OG fall back to the
 * global /og-image.png in generate-blog.mjs.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "blog");
const OG_DIR = join(BLOG_DIR, "og");
const TMP_HTML = "/tmp/cc-blog-og.html";

mkdirSync(OG_DIR, { recursive: true });

function parseFrontmatter(raw) {
	const m = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!m) return {};
	const meta = {};
	for (const line of m[1].split("\n")) {
		const kv = line.match(/^([a-z_]+):\s*(.+)$/i);
		if (!kv) continue;
		let [, k, v] = kv;
		v = v.trim();
		if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
		if (v.startsWith("[") && v.endsWith("]")) v = v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
		meta[k] = v;
	}
	return meta;
}

function escapeHtml(s) {
	return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function htmlFor({ title, tags, date }) {
	return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body { margin:0; padding:0; width:1200px; height:630px; overflow:hidden; background:#1e1b4b; color:#fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; }
  body { padding:80px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; position:relative; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); }
  .grid { position:absolute; inset:0; background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px); background-size: 48px 48px; pointer-events:none; }
  header { display:flex; align-items:center; gap:14px; font-weight:800; letter-spacing:-.02em; font-size:24px; z-index:2; }
  header img { width:48px; height:48px; }
  header span { color:#fde047; }
  h1 { font-size:64px; line-height:1.1; letter-spacing:-.03em; margin:0; max-width: 1040px; z-index:2; font-weight:800; }
  .footer { display:flex; justify-content:space-between; align-items:flex-end; z-index:2; }
  .tags { display:flex; gap:10px; flex-wrap:wrap; }
  .tag { font-size:18px; background:rgba(253,224,71,.18); border:1px solid rgba(253,224,71,.5); color:#fde047; padding:6px 14px; border-radius:999px; font-weight:600; }
  .meta { font-size:18px; color:rgba(255,255,255,.65); }
  .url { font-size:18px; font-weight:700; letter-spacing:.02em; color:rgba(255,255,255,.85); }
</style></head><body>
  <div class="grid"></div>
  <header>
    <img src="file://${ROOT}/public/bowl.png" alt="">
    <span>CODE</span> <span style="color:#fde047">CRISPIES</span>
  </header>
  <h1>${escapeHtml(title)}</h1>
  <div class="footer">
    <div class="tags">${tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join("")}</div>
    <div>
      <div class="meta">${escapeHtml(date)}</div>
      <div class="url">codecrispi.es/blog</div>
    </div>
  </div>
</body></html>`;
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
let made = 0;
for (const file of files) {
	const meta = parseFrontmatter(readFileSync(join(BLOG_DIR, file), "utf8"));
	if (!meta.slug || !meta.title) continue;

	const tags = Array.isArray(meta.tags) ? meta.tags : [];
	const html = htmlFor({ title: meta.title, tags, date: meta.date || "" });
	writeFileSync(TMP_HTML, html);

	const out = join(OG_DIR, `${meta.slug}.png`);
	try {
		execFileSync("chromium", [
			"--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
			"--default-background-color=00000000",
			"--window-size=1200,630",
			`--screenshot=${out}`,
			`file://${TMP_HTML}`
		], { stdio: "pipe" });
		made++;
	} catch (e) {
		console.error(`  fail: ${meta.slug}: ${e.message.split("\n")[0]}`);
	}
}

if (existsSync(TMP_HTML)) unlinkSync(TMP_HTML);
console.log(`✓ wrote ${made} blog OG image(s) to blog/og/`);
