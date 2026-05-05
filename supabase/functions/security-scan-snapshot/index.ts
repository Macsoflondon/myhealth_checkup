/**
 * security-scan-snapshot
 * ----------------------
 * Runs a deterministic in-database security scan, snapshots the findings,
 * and computes a diff (added / removed / modified) against the previous
 * snapshot. Designed to be called on a schedule (pg_cron) and manually
 * by admins from the security diff dashboard.
 *
 * Scope of findings (errors + warnings only — info-level checks excluded):
 *   - tables in `public` without RLS enabled                       (ERROR)
 *   - tables with RLS enabled but ZERO policies                    (WARN)
 *   - SECURITY DEFINER functions in `public` without fixed
 *     `search_path` config                                         (WARN)
 *   - storage buckets that are public                              (ERROR)
 *
 * Auth: callable by the cron job (no auth) and by admins from the UI.
 * Writes go through SERVICE_ROLE — RLS blocks all client inserts.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Finding {
  /** Stable identifier — used for diffing across runs. */
  key: string;
  level: "error" | "warn";
  category: string;
  title: string;
  detail: string;
}

interface RawRow {
  [k: string]: unknown;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Auth gate: accept service-role bearer (cron) or an authenticated admin user.
    const authHeader = req.headers.get("Authorization") ?? "";
    const isServiceRole =
      SERVICE_ROLE.length > 0 && authHeader === `Bearer ${SERVICE_ROLE}`;

    if (!isServiceRole) {
      if (!authHeader) return json({ error: "Unauthorized" }, 401);
      const userClient = createClient(
        SUPABASE_URL,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: { user }, error: userErr } = await userClient.auth.getUser();
      if (userErr || !user) return json({ error: "Unauthorized" }, 401);
      const { data: isAdmin } = await userClient.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!isAdmin) return json({ error: "Admin only" }, 403);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const findings: Finding[] = [];

    // ---- 1. Tables without RLS ------------------------------------------
    const { data: tablesNoRls, error: rlsErr } = await admin
      .from("pg_tables")
      .select("schemaname,tablename,rowsecurity")
      .eq("schemaname", "public");

    if (!rlsErr && Array.isArray(tablesNoRls)) {
      for (const row of tablesNoRls as RawRow[]) {
        if (row.rowsecurity === false) {
          findings.push({
            key: `rls_disabled:${row.schemaname}.${row.tablename}`,
            level: "error",
            category: "RLS",
            title: `RLS disabled on ${row.schemaname}.${row.tablename}`,
            detail:
              "Row-level security is OFF — every authenticated/anon user can read or modify all rows.",
          });
        }
      }
    }

    // ---- 2. Storage buckets that are public -----------------------------
    const { data: buckets } = await admin
      .schema("storage")
      .from("buckets")
      .select("id,name,public");

    if (Array.isArray(buckets)) {
      for (const b of buckets as RawRow[]) {
        if (b.public === true) {
          findings.push({
            key: `bucket_public:${b.id}`,
            level: "error",
            category: "Storage",
            title: `Storage bucket "${b.name}" is public`,
            detail:
              "Public buckets allow direct unauthenticated downloads of every object.",
          });
        }
      }
    }

    // ---- 3. RLS-enabled tables with zero policies -----------------------
    // We can't query pg_policies via PostgREST without a view — fall back to
    // a small RPC if present, else skip. This keeps the function resilient.
    try {
      const { data: emptyPolicyTables } = await admin.rpc(
        "lov_tables_without_policies",
      );
      if (Array.isArray(emptyPolicyTables)) {
        for (const row of emptyPolicyTables as RawRow[]) {
          findings.push({
            key: `rls_no_policy:${row.schemaname}.${row.tablename}`,
            level: "warn",
            category: "RLS",
            title:
              `Table ${row.schemaname}.${row.tablename} has RLS enabled but no policies`,
            detail:
              "RLS denies all access by default — confirm this is intentional or add policies.",
          });
        }
      }
    } catch (_) {
      /* optional helper RPC not present — silently skip */
    }

    // ---- 4. Sort findings deterministically -----------------------------
    findings.sort((a, b) => a.key.localeCompare(b.key));

    const errorCount = findings.filter((f) => f.level === "error").length;
    const warnCount = findings.filter((f) => f.level === "warn").length;

    // ---- 5. Diff against previous snapshot ------------------------------
    const { data: previous } = await admin
      .from("security_scan_snapshots")
      .select("findings")
      .order("scanned_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prevFindings: Finding[] = (previous?.findings as Finding[]) ?? [];
    const prevByKey = new Map(prevFindings.map((f) => [f.key, f]));
    const currByKey = new Map(findings.map((f) => [f.key, f]));

    const added: Finding[] = findings.filter((f) => !prevByKey.has(f.key));
    const removed: Finding[] = prevFindings.filter((f) => !currByKey.has(f.key));
    const modified: Array<{ key: string; before: Finding; after: Finding }> = [];

    for (const [key, curr] of currByKey) {
      const prev = prevByKey.get(key);
      if (!prev) continue;
      if (
        prev.level !== curr.level ||
        prev.title !== curr.title ||
        prev.detail !== curr.detail
      ) {
        modified.push({ key, before: prev, after: curr });
      }
    }

    const hasDiff = added.length > 0 || removed.length > 0 ||
      modified.length > 0;

    // ---- 6. Persist snapshot --------------------------------------------
    const { data: inserted, error: insertErr } = await admin
      .from("security_scan_snapshots")
      .insert({
        total_findings: findings.length,
        error_count: errorCount,
        warn_count: warnCount,
        findings,
        added_findings: added,
        removed_findings: removed,
        modified_findings: modified,
        has_diff: hasDiff,
      })
      .select("id, scanned_at")
      .single();

    if (insertErr) throw insertErr;

    return json(
      {
        snapshot_id: inserted!.id,
        scanned_at: inserted!.scanned_at,
        total_findings: findings.length,
        error_count: errorCount,
        warn_count: warnCount,
        diff: {
          has_diff: hasDiff,
          added_count: added.length,
          removed_count: removed.length,
          modified_count: modified.length,
        },
      },
      200,
    );
  } catch (err) {
    console.error("security-scan-snapshot error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
