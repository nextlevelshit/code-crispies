import { describe, it, expect, vi } from "vitest";
import { validateUserCode } from "../../src/helpers/validator.js";

describe("CSS Validator", () => {
	// Mock document functions since we're not in a browser
	document.createElement = vi.fn().mockImplementation(() => {
		return {
			textContent: "",
			parentNode: { removeChild: vi.fn() }
		};
	});

	// document.head = {
	//     appendChild: vi.fn(),
	//     removeChild: vi.fn()
	// };

	describe("validateUserCode", () => {
		it("should pass when no validations are specified", () => {
			const userCode = "div { color: red; }";
			const lesson = { title: "Test Lesson" };

			const result = validateUserCode(userCode, lesson);

			expect(result.isValid).toBe(true);
			expect(result.message).toContain("No validations specified");
		});

		it("should pass with empty validations array", () => {
			const userCode = "div { color: red; }";
			const lesson = {
				title: "Test Lesson",
				validations: []
			};

			const result = validateUserCode(userCode, lesson);

			expect(result.isValid).toBe(true);
			expect(result.message).toBe("Your CODE looks CRISPY!");
		});

		it('should validate "contains" rule correctly', () => {
			const userCode = "div { color: red; }";
			const lesson = {
				validations: [{ type: "contains", value: "color: red", message: "Should use red color" }]
			};

			const result = validateUserCode(userCode, lesson);
			expect(result.isValid).toBe(true);

			const failLesson = {
				validations: [{ type: "contains", value: "color: blue", message: "Should use blue color" }]
			};

			const failResult = validateUserCode(userCode, failLesson);
			expect(failResult.isValid).toBe(false);
			expect(failResult.message).toBe("Should use blue color");
		});

		it('should validate "not_contains" rule correctly', () => {
			const userCode = "div { color: red; }";
			const lesson = {
				validations: [{ type: "not_contains", value: "color: blue", message: "Should not use blue color" }]
			};

			const result = validateUserCode(userCode, lesson);
			expect(result.isValid).toBe(true);

			const failLesson = {
				validations: [{ type: "not_contains", value: "color: red", message: "Should not use red color" }]
			};

			const failResult = validateUserCode(userCode, failLesson);
			expect(failResult.isValid).toBe(false);
			expect(failResult.message).toBe("Should not use red color");
		});

		it('should validate "regex" rule correctly', () => {
			const userCode = "div { color: #ff0000; }";
			const lesson = {
				validations: [{ type: "regex", value: "#[a-f0-9]{6}", message: "Should use hex color" }]
			};

			const result = validateUserCode(userCode, lesson);
			expect(result.isValid).toBe(true);

			const failLesson = {
				validations: [{ type: "regex", value: "rgb\\(\\d+,\\s*\\d+,\\s*\\d+\\)", message: "Should use RGB color" }]
			};

			const failResult = validateUserCode(userCode, failLesson);
			expect(failResult.isValid).toBe(false);
			expect(failResult.message).toBe("Should use RGB color");
		});

		it('should validate "property_value" rule correctly', () => {
			const userCode = "div { display: flex; }";
			const lesson = {
				validations: [
					{
						type: "property_value",
						value: { property: "display", expected: "flex" },
						message: "Should use display: flex"
					}
				]
			};

			const result = validateUserCode(userCode, lesson);
			expect(result.isValid).toBe(true);

			const failLesson = {
				validations: [
					{
						type: "property_value",
						value: { property: "display", expected: "grid" },
						message: "Should use display: grid"
					}
				]
			};

			const failResult = validateUserCode(userCode, failLesson);
			expect(failResult.isValid).toBe(false);
			expect(failResult.message).toBe("Should use display: grid");
		});

		it("should handle complex validation chains", () => {
			const userCode = "div { display: flex; color: red; }";
			const lesson = {
				validations: [
					{ type: "contains", value: "display: flex" },
					{ type: "contains", value: "color: red" },
					{ type: "not_contains", value: "float:" }
				]
			};

			const result = validateUserCode(userCode, lesson);
			expect(result.isValid).toBe(true);

			// First failing validation should cause early return
			const failLesson = {
				validations: [
					{ type: "contains", value: "display: flex" },
					{ type: "contains", value: "border: 1px solid black", message: "Missing border" },
					{ type: "not_contains", value: "color: green" }
				]
			};

			const failResult = validateUserCode(userCode, failLesson);
			expect(failResult.isValid).toBe(false);
			expect(failResult.message).toBe("Missing border");
		});

		it('should validate "custom" rule correctly', () => {
			const userCode = "div { margin: 10px; }";
			const customValidator = (code) => {
				return {
					isValid: code.includes("margin"),
					message: "Should include margin property"
				};
			};

			const lesson = {
				validations: [
					{
						type: "custom",
						validator: customValidator
					}
				]
			};

			const result = validateUserCode(userCode, lesson);
			expect(result.isValid).toBe(true);

			const failValidator = (code) => {
				return {
					isValid: code.includes("padding"),
					message: "Should include padding property"
				};
			};

			const failLesson = {
				validations: [
					{
						type: "custom",
						validator: failValidator,
						message: "Custom validation failed"
					}
				]
			};

			const failResult = validateUserCode(userCode, failLesson);
			expect(failResult.isValid).toBe(false);
			expect(failResult.message).toBe("Should include padding property");
		});

		it("should handle options in validations", () => {
			// Case insensitive test
			const userCode = "div { COLOR: Red; }";
			const lesson = {
				validations: [
					{
						type: "contains",
						value: "color: red",
						options: { caseSensitive: false }
					}
				]
			};

			const result = validateUserCode(userCode, lesson);
			expect(result.isValid).toBe(true);

			// With exact match required
			const exactLesson = {
				validations: [
					{
						type: "property_value",
						value: { property: "color", expected: "red" },
						options: { exact: true }
					}
				]
			};

			const failExactResult = validateUserCode("div { color: RED; }", exactLesson);
			expect(failExactResult.isValid).toBe(false);
		});
	});
});

describe("HTML Validator", () => {
	describe("validateUserCode with mode: html", () => {
		it("should validate element_exists correctly", () => {
			const userHtml = "<p>Hello world</p>";
			const lesson = {
				mode: "html",
				validations: [{ type: "element_exists", value: "p", message: "Add a paragraph" }]
			};

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);

			const failResult = validateUserCode(userHtml, {
				mode: "html",
				validations: [{ type: "element_exists", value: "div", message: "Add a div" }]
			});
			expect(failResult.isValid).toBe(false);
			expect(failResult.message).toBe("Add a div");
		});

		it("should validate element_count correctly", () => {
			const userHtml = "<ul><li>One</li><li>Two</li><li>Three</li></ul>";
			const lesson = {
				mode: "html",
				validations: [{ type: "element_count", value: { selector: "li", count: 3 }, message: "Need 3 items" }]
			};

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);

			const failLesson = {
				mode: "html",
				validations: [{ type: "element_count", value: { selector: "li", count: 5 }, message: "Need 5 items" }]
			};
			const failResult = validateUserCode(userHtml, failLesson);
			expect(failResult.isValid).toBe(false);
		});

		it("should validate element_count with min correctly", () => {
			const userHtml = "<div><span>A</span><span>B</span></div>";
			const lesson = {
				mode: "html",
				validations: [{ type: "element_count", value: { selector: "span", min: 2 }, message: "Need at least 2 spans" }]
			};

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);
		});

		it("should validate attribute_value correctly", () => {
			const userHtml = '<input type="email" required>';
			const lesson = {
				mode: "html",
				validations: [{ type: "attribute_value", value: { selector: "input", attr: "type", value: "email" } }]
			};

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);

			// Test boolean attribute (required)
			const boolLesson = {
				mode: "html",
				validations: [{ type: "attribute_value", value: { selector: "input", attr: "required", value: true } }]
			};
			const boolResult = validateUserCode(userHtml, boolLesson);
			expect(boolResult.isValid).toBe(true);
		});

		it("should validate parent_child correctly", () => {
			const userHtml = "<form><label>Name</label><input></form>";
			const lesson = {
				mode: "html",
				validations: [{ type: "parent_child", value: { parent: "form", child: "input" }, message: "Input should be inside form" }]
			};

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);

			const failHtml = "<label>Name</label><input>";
			const failResult = validateUserCode(failHtml, lesson);
			expect(failResult.isValid).toBe(false);
		});

		it("should validate element_text correctly", () => {
			const userHtml = "<button>Submit</button>";
			const lesson = {
				mode: "html",
				validations: [{ type: "element_text", value: { selector: "button", text: "Submit" } }]
			};

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);

			const failLesson = {
				mode: "html",
				validations: [{ type: "element_text", value: { selector: "button", text: "Cancel" }, message: "Button should say Cancel" }]
			};
			const failResult = validateUserCode(userHtml, failLesson);
			expect(failResult.isValid).toBe(false);
		});

		it("should validate contains for HTML mode", () => {
			const userHtml = '<div class="container">Content</div>';
			const lesson = {
				mode: "html",
				validations: [{ type: "contains", value: "container" }]
			};

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);
		});

		it("should pass with no validations in HTML mode", () => {
			const userHtml = "<p>Hello</p>";
			const lesson = { mode: "html" };

			const result = validateUserCode(userHtml, lesson);
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("No validations specified");
		});
	});
});
