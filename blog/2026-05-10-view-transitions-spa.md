---
title: "View Transitions for SPAs — Smooth Route Changes in 5 Lines of CSS"
description: "Same-document View Transitions API turns hash/route changes into morphing animations. No FLIP, no reconciler magic — just startViewTransition() and a CSS rule."
date: 2026-05-10
slug: view-transitions-spa
tags: [css, javascript, animation]
---

You've shipped a single-page app. Route changes are instant — but jarring. The new view appears, the old one vanishes, and users lose track of where things moved. The fix used to require FLIP libraries, framer-motion, or hand-tuned CSS transforms. The View Transitions API replaces all of it.

We covered cross-document view transitions for MPAs in [an earlier post](/blog/view-transitions-mpa-feel/). This is the same-document version — for SPAs.

## The 5-line basics

```js
function navigate(newRoute) {
  if (!document.startViewTransition) {
    renderRoute(newRoute);  // fallback for older browsers
    return;
  }
  document.startViewTransition(() => renderRoute(newRoute));
}
```

That's it. The browser snapshots the page before your callback, runs your DOM update synchronously, snapshots after, and crossfades between the two. No additional code.

## The default crossfade

By default, the entire `<html>` root crossfades. Smooth, but generic. To name regions and animate them independently:

```css
.lesson-card {
  view-transition-name: lesson-card;
}
```

Now during a transition, the browser knows that `.lesson-card` on page A and `.lesson-card` on page B are the *same* element. It morphs position, size, and opacity from old to new — even if they're in completely different parts of the DOM tree.

## A real example: lesson list → detail

```html
<!-- list view -->
<a href="/lesson/42" class="lesson-card" style="view-transition-name: card-42">
  <h3>Flexbox basics</h3>
</a>

<!-- detail view (after navigate) -->
<article class="lesson-detail" style="view-transition-name: card-42">
  <h1>Flexbox basics</h1>
  ...
</article>
```

Same `view-transition-name` on the source card and the destination header → browser morphs the card into the header. Position changes, size changes, font scales, all interpolated. Zero animation code in JS.

## Customize the animation

The browser exposes pseudo-elements for each named region:

```css
::view-transition-old(card-42) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
::view-transition-new(card-42) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
```

Or override the default crossfade entirely:

```css
::view-transition-old(root) {
  animation: slide-out 0.3s ease-in;
}
::view-transition-new(root) {
  animation: slide-in 0.3s ease-out;
}

@keyframes slide-out {
  to { transform: translateX(-30%); opacity: 0; }
}
@keyframes slide-in {
  from { transform: translateX(30%); opacity: 0; }
}
```

## The real win: no animation library

Pre-2024, smooth route transitions in a vanilla SPA looked like:

```js
const oldEl = currentCard.getBoundingClientRect();
renderNewRoute();
const newEl = newHeader.getBoundingClientRect();
const dx = oldEl.left - newEl.left;
const dy = oldEl.top - newEl.top;
const scaleX = oldEl.width / newEl.width;
const scaleY = oldEl.height / newEl.height;
newHeader.animate([
  { transform: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})` },
  { transform: 'none' }
], { duration: 400, easing: 'cubic-bezier(.2,0,0,1)' });
```

That's the FLIP technique. View Transitions reduce it to two CSS lines + one `view-transition-name`.

## Awaiting the transition

`startViewTransition()` returns a `ViewTransition` object with promises:

```js
const transition = document.startViewTransition(() => updateDOM());

transition.ready.then(() => {
  // Snapshots taken, animation about to play
});

transition.finished.then(() => {
  // Animation done, page settled
  trackEvent("route_transitioned");
});
```

Use `finished` to chain side-effects (analytics, focus management) so they don't fire mid-animation.

## Reduced motion

Always honor the user preference:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0s;
  }
}
```

Snapshot and switch instantly — no animation, but still no flash of unstyled content.

## Browser support

- Chrome / Edge 111+ (March 2023) — same-document
- Safari 18+ (September 2024)
- Firefox: implementing as of 2026

For Firefox today, your `if (!document.startViewTransition)` fallback gives them the unanimated swap. No broken state, just no morph.

## When NOT to reach for it

- **Animations longer than ~500ms**: feels sluggish on a route change.
- **Pages with completely different layouts**: the crossfade looks like a flash. Either name nothing (skip the API entirely) or name the persistent chrome (header/nav) so only the body swaps.
- **Inside a frame-tight render loop** (game, scrollytelling): the snapshot/replace cycle adds overhead.

## What to retire

If you're using framer-motion, react-spring, or a FLIP library *only* for route transitions, you can drop them. They still earn their keep for in-component micro-interactions, but the route-level crossfade is now a platform feature.

---

Practice CSS animations in the [`transitions-animations`](/transitions-animations/0/) module on [Code Crispies](/) — covers `transition`, `@keyframes`, and `animation` properties.
