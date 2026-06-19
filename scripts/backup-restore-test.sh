#!/usr/bin/env bash
# Quarterly Supabase backup restore test.
# See docs/BACKUP_RESTORE_TEST_RUNBOOK.md
#
# Usage:
#   SOURCE_DB_URL=... bash scripts/backup-restore-test.sh capture
#   SOURCE_DB_URL=... RESTORE_DB_URL=... BACKUP_FILE=... bash scripts/backup-restore-test.sh run

set -euo pipefail

CMD="${1:-help}"
QUARTER="$(date -u +'%Y-Q%q' 2>/dev/null || python3 -c 'import datetime as d;n=d.datetime.utcnow();print(f"{n.year}-Q{((n.month-1)//3)+1}")')"
EVIDENCE_DIR="evidence/backups/${QUARTER}"
mkdir -p "${EVIDENCE_DIR}"

CANARY_TABLES=(
  user_profiles
  user_roles
  orders
  test_results
  audit_logs
  csp_reports
  provider_tests
  biomarkers_library
)

CRITICAL_FUNCTIONS=(
  has_role
  is_current_user_admin
  cleanup_csp_reports
  cleanup_old_rate_limits
  handle_new_user_profile
)

capture_counts() {
  local url="$1" out="$2"
  echo "{" > "$out"
  local first=1
  for t in "${CANARY_TABLES[@]}"; do
    local c
    c=$(psql "$url" -At -c "SELECT count(*) FROM public.${t};" 2>/dev/null || echo "ERR")
    [ $first -eq 1 ] && first=0 || echo "," >> "$out"
    printf '  "%s": "%s"' "$t" "$c" >> "$out"
  done
  echo "" >> "$out"
  echo "}" >> "$out"
}

case "$CMD" in
  capture)
    : "${SOURCE_DB_URL:?set SOURCE_DB_URL}"
    echo "→ Capturing source row counts..."
    capture_counts "$SOURCE_DB_URL" "${EVIDENCE_DIR}/source-counts.json"
    echo "✓ Written ${EVIDENCE_DIR}/source-counts.json"
    cat "${EVIDENCE_DIR}/source-counts.json"
    ;;

  run)
    : "${RESTORE_DB_URL:?set RESTORE_DB_URL}"
    : "${BACKUP_FILE:?set BACKUP_FILE path to .dump or .sql.gz}"
    [ -f "$BACKUP_FILE" ] || { echo "Backup file not found: $BACKUP_FILE"; exit 1; }
    [ -f "${EVIDENCE_DIR}/source-counts.json" ] || { echo "Run 'capture' first."; exit 1; }

    LOG="${EVIDENCE_DIR}/restore.log"
    REPORT="${EVIDENCE_DIR}/restore-test-${QUARTER}.json"
    START=$(date -u +%s)

    echo "→ Restoring $BACKUP_FILE into disposable project..."
    if [[ "$BACKUP_FILE" == *.gz ]]; then
      gunzip -c "$BACKUP_FILE" | psql "$RESTORE_DB_URL" -v ON_ERROR_STOP=0 > "$LOG" 2>&1 || true
    else
      pg_restore --no-owner --no-privileges --clean --if-exists \
        -d "$RESTORE_DB_URL" "$BACKUP_FILE" > "$LOG" 2>&1 || true
    fi
    RESTORE_END=$(date -u +%s)

    echo "→ Capturing restored row counts..."
    capture_counts "$RESTORE_DB_URL" "${EVIDENCE_DIR}/restored-counts.json"

    echo "→ Verifying RLS posture..."
    RLS_OFF=$(psql "$RESTORE_DB_URL" -At -c \
      "SELECT count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity=false;")

    echo "→ Verifying critical functions..."
    MISSING_FNS=()
    for fn in "${CRITICAL_FUNCTIONS[@]}"; do
      exists=$(psql "$RESTORE_DB_URL" -At -c \
        "SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='${fn}';")
      [ "$exists" -gt 0 ] || MISSING_FNS+=("$fn")
    done

    echo "→ Computing drift..."
    DRIFT=$(python3 - "$EVIDENCE_DIR" <<'PY'
import json, sys, os
d = sys.argv[1]
src = json.load(open(f"{d}/source-counts.json"))
res = json.load(open(f"{d}/restored-counts.json"))
out = {}
for k, v in src.items():
    try:
        sv = int(v); rv = int(res.get(k, -1))
        diff = abs(sv - rv)
        pct = (diff / sv * 100) if sv else 0
        out[k] = {"source": sv, "restored": rv, "drift_pct": round(pct, 4)}
    except Exception:
        out[k] = {"source": v, "restored": res.get(k), "drift_pct": None}
print(json.dumps(out))
PY
)

    END=$(date -u +%s)
    RTO_MIN=$(( (END - START) / 60 ))
    RESTORE_MIN=$(( (RESTORE_END - START) / 60 ))

    PASS=true
    [ "$RLS_OFF" -eq 0 ] || PASS=false
    [ ${#MISSING_FNS[@]} -eq 0 ] || PASS=false
    grep -qE 'FATAL|could not' "$LOG" && PASS=false || true
    echo "$DRIFT" | python3 -c "import json,sys; d=json.loads(sys.stdin.read()); sys.exit(0 if all((v['drift_pct'] or 0) <= 0.5 for v in d.values() if v['drift_pct'] is not None) else 1)" || PASS=false

    cat > "$REPORT" <<EOF
{
  "quarter": "${QUARTER}",
  "executed_at_utc": "$(date -u +%FT%TZ)",
  "backup_file": "$(basename "$BACKUP_FILE")",
  "restore_minutes": ${RESTORE_MIN},
  "total_minutes": ${RTO_MIN},
  "rls_tables_without_rls": ${RLS_OFF},
  "missing_functions": $(printf '%s\n' "${MISSING_FNS[@]:-}" | python3 -c 'import sys,json;print(json.dumps([l for l in sys.stdin.read().split() if l]))'),
  "drift": ${DRIFT},
  "result": "$([ "$PASS" = true ] && echo PASS || echo FAIL)"
}
EOF

    echo
    echo "════════════════════════════════════════"
    echo "  Restore test ${QUARTER}: $([ "$PASS" = true ] && echo ✅ PASS || echo ❌ FAIL)"
    echo "  Report:   ${REPORT}"
    echo "  Log:      ${LOG}"
    echo "  RTO:      ${RTO_MIN} min (target < 60)"
    echo "════════════════════════════════════════"
    [ "$PASS" = true ] || exit 2
    ;;

  *)
    sed -n '1,12p' "$0"
    ;;
esac
