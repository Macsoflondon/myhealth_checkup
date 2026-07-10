import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveComparisonRow = {
  name: string;
  bio: string;
  badge: string;
  variant: "teal" | "pink" | "neutral";
  price: string;
  url?: string;
};

export type LiveComparisonPanel = {
  slug: string;
  panel_name: string;
  display_order: number;
  rows: LiveComparisonRow[];
  last_scraped_at: string | null;
};

/**
 * Loads all panels and rotates them by the current UTC hour so every visitor
 * within the same hour sees the same panel.
 */
export function useLiveComparisonPanel() {
  const [panel, setPanel] = useState<LiveComparisonPanel | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("live_comparison_panels")
        .select("slug, panel_name, display_order, rows, last_scraped_at")
        .order("display_order", { ascending: true });
      if (cancelled || !data?.length) return;
      const idx = new Date().getUTCHours() % data.length;
      setPanel(data[idx] as LiveComparisonPanel);
    })();
    return () => { cancelled = true; };
  }, []);

  return panel;
}
