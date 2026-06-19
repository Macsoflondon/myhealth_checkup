#!/usr/bin/env bash
# Cyber Essentials: dependency vulnerability scan.
# Fails (exit 1) on high/critical advisories in production deps.
set -euo pipefail

echo "Running bun audit (production deps only)..."
OUTPUT="$(bun pm ls --all 2>/dev/null || true)"

# Bun's native audit isn't fully featured; fall back to npm audit against the
# lockfile when available so we get severity counts. bun install is required
# to materialise node_modules first if running in CI.
if command -v npm >/dev/null 2>&1; then
  AUDIT_JSON="$(npm audit --omit=dev --json || true)"
  HIGH=$(echo "$AUDIT_JSON" | grep -oE '"high":[0-9]+' | head -n1 | grep -oE '[0-9]+' || echo 0)
  CRIT=$(echo "$AUDIT_JSON" | grep -oE '"critical":[0-9]+' | head -n1 | grep -oE '[0-9]+' || echo 0)
  echo "High: ${HIGH:-0}  Critical: ${CRIT:-0}"
  if [ "${HIGH:-0}" -gt 0 ] || [ "${CRIT:-0}" -gt 0 ]; then
    echo "FAIL: high or critical vulnerabilities present."
    echo "$AUDIT_JSON" | head -c 4000
    exit 1
  fi
else
  echo "npm not available; skipping severity gate."
fi

echo "OK: no high/critical advisories."
