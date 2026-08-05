interface SectionSkeletonProps {
  /** Matches the background of the section being loaded. */
  tone?: "navy" | "white";
  /** Number of shimmer cards in the grid. */
  cards?: number;
  /** Minimum height so the swap doesn't jump. */
  minHeight?: number;
}

/**
 * Placeholder shown while a deferred homepage section loads.
 * Paints the section's own background so the global navy backdrop
 * never shows through as an apparently empty band.
 */
export const SectionSkeleton = ({
  tone = "navy",
  cards = 3,
  minHeight = 500,
}: SectionSkeletonProps) => {
  const isNavy = tone === "navy";
  const block = isNavy ? "bg-white/10" : "bg-slate-200/70";

  return (
    <section
      aria-hidden="true"
      className={`w-full py-8 sm:py-10 md:py-12 ${isNavy ? "bg-brand-navy" : "bg-white"}`}
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-16">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className={`h-3 w-40 rounded-full ${block}`} />
          <div className={`h-8 sm:h-10 w-2/3 max-w-xl rounded-lg mt-4 ${block}`} />
          <div className={`h-4 w-1/2 max-w-md rounded-md mt-3 ${block}`} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
            {Array.from({ length: cards }).map((_, index) => (
              <div
                key={index}
                className={`rounded-2xl ${block} h-48 sm:h-56`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionSkeleton;
