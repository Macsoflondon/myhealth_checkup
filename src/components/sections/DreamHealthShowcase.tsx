/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { type PopularTest } from "@/hooks/usePopularTestsFromDatabase";
import { useHomepagePopularShowcase } from "@/hooks/queries/use-homepage-test-showcase";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTestPrice } from "@/lib/utils";
import ProviderTestDetailModal from "@/components/providers/ProviderTestDetailModal";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";
import { isGenericDescription, resolveTestSummary } from "@/lib/test-summary";
import { resolveTestCardImage } from "@/lib/resolve-test-card-image";
import { TestCardImage } from "@/components/tests/test-card-image";
import { useTestDetailsByIds } from "@/hooks/queries/useTestDetailsByIds";

const withFrom = (s: string) => (s && !/^from\b/i.test(s) ? `from ${s}` : s);

const toCardData = (t: PopularTest): ProviderTestCardData => ({
  id: t.id,
  provider_id: t.provider_id,
  test_name: t.test_name,
  description: t.description ?? null,
  price: t.price ?? null,
  category: t.category ?? null,
  sample_type: t.sample_type ?? null,
  biomarker_count: t.biomarker_count ?? null,
  url: t.url ?? null,
  url_verified: t.url_verified ?? null,
  biomarkers_list: (t.markers as any) ?? null,
  turnaround_days_text: t.turnaround_days_text ?? null,
  base_price: t.base_price ?? null,
  collection_options: (t.collection_options as any) ?? null,
  total_expected_cost: t.total_expected_cost ?? null,
  collection_fee_type: t.collection_fee_type ?? null,
  collection_fee_amount: t.collection_fee_amount ?? null,
  home_phlebotomy_cost: t.home_phlebotomy_cost ?? null,
  image_url: resolveTestCardImage({
    providerId: t.provider_id,
    isAddon: t.is_addon,
    imageUrl: t.image_url,
    testName: t.test_name,
  }),
  is_addon: t.is_addon ?? false,
});

const cleanName = (name: string) =>
  name
    .replace(/\s*[-–|].*$/, "")
    .replace(/\s+Blood Test$/i, "")
    .replace(/\s+for Enhanced Health$/i, "")
    .replace(/\s*\| Book Online today$/i, "")
    .trim();

/** Short, factual sample-method label for the compact card chips. */
const sampleLabel = (t: PopularTest): string | null => {
  const raw = (t.sample_type || "").trim();
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes("finger")) return "Finger-prick sample";
  if (s.includes("venous")) return "Venous blood sample";
  if (s.includes("saliva")) return "Saliva sample";
  if (s.includes("urine")) return "Urine sample";
  if (s.includes("stool") || s.includes("faecal") || s.includes("fecal"))
    return "Stool sample";
  return raw;
};

/** Turnaround text with non-guaranteed wording (compliance standard). */
const turnaroundLabel = (t: PopularTest): string | null => {
  const raw = t.turnaround_days_text?.trim();
  if (!raw || !/\d/.test(raw)) return null; // ignore junk values like "results"
  if (/typically|estimated|up to|~/i.test(raw)) return raw;
  return `typically ${raw.charAt(0).toLowerCase()}${raw.slice(1)}`;
};

const markerName = (m: unknown): string =>
  typeof m === "string" ? m : ((m as { value?: string } | null)?.value ?? "");

/** Provider description when published, otherwise the same factual summary
 *  the rest of the platform generates from the listing's own data. Small
 *  panels also name the biomarkers they actually measure. */
const descriptionFor = (t: PopularTest): string => {
  const provided = t.description?.trim();
  if (provided && !isGenericDescription(provided)) return provided;

  const markers = (Array.isArray(t.markers) ? t.markers : [])
    .map(markerName)
    .filter(Boolean);

  if (markers.length > 0 && markers.length <= 6) {
    const list =
      markers.length === 1
        ? markers[0]
        : `${markers.slice(0, -1).join(", ")} and ${markers[markers.length - 1]}`;
    return `Measures ${list}.`;
  }

  const summary = resolveTestSummary(null, {
    testName: cleanName(t.test_name),
    providerName: t.provider_name ?? null,
    measurementCount: t.biomarker_count ?? null,
    sampleType: t.sample_type ?? null,
    turnaroundText: t.turnaround_days_text ?? null,
    category: t.category ?? null,
  });

  if (summary) {
    return markers.length > 0
      ? `${summary} Includes ${markers.slice(0, 5).join(", ")} and more.`
      : summary;
  }

  return `${cleanName(t.test_name)} from ${t.provider_name}.`;
};

const resolveImage = (t: PopularTest): string | null =>
  resolveTestCardImage({
    providerId: t.provider_id,
    testName: t.test_name,
    isAddon: t.is_addon,
    imageUrl: t.image_url,
  });

const DreamHealthShowcase = () => {
  const navigate = useNavigate();
  const { data: popularTests, isLoading } = useHomepagePopularShowcase();
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedTest, setSelectedTest] = useState<PopularTest | null>(null);
  const orderedTests = popularTests ?? [];

  const visibleIds = useMemo(
    () => orderedTests.map((t) => t.id),
    [orderedTests],
  );
  const details = useTestDetailsByIds(visibleIds);

  const enrichedTests = useMemo(
    () =>
      orderedTests.map((t) => {
        const detail = details[t.id];
        if (!detail) return t;
        const markers = Array.isArray(detail.biomarkersList)
          ? (detail.biomarkersList as unknown[]).filter(
              (m): m is string =>
                typeof m === "string" && m.length > 1 && m.length < 50,
            )
          : t.markers;
        return {
          ...t,
          description: detail.description ?? t.description,
          markers,
          collection_options:
            (detail.collectionOptions as PopularTest["collection_options"]) ??
            t.collection_options,
        };
      }),
    [orderedTests, details],
  );

  const filmstripTests = enrichedTests;
  const filmstripLoop = useMemo(
    () => [
      ...filmstripTests,
      ...filmstripTests,
      ...filmstripTests,
      ...filmstripTests,
    ],
    [filmstripTests],
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
    <section className="bg-white pt-8 pb-12 sm:pt-10 sm:pb-16 md:pt-12 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 sm:w-12 bg-brand-pink" />
          <span className="text-brand-turquoise text-base sm:text-lg font-semibold uppercase tracking-[0.25em]">
            Tests from all eight providers
          </span>
          <div className="h-px w-8 sm:w-12 bg-brand-pink" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold leading-tight text-[#08122b]">
          Find your perfect test match
        </h2>
        <p className="mt-4 text-base lg:text-lg text-[#081129]/70 max-w-2xl mx-auto whitespace-pre-line">
          Compare provider-listed popular tests and unranked catalogue
          selections.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/assisted-test-finder")}
            className="text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-lg transition-colors bg-[#22bed3] hover:bg-brand-pink focus:outline-hidden focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#e70d69] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Get my test match — 60 seconds, free
          </button>
        </div>
      </div>

      {/* Carousel filmstrip — same mixed-provider set as the grid below */}
      <div className="relative mt-8 sm:mt-10">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
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
                    className="relative flex-shrink-0 w-[42vw] sm:w-[26vw] md:w-[19vw] lg:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-lg"
                  >
                    <Skeleton className="w-full h-full bg-black/5" />
                  </div>
                ))
              : filmstripLoop.map((t, i) => (
                  <button
                    key={`${t.id}-${i}`}
                    type="button"
                    onClick={() => setSelectedTest(t)}
                    aria-label={`View details for ${cleanName(t.test_name)}`}
                    className="relative flex-shrink-0 w-[42vw] sm:w-[26vw] md:w-[19vw] lg:w-[17vw] aspect-square rounded-2xl overflow-hidden shadow-lg bg-white"
                  >
                    <TestCardImage
                      imageUrl={resolveImage(t)}
                      testName={t.test_name}
                      providerName={t.provider_name}
                      className="p-4"
                    />
                  </button>
                ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8 sm:mt-10">
        {/* 9 mixed-provider test cards — uniform sizing */}
        <div className="mt-9 sm:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left auto-rows-fr">
            {isLoading &&
              Array.from({ length: 9 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[420px] rounded-2xl bg-black/5"
                />
              ))}

            {!isLoading &&
              enrichedTests.map((t) => {
                const isMostChosen = t.is_popular === true;
                const open = () => setSelectedTest(t);
                return (
                  <article
                    key={t.id}
                    className="relative flex flex-col h-full bg-white border border-black/5 shadow-lg hover:shadow-2xl transition-shadow rounded-2xl overflow-hidden"
                  >
                    {isMostChosen && (
                      <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider text-white bg-[#e70d69] px-2.5 py-1 rounded-full shadow-sm">
                        Provider-listed popular
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={open}
                      className="relative aspect-[4/3] overflow-hidden bg-white block flex-shrink-0 w-full"
                      aria-label={`View details for ${cleanName(t.test_name)}`}
                    >
                      <TestCardImage
                        imageUrl={resolveImage(t)}
                        testName={t.test_name}
                        providerName={t.provider_name}
                        className="p-4"
                      />
                    </button>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[11px] font-semibold tracking-wide uppercase text-[#22c0d4]">
                        {t.provider_name}
                      </p>
                      <button
                        type="button"
                        onClick={open}
                        className="mt-1 text-left text-lg font-heading font-bold text-[#081129] leading-snug hover:text-[#22c0d4] transition-colors line-clamp-2 min-h-[3.25rem]"
                      >
                        {cleanName(t.test_name)}
                      </button>
                      <p className="mt-2 text-sm text-[#081129]/70 leading-relaxed line-clamp-3">
                        {descriptionFor(t)}
                      </p>

                      {(typeof t.biomarker_count === "number" &&
                        t.biomarker_count > 0) ||
                      turnaroundLabel(t) ||
                      sampleLabel(t) ? (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 flex-1 content-start">
                          {typeof t.biomarker_count === "number" &&
                            t.biomarker_count > 0 && (
                              <span className="inline-flex items-center rounded-full bg-[#22c0d4]/10 text-[#0b6b78] border border-[#22c0d4]/30 px-2.5 py-1 text-[11px] font-semibold">
                                {t.biomarker_count}{" "}
                                {t.biomarker_count === 1
                                  ? "biomarker"
                                  : "biomarkers"}
                              </span>
                            )}
                          {turnaroundLabel(t) && (
                            <span className="inline-flex items-center rounded-full border border-black/10 bg-[#f6f7f9] px-2.5 py-1 text-[11px] font-medium text-[#081129]/70">
                              {turnaroundLabel(t)}
                            </span>
                          )}
                          {sampleLabel(t) && (
                            <span className="inline-flex items-center rounded-full border border-black/10 bg-[#f6f7f9] px-2.5 py-1 text-[11px] font-medium text-[#081129]/70">
                              {sampleLabel(t)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1" aria-hidden="true" />
                      )}

                      <div className="mt-4 flex items-end justify-between">
                        <span className="text-xl font-bold text-[#081129] leading-none">
                          {withFrom(formatTestPrice(t))}
                        </span>
                        <button
                          type="button"
                          onClick={open}
                          className="text-sm font-semibold text-white bg-[#22c0d4] px-4 py-2 rounded-full hover:bg-[#1ba8ba] transition-colors"
                        >
                          See what's tested
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </div>

      <ProviderTestDetailModal
        test={selectedTest ? toCardData(selectedTest) : null}
        providerName={selectedTest?.provider_name || ""}
        open={!!selectedTest}
        onOpenChange={(o) => !o && setSelectedTest(null)}
      />
    </section>
  );
};

export default DreamHealthShowcase;
