import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { BlogArticle } from "@/types/blog.types";

/**
 * Public read of aggregated provider blog posts. Uses the publishable key so
 * it is safe to call during SSR/prerender of the public /blog route.
 */
export const getAggregatedBlogArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogArticle[]> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
    if (!url || !key) return [];

    const supabasePublic = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("provider_blog_posts")
      .select("title, excerpt, url, image_url, provider_name, category, published_at")
      .order("published_at", { ascending: false })
      .limit(500);

    if (error || !data) return [];

    return data.map((row) => ({
      title: row.title,
      excerpt: row.excerpt,
      url: row.url,
      image: row.image_url ?? "",
      provider: row.provider_name,
      category: row.category,
      date: row.published_at,
    }));
  },
);
