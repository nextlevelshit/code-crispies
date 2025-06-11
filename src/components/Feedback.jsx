import React from "react";

export function Feedback({ validation, showHints }) {
	if (!validation || (validation.isValid && !validation.message)) return null;
	if (!validation.isValid && !showHints) return null;

	return <div className={validation.isValid ? "feedback-success" : "feedback-error"}>{validation.message}</div>;
}
