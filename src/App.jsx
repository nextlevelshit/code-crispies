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

	const handleSelectLesson = (moduleId, lessonIndex) => {
		if (moduleId !== lessonEngine.currentState?.module?.id) {
			lessonEngine.setModuleById(moduleId);
		}
		lessonEngine.setLessonByIndex(lessonIndex);
		setLastValidation(null); // Clear validation when switching lessons
	};

	const handleCodeChange = (code) => {
		lessonEngine.applyUserCode(code);
		setLastValidation(null); // Clear validation when code changes
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
							<button className="btn">
								Progress ({progressStats.totalCompleted}/{progressStats.totalLessons})
							</button>
						</li>
						<li>
							<button className="btn" onClick={handleResetProgress}>
								Reset Progress
							</button>
						</li>
						<li>
							<button className="btn">Help</button>
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
		</div>
	);
}

export default App;
