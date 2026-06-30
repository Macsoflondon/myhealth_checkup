#!/usr/bin/env bash
# Cyber Essentials: scan committed source for accidentally-leaked secrets.
# Exits non-zero on any hit so CI can fail the build.
set -euo pipefail

ROOT="${1:-.}"
PATTERNS=(
  # Supabase / generic JWT (3 base64 segments, ≥80 chars total)
  'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
  # OpenAI / generic sk- keys
  'sk-[A-Za-z0-9]{32,}'
  # Stripe live keys
  'sk_live_[0-9a-zA-Z]{24,}'
  'rk_live_[0-9a-zA-Z]{24,}'
  # AWS access keys
  'AKIA[0-9A-Z]{16}'
  # Google API keys
  'AIza[0-9A-Za-z_-]{35}'
  # Slack tokens
  'xox[baprs]-[0-9A-Za-z-]{10,}'
)

# Files to skip — examples, the supabase types file (generated, contains an
# example anon-style placeholder), and lock files.
EXCLUDE=(
  '--glob=!node_modules'
  '--glob=!dist'
  '--glob=!.next'
  '--glob=!bun.lockb'
  '--glob=!package-lock.json'
  '--glob=!src/integrations/supabase/types.ts'
  '--glob=!docs/CYBER_ESSENTIALS.md'
  '--glob=!scripts/check-secrets.sh'
)

# Known-safe publishable values to ignore (anon JWTs are PUBLIC by design).
# Read from .env so we don't hardcode the value here.
ANON_KEY=""
if [ -f "$ROOT/.env" ]; then
  ANON_KEY="$(grep -E '^VITE_SUPABASE_PUBLISHABLE_KEY=' "$ROOT/.env" | head -n1 | sed -E 's/^[^=]+=//; s/^"//; s/"$//')"
fi

HITS=0
for p in "${PATTERNS[@]}"; do
  MATCHES="$(rg -n --no-heading --color=never "${EXCLUDE[@]}" "$p" "$ROOT" 2>/dev/null || true)"
  if [ -n "$ANON_KEY" ]; then
    MATCHES="$(printf '%s\n' "$MATCHES" | grep -v -F "$ANON_KEY" || true)"
  fi
  if [ -n "$MATCHES" ]; then
    echo "$MATCHES"
    HITS=$((HITS + 1))
  fi
done


if [ "$HITS" -gt 0 ]; then
  echo "FAIL: $HITS secret pattern(s) matched in source. Rotate immediately and remove from git history."
  exit 1
fi
echo "OK: no secret patterns matched."
