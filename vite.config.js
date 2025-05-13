import { defineConfig } from 'vite';

export default defineConfig({
    root: './src',
    publicDir: './public',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    },
    server: {
        port: 1312,
        open: false
    }
});