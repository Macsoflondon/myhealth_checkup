import { useState } from "react";
import { cn } from "@/lib/utils";
import { isPromotionalImage } from "@/lib/promotional-images";
import { productImageSrcSet, productImageUrl } from "@/lib/shopify-image";

interface TestCardImageProps {
  imageUrl?: string | null;
  testName: string;
  providerName: string;
  className?: string;
  displayWidth?: number;
  sizes?: string;
  priority?: boolean;
}

/** Intrinsic size hint for the frame (1:1) so the browser reserves space before load. */
const FRAME_WIDTH = 400;
const FRAME_HEIGHT = 400;

/**
 * Card-sized pictures (display width up to 400px) share one candidate ladder
 * whatever their slot, so a homepage that shows the same kit in two sections
 * downloads it once: phones at 2-3x pick the 800px file in every slot.
 */
const CARD_IMAGE_WIDTHS: readonly number[] = [320, 800];
const CARD_MAX_DISPLAY_WIDTH = 400;

function imageCandidates(displayWidth: number): readonly number[] {
  return displayWidth <= CARD_MAX_DISPLAY_WIDTH
    ? CARD_IMAGE_WIDTHS
    : [displayWidth, displayWidth * 2];
}

export function TestCardImage({
  imageUrl,
  testName,
  providerName,
  className,
  displayWidth = 325,
  sizes = "(min-width: 1024px) 325px, (min-width: 640px) 40vw, calc(100vw - 66px)",
  priority = false,
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
          src={productImageUrl(
            source,
            displayWidth <= CARD_MAX_DISPLAY_WIDTH
              ? CARD_MAX_DISPLAY_WIDTH
              : displayWidth,
          )}
          srcSet={
            displayWidth
              ? productImageSrcSet(source, imageCandidates(displayWidth))
              : undefined
          }
          sizes={sizes}
          alt={`${testName} by ${providerName}`}
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
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
