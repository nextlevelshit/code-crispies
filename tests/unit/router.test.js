import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { parseHash, updateHash, navigateTo, replaceHash, replaceTo, getShareableUrl, getSectionIds, RouteType } from "../../src/helpers/router.js";

describe("Router", () => {
	let pushStateSpy;
	let replaceStateSpy;

	beforeEach(() => {
		// Reset hash
		window.location.hash = "";
		pushStateSpy = vi.spyOn(history, "pushState").mockImplementation(() => {});
		replaceStateSpy = vi.spyOn(history, "replaceState").mockImplementation(() => {});
	});

	afterEach(() => {
		pushStateSpy.mockRestore();
		replaceStateSpy.mockRestore();
	});

	describe("RouteType", () => {
		test("RouteType_Constants_CorrectValues", () => {
			expect(RouteType.HOME).toBe("home");
			expect(RouteType.SECTION).toBe("section");
			expect(RouteType.REFERENCE).toBe("reference");
			expect(RouteType.LESSON).toBe("lesson");
			expect(RouteType.LANGUAGE).toBe("language");
		});
	});

	describe("parseHash", () => {
		test("parseHash_EmptyHash_ReturnsHome", () => {
			window.location.hash = "";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.HOME });
		});

		test("parseHash_HashOnly_ReturnsHome", () => {
			window.location.hash = "#";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.HOME });
		});

		test.each([
			["de", "de"],
			["pl", "pl"],
			["ar", "ar"],
			["es", "es"],
			["en", "en"],
			["uk", "uk"]
		])("parseHash_LanguageCode_%s_ReturnsLanguageRoute", (code, expectedLang) => {
			window.location.hash = `#${code}`;
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.LANGUAGE, lang: expectedLang });
		});

		test.each([
			["css", "css"],
			["html", "html"],
			["markdown", "markdown"],
			["javascript", "javascript"]
		])("parseHash_SectionId_%s_ReturnsSectionRoute", (sectionId, expectedId) => {
			window.location.hash = `#${sectionId}`;
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.SECTION, sectionId: expectedId });
		});

		test("parseHash_ReferenceWithoutSubpage_ReturnsReferenceRouteNullRefId", () => {
			window.location.hash = "#reference";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.REFERENCE, refId: null });
		});

		test("parseHash_ReferenceWithSubpage_ReturnsReferenceRouteWithRefId", () => {
			window.location.hash = "#reference/css";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.REFERENCE, refId: "css" });
		});

		test("parseHash_ReferenceWithFlexboxSubpage_ReturnsCorrectRefId", () => {
			window.location.hash = "#reference/flexbox";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.REFERENCE, refId: "flexbox" });
		});

		test("parseHash_SingleUnknownSegment_ReturnsLessonWithIndex0", () => {
			window.location.hash = "#flexbox";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.LESSON, moduleId: "flexbox", lessonIndex: 0 });
		});

		test("parseHash_ModuleWithLessonIndex_ReturnsLessonRoute", () => {
			window.location.hash = "#flexbox/2";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.LESSON, moduleId: "flexbox", lessonIndex: 2 });
		});

		test("parseHash_ModuleWithIndex0_ReturnsLessonRoute", () => {
			window.location.hash = "#box-model/0";
			const result = parseHash();
			expect(result).toEqual({ type: RouteType.LESSON, moduleId: "box-model", lessonIndex: 0 });
		});

		test("parseHash_NegativeLessonIndex_ReturnsNull", () => {
			window.location.hash = "#module/-1";
			const result = parseHash();
			expect(result).toBeNull();
		});

		test("parseHash_NonNumericLessonIndex_ReturnsNull", () => {
			window.location.hash = "#module/abc";
			const result = parseHash();
			expect(result).toBeNull();
		});

		test("parseHash_ThreeOrMoreSegments_ReturnsNull", () => {
			window.location.hash = "#a/b/c";
			const result = parseHash();
			expect(result).toBeNull();
		});

		test("parseHash_EmptyModuleIdWithIndex_ReturnsNull", () => {
			// #/0 → parts = ["", "0"], moduleId is empty string (falsy)
			window.location.hash = "#/0";
			const result = parseHash();
			expect(result).toBeNull();
		});
	});

	describe("updateHash", () => {
		test("updateHash_NewHash_CallsPushState", () => {
			window.location.hash = "";
			updateHash("flexbox", 2);
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "#flexbox/2");
		});

		test("updateHash_SameHash_DoesNotCallPushState", () => {
			window.location.hash = "#flexbox/2";
			updateHash("flexbox", 2);
			expect(pushStateSpy).not.toHaveBeenCalled();
		});

		test("updateHash_DifferentModule_CallsPushState", () => {
			window.location.hash = "#flexbox/0";
			updateHash("box-model", 0);
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "#box-model/0");
		});
	});

	describe("navigateTo", () => {
		test("navigateTo_SectionRoute_CallsPushState", () => {
			window.location.hash = "";
			navigateTo("css");
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "#css");
		});

		test("navigateTo_EmptyRoute_NavigatesToHash", () => {
			window.location.hash = "#something";
			navigateTo("");
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "#");
		});

		test("navigateTo_SameHash_DoesNotCallPushState", () => {
			window.location.hash = "#css";
			navigateTo("css");
			expect(pushStateSpy).not.toHaveBeenCalled();
		});
	});

	describe("replaceHash", () => {
		test("replaceHash_ValidArgs_CallsReplaceState", () => {
			replaceHash("flexbox", 3);
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#flexbox/3");
		});

		test("replaceHash_Index0_FormatsCorrectly", () => {
			replaceHash("box-model", 0);
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#box-model/0");
		});
	});

	describe("replaceTo", () => {
		test("replaceTo_Route_CallsReplaceState", () => {
			replaceTo("css");
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#css");
		});

		test("replaceTo_EmptyRoute_ReplacesToHash", () => {
			replaceTo("");
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#");
		});

		test("replaceTo_ReferenceRoute_FormatsCorrectly", () => {
			replaceTo("reference/flexbox");
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#reference/flexbox");
		});
	});

	describe("getShareableUrl", () => {
		test("getShareableUrl_ValidArgs_ReturnsFullUrl", () => {
			const url = getShareableUrl("flexbox", 2);
			expect(url).toContain("#flexbox/2");
			expect(url).toMatch(/^https?:\/\/.+#flexbox\/2$/);
		});

		test("getShareableUrl_Index0_IncludesIndex", () => {
			const url = getShareableUrl("box-model", 0);
			expect(url).toContain("#box-model/0");
		});
	});

	describe("getSectionIds", () => {
		test("getSectionIds_ReturnsCopy_NotOriginalArray", () => {
			const ids1 = getSectionIds();
			const ids2 = getSectionIds();
			expect(ids1).toEqual(ids2);
			expect(ids1).not.toBe(ids2); // Different references
		});

		test("getSectionIds_ContainsExpectedSections", () => {
			const ids = getSectionIds();
			expect(ids).toContain("css");
			expect(ids).toContain("html");
			expect(ids).toContain("markdown");
			expect(ids).toContain("javascript");
		});

		test("getSectionIds_MutatingCopy_DoesNotAffectOriginal", () => {
			const ids = getSectionIds();
			ids.push("custom");
			const freshIds = getSectionIds();
			expect(freshIds).not.toContain("custom");
		});
	});
});
