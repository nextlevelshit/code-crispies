---
title: "fetchpriority — Tell the Browser What Loads First"
description: "fetchpriority is the one HTML attribute that lifts LCP by 30%+ on hero-heavy pages. Browser-native priority hints, no JS, no preload tricks."
date: 2026-05-10
slug: fetch-priority-hint
tags: [html, performance]
---

The hero image is what your user sees. The browser doesn't know that. By default it requests resources in DOM order, with stylesheets / scripts taking priority over images. Result: your hero image waits in the queue while a tracking script loads. `fetchpriority` fixes this in one HTML attribute.

## The basic case

```html
<img src="/hero.jpg" alt="…" fetchpriority="high">
```

That tells the browser: this image is critical, request it before other images and most non-blocking resources. On a typical landing page this lifts **LCP (Largest Contentful Paint) by 200–500ms**.

## Three values

| Value     | Behavior                                       |
|-----------|------------------------------------------------|
| `high`    | Fetch ASAP, ahead of default-priority resources |
| `low`     | Defer until after high+default work            |
| `auto`    | Default; browser heuristics decide             |

## Real wins

### Hero LCP

Without:
```html
<img src="/hero.jpg" alt="">  <!-- loads after CSS, after deferred scripts -->
```

With:
```html
<img src="/hero.jpg" alt="" fetchpriority="high">
```

Chrome dev report from the spec proposal: median LCP improvement 12%, p95 improvement 27% on real-world e-commerce hero pages.

### Below-the-fold images

```html
<img src="/footer-art.jpg" loading="lazy" fetchpriority="low" alt="">
```

Lazy-load AND deprioritize. The browser knows it's below-the-fold (lazy) AND not critical (low priority). It hits the network last.

### Preload + priority

```html
<link rel="preload" as="font" href="/inter.woff2" fetchpriority="high" crossorigin>
```

For preloaded resources you can override their default priority. Useful when you want to preload a font early but not block the LCP image.

## Works with fetch() too

```js
fetch("/api/critical-data", { priority: "high" });
fetch("/api/analytics", { priority: "low" });
```

Same three values. The browser respects the hint when scheduling concurrent requests.

## What it isn't

- **A guarantee.** It's a hint. The browser can ignore it under memory pressure or weird network conditions.
- **Bandwidth control.** All requests still share the same connection budget; high-priority just goes first.
- **A replacement for `loading="lazy"`** for off-screen images. Lazy stops them entirely until needed; `fetchpriority="low"` still loads them, just after.

## Common combos

```html
<!-- LCP image -->
<img src="/hero.jpg" alt="…" fetchpriority="high" decoding="async">

<!-- Above-the-fold but not LCP -->
<img src="/sidebar.jpg" alt="…">

<!-- Below-the-fold -->
<img src="/footer.jpg" alt="…" loading="lazy" fetchpriority="low">
```

```html
<!-- Critical CSS already inlined; this is theme override -->
<link rel="stylesheet" href="/theme.css" fetchpriority="low">

<!-- Web font for hero text -->
<link rel="preload" as="font" href="/hero-font.woff2" fetchpriority="high" crossorigin>
```

## The trap: don't mark everything high

If five things are `high`, none of them is. The browser will load them sequentially in DOM order, defeating the hint.

Pick at most **one image** as `high` per viewport. Maybe two if you have a hero plus an above-fold logo.

## Browser support

- Chrome / Edge 101+ (April 2022)
- Safari 17.2+ (December 2023)
- Firefox 132+ (October 2024)

For older browsers, the attribute is ignored — no harm done. Pure progressive enhancement.

## Pair with the LCP candidate detection

Use Chrome DevTools → Performance → Web Vitals trace to find your actual LCP element. Often it's NOT the obvious hero — it's a banner image, a heading, or a video poster. Mark THAT element with `fetchpriority="high"`.

```js
// In dev console: find your LCP candidate
new PerformanceObserver((list) => {
  const lcp = list.getEntries().at(-1);
  console.log("LCP:", lcp.element, lcp.size);
}).observe({ type: "largest-contentful-paint", buffered: true });
```

## When to actually skip it

- **Static blog posts with no critical image** — text-LCP isn't fetch-bound
- **Apps where every image is critical** (a gallery): use a different strategy (preload the first 2-3 explicitly)
- **Video-first pages** — fetchpriority on `<video poster>` works but the real LCP is often the first video frame

## Cheap fix vs lasting fix

`fetchpriority="high"` is the cheapest perceived-speed improvement on the platform — one attribute, 200–500ms on real hardware. Most teams discover it after spending months on bundle splitting and caching strategies. Try it first.

---

Practice modern HTML in the [`html-elements`](/html-elements/0/) module on [Code Crispies](/) — covers semantic elements + media attributes.
