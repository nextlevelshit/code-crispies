import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
// import 'whatwg-fetch';

// Setup mock for localStorage
const localStorageMock = (() => {
	let store = {};
	return {
		getItem(key) {
			return store[key] || null;
		},
		setItem(key, value) {
			store[key] = String(value);
		},
		removeItem(key) {
			delete store[key];
		},
		clear() {
			store = {};
		},
		length: 0,
		key() {
			return null;
		}
	};
})();

// Mock the DOM environment
global.document.body.innerHTML = `
<div class="app-container">
  <aside class="sidebar">
    <div class="module-list"></div>
  </aside>
  <main class="content">
    <div class="lesson-container">
      <h2 id="lesson-title"></h2>
      <div id="lesson-description"></div>
      <div class="task-container">
        <h3>Your Task</h3>
        <div id="task-instruction"></div>
      </div>
      <div class="preview-container">
        <h3>Preview</h3>
        <div id="preview-area"></div>
      </div>
      <div class="editor-container">
        <h3>CSS Editor</h3>
        <div class="editor-content">
          <div id="editor-prefix"></div>
          <textarea id="code-input"></textarea>
          <div id="editor-suffix"></div>
        </div>
        <div class="editor-controls">
          <button id="reset-btn">Reset</button>
          <button id="run-btn">Run</button>
        </div>
      </div>
      <div class="navigation">
        <button id="prev-btn">Previous</button>
        <span id="level-indicator"></span>
        <button id="next-btn">Next</button>
      </div>
    </div>
  </main>
  <div id="modal-container" class="hidden">
    <div class="modal">
      <div class="modal-header">
        <h2 id="modal-title"></h2>
        <button id="modal-close">&times;</button>
      </div>
      <div id="modal-content"></div>
    </div>
  </div>
  <button id="module-selector-btn">Progress</button>
  <button id="help-btn">Help</button>
</div>
`;

// Setup browser mocks
global.localStorage = localStorageMock;
window.localStorage = localStorageMock;

// For iframe support in jsdom
if (!window.document.createRange) {
	window.document.createRange = () => ({
		setStart: () => {},
		setEnd: () => {},
		commonAncestorContainer: {
			nodeName: "BODY",
			ownerDocument: document
		}
	});
}

// Add fetch mock
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
	localStorage.clear();
	fetch.mockReset();
});
