---
title: "The Web Crypto API in 2026 — Modern Recipes for Hashing, Signing, Encrypting"
description: "Don't import crypto-js. The browser ships AES-GCM, HMAC, ECDSA, Argon2, Ed25519. Here's the actually-modern recipe set."
date: 2026-05-10
slug: web-crypto-modern
tags: [javascript, security]
---

The most-downloaded "crypto for browser" library on npm is **crypto-js**, last updated in 2023, ~50 KB. It's slower, less secure, and unnecessarily large. Web Crypto is in every modern browser, runs in the C++ implementation, and covers hashing, HMAC, signing, encrypting, and key derivation in primitives that match server-side libraries (Node, Go, Rust).

Below: the recipes worth knowing. All examples use `crypto.subtle` (the async namespace).

## SHA-256 hash

```js
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

await sha256("hello");
// "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
```

`SHA-256`, `SHA-384`, `SHA-512`, and `SHA-1` (legacy) all available. Avoid SHA-1 except for compatibility.

## HMAC (signing a string with a secret)

```js
async function hmacSHA256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

await hmacSHA256("hello world", "my-secret");
```

Used for webhook signature verification (Stripe, GitHub), API request signing (AWS-style), CSRF tokens.

## Symmetric encryption: AES-GCM

```js
async function encrypt(plaintext, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  // Concat iv + ciphertext for storage (12 bytes IV prefix)
  const out = new Uint8Array(iv.length + ct.byteLength);
  out.set(iv);
  out.set(new Uint8Array(ct), iv.length);
  return out;  // Uint8Array — base64 if you need to store as string
}

async function decrypt(payload, key) {
  const iv = payload.slice(0, 12);
  const ct = payload.slice(12);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(pt);
}

// Generate a key (do this once, persist):
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);
```

AES-GCM is **authenticated encryption** — it detects tampering. Always use `getRandomValues` for the IV; never reuse an IV with the same key.

## Asymmetric: ECDSA (signing tokens)

```js
const keypair = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["sign", "verify"]
);

const data = new TextEncoder().encode("payload");
const sig = await crypto.subtle.sign(
  { name: "ECDSA", hash: "SHA-256" },
  keypair.privateKey,
  data
);

const valid = await crypto.subtle.verify(
  { name: "ECDSA", hash: "SHA-256" },
  keypair.publicKey,
  sig,
  data
);
// true
```

Used for JWT-like tokens, OAuth 2.0 client assertions, anywhere you need "this came from me, prove it cryptographically."

## Ed25519 (modern signing — preferred)

```js
const keypair = await crypto.subtle.generateKey(
  { name: "Ed25519" },  // no curve param needed
  true,
  ["sign", "verify"]
);

const sig = await crypto.subtle.sign("Ed25519", keypair.privateKey, data);
const valid = await crypto.subtle.verify("Ed25519", keypair.publicKey, sig, data);
```

Faster than ECDSA, smaller signatures (64 bytes vs 70-72), no random nonce needed (deterministic). **Prefer Ed25519 for new code.**

## Key derivation: PBKDF2

For deriving an encryption key from a user password:

```js
async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 600000,  // OWASP 2023 minimum
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await deriveKey("user-password", salt);
```

600k iterations = ~500ms on a 2024 laptop. Slow on purpose — that's the whole point of password-based key derivation.

## Argon2 — when shipping in 2026?

Argon2id is the modern best practice for password hashing (winner of the Password Hashing Competition). **Web Crypto doesn't support it natively** as of 2026. Until it does, use a WASM implementation:

```js
import argon2 from "argon2-browser";

const hash = await argon2.hash({
  pass: "user-password",
  salt: crypto.getRandomValues(new Uint8Array(16)),
  type: argon2.ArgonType.Argon2id,
  mem: 65536,    // 64 MB
  time: 3,
  parallelism: 1
});
```

`argon2-browser` is ~30 KB WASM. Worth it if password hashing is critical (auth servers should NOT do this client-side anyway, but client-side master-password unlock is a valid pattern).

## Generating random tokens

```js
function randomToken(bytes = 16) {
  const buf = crypto.getRandomValues(new Uint8Array(bytes));
  return [...buf].map(b => b.toString(16).padStart(2, "0")).join("");
}

randomToken();  // "a3f2c8b9d4e1f6c7a8b2d3e4f5a6b7c8" (32 hex chars = 128 bits entropy)
```

Cryptographically random. NEVER use `Math.random()` for security.

## What you should NOT do client-side

- **Hash user passwords for storage.** That's the server's job. Client-side hashing leaks the salt and lets attackers compare hashes directly.
- **Store long-term private keys in localStorage.** XSS reads it. Use `IndexedDB` with `extractable: false` keys + WebAuthn for hardware-backed.
- **Roll your own crypto protocols.** "I'll just XOR with a secret" — please don't.
- **Use AES-CBC for new code.** Use AES-GCM (authenticated). CBC requires careful padding handling.

## When to skip Web Crypto

- **You don't need crypto.** Don't add it because it sounds smart.
- **Pre-2018 browsers.** Use the polyfill (asmcrypto.js) — but those browsers are <0.1% of traffic.
- **Workloads that need WASM-SIMD speed** (bulk operations on huge inputs) — Web Crypto is async per call; WASM can be tighter loops.

## Bundle impact

| Library            | Bundle | Speed    | Modern algorithms |
|--------------------|--------|----------|-------------------|
| crypto-js          | ~50 KB | slow (JS) | partial            |
| **Web Crypto API** | **0 KB** | fast (native) | full              |
| @noble/secp256k1   | 20 KB  | fast     | crypto-currency only |
| sjcl               | 30 KB  | medium   | older algorithms   |

Switching from crypto-js to Web Crypto: **-50 KB bundle, faster execution, more secure defaults**.

## Browser support

- AES-GCM, SHA-*, HMAC, ECDSA: universal since 2018
- Ed25519: Chrome 113+ (May 2023), Safari 17+, Firefox 130+
- ECDH: universal

For Ed25519 fallback in older browsers, use ECDSA with P-256.

## What this changes

If your app imports crypto-js for hashing or token signing, replace it. The recipes above are smaller, faster, and align with what your backend uses. Browser-side crypto is no longer a "library decision" — it's a platform feature.

---

Practice JS variables and async patterns in the [`js-variables`](/js-variables/0/) and [`js-events`](/js-events/0/) modules on [Code Crispies](/).
