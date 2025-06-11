import { useState, useEffect, useCallback, useRef } from "react";
import { LessonEngine } from "../impl/LessonEngine.js";

export function useLessonEngine() {
	const engineRef = useRef(null);
	const [currentState, setCurrentState] = useState(null);

	// Initialize engine once
	if (!engineRef.current) {
		engineRef.current = new LessonEngine();
	}

	const engine = engineRef.current;

	// Subscribe to engine state changes
	useEffect(() => {
		const unsubscribe = engine.subscribe(setCurrentState);
		// Set initial state
		setCurrentState(engine.getCurrentState());

		return unsubscribe;
	}, [engine]);

	const setModules = useCallback(
		(modules) => {
			engine.setModules(modules);
		},
		[engine]
	);

	const setModuleById = useCallback(
		(moduleId) => {
			return engine.setModuleById(moduleId);
		},
		[engine]
	);

	const setLessonByIndex = useCallback(
		(index) => {
			return engine.setLessonByIndex(index);
		},
		[engine]
	);

	const nextLesson = useCallback(() => {
		return engine.nextLesson();
	}, [engine]);

	const previousLesson = useCallback(() => {
		return engine.previousLesson();
	}, [engine]);

	const applyUserCode = useCallback(
		(code) => {
			engine.applyUserCode(code);
		},
		[engine]
	);

	const validateCode = useCallback(() => {
		return engine.validateCode();
	}, [engine]);

	const reset = useCallback(() => {
		engine.reset();
	}, [engine]);

	const clearProgress = useCallback(() => {
		engine.clearProgress();
	}, [engine]);

	const getProgressStats = useCallback(() => {
		return engine.getProgressStats();
	}, [engine]);

	const isLessonCompleted = useCallback(
		(moduleId, lessonIndex) => {
			return engine.isLessonCompleted(moduleId, lessonIndex);
		},
		[engine]
	);

	return {
		engine, // Direct access for complex operations
		currentState,
		modules: engine.modules,
		userProgress: engine.userProgress,
		setModules,
		setModuleById,
		setLessonByIndex,
		nextLesson,
		previousLesson,
		applyUserCode,
		validateCode,
		reset,
		clearProgress,
		getProgressStats,
		isLessonCompleted
	};
}
