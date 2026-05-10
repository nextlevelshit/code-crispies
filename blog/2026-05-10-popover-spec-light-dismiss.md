---
title: "The popover Attribute — Light-Dismiss, ESC, Top-Layer, Zero JS"
description: "popover is the HTML attribute that finally makes tooltips, menus, and dropdowns native. Light-dismiss, focus management, and top-layer rendering — all without a library."
date: 2026-05-10
slug: popover-spec-light-dismiss
tags: [html, ux, accessibility]
---

For 25 years, "show a thing on top of the page that closes when you click outside" required a library. React-tippy is 8 KB. Floating UI is 6 KB. Headless UI is 12 KB. The `popover` attribute is **0 KB**, accessible by default, and ships in every modern browser.

## Two attributes, full popover

```html
<button popovertarget="menu">Open menu</button>

<div id="menu" popover>
  <p>Click outside or press ESC to close.</p>
</div>
```

That's a complete popover. The browser handles:
- **Light-dismiss** — click outside, popover closes
- **ESC key** to close
- **Top-layer rendering** — appears above all other content, no `z-index` games
- **Focus management** — focus moves into popover, returns to trigger on close
- **`hidden` by default** — no display:none / visibility flicker
- **ARIA wiring** — the trigger gets `aria-expanded`/`aria-haspopup` automatically

## Three popover modes

| Mode      | Behavior                                                           |
|-----------|--------------------------------------------------------------------|
| `auto`    | Default. Light-dismiss + ESC. Only one `auto` popover at a time.   |
| `manual`  | No light-dismiss. You control open/close. Many can be open at once.|
| `hint`    | Like `auto` but doesn't close other popovers. For tooltips on hover.|

```html
<div popover>auto (default)</div>
<div popover="manual">Stays until JS closes it</div>
<div popover="hint">Tooltip — doesn't fight other popovers</div>
```

## JavaScript control

```js
const popover = document.getElementById("menu");

popover.showPopover();   // open programmatically
popover.hidePopover();   // close
popover.togglePopover();

popover.addEventListener("toggle", (e) => {
  if (e.newState === "open") {
    track("menu_opened");
  }
});
```

The `toggle` event fires for both directions — newState is `"open"` or `"closed"`.

## Combine with Anchor Positioning

```html
<button id="trigger" popovertarget="tip">?</button>
<div id="tip" popover>Help text here</div>

<style>
  #trigger { anchor-name: --tip-anchor; }
  #tip {
    position-anchor: --tip-anchor;
    inset-area: top;
    margin-bottom: 6px;
  }
</style>
```

Tooltip pinned to the trigger, repositioned automatically when scrolling, falling back to a different side if there's no room. We covered Anchor Positioning [here](/blog/anchor-positioning-tooltips/).

## Dialog vs Popover

Both render in the top layer. The differences:

| Feature           | `<dialog>`                    | `popover` attribute          |
|-------------------|-------------------------------|------------------------------|
| Modal (backdrop)  | `.showModal()` only           | No                           |
| Light-dismiss     | Modern browsers (varies)      | Built in                     |
| Used inside form  | `<form method="dialog">`      | No                           |
| Stacking          | Single modal at a time        | Many popovers can stack      |
| Default mode      | hidden                        | hidden                       |

Use **dialog** for confirms, settings, modal flows.
Use **popover** for menus, tooltips, dropdowns, inline help.

## Real example: dropdown menu

```html
<div class="menu-wrap">
  <button popovertarget="user-menu" id="user-trigger">
    Account ▾
  </button>
  <div id="user-menu" popover>
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <hr>
    <button onclick="signOut()">Sign out</button>
  </div>
</div>

<style>
  #user-trigger { anchor-name: --user-anchor; }
  #user-menu {
    position-anchor: --user-anchor;
    inset-area: bottom span-left;
    min-width: 200px;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,.1);
    background: white;
  }
  #user-menu a, #user-menu button {
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    text-decoration: none;
    color: inherit;
    background: transparent;
    border: 0;
    width: 100%;
    text-align: left;
  }
  #user-menu a:hover, #user-menu button:hover {
    background: #f3f4f6;
  }
</style>
```

That's a complete accessible dropdown. ARIA wired by the browser. ESC closes. Click outside closes. Focus lands inside on open. **Zero JS for the menu itself.**

## Animating the open/close

```css
[popover] {
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s, overlay 0.15s allow-discrete, display 0.15s allow-discrete;
}
[popover]:popover-open {
  opacity: 1;
  transform: translateY(0);
}
@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: translateY(-4px);
  }
}
```

The `@starting-style`, `transition-behavior: allow-discrete`, and `:popover-open` together let you animate **into** the visible state — even though `display` and `overlay` are normally non-animatable. Popover gets a smooth fade-in without `setTimeout` games.

## Browser support

- **Chrome / Edge 114+** (May 2023)
- **Safari 17+** (September 2023)
- **Firefox 125+** (April 2024)

For older browsers, a popover fallback polyfill exists, or you can fall back to your existing menu library and progressively enhance.

## What this kills

- Tooltip libraries (tippy, floating-ui-only-for-this)
- Custom dropdown components in design systems
- ESC-key handlers for "modal-ish" things
- z-index stacking arms races (top-layer wins)
- ARIA wiring boilerplate for menu/dialog/listbox

## What it doesn't replace

- **Modal dialogs with backdrops** → still `<dialog>.showModal()`
- **Complex menus with sub-menus** → still need JS for sub-menu toggling
- **Combobox / autocomplete** → use `<input list>` + `<datalist>` or a library
- **Toast notifications** → `popover="manual"` works, but positioning needs CSS

## The headline

In 2020, building a dropdown was: pick a library, learn its API, fight its styling, ship 8 KB. In 2026, it's: add `popover` to a `<div>`, add `popovertarget` to a `<button>`. The platform won.

---

Practice native HTML interactivity in the [`html-details-summary`](/html-details-summary/0/) module on [Code Crispies](/) — covers the `<details>`, `<summary>`, and `<dialog>` elements.
