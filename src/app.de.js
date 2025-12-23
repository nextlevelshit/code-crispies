import { LessonEngine } from "./impl/LessonEngine.js";
import { CodeEditor } from "./impl/CodeEditor.js";
import { renderLesson, renderModuleList, renderLevelIndicator, updateActiveLessonInSidebar } from "./helpers/renderer.js";
import { loadModules } from "./config/lessons.de.js";

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
	helpBtn: document.getElementById("help-btn"),

	// Left panel
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

	// Modal
	modalContainer: document.getElementById("modal-container"),
	modalTitle: document.getElementById("modal-title"),
	modalContent: document.getElementById("modal-content"),
	modalClose: document.getElementById("modal-close")
};

// Initialize the lesson engine - now the single source of truth
const lessonEngine = new LessonEngine();

// Code editor instance (initialized later)
let codeEditor = null;
let currentMode = "css";

// ================= SIDEBAR FUNCTIONS =================

function openSidebar() {
	elements.sidebarDrawer.classList.add("open");
	elements.sidebarBackdrop.classList.add("visible");
}

function closeSidebar() {
	elements.sidebarDrawer.classList.remove("open");
	elements.sidebarBackdrop.classList.remove("visible");
}

// ================= EXPECTED RESULT TOGGLE =================

function toggleExpectedResult() {
	state.showExpected = !state.showExpected;

	if (state.showExpected) {
		elements.expectedOverlay.classList.add("visible");
		elements.showExpectedBtn.textContent = "Lösung ausblenden";
		elements.showExpectedBtn.classList.add("btn-primary");
	} else {
		elements.expectedOverlay.classList.remove("visible");
		elements.showExpectedBtn.textContent = "Lösung zeigen";
		elements.showExpectedBtn.classList.remove("btn-primary");
	}
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
	elements.progressText.textContent = `${stats.percentComplete}% abgeschlossen (${stats.totalCompleted}/${stats.totalLessons})`;
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
			console.error("Fehler beim Laden der Einstellungen:", e);
		}
	}
}

function saveUserSettings() {
	localStorage.setItem("codeCrispies.settings", JSON.stringify(state.userSettings));
}

// ================= MODULE INITIALIZATION =================

async function initializeModules() {
	try {
		const modules = await loadModules();
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
	} catch (error) {
		console.error("Module konnten nicht geladen werden:", error);
		elements.lessonDescription.textContent = "Module konnten nicht geladen werden. Bitte Seite neu laden.";
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
			placeholder: "HTML hier eingeben... Probiere: nav>ul>li*3 dann Tab drücken",
			label: "HTML-Editor",
			cmMode: "html"
		},
		tailwind: {
			placeholder: "Tailwind-Klassen eingeben (z.B. bg-blue-500 text-white p-4)",
			label: "Tailwind-Klassen",
			cmMode: "css"
		},
		css: {
			placeholder: "CSS-Code hier eingeben...",
			label: "CSS-Editor",
			cmMode: "css"
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

	// Update UI based on mode
	updateEditorForMode(mode);

	// Reset any success indicators
	resetSuccessIndicators();

	// Clear hints
	clearHint();

	// Hide expected overlay
	state.showExpected = false;
	elements.expectedOverlay.classList.remove("visible");
	elements.showExpectedBtn.textContent = "Lösung zeigen";
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
		elements.runBtn.innerHTML = '<img src="./gear.svg" alt="" />Erneut';

		// Add completion badge if not present
		if (!document.querySelector(".completion-badge")) {
			const badge = document.createElement("span");
			badge.className = "completion-badge";
			badge.textContent = "Erledigt";
			elements.lessonTitle.appendChild(badge);
		}
	} else {
		elements.runBtn.innerHTML = '<img src="./gear.svg" alt="" />Ausführen';

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
	const success = lessonEngine.nextLesson();
	if (success) {
		loadCurrentLesson();
	}
}

function prevLesson() {
	const success = lessonEngine.previousLesson();
	if (success) {
		loadCurrentLesson();
	}
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

	// Rotate the Run button icon
	const runButtonImg = document.querySelector("#run-btn img");
	if (runButtonImg) {
		const currentRotation = parseInt(runButtonImg.style.transform?.match(/\d+/)?.[0] || "0");
		runButtonImg.style.transform = `rotate(${currentRotation + 180}deg)`;
	}

	// Apply the code to the preview via LessonEngine
	lessonEngine.applyUserCode(userCode, true);

	// Validate code using LessonEngine
	const validationResult = lessonEngine.validateCode();

	if (validationResult.isValid) {
		// Show success hint
		showSuccessHint(validationResult.message || "Super! Dein Code funktioniert korrekt.");

		// Update Run button
		elements.runBtn.innerHTML = '<img src="./gear.svg" alt="" />Erneut';
		elements.runBtn.classList.add("success");

		// Add completion badge
		if (!document.querySelector(".completion-badge")) {
			const badge = document.createElement("span");
			badge.className = "completion-badge";
			badge.textContent = "Erledigt";
			elements.lessonTitle.appendChild(badge);
		}

		// Add success visual indicators
		elements.codeEditor.classList.add("success-highlight");
		elements.lessonTitle.classList.add("success-text");
		elements.nextBtn.classList.add("success");
		elements.taskInstruction.classList.add("success-instruction");

		// Show match animation
		elements.previewWrapper?.classList.add("matched");
		setTimeout(() => {
			elements.previewWrapper?.classList.remove("matched");
		}, 2500);

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
			showHint(validationResult.message || "Weiter versuchen!", step, total);
		}
	}
}

// ================= MODALS =================

function showHelp() {
	elements.modalTitle.textContent = "Hilfe";

	elements.modalContent.innerHTML = `
		<h3>So verwendest du Code Crispies</h3>
		<p>Code Crispies ist eine interaktive Plattform zum Erlernen von HTML, CSS und Tailwind durch praktische Übungen.</p>

		<h4>Erste Schritte</h4>
		<p>Öffne das Menü (☰), um ein Lektionsmodul auszuwählen. Jedes Modul enthält eine Reihe von Lektionen.</p>

		<h4>Lektionen abschließen</h4>
		<ol>
			<li>Lies die Anleitung auf der linken Seite</li>
			<li>Schreibe deinen Code im Editor</li>
			<li>Klicke auf "Ausführen" oder drücke Strg+Enter zum Testen</li>
			<li>Folge den Hinweisen, um Probleme zu beheben</li>
			<li>Klicke auf "Weiter", wenn du fertig bist</li>
		</ol>

		<h4>Tipps</h4>
		<ul>
			<li>Klicke auf "Lösung zeigen", um das Zielergebnis zu sehen</li>
			<li>Dein Fortschritt wird automatisch gespeichert</li>
			<li>Strg+Enter führt deinen Code aus</li>
		</ul>

		<h4>Emmet-Kürzel (HTML-Modus)</h4>
		<p>Tippe Abkürzungen ein und drücke Tab zum Erweitern:</p>
		<ul>
			<li><kbd>div.container</kbd> → div mit Klasse</li>
			<li><kbd>ul>li*5</kbd> → ul mit 5 li-Kindern</li>
			<li><kbd>nav>ul>li*3>a</kbd> → verschachtelte Struktur</li>
			<li><kbd>p{Hallo}</kbd> → p mit Textinhalt</li>
		</ul>
	`;

	elements.modalContainer.classList.remove("hidden");
}

function showResetConfirmation() {
	elements.modalTitle.textContent = "Fortschritt zurücksetzen";

	elements.modalContent.innerHTML = `
		<p>Bist du sicher, dass du deinen gesamten Fortschritt zurücksetzen möchtest? Dies kann nicht rückgängig gemacht werden.</p>
		<div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
			<button id="cancel-reset" class="btn">Abbrechen</button>
			<button id="confirm-reset" class="btn btn-ghost">Alles zurücksetzen</button>
		</div>
	`;

	document.getElementById("cancel-reset").addEventListener("click", closeModal);
	document.getElementById("confirm-reset").addEventListener("click", () => {
		lessonEngine.clearProgress();
		closeModal();
		closeSidebar();

		// Reload first module
		const modules = lessonEngine.modules;
		if (modules.length > 0) {
			selectModule(modules[0].id);
		}

		updateProgressDisplay();
	});

	elements.modalContainer.classList.remove("hidden");
}

function closeModal() {
	elements.modalContainer.classList.add("hidden");
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
		placeholder: "Code hier eingeben...",
		onChange: handleEditorChange
	});

	codeEditor.init("");
}

function init() {
	loadUserSettings();

	// Initialize CodeMirror editor
	initCodeEditor();

	// Load modules after editor is ready
	initializeModules().catch(console.error);

	// Sidebar controls
	elements.menuBtn.addEventListener("click", openSidebar);
	elements.closeSidebar.addEventListener("click", closeSidebar);
	elements.sidebarBackdrop.addEventListener("click", closeSidebar);

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

	// Modals
	elements.helpBtn.addEventListener("click", showHelp);
	elements.modalClose.addEventListener("click", closeModal);
	elements.resetBtn.addEventListener("click", showResetConfirmation);

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

		// Escape to close sidebar
		if (e.key === "Escape") {
			closeSidebar();
			closeModal();
		}
	});
}

// Start the application
init();
