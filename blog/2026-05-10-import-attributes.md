---
title: "Import Attributes — JSON, CSS, and WASM Modules Land Natively"
description: "Import attributes (formerly assertions) let you import JSON, CSS, and WASM as ES modules. The build step that did this is going away."
date: 2026-05-10
slug: import-attributes
tags: [javascript, architecture]
---

For most of the last decade, importing a JSON file in JavaScript meant `fetch()` + `await response.json()` or, with a bundler, a `import data from "./data.json"` line that the bundler quietly converted at build time. Same for CSS — bundler magic. **Import attributes** standardize this, removing the build-step requirement and giving you native module imports for non-JS resources.

## The basic syntax

```js
// JSON
import config from "./config.json" with { type: "json" };

// CSS (constructed stylesheet)
import styles from "./styles.css" with { type: "css" };

// WebAssembly
import wasm from "./module.wasm" with { type: "webassembly" };
```

The `with { type: "..." }` clause is the **import attribute**. It tells the runtime how to interpret the module, which the URL extension alone can't reliably indicate.

## JSON modules

```js
import packageInfo from "./package.json" with { type: "json" };
console.log(packageInfo.version);  // "1.2.3"
```

Properties:
- The default export is the parsed JSON value
- No named exports
- Module is fetched once + cached, like any ES module
- Errors at parse → ModuleEvaluationError, not silent

In the past:

```js
// Worked, but parsed every time, no module identity
const data = await fetch("./config.json").then(r => r.json());
```

Now: same data, but cached + import-graph-aware.

## CSS modules (constructed stylesheets)

```js
import myStyles from "./button.css" with { type: "css" };

document.adoptedStyleSheets.push(myStyles);
```

The default export is a `CSSStyleSheet` object. Adopt into the main document or any shadow root. Pairs perfectly with custom elements:

```js
import buttonStyles from "./button.css" with { type: "css" };

class MyButton extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [buttonStyles];
    root.innerHTML = `<button><slot></slot></button>`;
  }
}
```

The same `buttonStyles` object can be adopted into many shadow roots — **shared sheet, single parse**, instant style application.

## Dynamic imports too

```js
const config = await import("./config.json", { with: { type: "json" } });
console.log(config.default.version);
```

Note the wrapper: dynamic `import()` takes options as the second argument; static `import` uses the inline `with` clause.

## Use cases that get cleaner

### i18n / locale loading

```js
const locale = navigator.language.split("-")[0];
const messages = await import(`./locales/${locale}.json`, { with: { type: "json" } });
applyTranslations(messages.default);
```

No fetch boilerplate, no parse errors hidden in promise chains. Module-graph-aware so dev tools can preload.

### Component-scoped CSS

```js
import dialogStyles from "./dialog.css" with { type: "css" };
import buttonStyles from "./button.css" with { type: "css" };

class Dialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).adoptedStyleSheets = [dialogStyles, buttonStyles];
  }
}
```

Each component declares its style dependencies as imports. Bundler-free style sharing.

### WASM as a first-class module

```js
import wasm from "./image-filter.wasm" with { type: "webassembly" };

const result = wasm.exports.filter(imageData);
```

Replaces the `WebAssembly.instantiateStreaming(fetch(url))` dance.

## What changed from `assert`

Earlier versions of the proposal used `assert`:

```js
import data from "./d.json" assert { type: "json" };  // OLD
import data from "./d.json" with { type: "json" };    // NEW (2024+)
```

The `assert` form was deprecated because semantically it implied "fail if this isn't JSON" — but the spec needed something that could **change** module loading behavior. `with` reads as instructions, not assertions. Migration is mechanical.

## Bundler interop

Modern bundlers (Vite, esbuild, Rollup, Webpack 5) all support `with { type: "json" }` natively in 2025+. Old code using bundler-specific `import "./styles.css"` (no attribute) still works thanks to bundler conventions, but mixing styles within the same project is messy. Pick one: native `with { type: "css" }` for new code, leave existing bundler-magic imports alone.

## What about TypeScript?

TS 5.3+ supports `with` clauses natively. For older TS, `assert` syntax still works (transpiles).

```ts
// tsconfig: "moduleResolution": "bundler", "target": "ES2024" or higher
import config from "./config.json" with { type: "json" };
```

TS types JSON files automatically — `config` gets inferred from the file's structure.

## When to skip

- **JSON that changes after page load**: still fetch — modules are cached
- **CSS you need to tweak at runtime** (theme variables): use CSSOM directly, not a static module
- **Large WASM modules** that benefit from streaming compilation: use `WebAssembly.instantiateStreaming` for the explicit Promise control

## Browser support

- JSON modules: Chrome 123+ (March 2024), Safari 17.4+, Firefox 138+ (Q1 2025)
- CSS modules: Chrome 123+, Safari 17.4+, Firefox: planned 2025
- WASM modules: behind flag in most browsers; spec finalizing
- `with` syntax: Chrome 123+, Safari 17.4+, Firefox 138+

For older browsers: bundler handles, or polyfill via dynamic import + fetch.

## What this changes

The build-step era of "treat JSON/CSS as a JS module" was a workaround for a missing platform feature. Native import attributes let you write the same code without a bundler — useful for:

- Deno / Bun runtime apps
- ES module CDN-served apps (esm.sh, jsdelivr)
- Browser-only experiments
- Service workers (which have limited bundler integration)

For typical bundled apps the daily-coding experience is the same. The shift is in what you're writing standardized vs bundler-specific.

---

Practice JavaScript fundamentals in the [`js-variables`](/js-variables/0/) module on [Code Crispies](/) — covers `import` / `export` syntax.
