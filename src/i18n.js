/**
 * Internationalization module for Code Crispies
 */

const translations = {
	en: {
		// Page
		pageTitle: "Code Crispies - Learn HTML & CSS Interactively",
		skipLink: "Skip to main content",

		// Header
		menuOpen: "Open menu",
		langSwitch: "DE",
		langSwitchLabel: "Sprache wechseln: Deutsch",
		help: "Help",

		// Instructions
		loading: "Loading...",
		selectLesson: "Please select a lesson to begin.",
		editorLabel: "CSS Editor",
		undoTitle: "Undo (Ctrl+Z)",
		redoTitle: "Redo (Ctrl+Shift+Z)",
		resetCodeTitle: "Reset to initial code",
		run: "Run",
		rerun: "Re-run",

		// Preview
		yourOutput: "Your Output",
		showExpected: "Show Expected",
		hideExpected: "Hide Expected",
		previous: "Previous",
		next: "Next",
		levelIndicator: "Lesson {current} of {total}",
		lessonLabel: "Lesson",

		// Sidebar
		menu: "Menu",
		closeMenu: "Close menu",
		progress: "Progress",
		progressText: "{percent}% Complete ({completed}/{total})",
		lessons: "Lessons",
		settings: "Settings",
		showHints: "Show Hints",
		resetAllProgress: "Reset All Progress",
		openSource: "Open Source:",
		by: "by",

		// Help dialog
		helpTitle: "Help",
		aboutTitle: "About Code Crispies",
		aboutText: "Code Crispies is a free, open-source platform for learning web development through hands-on exercises. No account required - just start coding!",
		learningModesTitle: "Learning Modes",
		modeCss: "<strong>CSS</strong> - Write CSS rules to style elements",
		modeTailwind: "<strong>Tailwind</strong> - Apply utility classes directly in HTML",
		modeHtml: "<strong>HTML</strong> - Practice semantic markup and native elements",
		gettingStartedTitle: "Getting Started",
		gettingStartedText: "Open the menu (☰) to browse lesson modules. Each module covers a specific topic with progressive exercises.",
		completingLessonsTitle: "Completing Lessons",
		completingStep1: "Read the task instructions on the left",
		completingStep2: "Write your code in the editor",
		completingStep3: "Watch the live preview update as you type",
		completingStep4: "Follow hints to fix any issues",
		completingStep5: "Click <strong>Next</strong> when complete",
		editorToolsTitle: "Editor Tools",
		editorToolUndo: "<strong>↶ Undo</strong> / <strong>↷ Redo</strong> - Navigate edit history",
		editorToolReset: "<strong>⟲ Reset</strong> - Restore initial code for current lesson",
		editorToolExpected: "<strong>Show Expected</strong> - Toggle the target result overlay",
		keyboardShortcutsTitle: "Keyboard Shortcuts",
		shortcutRun: "<kbd>Ctrl+Enter</kbd> - Validate immediately",
		shortcutUndo: "<kbd>Ctrl+Z</kbd> - Undo",
		shortcutRedo: "<kbd>Ctrl+Shift+Z</kbd> - Redo",
		emmetTitle: "Emmet Shortcuts (HTML mode)",
		emmetText: "Type abbreviations and press <kbd>Tab</kbd> to expand:",
		emmetClass: "<kbd>div.box</kbd> → div with class",
		emmetChildren: "<kbd>ul>li*3</kbd> → ul with 3 li children",
		emmetNested: "<kbd>form>input+button</kbd> → nested structure",
		emmetContent: "<kbd>p{Hello}</kbd> → p with text content",

		// More Projects
		moreProjectsTitle: "More Projects",
		htmlOverJsDesc: " - Learn to leverage native HTML elements instead of custom JavaScript solutions",
		mandalaDesc: " - Interactive visualization of JavaScript technologies organized by complexity",

		// Contact
		contactTitle: "Contact & Links",
		contactText: "Code Crispies is developed by <a href=\"https://librete.ch\" target=\"_blank\">LibreTECH</a>",

		// Reset dialog
		resetDialogTitle: "Reset Progress",
		resetDialogText: "Are you sure you want to reset all your progress? This cannot be undone.",
		cancel: "Cancel",
		resetAll: "Reset All",

		// Dynamic content
		loadingFallbackText: "Could not load lesson. Please select one from the menu or check the help.",
		completed: "Completed",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Your code works correctly.",
		keepTrying: "Keep trying!",
		failedToLoad: "Failed to load modules. Please refresh the page.",
		tailwindPlaceholder: "Enter Tailwind classes (e.g., bg-blue-500 text-white p-4)",
		lessonFallback: "Lesson {index}",
		untitledLesson: "Untitled Lesson"
	},

	de: {
		// Page
		pageTitle: "Code Crispies - HTML & CSS interaktiv lernen",
		skipLink: "Zum Hauptinhalt springen",

		// Header
		menuOpen: "Menü öffnen",
		langSwitch: "EN",
		langSwitchLabel: "Switch language: English",
		help: "Hilfe",

		// Instructions
		loading: "Laden...",
		selectLesson: "Bitte wähle eine Lektion aus, um zu beginnen.",
		editorLabel: "CSS-Editor",
		undoTitle: "Rückgängig (Strg+Z)",
		redoTitle: "Wiederholen (Strg+Umschalt+Z)",
		resetCodeTitle: "Auf Anfangscode zurücksetzen",
		run: "Ausführen",
		rerun: "Erneut ausführen",

		// Preview
		yourOutput: "Dein Ergebnis",
		showExpected: "Lösung einblenden",
		hideExpected: "Lösung ausblenden",
		previous: "Zurück",
		next: "Weiter",
		levelIndicator: "Lektion {current} von {total}",
		lessonLabel: "Lektion",

		// Sidebar
		menu: "Menü",
		closeMenu: "Menü schließen",
		progress: "Fortschritt",
		progressText: "{percent}% abgeschlossen ({completed}/{total})",
		lessons: "Lektionen",
		settings: "Einstellungen",
		showHints: "Hinweise anzeigen",
		resetAllProgress: "Fortschritt zurücksetzen",
		openSource: "Open Source:",
		by: "von",

		// Help dialog
		helpTitle: "Hilfe",
		aboutTitle: "Über Code Crispies",
		aboutText: "Code Crispies ist eine kostenlose Open-Source-Plattform zum Erlernen von Webentwicklung durch praktische Übungen. Kein Konto erforderlich - einfach loslegen!",
		learningModesTitle: "Lernmodi",
		modeCss: "<strong>CSS</strong> - Schreibe CSS-Regeln zum Stylen von Elementen",
		modeTailwind: "<strong>Tailwind</strong> - Wende Utility-Klassen direkt im HTML an",
		modeHtml: "<strong>HTML</strong> - Übe semantisches Markup und native Elemente",
		gettingStartedTitle: "Erste Schritte",
		gettingStartedText: "Öffne das Menü (☰), um Lektionsmodule zu durchsuchen. Jedes Modul behandelt ein Thema mit aufeinander aufbauenden Übungen.",
		completingLessonsTitle: "Lektionen abschließen",
		completingStep1: "Lies die Aufgabenstellung auf der linken Seite",
		completingStep2: "Schreibe deinen Code im Editor",
		completingStep3: "Beobachte die Live-Vorschau während du tippst",
		completingStep4: "Folge den Hinweisen, um Fehler zu beheben",
		completingStep5: "Klicke auf <strong>Weiter</strong>, wenn du fertig bist",
		editorToolsTitle: "Editor-Werkzeuge",
		editorToolUndo: "<strong>↶ Rückgängig</strong> / <strong>↷ Wiederholen</strong> - Bearbeitungsverlauf navigieren",
		editorToolReset: "<strong>⟲ Zurücksetzen</strong> - Ursprünglichen Code wiederherstellen",
		editorToolExpected: "<strong>Lösung einblenden</strong> - Zielergebnis ein-/ausblenden",
		keyboardShortcutsTitle: "Tastenkürzel",
		shortcutRun: "<kbd>Strg+Enter</kbd> - Sofort validieren",
		shortcutUndo: "<kbd>Strg+Z</kbd> - Rückgängig",
		shortcutRedo: "<kbd>Strg+Umschalt+Z</kbd> - Wiederholen",
		emmetTitle: "Emmet-Kürzel (HTML-Modus)",
		emmetText: "Tippe Abkürzungen und drücke <kbd>Tab</kbd> zum Erweitern:",
		emmetClass: "<kbd>div.box</kbd> → div mit Klasse",
		emmetChildren: "<kbd>ul>li*3</kbd> → ul mit 3 li-Kindern",
		emmetNested: "<kbd>form>input+button</kbd> → verschachtelte Struktur",
		emmetContent: "<kbd>p{Hallo}</kbd> → p mit Textinhalt",

		// More Projects
		moreProjectsTitle: "Weitere Projekte",
		htmlOverJsDesc: " - Lerne, native HTML-Elemente statt eigener JavaScript-Lösungen zu nutzen",
		mandalaDesc: " - Interaktive Visualisierung von JavaScript-Technologien nach Komplexität geordnet",

		// Contact
		contactTitle: "Kontakt & Links",
		contactText: "Code Crispies wird von <a href=\"https://librete.ch\" target=\"_blank\">LibreTECH</a> entwickelt",

		// Reset dialog
		resetDialogTitle: "Fortschritt zurücksetzen",
		resetDialogText: "Bist du sicher, dass du deinen gesamten Fortschritt zurücksetzen möchtest? Dies kann nicht rückgängig gemacht werden.",
		cancel: "Abbrechen",
		resetAll: "Alles zurücksetzen",

		// Dynamic content
		loadingFallbackText: "Lektion konnte nicht geladen werden. Bitte wähle eine aus dem Menü oder prüfe die Hilfe.",
		completed: "Erledigt",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Dein Code funktioniert.",
		keepTrying: "Weiter versuchen!",
		failedToLoad: "Module konnten nicht geladen werden. Bitte Seite neu laden.",
		tailwindPlaceholder: "Tailwind-Klassen eingeben (z.B. bg-blue-500 text-white p-4)",
		lessonFallback: "Lektion {index}",
		untitledLesson: "Unbenannte Lektion"
	}
};

let currentLang = "en";

/**
 * Detect initial language from localStorage or browser
 */
export function detectLanguage() {
	// Check localStorage first
	const stored = localStorage.getItem("codeCrispies.language");
	if (stored && translations[stored]) {
		return stored;
	}

	// Check browser language
	const browserLang = navigator.language.split("-")[0];
	if (translations[browserLang]) {
		return browserLang;
	}

	return "en";
}

/**
 * Get current language
 */
export function getLanguage() {
	return currentLang;
}

/**
 * Set language and persist to localStorage
 */
export function setLanguage(lang) {
	if (!translations[lang]) {
		console.warn(`Language "${lang}" not supported, falling back to English`);
		lang = "en";
	}
	currentLang = lang;
	localStorage.setItem("codeCrispies.language", lang);
	document.documentElement.lang = lang;
}

/**
 * Get a translation by key with optional interpolation
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for interpolation
 */
export function t(key, params = {}) {
	const text = translations[currentLang]?.[key] || translations.en[key] || key;

	if (Object.keys(params).length === 0) {
		return text;
	}

	// Replace {param} placeholders
	return text.replace(/\{(\w+)\}/g, (match, param) => {
		return params[param] !== undefined ? params[param] : match;
	});
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
export function applyTranslations() {
	// Update page title
	document.title = t("pageTitle");

	// Update elements with data-i18n attribute (text content)
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.dataset.i18n;
		el.textContent = t(key);
	});

	// Update elements with data-i18n-html attribute (innerHTML)
	document.querySelectorAll("[data-i18n-html]").forEach((el) => {
		const key = el.dataset.i18nHtml;
		el.innerHTML = t(key);
	});

	// Update elements with data-i18n-title attribute
	document.querySelectorAll("[data-i18n-title]").forEach((el) => {
		const key = el.dataset.i18nTitle;
		el.title = t(key);
	});

	// Update elements with data-i18n-aria-label attribute
	document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
		const key = el.dataset.i18nAriaLabel;
		el.setAttribute("aria-label", t(key));
	});

	// Update elements with data-i18n-placeholder attribute
	document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
		const key = el.dataset.i18nPlaceholder;
		el.placeholder = t(key);
	});
}

/**
 * Initialize i18n system
 */
export function initI18n() {
	const lang = detectLanguage();
	setLanguage(lang);
	applyTranslations();
}
