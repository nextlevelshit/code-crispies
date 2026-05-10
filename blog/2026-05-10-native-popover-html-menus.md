---
title: "Native HTML Popovers — Menus, Tooltips, and Cards Without a Library"
description: "The popover attribute gives you accessible, dismissible overlays with three lines of HTML. Replace your tooltip library."
date: 2026-05-10
slug: native-popover-html-menus
tags: [html, ux, accessibility]
---

Every component library ships a Tooltip and a Menu. Both are ~200 lines wrestling with focus, escape-to-close, click-outside, ARIA roles, scroll-locking. The browser does all of this now, with three attributes.

## Hello, popover

```html
<button popovertarget="menu">Open menu</button>

<div id="menu" popover>
  <ul>
    <li><a href="/profile">Profile</a></li>
    <li><a href="/settings">Settings</a></li>
    <li><a href="/logout">Log out</a></li>
  </ul>
</div>
```

That's a working menu. The browser:

- toggles `:popover-open` state when the button is clicked
- closes the popover on Escape, click-outside, or scroll
- focuses the popover when shown
- announces it to screen readers as expected

No JavaScript. No library.

## Two flavors

`popover` (or `popover="auto"`) is the default — closes when you click elsewhere or press Escape.

`popover="manual"` doesn't auto-dismiss. You need to script it open/closed. Useful for sticky toasts or banners.

```html
<div id="banner" popover="manual">
  <p>Cookies are crunchy.</p>
  <button popovertarget="banner" popovertargetaction="hide">OK</button>
</div>
```

`popovertargetaction="show|hide|toggle"` controls what the trigger does. Default is toggle.

## Styling: ::backdrop and the top layer

Popovers render in the **top layer** — above everything in the normal stacking context. No `z-index: 9999` arms race. Style it like any element:

```css
[popover] {
  border: none;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  inset: unset;
  /* The browser positions popovers in the center by default.
     Use position-anchor (Chromium 125+) for pin-to-trigger. */
}

[popover]:popover-open {
  /* Use this state to trigger animations on show */
  animation: pop-in 0.18s ease-out;
}

[popover]::backdrop {
  background: rgba(0,0,0,0.04);
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
```

`::backdrop` works only on auto-popovers (the dimmed area behind). Manual popovers don't have one.

## Anchor positioning (Chromium 125+, Safari 26+)

For tooltips and dropdowns that need to pin to their trigger, the new CSS Anchor Positioning API pairs perfectly:

```css
.tooltip-trigger {
  anchor-name: --tip;
}

[popover].tooltip {
  position: absolute;
  position-anchor: --tip;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 4px;
}
```

Browsers without anchor support fall back to centered. Acceptable degradation.

## When NOT to use `popover`

- **Modal dialogs that block the page** — use `<dialog>` with `showModal()`. Popover doesn't trap focus inside the popover; dialog does.
- **Persistent UI** like sidebars or panels that should stay open — popover's auto-dismiss fights you.
- **Anything needing rich keyboard navigation** between popover items — `<dialog>` plus your own focus loop is still cleaner for that.

## Browser support (2026-05)

[Caniuse](https://caniuse.com/mdn-html_global_attributes_popover): Chrome/Edge 114, Safari 17, Firefox 125. For older browsers, the popover simply renders inline — visible but not toggle-able. Add a `[popover]:not(:popover-open) { display: none; }` fallback so it stays hidden by default.

## What's gone from your bundle

I replaced a Floating-UI + headlessui menu setup recently. Net change: -42 KB gzipped, +0 JS, -1 hydration-flicker bug. Three HTML attributes did the work of two libraries.

---

Practice native HTML interactions in the [`html-elements`](/html-elements/0) module on [Code Crispies](/) — including dialog and popover patterns with live preview.
