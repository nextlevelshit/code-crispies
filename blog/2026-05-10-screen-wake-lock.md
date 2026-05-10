---
title: "Screen Wake Lock — Stop the Screen Sleeping During Critical Tasks"
description: "Recipe app, video player, presentation slide — all benefit from preventing the screen from dimming. The Wake Lock API makes it three lines."
date: 2026-05-10
slug: screen-wake-lock
tags: [javascript, ux]
---

Reading a recipe with hands covered in flour. Following along with a workout video. Presenting slides on a tablet. In all of these, the screen dimming or sleeping mid-flow breaks the user experience. The Screen Wake Lock API holds the screen on for as long as you need it.

## Three lines

```js
let wakeLock = null;
try {
  wakeLock = await navigator.wakeLock.request("screen");
} catch (err) {
  // user denied, battery low, or feature missing
}
```

That's it. The screen stays on until either:
- You call `wakeLock.release()`
- The page becomes hidden (background tab)
- The user navigates away

## Releasing it cleanly

```js
window.addEventListener("beforeunload", () => wakeLock?.release());
```

The browser also auto-releases on tab hidden. So when the user comes back, you might want to reacquire:

```js
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && shouldKeepAwake) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
    } catch {}
  }
});
```

## When to acquire

User-gesture required for the request. Calling on page load = `NotAllowedError`. Tie to a button or feature toggle:

```js
const stayAwakeBtn = document.getElementById("stay-awake");
let wakeLock = null;

stayAwakeBtn.addEventListener("click", async () => {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
    stayAwakeBtn.textContent = "Keep screen on";
  } else {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      stayAwakeBtn.textContent = "Screen wake-lock active";
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
        stayAwakeBtn.textContent = "Keep screen on";
      });
    } catch (err) {
      stayAwakeBtn.textContent = "Wake-lock failed: " + err.message;
    }
  }
});
```

## Real use cases

- **Recipe / cooking apps** — flour-coated hands, can't keep tapping
- **Workout / yoga apps** — phone propped on the floor
- **Music sheet / lyrics displays** — hands on instrument
- **Live transcription** — speech-to-text shouldn't stop mid-word
- **Presentation mode** — projector tablets, kiosks
- **In-game scoreboards** — long matches
- **Reading mode for long-form content** — counter to dim-after-30s

## What it ISN'T

- **CPU wake-lock** — JS still pauses when tab is hidden. Wake Lock only keeps the *display* on for visible tabs
- **Brightness control** — can't override user's brightness setting
- **Power-saving mode override** — if device is in low-battery mode, browser may refuse the request

## Browser support

- Chrome / Edge 84+ (July 2020)
- Safari 16.4+ (March 2023)
- Firefox 126+ (May 2024)

For older browsers + iOS pre-16.4: feature-detect and gracefully degrade. The recipe still readable — just dims after the OS timeout.

```js
if ("wakeLock" in navigator) {
  // show the toggle UI
} else {
  // hide toggle, no-op
}
```

## Battery cost

A wake-locked screen costs ~150-300mW continuously vs ~5mW asleep. On a 3000mAh phone (~11Wh), wake-lock all day = ~3-7% extra drain. Reasonable for a 30-min recipe; rude for a "always keep screen on" toggle in your todo app.

UX guideline: wake-lock for the duration of a clear task, release when the task ends. Don't bind it to "app open."

## A11y angle

For users with motor impairments, having the screen sleep mid-task means they have to re-authenticate (face ID, PIN) before continuing. Wake Lock removes that friction for tasks that are inherently long-running. Make it a setting; don't auto-acquire silently.

## Combine with Page Visibility for resume-on-return

```js
async function ensureWakeLock() {
  if (wakeLock || document.visibilityState !== "visible") return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { wakeLock = null; });
  } catch {}
}

document.addEventListener("visibilitychange", ensureWakeLock);
ensureWakeLock();  // initial
```

This pattern: when the user briefly switches apps then returns, the wake-lock auto-reacquires. No manual re-toggle needed.

## What this kills

- "Tap screen every 30 seconds" UX in recipe apps
- Custom hacks like `<video>` autoplay loops to keep the screen on
- Long-running tutorials that lose user mid-step

When a wake-lock is the right tool, it's invisible — users just notice their screen no longer dimming during the task. That's the win.

---

Practice JS event handling in the [`js-events`](/js-events/0/) module on [Code Crispies](/).
