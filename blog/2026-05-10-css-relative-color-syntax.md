---
title: "CSS Relative Color Syntax — Math on Colors, in CSS"
description: "Relative color syntax lets you derive colors from other colors directly in CSS. Lighten, darken, shift hue, mix channels — without preprocessors, without JS."
date: 2026-05-10
slug: css-relative-color-syntax
tags: [css, color, theming]
---

`color-mix()` covers blending two colors. The relative color syntax goes further: it lets you take an existing color, decompose it into its channels, do math on them, and produce a new color. It's the closest CSS has come to Sass color functions — and it's native.

## The basic shape

```css
:root {
  --brand: hsl(245 60% 55%);
  --brand-light: hsl(from var(--brand) h s calc(l + 15%));
  --brand-dark:  hsl(from var(--brand) h s calc(l - 20%));
}
```

`hsl(from <color> h s calc(l + 15%))` reads:

- `from var(--brand)` — destructure the source into `h`, `s`, `l` channels
- output `hsl(h s calc(l + 15%))` — same hue, same saturation, lighter

This is what Sass's `lighten($brand, 15%)` always wanted to be. No preprocessor needed.

## Works with every color function

```css
/* RGB-channel manipulation */
.faded { background: rgb(from var(--brand) r g b / 50%); }

/* HSL hue rotation */
.complementary { color: hsl(from var(--brand) calc(h + 180) s l); }

/* OKLCH for perceptually-uniform lightness */
.brand-tint { background: oklch(from var(--brand) calc(l * 1.2) c h); }

/* lab for premium color manipulation */
.warmer { background: lab(from var(--brand) l calc(a + 10) calc(b + 10)); }
```

Each color space exposes its own channels:

| Space | Channels        |
|-------|-----------------|
| `rgb` | r, g, b, alpha  |
| `hsl` | h, s, l, alpha  |
| `hwb` | h, w, b, alpha  |
| `lab` | l, a, b, alpha  |
| `lch` | l, c, h, alpha  |
| `oklab` | l, a, b, alpha |
| `oklch` | l, c, h, alpha |

Pick the space whose math feels natural for your operation. OKLCH for "perceptually uniform" lightness shifts. HSL for hue rotations. RGB for opacity-only changes.

## Theme generation in 5 lines

```css
:root {
  --primary: oklch(60% 0.18 250);
  --primary-50:  oklch(from var(--primary) 95% calc(c * 0.2) h);
  --primary-100: oklch(from var(--primary) 90% calc(c * 0.3) h);
  --primary-200: oklch(from var(--primary) 80% calc(c * 0.5) h);
  --primary-500: var(--primary);
  --primary-700: oklch(from var(--primary) 40% c h);
  --primary-900: oklch(from var(--primary) 25% c h);
}
```

Tailwind's color scale (50, 100, 200, ..., 900) — generated from a single base color, in CSS. Change `--primary` and the entire scale follows.

## State variants

```css
.btn {
  background: var(--brand);
  color: white;
}
.btn:hover {
  background: oklch(from var(--brand) calc(l - 5%) c h);
}
.btn:active {
  background: oklch(from var(--brand) calc(l - 10%) c h);
}
.btn:disabled {
  background: oklch(from var(--brand) l calc(c * 0.3) h);
}
```

Hover, active, disabled — all derived. Change the brand once, every state recomputes.

## Dark mode without doubling tokens

```css
:root {
  --bg: white;
  --text: #111;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111;
    --text: oklch(from white l c h);  /* keep white as text in dark */
  }
}
```

Or fully derived:

```css
:root {
  --surface: white;
  --on-surface: oklch(from var(--surface) calc(100% - l) c h);  /* invert lightness */
}
```

`--on-surface` is automatically dark on light surfaces, light on dark — no manual pair maintenance.

## Combine with color-mix() for blending

```css
.muted-brand {
  color: color-mix(
    in oklch,
    var(--brand) 60%,
    oklch(from var(--brand) 70% c h) 40%
  );
}
```

Mix the brand with a lightened version. Get a softer-but-still-brandy tint. The two functions compose freely.

## Browser support

- Chrome / Edge 119+ (October 2023)
- Safari 16.4+ (March 2023)
- Firefox 128+ (July 2024)

For older browsers, fall back to fixed values:

```css
:root {
  --brand-light: hsl(245, 60%, 70%);  /* fallback */
  --brand-light: hsl(from var(--brand) h s calc(l + 15%));  /* override if supported */
}
```

The browser uses the last valid declaration, so non-supporting browsers keep the static value.

## When to reach for it

- **Design systems** with derived color scales (instead of hand-maintaining 50→900 values)
- **Multi-brand white-label apps** where the customer picks the base color and everything cascades
- **Theme switchers** where the user's palette comes from an API
- **Dark mode** with derived inverse colors

## When NOT

- **Tiny one-off colors** — `oklch(from var(--brand) ...)` is more typing than a hex code
- **Designer-controlled exact values** — derived colors drift slightly from intended pixel values; if a designer hand-picks every shade, use those values

## What this kills

- Most uses of Sass `lighten()` / `darken()` / `mix()` / `saturate()`
- Theme-generation build steps that pre-compute scales
- Tinycolor / Color libraries imported just for variant generation
- The "I need 9 shades of blue, let me open a color picker for each" workflow

When your design tokens fit on one screen of CSS instead of three, the system stays understandable. Relative colors deliver that without leaving the platform.

---

Practice CSS color values in the [`colors-backgrounds`](/colors-backgrounds/0/) module on [Code Crispies](/).
