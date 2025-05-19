/**
 * Renderer - Handles UI updates for the CSS learning platform
 */

// Feedback elements cache
let feedbackElement = null;

/**
 * Render the module list in the sidebar
 * @param {HTMLElement} container - The container element for the module list
 * @param {Array} modules - The list of modules
 * @param {Function} onSelectModule - Callback when a module is selected
 */
export function renderModuleList(container, modules, onSelectModule) {
	// Clear the container
	container.innerHTML = "<h3>CSS Lessons</h3>";

	// Create list items for each module
	modules.forEach((module) => {
		const moduleItem = document.createElement("div");
		moduleItem.classList.add("module-list-item");
		moduleItem.dataset.moduleId = module.id;
		moduleItem.textContent = module.title;

		// Get user progress from localStorage to mark completed lessons
		const progressData = localStorage.getItem("codeCrispies.Progress");
		if (progressData) {
			try {
				const progress = JSON.parse(progressData);
				if (progress[module.id] && progress[module.id].completed.length === module.lessons.length) {
					moduleItem.classList.add("completed");
				}
			} catch (e) {
				console.error("Error parsing progress data:", e);
			}
		}

		moduleItem.addEventListener("click", () => {
			onSelectModule(module.id);
		});

		container.appendChild(moduleItem);
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
	titleEl.textContent = lesson.title || "Untitled Lesson";
	descriptionEl.innerHTML = lesson.description || "";

	// Set task instructions
	taskEl.innerHTML = lesson.task || "";

	// Set code editor contents
	// prefixEl.textContent = lesson.codePrefix || "";
	inputEl.value = lesson.initialCode || "";
	// suffixEl.textContent = lesson.codeSuffix || "";

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
	element.textContent = `Lesson ${current} of ${total}`;
}

/**
 * Show feedback for user submissions
 * @param {boolean} isSuccess - Whether the submission was successful
 * @param {string} message - The feedback message
 */
export function showFeedback(isSuccess, message) {
	// Clear any existing feedback
	clearFeedback();

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
		setTimeout(() => {
			if (feedbackElement && feedbackElement.parentNode) {
				feedbackElement.parentNode.removeChild(feedbackElement);
			}
			feedbackElement = null;
		}, 5_000); // Remove feedback after 3 seconds
	}
}

/**
 * Clear any existing feedback
 */
export function clearFeedback() {
	if (feedbackElement && feedbackElement.parentNode) {
		feedbackElement.parentNode.removeChild(feedbackElement);
	}
	feedbackElement = null;
}
