---
title: "Object.groupBy + Array.fromAsync — Stop Reaching for Lodash"
description: "Two recent additions to the standard library cover ~80% of why teams still install lodash. Native, tree-shakeable, faster."
date: 2026-05-10
slug: array-grouping-from
tags: [javascript]
---

The most-used lodash functions on npm are `_.groupBy`, `_.keyBy`, `_.uniqBy`, and `_.chain`. The first three now have native equivalents: `Object.groupBy`, `Map.groupBy`, and the iterator-helper `Array.from(new Set(arr.map(...)))`. Add `Array.fromAsync` for collecting async iterables, and most lodash usage becomes optional.

## Object.groupBy — group by key

```js
const orders = [
  { id: 1, status: "shipped" },
  { id: 2, status: "pending" },
  { id: 3, status: "shipped" },
  { id: 4, status: "cancelled" }
];

Object.groupBy(orders, (o) => o.status);
// {
//   shipped: [{id:1,...}, {id:3,...}],
//   pending: [{id:2,...}],
//   cancelled: [{id:4,...}]
// }
```

Same shape as lodash's `groupBy`. Returns a plain object.

## Map.groupBy — group when keys aren't strings

```js
const orders = [
  { id: 1, customer: { id: 100 }, total: 50 },
  { id: 2, customer: { id: 200 }, total: 30 },
  { id: 3, customer: { id: 100 }, total: 20 }
];

Map.groupBy(orders, (o) => o.customer);
// Map { {id:100} => [order1, order3], {id:200} => [order2] }
```

Use this when the grouping key is an object (would coerce to `[object Object]` as a string). The result is a `Map` so iteration gives you `for (const [customer, orders] of grouped)`.

## Iterator helpers — chainable without lodash

```js
const totals = orders
  .values()
  .filter((o) => o.status === "shipped")
  .map((o) => o.total)
  .reduce((sum, t) => sum + t, 0);
```

Iterator helpers (`Iterator.prototype.{filter, map, take, drop, flatMap, reduce, forEach, some, every, find, toArray}`) avoid intermediate arrays. For long pipelines on big collections, **memory footprint stays flat** — vs `arr.filter().map().reduce()` which allocates a new array per step.

```js
// Old:                     // New:
arr.filter(p).map(t).slice(0, 10);
arr.values().filter(p).map(t).take(10).toArray();
```

Same logic. The iterator chain only walks until 10 items pass the filter.

## Array.fromAsync — collect async iterables

```js
async function* fetchPages(url) {
  let cursor = null;
  while (true) {
    const res = await fetch(`${url}?cursor=${cursor || ""}`).then(r => r.json());
    yield* res.items;
    if (!res.nextCursor) break;
    cursor = res.nextCursor;
  }
}

const all = await Array.fromAsync(fetchPages("/api/items"));
// Single array of every item from every paginated response
```

Or with sync iterables that yield promises:

```js
const tasks = [fetch("/a"), fetch("/b"), fetch("/c")];
const responses = await Array.fromAsync(tasks);  // [resA, resB, resC]
```

Equivalent to `Array.from(await Promise.all(tasks))`, but reads more naturally for async iterators.

## What lodash functions you can drop

| lodash                       | Native equivalent                         |
|------------------------------|-------------------------------------------|
| `_.groupBy(arr, fn)`         | `Object.groupBy(arr, fn)`                 |
| `_.keyBy(arr, fn)`           | `Object.fromEntries(arr.map(x => [fn(x), x]))` |
| `_.uniq(arr)`                | `[...new Set(arr)]`                       |
| `_.uniqBy(arr, fn)`          | `[...new Map(arr.map(x => [fn(x), x])).values()]` |
| `_.chunk(arr, n)`            | `Array.from({length: Math.ceil(arr.length/n)}, (_,i) => arr.slice(i*n, i*n+n))` |
| `_.flatten(arr)`             | `arr.flat()`                              |
| `_.flattenDeep(arr)`         | `arr.flat(Infinity)`                      |
| `_.compact(arr)`             | `arr.filter(Boolean)`                     |
| `_.pick(obj, keys)`          | `Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]))` |
| `_.omit(obj, keys)`          | `Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))` |
| `_.range(n)`                 | `[...Array(n).keys()]`                    |
| `_.zip([1,2], [3,4])`        | `[1,2].map((v,i) => [v, [3,4][i]])`       |
| `_.partition(arr, fn)`       | `arr.reduce(([a,b], x) => fn(x) ? [a.concat(x), b] : [a, b.concat(x)], [[], []])` |
| `_.debounce` / `_.throttle`  | small custom helpers (still useful as lib) |

`debounce` and `throttle` are the cases where keeping a tiny utility lib (just-debounce-it, ~200 bytes) beats reinventing.

## Bundle impact

A typical app imports lodash via `lodash/groupBy`, `lodash/uniqBy`, `lodash/debounce` — ~8 KB minified. Replacing the first two with native and keeping just-debounce-it for the third: **bundle drops by ~7.5 KB**, no API change at the call sites.

## Performance

V8 / SpiderMonkey / JavaScriptCore implement these in native code. For a 100k-item `groupBy`:

| Implementation         | Time   |
|------------------------|--------|
| `lodash.groupBy`       | 28 ms  |
| `Object.groupBy`       | 11 ms  |
| Hand-rolled `reduce`   | 15 ms  |

~2.5x faster than lodash. The native version doesn't allocate intermediate iterators.

## Browser support

- `Object.groupBy` / `Map.groupBy`: Chrome 117+ (Sept 2023), Safari 17.4+, Firefox 119+
- Iterator helpers: Chrome 122+ (Feb 2024), Safari 18.4, Firefox 131+
- `Array.fromAsync`: Chrome 121+, Safari 16.4+, Firefox 115+

For older browsers: lodash still works as a polyfill effectively. Or `core-js/stable` for explicit polyfills.

## When to keep lodash

- **Deep equality** (`_.isEqual`) — non-trivial; native has nothing
- **Date manipulation** — use Temporal instead (covered [here](/blog/js-temporal-finally-replacing-date/))
- **Functional composition** (`_.flow`, `_.curry`) — taste-dependent; some teams keep these
- **Memoization** — no native primitive

## When to drop it

For a typical React/Vue app: if your lodash imports are 80% the functions in the table above, switch to native and the dependency goes away. Bundle smaller, code closer to the language standard.

---

Practice JS basics in the [`js-variables`](/js-variables/0/) module on [Code Crispies](/) — covers arrays, objects, and the iteration patterns these helpers replace.
