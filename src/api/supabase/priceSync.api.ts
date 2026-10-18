import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Manual runs of the live mhc-* price sync (migration 20261018130000). The
// RPCs check admin + MFA themselves and queue the same requests pg_cron
// sends; the browser never handles the sync secret.

// Not in the generated types until the migration is applied.
const db = supabase as unknown as SupabaseClient;

export interface PriceSyncCycle {
  status: string;
  started_at: string;
  finished_at: string | null;
  tests_seen: number;
  tests_updated: number;
  tests_new: number;
  tests_deactivated: number;
  errors: number;
  runs: number;
}

export interface PriceSyncStatusRow {
  provider_id: string;
  active_tests: number;
  last_cycle: PriceSyncCycle | null;
  next_scheduled_at: string | null;
  queued_jobs: number;
  next_job_at: string | null;
  last_requested_at: string | null;
  last_request_failed_jobs: number;
  last_request_failure: string | null;
}

export interface PriceSyncRequestResult {
  queued: {
    provider_id: string;
    jobs: number;
    first_run_at: string;
    last_run_at: string;
  }[];
  skipped: { provider_id: string; reason: string }[];
  feeds_refreshing: boolean;
}

export async function fetchPriceSyncStatus(): Promise<PriceSyncStatusRow[]> {
  const { data, error } = await db.rpc("admin_price_sync_status");
  if (error) throw new Error(error.message);
  return (data ?? []) as PriceSyncStatusRow[];
}

/** Queues one provider's sync, or every provider's when `providerId` is omitted. */
export async function requestPriceSync(
  providerId?: string,
): Promise<PriceSyncRequestResult> {
  const { data, error } = await db.rpc("admin_request_price_sync", {
    p_provider: providerId ?? null,
  });
  if (error) throw new Error(error.message);
  return data as PriceSyncRequestResult;
}
