#!/usr/bin/env bash
# Export cron run history to CSV for the Cyber Essentials evidence pack.
#
# Usage:
#   SOURCE_DB_URL=... bash scripts/export-cron-evidence.sh [days]
#
# Default window: 90 days. Output: evidence/cron/YYYY-QX/cron-runs-<from>-<to>.csv
set -euo pipefail
: "${SOURCE_DB_URL:?set SOURCE_DB_URL}"

DAYS="${1:-90}"
QUARTER="$(python3 -c 'import datetime as d;n=d.datetime.utcnow();print(f"{n.year}-Q{((n.month-1)//3)+1}")')"
OUT_DIR="evidence/cron/${QUARTER}"
mkdir -p "$OUT_DIR"
TS=$(date -u +%Y%m%dT%H%M%SZ)
CSV="${OUT_DIR}/cron-runs-${DAYS}d-${TS}.csv"
SUMMARY="${OUT_DIR}/cron-summary-${DAYS}d-${TS}.json"

echo "→ Exporting last ${DAYS} days of cron runs..."
psql "$SOURCE_DB_URL" -c "\COPY (
  SELECT id, job_name, started_at, finished_at, duration_ms, status, rows_affected, error_message
  FROM public.cron_run_log
  WHERE started_at >= now() - (interval '1 day' * ${DAYS})
  ORDER BY started_at DESC
) TO STDOUT WITH CSV HEADER" > "$CSV"

ROWS=$(($(wc -l < "$CSV") - 1))

psql "$SOURCE_DB_URL" -At <<SQL > "$SUMMARY"
SELECT json_build_object(
  'window_days', ${DAYS},
  'exported_at_utc', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  'per_job', (
    SELECT json_agg(j) FROM (
      SELECT job_name,
             count(*) AS runs,
             count(*) FILTER (WHERE status='success') AS successes,
             count(*) FILTER (WHERE status='error')   AS failures,
             round(avg(duration_ms))::int AS avg_ms,
             max(duration_ms)             AS max_ms,
             sum(coalesce(rows_affected,0)) AS rows_affected_total,
             max(started_at)              AS last_run
      FROM public.cron_run_log
      WHERE started_at >= now() - (interval '1 day' * ${DAYS})
      GROUP BY job_name
      ORDER BY job_name
    ) j
  ),
  'recent_failures', (
    SELECT json_agg(f) FROM (
      SELECT job_name, started_at, error_message
      FROM public.cron_run_log
      WHERE status='error' AND started_at >= now() - (interval '1 day' * ${DAYS})
      ORDER BY started_at DESC
      LIMIT 20
    ) f
  )
);
SQL

echo "✓ ${CSV}  (${ROWS} rows)"
echo "✓ ${SUMMARY}"
cat "$SUMMARY" | python3 -m json.tool
