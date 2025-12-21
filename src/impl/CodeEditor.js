/**
 * CodeEditor - CodeMirror 6 wrapper with Emmet support
 */
import { EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, indentWithTab, indentMore, indentLess } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { autocompletion } from "@codemirror/autocomplete";
import { abbreviationTracker, expandAbbreviation } from "@emmetio/codemirror6-plugin";

// Dark theme matching our editor
const editorTheme = EditorView.theme({
	"&": {
		height: "100%",
		fontSize: "14px",
		backgroundColor: "#1e1e1e"
	},
	".cm-content": {
		fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
		padding: "12px 0",
		caretColor: "#fff",
		color: "#d4d4d4"
	},
	".cm-line": {
		padding: "0 12px"
	},
	"&.cm-focused .cm-cursor": {
		borderLeftColor: "#fff"
	},
	"&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
		backgroundColor: "#3a3d41"
	},
	".cm-activeLine": {
		backgroundColor: "#2a2d2e"
	},
	".cm-gutters": {
		backgroundColor: "#1e1e1e",
		color: "#858585",
		border: "none",
		paddingRight: "8px"
	},
	".cm-activeLineGutter": {
		backgroundColor: "#2a2d2e"
	},
	// Syntax highlighting
	".cm-keyword": { color: "#569cd6" },
	".cm-tagName": { color: "#569cd6" },
	".cm-attributeName": { color: "#9cdcfe" },
	".cm-attributeValue": { color: "#ce9178" },
	".cm-string": { color: "#ce9178" },
	".cm-comment": { color: "#6a9955" },
	".cm-propertyName": { color: "#9cdcfe" },
	".cm-number": { color: "#b5cea8" },
	".cm-unit": { color: "#b5cea8" },
	".cm-variableName": { color: "#9cdcfe" },
	// Autocomplete
	".cm-tooltip": {
		backgroundColor: "#252526",
		border: "1px solid #454545"
	},
	".cm-tooltip-autocomplete": {
		"& > ul > li": {
			padding: "4px 8px"
		},
		"& > ul > li[aria-selected]": {
			backgroundColor: "#094771",
			color: "#fff"
		}
	}
}, { dark: true });

export class CodeEditor {
	constructor(container, options = {}) {
		this.container = container;
		this.options = options;
		this.view = null;
		this.mode = options.mode || "css";
		this.onChange = options.onChange || (() => {});
	}

	/**
	 * Initialize the editor
	 */
	init(initialValue = "") {
		// Clear container
		this.container.innerHTML = "";

		// Get language extension based on mode
		const langExtension = this.mode === "html" ? html() : css();

		// Build extensions array
		const extensions = [
			langExtension,
			editorTheme,
			// Emmet abbreviation tracking
			abbreviationTracker(),
			// High priority keymap for Emmet
			Prec.highest(keymap.of([
				{
					key: "Tab",
					run: expandAbbreviation
				}
			])),
			// Standard keymaps
			keymap.of([
				{ key: "Tab", run: indentMore },
				{ key: "Shift-Tab", run: indentLess },
				...defaultKeymap
			]),
			autocompletion({
				activateOnTyping: true,
				maxRenderedOptions: 10
			}),
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					this.onChange(this.getValue());
				}
			}),
			EditorView.lineWrapping
		];

		// Add placeholder if provided
		if (this.options.placeholder) {
			extensions.push(placeholder(this.options.placeholder));
		}

		// Create editor state
		const state = EditorState.create({
			doc: initialValue,
			extensions
		});

		// Create editor view
		this.view = new EditorView({
			state,
			parent: this.container
		});

		return this;
	}

	/**
	 * Get current editor value
	 */
	getValue() {
		return this.view ? this.view.state.doc.toString() : "";
	}

	/**
	 * Set editor value
	 */
	setValue(value) {
		if (!this.view) return;

		this.view.dispatch({
			changes: {
				from: 0,
				to: this.view.state.doc.length,
				insert: value
			}
		});
	}

	/**
	 * Set editor mode (html or css)
	 */
	setMode(mode) {
		if (this.mode === mode) return;

		this.mode = mode;
		const currentValue = this.getValue();
		this.init(currentValue);
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
	 * Destroy the editor
	 */
	destroy() {
		if (this.view) {
			this.view.destroy();
			this.view = null;
		}
	}
}
