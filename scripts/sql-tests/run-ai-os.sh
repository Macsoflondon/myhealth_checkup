#!/usr/bin/env bash
# Replays the affiliate and AI OS migrations (twice, to prove they re-run
# cleanly) on a throwaway database, then runs the AI OS SQL assertions.
#
# Needs a disposable PostgreSQL 14+ server you can create databases on.
# Point libpq at it with the usual variables, e.g.
#   PGHOST=/tmp PGPORT=5432 PGUSER=postgres bash scripts/sql-tests/run-ai-os.sh
# The script creates and drops a database named ai_os_test (override with
# AI_OS_TEST_DB). Never point it at a real Supabase project.
set -euo pipefail

cd "$(dirname "$0")/../.."
DB="${AI_OS_TEST_DB:-ai_os_test}"
HERE=scripts/sql-tests

PGOPTIONS="-c client_min_messages=warning" \
  psql -v ON_ERROR_STOP=1 -qc "drop database if exists ${DB}" -c "create database ${DB}"
trap 'psql -qc "drop database if exists ${DB}" >/dev/null 2>&1 || true' EXIT

run() {
  PGOPTIONS="-c client_min_messages=warning" \
    psql -d "${DB}" -q -v ON_ERROR_STOP=1 -f "$1" >/dev/null
}

run "${HERE}/supabase-stubs.sql"
run supabase/migrations/20261001120000_affiliate_click_tracking.sql
run supabase/migrations/20261009160000_ai_os_dashboard.sql
run supabase/migrations/20261009160000_ai_os_dashboard.sql

out="$(psql -d "${DB}" -q -v ON_ERROR_STOP=1 -f "${HERE}/ai-os-dashboard.test.sql" 2>&1)" || {
  echo "${out}" | grep -E "FAIL|ERROR" || echo "${out}"
  exit 1
}
passed="$(echo "${out}" | grep -c "NOTICE:  ok" || true)"
echo "${out}" | grep -q "ALL TESTS PASSED" && echo "AI OS SQL tests: ${passed} assertions passed."
