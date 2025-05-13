/**
 * Lesson Config - Functions for loading lesson configurations
 */

// Import lesson configs
import flexboxConfig from "../../lessons/flexbox.json";
import gridConfig from "../../lessons/grid.json";
import basicsConfig from "../../lessons/basics.json";
import tailwindConfig from "../../lessons/tailwindcss.json";

// Module store
const moduleStore = [basicsConfig, flexboxConfig, gridConfig, tailwindConfig];

/**
 * Load all available modules
 * @returns {Promise<Array>} Promise resolving to array of modules
 */
export async function loadModules() {
	// In a real app, we might load these from a server
	return moduleStore;
}

/**
 * Get a module by its ID
 * @param {string} moduleId - The module ID to find
 * @returns {Object|null} The module object or null if not found
 */
export function getModuleById(moduleId) {
	return moduleStore.find((module) => module.id === moduleId) || null;
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
 * @returns {boolean} Success status
 */
export function addCustomModule(moduleConfig) {
	try {
		validateModuleConfig(moduleConfig);

		// Check if module with same ID already exists
		const existingIndex = moduleStore.findIndex((m) => m.id === moduleConfig.id);
		if (existingIndex >= 0) {
			// Replace existing module
			moduleStore[existingIndex] = moduleConfig;
		} else {
			// Add new module
			moduleStore.push(moduleConfig);
		}

		return true;
	} catch (error) {
		console.error("Error adding custom module:", error);
		return false;
	}
}
