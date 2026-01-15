/**
 * Renderer - Handles UI updates for the CSS learning platform
 */
import { t } from "../i18n.js";

// Feedback elements cache
let feedbackElement = null;
let feedbackTimeout = null;

/**
 * Render the module list in the sidebar with expandable lessons
 * @param {HTMLElement} container - The container element for the module list
 * @param {Array} modules - The list of modules
 * @param {Function} onSelectModule - Callback when a module is selected
 * @param {Function} onSelectLesson - Callback when a lesson is selected
 */
export function renderModuleList(container, modules, onSelectModule, onSelectLesson) {
	// Clear the container
	container.innerHTML = "";

	// Get user progress from localStorage
	const progressData = localStorage.getItem("codeCrispies.progress");
	let progress = {};
	if (progressData) {
		try {
			progress = JSON.parse(progressData);
		} catch (e) {
			console.error("Error parsing progress data:", e);
		}
	}

	// Create list items for each module
	modules.forEach((module) => {
		// Create module container
		// Use native <details>/<summary> for expand/collapse
		const moduleContainer = document.createElement("details");
		moduleContainer.classList.add("module-container");
		moduleContainer.dataset.moduleId = module.id;

		// Keep welcome and playground modules always expanded
		if (module.id === "welcome" || module.id === "playground") {
			moduleContainer.open = true;
		}

		// Create module header using <summary>
		const moduleHeader = document.createElement("summary");
		moduleHeader.classList.add("module-list-item", "module-header");
		moduleHeader.dataset.moduleId = module.id;

		// Create module title
		const moduleTitle = document.createElement("span");
		moduleTitle.classList.add("module-title");
		moduleTitle.textContent = module.title;

		moduleHeader.appendChild(moduleTitle);

		// Check if the module is completed
		if (progress[module.id] && progress[module.id].completed.length === module.lessons.length) {
			moduleHeader.classList.add("completed");
		}

		// Lessons container
		const lessonsContainer = document.createElement("div");
		lessonsContainer.classList.add("lessons-container");
		lessonsContainer.id = `lessons-${module.id}`;

		// Create list items for each lesson in this module
		module.lessons.forEach((lesson, index) => {
			const lessonItem = document.createElement("button");
			lessonItem.type = "button";
			lessonItem.classList.add("lesson-list-item");
			lessonItem.dataset.moduleId = module.id;
			lessonItem.dataset.lessonIndex = index;
			lessonItem.textContent = lesson.title || t("lessonFallback", { index: index + 1 });

			// Mark lesson as completed if in progress data
			if (progress[module.id] && progress[module.id].completed.includes(index)) {
				lessonItem.classList.add("completed");
			}

			// Mark lesson as current if it's the current lesson
			if (progress[module.id] && progress[module.id].current === index) {
				lessonItem.classList.add("current");
			}

			// Add click event to select lesson
			lessonItem.addEventListener("click", () => {
				// Update UI to show this lesson is selected
				document.querySelectorAll(".lesson-list-item").forEach((item) => {
					item.classList.remove("active");
				});
				lessonItem.classList.add("active");

				// Call the onSelectLesson callback
				onSelectLesson(module.id, index);
			});

			lessonsContainer.appendChild(lessonItem);
		});

		// Add module header and lessons container to module container
		moduleContainer.appendChild(moduleHeader);
		moduleContainer.appendChild(lessonsContainer);

		// Add the complete module container to the sidebar
		container.appendChild(moduleContainer);
	});
}

/**
 * Render a lesson in the UI
 * @param {HTMLElement} titleEl - The lesson title element
 * @param {HTMLElement} descriptionEl - The lesson description element
 * @param {HTMLElement} taskEl - The task instruction element
 * @param {HTMLElement} previewEl - The preview area element
 * @param {HTMLElement} prefixEl - The code editor prefix element
 * @param {HTMLElement} inputEl - The code input element
 * @param {HTMLElement} suffixEl - The code editor suffix element
 * @param {Object} lesson - The lesson object
 */
export function renderLesson(titleEl, descriptionEl, taskEl, previewEl, prefixEl, inputEl, suffixEl, lesson) {
	// Set lesson title and description
	titleEl.textContent = lesson.title || t("untitledLesson");
	descriptionEl.innerHTML = lesson.description || "";

	// Set task instructions
	taskEl.innerHTML = lesson.task || "";

	// Set code editor contents (if inputEl is provided)
	if (inputEl) {
		inputEl.value = lesson.initialCode || "";
	}

	// Clear any existing feedback
	clearFeedback();

	// Initial preview render with empty user code
	// The LessonEngine will handle this when it's first set
}

/**
 * Update the level indicator
 * @param {HTMLElement} element - The level indicator element
 * @param {number} current - The current level number
 * @param {number} total - The total number of levels
 */
export function renderLevelIndicator(element, current, total) {
	const label = t("lessonLabel");
	element.innerHTML = `<span class="level-label">${label}</span> ${current} / ${total}`;
}

/**
 * Show feedback for user submissions
 * @param {boolean} isSuccess - Whether the submission was successful
 * @param {string} message - The feedback message
 */
export function showFeedback(isSuccess, message) {
	// Clear any existing feedback
	clearFeedback();

	// Check if error feedback is disabled in user settings
	if (!isSuccess) {
		const disableFeedbackErrors = !document.getElementById("disable-feedback-toggle").checked;
		if (disableFeedbackErrors) {
			// Skip showing error feedback if disabled
			return;
		}
	}

	// Create feedback element
	feedbackElement = document.createElement("div");
	feedbackElement.classList.add(isSuccess ? "feedback-success" : "feedback-error");
	feedbackElement.innerHTML = message;

	// Find where to insert the feedback
	const insertAfter = document.querySelector(".editor-content");
	if (insertAfter && insertAfter.parentNode) {
		insertAfter.parentNode.insertBefore(feedbackElement, insertAfter.nextSibling);
	}

	if (!isSuccess) {
		feedbackTimeout = setTimeout(clearFeedback, 3_000);
	}
}

/**
 * Clear any existing feedback
 */
export function clearFeedback() {
	if (feedbackTimeout) {
		clearInterval(feedbackTimeout);
	}

	if (feedbackElement && feedbackElement.parentNode) {
		feedbackElement.parentNode.removeChild(feedbackElement);
	}
	feedbackElement = null;
}

/**
 * Update the active lesson in the sidebar
 * @param {string} moduleId - The ID of the module
 * @param {number} lessonIndex - The index of the lesson
 */
export function updateActiveLessonInSidebar(moduleId, lessonIndex) {
	// Remove active class from all lessons
	document.querySelectorAll(".lesson-list-item").forEach((item) => {
		item.classList.remove("active");
	});

	// Find and activate the current lesson
	const selector = `.lesson-list-item[data-module-id="${moduleId}"][data-lesson-index="${lessonIndex}"]`;
	const currentLessonItem = document.querySelector(selector);

	if (currentLessonItem) {
		currentLessonItem.classList.add("active");

		// Make sure parent module is expanded (native <details> element)
		const parentDetails = currentLessonItem.closest("details.module-container");
		if (parentDetails) {
			parentDetails.open = true;

			// Scroll to the top of the page
			document.querySelector("html").scrollTop = 0;
			document.body.scrollTop = 0;
			// Scroll to the current lesson item
			currentLessonItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	}
}
