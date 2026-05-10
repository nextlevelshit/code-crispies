---
title: "CSS Subgrid — Spreadsheet-Aligned Layouts Without Tables"
description: "subgrid lets nested grids inherit their parent's tracks. Card grids that line up, forms that align, lists with consistent column widths — all without restructuring your markup."
date: 2026-05-10
slug: css-subgrid-tables-without-tables
tags: [css, layout, grid]
---

CSS Grid is great until your nested elements need to align with a parent's columns. Then you reach for "lift everything up" tricks or table-like markup. `subgrid` removes that constraint.

## The problem subgrid solves

```html
<ul class="cards">
  <li>
    <h3>Title one</h3>
    <p>Body that's exactly two lines so far.</p>
    <a>Action</a>
  </li>
  <li>
    <h3>A much longer title that wraps to multiple lines</h3>
    <p>Body</p>
    <a>Action</a>
  </li>
</ul>
```

Without subgrid, each `<li>` lays out its three children independently. The titles end at different vertical positions. Bodies start at different positions. Actions don't line up across cards.

You used to fix this by:

- Setting fixed heights (breaks responsive)
- Using flex: 1 with min-height (still misaligns at viewport edges)
- Lifting children up into the parent grid (markup gymnastics)

Subgrid gives you the right way:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.cards > li {
  display: grid;
  grid-template-rows: subgrid;        /* inherit row tracks from .cards row */
  grid-row: span 3;                   /* take 3 of those tracks */
  gap: 0;                             /* parent's gap applies */
  background: #fff;
  border-radius: 8px;
  padding: 1.25rem;
}
```

Now every title sits in the same row track, every body in the next, every action in the last. Even if titles vary in length.

## Two-column subgrid for forms

```css
.form {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) 3fr;
  gap: 0.75rem 1.5rem;
}

.form .field {
  display: grid;
  grid-template-columns: subgrid;     /* inherit BOTH columns */
  grid-column: 1 / -1;                /* span all parent columns */
}
```

Each `.field` becomes its own row but uses the parent's column tracks. Labels in column 1 always align. Inputs in column 2 always align. No matter how many fields, no matter the label length.

## Three caveats

**1. `gap` cascades**, but you can override.

`subgrid` inherits the parent's `gap` by default. Set `gap: 0` on the child to disable, or set explicit gaps to override (column-only, row-only, both).

**2. Subgrid is a value, not a property.**

```css
/* WRONG */
.child { subgrid: true; }

/* RIGHT */
.child { grid-template-rows: subgrid; }
.child { grid-template-columns: subgrid; }
```

You can subgrid one axis or both.

**3. Children of subgrid must use `grid-row` / `grid-column`.**

Without explicit placement, a subgrid child auto-flows into the parent's tracks. Often you want explicit:

```css
.cards > li {
  grid-row: span 3;       /* "I take 3 row tracks" */
}
```

## Browser support (2026-05)

[Caniuse](https://caniuse.com/css-subgrid):

- Chrome / Edge 117 (September 2023)
- Safari 16 (September 2022)
- Firefox 71 (way back, December 2019 — Firefox shipped first)

Universal in evergreens. For older versions, your subgrid declaration silently falls back to a regular nested grid — content still renders, just not aligned across siblings. Progressive enhancement at its purest.

## When *not* to use it

- **Tabular data** (`<table>` is still the right element for that — semantic, sortable, screen-reader-friendly).
- **Lists where alignment doesn't matter** — flexbox is simpler.
- **Single-row layouts** — there's nothing to inherit, just use grid normally.

## What this kills

- "card-with-equal-section-heights" CSS hacks
- Form-alignment Sass mixins
- Manual `min-height` calculations across viewport sizes
- The eternal "use display:contents to lift children" trick (which has a11y baggage anyway)

I converted a 4-card pricing layout last month. Lost 28 lines of CSS, gained perfect cross-card alignment at every breakpoint. The platform earned it.

---

Practice modern grid layouts in the [`grid`](/grid/0/) module on [Code Crispies](/) — interactive lessons with live preview.
