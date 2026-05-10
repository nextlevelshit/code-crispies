/**
 * URL Router for Code Crispies
 * Path-based routing using History API for real deep-link SEO.
 *
 * Route formats:
 * - /              -> Home landing page
 * - /de, /pl, ...  -> Switch language and go to home
 * - /css           -> CSS section landing
 * - /html          -> HTML section landing
 * - /tailwind      -> Tailwind section landing
 * - /markdown      -> Markdown section landing
 * - /reference/css -> CSS cheatsheet
 * - /flexbox/2     -> Lesson (module/index)
 *
 * Legacy hash routes (#flexbox/2) are detected on bootstrap and
 * redirected to the equivalent path (see migrateLegacyHashRoute).
 */

export const RouteType = {
	HOME: "home",
	SECTION: "section",
	REFERENCE: "reference",
	LESSON: "lesson",
	LANGUAGE: "language"
};

const SECTIONS = ["css", "html", "markdown", "javascript"]; // tailwind temporarily disabled
const LANGUAGES = ["en", "de", "pl", "es", "ar", "uk"];

/**
 * Parse the current URL pathname into route info.
 * @returns {{ type: string, moduleId?: string, lessonIndex?: number, sectionId?: string, refId?: string, lang?: string } | null}
 */
export function parseRoute() {
	const path = window.location.pathname.replace(/^\/+|\/+$/g, "");

	if (!path) {
		return { type: RouteType.HOME };
	}

	const parts = path.split("/");

	if (parts.length === 1) {
		const segment = parts[0];

		if (LANGUAGES.includes(segment)) {
			return { type: RouteType.LANGUAGE, lang: segment };
		}
		if (SECTIONS.includes(segment)) {
			return { type: RouteType.SECTION, sectionId: segment };
		}
		if (segment === "reference") {
			return { type: RouteType.REFERENCE, refId: null };
		}
		return { type: RouteType.LESSON, moduleId: segment, lessonIndex: 0 };
	}

	if (parts.length === 2) {
		if (parts[0] === "reference") {
			return { type: RouteType.REFERENCE, refId: parts[1] };
		}
		const moduleId = parts[0];
		const lessonIndex = parseInt(parts[1], 10);
		if (moduleId && !isNaN(lessonIndex) && lessonIndex >= 0) {
			return { type: RouteType.LESSON, moduleId, lessonIndex };
		}
	}

	return null;
}

/** Backwards-compat alias for the old hash-based parser. */
export const parseHash = parseRoute;

function lessonPath(moduleId, lessonIndex) {
	// Trailing slash so URLs match what nginx serves for static
	// per-lesson HTML at dist/<moduleId>/<index>/index.html — avoids
	// a 301 redirect on every in-app navigation.
	return `/${moduleId}/${lessonIndex}/`;
}

function routePath(route) {
	if (!route) return "/";
	const path = route.startsWith("/") ? route : `/${route}`;
	return path.endsWith("/") ? path : `${path}/`;
}

/** Update URL with history entry (for navigation). */
export function updateHash(moduleId, lessonIndex) {
	const newPath = lessonPath(moduleId, lessonIndex);
	if (window.location.pathname !== newPath) {
		history.pushState(null, "", newPath);
	}
}

/** Navigate to a specific route segment ("css", "reference/flexbox", "" for home). */
export function navigateTo(route) {
	const newPath = routePath(route);
	if (window.location.pathname !== newPath) {
		history.pushState(null, "", newPath);
	}
}

/** Replace URL without history entry (for invalid URL fallbacks). */
export function replaceHash(moduleId, lessonIndex) {
	history.replaceState(null, "", lessonPath(moduleId, lessonIndex));
}

export function replaceTo(route) {
	history.replaceState(null, "", routePath(route));
}

export function getShareableUrl(moduleId, lessonIndex) {
	return `${window.location.origin}${lessonPath(moduleId, lessonIndex)}`;
}

export function getSectionIds() {
	return [...SECTIONS];
}

/**
 * One-time bootstrap: if the URL still uses a legacy `#path` route,
 * redirect to the equivalent path-based URL. Pure anchor hashes like
 * `#main-content` are left alone.
 *
 * Run once on app start BEFORE the first parseRoute() call.
 *
 * @returns {boolean} true if a redirect happened (caller should skip
 *   further routing this tick — popstate/load will fire fresh).
 */
export function migrateLegacyHashRoute() {
	const hash = window.location.hash.slice(1);
	if (!hash) return false;

	const parts = hash.split("/");
	const first = parts[0];

	const looksLikeRoute =
		LANGUAGES.includes(first) ||
		SECTIONS.includes(first) ||
		first === "reference" ||
		// module/index pattern: 2 parts, second is numeric
		(parts.length === 2 && !isNaN(parseInt(parts[1], 10)));

	if (!looksLikeRoute) return false;

	// Use trailing slash so the migrated URL matches the canonical
	// served path (avoids a follow-up nginx 301).
	const trailing = hash.endsWith("/") ? "" : "/";
	const newUrl = `/${hash}${trailing}${window.location.search}`;
	history.replaceState(null, "", newUrl);
	return true;
}
