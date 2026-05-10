---
title: "File System Access API — Native File I/O in the Browser"
description: "Read, write, and persist real files from the user's disk. The download attribute is dead; long live showSaveFilePicker."
date: 2026-05-10
slug: file-system-access
tags: [javascript, ux]
---

For two decades, "save a file from the browser" meant `<a download>` or `URL.createObjectURL`. Both produce one-off downloads with no path, no overwrite, no read-back. The File System Access API replaces all of that with real file handles you can read, write, and re-open across sessions.

## Save a file

```js
const handle = await window.showSaveFilePicker({
  suggestedName: "draft.md",
  types: [{
    description: "Markdown",
    accept: { "text/markdown": [".md"] }
  }]
});

const writable = await handle.createWritable();
await writable.write("# My Draft\n\nFirst line.");
await writable.close();
```

Native file picker. User picks the location + name. You write to it directly. No DOM hack, no blob URL.

## Open a file

```js
const [handle] = await window.showOpenFilePicker({
  types: [{ description: "Markdown", accept: { "text/markdown": [".md"] } }]
});
const file = await handle.getFile();
const text = await file.text();
```

Returns a real `File` object. Same `text()`, `arrayBuffer()`, `stream()` methods as `<input type="file">`, but you also get the **handle**, which you can persist and re-use.

## Persist handles across sessions

```js
import { set, get } from "idb-keyval";

// After save:
await set("draft-handle", handle);

// On next visit:
const saved = await get("draft-handle");
if (saved) {
  // User permission granted in this session? Re-request:
  const perm = await saved.queryPermission({ mode: "readwrite" });
  if (perm === "granted") {
    const f = await saved.getFile();
    editor.value = await f.text();
  } else {
    // Need to ask again — must come from user gesture
    openButton.addEventListener("click", async () => {
      const re = await saved.requestPermission({ mode: "readwrite" });
      if (re === "granted") loadFromHandle(saved);
    }, { once: true });
  }
}
```

Handles ARE serializable to IndexedDB. The user doesn't have to re-pick the file every session — just re-grant permission.

## Directory access

```js
const dir = await window.showDirectoryPicker();
for await (const [name, handle] of dir.entries()) {
  console.log(name, handle.kind);  // "myfile.md" "file"
}
```

Walk a folder. Read multiple files. Save siblings without re-prompting per file. This is what makes browser-based editors (vscode.dev, stackblitz) feel like real apps.

## Atomic writes

```js
const writable = await handle.createWritable({ keepExistingData: false });
await writable.write(blob);
await writable.close();  // commit
```

Writes go to a temp file; `close()` atomically replaces the original. If the browser crashes mid-write, the original survives. Same guarantee as `rename(2)` on POSIX.

## When NOT to use it

- **Anonymous users** who don't expect to save files — shows scary picker
- **Tiny in-app data** (drafts, settings) — use IndexedDB or OPFS instead
- **Server-side workflows** where the file is just transient before upload

## OPFS vs File System Access

| Origin Private File System (OPFS) | File System Access |
|---|---|
| Hidden, no permission needed | Visible, user picks location |
| Per-origin sandbox | User's actual disk |
| For app's internal data | For user's documents |
| Synchronous in workers | Async only |

Use OPFS for "I need to store stuff that survives reload." Use File System Access for "the user wants to edit their actual file."

## Browser support

- Chrome / Edge 86+ (October 2020)
- Safari 15.2+ partial — `showOpenFilePicker` + `showSaveFilePicker` since 18 (September 2024)
- Firefox: deferred (preference-flagged in 124+, debate ongoing)

For Firefox: fall back to `<input type="file">` + `<a download>`. The handle persistence + directory walks degrade gracefully.

## Security model

- Every picker = explicit user gesture + native dialog
- Permission grants per-handle, not per-origin
- Browser-blocked paths: system directories, browser config, anything that'd let a page read `~/.ssh/`
- Auto-revoke after tab close (configurable per-handle)

## What this enables

- Real text editors in the browser (VSCode-in-browser, monaco-edit-with-real-files)
- Photo/video editors that save back to the source file
- Database-tool web apps (read .sqlite from disk, edit, write back)
- Local-first apps with optional cloud sync — file is the source of truth, sync is a feature

## What it kills

- `<a download>` for "save this file" — picker is better UX
- localStorage for anything bigger than a config flag
- "Drag this PDF onto our site" patterns where the user actually wanted to edit it
- "Re-upload the same file every session" friction

---

Practice JS basics in the [`js-events`](/js-events/0/) module on [Code Crispies](/) — covers async event handling.
