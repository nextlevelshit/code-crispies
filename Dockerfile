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

# Static SPA with proper 404 for missing assets:
# - asset extensions (.js/.css/.png/etc) → real 404 if missing (else nginx
#   would serve the SPA shell with the wrong Content-Type, breaking caches)
# - top-level paths → SPA shell so client-side routing works
# - genuine misses → branded 404.html (noindex)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    error_page 404 /404.html;\n\
    location = /404.html {\n\
        internal;\n\
    }\n\
    location ~* \\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webmanifest|map|woff2?|ttf|xml|txt|json)$ {\n\
        try_files $uri =404;\n\
    }\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location /health {\n\
        access_log off;\n\
        return 200 "ok\\n";\n\
        add_header Content-Type text/plain;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/health || exit 1
