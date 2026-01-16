/**
 * Internationalization module for CODE CRISPIES
 */

const translations = {
	en: {
		// Page
		pageTitle: "CODE CRISPIES - Learn HTML & CSS Interactively",
		skipLink: "Skip to main content",

		// Header
		menuOpen: "Open menu",
		langSwitch: "EN",
		langSwitchLabel: "Switch language",
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
		back: "Back",
		levelIndicator: "Lesson {current} of {total}",
		lessonLabel: "Lesson",

		// Sidebar
		menu: "Menu",
		closeMenu: "Close menu",
		language: "Language",
		progress: "Progress",
		progressText: "{percent}% Complete ({completed}/{total})",
		progressTextMilestone: "{completed} of {total} lessons completed",
		progressTotal: "{total} lessons total",
		lessons: "Lessons",
		settings: "Settings",
		showHints: "Show Hints",
		resetAllProgress: "Reset All Progress",
		openSource: "Open Source:",
		by: "by",

		// Help dialog
		helpTitle: "Help",
		aboutTitle: "About CODE CRISPIES",
		aboutText:
			"CODE CRISPIES is a free, open-source platform for learning web development through hands-on exercises. No account required - just start coding!",
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
		contactText: 'CODE CRISPIES is developed by <a href="https://librete.ch" target="_blank">LibreTECH</a>',

		// Reset dialog
		resetDialogTitle: "Reset Progress",
		resetDialogText: "Are you sure you want to reset all your progress? This cannot be undone.",
		cancel: "Cancel",
		resetAll: "Reset All",

		// Reset code dialog
		resetCodeDialogTitle: "Reset Code",
		resetCodeDialogText: "Reset your code to the initial state for this lesson?",
		dontShowAgain: "Don't show this again",
		reset: "Reset",

		// Share dialog
		shareDialogTitle: "Share Lesson",
		shareDialogText: "Copy this URL to share the current lesson:",
		shareTitle: "Share lesson",
		copyUrl: "Copy",
		urlCopied: "URL copied to clipboard!",

		// Dynamic content
		loadingFallbackText: "Could not load lesson. Please select one from the menu or check the help.",
		completed: "Completed",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Your code works correctly.",
		keepTrying: "Keep trying!",
		failedToLoad: "Failed to load modules. Please refresh the page.",
		tailwindPlaceholder: "Enter Tailwind classes (e.g., bg-blue-500 text-white p-4)",
		lessonFallback: "Lesson {index}",
		untitledLesson: "Untitled Lesson",

		// Landing page
		landingHeroTitle: "Learn Web Development",
		landingHeroHighlight: "Code Crispy",
		landingHeroSubtitle: "Master HTML, CSS, and Tailwind through hands-on exercises with instant feedback. Free and open source.",
		landingCtaStart: "Start Learning NOW",
		landingWhyTitle: "Why CODE CRISPIES Works",
		landingBenefit1Title: "Learn by Doing",
		landingBenefit1Text: "Write real code from lesson one. No videos to watch—just you, an editor, and instant feedback on every keystroke.",
		landingBenefit2Title: "Practice at Your Pace",
		landingBenefit2Text: "Start with basics, fill gaps in your understanding, then accelerate. Pick up where you left off anytime.",
		landingBenefit3Title: "Master Real Skills",
		landingBenefit3Text: "Learn CSS, HTML, and Tailwind the way professionals use them—through hands-on exercises and reference guides.",
		landingBenefit4Title: "Free & Open Source",
		landingBenefit4Text: "No paywall, no tracking. Optional account for cloud sync across devices. The code is open for everyone.",
		landingPathsTitle: "Explore Learning Paths",
		landingCssDesc: "Styling, layout, and animations",
		landingHtmlDesc: "Semantic markup and native elements",
		landingTailwindDesc: "Utility-first CSS framework",
		comingSoon: "Coming Soon",
		landingCtaTitle: "Start Learning Today",
		landingCtaSub: "Free and open source. No account required. Progress saved locally.",
		landingCtaButton: "Let's get crispy!",

		// Coming Soon
		landingComingSoonTitle: "Coming Soon",
		comingSoonSyncTitle: "Cloud Sync",
		comingSoonSyncText: "Sync your progress across all devices. Start on desktop, continue on tablet.",
		comingSoonAchievementsTitle: "Achievements",
		comingSoonAchievementsText: "Earn badges as you master new skills. Track your learning milestones.",
		comingSoonJsTitle: "JavaScript",
		comingSoonJsText: "Interactive JavaScript lessons with live code execution and DOM manipulation.",
		comingSoonFrameworksTitle: "Frameworks",
		comingSoonFrameworksText: "React, Vue, and Svelte basics. Build real components step by step.",
		comingSoonChallengesTitle: "Code Challenges",
		comingSoonChallengesText: "Test your skills with timed puzzles. Compete on leaderboards and earn ranks.",

		// Newsletter
		newsletterText: "Want to know when new features launch?",
		newsletterPlaceholder: "your@email.com",
		newsletterButton: "Notify Me",
		newsletterThanks: "Thanks! We'll keep you posted.",
		newsletterDisclaimer: "Max once a week. Unsubscribe anytime via mail@codecrispi.es",

		// Device Notice
		deviceNotice: "<strong>Best on desktop or tablet (landscape).</strong> Mobile works, but larger screens make coding easier.",

		// Footer
		footerModules: "Modules",
		footerResources: "Resources",
		footerPlayground: "Playground",
		footerAbout: "About",
		footerSupport: "Support",
		footerSupportText: "Help keep CODE CRISPIES free and open source.",
		footerLicense: "Released into the public domain.",
		footerPrivacy: "Privacy Policy",
		footerImprint: "Imprint",

		// Privacy Policy
		privacyTitle: "Privacy Policy",
		privacyIntro: "CODE CRISPIES respects your privacy. This policy explains what data we collect and how we use it.",
		privacyLocalTitle: "Local Storage",
		privacyLocalText: "Your learning progress, code, and settings are stored locally in your browser. This data never leaves your device unless you create an account.",
		privacyAccountTitle: "Account Data (Optional)",
		privacyAccountText: "If you create an account, we store your email address and encrypted password to enable cloud sync. Your progress data is synced to our servers (Supabase) so you can access it across devices.",
		privacyNewsletterTitle: "Newsletter (Optional)",
		privacyNewsletterText: "If you subscribe to our newsletter, we store your email address to send updates about new features. You can unsubscribe anytime.",
		privacyNoTrackingTitle: "No Tracking",
		privacyNoTrackingText: "We do not use cookies for tracking, analytics, or advertising. We do not share your data with third parties.",
		privacyRightsTitle: "Your Rights (GDPR)",
		privacyRightsText: "You can delete your account and all associated data at any time from the sidebar menu. For questions or data requests, contact us at mail@codecrispi.es",
		privacyUpdated: "Last updated: January 2025",

		// Imprint
		imprintTitle: "Imprint",
		imprintResponsibleTitle: "Responsible for content",
		imprintContactTitle: "Contact",
		imprintDisclaimerTitle: "Disclaimer",
		imprintDisclaimerText: "CODE CRISPIES is provided \"as is\" without warranty. We are not liable for any damages arising from the use of this service. External links are provided for convenience; we are not responsible for their content.",

		// Help Dialog Support
		supportTitle: "Support the Project",
		supportText: "Help keep CODE CRISPIES free and open source.",

		// Auth
		authLogin: "Log In",
		authSignUp: "Sign Up",
		authLogout: "Log Out",
		authEmail: "Email",
		authPassword: "Password",
		authConfirmPassword: "Confirm Password",
		authNoAccount: "Don't have an account? Sign up",
		authHaveAccount: "Already have an account? Log in",
		authForgotPassword: "Forgot password?",
		authResetPassword: "Reset Password",
		authResetInstructions: "Enter your email to receive a password reset link.",
		authSendReset: "Send Reset Link",
		authResetSent: "Check your email for the reset link.",
		authOrContinueWith: "or continue with",
		authPasswordMismatch: "Passwords do not match",
		authSignupSuccess: "Account created! Check your email to confirm.",
		authAccount: "Account",
		authSyncHint: "Log in to sync progress across devices",
		authDeleteAccount: "Delete Account",
		authDeleteDialogTitle: "Delete Account",
		authDeleteDialogText: "Are you sure you want to delete your account? All your cloud progress will be permanently deleted. This cannot be undone.",
		authDeleteConfirm: "Delete Account"
	},

	de: {
		// Page
		pageTitle: "CODE CRISPIES - HTML & CSS interaktiv lernen",
		skipLink: "Zum Hauptinhalt springen",

		// Header
		menuOpen: "Menü öffnen",
		langSwitch: "DE",
		langSwitchLabel: "Sprache wechseln",
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
		back: "Zurück",
		levelIndicator: "Lektion {current} von {total}",
		lessonLabel: "Lektion",

		// Sidebar
		menu: "Menü",
		closeMenu: "Menü schließen",
		language: "Sprache",
		progress: "Fortschritt",
		progressText: "{percent}% abgeschlossen ({completed}/{total})",
		progressTextMilestone: "{completed} von {total} Lektionen abgeschlossen",
		progressTotal: "{total} Lektionen insgesamt",
		lessons: "Lektionen",
		settings: "Einstellungen",
		showHints: "Hinweise anzeigen",
		resetAllProgress: "Fortschritt zurücksetzen",
		openSource: "Open Source:",
		by: "von",

		// Help dialog
		helpTitle: "Hilfe",
		aboutTitle: "Über CODE CRISPIES",
		aboutText:
			"CODE CRISPIES ist eine kostenlose Open-Source-Plattform zum Erlernen von Webentwicklung durch praktische Übungen. Kein Konto erforderlich - einfach loslegen!",
		learningModesTitle: "Lernmodi",
		modeCss: "<strong>CSS</strong> - Schreibe CSS-Regeln zum Stylen von Elementen",
		modeTailwind: "<strong>Tailwind</strong> - Wende Utility-Klassen direkt im HTML an",
		modeHtml: "<strong>HTML</strong> - Übe semantisches Markup und native Elemente",
		gettingStartedTitle: "Erste Schritte",
		gettingStartedText:
			"Öffne das Menü (☰), um Lektionsmodule zu durchsuchen. Jedes Modul behandelt ein Thema mit aufeinander aufbauenden Übungen.",
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
		contactText: 'CODE CRISPIES wird von <a href="https://librete.ch" target="_blank">LibreTECH</a> entwickelt',

		// Reset dialog
		resetDialogTitle: "Fortschritt zurücksetzen",
		resetDialogText: "Bist du sicher, dass du deinen gesamten Fortschritt zurücksetzen möchtest? Dies kann nicht rückgängig gemacht werden.",
		cancel: "Abbrechen",
		resetAll: "Alles zurücksetzen",

		// Reset code dialog
		resetCodeDialogTitle: "Code zurücksetzen",
		resetCodeDialogText: "Code auf den Anfangszustand dieser Lektion zurücksetzen?",
		dontShowAgain: "Nicht mehr anzeigen",
		reset: "Zurücksetzen",

		// Share dialog
		shareDialogTitle: "Lektion teilen",
		shareDialogText: "Kopiere diese URL, um die aktuelle Lektion zu teilen:",
		shareTitle: "Lektion teilen",
		copyUrl: "Kopieren",
		urlCopied: "URL in die Zwischenablage kopiert!",

		// Dynamic content
		loadingFallbackText: "Lektion konnte nicht geladen werden. Bitte wähle eine aus dem Menü oder prüfe die Hilfe.",
		completed: "Erledigt",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Dein Code funktioniert.",
		keepTrying: "Weiter versuchen!",
		failedToLoad: "Module konnten nicht geladen werden. Bitte Seite neu laden.",
		tailwindPlaceholder: "Tailwind-Klassen eingeben (z.B. bg-blue-500 text-white p-4)",
		lessonFallback: "Lektion {index}",
		untitledLesson: "Unbenannte Lektion",

		// Landing page
		landingHeroTitle: "Lerne Web Entwicklung",
		landingHeroHighlight: "mit CODE CRISPIES",
		landingHeroSubtitle: "Meistere HTML, CSS und Tailwind durch praktische Übungen mit sofortigem Feedback. Kostenlos und Open Source.",
		landingCtaStart: "Jetzt starten",
		landingWhyTitle: "Warum CODE CRISPIES funktioniert",
		landingBenefit1Title: "Lernen durch Praxis",
		landingBenefit1Text:
			"Schreibe echten Code ab der ersten Lektion. Keine Videos – nur du, ein Editor und sofortiges Feedback bei jedem Tastendruck.",
		landingBenefit2Title: "In deinem Tempo",
		landingBenefit2Text:
			"Beginne mit den Grundlagen, fülle Wissenslücken und beschleunige dann. Mach jederzeit dort weiter, wo du aufgehört hast.",
		landingBenefit3Title: "Echte Fähigkeiten",
		landingBenefit3Text: "Lerne CSS, HTML und Tailwind so, wie Profis sie nutzen – durch praktische Übungen und Referenzanleitungen.",
		landingBenefit4Title: "Frei & Open Source",
		landingBenefit4Text: "Keine Paywall, kein Tracking. Optionales Konto für Cloud-Sync über Geräte hinweg. Der Code ist offen für alle.",
		landingPathsTitle: "Lernpfade entdecken",
		landingCssDesc: "Styling, Layout und Animationen",
		landingHtmlDesc: "Semantisches Markup und native Elemente",
		landingTailwindDesc: "Utility-first CSS-Framework",
		comingSoon: "Bald verfügbar",
		landingCtaTitle: "Jetzt gleich anfangen",
		landingCtaSub: "Kostenlos und Open Source. Kein Konto erforderlich. Fortschritt wird lokal gespeichert.",
		landingCtaButton: "Let's get crispy!",

		// Coming Soon
		landingComingSoonTitle: "Demnächst",
		comingSoonSyncTitle: "Cloud-Sync",
		comingSoonSyncText: "Synchronisiere deinen Fortschritt auf allen Geräten. Starte am Desktop, mach am Tablet weiter.",
		comingSoonAchievementsTitle: "Erfolge",
		comingSoonAchievementsText: "Verdiene Abzeichen beim Erlernen neuer Fähigkeiten. Verfolge deine Lernmeilensteine.",
		comingSoonJsTitle: "JavaScript",
		comingSoonJsText: "Interaktive JavaScript-Lektionen mit Live-Code-Ausführung und DOM-Manipulation.",
		comingSoonFrameworksTitle: "Frameworks",
		comingSoonFrameworksText: "React, Vue und Svelte Grundlagen. Baue echte Komponenten Schritt für Schritt.",
		comingSoonChallengesTitle: "Code-Herausforderungen",
		comingSoonChallengesText: "Teste deine Fähigkeiten mit zeitgesteuerten Rätseln. Kämpfe auf Bestenlisten und steige im Rang auf.",

		// Newsletter
		newsletterText: "Möchtest du erfahren, wenn neue Funktionen erscheinen?",
		newsletterPlaceholder: "deine@email.de",
		newsletterButton: "Benachrichtigen",
		newsletterThanks: "Danke! Wir halten dich auf dem Laufenden.",
		newsletterDisclaimer: "Max. einmal pro Woche. Jederzeit abmelden über mail@codecrispi.es",

		// Device Notice
		deviceNotice: "<strong>Am besten auf Desktop oder Tablet (Querformat).</strong> Mobil funktioniert, aber größere Bildschirme machen das Coden einfacher.",

		// Footer
		footerModules: "Module",
		footerResources: "Ressourcen",
		footerPlayground: "Playground",
		footerAbout: "Über uns",
		footerSupport: "Unterstützen",
		footerSupportText: "Hilf mit, CODE CRISPIES kostenlos und Open Source zu halten.",
		footerLicense: "Gemeinfrei (Public Domain).",
		footerPrivacy: "Datenschutz",
		footerImprint: "Impressum",
		privacyTitle: "Datenschutzerklärung",
		privacyIntro: "CODE CRISPIES respektiert deine Privatsphäre. Diese Richtlinie erklärt, welche Daten wir sammeln und wie wir sie verwenden.",
		privacyLocalTitle: "Lokale Speicherung",
		privacyLocalText: "Dein Lernfortschritt, Code und Einstellungen werden lokal in deinem Browser gespeichert. Diese Daten verlassen dein Gerät nicht, es sei denn, du erstellst ein Konto.",
		privacyAccountTitle: "Kontodaten (Optional)",
		privacyAccountText: "Wenn du ein Konto erstellst, speichern wir deine E-Mail-Adresse und dein verschlüsseltes Passwort für die Cloud-Synchronisierung.",
		privacyNewsletterTitle: "Newsletter (Optional)",
		privacyNewsletterText: "Wenn du unseren Newsletter abonnierst, speichern wir deine E-Mail-Adresse für Updates. Du kannst dich jederzeit abmelden.",
		privacyNoTrackingTitle: "Kein Tracking",
		privacyNoTrackingText: "Wir verwenden keine Cookies für Tracking, Analytik oder Werbung. Wir teilen deine Daten nicht mit Dritten.",
		privacyRightsTitle: "Deine Rechte (DSGVO)",
		privacyRightsText: "Du kannst dein Konto und alle zugehörigen Daten jederzeit über das Seitenmenü löschen. Bei Fragen: mail@codecrispi.es",
		privacyUpdated: "Zuletzt aktualisiert: Januar 2025",
		imprintTitle: "Impressum",
		imprintResponsibleTitle: "Verantwortlich für den Inhalt",
		imprintContactTitle: "Kontakt",
		imprintDisclaimerTitle: "Haftungsausschluss",
		imprintDisclaimerText: "CODE CRISPIES wird ohne Gewährleistung bereitgestellt. Wir haften nicht für Schäden, die durch die Nutzung entstehen.",

		// Help Dialog Support
		supportTitle: "Projekt unterstützen",
		supportText: "Hilf mit, CODE CRISPIES kostenlos und Open Source zu halten.",

		// Auth
		authLogin: "Anmelden",
		authSignUp: "Registrieren",
		authLogout: "Abmelden",
		authEmail: "E-Mail",
		authPassword: "Passwort",
		authConfirmPassword: "Passwort bestätigen",
		authNoAccount: "Noch kein Konto? Registrieren",
		authHaveAccount: "Bereits ein Konto? Anmelden",
		authForgotPassword: "Passwort vergessen?",
		authResetPassword: "Passwort zurücksetzen",
		authResetInstructions: "Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten.",
		authSendReset: "Link senden",
		authResetSent: "Prüfe deine E-Mails für den Reset-Link.",
		authOrContinueWith: "oder weiter mit",
		authPasswordMismatch: "Passwörter stimmen nicht überein",
		authSignupSuccess: "Konto erstellt! Überprüfe deine E-Mail zur Bestätigung.",
		authAccount: "Konto",
		authSyncHint: "Anmelden, um Fortschritt geräteübergreifend zu synchronisieren",
		authDeleteAccount: "Konto löschen",
		authDeleteDialogTitle: "Konto löschen",
		authDeleteDialogText: "Bist du sicher, dass du dein Konto löschen möchtest? Dein gesamter Cloud-Fortschritt wird dauerhaft gelöscht. Dies kann nicht rückgängig gemacht werden.",
		authDeleteConfirm: "Konto löschen"
	},

	// Polish
	pl: {
		// Page
		pageTitle: "CODE CRISPIES - Nauka HTML i CSS interaktywnie",
		skipLink: "Przejdź do głównej treści",

		// Header
		menuOpen: "Otwórz menu",
		langSwitch: "PL",
		langSwitchLabel: "Zmień język",
		help: "Pomoc",

		// Instructions
		loading: "Ładowanie...",
		selectLesson: "Wybierz lekcję, aby rozpocząć.",
		editorLabel: "Edytor CSS",
		undoTitle: "Cofnij (Ctrl+Z)",
		redoTitle: "Ponów (Ctrl+Shift+Z)",
		resetCodeTitle: "Przywróć kod początkowy",
		run: "Uruchom",
		rerun: "Uruchom ponownie",

		// Preview
		yourOutput: "Twój wynik",
		showExpected: "Pokaż oczekiwane",
		hideExpected: "Ukryj oczekiwane",
		previous: "Poprzednia",
		next: "Następna",
		back: "Wstecz",
		levelIndicator: "Lekcja {current} z {total}",
		lessonLabel: "Lekcja",

		// Sidebar
		menu: "Menu",
		closeMenu: "Zamknij menu",
		language: "Język",
		progress: "Postęp",
		progressText: "{percent}% ukończone ({completed}/{total})",
		progressTextMilestone: "{completed} z {total} lekcji ukończonych",
		progressTotal: "{total} lekcji łącznie",
		lessons: "Lekcje",
		settings: "Ustawienia",
		showHints: "Pokaż podpowiedzi",
		resetAllProgress: "Resetuj cały postęp",
		openSource: "Open Source:",
		by: "przez",

		// Help dialog
		helpTitle: "Pomoc",
		aboutTitle: "O CODE CRISPIES",
		aboutText:
			"CODE CRISPIES to darmowa platforma open-source do nauki tworzenia stron internetowych poprzez praktyczne ćwiczenia. Nie wymaga konta - po prostu zacznij kodować!",
		learningModesTitle: "Tryby nauki",
		modeCss: "<strong>CSS</strong> - Pisz reguły CSS do stylizowania elementów",
		modeTailwind: "<strong>Tailwind</strong> - Stosuj klasy utility bezpośrednio w HTML",
		modeHtml: "<strong>HTML</strong> - Ćwicz semantyczne znaczniki i natywne elementy",
		gettingStartedTitle: "Pierwsze kroki",
		gettingStartedText: "Otwórz menu (☰), aby przeglądać moduły lekcji. Każdy moduł obejmuje konkretny temat z progresywnymi ćwiczeniami.",
		completingLessonsTitle: "Ukończanie lekcji",
		completingStep1: "Przeczytaj instrukcje zadania po lewej stronie",
		completingStep2: "Napisz swój kod w edytorze",
		completingStep3: "Obserwuj podgląd na żywo podczas pisania",
		completingStep4: "Postępuj zgodnie z podpowiedziami, aby naprawić problemy",
		completingStep5: "Kliknij <strong>Następna</strong> po ukończeniu",
		editorToolsTitle: "Narzędzia edytora",
		editorToolUndo: "<strong>↶ Cofnij</strong> / <strong>↷ Ponów</strong> - Nawiguj historię edycji",
		editorToolReset: "<strong>⟲ Resetuj</strong> - Przywróć początkowy kod",
		editorToolExpected: "<strong>Pokaż oczekiwane</strong> - Przełącz nakładkę wyniku docelowego",
		keyboardShortcutsTitle: "Skróty klawiszowe",
		shortcutRun: "<kbd>Ctrl+Enter</kbd> - Natychmiastowa walidacja",
		shortcutUndo: "<kbd>Ctrl+Z</kbd> - Cofnij",
		shortcutRedo: "<kbd>Ctrl+Shift+Z</kbd> - Ponów",
		emmetTitle: "Skróty Emmet (tryb HTML)",
		emmetText: "Wpisz skróty i naciśnij <kbd>Tab</kbd>, aby rozwinąć:",
		emmetClass: "<kbd>div.box</kbd> → div z klasą",
		emmetChildren: "<kbd>ul>li*3</kbd> → ul z 3 elementami li",
		emmetNested: "<kbd>form>input+button</kbd> → zagnieżdżona struktura",
		emmetContent: "<kbd>p{Cześć}</kbd> → p z tekstem",

		// More Projects
		moreProjectsTitle: "Więcej projektów",
		htmlOverJsDesc: " - Naucz się wykorzystywać natywne elementy HTML zamiast niestandardowych rozwiązań JavaScript",
		mandalaDesc: " - Interaktywna wizualizacja technologii JavaScript uporządkowanych według złożoności",

		// Contact
		contactTitle: "Kontakt i linki",
		contactText: 'CODE CRISPIES jest rozwijany przez <a href="https://librete.ch" target="_blank">LibreTECH</a>',

		// Reset dialog
		resetDialogTitle: "Resetuj postęp",
		resetDialogText: "Czy na pewno chcesz zresetować cały postęp? Tej operacji nie można cofnąć.",
		cancel: "Anuluj",
		resetAll: "Resetuj wszystko",

		// Reset code dialog
		resetCodeDialogTitle: "Resetuj kod",
		resetCodeDialogText: "Przywrócić kod do stanu początkowego tej lekcji?",
		dontShowAgain: "Nie pokazuj ponownie",
		reset: "Resetuj",

		// Share dialog
		shareDialogTitle: "Udostępnij lekcję",
		shareDialogText: "Skopiuj ten URL, aby udostępnić bieżącą lekcję:",
		shareTitle: "Udostępnij lekcję",
		copyUrl: "Kopiuj",
		urlCopied: "URL skopiowany do schowka!",

		// Dynamic content
		loadingFallbackText: "Nie można załadować lekcji. Wybierz jedną z menu lub sprawdź pomoc.",
		completed: "Ukończono",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Twój kod działa poprawnie.",
		keepTrying: "Próbuj dalej!",
		failedToLoad: "Nie udało się załadować modułów. Odśwież stronę.",
		tailwindPlaceholder: "Wprowadź klasy Tailwind (np. bg-blue-500 text-white p-4)",
		lessonFallback: "Lekcja {index}",
		untitledLesson: "Lekcja bez tytułu",

		// Landing page
		landingHeroTitle: "Naucz się tworzenia stron",
		landingHeroHighlight: "Code Crispy",
		landingHeroSubtitle: "Opanuj HTML, CSS i Tailwind poprzez praktyczne ćwiczenia z natychmiastową informacją zwrotną. Darmowe i open source.",
		landingCtaStart: "Zacznij TERAZ",
		landingWhyTitle: "Dlaczego CODE CRISPIES działa",
		landingBenefit1Title: "Ucz się przez praktykę",
		landingBenefit1Text:
			"Pisz prawdziwy kod od pierwszej lekcji. Żadnych filmów – tylko ty, edytor i natychmiastowa informacja zwrotna przy każdym naciśnięciu klawisza.",
		landingBenefit2Title: "W swoim tempie",
		landingBenefit2Text: "Zacznij od podstaw, uzupełnij luki w wiedzy, a potem przyspiesz. Wróć w dowolnym momencie tam, gdzie skończyłeś.",
		landingBenefit3Title: "Prawdziwe umiejętności",
		landingBenefit3Text:
			"Naucz się CSS, HTML i Tailwind tak, jak używają ich profesjonaliści – poprzez praktyczne ćwiczenia i przewodniki referencyjne.",
		landingBenefit4Title: "Darmowe i Open Source",
		landingBenefit4Text: "Bez paywalla, bez śledzenia. Opcjonalne konto do synchronizacji w chmurze. Kod jest otwarty dla wszystkich.",
		landingPathsTitle: "Odkryj ścieżki nauki",
		landingCssDesc: "Stylowanie, układy i animacje",
		landingHtmlDesc: "Semantyczne znaczniki i natywne elementy",
		landingTailwindDesc: "Framework CSS oparty na klasach utility",
		comingSoon: "Wkrótce",
		landingCtaTitle: "Zacznij naukę już dziś",
		landingCtaSub: "Darmowe i open source. Bez konta. Postęp zapisywany lokalnie.",
		landingCtaButton: "Let's get crispy!",

		// Coming Soon
		landingComingSoonTitle: "Wkrótce",
		comingSoonSyncTitle: "Synchronizacja",
		comingSoonSyncText: "Synchronizuj postępy na wszystkich urządzeniach. Zacznij na komputerze, kontynuuj na tablecie.",
		comingSoonAchievementsTitle: "Osiągnięcia",
		comingSoonAchievementsText: "Zdobywaj odznaki, ucząc się nowych umiejętności. Śledź swoje postępy.",
		comingSoonJsTitle: "JavaScript",
		comingSoonJsText: "Interaktywne lekcje JavaScript z wykonywaniem kodu na żywo i manipulacją DOM.",
		comingSoonFrameworksTitle: "Frameworki",
		comingSoonFrameworksText: "Podstawy React, Vue i Svelte. Buduj prawdziwe komponenty krok po kroku.",
		comingSoonChallengesTitle: "Wyzwania kodowania",
		comingSoonChallengesText: "Sprawdź swoje umiejętności w zadaniach na czas. Rywalizuj na tablicach wyników i zdobywaj rangi.",

		// Newsletter
		newsletterText: "Chcesz wiedzieć, kiedy pojawią się nowe funkcje?",
		newsletterPlaceholder: "twoj@email.pl",
		newsletterButton: "Powiadom mnie",
		newsletterThanks: "Dzięki! Będziemy informować.",
		newsletterDisclaimer: "Maks. raz w tygodniu. Wypisz się w dowolnym momencie przez mail@codecrispi.es",

		// Device Notice
		deviceNotice: "<strong>Najlepiej na komputerze lub tablecie (poziomo).</strong> Na telefonie też działa, ale większy ekran ułatwia kodowanie.",

		// Footer
		footerModules: "Moduły",
		footerResources: "Zasoby",
		footerPlayground: "Plac zabaw",
		footerAbout: "O nas",
		footerSupport: "Wsparcie",
		footerSupportText: "Pomóż utrzymać CODE CRISPIES darmowym i open source.",
		footerLicense: "Udostępnione jako domena publiczna.",
		footerPrivacy: "Polityka prywatności",
		footerImprint: "Informacje prawne",
		privacyTitle: "Polityka prywatności",
		privacyIntro: "CODE CRISPIES szanuje Twoją prywatność. Ta polityka wyjaśnia, jakie dane zbieramy i jak je wykorzystujemy.",
		privacyLocalTitle: "Lokalne przechowywanie",
		privacyLocalText: "Twój postęp, kod i ustawienia są przechowywane lokalnie w przeglądarce. Dane te nie opuszczają urządzenia, chyba że utworzysz konto.",
		privacyAccountTitle: "Dane konta (opcjonalne)",
		privacyAccountText: "Jeśli utworzysz konto, przechowujemy Twój e-mail i zaszyfrowane hasło do synchronizacji w chmurze.",
		privacyNewsletterTitle: "Newsletter (opcjonalnie)",
		privacyNewsletterText: "Jeśli zapiszesz się do newslettera, przechowujemy Twój e-mail do wysyłania aktualizacji. Możesz się wypisać w dowolnym momencie.",
		privacyNoTrackingTitle: "Brak śledzenia",
		privacyNoTrackingText: "Nie używamy plików cookie do śledzenia, analityki ani reklam. Nie udostępniamy danych osobom trzecim.",
		privacyRightsTitle: "Twoje prawa (RODO)",
		privacyRightsText: "Możesz usunąć swoje konto i wszystkie powiązane dane w dowolnym momencie z menu bocznego. Pytania: mail@codecrispi.es",
		privacyUpdated: "Ostatnia aktualizacja: styczeń 2025",
		imprintTitle: "Informacje prawne",
		imprintResponsibleTitle: "Odpowiedzialny za treść",
		imprintContactTitle: "Kontakt",
		imprintDisclaimerTitle: "Zastrzeżenie",
		imprintDisclaimerText: "CODE CRISPIES jest dostarczany bez gwarancji. Nie ponosimy odpowiedzialności za szkody wynikające z korzystania z usługi.",

		// Help Dialog Support
		supportTitle: "Wesprzyj projekt",
		supportText: "Pomóż utrzymać CODE CRISPIES darmowym i open source.",

		// Auth
		authLogin: "Zaloguj się",
		authSignUp: "Zarejestruj się",
		authLogout: "Wyloguj się",
		authEmail: "E-mail",
		authPassword: "Hasło",
		authConfirmPassword: "Potwierdź hasło",
		authNoAccount: "Nie masz konta? Zarejestruj się",
		authHaveAccount: "Masz już konto? Zaloguj się",
		authForgotPassword: "Zapomniałeś hasła?",
		authResetPassword: "Resetuj hasło",
		authResetInstructions: "Podaj swój e-mail, aby otrzymać link do resetowania hasła.",
		authSendReset: "Wyślij link",
		authResetSent: "Sprawdź e-mail, aby znaleźć link do resetowania.",
		authOrContinueWith: "lub kontynuuj przez",
		authPasswordMismatch: "Hasła nie są zgodne",
		authSignupSuccess: "Konto utworzone! Sprawdź e-mail, aby potwierdzić.",
		authAccount: "Konto",
		authSyncHint: "Zaloguj się, aby synchronizować postępy między urządzeniami",
		authDeleteAccount: "Usuń konto",
		authDeleteDialogTitle: "Usuń konto",
		authDeleteDialogText: "Czy na pewno chcesz usunąć swoje konto? Cały postęp w chmurze zostanie trwale usunięty. Tej operacji nie można cofnąć.",
		authDeleteConfirm: "Usuń konto"
	},

	// Spanish
	es: {
		// Page
		pageTitle: "CODE CRISPIES - Aprende HTML y CSS de forma interactiva",
		skipLink: "Saltar al contenido principal",

		// Header
		menuOpen: "Abrir menú",
		langSwitch: "ES",
		langSwitchLabel: "Cambiar idioma",
		help: "Ayuda",

		// Instructions
		loading: "Cargando...",
		selectLesson: "Selecciona una lección para comenzar.",
		editorLabel: "Editor CSS",
		undoTitle: "Deshacer (Ctrl+Z)",
		redoTitle: "Rehacer (Ctrl+Shift+Z)",
		resetCodeTitle: "Restaurar código inicial",
		run: "Ejecutar",
		rerun: "Volver a ejecutar",

		// Preview
		yourOutput: "Tu resultado",
		showExpected: "Mostrar esperado",
		hideExpected: "Ocultar esperado",
		previous: "Anterior",
		next: "Siguiente",
		back: "Volver",
		levelIndicator: "Lección {current} de {total}",
		lessonLabel: "Lección",

		// Sidebar
		menu: "Menú",
		closeMenu: "Cerrar menú",
		language: "Idioma",
		progress: "Progreso",
		progressText: "{percent}% completado ({completed}/{total})",
		progressTextMilestone: "{completed} de {total} lecciones completadas",
		progressTotal: "{total} lecciones en total",
		lessons: "Lecciones",
		settings: "Configuración",
		showHints: "Mostrar pistas",
		resetAllProgress: "Reiniciar todo el progreso",
		openSource: "Código abierto:",
		by: "por",

		// Help dialog
		helpTitle: "Ayuda",
		aboutTitle: "Acerca de CODE CRISPIES",
		aboutText:
			"CODE CRISPIES es una plataforma gratuita de código abierto para aprender desarrollo web a través de ejercicios prácticos. No se requiere cuenta, ¡solo empieza a programar!",
		learningModesTitle: "Modos de aprendizaje",
		modeCss: "<strong>CSS</strong> - Escribe reglas CSS para estilizar elementos",
		modeTailwind: "<strong>Tailwind</strong> - Aplica clases de utilidad directamente en HTML",
		modeHtml: "<strong>HTML</strong> - Practica marcado semántico y elementos nativos",
		gettingStartedTitle: "Primeros pasos",
		gettingStartedText:
			"Abre el menú (☰) para explorar los módulos de lecciones. Cada módulo cubre un tema específico con ejercicios progresivos.",
		completingLessonsTitle: "Completar lecciones",
		completingStep1: "Lee las instrucciones de la tarea a la izquierda",
		completingStep2: "Escribe tu código en el editor",
		completingStep3: "Observa la vista previa en vivo mientras escribes",
		completingStep4: "Sigue las pistas para corregir problemas",
		completingStep5: "Haz clic en <strong>Siguiente</strong> cuando termines",
		editorToolsTitle: "Herramientas del editor",
		editorToolUndo: "<strong>↶ Deshacer</strong> / <strong>↷ Rehacer</strong> - Navegar historial de edición",
		editorToolReset: "<strong>⟲ Reiniciar</strong> - Restaurar código inicial",
		editorToolExpected: "<strong>Mostrar esperado</strong> - Alternar superposición del resultado objetivo",
		keyboardShortcutsTitle: "Atajos de teclado",
		shortcutRun: "<kbd>Ctrl+Enter</kbd> - Validar inmediatamente",
		shortcutUndo: "<kbd>Ctrl+Z</kbd> - Deshacer",
		shortcutRedo: "<kbd>Ctrl+Shift+Z</kbd> - Rehacer",
		emmetTitle: "Atajos Emmet (modo HTML)",
		emmetText: "Escribe abreviaturas y presiona <kbd>Tab</kbd> para expandir:",
		emmetClass: "<kbd>div.box</kbd> → div con clase",
		emmetChildren: "<kbd>ul>li*3</kbd> → ul con 3 hijos li",
		emmetNested: "<kbd>form>input+button</kbd> → estructura anidada",
		emmetContent: "<kbd>p{Hola}</kbd> → p con contenido de texto",

		// More Projects
		moreProjectsTitle: "Más proyectos",
		htmlOverJsDesc: " - Aprende a aprovechar elementos HTML nativos en lugar de soluciones JavaScript personalizadas",
		mandalaDesc: " - Visualización interactiva de tecnologías JavaScript organizadas por complejidad",

		// Contact
		contactTitle: "Contacto y enlaces",
		contactText: 'CODE CRISPIES es desarrollado por <a href="https://librete.ch" target="_blank">LibreTECH</a>',

		// Reset dialog
		resetDialogTitle: "Reiniciar progreso",
		resetDialogText: "¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.",
		cancel: "Cancelar",
		resetAll: "Reiniciar todo",

		// Reset code dialog
		resetCodeDialogTitle: "Reiniciar código",
		resetCodeDialogText: "¿Restaurar el código al estado inicial de esta lección?",
		dontShowAgain: "No mostrar de nuevo",
		reset: "Reiniciar",

		// Share dialog
		shareDialogTitle: "Compartir lección",
		shareDialogText: "Copia esta URL para compartir la lección actual:",
		shareTitle: "Compartir lección",
		copyUrl: "Copiar",
		urlCopied: "¡URL copiada al portapapeles!",

		// Dynamic content
		loadingFallbackText: "No se pudo cargar la lección. Selecciona una del menú o consulta la ayuda.",
		completed: "Completado",
		successMessage: "¡CRISPY! ٩(◕‿◕)۶ Tu código funciona correctamente.",
		keepTrying: "¡Sigue intentando!",
		failedToLoad: "No se pudieron cargar los módulos. Actualiza la página.",
		tailwindPlaceholder: "Ingresa clases de Tailwind (ej. bg-blue-500 text-white p-4)",
		lessonFallback: "Lección {index}",
		untitledLesson: "Lección sin título",

		// Landing page
		landingHeroTitle: "Aprende desarrollo web",
		landingHeroHighlight: "Code Crispy",
		landingHeroSubtitle:
			"Domina HTML, CSS y Tailwind a través de ejercicios prácticos con retroalimentación instantánea. Gratis y de código abierto.",
		landingCtaStart: "Empieza AHORA",
		landingWhyTitle: "Por qué funciona CODE CRISPIES",
		landingBenefit1Title: "Aprende haciendo",
		landingBenefit1Text:
			"Escribe código real desde la primera lección. Sin videos que ver—solo tú, un editor y retroalimentación instantánea en cada tecla.",
		landingBenefit2Title: "A tu propio ritmo",
		landingBenefit2Text:
			"Comienza con lo básico, llena los vacíos en tu comprensión y luego acelera. Retoma donde lo dejaste en cualquier momento.",
		landingBenefit3Title: "Habilidades reales",
		landingBenefit3Text: "Aprende CSS, HTML y Tailwind como los usan los profesionales—a través de ejercicios prácticos y guías de referencia.",
		landingBenefit4Title: "Gratis y Open Source",
		landingBenefit4Text: "Sin paywall, sin rastreo. Cuenta opcional para sincronización en la nube. El código está abierto para todos.",
		landingPathsTitle: "Explora rutas de aprendizaje",
		landingCssDesc: "Estilos, diseño y animaciones",
		landingHtmlDesc: "Marcado semántico y elementos nativos",
		landingTailwindDesc: "Framework CSS basado en utilidades",
		comingSoon: "Próximamente",
		landingCtaTitle: "Empieza a aprender hoy",
		landingCtaSub: "Gratis y de código abierto. Sin cuenta requerida. Progreso guardado localmente.",
		landingCtaButton: "Let's get crispy!",

		// Coming Soon
		landingComingSoonTitle: "Próximamente",
		comingSoonSyncTitle: "Sincronización",
		comingSoonSyncText: "Sincroniza tu progreso en todos tus dispositivos. Empieza en el escritorio, continúa en la tablet.",
		comingSoonAchievementsTitle: "Logros",
		comingSoonAchievementsText: "Gana insignias mientras dominas nuevas habilidades. Sigue tus hitos de aprendizaje.",
		comingSoonJsTitle: "JavaScript",
		comingSoonJsText: "Lecciones interactivas de JavaScript con ejecución de código en vivo y manipulación del DOM.",
		comingSoonFrameworksTitle: "Frameworks",
		comingSoonFrameworksText: "Fundamentos de React, Vue y Svelte. Construye componentes reales paso a paso.",
		comingSoonChallengesTitle: "Desafíos de código",
		comingSoonChallengesText: "Pon a prueba tus habilidades con puzzles cronometrados. Compite en clasificaciones y gana rangos.",

		// Newsletter
		newsletterText: "¿Quieres saber cuando se lancen nuevas funciones?",
		newsletterPlaceholder: "tu@email.com",
		newsletterButton: "Notificarme",
		newsletterThanks: "¡Gracias! Te mantendremos informado.",
		newsletterDisclaimer: "Máximo una vez por semana. Cancela cuando quieras vía mail@codecrispi.es",

		// Device Notice
		deviceNotice: "<strong>Mejor en escritorio o tablet (horizontal).</strong> Funciona en móvil, pero pantallas más grandes facilitan la programación.",

		// Footer
		footerModules: "Módulos",
		footerResources: "Recursos",
		footerPlayground: "Zona de pruebas",
		footerAbout: "Acerca de",
		footerSupport: "Apoyar",
		footerSupportText: "Ayuda a mantener CODE CRISPIES gratis y de código abierto.",
		footerLicense: "Liberado al dominio público.",
		footerPrivacy: "Política de privacidad",
		footerImprint: "Aviso legal",
		privacyTitle: "Política de privacidad",
		privacyIntro: "CODE CRISPIES respeta tu privacidad. Esta política explica qué datos recopilamos y cómo los usamos.",
		privacyLocalTitle: "Almacenamiento local",
		privacyLocalText: "Tu progreso, código y configuración se almacenan localmente en tu navegador. Estos datos no salen de tu dispositivo a menos que crees una cuenta.",
		privacyAccountTitle: "Datos de cuenta (opcional)",
		privacyAccountText: "Si creas una cuenta, almacenamos tu email y contraseña encriptada para la sincronización en la nube.",
		privacyNewsletterTitle: "Newsletter (opcional)",
		privacyNewsletterText: "Si te suscribes al newsletter, almacenamos tu email para enviar actualizaciones. Puedes cancelar en cualquier momento.",
		privacyNoTrackingTitle: "Sin rastreo",
		privacyNoTrackingText: "No usamos cookies para rastreo, analíticas o publicidad. No compartimos tus datos con terceros.",
		privacyRightsTitle: "Tus derechos (RGPD)",
		privacyRightsText: "Puedes eliminar tu cuenta y todos los datos asociados en cualquier momento desde el menú lateral. Contacto: mail@codecrispi.es",
		privacyUpdated: "Última actualización: enero 2025",
		imprintTitle: "Aviso legal",
		imprintResponsibleTitle: "Responsable del contenido",
		imprintContactTitle: "Contacto",
		imprintDisclaimerTitle: "Descargo de responsabilidad",
		imprintDisclaimerText: "CODE CRISPIES se proporciona sin garantía. No somos responsables de daños derivados del uso de este servicio.",

		// Help Dialog Support
		supportTitle: "Apoyar el proyecto",
		supportText: "Ayuda a mantener CODE CRISPIES gratis y de código abierto.",

		// Auth
		authLogin: "Iniciar sesión",
		authSignUp: "Registrarse",
		authLogout: "Cerrar sesión",
		authEmail: "Correo electrónico",
		authPassword: "Contraseña",
		authConfirmPassword: "Confirmar contraseña",
		authNoAccount: "¿No tienes cuenta? Regístrate",
		authHaveAccount: "¿Ya tienes cuenta? Inicia sesión",
		authForgotPassword: "¿Olvidaste tu contraseña?",
		authResetPassword: "Restablecer contraseña",
		authResetInstructions: "Ingresa tu correo para recibir un enlace de restablecimiento.",
		authSendReset: "Enviar enlace",
		authResetSent: "Revisa tu correo para el enlace de restablecimiento.",
		authOrContinueWith: "o continúa con",
		authPasswordMismatch: "Las contraseñas no coinciden",
		authSignupSuccess: "¡Cuenta creada! Revisa tu correo para confirmar.",
		authAccount: "Cuenta",
		authSyncHint: "Inicia sesión para sincronizar tu progreso entre dispositivos",
		authDeleteAccount: "Eliminar cuenta",
		authDeleteDialogTitle: "Eliminar cuenta",
		authDeleteDialogText: "¿Estás seguro de que quieres eliminar tu cuenta? Todo tu progreso en la nube se eliminará permanentemente. Esta acción no se puede deshacer.",
		authDeleteConfirm: "Eliminar cuenta"
	},

	// Arabic
	ar: {
		// Page
		pageTitle: "CODE CRISPIES - تعلم HTML و CSS بشكل تفاعلي",
		skipLink: "انتقل إلى المحتوى الرئيسي",

		// Header
		menuOpen: "افتح القائمة",
		langSwitch: "AR",
		langSwitchLabel: "تغيير اللغة",
		help: "مساعدة",

		// Instructions
		loading: "جاري التحميل...",
		selectLesson: "اختر درسًا للبدء.",
		editorLabel: "محرر CSS",
		undoTitle: "تراجع (Ctrl+Z)",
		redoTitle: "إعادة (Ctrl+Shift+Z)",
		resetCodeTitle: "استعادة الكود الأولي",
		run: "تشغيل",
		rerun: "إعادة التشغيل",

		// Preview
		yourOutput: "نتيجتك",
		showExpected: "إظهار المتوقع",
		hideExpected: "إخفاء المتوقع",
		previous: "السابق",
		next: "التالي",
		back: "رجوع",
		levelIndicator: "الدرس {current} من {total}",
		lessonLabel: "درس",

		// Sidebar
		menu: "القائمة",
		closeMenu: "إغلاق القائمة",
		language: "اللغة",
		progress: "التقدم",
		progressText: "{percent}% مكتمل ({completed}/{total})",
		progressTextMilestone: "{completed} من {total} درس مكتمل",
		progressTotal: "{total} درس إجمالي",
		lessons: "الدروس",
		settings: "الإعدادات",
		showHints: "إظهار التلميحات",
		resetAllProgress: "إعادة تعيين كل التقدم",
		openSource: "مفتوح المصدر:",
		by: "بواسطة",

		// Help dialog
		helpTitle: "مساعدة",
		aboutTitle: "عن CODE CRISPIES",
		aboutText: "CODE CRISPIES هي منصة مجانية مفتوحة المصدر لتعلم تطوير الويب من خلال تمارين عملية. لا يلزم حساب - فقط ابدأ البرمجة!",
		learningModesTitle: "أوضاع التعلم",
		modeCss: "<strong>CSS</strong> - اكتب قواعد CSS لتنسيق العناصر",
		modeTailwind: "<strong>Tailwind</strong> - طبق فئات الأدوات مباشرة في HTML",
		modeHtml: "<strong>HTML</strong> - تدرب على الترميز الدلالي والعناصر الأصلية",
		gettingStartedTitle: "البداية",
		gettingStartedText: "افتح القائمة (☰) لتصفح وحدات الدروس. كل وحدة تغطي موضوعًا محددًا مع تمارين تدريجية.",
		completingLessonsTitle: "إكمال الدروس",
		completingStep1: "اقرأ تعليمات المهمة على اليسار",
		completingStep2: "اكتب الكود في المحرر",
		completingStep3: "شاهد المعاينة المباشرة أثناء الكتابة",
		completingStep4: "اتبع التلميحات لإصلاح أي مشاكل",
		completingStep5: "انقر على <strong>التالي</strong> عند الانتهاء",
		editorToolsTitle: "أدوات المحرر",
		editorToolUndo: "<strong>↶ تراجع</strong> / <strong>↷ إعادة</strong> - التنقل في سجل التحرير",
		editorToolReset: "<strong>⟲ إعادة تعيين</strong> - استعادة الكود الأولي",
		editorToolExpected: "<strong>إظهار المتوقع</strong> - تبديل طبقة النتيجة المستهدفة",
		keyboardShortcutsTitle: "اختصارات لوحة المفاتيح",
		shortcutRun: "<kbd>Ctrl+Enter</kbd> - التحقق فورًا",
		shortcutUndo: "<kbd>Ctrl+Z</kbd> - تراجع",
		shortcutRedo: "<kbd>Ctrl+Shift+Z</kbd> - إعادة",
		emmetTitle: "اختصارات Emmet (وضع HTML)",
		emmetText: "اكتب الاختصارات واضغط <kbd>Tab</kbd> للتوسيع:",
		emmetClass: "<kbd>div.box</kbd> ← div مع فئة",
		emmetChildren: "<kbd>ul>li*3</kbd> ← ul مع 3 عناصر li",
		emmetNested: "<kbd>form>input+button</kbd> ← هيكل متداخل",
		emmetContent: "<kbd>p{مرحبا}</kbd> ← p مع محتوى نصي",

		// More Projects
		moreProjectsTitle: "مشاريع أخرى",
		htmlOverJsDesc: " - تعلم استخدام عناصر HTML الأصلية بدلاً من حلول JavaScript المخصصة",
		mandalaDesc: " - تصور تفاعلي لتقنيات JavaScript مرتبة حسب التعقيد",

		// Contact
		contactTitle: "التواصل والروابط",
		contactText: 'CODE CRISPIES تم تطويره بواسطة <a href="https://librete.ch" target="_blank">LibreTECH</a>',

		// Reset dialog
		resetDialogTitle: "إعادة تعيين التقدم",
		resetDialogText: "هل أنت متأكد أنك تريد إعادة تعيين كل تقدمك؟ لا يمكن التراجع عن هذا الإجراء.",
		cancel: "إلغاء",
		resetAll: "إعادة تعيين الكل",

		// Reset code dialog
		resetCodeDialogTitle: "إعادة تعيين الكود",
		resetCodeDialogText: "استعادة الكود إلى الحالة الأولية لهذا الدرس؟",
		dontShowAgain: "لا تظهر هذا مرة أخرى",
		reset: "إعادة تعيين",

		// Share dialog
		shareDialogTitle: "مشاركة الدرس",
		shareDialogText: "انسخ هذا الرابط لمشاركة الدرس الحالي:",
		shareTitle: "مشاركة الدرس",
		copyUrl: "نسخ",
		urlCopied: "تم نسخ الرابط إلى الحافظة!",

		// Dynamic content
		loadingFallbackText: "تعذر تحميل الدرس. اختر واحدًا من القائمة أو تحقق من المساعدة.",
		completed: "مكتمل",
		successMessage: "CRISPY! ٩(◕‿◕)۶ الكود يعمل بشكل صحيح.",
		keepTrying: "استمر في المحاولة!",
		failedToLoad: "فشل تحميل الوحدات. قم بتحديث الصفحة.",
		tailwindPlaceholder: "أدخل فئات Tailwind (مثل bg-blue-500 text-white p-4)",
		lessonFallback: "درس {index}",
		untitledLesson: "درس بدون عنوان",

		// Landing page
		landingHeroTitle: "تعلم تطوير الويب",
		landingHeroHighlight: "Code Crispy",
		landingHeroSubtitle: "أتقن HTML و CSS و Tailwind من خلال تمارين عملية مع ملاحظات فورية. مجاني ومفتوح المصدر.",
		landingCtaStart: "ابدأ الآن",
		landingWhyTitle: "لماذا CODE CRISPIES فعال",
		landingBenefit1Title: "تعلم بالممارسة",
		landingBenefit1Text: "اكتب كودًا حقيقيًا من الدرس الأول. لا فيديوهات للمشاهدة—فقط أنت ومحرر وملاحظات فورية مع كل ضغطة مفتاح.",
		landingBenefit2Title: "بسرعتك الخاصة",
		landingBenefit2Text: "ابدأ بالأساسيات، املأ الفجوات في فهمك، ثم تسارع. استأنف من حيث توقفت في أي وقت.",
		landingBenefit3Title: "مهارات حقيقية",
		landingBenefit3Text: "تعلم CSS و HTML و Tailwind بالطريقة التي يستخدمها المحترفون—من خلال تمارين عملية وأدلة مرجعية.",
		landingBenefit4Title: "مجاني ومفتوح المصدر",
		landingBenefit4Text: "بدون حواجز دفع، بدون تتبع. حساب اختياري للمزامنة السحابية. الكود مفتوح للجميع.",
		landingPathsTitle: "استكشف مسارات التعلم",
		landingCssDesc: "التنسيق والتخطيط والرسوم المتحركة",
		landingHtmlDesc: "الترميز الدلالي والعناصر الأصلية",
		landingTailwindDesc: "إطار CSS قائم على الأدوات",
		comingSoon: "قريباً",
		landingCtaTitle: "ابدأ التعلم اليوم",
		landingCtaSub: "مجاني ومفتوح المصدر. لا حاجة لحساب. يُحفظ التقدم محليًا.",
		landingCtaButton: "Let's get crispy!",

		// Coming Soon
		landingComingSoonTitle: "قريباً",
		comingSoonSyncTitle: "مزامنة سحابية",
		comingSoonSyncText: "زامن تقدمك عبر جميع أجهزتك. ابدأ على الكمبيوتر، تابع على الجهاز اللوحي.",
		comingSoonAchievementsTitle: "الإنجازات",
		comingSoonAchievementsText: "احصل على شارات أثناء إتقانك لمهارات جديدة. تتبع معالم تعلمك.",
		comingSoonJsTitle: "جافاسكريبت",
		comingSoonJsText: "دروس تفاعلية في JavaScript مع تنفيذ مباشر للكود والتعامل مع DOM.",
		comingSoonFrameworksTitle: "أطر العمل",
		comingSoonFrameworksText: "أساسيات React وVue وSvelte. ابنِ مكونات حقيقية خطوة بخطوة.",
		comingSoonChallengesTitle: "تحديات البرمجة",
		comingSoonChallengesText: "اختبر مهاراتك مع ألغاز موقوتة. تنافس على لوحات المتصدرين واكسب الرتب.",

		// Newsletter
		newsletterText: "هل تريد معرفة متى تُطلق ميزات جديدة؟",
		newsletterPlaceholder: "بريدك@email.com",
		newsletterButton: "أبلغني",
		newsletterThanks: "شكراً! سنبقيك على اطلاع.",
		newsletterDisclaimer: "مرة واحدة أسبوعياً كحد أقصى. إلغاء الاشتراك في أي وقت عبر mail@codecrispi.es",

		// Device Notice
		deviceNotice: "<strong>أفضل على الكمبيوتر أو الجهاز اللوحي (أفقي).</strong> يعمل على الجوال، لكن الشاشات الأكبر تسهّل البرمجة.",

		// Footer
		footerModules: "الوحدات",
		footerResources: "الموارد",
		footerPlayground: "ساحة التجربة",
		footerAbout: "حول",
		footerSupport: "الدعم",
		footerSupportText: "ساعد في إبقاء CODE CRISPIES مجانيًا ومفتوح المصدر.",
		footerLicense: "مُطلق للملكية العامة.",
		footerPrivacy: "سياسة الخصوصية",
		footerImprint: "البيانات القانونية",
		privacyTitle: "سياسة الخصوصية",
		privacyIntro: "CODE CRISPIES يحترم خصوصيتك. توضح هذه السياسة البيانات التي نجمعها وكيف نستخدمها.",
		privacyLocalTitle: "التخزين المحلي",
		privacyLocalText: "يتم تخزين تقدمك وكودك وإعداداتك محليًا في متصفحك. لا تغادر هذه البيانات جهازك إلا إذا أنشأت حسابًا.",
		privacyAccountTitle: "بيانات الحساب (اختياري)",
		privacyAccountText: "إذا أنشأت حسابًا، نخزن بريدك الإلكتروني وكلمة مرورك المشفرة للمزامنة السحابية.",
		privacyNewsletterTitle: "النشرة الإخبارية (اختياري)",
		privacyNewsletterText: "إذا اشتركت في نشرتنا الإخبارية، نخزن بريدك الإلكتروني لإرسال التحديثات. يمكنك إلغاء الاشتراك في أي وقت.",
		privacyNoTrackingTitle: "بدون تتبع",
		privacyNoTrackingText: "لا نستخدم ملفات تعريف الارتباط للتتبع أو التحليلات أو الإعلانات. لا نشارك بياناتك مع أطراف ثالثة.",
		privacyRightsTitle: "حقوقك (GDPR)",
		privacyRightsText: "يمكنك حذف حسابك وجميع البيانات المرتبطة في أي وقت من القائمة الجانبية. للاستفسارات: mail@codecrispi.es",
		privacyUpdated: "آخر تحديث: يناير 2025",
		imprintTitle: "البيانات القانونية",
		imprintResponsibleTitle: "المسؤول عن المحتوى",
		imprintContactTitle: "التواصل",
		imprintDisclaimerTitle: "إخلاء المسؤولية",
		imprintDisclaimerText: "يتم تقديم CODE CRISPIES دون ضمان. نحن غير مسؤولين عن أي أضرار ناتجة عن استخدام هذه الخدمة.",

		// Help Dialog Support
		supportTitle: "ادعم المشروع",
		supportText: "ساعد في إبقاء CODE CRISPIES مجانيًا ومفتوح المصدر.",

		// Auth
		authLogin: "تسجيل الدخول",
		authSignUp: "إنشاء حساب",
		authLogout: "تسجيل الخروج",
		authEmail: "البريد الإلكتروني",
		authPassword: "كلمة المرور",
		authConfirmPassword: "تأكيد كلمة المرور",
		authNoAccount: "ليس لديك حساب؟ سجّل الآن",
		authHaveAccount: "لديك حساب بالفعل؟ سجّل الدخول",
		authForgotPassword: "نسيت كلمة المرور؟",
		authResetPassword: "إعادة تعيين كلمة المرور",
		authResetInstructions: "أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين.",
		authSendReset: "إرسال الرابط",
		authResetSent: "تحقق من بريدك الإلكتروني للحصول على رابط إعادة التعيين.",
		authOrContinueWith: "أو تابع باستخدام",
		authPasswordMismatch: "كلمات المرور غير متطابقة",
		authSignupSuccess: "تم إنشاء الحساب! تحقق من بريدك الإلكتروني للتأكيد.",
		authAccount: "الحساب",
		authSyncHint: "سجّل الدخول لمزامنة التقدم عبر الأجهزة",
		authDeleteAccount: "حذف الحساب",
		authDeleteDialogTitle: "حذف الحساب",
		authDeleteDialogText: "هل أنت متأكد أنك تريد حذف حسابك؟ سيتم حذف جميع تقدمك في السحابة نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
		authDeleteConfirm: "حذف الحساب"
	},

	// Ukrainian
	uk: {
		// Page
		pageTitle: "CODE CRISPIES - Вивчай HTML та CSS інтерактивно",
		skipLink: "Перейти до основного вмісту",

		// Header
		menuOpen: "Відкрити меню",
		langSwitch: "UK",
		langSwitchLabel: "Змінити мову",
		help: "Допомога",

		// Instructions
		loading: "Завантаження...",
		selectLesson: "Оберіть урок, щоб почати.",
		editorLabel: "Редактор CSS",
		undoTitle: "Скасувати (Ctrl+Z)",
		redoTitle: "Повторити (Ctrl+Shift+Z)",
		resetCodeTitle: "Відновити початковий код",
		run: "Запустити",
		rerun: "Запустити знову",

		// Preview
		yourOutput: "Ваш результат",
		showExpected: "Показати очікуване",
		hideExpected: "Сховати очікуване",
		previous: "Попередній",
		next: "Наступний",
		back: "Назад",
		levelIndicator: "Урок {current} з {total}",
		lessonLabel: "Урок",

		// Sidebar
		menu: "Меню",
		closeMenu: "Закрити меню",
		language: "Мова",
		progress: "Прогрес",
		progressText: "{percent}% завершено ({completed}/{total})",
		progressTextMilestone: "{completed} з {total} уроків завершено",
		progressTotal: "{total} уроків всього",
		lessons: "Уроки",
		settings: "Налаштування",
		showHints: "Показувати підказки",
		resetAllProgress: "Скинути весь прогрес",
		openSource: "Відкритий код:",
		by: "від",

		// Help dialog
		helpTitle: "Допомога",
		aboutTitle: "Про CODE CRISPIES",
		aboutText:
			"CODE CRISPIES — це безкоштовна платформа з відкритим кодом для вивчення веб-розробки через практичні вправи. Обліковий запис не потрібен — просто починайте кодувати!",
		learningModesTitle: "Режими навчання",
		modeCss: "<strong>CSS</strong> - Пишіть правила CSS для стилізації елементів",
		modeTailwind: "<strong>Tailwind</strong> - Застосовуйте утилітарні класи безпосередньо в HTML",
		modeHtml: "<strong>HTML</strong> - Практикуйте семантичну розмітку та нативні елементи",
		gettingStartedTitle: "Початок роботи",
		gettingStartedText: "Відкрийте меню (☰), щоб переглянути модулі уроків. Кожен модуль охоплює конкретну тему з прогресивними вправами.",
		completingLessonsTitle: "Завершення уроків",
		completingStep1: "Прочитайте інструкції завдання зліва",
		completingStep2: "Напишіть свій код у редакторі",
		completingStep3: "Спостерігайте за попереднім переглядом під час введення",
		completingStep4: "Слідуйте підказкам, щоб виправити проблеми",
		completingStep5: "Натисніть <strong>Наступний</strong> після завершення",
		editorToolsTitle: "Інструменти редактора",
		editorToolUndo: "<strong>↶ Скасувати</strong> / <strong>↷ Повторити</strong> - Навігація історією редагування",
		editorToolReset: "<strong>⟲ Скинути</strong> - Відновити початковий код",
		editorToolExpected: "<strong>Показати очікуване</strong> - Перемкнути накладення цільового результату",
		keyboardShortcutsTitle: "Гарячі клавіші",
		shortcutRun: "<kbd>Ctrl+Enter</kbd> - Негайна перевірка",
		shortcutUndo: "<kbd>Ctrl+Z</kbd> - Скасувати",
		shortcutRedo: "<kbd>Ctrl+Shift+Z</kbd> - Повторити",
		emmetTitle: "Скорочення Emmet (режим HTML)",
		emmetText: "Введіть скорочення та натисніть <kbd>Tab</kbd> для розгортання:",
		emmetClass: "<kbd>div.box</kbd> → div з класом",
		emmetChildren: "<kbd>ul>li*3</kbd> → ul з 3 дочірніми li",
		emmetNested: "<kbd>form>input+button</kbd> → вкладена структура",
		emmetContent: "<kbd>p{Привіт}</kbd> → p з текстовим вмістом",

		// More Projects
		moreProjectsTitle: "Більше проектів",
		htmlOverJsDesc: " - Навчіться використовувати нативні HTML-елементи замість власних JavaScript-рішень",
		mandalaDesc: " - Інтерактивна візуалізація JavaScript-технологій, впорядкованих за складністю",

		// Contact
		contactTitle: "Контакти та посилання",
		contactText: 'CODE CRISPIES розроблено <a href="https://librete.ch" target="_blank">LibreTECH</a>',

		// Reset dialog
		resetDialogTitle: "Скинути прогрес",
		resetDialogText: "Ви впевнені, що хочете скинути весь свій прогрес? Цю дію неможливо скасувати.",
		cancel: "Скасувати",
		resetAll: "Скинути все",

		// Reset code dialog
		resetCodeDialogTitle: "Скинути код",
		resetCodeDialogText: "Відновити код до початкового стану цього уроку?",
		dontShowAgain: "Більше не показувати",
		reset: "Скинути",

		// Share dialog
		shareDialogTitle: "Поділитися уроком",
		shareDialogText: "Скопіюйте цю URL-адресу, щоб поділитися поточним уроком:",
		shareTitle: "Поділитися уроком",
		copyUrl: "Копіювати",
		urlCopied: "URL-адресу скопійовано до буфера обміну!",

		// Dynamic content
		loadingFallbackText: "Не вдалося завантажити урок. Виберіть один з меню або перевірте допомогу.",
		completed: "Завершено",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Ваш код працює правильно.",
		keepTrying: "Продовжуйте спроби!",
		failedToLoad: "Не вдалося завантажити модулі. Оновіть сторінку.",
		tailwindPlaceholder: "Введіть класи Tailwind (напр. bg-blue-500 text-white p-4)",
		lessonFallback: "Урок {index}",
		untitledLesson: "Урок без назви",

		// Landing page
		landingHeroTitle: "Вивчай веб-розробку",
		landingHeroHighlight: "Code Crispy",
		landingHeroSubtitle: "Опануй HTML, CSS та Tailwind через практичні вправи з миттєвим зворотним зв'язком. Безкоштовно та з відкритим кодом.",
		landingCtaStart: "Почни ЗАРАЗ",
		landingWhyTitle: "Чому CODE CRISPIES працює",
		landingBenefit1Title: "Вчись на практиці",
		landingBenefit1Text:
			"Пиши справжній код з першого уроку. Жодних відео—тільки ти, редактор і миттєвий зворотний зв'язок при кожному натисканні клавіші.",
		landingBenefit2Title: "У своєму темпі",
		landingBenefit2Text: "Почни з основ, заповни прогалини у розумінні, потім прискорюйся. Продовжуй з того місця, де зупинився, будь-коли.",
		landingBenefit3Title: "Реальні навички",
		landingBenefit3Text: "Вивчай CSS, HTML та Tailwind так, як їх використовують професіонали—через практичні вправи та довідники.",
		landingBenefit4Title: "Безкоштовно та Open Source",
		landingBenefit4Text: "Без paywall, без відстеження. Опціональний акаунт для хмарної синхронізації. Код відкритий для всіх.",
		landingPathsTitle: "Досліджуй шляхи навчання",
		landingCssDesc: "Стилізація, макети та анімації",
		landingHtmlDesc: "Семантична розмітка та нативні елементи",
		landingTailwindDesc: "CSS-фреймворк на основі утиліт",
		comingSoon: "Незабаром",
		landingCtaTitle: "Почни вчитися сьогодні",
		landingCtaSub: "Безкоштовно та з відкритим кодом. Без реєстрації. Прогрес зберігається локально.",
		landingCtaButton: "Let's get crispy!",

		// Coming Soon
		landingComingSoonTitle: "Незабаром",
		comingSoonSyncTitle: "Хмарна синхронізація",
		comingSoonSyncText: "Синхронізуй прогрес на всіх пристроях. Почни на комп'ютері, продовжуй на планшеті.",
		comingSoonAchievementsTitle: "Досягнення",
		comingSoonAchievementsText: "Отримуй значки, освоюючи нові навички. Відстежуй свої навчальні віхи.",
		comingSoonJsTitle: "JavaScript",
		comingSoonJsText: "Інтерактивні уроки JavaScript з виконанням коду в реальному часі та маніпуляцією DOM.",
		comingSoonFrameworksTitle: "Фреймворки",
		comingSoonFrameworksText: "Основи React, Vue та Svelte. Створюй справжні компоненти крок за кроком.",
		comingSoonChallengesTitle: "Кодові виклики",
		comingSoonChallengesText: "Перевір свої навички в завданнях на час. Змагайся в рейтингах і здобувай ранги.",

		// Newsletter
		newsletterText: "Хочете дізнатися, коли з'являться нові функції?",
		newsletterPlaceholder: "ваш@email.com",
		newsletterButton: "Повідомити мене",
		newsletterThanks: "Дякуємо! Ми будемо тримати вас в курсі.",
		newsletterDisclaimer: "Максимум раз на тиждень. Відписатися можна будь-коли через mail@codecrispi.es",

		// Device Notice
		deviceNotice: "<strong>Найкраще на комп'ютері або планшеті (горизонтально).</strong> На телефоні теж працює, але більший екран полегшує програмування.",

		// Footer
		footerModules: "Модулі",
		footerResources: "Ресурси",
		footerPlayground: "Пісочниця",
		footerAbout: "Про нас",
		footerSupport: "Підтримка",
		footerSupportText: "Допоможи зберегти CODE CRISPIES безкоштовним та з відкритим кодом.",
		footerLicense: "Передано у суспільне надбання.",
		footerPrivacy: "Політика конфіденційності",
		footerImprint: "Правова інформація",
		privacyTitle: "Політика конфіденційності",
		privacyIntro: "CODE CRISPIES поважає твою приватність. Ця політика пояснює, які дані ми збираємо і як їх використовуємо.",
		privacyLocalTitle: "Локальне сховище",
		privacyLocalText: "Твій прогрес, код та налаштування зберігаються локально у браузері. Ці дані не залишають твій пристрій, якщо ти не створюєш акаунт.",
		privacyAccountTitle: "Дані акаунту (необов'язково)",
		privacyAccountText: "Якщо ти створюєш акаунт, ми зберігаємо твою електронну пошту та зашифрований пароль для хмарної синхронізації.",
		privacyNewsletterTitle: "Розсилка (необов'язково)",
		privacyNewsletterText: "Якщо ти підписуєшся на розсилку, ми зберігаємо твою пошту для надсилання оновлень. Ти можеш відписатися в будь-який час.",
		privacyNoTrackingTitle: "Без відстеження",
		privacyNoTrackingText: "Ми не використовуємо файли cookie для відстеження, аналітики чи реклами. Ми не ділимося твоїми даними з третіми сторонами.",
		privacyRightsTitle: "Твої права (GDPR)",
		privacyRightsText: "Ти можеш видалити свій акаунт і всі пов'язані дані в будь-який час з бічного меню. Питання: mail@codecrispi.es",
		privacyUpdated: "Останнє оновлення: січень 2025",
		imprintTitle: "Правова інформація",
		imprintResponsibleTitle: "Відповідальний за вміст",
		imprintContactTitle: "Контакт",
		imprintDisclaimerTitle: "Застереження",
		imprintDisclaimerText: "CODE CRISPIES надається без гарантій. Ми не несемо відповідальності за збитки, що виникають внаслідок використання цього сервісу.",

		// Help Dialog Support
		supportTitle: "Підтримати проєкт",
		supportText: "Допоможи зберегти CODE CRISPIES безкоштовним та з відкритим кодом.",

		// Auth
		authLogin: "Увійти",
		authSignUp: "Зареєструватися",
		authLogout: "Вийти",
		authEmail: "Електронна пошта",
		authPassword: "Пароль",
		authConfirmPassword: "Підтвердити пароль",
		authNoAccount: "Немає акаунту? Зареєструйся",
		authHaveAccount: "Вже є акаунт? Увійди",
		authForgotPassword: "Забули пароль?",
		authResetPassword: "Скинути пароль",
		authResetInstructions: "Введи свою електронну пошту, щоб отримати посилання для скидання.",
		authSendReset: "Надіслати посилання",
		authResetSent: "Перевір електронну пошту для посилання на скидання.",
		authOrContinueWith: "або продовжити через",
		authPasswordMismatch: "Паролі не співпадають",
		authSignupSuccess: "Акаунт створено! Перевір електронну пошту для підтвердження.",
		authAccount: "Акаунт",
		authSyncHint: "Увійди, щоб синхронізувати прогрес між пристроями",
		authDeleteAccount: "Видалити акаунт",
		authDeleteDialogTitle: "Видалити акаунт",
		authDeleteDialogText: "Ти впевнений, що хочеш видалити свій акаунт? Весь твій хмарний прогрес буде видалено назавжди. Цю дію неможливо скасувати.",
		authDeleteConfirm: "Видалити акаунт"
	}
};

let currentLang = "en";

// Available languages in cycle order
const availableLanguages = ["en", "de", "pl", "es", "ar", "uk"];

/**
 * Get array of available language codes
 */
export function getAvailableLanguages() {
	return availableLanguages;
}

/**
 * Get the next language in the cycle
 * @param {string} currentLang - Current language code
 * @returns {string} Next language code
 */
export function getNextLanguage(current = currentLang) {
	const currentIndex = availableLanguages.indexOf(current);
	const nextIndex = (currentIndex + 1) % availableLanguages.length;
	return availableLanguages[nextIndex];
}

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
// RTL languages
const rtlLanguages = ["ar"];

export function setLanguage(lang) {
	if (!translations[lang]) {
		console.warn(`Language "${lang}" not supported, falling back to English`);
		lang = "en";
	}
	currentLang = lang;
	localStorage.setItem("codeCrispies.language", lang);
	document.documentElement.lang = lang;

	// Set text direction for RTL languages
	document.documentElement.dir = rtlLanguages.includes(lang) ? "rtl" : "ltr";
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
