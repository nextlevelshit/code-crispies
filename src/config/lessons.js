/**
 * Lesson Config - Functions for loading lesson configurations
 * Supports English and German lesson content
 */

// English lesson imports
import welcomeEN from "../../lessons/00-welcome.json";
import basicSelectorsEN from "../../lessons/00-basic-selectors.json";
import advancedSelectorsEN from "../../lessons/01-advanced-selectors.json";
import boxModelEN from "../../lessons/01-box-model.json";
import colorsEN from "../../lessons/03-colors.json";
import typographyEN from "../../lessons/04-typography.json";
import unitsVariablesEN from "../../lessons/05-units-variables.json";
import transitionsAnimationsEN from "../../lessons/06-transitions-animations.json";
import responsiveEN from "../../lessons/08-responsive.json";
import htmlElementsEN from "../../lessons/20-html-elements.json";
import htmlFormsBasicEN from "../../lessons/21-html-forms-basic.json";
import htmlFormsValidationEN from "../../lessons/22-html-forms-validation.json";
import htmlDetailsSummaryEN from "../../lessons/23-html-details-summary.json";
import htmlProgressMeterEN from "../../lessons/24-html-progress-meter.json";
import htmlTablesEN from "../../lessons/30-html-tables.json";
import htmlSvgEN from "../../lessons/32-html-svg.json";
import flexboxEN from "../../lessons/flexbox.json";
import gridEN from "../../lessons/grid.json";
import goodbyeEN from "../../lessons/99-goodbye.json";

// German lesson imports
import welcomeDE from "../../lessons/de/00-welcome.json";
import basicSelectorsDE from "../../lessons/de/00-basic-selectors.json";
import boxModelDE from "../../lessons/de/01-box-model.json";
import unitsVariablesDE from "../../lessons/de/05-units-variables.json";
import transitionsAnimationsDE from "../../lessons/de/06-transitions-animations.json";
import responsiveDE from "../../lessons/de/08-responsive.json";
import htmlElementsDE from "../../lessons/de/20-html-elements.json";
import htmlFormsBasicDE from "../../lessons/de/21-html-forms-basic.json";
import htmlFormsValidationDE from "../../lessons/de/22-html-forms-validation.json";
import htmlDetailsSummaryDE from "../../lessons/de/23-html-details-summary.json";
import htmlProgressMeterDE from "../../lessons/de/24-html-progress-meter.json";
import htmlTablesDE from "../../lessons/de/30-html-tables.json";
import htmlSvgDE from "../../lessons/de/32-html-svg.json";
import flexboxDE from "../../lessons/de/flexbox.json";

// Polish lesson imports
import welcomePL from "../../lessons/pl/00-welcome.json";
import basicSelectorsPL from "../../lessons/pl/00-basic-selectors.json";
import boxModelPL from "../../lessons/pl/01-box-model.json";
import unitsVariablesPL from "../../lessons/pl/05-units-variables.json";
import transitionsAnimationsPL from "../../lessons/pl/06-transitions-animations.json";
import responsivePL from "../../lessons/pl/08-responsive.json";
import htmlElementsPL from "../../lessons/pl/20-html-elements.json";
import htmlFormsBasicPL from "../../lessons/pl/21-html-forms-basic.json";
import htmlFormsValidationPL from "../../lessons/pl/22-html-forms-validation.json";
import htmlDetailsSummaryPL from "../../lessons/pl/23-html-details-summary.json";
import htmlProgressMeterPL from "../../lessons/pl/24-html-progress-meter.json";
import htmlTablesPL from "../../lessons/pl/30-html-tables.json";
import htmlSvgPL from "../../lessons/pl/32-html-svg.json";
import flexboxPL from "../../lessons/pl/flexbox.json";

// Spanish lesson imports
import welcomeES from "../../lessons/es/00-welcome.json";
import basicSelectorsES from "../../lessons/es/00-basic-selectors.json";
import boxModelES from "../../lessons/es/01-box-model.json";
import unitsVariablesES from "../../lessons/es/05-units-variables.json";
import transitionsAnimationsES from "../../lessons/es/06-transitions-animations.json";
import responsiveES from "../../lessons/es/08-responsive.json";
import htmlElementsES from "../../lessons/es/20-html-elements.json";
import htmlFormsBasicES from "../../lessons/es/21-html-forms-basic.json";
import htmlFormsValidationES from "../../lessons/es/22-html-forms-validation.json";
import htmlDetailsSummaryES from "../../lessons/es/23-html-details-summary.json";
import htmlProgressMeterES from "../../lessons/es/24-html-progress-meter.json";
import htmlTablesES from "../../lessons/es/30-html-tables.json";
import htmlSvgES from "../../lessons/es/32-html-svg.json";
import flexboxES from "../../lessons/es/flexbox.json";

// Arabic lesson imports
import welcomeAR from "../../lessons/ar/00-welcome.json";
import basicSelectorsAR from "../../lessons/ar/00-basic-selectors.json";
import boxModelAR from "../../lessons/ar/01-box-model.json";
import unitsVariablesAR from "../../lessons/ar/05-units-variables.json";
import transitionsAnimationsAR from "../../lessons/ar/06-transitions-animations.json";
import responsiveAR from "../../lessons/ar/08-responsive.json";
import htmlElementsAR from "../../lessons/ar/20-html-elements.json";
import htmlFormsBasicAR from "../../lessons/ar/21-html-forms-basic.json";
import htmlFormsValidationAR from "../../lessons/ar/22-html-forms-validation.json";
import htmlDetailsSummaryAR from "../../lessons/ar/23-html-details-summary.json";
import htmlProgressMeterAR from "../../lessons/ar/24-html-progress-meter.json";
import htmlTablesAR from "../../lessons/ar/30-html-tables.json";
import htmlSvgAR from "../../lessons/ar/32-html-svg.json";
import flexboxAR from "../../lessons/ar/flexbox.json";

// Ukrainian lesson imports
import welcomeUK from "../../lessons/uk/00-welcome.json";
import basicSelectorsUK from "../../lessons/uk/00-basic-selectors.json";
import boxModelUK from "../../lessons/uk/01-box-model.json";
import unitsVariablesUK from "../../lessons/uk/05-units-variables.json";
import transitionsAnimationsUK from "../../lessons/uk/06-transitions-animations.json";
import responsiveUK from "../../lessons/uk/08-responsive.json";
import htmlElementsUK from "../../lessons/uk/20-html-elements.json";
import htmlFormsBasicUK from "../../lessons/uk/21-html-forms-basic.json";
import htmlFormsValidationUK from "../../lessons/uk/22-html-forms-validation.json";
import htmlDetailsSummaryUK from "../../lessons/uk/23-html-details-summary.json";
import htmlProgressMeterUK from "../../lessons/uk/24-html-progress-meter.json";
import htmlTablesUK from "../../lessons/uk/30-html-tables.json";
import htmlSvgUK from "../../lessons/uk/32-html-svg.json";
import flexboxUK from "../../lessons/uk/flexbox.json";

// English module store - ordered by learning path
const moduleStoreEN = [
	// Welcome
	welcomeEN,
	// HTML Fundamentals
	htmlElementsEN,
	htmlFormsBasicEN,
	htmlFormsValidationEN,
	// HTML Interactive
	htmlDetailsSummaryEN,
	htmlProgressMeterEN,
	// HTML Data
	htmlTablesEN,
	// CSS Fundamentals
	basicSelectorsEN,
	advancedSelectorsEN,
	colorsEN,
	typographyEN,
	boxModelEN,
	unitsVariablesEN,
	// CSS Graphics
	htmlSvgEN,
	// CSS Layouts
	flexboxEN,
	gridEN,
	responsiveEN,
	// CSS Animation
	transitionsAnimationsEN,
	// Goodbye
	goodbyeEN
];

// German module store - ordered by learning path
const moduleStoreDE = [
	// Welcome
	welcomeDE,
	// HTML Fundamentals
	htmlElementsDE,
	htmlFormsBasicDE,
	htmlFormsValidationDE,
	// HTML Interactive
	htmlDetailsSummaryDE,
	htmlProgressMeterDE,
	// HTML Data
	htmlTablesDE,
	// CSS Fundamentals
	basicSelectorsDE,
	advancedSelectorsEN, // Using EN fallback until translated
	colorsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelDE,
	unitsVariablesDE,
	// CSS Graphics
	htmlSvgDE,
	// CSS Layouts
	flexboxDE,
	gridEN, // Using EN fallback until translated
	responsiveDE,
	// CSS Animation
	transitionsAnimationsDE,
	// Goodbye
	goodbyeEN
];

// Polish module store - ordered by learning path
const moduleStorePL = [
	// Welcome
	welcomePL,
	// HTML Fundamentals
	htmlElementsPL,
	htmlFormsBasicPL,
	htmlFormsValidationPL,
	// HTML Interactive
	htmlDetailsSummaryPL,
	htmlProgressMeterPL,
	// HTML Data
	htmlTablesPL,
	// CSS Fundamentals
	basicSelectorsPL,
	advancedSelectorsEN, // Using EN fallback until translated
	colorsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelPL,
	unitsVariablesPL,
	// CSS Graphics
	htmlSvgPL,
	// CSS Layouts
	flexboxPL,
	gridEN, // Using EN fallback until translated
	responsivePL,
	// CSS Animation
	transitionsAnimationsPL,
	// Goodbye
	goodbyeEN
];

// Spanish module store - ordered by learning path
const moduleStoreES = [
	// Welcome
	welcomeES,
	// HTML Fundamentals
	htmlElementsES,
	htmlFormsBasicES,
	htmlFormsValidationES,
	// HTML Interactive
	htmlDetailsSummaryES,
	htmlProgressMeterES,
	// HTML Data
	htmlTablesES,
	// CSS Fundamentals
	basicSelectorsES,
	advancedSelectorsEN, // Using EN fallback until translated
	colorsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelES,
	unitsVariablesES,
	// CSS Graphics
	htmlSvgES,
	// CSS Layouts
	flexboxES,
	gridEN, // Using EN fallback until translated
	responsiveES,
	// CSS Animation
	transitionsAnimationsES,
	// Goodbye
	goodbyeEN
];

// Arabic module store - ordered by learning path
const moduleStoreAR = [
	// Welcome
	welcomeAR,
	// HTML Fundamentals
	htmlElementsAR,
	htmlFormsBasicAR,
	htmlFormsValidationAR,
	// HTML Interactive
	htmlDetailsSummaryAR,
	htmlProgressMeterAR,
	// HTML Data
	htmlTablesAR,
	// CSS Fundamentals
	basicSelectorsAR,
	advancedSelectorsEN, // Using EN fallback until translated
	colorsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelAR,
	unitsVariablesAR,
	// CSS Graphics
	htmlSvgAR,
	// CSS Layouts
	flexboxAR,
	gridEN, // Using EN fallback until translated
	responsiveAR,
	// CSS Animation
	transitionsAnimationsAR,
	// Goodbye
	goodbyeEN
];

// Ukrainian module store - ordered by learning path
const moduleStoreUK = [
	// Welcome
	welcomeUK,
	// HTML Fundamentals
	htmlElementsUK,
	htmlFormsBasicUK,
	htmlFormsValidationUK,
	// HTML Interactive
	htmlDetailsSummaryUK,
	htmlProgressMeterUK,
	// HTML Data
	htmlTablesUK,
	// CSS Fundamentals
	basicSelectorsUK,
	advancedSelectorsEN, // Using EN fallback until translated
	colorsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelUK,
	unitsVariablesUK,
	// CSS Graphics
	htmlSvgUK,
	// CSS Layouts
	flexboxUK,
	gridEN, // Using EN fallback until translated
	responsiveUK,
	// CSS Animation
	transitionsAnimationsUK,
	// Goodbye
	goodbyeEN
];

// Map of language codes to module stores
const moduleStores = {
	en: moduleStoreEN,
	de: moduleStoreDE,
	pl: moduleStorePL,
	es: moduleStoreES,
	ar: moduleStoreAR,
	uk: moduleStoreUK
};

/**
 * Load all available modules for a given language
 * @param {string} language - Language code ('en', 'de', 'pl', 'es', 'ar', 'uk')
 * @returns {Array} Array of modules
 */
export function loadModules(language = "en") {
	const store = moduleStores[language] || moduleStoreEN;
	return store.map((module) => ({
		...module,
		lessons: module.lessons.map((lesson) => ({
			...lesson,
			mode: lesson.mode || module.mode || "css"
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
