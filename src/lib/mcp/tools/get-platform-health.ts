import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { truncate } from "../shared";
import { runAdminTool } from "../admin-guard";

const FAILURE = new Set([
  "failed",
  "failure",
  "error",
  "errored",
  "timeout",
  "timed_out",
  "cancelled",
  "aborted",
]);

export default defineTool({
  name: "get_platform_health",
  title: "Get platform health",
  description:
    "Operational scraper and scheduled-job health. Success, failure and in-progress counts are computed in the database; runs still in progress are reported separately and never counted as failures. Also lists overdue and failing jobs. No patient data; pseudonymous user IDs may be included. Free-text error fields are truncated to 200 characters.",
  inputSchema: {
    hours: z.number().int().min(1).max(720).default(72),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "get_platform_health", args, async ({ client }) => {
      const since = new Date(Date.now() - args.hours * 3600_000).toISOString();
      const [counts, jobs, runLog, failingCron] = await Promise.all([
        client.rpc("mcp_platform_health_counts", { p_hours: args.hours }),
        client
          .from("scraping_jobs")
          .select(
            "provider_id, status, last_scraped, next_scrape, error_message, expected_min_tests, last_test_count",
          ),
        client
          .from("scrape_run_log")
          .select(
            "started_at, completed_at, status, providers_run, tests_scraped, tests_promoted, verification_failures, trigger_source",
          )
          .gte("started_at", since)
          .order("started_at", { ascending: false })
          .limit(50),
        client
          .from("cron_run_log")
          .select("job_name, started_at, finished_at, status, error_message")
          .gte("started_at", since)
          .in("status", [...FAILURE])
          .order("started_at", { ascending: false })
          .limit(50),
      ]);
      const firstError =
        counts.error ?? jobs.error ?? runLog.error ?? failingCron.error;
      if (firstError) return { error: firstError.message };

      type Job = {
        next_scrape: string | null;
        status: string | null;
        error_message: string | null;
      };
      const jobRows = ((jobs.data ?? []) as Job[]).map((j) => ({
        ...j,
        error_message: truncate(j.error_message),
      }));
      const now = Date.now();
      return {
        payload: {
          window_hours: args.hours,
          ...((counts.data ?? {}) as Record<string, unknown>),
          overdue_jobs: jobRows.filter(
            (j) =>
              j.next_scrape != null && new Date(j.next_scrape).getTime() < now,
          ),
          failing_jobs: jobRows.filter(
            (j) =>
              FAILURE.has((j.status ?? "").toLowerCase()) || !!j.error_message,
          ),
          recent_orchestrator_runs: runLog.data ?? [],
          recent_failing_cron_runs: (
            (failingCron.data ?? []) as Array<{ error_message: string | null }>
          ).map((c) => ({ ...c, error_message: truncate(c.error_message) })),
        },
      };
    }),
});
