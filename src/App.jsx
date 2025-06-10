// src/App.jsx
import React, { useState, useEffect } from "react";
import { useLessonEngine } from "./hooks/useLessonEngine.js";
import { loadModules } from "./config/lessons.js";

function App() {
	const lessonEngine = useLessonEngine();
	const [isLoading, setIsLoading] = useState(true);

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

		initializeModules().catch();
	}, [lessonEngine]);

	if (isLoading) {
		return <div className="app-container">Loading...</div>;
	}

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
								<input type="checkbox" id="disable-feedback-toggle" defaultChecked />
								<span className="toggle-slider"></span>
								<span className="toggle-label">Show Hints</span>
							</label>
						</li>
						<li>
							<button className="btn">Progress</button>
						</li>
						<li>
							<button className="btn">Reset Progress</button>
						</li>
						<li>
							<button className="btn">Help</button>
						</li>
					</ul>
				</nav>
			</header>

			<main className="main-content">
				<div className="sidebar">
					<div className="module-list">
						<h3>CSS Lessons</h3>
						{/* TODO: Convert to ModuleList component */}
					</div>
				</div>

				<div className="content-area">
					<div className="lesson-container">
						<h2>{lessonEngine.currentState?.lesson?.title || "Loading..."}</h2>
						<div className="lesson-description">
							{lessonEngine.currentState?.lesson?.description || "Please select a lesson to begin."}
						</div>

						<div className="challenge-container">
							<div className="preview-area" id="preview-area">
								{/* Preview will be rendered here by LessonEngine */}
							</div>

							<div className="editor-container">
								<div className="task-instruction">
									{lessonEngine.currentState?.lesson?.task && (
										<div dangerouslySetInnerHTML={{ __html: lessonEngine.currentState.lesson.task }} />
									)}
								</div>

								<div className="code-editor">
									<div className="editor-header">
										<label htmlFor="code-input">CSS Editor</label>
										<div className="validation-indicators-container"></div>
										<button className="btn btn-secondary">
											<img src="./gear.svg" alt="" />
											Run
										</button>
									</div>
									<div className="editor-content">
										<textarea
											id="code-input"
											className="code-input"
											spellCheck={false}
											value={lessonEngine.currentState?.userCode || ""}
											onChange={(e) => lessonEngine.applyUserCode(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>

						<footer>
							Free and Open Source Software:
							<a href="https://github.com/nextlevelshit/code-crispies" target="_blank" rel="noopener noreferrer">
								https://github.com/nextlevelshit/code-crispies
							</a>
							by{" "}
							<a href="https://dailysh.it" title="Website of Michael W. Czechowski">
								Michael W. Czechowski
							</a>
						</footer>

						<div className="controls">
							<button className="btn" disabled={!lessonEngine.currentState?.canGoPrev} onClick={lessonEngine.previousLesson}>
								Previous
							</button>
							<div className="level-indicator">
								Level {(lessonEngine.currentState?.lessonIndex || 0) + 1} of {lessonEngine.currentState?.totalLessons || 0}
							</div>
							<button className="btn btn-primary" disabled={!lessonEngine.currentState?.canGoNext} onClick={lessonEngine.nextLesson}>
								Next
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
