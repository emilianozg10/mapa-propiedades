#!/bin/sh
# Publica la página en Cloudflare Pages. Solo sube index.html y config.js; los datos viven en D1.
set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir dist && cp index.html config.js dist/
npx --prefix ../.claude/cf wrangler pages deploy --branch main --commit-dirty=true
