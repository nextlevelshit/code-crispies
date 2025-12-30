import { describe, test, expect, vi, beforeEach } from "vitest";
import { loadModules, getModuleById, loadModuleFromUrl, addCustomModule } from "../../src/config/lessons.js";

describe("Lessons Config Module", () => {
	describe("loadModules", () => {
		test("should return an array of modules", async () => {
			const modules = await loadModules();

			expect(Array.isArray(modules)).toBe(true);
			expect(modules.length).toBeGreaterThanOrEqual(6);

			// Check if modules have the right structure
			const moduleIds = modules.map((m) => m.id);
			// HTML modules
			expect(moduleIds).toContain("html-elements");
			expect(moduleIds).toContain("html-forms-basic");
			expect(moduleIds).toContain("html-forms-validation");
			// CSS modules
			expect(moduleIds).toContain("css-basic-selectors");
			expect(moduleIds).toContain("box-model");
			expect(moduleIds).toContain("flexbox");
		});

		test("should have mode set on each lesson", async () => {
			const modules = await loadModules();

			modules.forEach((module) => {
				module.lessons.forEach((lesson) => {
					expect(lesson.mode).toBeDefined();
					expect(["html", "css", "tailwind"]).toContain(lesson.mode);
				});
			});
		});
	});

	describe("getModuleById", () => {
		test("should return a module by ID", async () => {
			// Load modules first to populate the module store
			await loadModules();

			const htmlModule = getModuleById("html-elements");
			expect(htmlModule).not.toBeNull();
			expect(htmlModule.id).toBe("html-elements");
			expect(htmlModule.mode).toBe("html");
		});

		test("should return null for non-existent module ID", async () => {
			// Load modules first
			await loadModules();

			const nonExistentModule = getModuleById("non-existent");
			expect(nonExistentModule).toBeNull();
		});
	});

	describe("loadModuleFromUrl", () => {
		beforeEach(() => {
			// Reset fetch mock
			fetch.mockReset();
		});

		test("should load a module from a URL", async () => {
			const mockModule = {
				id: "remote-module",
				title: "Remote Module",
				lessons: [{ title: "Lesson 1", previewHTML: "<div>Preview</div>" }]
			};

			// Mock the fetch response
			fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockModule
			});

			const result = await loadModuleFromUrl("https://example.com/module.json");

			expect(fetch).toHaveBeenCalledWith("https://example.com/module.json");
			expect(result).toEqual(mockModule);
		});

		test("should throw an error for failed fetch", async () => {
			fetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: "Not Found"
			});

			await expect(loadModuleFromUrl("https://example.com/not-found.json")).rejects.toThrow("Failed to load module: 404 Not Found");
		});

		test("should validate module structure", async () => {
			// Missing required fields
			const invalidModule = {
				// Missing id
				title: "Invalid Module"
				// Missing lessons array
			};

			fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => invalidModule
			});

			await expect(loadModuleFromUrl("https://example.com/invalid.json")).rejects.toThrow('Module config missing "id"');

			// Invalid lessons structure
			const moduleWithInvalidLessons = {
				id: "invalid-lessons",
				title: "Invalid Lessons",
				lessons: [{ /* Missing title */ previewHTML: "<div>Preview</div>" }]
			};

			fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => moduleWithInvalidLessons
			});

			await expect(loadModuleFromUrl("https://example.com/invalid-lessons.json")).rejects.toThrow('Lesson 0 missing "title"');
		});
	});

	describe("addCustomModule", () => {
		test("should add a new module to the store", async () => {
			// Load modules first to get current count
			const initialModules = await loadModules();
			const initialCount = initialModules.length;

			const customModule = {
				id: "custom-module",
				title: "Custom Module",
				lessons: [{ title: "Custom Lesson", previewHTML: "<div>Preview</div>" }]
			};

			const result = addCustomModule(customModule);
			expect(result).toBe(true);

			// Check if module was added
			const updatedModules = await loadModules();
			expect(updatedModules.length).toBe(initialCount + 1);

			const addedModule = getModuleById("custom-module");
			expect(addedModule).not.toBeNull();
			expect(addedModule.title).toBe("Custom Module");
		});

		test("should replace existing module with same ID", async () => {
			// Add a module first
			const customModule = {
				id: "replace-test",
				title: "Original Module",
				lessons: [{ title: "Original Lesson", previewHTML: "<div>Preview</div>" }]
			};

			addCustomModule(customModule);

			// Now replace it
			const replacementModule = {
				id: "replace-test",
				title: "Replacement Module",
				lessons: [{ title: "New Lesson", previewHTML: "<div>New Preview</div>" }]
			};

			const result = addCustomModule(replacementModule);
			expect(result).toBe(true);

			// Check if module was replaced
			const updatedModule = getModuleById("replace-test");
			expect(updatedModule.title).toBe("Replacement Module");
		});

		test("should validate module before adding", () => {
			const invalidModule = {
				// Missing required fields
				title: "Invalid Module"
			};

			const result = addCustomModule(invalidModule);
			expect(result).toBe(false);
		});
	});
});
