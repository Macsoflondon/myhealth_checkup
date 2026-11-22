import { useState } from "react";
import type { BlogArticle } from "@/types/blog.types";
import {
  articleFallbackImage,
  articleFallbackSrcSet,
  isArticleImage,
} from "@/lib/blog/article-images";
import { cn } from "@/lib/utils";
import { shopifyImageUrl, shopifyImageSrcSet } from "@/lib/shopify-image";

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
  const src = providerImage
    ? shopifyImageUrl(article.image, 480, 1)
    : articleFallbackImage(article);
  const srcSet = providerImage
    ? shopifyImageSrcSet(article.image, [360, 480, 768, 1024])
    : articleFallbackSrcSet(article);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(min-width: 1024px) 30vw, (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)"
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
