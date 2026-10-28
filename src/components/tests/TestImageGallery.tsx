import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import { galleryImageAlt } from "@/lib/test-gallery";

interface TestImageGalleryProps {
  /** Resolved, de-duplicated image URLs (max 2). Empty renders nothing. */
  images: string[];
  testName: string;
  providerName: string;
}

const SWIPE_THRESHOLD_PX = 40;

/**
 * Small product gallery for the provider test detail page: one large main
 * image with a thumbnail row underneath when a second image exists. Thumbnails
 * are real buttons with arrow-key movement; on mobile the main image also
 * responds to left/right swipes with dot indicators.
 */
export function TestImageGallery({
  images,
  testName,
  providerName,
}: TestImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const count = images.length;
  const safeIndex = Math.min(activeIndex, Math.max(count - 1, 0));

  const goTo = useCallback(
    (next: number, focusThumb = false) => {
      if (count === 0) return;
      const wrapped = (next + count) % count;
      setActiveIndex(wrapped);
      if (focusThumb) thumbnailRefs.current[wrapped]?.focus();
    },
    [count],
  );

  const onThumbnailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(safeIndex + 1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(safeIndex - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1, true);
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || count < 2) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    // Swiping left moves to the next image, swiping right to the previous.
    goTo(delta < 0 ? safeIndex + 1 : safeIndex - 1);
  };

  if (count === 0) return null;

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-border bg-white"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={images[safeIndex]}
          src={images[safeIndex]}
          alt={galleryImageAlt(safeIndex, testName, providerName)}
          loading={safeIndex === 0 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>

      {count > 1 && (
        <>
          {/* Dot indicators for mobile swipe */}
          <div
            className="mt-3 flex justify-center gap-2 sm:hidden"
            aria-hidden="true"
          >
            {images.map((src, index) => (
              <span
                key={src}
                className={`h-2 w-2 rounded-full ${
                  index === safeIndex ? "bg-[#22c0d4]" : "bg-[#081129]/20"
                }`}
              />
            ))}
          </div>

          {/* Thumbnail row */}
          <div
            className="mt-3 flex justify-center gap-3"
            role="group"
            aria-label="Test images"
            onKeyDown={onThumbnailKeyDown}
          >
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => goTo(index)}
                aria-label={galleryImageAlt(index, testName, providerName)}
                aria-current={index === safeIndex ? "true" : undefined}
                className={`h-16 w-16 overflow-hidden rounded-md border-2 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c0d4] focus-visible:ring-offset-2 ${
                  index === safeIndex
                    ? "border-[#22c0d4]"
                    : "border-border hover:border-[#081129]/40"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
