import { supabase } from "@/integrations/supabase/client";

const SITE_ORIGIN = "https://www.myhealthcheckup.co.uk";

/**
 * Push URL changes to Bing / Yandex / Seznam / Naver via IndexNow.
 * Call after creating/updating tests, prices, providers, or other indexable pages.
 *
 * Admin auth required (the edge function checks `has_role('admin')`).
 *
 * @param paths Absolute URLs or root-relative paths (e.g. "/tests/medichecks-male-hormone")
 */
export async function submitToIndexNow(paths: string[]): Promise<{
  submitted: number;
  status: number;
  indexNowResponse: string | null;
}> {
  const urls = paths.map((p) =>
    p.startsWith("http") ? p : `${SITE_ORIGIN}${p.startsWith("/") ? p : `/${p}`}`
  );

  const { data, error } = await supabase.functions.invoke("indexnow-submit", {
    body: { urls },
  });

  if (error) throw error;
  return data;
}
