import { defineConfig } from "vite";

export default defineConfig((env) => ({
	base: env.command.build ? "/code-crispies/" : "/",
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
	}
}));
