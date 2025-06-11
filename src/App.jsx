import React, { useState, useEffect } from "react";
import { useLessonEngine } from "./hooks/useLessonEngine.js";
import { loadModules } from "./config/lessons.js";
import { ModuleList } from "./components/ModuleList.jsx";
import { Feedback } from "./components/Feedback.jsx";
import { PreviewArea } from "./components/PreviewArea.jsx";

function App() {
	const lessonEngine = useLessonEngine();
	const [isLoading, setIsLoading] = useState(true);
	const [showHints, setShowHints] = useState(true);
	const [lastValidation, setLastValidation] = useState(null);
	const [modalState, setModalState] = useState({ isOpen: false, type: null });

	// Initialize modules on mount
	useEffect(() => {
		async function initializeModules() {
			try {
				const modules = await loadModules();
				lessonEngine.setModules(modules);

				// Load saved progress and select appropriate module
				const progressData = lessonEngine.engine.loadUserProgress();
				const lastModuleId = progressData?.lastModuleId;

				if (lastModuleId && modules.find((m) => m.id === lastModuleId)) {
					lessonEngine.setModuleById(lastModuleId);
				} else if (modules.length > 0) {
					lessonEngine.setModuleById(modules[0].id);
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Failed to load modules:", error);
				setIsLoading(false);
			}
		}

		initializeModules();
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.ctrlKey && e.key === "Enter") {
				handleRunCode();
				e.preventDefault();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleSelectLesson = (moduleId, lessonIndex) => {
		if (moduleId !== lessonEngine.currentState?.module?.id) {
			lessonEngine.setModuleById(moduleId);
		}
		lessonEngine.setLessonByIndex(lessonIndex);
		setLastValidation(null);
	};

	const handleCodeChange = (code) => {
		lessonEngine.applyUserCode(code);
		setLastValidation(null);
	};

	const handleRunCode = () => {
		const validation = lessonEngine.validateCode();
		setLastValidation(validation);
	};

	const handleResetProgress = () => {
		if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
			lessonEngine.clearProgress();
			setLastValidation(null);
		}
	};

	const openModal = (type) => {
		setModalState({ isOpen: true, type });
	};

	const closeModal = () => {
		setModalState({ isOpen: false, type: null });
	};

	const renderModalContent = () => {
		const { type } = modalState;

		if (type === "progress") {
			return (
				<>
					<h2>Select a Module</h2>
					<div className="modal-modules">
						{lessonEngine.modules.map((module) => {
							const completedCount = lessonEngine.userProgress[module.id]?.completed?.length || 0;
							const totalLessons = module.lessons.length;
							const percentComplete = Math.round((completedCount / totalLessons) * 100);

							return (
								<button
									key={module.id}
									className="modal-module-btn"
									onClick={() => {
										lessonEngine.setModuleById(module.id);
										closeModal();
									}}
								>
									<div className="module-info">
										<strong>{module.title}</strong>
										<p>{module.description}</p>
										<div className="progress-bar">
											<div className="progress-fill" style={{ width: `${percentComplete}%` }}></div>
										</div>
										<div className="progress-text">
											{completedCount}/{totalLessons} lessons completed
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</>
			);
		}

		if (type === "help") {
			return (
				<>
					<h2>Help</h2>
					<div className="help-content">
						<h3>How to Use Code Crispies</h3>
						<p>Code Crispies is an interactive platform for learning CSS through practical exercises.</p>

						<h4>Getting Started</h4>
						<p>
							Select a module from the sidebar to start learning. Each module contains a series of lessons focused on specific CSS
							concepts.
						</p>

						<h4>Completing Lessons</h4>
						<ol>
							<li>Read the instructions and objective</li>
							<li>Write your CSS code in the editor</li>
							<li>Click "Run" to test your solution</li>
							<li>If correct, you can proceed to the next lesson</li>
						</ol>

						<h4>Controls</h4>
						<ul>
							<li>
								<strong>Run</strong> - Test your CSS code and apply it to the preview
							</li>
							<li>
								<strong>Previous/Next</strong> - Navigate between lessons
							</li>
							<li>
								<strong>Progress</strong> - Select a different learning module
							</li>
							<li>
								<strong>Reset Progress</strong> - Clear all your saved progress
							</li>
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
					</div>
				</>
			);
		}

		return null;
	};

	const handleTabKey = (e) => {
		if (e.key === "Tab") {
			e.preventDefault();
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;
			e.target.value = e.target.value.substring(0, start) + "  " + e.target.value.substring(end);
			e.target.selectionStart = e.target.selectionEnd = start + 2;
		}
	};

	if (isLoading) {
		return <div className="app-container">Loading...</div>;
	}

	const { currentState } = lessonEngine;
	const progressStats = lessonEngine.getProgressStats();

	return (
		<div className="app-container">
			<header className="header">
				<div className="logo">
					<img src="./bowl.png" width="52" alt="CODE CRISPIES Logo" />
					<h1>
						CODE
						<br />
						<span>CRISPIES</span>
					</h1>
				</div>
				<nav className="main-nav">
					<ul>
						<li className="toggle-container">
							<label className="toggle-switch" title="Toggle error feedback">
								<input type="checkbox" checked={showHints} onChange={(e) => setShowHints(e.target.checked)} />
								<span className="toggle-slider"></span>
								<span className="toggle-label">Show Hints</span>
							</label>
						</li>
						<li>
							<button className="btn" onClick={() => openModal("progress")}>
								Progress ({progressStats.totalCompleted}/{progressStats.totalLessons})
							</button>
						</li>
						<li>
							<button className="btn" onClick={handleResetProgress}>
								Reset Progress
							</button>
						</li>
						<li>
							<button className="btn" onClick={() => openModal("help")}>
								Help
							</button>
						</li>
					</ul>
				</nav>
			</header>

			<main className="main-content">
				<div className="sidebar">
					<ModuleList
						modules={lessonEngine.modules}
						userProgress={lessonEngine.userProgress}
						currentModuleId={currentState?.module?.id}
						currentLessonIndex={currentState?.lessonIndex}
						onSelectModule={lessonEngine.setModuleById}
						onSelectLesson={handleSelectLesson}
					/>
				</div>

				<div className="content-area">
					<div className="lesson-container">
						<h2>{currentState?.lesson?.title || "Loading..."}</h2>
						<div className="lesson-description">
							<div
								dangerouslySetInnerHTML={{
									__html: currentState?.lesson?.description || "Please select a lesson to begin."
								}}
							/>
						</div>

						<div className="challenge-container">
							<PreviewArea previewContent={currentState?.previewContent} />

							<div className="editor-container">
								<div className="task-instruction">
									{currentState?.lesson?.task && <div dangerouslySetInnerHTML={{ __html: currentState.lesson.task }} />}
								</div>

								<div className="code-editor">
									<div className="editor-header">
										<label htmlFor="code-input">
											{currentState?.lesson?.mode === "tailwind" ? "Tailwind Classes" : "CSS Editor"}
										</label>
										<div className="validation-indicators-container">
											{currentState?.isCompleted && <span className="completion-indicator">✓ Completed</span>}
										</div>
										<button className="btn btn-secondary" onClick={handleRunCode}>
											<img src="./gear.svg" alt="" />
											Run
										</button>
									</div>
									<div className="editor-content">
										<textarea
											id="code-input"
											className="code-input"
											spellCheck={false}
											value={currentState?.userCode || ""}
											onChange={(e) => handleCodeChange(e.target.value)}
											onKeyDown={handleTabKey}
											placeholder={
												currentState?.lesson?.mode === "tailwind"
													? "Enter Tailwind classes here..."
													: "Enter CSS code here..."
											}
										/>
									</div>
									<Feedback validation={lastValidation} showHints={showHints} />
								</div>
							</div>
						</div>

						<div className="controls">
							<button className="btn" disabled={!currentState?.canGoPrev} onClick={lessonEngine.previousLesson}>
								Previous
							</button>
							<div className="level-indicator">
								Level {(currentState?.lessonIndex || 0) + 1} of {currentState?.totalLessons || 0}
							</div>
							<button className="btn btn-primary" disabled={!currentState?.canGoNext} onClick={lessonEngine.nextLesson}>
								Next
							</button>
						</div>

						<footer>
							Free and Open Source Software:{" "}
							<a href="https://github.com/nextlevelshit/code-crispies" target="_blank" rel="noopener noreferrer">
								https://github.com/nextlevelshit/code-crispies
							</a>{" "}
							by{" "}
							<a href="https://dailysh.it" title="Website of Michael W. Czechowski">
								Michael W. Czechowski
							</a>
						</footer>
					</div>
				</div>
			</main>

			{/* Modal */}
			{modalState.isOpen && (
				<div className="modal-container">
					<div className="modal-overlay" onClick={closeModal}></div>
					<div className="modal">
						<button className="modal-close" onClick={closeModal}>
							×
						</button>
						<div className="modal-content">{renderModalContent()}</div>
					</div>
				</div>
			)}

			<style jsx>{`
				.modal-container {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 1000;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.modal-overlay {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: rgba(0, 0, 0, 0.5);
				}

				.modal {
					position: relative;
					background: white;
					border-radius: 8px;
					padding: 2rem;
					max-width: 90vw;
					max-height: 90vh;
					overflow-y: auto;
					box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
				}

				.modal-close {
					position: absolute;
					top: 1rem;
					right: 1rem;
					background: none;
					border: none;
					font-size: 1.5rem;
					cursor: pointer;
					color: #666;
				}

				.modal-close:hover {
					color: #000;
				}

				.modal-modules {
					display: flex;
					flex-direction: column;
					gap: 1rem;
				}

				.modal-module-btn {
					display: block;
					width: 100%;
					text-align: left;
					padding: 1.5rem;
					border: 1px solid #ddd;
					border-radius: 8px;
					background: white;
					cursor: pointer;
					transition: all 0.2s;
				}

				.modal-module-btn:hover {
					border-color: var(--primary-color);
					background: #f8f9fa;
				}

				.module-info strong {
					display: block;
					margin-bottom: 0.5rem;
					font-size: 1.1rem;
				}

				.module-info p {
					margin: 0.5rem 0;
					color: #666;
					font-size: 0.9rem;
				}

				.progress-bar {
					height: 6px;
					background-color: #f0f0f0;
					border-radius: 3px;
					margin: 0.8rem 0 0.5rem 0;
				}

				.progress-fill {
					height: 100%;
					background-color: var(--primary-color);
					border-radius: 3px;
					transition: width 0.3s;
				}

				.progress-text {
					font-size: 0.8rem;
					text-align: right;
					color: #666;
				}

				.help-content h3 {
					margin-top: 1.5rem;
					margin-bottom: 0.5rem;
				}

				.help-content h4 {
					margin-top: 1.2rem;
					margin-bottom: 0.4rem;
					color: var(--primary-color);
				}

				.help-content ul,
				.help-content ol {
					padding-left: 1.5rem;
				}

				.help-content li {
					margin-bottom: 0.3rem;
				}
			`}</style>
		</div>
	);
}

export default App;
