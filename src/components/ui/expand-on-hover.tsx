// Self-contained hover-expand gallery component
// Dependencies: framer-motion, clsx, tailwind-merge, Tailwind CSS
// Usage:
// <HoverExpand_001 images={[{ src: "/img.png", alt: "...", code: "Label", objectFit?: "contain" }]} />

import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

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

const MOBILE_PAGE_SIZE = 10;

const HoverExpand_001 = ({
  images,
  className,
}: {
  images: { src: string; alt: string; code: string; objectFit?: string }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);
  const [mobilePage, setMobilePage] = useState(0);
  const breakpoint = useBreakpoint();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalMobilePages = Math.ceil(images.length / MOBILE_PAGE_SIZE);
  const mobileImages = images.slice(
    mobilePage * MOBILE_PAGE_SIZE,
    (mobilePage + 1) * MOBILE_PAGE_SIZE
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 60;
    if (diff > threshold && mobilePage < totalMobilePages - 1) {
      setMobilePage((p) => p + 1);
    } else if (diff < -threshold && mobilePage > 0) {
      setMobilePage((p) => p - 1);
    }
  }, [mobilePage, totalMobilePages]);

  const config = {
    mobile: {
      layout: "list" as const,
      numVisible: MOBILE_PAGE_SIZE,
      height: "min(20rem, 40vh)",
      padding: "px-0",
    },
    smallTablet: {
      layout: "horizontal" as const,
      numVisible: 6,
      expandedPercent: 40,
      collapsedPercent: 12,
      height: "min(24rem, 45vh)",
      gap: "gap-1.5",
      padding: "px-0",
    },
    largeTablet: {
      layout: "horizontal" as const,
      numVisible: 8,
      expandedPercent: 35,
      collapsedPercent: 9,
      height: "min(28rem, 50vh)",
      gap: "gap-1.5",
      padding: "px-0",
    },
    desktop: {
      layout: "horizontal" as const,
      numVisible: images.length,
      expandedWidth: "18rem",
      collapsedWidth: "2.8rem",
      height: "min(36.875rem, 60vh)",
      gap: "gap-1",
      padding: "px-0",
      maxWidth: "max-w-[1400px]",
    },
  }[breakpoint];

  if (config.layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className={cn("relative w-full", config.padding, className)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mobilePage}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4 w-full"
          >
            {mobileImages.map((image, index) => (
              <motion.div
                key={`${mobilePage}-${index}`}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative w-full overflow-hidden rounded-2xl"
                style={{ height: config.height }}
                onClick={() => setActiveImage(index)}
              >
                <img src={image.src} className={`size-full ${image.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`} alt={image.alt} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-bold text-brand-navy">{image.code}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {totalMobilePages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6 pb-4">
            <button
              onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
              disabled={mobilePage === 0}
              className="text-xs font-medium text-muted-foreground disabled:opacity-30 transition-opacity px-2 py-1"
            >
              ← Prev
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalMobilePages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobilePage(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    mobilePage === i ? "bg-foreground w-6" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setMobilePage((p) => Math.min(totalMobilePages - 1, p + 1))}
              disabled={mobilePage === totalMobilePages - 1}
              className="text-xs font-medium text-muted-foreground disabled:opacity-30 transition-opacity px-2 py-1"
            >
              Next →
            </button>
          </div>
        )}
      </motion.div>
    );
  }

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

            const width =
              "expandedWidth" in config
                ? isActive ? config.expandedWidth : config.collapsedWidth
                : isActive ? `${config.expandedPercent}%` : `${config.collapsedPercent}%`;

            const initialWidth = "expandedWidth" in config ? config.collapsedWidth : `${config.collapsedPercent}%`;

            return (
              <motion.div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-3xl"
                initial={{ width: initialWidth, height: "20rem" }}
                animate={{ width, height: config.height }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute flex h-full w-full flex-col items-end justify-end p-4"
                    >
                      <p className="text-left text-xs font-bold text-brand-navy">{image.code}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <img src={image.src} className={`size-full ${image.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`} alt={image.alt} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand_001 };
