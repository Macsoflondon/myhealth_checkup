// Self-contained hover-expand gallery component
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImageData {
  src: string;
  alt: string;
  code: string;
  objectFit?: string;
}

export interface OverlayData {
  price?: number | null;
  biomarkerCount?: number | null;
  turnaround?: string | null;
}

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "smallTablet" | "largeTablet" | "desktop">(() => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 900) return "smallTablet";
    if (width < 1280) return "largeTablet";
    return "desktop";
  });

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint("mobile");
      else if (width < 900) setBreakpoint("smallTablet");
      else if (width < 1280) setBreakpoint("largeTablet");
      else setBreakpoint("desktop");
    };
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return breakpoint;
};

/* ─── Mobile horizontal carousel ─── */
const MobileCarousel = ({
  images,
  onTestClick,
  className,
}: {
  images: GalleryImageData[];
  onTestClick?: (image: GalleryImageData) => void;
  className?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = 180; // px per card
  const gap = 12;

  const scrollToIndex = useCallback(
    (idx: number) => {
      if (!scrollRef.current) return;
      const target = idx * (cardWidth + gap);
      scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
    },
    [cardWidth, gap]
  );

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const idx = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(idx, images.length - 1));
  }, [cardWidth, gap, images.length]);

  const goNext = () => {
    const next = Math.min(activeIndex + 1, images.length - 1);
    setActiveIndex(next);
    scrollToIndex(next);
  };

  const goPrev = () => {
    const prev = Math.max(activeIndex - 1, 0);
    setActiveIndex(prev);
    scrollToIndex(prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className={cn("relative w-full", className)}
    >
      {/* Scroll container */}
      <div className="relative">
        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-2 w-10 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to right, hsl(var(--background)), transparent)",
            opacity: activeIndex > 0 ? 1 : 0,
          }}
        />
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-2 w-10 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to left, hsl(var(--background)), transparent)",
            opacity: activeIndex < images.length - 1 ? 1 : 0,
          }}
        />

        {/* Left arrow */}
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-md disabled:opacity-0 transition-opacity"
          aria-label="Previous"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-foreground" />
        </button>

        {/* Right arrow */}
        <button
          onClick={goNext}
          disabled={activeIndex >= images.length - 1}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-md disabled:opacity-0 transition-opacity"
          aria-label="Next"
        >
          <ChevronRight className="h-3.5 w-3.5 text-foreground" />
        </button>

        {/* Horizontal scrollable strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-8 pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
              className="relative shrink-0 snap-start overflow-hidden rounded-xl bg-white cursor-pointer shadow-sm border border-border/30 active:scale-[0.97] transition-all"
              style={{ width: `min(${cardWidth}px, 48vw)`, height: 200 }}
              onClick={() => onTestClick?.(image)}
            >
              <img
                src={image.src}
                className="w-full h-[150px] object-contain p-1.5"
                alt={image.alt}
                loading="lazy"
              />
              <div className="px-1.5 pb-1.5 pt-0.5">
                <p className="text-[10px] font-bold text-brand-navy leading-tight truncate text-center">
                  {image.code}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dot indicators — always visible */}
      <div className="flex items-center justify-center gap-1.5 mt-3 pb-1">
        {images.map((_, i) => {
          // Group dots: show nearby dots, collapse distant ones
          const distance = Math.abs(i - activeIndex);
          if (distance > 4 && i !== 0 && i !== images.length - 1) return null;
          return (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                scrollToIndex(i);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-5 h-2 bg-brand-turquoise"
                  : distance <= 2
                    ? "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    : "w-1.5 h-1.5 bg-muted-foreground/20"
              )}
              aria-label={`Go to test ${i + 1}`}
            />
          );
        })}
      </div>

      {/* Swipe hint text */}
      <p className="text-[10px] text-center text-muted-foreground/60 mt-0.5">
        Swipe or tap arrows to browse • {images.length} tests
      </p>
    </motion.div>
  );
};

const HoverExpand_001 = ({
  images,
  className,
  onTestClick,
  getOverlayData: _getOverlayData,
}: {
  images: GalleryImageData[];
  className?: string;
  onTestClick?: (image: GalleryImageData) => void;
  getOverlayData?: (image: GalleryImageData) => OverlayData;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(0);
  const breakpoint = useBreakpoint();

  const config = {
    mobile: {
      layout: "carousel" as const,
      padding: "px-0",
    },
    smallTablet: {
      layout: "horizontal" as const,
      numVisible: 6,
      height: "min(36rem, 67vh)",
      gap: "gap-1.5",
      padding: "px-0",
    },
    largeTablet: {
      layout: "horizontal" as const,
      numVisible: 8,
      height: "min(42rem, 75vh)",
      gap: "gap-1.5",
      padding: "px-0",
    },
    desktop: {
      layout: "horizontal" as const,
      numVisible: Math.min(images.length, 8),
      height: "min(28rem, 42vh)",
      gap: "gap-1",
      padding: "px-0",
      maxWidth: "max-w-[1800px]",
    },
  }[breakpoint];

  // Mobile: compact horizontal carousel
  if (config.layout === "carousel") {
    return (
      <MobileCarousel
        images={images}
        onTestClick={onTestClick}
        className={className}
      />
    );
  }

  // Desktop/tablet: 4x ratio hover-expand
  const n = Math.min(images.length, config.numVisible);
  const collapsedPercent = 100 / (n + 3);
  const expandedPercent = 5 * collapsedPercent;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn("relative w-full", config.padding, className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn("w-full mx-auto", "maxWidth" in config ? config.maxWidth : "")}
      >
        <div className={cn("flex w-full items-center justify-center", config.gap)}>
          {images.slice(0, config.numVisible).map((image, index) => {
            const isActive = activeImage === index;
            const width = isActive ? `${expandedPercent}%` : `${collapsedPercent}%`;
            const initialWidth = `${collapsedPercent}%`;

            return (
              <motion.div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-3xl"
                initial={{ width: initialWidth, height: "20rem" }}
                animate={{ width, height: config.height }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => {
                  if (isActive && onTestClick) {
                    onTestClick(image);
                  } else {
                    setActiveImage(index);
                  }
                }}
                onHoverStart={() => setActiveImage(index)}
              >
                <img
                  src={image.src}
                  className={`w-full h-full ${image.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                  alt={image.alt}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-4 right-4 z-10"
                    >
                      <span className="inline-block bg-white/85 backdrop-blur-sm rounded-md px-3 py-1.5 text-xs font-bold text-brand-navy shadow-sm mt-8">
                        {image.code}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand_001 };
