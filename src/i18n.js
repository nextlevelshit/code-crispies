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
		levelIndicator: "Lesson {current} of {total}",
		lessonLabel: "Lesson",

		// Sidebar
		menu: "Menu",
		closeMenu: "Close menu",
		language: "Language",
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
		levelIndicator: "Lektion {current} von {total}",
		lessonLabel: "Lektion",

		// Sidebar
		menu: "Menü",
		closeMenu: "Menü schließen",
		language: "Sprache",
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
	},

	// Polish
	pl: {
		// Page
		pageTitle: "Code Crispies - Nauka HTML i CSS interaktywnie",
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
		levelIndicator: "Lekcja {current} z {total}",
		lessonLabel: "Lekcja",

		// Sidebar
		menu: "Menu",
		closeMenu: "Zamknij menu",
		language: "Język",
		progress: "Postęp",
		progressText: "{percent}% ukończone ({completed}/{total})",
		lessons: "Lekcje",
		settings: "Ustawienia",
		showHints: "Pokaż podpowiedzi",
		resetAllProgress: "Resetuj cały postęp",
		openSource: "Open Source:",
		by: "przez",

		// Help dialog
		helpTitle: "Pomoc",
		aboutTitle: "O Code Crispies",
		aboutText: "Code Crispies to darmowa platforma open-source do nauki tworzenia stron internetowych poprzez praktyczne ćwiczenia. Nie wymaga konta - po prostu zacznij kodować!",
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
		contactText: "Code Crispies jest rozwijany przez <a href=\"https://librete.ch\" target=\"_blank\">LibreTECH</a>",

		// Reset dialog
		resetDialogTitle: "Resetuj postęp",
		resetDialogText: "Czy na pewno chcesz zresetować cały postęp? Tej operacji nie można cofnąć.",
		cancel: "Anuluj",
		resetAll: "Resetuj wszystko",

		// Dynamic content
		loadingFallbackText: "Nie można załadować lekcji. Wybierz jedną z menu lub sprawdź pomoc.",
		completed: "Ukończono",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Twój kod działa poprawnie.",
		keepTrying: "Próbuj dalej!",
		failedToLoad: "Nie udało się załadować modułów. Odśwież stronę.",
		tailwindPlaceholder: "Wprowadź klasy Tailwind (np. bg-blue-500 text-white p-4)",
		lessonFallback: "Lekcja {index}",
		untitledLesson: "Lekcja bez tytułu"
	},

	// Spanish
	es: {
		// Page
		pageTitle: "Code Crispies - Aprende HTML y CSS de forma interactiva",
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
		levelIndicator: "Lección {current} de {total}",
		lessonLabel: "Lección",

		// Sidebar
		menu: "Menú",
		closeMenu: "Cerrar menú",
		language: "Idioma",
		progress: "Progreso",
		progressText: "{percent}% completado ({completed}/{total})",
		lessons: "Lecciones",
		settings: "Configuración",
		showHints: "Mostrar pistas",
		resetAllProgress: "Reiniciar todo el progreso",
		openSource: "Código abierto:",
		by: "por",

		// Help dialog
		helpTitle: "Ayuda",
		aboutTitle: "Acerca de Code Crispies",
		aboutText: "Code Crispies es una plataforma gratuita de código abierto para aprender desarrollo web a través de ejercicios prácticos. No se requiere cuenta, ¡solo empieza a programar!",
		learningModesTitle: "Modos de aprendizaje",
		modeCss: "<strong>CSS</strong> - Escribe reglas CSS para estilizar elementos",
		modeTailwind: "<strong>Tailwind</strong> - Aplica clases de utilidad directamente en HTML",
		modeHtml: "<strong>HTML</strong> - Practica marcado semántico y elementos nativos",
		gettingStartedTitle: "Primeros pasos",
		gettingStartedText: "Abre el menú (☰) para explorar los módulos de lecciones. Cada módulo cubre un tema específico con ejercicios progresivos.",
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
		contactText: "Code Crispies es desarrollado por <a href=\"https://librete.ch\" target=\"_blank\">LibreTECH</a>",

		// Reset dialog
		resetDialogTitle: "Reiniciar progreso",
		resetDialogText: "¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.",
		cancel: "Cancelar",
		resetAll: "Reiniciar todo",

		// Dynamic content
		loadingFallbackText: "No se pudo cargar la lección. Selecciona una del menú o consulta la ayuda.",
		completed: "Completado",
		successMessage: "¡CRISPY! ٩(◕‿◕)۶ Tu código funciona correctamente.",
		keepTrying: "¡Sigue intentando!",
		failedToLoad: "No se pudieron cargar los módulos. Actualiza la página.",
		tailwindPlaceholder: "Ingresa clases de Tailwind (ej. bg-blue-500 text-white p-4)",
		lessonFallback: "Lección {index}",
		untitledLesson: "Lección sin título"
	},

	// Arabic
	ar: {
		// Page
		pageTitle: "Code Crispies - تعلم HTML و CSS بشكل تفاعلي",
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
		levelIndicator: "الدرس {current} من {total}",
		lessonLabel: "درس",

		// Sidebar
		menu: "القائمة",
		closeMenu: "إغلاق القائمة",
		language: "اللغة",
		progress: "التقدم",
		progressText: "{percent}% مكتمل ({completed}/{total})",
		lessons: "الدروس",
		settings: "الإعدادات",
		showHints: "إظهار التلميحات",
		resetAllProgress: "إعادة تعيين كل التقدم",
		openSource: "مفتوح المصدر:",
		by: "بواسطة",

		// Help dialog
		helpTitle: "مساعدة",
		aboutTitle: "عن Code Crispies",
		aboutText: "Code Crispies هي منصة مجانية مفتوحة المصدر لتعلم تطوير الويب من خلال تمارين عملية. لا يلزم حساب - فقط ابدأ البرمجة!",
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
		contactText: "Code Crispies تم تطويره بواسطة <a href=\"https://librete.ch\" target=\"_blank\">LibreTECH</a>",

		// Reset dialog
		resetDialogTitle: "إعادة تعيين التقدم",
		resetDialogText: "هل أنت متأكد أنك تريد إعادة تعيين كل تقدمك؟ لا يمكن التراجع عن هذا الإجراء.",
		cancel: "إلغاء",
		resetAll: "إعادة تعيين الكل",

		// Dynamic content
		loadingFallbackText: "تعذر تحميل الدرس. اختر واحدًا من القائمة أو تحقق من المساعدة.",
		completed: "مكتمل",
		successMessage: "CRISPY! ٩(◕‿◕)۶ الكود يعمل بشكل صحيح.",
		keepTrying: "استمر في المحاولة!",
		failedToLoad: "فشل تحميل الوحدات. قم بتحديث الصفحة.",
		tailwindPlaceholder: "أدخل فئات Tailwind (مثل bg-blue-500 text-white p-4)",
		lessonFallback: "درس {index}",
		untitledLesson: "درس بدون عنوان"
	},

	// Ukrainian
	uk: {
		// Page
		pageTitle: "Code Crispies - Вивчай HTML та CSS інтерактивно",
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
		levelIndicator: "Урок {current} з {total}",
		lessonLabel: "Урок",

		// Sidebar
		menu: "Меню",
		closeMenu: "Закрити меню",
		language: "Мова",
		progress: "Прогрес",
		progressText: "{percent}% завершено ({completed}/{total})",
		lessons: "Уроки",
		settings: "Налаштування",
		showHints: "Показувати підказки",
		resetAllProgress: "Скинути весь прогрес",
		openSource: "Відкритий код:",
		by: "від",

		// Help dialog
		helpTitle: "Допомога",
		aboutTitle: "Про Code Crispies",
		aboutText: "Code Crispies — це безкоштовна платформа з відкритим кодом для вивчення веб-розробки через практичні вправи. Обліковий запис не потрібен — просто починайте кодувати!",
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
		contactText: "Code Crispies розроблено <a href=\"https://librete.ch\" target=\"_blank\">LibreTECH</a>",

		// Reset dialog
		resetDialogTitle: "Скинути прогрес",
		resetDialogText: "Ви впевнені, що хочете скинути весь свій прогрес? Цю дію неможливо скасувати.",
		cancel: "Скасувати",
		resetAll: "Скинути все",

		// Dynamic content
		loadingFallbackText: "Не вдалося завантажити урок. Виберіть один з меню або перевірте допомогу.",
		completed: "Завершено",
		successMessage: "CRISPY! ٩(◕‿◕)۶ Ваш код працює правильно.",
		keepTrying: "Продовжуйте спроби!",
		failedToLoad: "Не вдалося завантажити модулі. Оновіть сторінку.",
		tailwindPlaceholder: "Введіть класи Tailwind (напр. bg-blue-500 text-white p-4)",
		lessonFallback: "Урок {index}",
		untitledLesson: "Урок без назви"
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
