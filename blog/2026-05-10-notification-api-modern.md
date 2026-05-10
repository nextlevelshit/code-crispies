---
title: "Web Notifications in 2026 — When to Use, When to Avoid"
description: "The Notification API is universally supported. The hard part isn't the code; it's earning permission and not getting blocked."
date: 2026-05-10
slug: notification-api-modern
tags: [javascript, ux]
---

The Notification API has been in browsers since 2014. Every guide shows the same 5 lines of code. None tell you that **most users block notifications instantly** and Chrome ranks sites that ask poorly. The code is trivial; the deployment strategy is what matters.

## The 5 lines

```js
const permission = await Notification.requestPermission();
if (permission === "granted") {
  new Notification("Hello", {
    body: "From the browser",
    icon: "/icon-192.png"
  });
}
```

That's the whole API surface for sending. Three permission states: `default` (not asked yet), `granted`, `denied`.

## The trap: requesting too eagerly

If your site calls `Notification.requestPermission()` on page load, **Chrome blocks the prompt entirely** as of 2020+. The user never sees it. You're banned from notifications for that session.

Trigger the request only after a user gesture (click, form submit) AND tied to a clear value:

```js
// Bad
window.addEventListener("load", () => Notification.requestPermission());

// Bad
document.body.addEventListener("click", () => Notification.requestPermission());

// Good
saveButton.addEventListener("click", async () => {
  await saveData();
  if (userOptedInToReminders) {
    const p = await Notification.requestPermission();
    if (p === "granted") scheduleReminder();
  }
});
```

## Pre-prompt before the real prompt

Best practice in 2026: show a custom in-page UI explaining WHY notifications matter, with an "Enable" button. Only when the user clicks Enable do you call the real API. Two benefits:

1. Native dialog only fires when user already chose yes — high acceptance rate
2. If user dismisses your custom UI, you don't burn the one chance to ask

```html
<dialog id="notif-pre-prompt">
  <h2>Want a reminder when your build finishes?</h2>
  <p>We'll ping you once when the deploy completes. Nothing else.</p>
  <button id="notif-yes">Enable</button>
  <button id="notif-no">Not now</button>
</dialog>
```

```js
notifYes.addEventListener("click", async () => {
  notifPrePrompt.close();
  const p = await Notification.requestPermission();
  if (p === "granted") {
    saveSetting("notifications", true);
  }
});
```

## Push notifications (when tab is closed)

Plain `Notification` only fires while a tab is open. For background pushes (server → user when app isn't running), combine with Service Worker + Push API:

```js
// In your main app
const reg = await navigator.serviceWorker.register("/sw.js");
const sub = await reg.pushManager.subscribe({
  userVisibleOnly: true,  // browser requirement
  applicationServerKey: VAPID_PUBLIC_KEY
});

// Send `sub` (PushSubscription endpoint + keys) to your server
await fetch("/api/subscribe", {
  method: "POST",
  body: JSON.stringify(sub)
});
```

```js
// In sw.js
self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      data: { url: data.url }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

Server side: VAPID keys + a library like `web-push` (Node) signs requests to the browser's push gateway. Free; no Apple-style $99/yr cost.

## What you can't do (anymore)

Modern browsers limit:
- **No silent notifications** — Chrome 120+ requires user-visible content
- **No notification spam** — too-frequent notifications get throttled, then blocked permanently
- **No marketing notifications without explicit opt-in** — abuse triggers Safe Browsing flags
- **No `requireInteraction: true`** without a real reason — flagged by audits

## When notifications make sense

- **Build/deploy completion** — user kicked off a long-running task
- **Real-time chat / message arrival**
- **Calendar reminders the user explicitly asked for**
- **Critical state changes** in dashboards (system down, payment failed)

## When NOT

- **Marketing, "we miss you", re-engagement** — guarantees instant ban
- **Comment activity on social-style sites** — better as in-app badges
- **Anything the user could equally see by checking the tab** — wasted permission

## Browser support

- `Notification` API: universal since 2015
- Push API + ServiceWorkerRegistration.showNotification: universal since 2018 except iOS Safari (added 2023, requires PWA install)
- iOS Safari quirk: only works on installed PWAs (Add to Home Screen)

## Permission audits

Chrome DevTools → Application → Service Workers → Push button. Browsers are increasingly logging permission abuse. Lighthouse has a "Manifest" + "Permissions" check.

## What this changes

Notifications work, but the surface for legitimate use is narrow. Treat the permission as a one-shot resource — once denied, you can't ask again for that origin. Pre-prompt UI + clear value proposition is the difference between 60% acceptance and 5%.

---

Practice JS basics in the [`js-events`](/js-events/0/) module on [Code Crispies](/) — covers `addEventListener` patterns you'll need for click → request flows.
