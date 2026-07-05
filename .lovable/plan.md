# Migration History Reconciliation Plan

## Current state (audit)

- **Repo**: 230 files in `supabase/migrations/`
- **Remote** (`supabase_migrations.schema_migrations`): 248 entries
- Root cause of divergence: three distinct patterns.

### Pattern A — Systematic +1s offset (≈180 files, Sep 2025 – Jun 2026)
Nearly every repo filename is exactly **1 second ahead** of its corresponding remote `version`. E.g.:
```
repo 20251014113114  ↔  remote 20251014113113  (Δ 1s, same migration)
repo 20260619113156  ↔  remote 20260619113155
repo 20260628141429  ↔  remote 20260628141428
```
This is a Lovable/Supabase CLI artefact — the CLI records the timestamp it stamped, the file was saved 1s later. **Same SQL, different keys.** Harmless while Lovable manages pushes, but any raw `supabase db push` would treat every repo file as unapplied and re-run 180 migrations → guaranteed failure.

### Pattern B — Pre-Oct-2025 legacy files: 12h offset (10 files)
Very old files with a full 12h drift (BST/timezone artefact), e.g.:
```
repo 20250714231842  ↔  remote 20250714111841  (Δ 12h)
repo 20250810194211  ↔  remote 20250810074209
repo 20251001211519  ↔  remote 20251001091517
```
Same story — same migration, different key.

### Pattern C — True orphans

**In remote, NOT in repo** (16 real orphans after removing 1s/12h twins):
- Named CLI-applied migrations, no repo file:
  `20260619002749 create_unified_provider_tests_view`
  `20260619002844 grant_select_unified_provider_tests`
  `20260619024038 unified_view_v2_structured_fields`
  `20260619024159 unified_view_v3_sample_enum`
  `20260619110347 add_policy_audit_columns`
  `20260620094142 add_slug_and_parent_to_test_categories`
  `20260620101258 update_unified_provider_tests_body_system_labels`
  `20260630110630 enterprise_operational_intelligence_platform`
- Unnamed remote-only entries (applied directly, no file):
  `20260521111451, 20260521111529, 20260521111738, 20260521113747, 20260521121016, 20260525212015, 20260528020755, 20260529191917, 20260607233448`
- Suspicious recent entries (likely a stray `db pull`/manual insert):
  `20260705210133 001_full_schema`, `20260705210203 002_indexes`

**In repo, NOT in remote**: 0 real orphans — every repo file has a twin on remote once the 1s/12h drift is accounted for.

## Fix strategy (non-destructive, staged)

### Step 1 — Align remote → repo filenames (recommended, one-time SQL)
Cheapest, safest fix: bump each drifted `schema_migrations.version` in **remote** to match the repo filename. No SQL re-runs, purely metadata.

```sql
-- pattern A: +1s
UPDATE supabase_migrations.schema_migrations SET version = '20251014113114' WHERE version = '20251014113113';
-- …repeated for ~180 twins (script-generated, not hand-written)

-- pattern B: +12h
UPDATE supabase_migrations.schema_migrations SET version = '20250714231842' WHERE version = '20250714111841';
-- …repeated for ~10 twins
```
Generated automatically from the diff so nothing is guessed.

### Step 2 — Backfill missing repo files for real orphans (Pattern C)
For the 16 remote-only entries, create empty "marker" migration files in `supabase/migrations/` with matching version + name, containing only a comment (`-- Applied out-of-band on <date>; retained for history parity`). This keeps `db push` idempotent without re-running anything. Optionally, for the 8 named ones, use `pg_dump --schema-only` to capture the actual DDL and paste it into the marker for full traceability.

### Step 3 — Investigate the two `001_full_schema` / `002_indexes` rows
Read them (they may be a broken `supabase db pull` attempt). Decide together whether to keep or `DELETE` from `schema_migrations`.

### Step 4 — Guardrails
- Add `scripts/check-migration-parity.mjs` (mirrors the existing `check-rls-grants.mjs` style) that runs in CI and fails if the repo/remote sets diverge.
- Document the resolution in `docs/MIGRATION_HISTORY.md`.

## Order of execution & safety gates

1. **Read-only audit script** produces the exact UPDATE list + orphan list (`/tmp/migration-reconcile.sql`).
2. **Review that SQL with you** before running anything.
3. Run Step 1's UPDATEs via `supabase--migration` (single transaction — reversible with a saved backup of `schema_migrations`).
4. Create the marker files (Step 2) as ordinary repo edits.
5. Investigate Step 3 with you.
6. Add CI guard (Step 4).

## What I will NOT do without approval

- No `DELETE` from `schema_migrations`.
- No renaming/removing repo migration files.
- No `db reset` / `db push --force`.
- No writes against `auth`, `storage`, `vault`, or any table's data — only metadata rows in `supabase_migrations.schema_migrations`.

## Rollback

Before Step 1 runs I will `CREATE TABLE supabase_migrations.schema_migrations_backup_YYYYMMDD AS SELECT * FROM supabase_migrations.schema_migrations;` so a single `TRUNCATE + INSERT` reverts everything.
