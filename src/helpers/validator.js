/**
 * Validator - Functions to validate user CSS code
 */

export function validateUserCode(userCode, lesson) {
	const mode = lesson.mode || "css";

	switch (mode) {
		case "html":
			return validateHtmlCode(userCode, lesson);
		case "tailwind":
			return validateTailwindClasses(userCode, lesson);
		case "css":
		default:
			return validateCssCode(userCode, lesson);
	}
}

/**
 * Validate user HTML code against the lesson requirements
 * @param {string} userHtml - User submitted HTML code
 * @param {Object} lesson - The current lesson object
 * @returns {Object} Validation result with isValid and message properties
 */
function validateHtmlCode(userHtml, lesson) {
	if (!lesson || !lesson.validations) {
		return { isValid: true, message: "No validations specified for this lesson." };
	}

	// Parse the HTML using DOMParser
	const parser = new DOMParser();
	const doc = parser.parseFromString(userHtml, "text/html");

	// Check for parse errors (DOMParser doesn't throw, but inserts error elements for XML)
	// For HTML mode, it's more lenient, so we mainly check validations

	const validations = lesson.validations;

	let result = {
		isValid: true,
		validCases: 0,
		totalCases: validations.length,
		message: "Your HTML looks great!"
	};

	for (const validation of validations) {
		const { type, value, message } = validation;
		let validationPassed = false;

		switch (type) {
			case "element_exists":
				// value is a CSS selector string
				validationPassed = doc.querySelector(value) !== null;
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `Missing element: ${value}`
					};
				}
				break;

			case "element_count":
				// value is { selector: string, count?: number, min?: number }
				const elements = doc.querySelectorAll(value.selector);
				if (value.count !== undefined) {
					validationPassed = elements.length === value.count;
				} else if (value.min !== undefined) {
					validationPassed = elements.length >= value.min;
				} else {
					validationPassed = elements.length > 0;
				}
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `Expected ${value.count || value.min + "+"} ${value.selector} element(s)`
					};
				}
				break;

			case "attribute_value":
				// value is { selector: string, attr: string, value: any }
				const el = doc.querySelector(value.selector);
				if (!el) {
					validationPassed = false;
				} else if (value.value === true) {
					// Check attribute exists (boolean attribute like "required")
					validationPassed = el.hasAttribute(value.attr);
				} else if (value.value === null) {
					// Check attribute exists with any value
					validationPassed = el.hasAttribute(value.attr);
				} else {
					// Check attribute has specific value
					validationPassed = el.getAttribute(value.attr) === value.value;
				}
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `Element ${value.selector} should have ${value.attr} attribute`
					};
				}
				break;

			case "element_text":
				// value is { selector: string, text: string }
				const textEl = doc.querySelector(value.selector);
				validationPassed = textEl && textEl.textContent.includes(value.text);
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `Element ${value.selector} should contain "${value.text}"`
					};
				}
				break;

			case "parent_child":
				// value is { parent: string, child: string }
				const parentEl = doc.querySelector(value.parent);
				validationPassed = parentEl && parentEl.querySelector(value.child) !== null;
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `${value.child} should be inside ${value.parent}`
					};
				}
				break;

			case "sibling":
				// value is { first: string, then: string }
				const firstSibling = doc.querySelector(value.first);
				if (!firstSibling) {
					validationPassed = false;
				} else {
					// Check if "then" element comes after "first" element
					let nextEl = firstSibling.nextElementSibling;
					while (nextEl) {
						if (nextEl.matches(value.then)) {
							validationPassed = true;
							break;
						}
						nextEl = nextEl.nextElementSibling;
					}
				}
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `${value.then} should follow ${value.first}`
					};
				}
				break;

			// Fall back to text-based validations for simple checks
			case "contains":
				validationPassed = containsValidation(userHtml, value);
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `Your HTML should include "${value}"`
					};
				}
				break;

			case "not_contains":
				validationPassed = !containsValidation(userHtml, value);
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `Your HTML should not include "${value}"`
					};
				}
				break;

			case "regex":
				validationPassed = regexValidation(userHtml, value);
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || "Your HTML doesn't match the expected pattern"
					};
				}
				break;

			default:
				console.warn(`Unknown HTML validation type: ${type}`);
				validationPassed = true;
		}

		if (validationPassed) {
			result.validCases++;
		} else {
			return result;
		}
	}

	result.validCases = validations.length;
	return result;
}

function validateTailwindClasses(userClasses, lesson) {
	if (!lesson || !lesson.validations) {
		return { isValid: true, message: "No validations specified for this lesson." };
	}

	let result = {
		isValid: true,
		validCases: 0,
		totalCases: lesson.validations.length,
		message: "Your CODE looks CRISPY!"
	};

	for (const validation of lesson.validations) {
		const { type, value, message } = validation;
		let validationPassed = false;

		switch (type) {
			case "contains_class":
				validationPassed = userClasses.split(/\s+/).includes(value);
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || `Your classes should include "${value}".`
					};
				}
				break;

			case "contains_pattern":
				const regex = new RegExp(value);
				validationPassed = regex.test(userClasses);
				if (!validationPassed) {
					result = {
						...result,
						isValid: false,
						message: message || "Your classes don't match the expected pattern."
					};
				}
				break;

			default:
				// Fall back to original CSS validation for other types
				validationPassed = containsValidation(userClasses, value);
		}

		if (validationPassed) {
			result.validCases++;
		} else {
			return result;
		}
	}

	result.validCases = lesson.validations.length;
	return result;
}

/**
 * Validate user CSS code against the lesson requirements
 * @param {string} userCode - User submitted CSS code
 * @param {Object} lesson - The current lesson object
 * @returns {Object} Validation result with isValid and message properties
 */
export function validateCssCode(userCode, lesson) {
	if (!lesson || !lesson.validations) {
		return { isValid: true, message: "No validations specified for this lesson." };
	}

	// Get the validations array from the lesson
	const validations = lesson.validations;

	// Default validation result
	let result = {
		isValid: true,
		validCases: 0,
		totalCases: validations.length ?? 0,
		message: "Your CODE looks CRISPY!"
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
						totalCases: result.totalCases,
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
						totalCases: result.totalCases,
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
						totalCases: result.totalCases,
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
						totalCases: result.totalCases,
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
						totalCases: result.totalCases,
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
							totalCases: result.totalCases,
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
