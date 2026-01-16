/**
 * Section definitions for Code Crispies
 * Sections group related modules (CSS, HTML, Tailwind)
 */

export const sections = {
	css: {
		id: "css",
		title: "CSS",
		description: "Styling, layout, and animations",
		color: "#7b68a6",
		order: 1
	},
	html: {
		id: "html",
		title: "HTML",
		description: "Semantic markup and native elements",
		color: "#c75b7a",
		order: 2
	},
	tailwind: {
		id: "tailwind",
		title: "Tailwind CSS",
		description: "Utility-first CSS framework",
		color: "#4a9ea8",
		order: 3
	}
};

/**
 * Get section by ID
 * @param {string} sectionId
 * @returns {object|null}
 */
export function getSection(sectionId) {
	return sections[sectionId] || null;
}

/**
 * Get all sections sorted by order
 * @returns {object[]}
 */
export function getSectionList() {
	return Object.values(sections).sort((a, b) => a.order - b.order);
}

/**
 * Infer section from module mode
 * @param {object} module
 * @returns {string}
 */
export function getModuleSection(module) {
	// Explicit section takes precedence
	if (module.section) return module.section;

	// Infer from mode
	const mode = module.mode || "css";
	if (mode === "html") return "html";
	if (mode === "tailwind") return "tailwind";
	return "css";
}

/**
 * Filter modules by section
 * @param {object[]} modules
 * @param {string} sectionId
 * @returns {object[]}
 */
export function getModulesBySection(modules, sectionId) {
	return modules.filter((m) => {
		// Skip excluded modules (welcome, goodbye)
		if (m.excludeFromProgress) return false;
		return getModuleSection(m) === sectionId;
	});
}
