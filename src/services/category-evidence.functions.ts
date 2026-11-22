import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import {
  findSubcategory,
  testMatchesSubcategory,
} from "@/config/subcategoryMap";
import { isTestAddon } from "@/lib/test-addon-status";
import { normalizeBiomarkers } from "@/utils/normalize-biomarkers";
import { publicCatalogueRead } from "./public-catalogue-memo";

const evidenceInput = z
  .object({
    ids: z.array(z.string().uuid()).max(1000),
    category: z.string().max(80),
    subcategory: z.string().max(80).nullable(),
  })
  .strict();

interface CategoryEvidence {
  matches: boolean;
  isAddon: boolean;
  biomarkerCount: number;
}

/** Public catalogue evidence only: prose is evaluated here, never sent as a list payload. */
export const getCategoryEvidence = createServerFn({ method: "POST" })
  .inputValidator(evidenceInput)
  .handler(async ({ data }): Promise<Record<string, CategoryEvidence>> => {
    if (data.ids.length === 0) return {};
    return publicCatalogueRead(
      JSON.stringify(["category-evidence", data]),
      async () => {
        const url = process.env["SUPABASE_URL"];
        const key =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ??
          process.env["SUPABASE_ANON_KEY"];
        if (!url || !key) throw new Error("Catalogue service unavailable");
        const client = createClient<Database>(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              if (
                key.startsWith("sb_") &&
                headers.get("Authorization") === `Bearer ${key}`
              )
                headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });
        const { data: rows, error } = await client
          .from("unified_provider_tests")
          .select(
            "id,test_name,provider_id,is_addon,category:category_primary,description,biomarkers_list,biomarker_count",
          )
          .in("id", data.ids);
        if (error) throw new Error("Catalogue evidence unavailable");
        const sub = findSubcategory(data.category, data.subcategory);
        const evidence: Record<string, CategoryEvidence> = {};
        for (const row of rows ?? []) {
          if (!row.id) continue;
          evidence[row.id] = {
            matches:
              !sub ||
              testMatchesSubcategory(sub, {
                title: row.test_name,
                tag: "All",
                desc: row.description,
                biomarkers: normalizeBiomarkers(row.biomarkers_list),
              }),
            isAddon: isTestAddon(row),
            biomarkerCount:
              row.biomarker_count && row.biomarker_count > 0
                ? row.biomarker_count
                : normalizeBiomarkers(row.biomarkers_list).length,
          };
        }
        return evidence;
      },
    );
  });
