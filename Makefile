# Code Crispies - Interactive CSS Learning Platform

.PHONY: help dev build test test-watch test-coverage format clean install deploy mirror-public

# Default port
PORT = 1234

# Files stripped from github public mirror (libretech-internal)
SCRUB_PATHS := .wave .gitea DEPLOY.md LESSON_EVALUATION.md compose.yaml Dockerfile .dockerignore supabase-setup.sql flake.nix flake.lock Makefile wave.yaml specs CLAUDE.md .claude

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
	@echo ""
	@echo "Publishing:"
	@echo "  make mirror-public - Strip internal files + force-push to github mirror"

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

# Mirror to public github with internal files stripped.
# Run after merging to main on gitea (libretech/cc).
# Force-pushes to github.com/nextlevelshit/code-crispies main.
mirror-public:
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "ERROR: working tree not clean. Commit or stash first."; exit 1; \
	fi
	@current=$$(git symbolic-ref --short HEAD); \
	if [ "$$current" != "main" ]; then \
		echo "ERROR: must be on main (current: $$current)"; exit 1; \
	fi
	git fetch origin main
	@if [ "$$(git rev-parse HEAD)" != "$$(git rev-parse origin/main)" ]; then \
		echo "ERROR: local main not in sync with origin/main"; exit 1; \
	fi
	git switch -c public-mirror main
	git rm -rf $(SCRUB_PATHS)
	git commit -m "scrub: strip internal infra for public mirror"
	git push --force github public-mirror:main
	git switch main
	git branch -D public-mirror
	@echo ""
	@echo "✓ pushed scrubbed tree to github.com/nextlevelshit/code-crispies main"
