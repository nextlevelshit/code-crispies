# Code Crispies Roadmap

## Current State (2026-05-10)

| Metric | Value |
|---|---|
| Total active lessons | 174 |
| Active modules | 32 |
| Languages | EN (full), DE (full 32/32), PL/ES/AR/UK (chrome only) |
| Blog posts | 45 |
| Mode coverage | CSS, HTML, Tailwind, JS, Markdown |

Milestone progress system, dark mode, onboarding tour, lesson search, cloud sync, per-route SEO pre-rendering, RSS, PWA, footer redesign, image optimization pipeline, multi-instance & Cloudflare-prep runbooks — all shipped.

---

## Forward backlog

### Content

- More JS modules (closures, async, modules, fetch, error handling)
- Tailwind utility deep-dives (current Tailwind module is light)
- Advanced CSS: container queries, anchor positioning, scroll-driven animations, view transitions, has() patterns (some are blog posts — convert to interactive lessons)
- HTML media: picture/srcset, audio/video, accessibility lessons (ARIA, skip links, focus mgmt)
- Markdown: frontmatter, MDX-style components

### Languages

- Complete PL/ES/AR/UK lesson translations (currently chrome-only with EN fallback)
- Decide: machine-assist (DeepL/Claude) or pause until traffic warrants per-language effort

### Platform

- Lesson editor: vim/emacs keybindings (opt-in)
- Account-less progress export (download JSON / scan QR)
- Server-side OG image generation per-lesson (currently per-blog-post only)
- Sitemap pings on deploy

### Infra (deferred until traffic forces)

- Cloudflare proxy (free tier) — runbook ready in `docs/CLOUDFLARE-PREP.md`, gray-cloud dormant config
- Multi-instance — three-path plan in `docs/MULTI-INSTANCE.md` (single-VPS → CF → 2-VPS → k3s)

### Strategic (user decisions)

- USP positioning — pick one of: broadest-free / self-host story / multilingual angle
- Defensive EUTM filing (~EUR 1250, optional)
- Outreach gate: 33 awesome-PRs / newsletters / reddit / discord / Show HN, all blocked on ★50 milestone

---

## Out of scope

- Authentication / user accounts (cloud sync uses anonymous Supabase Realtime)
- Paid tiers
- Mobile app wrapper (PWA installable already covers it)
- Server-side lesson validation (all client-side; faster + simpler)

---

## Non-goals

- Replicating freeCodeCamp — Code Crispies stays narrow on CSS/HTML/Tailwind/JS-snippet/Markdown drills
- Becoming a full LMS — no quizzes, no certificates, no grading
