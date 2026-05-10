# Multi-stage: build the Vite static site, then serve via nginx.

# ── Build stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (cache layer)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

# Vite picks up VITE_* at build time. Pass via --build-arg.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ── Runtime stage ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Replace the default top-level nginx.conf with our tuned version:
# - worker_processes auto + 4096 connections + epoll
# - sendfile/tcp_nopush zero-copy
# - on-the-fly gzip (HTML/CSS/JS/JSON/XML/SVG)
# - cache headers: 1y immutable for /assets/ (hashed bundles), 30d for media,
#   5m for HTML / sitemap / manifest
# - SPA fallback + asset 404 + branded 404 page
COPY nginx.conf /etc/nginx/nginx.conf

# Pre-compress static assets so gzip_static can serve them without runtime
# CPU. Skips files with already-good compression (png/jpg/woff2).
COPY --from=build /app/dist /usr/share/nginx/html
RUN find /usr/share/nginx/html \
        \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.svg' \
           -o -name '*.json' -o -name '*.xml' -o -name '*.txt' -o -name '*.webmanifest' \) \
        -exec gzip -9 -k {} \;

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/health || exit 1
