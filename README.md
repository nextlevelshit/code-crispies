![Code Crispies Logo](./public/android-chrome-192x192.png)
# Code Crispies

An interactive platform for learning CSS and Tailwind CSS through practical challenges.

## 📚 Overview

Code Crispies is a web-based learning platform designed to help users master CSS and Tailwind CSS through hands-on exercises. The application presents a series of progressive challenges organized into themed modules, allowing learners to build their skills step by step while receiving immediate feedback.

### Key Features

- **Interactive Lessons**: Learn CSS and Tailwind concepts through practical, hands-on challenges
- **Dual Mode Support**: Switch between CSS and Tailwind CSS learning modes
- **Progressive Difficulty**: Modules are structured to build skills gradually from basic to advanced
- **Real-Time Feedback**: Get immediate validation on your code solutions with comprehensive feedback
- **Progress Tracking**: Your learning progress is automatically saved in the browser
- **Visual Preview**: See the results of your code in real-time with live preview
- **Comprehensive Modules**: Cover various CSS and Tailwind topics in organized learning paths
- **Schema-Validated Lessons**: All lessons follow a strict JSON schema for consistency

## 🛠️ Technical Stack

- Pure JavaScript (ES Modules)
- HTML5 & CSS3
- Vite for bundling and development
- Vitest for testing with coverage reporting
- JSON Schema validation for lesson structure
- Local Storage for progress persistence
- whatwg-fetch polyfill for compatibility

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v8 or higher recommended)

### Installation

0. NVM (optional)
   ```bash
   nvm use
   ```

1. Clone the repository:
   ```bash
   git clone https://git.librete.ch/libretech/code-crispies.git
   cd code-crispies
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:1312
   ```

### Available Scripts

- `npm start` - Start the development server (alias for `npm run dev`)
- `npm run dev` - Start the development server with host binding
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally with debug mode
- `npm run test` - Run tests once
- `npm run test.watch` - Run tests in watch mode
- `npm run test.coverage` - Run tests with coverage report
- `npm run format` - Format source code with Prettier (includes config files)
- `npm run format.lessons` - Format lesson JSON files with Prettier

## 📖 Usage Guide

### How to Use Code Crispies

1. **Select a Module**: Choose a learning module from the available options
2. **Choose Mode**: Select between CSS or Tailwind CSS learning mode (if applicable)
3. **Read the Challenge**: Each lesson includes a description, task instructions, and learning objectives
4. **Write Code**: Enter your CSS or Tailwind solution in the editor
5. **Run Your Code**: Click the "Run" button (or press Ctrl+Enter) to test your solution
6. **Review Feedback**: Get comprehensive feedback with validation messages
7. **Progress**: Move to the next lesson once your solution passes all validations

### Keyboard Shortcuts

- `Ctrl+Enter` - Run your code
- `Tab` - Insert appropriate indentation

## 🧩 Project Structure

```
code-crispies/
├── coverage/          # Test coverage reports
├── docs/              # Documentation files (multilingual)
├── lessons/           # JSON lesson definitions
├── public/            # Static assets and PWA manifests
├── schemas/           # JSON Schema definitions
│   └── code-crispies-module-schema.json
├── src/
│   ├── config/        # Configuration files
│   │   └── lessons.js # Module and lesson loading logic
│   ├── helpers/       # Helper utilities
│   │   ├── renderer.js # UI rendering functions
│   │   └── validator.js # Code validation logic
│   ├── impl/
│   │   └── LessonEngine.js # Core lesson processing logic
│   ├── app.js         # Main application entry point
│   ├── index.html     # Main HTML template
│   └── main.css       # Global styles
├── tests/             # Test files
│   ├── setup.js       # Test configuration
│   └── unit/          # Unit tests
├── vite.config.js     # Vite configuration
└── vitest.config.js   # Vitest configuration
```

## 📝 Adding New Lessons

Lessons are defined in JSON format following the schema in `schemas/code-crispies-module-schema.json`. Each module includes comprehensive lesson definitions with validation rules.

### Module Structure

```json
{
  "id": "unique-module-id",
  "title": "Module Title",
  "description": "Detailed description of module content and purpose",
  "mode": "css", // or "tailwind"
  "difficulty": "beginner", // "intermediate" or "advanced"
  "lessons": [
    // Lesson objects...
  ]
}
```

### Lesson Structure

```json
{
  "id": "unique-lesson-id",
  "title": "Lesson Title",
  "description": "Detailed lesson description and concepts",
  "mode": "css", // Optional override for module mode
  "task": "Specific task instructions for the student",
  "previewHTML": "<div>HTML for preview</div>",
  "previewBaseCSS": "/* Base styles for preview */",
  "sandboxCSS": "/* Additional sandbox styles */",
  "initialCode": "/* Starting code for student */",
  "solution": "/* Optional solution code */",
  "previewContainer": "container-id",
  "validations": [
    {
      "type": "contains", // "contains_class", "not_contains", "regex", "property_value", "syntax", "custom"
      "value": "expected-content",
      "message": "Feedback message for validation failure",
      "options": {
        "caseSensitive": false
      }
    }
  ]
}
```

### Validation Types

- **contains**: Check if code contains specific text
- **contains_class**: Check if HTML contains specific CSS class
- **not_contains**: Ensure code doesn't contain specific text
- **regex**: Validate against regular expression pattern
- **property_value**: Validate specific CSS property values
- **syntax**: Check for valid CSS syntax
- **custom**: Custom validation logic

## 🧪 Testing

The project uses Vitest for comprehensive testing with coverage reporting. Tests are organized in the `tests/unit/` directory.

Run tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test.watch
```

Generate coverage report:
```bash
npm run test.coverage
```

Coverage reports are generated in the `coverage/` directory with detailed HTML reports.

## 🚢 Deployment

To build the project for production:

```bash
npm run build
```

The output will be generated in the `dist/` directory, which can be deployed to any static web server.

For GitHub Pages deployment, the configuration is already set up with the base path `/code-crispies/`.

Preview the production build locally:
```bash
npm run preview
```

## 🌐 Internationalization

The project supports multiple languages:

### Localized Lessons
Lessons are available in the `lessons/` directory with language-specific subdirectories:
- English (default): `lessons/*.json`
- Arabic: `lessons/ar/`
- German: `lessons/de/`
- Spanish: `lessons/es/`
- Polish: `lessons/pl/`
- Ukrainian: `lessons/uk/`

### Documentation
Multilingual documentation in the `docs/` directory:
- English documentation (`en-*.md`)
- German documentation (`de-*.md`)

## 🤝 Contributing

Contributions are welcome! Please ensure all lessons follow the JSON schema validation.

1. Fork the repository
2. Create your feature branch (`git switch -c feature/amazing-feature`)
3. Add/modify lessons following the schema in `schemas/code-crispies-module-schema.json`
4. Format your code: `npm run format` and `npm run format.lessons`
5. Run tests: `npm run test`
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Adding New Lessons

When adding new lessons:
1. Create or modify JSON files in the `lessons/` directory
2. Ensure they validate against the schema
3. Test thoroughly with various validation scenarios
4. Update documentation if needed

## 📄 License

Copyright (c) 2026 Michael Czechowski. Licensed under the [./LICENSE](WTFPL).
