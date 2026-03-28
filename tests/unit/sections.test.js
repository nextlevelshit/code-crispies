import { describe, test, expect } from "vitest";
import { sections, getSection, getSectionList, getModuleSection, getModulesBySection } from "../../src/config/sections.js";

describe("Sections Config", () => {
	describe("sections constant", () => {
		test("sections_AllDefined_HasFourSections", () => {
			expect(Object.keys(sections)).toHaveLength(4);
			expect(sections).toHaveProperty("css");
			expect(sections).toHaveProperty("html");
			expect(sections).toHaveProperty("tailwind");
			expect(sections).toHaveProperty("markdown");
		});

		test("sections_EachSection_HasRequiredFields", () => {
			for (const [key, section] of Object.entries(sections)) {
				expect(section.id).toBe(key);
				expect(section.title).toBeTruthy();
				expect(section.description).toBeTruthy();
				expect(section.color).toMatch(/^#[0-9a-f]{6}$/);
				expect(typeof section.order).toBe("number");
			}
		});
	});

	describe("getSection", () => {
		test.each([
			["css", "CSS"],
			["html", "HTML"],
			["tailwind", "Tailwind CSS"],
			["markdown", "Markdown"]
		])("getSection_%s_ReturnsCorrectSection", (id, expectedTitle) => {
			const section = getSection(id);
			expect(section).not.toBeNull();
			expect(section.id).toBe(id);
			expect(section.title).toBe(expectedTitle);
		});

		test("getSection_NonExistentId_ReturnsNull", () => {
			expect(getSection("nonexistent")).toBeNull();
		});

		test("getSection_Undefined_ReturnsNull", () => {
			expect(getSection(undefined)).toBeNull();
		});

		test("getSection_EmptyString_ReturnsNull", () => {
			expect(getSection("")).toBeNull();
		});
	});

	describe("getSectionList", () => {
		test("getSectionList_Default_ReturnsSortedByOrder", () => {
			const list = getSectionList();
			expect(list).toHaveLength(4);

			// Verify sorted by order
			for (let i = 1; i < list.length; i++) {
				expect(list[i].order).toBeGreaterThan(list[i - 1].order);
			}
		});

		test("getSectionList_Default_CSSIsFirst", () => {
			const list = getSectionList();
			expect(list[0].id).toBe("css");
		});

		test("getSectionList_Default_MarkdownIsLast", () => {
			const list = getSectionList();
			expect(list[list.length - 1].id).toBe("markdown");
		});

		test("getSectionList_Default_ContainsAllSections", () => {
			const list = getSectionList();
			const ids = list.map((s) => s.id);
			expect(ids).toContain("css");
			expect(ids).toContain("html");
			expect(ids).toContain("tailwind");
			expect(ids).toContain("markdown");
		});
	});

	describe("getModuleSection", () => {
		test("getModuleSection_ExplicitSection_UsesExplicitValue", () => {
			const module = { mode: "css", section: "html" };
			expect(getModuleSection(module)).toBe("html");
		});

		test.each([
			["css", "css"],
			["html", "html"],
			["tailwind", "tailwind"],
			["markdown", "markdown"]
		])("getModuleSection_Mode%s_InfersCorrectSection", (mode, expectedSection) => {
			const module = { mode };
			expect(getModuleSection(module)).toBe(expectedSection);
		});

		test("getModuleSection_NoMode_DefaultsToCss", () => {
			expect(getModuleSection({})).toBe("css");
		});

		test("getModuleSection_UndefinedMode_DefaultsToCss", () => {
			expect(getModuleSection({ mode: undefined })).toBe("css");
		});

		test("getModuleSection_UnknownMode_DefaultsToCss", () => {
			expect(getModuleSection({ mode: "javascript" })).toBe("css");
		});

		test("getModuleSection_ExplicitSectionOverridesMode_UsesSection", () => {
			const module = { mode: "html", section: "tailwind" };
			expect(getModuleSection(module)).toBe("tailwind");
		});
	});

	describe("getModulesBySection", () => {
		const testModules = [
			{ id: "css-basics", mode: "css" },
			{ id: "flexbox", mode: "css" },
			{ id: "html-elements", mode: "html" },
			{ id: "tailwind-intro", mode: "tailwind" },
			{ id: "markdown-basics", mode: "markdown" },
			{ id: "welcome", mode: "css", excludeFromProgress: true },
			{ id: "playground", mode: "css", excludeFromProgress: true }
		];

		test("getModulesBySection_Css_ReturnsCssModules", () => {
			const result = getModulesBySection(testModules, "css");
			expect(result).toHaveLength(2);
			expect(result.map((m) => m.id)).toEqual(["css-basics", "flexbox"]);
		});

		test("getModulesBySection_Html_ReturnsHtmlModules", () => {
			const result = getModulesBySection(testModules, "html");
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe("html-elements");
		});

		test("getModulesBySection_Tailwind_ReturnsTailwindModules", () => {
			const result = getModulesBySection(testModules, "tailwind");
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe("tailwind-intro");
		});

		test("getModulesBySection_ExcludesFromProgress_FiltersOut", () => {
			const result = getModulesBySection(testModules, "css");
			const ids = result.map((m) => m.id);
			expect(ids).not.toContain("welcome");
			expect(ids).not.toContain("playground");
		});

		test("getModulesBySection_EmptyModules_ReturnsEmptyArray", () => {
			const result = getModulesBySection([], "css");
			expect(result).toEqual([]);
		});

		test("getModulesBySection_NonExistentSection_ReturnsEmptyArray", () => {
			const result = getModulesBySection(testModules, "nonexistent");
			expect(result).toEqual([]);
		});

		test("getModulesBySection_ExplicitSectionOverride_IncludesModule", () => {
			const modules = [
				{ id: "special", mode: "css", section: "html" },
				{ id: "normal-html", mode: "html" }
			];
			const result = getModulesBySection(modules, "html");
			expect(result).toHaveLength(2);
			expect(result.map((m) => m.id)).toContain("special");
		});
	});
});
