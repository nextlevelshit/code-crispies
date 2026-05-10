import { defineConfig } from "vite";

export default defineConfig((env) => ({
	base: "/",
	root: "./src",
	envDir: "..",
	publicDir: "../public",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		sourcemap: true,
		// 500 KB warning was firing on every build because the editor
		// (CodeMirror + lang plugins + emmet) is genuinely large.
		// Bump to 800 so a real regression still surfaces, no daily noise.
		chunkSizeWarningLimit: 800,
		rollupOptions: {
			output: {
				// Split heavy deps into their own chunks so caches survive
				// across releases and the main app chunk stays small.
				manualChunks: {
					codemirror: [
						"@codemirror/state",
						"@codemirror/view",
						"@codemirror/commands",
						"@codemirror/autocomplete",
						"@codemirror/theme-one-dark",
						"codemirror"
					],
					"codemirror-langs": [
						"@codemirror/lang-html",
						"@codemirror/lang-css",
						"@codemirror/lang-javascript",
						"@codemirror/lang-markdown"
					],
					emmet: ["@emmetio/codemirror6-plugin"],
					marked: ["marked"]
				}
			}
		}
	},
	server: {
		port: 1234,
		open: false
	},
	preview: {
		port: 1234,
		open: false
	}
}));
