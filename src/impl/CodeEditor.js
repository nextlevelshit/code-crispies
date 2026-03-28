/**
 * CodeEditor - CodeMirror 6 wrapper with Emmet support
 */
import { EditorState, EditorSelection, Prec, StateField, Compartment } from "@codemirror/state";
import { EditorView, keymap, placeholder, Decoration } from "@codemirror/view";
import { defaultKeymap, historyKeymap, indentMore, indentLess, undo, redo } from "@codemirror/commands";
import { history } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { abbreviationTracker, expandAbbreviation } from "@emmetio/codemirror6-plugin";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// Custom theme with purple accent colors (matching app completed state)
const crispyTheme = EditorView.theme(
	{
		"&": {
			backgroundColor: "#262630",
			color: "#c8c8d0"
		},
		".cm-content": {
			caretColor: "#9b6dd4"
		},
		".cm-cursor, .cm-dropCursor": {
			borderLeftColor: "#9b6dd4"
		},
		"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
			backgroundColor: "#3e3e4a"
		},
		".cm-panels": {
			backgroundColor: "#262630",
			color: "#c8c8d0"
		},
		".cm-searchMatch": {
			backgroundColor: "#3e3e4a",
			outline: "1px solid #9b6dd4"
		},
		".cm-searchMatch.cm-searchMatch-selected": {
			backgroundColor: "rgba(155, 109, 212, 0.3)"
		},
		".cm-activeLine": {
			backgroundColor: "#2e2e3a"
		},
		".cm-selectionMatch": {
			backgroundColor: "#3e3e4a"
		},
		".cm-gutters": {
			backgroundColor: "#262630",
			color: "#808090",
			border: "none"
		},
		".cm-activeLineGutter": {
			backgroundColor: "#2e2e3a"
		},
		".cm-lineNumbers .cm-gutterElement": {
			color: "#808090"
		}
	},
	{ dark: true }
);

// Default syntax highlighting (blue accent)
const defaultHighlight = HighlightStyle.define([
	{ tag: tags.keyword, color: "#c9a6eb" },
	{ tag: tags.operator, color: "#cdd6f4" },
	{ tag: tags.variableName, color: "#89b4fa" },
	{ tag: tags.propertyName, color: "#89b4fa" },
	{ tag: tags.attributeName, color: "#89b4fa" },
	{ tag: tags.className, color: "#89b4fa" },
	{ tag: tags.tagName, color: "#c9a6eb" },
	{ tag: tags.string, color: "#a6e3a1" },
	{ tag: tags.number, color: "#fab387" },
	{ tag: tags.bool, color: "#fab387" },
	{ tag: tags.null, color: "#fab387" },
	{ tag: tags.comment, color: "#6c7086", fontStyle: "italic" },
	{ tag: tags.bracket, color: "#cdd6f4" },
	{ tag: tags.punctuation, color: "#cdd6f4" },
	{ tag: tags.definition(tags.variableName), color: "#89b4fa" },
	{ tag: tags.function(tags.variableName), color: "#89b4fa" },
	{ tag: tags.atom, color: "#c9a6eb" },
	{ tag: tags.unit, color: "#a6e3a1" },
	{ tag: tags.color, color: "#f9e2af" }
]);

// CSS section highlighting (purple selectors)
const cssHighlight = HighlightStyle.define([
	{ tag: tags.keyword, color: "#c9a6eb" },
	{ tag: tags.operator, color: "#cdd6f4" },
	{ tag: tags.variableName, color: "#c9a6eb" },
	{ tag: tags.propertyName, color: "#89b4fa" },
	{ tag: tags.attributeName, color: "#89b4fa" },
	{ tag: tags.className, color: "#c9a6eb" },
	{ tag: tags.tagName, color: "#c9a6eb" },
	{ tag: tags.string, color: "#a6e3a1" },
	{ tag: tags.number, color: "#fab387" },
	{ tag: tags.bool, color: "#fab387" },
	{ tag: tags.null, color: "#fab387" },
	{ tag: tags.comment, color: "#6c7086", fontStyle: "italic" },
	{ tag: tags.bracket, color: "#cdd6f4" },
	{ tag: tags.punctuation, color: "#cdd6f4" },
	{ tag: tags.definition(tags.variableName), color: "#c9a6eb" },
	{ tag: tags.function(tags.variableName), color: "#89b4fa" },
	{ tag: tags.atom, color: "#c9a6eb" },
	{ tag: tags.unit, color: "#a6e3a1" },
	{ tag: tags.color, color: "#f9e2af" }
]);

// Get highlight style based on section
function getHighlightForSection(section) {
	if (section === "css") return cssHighlight;
	return defaultHighlight;
}

// Get theme with section-specific highlighting
export function getEditorTheme(section) {
	return [crispyTheme, syntaxHighlighting(getHighlightForSection(section))];
}

// Default combined theme export (for backwards compatibility)
export const crispyEditorTheme = [crispyTheme, syntaxHighlighting(defaultHighlight)];

// Custom overrides for editor styling
const editorTheme = EditorView.theme(
	{
		"&": {
			height: "100%",
			fontSize: "14px"
		},
		".cm-content": {
			fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
			padding: "12px 0"
		},
		".cm-line": {
			padding: "0 12px"
		}
	},
	{ dark: true }
);

export class CodeEditor {
	constructor(container, options = {}) {
		this.container = container;
		this.options = options;
		this.view = null;
		this.mode = options.mode || "css";
		this.section = options.section || null;
		this.onChange = options.onChange || (() => {});
		// Read-only zones support
		this.prefixLength = 0;
		this.suffixLength = 0;
		this.currentPrefix = "";
		this.currentSuffix = "";
		this.readOnlyCompartment = new Compartment();
	}

	/**
	 * Initialize the editor (backwards compatible wrapper)
	 */
	init(initialValue = "") {
		return this.initWithContext("", initialValue, "");
	}

	/**
	 * Initialize the editor with read-only prefix/suffix zones
	 * @param {string} prefix - Read-only prefix text (e.g., ".card {\n  ")
	 * @param {string} initialValue - Editable user code
	 * @param {string} suffix - Read-only suffix text (e.g., "\n}")
	 */
	initWithContext(prefix = "", initialValue = "", suffix = "") {
		// Clear container
		this.container.innerHTML = "";

		// Store prefix/suffix for re-initialization (e.g., when mode changes)
		this.currentPrefix = prefix;
		this.currentSuffix = suffix;
		this.prefixLength = prefix.length;
		this.suffixLength = suffix.length;

		const fullDoc = prefix + initialValue + suffix;

		// Get language extension based on mode
		const langExtension = this.mode === "html" ? html() : this.mode === "markdown" ? markdown() : this.mode === "javascript" ? javascript() : css();

		// Create read-only zones decorations
		const readOnlyMark = Decoration.mark({ class: "cm-readonly-zone" });

		// StateField to track and provide decorations for read-only zones
		const readOnlyDecorations = StateField.define({
			create: (state) => {
				const decorations = [];
				if (this.prefixLength > 0) {
					decorations.push(readOnlyMark.range(0, this.prefixLength));
				}
				if (this.suffixLength > 0) {
					const suffixStart = state.doc.length - this.suffixLength;
					decorations.push(readOnlyMark.range(suffixStart, state.doc.length));
				}
				return Decoration.set(decorations);
			},
			update: (decorations, tr) => {
				if (!tr.docChanged) return decorations;
				// Recalculate decorations after document changes
				const newDecorations = [];
				if (this.prefixLength > 0) {
					newDecorations.push(readOnlyMark.range(0, this.prefixLength));
				}
				if (this.suffixLength > 0) {
					const suffixStart = tr.state.doc.length - this.suffixLength;
					newDecorations.push(readOnlyMark.range(suffixStart, tr.state.doc.length));
				}
				return Decoration.set(newDecorations);
			},
			provide: (f) => EditorView.decorations.from(f)
		});

		// Change filter to prevent edits in read-only zones
		const readOnlyFilter = EditorState.changeFilter.of((tr) => {
			// If no prefix/suffix, allow all changes
			if (this.prefixLength === 0 && this.suffixLength === 0) {
				return true;
			}

			const prefixEnd = this.prefixLength;
			const suffixStart = tr.startState.doc.length - this.suffixLength;

			// Check all change ranges - allow only changes within [prefixEnd, suffixStart]
			let blocked = false;
			tr.changes.iterChangedRanges((fromA, toA) => {
				// Block if change starts in prefix zone
				if (fromA < prefixEnd) {
					blocked = true;
				}
				// Block if change extends into suffix zone
				if (toA > suffixStart) {
					blocked = true;
				}
			});

			return !blocked;
		});

		// Transaction filter to constrain cursor/selection to editable area
		const cursorFilter = EditorState.transactionFilter.of((tr) => {
			// If no prefix/suffix, no constraints needed
			if (this.prefixLength === 0 && this.suffixLength === 0) {
				return tr;
			}

			const prefixEnd = this.prefixLength;
			const suffixStart = tr.newDoc.length - this.suffixLength;

			// Check if selection needs adjustment
			const selection = tr.newSelection;
			let needsAdjustment = false;

			for (const range of selection.ranges) {
				if (range.from < prefixEnd || range.to > suffixStart) {
					needsAdjustment = true;
					break;
				}
			}

			if (!needsAdjustment) {
				return tr;
			}

			// Clamp selection to editable area
			const newRanges = selection.ranges.map((range) => {
				const from = Math.max(prefixEnd, Math.min(suffixStart, range.from));
				const to = Math.max(prefixEnd, Math.min(suffixStart, range.to));
				return EditorSelection.range(from, to);
			});

			return [tr, { selection: EditorSelection.create(newRanges, selection.mainIndex) }];
		});

		// Build extensions array
		const extensions = [
			langExtension,
			getEditorTheme(this.section),
			editorTheme,
			// History for undo/redo
			history(),
			// Read-only zones (decorations, change filter, and cursor constraint)
			readOnlyDecorations,
			readOnlyFilter,
			cursorFilter,
			// Emmet abbreviation tracking
			abbreviationTracker(),
			// High priority keymap for Emmet
			Prec.highest(
				keymap.of([
					{
						key: "Tab",
						run: expandAbbreviation
					}
				])
			),
			// Standard keymaps including history (Ctrl+Z, Ctrl+Shift+Z)
			keymap.of([...historyKeymap, { key: "Tab", run: indentMore }, { key: "Shift-Tab", run: indentLess }, ...defaultKeymap]),
			autocompletion({
				activateOnTyping: true,
				maxRenderedOptions: 10
			}),
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					// Report only the editable portion to the onChange handler
					this.onChange(this.getEditableValue());
				}
			}),
			EditorView.lineWrapping
		];

		// Add placeholder if provided (only makes sense when no prefix/suffix)
		if (this.options.placeholder && this.prefixLength === 0 && this.suffixLength === 0) {
			extensions.push(placeholder(this.options.placeholder));
		}

		// Create editor state
		const state = EditorState.create({
			doc: fullDoc,
			extensions
		});

		// Create editor view
		this.view = new EditorView({
			state,
			parent: this.container
		});

		// Position cursor at start of editable area
		if (this.prefixLength > 0) {
			this.view.dispatch({
				selection: { anchor: this.prefixLength }
			});
		}

		return this;
	}

	/**
	 * Get current full editor value (including prefix/suffix)
	 */
	getValue() {
		return this.view ? this.view.state.doc.toString() : "";
	}

	/**
	 * Get only the editable portion (excluding prefix/suffix)
	 */
	getEditableValue() {
		if (!this.view) return "";
		const fullText = this.view.state.doc.toString();
		const editableEnd = fullText.length - this.suffixLength;
		return fullText.slice(this.prefixLength, editableEnd);
	}

	/**
	 * Set editor value in the editable zone only (preserves history)
	 */
	setValue(value) {
		if (!this.view) return;

		// Only replace the editable portion
		const editableStart = this.prefixLength;
		const editableEnd = this.view.state.doc.length - this.suffixLength;

		this.view.dispatch({
			changes: {
				from: editableStart,
				to: editableEnd,
				insert: value
			}
		});
	}

	/**
	 * Set editor value and clear history (for lesson switching)
	 * @param {string} value - The editable user code (not including prefix/suffix)
	 * @param {string} prefix - Optional read-only prefix
	 * @param {string} suffix - Optional read-only suffix
	 */
	setValueAndClearHistory(value, prefix = "", suffix = "") {
		this.initWithContext(prefix, value, suffix);
	}

	/**
	 * Set editor mode (html or css)
	 */
	setMode(mode) {
		if (this.mode === mode) return;

		this.mode = mode;
		const editableValue = this.getEditableValue();
		this.initWithContext(this.currentPrefix, editableValue, this.currentSuffix);
	}

	/**
	 * Set section for theme (css, html, tailwind)
	 */
	setSection(section) {
		if (this.section === section) return;

		this.section = section;
		const editableValue = this.getEditableValue();
		this.initWithContext(this.currentPrefix, editableValue, this.currentSuffix);
	}

	/**
	 * Focus the editor
	 */
	focus() {
		if (this.view) {
			this.view.focus();
		}
	}

	/**
	 * Undo last change
	 */
	undo() {
		if (this.view) {
			undo(this.view);
		}
	}

	/**
	 * Redo last undone change
	 */
	redo() {
		if (this.view) {
			redo(this.view);
		}
	}

	/**
	 * Destroy the editor
	 */
	destroy() {
		if (this.view) {
			this.view.destroy();
			this.view = null;
		}
	}
}
