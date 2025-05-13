import { LessonEngine } from './LessonEngine';
import { renderLesson, renderModuleList, renderLevelIndicator, showFeedback } from './renderer';
import { validateUserCode } from './validator';
import { loadModules } from '../lessons/lesson-config';

// Main Application state
const state = {
    currentModule: null,
    currentLessonIndex: 0,
    modules: [],
    userProgress: {}, // Format: { moduleId: { completed: [0, 2, 3], current: 4 } }
};

// DOM elements
const elements = {
    moduleList: document.querySelector('.module-list'),
    lessonTitle: document.getElementById('lesson-title'),
    lessonDescription: document.getElementById('lesson-description'),
    taskInstruction: document.getElementById('task-instruction'),
    previewArea: document.getElementById('preview-area'),
    editorPrefix: document.getElementById('editor-prefix'),
    codeInput: document.getElementById('code-input'),
    editorSuffix: document.getElementById('editor-suffix'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    runBtn: document.getElementById('run-btn'),
    levelIndicator: document.getElementById('level-indicator'),
    modalContainer: document.getElementById('modal-container'),
    modalTitle: document.getElementById('modal-title'),
    modalContent: document.getElementById('modal-content'),
    modalClose: document.getElementById('modal-close'),
    moduleSelectorBtn: document.getElementById('module-selector-btn'),
    resetBtn: document.getElementById('reset-btn'),
    helpBtn: document.getElementById('help-btn'),
    lessonContainer: document.querySelector('.lesson-container'),
};

// Initialize the lesson engine
const lessonEngine = new LessonEngine();

// Load user progress from localStorage
function loadUserProgress() {
    const savedProgress = localStorage.getItem('codeCrispiesProgress');
    if (savedProgress) {
        state.userProgress = JSON.parse(savedProgress);
    }
}

// Save user progress to localStorage
function saveUserProgress() {
    localStorage.setItem('codeCrispiesProgress', JSON.stringify(state.userProgress));
}

// Initialize the module list
async function initializeModules() {
    try {
        state.modules = await loadModules();
        renderModuleList(elements.moduleList, state.modules, selectModule);

        // Select the first module or the last one user was on
        const lastModuleId = localStorage.getItem('lastModuleId');
        if (lastModuleId && state.modules.find(m => m.id === lastModuleId)) {
            selectModule(lastModuleId);
        } else if (state.modules.length > 0) {
            selectModule(state.modules[0].id);
        }

        // Update progress indicator on module selector button
        updateModuleSelectorButtonProgress();
    } catch (error) {
        console.error('Failed to load modules:', error);
        elements.lessonDescription.textContent = 'Failed to load modules. Please refresh the page.';
    }
}

// Update progress indicator on module selector button
function updateModuleSelectorButtonProgress() {
    if (!state.modules.length) return;

    // Calculate overall progress across all modules
    let totalLessons = 0;
    let totalCompleted = 0;

    state.modules.forEach(module => {
        totalLessons += module.lessons.length;
        const progress = state.userProgress[module.id];
        if (progress && progress.completed) {
            totalCompleted += progress.completed.length;
        }
    });

    const percentComplete = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    // Create progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-indicator';
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        width: ${percentComplete}%;
        background-color: var(--success-color);
        border-radius: 0 3px 3px 0;
    `;

    // Add progress percentage text
    elements.moduleSelectorBtn.innerHTML = `Progress <span style="font-size: 0.8em; opacity: 0.8;">${percentComplete}%</span>`;
    elements.moduleSelectorBtn.style.position = 'relative';

    // Remove any existing progress bar before adding new one
    const existingBar = elements.moduleSelectorBtn.querySelector('.progress-indicator');
    if (existingBar) {
        existingBar.remove();
    }

    elements.moduleSelectorBtn.appendChild(progressBar);
}

// Select a module
function selectModule(moduleId) {
    const selectedModule = state.modules.find(module => module.id === moduleId);
    if (!selectedModule) return;

    state.currentModule = selectedModule;

    // Update module list UI
    const moduleItems = elements.moduleList.querySelectorAll('.module-list-item');
    moduleItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.moduleId === moduleId) {
            item.classList.add('active');
        }
    });

    // Load user progress for this module
    if (!state.userProgress[moduleId]) {
        state.userProgress[moduleId] = { completed: [], current: 0 };
    }

    state.currentLessonIndex = state.userProgress[moduleId].current || 0;
    loadCurrentLesson();

    // Save the last selected module
    localStorage.setItem('lastModuleId', moduleId);

    // Reset any success indicators
    resetSuccessIndicators();
}

// Reset success indicators
function resetSuccessIndicators() {
    elements.lessonContainer.classList.remove('success-highlight');
    elements.lessonTitle.classList.remove('success-text');
    const headings = elements.lessonContainer.querySelectorAll('h2, h3, h4');
    headings.forEach(heading => heading.classList.remove('success-text'));
}

// Load the current lesson
function loadCurrentLesson() {
    if (!state.currentModule || !state.currentModule.lessons) {
        return;
    }

    // Make sure lesson index is in bounds
    if (state.currentLessonIndex >= state.currentModule.lessons.length) {
        state.currentLessonIndex = state.currentModule.lessons.length - 1;
    } else if (state.currentLessonIndex < 0) {
        state.currentLessonIndex = 0;
    }

    const lesson = state.currentModule.lessons[state.currentLessonIndex];
    lessonEngine.setLesson(lesson);

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

    // Update level indicator
    renderLevelIndicator(
        elements.levelIndicator,
        state.currentLessonIndex + 1,
        state.currentModule.lessons.length
    );

    // Update navigation buttons
    updateNavigationButtons();

    // Save current progress
    state.userProgress[state.currentModule.id].current = state.currentLessonIndex;
    saveUserProgress();

    // Update progress indicator on module selector button
    updateModuleSelectorButtonProgress();
}

// Update navigation buttons state
function updateNavigationButtons() {
    elements.prevBtn.disabled = state.currentLessonIndex === 0;
    elements.nextBtn.disabled = !state.currentModule ||
        state.currentLessonIndex === state.currentModule.lessons.length - 1;

    // Style changes for disabled buttons
    if (elements.prevBtn.disabled) {
        elements.prevBtn.classList.add('btn-disabled');
    } else {
        elements.prevBtn.classList.remove('btn-disabled');
    }

    if (elements.nextBtn.disabled) {
        elements.nextBtn.classList.add('btn-disabled');
    } else {
        elements.nextBtn.classList.remove('btn-disabled');
    }
}

// Go to the next lesson
function nextLesson() {
    if (!state.currentModule) return;

    if (state.currentLessonIndex < state.currentModule.lessons.length - 1) {
        state.currentLessonIndex++;
        loadCurrentLesson();
    }
}

// Go to the previous lesson
function prevLesson() {
    if (state.currentLessonIndex > 0) {
        state.currentLessonIndex--;
        loadCurrentLesson();
    }
}

// Run the user code
function runCode() {
    const userCode = elements.codeInput.value;
    const lesson = state.currentModule.lessons[state.currentLessonIndex];

    const validationResult = validateUserCode(userCode, lesson);

    if (validationResult.isValid) {
        // Mark lesson as completed
        const moduleProgress = state.userProgress[state.currentModule.id];
        if (!moduleProgress.completed.includes(state.currentLessonIndex)) {
            moduleProgress.completed.push(state.currentLessonIndex);
            saveUserProgress();
            updateModuleSelectorButtonProgress();
        }

        // Show success feedback with visual indicators
        showFeedback(true, validationResult.message || 'Great job! Your code works correctly.');

        // Add success visual indicators
        elements.lessonContainer.classList.add('success-highlight');
        elements.lessonTitle.classList.add('success-text');
        const headings = elements.lessonContainer.querySelectorAll('h3, h4');
        headings.forEach(heading => heading.classList.add('success-text'));

        // Apply the code to see the result
        lessonEngine.applyUserCode(userCode);

        // Enable the next button if not already on the last lesson
        if (state.currentLessonIndex < state.currentModule.lessons.length - 1) {
            elements.nextBtn.disabled = false;
            elements.nextBtn.classList.remove('btn-disabled');
        }
    } else {
        // Reset any success indicators
        resetSuccessIndicators();

        // Show error feedback (with friendly message)
        showFeedback(false, validationResult.message || 'Not quite there yet! Let\'s try again.');
    }
}

// Show the module selector modal
function showModuleSelector() {
    elements.modalTitle.textContent = 'Select a Module';

    // Create module buttons
    const moduleButtons = state.modules.map(module => {
        const button = document.createElement('button');
        button.classList.add('btn', 'module-button');
        button.style.display = 'block';
        button.style.width = '100%';
        button.style.marginBottom = '10px';
        button.style.padding = '15px';
        button.style.textAlign = 'left';

        // Add completion status
        const progress = state.userProgress[module.id];
        const completedCount = progress ? progress.completed.length : 0;
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

        button.addEventListener('click', () => {
            selectModule(module.id);
            closeModal();
        });

        return button;
    });

    // Clear and update modal content
    elements.modalContent.innerHTML = '';
    moduleButtons.forEach(button => {
        elements.modalContent.appendChild(button);
    });

    // Show the modal
    elements.modalContainer.classList.remove('hidden');
}

// Show help modal
function showHelp() {
    elements.modalTitle.textContent = 'Help';

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
      <li><strong>Run</strong> - Test your CSS code</li>
      <li><strong>Previous/Next</strong> - Navigate between lessons</li>
      <li><strong>Progress</strong> - Select a different learning module</li>
      <li><strong>Reset Progress</strong> - Clear all your saved progress</li>
    </ul>
    
    <h4>Tips</h4>
    <ul>
      <li>Use the preview area to see how your CSS affects the elements</li>
      <li>Your progress is automatically saved in your browser storage</li>
      <li>You can revisit completed lessons at any time</li>
      <li>Press Tab in the code editor to indent with two spaces</li>
      <li>Use Ctrl+Enter to quickly run your code</li>
    </ul>
  `;

    elements.modalContainer.classList.remove('hidden');
}

// Reset user progress
function resetProgress() {
    elements.modalTitle.textContent = 'Reset Progress';

    elements.modalContent.innerHTML = `
    <p>Are you sure you want to reset all your progress? This cannot be undone.</p>
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button id="cancel-reset" class="btn">Cancel</button>
      <button id="confirm-reset" class="btn btn-primary">Reset Progress</button>
    </div>
  `;

    document.getElementById('cancel-reset').addEventListener('click', closeModal);
    document.getElementById('confirm-reset').addEventListener('click', () => {
        localStorage.removeItem('codeCrispiesProgress');
        localStorage.removeItem('lastModuleId');
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

    elements.modalContainer.classList.remove('hidden');
}

// Close the modal
function closeModal() {
    elements.modalContainer.classList.add('hidden');
}

// Handle tab key in the code editor
function handleTabKey(e) {
    if (e.key === 'Tab') {
        e.preventDefault();

        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        // Add two spaces at cursor position
        e.target.value = e.target.value.substring(0, start) + '  ' + e.target.value.substring(end);

        // Move cursor position after the inserted spaces
        e.target.selectionStart = e.target.selectionEnd = start + 2;
    }
}

// Initialize the application
function init() {
    loadUserProgress();
    initializeModules();

    // Event listeners
    elements.prevBtn.addEventListener('click', prevLesson);
    elements.nextBtn.addEventListener('click', nextLesson);
    elements.runBtn.addEventListener('click', runCode);
    elements.modalClose.addEventListener('click', closeModal);
    elements.moduleSelectorBtn.addEventListener('click', showModuleSelector);
    elements.resetBtn.addEventListener('click', resetProgress);
    elements.helpBtn.addEventListener('click', showHelp);

    // Add tab key handler for the code input
    elements.codeInput.addEventListener('keydown', handleTabKey);

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to run code
        if (e.ctrlKey && e.key === 'Enter') {
            runCode();
            e.preventDefault();
        }
    });
}

// Start the application
init();