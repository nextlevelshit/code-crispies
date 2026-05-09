---
title: "Native Accordions, Properly Styled — Vanilla CSS and Tailwind"
description: "The HTML <details> element gives you accordions for free. Here's how to style it cleanly in both vanilla CSS and Tailwind, with no JavaScript."
date: 2026-05-10
slug: native-accordion-styled
tags: [html, css, tailwind, ux]
---

Accordions are everywhere — FAQ pages, mobile navigation, settings panels — and most of them ship with hundreds of lines of JavaScript. They don't have to.

The `<details>` and `<summary>` elements have been in every browser since 2020. They give you full keyboard support, screen-reader announcements, and an `open` attribute you can target with CSS. No state library required.

## The markup

```html
<details>
  <summary>Why does the cereal go soggy?</summary>
  <p>Capillary action between the puffed grain and milk. Eat fast.</p>
</details>
```

That alone gives you a working accordion. Click the summary, the rest reveals. Press <kbd>Space</kbd> or <kbd>Enter</kbd> when focused — same result. Screen readers say "expanded/collapsed". Done.

## Vanilla CSS, no JS

The default browser styles are ugly. Three rules clean them up:

```css
details {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background: #fff;
}

details + details {
  margin-top: 0.5rem;
}

summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;            /* hide the default triangle */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

summary::-webkit-details-marker {
  display: none;               /* Safari */
}

summary::after {
  content: "+";
  font-size: 1.25em;
  transition: transform 0.2s;
}

details[open] summary::after {
  content: "−";
}
```

Two notes:

- `list-style: none` removes the disclosure triangle on most browsers. Safari needs the `::-webkit-details-marker` rule too.
- The `+`/`−` swap on `details[open]` is pure CSS — that's the attribute selector earning its keep.

If you want a smooth open/close transition, the `content-visibility: auto` and `interpolate-size: allow-keywords` properties (Chromium 129+) finally make it work without JavaScript hacks. Older browsers will just snap open like before — graceful degradation.

```css
details {
  interpolate-size: allow-keywords;
}

details::details-content {
  block-size: 0;
  overflow-y: clip;
  transition: block-size 0.3s ease, content-visibility 0.3s ease allow-discrete;
}

details[open]::details-content {
  block-size: auto;
}
```

## Tailwind version

Tailwind doesn't ship a `details` plugin, but the same effect lives in three utility classes:

```html
<details
  class="group rounded-lg border border-gray-200 bg-white p-4 open:bg-gray-50"
>
  <summary
    class="flex cursor-pointer list-none items-center justify-between font-semibold marker:hidden"
  >
    Why does the cereal go soggy?
    <span class="transition-transform group-open:rotate-45">+</span>
  </summary>
  <p class="mt-2 text-gray-600">
    Capillary action between the puffed grain and milk. Eat fast.
  </p>
</details>
```

The interesting bits:

- `group` on the `<details>` lets the rotation utility on the `+` span see the parent's `open` state via `group-open:rotate-45` (a 45° rotation turns `+` into `×` — same visual hint with one element).
- `marker:hidden` is the Tailwind 3.4+ shorthand for hiding the triangle. For older versions, use `[&::-webkit-details-marker]:hidden`.
- `open:bg-gray-50` only applies when the accordion is expanded.

Both versions ship the same accessibility behavior. The Tailwind one is two lines longer but reads more declarative. Pick whichever your project already leans into.

## When to skip `<details>`

If you need:

- Multiple sections that auto-close when one opens (single-expand)
- Animations more complex than open/close
- State driven by something other than user click (URL, localStorage, server)

…then yes, JavaScript. But for plain "click to reveal," `<details>` is the right tool, and styling it isn't hard once you know the two pseudo-elements.

---

Practice this stuff hands-on inside [Code Crispies](/) — the [`html-details-summary`](/html-details-summary/0) module walks you through building one from scratch with live validation.
