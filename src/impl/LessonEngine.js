/**
 * LessonEngine - Core class for managing lessons and user progress
 * React-compatible version without DOM manipulation
 */
import { validateUserCode } from "../helpers/validator.js";

export class LessonEngine {
	constructor() {
		this.currentLesson = null;
		this.userCode = "";
		this.currentModule = null;
		this.currentLessonIndex = 0;
		this.modules = [];
		this.userProgress = {}; // Format: { moduleId: { completed: [0, 2, 3], current: 4 } }
		this.userCodeMap = new Map(); // Store user code for each lesson
		this.subscribers = new Set(); // For state change notifications
		this.loadUserProgress();
	}

	/**
	 * Subscribe to state changes
	 * @param {Function} callback - Function to call when state changes
	 * @returns {Function} Unsubscribe function
	 */
	subscribe(callback) {
		this.subscribers.add(callback);
		return () => this.subscribers.delete(callback);
	}

	/**
	 * Notify all subscribers of state changes
	 */
	notifyStateChange() {
		this.subscribers.forEach((callback) => callback(this.getCurrentState()));
	}

	/**
	 * Initialize with modules array
	 * @param {Array} modules - Available modules
	 */
	setModules(modules) {
		this.modules = modules;
		this.loadUserCodeFromStorage();
		this.notifyStateChange();
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
		this.notifyStateChange();
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

		this.notifyStateChange();
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
	 * Move to the next lesson
	 * @returns {boolean} Whether the operation was successful
	 */
	nextLesson() {
		return this.setLessonByIndex(this.currentLessonIndex + 1);
	}

	/**
	 * Move to the previous lesson
	 * @returns {boolean} Whether the operation was successful
	 */
	previousLesson() {
		return this.setLessonByIndex(this.currentLessonIndex - 1);
	}

	/**
	 * Apply user-written code
	 * @param {string} code - User code
	 */
	applyUserCode(code) {
		if (!this.currentLesson) return;

		this.userCode = code;

		// Save user code for this lesson
		const lessonKey = `${this.currentModule.id}-${this.currentLessonIndex}`;
		this.userCodeMap.set(lessonKey, code);
		this.saveUserCodeToStorage();

		this.notifyStateChange();
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
		`.trim();
	}

	/**
	 * Get preview content for rendering
	 * @returns {Object} Preview content object
	 */
	getPreviewContent() {
		if (!this.currentLesson) return null;

		const mode = this.currentLesson.mode || this.currentModule?.mode || "css";
		const { previewHTML, previewBaseCSS, sandboxCSS } = this.currentLesson;

		if (mode === "tailwind") {
			// For Tailwind mode, user code goes directly in HTML classes
			const htmlWithClasses = this.injectTailwindClasses(previewHTML, this.userCode);
			return {
				mode: "tailwind",
				html: htmlWithClasses,
				baseCSS: previewBaseCSS,
				sandboxCSS: sandboxCSS,
				tailwindCDN: "https://cdn.tailwindcss.com"
			};
		} else {
			// Original CSS mode
			const userCssWithWrapper = this.getCompleteCss();
			return {
				mode: "css",
				html: previewHTML,
				baseCSS: previewBaseCSS,
				userCSS: userCssWithWrapper,
				sandboxCSS: sandboxCSS
			};
		}
	}

	/**
	 * Inject Tailwind classes into HTML
	 * @param {string} html - HTML template
	 * @param {string} userClasses - User's Tailwind classes
	 * @returns {string} HTML with injected classes
	 */
	injectTailwindClasses(html, userClasses) {
		return html.replace(/{{USER_CLASSES}}/g, userClasses);
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
				this.notifyStateChange();
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
		return {
			module: this.currentModule,
			lesson: this.currentLesson,
			lessonIndex: this.currentLessonIndex,
			userCode: this.userCode,
			totalLessons: this.currentModule ? this.currentModule.lessons.length : 0,
			isCompleted: this.isCurrentLessonCompleted(),
			canGoNext: this.currentLessonIndex < (this.currentModule ? this.currentModule.lessons.length - 1 : 0),
			canGoPrev: this.currentLessonIndex > 0,
			previewContent: this.getPreviewContent()
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

			this.notifyStateChange();
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
		this.notifyStateChange();
	}
}
