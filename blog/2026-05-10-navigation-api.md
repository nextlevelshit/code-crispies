---
title: "The Navigation API — Finally a Sane Router Primitive"
description: "history.pushState was the only routing tool for a decade — and it was awful. The Navigation API is the actual primitive routers should have been built on."
date: 2026-05-10
slug: navigation-api
tags: [javascript, navigation, architecture]
---

Every SPA router on npm — react-router, vue-router, @tanstack/router — exists because `history.pushState` is unusable as a routing primitive. No event for clicked links. No way to intercept navigation. Async lifecycle? Roll your own. The Navigation API is the platform fix.

## The fundamental win: navigate event

```js
navigation.addEventListener("navigate", (event) => {
  if (!event.canIntercept || event.hashChange) return;

  const url = new URL(event.destination.url);
  if (url.origin !== location.origin) return;

  event.intercept({
    handler: async () => {
      const html = await fetch(url, { signal: event.signal }).then((r) => r.text());
      document.querySelector("main").innerHTML = html;
    }
  });
});
```

That's a complete client-side router. ~10 lines.

What it gives you:
- Fires for every navigation: clicks, `navigation.navigate()`, back/forward, even `<form action>` submissions
- `event.intercept(handler)` — take over the navigation, do async work, the URL bar updates
- `event.signal` — automatic AbortSignal that cancels if the user navigates away mid-load
- `event.hashChange` lets you skip in-page anchor jumps
- `event.canIntercept` returns false for cross-origin / download requests

## Compare to the old way

```js
// pre-Navigation API
window.addEventListener("popstate", handlePopState);
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href]");
  if (!link) return;
  if (link.target === "_blank") return;
  if (link.href.startsWith("mailto:")) return;
  if (link.host !== location.host) return;
  if (e.metaKey || e.ctrlKey) return;
  // ... 20 more edge cases ...
  e.preventDefault();
  history.pushState(null, "", link.href);
  handleRoute(link.href);
});
```

Every framework router has this 200-line click interceptor. Navigation API replaces it with `addEventListener("navigate", ...)`.

## Async navigations with state

```js
navigation.addEventListener("navigate", (event) => {
  if (!event.canIntercept) return;
  
  event.intercept({
    handler: async () => {
      showLoadingBar();
      try {
        await renderRoute(event.destination.url);
      } finally {
        hideLoadingBar();
      }
    },
    // Tell the browser: focus management, scroll restoration
    focusReset: "after-transition",
    scroll: "after-transition"
  });
});
```

`focusReset` moves keyboard focus to the new view. `scroll` restores scroll position on back/forward. Both are A11y wins you usually have to hand-build.

## Programmatic navigation with await

```js
const result = await navigation.navigate("/lessons/42").finished;
console.log("navigation done");
```

`navigation.navigate()` returns `{ committed, finished }` — two promises. `committed` resolves when the URL changes; `finished` when the handler finishes. So you can `await` a route load like any other async operation.

## Pair with View Transitions

```js
navigation.addEventListener("navigate", (event) => {
  if (!event.canIntercept || event.hashChange) return;

  event.intercept({
    handler: async () => {
      if (!document.startViewTransition) {
        return renderRoute(event.destination.url);
      }
      const transition = document.startViewTransition(() =>
        renderRoute(event.destination.url)
      );
      await transition.finished;
    }
  });
});
```

Click → fetch → swap DOM → animate. The combo gives you SPA-feel without a router framework.

## Going back / forward

`navigation.entries()` returns every entry in the history (just for your origin):

```js
const entries = navigation.entries();
const currentIdx = navigation.currentEntry.index;
const previous = entries[currentIdx - 1];

if (previous) {
  navigation.traverseTo(previous.key);
}
```

No more guessing what's in `history.state` — you have a real list of entries with stable keys.

## Form intercepts

```js
navigation.addEventListener("navigate", (event) => {
  if (event.formData) {
    // It's a form submission, formData is the submitted FormData
    event.intercept({
      handler: async () => {
        const response = await fetch(event.destination.url, {
          method: "POST",
          body: event.formData
        });
        renderRoute(event.destination.url, await response.text());
      }
    });
  }
});
```

You can intercept form submits *and* GET navigations through one event. The old way needed separate handlers for `submit` events.

## Browser support

- Chrome / Edge 102+ (May 2022)
- Safari 18+ (September 2024)
- Firefox: in development as of 2026

For Firefox today: `if (!window.navigation) { /* fall back to old click-intercept */ }`. Most existing routers do this internally already, but if you're hand-rolling, write the fallback.

## When NOT to reach for it

- **Multi-document apps** (server-rendered without hydration) — Speculation Rules cover that case better
- **Tiny apps with 2 routes** — keep using `<a>` and full reloads, not worth the wiring
- **Cross-origin SSO redirects** — `canIntercept` returns false anyway, the browser owns this

## What this kills

- Most of `history.pushState` direct usage
- Click-interceptor boilerplate in vanilla SPAs
- The motivation for "minimal SPA router" libraries
- Hand-rolled scroll/focus restoration

When the Navigation API is universally available (Firefox roadmap suggests 2027), the question "which router should I use?" becomes "do I need a router at all, or just `addEventListener('navigate', ...)`?"

---

Practice JS basics in the [`js-events`](/js-events/0/) module on [Code Crispies](/) — covers `addEventListener` and event delegation.
