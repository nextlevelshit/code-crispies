![Code Crispies Logo](./public/android-chrome-192x192.png)
# Code Crispies

An interactive platform for learning CSS through practical challenges.

## 📚 Overview

Code Crispies is a web-based learning platform designed to help users master CSS through hands-on exercises. The application presents a series of progressive challenges organized into themed modules, allowing learners to build their skills step by step while receiving immediate feedback.

### Key Features

- **Interactive Lessons**: Learn CSS concepts through practical, hands-on challenges
- **Progressive Difficulty**: Modules are structured to build skills gradually from basic to advanced
- **Real-Time Feedback**: Get immediate validation on your code solutions
- **Progress Tracking**: Your learning progress is automatically saved in the browser
- **Visual Preview**: See the results of your CSS code in real-time
- **Comprehensive Modules**: Cover various CSS topics in organized learning paths

## 🛠️ Technical Stack

- Pure JavaScript (ES Modules)
- HTML5 & CSS3
- Vite for bundling and development
- Vitest for testing
- Local Storage for progress persistence

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
   git clone https://github.com/nextlevelshit/code-crispies.git
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

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run test.watch` - Run tests in watch mode
- `npm run test.coverage` - Run tests with coverage report
- `npm run format` - Format source code with Prettier
- `npm run format.lessons` - Format lesson JSON files with Prettier

## 📖 Usage Guide

### How to Use Code Crispies

1. **Select a Module**: Choose a learning module from the Progress menu
2. **Read the Challenge**: Each lesson includes an objective and task instructions
3. **Write CSS Code**: Enter your CSS solution in the editor
4. **Run Your Code**: Click the "Run" button (or press Ctrl+Enter) to test your solution
5. **Review Feedback**: Get immediate feedback on your solution
6. **Progress**: Move to the next lesson once your solution is correct

### Keyboard Shortcuts

- `Ctrl+Enter` - Run your code
- `Tab` - Insert two spaces (for indentation)

## 🧩 Project Structure

```
code-crispies/
├── public/             # Static assets
├── src/
│   ├── config/         # Configuration files
│   │   └── lessons.js  # Module and lesson definitions
│   ├── helpers/        # Helper utilities
│   │   ├── renderer.js # UI rendering functions
│   │   └── validator.js # Code validation logic
│   ├── impl/
│   │   └── LessonEngine.js # Core lesson processing logic
│   ├── app.js          # Main application entry point
│   ├── index.html      # Main HTML template
│   └── main.css        # Global styles
├── tests/              # Test files
│   ├── setup.js        # Test configuration
│   └── *.test.js       # Test files
├── vite.config.js      # Vite configuration
└── vitest.config.js    # Vitest configuration
```

## 📝 Adding New Lessons

Lessons are defined in JSON format in the `lessons.js` file. Each lesson includes:

- Title and description
- Task instructions
- HTML content for the preview area
- CSS prefix and suffix (the code before and after the user's input)
- Validation criteria

Example lesson structure:

```js
{
  id: "selector-basics",
  title: "CSS Selectors Basics",
  description: "Learn to select and style HTML elements",
  lessons: [
    {
      title: "Element Selectors",
      description: "Style HTML elements using element selectors",
      taskDescription: "Make all paragraphs red",
      html: "<p>This is a paragraph</p><p>This is another paragraph</p>",
      cssPrefix: "/* Write your CSS below */\n",
      cssSuffix: "",
      validationCriteria: {
        type: "regex",
        pattern: "p\\s*{\\s*color\\s*:\\s*red\\s*;?\\s*}"
      }
    }
    // More lessons...
  ]
}
```

## 🧪 Testing

The project uses Vitest for testing. Tests are located in the `tests/` directory.

Run tests with:

```bash
npm run test
```

Generate coverage report:

```bash
npm run test.coverage
```

## 🚢 Deployment

To build the project for production:

```bash
npm run build
```

The output will be generated in the `dist/` directory, which can be deployed to any static web server.

For GitHub Pages deployment, the configuration is already set up with the base path `/code-crispies/`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git switch -c feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Copyright (c) 2023 Michael Czechowski. Licensed under the [./LICENSE](WTFPL).