import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decodeEntities } from "./decode-entities.ts";

export const ENTITY_REPAIR_LIMIT = 500;
export const ENTITY_REPAIR_FILTER = "title.like.%&%;%,excerpt.like.%&%;%";

interface RepairRow {
  id: string;
  title: string;
  excerpt: string | null;
}

/** Repair display text only; never change publication/feed-check timestamps. */
export async function repairStoredEntities(
  supabase: SupabaseClient,
): Promise<number> {
  const { data, error } = await supabase
    .from("provider_blog_posts")
    .select("id, title, excerpt")
    .or(ENTITY_REPAIR_FILTER)
    .order("id")
    .limit(ENTITY_REPAIR_LIMIT);
  if (error) throw new Error("Stored article entity selection failed");
  const rows = (data ?? []) as RepairRow[];
  const updates = rows.flatMap((row) => {
    const title = decodeEntities(row.title);
    const excerpt = row.excerpt === null ? null : decodeEntities(row.excerpt);
    return title !== row.title || excerpt !== row.excerpt
      ? [{ id: row.id, title, excerpt }]
      : [];
  });
  for (const { id, title, excerpt } of updates) {
    const { error: updateError } = await supabase
      .from("provider_blog_posts")
      .update({ title, excerpt })
      .eq("id", id);
    if (updateError) throw new Error("Stored article entity repair failed");
  }
  return updates.length;
}
