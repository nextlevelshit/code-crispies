---
title: "Media Session API — Lock-Screen Controls for Web Audio + Video"
description: "Make your podcast / music / video player look native in OS media controls. Two API calls, full lock-screen + Bluetooth-button integration."
date: 2026-05-10
slug: media-session-api
tags: [javascript, ux]
---

When you press play/pause on Bluetooth headphones, the OS routes the keypress to "the app currently playing media." For native apps this is straightforward; for browser tabs it requires the Media Session API. Without it, your podcast site goes silent the moment the user locks their phone. With it, it looks indistinguishable from Spotify on the lock screen.

## The basic setup

```js
if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Episode 42 — On Caching",
    artist: "Web Crispies Podcast",
    album: "Season 3",
    artwork: [
      { src: "/cover-96.png", sizes: "96x96", type: "image/png" },
      { src: "/cover-256.png", sizes: "256x256", type: "image/png" },
      { src: "/cover-512.png", sizes: "512x512", type: "image/png" }
    ]
  });
}
```

That's it. As soon as a `<video>` or `<audio>` element on the page starts playing, the OS picks up the metadata and shows it in:
- Lock screen (iOS, Android)
- Notification shade media widget (Android)
- Now Playing in macOS Control Center
- Volume overlay HUD on most platforms

## Action handlers

```js
navigator.mediaSession.setActionHandler("play", () => audio.play());
navigator.mediaSession.setActionHandler("pause", () => audio.pause());
navigator.mediaSession.setActionHandler("previoustrack", () => skipToPrevious());
navigator.mediaSession.setActionHandler("nexttrack", () => skipToNext());
navigator.mediaSession.setActionHandler("seekbackward", (details) => {
  audio.currentTime -= details.seekOffset || 10;
});
navigator.mediaSession.setActionHandler("seekforward", (details) => {
  audio.currentTime += details.seekOffset || 10;
});
navigator.mediaSession.setActionHandler("seekto", (details) => {
  audio.currentTime = details.seekTime;
});
```

Each handler corresponds to a control surface: lock-screen buttons, hardware media keys, Bluetooth headphones, smart-watches, voice assistants ("Hey Siri, skip this track").

## Position state for accurate scrubbing

```js
audio.addEventListener("timeupdate", () => {
  navigator.mediaSession.setPositionState({
    duration: audio.duration,
    playbackRate: audio.playbackRate,
    position: audio.currentTime
  });
});
```

Without this, the lock-screen scrubber shows a generic progress (or nothing). With it, the scrubber accurately reflects current position + duration, AND seeking from the lock screen calls your `seekto` handler.

## Full minimal podcast player

```js
function setupMedia(episode) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: episode.title,
    artist: "Web Crispies",
    artwork: [
      { src: episode.cover, sizes: "512x512", type: "image/png" }
    ]
  });

  const handlers = {
    play: () => audio.play(),
    pause: () => audio.pause(),
    previoustrack: () => loadEpisode(episode.prev),
    nexttrack: () => loadEpisode(episode.next),
    seekbackward: (e) => audio.currentTime -= (e.seekOffset || 15),
    seekforward: (e) => audio.currentTime += (e.seekOffset || 30),
    seekto: (e) => audio.currentTime = e.seekTime
  };
  for (const [action, handler] of Object.entries(handlers)) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (e) {
      // Browser may not support all actions
    }
  }

  audio.addEventListener("playing", () => {
    navigator.mediaSession.playbackState = "playing";
  });
  audio.addEventListener("pause", () => {
    navigator.mediaSession.playbackState = "paused";
  });
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime
      });
    }
  });
}
```

That's a complete podcast player with full OS integration.

## Why this matters

Without Media Session:
- Lock the phone → audio plays for ~30s, then OS suspends background tabs
- Play/pause buttons on headphones do nothing for the tab
- Lock screen shows generic "browser is playing media"
- User has to unlock + return to tab to control playback
- Bluetooth-car interfaces show nothing

With Media Session:
- Audio survives lock-screen indefinitely
- Headphone buttons work
- Lock screen shows artwork, title, full controls
- Car infotainment shows your podcast as native
- Voice assistants integrate ("hey Siri, pause")

## Browser support

- Chrome / Edge 73+ (March 2019)
- Safari 15+ (September 2021)
- Firefox 82+ (October 2020)
- Universal in 2025+

Per-action support varies (Safari + Firefox don't all support `seekto`); the `try/catch` per `setActionHandler` is intentional.

## When it's worth wiring

- **Podcast / music players** — table stakes; users expect lock-screen controls
- **Video players** — same; bonus is play/pause from car interfaces
- **Live audio** (radio streams) — at minimum metadata + play/pause
- **Audiobook readers**

## When it's overkill

- **Auto-playing background music on a marketing site** — the user didn't opt in to media-session controls; respects them less than they'd like
- **UI sound effects** — short bleeps don't need lock-screen entries
- **Video previews** (auto-pausing when scrolled away) — same

## The ~5-minute integration tax

For any audio/video app, this is the highest-value 5-minute change you can ship. The user experience difference is enormous; the code is short. Most apps skip it because they don't know the API exists.

---

Practice DOM + events in the [`js-events`](/js-events/0/) module on [Code Crispies](/) — covers the patterns the audio element listeners use.
