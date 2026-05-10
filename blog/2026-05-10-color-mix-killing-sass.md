---
title: "color-mix() — CSS Now Does What You Used Sass For"
description: "Lighten, darken, tint, mix theme colors — pure CSS, no preprocessor. color-mix() and relative color syntax killed half my Sass usage."
date: 2026-05-10
slug: color-mix-killing-sass
tags: [css, color, theming]
---

Three years ago, `lighten()` and `darken()` were the killer reason to keep Sass. Today browsers have `color-mix()` plus the relative color syntax — same power, no build step.

## color-mix(): the workhorse

```css
:root {
  --brand: #4f46e5;
}

.btn:hover {
  /* 80% brand + 20% white = lighter shade */
  background: color-mix(in srgb, var(--brand) 80%, white);
}

.btn:active {
  /* 80% brand + 20% black = darker shade */
  background: color-mix(in srgb, var(--brand) 80%, black);
}

.text-muted {
  /* Same brand color, 60% opacity through mix-with-transparent */
  color: color-mix(in srgb, var(--brand) 60%, transparent);
}
```

The signature: `color-mix(in <colorspace>, <color> <percentage>, <color> <percentage>)`. Both percentages add to 100%; either can be omitted (defaults to 50/50).

## The colorspace matters more than you'd think

```css
/* sRGB: simple linear interpolation, what you used to get */
color-mix(in srgb, red 50%, blue);            /* muddy purple */

/* OKLCH: perceptually uniform, what you usually want */
color-mix(in oklch, red 50%, blue);           /* clean violet */

/* OKLAB: same family, a/b axes instead of chroma/hue */
color-mix(in oklab, red 50%, blue);

/* Use longer hue path for rainbow gradients */
color-mix(in oklch longer hue, red 50%, blue);
```

Default to `oklch` for theme work. The transitions look right to the human eye, no sudden gray midpoint.

## Relative colors: take a base, modify a channel

```css
:root {
  --brand: oklch(60% 0.18 270);  /* indigo-ish */
}

.btn:hover {
  /* Same hue & chroma, lift lightness by 8% */
  background: oklch(from var(--brand) calc(l + 0.08) c h);
}

.btn:disabled {
  /* Half the chroma = washed out */
  background: oklch(from var(--brand) l calc(c * 0.5) h);
}

.text-on-brand {
  /* Pick contrasting text from the same hue family */
  color: oklch(from var(--brand) clamp(0, 1 - l, 1) c h);
}
```

This is `oklch(from <color> <new-l> <new-c> <new-h>)` — every channel can be a calc on the original. Pure functional color manipulation, evaluated at paint time.

## Theming with one variable

```css
:root {
  --brand: #4f46e5;

  /* derive a full palette from one input */
  --brand-50:  color-mix(in oklch, var(--brand) 8%,  white);
  --brand-100: color-mix(in oklch, var(--brand) 16%, white);
  --brand-200: color-mix(in oklch, var(--brand) 32%, white);
  --brand-500: var(--brand);
  --brand-700: color-mix(in oklch, var(--brand) 70%, black);
  --brand-900: color-mix(in oklch, var(--brand) 90%, black);
}

[data-theme="forest"] {
  --brand: oklch(55% 0.15 145);  /* green */
}
```

Change one variable, everything re-derives. No Sass build, no JavaScript.

## What still needs a preprocessor / JS

- **Color-difference algorithms** (WCAG contrast ratio, ΔE2000) — CSS gives you `color-contrast()` but it's still patchy. For real APCA contrast: JS.
- **Conditional theme generation at build** (Tailwind plugins emitting palettes) — still build-time, but you can keep the *output* as `color-mix` calls instead of pre-computed hex.
- **Animation between custom-property colors** — works in Chromium 117+ via `@property`-typed colors; older browsers won't interpolate.

## Browser support

`color-mix()`: [Caniuse](https://caniuse.com/css-color-mix) — all evergreens since 2024.
Relative color syntax: Safari 16.4, Chrome 119, Firefox 128. Slight lag on Firefox older versions.

For full coverage with fallback:

```css
.btn:hover {
  background: #6e63ff;                                              /* old browsers */
  background: color-mix(in oklch, var(--brand) 80%, white);          /* modern */
}
```

CSS gracefully picks the last property it understands.

## What I deleted from my Sass

- `lighten`, `darken`, `mix`, `transparentize`, `desaturate` — all replaced by `color-mix` or `oklch(from)`
- A 200-line `_palette.scss` that generated `$brand-50` through `$brand-900` — now 8 CSS lines
- A custom `theme()` mixin — now `data-theme="..."` selector

What's left of Sass in my projects: barely any. Mostly nesting, which CSS Nesting now handles natively.

---

Want to play with color and theming hands-on? Try the [`colors`](/colors/0) module on [Code Crispies](/) — live preview shows mixing in real time.
