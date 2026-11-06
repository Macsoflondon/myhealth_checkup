import { useState } from "react";
import { cn } from "@/lib/utils";
import { isPromotionalImage } from "@/lib/promotional-images";
import { shopifyImageSrcSet, shopifyImageUrl } from "@/lib/shopify-image";

interface TestCardImageProps {
  imageUrl?: string | null;
  testName: string;
  providerName: string;
  className?: string;
  displayWidth?: number;
  sizes?: string;
}

/** Intrinsic size hint for the frame (1:1) so the browser reserves space before load. */
const FRAME_WIDTH = 400;
const FRAME_HEIGHT = 400;

export function TestCardImage({
  imageUrl,
  testName,
  providerName,
  className,
  displayWidth,
  sizes,
}: TestCardImageProps) {
  const trimmed = imageUrl?.trim() || null;
  const source = trimmed && !isPromotionalImage(trimmed) ? trimmed : null;
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const showImage = source !== null && source !== failedSource;

  return (
    <div
      className={cn(
        // One fixed frame for every product picture: same square box, equal
        // padding, white ground, picture centred and never cropped.
        "flex aspect-square w-full items-center justify-center overflow-hidden bg-white p-3",
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
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain object-center"
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
