---
title: "View Transitions Recap — MPA vs SPA, When to Use Which"
description: "View Transitions ship in two flavors: cross-document for MPAs, same-document for SPAs. Same API surface, different setup. Decision matrix + the gotchas."
date: 2026-05-10
slug: view-transitions-recap
tags: [css, javascript, navigation]
---

We covered both flavors of the View Transitions API in earlier posts: [cross-document for MPAs](/blog/view-transitions-mpa-feel/) and [same-document for SPAs](/blog/view-transitions-spa/). This is the recap — when to reach for which, what works in production, and the gotchas that don't show up in the spec.

## The two modes at a glance

| Mode             | When fired                                  | Setup                              |
|------------------|---------------------------------------------|------------------------------------|
| **Same-document** (SPA) | You call `document.startViewTransition(cb)` | Just call it; control via callback |
| **Cross-document** (MPA) | Browser-driven on `<a>` navigation between pages | Opt-in CSS `@view-transition` + per-element `view-transition-name` |

Both produce the same animations, both use the same `view-transition-*` pseudo-elements. The difference is who calls `startViewTransition` — your code (SPA) or the browser (MPA).

## When to pick MPA mode

If your app is server-rendered (Astro, Rails, Django, Laravel, plain HTML), this is a 5-line opt-in:

```css
@view-transition {
  navigation: auto;
}

.product-image {
  view-transition-name: product-image;
}

::view-transition-old(product-image),
::view-transition-new(product-image) {
  animation-duration: 0.4s;
}
```

The browser snapshots the outgoing page, fetches the new one, snapshots the incoming page, animates between them. **No router. No FLIP. No JS.**

When the new page contains a different element with the same `view-transition-name`, the browser morphs between them. Same as SPA mode, but driven by `<a href>` clicks and back/forward, not JS calls.

## When to pick SPA mode

If you have a real SPA (React/Vue/Solid/Svelte/vanilla), you need to wrap your DOM update:

```js
function navigate(newRoute) {
  if (!document.startViewTransition) {
    return updateDOM(newRoute);
  }
  document.startViewTransition(() => updateDOM(newRoute));
}
```

Pair with the [Navigation API](/blog/navigation-api/) for click interception:

```js
navigation.addEventListener("navigate", (event) => {
  if (!event.canIntercept || event.hashChange) return;
  event.intercept({
    handler: async () => {
      const transition = document.startViewTransition(async () => {
        await renderRoute(event.destination.url);
      });
      await transition.finished;
    }
  });
});
```

Result: SPA route changes morph like the MPA case, plus you get the SPA's incremental DOM updates and shared state.

## Gotcha 1: only one transition at a time

If a transition is already running and another fires, the browser **skips** the new one (or queues it briefly, depending on browser). You can't crossfade rapidly between three states.

Fix: debounce navigation, or `await transition.finished` before triggering the next.

## Gotcha 2: `view-transition-name` must be unique per snapshot

```html
<!-- BAD: two .card elements with same name on the same page -->
<div class="card" style="view-transition-name: card-thumb"></div>
<div class="card" style="view-transition-name: card-thumb"></div>
```

The browser sees ambiguity and aborts the entire transition. Either give each card a unique name (`card-1`, `card-2`) or only name the one currently selected.

Generated names work well:

```html
<div class="card" style="view-transition-name: card-{{id}}"></div>
```

## Gotcha 3: `position: fixed` elements get snapshotted in place

A sticky header with `view-transition-name: site-header` morphs correctly between pages. Without that name, it crossfades in-place — looks fine but you lose the morph.

Always name persistent chrome (`site-header`, `site-nav`, `site-footer`) so they're recognized across the boundary.

## Gotcha 4: scroll position resets to top during transition

By default, the browser snapshots the *visible viewport*. If page A is scrolled 800px down and page B is scrolled to top, the morph looks weird (content jumps).

For SPAs, set scroll behavior explicitly:

```js
event.intercept({
  handler: async () => {
    const t = document.startViewTransition(async () => await render());
    await t.finished;
    window.scrollTo(0, 0);  // explicit
  },
  scroll: "after-transition"  // hint to browser
});
```

For MPAs, the browser handles scroll restoration on back/forward; just be aware.

## Gotcha 5: Iframe and OOPIF cross-document doesn't work

Cross-document transitions only work for navigations inside the **top-level** document. Iframes get a static snapshot. If your app embeds external pages, plan around it.

## Gotcha 6: Back/forward navigation gets the *same* transition

If you set `::view-transition-new(root) { animation: slide-right 0.3s; }`, both forward and back navigations slide right. Use the `:active-view-transition-type()` pseudo-class (Chrome 125+) for direction-aware animations:

```css
@view-transition {
  navigation: auto;
  types: forward, back;  /* declare types you'll use */
}
```

```js
document.startViewTransition({
  update: render,
  types: ['back']  // mark this transition as back-style
});
```

```css
:active-view-transition-type(back) {
  ::view-transition-old(root) { animation: slide-right; }
  ::view-transition-new(root) { animation: slide-left; }
}
:active-view-transition-type(forward) {
  ::view-transition-old(root) { animation: slide-left; }
  ::view-transition-new(root) { animation: slide-right; }
}
```

## Decision matrix

| Your app                              | Pick                                  |
|---------------------------------------|---------------------------------------|
| Server-rendered HTML pages            | **MPA mode** (`@view-transition` CSS) |
| Astro / Eleventy / Hugo               | **MPA mode**                          |
| React/Vue/Svelte SPA                  | **SPA mode** + Navigation API         |
| Hybrid (some SPA, some full reload)   | Both — SPA mode for in-app, MPA mode wraps the rest |
| Complex animation per-route           | **SPA mode** (full JS control)        |
| Just want fade between pages          | **MPA mode** (CSS-only, 3 lines)      |

## Reduced-motion always

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0s;
  }
}
```

Snapshot-then-replace, no animation. Page still swaps cleanly.

## Browser support summary

- **Same-document (SPA)**: Chrome 111+ (March 2023), Safari 18+, Firefox in development
- **Cross-document (MPA)**: Chrome 126+ (June 2024), Safari 18.2+, Firefox planned

Both have an `if (document.startViewTransition)` or `@supports` fallback path. Older browsers see standard navigations — degrades cleanly.

## What this kills

- FLIP libraries used only for route animations
- React Router transition wrappers that pre-2024 needed framer-motion
- Loading spinners between pages (the morph IS the loading state)
- Animation libraries imported just for "shared element transitions"

For most app's route-level animations, picking which View Transitions mode replaces the lib decision entirely.

---

Practice CSS animations in the [`transitions-animations`](/transitions-animations/0/) module on [Code Crispies](/).
