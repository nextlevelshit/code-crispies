// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.js'],
        include: ['tests/**/*.{test,spec}.js'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'tests/setup.js']
        },
        server: {
            deps: {
                inline: true
            }
        }
    }
});