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
