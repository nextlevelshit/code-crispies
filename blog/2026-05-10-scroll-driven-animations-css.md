---
title: "Scroll-Driven Animations — Keyframes Triggered by Scroll, No JS"
description: "animation-timeline lets CSS animations advance based on scroll position. Reading-progress bars, parallax, scrubbed reveals — all without IntersectionObserver."
date: 2026-05-10
slug: scroll-driven-animations-css
tags: [css, animation, scroll]
---

Animations bound to scroll position used to mean GreenSock + ScrollMagic, or hand-rolled `IntersectionObserver` + RAF loops. CSS now ties any keyframe animation to scroll progress — declaratively, with no JavaScript.

## Reading progress bar in 8 lines

```css
@keyframes grow {
  from { width: 0; }
  to   { width: 100%; }
}

.progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 4px;
  background: var(--accent);
  animation: grow linear;
  animation-timeline: scroll(root);
}
```

That's it. The `animation-timeline: scroll(root)` ties the animation's progress to scrolling the root scroller (i.e. the page). Scroll 50% down → animation at 50% → bar at 50% width.

No `requestAnimationFrame`, no scroll listener, no `e.preventDefault()`. The browser does the math.

## Reveal on scroll with `view-timeline`

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

`view()` ties the animation to **the element's own viewport progress**. `animation-range` says "play from when the element starts entering to when it's covered 30%." So as the card scrolls into view, it fades in over the first 30% of its travel. Scroll back up → animation reverses.

This is the IntersectionObserver-fade-in pattern, in 4 lines of CSS, with butter-smooth performance (browser-paint-thread, not main-thread JS).

## Animation ranges in plain English

| Range keyword | Means |
|---|---|
| `cover 0%` | the element first touches the viewport |
| `entry 0%` | element starts entering the viewport |
| `entry 100%` | element is fully inside the viewport |
| `contain 0%` | element is fully inside (same as entry 100%) |
| `contain 100%` | element starts to leave |
| `exit 0%` | element starts leaving |
| `exit 100%` | element is fully out of view |
| `cover 100%` | element no longer touches the viewport |

You can mix: `animation-range: entry 0% exit 100%` runs the animation from "first appears" to "fully gone" — full-trip parallax.

## Horizontal scroller that animates as it scrolls

```css
.gallery {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}

.gallery img {
  scroll-snap-align: center;
  animation: zoom-in linear;
  animation-timeline: view(inline);
  animation-range: contain 0% contain 100%;
}

@keyframes zoom-in {
  0%, 100% { transform: scale(0.85); opacity: 0.6; }
  50%      { transform: scale(1); opacity: 1; }
}
```

`view(inline)` watches the inline (horizontal) axis. Each image scales up at center, scales down at edges. Pure scroll-driven, no JS sync.

## Multiple animations sharing one timeline

```css
.section {
  scroll-timeline: --section-trip block;
}

.section h2,
.section .icon,
.section p {
  animation-timeline: --section-trip;
  animation-range: entry 20% entry 80%;
}

.section h2  { animation: fade-in; animation-delay: 0%; }
.section .icon { animation: fade-in; animation-delay: 10%; }
.section p   { animation: fade-in; animation-delay: 20%; }
```

`scroll-timeline` on the section names a timeline. Children attach to it via `animation-timeline: --section-trip`. Stagger via `animation-delay` (interpreted as % of the timeline). Choreographed reveals without orchestration JavaScript.

## Performance notes

- Scroll-driven animations run on the **compositor** thread. Doesn't matter how heavy your JS main thread is — these animations stay smooth.
- `animation-timeline: scroll()` is essentially free. The browser already tracks scroll position; you're just listening.
- `view()` is slightly more work because the browser has to track each element's intersection — but still cheaper than `IntersectionObserver` callbacks.

## Browser support (2026-05)

[Caniuse](https://caniuse.com/css-scroll-driven-animations):

- Chrome / Edge 115 (July 2023)
- Safari: in flight, behind a flag
- Firefox: not yet shipped

For unsupported browsers, the animation falls back to its initial state (or you can set sensible static styles via `@supports not (animation-timeline: view())`). No breakage, just no scroll-trigger.

```css
@supports not (animation-timeline: view()) {
  .card { opacity: 1; transform: none; }
}
```

## When NOT to use it

- **Animations that need to react to non-scroll events** — clicks, hover, network state. Stay with `transition` or JS.
- **Triggering side-effects** (analytics events, lazy-load) on scroll. The animation doesn't tell JS anything happened. Keep `IntersectionObserver` for that side of the work.
- **Scroll-jacking effects** (snap to next section). Different concept; use `scroll-snap-type` for that.

## What this replaces

- `IntersectionObserver` setups for fade-in-on-scroll → scroll-driven CSS
- ScrollTrigger / parallax libraries for simple effects → scroll-driven CSS
- Hand-rolled scroll listeners for reading-progress bars → 8 lines of CSS

I rewrote a marketing page's parallax + reveal effects last week. -47 KB JavaScript, +12 lines of CSS, smoother on mobile because everything moved off the main thread.

---

Animations live in the [`transitions-animations`](/transitions-animations/0/) module on [Code Crispies](/) — interactive practice with live preview.
