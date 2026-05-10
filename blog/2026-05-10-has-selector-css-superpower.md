---
title: "The :has() Selector — CSS's Missing Superpower"
description: "Style a parent based on its children, sibling based on a peer state, form based on whether any field is invalid. :has() ends a decade of JavaScript workarounds."
date: 2026-05-10
slug: has-selector-css-superpower
tags: [css, selectors]
---

For twenty years CSS could only style elements based on their *own* state or their *ancestors*. Want to style a `<form>` differently when one of its inputs is invalid? You needed JavaScript. Want to lay out a `<figure>` differently when it has a `<figcaption>`? JavaScript. Make the body grow a class when a modal opens? JavaScript.

Then `:has()` arrived.

## The basic idea

`:has(selector)` matches an element if a descendant matches `selector`. So:

```css
/* Style any <article> that contains an <img> */
article:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}
```

That's it. No JavaScript. The article looks at its own tree and decides.

## Five patterns you'll use weekly

### 1. Form with at least one invalid field

```css
form:has(:invalid) .submit-btn {
  opacity: 0.5;
  pointer-events: none;
}

form:has(:invalid) .form-warning {
  display: block;
}
```

Browser-native validation, native CSS reaction. Zero JS.

### 2. Body knows about open modals

```css
body:has(dialog[open]) {
  overflow: hidden;
}
```

Replaces the `document.body.classList.add('modal-open')` dance.

### 3. Card layout adapts to content

```css
.card:has(img) { grid-template-rows: auto 1fr; }
.card:has(img.full-bleed) { padding: 0; }
.card:not(:has(img)) { padding: 1.5rem; }
```

Three layout variants, no extra classes on the card itself.

### 4. Sibling state via combinators

```css
/* Highlight a label when the next input is focused */
label:has(+ input:focus) {
  color: var(--accent);
  font-weight: 600;
}
```

`+` is "next sibling," so this reads "label whose next sibling input is focused." That used to require `:focus-within` on a wrapper.

### 5. Empty-state styling

```css
ul:not(:has(li)) {
  display: none;
}
/* or: */
ul:has(li) ~ .empty-message {
  display: none;
}
```

Hide an empty list, hide an empty-message banner once items appear. Pure declarative.

## What it can't do

- **No cross-document boundaries.** `:has()` matches within the same DOM. Shadow DOM is opaque from the outside.
- **No back-references in selectors yet.** `:has()` returns true/false, you can't reference what was matched.
- **Performance:** modern engines optimize `:has()` heavily but a selector like `* :has(*)` is still expensive. Keep the inner selector cheap.

## Browser support

[Caniuse](https://caniuse.com/css-has): all major engines since Q4 2023. Safari 15.4, Chrome/Edge 105, Firefox 121. If your audience uses a browser from 2024 or later, you're fine.

For older browsers, `:has()` simply doesn't match — your selector falls back to ignoring the rule. Layout still works, you just don't get the enhancement. Progressive.

## A diagnostic anecdote

Before `:has()`, my testing rule of thumb was: if you find yourself adding a class via JavaScript to react to DOM state, ask whether `:has()` could replace it. Roughly 60% of the time, yes. The remaining 40% are state changes triggered by something outside the DOM (timers, network, user input that doesn't change DOM yet).

For most navbar opens, modal toggles, form-validation reactions, focus indicators, and empty-state styling — pure CSS now. Less JS, fewer bugs, less to test.

---

Practice the selectors module on [Code Crispies](/) — see [`css-advanced-selectors`](/css-advanced-selectors/0) for hands-on `:has()` exercises with live preview.
