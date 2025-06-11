import React, { useState, useEffect } from "react";

// Module List Component
export function ModuleList({ modules, userProgress, currentModuleId, currentLessonIndex, onSelectModule, onSelectLesson }) {
	const [expandedModules, setExpandedModules] = useState(new Set());

	const toggleModule = (moduleId) => {
		setExpandedModules((prev) => {
			const next = new Set(prev);
			if (next.has(moduleId)) {
				next.delete(moduleId);
			} else {
				next.add(moduleId);
			}
			return next;
		});
	};

	// Auto-expand current module
	useEffect(() => {
		if (currentModuleId) {
			setExpandedModules((prev) => new Set(prev).add(currentModuleId));
		}
	}, [currentModuleId]);

	return (
		<div className="module-list">
			<h3>CSS Lessons</h3>
			{modules.map((module) => {
				const isExpanded = expandedModules.has(module.id);
				const moduleProgress = userProgress[module.id];
				const isModuleCompleted = moduleProgress?.completed?.length === module.lessons.length;

				return (
					<div key={module.id} className="module-container">
						<div
							className={`module-list-item module-header ${isModuleCompleted ? "completed" : ""}`}
							onClick={() => toggleModule(module.id)}
						>
							<span className="expand-icon">{isExpanded ? "▼" : "▶"}</span>
							<span className="module-title">{module.title}</span>
						</div>

						{isExpanded && (
							<div className="lessons-container">
								{module.lessons.map((lesson, index) => {
									const isCompleted = moduleProgress?.completed?.includes(index);
									const isCurrent = module.id === currentModuleId && index === currentLessonIndex;

									return (
										<div
											key={index}
											className={`lesson-list-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current active" : ""}`}
											onClick={() => onSelectLesson(module.id, index)}
										>
											{lesson.title || `Lesson ${index + 1}`}
										</div>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
