// Cyber Essentials evidence test: simulates a cron failure and an RLS failure,
// invokes the security-alert-notify edge function in dry-run mode, and asserts
// the rendered email contains the evidence-pack path and error details.
//
// Runs via: supabase--test_edge_functions (no real email sent).

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/security-alert-notify`;

async function invoke(body: Record<string, unknown>) {
  const r = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ ...body, dry_run: true }),
  });
  const text = await r.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* ignore */ }
  return { status: r.status, text, json };
}

Deno.test("simulated cron failure -> email contains evidence path and error", async () => {
  const evidencePath = "evidence/cron/2026-Q2/";
  const errorMessage = "ERROR: relation \"public.csp_reports\" does not exist (SQLSTATE 42P01)";

  const { status, json } = await invoke({
    alert_type: "cron_failure",
    subject: "[MHC TEST] Cron failure: cleanup_csp_reports",
    job_name: "cleanup_csp_reports",
    started_at: "2026-06-19T03:15:00Z",
    finished_at: "2026-06-19T03:15:00Z",
    duration_ms: 412,
    error_message: errorMessage,
    evidence_path: evidencePath,
    log_row_id: "11111111-1111-1111-1111-111111111111",
  });

  assertEquals(status, 200, `status=${status}`);
  assertEquals(json?.dry_run, true);
  assert(Array.isArray(json.to) && json.to.length > 0, "recipients array missing");
  assertStringIncludes(json.subject, "Cron failure: cleanup_csp_reports");

  const html: string = json.html;
  assertStringIncludes(html, "cron_failure");
  assertStringIncludes(html, "cleanup_csp_reports");
  assertStringIncludes(html, evidencePath);
  // Error message is HTML-escaped in the email body
  assertStringIncludes(html, "relation");
  assertStringIncludes(html, "csp_reports");
  assertStringIncludes(html, "42P01");
  assertStringIncludes(html, "412");
  assertStringIncludes(html, "11111111-1111-1111-1111-111111111111");
});

Deno.test("simulated RLS failure -> email lists failing tables and per-table verdicts", async () => {
  const evidencePath = "evidence/backups/2026-Q2/rls-per-table.csv";
  const failingTables = "user_profiles,test_results";

  const { status, json } = await invoke({
    alert_type: "rls_failure",
    subject: "[MHC TEST] Backup restore 2026-Q2: FAIL",
    job_name: "backup-restore-test",
    duration_ms: 32 * 60_000,
    error_message: `RLS off: 1, no-policy: 1, missing fns: 0, fail tables: ${failingTables}`,
    evidence_path: evidencePath,
    details: {
      rls: {
        tables_total: 42,
        tables_without_rls: 1,
        tables_rls_on_no_policy: 1,
        failing_tables: failingTables,
        per_table_csv: "rls-per-table.csv",
      },
      result: "FAIL",
    },
  });

  assertEquals(status, 200);
  assertEquals(json?.dry_run, true);

  const html: string = json.html;
  assertStringIncludes(html, "rls_failure");
  assertStringIncludes(html, evidencePath);
  assertStringIncludes(html, "user_profiles");
  assertStringIncludes(html, "test_results");
  assertStringIncludes(html, "tables_without_rls");
  assertStringIncludes(html, "rls-per-table.csv");
  assertStringIncludes(html, "FAIL");
});

Deno.test("payload validation rejects missing alert_type", async () => {
  const r = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ subject: "missing type", dry_run: true }),
  });
  const body = await r.text();
  assertEquals(r.status, 400, `body=${body}`);
  assertStringIncludes(body, "alert_type");
});
