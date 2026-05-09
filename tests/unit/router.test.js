import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { parseHash, parseRoute, updateHash, navigateTo, replaceHash, replaceTo, getShareableUrl, getSectionIds, RouteType, migrateLegacyHashRoute } from "../../src/helpers/router.js";

/**
 * Helper: set the current pathname in jsdom without triggering a real
 * navigation. window.location.pathname is read-only, so use the History
 * API instead. Strip the hash separately so legacy-hash tests can
 * isolate just the path.
 */
function setPath(path) {
	window.history.replaceState(null, "", path);
}

function setHash(hash) {
	// The router treats #fragment as a legacy hint, so set it directly.
	// This works in jsdom because location.hash is writable.
	window.location.hash = hash;
}

describe("Router", () => {
	let pushStateSpy;
	let replaceStateSpy;

	beforeEach(() => {
		setPath("/");
		setHash("");
		// Spy without mockImplementation so the real History API still
		// updates window.location — otherwise setPath() inside tests
		// becomes a no-op and parseRoute() always sees "/".
		pushStateSpy = vi.spyOn(history, "pushState");
		replaceStateSpy = vi.spyOn(history, "replaceState");
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

	describe("parseRoute", () => {
		test("parseRoute_RootPath_ReturnsHome", () => {
			setPath("/");
			expect(parseRoute()).toEqual({ type: RouteType.HOME });
		});

		test("parseRoute_EmptyPath_ReturnsHome", () => {
			setPath("");
			expect(parseRoute()).toEqual({ type: RouteType.HOME });
		});

		test.each([
			["/de", "de"],
			["/pl", "pl"],
			["/ar", "ar"],
			["/es", "es"],
			["/en", "en"],
			["/uk", "uk"]
		])("parseRoute_LanguageCode_%s_ReturnsLanguageRoute", (path, expectedLang) => {
			setPath(path);
			expect(parseRoute()).toEqual({ type: RouteType.LANGUAGE, lang: expectedLang });
		});

		test.each([
			["/css", "css"],
			["/html", "html"],
			["/markdown", "markdown"],
			["/javascript", "javascript"]
		])("parseRoute_SectionId_%s_ReturnsSectionRoute", (path, expectedId) => {
			setPath(path);
			expect(parseRoute()).toEqual({ type: RouteType.SECTION, sectionId: expectedId });
		});

		test("parseRoute_ReferenceWithoutSubpage_ReturnsReferenceRouteNullRefId", () => {
			setPath("/reference");
			expect(parseRoute()).toEqual({ type: RouteType.REFERENCE, refId: null });
		});

		test("parseRoute_ReferenceWithSubpage_ReturnsReferenceRouteWithRefId", () => {
			setPath("/reference/css");
			expect(parseRoute()).toEqual({ type: RouteType.REFERENCE, refId: "css" });
		});

		test("parseRoute_ReferenceWithFlexboxSubpage_ReturnsCorrectRefId", () => {
			setPath("/reference/flexbox");
			expect(parseRoute()).toEqual({ type: RouteType.REFERENCE, refId: "flexbox" });
		});

		test("parseRoute_SingleUnknownSegment_ReturnsLessonWithIndex0", () => {
			setPath("/flexbox");
			expect(parseRoute()).toEqual({ type: RouteType.LESSON, moduleId: "flexbox", lessonIndex: 0 });
		});

		test("parseRoute_ModuleWithLessonIndex_ReturnsLessonRoute", () => {
			setPath("/flexbox/2");
			expect(parseRoute()).toEqual({ type: RouteType.LESSON, moduleId: "flexbox", lessonIndex: 2 });
		});

		test("parseRoute_ModuleWithIndex0_ReturnsLessonRoute", () => {
			setPath("/box-model/0");
			expect(parseRoute()).toEqual({ type: RouteType.LESSON, moduleId: "box-model", lessonIndex: 0 });
		});

		test("parseRoute_NegativeLessonIndex_ReturnsNull", () => {
			setPath("/module/-1");
			expect(parseRoute()).toBeNull();
		});

		test("parseRoute_NonNumericLessonIndex_ReturnsNull", () => {
			setPath("/module/abc");
			expect(parseRoute()).toBeNull();
		});

		test("parseRoute_ThreeOrMoreSegments_ReturnsNull", () => {
			setPath("/a/b/c");
			expect(parseRoute()).toBeNull();
		});

		test("parseRoute_TrailingSlash_NormalizedAway", () => {
			setPath("/css/");
			expect(parseRoute()).toEqual({ type: RouteType.SECTION, sectionId: "css" });
		});

		test("parseHash_BackwardsCompatAlias_BehavesLikeParseRoute", () => {
			setPath("/flexbox/3");
			expect(parseHash()).toEqual({ type: RouteType.LESSON, moduleId: "flexbox", lessonIndex: 3 });
		});
	});

	describe("updateHash", () => {
		test("updateHash_NewPath_CallsPushState", () => {
			setPath("/");
			updateHash("flexbox", 2);
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "/flexbox/2");
		});

		test("updateHash_SamePath_DoesNotCallPushState", () => {
			setPath("/flexbox/2");
			updateHash("flexbox", 2);
			expect(pushStateSpy).not.toHaveBeenCalled();
		});

		test("updateHash_DifferentModule_CallsPushState", () => {
			setPath("/flexbox/0");
			updateHash("box-model", 0);
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "/box-model/0");
		});
	});

	describe("navigateTo", () => {
		test("navigateTo_SectionRoute_CallsPushState", () => {
			setPath("/");
			navigateTo("css");
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "/css");
		});

		test("navigateTo_EmptyRoute_NavigatesToHome", () => {
			setPath("/something");
			navigateTo("");
			expect(pushStateSpy).toHaveBeenCalledWith(null, "", "/");
		});

		test("navigateTo_SamePath_DoesNotCallPushState", () => {
			setPath("/css");
			navigateTo("css");
			expect(pushStateSpy).not.toHaveBeenCalled();
		});
	});

	describe("replaceHash", () => {
		test("replaceHash_ValidArgs_CallsReplaceState", () => {
			replaceHash("flexbox", 3);
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/flexbox/3");
		});

		test("replaceHash_Index0_FormatsCorrectly", () => {
			replaceHash("box-model", 0);
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/box-model/0");
		});
	});

	describe("replaceTo", () => {
		test("replaceTo_Route_CallsReplaceState", () => {
			replaceTo("css");
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/css");
		});

		test("replaceTo_EmptyRoute_ReplacesToHome", () => {
			replaceTo("");
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/");
		});

		test("replaceTo_ReferenceRoute_FormatsCorrectly", () => {
			replaceTo("reference/flexbox");
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/reference/flexbox");
		});
	});

	describe("getShareableUrl", () => {
		test("getShareableUrl_ValidArgs_ReturnsFullPathUrl", () => {
			const url = getShareableUrl("flexbox", 2);
			expect(url).toContain("/flexbox/2");
			expect(url).toMatch(/^https?:\/\/.+\/flexbox\/2$/);
		});

		test("getShareableUrl_Index0_IncludesIndex", () => {
			const url = getShareableUrl("box-model", 0);
			expect(url).toContain("/box-model/0");
		});
	});

	describe("getSectionIds", () => {
		test("getSectionIds_ReturnsCopy_NotOriginalArray", () => {
			const ids1 = getSectionIds();
			const ids2 = getSectionIds();
			expect(ids1).toEqual(ids2);
			expect(ids1).not.toBe(ids2);
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

	describe("migrateLegacyHashRoute", () => {
		// Setting location.hash in jsdom internally calls replaceState, so
		// reset the spy after each setHash() before asserting.
		test("noHash_ReturnsFalse_NoRedirect", () => {
			setPath("/");
			setHash("");
			replaceStateSpy.mockClear();
			expect(migrateLegacyHashRoute()).toBe(false);
			expect(replaceStateSpy).not.toHaveBeenCalled();
		});

		test("oauthAccessTokenHash_LeftAlone", () => {
			setPath("/");
			setHash("#access_token=abc&token_type=bearer");
			replaceStateSpy.mockClear();
			expect(migrateLegacyHashRoute()).toBe(false);
			expect(replaceStateSpy).not.toHaveBeenCalled();
		});

		test("anchorHash_LeftAlone", () => {
			setPath("/");
			setHash("#main-content");
			replaceStateSpy.mockClear();
			expect(migrateLegacyHashRoute()).toBe(false);
			expect(replaceStateSpy).not.toHaveBeenCalled();
		});

		test("legacyLessonHash_RedirectedToPath", () => {
			setPath("/");
			setHash("#flexbox/2");
			replaceStateSpy.mockClear();
			expect(migrateLegacyHashRoute()).toBe(true);
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/flexbox/2");
		});

		test("legacySectionHash_RedirectedToPath", () => {
			setPath("/");
			setHash("#css");
			replaceStateSpy.mockClear();
			expect(migrateLegacyHashRoute()).toBe(true);
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/css");
		});

		test("legacyReferenceHash_RedirectedToPath", () => {
			setPath("/");
			setHash("#reference/flexbox");
			replaceStateSpy.mockClear();
			expect(migrateLegacyHashRoute()).toBe(true);
			expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/reference/flexbox");
		});
	});
});
