import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bloodTestKit from "@/assets/blood-test-kit.jpg";
import kitTurquoise from "/lovable-uploads/d08361a9-eb24-4de7-8982-f4f1dc715966.png";
import kitPink from "@/assets/kits/kit-pink.jpg";
import kitNavy from "@/assets/kits/kit-navy.jpg";
import kitWhite from "/lovable-uploads/79ccc154-0fc1-4714-84e0-a7f0a05ca95e.png";
import kitBlack from "/lovable-uploads/7b46e3e8-b059-4983-ac65-c6fa21f00e9c.png";
import kitCoral from "@/assets/kits/kit-coral.jpg";
import medichecksAdvancedWellMan from "@/assets/kits/medichecks-advanced-well-man.png";
import { usePopularTestsFromDatabase, type PopularTest } from "@/hooks/usePopularTestsFromDatabase";
import { Skeleton } from "@/components/ui/skeleton";
import ProviderTestDetailModal from "@/components/providers/ProviderTestDetailModal";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";

// Rotating image pool so each popular kit gets a visual without duplicating provider data
const kitImages = [kitTurquoise, kitPink, kitNavy, kitBlack, kitWhite, kitCoral, bloodTestKit];

const cleanName = (name: string) =>
  name
    .replace(/\s*[-–|].*$/, "")
    .replace(/\s+Blood Test$/i, "")
    .replace(/\s+for Enhanced Health$/i, "")
    .replace(/\s*\| Book Online today$/i, "")
    .trim();

// Per-test image overrides keyed by normalised test name
const testImageOverrides: Record<string, string> = {
  "advanced well man": medichecksAdvancedWellMan,
};

const getOverrideImage = (name: string) =>
  testImageOverrides[cleanName(name).toLowerCase()];

const resolveImage = (t: PopularTest, i: number) =>
  getOverrideImage(t.test_name) || t.image_url || kitImages[i % kitImages.length];

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
  const { data: popularTests, isLoading } = usePopularTestsFromDatabase(18);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedTest, setSelectedTest] = useState<PopularTest | null>(null);

  const orderedTests = useMemo(() => {
    if (!popularTests) return [];
    // 1. Hide Lola Health Cardiovascular
    const filtered = popularTests.filter((t) => {
      if (t.provider_id !== "lola-health") return true;
      return !/cardiovascular/i.test(t.test_name);
    });
    // 2. Round-robin interleave so providers don't cluster
    const interleaved = interleaveByProvider(filtered);
    // 3. Cap at 12 cards (drops two desktop rows from the bottom)
    return interleaved.slice(0, 12);
  }, [popularTests]);

  const filmstripTests = orderedTests.slice(0, 8);
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
    const speed = 0.5; // moderate slow

    const measureSetWidth = () => {
      const children = track.children;
      if (!children.length) return 0;
      let total = 0;
      for (let i = 0; i < filmstripTests.length && i < children.length; i++) {
        total += (children[i] as HTMLElement).offsetWidth;
        // include the gap between items
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
      {/* Filmstrip of tiles — sourced from the popular tests below */}
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
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative flex-shrink-0 w-[42vw] sm:w-[26vw] md:w-[19vw] lg:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-md"
                  >
                    <Skeleton className="w-full h-full bg-black/5" />
                  </div>
                ))
              : filmstripLoop.map((t, i) => (
                  <div
                    key={`${t.id}-${i}`}
                    className="relative flex-shrink-0 w-[42vw] sm:w-[26vw] md:w-[19vw] lg:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-md bg-[#f6f7f9]"
                  >
                    <img
                      src={resolveImage(t, i)}
                      alt={cleanName(t.test_name)}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = kitImages[i % kitImages.length];
                      }}
                      className="w-full h-full p-4 object-fill"
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Headline + subtitle + CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center mt-10 sm:mt-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight leading-[1.05] text-[#08122b] lg:text-6xl">
          ​Our Providers Most Popular Tests
        </h2>
        <p className="mt-4 text-base sm:text-lg font-medium max-w-2xl mx-auto text-[#08122b]">
          The super simple way to find a test, match a provider, and get it done.
        </p>

        <div className="mt-7 flex justify-center">
          <button
            onClick={() => navigate("/assisted-test-finder")}
            className="text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-lg transition-colors bg-[#22bed3] focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e70d69] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Start your health journey
          </button>
        </div>

        {/* Most popular test kit cards — sourced from the same data as the toolbar */}
        <div className="mt-12 sm:mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
            {isLoading &&
              Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-[360px] rounded-2xl bg-black/5" />
              ))}

            {!isLoading &&
              orderedTests.map((t, i) => (
                <article
                  key={t.id}
                  className="flex flex-col bg-white border border-black/5 shadow-sm hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#f6f7f9]">
                    <img
                      src={resolveImage(t, i)}
                      alt={t.test_name}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = kitImages[i % kitImages.length];
                      }}
                      className="w-full h-full p-4 object-fill"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1 rounded-lg shadow-xl">
                    <p className="text-[11px] font-semibold tracking-wide uppercase text-[#22c0d4]">
                      {t.provider_name}
                    </p>
                    <h3 className="mt-1 text-lg font-heading font-bold text-[#081129] leading-snug">
                      {cleanName(t.test_name)}
                    </h3>
                    <p className="mt-2 text-sm text-[#081129]/70 leading-relaxed flex-1">
                      {t.description ||
                        `Comprehensive screening covering ${t.biomarker_count || "key"} biomarkers. ${t.sample_type || "Blood sample"} collection.`}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-[#081129]">
                        {t.base_price && t.base_price > 0 ? `from £${t.base_price}` : `£${t.price}`}
                      </span>
                      <button
                        onClick={() => setSelectedTest(t)}
                        className="text-sm font-semibold text-white bg-[#22c0d4] px-4 py-2 rounded-full hover:bg-[#1ba8ba] transition-colors"
                      >
                        View kit
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>

      <ProviderTestDetailModal
        test={
          selectedTest
            ? ({
                id: selectedTest.id,
                provider_id: selectedTest.provider_id,
                test_name: selectedTest.test_name,
                description: selectedTest.description,
                price: selectedTest.price,
                category: selectedTest.category,
                sample_type: selectedTest.sample_type,
                biomarker_count: selectedTest.biomarker_count,
                url: selectedTest.url,
                biomarkers_list: selectedTest.markers,
                turnaround_days_text: selectedTest.turnaround_days_text,
                base_price: selectedTest.base_price,
                collection_options: selectedTest.collection_options,
              } satisfies ProviderTestCardData)
            : null
        }
        providerName={selectedTest?.provider_name || ""}
        open={!!selectedTest}
        onOpenChange={(o) => !o && setSelectedTest(null)}
      />
    </section>
  );
};

export default DreamHealthShowcase;
