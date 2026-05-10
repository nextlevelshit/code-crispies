---
title: "The Modern Browser Storage Stack — localStorage Is Not Enough"
description: "localStorage is the wrong default in 2026. Web Locks, Origin Private File System, and Storage Buckets give you real persistence, real concurrency, and real quotas."
date: 2026-05-10
slug: storage-api-modernization
tags: [javascript, storage, performance]
---

Most web apps still reach for `localStorage` for everything. It's simple, synchronous, and 25 years old. It's also blocking, size-limited to ~5MB, and string-only — three reasons to stop using it as a general-purpose store. The 2026 platform has better tools for nearly every use case.

## What localStorage is actually good for

- **Tiny config flags** under 100 bytes (theme preference, user toggle)
- **Things that must survive a JS bug** that crashes the app

That's it. Everything below replaces it for serious work.

## IndexedDB via `idb-keyval` — the everyday default

```js
import { get, set, del, keys } from "idb-keyval";

await set("user-progress", { lessons: [1, 2, 3] });
const data = await get("user-progress");
await del("user-progress");
```

`idb-keyval` is ~600 bytes gzipped. It wraps IndexedDB into a key/value API that *feels* like localStorage but is:

- **Async** (no main-thread blocking on read/write)
- **Structured-clone** (objects, Maps, Blobs — no `JSON.stringify`)
- **MB-scale** (browsers allocate 60% of free disk; not 5MB)

For 95% of "I want to save some app state" cases, this is the right answer.

## Origin Private File System — when you have actual files

```js
const root = await navigator.storage.getDirectory();
const file = await root.getFileHandle("draft.md", { create: true });

const writable = await file.createWritable();
await writable.write("# My Draft\n\nWriting offline.");
await writable.close();

// Later:
const handle = await root.getFileHandle("draft.md");
const f = await handle.getFile();
const text = await f.text();
```

OPFS gives every origin a private filesystem. Real files, real directories, real `read`/`write`/`seek`. Different from the Showing-the-user-a-file-picker File System Access API (which needs user permission per file): OPFS needs no permission and isn't user-visible.

When to reach for it:
- **Editor drafts** (Notion, VSCode-in-browser)
- **SQLite databases** (sqlite-wasm uses OPFS for persistence)
- **Large media** (audio recordings, image edits)
- **Anything where IndexedDB feels wrong** because you actually have file-shaped data

## Web Locks API — coordinate across tabs

The biggest hidden bug in multi-tab web apps: two tabs writing to storage simultaneously, last-writer-wins, data lost. Web Locks fix it:

```js
await navigator.locks.request("user-progress", async (lock) => {
  const current = await get("user-progress");
  current.lessons.push(latestLesson);
  await set("user-progress", current);
});
```

Inside the callback, no other tab (same origin) can hold the `"user-progress"` lock. The browser queues other tab requests. When this callback finishes, the lock releases. Atomic update across tabs, no `BroadcastChannel` glue needed.

Other modes:
```js
await navigator.locks.request("api", { mode: "shared" }, async () => { /* multiple readers */ });
await navigator.locks.request("api", { mode: "exclusive" }, async () => { /* sole writer */ });
await navigator.locks.request("api", { ifAvailable: true }, async (lock) => {
  if (!lock) return; // someone else has it, give up
});
```

## Storage Buckets — partial eviction control

By default, when storage runs low, the browser evicts your origin's data wholesale. Storage Buckets let you split data into named "buckets" with eviction priorities:

```js
const cache = await navigator.storageBuckets.open("scratch", {
  durability: "relaxed",  // OK to lose if disk pressure
  persisted: false
});

const draft = await navigator.storageBuckets.open("drafts", {
  durability: "strict",
  persisted: true  // ask user; survives eviction
});

// Each bucket is its own scope:
const draftDir = await draft.getDirectory();
```

When the device is low on disk, the browser evicts `scratch` first, leaves `drafts` alone.

## Persistent storage permission

```js
if (await navigator.storage.persisted()) {
  console.log("data is safe from auto-eviction");
} else {
  if (await navigator.storage.persist()) {
    console.log("user granted persistence");
  }
}
```

Without `persist()`, the browser may delete your origin's storage when disk is low. With it, the user is asked first. Combine with Storage Buckets for granular control.

## Storage estimate

```js
const { quota, usage } = await navigator.storage.estimate();
console.log(`Using ${(usage / 1024 / 1024).toFixed(1)} MB of ${(quota / 1024 / 1024).toFixed(1)} MB`);
```

Useful for debug overlays and user-facing storage management.

## What to drop

- `localStorage` for anything > 1KB or anything you'd hate to lose
- `BroadcastChannel` glue between tabs for write coordination — Web Locks are simpler
- Custom file abstractions over IndexedDB — OPFS is the file abstraction
- Manual eviction handling — Storage Buckets do it

## When localStorage still wins

```js
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
```

Synchronous and zero-async-friction. For "the user clicked the dark mode toggle, save it before the next paint", this is fine. Just don't put your app's actual state there.

## Browser support

- IndexedDB / `navigator.storage`: universal since 2018
- OPFS: Chrome 102+, Safari 15.2+, Firefox 111+
- Web Locks: Chrome 69+, Safari 15.4+, Firefox 96+
- Storage Buckets: Chrome 122+ (Feb 2024), Safari 18+, Firefox: not yet

For Firefox today, fall back to a single-bucket model — degrades gracefully.

---

Practice JavaScript fundamentals in the [`js-variables`](/js-variables/0/) module on [Code Crispies](/) — covers `let`, `const`, and basic data flow.
