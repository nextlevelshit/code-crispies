/**
 * Lesson Config - Functions for loading lesson configurations
 * Supports English and German lesson content
 */

// English lesson imports
import welcomeEN from "../../lessons/00-welcome.json";
import basicSelectorsEN from "../../lessons/00-basic-selectors.json";
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
import htmlDatalistEN from "../../lessons/25-html-datalist.json";
import htmlDialogEN from "../../lessons/27-html-dialog.json";
import htmlFieldsetEN from "../../lessons/28-html-forms-fieldset.json";
import htmlFigureEN from "../../lessons/29-html-figure.json";
import htmlTablesEN from "../../lessons/30-html-tables.json";
import htmlSvgEN from "../../lessons/32-html-svg.json";
import htmlSemanticEN from "../../lessons/33-html-semantic.json";
import flexboxEN from "../../lessons/flexbox.json";
import gridEN from "../../lessons/grid.json";
import gradientsEN from "../../lessons/09-gradients.json";
import filtersEN from "../../lessons/11-filters.json";
import positioningEN from "../../lessons/12-positioning.json";
import pseudoElementsEN from "../../lessons/13-pseudo-elements.json";
import playgroundEN from "../../lessons/98-playground.json";
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
import htmlDatalistDE from "../../lessons/de/25-html-datalist.json";
import htmlDialogDE from "../../lessons/de/27-html-dialog.json";
import htmlFieldsetDE from "../../lessons/de/28-html-forms-fieldset.json";
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
import htmlDatalistPL from "../../lessons/pl/25-html-datalist.json";
import htmlDialogPL from "../../lessons/pl/27-html-dialog.json";
import htmlFieldsetPL from "../../lessons/pl/28-html-forms-fieldset.json";
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
import htmlDatalistES from "../../lessons/es/25-html-datalist.json";
import htmlDialogES from "../../lessons/es/27-html-dialog.json";
import htmlFieldsetES from "../../lessons/es/28-html-forms-fieldset.json";
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
import htmlDatalistAR from "../../lessons/ar/25-html-datalist.json";
import htmlDialogAR from "../../lessons/ar/27-html-dialog.json";
import htmlFieldsetAR from "../../lessons/ar/28-html-forms-fieldset.json";
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
import htmlDatalistUK from "../../lessons/uk/25-html-datalist.json";
import htmlDialogUK from "../../lessons/uk/27-html-dialog.json";
import htmlFieldsetUK from "../../lessons/uk/28-html-forms-fieldset.json";
import htmlTablesUK from "../../lessons/uk/30-html-tables.json";
import htmlSvgUK from "../../lessons/uk/32-html-svg.json";
import flexboxUK from "../../lessons/uk/flexbox.json";

// English module store - ordered for design students
const moduleStoreEN = [
	// Welcome
	welcomeEN,
	// CSS Visual (immediate impact)
	basicSelectorsEN,
	colorsEN,
	gradientsEN,
	typographyEN,
	boxModelEN,
	// CSS Layout
	flexboxEN,
	gridEN,
	positioningEN,
	unitsVariablesEN,
	responsiveEN,
	// CSS Polish
	transitionsAnimationsEN,
	filtersEN,
	pseudoElementsEN,
	// HTML Structure
	htmlElementsEN,
	htmlSemanticEN,
	htmlFigureEN,
	htmlSvgEN,
	// HTML Interactive
	htmlDetailsSummaryEN,
	htmlDialogEN,
	htmlProgressMeterEN,
	htmlFormsBasicEN,
	htmlFormsValidationEN,
	htmlFieldsetEN,
	htmlDatalistEN,
	htmlTablesEN,
	// Outro
	goodbyeEN,
	playgroundEN
];

// German module store - ordered for design students
const moduleStoreDE = [
	// Welcome
	welcomeDE,
	// CSS Visual (immediate impact)
	basicSelectorsDE,
	colorsEN, // Using EN fallback until translated
	gradientsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelDE,
	// CSS Layout
	flexboxDE,
	gridEN, // Using EN fallback until translated
	positioningEN, // Using EN fallback until translated
	unitsVariablesDE,
	responsiveDE,
	// CSS Polish
	transitionsAnimationsDE,
	filtersEN, // Using EN fallback until translated
	pseudoElementsEN, // Using EN fallback until translated
	// HTML Structure
	htmlElementsDE,
	htmlSemanticEN, // Using EN fallback until translated
	htmlFigureEN, // Using EN fallback until translated
	htmlSvgDE,
	// HTML Interactive
	htmlDetailsSummaryDE,
	htmlDialogDE,
	htmlProgressMeterDE,
	htmlFormsBasicDE,
	htmlFormsValidationDE,
	htmlFieldsetDE,
	htmlDatalistDE,
	htmlTablesDE,
	// Outro
	goodbyeEN,
	playgroundEN
];

// Polish module store - ordered for design students
const moduleStorePL = [
	// Welcome
	welcomePL,
	// CSS Visual (immediate impact)
	basicSelectorsPL,
	colorsEN, // Using EN fallback until translated
	gradientsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelPL,
	// CSS Layout
	flexboxPL,
	gridEN, // Using EN fallback until translated
	positioningEN, // Using EN fallback until translated
	unitsVariablesPL,
	responsivePL,
	// CSS Polish
	transitionsAnimationsPL,
	filtersEN, // Using EN fallback until translated
	pseudoElementsEN, // Using EN fallback until translated
	// HTML Structure
	htmlElementsPL,
	htmlSemanticEN, // Using EN fallback until translated
	htmlFigureEN, // Using EN fallback until translated
	htmlSvgPL,
	// HTML Interactive
	htmlDetailsSummaryPL,
	htmlDialogPL,
	htmlProgressMeterPL,
	htmlFormsBasicPL,
	htmlFormsValidationPL,
	htmlFieldsetPL,
	htmlDatalistPL,
	htmlTablesPL,
	// Outro
	goodbyeEN,
	playgroundEN
];

// Spanish module store - ordered for design students
const moduleStoreES = [
	// Welcome
	welcomeES,
	// CSS Visual (immediate impact)
	basicSelectorsES,
	colorsEN, // Using EN fallback until translated
	gradientsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelES,
	// CSS Layout
	flexboxES,
	gridEN, // Using EN fallback until translated
	positioningEN, // Using EN fallback until translated
	unitsVariablesES,
	responsiveES,
	// CSS Polish
	transitionsAnimationsES,
	filtersEN, // Using EN fallback until translated
	pseudoElementsEN, // Using EN fallback until translated
	// HTML Structure
	htmlElementsES,
	htmlSemanticEN, // Using EN fallback until translated
	htmlFigureEN, // Using EN fallback until translated
	htmlSvgES,
	// HTML Interactive
	htmlDetailsSummaryES,
	htmlDialogES,
	htmlProgressMeterES,
	htmlFormsBasicES,
	htmlFormsValidationES,
	htmlFieldsetES,
	htmlDatalistES,
	htmlTablesES,
	// Outro
	goodbyeEN,
	playgroundEN
];

// Arabic module store - ordered for design students
const moduleStoreAR = [
	// Welcome
	welcomeAR,
	// CSS Visual (immediate impact)
	basicSelectorsAR,
	colorsEN, // Using EN fallback until translated
	gradientsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelAR,
	// CSS Layout
	flexboxAR,
	gridEN, // Using EN fallback until translated
	positioningEN, // Using EN fallback until translated
	unitsVariablesAR,
	responsiveAR,
	// CSS Polish
	transitionsAnimationsAR,
	filtersEN, // Using EN fallback until translated
	pseudoElementsEN, // Using EN fallback until translated
	// HTML Structure
	htmlElementsAR,
	htmlSemanticEN, // Using EN fallback until translated
	htmlFigureEN, // Using EN fallback until translated
	htmlSvgAR,
	// HTML Interactive
	htmlDetailsSummaryAR,
	htmlDialogAR,
	htmlProgressMeterAR,
	htmlFormsBasicAR,
	htmlFormsValidationAR,
	htmlFieldsetAR,
	htmlDatalistAR,
	htmlTablesAR,
	// Outro
	goodbyeEN,
	playgroundEN
];

// Ukrainian module store - ordered for design students
const moduleStoreUK = [
	// Welcome
	welcomeUK,
	// CSS Visual (immediate impact)
	basicSelectorsUK,
	colorsEN, // Using EN fallback until translated
	gradientsEN, // Using EN fallback until translated
	typographyEN, // Using EN fallback until translated
	boxModelUK,
	// CSS Layout
	flexboxUK,
	gridEN, // Using EN fallback until translated
	positioningEN, // Using EN fallback until translated
	unitsVariablesUK,
	responsiveUK,
	// CSS Polish
	transitionsAnimationsUK,
	filtersEN, // Using EN fallback until translated
	pseudoElementsEN, // Using EN fallback until translated
	// HTML Structure
	htmlElementsUK,
	htmlSemanticEN, // Using EN fallback until translated
	htmlFigureEN, // Using EN fallback until translated
	htmlSvgUK,
	// HTML Interactive
	htmlDetailsSummaryUK,
	htmlDialogUK,
	htmlProgressMeterUK,
	htmlFormsBasicUK,
	htmlFormsValidationUK,
	htmlFieldsetUK,
	htmlDatalistUK,
	htmlTablesUK,
	// Outro
	goodbyeEN,
	playgroundEN
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
