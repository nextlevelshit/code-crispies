<p align="center">
  <a href="https://codecrispi.es"><img src="./public/logo.svg" alt="Code Crispies" width="640"></a>
</p>

<p align="center">
  <strong>Learn HTML, CSS, Tailwind, JS &amp; Markdown — hands-on, in your browser.</strong>
</p>

<p align="center">
  <a href="https://codecrispi.es"><img src="https://img.shields.io/badge/live-codecrispi.es-4f46e5?style=for-the-badge" alt="live demo"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-fbca04?style=for-the-badge" alt="MIT license"></a>
  <img src="https://img.shields.io/badge/lessons-135-0e8a16?style=for-the-badge" alt="135 lessons">
  <img src="https://img.shields.io/badge/no-signup-1da1f2?style=for-the-badge" alt="no signup">
</p>

<p align="center">
  <a href="https://codecrispi.es"><strong>▶ Try it live</strong></a>
  ·
  <a href="https://codecrispi.es/blog/">Blog</a>
  ·
  <a href="https://codecrispi.es/blog/rss.xml">RSS</a>
</p>

---

135 progressive lessons across HTML, CSS, Tailwind, JavaScript, and Markdown. Each lesson is a short coding challenge with live preview and instant validation. No account, no ads, no tracking beyond privacy-friendly Umami. Self-hostable.

## How it compares

| | Free | No signup | Self-host | Live validation | Scope |
|---|:---:|:---:|:---:|:---:|---|
| **Code Crispies** | ✅ | ✅ | ✅ | ✅ | HTML, CSS, Tailwind, JS, Markdown |
| Flexbox Froggy | ✅ | ✅ | ❌ | ✅ | Flexbox only |
| CSS Diner | ✅ | ✅ | ❌ | ✅ | Selectors only |
| CSSBattle | ✅ | ❌ | ❌ | ✅ | CSS code-golf |
| Frontend Mentor | partial | ❌ | ❌ | manual | Design challenges |
| Scrimba | freemium | ❌ | ❌ | via video | Video courses |

## Local development

```bash
git clone https://github.com/nextlevelshit/code-crispies.git
cd code-crispies
npm i
npm start         # http://localhost:1312
```

Requires Node 18+, npm 8+. `nvm use` if you have it.

### Scripts

| | |
|---|---|
| `npm start` | dev server with host binding |
| `npm run build` | production build → `dist/` |
| `npm run preview` | local preview of prod build |
| `npm run test` | run vitest once |
| `npm run test.watch` | watch mode |
| `npm run test.coverage` | coverage report → `coverage/` |
| `npm run format` | prettier on source |
| `npm run format.lessons` | prettier on lesson JSON |

## Project layout

```
code-crispies/
├── lessons/              # 135 JSON lesson definitions
│   ├── *.json            # English (default)
│   └── ar|de|es|pl|uk/   # localized (partial)
├── public/               # static assets, PWA, og-image, logo
├── schemas/              # JSON Schema for lessons
├── src/
│   ├── config/lessons.js
│   ├── helpers/{renderer,validator}.js
│   ├── impl/LessonEngine.js
│   ├── app.js
│   ├── index.html
│   └── main.css
└── tests/unit/           # vitest
```

## Authoring lessons

Lessons live in `lessons/*.json`, validated against [`schemas/code-crispies-module-schema.json`](./schemas/code-crispies-module-schema.json).

```json
{
  "id": "module-id",
  "title": "Module Title",
  "mode": "css",
  "difficulty": "beginner",
  "lessons": [
    {
      "id": "lesson-id",
      "title": "Lesson Title",
      "task": "What the student must do",
      "previewHTML": "<div>preview markup</div>",
      "initialCode": "/* starting code */",
      "validations": [
        { "type": "property_value", "property": "display", "expected": "flex" }
      ]
    }
  ]
}
```

Validation types: `contains`, `contains_class`, `not_contains`, `regex`, `property_value`, `syntax`, `custom`.

For Tailwind mode, `{{USER_CLASSES}}` in `previewHTML` is replaced with student input.

## Deployment

`npm run build` → `dist/`. Deploy to any static web server. GitHub Pages: base path `/code-crispies/` is preconfigured.

## Internationalization

Lessons available in `lessons/*.json` (English default) and partial translations in `ar`, `de`, `es`, `pl`, `uk`. Docs in `docs/` (English + German).

## Contributing

1. Fork
2. Branch off `main`
3. `npm run format` + `npm run format.lessons`
4. `npm run test`
5. Open PR

## License

[MIT](./LICENSE) — © 2026 Michael Czechowski.
