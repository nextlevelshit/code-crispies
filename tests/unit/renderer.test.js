import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderModuleList, renderLesson, renderLevelIndicator, showFeedback, clearFeedback, computeLessonDifficulty } from "../../src/helpers/renderer.js";

describe("Renderer Module", () => {
	beforeEach(() => {
		// Reset the DOM between tests
		document.body.innerHTML = `
      <div id="module-list"></div>
      <h2 id="title"></h2>
      <div id="description"></div>
      <div id="task"></div>
      <div id="preview"></div>
      <div id="prefix"></div>
      <textarea id="input"></textarea>
      <div id="suffix"></div>
      <div id="level-indicator"></div>
      <div id="code-editor"></div>
    `;
	});

	describe("renderModuleList", () => {
		test("should render a list of modules", () => {
			const container = document.getElementById("module-list");
			const modules = [
				{ id: "mod1", title: "Module 1", lessons: [{ title: "Lesson 1" }] },
				{ id: "mod2", title: "Module 2", lessons: [{ title: "Lesson 2" }] }
			];
			const onSelectModule = vi.fn();
			const onSelectLesson = vi.fn();

			renderModuleList(container, modules, onSelectModule, onSelectLesson);

			// Check if module headers are created (heading is now in HTML, not added by renderer)
			const moduleHeaders = container.querySelectorAll(".module-header");
			expect(moduleHeaders.length).toBe(2);

			// Module titles should be in the headers
			expect(moduleHeaders[0].textContent).toContain("Module 1");
			expect(moduleHeaders[1].textContent).toContain("Module 2");
		});

		test("should handle empty module list", () => {
			const container = document.getElementById("module-list");
			renderModuleList(container, [], vi.fn(), vi.fn());

			// Container should be empty (heading is now in HTML, not added by renderer)
			expect(container.innerHTML).toBe("");
			expect(container.querySelectorAll(".module-header").length).toBe(0);
		});

		test("should expand module and show lessons on click", () => {
			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [{ title: "Lesson A" }, { title: "Lesson B" }] }];
			const onSelectLesson = vi.fn();

			renderModuleList(container, modules, vi.fn(), onSelectLesson);

			// Module should be collapsed initially (native <details> element)
			const detailsElement = container.querySelector("details.module-container");
			expect(detailsElement.open).toBe(false);

			// Click module header (summary) to expand
			const moduleHeader = container.querySelector("summary.module-header");
			moduleHeader.click();

			// Module should now be expanded
			expect(detailsElement.open).toBe(true);

			// Click a lesson
			const lessonItems = container.querySelectorAll(".lesson-list-item");
			expect(lessonItems.length).toBe(2);
			lessonItems[0].click();
			expect(onSelectLesson).toHaveBeenCalledWith("mod1", 0);
		});
	});

	describe("renderLesson", () => {
		test("should render lesson content correctly", () => {
			const titleEl = document.getElementById("title");
			const descriptionEl = document.getElementById("description");
			const taskEl = document.getElementById("task");
			const previewEl = document.getElementById("preview");
			const prefixEl = document.getElementById("prefix");
			const inputEl = document.getElementById("input");
			const suffixEl = document.getElementById("suffix");

			const lesson = {
				title: "Test Lesson",
				description: "<p>Description text</p>",
				task: "<p>Task instructions</p>",
				codePrefix: "body {",
				initialCode: "  color: red;",
				codeSuffix: "}"
			};

			renderLesson(titleEl, descriptionEl, taskEl, previewEl, prefixEl, inputEl, suffixEl, lesson);

			expect(titleEl.textContent).toBe("Test Lesson");
			expect(descriptionEl.innerHTML).toBe("<p>Description text</p>");
			expect(taskEl.innerHTML).toBe("<p>Task instructions</p>");
			// Note: prefix/suffix elements are no longer populated by renderLesson (handled by LessonEngine)
			expect(inputEl.value).toBe("  color: red;");
		});

		test("should handle missing lesson data with defaults", () => {
			const titleEl = document.getElementById("title");
			const descriptionEl = document.getElementById("description");
			const taskEl = document.getElementById("task");
			const prefixEl = document.getElementById("prefix");
			const inputEl = document.getElementById("input");
			const suffixEl = document.getElementById("suffix");

			// Empty lesson object
			const lesson = {};

			renderLesson(titleEl, descriptionEl, taskEl, document.getElementById("preview"), prefixEl, inputEl, suffixEl, lesson);

			expect(titleEl.textContent).toBe("Untitled Lesson");
			expect(descriptionEl.innerHTML).toBe("");
			expect(taskEl.innerHTML).toBe("");
			expect(inputEl.value).toBe("");
		});
	});

	describe("renderLevelIndicator", () => {
		test("should update level indicator text", () => {
			const element = document.getElementById("level-indicator");

			renderLevelIndicator(element, 3, 10);
			expect(element.textContent).toBe("Lesson 3 / 10");

			renderLevelIndicator(element, 1, 5);
			expect(element.textContent).toBe("Lesson 1 / 5");
		});
	});

	describe.skip("showFeedback and clearFeedback", () => {
		test("should create success feedback element", () => {
			const editor = document.getElementById("code-editor");
			showFeedback(true, "Great job!");

			const feedback = document.querySelector(".feedback-success");
			expect(feedback).not.toBeNull();
			expect(feedback.textContent).toBe("Great job!");

			// Test auto clearing with setTimeout
			vi.useFakeTimers();
			showFeedback(true, "Auto clear test");
			vi.advanceTimersByTime(5001);
			expect(document.querySelector(".feedback-success")).toBeNull();
			vi.useRealTimers();
		});

		test("should create error feedback element", () => {
			showFeedback(false, "Try again");

			const feedback = document.querySelector(".feedback-error");
			expect(feedback).not.toBeNull();
			expect(feedback.textContent).toBe("Try again");

			// Error feedback should not auto-clear
			vi.useFakeTimers();
			vi.advanceTimersByTime(5001);
			expect(document.querySelector(".feedback-error")).not.toBeNull();
			vi.useRealTimers();
		});

		test("should clear existing feedback", () => {
			showFeedback(false, "Error message");
			expect(document.querySelector(".feedback-error")).not.toBeNull();

			clearFeedback();
			expect(document.querySelector(".feedback-error")).toBeNull();

			// Should work when called multiple times
			clearFeedback();
		});
	});

	describe("computeLessonDifficulty", () => {
		test("should return 'easy' when codePrefix contains selector", () => {
			expect(computeLessonDifficulty({
				codePrefix: ".text {\n  ",
				solution: "color: coral;"
			})).toBe("easy");

			expect(computeLessonDifficulty({
				codePrefix: "h1, h2, h3 {\n  ",
				solution: "color: steelblue;"
			})).toBe("easy");
		});

		test("should return 'medium' for simple type selector", () => {
			expect(computeLessonDifficulty({
				codePrefix: "",
				solution: "p {\n  color: steelblue;\n}"
			})).toBe("medium");

			expect(computeLessonDifficulty({
				codePrefix: "",
				solution: "a {\n  color: coral;\n}"
			})).toBe("medium");
		});

		test("should return 'medium' for simple class selector", () => {
			expect(computeLessonDifficulty({
				codePrefix: "",
				solution: ".badge {\n  background: tomato;\n}"
			})).toBe("medium");
		});

		test("should return 'hard' for descendant selectors", () => {
			expect(computeLessonDifficulty({
				codePrefix: "",
				solution: ".nav a {\n  color: white;\n}"
			})).toBe("hard");

			expect(computeLessonDifficulty({
				codePrefix: "",
				solution: ".card p {\n  font-size: 0.9rem;\n}"
			})).toBe("hard");
		});

		test("should return 'hard' for chained class selectors", () => {
			expect(computeLessonDifficulty({
				codePrefix: "",
				solution: ".btn.primary {\n  background: steelblue;\n}"
			})).toBe("hard");
		});

		test("should return 'hard' for type+class selectors", () => {
			expect(computeLessonDifficulty({
				codePrefix: "",
				solution: "a.btn {\n  text-decoration: none;\n}"
			})).toBe("hard");
		});

		test("should handle missing fields gracefully", () => {
			expect(computeLessonDifficulty({})).toBe("medium");
			expect(computeLessonDifficulty({ codePrefix: null })).toBe("medium");
		});
	});

	describe("renderModuleList section headers", () => {
		const noop = () => {};

		test("inserts section header elements between different category groups", () => {
			const container = document.getElementById("module-list");
			const modules = [
				{ id: "css-basic-selectors", title: "CSS Selectors", lessons: [{ title: "L1" }] },
				{ id: "colors", title: "Colors", lessons: [{ title: "L1" }] },
				{ id: "flexbox", title: "Flexbox", lessons: [{ title: "L1" }] },
				{ id: "html-elements", title: "HTML Elements", lessons: [{ title: "L1" }] }
			];

			renderModuleList(container, modules, noop, noop);

			const headers = container.querySelectorAll(".module-section-header");
			expect(headers.length).toBe(3); // CSS Basics, CSS Layout, HTML Structure
		});

		test("section headers display correct category text", () => {
			const container = document.getElementById("module-list");
			const modules = [
				{ id: "css-basic-selectors", title: "CSS Selectors", lessons: [{ title: "L1" }] },
				{ id: "flexbox", title: "Flexbox", lessons: [{ title: "L1" }] }
			];

			renderModuleList(container, modules, noop, noop);

			const headers = container.querySelectorAll(".module-section-header");
			expect(headers[0].textContent).toBe("CSS Basics");
			expect(headers[1].textContent).toBe("CSS Layout");
		});

		test("no section header is inserted between modules in the same category", () => {
			const container = document.getElementById("module-list");
			const modules = [
				{ id: "css-basic-selectors", title: "CSS Selectors", lessons: [{ title: "L1" }] },
				{ id: "colors", title: "Colors", lessons: [{ title: "L1" }] },
				{ id: "typography", title: "Typography", lessons: [{ title: "L1" }] }
			];

			renderModuleList(container, modules, noop, noop);

			const headers = container.querySelectorAll(".module-section-header");
			expect(headers.length).toBe(1);
			expect(headers[0].textContent).toBe("CSS Basics");
		});

		test("Welcome and Outro modules have no section headers", () => {
			const container = document.getElementById("module-list");
			const modules = [
				{ id: "welcome", title: "Welcome", lessons: [{ title: "L1" }] },
				{ id: "css-basic-selectors", title: "CSS Selectors", lessons: [{ title: "L1" }] },
				{ id: "playground", title: "Playground", lessons: [{ title: "L1" }] }
			];

			renderModuleList(container, modules, noop, noop);

			const headers = container.querySelectorAll(".module-section-header");
			expect(headers.length).toBe(1);
			expect(headers[0].textContent).toBe("CSS Basics");
		});
	});
});
