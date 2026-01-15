import { LessonEngine } from "./impl/LessonEngine.js";
import { CodeEditor } from "./impl/CodeEditor.js";
import { renderLesson, renderModuleList, renderLevelIndicator, updateActiveLessonInSidebar } from "./helpers/renderer.js";
import { loadModules } from "./config/lessons.js";
import { initI18n, t, getLanguage, setLanguage, applyTranslations } from "./i18n.js";
import { parseHash, updateHash, replaceHash, getShareableUrl, RouteType, navigateTo } from "./helpers/router.js";
import { sections, getSection, getModuleSection, getModulesBySection } from "./config/sections.js";
import { getRandomTemplate } from "./config/playground-templates.js";

// CodeMirror imports for syntax highlighting
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

// Simplified state - LessonEngine now manages lesson state and progress
const state = {
	userSettings: {
		disableFeedbackErrors: false,
		skipResetCodeConfirmation: false
	},
	showExpected: false,
	animationTimeout: null
};

// Track CodeMirror views for cleanup
let sectionCodeViews = [];

// Read-only CodeMirror theme for code examples
const readOnlyTheme = EditorView.theme(
	{
		"&": {
			fontSize: "13px"
		},
		".cm-content": {
			fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
			padding: "12px 0"
		},
		".cm-line": {
			padding: "0 12px"
		},
		".cm-gutters": {
			display: "none"
		}
	},
	{ dark: true }
);

/**
 * Highlight all code blocks in the section page using CodeMirror
 */
function highlightSectionCodeBlocks() {
	// Clean up previous views
	sectionCodeViews.forEach((view) => view.destroy());
	sectionCodeViews = [];

	// Find all code blocks in section page
	const codeBlocks = elements.sectionIntro?.querySelectorAll(".code-block") || [];

	codeBlocks.forEach((block) => {
		const pre = block.querySelector("pre");
		const code = block.querySelector("code");
		if (!pre || !code) return;

		const content = code.textContent || "";

		// Detect language from content
		const isHTML = content.includes("<") && content.includes(">");
		const langExtension = isHTML ? html() : css();

		// Create read-only CodeMirror view
		const state = EditorState.create({
			doc: content,
			extensions: [langExtension, oneDark, readOnlyTheme, EditorState.readOnly.of(true), EditorView.lineWrapping]
		});

		const view = new EditorView({
			state,
			parent: block
		});

		// Remove original pre/code
		pre.remove();

		sectionCodeViews.push(view);
	});
}

// DOM elements - updated for new layout
const elements = {
	// Header
	menuBtn: document.getElementById("menu-btn"),
	logoLink: document.getElementById("logo-link"),
	langSelect: document.getElementById("lang-select"),
	helpBtn: document.getElementById("help-btn"),
	mainNav: document.getElementById("main-nav"),

	// Page containers
	landingPage: document.getElementById("landing-page"),
	sectionPage: document.getElementById("section-page"),
	gameLayout: document.getElementById("main-content"),

	// Section page elements
	sectionTitle: document.getElementById("section-title"),
	sectionDescription: document.getElementById("section-description"),
	sectionProgressFill: document.getElementById("section-progress-fill"),
	sectionProgressText: document.getElementById("section-progress-text"),
	sectionIntro: document.getElementById("section-intro"),

	// Left panel
	instructionsSection: document.querySelector(".instructions"),
	editorSection: document.querySelector(".editor-section"),
	modulePill: document.getElementById("module-pill"),
	moduleName: document.querySelector(".module-name"),
	lessonTitle: document.getElementById("lesson-title"),
	lessonTitleRow: document.querySelector(".lesson-title-row"),
	lessonDescription: document.getElementById("lesson-description"),
	taskInstruction: document.getElementById("task-instruction"),
	codeInput: document.getElementById("code-input"),
	runBtn: document.getElementById("run-btn"),
	undoBtn: document.getElementById("undo-btn"),
	redoBtn: document.getElementById("redo-btn"),
	resetCodeBtn: document.getElementById("reset-code-btn"),
	randomTemplateBtn: document.getElementById("random-template-btn"),
	hintArea: document.getElementById("hint-area"),
	editorContent: document.querySelector(".editor-content"),
	codeEditor: document.querySelector(".code-editor"),

	// Right panel
	previewArea: document.getElementById("preview-area"),
	showExpectedBtn: document.getElementById("show-expected-btn"),
	expectedOverlay: document.getElementById("expected-overlay"),
	previewWrapper: document.querySelector(".preview-wrapper"),
	previewSection: document.querySelector(".preview-section"),
	prevBtn: document.getElementById("prev-btn"),
	nextBtn: document.getElementById("next-btn"),
	levelIndicator: document.getElementById("level-indicator"),
	headerLevelPill: document.getElementById("header-level-pill"),

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
	confirmReset: document.getElementById("confirm-reset"),
	resetCodeDialog: document.getElementById("reset-code-dialog"),
	resetCodeDialogClose: document.getElementById("reset-code-dialog-close"),
	cancelResetCode: document.getElementById("cancel-reset-code"),
	confirmResetCode: document.getElementById("confirm-reset-code"),
	resetCodeDontShow: document.getElementById("reset-code-dont-show"),

	// Share dialog
	shareBtn: document.getElementById("share-btn"),
	shareDialog: document.getElementById("share-dialog"),
	shareDialogClose: document.getElementById("share-dialog-close"),
	shareUrlInput: document.getElementById("share-url-input"),
	copyUrlBtn: document.getElementById("copy-url-btn"),
	copyFeedback: document.getElementById("copy-feedback")
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

function changeLanguage(newLang) {
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

		// Handle route (home, section, or lesson)
		handleRoute(false);

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

	// Show lesson UI
	showLessonUI();

	// Update URL
	const engineState = lessonEngine.getCurrentState();
	updateHash(moduleId, engineState.lessonIndex);

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

	// Show lesson UI
	showLessonUI();

	// Update URL
	updateHash(moduleId, lessonIndex);

	loadCurrentLesson();

	// Close sidebar after selection on mobile
	if (window.innerWidth <= 768) {
		closeSidebar();
	}
}

// ================= LESSON LOADING =================

function resetSuccessIndicators() {
	// Clear any pending animation timeout
	if (state.animationTimeout) {
		clearTimeout(state.animationTimeout);
		state.animationTimeout = null;
	}
	elements.codeEditor.classList.remove("success-highlight");
	elements.lessonTitle.classList.remove("success-text");
	elements.nextBtn.classList.remove("success");
	elements.taskInstruction.classList.remove("success-instruction");
	elements.runBtn.classList.remove("success");
	elements.previewWrapper?.classList.remove("matched");
	elements.previewWrapper?.classList.remove("completed-glow");
	elements.previewSection?.classList.remove("matched");
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

	// Handle playground mode - hide instructions, full height editor, show random button
	if (isPlayground) {
		elements.instructionsSection?.classList.add("hidden");
		elements.editorSection?.classList.add("playground-mode");
		elements.randomTemplateBtn?.classList.remove("hidden");
	} else {
		elements.instructionsSection?.classList.remove("hidden");
		elements.editorSection?.classList.remove("playground-mode");
		elements.randomTemplateBtn?.classList.add("hidden");
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
			elements.lessonTitleRow.appendChild(badge);
		}

		// Show gradient border for completed lessons
		elements.previewWrapper?.classList.add("completed-glow");
	} else {
		elements.runBtn.querySelector("span").textContent = t("run");

		// Remove completion badge and border if exists
		const badge = document.querySelector(".completion-badge");
		if (badge) badge.remove();
		elements.previewWrapper?.classList.remove("completed-glow");
	}

	// Update level indicator
	renderLevelIndicator(elements.levelIndicator, engineState.lessonIndex + 1, engineState.totalLessons);
	// Header pill shows module name + level (clickable link to return to lesson)
	if (elements.headerLevelPill && engineState.module) {
		const label = t("lessonLabel");
		elements.headerLevelPill.innerHTML = `<span class="header-module-name">${engineState.module.title}</span> <span class="header-level">${label} ${engineState.lessonIndex + 1} / ${engineState.totalLessons}</span>`;
		elements.headerLevelPill.href = `#${engineState.module.id}/${engineState.lessonIndex}`;
	}

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
		const newState = lessonEngine.getCurrentState();
		// Update URL
		updateHash(newState.module.id, newState.lessonIndex);

		if (newState.module.id !== prevModuleId) {
			updateModuleHighlight(newState.module.id);
		}
		loadCurrentLesson();
	}
}

function prevLesson() {
	const prevModuleId = lessonEngine.getCurrentState().module?.id;
	const success = lessonEngine.previousLesson();
	if (success) {
		const newState = lessonEngine.getCurrentState();
		// Update URL
		updateHash(newState.module.id, newState.lessonIndex);

		if (newState.module.id !== prevModuleId) {
			updateModuleHighlight(newState.module.id);
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

function loadRandomTemplate() {
	const template = getRandomTemplate();
	if (codeEditor && template) {
		codeEditor.setValue(template.code);
		// Apply the code to the preview
		lessonEngine.applyUserCode(template.code, true);
	}
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
			elements.lessonTitleRow.appendChild(badge);
		}

		// Add success visual indicators
		elements.codeEditor.classList.add("success-highlight");
		elements.lessonTitle.classList.add("success-text");
		elements.nextBtn.classList.add("success");
		elements.taskInstruction.classList.add("success-instruction");

		// Show match animation (rotating gradient glow)
		const crispyQuotes = [
			"Crissssssssspy!",
			"You did it!",
			"Good job!",
			"Nailed it!",
			"Perfect!",
			"Well done!",
			"Awesome!",
			"Nice work!",
			//"0x2B 0x31",
			"+1"
		];
		const randomQuote = crispyQuotes[Math.floor(Math.random() * crispyQuotes.length)];
		elements.previewWrapper?.style.setProperty("--crispy-quote", `"${randomQuote}"`);
		elements.previewWrapper?.classList.add("matched");
		elements.previewSection?.classList.add("matched");
		state.animationTimeout = setTimeout(() => {
			elements.previewWrapper?.classList.remove("matched");
			elements.previewSection?.classList.remove("matched");
			// Keep the gradient border visible after animation
			elements.previewWrapper?.classList.add("completed-glow");
			state.animationTimeout = null;
		}, 3500);

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

function showResetCodeConfirmation() {
	// Reset the checkbox state each time dialog is shown
	elements.resetCodeDontShow.checked = false;
	elements.resetCodeDialog.showModal();
}

function closeResetCodeDialog() {
	elements.resetCodeDialog.close();
}

function handleResetCodeConfirm() {
	// Save preference if checkbox is checked
	if (elements.resetCodeDontShow.checked) {
		state.userSettings.skipResetCodeConfirmation = true;
		saveUserSettings();
	}

	closeResetCodeDialog();
	resetCode();
}

function handleResetCodeClick() {
	if (state.userSettings.skipResetCodeConfirmation) {
		resetCode();
	} else {
		showResetCodeConfirmation();
	}
}

// ================= SHARE DIALOG =================

function showShareDialog() {
	const engineState = lessonEngine.getCurrentState();
	if (engineState.module && engineState.lesson !== null) {
		const shareUrl = getShareableUrl(engineState.module.id, engineState.lessonIndex);
		elements.shareUrlInput.value = shareUrl;
		elements.copyFeedback.hidden = true;
	}
	elements.shareDialog.showModal();
}

function closeShareDialog() {
	elements.shareDialog.close();
}

async function copyShareUrl() {
	try {
		await navigator.clipboard.writeText(elements.shareUrlInput.value);
		elements.copyFeedback.hidden = false;
		setTimeout(() => {
			elements.copyFeedback.hidden = true;
		}, 2000);
	} catch (err) {
		// Fallback for older browsers
		elements.shareUrlInput.select();
		document.execCommand("copy");
		elements.copyFeedback.hidden = false;
		setTimeout(() => {
			elements.copyFeedback.hidden = true;
		}, 2000);
	}
}

// ================= SECTION EDUCATIONAL CONTENT =================

const sectionContent = {
	css: `
		<div class="section-overview">
			<p><strong>CSS (Cascading Style Sheets)</strong> is a stylesheet language that controls the visual presentation of HTML documents. While HTML defines the structure and content, CSS handles colors, typography, spacing, and layout. The "cascading" in CSS means rules can override each other based on specificity—allowing you to set defaults and then refine them for specific elements.</p>
			<p>Introduced in 1996 to separate content from presentation, CSS enables one stylesheet to style multiple HTML pages, keeping design consistent and maintainable. Modern CSS includes powerful layout systems like Flexbox and Grid, custom properties (variables), and animations—all without JavaScript.</p>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Selectors & Properties</h2>
				<p>CSS uses selectors to target HTML elements and apply styles. The most common selector is the class selector (<code>.classname</code>), which targets elements with a specific class attribute. You can also use element selectors (<code>p</code>, <code>div</code>), ID selectors (<code>#id</code>), and combinators to select nested elements.</p>
				<p>Properties define what aspect of the element to style. Common properties include <code>color</code> for text color, <code>background</code> for backgrounds, <code>padding</code> for internal spacing, and <code>margin</code> for external spacing. Each property accepts specific value types like colors, lengths, or keywords.</p>
				<a href="#css-basic-selectors/0" class="topic-link">Practice CSS Selectors</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>.button {
  background: steelblue;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.button:hover {
  background: darkslateblue;
}</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>The Box Model</h2>
				<p>Every HTML element is rendered as a rectangular box with four distinct layers. The <code>content</code> area holds your text or images. <code>padding</code> creates space inside the element between the content and border. The <code>border</code> wraps around the padding. Finally, <code>margin</code> creates space outside the element, separating it from neighbors.</p>
				<p>By default, <code>width</code> only sets the content width. Adding padding and border increases the total size. Use <code>box-sizing: border-box</code> to include padding and border in the declared width, making layouts much more predictable.</p>
				<a href="#box-model/0" class="topic-link">Learn the CSS Box Model</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>.card {
  width: 300px;
  padding: 1rem;
  border: 2px solid gray;
  margin: 1rem;
  box-sizing: border-box;
}
/* Total width stays 300px */</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Flexbox Layout</h2>
				<p>Flexbox is a one-dimensional layout system for arranging items in rows or columns. Apply <code>display: flex</code> to a container to enable it. Child elements become flex items that can grow, shrink, and align automatically.</p>
				<p>Control alignment with <code>justify-content</code> (main axis: <code>flex-start</code>, <code>center</code>, <code>space-between</code>) and <code>align-items</code> (cross axis: <code>stretch</code>, <code>center</code>, <code>flex-end</code>). The <code>gap</code> property adds consistent spacing between items without margins.</p>
				<a href="#flexbox/0" class="topic-link">Master CSS Flexbox Layout</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>CSS Grid</h2>
				<p>CSS Grid is a two-dimensional layout system for creating complex row and column layouts. Enable it with <code>display: grid</code>, then define columns using <code>grid-template-columns</code>. The <code>repeat()</code> function creates multiple tracks, and <code>fr</code> units distribute available space proportionally.</p>
				<p>Grid excels at page layouts and card grids. Use <code>grid-template-columns: repeat(3, 1fr)</code> for three equal columns, or <code>repeat(auto-fill, minmax(250px, 1fr))</code> for responsive columns that wrap automatically.</p>
				<a href="#grid/0" class="topic-link">Explore CSS Grid Layout</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.responsive-grid {
  grid-template-columns:
    repeat(auto-fill, minmax(250px, 1fr));
}</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Units & Variables</h2>
				<p>CSS supports multiple unit types for different use cases. Use <code>px</code> for fixed sizes, <code>rem</code> for scalable typography (relative to root font size), <code>%</code> for parent-relative sizing, and <code>vh</code>/<code>vw</code> for viewport-relative dimensions. Prefer <code>rem</code> for accessibility—it respects user font preferences.</p>
				<p>CSS custom properties (variables) store reusable values. Define them with <code>--name: value</code> in <code>:root</code> for global access, then use them anywhere with <code>var(--name)</code>. This makes themes and consistent design systems easy to maintain.</p>
				<a href="#units-variables/0" class="topic-link">Study CSS Units & Variables</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>:root {
  --primary: steelblue;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --radius: 8px;
}

.card {
  background: var(--primary);
  padding: var(--spacing-md);
  border-radius: var(--radius);
}</code></pre>
				</div>
			</div>
		</div>
	`,

	html: `
		<div class="section-overview">
			<p><strong>HTML (HyperText Markup Language)</strong> is not a programming language—it's a markup language that describes the structure and content of web documents. Invented by Tim Berners-Lee in 1989, HTML uses tags like <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>, and <code>&lt;a&gt;</code> to define paragraphs, headings, and links. The browser reads this markup and renders it as a visual page.</p>
			<p>HTML documents form a hierarchical tree called the DOM (Document Object Model). Elements have parent-child relationships: a <code>&lt;ul&gt;</code> contains <code>&lt;li&gt;</code> children, a <code>&lt;form&gt;</code> contains <code>&lt;input&gt;</code> elements. Modern HTML5 includes native interactive elements like <code>&lt;dialog&gt;</code>, <code>&lt;details&gt;</code>, and form validation—features that previously required JavaScript.</p>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Semantic Structure</h2>
				<p>HTML5 introduced semantic elements that convey meaning about content structure. Use <code>&lt;header&gt;</code> for introductory content, <code>&lt;nav&gt;</code> for navigation links, <code>&lt;main&gt;</code> for primary content, <code>&lt;article&gt;</code> for self-contained compositions, <code>&lt;section&gt;</code> for thematic groupings, and <code>&lt;footer&gt;</code> for closing content.</p>
				<p>Semantic markup improves accessibility—screen readers announce element roles. It also helps SEO as search engines better understand your content hierarchy. Replace generic <code>&lt;div&gt;</code> containers with appropriate semantic elements whenever possible.</p>
				<a href="#html-elements/0" class="topic-link">Learn HTML Semantic Elements</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;article&gt;
  &lt;header&gt;
    &lt;h1&gt;Article Title&lt;/h1&gt;
    &lt;time datetime="2024-01-15"&gt;
      January 15, 2024
    &lt;/time&gt;
  &lt;/header&gt;
  &lt;p&gt;Article content...&lt;/p&gt;
  &lt;footer&gt;
    &lt;p&gt;Written by Author&lt;/p&gt;
  &lt;/footer&gt;
&lt;/article&gt;</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Forms & Validation</h2>
				<p>HTML forms collect user input with elements like <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;textarea&gt;</code>, and <code>&lt;button&gt;</code>. Always pair inputs with <code>&lt;label&gt;</code> elements using matching <code>for</code> and <code>id</code> attributes—this is crucial for accessibility and usability.</p>
				<p>Native validation attributes eliminate JavaScript for common cases: <code>required</code> prevents empty submissions, <code>type="email"</code> validates email format, <code>minlength</code>/<code>maxlength</code> control text length, and <code>pattern</code> accepts custom regex patterns. The browser handles error messages automatically.</p>
				<a href="#html-forms-basic/0" class="topic-link">Build HTML Forms</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;form&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input type="email" id="email"
         name="email" required
         placeholder="you@example.com"&gt;

  &lt;label for="phone"&gt;Phone&lt;/label&gt;
  &lt;input type="tel" id="phone"
         pattern="[0-9]{3}-[0-9]{4}"&gt;

  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Interactive Elements</h2>
				<p>Modern HTML includes powerful interactive components that work without JavaScript. The <code>&lt;details&gt;</code> element creates native accordions—click <code>&lt;summary&gt;</code> to toggle visibility. Add the <code>open</code> attribute to start expanded. Multiple details elements create FAQ-style interfaces instantly.</p>
				<p>The <code>&lt;dialog&gt;</code> element creates accessible modal dialogs. Call <code>.showModal()</code> in JavaScript to open it with backdrop and focus trapping built-in. Use <code>&lt;datalist&gt;</code> with inputs to provide autocomplete suggestions from a predefined list.</p>
				<a href="#html-details-summary/0" class="topic-link">Try Interactive HTML Elements</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;details&gt;
  &lt;summary&gt;What is HTML?&lt;/summary&gt;
  &lt;p&gt;HTML is the standard markup
     language for web pages.&lt;/p&gt;
&lt;/details&gt;

&lt;dialog id="confirm"&gt;
  &lt;h2&gt;Confirm Action&lt;/h2&gt;
  &lt;p&gt;Are you sure?&lt;/p&gt;
  &lt;button onclick="this.closest('dialog').close()"&gt;
    Close
  &lt;/button&gt;
&lt;/dialog&gt;</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Tables & Lists</h2>
				<p>Use <code>&lt;table&gt;</code> exclusively for tabular data, never for page layout. Structure tables with <code>&lt;thead&gt;</code> for header rows, <code>&lt;tbody&gt;</code> for data rows, and optionally <code>&lt;tfoot&gt;</code> for summaries. Mark header cells with <code>&lt;th&gt;</code> (not <code>&lt;td&gt;</code>) and add <code>scope="col"</code> or <code>scope="row"</code> for accessibility.</p>
				<p>Lists come in three flavors: <code>&lt;ul&gt;</code> for unordered bullet lists, <code>&lt;ol&gt;</code> for numbered sequences, and <code>&lt;dl&gt;</code> for definition lists (term/description pairs). Nest lists for hierarchical content like navigation menus or category trees.</p>
				<a href="#html-tables/0" class="topic-link">Structure Data with HTML Tables</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;table&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th scope="col"&gt;Product&lt;/th&gt;
      &lt;th scope="col"&gt;Price&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;td&gt;Widget&lt;/td&gt;
      &lt;td&gt;$9.99&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre>
				</div>
			</div>
		</div>
	`,

	tailwind: `
		<div class="section-overview">
			<p><strong>Tailwind CSS</strong> is a utility-first CSS framework that takes a radically different approach to styling. Instead of writing custom CSS classes like <code>.card</code> or <code>.button</code>, you compose designs using small, single-purpose utility classes directly in your HTML: <code>class="p-4 bg-white rounded shadow"</code>.</p>
			<p>This approach solves common CSS problems: no more specificity battles, no unused styles, no inventing class names. Tailwind's consistent spacing scale (<code>p-1</code> through <code>p-12</code>), color palette (<code>blue-500</code>, <code>gray-100</code>), and responsive prefixes (<code>md:</code>, <code>lg:</code>) make building consistent, responsive interfaces fast and predictable.</p>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Utility-First Basics</h2>
				<p>Tailwind CSS uses small, single-purpose utility classes applied directly in HTML. Instead of writing <code>.btn { background: blue; padding: 1rem; }</code> in a stylesheet, you write <code>class="bg-blue-500 p-4"</code> on the element. Each class does exactly one thing, making styles predictable and composable.</p>
				<p>This approach eliminates context-switching between HTML and CSS files. Common utilities include <code>text-lg</code> for font size, <code>font-bold</code> for weight, <code>rounded</code> for border radius, and <code>shadow</code> for box shadows. Hover states use the <code>hover:</code> prefix like <code>hover:bg-blue-600</code>.</p>
				<a href="#tailwind-basics/0" class="topic-link">Start with Tailwind CSS Basics</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;button class="bg-blue-500 text-white
               px-4 py-2 rounded-lg
               font-semibold shadow
               hover:bg-blue-600
               active:bg-blue-700"&gt;
  Click me
&lt;/button&gt;</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Spacing & Sizing</h2>
				<p>Tailwind's spacing scale is consistent and memorable. The pattern is simple: <code>p-4</code> means padding of 1rem (16px), <code>p-2</code> is 0.5rem, <code>p-8</code> is 2rem. The same numbers work for margin (<code>m-4</code>), gap (<code>gap-4</code>), and space utilities. Use directional variants like <code>px-4</code> (horizontal) or <code>pt-2</code> (top only).</p>
				<p>Width and height follow patterns too: <code>w-full</code> for 100%, <code>w-1/2</code> for 50%, <code>w-64</code> for fixed 16rem, <code>h-screen</code> for viewport height. Combine <code>max-w-xl</code> with <code>mx-auto</code> for centered containers with maximum widths.</p>
				<a href="#tailwind-basics/1" class="topic-link">Learn Tailwind Spacing & Sizing</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;div class="max-w-xl mx-auto p-6"&gt;
  &lt;div class="space-y-4"&gt;
    &lt;div class="w-full h-32 bg-gray-200
                rounded-lg"&gt;
      Full width card
    &lt;/div&gt;
    &lt;div class="w-1/2 p-4 bg-gray-100"&gt;
      Half width, padded
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Flexbox & Grid</h2>
				<p>Tailwind's layout utilities map directly to CSS flexbox and grid. Enable flex with <code>flex</code>, then control direction (<code>flex-row</code>, <code>flex-col</code>), alignment (<code>items-center</code>, <code>justify-between</code>), and wrapping (<code>flex-wrap</code>). The <code>gap-4</code> utility adds consistent spacing between items.</p>
				<p>For grid layouts, use <code>grid</code> with column definitions like <code>grid-cols-3</code> for three equal columns or <code>grid-cols-[200px_1fr]</code> for custom track sizes. The <code>col-span-2</code> utility makes items span multiple columns.</p>
				<a href="#tailwind-basics/2" class="topic-link">Build Layouts with Tailwind</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;nav class="flex justify-between
            items-center p-4"&gt;
  &lt;a href="/" class="font-bold"&gt;Logo&lt;/a&gt;
  &lt;ul class="flex gap-6"&gt;
    &lt;li&gt;Home&lt;/li&gt;
    &lt;li&gt;About&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;

&lt;div class="grid grid-cols-3 gap-4"&gt;
  &lt;div class="col-span-2"&gt;Wide&lt;/div&gt;
  &lt;div&gt;Normal&lt;/div&gt;
&lt;/div&gt;</code></pre>
				</div>
			</div>
		</div>

		<div class="topic-row">
			<div class="topic-text">
				<h2>Responsive Design</h2>
				<p>Tailwind uses mobile-first responsive prefixes. Unprefixed utilities apply to all screen sizes. Add <code>sm:</code> (640px+), <code>md:</code> (768px+), <code>lg:</code> (1024px+), or <code>xl:</code> (1280px+) prefixes to apply styles at specific breakpoints and above.</p>
				<p>Build responsive layouts by starting with mobile styles, then adding larger-screen overrides. For example, <code>flex-col md:flex-row</code> stacks items vertically on mobile and horizontally on medium screens. Use <code>hidden md:block</code> to show/hide elements at different sizes.</p>
				<a href="#tailwind-basics/3" class="topic-link">Tailwind Responsive Design</a>
			</div>
			<div class="topic-code">
				<div class="code-block">
					<pre><code>&lt;div class="flex flex-col md:flex-row
            gap-4 p-4"&gt;
  &lt;aside class="w-full md:w-64
               bg-gray-100 p-4"&gt;
    Sidebar (top on mobile)
  &lt;/aside&gt;
  &lt;main class="flex-1"&gt;
    Main content
  &lt;/main&gt;
&lt;/div&gt;

&lt;p class="text-sm md:text-base lg:text-lg"&gt;
  Responsive typography
&lt;/p&gt;</code></pre>
				</div>
			</div>
		</div>
	`
};

// ================= URL ROUTING & PAGE SWITCHING =================

function initRouter() {
	// Handle browser back/forward
	window.addEventListener("popstate", handlePopState);
}

function handlePopState() {
	handleRoute(false);
}

/**
 * Main route handler - switches between page types
 */
function handleRoute(shouldUpdateUrl = true) {
	const route = parseHash();

	if (!route) {
		// Invalid route - go to home
		navigateTo("");
		showLandingPage();
		return;
	}

	switch (route.type) {
		case RouteType.HOME:
			showLandingPage();
			break;
		case RouteType.SECTION:
			showSectionPage(route.sectionId);
			break;
		case RouteType.REFERENCE:
			// Reference pages - TODO: implement later
			showLandingPage();
			break;
		case RouteType.LESSON:
			navigateToLesson(route.moduleId, route.lessonIndex, shouldUpdateUrl);
			break;
		default:
			showLandingPage();
	}

	updateNavHighlight(route);
}

/**
 * Hide all page containers
 */
function hideAllPages() {
	elements.landingPage?.classList.add("hidden");
	elements.sectionPage?.classList.add("hidden");
	elements.gameLayout?.classList.add("hidden");
}

/**
 * Show home landing page
 */
function showLandingPage() {
	hideAllPages();
	elements.landingPage?.classList.remove("hidden");

	// Update section progress on landing page
	updateLandingProgress();
}

/**
 * Update progress indicators on landing page
 */
function updateLandingProgress() {
	["css", "html", "tailwind"].forEach((sectionId) => {
		const progressEl = document.getElementById(`${sectionId}-progress`);
		if (progressEl) {
			const sectionModules = getModulesBySection(lessonEngine.modules, sectionId);
			let completed = 0;
			let total = 0;
			sectionModules.forEach((m) => {
				total += m.lessons.length;
				const progress = lessonEngine.userProgress[m.id];
				if (progress?.completed) {
					completed += progress.completed.length;
				}
			});
			if (total > 0) {
				progressEl.textContent = `${completed}/${total} lessons`;
			} else {
				progressEl.textContent = "";
			}
		}
	});
}

/**
 * Show section landing page
 */
function showSectionPage(sectionId) {
	hideAllPages();
	elements.sectionPage?.classList.remove("hidden");

	const section = getSection(sectionId);
	if (!section) {
		showLandingPage();
		return;
	}

	// Update section header
	if (elements.sectionTitle) elements.sectionTitle.textContent = section.title;
	if (elements.sectionDescription) elements.sectionDescription.textContent = section.description;

	// Inject educational content (includes integrated module links)
	if (elements.sectionIntro && sectionContent[sectionId]) {
		elements.sectionIntro.innerHTML = sectionContent[sectionId];
		// Highlight code blocks with CodeMirror
		highlightSectionCodeBlocks();
	}

	// Get modules for this section to calculate progress
	const sectionModules = getModulesBySection(lessonEngine.modules, sectionId);

	// Calculate section progress
	let completed = 0;
	let total = 0;
	sectionModules.forEach((m) => {
		total += m.lessons.length;
		const progress = lessonEngine.userProgress[m.id];
		if (progress?.completed) {
			completed += progress.completed.length;
		}
	});

	// Update progress bar
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
	if (elements.sectionProgressFill) elements.sectionProgressFill.style.width = `${percent}%`;
	if (elements.sectionProgressText) elements.sectionProgressText.textContent = `${completed} of ${total} lessons complete`;
}

/**
 * Show lesson UI (game layout)
 */
function showLessonUI() {
	hideAllPages();
	elements.gameLayout?.classList.remove("hidden");
}

/**
 * Update nav link highlighting
 */
function updateNavHighlight(route) {
	if (!elements.mainNav) return;

	const navLinks = elements.mainNav.querySelectorAll(".nav-link");
	navLinks.forEach((link) => {
		link.classList.remove("active");

		if (route?.type === RouteType.SECTION && link.dataset.section === route.sectionId) {
			link.classList.add("active");
		} else if (route?.type === RouteType.LESSON) {
			// Highlight section based on module's inferred section
			const module = lessonEngine.modules.find((m) => m.id === route.moduleId);
			if (module) {
				const moduleSection = getModuleSection(module);
				if (link.dataset.section === moduleSection) {
					link.classList.add("active");
				}
			}
		}
	});
}

function navigateToLesson(moduleId, lessonIndex, shouldUpdateUrl = true) {
	// Show lesson UI
	showLessonUI();

	// Validate moduleId exists
	const module = lessonEngine.modules.find((m) => m.id === moduleId);
	if (!module) {
		// Invalid module - fallback to first module
		const fallbackModule = lessonEngine.modules[0];
		if (fallbackModule) {
			replaceHash(fallbackModule.id, 0);
			lessonEngine.setModuleById(fallbackModule.id);
			lessonEngine.setLessonByIndex(0);
			loadCurrentLesson();
			updateModuleHighlight(fallbackModule.id);
		}
		return;
	}

	// Validate lessonIndex is in bounds
	if (lessonIndex < 0 || lessonIndex >= module.lessons.length) {
		// Invalid lesson - go to first lesson of module
		replaceHash(moduleId, 0);
		lessonEngine.setModuleById(moduleId);
		lessonEngine.setLessonByIndex(0);
		loadCurrentLesson();
		updateModuleHighlight(moduleId);
		return;
	}

	// Valid navigation
	lessonEngine.setModuleById(moduleId);
	lessonEngine.setLessonByIndex(lessonIndex);

	if (shouldUpdateUrl) {
		updateHash(moduleId, lessonIndex);
	}

	loadCurrentLesson();
	updateModuleHighlight(moduleId);
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

	// Initialize URL router for shareable links
	initRouter();

	// Sidebar controls
	elements.menuBtn.addEventListener("click", openSidebar);
	elements.closeSidebar.addEventListener("click", closeSidebar);
	elements.sidebarBackdrop.addEventListener("click", closeSidebar);

	// Logo click - navigate to home landing
	elements.logoLink.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("");
		showLandingPage();
	});

	// Language select
	elements.langSelect.value = getLanguage();
	elements.langSelect.addEventListener("change", (e) => changeLanguage(e.target.value));

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
	elements.resetCodeBtn.addEventListener("click", handleResetCodeClick);
	elements.randomTemplateBtn.addEventListener("click", loadRandomTemplate);
	elements.shareBtn.addEventListener("click", showShareDialog);

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
	elements.resetCodeDialogClose.addEventListener("click", closeResetCodeDialog);
	elements.resetCodeDialog.addEventListener("click", (e) => {
		if (e.target === elements.resetCodeDialog) closeResetCodeDialog();
	});
	elements.cancelResetCode.addEventListener("click", closeResetCodeDialog);
	elements.confirmResetCode.addEventListener("click", handleResetCodeConfirm);

	// Share dialog
	elements.shareDialogClose.addEventListener("click", closeShareDialog);
	elements.shareDialog.addEventListener("click", (e) => {
		if (e.target === elements.shareDialog) closeShareDialog();
	});
	elements.copyUrlBtn.addEventListener("click", copyShareUrl);

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
