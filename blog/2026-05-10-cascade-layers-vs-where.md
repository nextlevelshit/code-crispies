---
title: ":where() and :is() — Cleaner Selectors With Predictable Specificity"
description: "Two pseudo-classes that change how you write selectors. :is() groups them; :where() groups them AND sets specificity to zero. Both kill repetition and end specificity wars."
date: 2026-05-10
slug: cascade-layers-vs-where
tags: [css, selectors, architecture]
---

Once you understand `:is()` and `:where()`, you write half as much CSS. And once you pair them with cascade layers, you stop firing `!important` like it's confetti.

## The repetition problem

```css
header h1 a, header h2 a, header h3 a, header h4 a,
nav h1 a, nav h2 a, nav h3 a, nav h4 a,
aside h1 a, aside h2 a, aside h3 a, aside h4 a {
  text-decoration: none;
}
```

Twelve selectors, one rule. You've written this. Or worse, you maintained it.

`:is()` collapses it:

```css
:is(header, nav, aside) :is(h1, h2, h3, h4) a {
  text-decoration: none;
}
```

Same matches, no repetition. Selector lists nest cleanly.

## The specificity twist

`:is()` takes the **highest** specificity of its arguments:

```css
:is(.btn, button#submit) {
  color: red;
}
/* This selector has the specificity of #submit (1,0,0).
   That's higher than .btn (0,1,0). Wins more cascade fights. */
```

Sometimes you want that. Sometimes not. `:where()` is the no-specificity twin:

```css
:where(.btn, button#submit) {
  color: red;
}
/* Specificity: 0,0,0. Anything more specific overrides. */
```

`:where()` is the magic. Use it for:

- **Reset and base rules** — they should always be losers in the cascade
- **Defaults** — utility classes can override without `!important`
- **Library code** — your override lives unimpeded

## Reset that doesn't fight you

```css
:where(html) {
  font: 16px/1.5 system-ui, sans-serif;
}

:where(*, *::before, *::after) {
  box-sizing: border-box;
}

:where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
}
```

Specificity 0,0,0 across the board. Every selector you write afterward beats it without effort. The "specificity hammer" disappears.

## Component patterns

```css
.card {
  background: #fff;
}

/* These all match a card child, but won't fight other rules */
.card :where(h2, h3) {
  margin-top: 0;
}

.card :where(p, ul, ol) {
  margin-bottom: 1rem;
}
```

Now any utility class on the children (`.mt-4`, `.text-bold`) wins automatically.

## Pairing with cascade layers

`:where()` is great inside a layer because it removes specificity within a layer too. The combination:

```css
@layer reset, components, utilities;

@layer reset {
  :where(*) { box-sizing: border-box; margin: 0; }
}

@layer components {
  .card :where(h2) { font-size: 1.25rem; }
}

@layer utilities {
  .text-2xl { font-size: 1.5rem; }
}
```

The `.text-2xl` in utilities beats `.card h2` in components (layers override specificity). And inside components, the `:where()` keeps `.card h2` from accidentally beating its own siblings.

## Two real wins from production

**Resetting a 3rd-party library**

```css
:where(.cms-content) {
  /* Pikaday's defaults wrapped, can be overridden trivially */
  border: none;
  background: transparent;
}
```

Pikaday styles arrive at specificity 0,1,0. Your overrides at 0,1,0 + 0,0,0 (because `:where`) = beat them with one extra class.

**Forms in two lines**

```css
form :where(input, select, textarea) {
  font: inherit;
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

form :where(:is(input, textarea):focus, select:focus) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

Two rules cover every form on the site. Fields fully match without you writing `.form-control` on each one.

## Browser support

`:is()`: [Caniuse](https://caniuse.com/css-matches-pseudo) — universal since Q1 2021.
`:where()`: same support, same date.

For older browsers, the entire selector list is invalid (the rule is dropped) — so you may need a fallback for your reset. But for modern audiences (Chrome 88+, Firefox 78+, Safari 14+), nothing.

## When `:where()` is wrong

- **You actually need high specificity** to beat a stubborn third-party rule. `:is()` keeps specificity; `:where()` doesn't.
- **You want one selector to be authoritative** without layers. `:where()` makes everything overridable, which is sometimes the opposite of what you want.

## What this kills

- 12-line selector lists
- `!important` declarations meant to "make sure my reset wins"
- "Why doesn't my class apply?" debugging sessions because of unexpected specificity
- Sass `&` accumulation that produces selectors no one understands

I removed 80 lines from a stylesheet last sprint. Just by wrapping `:where()` around the reset block and the base typography. The cascade became a tool, not a fight.

---

The [`css-basic-selectors`](/css-basic-selectors/0/) module on [Code Crispies](/) covers selector specificity hands-on, with live preview.
