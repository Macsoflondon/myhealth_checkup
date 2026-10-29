import { queryOptions } from "@tanstack/react-query";
import { getAggregatedBlogArticles } from "@/lib/blog/blog.functions";

export const providerArticlesQuery = queryOptions({
  queryKey: ["provider-blog-posts"],
  queryFn: () => getAggregatedBlogArticles(),
  staleTime: 30 * 60 * 1000,
});