---
title: "JS Temporal — Finally Replacing the Broken Date Object"
description: "Date is one of JavaScript's worst APIs. Temporal is the standardized replacement: immutable, timezone-aware, no implicit parsing. Ships in browsers now."
date: 2026-05-10
slug: js-temporal-finally-replacing-date
tags: [javascript, dates]
---

`new Date('2026-05-10')` returns a different value depending on your timezone. `date.setMonth(0)` mutates the original. Months are zero-indexed but days are one-indexed. After 30 years of working around this, the platform finally has a proper replacement: **Temporal**.

## The shape of Temporal

```js
import { Temporal } from "temporal-polyfill";  // or native, see browser support

// A wall-clock date with no time zone
Temporal.PlainDate.from("2026-05-10");

// A wall-clock time
Temporal.PlainTime.from("14:30");

// Date + time, no timezone
Temporal.PlainDateTime.from("2026-05-10T14:30");

// Absolute moment in time
Temporal.Instant.from("2026-05-10T14:30:00Z");

// A wall-clock time IN a zone
Temporal.ZonedDateTime.from({
  year: 2026, month: 5, day: 10, hour: 14, minute: 30,
  timeZone: "Europe/Berlin"
});

// A duration
Temporal.Duration.from({ days: 7, hours: 3 });
```

Five separate types. Each represents one concept clearly. No "is this UTC or local? depends on which method you called."

## Immutable arithmetic

```js
const d = Temporal.PlainDate.from("2026-05-10");

const next = d.add({ days: 7 });
console.log(d.toString());      // 2026-05-10 (unchanged)
console.log(next.toString());   // 2026-05-17
```

Every operation returns a new object. No more `const copy = new Date(d)` defensive copies.

## Real arithmetic, not millisecond math

```js
// Date age problem: how many years between two dates?
const start = Temporal.PlainDate.from("2000-04-01");
const today = Temporal.Now.plainDateISO();        // today, no time, no zone

const diff = today.since(start, { largestUnit: "years" });
console.log(diff.toString());   // P26Y1M9D (ISO 8601 duration)
console.log(diff.years);         // 26
```

Date math is calendar-aware. `Temporal.Duration` knows that February has 28 days (or 29 in leap years). No more "365 * 24 * 3600 * 1000" math that breaks at DST.

## Time zones are first-class

```js
const meeting = Temporal.ZonedDateTime.from({
  year: 2026, month: 5, day: 10, hour: 14,
  timeZone: "Europe/Berlin"
});

// What time is the same instant in Tokyo?
const tokyo = meeting.withTimeZone("Asia/Tokyo");
console.log(tokyo.toString());  // 2026-05-10T21:00:00+09:00[Asia/Tokyo]

// DST-aware: add 24 hours
const next = meeting.add({ hours: 24 });
// next is "the same wall clock 24 elapsed hours later" — handles DST correctly
```

If you're scheduling across time zones — Temporal is what you've wanted since the IANA database existed.

## Parsing that doesn't surprise

```js
// Date is dangerous:
new Date("2026-05-10");     // UTC midnight (despite no Z)
new Date("2026-05-10T00:00"); // local midnight!
new Date("2026-5-10");       // works, but undefined
new Date("10/05/2026");      // varies by locale

// Temporal is strict:
Temporal.PlainDate.from("2026-05-10");        // ✓
Temporal.PlainDate.from("2026-5-10");          // ❌ throws
Temporal.PlainDateTime.from("2026-05-10");     // ❌ throws (need time)
```

Parse errors throw. No silent NaN. No timezone surprises.

## Comparison operators

```js
const a = Temporal.PlainDate.from("2026-05-10");
const b = Temporal.PlainDate.from("2026-06-15");

Temporal.PlainDate.compare(a, b);   // -1, 0, or 1
a.equals(b);                         // false

a.until(b, { largestUnit: "days" }); // PT36D
```

No `<` / `>` because operator overloading isn't a JS thing — but `compare()` is what you'd write anyway in a sort.

## Browser support (2026-05)

- **Firefox**: shipped (139, March 2025) — first to ship native
- **Safari**: in flight (Tech Preview)
- **Chrome / Edge**: implementation in progress, behind flag

For a production app **today**, use `temporal-polyfill` (~17 KB gzipped) — it's the official polyfill maintained by the spec authors. Once Chrome ships, you can drop the polyfill behind a feature detection.

```js
const Temporal = globalThis.Temporal ?? (await import("temporal-polyfill")).Temporal;
```

## What this kills

- date-fns (~70 KB)
- moment.js (~60 KB, deprecated anyway)
- luxon (~70 KB)
- Custom "is this UTC?" wrapper functions in every codebase

Temporal is the standard library JavaScript should have shipped in 1995. It only took 30 years.

---

Hands-on JS practice in the [`js-variables`](/js-variables/0/) and [`js-events`](/js-events/0/) modules on [Code Crispies](/).
