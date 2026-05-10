---
title: "@scope — Style Without Naming Things"
description: "@scope lets you style components without BEM, without CSS modules, without compile steps. Specificity stays low, leaks stop, and tree-walking selectors stay fast."
date: 2026-05-10
slug: css-scope-rule
tags: [css, architecture]
---

The hardest problem in CSS isn't centering things — it's preventing styles from leaking. The standard solutions all add overhead: BEM names get long, CSS Modules need a build step, Shadow DOM needs a custom element. The `@scope` rule is the platform's answer.

## The basic idea

```html
<article class="card">
  <h2>Title</h2>
  <p>Lorem...</p>
  <footer><a href="#">Read more</a></footer>
</article>
```

```css
@scope (.card) {
  h2 { font-size: 1.25rem; color: #1f2937; }
  p { color: #6b7280; }
  footer a { color: #4f46e5; }
}
```

The selectors inside `@scope` only match descendants of `.card`. No BEM, no nesting wrapper, no `.card h2 {}` repetition. Bare `h2` is enough.

## Scope boundaries

The real magic is the second argument — `to`:

```css
@scope (.card) to (.card-footer) {
  h2 { font-size: 1.25rem; }
  p { color: #6b7280; }
}
```

Now `h2` and `p` only style the parts of `.card` that come *before* `.card-footer`. Anything inside the footer is excluded — even if it's a `<p>`. Useful for nested components: outer scope, inner scope, no leakage between them.

## Why this beats nesting alone

Native nesting (which we covered [here](/blog/css-nesting-native-no-postcss/)) does this:

```css
.card {
  h2 { font-size: 1.25rem; }
  p { color: #6b7280; }
}
```

Compiles down to `.card h2 { ... }` and `.card p { ... }`. Specificity climbs (`0,1,1`), and there's no `to` boundary. `@scope` keeps specificity at the inner selector's level (`0,0,1` for plain `h2`) and supports boundaries.

## Donut scope (no boundary specified)

```css
@scope (.profile) {
  :scope {
    border: 1px solid #e5e7eb;
    padding: 1rem;
  }
  h3 { font-weight: 600; }
}
```

`:scope` references the scope root itself, so you can style both the container and its contents in one block. No more `.profile { ... } .profile h3 { ... }` split.

## Proximity-based specificity

The big behavioral difference: when two `@scope` rules match, the one whose root is **closest** to the matched element wins, regardless of source order:

```html
<article class="card theme-blue">
  <article class="card theme-red">
    <h2>Inner</h2>
  </article>
</article>
```

```css
@scope (.theme-blue) { h2 { color: blue; } }
@scope (.theme-red)  { h2 { color: red; } }
```

The inner `<h2>` is red, because its closest scope root is `.theme-red`. With normal selectors, you'd need to game source order or specificity. With `@scope`, the DOM proximity decides.

## Component pattern in 2026

A self-contained component without BEM, without Shadow DOM, without modules:

```html
<style>
  @scope {
    :scope { padding: 1rem; border-radius: 8px; background: var(--bg, white); }
    h2 { font-size: 1.25rem; margin: 0 0 .5rem; }
    p { margin: 0; color: #6b7280; }
  }
</style>
<article>
  <h2>Crispy Cereal</h2>
  <p>Stays crunchy in milk.</p>
</article>
```

The `<style>` is inside an HTML island; `@scope` with no argument scopes to the parent of the `<style>` element. The styles only apply to *that* article. Drop the same component in twice — they don't interfere.

## When NOT to use it

- **Global resets** (`* { box-sizing: border-box }`) — these are deliberately global.
- **Design tokens / theme variables** — keep on `:root` for inheritance.
- **One-off page styles** — overkill if you've got 5 selectors total.

`@scope` shines for component CSS, especially in design systems and multi-author codebases where leakage is the dominant cost.

## Browser support

- Chrome / Edge 118+ (October 2023)
- Safari 17.4+ (March 2024)
- Firefox: in development as of 2026

For Firefox today, the entire `@scope` block fails to parse — so anything inside is lost. Either gate with `@supports at-rule(@scope)` or accept that pre-shipping Firefox sees the inner styles unscoped.

```css
@supports at-rule(@scope) {
  @scope (.card) {
    /* ... */
  }
}
```

## What this kills (over time)

- BEM naming conventions (`.card__title--large`)
- CSS Modules build pipelines for scoping
- Most uses of `:where()` for "specificity flattening"
- Style overrides that only exist because some other component leaked into your tree

When `@scope` is universally available, the cleanest CSS shifts from "name everything uniquely" to "wrap each component in a scope and write plain selectors."

---

Hands-on selector practice in [`css-basic-selectors`](/css-basic-selectors/0/) on [Code Crispies](/).
