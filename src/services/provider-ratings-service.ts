import { supabase } from "@/integrations/supabase/client";

/** A verified provider star rating read from public.provider_ratings. */
export interface LiveProviderRating {
  providerId: string;
  source: string | null;
  sourceUrl: string | null;
  rating: number;
  reviewCount: number;
  checkedAt: string | null;
}

interface ProviderRatingRow {
  provider_id: string;
  source: string | null;
  source_url: string | null;
  rating: number | null;
  review_count: number | null;
  checked_at: string | null;
}

/** Rows with no verified rating or review count are dropped, never estimated. */
export function toLiveRatings(rows: ProviderRatingRow[]): LiveProviderRating[] {
  return rows.flatMap((r) => {
    const rating = r.rating === null ? NaN : Number(r.rating);
    const reviewCount = r.review_count === null ? NaN : Number(r.review_count);
    if (!Number.isFinite(rating) || !Number.isFinite(reviewCount) || reviewCount <= 0) {
      return [];
    }
    return [
      {
        providerId: r.provider_id,
        source: r.source,
        sourceUrl: r.source_url,
        rating,
        reviewCount,
        checkedAt: r.checked_at,
      },
    ];
  });
}

export async function fetchProviderRatings(): Promise<LiveProviderRating[]> {
  const { data, error } = await supabase
    .from("provider_ratings")
    .select("provider_id, source, source_url, rating, review_count, checked_at");
  if (error) throw error;
  return toLiveRatings(data ?? []);
}
