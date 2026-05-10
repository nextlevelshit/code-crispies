---
title: "Service Worker Caching — 5 Recipes Worth Memorizing"
description: "The 5 cache strategies that cover ~95% of real PWA needs. Cache-first, network-first, stale-while-revalidate, and the two failure-mode escapes."
date: 2026-05-10
slug: service-worker-caching-recipes
tags: [javascript, performance]
---

Service workers exist primarily to make web apps fast and offline-capable. The difference between a snappy PWA and a janky one is which **caching strategy** sits between fetch() and the network. Five strategies cover almost everything; here they are with copy-paste code.

## Setup: install + cache the shell

```js
// sw.js
const CACHE = "cc-v1";
const SHELL = ["/", "/index.html", "/main.css", "/app.js", "/bowl.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});
```

The shell is your minimal app skeleton. Everything else gets a strategy.

## Recipe 1: Cache-first (immutable assets)

For Vite-hashed bundles, fonts, images — anything content-addressed that never changes per URL.

```js
async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const fresh = await fetch(req);
  const cache = await caches.open(CACHE);
  cache.put(req, fresh.clone());
  return fresh;
}
```

Pros: zero network roundtrip if cached. Cons: if you accidentally cache a stale URL, it's stuck forever (until cache is invalidated).

Use for: `/assets/*` (Vite hashed), web fonts, profile avatars (URL changes when image changes).

## Recipe 2: Network-first (HTML, dynamic data)

For pages that change. Try network; fall back to cache only if offline.

```js
async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (_) {
    const cached = await caches.match(req);
    if (cached) return cached;
    throw new Error("offline + no cache");
  }
}
```

Pros: always-fresh when online. Cons: every request waits for network; slow if user is on mobile.

Use for: HTML pages, user-specific endpoints, API responses where staleness matters.

## Recipe 3: Stale-while-revalidate (the sweet spot)

Serve cached immediately; update cache in background. Next visit gets the update.

```js
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const fetching = fetch(req).then((fresh) => {
    cache.put(req, fresh.clone());
    return fresh;
  }).catch(() => null);
  return cached || fetching;
}
```

Pros: instant response, fresh-by-next-load. Cons: user sees stale content for one cycle.

Use for: blog posts, marketing pages, product cards, anything where "yesterday's version is fine."

This is the right default for ~70% of routes.

## Recipe 4: Cache-only (offline-mode pages)

Strict offline support. Useful for /offline.html.

```js
async function cacheOnly(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  return new Response("Offline", { status: 503 });
}
```

Use for: `/offline.html` shown by network-first routes when fetch fails.

## Recipe 5: Network-only (auth, mutations)

Bypass cache entirely. Critical for POST/PUT/DELETE and anything sensitive.

```js
async function networkOnly(req) {
  return fetch(req);
}
```

The request never enters the cache. For auth endpoints especially: you do NOT want a cached login response.

## Wiring routes to strategies

```js
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  
  // Skip non-GET — never cache mutations
  if (e.request.method !== "GET") {
    e.respondWith(networkOnly(e.request));
    return;
  }
  
  // Skip cross-origin (Supabase, Umami)
  if (url.origin !== location.origin) return;
  
  // Hashed bundles: cache-first
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(cacheFirst(e.request));
    return;
  }
  
  // Sitemap, manifest, RSS: network-first (need fresh)
  if (/\.(xml|json|webmanifest)$/.test(url.pathname)) {
    e.respondWith(networkFirst(e.request));
    return;
  }
  
  // Blog posts: stale-while-revalidate
  if (url.pathname.startsWith("/blog/")) {
    e.respondWith(staleWhileRevalidate(e.request));
    return;
  }
  
  // HTML routes: network-first with offline fallback
  e.respondWith(
    networkFirst(e.request).catch(() => caches.match("/offline.html"))
  );
});
```

## The two failure modes you'll hit

### "My update isn't showing"

Cache-first served a stale URL. Either:

- Bump the SW cache version: `const CACHE = "cc-v2"` (forces re-fetch on activate)
- Use stale-while-revalidate so the next visit gets the update
- For Vite assets, the hashed filename changes — only an issue if the SHELL list isn't versioned alongside

### "User sees stale data after I push a fix"

Service workers update lazily. By default, a new SW takes over only when **all tabs of your site close**. To activate immediately:

```js
self.addEventListener("install", (e) => {
  self.skipWaiting();  // become active immediately
  e.waitUntil(/* ... */);
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());  // take control of open pages
});
```

Or politely: notify the user of an available update and let them refresh on their schedule.

## Workbox?

Workbox is Google's library that wraps these recipes. ~12 KB, well-maintained, handles the edge cases (Range headers, navigation preload, expiration cleanup).

Use Workbox when:
- You have 5+ strategies / many route patterns
- You need cache expiration (entries older than 30d auto-deleted)
- You're shipping a polished PWA

Skip Workbox when:
- You have 2-3 simple route patterns
- Bundle size matters (the 12 KB adds 5% to a small app)
- You want to understand what's happening (Workbox abstracts away the explicit cache calls)

## Testing strategies

DevTools → Application → Service Workers → "Update on reload" + "Bypass for network" while developing. Then untoggle and inspect:

```js
// Console:
const cache = await caches.open("cc-v1");
const keys = await cache.keys();
console.log("cached:", keys.map(r => r.url));
```

## When NOT to use a service worker

- **Anything where cached stale content would mislead** (financial dashboards, real-time chat)
- **Tiny single-page tools** that cache in-browser anyway
- **Apps that can't tolerate the SW update lag**
- **First-time visitors** — SW only kicks in after the first install, doesn't help cold-start

## What this changes

Once you have these 5 patterns memorized, "make this app feel instant" becomes "pick the strategy per route." The hard part is choosing which strategy, not writing more code.

---

Practice JavaScript fundamentals in the [`js-variables`](/js-variables/0/) and [`js-events`](/js-events/0/) modules on [Code Crispies](/).
