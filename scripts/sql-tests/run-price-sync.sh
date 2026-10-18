#!/usr/bin/env bash
# Replays the manual price sync migration (twice, to prove it re-runs cleanly)
# on a throwaway database with stubbed pg_net, pg_cron, Vault and has_role,
# loads the 14 real mhc-* cron jobs from the reconciliation migration, then
# runs the scenario checks in price-sync.test.sql.
#
# Needs a disposable PostgreSQL 14+ server you can create databases on.
# Point libpq at it with the usual variables, e.g.
#   PGHOST=/tmp PGPORT=5432 PGUSER=postgres bash scripts/sql-tests/run-price-sync.sh
# The script creates and drops a database named price_sync_test (override
# with PRICE_SYNC_TEST_DB). Never point it at a real Supabase project.
set -euo pipefail

cd "$(dirname "$0")/../.."
DB="${PRICE_SYNC_TEST_DB:-price_sync_test}"
HERE=scripts/sql-tests

PGOPTIONS="-c client_min_messages=warning" \
  psql -v ON_ERROR_STOP=1 -qc "drop database if exists ${DB}" -c "create database ${DB}"
trap 'psql -qc "drop database if exists ${DB}" >/dev/null 2>&1 || true' EXIT

run() {
  PGOPTIONS="-c client_min_messages=warning" \
    psql -d "${DB}" -q -v ON_ERROR_STOP=1 -f "$1" >/dev/null
}

run "${HERE}/price-sync-stubs.sql"
# The production mhc-* sync jobs, exactly as the reconciliation migration
# schedules them.
grep "^SELECT cron.schedule('mhc-" supabase/migrations/20260927190000_reconcile_out_of_band_production_state.sql \
  | grep -v "mhc-nightly-scrape-health-check" \
  | PGOPTIONS="-c client_min_messages=warning" psql -d "${DB}" -q -v ON_ERROR_STOP=1 >/dev/null
run supabase/migrations/20261014120000_mhc_shopify_feed_prefetch.sql
run supabase/migrations/20261018130000_mhc_manual_price_sync.sql
run supabase/migrations/20261018130000_mhc_manual_price_sync.sql
PGOPTIONS="-c client_min_messages=notice" \
  psql -d "${DB}" -q -v ON_ERROR_STOP=1 -f "${HERE}/price-sync.test.sql" 2>&1 \
  | grep -E "ok:|FAIL|ERROR|ALL PASSED"
