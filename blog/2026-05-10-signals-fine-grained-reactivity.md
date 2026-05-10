---
title: "JavaScript Signals — Fine-Grained Reactivity Without a Framework"
description: "Signals are the reactivity primitive Solid, Vue, Angular, and Svelte all converged on. The TC39 proposal brings them to vanilla JS — and changes how you think about state."
date: 2026-05-10
slug: signals-fine-grained-reactivity
tags: [javascript, architecture]
---

In 2020, every JS framework had its own reactivity system. By 2024 they had all converged on roughly the same primitive: **signals**. Solid invented the modern term, Vue's `ref`, Angular's `signal`, Svelte 5's `$state` are all variations of the same idea. TC39 is now standardizing it for the language itself.

## What a signal is

```js
import { Signal } from "signal-polyfill";

const count = new Signal.State(0);

console.log(count.get());    // 0
count.set(5);
console.log(count.get());    // 5
```

Looks like a getter/setter. The magic is what comes next.

## Computed values track dependencies automatically

```js
const count = new Signal.State(0);
const doubled = new Signal.Computed(() => count.get() * 2);

console.log(doubled.get());  // 0
count.set(5);
console.log(doubled.get());  // 10
```

`doubled` reads `count.get()` inside its compute function. Signals notice the read and register the dependency. When `count` changes, `doubled` knows it's stale.

If you wrote it imperatively:

```js
let count = 0;
let doubled = count * 2;
count = 5;
console.log(doubled);  // 0 — stale!
```

Signals close that gap. Push-based reactivity, but with pull-based reads (lazy evaluation).

## Effects react to changes

```js
import { effect } from "signal-utils/subtle/microtask-effect";

const count = new Signal.State(0);

effect(() => {
  console.log("count is", count.get());
});

count.set(5);  // logs "count is 5"
count.set(10); // logs "count is 10"
```

Whenever any signal read inside the effect changes, the effect re-runs. This is how `<input value={count.get()}>` becomes reactive in frameworks — they wrap rendering in an effect.

## The killer feature: derive without re-computing

```js
const items = new Signal.State([]);
const total = new Signal.Computed(() =>
  items.get().reduce((sum, x) => sum + x.price, 0)
);
const tax = new Signal.Computed(() => total.get() * 0.19);
const grandTotal = new Signal.Computed(() => total.get() + tax.get());

items.set([{ price: 10 }, { price: 20 }]);
console.log(grandTotal.get());  // 35.7

items.set([{ price: 10 }, { price: 20 }, { price: 5 }]);
console.log(grandTotal.get());  // 41.65
```

`tax` and `grandTotal` re-compute lazily, only when `.get()` is called and only if their dependencies actually changed. No virtual-DOM diffing. No reconciler. The graph itself tracks what's stale.

## Why this matters beyond frameworks

Signals are useful any time you have **derived state**:

- Form validation: `errors = computed(() => validate(formData.get()))`
- Cart total: `total = computed(() => items.get().reduce(...))`
- Theme color: `theme = computed(() => prefersDark.get() ? darkTheme : lightTheme)`
- WebSocket-driven UI: signal wraps the message stream

Without signals, you write either:
- An event-emitter pattern with manual subscriptions and cleanup
- Polling: re-compute every X ms whether or not anything changed
- A whole framework

Signals give you the reactivity primitive without the framework opinions.

## TC39 status

The proposal is at **Stage 2** (as of late 2025) — drafted, but the API may shift. Polyfills exist now:

```bash
npm install signal-polyfill
```

The polyfill follows the proposal API exactly, so when browsers ship native, you swap one import:

```js
// Before:
import { Signal } from "signal-polyfill";
// After (browser support):
const { Signal } = globalThis;
```

## Caveats

- **Signals are NOT a replacement for everything**. State that doesn't have derivations doesn't need signals — a plain variable is fine.
- **Effect leaks**: if you create effects without cleanup, they run forever. Use the framework integration's lifecycle hooks (or `subtle/microtask-effect` with manual disposal).
- **Equality**: signals use `Object.is` for change detection. If you mutate an object and `.set()` it, the signal sees the same reference and skips the update. Always replace, never mutate.

## What this kills (over time)

- Framework-specific reactivity systems re-implementing the same primitive
- Event-emitter glue between independent state hubs
- "Why isn't my UI updating" debugging sessions for missed dependencies

When signals ship natively (Chrome / Safari / Firefox roadmap suggests 2027), the framework you choose becomes a question of *templating* and *router*, not reactivity. Pick the syntax you like; the engine is shared.

---

Practice fundamental JS in the [`js-variables`](/js-variables/0/) and [`js-events`](/js-events/0/) modules on [Code Crispies](/).
