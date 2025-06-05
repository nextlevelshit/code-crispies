import { LessonEngine } from "./impl/LessonEngine.js";
import { renderLesson, renderModuleList, renderLevelIndicator, showFeedback, updateActiveLessonInSidebar } from "./helpers/renderer.js";
import { loadModules } from "./config/lessons.js";

// Simplified state - LessonEngine now manages lesson state and progress
const state = {
	userSettings: {
		disableFeedbackErrors: false
	}
};

// DOM elements
const elements = {
	moduleList: document.querySelector(".module-list"),
	lessonTitle: document.getElementById("lesson-title"),
	lessonDescription: document.getElementById("lesson-description"),
	taskInstruction: document.getElementById("task-instruction"),
	previewArea: document.getElementById("preview-area"),
	editorPrefix: document.getElementById("editor-prefix"),
	codeInput: document.getElementById("code-input"),
	editorSuffix: document.getElementById("editor-suffix"),
	prevBtn: document.getElementById("prev-btn"),
	nextBtn: document.getElementById("next-btn"),
	runBtn: document.getElementById("run-btn"),
	levelIndicator: document.getElementById("level-indicator"),
	modalContainer: document.getElementById("modal-container"),
	modalTitle: document.getElementById("modal-title"),
	modalContent: document.getElementById("modal-content"),
	modalClose: document.getElementById("modal-close"),
	moduleSelectorBtn: document.getElementById("module-selector-btn"),
	resetBtn: document.getElementById("reset-btn"),
	helpBtn: document.getElementById("help-btn"),
	lessonContainer: document.querySelector(".lesson-container"),
	editorContent: document.querySelector(".editor-content"),
	codeEditor: document.querySelector(".code-editor"),
	validationIndicators: document.querySelector(".validation-indicators-container"),
	disableFeedbackToggle: document.getElementById("disable-feedback-toggle")
};

// Initialize the lesson engine - now the single source of truth
const lessonEngine = new LessonEngine();

// Load user progress from localStorage
function loadUserProgress() {
	const savedProgress = localStorage.getItem("codeCrispies.progress");
	if (savedProgress) {
		state.userProgress = JSON.parse(savedProgress);
	}
}

// Save user progress to localStorage
function saveUserProgress() {
	localStorage.setItem("codeCrispies.progress", JSON.stringify(state.userProgress));
}

function loadUserSettings() {
	const savedSettings = localStorage.getItem("codeCrispies.settings");
	if (savedSettings) {
		try {
			const settings = JSON.parse(savedSettings);
			state.userSettings = { ...state.userSettings, ...settings };

			// Apply saved settings to UI
			elements.disableFeedbackToggle.checked = !state.userSettings.disableFeedbackErrors;
		} catch (e) {
			console.error("Error loading user settings:", e);
		}
	}
}

function saveUserSettings() {
	localStorage.setItem("codeCrispies.settings", JSON.stringify(state.userSettings));
}

function initFeedbackToggle() {
	elements.disableFeedbackToggle.addEventListener("change", (e) => {
		state.userSettings.disableFeedbackErrors = !e.target.checked;
		saveUserSettings();
	});
}

// Initialize the module list
async function initializeModules() {
	try {
		const modules = await loadModules();
		lessonEngine.setModules(modules);

		// Use the new renderModuleList function with both callbacks
		renderModuleList(elements.moduleList, modules, selectModule, selectLesson);

		// Load saved progress and select appropriate module
		const progressData = lessonEngine.loadUserProgress();
		const lastModuleId = progressData?.lastModuleId;

		if (lastModuleId && modules.find(m => m.id === lastModuleId)) {
			selectModule(lastModuleId);
		} else if (modules.length > 0) {
			selectModule(modules[0].id);
		}

		// Update progress indicator on module selector button
		updateModuleSelectorButtonProgress();
	} catch (error) {
		console.error("Failed to load modules:", error);
		elements.lessonDescription.textContent = "Failed to load modules. Please refresh the page.";
	}
}

// Update progress indicator on module selector button
function updateModuleSelectorButtonProgress() {
	const stats = lessonEngine.getProgressStats();

	// Create progress indicator
	const progressBar = document.createElement("div");
	progressBar.className = "progress-indicator";
	progressBar.style.cssText = `
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		width: ${stats.percentComplete}%;
		background-color: var(--primary-light);
		border-radius: 0 3px 3px 0;
	`;

	// Add progress percentage text
	elements.moduleSelectorBtn.innerHTML = `Progress <span style="font-size: 0.8em; opacity: 0.8;">${stats.percentComplete}%</span>`;
	elements.moduleSelectorBtn.style.position = "relative";

	// Remove any existing progress bar before adding new one
	const existingBar = elements.moduleSelectorBtn.querySelector(".progress-indicator");
	if (existingBar) {
		existingBar.remove();
	}

	elements.moduleSelectorBtn.appendChild(progressBar);
}

// Select a module - delegate to LessonEngine
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

	// Reset any success indicators
	resetSuccessIndicators();
}

function selectLesson(moduleId, lessonIndex) {
	// Select the module first if it's not already selected
	const currentState = lessonEngine.getCurrentState();
	if (!currentState.module || currentState.module.id !== moduleId) {
		lessonEngine.setModuleById(moduleId);
	}

	// Set the lesson
	lessonEngine.setLessonByIndex(lessonIndex);
	loadCurrentLesson();
}

// Reset success indicators
function resetSuccessIndicators() {
	elements.codeEditor.classList.remove("success-highlight");
	elements.lessonTitle.classList.remove("success-text");
	elements.nextBtn.classList.remove("success");
	elements.taskInstruction.classList.remove("success-instruction");
	elements.runBtn.classList.remove("re-run");
}

function updateEditorForMode(mode) {
	const codeInput = elements.codeInput;
	const editorLabel = document.querySelector(".editor-label");

	if (mode === "tailwind") {
		codeInput.placeholder = "Enter Tailwind classes (e.g., bg-blue-500 text-white p-4)";
		if (editorLabel) editorLabel.textContent = "Tailwind Classes:";
	} else {
		codeInput.placeholder = "Enter your CSS code here...";
		if (editorLabel) editorLabel.textContent = "CSS Code:";
	}
}

// Configure editor layout based on display type
function resetEditorLayout(lesson) {
	elements.validationIndicators.innerHTML = "";
}

// Load the current lesson - now delegates to LessonEngine
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

	// Update UI
	renderLesson(
		elements.lessonTitle,
		elements.lessonDescription,
		elements.taskInstruction,
		elements.previewArea,
		elements.editorPrefix,
		elements.codeInput,
		elements.editorSuffix,
		lesson
	);

	// Set user code in input
	elements.codeInput.value = engineState.userCode;

	// Configure editor layout based on lesson settings
	resetEditorLayout(lesson);

	// Update Run button text based on completion status
	if (engineState.isCompleted) {
		elements.runBtn.innerHTML = '<img src="./gear.svg" />Re-run';

		// Add completion badge next to title if not already present
		if (!document.querySelector(".completion-badge")) {
			const badge = document.createElement("span");
			badge.className = "completion-badge";
			badge.textContent = "Completed";
			elements.lessonTitle.appendChild(badge);
		}
	} else {
		elements.runBtn.innerHTML = '<img src="./gear.svg" />Run';

		// Remove completion badge if exists
		const badge = document.querySelector(".completion-badge");
		if (badge) {
			badge.remove();
		}
	}

	// Update level indicator
	renderLevelIndicator(elements.levelIndicator, engineState.lessonIndex + 1, engineState.totalLessons);

	// Update active lesson in sidebar
	updateActiveLessonInSidebar(engineState.module.id, engineState.lessonIndex);

	// Update navigation buttons
	updateNavigationButtons();

	// Update progress indicator on module selector button
	updateModuleSelectorButtonProgress();

	// Focus on the code editor by default
	elements.codeInput.focus();

	// Track live changes and update preview when the user pauses typing
	setupLivePreview();
}

// Setup live preview functionality
let previewTimer = null;
function setupLivePreview() {
	// Clear previous event listener if any
	elements.codeInput.removeEventListener("input", handleUserInput);

	// Add new event listener
	elements.codeInput.addEventListener("input", handleUserInput);
}

// Handle user input with debounced preview updates
function handleUserInput() {
	// Clear the previous timer
	if (previewTimer) {
		clearTimeout(previewTimer);
	}

	// Set a new timer for preview update after user stops typing
	previewTimer = setTimeout(() => {
		runCode();
	}, 800); // Update preview 800ms after user stops typing
}

// Update navigation buttons state
function updateNavigationButtons() {
	const engineState = lessonEngine.getCurrentState();

	elements.prevBtn.disabled = !engineState.canGoPrev;
	elements.nextBtn.disabled = !engineState.canGoNext;

	// Style changes for disabled buttons
	if (elements.prevBtn.disabled) {
		elements.prevBtn.classList.add("btn-disabled");
	} else {
		elements.prevBtn.classList.remove("btn-disabled");
	}

	if (elements.nextBtn.disabled) {
		elements.nextBtn.classList.add("btn-disabled");
	} else {
		elements.nextBtn.classList.remove("btn-disabled");
	}
}

// Go to the next lesson - delegate to LessonEngine
function nextLesson() {
	const success = lessonEngine.nextLesson();
	if (success) {
		loadCurrentLesson();
	}
}

// Go to the previous lesson - delegate to LessonEngine
function prevLesson() {
	const success = lessonEngine.previousLesson();
	if (success) {
		loadCurrentLesson();
	}
}

// Run the user code - now uses LessonEngine validation
function runCode() {
	const userCode = elements.codeInput.value;

	// Rotate the Run button icon
	const runButtonImg = document.querySelector("#run-btn img");
	const runButtonRotationDegree = Number(runButtonImg.style.transform.match(/\d+/)?.pop() ?? 0);
	document.querySelector("#run-btn img").style.transform = `rotate(${runButtonRotationDegree + 180}deg)`;

	// Apply the code to the preview via LessonEngine
	lessonEngine.applyUserCode(userCode, true);

	// Validate code using LessonEngine
	const validationResult = lessonEngine.validateCode();

	// Add validation indicators based on validCases count if available
	if (validationResult.validCases) {
		const casesCount =
			typeof validationResult.validCases === "number"
				? validationResult.validCases
				: Array.isArray(validationResult.validCases)
					? validationResult.validCases.length
					: 1;

		elements.validationIndicators.innerHTML = `${Math.round((validationResult.validCases / validationResult.totalCases) * 100)}%`;
	}

	if (validationResult.isValid) {
		// Show success feedback with visual indicators
		showFeedback(true, validationResult.message || "Great job! Your code works correctly.");

		// Update the Run button to Re-run
		elements.runBtn.innerHTML = '<img src="./gear.svg" />Re-run';
		elements.runBtn.classList.add("re-run");

		// Add completion badge if not present
		if (!document.querySelector(".completion-badge")) {
			const badge = document.createElement("span");
			badge.className = "completion-badge";
			badge.textContent = "Completed";
			elements.lessonTitle.appendChild(badge);
		}

		// Add success visual indicators
		elements.codeEditor.classList.add("success-highlight");
		elements.lessonTitle.classList.add("success-text");
		elements.nextBtn.classList.add("success");
		elements.taskInstruction.classList.add("success-instruction");

		// Update navigation buttons
		updateNavigationButtons();

		// Update progress indicator
		updateModuleSelectorButtonProgress();
	} else {
		// Reset any success indicators
		resetSuccessIndicators();

		// Show error feedback (with friendly message)
		showFeedback(false, validationResult.message || "Not quite there yet! Let's try again.");
	}
}

// Show the module selector modal
function showModuleSelector() {
	elements.modalTitle.textContent = "Select a Module";

	const engineState = lessonEngine.getCurrentState();
	const modules = lessonEngine.modules;

	// Create module buttons
	const moduleButtons = modules.map((module) => {
		const button = document.createElement("button");
		button.classList.add("btn", "module-button");
		button.style.display = "block";
		button.style.width = "100%";
		button.style.marginBottom = "10px";
		button.style.padding = "15px";
		button.style.textAlign = "left";

		// Add completion status using LessonEngine
		const completedCount = lessonEngine.userProgress[module.id]?.completed.length || 0;
		const totalLessons = module.lessons.length;
		const percentComplete = Math.round((completedCount / totalLessons) * 100);

		button.innerHTML = `
			<strong>${module.title}</strong>
			<div style="margin-top: 5px; font-size: 0.8rem; color: var(--light-text);">
				${module.description}
			</div>
			<div style="margin-top: 8px; height: 6px; background-color: #f0f0f0; border-radius: 3px;">
				<div style="height: 100%; width: ${percentComplete}%; background-color: var(--primary-color); border-radius: 3px;"></div>
			</div>
			<div style="margin-top: 5px; font-size: 0.8rem; text-align: right;">
				${completedCount}/${totalLessons} lessons completed
			</div>
		`;

		button.addEventListener("click", () => {
			selectModule(module.id);
			closeModal();
		});

		return button;
	});

	// Clear and update modal content
	elements.modalContent.innerHTML = "";
	moduleButtons.forEach((button) => {
		elements.modalContent.appendChild(button);
	});

	// Show the modal
	elements.modalContainer.classList.remove("hidden");
}

// Show help modal
function showHelp() {
	elements.modalTitle.textContent = "Help";

	elements.modalContent.innerHTML = `
		<h3>How to Use Code Crispies</h3>
		<p>Code Crispies is an interactive platform for learning CSS through practical exercises.</p>
		
		<h4>Getting Started</h4>
		<p>Select a module from the sidebar to start learning. Each module contains a series of lessons focused on specific CSS concepts.</p>
		
		<h4>Completing Lessons</h4>
		<p>For each lesson:</p>
		<ol>
			<li>Read the instructions and objective</li>
			<li>Write your CSS code in the editor</li>
			<li>Click "Run" to test your solution</li>
			<li>If correct, you can proceed to the next lesson</li>
		</ol>
		
		<h4>Controls</h4>
		<ul>
			<li><strong>Run</strong> - Test your CSS code and apply it to the preview</li>
			<li><strong>Previous/Next</strong> - Navigate between lessons</li>
			<li><strong>Progress</strong> - Select a different learning module</li>
			<li><strong>Reset Progress</strong> - Clear all your saved progress</li>
		</ul>
		
		<h4>Tips</h4>
		<ul>
			<li>Your code changes will automatically preview as you type</li>
			<li>The preview area shows how your CSS affects the elements</li>
			<li>Your progress is automatically saved in your browser storage</li>
			<li>You can revisit completed lessons at any time</li>
			<li>Press Tab in the code editor to indent with two spaces</li>
			<li>Use Ctrl+Enter to quickly run your code</li>
		</ul>
	`;

	elements.modalContainer.classList.remove("hidden");
}

// Reset user progress
function resetProgress() {
	elements.modalTitle.textContent = "Reset Progress";

	elements.modalContent.innerHTML = `
		<p>Are you sure you want to reset all your progress? This cannot be undone.</p>
		<div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
			<button id="cancel-reset" class="btn">Cancel</button>
			<button id="confirm-reset" class="btn btn-primary">Reset Progress</button>
		</div>
	`;

	document.getElementById("cancel-reset").addEventListener("click", closeModal);
	document.getElementById("confirm-reset").addEventListener("click", () => {
		localStorage.removeItem("codeCrispies.progress");
		localStorage.removeItem("codeCrispies.lastModuleId");
		state.userProgress = {};
		closeModal();

		// Reload the current module
		if (state.currentModule) {
			const currentModuleId = state.currentModule.id;
			selectModule(currentModuleId);
		} else if (state.modules.length > 0) {
			selectModule(state.modules[0].id);
		}

		// Update progress indicator
		updateModuleSelectorButtonProgress();
	});

	elements.modalContainer.classList.remove("hidden");
}

// Close the modal
function closeModal() {
	elements.modalContainer.classList.add("hidden");
}

// Handle clicks in the code editor to focus the input
function handleEditorClick() {
	elements.codeInput.focus();

	// Add a temporary highlight class to show where the cursor is
	elements.editorContent.classList.add("editor-focused");

	// Remove the highlight after a short delay
	setTimeout(() => {
		elements.editorContent.classList.remove("editor-focused");
	}, 300);
}

// Handle tab key in the code editor
function handleTabKey(e) {
	if (e.key === "Tab") {
		e.preventDefault();

		const start = e.target.selectionStart;
		const end = e.target.selectionEnd;

		// Add two spaces at cursor position
		e.target.value = e.target.value.substring(0, start) + "  " + e.target.value.substring(end);

		// Move cursor position after the inserted spaces
		e.target.selectionStart = e.target.selectionEnd = start + 2;
	}
}

// Initialize the application
function init() {
	loadUserProgress();
	loadUserSettings();
	initializeModules().catch(console.error);
	initFeedbackToggle();

	// Event listeners
	elements.prevBtn.addEventListener("click", prevLesson);
	elements.nextBtn.addEventListener("click", nextLesson);
	elements.runBtn.addEventListener("click", runCode);
	elements.modalClose.addEventListener("click", closeModal);
	elements.moduleSelectorBtn.addEventListener("click", showModuleSelector);
	elements.resetBtn.addEventListener("click", resetProgress);
	elements.helpBtn.addEventListener("click", showHelp);
	elements.codeInput.addEventListener("click", handleEditorClick);

	// Also make the editor container clickable to focus the text area
	elements.editorContent.addEventListener("click", (e) => {
		elements.codeInput.focus();
	});

	// Load user settings
	elements.disableFeedbackToggle.addEventListener("change", (e) => {
		state.userSettings.disableFeedbackErrors = !e.target.checked;
		saveUserSettings();
	});

	// Add tab key handler for the code input
	elements.codeInput.addEventListener("keydown", handleTabKey);

	// Handle keyboard shortcuts
	document.addEventListener("keydown", (e) => {
		// Ctrl+Enter to run code
		if (e.ctrlKey && e.key === "Enter") {
			runCode();
			e.preventDefault();
		}
	});

	// Add this to your app.js file

	// Mobile Menu Functionality
	document.addEventListener("DOMContentLoaded", function () {
		// Create hamburger menu button
		const hamburger = document.createElement("button");
		hamburger.className = "hamburger";
		hamburger.setAttribute("aria-label", "Toggle menu");
		hamburger.innerHTML = `
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  `;

		// Get the header and nav elements
		const header = document.querySelector(".header");
		const logo = document.querySelector(".logo");
		const nav = document.querySelector(".main-nav");

		// Insert hamburger button after the logo
		header.insertBefore(hamburger, logo.nextSibling);

		// Toggle menu on hamburger click
		hamburger.addEventListener("click", function () {
			nav.classList.toggle("open");
			hamburger.classList.toggle("open");

			// Set aria-expanded attribute for accessibility
			const isExpanded = nav.classList.contains("open");
			hamburger.setAttribute("aria-expanded", isExpanded);
		});

		// Close menu when clicking outside
		document.addEventListener("click", function (event) {
			if (!nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains("open")) {
				nav.classList.remove("open");
				hamburger.classList.remove("open");
				hamburger.setAttribute("aria-expanded", false);
			}
		});

		// Close menu when window is resized to desktop size
		window.addEventListener("resize", function () {
			if (window.innerWidth > 768 && nav.classList.contains("open")) {
				nav.classList.remove("open");
				hamburger.classList.remove("open");
				hamburger.setAttribute("aria-expanded", false);
			}
		});
	});
}

// Start the application
init();
