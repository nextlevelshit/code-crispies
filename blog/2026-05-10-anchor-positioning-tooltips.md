---
title: "CSS Anchor Positioning — Tooltips Without JavaScript Math"
description: "anchor() and position-anchor pin elements to triggers. Build tooltips, dropdowns, popovers that stay glued to their target — pure CSS, zero scroll-listeners."
date: 2026-05-10
slug: anchor-positioning-tooltips
tags: [css, ux, tooltip]
---

Every tooltip library on npm has the same job: position element B near element A, flip when there's no room, recompute on scroll. Floating UI alone is 6 KB of code for what amounts to "place this thing next to that thing." CSS Anchor Positioning ships the same in three properties.

## Hello, anchor

```html
<button id="trigger">Hover me</button>
<div id="tip" class="tooltip">I'm a tooltip</div>
```

```css
#trigger {
  anchor-name: --trigger;             /* this element is now an anchor */
}

#tip {
  position: absolute;
  position-anchor: --trigger;         /* glue myself to --trigger */
  top: anchor(bottom);                /* my top = trigger's bottom */
  left: anchor(center);
  translate: -50% 8px;
}
```

That's it. The tooltip stays under the trigger as long as the trigger exists. Scroll the page, resize the viewport, change the trigger's position — the tooltip follows. No JS, no `getBoundingClientRect()`.

## anchor() reference points

| Function | What it returns |
|---|---|
| `anchor(top)` | y of the anchor's top edge |
| `anchor(bottom)` | y of the anchor's bottom edge |
| `anchor(left)` | x of the anchor's left edge |
| `anchor(right)` | x of the anchor's right edge |
| `anchor(center)` | midpoint of the relevant axis |
| `anchor(start)`, `anchor(end)` | logical equivalents (RTL-aware) |
| `anchor(self-end)` etc. | the OTHER edge — useful for positioning by your edge, not the anchor's |

## Auto-flip when there's no room

The hard part is "show below, but if there's no room, show above." `position-try-fallbacks` does it:

```css
#tip {
  position: absolute;
  position-anchor: --trigger;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 8px;

  position-try-fallbacks: --above, --right, --left;
}

@position-try --above {
  top: auto;
  bottom: anchor(top);
  translate: -50% -8px;
}

@position-try --right {
  top: anchor(center);
  left: anchor(right);
  translate: 8px -50%;
}

@position-try --left {
  top: anchor(center);
  left: auto;
  right: anchor(left);
  translate: -8px -50%;
}
```

Browser tries each fallback in order. Picks the first one that fits in the viewport. No JS observers, no flicker, sub-frame timing.

## Multiple anchors per page

```css
.menu-item {
  anchor-name: --menu-item;          /* same name on every item */
}

.menu-item:hover .submenu {
  position: absolute;
  position-anchor: --menu-item;      /* matches CLOSEST scoped anchor */
  top: anchor(top);
  left: anchor(right);
}
```

Anchor scoping picks the nearest anchor in DOM tree, so multiple identically-named anchors work. Each item gets its own submenu glued to itself.

## Dialog + anchor for context menus

```html
<button popovertarget="menu" popovertargetaction="show" id="cog">⚙</button>
<menu popover="auto" id="menu">
  <li>Settings</li>
  <li>Sign out</li>
</menu>
```

```css
#cog { anchor-name: --cog; }

#menu {
  position-anchor: --cog;
  inset: auto;
  top: anchor(bottom);
  right: anchor(right);
  translate: 0 4px;
}
```

Native popover (auto-dismiss + escape-to-close from the platform) + anchor positioning = production-grade context menu in maybe 12 lines of CSS.

## Browser support (2026-05)

[Caniuse](https://caniuse.com/css-anchor-positioning):

- Chrome / Edge 125 (May 2024)
- Safari 26 (October 2025)
- Firefox: behind a flag (`layout.css.anchor-positioning.enabled`), shipping in 142

For older browsers, the positioned element falls back to its declared `top`/`left` (which usually means "fixed position somewhere reasonable"). For tooltips specifically, ship a sane fallback like centered-bottom and the layout still works.

```css
@supports not (anchor-name: --x) {
  #tip {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    translate: -50% 0;
  }
}
```

## What this kills

- Floating UI / Popper.js (6–12 KB depending on version) for the standard tooltip use case
- IntersectionObserver loops for dropdown auto-flipping
- Scroll listeners that recompute positions on every frame
- The class of bugs where a tooltip lags behind its trigger by one frame

I removed Floating UI from a dashboard last week. -8 KB JS, +2 lines of CSS, smoother on cheap mobile because positioning happens on the compositor not the main thread.

---

The [`html-elements`](/html-elements/0/) module on [Code Crispies](/) covers native popover + dialog. Anchor positioning makes them production-grade.
