# Code Crispies - Interactive CSS Learning Platform

.PHONY: help dev build test test-watch test-coverage format clean install deploy

# Default port
PORT = 1234

help:
	@echo "Code Crispies - Development Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start dev server (port $(PORT))"
	@echo "  make build        - Production build to dist/"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run tests once"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make test-coverage - Run tests with coverage"
	@echo ""
	@echo "Other:"
	@echo "  make format       - Format all source files"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make install      - Install dependencies"

# Development
dev:
	npm start

# Build
build:
	npm run build

# Testing
test:
	npm run test

test-watch:
	npm run test.watch

test-coverage:
	npm run test.coverage

# Formatting
format:
	npm run format
	npm run format.lessons

# Clean
clean:
	rm -rf dist/ node_modules/.vite/

# Install
install:
	npm install
