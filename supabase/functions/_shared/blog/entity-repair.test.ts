import { assertEquals, assertRejects } from "jsr:@std/assert@1.0.19";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ENTITY_REPAIR_FILTER, repairStoredEntities } from "./entity-repair.ts";

function mockClient(readError: unknown = null) {
  const calls: Array<[string, unknown]> = [];
  const updates: unknown[] = [];
  const rows = [
    { id: "title", title: "Who It&apos;s For", excerpt: null },
    {
      id: "excerpt",
      title: "Clean title",
      excerpt: "Meaning &#8211; &amp;rsquo;",
    },
    { id: "clean", title: "Already clean", excerpt: "Plain text" },
    { id: "unknown", title: "An &unknown; entity", excerpt: null },
  ];
  const select = {
    or(filter: string) {
      calls.push(["or", filter]);
      return select;
    },
    order(field: string) {
      calls.push(["order", field]);
      return select;
    },
    limit(limit: number) {
      calls.push(["limit", limit]);
      return Promise.resolve({ data: rows, error: readError });
    },
  };
  const client = {
    from(table: string) {
      calls.push(["from", table]);
      return {
        select(columns: string) {
          calls.push(["select", columns]);
          return select;
        },
        update(patch: unknown) {
          updates.push(patch);
          return {
            eq(field: string, id: string) {
              calls.push([field, id]);
              return Promise.resolve({ error: null });
            },
          };
        },
      };
    },
  } as unknown as SupabaseClient;
  return { client, calls, updates };
}

Deno.test(
  "repair selects title OR excerpt entity candidates, bounded at 500",
  async () => {
    const { client, calls } = mockClient();
    await repairStoredEntities(client);
    assertEquals(ENTITY_REPAIR_FILTER, "title.like.%&%;%,excerpt.like.%&%;%");
    assertEquals(
      calls.find(([name]) => name === "or"),
      ["or", ENTITY_REPAIR_FILTER],
    );
    assertEquals(
      calls.find(([name]) => name === "limit"),
      ["limit", 500],
    );
  },
);
Deno.test(
  "repair updates only changed text and preserves null excerpts",
  async () => {
    const { client, updates } = mockClient();
    assertEquals(await repairStoredEntities(client), 2);
    assertEquals(updates, [
      { title: "Who It's For", excerpt: null },
      { title: "Clean title", excerpt: "Meaning – ’" },
    ]);
  },
);
Deno.test(
  "selection failure is reported rather than claiming a repair",
  async () => {
    const { client } = mockClient({ message: "unavailable" });
    await assertRejects(
      () => repairStoredEntities(client),
      Error,
      "Stored article entity selection failed",
    );
  },
);
