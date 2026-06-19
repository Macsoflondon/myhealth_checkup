# Quarterly Backup Restore Test Runbook

**Owner:** Platform / Security Lead
**Cadence:** Quarterly (Q1 Jan, Q2 Apr, Q3 Jul, Q4 Oct — first week)
**Purpose:** Evidence for Cyber Essentials Plus control A.7 (backups) — proves backups are not only taken but are *restorable*.

---

## 1. Scope

- **Source:** Supabase project `clvuioagsgfadynuvodj` (production, region eu-west-2).
- **Backup type tested:** Daily automated logical backup (PITR optional on Pro plan).
- **Target:** Disposable Supabase project (new free-tier project, deleted after test).
- **Data classes verified:** schema, RLS policies, row counts on `user_profiles`, `user_roles`, `orders`, `test_results`, `audit_logs`, `csp_reports`.

## 2. Pre-flight (T-1 day)

- [ ] Open Supabase dashboard → **Database → Backups**. Confirm last 7 daily backups exist.
- [ ] Note the timestamp of the backup under test (`BACKUP_TS`).
- [ ] Create a fresh empty Supabase project (`mhc-restore-test-YYYYQX`). Capture its DB connection string into env var `RESTORE_DB_URL`.
- [ ] Capture source row counts: `bash scripts/backup-restore-test.sh capture`
- [ ] Ensure `psql`, `pg_restore`, `jq` installed locally.

## 3. Restore procedure (T-day)

1. **Download** the chosen backup `.dump` (or `.sql.gz`) from Supabase dashboard → Backups → ⋯ → Download. Save as `/tmp/mhc-backup-${BACKUP_TS}.dump`.
2. **Run the test script:**
   ```bash
   export SOURCE_DB_URL='<prod read-only connection>'
   export RESTORE_DB_URL='<disposable project connection>'
   export BACKUP_FILE='/tmp/mhc-backup-<ts>.dump'
   bash scripts/backup-restore-test.sh run
   ```
3. The script will:
   - Restore the dump into `RESTORE_DB_URL`
   - Re-query row counts on the canary tables
   - Diff against the pre-flight capture
   - Verify RLS is enabled on every `public.*` table
   - Verify critical functions exist (`has_role`, `cleanup_csp_reports`, `cleanup_old_rate_limits`)
   - Emit `evidence/restore-test-YYYY-QX.json`

## 4. Acceptance criteria

| Check | Pass condition |
|---|---|
| Restore completes | `pg_restore` exit code 0, no FATAL in log |
| Schema parity | All canary tables present |
| Row-count drift | ≤ 0.5% vs source (accounts for live writes during backup window) |
| RLS posture | 100% of `public.*` tables have `rowsecurity = true` |
| Functions | All listed security-definer functions present and `SECURITY DEFINER` |
| RTO | Full restore + verification < 60 min |
| RPO | Backup age ≤ 24 h |

## 5. Evidence to retain (7 years)

Store under `evidence/backups/YYYY-QX/`:
- `restore-test-YYYY-QX.json` (script output)
- `restore.log` (full pg_restore log)
- Screenshot of Supabase Backups page showing date downloaded
- Signed-off PDF: tester name, date, pass/fail, anomalies, remediation

## 6. Tear-down

- [ ] Delete the disposable Supabase project (dashboard → Settings → General → Delete).
- [ ] Shred the local dump: `shred -u /tmp/mhc-backup-*.dump` (Linux) or `rm -P` (macOS).
- [ ] File evidence pack in `evidence/backups/`.
- [ ] Log result in risk register.

## 7. Failure escalation

If acceptance criteria fail:
1. File P1 incident in incident tracker within 1 h.
2. Re-test against the previous day's backup.
3. If two consecutive backups fail restore → engage Supabase support, switch to manual `pg_dump` nightly until resolved.
4. Notify DPO (Data Protection Officer) within 24 h — restoreability failure is a GDPR Article 32 concern.

## 8. Annual review

Every January, review this runbook against:
- Schema changes (new tables → add to canary list in script)
- Cyber Essentials scheme update
- Supabase backup product changes

---

## Appendix A — Per-table RLS evidence

Every `run` produces `rls-per-table.csv` in the evidence directory with one row per `public.*` table:

| Column | Meaning |
|---|---|
| `schemaname`, `tablename` | Identifier |
| `rls_enabled` | `t` = `ALTER TABLE … ENABLE ROW LEVEL SECURITY` is set |
| `policy_count`, `policy_names` | Number of policies + their names |
| `anon_select / anon_insert` | Whether the anonymous role has the grant (separate from RLS) |
| `auth_select / insert / update / delete` | Same for the `authenticated` role |
| `verdict` | `PASS`, `FAIL: RLS disabled`, or `FAIL: RLS on but no policies (deny-all)` |

Acceptance: zero `FAIL` rows. The summary counts and failing-table list are mirrored into `restore-test-YYYY-QX.json` under `"rls"`. Attach both files to the quarterly evidence pack.

## Appendix B — Cron execution evidence

Every cron run is logged to `public.cron_run_log` via `run_logged_cleanup()`. Failures auto-raise a `cron_job_failure` row in `scraper_alerts` (already surfaced on the admin dashboard).

Export to evidence pack:
```bash
export SOURCE_DB_URL='<prod connection>'
bash scripts/export-cron-evidence.sh 90
```
Outputs to `evidence/cron/YYYY-QX/`:
- `cron-runs-90d-<ts>.csv` — every run with start/end/duration/status/rows/error
- `cron-summary-90d-<ts>.json` — per-job success/failure counts + last 20 failures

Run this once per quarter alongside the restore test.

---

## Appendix C — Email alerts

Failures auto-email every enabled recipient in `public.security_alert_recipients`.

**Configure recipients** (admin SQL editor):
```sql
INSERT INTO public.security_alert_recipients (email, label, alert_types) VALUES
  ('security@myhealthcheckup.co.uk', 'SecOps inbox',
   ARRAY['cron_failure','rls_failure','backup_restore_failure']),
  ('cto@myhealthcheckup.co.uk',       'CTO escalation',
   ARRAY['rls_failure','backup_restore_failure']);

-- Disable temporarily without deleting:
UPDATE public.security_alert_recipients SET enabled = false WHERE email = '...';
```

`alert_types` accepts any combination of `cron_failure`, `rls_failure`, `backup_restore_failure`.

**Trigger surface:**
| Source | When it fires | Alert type |
|---|---|---|
| Postgres trigger on `cron_run_log` | row inserted/updated with `status='error'` | `cron_failure` |
| `scripts/backup-restore-test.sh run` | any RLS table fails (`rls_enabled=false` or no policies) | `rls_failure` |
| `scripts/backup-restore-test.sh run` | restore fails for any other reason (drift, missing fns, FATAL in log) | `backup_restore_failure` |

Email body includes the job/context, duration, error message, evidence-pack path, and the full restore report JSON. Save the inbound email alongside the evidence pack for CE+ assessor review.

**Transport:** Resend (`RESEND_API_KEY`). Sender defaults to `alerts@notify.www.myhealthcheckup.co.uk`; override with the `ALERT_FROM_ADDRESS` secret.
