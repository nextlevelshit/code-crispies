---
title: "View Transitions API — SPA-Feel Without an SPA"
description: "Cross-document view transitions let plain server-rendered pages animate between each other like a single-page app. Two CSS lines, no router."
date: 2026-05-10
slug: view-transitions-mpa-feel
tags: [css, navigation, performance]
---

The reason teams reach for SPAs is rarely the architecture. It's the *feel*: nothing flashes white between pages, the previous content fades out, the new one fades in. View Transitions give a regular multi-page site that exact behavior — no JavaScript framework required.

## Cross-document view transitions in two lines

```css
@view-transition {
  navigation: auto;
}
```

That single rule, on every page of your site, opts the navigation into transitioned page swaps. The browser captures the old page, navigates, then animates the cross-fade to the new one. Default duration ~0.25s.

That's it for the baseline. The page-flash is gone.

## Naming elements that should morph

```html
<!-- on the listing page -->
<a href="/posts/native-popover">
  <article class="card" style="view-transition-name: card-popover">
    <h2>Native Popovers</h2>
    <p class="excerpt">…</p>
  </article>
</a>

<!-- on the post page -->
<article class="hero" style="view-transition-name: card-popover">
  <h1>Native Popovers</h1>
  <p class="excerpt">…</p>
</article>
```

The browser sees the same `view-transition-name` on both pages and animates the rectangle from old position/size to new. Hero animations between routes — no React Router shared element, no Framer Motion. Just an attribute.

## Customizing the transition

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

/* Specific element transitions inherit naming */
::view-transition-old(card-popover) {
  animation-name: slide-out-left;
}
::view-transition-new(card-popover) {
  animation-name: slide-in-right;
}

@keyframes slide-out-left {
  to { transform: translateX(-100%); opacity: 0; }
}
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
}
```

`::view-transition-old(name)` and `::view-transition-new(name)` give you the snapshot pseudo-elements for any named region. Style them like normal — animations, filters, transforms.

## Caveats

- **Same-origin only.** Cross-origin navigations don't transition (security).
- **Only one named element per page** with a given `view-transition-name`. Two cards with `view-transition-name: foo` collide and the transition silently fails.
- **Print media + `prefers-reduced-motion`** automatically skip transitions. No extra CSS needed.
- **The new page must finish parsing fast** — the browser waits for it to be ready before swapping. If it takes >4s, the transition aborts and you get the normal navigation. So this works *with* fast pages, not as a hack to hide slow ones.

## Browser support (2026-05)

- **Cross-document** (`@view-transition` rule): Chrome 126, Edge 126, Safari 18.2. Firefox: in flight, not yet shipped.
- **Same-document** (`document.startViewTransition()`): all major engines since 2024.

For Firefox users, the navigation works exactly as before — no transition, but no breakage. Pure progressive enhancement.

## When *not* to use it

- **You already have an SPA.** Use same-document transitions inside the SPA via `document.startViewTransition()`. The `@view-transition` rule is for the *cross-document* path.
- **You need pixel-perfect control over every animation step.** Browser-driven transitions are great for the 80% case. For complex choreography, you still want a JS animation library.

## What this replaces

Before view transitions, achieving SPA-feel on a multi-page site meant Turbolinks / Hotwire or a full SPA framework. View Transitions is the platform doing it natively, with a strict subset of the API surface needed to ship the feature.

I removed Turbo from a small marketing site and dropped the JS bundle by 35 KB. Same UX. The platform finally caught up.

---

Practice modern CSS at [Code Crispies](/) — interactive lessons with live preview cover [transitions and animations](/transitions-animations/0/).
