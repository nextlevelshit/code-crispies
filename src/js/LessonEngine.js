/**
 * LessonEngine - Core class for managing lessons and applying/testing user code
 * This file is the implementation of the LessonEngine class declaration from app.js
 */
import { validateUserCode } from './validator.js';
import { showFeedback } from './renderer.js';

export class LessonEngine {
    constructor() {
        this.currentLesson = null;
        this.userCode = '';
        this.currentModule = null;
        this.currentLessonIndex = 0;
    }

    /**
     * Set the current module
     * @param {Object} module - The module object from the config
     */
    setModule(module) {
        this.currentModule = module;
        this.currentLessonIndex = 0;
        if (module && module.lessons && module.lessons.length > 0) {
            this.setLesson(module.lessons[0]);
        }
    }

    /**
     * Set the current lesson
     * @param {Object} lesson - The lesson object from the config
     */
    setLesson(lesson) {
        this.currentLesson = lesson;
        this.userCode = lesson.initialCode || '';
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
     * Apply user-written CSS to the preview area
     * @param {string} code - User CSS code
     */
    applyUserCode(code) {
        if (!this.currentLesson) return;

        this.userCode = code;
        this.renderPreview();
    }

    /**
     * Render the preview for the current lesson
     */
    renderPreview() {
        if (!this.currentLesson) return;

        const { previewHTML, previewBaseCSS, previewContainer, sandboxCSS } = this.currentLesson;

        // Create an iframe for isolated preview rendering
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.title = 'Preview';

        // Get the preview container
        const container = document.getElementById(previewContainer || 'preview-area');

        // Clear the container and add the iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // Create the complete CSS by combining base CSS with user code and sandbox CSS
        const combinedCSS = `
            /* Base CSS */
            ${previewBaseCSS || ''}
            
            /* User Code */
            ${this.userCode || ''}
            
            /* Sandbox CSS (for visualizing the exercise) */
            ${sandboxCSS || ''}
        `;

        // Write the content to the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <style>${combinedCSS}</style>
                </head>
                <body>
                    ${previewHTML || '<div>No preview available</div>'}
                </body>
            </html>
        `);
        iframeDoc.close();
    }

    /**
     * Validate user code against the current lesson's requirements
     * @returns {Object} Validation result
     */
    validateCode() {
        if (!this.currentLesson) {
            return { isValid: false, message: 'No active lesson to validate against.' };
        }

        const result = validateUserCode(this.userCode, this.currentLesson);

        // Display feedback to the user
        showFeedback(result.isValid, result.message);

        return result;
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
            totalLessons: this.currentModule ? this.currentModule.lessons.length : 0
        };
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        if (!this.currentModule || !this.currentLesson) return;

        const progressData = {
            moduleId: this.currentModule.id,
            lessonIndex: this.currentLessonIndex,
            userCode: this.userCode,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('cssQuest_progress', JSON.stringify(progressData));
    }

    /**
     * Load progress from localStorage
     * @param {Array} modules - Available modules
     * @returns {Object|null} Loaded progress data or null if not found
     */
    loadProgress(modules) {
        const savedProgress = localStorage.getItem('cssQuest_progress');
        if (!savedProgress) return null;

        try {
            const progressData = JSON.parse(savedProgress);

            // Find the module
            const module = modules.find(m => m.id === progressData.moduleId);
            if (!module) return null;

            this.setModule(module);
            this.setLessonByIndex(progressData.lessonIndex);

            // Restore user code if available
            if (progressData.userCode) {
                this.userCode = progressData.userCode;
                this.renderPreview();
            }

            return progressData;
        } catch (e) {
            console.error('Error loading progress:', e);
            return null;
        }
    }

    /**
     * Reset the current state
     */
    reset() {
        if (this.currentLesson) {
            this.userCode = this.currentLesson.initialCode || '';
            this.renderPreview();
        }
    }

    /**
     * Clear all saved progress
     */
    clearProgress() {
        localStorage.removeItem('cssQuest_progress');
    }
}