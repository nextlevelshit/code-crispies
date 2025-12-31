import { LessonEngine } from "./impl/LessonEngine.js";
import { CodeEditor } from "./impl/CodeEditor.js";
import { renderLesson, renderModuleList, renderLevelIndicator, updateActiveLessonInSidebar } from "./helpers/renderer.js";
import { loadModules } from "./config/lessons.js";
import { initI18n, t, getLanguage, setLanguage, getNextLanguage, applyTranslations } from "./i18n.js";

// Simplified state - LessonEngine now manages lesson state and progress
const state = {
	userSettings: {
		disableFeedbackErrors: false
	},
	showExpected: false
};

// DOM elements - updated for new layout
const elements = {
	// Header
	menuBtn: document.getElementById("menu-btn"),
	logoLink: document.getElementById("logo-link"),
	langBtn: document.getElementById("lang-btn"),
	helpBtn: document.getElementById("help-btn"),

	// Left panel
	instructionsSection: document.querySelector(".instructions"),
	editorSection: document.querySelector(".editor-section"),
	modulePill: document.getElementById("module-pill"),
	moduleName: document.querySelector(".module-name"),
	lessonTitle: document.getElementById("lesson-title"),
	lessonDescription: document.getElementById("lesson-description"),
	taskInstruction: document.getElementById("task-instruction"),
	codeInput: document.getElementById("code-input"),
	runBtn: document.getElementById("run-btn"),
	undoBtn: document.getElementById("undo-btn"),
	redoBtn: document.getElementById("redo-btn"),
	resetCodeBtn: document.getElementById("reset-code-btn"),
	hintArea: document.getElementById("hint-area"),
	editorContent: document.querySelector(".editor-content"),
	codeEditor: document.querySelector(".code-editor"),

	// Right panel
	previewArea: document.getElementById("preview-area"),
	showExpectedBtn: document.getElementById("show-expected-btn"),
	expectedOverlay: document.getElementById("expected-overlay"),
	previewWrapper: document.querySelector(".preview-wrapper"),
	prevBtn: document.getElementById("prev-btn"),
	nextBtn: document.getElementById("next-btn"),
	levelIndicator: document.getElementById("level-indicator"),

	// Sidebar
	sidebarDrawer: document.getElementById("sidebar-drawer"),
	sidebarBackdrop: document.getElementById("sidebar-backdrop"),
	closeSidebar: document.getElementById("close-sidebar"),
	moduleList: document.getElementById("module-list"),
	progressFill: document.getElementById("progress-fill"),
	progressText: document.getElementById("progress-text"),
	resetBtn: document.getElementById("reset-btn"),
	disableFeedbackToggle: document.getElementById("disable-feedback-toggle"),

	// Dialogs
	helpDialog: document.getElementById("help-dialog"),
	helpDialogClose: document.getElementById("help-dialog-close"),
	resetDialog: document.getElementById("reset-dialog"),
	resetDialogClose: document.getElementById("reset-dialog-close"),
	cancelReset: document.getElementById("cancel-reset"),
	confirmReset: document.getElementById("confirm-reset")
};

// Initialize the lesson engine - now the single source of truth
const lessonEngine = new LessonEngine();

// Code editor instance (initialized later)
let codeEditor = null;
let currentMode = "css";

// ================= SIDEBAR FUNCTIONS =================

// Track element that opened sidebar for focus return
let sidebarTrigger = null;

function openSidebar() {
	// Store trigger element for focus return
	sidebarTrigger = document.activeElement;

	elements.sidebarDrawer.classList.add("open");
	elements.sidebarBackdrop.classList.add("visible");

	// Move focus to close button for keyboard users
	elements.closeSidebar.focus();
}

function closeSidebar() {
	elements.sidebarDrawer.classList.remove("open");
	elements.sidebarBackdrop.classList.remove("visible");

	// Return focus to trigger element
	if (sidebarTrigger && typeof sidebarTrigger.focus === "function") {
		sidebarTrigger.focus();
		sidebarTrigger = null;
	}
}

// ================= EXPECTED RESULT TOGGLE =================

function toggleExpectedResult() {
	state.showExpected = !state.showExpected;

	if (state.showExpected) {
		elements.expectedOverlay.classList.add("visible");
		elements.showExpectedBtn.textContent = t("hideExpected");
		elements.showExpectedBtn.classList.add("btn-primary");
	} else {
		elements.expectedOverlay.classList.remove("visible");
		elements.showExpectedBtn.textContent = t("showExpected");
		elements.showExpectedBtn.classList.remove("btn-primary");
	}
}

// ================= LANGUAGE TOGGLE =================

function toggleLanguage() {
	const currentLang = getLanguage();
	const newLang = getNextLanguage(currentLang);

	// Add transition class before any updates
	elements.editorSection?.classList.add("transitioning");

	setLanguage(newLang);
	applyTranslations();

	// Reload lessons in new language
	const engineState = lessonEngine.getCurrentState();
	const currentModuleId = engineState.module?.id;
	const currentLessonIndex = engineState.lessonIndex;

	const modules = loadModules(newLang);
	lessonEngine.setModules(modules);
	renderModuleList(elements.moduleList, modules, selectModule, selectLesson);

	// Restore position in current module/lesson
	if (currentModuleId) {
		lessonEngine.setModuleById(currentModuleId);
		lessonEngine.setLessonByIndex(currentLessonIndex);
		loadCurrentLesson();
	}

	updateProgressDisplay();

	// Remove transition class after all updates
	requestAnimationFrame(() => {
		elements.editorSection?.classList.remove("transitioning");
	});
}

// ================= HINT SYSTEM =================

function showHint(message, step, total, isSuccess = false) {
	const hintClass = isSuccess ? "hint hint-success" : "hint";
	elements.hintArea.innerHTML = `
		<div class="${hintClass}">
			<span class="hint-progress">${step}/${total}</span>
			<span class="hint-message">${message}</span>
		</div>
	`;
}

function clearHint() {
	elements.hintArea.innerHTML = "";
}

function showSuccessHint(message) {
	elements.hintArea.innerHTML = `
		<div class="hint hint-success">
			<span class="hint-progress">✓</span>
			<span class="hint-message">${message}</span>
		</div>
	`;
}

// ================= PROGRESS DISPLAY =================

function updateProgressDisplay() {
	const stats = lessonEngine.getProgressStats();
	elements.progressFill.style.width = `${stats.percentComplete}%`;
	elements.progressText.textContent = t("progressText", {
		percent: stats.percentComplete,
		completed: stats.totalCompleted,
		total: stats.totalLessons
	});
}

// ================= USER SETTINGS =================

function loadUserSettings() {
	const savedSettings = localStorage.getItem("codeCrispies.settings");
	if (savedSettings) {
		try {
			const settings = JSON.parse(savedSettings);
			state.userSettings = { ...state.userSettings, ...settings };
			elements.disableFeedbackToggle.checked = !state.userSettings.disableFeedbackErrors;
		} catch (e) {
			console.error("Error loading user settings:", e);
		}
	}
}

function saveUserSettings() {
	localStorage.setItem("codeCrispies.settings", JSON.stringify(state.userSettings));
}

// ================= LESSON CACHE =================

let cachedUserCode = null;

function restoreLessonCache() {
	try {
		const cached = localStorage.getItem("codeCrispies.lessonCache");
		if (cached) {
			const data = JSON.parse(cached);
			if (data.moduleTitle && elements.moduleName) {
				elements.moduleName.textContent = data.moduleTitle;
				// Remove data-i18n so applyTranslations won't overwrite
				elements.moduleName.removeAttribute("data-i18n");
			}
			if (data.lessonTitle && elements.lessonTitle) {
				elements.lessonTitle.textContent = data.lessonTitle;
				elements.lessonTitle.removeAttribute("data-i18n");
			}
			if (data.lessonDescription && elements.lessonDescription) {
				elements.lessonDescription.innerHTML = data.lessonDescription;
			}
			if (data.taskInstruction && elements.taskInstruction) {
				elements.taskInstruction.innerHTML = data.taskInstruction;
			}
			if (data.levelIndicator && elements.levelIndicator) {
				elements.levelIndicator.innerHTML = data.levelIndicator;
			}
			// Store userCode to apply after editor init
			if (data.userCode) {
				cachedUserCode = data.userCode;
			}
		}
	} catch (e) {
		// Ignore cache errors
	}
}

// ================= MODULE INITIALIZATION =================

let loadingTimeout = null;

function showLoadingFallback() {
	// Only show if no lesson is loaded yet
	if (!elements.lessonTitle.textContent) {
		elements.lessonDescription.innerHTML = `
			<div class="loading-fallback">
				<p>${t("loadingFallbackText")}</p>
				<button class="btn btn-text" onclick="document.getElementById('help-btn').click()">
					${t("help")}
				</button>
			</div>
		`;
	}
}

function clearLoadingTimeout() {
	if (loadingTimeout) {
		clearTimeout(loadingTimeout);
		loadingTimeout = null;
	}
}

function initializeModules() {
	try {
		const modules = loadModules(getLanguage());
		lessonEngine.setModules(modules);

		// Use the new renderModuleList function with both callbacks
		renderModuleList(elements.moduleList, modules, selectModule, selectLesson);

		// Load saved progress and select appropriate module
		const progressData = lessonEngine.loadUserProgress();
		const lastModuleId = progressData?.lastModuleId;

		if (lastModuleId && modules.find((m) => m.id === lastModuleId)) {
			selectModule(lastModuleId);
		} else if (modules.length > 0) {
			selectModule(modules[0].id);
		}

		updateProgressDisplay();
		clearLoadingTimeout();
	} catch (error) {
		console.error("Failed to load modules:", error);
		showLoadingFallback();
	}
}

// ================= MODULE/LESSON SELECTION =================

function selectModule(moduleId) {
	const success = lessonEngine.setModuleById(moduleId);
	if (!success) return;

	// Update module list UI to highlight the active module
	const moduleItems = elements.moduleList.querySelectorAll(".module-header");
	moduleItems.forEach((item) => {
		item.classList.remove("active");
		if (item.dataset.moduleId === moduleId) {
			item.classList.add("active");
		}
	});

	loadCurrentLesson();
	resetSuccessIndicators();

	// Close sidebar after selection on mobile
	if (window.innerWidth <= 768) {
		closeSidebar();
	}
}

function selectLesson(moduleId, lessonIndex) {
	const currentState = lessonEngine.getCurrentState();
	if (!currentState.module || currentState.module.id !== moduleId) {
		lessonEngine.setModuleById(moduleId);
	}

	lessonEngine.setLessonByIndex(lessonIndex);
	loadCurrentLesson();

	// Close sidebar after selection on mobile
	if (window.innerWidth <= 768) {
		closeSidebar();
	}
}

// ================= LESSON LOADING =================

function resetSuccessIndicators() {
	elements.codeEditor.classList.remove("success-highlight");
	elements.lessonTitle.classList.remove("success-text");
	elements.nextBtn.classList.remove("success");
	elements.taskInstruction.classList.remove("success-instruction");
	elements.runBtn.classList.remove("success");
	elements.previewWrapper?.classList.remove("matched");
}

function updateEditorForMode(mode) {
	const editorLabel = document.querySelector(".editor-label");

	const modeConfig = {
		html: {
			placeholder: "Type HTML here... Try: nav>ul>li*3 then press Tab",
			label: "HTML Editor",
			cmMode: "html"
		},
		tailwind: {
			placeholder: t("tailwindPlaceholder"),
			label: "Tailwind Classes",
			cmMode: "css"
		},
		css: {
			placeholder: "Enter your CSS code here...",
			label: "CSS Editor",
			cmMode: "css"
		},
		playground: {
			placeholder: "<style>\n  /* CSS here */\n</style>\n\n<!-- HTML here -->",
			label: "HTML & CSS",
			cmMode: "html"
		}
	};

	const config = modeConfig[mode] || modeConfig.css;
	if (editorLabel) editorLabel.textContent = config.label;

	// Update CodeMirror mode if needed
	if (codeEditor && currentMode !== config.cmMode) {
		currentMode = config.cmMode;
		codeEditor.setMode(config.cmMode);
	}
}

function loadCurrentLesson() {
	const engineState = lessonEngine.getCurrentState();

	if (!engineState.module || !engineState.lesson) {
		return;
	}

	const lesson = engineState.lesson;
	const mode = lesson.mode || engineState.module?.mode || "css";
	const isPlayground = lesson.mode === "playground";

	// Handle playground mode - hide instructions, full height editor
	if (isPlayground) {
		elements.instructionsSection?.classList.add("hidden");
		elements.editorSection?.classList.add("playground-mode");
	} else {
		elements.instructionsSection?.classList.remove("hidden");
		elements.editorSection?.classList.remove("playground-mode");
	}

	// Add transition class for smooth content swap
	elements.editorSection?.classList.add("transitioning");

	// Update UI based on mode
	updateEditorForMode(mode);

	// Update module name in pill
	if (elements.moduleName && engineState.module) {
		elements.moduleName.textContent = engineState.module.title;
	}

	// Reset any success indicators
	resetSuccessIndicators();

	// Clear hints
	clearHint();

	// Hide expected overlay
	state.showExpected = false;
	elements.expectedOverlay.classList.remove("visible");
	elements.showExpectedBtn.textContent = t("showExpected");
	elements.showExpectedBtn.classList.remove("btn-primary");

	// Update UI
	renderLesson(
		elements.lessonTitle,
		elements.lessonDescription,
		elements.taskInstruction,
		elements.previewArea,
		null, // editorPrefix no longer used
		null, // codeInput no longer used (using CodeMirror)
		null, // editorSuffix no longer used
		lesson
	);

	// Set user code in CodeMirror
	if (codeEditor) {
		codeEditor.setValue(engineState.userCode);
	}

	// Update Run button text based on completion status
	if (engineState.isCompleted) {
		elements.runBtn.querySelector("span").textContent = t("rerun");

		// Add completion badge if not present
		if (!document.querySelector(".completion-badge")) {
			const badge = document.createElement("span");
			badge.className = "completion-badge";
			badge.textContent = t("completed");
			elements.lessonTitle.appendChild(badge);
		}
	} else {
		elements.runBtn.querySelector("span").textContent = t("run");

		// Remove completion badge if exists
		const badge = document.querySelector(".completion-badge");
		if (badge) badge.remove();
	}

	// Update level indicator
	renderLevelIndicator(elements.levelIndicator, engineState.lessonIndex + 1, engineState.totalLessons);

	// Update active lesson in sidebar
	updateActiveLessonInSidebar(engineState.module.id, engineState.lessonIndex);

	// Update navigation buttons
	updateNavigationButtons();

	// Update progress display
	updateProgressDisplay();

	// Focus on the code editor
	if (codeEditor) {
		codeEditor.focus();
	}

	// Render the expected/solution preview
	lessonEngine.renderExpectedPreview();

	// Remove transition class after content is updated
	requestAnimationFrame(() => {
		elements.editorSection?.classList.remove("transitioning");
	});

	// Cache lesson display data for instant restore on reload
	try {
		localStorage.setItem(
			"codeCrispies.lessonCache",
			JSON.stringify({
				moduleTitle: engineState.module?.title,
				lessonTitle: lesson.title,
				lessonDescription: lesson.description,
				taskInstruction: lesson.task,
				levelIndicator: elements.levelIndicator?.innerHTML,
				userCode: engineState.userCode,
				mode: mode
			})
		);
	} catch (e) {
		// Ignore storage errors
	}
}

// ================= LIVE PREVIEW =================

let previewTimer = null;

function handleEditorChange(code) {
	if (previewTimer) {
		clearTimeout(previewTimer);
	}

	previewTimer = setTimeout(() => {
		runCode();
	}, 800);
}

// ================= NAVIGATION =================

function updateNavigationButtons() {
	const engineState = lessonEngine.getCurrentState();

	elements.prevBtn.disabled = !engineState.canGoPrev;
	elements.nextBtn.disabled = !engineState.canGoNext;

	elements.prevBtn.classList.toggle("btn-disabled", !engineState.canGoPrev);
	elements.nextBtn.classList.toggle("btn-disabled", !engineState.canGoNext);
}

function nextLesson() {
	const prevModuleId = lessonEngine.getCurrentState().module?.id;
	const success = lessonEngine.nextLesson();
	if (success) {
		const newModuleId = lessonEngine.getCurrentState().module?.id;
		if (newModuleId !== prevModuleId) {
			updateModuleHighlight(newModuleId);
		}
		loadCurrentLesson();
	}
}

function prevLesson() {
	const prevModuleId = lessonEngine.getCurrentState().module?.id;
	const success = lessonEngine.previousLesson();
	if (success) {
		const newModuleId = lessonEngine.getCurrentState().module?.id;
		if (newModuleId !== prevModuleId) {
			updateModuleHighlight(newModuleId);
		}
		loadCurrentLesson();
	}
}

function updateModuleHighlight(moduleId) {
	const moduleItems = elements.moduleList.querySelectorAll(".module-header");
	moduleItems.forEach((item) => {
		item.classList.remove("active");
		if (item.dataset.moduleId === moduleId) {
			item.classList.add("active");
		}
	});
}

// ================= CODE EXECUTION =================

function resetCode() {
	// Reset editor to initial code for current lesson
	lessonEngine.reset();
	const engineState = lessonEngine.getCurrentState();
	if (codeEditor && engineState.lesson) {
		codeEditor.setValue(engineState.lesson.initialCode || "");
	}
	// Clear hints and success indicators
	clearHint();
	resetSuccessIndicators();
}

function runCode() {
	const userCode = codeEditor ? codeEditor.getValue() : "";
	const engineState = lessonEngine.getCurrentState();
	const isPlayground = engineState.lesson?.mode === "playground";

	// Rotate the Run button icon
	const runButtonImg = document.querySelector("#run-btn img");
	if (runButtonImg) {
		const currentRotation = parseInt(runButtonImg.style.transform?.match(/\d+/)?.[0] || "0");
		runButtonImg.style.transform = `rotate(${currentRotation + 180}deg)`;
	}

	// Apply the code to the preview via LessonEngine
	lessonEngine.applyUserCode(userCode, true);

	// Skip validation for playground mode
	if (isPlayground) {
		return;
	}

	// Validate code using LessonEngine
	const validationResult = lessonEngine.validateCode();

	if (validationResult.isValid) {
		// Show success hint
		showSuccessHint(validationResult.message || t("successMessage"));

		// Update Run button
		elements.runBtn.querySelector("span").textContent = t("rerun");
		elements.runBtn.classList.add("success");

		// Add completion badge
		if (!document.querySelector(".completion-badge")) {
			const badge = document.createElement("span");
			badge.className = "completion-badge";
			badge.textContent = t("completed");
			elements.lessonTitle.appendChild(badge);
		}

		// Add success visual indicators
		elements.codeEditor.classList.add("success-highlight");
		elements.lessonTitle.classList.add("success-text");
		elements.nextBtn.classList.add("success");
		elements.taskInstruction.classList.add("success-instruction");

		// Show match animation (DVD-style bouncing)
		elements.previewWrapper?.classList.add("matched");
		setTimeout(() => {
			elements.previewWrapper?.classList.remove("matched");
		}, 10000);

		updateNavigationButtons();
		updateProgressDisplay();
	} else {
		// Reset success indicators
		resetSuccessIndicators();

		// Show hint with step progress
		const step = validationResult.validCases + 1;
		const total = validationResult.totalCases;

		// Only show hints if enabled
		if (!state.userSettings.disableFeedbackErrors) {
			showHint(validationResult.message || t("keepTrying"), step, total);
		}
	}
}

// ================= DIALOGS =================

function showHelp() {
	elements.helpDialog.showModal();
}

function closeHelpDialog() {
	elements.helpDialog.close();
}

function showResetConfirmation() {
	elements.resetDialog.showModal();
}

function closeResetDialog() {
	elements.resetDialog.close();
}

function handleResetConfirm() {
	lessonEngine.clearProgress();
	closeResetDialog();
	closeSidebar();

	// Reload first module
	const modules = lessonEngine.modules;
	if (modules.length > 0) {
		selectModule(modules[0].id);
	}

	updateProgressDisplay();
}

// ================= INITIALIZATION =================

function initCodeEditor() {
	const container = elements.editorContent;
	if (!container) return;

	// Remove the textarea - CodeMirror will replace it
	const textarea = container.querySelector("textarea");
	if (textarea) {
		textarea.remove();
	}

	// Initialize CodeMirror
	codeEditor = new CodeEditor(container, {
		mode: currentMode,
		placeholder: "Type your code here...",
		onChange: handleEditorChange
	});

	codeEditor.init("");
}

function init() {
	// Initialize i18n before anything else
	initI18n();

	loadUserSettings();

	// Restore cached lesson content immediately to avoid "Loading..." flash
	restoreLessonCache();

	// Initialize CodeMirror editor
	initCodeEditor();

	// Set timeout to show fallback if loading takes too long
	loadingTimeout = setTimeout(showLoadingFallback, 3000);

	// Load modules after editor is ready
	initializeModules();

	// Sidebar controls
	elements.menuBtn.addEventListener("click", openSidebar);
	elements.closeSidebar.addEventListener("click", closeSidebar);
	elements.sidebarBackdrop.addEventListener("click", closeSidebar);

	// Logo click - navigate to welcome
	elements.logoLink.addEventListener("click", (e) => {
		e.preventDefault();
		lessonEngine.setModuleById("welcome");
		loadCurrentLesson();
	});

	// Language toggle
	elements.langBtn.addEventListener("click", toggleLanguage);

	// Expected result toggle
	elements.showExpectedBtn.addEventListener("click", toggleExpectedResult);

	// Navigation
	elements.prevBtn.addEventListener("click", prevLesson);
	elements.nextBtn.addEventListener("click", nextLesson);
	elements.runBtn.addEventListener("click", runCode);

	// Editor tools
	elements.undoBtn.addEventListener("click", () => {
		if (codeEditor) codeEditor.undo();
	});
	elements.redoBtn.addEventListener("click", () => {
		if (codeEditor) codeEditor.redo();
	});
	elements.resetCodeBtn.addEventListener("click", resetCode);

	// Dialogs
	elements.helpBtn.addEventListener("click", showHelp);
	elements.helpDialogClose.addEventListener("click", closeHelpDialog);
	elements.helpDialog.addEventListener("click", (e) => {
		if (e.target === elements.helpDialog) closeHelpDialog();
	});
	elements.resetBtn.addEventListener("click", showResetConfirmation);
	elements.resetDialogClose.addEventListener("click", closeResetDialog);
	elements.resetDialog.addEventListener("click", (e) => {
		if (e.target === elements.resetDialog) closeResetDialog();
	});
	elements.cancelReset.addEventListener("click", closeResetDialog);
	elements.confirmReset.addEventListener("click", handleResetConfirm);

	// Settings
	elements.disableFeedbackToggle.addEventListener("change", (e) => {
		state.userSettings.disableFeedbackErrors = !e.target.checked;
		saveUserSettings();
	});

	// Click on editor content to focus CodeMirror
	elements.editorContent?.addEventListener("click", () => {
		if (codeEditor) codeEditor.focus();
	});

	// Keyboard shortcuts
	document.addEventListener("keydown", (e) => {
		// Ctrl+Enter to run code
		if (e.ctrlKey && e.key === "Enter") {
			runCode();
			e.preventDefault();
		}

		// Escape to close sidebar (dialogs handle Escape natively)
		if (e.key === "Escape") {
			closeSidebar();
		}
	});
}

// Start the application
init();
