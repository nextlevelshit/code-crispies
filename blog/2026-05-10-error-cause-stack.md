---
title: "Error.cause + AggregateError — Stop Losing Stack Traces"
description: "Error.cause was added to JS in 2021 and is universally supported. Here's the rewrite of every catch + rethrow you've ever written that lost the original error."
date: 2026-05-10
slug: error-cause-stack
tags: [javascript, debugging]
---

The classic JavaScript anti-pattern:

```js
try {
  await doThing();
} catch (e) {
  throw new Error("doing thing failed: " + e.message);
}
```

The original `e` is **gone**. Stack trace lost, original error type lost, debugging on production logs becomes guesswork. `Error.cause` (ES2022) is the one-line fix that's been universally supported since 2022.

## The fix

```js
try {
  await doThing();
} catch (e) {
  throw new Error("doing thing failed", { cause: e });
}
```

The original error is preserved on `.cause`. `.stack` from V8/SpiderMonkey/JavaScriptCore concatenates both:

```
Error: doing thing failed
    at handler (/app.js:42:11)
Caused by: TypeError: cannot read property 'name' of undefined
    at parse (/parse.js:18:5)
```

Browsers + Node.js print the chain natively. Sentry, Datadog, Bugsnag all extract `cause` and surface it.

## Custom error subclasses

```js
class DBError extends Error {
  constructor(message, { cause, query } = {}) {
    super(message, { cause });
    this.name = "DBError";
    this.query = query;
  }
}

try {
  await db.query("SELECT * FROM users WHERE id = $1", [userId]);
} catch (e) {
  throw new DBError("user lookup failed", { cause: e, query: "SELECT users" });
}
```

Caller sees: typed error, custom property (`query`), original cause attached.

## AggregateError — multiple errors at once

`Promise.any()` rejects when ALL promises reject. The rejection is an `AggregateError` with all the individual errors:

```js
try {
  const result = await Promise.any([
    fetch("/primary"),
    fetch("/backup-1"),
    fetch("/backup-2")
  ]);
} catch (e) {
  if (e instanceof AggregateError) {
    console.log("all backends failed:");
    e.errors.forEach((err, i) => console.log(`  [${i}] ${err.message}`));
  }
}
```

Build your own when you need to:

```js
const errors = [];
for (const item of items) {
  try { await process(item); } catch (e) { errors.push(e); }
}
if (errors.length) {
  throw new AggregateError(errors, `${errors.length} items failed`);
}
```

Pattern: don't bail on first error in a batch — collect, finish the batch, throw at end with full context.

## Stack augmentation in async functions

```js
async function fetchUser(id) {
  try {
    return await db.users.findOne({ id });
  } catch (cause) {
    // Without this, the stack would only show db.* internals; with it,
    // we anchor in our app code where the call originated.
    throw new Error(`fetchUser(${id}) failed`, { cause });
  }
}
```

Async stack traces are notoriously thin. `Error.cause` lets you tag each application boundary so the post-mortem chain reads top-down: app code → DB layer → network primitive.

## Browser logging integration

Most browser DevTools (Chrome 117+, Firefox 119+) detect `cause` chains and render them inline:

```
▼ Error: payment processing failed
   at Checkout.submit (/checkout.js:142)
   at HTMLButtonElement.<anonymous> (/checkout.js:198)

▼ Caused by: NetworkError: timeout after 30s
     at fetch (/api/client.js:55)
```

No flag, no setup — just throw with `cause`.

## Combine with structured error responses

```js
async function paymentRequest(payload) {
  const res = await fetch("/api/pay", { method: "POST", body: JSON.stringify(payload) });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(`payment ${res.status}`, {
      cause: { ...detail, status: res.status, url: res.url }
    });
  }
  return res.json();
}
```

`cause` doesn't have to be an `Error` — it accepts any value. Use a plain object for structured failure metadata.

## What it doesn't do

- **Stack-walking up to source maps** — `cause` preserves the chain, but mapping to TypeScript original lines still needs your build's source maps + an unwrapper (Sentry does this; raw `console.error` doesn't)
- **Async-stack restoration in older runtimes** — Node 16- + Safari 14- print only the top error; `cause` needs ES2022 runtime

## When to actually use it

Every `catch` + `throw` pair. There's no downside; the original error attaches in O(1) via reference. Default to it.

## When to skip

- Inside library code that catches expected errors and converts to known statuses (e.g., a router's 404 response). The "original error" isn't useful and may leak internals.
- Inside hot loops where you genuinely catch + recover; an Error allocation per iteration adds up.

## Browser support

- Chrome / Edge 93+ (August 2021)
- Safari 15+ (September 2021)
- Firefox 91+ (August 2021)

Universal since 2022. AggregateError: same.

## What this changes

The "lost stack trace" excuse for poor production debugging is gone. Every wrap-and-rethrow boundary should carry `{ cause }` from now on. Tooling already understands it; logging frameworks already extract it. The cost is one object literal per catch.

---

Practice JavaScript fundamentals in the [`js-variables`](/js-variables/0/) and [`js-events`](/js-events/0/) modules on [Code Crispies](/).
