# AI OS dashboard (Crux Control)

_Last updated 2026-10-09._

The AI OS is the rebuilt Crux Control admin portal at `/control`. It keeps every
existing Crux Control section and adds a plugin layer that pulls clicks,
traffic, social and revenue data into one place. Access needs the admin role
with an MFA (AAL2) session, the same gate as before.

## Sections

| Group      | Section                                                                                        | Source                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Command    | Command centre (`/control/command`, the default)                                               | Every source below, plus the AI briefing                                  |
| Growth     | Provider clicks (`/control/clicks`)                                                            | `affiliate_clicks` via `os_clicks_summary` (live)                         |
| Growth     | Traffic and search (`/control/traffic`)                                                        | GA4 and Search Console plugin snapshots                                   |
| Growth     | Social media (`/control/social`)                                                               | Metricool plugin snapshots (Facebook, Instagram, TikTok)                  |
| Growth     | Revenue (`/control/revenue`)                                                                   | `affiliate_conversions` via `os_revenue_summary`, Awin and Stripe plugins |
| Operations | Platform health, live metrics, crawls, automations, audits, providers, logs, alerts, SOC Watch | Unchanged Crux Control sections                                           |
| System     | Plugins (`/control/plugins`), search, export                                                   | Plugin manager, sync history                                              |

`/control/analytics` now redirects to `/control/clicks`. The old analytics
section read raw `funnel_events` in the browser (capped at 1,000 rows) and
counted automated clicks as real ones.

The 7d / 28d / 90d range picker sets `?range=` so a link reproduces the view.
Windows are Europe/London calendar days ending today. Third-party data ends at
its own latest complete day (GA4: yesterday; Search Console: two to three days
ago), and each panel says which window it shows.

## How data flows

```
 visitor click ──► /api/public/affiliate-click ──► affiliate_clicks ─┐
 CSV import (/admin/affiliate) ──────────────────► affiliate_conversions ─┤
                                                                     ├─► os_clicks_summary / os_revenue_summary (RPC, admin + MFA)
 pg_cron (hourly :23) ─► os-plugins edge function ─► adapters ─► GA4, Search Console,
                                                     │           Metricool, Awin, Stripe, site status
                                                     ├─► os_plugin_snapshots (latest normalised payload per dataset)
                                                     ├─► affiliate_conversions (Awin transactions)
                                                     └─► os_plugin_sync_log (every attempt, 90 days)
 dashboard ─► RPCs + one snapshots query (React Query cache) ─► sections
```

The browser never calls a third-party API. Pages read pre-aggregated RPC
results and one indexed snapshots query, which keeps them fast.

## Accuracy rules

- **Qualified clicks.** A click is excluded from qualified clicks when
  `traffic_flag` is set at ingest (`headless` automation browser, `bot`
  crawler, `burst` more than 10 clicks a minute from one address), or when 10
  or more clicks hit the same page within 120 seconds of each other. Excluded
  clicks stay in the raw totals and the dashboard lists each excluded burst.
  The 180 clicks on `/provider/lola-health` between 02:02 and 02:05 UTC on
  4 October 2026 (one session clicking every Lola Health test) are the reason
  for this rule; against production data the rule separates exactly those 180.
- **Ingest labels.** `/api/public/affiliate-click` reads the user agent and
  the client address only to set `traffic_flag`, then discards both. If the
  frontend deploys before the migration, the endpoint retries the insert
  without the label so no click is lost.
- **Revenue.** Reversed conversions are shown but never counted. Commission is
  what the network reports, not cash received. Commission never affects
  ranking.
- **Snapshots.** Every payload records when it was fetched; every panel shows
  the source, the window and the age of the data.
- **AI briefing.** The Command centre sends the dashboard's figures (facts) and
  rule-based insights to Claude (`claude-opus-5-5`, server-side refusal
  fallback on). Each returned point must cite fact ids, and every number in it
  must match a number in the facts it cites. Points that fail are dropped and
  counted. Without `ANTHROPIC_API_KEY` the page shows the rule-based insights.

## Connecting plugins

Open **Plugins** (`/control/plugins`). Each card shows what the plugin needs,
its status and its last sync. Credentials typed there go to Supabase Vault
through `os_set_plugin_secret` and cannot be read back by the browser. A value
set as an edge function environment variable with the same name takes
precedence over Vault.

| Plugin                   | Needs                                                                                                                                                 | Notes                                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Site status              | Nothing                                                                                                                                               | Checks `https://www.myhealthcheckup.co.uk/` and the apex hourly                                                                      |
| Google Analytics 4       | `GOOGLE_SERVICE_ACCOUNT_JSON` (shared Google scope) and the GA4 property ID                                                                           | Add the service account as a Viewer in GA4. This codebase does not load a GA4 tag; GA4 only has data if the tag is added another way |
| Google Search Console    | The Lovable connector keys (`LOVABLE_API_KEY`, `GOOGLE_SEARCH_CONSOLE_API_KEY`) already used by `gsc-resubmit-sitemap`, or the Google service account | Property defaults to `https://www.myhealthcheckup.co.uk/`                                                                            |
| Social media (Metricool) | `METRICOOL_USER_TOKEN`                                                                                                                                | Brand "Myhealth Checkup" (user 5383189, brand 6977338) is pre-filled. Metricool's API needs the Advanced or Custom plan              |
| Awin                     | `AWIN_API_TOKEN` and the publisher ID; optional advertiser to provider map                                                                            | Pulls 90 days in three 30-day windows into `affiliate_conversions` (`source = 'awin'`)                                               |
| Stripe                   | `STRIPE_SECRET_KEY` (restricted key, read access to balance transactions)                                                                             | GBP only, up to 2,000 transactions per sync                                                                                          |
| AI briefing              | `ANTHROPIC_API_KEY`                                                                                                                                   | Optional                                                                                                                             |

Conversions only match clicks when the provider's affiliate link carries our
click id. Set `subIdParam` per provider in
`src/lib/affiliate/affiliate-config.ts` (for Awin, `clickref`). All are `null`
today, so every conversion shows as unattributed.

## Adding a plugin

1. Add an entry to `supabase/functions/_shared/os/catalog.ts` (id, credentials,
   config fields, datasets, limitations, privacy note).
2. Add its payload types to `supabase/functions/_shared/os/contract.ts`.
3. Write `supabase/functions/os-plugins/adapters/<id>.ts` exporting
   `adapter: PluginAdapter`, with parsing in a pure `*-normalise.ts` module and
   vitest cases under `src/lib/os/__tests__/`.
4. Register it in `supabase/functions/os-plugins/adapters/index.ts`.
5. Read its snapshots in a section with `useSnapshot<T>(pluginId, dataset)`.

The Plugins page and the hourly sync pick it up from the catalogue.

## Security and privacy

- Every table and RPC is admin-with-MFA only (`has_role(auth.uid(), 'admin')`
  requires AAL2). Anonymous users cannot read or write any AI OS table.
- `os_get_plugin_secrets` (decrypted values) and
  `os_upsert_network_conversions` are executable by `service_role` only.
- Setting or removing a credential writes an `audit_logs` row without the
  value.
- The edge function accepts the service role key (cron) for `sync` only; every
  other action needs an admin user token with MFA. Error messages pass
  through `redact()`, which strips query strings, bearer tokens, Stripe keys
  and PEM blocks.
- No visitor IP address, user agent or account id is stored anywhere in this
  feature.

## Deploying

1. Apply `supabase/migrations/20261009160000_ai_os_dashboard.sql` (tables,
   RPCs, Vault functions, the `os-plugins-sync` and
   `os-plugin-sync-log-retention` cron jobs).
2. Deploy the `os-plugins` edge function (`verify_jwt = false`; it checks the
   caller itself).
3. Open `/control/plugins`, run **Test connection** on each plugin you set up,
   then **Sync all now**.
4. Optional: add `ANTHROPIC_API_KEY` for the AI briefing.

Until step 2, the hourly cron call returns 404 harmlessly and the Plugins page
says the edge function did not answer.

## Known issues found while building this (2026-10-09)

- **The public site is unpublished.** `https://www.myhealthcheckup.co.uk/`
  answers 404 "No published build" (`x-lovable-serve-error: dwl_no_hash`) and
  the Lovable project reports `is_published: false`. No provider clicks have
  arrived since 4 October. Republish in Lovable. The Site status plugin flags
  this as critical.
- **`funnel_events` replay gap.** Production has accepted visitor funnel
  inserts since migration `20260930151340`, but that file was never committed,
  so a fresh replay dropped visitor events; visitor inserts also depended on
  RLS policy evaluation order. PR #64 restores the file, scopes `admin_funnel`
  to `authenticated` and gates `trackFunnelEvent` on analytics consent. The
  AI OS does not read this table.
- **No GA4 tag in the codebase.** `src/lib/analytics.ts` forwards events to
  `gtag` only if a tag is already on the page.

## Tests

- SQL: `bash scripts/sql-tests/run-ai-os.sh` replays the affiliate and AI OS
  migrations twice on a disposable local Postgres with Supabase stand-ins and
  runs 68 assertions (burst exclusion, London days, MFA gating, Vault
  write-only access, conversion upserts, revenue totals, cron jobs).
- Unit: `src/lib/os/__tests__/` and
  `src/lib/affiliate/__tests__/traffic-quality.test.ts` (vitest).
