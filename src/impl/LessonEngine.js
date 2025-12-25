/**
 * LessonEngine - Core class for managing lessons and applying/testing user code
 * Single source of truth for lesson state and progress
 */
import { validateUserCode } from "../helpers/validator.js";

export class LessonEngine {
	constructor() {
		this.currentLesson = null;
		this.userCode = "";
		this.currentModule = null;
		this.currentLessonIndex = 0;
		this.lastRenderedCode = ""; // Track last applied code to prevent unnecessary re-renders
		this.modules = [];
		this.userProgress = {}; // Format: { moduleId: { completed: [0, 2, 3], current: 4 } }
		this.userCodeMap = new Map(); // Store user code for each lesson
		this.loadUserProgress();
	}

	/**
	 * Initialize with modules array
	 * @param {Array} modules - Available modules
	 */
	setModules(modules) {
		this.modules = modules;
		this.loadUserCodeFromStorage();
	}

	/**
	 * Set the current module
	 * @param {Object} module - The module object from the config
	 */
	setModule(module) {
		this.currentModule = module;
		this.currentLessonIndex = 0;

		// Load user progress for this module
		if (!this.userProgress[module.id]) {
			this.userProgress[module.id] = { completed: [], current: 0 };
		}

		this.currentLessonIndex = this.userProgress[module.id].current || 0;

		if (module && module.lessons && module.lessons.length > 0) {
			this.setLesson(module.lessons[this.currentLessonIndex]);
		}

		this.saveUserProgress();
	}

	/**
	 * Set module by ID
	 * @param {string} moduleId - The module ID
	 * @returns {boolean} Whether the operation was successful
	 */
	setModuleById(moduleId) {
		const module = this.modules.find((m) => m.id === moduleId);
		if (!module) return false;

		this.setModule(module);
		return true;
	}

	/**
	 * Set the current lesson
	 * @param {Object} lesson - The lesson object from the config
	 */
	setLesson(lesson) {
		this.currentLesson = lesson;

		// Load saved user code for this lesson or use initial code
		const lessonKey = `${this.currentModule.id}-${this.currentLessonIndex}`;
		this.userCode = this.userCodeMap.get(lessonKey) || lesson.initialCode || "";

		this.lastRenderedCode = ""; // Reset last rendered code
		this.renderPreview();
	}

	/**
	 * Set lesson by index within the current module
	 * @param {number} index - The lesson index
	 * @returns {boolean} Whether the operation was successful
	 */
	setLessonByIndex(index) {
		if (!this.currentModule || !this.currentModule.lessons) {
			return false;
		}

		if (index < 0 || index >= this.currentModule.lessons.length) {
			return false;
		}

		this.currentLessonIndex = index;
		this.setLesson(this.currentModule.lessons[index]);

		// Update progress
		this.userProgress[this.currentModule.id].current = index;
		this.saveUserProgress();

		return true;
	}

	/**
	 * Move to the next lesson (crosses module boundaries)
	 * @returns {boolean} Whether the operation was successful
	 */
	nextLesson() {
		// Try next lesson in current module
		if (this.setLessonByIndex(this.currentLessonIndex + 1)) {
			return true;
		}

		// At end of module, try next module
		const currentModuleIndex = this.modules.findIndex((m) => m.id === this.currentModule?.id);
		if (currentModuleIndex >= 0 && currentModuleIndex < this.modules.length - 1) {
			const nextModule = this.modules[currentModuleIndex + 1];
			this.setModule(nextModule);
			this.setLessonByIndex(0); // Start at first lesson
			return true;
		}

		return false;
	}

	/**
	 * Move to the previous lesson (crosses module boundaries)
	 * @returns {boolean} Whether the operation was successful
	 */
	previousLesson() {
		// Try previous lesson in current module
		if (this.setLessonByIndex(this.currentLessonIndex - 1)) {
			return true;
		}

		// At start of module, try previous module
		const currentModuleIndex = this.modules.findIndex((m) => m.id === this.currentModule?.id);
		if (currentModuleIndex > 0) {
			const prevModule = this.modules[currentModuleIndex - 1];
			this.setModule(prevModule);
			// Go to last lesson of previous module
			const lastIndex = prevModule.lessons.length - 1;
			this.setLessonByIndex(lastIndex);
			return true;
		}

		return false;
	}

	/**
	 * Apply user-written CSS to the preview area
	 * @param {string} code - User CSS code
	 * @param {boolean} forceUpdate - Force update the preview even if code hasn't changed
	 */
	applyUserCode(code, forceUpdate = false) {
		if (!this.currentLesson) return;

		this.userCode = code;

		// Save user code for this lesson
		const lessonKey = `${this.currentModule.id}-${this.currentLessonIndex}`;
		this.userCodeMap.set(lessonKey, code);
		this.saveUserCodeToStorage();

		// Only re-render if code changed or forced update
		if (forceUpdate || this.lastRenderedCode !== code) {
			this.lastRenderedCode = code;
			this.renderPreview();
		}
	}

	/**
	 * Get the complete CSS by combining all parts
	 * @returns {string} The complete CSS
	 */
	getCompleteCss() {
		if (!this.currentLesson) return "";

		const { codePrefix, codeSuffix } = this.currentLesson;

		return `
			${codePrefix || ""}
			${this.userCode || ""}
			${codeSuffix || ""}
		`;
	}

	/**
	 * Render the preview for the current lesson
	 */
	renderPreview() {
		if (!this.currentLesson) return;

		const mode = this.currentLesson.mode || this.currentModule?.mode || "css";
		const { previewHTML, previewBaseCSS, previewContainer, sandboxCSS } = this.currentLesson;

		const iframe = document.createElement("iframe");
		iframe.style.width = "100%";
		iframe.style.height = "100%";
		iframe.style.border = "none";
		iframe.title = "Preview";

		const container = document.getElementById(previewContainer || "preview-area");
		container.innerHTML = "";
		container.appendChild(iframe);

		const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
		iframeDoc.open();

		if (mode === "html") {
			// For HTML mode, user code IS the HTML content
			const userHtml = this.userCode || "";
			iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${previewBaseCSS || ""}</style>
          <style>${sandboxCSS || ""}</style>
        </head>
        <body>
          ${userHtml}
        </body>
      </html>
    `);
		} else if (mode === "tailwind") {
			// For Tailwind mode, user code goes directly in HTML classes
			const htmlWithClasses = this.injectTailwindClasses(previewHTML, this.userCode);
			iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>${previewBaseCSS}</style>
          <style>${sandboxCSS}</style>
        </head>
        <body>
          ${htmlWithClasses}
        </body>
      </html>
    `);
		} else {
			// Original CSS mode
			const userCssWithWrapper = this.getCompleteCss();
			iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${previewBaseCSS}</style>
          <style>${userCssWithWrapper}</style>
          <style>${sandboxCSS}</style>
        </head>
        <body>
          ${previewHTML}
        </body>
      </html>
    `);
		}

		iframeDoc.close();
	}

	injectTailwindClasses(html, userClasses) {
		// Replace placeholder in HTML with user's Tailwind classes
		return html.replace(/{{USER_CLASSES}}/g, userClasses);
	}

	/**
	 * Render the expected/solution preview for comparison
	 */
	renderExpectedPreview() {
		if (!this.currentLesson) return;

		// Use 'solution' property from lesson JSON (not 'solutionCode')
		const solutionCode = this.currentLesson.solution;
		if (!solutionCode) {
			// No solution code provided, hide the expected pane or show placeholder
			const expectedContainer = document.getElementById("preview-expected");
			if (expectedContainer) {
				expectedContainer.innerHTML = '<div style="color: #999; font-size: 0.9rem; text-align: center;">No expected output available</div>';
			}
			return;
		}

		const mode = this.currentLesson.mode || this.currentModule?.mode || "css";
		const { previewHTML, previewBaseCSS, sandboxCSS } = this.currentLesson;

		const iframe = document.createElement("iframe");
		iframe.style.width = "100%";
		iframe.style.height = "100%";
		iframe.style.border = "none";
		iframe.title = "Expected Result";

		const container = document.getElementById("preview-expected");
		if (!container) return;

		container.innerHTML = "";
		container.appendChild(iframe);

		const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
		iframeDoc.open();

		if (mode === "html") {
			// For HTML mode, solution code IS the HTML content
			iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${previewBaseCSS || ""}</style>
          <style>${sandboxCSS || ""}</style>
        </head>
        <body>
          ${solutionCode}
        </body>
      </html>
    `);
		} else if (mode === "tailwind") {
			// For Tailwind mode, inject solution classes into HTML
			const htmlWithClasses = this.injectTailwindClasses(previewHTML, solutionCode);
			iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>${previewBaseCSS}</style>
          <style>${sandboxCSS}</style>
        </head>
        <body>
          ${htmlWithClasses}
        </body>
      </html>
    `);
		} else {
			// CSS mode - wrap solution with prefix/suffix
			const { codePrefix, codeSuffix } = this.currentLesson;
			const solutionCss = `${codePrefix || ""}${solutionCode}${codeSuffix || ""}`;
			iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${previewBaseCSS}</style>
          <style>${solutionCss}</style>
          <style>${sandboxCSS}</style>
        </head>
        <body>
          ${previewHTML}
        </body>
      </html>
    `);
		}

		iframeDoc.close();
	}

	/**
	 * Show merge animation when student's output matches expected
	 */
	showMatchAnimation() {
		const overlay = document.getElementById("match-overlay");
		const comparison = document.getElementById("preview-comparison");

		if (overlay && comparison) {
			overlay.classList.add("matched");
			comparison.classList.add("matched");

			// Remove animation classes after delay
			setTimeout(() => {
				overlay.classList.remove("matched");
				comparison.classList.remove("matched");
			}, 2500);
		}
	}

	/**
	 * Hide match animation
	 */
	hideMatchAnimation() {
		const overlay = document.getElementById("match-overlay");
		const comparison = document.getElementById("preview-comparison");

		if (overlay) overlay.classList.remove("matched");
		if (comparison) comparison.classList.remove("matched");
	}

	/**
	 * Validate user code against the current lesson's requirements
	 * @returns {Object} Validation result
	 */
	validateCode() {
		if (!this.currentLesson) {
			return { isValid: false, message: "No active lesson to validate against." };
		}

		const result = validateUserCode(this.userCode, this.currentLesson);

		// Mark lesson as completed if valid
		if (result.isValid) {
			const moduleProgress = this.userProgress[this.currentModule.id];
			if (!moduleProgress.completed.includes(this.currentLessonIndex)) {
				moduleProgress.completed.push(this.currentLessonIndex);
				this.saveUserProgress();
			}
		}

		return result;
	}

	/**
	 * Check if current lesson is completed
	 * @returns {boolean} Whether the lesson is completed
	 */
	isCurrentLessonCompleted() {
		if (!this.currentModule) return false;

		const moduleProgress = this.userProgress[this.currentModule.id];
		return moduleProgress && moduleProgress.completed.includes(this.currentLessonIndex);
	}

	/**
	 * Get completion status for a specific lesson
	 * @param {string} moduleId - Module ID
	 * @param {number} lessonIndex - Lesson index
	 * @returns {boolean} Whether the lesson is completed
	 */
	isLessonCompleted(moduleId, lessonIndex) {
		const moduleProgress = this.userProgress[moduleId];
		return moduleProgress && moduleProgress.completed.includes(lessonIndex);
	}

	/**
	 * Get the current state of the lesson
	 * @returns {Object} The current lesson state
	 */
	getCurrentState() {
		const currentModuleIndex = this.modules.findIndex((m) => m.id === this.currentModule?.id);
		const isLastLesson = this.currentLessonIndex >= (this.currentModule ? this.currentModule.lessons.length - 1 : 0);
		const isFirstLesson = this.currentLessonIndex === 0;
		const isLastModule = currentModuleIndex >= this.modules.length - 1;
		const isFirstModule = currentModuleIndex <= 0;

		return {
			module: this.currentModule,
			lesson: this.currentLesson,
			lessonIndex: this.currentLessonIndex,
			userCode: this.userCode,
			totalLessons: this.currentModule ? this.currentModule.lessons.length : 0,
			isCompleted: this.isCurrentLessonCompleted(),
			canGoNext: !isLastLesson || !isLastModule,
			canGoPrev: !isFirstLesson || !isFirstModule
		};
	}

	/**
	 * Get overall progress statistics
	 * @returns {Object} Progress statistics
	 */
	getProgressStats() {
		let totalLessons = 0;
		let totalCompleted = 0;

		this.modules.forEach((module) => {
			totalLessons += module.lessons.length;
			const progress = this.userProgress[module.id];
			if (progress && progress.completed) {
				totalCompleted += progress.completed.length;
			}
		});

		return {
			totalLessons,
			totalCompleted,
			percentComplete: totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
		};
	}

	/**
	 * Save progress to localStorage
	 */
	saveUserProgress() {
		try {
			const progressData = {
				...this.userProgress,
				lastModuleId: this.currentModule?.id,
				timestamp: new Date().toISOString()
			};
			localStorage.setItem("codeCrispies.progress", JSON.stringify(progressData));
		} catch (e) {
			console.error("Error saving progress:", e);
		}
	}

	/**
	 * Load progress from localStorage
	 */
	loadUserProgress() {
		try {
			const savedProgress = localStorage.getItem("codeCrispies.progress");
			if (savedProgress) {
				const progressData = JSON.parse(savedProgress);

				// Extract user progress, excluding metadata
				const { lastModuleId, timestamp, ...userProgress } = progressData;
				this.userProgress = userProgress;

				return { lastModuleId, timestamp };
			}
		} catch (e) {
			console.error("Error loading progress:", e);
		}
		return null;
	}

	/**
	 * Save user code to localStorage
	 */
	saveUserCodeToStorage() {
		try {
			localStorage.setItem("codeCrispies.userCode", JSON.stringify(Array.from(this.userCodeMap.entries())));
		} catch (e) {
			console.error("Error saving user code:", e);
		}
	}

	/**
	 * Load user code from localStorage
	 */
	loadUserCodeFromStorage() {
		try {
			const savedCode = localStorage.getItem("codeCrispies.userCode");
			if (savedCode) {
				const codeEntries = JSON.parse(savedCode);
				this.userCodeMap = new Map(codeEntries);
			}
		} catch (e) {
			console.error("Error loading user code:", e);
		}
	}

	/**
	 * Reset the current lesson
	 */
	reset() {
		if (this.currentLesson) {
			this.userCode = this.currentLesson.initialCode || "";

			// Clear saved user code for this lesson
			const lessonKey = `${this.currentModule.id}-${this.currentLessonIndex}`;
			this.userCodeMap.delete(lessonKey);
			this.saveUserCodeToStorage();

			this.renderPreview();
		}
	}

	/**
	 * Clear all saved progress and user code
	 */
	clearProgress() {
		this.userProgress = {};
		this.userCodeMap.clear();
		localStorage.removeItem("codeCrispies.progress");
		localStorage.removeItem("codeCrispies.userCode");
		localStorage.removeItem("codeCrispies.lastModuleId");
	}
}
