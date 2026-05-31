import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePopularTestsFromDatabase, type PopularTest } from "@/hooks/usePopularTestsFromDatabase";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTestPrice } from "@/lib/utils";

const cleanName = (name: string) =>
  name
    .replace(/\s*[-–|].*$/, "")
    .replace(/\s+Blood Test$/i, "")
    .replace(/\s+for Enhanced Health$/i, "")
    .replace(/\s*\| Book Online today$/i, "")
    .trim();

// A real provider image is an absolute http(s) URL hosted by the provider
// (not a Lovable upload placeholder, not a local /kits/kit-* placeholder).
const PLACEHOLDER_PATTERNS = [
  /\/kits\/kit-(navy|turquoise|pink|black|white|coral)\.jpg$/i,
  /lovableproject\.com\/lovable-uploads\//i,
];
const isRealProviderImage = (url?: string | null): url is string =>
  !!url && /^https?:\/\//i.test(url) && !PLACEHOLDER_PATTERNS.some((re) => re.test(url));

const resolveImage = (t: PopularTest): string | null =>
  isRealProviderImage(t.image_url) ? t.image_url! : null;

/** Round-robin interleave by provider so the grid alternates providers */
const interleaveByProvider = (tests: PopularTest[]): PopularTest[] => {
  const groups = new Map<string, PopularTest[]>();
  for (const t of tests) {
    const arr = groups.get(t.provider_id) ?? [];
    arr.push(t);
    groups.set(t.provider_id, arr);
  }
  const buckets = Array.from(groups.values());
  const out: PopularTest[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const b of buckets) {
      const next = b.shift();
      if (next) {
        out.push(next);
        added = true;
      }
    }
  }
  return out;
};

const DreamHealthShowcase = () => {
  const navigate = useNavigate();
  const { data: popularTests, isLoading } = usePopularTestsFromDatabase(150);
  const trackRef = useRef<HTMLDivElement>(null);

  const orderedTests = useMemo(() => {
    if (!popularTests) return [];
    // Hard filter: must have real provider image AND a provider URL.
    const valid = popularTests.filter(
      (t) => isRealProviderImage(t.image_url) && !!t.url
    );
    // Hide Lola Health Cardiovascular
    const filtered = valid.filter((t) => {
      if (t.provider_id !== "lola-health") return true;
      return !/cardiovascular/i.test(t.test_name);
    });
    // Dedupe within each provider
    const seenPerProvider = new Set<string>();
    const deduped = filtered.filter((t) => {
      const key = `${t.provider_id}::${cleanName(t.test_name).toLowerCase()}`;
      if (seenPerProvider.has(key)) return false;
      seenPerProvider.add(key);
      return true;
    });
    // Cap at 3 per provider so 9 cards span at least 3 providers
    const perProvider = new Map<string, number>();
    const capped = deduped.filter((t) => {
      const n = perProvider.get(t.provider_id) ?? 0;
      if (n >= 3) return false;
      perProvider.set(t.provider_id, n + 1);
      return true;
    });
    // Round-robin interleave, then take 9
    return interleaveByProvider(capped).slice(0, 9);
  }, [popularTests]);

  const filmstripTests = orderedTests;
  // Quadruple the strip for a seamless loop
  const filmstripLoop = useMemo(
    () => [...filmstripTests, ...filmstripTests, ...filmstripTests, ...filmstripTests],
    [filmstripTests]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || filmstripTests.length === 0) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;

    const measureSetWidth = () => {
      const children = track.children;
      if (!children.length) return 0;
      let total = 0;
      for (let i = 0; i < filmstripTests.length && i < children.length; i++) {
        total += (children[i] as HTMLElement).offsetWidth;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.columnGap || style.gap || "0");
        if (i < filmstripTests.length - 1) total += gap;
      }
      return total;
    };

    let setWidth = measureSetWidth();

    const animate = () => {
      if (!setWidth) setWidth = measureSetWidth();
      position -= speed;
      if (setWidth > 0 && Math.abs(position) >= setWidth) {
        position += setWidth;
      }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [filmstripTests.length]);

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Filmstrip of tiles — same mixed-provider set as the grid below */}
      <div className="relative">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-3 sm:gap-4 px-4 sm:px-6 will-change-transform"
          >
            {isLoading || filmstripTests.length === 0
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative flex-shrink-0 w-[42vw] sm:w-[26vw] md:w-[19vw] lg:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-md"
                  >
                    <Skeleton className="w-full h-full bg-black/5" />
                  </div>
                ))
              : filmstripLoop.map((t, i) => (
                  <a
                    key={`${t.id}-${i}`}
                    href={t.url!}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="relative flex-shrink-0 w-[42vw] sm:w-[26vw] md:w-[19vw] lg:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-md bg-[#f6f7f9]"
                  >
                    <img
                      src={resolveImage(t)!}
                      alt={cleanName(t.test_name)}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                      className="w-full h-full object-contain p-4"
                    />
                  </a>
                ))}
          </div>
        </div>
      </div>

      {/* Headline + subtitle + CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center mt-10 sm:mt-14">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#08122b] md:text-5xl">
          ​Our  Partners Most Popular Tests
        </h2>
        <p className="mt-4 text-base sm:text-lg font-medium max-w-2xl mx-auto text-[#08122b]">
          ​
        </p>

        <div className="mt-7 flex justify-center">
          <button
            onClick={() => navigate("/assisted-test-finder")}
            className="text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-lg transition-colors bg-[#22bed3] focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e70d69] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Get my test match — 60 seconds, free
          </button>
        </div>

        {/* 9 mixed-provider test cards */}
        <div className="mt-12 sm:mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
            {isLoading &&
              Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-[360px] rounded-2xl bg-black/5" />
              ))}

            {!isLoading &&
              orderedTests.map((t, i) => {
                const isMostChosen = i < 3;
                return (
                  <article
                    key={t.id}
                    className="relative flex flex-col bg-white border border-black/5 shadow-sm hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
                  >
                    {isMostChosen && (
                      <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider text-white bg-[#e70d69] px-2.5 py-1 rounded-full shadow">
                        Most chosen
                      </span>
                    )}
                    <a
                      href={t.url!}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="aspect-[4/3] overflow-hidden bg-[#f6f7f9] block"
                    >
                      <img
                        src={resolveImage(t)!}
                        alt={t.test_name}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                        className="w-full h-full object-contain p-4"
                      />
                    </a>
                    <div className="p-5 flex flex-col flex-1 rounded-lg shadow-xl">
                      <p className="text-[11px] font-semibold tracking-wide uppercase text-[#22c0d4]">
                        {t.provider_name}
                      </p>
                      <a
                        href={t.url!}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="mt-1 text-lg font-heading font-bold text-[#081129] leading-snug hover:text-[#22c0d4] transition-colors"
                      >
                        {cleanName(t.test_name)}
                      </a>
                      {t.description && (
                        <p className="mt-2 text-sm text-[#081129]/70 leading-relaxed flex-1">
                          {t.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-[#081129] leading-none">
                            {formatTestPrice(t)}
                          </span>
                        </div>
                        <a
                          href={t.url!}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="text-sm font-semibold text-white bg-[#22c0d4] px-4 py-2 rounded-full hover:bg-[#1ba8ba] transition-colors"
                        >
                          View test
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DreamHealthShowcase;
