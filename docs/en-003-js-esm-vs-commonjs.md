## Module System Fundamentals

**CommonJS** represents a synchronous, dynamic module loading paradigm designed for server environments where filesystem I/O is relatively fast. **ES Modules (ESM)** embody an asynchronous, static module system architected for both browser and server contexts with compile-time optimizations.

## Syntactic and Semantic Differences

**CommonJS** uses `require()` for imports and `module.exports`/`exports` for exports:
```javascript
// Dynamic import resolution
const dependency = require('./path/to/module');
// Export assignment
module.exports = { function: myFunction };
```

**ESM** employs declarative `import`/`export` statements:
```javascript
// Static import declaration
import { namedExport } from './module.js';
// Named export declaration
export const myFunction = () => {};
```

## Loading Semantics and Timing

The critical distinction lies in **when** module resolution occurs:

- **CommonJS**: Runtime module resolution with synchronous loading. The `require()` calls are evaluated during execution, enabling conditional imports and dynamic module paths.

- **ESM**: Parse-time static analysis with asynchronous loading. Import declarations are hoisted and resolved during the parsing phase, before code execution begins.

## Module Graph Construction

**CommonJS** builds its dependency graph dynamically through depth-first traversal during runtime execution. This creates a **mutable module namespace** where exports can be modified post-load.

**ESM** constructs a static module graph during the parsing phase through three distinct phases:
1. **Construction**: Parse modules and build dependency graph
2. **Instantiation**: Allocate memory for exports and create live bindings
3. **Evaluation**: Execute module code and populate exports

## Binding Semantics

This is where it gets spicy:

**CommonJS** creates **value copies** - when you import something, you get a snapshot of the exported value at that moment. Mutations to the original don't propagate.

**ESM** establishes **live bindings** - imports are read-only references to the actual exported values. Changes to exports are immediately visible to all importers.

## Circular Dependency Handling

**CommonJS** handles cycles through partial evaluation - modules return their current `exports` object even if not fully initialized, potentially causing undefined behavior.

**ESM** supports cycles through forward references in the instantiation phase, though accessing uninitialized bindings throws `ReferenceError`.

## Interoperability Challenges

The **dual module hazard** emerges when the same package exists in both formats simultaneously, potentially creating separate instances and breaking singleton patterns. Node.js addresses this through:

- **Conditional exports** in package.json
- **ESM wrapper patterns** for CommonJS modules
- **Dynamic import()** for loading CommonJS from ESM contexts

## Performance Implications

**ESM's** static analysis enables superior **tree-shaking** (dead code elimination) and **bundler optimizations**. The upfront parsing cost pays dividends in production through smaller bundle sizes and better runtime performance.

**CommonJS's** dynamic nature prevents many compile-time optimizations but offers runtime flexibility for plugin architectures and conditional loading patterns.

TL;DR: CommonJS prioritizes runtime flexibility with synchronous, dynamic loading, while ESM optimizes for static analysis and performance through asynchronous, declarative imports. The transition reflects JavaScript's evolution from a simple scripting language to a platform for complex, optimized applications.

The interop story is still evolving, particularly around top-level await and package dual-mode publishing strategies. Understanding both systems remains essential for navigating the current JavaScript ecosystem's transitional state.