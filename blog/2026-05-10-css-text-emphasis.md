---
title: "text-emphasis — Underdog CSS for Better Typography"
description: "text-emphasis adds dot/circle/sesame marks above text. Designed for East Asian typography but useful anywhere you'd reach for italics or bold and want something different."
date: 2026-05-10
slug: css-text-emphasis
tags: [css, typography]
---

CSS has had `text-emphasis` since 2017 and almost nobody uses it. That's a shame — it's a one-liner for typographic emphasis that goes beyond italic / bold, perfect for callouts, brand headlines, and translation-friendly UI.

## The basics

```css
strong {
  font-weight: normal;             /* skip the bold */
  text-emphasis: filled circle red;
}
```

Each character gets a colored circle drawn next to it. The default position is *above* horizontally-written text, *right side* for vertically-written text.

## The mark variants

| Style       | Looks like        |
|-------------|-------------------|
| `dot`       | A small dot       |
| `circle`    | An open circle    |
| `double-circle` | Two concentric circles |
| `triangle`  | An open triangle  |
| `sesame`    | A sesame seed shape (thin oval) |

Each can be `filled` (default) or `open`:

```css
.cta { text-emphasis: open circle var(--brand); }
.warning { text-emphasis: filled triangle red; }
.zen { text-emphasis: dot gray; }
```

You can also pass a single character:

```css
.fancy { text-emphasis: "★" gold; }   /* gold star above each char */
.devops { text-emphasis: "•" #4f46e5; }
```

Cap at one character per mark.

## Position

```css
strong {
  text-emphasis: filled dot;
  text-emphasis-position: under;  /* below instead of above */
}

.vertical-text {
  writing-mode: vertical-rl;
  text-emphasis: filled circle;
  text-emphasis-position: right;  /* default for vertical */
}
```

Values: `over` (default for horizontal), `under`, `left`, `right`. Use `text-emphasis-position: under right` to combine.

## Where it shines

### Callout chips inside a heading

```html
<h1>The <span class="emp">cleanest</span> way to ship CSS</h1>
```
```css
.emp {
  text-emphasis: filled circle var(--brand);
  text-emphasis-position: over;
  color: inherit;
}
```

Visually distinct from italic/bold, less heavy than full color highlight. Reads as "this word matters" without shouting.

### Decorative emphasis on a brand mark

```css
.brand-name {
  text-emphasis: "✦" var(--brand);
  text-emphasis-position: over;
}
```

A logo without designing one. Each character gets the brand glyph above it.

### Translation-friendly emphasis

The `<em>` tag normally gives you italic, which doesn't exist in many scripts (Chinese, Japanese, Hebrew, Arabic). `text-emphasis` works in any writing system:

```css
em {
  font-style: normal;
  text-emphasis: filled circle currentColor;
}
```

Now your emphasis renders meaningfully across English, Japanese, Korean, and Hebrew — the original spec design intent.

## Combine with text-emphasis-skip

```css
em {
  text-emphasis: filled circle;
  text-emphasis-skip: spaces punctuation;  /* don't mark spaces or commas */
}
```

By default the marks appear over every glyph. `text-emphasis-skip` controls which ones get skipped.

## What about `text-decoration` and `font-variant`?

`text-decoration: underline` is for links, definition terms, and edits. `font-variant-caps: small-caps` for typographic small-caps. `text-emphasis` lives in a different niche: **decorative emphasis on words that aren't links or formatting variants**.

You can layer them:

```css
.legal-callout {
  text-emphasis: filled triangle var(--warning);
  font-variant-caps: small-caps;
  text-decoration: underline wavy var(--warning);
}
```

Triangle marks above + small caps + wavy warning underline. Visually loud — use sparingly.

## Browser support

- Chrome / Edge 99+ (March 2022)
- Safari 16.4+ (March 2023)
- Firefox 46+ (April 2016 — yes, really)

Universal since 2023. Older browsers ignore the property — the text just renders without the mark. Pure progressive enhancement.

## When NOT to reach for it

- **Body text** — too noisy, reading suffers
- **Long lines of marked text** — it's accent emphasis, not paragraph styling
- **High-density UIs** — competes with badges/icons
- **Form inputs** — confuses the visual hierarchy

## What this changes

`text-emphasis` won't replace `<strong>` and `<em>` — it complements them. Where you'd reach for "bold red text" or "italic with a colored underline," it gives you a typographically lighter alternative that reads as deliberate, not heavy. Especially powerful for non-Latin scripts that lack italic.

A property to remember exists.

---

Practice typography techniques in the [`typography-fonts`](/typography-fonts/0/) module on [Code Crispies](/).
