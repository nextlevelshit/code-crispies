---
title: "text-wrap: balance and pretty — Typography Polish in Two Lines"
description: "Stop having two-word orphans on your headings and dangling single words in paragraphs. text-wrap: balance and pretty fix it without breakpoints."
date: 2026-05-10
slug: text-wrap-balance-pretty
tags: [css, typography]
---

The typography difference between a polished site and an amateur one usually isn't fonts or spacing. It's the way text wraps. Headings end with one stranded word on the second line. Paragraphs leave a "widow" — a single short word on its own line. Both look careless, both used to require manual `<br>` tags or JavaScript libraries to fix.

CSS now does it natively.

## `text-wrap: balance` for headings

```css
h1, h2, h3 {
  text-wrap: balance;
}
```

The browser distributes a multi-line heading so the lines have approximately equal length. No more `Code Crispies — Free Interactive Lessons / for Web Development` where the second line hangs by itself. Both lines look intentional.

It does this by trying multiple wrap points and picking the most balanced. Slightly more expensive than `text-wrap: wrap` (the default), so the spec limits it to elements with ≤ 6 lines. Headings always qualify; long paragraphs are skipped silently.

## `text-wrap: pretty` for paragraphs

```css
p, li {
  text-wrap: pretty;
}
```

`pretty` is the cousin for body text. It avoids:

- **Single-word last lines** ("widows"). The browser pulls a word back from the previous line so the last line has at least two words.
- **Hyphenation right at the end of paragraphs**, which reads awkwardly.
- **Bad rags** — instead of all lines hitting the right edge sharp, it varies them slightly for readability.

The cost is similar to `balance` but applies to the last 4 lines of a block, so it's safe on long paragraphs.

## Combine both for the whole page

```css
:root {
  text-wrap: pretty;
}

h1, h2, h3, h4 {
  text-wrap: balance;
}
```

Two declarations. Every heading stops orphaning words, every paragraph stops widowing them. Across the whole site.

## What changed under the hood

Before: most browsers used "greedy" wrapping — fit as many words as possible per line, break, repeat. Result: short last lines.

`balance` and `pretty` make wrapping a global decision: optimize the whole block at once. Slower, but for headings and short paragraphs the difference is microseconds.

## Browser support (2026-05)

[Caniuse](https://caniuse.com/css-text-wrap-balance):

- **`balance`**: Chrome 114, Safari 17.5, Firefox 121
- **`pretty`**: Chrome 117, Safari 17.5, Firefox 134

For older browsers, `text-wrap: balance` is silently ignored — text wraps the old way. No layout breakage. Progressive enhancement at its purest.

## Edge cases

- **`text-wrap: balance` on flex/grid items** can fight against intrinsic sizing. If a heading inside `display: flex` looks weird, set `flex: 1 1 auto` or wrap it.
- **`white-space: nowrap`** disables wrapping entirely; `text-wrap` has nothing to balance.
- **Tabular numbers** in headings shouldn't be balanced (preserves alignment). Use `:has(> .tabular)` to opt out specific cases.

## What this kills

- **`@media` breakpoints that change `font-size` just to avoid widows**. Gone.
- **Custom JS like Widowtamer or jQuery widow-fix plugins**. Gone.
- **Manual `<br>` tags inside headings to force balance**. Gone — and good riddance, since they break responsiveness.

Two lines of CSS deletes a category of layout polish work. The browser is finally reading the typography books your designer keeps quoting.

---

Want hands-on typography practice? The [`typography`](/typography/0/) module on [Code Crispies](/) covers this and more, with live preview.
