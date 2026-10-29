import { useState } from "react";
import type { BlogArticle } from "@/types/blog.types";
import {
  articleFallbackImage,
  isArticleImage,
} from "@/lib/blog/article-images";
import { cn } from "@/lib/utils";

export function ArticleImage({
  article,
  className,
  unsuitable = false,
}: {
  article: BlogArticle;
  className?: string;
  unsuitable?: boolean;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const providerImage =
    !unsuitable && isArticleImage(article.image) && failedUrl !== article.image;
  const src = providerImage ? article.image : articleFallbackImage(article);
  return (
    <img
      src={src}
      alt={
        providerImage
          ? article.title
          : `${article.category} — illustrative image`
      }
      title={
        providerImage
          ? undefined
          : "Illustrative image; not supplied by the provider"
      }
      width={1024}
      height={768}
      loading="lazy"
      decoding="async"
      onError={providerImage ? () => setFailedUrl(article.image) : undefined}
      className={cn("w-full object-cover", className)}
    />
  );
}
