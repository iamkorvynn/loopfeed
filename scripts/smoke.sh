#!/bin/bash
# LoopFeed smoke check: install, test, build, serve the production build and
# confirm it answers with the app HTML + bundle. Run from the repo root.
set -e
cd "$(dirname "$0")/.."

echo "== npm install =="
npm install --no-audit --no-fund

echo "== npm test =="
npm test

echo "== npm run build =="
npm run build
test -f dist/index.html
test -f dist/assets/*.js

echo "== vite preview smoke =="
PORT=5317
(npx vite preview --port "$PORT" --strictPort > /tmp/loopfeed-smoke.log 2>&1 &)
sleep 4
HTML=$(curl -s "http://localhost:$PORT/")
echo "$HTML" | grep -q "<title>LoopFeed" || { echo "SMOKE FAIL: title missing"; cat /tmp/loopfeed-smoke.log; exit 1; }
echo "$HTML" | grep -q 'id="root"' || { echo "SMOKE FAIL: root div missing"; exit 1; }
curl -s -o /dev/null -w "bundle: %{http_code}\n" "http://localhost:$PORT/assets/$(ls dist/assets | grep '\.js$' | head -1)"
pkill -f "vite preview --port $PORT" || true
echo "SMOKE OK"
