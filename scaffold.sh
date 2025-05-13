#!/bin/bash

# Define base directory
BASE_DIR="."

# Create directories
mkdir -p "$BASE_DIR/src/styles"
mkdir -p "$BASE_DIR/src/js"
mkdir -p "$BASE_DIR/src/lessons/configs"

# Create files with comments
touch "$BASE_DIR/src/index.html"
echo "<!-- Main entry HTML file -->" > "$BASE_DIR/src/index.html"

touch "$BASE_DIR/src/styles/main.css"
echo "/* Global styles */" > "$BASE_DIR/src/styles/main.css"

touch "$BASE_DIR/src/js/app.js"
echo "// Main application logic" > "$BASE_DIR/src/js/app.js"

touch "$BASE_DIR/src/js/LessonEngine.js"
echo "// Core lesson processing engine" > "$BASE_DIR/src/js/LessonEngine.js"

touch "$BASE_DIR/src/js/renderer.js"
echo "// Handles UI rendering" > "$BASE_DIR/src/js/renderer.js"

touch "$BASE_DIR/src/js/validator.js"
echo "// Validates user code submissions" > "$BASE_DIR/src/js/validator.js"

touch "$BASE_DIR/src/lessons/lesson-config.js"
echo "// Loads and parses lesson configs" > "$BASE_DIR/src/lessons/lesson-config.js"

touch "$BASE_DIR/src/lessons/configs/flexbox.json"
echo "{ /* Flexbox lesson config */ }" > "$BASE_DIR/src/lessons/configs/flexbox.json"

touch "$BASE_DIR/src/lessons/configs/grid.json"
echo "{ /* Grid lesson config */ }" > "$BASE_DIR/src/lessons/configs/grid.json"

touch "$BASE_DIR/src/lessons/configs/basics.json"
echo "{ /* Basics lesson config */ }" > "$BASE_DIR/src/lessons/configs/basics.json"

touch "$BASE_DIR/package.json"
echo "{\n  \"name\": \"css-learning-platform\",\n  \"version\": \"1.0.0\"\n}" > "$BASE_DIR/package.json"

touch "$BASE_DIR/vite.config.js"
echo "// Vite config file" > "$BASE_DIR/vite.config.js"

echo "Project scaffolded at: $BASE_DIR"

