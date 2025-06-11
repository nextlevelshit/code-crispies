import { defineConfig } from "vite";

export default defineConfig((env) => ({
	base: "/",
	root: "./src",
	publicDir: "../public",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		sourcemap: true
	},
	server: {
		port: 1312,
		open: false
	},
	preview: {
		port: 1312,
		open: false
	}
}));
