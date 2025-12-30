/**
 * Lesson Config - Functions for loading lesson configurations
 * Supports English and German lesson content
 */

// English lesson imports
import basicSelectorsEN from "../../lessons/00-basic-selectors.json";
import advancedSelectorsEN from "../../lessons/01-advanced-selectors.json";
import boxModelEN from "../../lessons/01-box-model.json";
import unitsVariablesEN from "../../lessons/05-units-variables.json";
import transitionsAnimationsEN from "../../lessons/06-transitions-animations.json";
import responsiveEN from "../../lessons/08-responsive.json";
import tailwindEN from "../../lessons/10-tailwind-basics.json";
import htmlElementsEN from "../../lessons/20-html-elements.json";
import htmlFormsBasicEN from "../../lessons/21-html-forms-basic.json";
import htmlFormsValidationEN from "../../lessons/22-html-forms-validation.json";
import htmlDetailsSummaryEN from "../../lessons/23-html-details-summary.json";
import htmlProgressMeterEN from "../../lessons/24-html-progress-meter.json";
import htmlDatalistEN from "../../lessons/25-html-datalist.json";
import htmlDataAttributesEN from "../../lessons/26-html-data-attributes.json";
import htmlDialogEN from "../../lessons/27-html-dialog.json";
import htmlFormsFieldsetEN from "../../lessons/28-html-forms-fieldset.json";
import htmlFigureEN from "../../lessons/29-html-figure.json";
import htmlTablesEN from "../../lessons/30-html-tables.json";
import htmlMarqueeEN from "../../lessons/31-html-marquee.json";
import htmlSvgEN from "../../lessons/32-html-svg.json";
import flexboxEN from "../../lessons/flexbox.json";

// German lesson imports
import basicSelectorsDE from "../../lessons/de/00-basic-selectors.json";
import advancedSelectorsDE from "../../lessons/de/01-advanced-selectors.json";
import boxModelDE from "../../lessons/de/01-box-model.json";
import unitsVariablesDE from "../../lessons/de/05-units-variables.json";
import transitionsAnimationsDE from "../../lessons/de/06-transitions-animations.json";
import responsiveDE from "../../lessons/de/08-responsive.json";
import tailwindDE from "../../lessons/de/10-tailwind-basics.json";
import htmlElementsDE from "../../lessons/de/20-html-elements.json";
import htmlFormsBasicDE from "../../lessons/de/21-html-forms-basic.json";
import htmlFormsValidationDE from "../../lessons/de/22-html-forms-validation.json";
import htmlDetailsSummaryDE from "../../lessons/de/23-html-details-summary.json";
import htmlProgressMeterDE from "../../lessons/de/24-html-progress-meter.json";
import htmlDatalistDE from "../../lessons/de/25-html-datalist.json";
import htmlDataAttributesDE from "../../lessons/de/26-html-data-attributes.json";
import htmlDialogDE from "../../lessons/de/27-html-dialog.json";
import htmlFormsFieldsetDE from "../../lessons/de/28-html-forms-fieldset.json";
import htmlFigureDE from "../../lessons/de/29-html-figure.json";
import htmlTablesDE from "../../lessons/de/30-html-tables.json";
import htmlMarqueeDE from "../../lessons/de/31-html-marquee.json";
import htmlSvgDE from "../../lessons/de/32-html-svg.json";
import flexboxDE from "../../lessons/de/flexbox.json";

// English module store - ordered by learning path
const moduleStoreEN = [
	// HTML Grundlagen
	htmlElementsEN,
	htmlFormsBasicEN,
	htmlFormsValidationEN,
	htmlFormsFieldsetEN,
	htmlDatalistEN,
	// HTML Interaktiv
	htmlDetailsSummaryEN,
	htmlProgressMeterEN,
	htmlDialogEN,
	htmlDataAttributesEN,
	// HTML Weitere
	htmlFigureEN,
	htmlTablesEN,
	htmlSvgEN,
	htmlMarqueeEN,
	// CSS Grundlagen
	basicSelectorsEN,
	boxModelEN,
	unitsVariablesEN,
	// CSS Layouts
	flexboxEN,
	responsiveEN,
	// CSS Fortgeschritten
	advancedSelectorsEN,
	transitionsAnimationsEN,
	// Tailwind
	tailwindEN
];

// German module store - ordered by learning path
const moduleStoreDE = [
	// HTML Grundlagen
	htmlElementsDE,
	htmlFormsBasicDE,
	htmlFormsValidationDE,
	htmlFormsFieldsetDE,
	htmlDatalistDE,
	// HTML Interaktiv
	htmlDetailsSummaryDE,
	htmlProgressMeterDE,
	htmlDialogDE,
	htmlDataAttributesDE,
	// HTML Weitere
	htmlFigureDE,
	htmlTablesDE,
	htmlSvgDE,
	htmlMarqueeDE,
	// CSS Grundlagen
	basicSelectorsDE,
	boxModelDE,
	unitsVariablesDE,
	// CSS Layouts
	flexboxDE,
	responsiveDE,
	// CSS Fortgeschritten
	advancedSelectorsDE,
	transitionsAnimationsDE,
	// Tailwind
	tailwindDE
];

/**
 * Load all available modules for a given language
 * @param {string} language - Language code ('en' or 'de')
 * @returns {Promise<Array>} Promise resolving to array of modules
 */
export async function loadModules(language = "en") {
	const store = language === "de" ? moduleStoreDE : moduleStoreEN;
	return store.map((module) => ({
		...module,
		lessons: module.lessons.map((lesson) => ({
			...lesson,
			mode: module.mode || "css"
		}))
	}));
}

/**
 * Get a module by its ID
 * @param {string} moduleId - The module ID to find
 * @param {string} language - Language code ('en' or 'de')
 * @returns {Object|null} The module object or null if not found
 */
export function getModuleById(moduleId, language = "en") {
	const store = language === "de" ? moduleStoreDE : moduleStoreEN;
	return store.find((module) => module.id === moduleId) || null;
}

/**
 * Load module configs from a URL
 * @param {string} url - URL to load the config from
 * @returns {Promise<Object>} Promise resolving to the module config
 */
export async function loadModuleFromUrl(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to load module: ${response.status} ${response.statusText}`);
		}

		const moduleConfig = await response.json();
		validateModuleConfig(moduleConfig);

		return moduleConfig;
	} catch (error) {
		console.error("Error loading module from URL:", error);
		throw error;
	}
}

/**
 * Validate a module configuration
 * @param {Object} config - The module configuration to validate
 * @throws {Error} If the configuration is invalid
 */
function validateModuleConfig(config) {
	// Required fields
	if (!config.id) throw new Error('Module config missing "id"');
	if (!config.title) throw new Error('Module config missing "title"');
	if (!Array.isArray(config.lessons)) throw new Error('Module config missing "lessons" array');

	// Check each lesson
	config.lessons.forEach((lesson, index) => {
		if (!lesson.title) throw new Error(`Lesson ${index} missing "title"`);
		if (!lesson.previewHTML) throw new Error(`Lesson ${index} missing "previewHTML"`);
	});
}

/**
 * Add a custom module to the store
 * @param {Object} moduleConfig - The module configuration to add
 * @param {string} language - Language code ('en' or 'de')
 * @returns {boolean} Success status
 */
export function addCustomModule(moduleConfig, language = "en") {
	try {
		validateModuleConfig(moduleConfig);

		const store = language === "de" ? moduleStoreDE : moduleStoreEN;

		// Check if module with same ID already exists
		const existingIndex = store.findIndex((m) => m.id === moduleConfig.id);
		if (existingIndex >= 0) {
			// Replace existing module
			store[existingIndex] = moduleConfig;
		} else {
			// Add new module
			store.push(moduleConfig);
		}

		return true;
	} catch (error) {
		console.error("Error adding custom module:", error);
		return false;
	}
}
