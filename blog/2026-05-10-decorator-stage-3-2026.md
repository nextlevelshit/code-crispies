---
title: "JS Decorators in 2026 — Stage 3, Shipping, Worth Using"
description: "Decorators are TC39 Stage 3, shipping in browsers and TypeScript. The new spec is cleaner than the legacy proposal — and finally usable for everyday code."
date: 2026-05-10
slug: decorator-stage-3-2026
tags: [javascript, architecture]
---

JavaScript decorators have been "almost ready" since 2014. Three rewrites, one TypeScript-only legacy implementation, and a long Stage 2 limbo later, the **2023 Stage 3 proposal** is the one that ships. Browsers are landing it, TypeScript 5+ supports it natively, and Babel implements it without flags. Here's the version that's actually arriving.

## The shape

```js
function logged(value, context) {
  if (context.kind === "method") {
    return function (...args) {
      console.log(`call ${context.name}`, args);
      return value.apply(this, args);
    };
  }
}

class Calculator {
  @logged
  add(a, b) {
    return a + b;
  }
}

new Calculator().add(2, 3);
// "call add [2, 3]"
// 5
```

A decorator is a **function** that receives the decorated value + a `context` object and optionally returns a replacement. Same for methods, accessors, fields, classes.

## The context object

The big change from legacy: decorators no longer mutate things. They get rich context and return what should replace the original.

```js
function autobind(value, context) {
  if (context.kind !== "method") return;
  // Initialize once per instance; bind the method to its instance.
  context.addInitializer(function () {
    this[context.name] = this[context.name].bind(this);
  });
}

class Component {
  @autobind
  handleClick() {
    console.log(this);  // always the Component instance
  }
}

const c = new Component();
button.addEventListener("click", c.handleClick);  // works, no .bind()
```

`context.addInitializer` runs in the constructor, ideal for instance-level setup.

## Class decorators

```js
function singleton(value, context) {
  if (context.kind !== "class") return;
  let instance = null;
  return new Proxy(value, {
    construct(target, args) {
      if (!instance) instance = Reflect.construct(target, args);
      return instance;
    }
  });
}

@singleton
class Database {
  constructor(url) { this.url = url; }
}

new Database("a") === new Database("b");  // true
```

Replaces the entire class. Useful for singletons, mixins, metadata registration.

## Field decorators

```js
function defaulted(value, context) {
  if (context.kind !== "field") return;
  return function (initialValue) {
    return initialValue === undefined ? value() : initialValue;
  };
}

class User {
  @defaulted name = "anonymous";
}

new User().name;  // "anonymous"
```

The decorator returns an **initializer transformer** — given the original value, return what to actually store.

## Accessor decorators (the hidden gem)

The new `accessor` keyword auto-generates getter/setter pairs over a private field:

```js
class Counter {
  accessor count = 0;
}

const c = new Counter();
c.count = 5;     // calls the auto-setter
console.log(c.count);  // calls the auto-getter
```

Decorators on accessors get `{get, set, init}`:

```js
function logged(value, context) {
  if (context.kind !== "accessor") return;
  return {
    get() {
      const v = value.get.call(this);
      console.log(`read ${context.name} = ${v}`);
      return v;
    },
    set(v) {
      console.log(`write ${context.name} = ${v}`);
      value.set.call(this, v);
    },
    init: value.init
  };
}

class Counter {
  @logged accessor count = 0;
}
```

Now every read/write of `count` is logged. Powerful for debugging, validation, MobX-style reactivity.

## Real example: simple validation

```js
function range(min, max) {
  return function (value, context) {
    if (context.kind !== "accessor") {
      throw new Error("@range only on accessors");
    }
    return {
      get: value.get,
      set(v) {
        if (v < min || v > max) {
          throw new RangeError(`${context.name}: ${v} not in [${min}, ${max}]`);
        }
        value.set.call(this, v);
      },
      init: value.init
    };
  };
}

class Volume {
  @range(0, 100) accessor level = 50;
}

const v = new Volume();
v.level = 80;    // OK
v.level = 200;   // RangeError
```

20 lines, no library, validates writes for the lifetime of every Volume instance.

## What changed from legacy

| Aspect              | Legacy (2014–2022)                      | Stage 3 (2023+)              |
|---------------------|------------------------------------------|------------------------------|
| Argument shape      | `(target, key, descriptor)`              | `(value, context)`           |
| Mutation            | Mutates the descriptor                   | Returns replacement          |
| Field decorators    | Limited; emit-decorator-metadata flag    | First-class                  |
| Class decorators    | Returns new class                        | Returns new class            |
| TypeScript flag     | `experimentalDecorators: true`           | None — built in              |
| Cross-implementation| TypeScript-only effectively              | Browsers + TS + Babel align  |

Code written for legacy decorators DOESN'T work on Stage 3 — different argument shape. Migration is mechanical (write the new function signature) but not zero.

## Common patterns

```js
// Memoize method results
function memoize(value, context) {
  if (context.kind !== "method") return;
  const cache = new WeakMap();
  return function (...args) {
    const key = JSON.stringify(args);
    let r = cache.get(this);
    if (!r) { r = new Map(); cache.set(this, r); }
    if (!r.has(key)) r.set(key, value.apply(this, args));
    return r.get(key);
  };
}

// Deprecation warning
function deprecated(message) {
  return function (value, context) {
    return function (...args) {
      console.warn(`@deprecated ${context.name}: ${message}`);
      return value.apply(this, args);
    };
  };
}

// Read-only field
function readonly(value, context) {
  if (context.kind === "field") {
    return function (init) {
      Object.defineProperty(this, context.name, {
        value: init, writable: false, enumerable: true
      });
      return init;
    };
  }
}
```

## When to reach for them

- **Instrumentation** — logging, tracing, performance
- **Validation** — guards on accessor sets
- **DI / IoC** — annotation-based registration
- **State management** — MobX-style reactive accessors
- **ORM / serialization** — annotate fields for DB mapping

## When NOT

- **One-off transformations** — write a function, not a decorator
- **Cross-cutting concerns better handled by Proxies** — decorators are class-bound; Proxy works on any object
- **Performance-critical hot loops** — every decorated method has indirection cost

## Browser support

- Chrome / Edge 124+ (April 2024)
- Safari 17+ (September 2023)
- Firefox: in development as of 2026

For older browsers + TypeScript: TS 5.0+ (`tsconfig.json`: no `experimentalDecorators` flag → uses Stage 3).

For Babel: `@babel/plugin-proposal-decorators` with `version: "2023-05"`.

## What this changes

For library authors: a path off the legacy decorator dependency. For app authors: validation + memoization + logging in a syntactically light way that the language standardized. For TypeScript users: one less "experimental" flag in tsconfig.

The decade-long wait for "real" JS decorators is over. The 2023 spec is what shipped.

---

Practice JavaScript fundamentals in the [`js-variables`](/js-variables/0/) module on [Code Crispies](/) — covers `class` syntax + methods.
