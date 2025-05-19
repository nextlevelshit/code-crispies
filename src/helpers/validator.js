/**
 * Validator - Functions to validate user CSS code
 */

/**
 * Validate user CSS code against the lesson requirements
 * @param {string} userCode - User submitted CSS code
 * @param {Object} lesson - The current lesson object
 * @returns {Object} Validation result with isValid and message properties
 */
export function validateUserCode(userCode, lesson) {
	if (!lesson || !lesson.validations) {
		return { isValid: true, message: "No validations specified for this lesson." };
	}

	// Get the validations array from the lesson
	const validations = lesson.validations;

	// Default validation result
	let result = {
		isValid: true,
		validCases: 0,
		message: "Your code looks good!"
	};

	// Process each validation rule
	for (const validation of validations) {
		const { type, value, message, options } = validation;
		let validationPassed = false;

		switch (type) {
			case "contains":
				validationPassed = containsValidation(userCode, value, options);
				if (!validationPassed) {
					result = {
						isValid: false,
						validCases: result.validCases,
						message: message || `Your code should include "${value}".`
					};
				}
				break;

			case "not_contains":
				validationPassed = !containsValidation(userCode, value, options);
				if (!validationPassed) {
					result = {
						isValid: false,
						validCases: result.validCases,
						message: message || `Your code should not include "${value}".`
					};
				}
				break;

			case "regex":
				validationPassed = regexValidation(userCode, value, options);
				if (!validationPassed) {
					result = {
						isValid: false,
						validCases: result.validCases,
						message: message || "Your code does not match the expected pattern."
					};
				}
				break;

			case "property_value":
				validationPassed = propertyValueValidation(userCode, value, options);
				if (!validationPassed) {
					result = {
						isValid: false,
						validCases: result.validCases,
						message: message || `The "${value.property}" property should be set to "${value.expected}".`
					};
				}
				break;

			case "syntax":
				const syntaxResult = syntaxValidation(userCode);
				validationPassed = syntaxResult.isValid;
				if (!validationPassed) {
					result = {
						isValid: false,
						validCases: result.validCases,
						message: message || `CSS syntax error: ${syntaxResult.error}`
					};
				}
				break;

			case "custom":
				if (validation.validator && typeof validation.validator === "function") {
					const customResult = validation.validator(userCode);
					validationPassed = customResult.isValid;
					if (!validationPassed) {
						result = {
							isValid: false,
							validCases: result.validCases,
							message: customResult.message || message || "Your code does not meet the requirements."
						};
					}
				}
				break;

			// Add more validation types as needed

			default:
				console.warn(`Unknown validation type: ${type}`);
				continue; // Skip counting this validation
		}

		// Count valid cases
		if (validationPassed) {
			result.validCases++;
		}

		// Return early if validation failed
		if (!validationPassed) {
			return result;
		}
	}

	// If we've passed all validations, return success with all cases passed
	result.validCases = validations.length;
	return result;
}

/**
 * Check if code contains a specific string or pattern
 * @param {string} code - User CSS code
 * @param {string} value - String to check for
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the validation passes
 */
function containsValidation(code, value, options = {}) {
	const { caseSensitive = true, wholeWord = false } = options;

	if (!caseSensitive) {
		code = code.toLowerCase();
		value = value.toLowerCase();
	}

	if (wholeWord) {
		const regex = new RegExp(`\\b${escapeRegExp(value)}\\b`, caseSensitive ? "" : "i");
		return regex.test(code);
	}

	return code.includes(value);
}

/**
 * Check if code matches a regex pattern
 * @param {string} code - User CSS code
 * @param {string} pattern - Regex pattern to check
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the validation passes
 */
function regexValidation(code, pattern, options = {}) {
	const { caseSensitive = true, multiline = true } = options;

	let flags = "";
	if (!caseSensitive) flags += "i";
	if (multiline) flags += "m";

	try {
		const regex = new RegExp(pattern, flags);
		return regex.test(code);
	} catch (e) {
		console.error("Invalid regex in validation:", e);
		return false;
	}
}

/**
 * Check if a CSS property has the expected value
 * @param {string} code - User CSS code
 * @param {Object} value - Object with property and expected value
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the validation passes
 */
function propertyValueValidation(code, value, options = {}) {
	const { property, expected } = value;
	const { exact = false } = options;

	// Create a regex to extract the property value
	// This is a simplified version and might not handle all CSS syntax nuances
	const propertyRegex = new RegExp(`${escapeRegExp(property)}\\s*:\\s*([^;\\}]+)`, "i");
	const match = code.match(propertyRegex);

	if (!match) {
		// Property not found
		return false;
	}

	const actualValue = match[1].trim();

	if (exact) {
		return actualValue === expected;
	} else {
		// Allow for flexible matching
		return actualValue.toLowerCase().includes(expected.toLowerCase());
	}
}

/**
 * Validate CSS syntax
 * @param {string} code - User CSS code
 * @returns {Object} Validation result
 */
function syntaxValidation(code) {
	try {
		// Create a hidden style element to test the CSS
		const style = document.createElement("style");
		style.textContent = code;
		document.head.appendChild(style);
		document.head.removeChild(style);
		return { isValid: true };
	} catch (e) {
		return { isValid: false, error: e.message };
	}
}

/**
 * Escape string for safe use in regex
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
