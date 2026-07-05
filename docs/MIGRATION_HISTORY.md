# Migration history

Supabase migration history for this project (`clvuioagsgfadynuvodj`) was reconciled on **2026-07-05**. This document explains the shape of the history so future migrations run cleanly and how to handle drift if it reappears.

## Ground truth

- **Repo**: every migration is a `.sql` file under `supabase/migrations/` named `YYYYMMDDHHMMSS_<slug>.sql`.
- **Remote**: every applied migration is a row in `supabase_migrations.schema_migrations` (columns: `version`, `name`, `statements`).
- **Invariant**: for every file there is exactly one remote row whose `version` matches the 14-digit prefix of the filename, and vice-versa.

CI enforces the invariant via `.github/workflows/migration-parity.yml`, which runs `scripts/check-migration-parity.mjs` (local shape) and a `psql` diff (remote parity) on every PR that touches `supabase/migrations/**`.

## History (pre-2026-07-05)

Two systematic drifts had accumulated between the two sides:

1. **+1 second drift** (~180 migrations, Sept 2025 – Jun 2026). Lovable/Supabase CLI stamped the `schema_migrations.version` one second before the file's filename timestamp. Same SQL, different key.
2. **+12 hour drift** (~10 legacy files pre-Oct 2025). Old files were written with local (BST) timestamps while remote stored UTC.

Both were resolved on 2026-07-05 with a metadata-only migration that updated `schema_migrations.version` to match the repo filename. **No SQL was re-executed.** A snapshot of the pre-change table was saved to `supabase_migrations.schema_migrations_backup_20260705` for one-shot rollback.

In addition, **18 remote-only "orphan" migrations** (applied out-of-band via CLI or dashboard) were backfilled as no-op marker files in the repo. Their original DDL remains in `supabase_migrations.schema_migrations.statements`.

## Rules going forward

### 1. Never edit a migration file after it has been pushed
Migration files are append-only. If you need to change something, write a new migration.

### 2. Only apply migrations via the migration tool
Do not run ad-hoc SQL against production. Anything applied outside the migration flow becomes an orphan and re-introduces drift. If you must (recovery / hotfix), immediately create a marker file — see below.

### 3. Backfilling an out-of-band migration
When a migration exists in `schema_migrations` but not in the repo, create a marker file:

```sql
-- supabase/migrations/<version>_<slug>.sql
--
-- Marker migration — historical parity only. No-op.
-- Applied out-of-band <date>. DDL preserved in schema_migrations.statements.

SELECT 1 WHERE FALSE;
```

The filename's 14-digit prefix must exactly equal the remote `version`. This keeps `db push` idempotent without any risk of re-running the DDL.

### 4. Rollback of the 2026-07-05 reconciliation
Metadata-only, reversible from the snapshot:

```sql
BEGIN;
TRUNCATE supabase_migrations.schema_migrations;
INSERT INTO supabase_migrations.schema_migrations
  SELECT * FROM supabase_migrations.schema_migrations_backup_20260705;
COMMIT;
```

The snapshot table can be dropped after ~30 days of stable operation:

```sql
DROP TABLE supabase_migrations.schema_migrations_backup_20260705;
```

## Detecting drift locally

```bash
node scripts/check-migration-parity.mjs
```

Local check only validates filename shape and duplicate versions. For full repo↔remote parity, run the CI workflow or the equivalent `psql` diff shown in that workflow file.
