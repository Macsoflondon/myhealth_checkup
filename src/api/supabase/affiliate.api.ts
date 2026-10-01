import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { ConversionRow } from "@/lib/affiliate/parse-conversions-csv";

// The affiliate tables are not in the generated types until the migration
// is applied to the external project, so use an untyped client view.
const db = supabase as unknown as SupabaseClient;

export type PerformanceBucket = {
  provider_id?: string;
  placement?: string;
  clicks: number;
  conversions: number;
  conversion_rate: number | null;
  commission_gbp: number;
};

export type AffiliatePerformance = {
  totals: {
    clicks: number;
    conversions: number;
    conversion_rate: number | null;
    commission_gbp: number;
    order_value_gbp: number;
  };
  by_provider: PerformanceBucket[];
  by_placement: PerformanceBucket[];
};

export type ImportSummary = { imported: number; matched: number; unmatched: number };

export async function fetchAffiliatePerformance(
  from: Date,
  to: Date,
  providerId: string | null,
): Promise<AffiliatePerformance> {
  const { data, error } = await db.rpc("affiliate_performance", {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_provider: providerId,
  });
  if (error) throw new Error(error.message);
  return data as AffiliatePerformance;
}

export async function importAffiliateConversions(
  rows: ConversionRow[],
): Promise<ImportSummary> {
  const { data, error } = await db.rpc("import_affiliate_conversions", {
    p_rows: rows,
  });
  if (error) throw new Error(error.message);
  return data as ImportSummary;
}
