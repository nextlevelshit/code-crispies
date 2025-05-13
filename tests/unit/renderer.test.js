import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderModuleList, renderLesson, renderLevelIndicator, showFeedback, clearFeedback } from "../../src/helpers/renderer.js";

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
				{ id: "mod1", title: "Module 1" },
				{ id: "mod2", title: "Module 2" }
			];
			const onSelectModule = vi.fn();

			renderModuleList(container, modules, onSelectModule);

			// Check if heading is created
			expect(container.innerHTML).toContain("<h3>Modules</h3>");

			// Check if module items are created
			const moduleItems = container.querySelectorAll(".module-list-item");
			expect(moduleItems.length).toBe(2);
			expect(moduleItems[0].textContent).toBe("Module 1");
			expect(moduleItems[1].textContent).toBe("Module 2");

			// Test click event
			moduleItems[0].click();
			expect(onSelectModule).toHaveBeenCalledWith("mod1");
		});

		test("should handle empty module list", () => {
			const container = document.getElementById("module-list");
			renderModuleList(container, [], vi.fn());

			expect(container.innerHTML).toContain("<h3>Modules</h3>");
			expect(container.querySelectorAll(".module-list-item").length).toBe(0);
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
			expect(prefixEl.textContent).toBe("body {");
			expect(inputEl.value).toBe("  color: red;");
			expect(suffixEl.textContent).toBe("}");
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
			expect(prefixEl.textContent).toBe("");
			expect(inputEl.value).toBe("");
			expect(suffixEl.textContent).toBe("");
		});
	});

	describe("renderLevelIndicator", () => {
		test("should update level indicator text", () => {
			const element = document.getElementById("level-indicator");

			renderLevelIndicator(element, 3, 10);
			expect(element.textContent).toBe("Lesson 3 of 10");

			renderLevelIndicator(element, 1, 5);
			expect(element.textContent).toBe("Lesson 1 of 5");
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
});
