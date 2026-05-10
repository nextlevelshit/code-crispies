---
title: "Intl.Segmenter — String.split Was Wrong, Here's the Fix"
description: "Counting characters with .length lies on emoji, accents, CJK, and grapheme clusters. Intl.Segmenter is the platform's text-aware segmentation API."
date: 2026-05-10
slug: intl-segmenter
tags: [javascript, typography]
---

```js
"👨‍👩‍👧".length;  // 8
"naïve".split("");  // ["n", "a", "i", "̈", "v", "e"] — accent split off
"今日は".split(/\s/);  // ["今日は"] — no spaces between Japanese sentences
```

JavaScript strings are UTF-16 code units. **One visible character ≠ one code unit.** This breaks `.length`, `.split("")`, character counting, truncation, search, line-breaking. `Intl.Segmenter` is the spec-compliant replacement.

## Counting graphemes, not code units

```js
const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
[...seg.segment("👨‍👩‍👧")].length;  // 1 — one family emoji
[...seg.segment("naïve")].length;    // 5 — n, a, ï, v, e (composed correctly)
```

A grapheme is "one user-perceived character." Family emoji = 1. Combined accent = 1. Tonal mark over Vietnamese = 1.

## Truncating without breaking emoji

The classic "first 40 chars" naive code:

```js
text.slice(0, 40);  // can split a multi-code-unit char in half
```

Correct version:

```js
function truncate(text, n) {
  const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
  const out = [];
  for (const { segment } of seg.segment(text)) {
    if (out.length >= n) break;
    out.push(segment);
  }
  return out.join("");
}

truncate("Hello 👨‍👩‍👧 family", 8);  // "Hello 👨‍👩‍👧" — emoji intact
```

Never splits a code-unit pair. Never breaks ZWJ-joined emoji.

## Word segmentation (real word boundaries)

`text.split(/\s+/)` works for English/French. It fails for:

- **Japanese / Chinese / Thai** — no spaces between words
- **Arabic** — words separated by spaces but compound forms tricky
- **English contractions** — "don't" should be one or two words depending on use case

```js
const seg = new Intl.Segmenter("ja", { granularity: "word" });
[...seg.segment("今日は良い天気ですね")].filter(s => s.isWordLike).map(s => s.segment);
// ["今日", "は", "良い", "天気", "です", "ね"]
```

The browser uses the locale-specific dictionary. Japanese Mecab-style segmentation, Thai dictionary-based, English standard tokenization — all built in.

## Line breaking

For wrapping text yourself (canvas rendering, custom controls):

```js
const seg = new Intl.Segmenter("en", { granularity: "sentence" });
const sentences = [...seg.segment(longText)].map(s => s.segment);
```

Granularity options: `grapheme | word | sentence`.

Browsers natively use the same algorithm for `text-wrap: balance` and accessibility tools — so when you implement custom line breaking with `Intl.Segmenter`, you match what the browser does for native text.

## Real example: emoji-safe character counter

The "tweet still has 73 characters" UI:

```js
function characterCounter(text, max = 280) {
  const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
  const used = [...seg.segment(text)].length;
  return { used, remaining: max - used, valid: used <= max };
}

characterCounter("Hello 👨‍👩‍👧!");  // { used: 8, remaining: 272, valid: true }
```

Twitter/X's API counts the same way. Naive `.length` would say 14 and reject submissions that should pass.

## Fuzzy search with locale-aware boundaries

```js
function findWord(text, query, locale = "en") {
  const seg = new Intl.Segmenter(locale, { granularity: "word" });
  const words = [...seg.segment(text)]
    .filter(s => s.isWordLike)
    .map(s => s.segment.toLowerCase());
  return words.includes(query.toLowerCase());
}

findWord("the quick brown fox", "fox");        // true
findWord("今日は良い天気ですね", "良い", "ja");  // true (segments correctly)
```

Works across locales without per-language word-split logic.

## Combine with String.prototype.normalize

Some characters have multiple Unicode representations:

```js
"é" === "é";  // false sometimes (one is composed, one is decomposed)

const a = "é".normalize("NFC");
const b = "é".normalize("NFC");
a === b;  // true

[...new Intl.Segmenter("en").segment(a)].length;  // 1
```

Always normalize before segmenting if input might come from multiple sources (paste from email, OCR output, mixed inputs).

## Performance note

`Intl.Segmenter` is implemented in C++ in the browser — it's fast. The cost is the iterator allocation:

```js
// Slow if called per keystroke on a long text:
[...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)];

// Faster: reuse the segmenter
const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
function count(text) { return [...seg.segment(text)].length; }
```

Cache the `Segmenter` instance globally; only the iteration is per-call.

## Browser support

- Chrome / Edge 87+ (December 2020)
- Safari 14.1+ (April 2021)
- Firefox 125+ (April 2024 — late but landed)

Universal in 2025. For older Firefox, polyfill exists (`@formatjs/intl-segmenter`).

## What this kills

- `String.prototype.length` for "how many characters" — wrong by default for emoji and combined chars
- `text.split("")` for grapheme iteration — wrong same way
- Per-language word-splitting libraries — replaced by one locale-aware API
- `.split(/\s+/)` for languages without spaces

## What it doesn't do

- **Character-by-character UTF-8 byte iteration** — that's `TextEncoder`, different concern
- **Pinyin / romanization** — that's `Intl.NumberFormat` for digits, but text romanization needs a library
- **Hyphenation** — separate spec (`hyphens: auto` in CSS, no JS API)

## The headline

Every "count characters" code path you've ever written is wrong by default for international text. `Intl.Segmenter` is the one-line fix — write it once, get correct behavior for English, Japanese, Hindi, Arabic, and emoji. The platform finally caught up to what users actually type.

---

Practice JS basics in the [`js-variables`](/js-variables/0/) module on [Code Crispies](/) — covers strings + iteration patterns.
