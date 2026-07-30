import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

export default defineTool({
  name: "get_platform_health",
  title: "Get platform health",
  description:
    "Operational scraper and scheduled-job health: last run per provider, success and failure counts, and anything overdue or failing. Contains no patient or personal data.",
  inputSchema: {
    hours: z.number().int().min(1).max(720).default(72).describe("Lookback window in hours."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;
    const { client } = session;
    const since = new Date(Date.now() - args.hours * 3600_000).toISOString();

    const [runs, jobs, runLog, cron] = await Promise.all([
      client
        .from("scrape_runs")
        .select(
          "provider_id, scraper_function, started_at, finished_at, status, tests_seen, tests_new, tests_updated, tests_deactivated, errors",
        )
        .gte("started_at", since)
        .order("started_at", { ascending: false })
        .limit(500),
      client
        .from("scraping_jobs")
        .select("provider_id, status, last_scraped, next_scrape, error_message, expected_min_tests, last_test_count"),
      client
        .from("scrape_run_log")
        .select("started_at, completed_at, status, providers_run, tests_scraped, tests_promoted, verification_failures, trigger_source")
        .gte("started_at", since)
        .order("started_at", { ascending: false })
        .limit(50),
      client
        .from("cron_run_log")
        .select("job_name, started_at, finished_at, status, duration_ms, rows_affected, error_message")
        .gte("started_at", since)
        .order("started_at", { ascending: false })
        .limit(200),
    ]);

    const firstError = runs.error ?? jobs.error ?? runLog.error ?? cron.error;
    if (firstError) return fail(firstError.message);

    type Run = { provider_id: string | null; started_at: string | null; status: string | null };
    const perProvider = new Map<
      string,
      { provider_id: string; last_run_at: string | null; last_status: string | null; success: number; failure: number }
    >();
    for (const row of (runs.data ?? []) as Run[]) {
      const key = row.provider_id ?? "unknown";
      const entry =
        perProvider.get(key) ?? { provider_id: key, last_run_at: null, last_status: null, success: 0, failure: 0 };
      const status = (row.status ?? "").toLowerCase();
      if (status === "success" || status === "completed" || status === "ok") entry.success += 1;
      else if (status) entry.failure += 1;
      if (!entry.last_run_at || (row.started_at ?? "") > entry.last_run_at) {
        entry.last_run_at = row.started_at;
        entry.last_status = row.status;
      }
      perProvider.set(key, entry);
    }

    const now = Date.now();
    const overdue = (jobs.data ?? []).filter(
      (j: { next_scrape: string | null }) => j.next_scrape != null && new Date(j.next_scrape).getTime() < now,
    );
    const failingJobs = (jobs.data ?? []).filter(
      (j: { status: string | null; error_message: string | null }) =>
        (j.status ?? "").toLowerCase() === "failed" || !!j.error_message,
    );
    const failingCron = (cron.data ?? []).filter(
      (c: { status: string | null }) => (c.status ?? "").toLowerCase() !== "success",
    );

    await logAdminToolCall(session, "get_platform_health", args);
    return ok({
      window_hours: args.hours,
      providers: [...perProvider.values()].sort((a, b) => (b.last_run_at ?? "").localeCompare(a.last_run_at ?? "")),
      overdue_jobs: overdue,
      failing_jobs: failingJobs,
      recent_orchestrator_runs: runLog.data ?? [],
      failing_cron_runs: failingCron,
      cron_runs_total: cron.data?.length ?? 0,
    });
  },
});
