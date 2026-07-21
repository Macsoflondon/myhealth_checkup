/**
 * Helpers for scrape_runs lifecycle rows.
 */

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

import { getErrorMessage } from "../errors.ts";

export interface RunCounters {
  tests_seen: number;
  tests_new: number;
  tests_updated: number;
  tests_deactivated: number;
  tests_unchanged: number;
  fields_populated: number;
  fields_not_stated: number;
  errors: Array<{ test?: string; message: string }>;
}

export function newCounters(): RunCounters {
  return {
    tests_seen: 0,
    tests_new: 0,
    tests_updated: 0,
    tests_deactivated: 0,
    tests_unchanged: 0,
    fields_populated: 0,
    fields_not_stated: 0,
    errors: [],
  };
}

export async function startScrapeRun(
  supabase: SupabaseClient,
  providerId: string,
  scraperFunction: string,
  metadata: Record<string, unknown> = {},
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("scrape_runs")
      .insert({
        provider_id: providerId,
        scraper_function: scraperFunction,
        status: "running",
        metadata,
      })
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return (data?.id as string) ?? null;
  } catch (err) {
    console.warn("[scrape_runs] startScrapeRun failed:", getErrorMessage(err));
    return null;
  }
}

export async function finishScrapeRun(
  supabase: SupabaseClient,
  runId: string | null,
  counters: RunCounters,
  status: "success" | "partial" | "error" = "success",
): Promise<void> {
  if (!runId) return;
  try {
    await supabase
      .from("scrape_runs")
      .update({
        finished_at: new Date().toISOString(),
        status,
        tests_seen: counters.tests_seen,
        tests_new: counters.tests_new,
        tests_updated: counters.tests_updated,
        tests_deactivated: counters.tests_deactivated,
        tests_unchanged: counters.tests_unchanged,
        fields_populated: counters.fields_populated,
        fields_not_stated: counters.fields_not_stated,
        errors: counters.errors,
      })
      .eq("id", runId);
  } catch (err) {
    console.warn("[scrape_runs] finishScrapeRun failed:", getErrorMessage(err));
  }
}
