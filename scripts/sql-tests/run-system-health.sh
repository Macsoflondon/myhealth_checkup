#!/usr/bin/env bash
# Replays the system health migration (twice, to prove it re-runs cleanly) on
# a throwaway database with stubbed pg_net, pg_cron and alert delivery, then
# runs the scenario checks in system-health.test.sql.
#
# Needs a disposable PostgreSQL 14+ server you can create databases on.
# Point libpq at it with the usual variables, e.g.
#   PGHOST=/tmp PGPORT=5432 PGUSER=postgres bash scripts/sql-tests/run-system-health.sh
# The script creates and drops a database named system_health_test (override
# with SYSTEM_HEALTH_TEST_DB). Never point it at a real Supabase project.
set -euo pipefail

cd "$(dirname "$0")/../.."
DB="${SYSTEM_HEALTH_TEST_DB:-system_health_test}"
HERE=scripts/sql-tests

PGOPTIONS="-c client_min_messages=warning" \
  psql -v ON_ERROR_STOP=1 -qc "drop database if exists ${DB}" -c "create database ${DB}"
trap 'psql -qc "drop database if exists ${DB}" >/dev/null 2>&1 || true' EXIT

run() {
  PGOPTIONS="-c client_min_messages=warning" \
    psql -d "${DB}" -q -v ON_ERROR_STOP=1 -f "$1" >/dev/null
}

run "${HERE}/system-health-stubs.sql"
run supabase/migrations/20261016190000_system_health_alerts.sql
run supabase/migrations/20261016190000_system_health_alerts.sql
PGOPTIONS="-c client_min_messages=notice" \
  psql -d "${DB}" -q -v ON_ERROR_STOP=1 -f "${HERE}/system-health.test.sql" 2>&1 \
  | grep -E "ok:|FAIL|ERROR|ALL PASSED"
