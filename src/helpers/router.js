/**
 * URL Router for Code Crispies
 * Handles hash-based routing for shareable lesson links
 * Format: #module-id/lesson-index (e.g., #flexbox/2)
 */

/**
 * Parse current URL hash into module and lesson info
 * @returns {{ moduleId: string, lessonIndex: number } | null}
 */
export function parseHash() {
	const hash = window.location.hash.slice(1); // Remove '#'
	if (!hash) return null;

	const parts = hash.split("/");
	if (parts.length !== 2) return null;

	const moduleId = parts[0];
	const lessonIndex = parseInt(parts[1], 10);

	if (!moduleId || isNaN(lessonIndex) || lessonIndex < 0) return null;

	return { moduleId, lessonIndex };
}

/**
 * Update URL hash with history entry (for navigation)
 * @param {string} moduleId
 * @param {number} lessonIndex
 */
export function updateHash(moduleId, lessonIndex) {
	const newHash = `#${moduleId}/${lessonIndex}`;
	if (window.location.hash !== newHash) {
		history.pushState(null, "", newHash);
	}
}

/**
 * Replace URL hash without history entry (for invalid URL fallbacks)
 * @param {string} moduleId
 * @param {number} lessonIndex
 */
export function replaceHash(moduleId, lessonIndex) {
	const newHash = `#${moduleId}/${lessonIndex}`;
	history.replaceState(null, "", newHash);
}

/**
 * Build full shareable URL for current lesson
 * @param {string} moduleId
 * @param {number} lessonIndex
 * @returns {string}
 */
export function getShareableUrl(moduleId, lessonIndex) {
	const base = window.location.origin + window.location.pathname;
	return `${base}#${moduleId}/${lessonIndex}`;
}
