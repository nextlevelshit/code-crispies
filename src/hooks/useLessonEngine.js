import { useState, useEffect, useCallback } from "react";
import { LessonEngine } from "../impl/LessonEngine.js";

export function useLessonEngine() {
	const [engine] = useState(() => new LessonEngine());
	const [currentState, setCurrentState] = useState(null);

	// Update state whenever engine state changes
	const updateState = useCallback(() => {
		setCurrentState(engine.getCurrentState());
	}, [engine]);

	const setModules = useCallback(
		(modules) => {
			engine.setModules(modules);
			updateState();
		},
		[engine, updateState]
	);

	const setModuleById = useCallback(
		(moduleId) => {
			const success = engine.setModuleById(moduleId);
			if (success) updateState();
			return success;
		},
		[engine, updateState]
	);

	const setLessonByIndex = useCallback(
		(index) => {
			const success = engine.setLessonByIndex(index);
			if (success) updateState();
			return success;
		},
		[engine, updateState]
	);

	const nextLesson = useCallback(() => {
		const success = engine.nextLesson();
		if (success) updateState();
		return success;
	}, [engine, updateState]);

	const previousLesson = useCallback(() => {
		const success = engine.previousLesson();
		if (success) updateState();
		return success;
	}, [engine, updateState]);

	const applyUserCode = useCallback(
		(code, forceUpdate = false) => {
			engine.applyUserCode(code, forceUpdate);
			updateState();
		},
		[engine, updateState]
	);

	const validateCode = useCallback(() => {
		const result = engine.validateCode();
		updateState(); // Progress might have changed
		return result;
	}, [engine, updateState]);

	const reset = useCallback(() => {
		engine.reset();
		updateState();
	}, [engine, updateState]);

	const clearProgress = useCallback(() => {
		engine.clearProgress();
		updateState();
	}, [engine, updateState]);

	const getProgressStats = useCallback(() => {
		return engine.getProgressStats();
	}, [engine]);

	const isLessonCompleted = useCallback(
		(moduleId, lessonIndex) => {
			return engine.isLessonCompleted(moduleId, lessonIndex);
		},
		[engine]
	);

	// Initialize state on mount
	useEffect(() => {
		updateState();
	}, [updateState]);

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
