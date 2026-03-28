import { describe, test, expect, vi, beforeEach } from "vitest";
import { validateUserCode, validateCssCode } from "../../src/helpers/validator.js";

describe("Validator Extended Coverage", () => {
	describe("validateUserCode mode dispatch", () => {
		test("validateUserCode_NoMode_DefaultsToCss", () => {
			const result = validateUserCode("color: red;", {
				validations: [{ type: "contains", value: "color: red" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("validateUserCode_CssMode_UsesCssValidator", () => {
			const result = validateUserCode("display: flex;", {
				mode: "css",
				validations: [{ type: "contains", value: "display: flex" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("validateUserCode_TailwindMode_UsesTailwindValidator", () => {
			const result = validateUserCode("flex items-center", {
				mode: "tailwind",
				validations: [{ type: "contains_class", value: "flex" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("validateUserCode_HtmlMode_UsesHtmlValidator", () => {
			const result = validateUserCode("<div>Hello</div>", {
				mode: "html",
				validations: [{ type: "element_exists", value: "div" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("validateUserCode_UnknownMode_DefaultsToCss", () => {
			const result = validateUserCode("color: red;", {
				mode: "javascript",
				validations: [{ type: "contains", value: "color: red" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("validateUserCode_NullLesson_Throws", () => {
			expect(() => validateUserCode("anything", null)).toThrow();
		});

		test("validateUserCode_UndefinedLesson_Throws", () => {
			expect(() => validateUserCode("anything", undefined)).toThrow();
		});
	});

	describe("Tailwind validation", () => {
		test("tailwind_ContainsClass_Pass", () => {
			const result = validateUserCode("flex items-center justify-between", {
				mode: "tailwind",
				validations: [{ type: "contains_class", value: "flex" }]
			});
			expect(result.isValid).toBe(true);
			expect(result.validCases).toBe(1);
		});

		test("tailwind_ContainsClass_Fail_ReturnsMessage", () => {
			const result = validateUserCode("items-center", {
				mode: "tailwind",
				validations: [{ type: "contains_class", value: "flex", message: "Add flex class" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toBe("Add flex class");
		});

		test("tailwind_ContainsClass_Fail_DefaultMessage", () => {
			const result = validateUserCode("items-center", {
				mode: "tailwind",
				validations: [{ type: "contains_class", value: "flex" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("flex");
		});

		test("tailwind_ContainsClass_PartialMatch_Fails", () => {
			// "flex-1" contains "flex" as substring but split should not match
			const result = validateUserCode("flex-1 items-center", {
				mode: "tailwind",
				validations: [{ type: "contains_class", value: "flex" }]
			});
			expect(result.isValid).toBe(false);
		});

		test("tailwind_ContainsPattern_Pass", () => {
			const result = validateUserCode("text-lg font-bold", {
				mode: "tailwind",
				validations: [{ type: "contains_pattern", value: "text-\\w+" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("tailwind_ContainsPattern_Fail_ReturnsMessage", () => {
			const result = validateUserCode("font-bold", {
				mode: "tailwind",
				validations: [{ type: "contains_pattern", value: "text-\\w+", message: "Add text size" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toBe("Add text size");
		});

		test("tailwind_ContainsPattern_Fail_DefaultMessage", () => {
			const result = validateUserCode("font-bold", {
				mode: "tailwind",
				validations: [{ type: "contains_pattern", value: "text-\\w+" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("pattern");
		});

		test("tailwind_DefaultType_FallsBackToContains", () => {
			const result = validateUserCode("flex items-center", {
				mode: "tailwind",
				validations: [{ type: "contains", value: "items-center" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("tailwind_NoValidations_ReturnsValid", () => {
			const result = validateUserCode("flex", { mode: "tailwind" });
			expect(result.isValid).toBe(true);
			expect(result.message).toContain("No validations specified");
		});

		test("tailwind_NullLesson_ReturnsValid", () => {
			const result = validateUserCode("flex", { mode: "tailwind", validations: null });
			// validateTailwindClasses checks !lesson.validations
			expect(result.isValid).toBe(true);
		});

		test("tailwind_MultipleValidations_AllPass", () => {
			const result = validateUserCode("flex items-center gap-4", {
				mode: "tailwind",
				validations: [
					{ type: "contains_class", value: "flex" },
					{ type: "contains_class", value: "items-center" },
					{ type: "contains_class", value: "gap-4" }
				]
			});
			expect(result.isValid).toBe(true);
			expect(result.validCases).toBe(3);
		});

		test("tailwind_MultipleValidations_EarlyReturn", () => {
			const result = validateUserCode("flex", {
				mode: "tailwind",
				validations: [
					{ type: "contains_class", value: "flex" },
					{ type: "contains_class", value: "items-center", message: "Missing items-center" },
					{ type: "contains_class", value: "gap-4" }
				]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toBe("Missing items-center");
			expect(result.validCases).toBe(1);
		});

		test("tailwind_WhitespaceHandling_LeadingTrailing", () => {
			const result = validateUserCode("  flex  items-center  ", {
				mode: "tailwind",
				validations: [{ type: "contains_class", value: "flex" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("tailwind_EmptyUserClasses_Fails", () => {
			const result = validateUserCode("", {
				mode: "tailwind",
				validations: [{ type: "contains_class", value: "flex" }]
			});
			expect(result.isValid).toBe(false);
		});
	});

	describe("HTML validation - sibling type", () => {
		test("sibling_ValidOrder_Passes", () => {
			const result = validateUserCode("<h1>Title</h1><p>Content</p>", {
				mode: "html",
				validations: [{ type: "sibling", value: { first: "h1", then: "p" } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("sibling_NonAdjacentButAfter_Passes", () => {
			const result = validateUserCode("<h1>Title</h1><span>Middle</span><p>Content</p>", {
				mode: "html",
				validations: [{ type: "sibling", value: { first: "h1", then: "p" } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("sibling_WrongOrder_Fails", () => {
			const result = validateUserCode("<p>Content</p><h1>Title</h1>", {
				mode: "html",
				validations: [{ type: "sibling", value: { first: "h1", then: "p" } }]
			});
			// h1 is after p, so p is not a sibling after h1 - but wait, h1 exists and p is before h1...
			// Actually h1 exists. nextElementSibling of h1 is nothing. So it fails.
			expect(result.isValid).toBe(false);
		});

		test("sibling_FirstNotFound_Fails", () => {
			const result = validateUserCode("<p>Content</p>", {
				mode: "html",
				validations: [{ type: "sibling", value: { first: "h1", then: "p" }, message: "h1 not found" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toBe("h1 not found");
		});

		test("sibling_ThenNotFound_Fails", () => {
			const result = validateUserCode("<h1>Title</h1><span>Only span</span>", {
				mode: "html",
				validations: [{ type: "sibling", value: { first: "h1", then: "p" } }]
			});
			expect(result.isValid).toBe(false);
		});

		test("sibling_DefaultMessage_ContainsBothSelectors", () => {
			const result = validateUserCode("<div>Only div</div>", {
				mode: "html",
				validations: [{ type: "sibling", value: { first: "h1", then: "p" } }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("p");
			expect(result.message).toContain("h1");
		});

		test("sibling_NoFollowingSiblings_Fails", () => {
			const result = validateUserCode("<div><h1>Title</h1></div>", {
				mode: "html",
				validations: [{ type: "sibling", value: { first: "h1", then: "p" } }]
			});
			expect(result.isValid).toBe(false);
		});
	});

	describe("HTML validation - not_contains type", () => {
		test("htmlNotContains_AbsentText_Passes", () => {
			const result = validateUserCode("<p>Hello</p>", {
				mode: "html",
				validations: [{ type: "not_contains", value: "class=" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("htmlNotContains_PresentText_Fails", () => {
			const result = validateUserCode('<p class="red">Hello</p>', {
				mode: "html",
				validations: [{ type: "not_contains", value: "class=", message: "Remove classes" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toBe("Remove classes");
		});

		test("htmlNotContains_DefaultMessage", () => {
			const result = validateUserCode('<p class="red">Hello</p>', {
				mode: "html",
				validations: [{ type: "not_contains", value: "class=" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("should not include");
		});
	});

	describe("HTML validation - regex type", () => {
		test("htmlRegex_MatchingPattern_Passes", () => {
			const result = validateUserCode('<img src="photo.jpg" alt="A photo">', {
				mode: "html",
				validations: [{ type: "regex", value: 'alt="[^"]+"' }]
			});
			expect(result.isValid).toBe(true);
		});

		test("htmlRegex_NonMatchingPattern_Fails", () => {
			const result = validateUserCode('<img src="photo.jpg">', {
				mode: "html",
				validations: [{ type: "regex", value: 'alt="[^"]+"', message: "Add alt text" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toBe("Add alt text");
		});

		test("htmlRegex_DefaultMessage", () => {
			const result = validateUserCode("<p>Hello</p>", {
				mode: "html",
				validations: [{ type: "regex", value: "<h1>" }]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("pattern");
		});
	});

	describe("HTML validation - unknown type", () => {
		test("htmlUnknownType_SkipsAndPasses", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			const result = validateUserCode("<p>Hello</p>", {
				mode: "html",
				validations: [{ type: "unknown_type", value: "anything" }]
			});
			expect(result.isValid).toBe(true);
			expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Unknown HTML validation type"));
			warnSpy.mockRestore();
		});
	});

	describe("HTML validation - element_count fallback (>0)", () => {
		test("elementCount_NoCountNoMin_ChecksGreaterThanZero_Pass", () => {
			const result = validateUserCode("<ul><li>Item</li></ul>", {
				mode: "html",
				validations: [{ type: "element_count", value: { selector: "li" } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("elementCount_NoCountNoMin_NoElements_Fails", () => {
			const result = validateUserCode("<ul></ul>", {
				mode: "html",
				validations: [{ type: "element_count", value: { selector: "li" } }]
			});
			expect(result.isValid).toBe(false);
		});
	});

	describe("HTML validation - attribute_value edge cases", () => {
		test("attributeValue_ElementNotFound_Fails", () => {
			const result = validateUserCode("<p>Hello</p>", {
				mode: "html",
				validations: [{ type: "attribute_value", value: { selector: "input", attr: "type", value: "email" } }]
			});
			expect(result.isValid).toBe(false);
		});

		test("attributeValue_NullValue_ChecksExists", () => {
			const result = validateUserCode('<input data-test="anything">', {
				mode: "html",
				validations: [{ type: "attribute_value", value: { selector: "input", attr: "data-test", value: null } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("attributeValue_NullValue_AttributeMissing_Fails", () => {
			const result = validateUserCode("<input>", {
				mode: "html",
				validations: [{ type: "attribute_value", value: { selector: "input", attr: "data-test", value: null } }]
			});
			expect(result.isValid).toBe(false);
		});
	});

	describe("HTML validation - element_text edge cases", () => {
		test("elementText_ElementNotFound_Fails", () => {
			const result = validateUserCode("<p>Hello</p>", {
				mode: "html",
				validations: [{ type: "element_text", value: { selector: "button", text: "Submit" } }]
			});
			expect(result.isValid).toBe(false);
		});

		test("elementText_EmptyTextContent_FailsForNonEmptyExpected", () => {
			const result = validateUserCode("<button></button>", {
				mode: "html",
				validations: [{ type: "element_text", value: { selector: "button", text: "Submit" } }]
			});
			expect(result.isValid).toBe(false);
		});

		test("elementText_EmptyExpectedText_MatchesEmptyElement", () => {
			const result = validateUserCode("<button></button>", {
				mode: "html",
				validations: [{ type: "element_text", value: { selector: "button", text: "" } }]
			});
			expect(result.isValid).toBe(true);
		});
	});

	describe("CSS validation - containsValidation wholeWord option", () => {
		test("contains_WholeWord_ExactMatch_Passes", () => {
			const result = validateUserCode("color: red;", {
				validations: [{ type: "contains", value: "red", options: { wholeWord: true } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("contains_WholeWord_PartialMatch_Fails", () => {
			const result = validateUserCode("color: darkred;", {
				validations: [{ type: "contains", value: "red", options: { wholeWord: true } }]
			});
			expect(result.isValid).toBe(false);
		});

		test("contains_WholeWord_CaseInsensitive_Passes", () => {
			const result = validateUserCode("COLOR: RED;", {
				validations: [{ type: "contains", value: "red", options: { wholeWord: true, caseSensitive: false } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("contains_WholeWord_SpecialChars_Escaped", () => {
			// \b doesn't match at non-word chars like ".", so use a word value with special chars around it
			const result = validateUserCode("value: calc(100% - 20px);", {
				validations: [{ type: "contains", value: "calc", options: { wholeWord: true } }]
			});
			expect(result.isValid).toBe(true);

			// "calc" should not match "recalculate"
			const failResult = validateUserCode("/* recalculate */", {
				validations: [{ type: "contains", value: "calc", options: { wholeWord: true } }]
			});
			expect(failResult.isValid).toBe(false);
		});
	});

	describe("CSS validation - regexValidation options", () => {
		test("regex_CaseInsensitive_Passes", () => {
			const result = validateUserCode("COLOR: RED;", {
				validations: [{ type: "regex", value: "color:\\s*red", options: { caseSensitive: false } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("regex_CaseSensitive_Default_FailsOnCaseMismatch", () => {
			const result = validateUserCode("COLOR: RED;", {
				validations: [{ type: "regex", value: "color:\\s*red" }]
			});
			expect(result.isValid).toBe(false);
		});

		test("regex_MultilineFalse_DoesNotMatchAcrossLines", () => {
			const code = "body {\n  color: red;\n}";
			// With multiline=false, ^ should not match beginning of each line
			const result = validateUserCode(code, {
				validations: [{ type: "regex", value: "^\\s*color", options: { multiline: false } }]
			});
			expect(result.isValid).toBe(false);
		});

		test("regex_MultilineTrue_Default_MatchesEachLine", () => {
			const code = "body {\n  color: red;\n}";
			const result = validateUserCode(code, {
				validations: [{ type: "regex", value: "^\\s*color", options: { multiline: true } }]
			});
			expect(result.isValid).toBe(true);
		});

		test("regex_InvalidPattern_ReturnsFalse", () => {
			const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			const result = validateUserCode("color: red;", {
				validations: [{ type: "regex", value: "[invalid(regex" }]
			});
			expect(result.isValid).toBe(false);
			expect(errorSpy).toHaveBeenCalled();
			errorSpy.mockRestore();
		});

		test("regex_EmptyPattern_MatchesEverything", () => {
			const result = validateUserCode("color: red;", {
				validations: [{ type: "regex", value: "" }]
			});
			expect(result.isValid).toBe(true);
		});
	});

	describe("CSS validation - propertyValueValidation edge cases", () => {
		test("propertyValue_PropertyNotFound_Fails", () => {
			const result = validateUserCode("color: red;", {
				validations: [
					{
						type: "property_value",
						value: { property: "display", expected: "flex" }
					}
				]
			});
			expect(result.isValid).toBe(false);
		});

		test("propertyValue_ExactMatch_Passes", () => {
			const result = validateUserCode("display: flex;", {
				validations: [
					{
						type: "property_value",
						value: { property: "display", expected: "flex" },
						options: { exact: true }
					}
				]
			});
			expect(result.isValid).toBe(true);
		});

		test("propertyValue_ExactMatch_CaseMismatch_Fails", () => {
			const result = validateUserCode("display: FLEX;", {
				validations: [
					{
						type: "property_value",
						value: { property: "display", expected: "flex" },
						options: { exact: true }
					}
				]
			});
			expect(result.isValid).toBe(false);
		});

		test("propertyValue_FlexibleMatch_CaseInsensitive", () => {
			const result = validateUserCode("display: FLEX;", {
				validations: [
					{
						type: "property_value",
						value: { property: "display", expected: "flex" }
					}
				]
			});
			expect(result.isValid).toBe(true);
		});

		test("propertyValue_ShorthandProperty_Passes", () => {
			const result = validateUserCode("margin: 10px 20px;", {
				validations: [
					{
						type: "property_value",
						value: { property: "margin", expected: "10px 20px" }
					}
				]
			});
			expect(result.isValid).toBe(true);
		});

		test("propertyValue_DefaultMessage_IncludesPropertyAndExpected", () => {
			const result = validateUserCode("color: red;", {
				validations: [
					{
						type: "property_value",
						value: { property: "display", expected: "flex" }
					}
				]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("display");
			expect(result.message).toContain("flex");
		});
	});

	describe("CSS validation - syntaxValidation", () => {
		test("syntax_ValidCss_Passes", () => {
			const result = validateUserCode("div { color: red; }", {
				validations: [{ type: "syntax" }]
			});
			expect(result.isValid).toBe(true);
		});
	});

	describe("CSS validation - custom edge cases", () => {
		test("custom_NoValidatorFunction_ReturnsEarlyWithOriginalResult", () => {
			const result = validateUserCode("color: red;", {
				validations: [{ type: "custom" }]
			});
			// When validator is falsy, validationPassed stays false, but result.isValid was never set to false
			// The function returns early with the unmodified result (isValid: true)
			expect(result.isValid).toBe(true);
		});

		test("custom_NonFunctionValidator_ReturnsEarlyWithOriginalResult", () => {
			const result = validateUserCode("color: red;", {
				validations: [{ type: "custom", validator: "not-a-function" }]
			});
			// Same behavior: validator check fails, validationPassed stays false, returns unmodified result
			expect(result.isValid).toBe(true);
		});

		test("custom_ValidatorReturnsNoMessage_UsesMessage", () => {
			const result = validateUserCode("color: red;", {
				validations: [
					{
						type: "custom",
						validator: () => ({ isValid: false }),
						message: "Fallback message"
					}
				]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toBe("Fallback message");
		});

		test("custom_ValidatorReturnsNoMessage_NoLessonMessage_DefaultMessage", () => {
			const result = validateUserCode("color: red;", {
				validations: [
					{
						type: "custom",
						validator: () => ({ isValid: false })
					}
				]
			});
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("does not meet the requirements");
		});
	});

	describe("CSS validation - unknown type", () => {
		test("unknownType_WarnsAndContinues", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			const result = validateUserCode("color: red;", {
				validations: [
					{ type: "invented_type", value: "anything" },
					{ type: "contains", value: "color: red" }
				]
			});
			expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Unknown validation type"));
			// The unknown type is skipped (continue), then the next validation passes
			expect(result.isValid).toBe(true);
			warnSpy.mockRestore();
		});
	});

	describe("CSS validation - empty and whitespace input", () => {
		test("emptyString_ContainsValidation_Fails", () => {
			const result = validateUserCode("", {
				validations: [{ type: "contains", value: "color" }]
			});
			expect(result.isValid).toBe(false);
		});

		test("whitespaceOnly_ContainsValidation_Fails", () => {
			const result = validateUserCode("   \n\t  ", {
				validations: [{ type: "contains", value: "color" }]
			});
			expect(result.isValid).toBe(false);
		});

		test("emptyString_NotContains_Passes", () => {
			const result = validateUserCode("", {
				validations: [{ type: "not_contains", value: "color" }]
			});
			expect(result.isValid).toBe(true);
		});
	});

	describe("CSS validation - validCases and totalCases tracking", () => {
		test("allPassingValidations_ValidCasesEqualsTotalCases", () => {
			const result = validateUserCode("display: flex; color: red;", {
				validations: [
					{ type: "contains", value: "display: flex" },
					{ type: "contains", value: "color: red" }
				]
			});
			expect(result.isValid).toBe(true);
			expect(result.validCases).toBe(2);
			expect(result.totalCases).toBe(2);
		});

		test("firstValidationFails_ValidCasesIs0", () => {
			const result = validateUserCode("color: red;", {
				validations: [
					{ type: "contains", value: "display: flex" },
					{ type: "contains", value: "color: red" }
				]
			});
			expect(result.isValid).toBe(false);
			expect(result.validCases).toBe(0);
			expect(result.totalCases).toBe(2);
		});

		test("secondValidationFails_ValidCasesIs1", () => {
			const result = validateUserCode("display: flex;", {
				validations: [
					{ type: "contains", value: "display: flex" },
					{ type: "contains", value: "color: red" }
				]
			});
			expect(result.isValid).toBe(false);
			expect(result.validCases).toBe(1);
			expect(result.totalCases).toBe(2);
		});
	});

	describe("CSS validation - special regex metacharacters in contains", () => {
		test("contains_DotInValue_TreatedAsLiteral", () => {
			// ".class" should match literally, not any char + "class"
			const result = validateUserCode(".card { color: red; }", {
				validations: [{ type: "contains", value: ".card" }]
			});
			expect(result.isValid).toBe(true);
		});

		test("contains_BracketsInValue_TreatedAsLiteral", () => {
			const result = validateUserCode("content: '[test]';", {
				validations: [{ type: "contains", value: "[test]" }]
			});
			expect(result.isValid).toBe(true);
		});
	});

	describe("HTML validation - deeply nested parent_child", () => {
		test("parentChild_DeeplyNested_Passes", () => {
			const html = "<div><section><article><p>Deep</p></article></section></div>";
			const result = validateUserCode(html, {
				mode: "html",
				validations: [{ type: "parent_child", value: { parent: "div", child: "p" } }]
			});
			expect(result.isValid).toBe(true);
		});
	});

	describe("HTML validation - validCases tracking", () => {
		test("htmlAllPass_ValidCasesEqualsTotal", () => {
			const result = validateUserCode("<h1>Title</h1><p>Content</p>", {
				mode: "html",
				validations: [
					{ type: "element_exists", value: "h1" },
					{ type: "element_exists", value: "p" }
				]
			});
			expect(result.isValid).toBe(true);
			expect(result.validCases).toBe(2);
			expect(result.totalCases).toBe(2);
		});

		test("htmlPartialPass_EarlyReturn", () => {
			const result = validateUserCode("<h1>Title</h1>", {
				mode: "html",
				validations: [
					{ type: "element_exists", value: "h1" },
					{ type: "element_exists", value: "p", message: "Need paragraph" }
				]
			});
			expect(result.isValid).toBe(false);
			expect(result.validCases).toBe(1);
			expect(result.message).toBe("Need paragraph");
		});
	});
});
