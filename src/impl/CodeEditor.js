/**
 * CodeEditor - CodeMirror 6 wrapper with Emmet support
 */
import { EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, historyKeymap, indentMore, indentLess, undo, redo } from "@codemirror/commands";
import { history } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { autocompletion } from "@codemirror/autocomplete";
import { abbreviationTracker, expandAbbreviation } from "@emmetio/codemirror6-plugin";

// Custom overrides for One Dark theme
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
			oneDark,
			editorTheme,
			// History for undo/redo
			history(),
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
