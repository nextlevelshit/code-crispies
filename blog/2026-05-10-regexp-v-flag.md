---
title: "RegExp /v Flag — Set Operations + Better Unicode in One Toggle"
description: "The /v flag fixes the broken parts of /u, adds set operations on character classes, and lets you match Unicode properties without escape gymnastics."
date: 2026-05-10
slug: regexp-v-flag
tags: [javascript]
---

JavaScript's `/u` flag (unicode regex, ES2015) was a half-step. It fixed surrogate-pair handling but broke common patterns and didn't add set operations. The `/v` flag (ES2024) is the do-over: superset of `/u`, adds `\p{...}` property matching, and lets you write set intersection / difference / union on character classes.

## What `/v` enables that `/u` doesn't

```js
// /u: can't use unicode property escapes in character classes meaningfully
/[\p{Letter}]/u.test("café");  // works for the simple case

// /v: set operations + multi-char property matches
/[\p{Letter}--[abc]]/v.test("café");  // any letter EXCEPT a, b, c
/[\p{Decimal_Number}&&\p{ASCII}]/v.test("9");  // ASCII digits only (intersection)
/[\p{Script=Cyrillic}\p{Script=Greek}]/v.test("Ω");  // Cyrillic OR Greek (union)
```

`--` (difference), `&&` (intersection), implicit (union) — set algebra inside character classes.

## Real example: emoji-aware regex

```js
// /u: \p{Emoji} matches single code-point emoji; misses ZWJ sequences
/\p{Emoji}/u.test("👨‍👩‍👧");  // true (matches just one part)
"👨‍👩‍👧".match(/\p{Emoji}/gu);  // ["👨", "👩", "👧"] — wrong

// /v: \p{RGI_Emoji} matches the full grapheme cluster
"👨‍👩‍👧".match(/\p{RGI_Emoji}/gv);  // ["👨‍👩‍👧"] — correct
```

`\p{RGI_Emoji}` is one of several **multi-code-point properties** that only work under `/v`. Use it whenever you need to match emoji as users see them.

## String literal classes: \q{...}

```js
const fruits = /[\q{apple|banana|cherry}]/v;
fruits.test("apple");   // true
fruits.test("banana");  // true
fruits.test("appl");    // false
```

`\q{}` matches one of the listed strings as a unit. Combine with set operations:

```js
const colors = /[\q{red|green|blue}]/v;
const primaries = /[\q{red|yellow|blue}]/v;
const both = /[\q{red|green|blue}&&\q{red|yellow|blue}]/v;  // matches "red" only
```

This was impossible in standard regex before `/v` — you'd need `(red|green|blue)` alternation outside a character class, with no clean way to intersect.

## Difference: subtract a set

```js
// All Latin letters except vowels
const consonants = /[\p{Script=Latin}--[aeiouAEIOU]]/v;

"hello".replace(consonants, "*");
// "*e**o"
```

Or "any letter except numbers":

```js
const letterNotNumber = /[\p{L}--\p{N}]/v;  // L = Letter, N = Number
```

## Why this matters for input validation

Email parsing, password rules, identifier validation — all became easier:

```js
// Identifier: letters + digits + underscore, but NO emoji or symbols
const validId = /^[\p{ID_Continue}--\p{Emoji}]+$/v;

// Password requires at least one letter and one digit, no whitespace
const validPassword = /^(?=.*\p{L})(?=.*\p{Nd})[\p{L}\p{Nd}\p{P}]+$/v;
```

Older code would build these with chained character classes + lookaheads + per-locale workarounds. `/v` makes them direct.

## Backwards compatibility

`/v` is a **superset** of `/u`. Anything that works with `/u` works with `/v`, with one exception: certain malformed character class characters now throw at parse time (good — caught earlier).

```js
// /u: silently allowed
/[a-z\p{L}]/u;

// /v: same, fine
/[a-z\p{L}]/v;

// /u: silently allowed
/[ab[cd]]/u;

// /v: SyntaxError — nested brackets must use set notation
/[ab[cd]]/v;  // SyntaxError
// Use:
/[[ab][cd]]/v;  // explicit (and equivalent to [abcd])
```

Migration path: change `u` → `v`, fix any syntax errors that surface (usually 1-2 per file).

## When to skip `/v`

- **Old-runtime targets** (Node 18-, Safari 16-): use `/u` + character-class escapes
- **Patterns that don't touch Unicode** — `/^\d+$/` works fine without any flag
- **Source-text linting** — older ESLint versions don't parse `/v`; bump first

## Browser support

- Chrome / Edge 112+ (April 2023)
- Safari 17+ (September 2023)
- Firefox 116+ (August 2023)

Universal in 2024+. Node.js 20+.

## Polyfills

There's no real polyfill (the parser is a parser change). `regexpu-core` can transpile some `/v` patterns to `/u`-compatible code at build time.

## What this kills

- Multi-step text classifiers ("strip non-alphanumeric, then check emoji separately")
- Hand-maintained whitelist regexes for international characters
- Comments explaining why a regex is incomplete for non-Latin scripts
- Most uses of `Intl.Segmenter` for "is this a single grapheme" — `/^\X$/v` (or `\p{RGI_Emoji}`) handles it

## What it enables

- One-line emoji-correct text manipulation
- Locale-correct identifier validation in a single regex
- Composable character classes that read like English ("letters except vowels")

The pre-2024 workarounds for "regex is bad with Unicode" are gone. Switch the flag, fix the rare syntax error, ship correct internationalization.

---

Practice JS basics in the [`js-variables`](/js-variables/0/) module on [Code Crispies](/) — covers strings + RegExp basics.
