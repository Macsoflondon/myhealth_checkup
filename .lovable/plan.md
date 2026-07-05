All five original SOC/perf batches shipped. This plan covers the three remaining follow-ups so the new admin surfaces are discoverable, configurable, and tested.

## 1. Admin nav integration

The new admin pages (`/admin/soc-watch`, `/admin/ops`, `/admin/change-log`, `/admin/performance`, `/admin/audit-console`) currently only work by direct URL. Add a shared admin shell so they're discoverable.

- New `src/components/admin/AdminShell.tsx` using shadcn `Sidebar` (`collapsible="icon"`) with grouped links:
  - **Security & ops**: SOC Watch, Ops, Performance, Audit console, Change log
  - **Data**: Test dashboard, Scrapers, Test mapper, Biomarker audit, Biomarker validation, Data refresh, Test upload
  - **System**: Encryption status, Security diff
- Highlight active route via `useLocation`; keep parent group open when a child is active.
- Wrap all `/admin/*` routes (except `/admin/login`, `/admin/recovery`) with the shell in `src/routes/index.tsx`. Existing page bodies unchanged.
- Persistent `SidebarTrigger` in the header so collapsed state is recoverable.

## 2. Alert routing config UI (IR-3 follow-up)

`security_alert_recipients` is currently DB-only. Add a management page so admins can control who gets paged.

- New `/admin/alert-routing` page + `src/api/supabase/alertRecipients.api.ts` service layer.
- Table with columns: email, severities (multi-select: critical/high/medium/low), sources (multi-select: soc/cron/scraper/csp/all), active toggle, notes, last updated.
- Add/edit dialog with zod-validated form; delete with confirm.
- Uses existing RLS (admin-only). No schema change — reads existing `security_alert_recipients` columns.
- Optional "Send test alert" button that invokes `security-alert-notify` with a dry-run payload so admins can verify routing without waiting for a real incident.

## 3. Tests + hardening

- **Deno tests** under `supabase/functions/*/index_test.ts` for:
  - `soc-cluster`: signal ingestion → incident creation, anomaly threshold, pattern rule (role-grant burst), dedupe by `cluster_key`.
  - `soc-action`: reversible ack + resolve happy path, unauthorised caller rejected, unknown action rejected.
  - `web-vitals-ingest`: valid CLS/LCP/INP accepted, invalid metric rejected, oversized payload rejected, rate-limit sanity check.
- **RLS review** for `web_vitals`:
  - Ensure only `service_role` can `SELECT`; `anon` gets `INSERT` only (public beacon).
  - Migration adds explicit `REVOKE SELECT ... FROM anon, authenticated` if missing, plus admin `SELECT` policy via `has_role`.
- **CSV export guardrails** in `AdminAuditConsolePage`:
  - Cap at 10k rows; warn above.
  - Strip embedded newlines/control chars beyond the existing quote escape.
  - Filename includes ISO timestamp + source + window (already partly there).
- **Audit trail**: log CSV exports and alert-routing changes into `admin_activity_log` via the existing service so the audit console reflects its own use.

## Technical notes

- Sidebar uses shadcn `Sidebar` primitives already installed (`src/components/ui/sidebar.tsx`).
- Alert routing form uses `react-hook-form` + `zod` — same pattern as existing admin forms.
- Deno tests run via `supabase--test_edge_functions`; each test file uses `Deno.test` + `std/assert` and mocks Supabase via a lightweight fetch stub (no live DB writes).
- RLS migration follows the mandatory GRANT-then-ENABLE-RLS-then-POLICY order.
- No changes to public/user-facing routes.

```text
src/
├── components/admin/AdminShell.tsx            (new — sidebar + header)
├── pages/AdminAlertRoutingPage.tsx            (new)
├── api/supabase/alertRecipients.api.ts        (new)
├── pages/AdminAuditConsolePage.tsx            (edit — export guardrails)
└── routes/index.tsx                           (edit — wrap admin routes, add route)

supabase/
├── functions/soc-cluster/index_test.ts        (new)
├── functions/soc-action/index_test.ts         (new)
├── functions/web-vitals-ingest/index_test.ts  (new)
└── migrations/<ts>_web_vitals_rls_lockdown.sql (new)
```

## Out of scope

- No new SOC detection rules (COR-2/COR-4 already shipped).
- No user-facing UI changes.
- No changes to auth, RLS on existing tables other than `web_vitals`.
