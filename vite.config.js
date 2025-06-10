import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

export default defineConfig((env) => ({
	plugins: [react()],
	base: env.command === "build" ? "/code-crispies/" : "/",
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
