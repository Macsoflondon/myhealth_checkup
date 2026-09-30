import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fail, ok, PRICE_NOTE, toNumber, userClient, UUID_RE } from "../shared";

type FavouriteRow = {
  id: string;
  test_id: string;
  name: string | null;
  provider: string | null;
  category: string | null;
  price: number | string | null;
  created_at: string;
};

type CatalogueRow = {
  id: string;
  price: number | string | null;
  total_expected_cost: number | string | null;
  updated_at: string | null;
};

export default defineTool({
  name: "list_my_favourites",
  title: "List my saved tests",
  description:
    "Return the signed-in user's saved tests with the current catalogue price, total expected cost and updated_at. price_changed is true when the current price differs from the price saved.",
  inputSchema: {
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return fail("Not authenticated");
    const client = userClient(ctx);
    const { data, error } = await client
      .from("favorites")
      .select("id, test_id, name, provider, category, price, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return fail(error.message);
    const favourites = (data ?? []) as FavouriteRow[];

    const ids = favourites.map((f) => f.test_id).filter((id) => UUID_RE.test(id));
    const current = new Map<string, CatalogueRow>();
    if (ids.length > 0) {
      const { data: rows, error: catError } = await client
        .from("unified_provider_tests")
        .select("id, price, total_expected_cost, updated_at")
        .in("id", ids);
      if (catError) return fail(catError.message);
      for (const r of (rows ?? []) as CatalogueRow[]) current.set(r.id, r);
    }

    const result = favourites.map((f) => {
      const live = current.get(f.test_id);
      const saved = toNumber(f.price);
      const now = live ? toNumber(live.price) : null;
      return {
        ...f,
        saved_price: saved,
        current_price: now,
        current_total_expected_cost: live ? toNumber(live.total_expected_cost) : null,
        updated_at: live?.updated_at ?? null,
        in_catalogue: Boolean(live),
        price_changed: saved != null && now != null && saved !== now,
      };
    });
    return ok({ count: result.length, favourites: result, note: PRICE_NOTE });
  },
});
