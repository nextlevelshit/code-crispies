/**
 * URL Router for Code Crispies
 * Handles hash-based routing for pages, sections, and lessons
 *
 * Route formats:
 * - #              -> Home landing page
 * - #de, #pl, #ar  -> Switch language and go to home
 * - #css           -> CSS section landing
 * - #html          -> HTML section landing
 * - #tailwind      -> Tailwind section landing
 * - #markdown      -> Markdown section landing
 * - #reference/css -> CSS cheatsheet
 * - #module/index  -> Lesson (e.g., #flexbox/2)
 */

/**
 * Route types
 */
export const RouteType = {
	HOME: "home",
	SECTION: "section",
	REFERENCE: "reference",
	LESSON: "lesson",
	LANGUAGE: "language"
};

/**
 * Valid section IDs
 */
const SECTIONS = ["css", "html", "markdown"]; // tailwind temporarily disabled

/**
 * Valid language codes for URL-based switching
 */
const LANGUAGES = ["en", "de", "pl", "es", "ar", "uk"];

/**
 * Parse current URL hash into route info
 * @returns {{ type: string, moduleId?: string, lessonIndex?: number, sectionId?: string, refId?: string } | null}
 */
export function parseHash() {
	const hash = window.location.hash.slice(1); // Remove '#'

	// Empty hash = home
	if (!hash) {
		return { type: RouteType.HOME };
	}

	const parts = hash.split("/");

	// Single segment routes
	if (parts.length === 1) {
		const segment = parts[0];

		// Language switching (e.g., #de, #pl, #ar)
		if (LANGUAGES.includes(segment)) {
			return { type: RouteType.LANGUAGE, lang: segment };
		}

		// Section landing pages
		if (SECTIONS.includes(segment)) {
			return { type: RouteType.SECTION, sectionId: segment };
		}

		// Reference index (no specific ref)
		if (segment === "reference") {
			return { type: RouteType.REFERENCE, refId: null };
		}

		// Single segment could be module with implicit lesson 0
		return { type: RouteType.LESSON, moduleId: segment, lessonIndex: 0 };
	}

	// Two segment routes
	if (parts.length === 2) {
		// Reference subpages
		if (parts[0] === "reference") {
			return { type: RouteType.REFERENCE, refId: parts[1] };
		}

		// Lesson route (existing behavior)
		const moduleId = parts[0];
		const lessonIndex = parseInt(parts[1], 10);

		if (moduleId && !isNaN(lessonIndex) && lessonIndex >= 0) {
			return { type: RouteType.LESSON, moduleId, lessonIndex };
		}
	}

	// Invalid route
	return null;
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
 * Update URL to a specific route
 * @param {string} route - The route string (e.g., "css", "reference/flexbox", "")
 */
export function navigateTo(route) {
	const newHash = route ? `#${route}` : "#";
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
 * Replace URL to a specific route without history entry
 * @param {string} route - The route string
 */
export function replaceTo(route) {
	const newHash = route ? `#${route}` : "#";
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

/**
 * Get valid section IDs
 * @returns {string[]}
 */
export function getSectionIds() {
	return [...SECTIONS];
}
