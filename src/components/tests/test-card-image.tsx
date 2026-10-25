import { useState } from "react";
import { cn } from "@/lib/utils";
import { shopifyImageSrcSet, shopifyImageUrl } from "@/lib/shopify-image";

interface TestCardImageProps {
  imageUrl?: string | null;
  testName: string;
  providerName: string;
  className?: string;
  displayWidth?: number;
  sizes?: string;
}

export function TestCardImage({
  imageUrl,
  testName,
  providerName,
  className,
  displayWidth,
  sizes,
}: TestCardImageProps) {
  const source = imageUrl?.trim() || null;
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const showImage = source !== null && source !== failedSource;

  return (
    <div
      className={cn(
        "h-full w-full min-h-0 overflow-hidden bg-white",
        className,
      )}
    >
      {showImage ? (
        <img
          src={displayWidth ? shopifyImageUrl(source, displayWidth) : source}
          srcSet={
            displayWidth
              ? shopifyImageSrcSet(source, [displayWidth, displayWidth * 2])
              : undefined
          }
          sizes={sizes}
          alt={`${testName} by ${providerName}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          onError={() => setFailedSource(source)}
        />
      ) : (
        <div
          data-testid="test-card-image-placeholder"
          className="flex h-full w-full flex-col items-center justify-center gap-2 border border-brand-navy/12 bg-white px-4 py-3 text-center"
        >
          <span className="line-clamp-3 max-w-full break-words font-heading text-sm font-semibold text-brand-navy">
            {testName}
          </span>
          <span className="line-clamp-2 max-w-full break-words text-xs text-muted-foreground">
            {providerName}
          </span>
        </div>
      )}
    </div>
  );
}
