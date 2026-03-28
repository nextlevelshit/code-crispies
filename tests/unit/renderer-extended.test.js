import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
	renderModuleList,
	renderLesson,
	renderLevelIndicator,
	renderDifficultyBadge,
	showFeedback,
	clearFeedback,
	updateActiveLessonInSidebar,
	computeLessonDifficulty
} from "../../src/helpers/renderer.js";

// Mock i18n
vi.mock("../../src/i18n.js", () => ({
	t: (key, params = {}) => {
		const translations = {
			lessonLabel: "Lesson",
			untitledLesson: "Untitled Lesson",
			lessonFallback: `Lesson ${params.index || ""}`,
			difficulty_easy_label: "Easy difficulty",
			difficulty_medium_label: "Medium difficulty",
			difficulty_hard_label: "Hard difficulty",
			difficulty_easy: "Easy",
			difficulty_medium: "Medium",
			difficulty_hard: "Hard"
		};
		return translations[key] || key;
	}
}));

describe("Renderer Extended Coverage", () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div id="module-list"></div>
			<div class="lesson-title-row">
				<h2 id="title"></h2>
			</div>
			<div id="description"></div>
			<div id="task"></div>
			<div id="preview"></div>
			<div id="prefix"></div>
			<textarea id="input"></textarea>
			<div id="suffix"></div>
			<div id="level-indicator"></div>
			<div class="editor-content"></div>
			<input type="checkbox" id="disable-feedback-toggle" checked>
		`;
		localStorage.clear();
	});

	describe("renderModuleList - progress tracking", () => {
		test("renderModuleList_CorruptedProgress_HandlesGracefully", () => {
			const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			localStorage.setItem("codeCrispies.progress", "not-valid-json{{{");

			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [{ title: "L1" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("Error parsing progress"), expect.anything());
			// Should still render modules despite parse error
			expect(container.querySelectorAll(".module-header").length).toBe(1);
			errorSpy.mockRestore();
		});

		test("renderModuleList_CompletedModule_AddedCompletedClass", () => {
			localStorage.setItem(
				"codeCrispies.progress",
				JSON.stringify({
					mod1: { completed: [0, 1], current: 1 }
				})
			);

			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [{ title: "L1" }, { title: "L2" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const header = container.querySelector(".module-header");
			expect(header.classList.contains("completed")).toBe(true);
		});

		test("renderModuleList_PartiallyCompleted_NoCompletedClass", () => {
			localStorage.setItem(
				"codeCrispies.progress",
				JSON.stringify({
					mod1: { completed: [0], current: 1 }
				})
			);

			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [{ title: "L1" }, { title: "L2" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const header = container.querySelector(".module-header");
			expect(header.classList.contains("completed")).toBe(false);
		});

		test("renderModuleList_CompletedLesson_HasCompletedClass", () => {
			localStorage.setItem(
				"codeCrispies.progress",
				JSON.stringify({
					mod1: { completed: [0], current: 1 }
				})
			);

			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [{ title: "L1" }, { title: "L2" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const lessonItems = container.querySelectorAll(".lesson-list-item");
			expect(lessonItems[0].classList.contains("completed")).toBe(true);
			expect(lessonItems[1].classList.contains("completed")).toBe(false);
		});

		test("renderModuleList_CurrentLesson_HasCurrentClass", () => {
			localStorage.setItem(
				"codeCrispies.progress",
				JSON.stringify({
					mod1: { completed: [0], current: 1 }
				})
			);

			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [{ title: "L1" }, { title: "L2" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const lessonItems = container.querySelectorAll(".lesson-list-item");
			expect(lessonItems[1].classList.contains("current")).toBe(true);
			expect(lessonItems[0].classList.contains("current")).toBe(false);
		});
	});

	describe("renderModuleList - welcome/playground always expanded", () => {
		test("renderModuleList_WelcomeModule_AlwaysExpanded", () => {
			const container = document.getElementById("module-list");
			const modules = [{ id: "welcome", title: "Welcome", lessons: [{ title: "Intro" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const details = container.querySelector("details.module-container");
			expect(details.open).toBe(true);
		});

		test("renderModuleList_PlaygroundModule_AlwaysExpanded", () => {
			const container = document.getElementById("module-list");
			const modules = [{ id: "playground", title: "Playground", lessons: [{ title: "Play" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const details = container.querySelector("details.module-container");
			expect(details.open).toBe(true);
		});

		test("renderModuleList_RegularModule_CollapsedByDefault", () => {
			const container = document.getElementById("module-list");
			const modules = [{ id: "flexbox", title: "Flexbox", lessons: [{ title: "L1" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const details = container.querySelector("details.module-container");
			expect(details.open).toBe(false);
		});
	});

	describe("renderModuleList - lesson fallback title", () => {
		test("renderModuleList_NoLessonTitle_UsesFallback", () => {
			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [{}] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const lessonItem = container.querySelector(".lesson-list-item");
			expect(lessonItem.textContent).toContain("Lesson");
		});
	});

	describe("renderModuleList - click behavior", () => {
		test("renderModuleList_LessonClick_RemovesActiveFromOthers", () => {
			const container = document.getElementById("module-list");
			const modules = [
				{
					id: "mod1",
					title: "Module 1",
					lessons: [{ title: "L1" }, { title: "L2" }]
				}
			];
			const onSelectLesson = vi.fn();

			renderModuleList(container, modules, vi.fn(), onSelectLesson);

			const lessonItems = container.querySelectorAll(".lesson-list-item");

			// Click first lesson
			lessonItems[0].click();
			expect(lessonItems[0].classList.contains("active")).toBe(true);
			expect(onSelectLesson).toHaveBeenCalledWith("mod1", 0);

			// Click second lesson
			lessonItems[1].click();
			expect(lessonItems[0].classList.contains("active")).toBe(false);
			expect(lessonItems[1].classList.contains("active")).toBe(true);
			expect(onSelectLesson).toHaveBeenCalledWith("mod1", 1);
		});
	});

	describe("renderModuleList - module dataset", () => {
		test("renderModuleList_DataAttributes_SetCorrectly", () => {
			const container = document.getElementById("module-list");
			const modules = [{ id: "flex-mod", title: "Flex Module", lessons: [{ title: "L1" }] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			const details = container.querySelector("details.module-container");
			expect(details.dataset.moduleId).toBe("flex-mod");

			const header = container.querySelector(".module-header");
			expect(header.dataset.moduleId).toBe("flex-mod");

			const lesson = container.querySelector(".lesson-list-item");
			expect(lesson.dataset.moduleId).toBe("flex-mod");
			expect(lesson.dataset.lessonIndex).toBe("0");
		});
	});

	describe("renderModuleList - empty lessons", () => {
		test("renderModuleList_EmptyLessonsArray_RendersModuleOnly", () => {
			const container = document.getElementById("module-list");
			const modules = [{ id: "mod1", title: "Module 1", lessons: [] }];

			renderModuleList(container, modules, vi.fn(), vi.fn());

			expect(container.querySelectorAll(".module-header").length).toBe(1);
			expect(container.querySelectorAll(".lesson-list-item").length).toBe(0);
		});
	});

	describe("renderDifficultyBadge", () => {
		test("renderDifficultyBadge_EasyLesson_CreatesEasyBadge", () => {
			const container = document.querySelector(".lesson-title-row");
			const lesson = { codePrefix: ".box {\n  ", solution: "color: red;" };

			renderDifficultyBadge(container, lesson);

			const badge = container.querySelector(".difficulty-badge");
			expect(badge).not.toBeNull();
			expect(badge.classList.contains("difficulty-easy")).toBe(true);
			expect(badge.querySelectorAll(".bar").length).toBe(3);
		});

		test("renderDifficultyBadge_MediumLesson_CreatesMediumBadge", () => {
			const container = document.querySelector(".lesson-title-row");
			const lesson = { codePrefix: "", solution: "p {\n  color: red;\n}" };

			renderDifficultyBadge(container, lesson);

			const badge = container.querySelector(".difficulty-badge");
			expect(badge.classList.contains("difficulty-medium")).toBe(true);
		});

		test("renderDifficultyBadge_HardLesson_CreatesHardBadge", () => {
			const container = document.querySelector(".lesson-title-row");
			const lesson = { codePrefix: "", solution: ".nav a {\n  color: white;\n}" };

			renderDifficultyBadge(container, lesson);

			const badge = container.querySelector(".difficulty-badge");
			expect(badge.classList.contains("difficulty-hard")).toBe(true);
		});

		test("renderDifficultyBadge_CalledTwice_RemovesPreviousBadge", () => {
			const container = document.querySelector(".lesson-title-row");
			const lesson1 = { codePrefix: ".box {\n  ", solution: "color: red;" };
			const lesson2 = { codePrefix: "", solution: ".nav a {\n  color: white;\n}" };

			renderDifficultyBadge(container, lesson1);
			expect(container.querySelectorAll(".difficulty-wrapper").length).toBe(1);

			renderDifficultyBadge(container, lesson2);
			expect(container.querySelectorAll(".difficulty-wrapper").length).toBe(1);

			const badge = container.querySelector(".difficulty-badge");
			expect(badge.classList.contains("difficulty-hard")).toBe(true);
		});

		test("renderDifficultyBadge_HasAriaLabel", () => {
			const container = document.querySelector(".lesson-title-row");
			const lesson = { codePrefix: ".box {", solution: "color: red;" };

			renderDifficultyBadge(container, lesson);

			const badge = container.querySelector(".difficulty-badge");
			expect(badge.getAttribute("aria-label")).toBeTruthy();
			expect(badge.getAttribute("title")).toBeTruthy();
		});
	});

	describe("showFeedback", () => {
		test("showFeedback_Success_CreatesSuccessElement", () => {
			showFeedback(true, "Great job!");

			const feedback = document.querySelector(".feedback-success");
			expect(feedback).not.toBeNull();
			expect(feedback.innerHTML).toBe("Great job!");
		});

		test("showFeedback_Success_InsertedAfterEditorContent", () => {
			showFeedback(true, "Good!");

			const editorContent = document.querySelector(".editor-content");
			const feedback = editorContent.nextSibling;
			expect(feedback).not.toBeNull();
			expect(feedback.classList.contains("feedback-success")).toBe(true);
		});

		test("showFeedback_Error_ToggleChecked_ShowsError", () => {
			const toggle = document.getElementById("disable-feedback-toggle");
			toggle.checked = true;

			showFeedback(false, "Try again");

			const feedback = document.querySelector(".feedback-error");
			expect(feedback).not.toBeNull();
			expect(feedback.innerHTML).toBe("Try again");
		});

		test("showFeedback_Error_ToggleUnchecked_HidesError", () => {
			const toggle = document.getElementById("disable-feedback-toggle");
			toggle.checked = false;

			showFeedback(false, "Try again");

			const feedback = document.querySelector(".feedback-error");
			expect(feedback).toBeNull();
		});

		test("showFeedback_Error_AutoClearsAfterTimeout", () => {
			vi.useFakeTimers();
			const toggle = document.getElementById("disable-feedback-toggle");
			toggle.checked = true;

			showFeedback(false, "Error!");

			expect(document.querySelector(".feedback-error")).not.toBeNull();

			vi.advanceTimersByTime(3000);

			expect(document.querySelector(".feedback-error")).toBeNull();
			vi.useRealTimers();
		});

		test("showFeedback_Success_DoesNotAutoCleanup", () => {
			vi.useFakeTimers();

			showFeedback(true, "Good!");

			vi.advanceTimersByTime(5000);

			expect(document.querySelector(".feedback-success")).not.toBeNull();
			vi.useRealTimers();
		});

		test("showFeedback_CalledTwice_ClearsPrevious", () => {
			showFeedback(true, "First");
			showFeedback(true, "Second");

			const feedbacks = document.querySelectorAll(".feedback-success");
			expect(feedbacks.length).toBe(1);
			expect(feedbacks[0].innerHTML).toBe("Second");
		});
	});

	describe("clearFeedback", () => {
		test("clearFeedback_NoExistingFeedback_DoesNotThrow", () => {
			expect(() => clearFeedback()).not.toThrow();
		});

		test("clearFeedback_ExistingFeedback_RemovesIt", () => {
			showFeedback(true, "Test");
			expect(document.querySelector(".feedback-success")).not.toBeNull();

			clearFeedback();
			expect(document.querySelector(".feedback-success")).toBeNull();
		});

		test("clearFeedback_CalledMultipleTimes_Safe", () => {
			showFeedback(true, "Test");
			clearFeedback();
			clearFeedback();
			clearFeedback();
			expect(document.querySelector(".feedback-success")).toBeNull();
		});

		test("clearFeedback_ClearsTimeout", () => {
			vi.useFakeTimers();
			const toggle = document.getElementById("disable-feedback-toggle");
			toggle.checked = true;

			showFeedback(false, "Error");
			clearFeedback();

			// Advance past the timeout - should not throw
			vi.advanceTimersByTime(5000);

			vi.useRealTimers();
		});
	});

	describe("updateActiveLessonInSidebar", () => {
		beforeEach(() => {
			document.body.innerHTML = `
				<details class="module-container" data-module-id="mod1">
					<summary class="module-header">Module 1</summary>
					<div class="lessons-container">
						<button class="lesson-list-item active" data-module-id="mod1" data-lesson-index="0">L1</button>
						<button class="lesson-list-item" data-module-id="mod1" data-lesson-index="1">L2</button>
					</div>
				</details>
				<details class="module-container" data-module-id="mod2">
					<summary class="module-header">Module 2</summary>
					<div class="lessons-container">
						<button class="lesson-list-item" data-module-id="mod2" data-lesson-index="0">L1</button>
					</div>
				</details>
			`;
			// Mock scrollIntoView on all lesson items (not available in jsdom)
			document.querySelectorAll(".lesson-list-item").forEach((el) => {
				el.scrollIntoView = vi.fn();
			});
		});

		test("updateActiveLessonInSidebar_ValidLesson_ActivatesCorrectItem", () => {
			updateActiveLessonInSidebar("mod1", 1);

			const items = document.querySelectorAll(".lesson-list-item");
			expect(items[0].classList.contains("active")).toBe(false);
			expect(items[1].classList.contains("active")).toBe(true);
		});

		test("updateActiveLessonInSidebar_DifferentModule_ExpandsParent", () => {
			const details = document.querySelector('details[data-module-id="mod2"]');
			expect(details.open).toBe(false);

			updateActiveLessonInSidebar("mod2", 0);

			expect(details.open).toBe(true);
			const mod2Lesson = document.querySelector('.lesson-list-item[data-module-id="mod2"]');
			expect(mod2Lesson.classList.contains("active")).toBe(true);
		});

		test("updateActiveLessonInSidebar_RemovesPreviousActive", () => {
			const firstItem = document.querySelector('.lesson-list-item[data-module-id="mod1"][data-lesson-index="0"]');
			expect(firstItem.classList.contains("active")).toBe(true);

			updateActiveLessonInSidebar("mod2", 0);

			expect(firstItem.classList.contains("active")).toBe(false);
		});

		test("updateActiveLessonInSidebar_NonExistentItem_DoesNotThrow", () => {
			expect(() => {
				updateActiveLessonInSidebar("nonexistent", 99);
			}).not.toThrow();

			// All active classes should still be removed
			const activeItems = document.querySelectorAll(".lesson-list-item.active");
			expect(activeItems.length).toBe(0);
		});

		test("updateActiveLessonInSidebar_ScrollsToLesson", () => {
			const targetItem = document.querySelector('.lesson-list-item[data-module-id="mod1"][data-lesson-index="1"]');

			updateActiveLessonInSidebar("mod1", 1);

			expect(targetItem.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "nearest" });
		});
	});

	describe("computeLessonDifficulty - additional edge cases", () => {
		test("computeLessonDifficulty_NoSolution_ReturnsMedium", () => {
			expect(computeLessonDifficulty({ codePrefix: "" })).toBe("medium");
		});

		test("computeLessonDifficulty_SolutionNoBrace_ReturnsMedium", () => {
			expect(
				computeLessonDifficulty({
					codePrefix: "",
					solution: "color: red;"
				})
			).toBe("medium");
		});

		test("computeLessonDifficulty_CodePrefixWithBrace_IgnoresSolution", () => {
			expect(
				computeLessonDifficulty({
					codePrefix: ".nav a {",
					solution: ".nav a {\n  color: white;\n}"
				})
			).toBe("easy");
		});

		test("computeLessonDifficulty_NullCodePrefix_ReturnsMedium", () => {
			expect(computeLessonDifficulty({ codePrefix: null, solution: null })).toBe("medium");
		});
	});

	describe("renderLesson - edge cases", () => {
		test("renderLesson_NullInputEl_DoesNotThrow", () => {
			const titleEl = document.getElementById("title");
			const descriptionEl = document.getElementById("description");
			const taskEl = document.getElementById("task");
			const previewEl = document.getElementById("preview");
			const prefixEl = document.getElementById("prefix");
			const suffixEl = document.getElementById("suffix");
			const lesson = { title: "Test", description: "Desc", task: "Task" };

			expect(() => {
				renderLesson(titleEl, descriptionEl, taskEl, previewEl, prefixEl, null, suffixEl, lesson);
			}).not.toThrow();
		});
	});

	describe("renderLevelIndicator - formatting", () => {
		test("renderLevelIndicator_ContainsLabelSpan", () => {
			const element = document.getElementById("level-indicator");
			renderLevelIndicator(element, 5, 12);

			const label = element.querySelector(".level-label");
			expect(label).not.toBeNull();
			expect(label.textContent).toBe("Lesson");
			expect(element.textContent).toContain("5 / 12");
		});
	});
});
