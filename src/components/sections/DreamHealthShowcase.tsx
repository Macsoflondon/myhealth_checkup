import { useMemo } from "react";
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

const PLACEHOLDER_PATTERNS = [
  /\/kits\/kit-(navy|turquoise|pink|black|white|coral)\.jpg$/i,
  /lovableproject\.com\/lovable-uploads\//i,
];
const isRealProviderImage = (url?: string | null): url is string =>
  !!url && /^https?:\/\//i.test(url) && !PLACEHOLDER_PATTERNS.some((re) => re.test(url));

const resolveImage = (t: PopularTest): string | null =>
  isRealProviderImage(t.image_url) ? t.image_url! : null;

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

  const orderedTests = useMemo(() => {
    if (!popularTests) return [];
    const valid = popularTests.filter(
      (t) => isRealProviderImage(t.image_url) && !!t.url
    );
    const filtered = valid.filter((t) => {
      if (t.provider_id !== "lola-health") return true;
      return !/cardiovascular/i.test(t.test_name);
    });
    const seenPerProvider = new Set<string>();
    const deduped = filtered.filter((t) => {
      const key = `${t.provider_id}::${cleanName(t.test_name).toLowerCase()}`;
      if (seenPerProvider.has(key)) return false;
      seenPerProvider.add(key);
      return true;
    });
    const perProvider = new Map<string, number>();
    const capped = deduped.filter((t) => {
      const n = perProvider.get(t.provider_id) ?? 0;
      if (n >= 3) return false;
      perProvider.set(t.provider_id, n + 1);
      return true;
    });
    return interleaveByProvider(capped).slice(0, 9);
  }, [popularTests]);

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#08122b] md:text-5xl">
          Our Partners Most Popular Tests
        </h2>

        <div className="mt-7 flex justify-center">
          <button
            onClick={() => navigate("/assisted-test-finder")}
            className="text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-lg transition-colors bg-[#22bed3] focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e70d69] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Get my test match — 60 seconds, free
          </button>
        </div>

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
                          See what's tested
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
