# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Code Crispies is an interactive CSS/Tailwind learning platform built with pure JavaScript (ES Modules) and Vite. Users complete lessons by writing CSS or Tailwind code that passes validation rules.

## Commands

```bash
npm start          # Start dev server at http://localhost:1234
npm run build      # Production build to dist/
npm run test       # Run tests once
npm run test.watch # Run tests in watch mode
npm run test.coverage # Run tests with coverage report
npm run format     # Format source files with Prettier
npm run format.lessons # Format lesson JSON files
```

## Architecture

### Core Components

- **LessonEngine** (`src/impl/LessonEngine.js`): Single source of truth for lesson state, progress tracking, and code validation. Manages user code application to preview iframes and persists progress to localStorage.

- **Validator** (`src/helpers/validator.js`): Validates user code against lesson requirements. Supports validation types: `contains`, `contains_class`, `not_contains`, `regex`, `property_value`, `syntax`, `custom`.

- **Lesson Config** (`src/config/lessons.js`): Loads and validates lesson modules from JSON. Modules are imported statically and stored in `moduleStore`.

### Data Flow

1. Lesson JSON files define modules with lessons, each containing `previewHTML`, `validations`, and other metadata
2. `LessonEngine` loads modules and tracks user progress per lesson
3. User code is applied to an iframe preview and validated against lesson rules
4. Progress is persisted to `localStorage` under `codeCrispies.progress` and `codeCrispies.userCode`

### Lesson Structure

Lessons are JSON files in `lessons/` following the schema in `schemas/code-crispies-module-schema.json`. Each module has:
- `mode`: "css" or "tailwind"
- `difficulty`: "beginner", "intermediate", or "advanced"
- `lessons[]`: Array of lessons with validations

For Tailwind mode, user classes are injected via `{{USER_CLASSES}}` placeholder in `previewHTML`.

### Testing

Tests use Vitest with jsdom environment. Setup in `tests/setup.js` includes DOM testing library matchers. Test files are in `tests/unit/`.

## Code Quality Standards

This project adheres to the highest standards for web development:

- **Semantic HTML5**: Always use semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<figure>`, etc.) over generic `<div>` containers
- **WCAG Compliance**: Ensure accessibility - proper heading hierarchy, ARIA labels where needed, keyboard navigation support
- **Native HTML over JavaScript**: Prefer native HTML elements and attributes (e.g., `<dialog>`, `<details>`, `required`, `pattern`) over JS-driven solutions
- **No unnecessary classes**: Avoid presentational classes like `.form-group` or `.container` in lesson examples - teach pure semantic HTML first
- **Progressive enhancement**: Core functionality should work without JavaScript where possible
- **Valid HTML**: All HTML must be valid according to W3C standards

### Lesson Content Guidelines

When creating or editing lessons:
- Student code examples should be minimal and semantic
- Avoid CSS framework patterns (Bootstrap, Tailwind utility classes) in HTML lessons
- Use native form validation attributes instead of JavaScript validation
- Teach the platform's native capabilities first

### Lesson Design Best Practices

**Short Class Names:**
- Class names students type should be short: 1-2 syllables maximum
- Good: `.wrap`, `.flex`, `.grid`, `.box`, `.card`, `.item`, `.btn`
- Bad: `.flex-container`, `.grid-layout`, `.button-primary` (too long, compound names)
- Single-word names are easier to type and remember

**Clear Task Instructions:**
- Always state the selector AND the property explicitly in the task
- Good: "Add `display: flex` to `.wrap`"
- Bad: "Use flexbox to align the items" (unclear what selector to use)

**Use `codePrefix` for Context:**
- Include the selector in `codePrefix` so students know where to write
- Example: `"codePrefix": ".wrap {\n  "` with `"codeSuffix": "\n}"`
- This shows students exactly which rule they're editing

**Simple, Human-Friendly Values:**
- Use round numbers: `1rem` not `1.25rem`, `8px` not `0.5rem`
- Avoid tiny values: `2px` not `0.125rem`
- Students should focus on learning concepts, not deciphering odd numbers

**Named CSS Colors:**
- Use descriptive color names: `steelblue`, `coral`, `mediumseagreen`, `gold`
- Avoid hex codes: `#3498db` is less memorable than `steelblue`
- Named colors make lessons more engaging and easier to remember

**Focused Validations:**
- When `codePrefix` includes the selector, validations only need to check the property value
- Use `property_value` type for direct checks: `{ "property": "display", "expected": "flex" }`
- Avoid redundant `contains` checks when `property_value` already validates the same thing

**Semantic HTML in Examples:**
- Never use non-semantic wrapper classes like `.form-group` or `.container`
- Use semantic HTML elements that match the context
- Keep `previewHTML` clean and focused on the lesson objective

## Git Commits

- Do NOT add co-authoring lines to commit messages
- Follow conventional commit format (feat:, fix:, refactor:, docs:, etc.)
