---
title: "Native HTML/CSS vs shadcn — When the Platform Catches Up"
description: "shadcn/ui ships beautiful components built on Radix and Tailwind. The 2026 web platform now ships most of them natively. Here's the trade-off, component by component."
date: 2026-05-10
slug: native-vs-shadcn
tags: [css, ux, architecture]
---

shadcn/ui is the 2024 default for React component libraries — copy-paste, no runtime, beautiful by default. But every one of its components fights a battle the platform has now won. The 2026 web platform ships native equivalents for most shadcn primitives, in zero KB and with built-in accessibility.

## The score, by component

| shadcn component        | Native equivalent (2026)             | Verdict        |
|-------------------------|--------------------------------------|----------------|
| Dialog                  | `<dialog>` + `.showModal()`          | **native wins** |
| Popover                 | `popover` attribute                  | **native wins** |
| Select                  | `<select>` (or `<selectlist>` 2026)  | **native wins** |
| Combobox                | `<input list="...">` + `<datalist>`  | tie (basic case) |
| Tooltip                 | `popover` + Anchor Positioning       | **native wins** |
| Accordion               | `<details>` + `<summary>`            | **native wins** |
| Toast                   | `popover=manual` + Notifications API | tie            |
| Date picker             | `<input type="date">`                | **native wins** |
| Tabs                    | (no native primitive yet)            | shadcn wins    |
| Command palette         | (no native primitive)                | shadcn wins    |
| Data table              | (no native primitive)                | shadcn wins    |
| Form validation         | `:invalid` / `required` / `pattern`  | **native wins** |
| Carousel                | scroll-snap + Scroll-Driven          | **native wins** |
| Slider                  | `<input type="range">`               | **native wins** |
| Switch                  | `<input type="checkbox">` + CSS       | **native wins** |

## Native dialog vs shadcn Dialog

```html
<dialog id="confirm">
  <form method="dialog">
    <h2>Are you sure?</h2>
    <p>This will delete your account.</p>
    <button value="cancel">Cancel</button>
    <button value="confirm">Yes, delete</button>
  </form>
</dialog>

<button onclick="confirm.showModal()">Delete account</button>
```

What you get free:
- Backdrop (`::backdrop` pseudo-element)
- Focus trap
- ESC to close
- `<form method="dialog">` returns the value of the clicked button
- Click outside to close (with `light-dismiss` in newer browsers)

shadcn Dialog ships ~3 KB of code + Radix dependency for the same.

## Native popover

```html
<button popovertarget="info">Help</button>
<div id="info" popover>
  <p>Click outside or press ESC to close.</p>
</div>
```

That's a fully accessible popover. Light-dismiss, ESC key, ARIA wiring — native. shadcn Popover wraps Radix, ~5 KB net.

Combine with Anchor Positioning for tooltips that follow their trigger:

```css
#info {
  position-anchor: --my-anchor;
  inset-area: top;
  margin-bottom: 8px;
}
button[popovertarget="info"] {
  anchor-name: --my-anchor;
}
```

## Native accordion

```html
<details>
  <summary>FAQ: Is this open by default?</summary>
  <p>No. Click to open.</p>
</details>
```

```css
details::details-content {
  transition: height 0.2s, content-visibility 0.2s allow-discrete;
}
[open]::details-content {
  height: auto;
}
```

Accordion + smooth open animation, native. shadcn Accordion uses Radix Collapsible (~6 KB) for less.

## Where shadcn still wins

### Tabs

The platform doesn't have a tab primitive yet (proposed for 2027). For now:

```jsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
  <TabsContent value="password">...</TabsContent>
</Tabs>
```

That's still the cleanest API. Roll-your-own tabs require ~30 lines of ARIA + keyboard handling.

### Command palette

A11y-correct command palette (Cmd+K interfaces) is genuinely hard. cmdk (the lib shadcn uses) gets it right; rolling your own usually doesn't. Until the platform adds something, use cmdk.

### Data tables

Sortable, filterable, virtualized tables of 10,000+ rows need real engineering (TanStack Table, etc.). The platform's `<table>` is just markup.

## The framing shift

In 2020, "build the components yourself or import a library" had a clear answer: import. The components were complex, the libraries were good, the platform was weak.

In 2026, the question is: **does the platform already do this**? If yes, use it. shadcn copy-paste components let you start native and only reach for Radix when you actually need it.

## Hybrid approach

shadcn/ui + native primitives is realistic in practice:

```jsx
// Native dialog with shadcn-style trigger button
<Button onClick={() => dialogRef.current?.showModal()}>
  Delete account
</Button>
<dialog ref={dialogRef} className="rounded-lg p-6 backdrop:bg-black/50">
  <form method="dialog">
    <h2>Are you sure?</h2>
    <button value="cancel">Cancel</button>
    <Button value="confirm" variant="destructive">Yes, delete</Button>
  </form>
</dialog>
```

The button uses Tailwind utility classes for visual consistency; the dialog is native. Best of both: shadcn's design tokens, the platform's engineering.

## Bundle impact

A typical SaaS app uses ~12 shadcn components. Replacing 8 of them (the ones with native equivalents) with platform primitives:

- **-32 KB** of Radix runtime
- **-8 KB** of shadcn wrappers
- **+0 KB** added (it's the platform)
- **Better a11y** in most cases (Radix is good but the spec is canonical)

## What to keep watching

- **Selectlist** (`<selectlist>`) — fully styleable `<select>` with Shadow DOM parts. Chrome 130+.
- **Tabs primitive** — proposed but not landed.
- **Toast notification spec** — `popover=manual` + Web Notifications close most of it; native toast positioning is in flight.
- **Carousel primitive** — `carousel` HTML element proposed, scroll-snap is the today-answer.

## When NOT to go native-first

- **Highly customized look** that requires full DOM control (datepickers in design-heavy products)
- **Cross-browser bug avoidance** in dialog/popover edge cases (Safari sometimes lags Chrome by 6 months)
- **Server-rendered components** — shadcn ships server components; native primitives need client-side JS for interactivity in some cases

## What this changes

The cost calculation for a component library shifted. It used to be "import 50 KB to get good UX." It's now "import 50 KB to fill the 4 gaps the platform doesn't cover yet." Pick the gaps your app actually needs.

---

Practice native HTML elements in the [`html-elements`](/html-elements/0/) module on [Code Crispies](/).
