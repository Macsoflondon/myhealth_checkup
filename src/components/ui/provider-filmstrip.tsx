// Provider filmstrip gallery — hover-expand carousel adapted for health provider showcase
// Adapted from the expand-on-hover pattern with myhealth checkup branding

import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export interface ProviderFilmstripImage {
  src: string;
  alt: string;
  label: string;
  link?: string;
  objectFit?: "cover" | "contain";
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

const MOBILE_PAGE_SIZE = 4;

export function ProviderFilmstrip({
  images,
  className,
}: {
  images: ProviderFilmstripImage[];
  className?: string;
}) {
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
      height: "min(16rem, 35vh)",
      padding: "px-2",
    },
    smallTablet: {
      layout: "horizontal" as const,
      numVisible: Math.min(images.length, 5),
      expandedPercent: 38,
      collapsedPercent: 15,
      height: "min(22rem, 40vh)",
      gap: "gap-2",
      padding: "px-0",
    },
    largeTablet: {
      layout: "horizontal" as const,
      numVisible: Math.min(images.length, 6),
      expandedPercent: 32,
      collapsedPercent: 13,
      height: "min(26rem, 45vh)",
      gap: "gap-2",
      padding: "px-0",
    },
    desktop: {
      layout: "horizontal" as const,
      numVisible: images.length,
      expandedWidth: "20rem",
      collapsedWidth: "5rem",
      height: "min(28rem, 50vh)",
      gap: "gap-1.5",
      padding: "px-0",
      maxWidth: "max-w-[1200px]",
    },
  }[breakpoint];

  const renderImageWrapper = (child: React.ReactNode, link?: string) => {
    if (link) {
      return (
        <Link to={link} className="block size-full">
          {child}
        </Link>
      );
    }
    return <>{child}</>;
  };

  // Mobile: vertical list with pagination
  if (config.layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
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
            className="grid grid-cols-2 gap-3 w-full"
          >
            {mobileImages.map((image, index) => (
              <motion.div
                key={`${mobilePage}-${index}`}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative w-full overflow-hidden rounded-xl bg-white border-2 border-brand-turquoise/20"
                style={{ height: config.height }}
              >
                {renderImageWrapper(
                  <div className="size-full flex items-center justify-center p-4">
                    <img
                      src={image.src}
                      className={`max-h-full max-w-full ${image.objectFit === "cover" ? "object-cover" : "object-contain"}`}
                      alt={image.alt}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-navy/80 to-transparent p-3">
                      <p className="text-xs font-semibold text-white text-center">{image.label}</p>
                    </div>
                  </div>,
                  image.link
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {totalMobilePages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
              disabled={mobilePage === 0}
              className="text-xs font-medium text-white/60 disabled:opacity-30 transition-opacity px-2 py-1"
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
                    mobilePage === i ? "bg-brand-turquoise w-6" : "bg-white/30"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setMobilePage((p) => Math.min(totalMobilePages - 1, p + 1))}
              disabled={mobilePage === totalMobilePages - 1}
              className="text-xs font-medium text-white/60 disabled:opacity-30 transition-opacity px-2 py-1"
            >
              Next →
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Horizontal layout for tablets and desktop
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
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
                ? isActive
                  ? config.expandedWidth
                  : config.collapsedWidth
                : isActive
                  ? `${config.expandedPercent}%`
                  : `${config.collapsedPercent}%`;

            const initialWidth =
              "expandedWidth" in config ? config.collapsedWidth : `${config.collapsedPercent}%`;

            return (
              <motion.div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-2xl bg-white border-2 border-brand-turquoise/20 hover:border-brand-turquoise/50 transition-colors"
                initial={{ width: initialWidth, height: "16rem" }}
                animate={{ width, height: config.height }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                onClick={() => setActiveImage(index)}
                onHoverStart={() => setActiveImage(index)}
              >
                {renderImageWrapper(
                  <>
                    <div className="size-full flex items-center justify-center p-4">
                      <img
                        src={image.src}
                        className={`max-h-full max-w-full ${image.objectFit === "cover" ? "object-cover" : "object-contain"}`}
                        alt={image.alt}
                      />
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-navy/90 to-transparent p-4"
                        >
                          <p className="text-sm font-bold text-white text-center">{image.label}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>,
                  image.link
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
