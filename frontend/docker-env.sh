#!/bin/sh
# Generates env.js at container startup so the SPA's backend URL is
# configurable per-environment (local vs Fly.io) without rebuilding.
# The official nginx image auto-runs *.sh files in /docker-entrypoint.d/.
set -e

API_BASE="${API_BASE:-http://localhost:8080}"
echo "window.__API_BASE__ = \"${API_BASE}\";" > /usr/share/nginx/html/env.js
echo "[env] generated env.js with API_BASE=${API_BASE}"
