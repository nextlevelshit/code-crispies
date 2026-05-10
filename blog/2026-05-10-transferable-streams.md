---
title: "Transferable Streams — Move Bytes Between Workers Without Copying"
description: "Sending large data between main thread and Web Workers used to mean structured-clone copies. Transferable Streams move ownership instead — zero-copy, backpressure included."
date: 2026-05-10
slug: transferable-streams
tags: [javascript, performance, workers]
---

The reason most apps hit the main thread instead of using a Web Worker isn't ignorance — it's that `postMessage` copies everything that crosses the worker boundary. A 10 MB JSON payload becomes a 10 MB structured-clone, then 10 MB again on the other side. Transferable Streams replace the copy with ownership transfer. Zero-copy, with built-in backpressure.

## The basic problem

```js
// Main thread: send a big chunk to a worker
const big = new Uint8Array(10_000_000);  // 10MB
worker.postMessage(big);                  // 10MB copied
```

`postMessage` clones the data. The worker gets its own copy; the main thread keeps its copy too. RAM doubles. CPU pays the marshal cost. For a one-shot call it's tolerable; for a streaming pipeline it's a disaster.

## Transferable: just move it

```js
worker.postMessage(big, [big.buffer]);   // ownership transfers, no copy
console.log(big.byteLength);              // 0 — main thread no longer owns it
```

The second argument lists *transferable* objects. The browser hands ownership to the worker, the main thread's reference becomes empty. Zero copy. This works for `ArrayBuffer`, `MessagePort`, `ImageBitmap`, `OffscreenCanvas`, and now — **streams**.

## Transferable Streams

```js
// Main thread
const response = await fetch("/api/large-csv");
worker.postMessage({ stream: response.body }, [response.body]);

// Worker
self.onmessage = async (e) => {
  const reader = e.data.stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    processChunk(value);  // worker handles parsing
  }
};
```

The worker now reads the response stream directly. The main thread never touches the bytes. Network bytes flow straight from the network stack to the worker's parser.

## Backpressure for free

Streams have built-in backpressure: the producer slows down when the consumer can't keep up. Transferred to a worker, this still works:

```js
// Worker
const reader = stream.getReader();

async function process() {
  const { done, value } = await reader.read();
  if (done) return;
  
  await heavyParseOperation(value);  // takes 200ms
  
  process();  // pull next chunk only after this one finishes
}

process();
```

While the worker is parsing, the network stack pauses receiving more data. RAM stays bounded.

Compare with `postMessage`-per-chunk:

```js
// Bad: no backpressure
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  worker.postMessage(value, [value.buffer]);  // queue grows unbounded
}
```

The worker's message queue can balloon — if the worker is slow, megabytes pile up in the queue.

## A real pipeline: parse + transform + render

```js
// Main thread
const csvResponse = await fetch("/data/big.csv");
const decoder = new TextDecoderStream();
const lineSplitter = new TransformStream({ /* split on \n */ });

// Pipe network → decoder → splitter, transfer to worker
const lineStream = csvResponse.body
  .pipeThrough(decoder)
  .pipeThrough(lineSplitter);

worker.postMessage({ lines: lineStream }, [lineStream]);
```

The worker receives a transformed stream of lines. The main thread did the wiring; the worker does the heavy parsing; the network is the single source of bytes.

## OffscreenCanvas + transferable streams

For image/video pipelines, combine streams with OffscreenCanvas:

```js
const canvas = document.querySelector("canvas");
const offscreen = canvas.transferControlToOffscreen();
const videoStream = videoElement.captureStream();

worker.postMessage({
  canvas: offscreen,
  video: videoStream
}, [offscreen, videoStream]);
```

Worker reads frames from the video stream and renders into the canvas. Main thread is free for input handling.

## When NOT to transfer

- **You still need the data on the main thread.** Transfer empties the source. If you need both copies, just clone.
- **Tiny payloads** (< 100 KB). The marshaling cost is fine.
- **Synchronous code paths** that don't benefit from concurrency.

## SharedArrayBuffer when transfer isn't enough

If you need the *same* memory readable from both threads concurrently:

```js
const sab = new SharedArrayBuffer(1024);
worker.postMessage({ buffer: sab });

// Both threads see the same memory.
const view1 = new Int32Array(sab);  // main thread
// In worker:
const view2 = new Int32Array(e.data.buffer);
Atomics.store(view2, 0, 42);  // main thread sees 42 instantly
```

Cross-origin isolation required (`Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp`). Necessary for true parallel computation (game loops, image processing).

## Browser support

- `ArrayBuffer` transfer: universal since 2018
- `MessagePort` transfer: universal since 2018
- **Transferable Streams**: Chrome 87+, Safari 16.4+, Firefox 110+
- **OffscreenCanvas**: Chrome 69+, Safari 16.4+, Firefox 105+
- **SharedArrayBuffer**: requires COOP/COEP headers; universal under those conditions

## What this enables

- **Real worker pipelines** for CSV/JSON/binary parsing without copy overhead
- **Background image processing** (resize, filter) on uploaded files
- **WebAssembly + Worker** combinations for codecs/compression
- **Idle-time computation** that doesn't block input handling

## What this kills

- Excuses for keeping CPU-heavy work on the main thread
- The "but copying is too expensive" objection to web workers
- Manual chunked-postMessage patterns

If you've been avoiding workers because of copy cost, that excuse is gone.

---

Practice JavaScript fundamentals in the [`js-variables`](/js-variables/0/) and [`js-events`](/js-events/0/) modules on [Code Crispies](/).
