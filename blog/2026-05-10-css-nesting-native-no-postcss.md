---
title: "Native CSS Nesting — Stop Compiling for Sass-Style Code"
description: "Browsers ship CSS Nesting natively. The Sass syntax you've used for a decade now works in plain .css files, no preprocessor."
date: 2026-05-10
slug: css-nesting-native-no-postcss
tags: [css, architecture]
---

The single biggest reason teams kept Sass after CSS variables landed was **nesting**. That excuse is gone — browsers ship native CSS Nesting in plain `.css` files. No build step, no `@import`, no preprocessor.

## The basic syntax

```css
.card {
  background: white;
  padding: 1rem;
  border-radius: 8px;

  &:hover {
    background: #f3f4f6;
  }

  & h2 {
    margin-top: 0;
    font-size: 1.25rem;
  }

  & .meta {
    color: #6b7280;
  }
}
```

Reads identical to Sass. Compiles down to:

```css
.card { background: white; padding: 1rem; border-radius: 8px; }
.card:hover { background: #f3f4f6; }
.card h2 { margin-top: 0; font-size: 1.25rem; }
.card .meta { color: #6b7280; }
```

But there is no compile step. The browser does it.

## The `&` is now mandatory (in modern syntax)

Original CSS Nesting required `&` always. Modern browsers (Chrome 120+, Safari 17.2+, Firefox 117+) accept it implicitly:

```css
/* Modern: works without & */
.card {
  h2 { font-size: 1.25rem; }    /* implies & h2 */
  .meta { color: #6b7280; }     /* implies & .meta */
}
```

Whether to use explicit `&` is style preference — Sass habit says yes, brevity says no. Both compile identically.

## Where it shines: media queries

```css
.card {
  padding: 1rem;

  @media (min-width: 600px) {
    padding: 1.5rem;
  }

  @media (min-width: 900px) {
    padding: 2rem;
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

Component + its breakpoints in one block. No more "find the matching `@media` 200 lines below."

## Container queries nest the same way

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @container (min-width: 400px) {
    flex-direction: row;
    gap: 1rem;
  }
}
```

## Pseudo-class composition

```css
.btn {
  background: var(--brand);

  &:hover { background: var(--brand-light); }
  &:focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-primary { color: white; font-weight: 600; }
  &.btn-ghost { background: transparent; border: 1px solid currentColor; }
}
```

Variants and states colocated with the base rule.

## The one Sass thing CSS still can't do

Sass's `@mixin` / `@include` and `@function` have no native CSS equivalent yet. If your codebase relies heavily on parameterized mixins, Sass remains useful. For everything else (variables, nesting, color manipulation via `color-mix`, `:is()` / `:where()`), plain CSS is enough.

For functions specifically, watch [CSS Functions Module Level 1](https://drafts.csswg.org/css-mixins/) — `@function` is in the spec, just not shipped yet.

## What changes in practice

I converted a 1500-line Sass file to plain CSS last month:

- Build pipeline lost `sass` dep (-3 MB node_modules)
- Build time dropped 1.8s (no transpile step)
- DevTools showed actual line numbers instead of generated mappings
- Source CSS is what ships — debug the same file you write

## Browser support

[Caniuse](https://caniuse.com/css-nesting):

- Chrome / Edge 120 (December 2023)
- Safari 17.2 (December 2023)
- Firefox 117 (August 2023)

Everything from 2024+. For older browsers, the entire nested rule fails to parse — so this is **not** progressive enhancement. Either gate via `@supports selector(&)` or accept that pre-2024 browsers see no styles for those rules.

```css
@supports selector(&) {
  .card {
    & h2 { font-size: 1.25rem; }
  }
}
```

For most modern audiences, the `@supports` guard isn't worth the verbosity.

---

Hands-on selector practice in [`css-basic-selectors`](/css-basic-selectors/0/) on [Code Crispies](/) — interactive lessons with live preview.
