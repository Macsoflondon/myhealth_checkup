import { useQuery } from "@tanstack/react-query";
import { getRelatedTests } from "@/services/related-tests.functions";
import { RELATED_TESTS_DISCLAIMER } from "@/lib/recommendations/related-tests";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export interface RelatedTestsSectionProps {
  testId: string;
}

/** "You may also like": AI-suggested complementary tests from the catalogue. */
export const RelatedTestsSection = ({ testId }: RelatedTestsSectionProps) => {
  const { data } = useQuery({
    queryKey: ["related-tests", testId],
    queryFn: () => getRelatedTests({ data: { testId } }),
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
  const tests = data?.tests ?? [];
  if (tests.length === 0) return null;

  return (
    <section
      aria-labelledby="related-tests-heading"
      className="container mx-auto px-4 sm:px-6 py-10"
    >
      <h2
        id="related-tests-heading"
        className="font-heading font-bold text-2xl sm:text-3xl text-brand-navy"
      >
        You may also like
      </h2>
      <p className="mt-1 text-sm text-brand-navy/70">
        Suggested tests to compare, chosen with Lovable AI for related
        biomarkers this test does not cover.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tests.map((t) => (
          <li key={t.id}>
            <a
              href={`/provider/${t.providerId}/tests/${t.id}`}
              className="flex h-full min-h-[44px] flex-col rounded-2xl border border-brand-navy/10 bg-background p-5 shadow-e2 transition-colors hover:border-brand-turquoise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-brand-turquoise">
                {t.providerName}
              </span>
              <span className="mt-1 font-heading font-bold text-brand-navy">
                {t.name}
              </span>
              <span className="mt-2 text-xs text-brand-navy/70">
                {t.biomarkerCount
                  ? `${t.biomarkerCount} biomarkers`
                  : "Biomarkers not stated by provider"}
                {t.newBiomarkers > 0
                  ? ` · ${t.newBiomarkers} not in this test`
                  : ""}
              </span>
              <span className="mt-auto pt-4">
                <span className="block font-heading text-xl font-extrabold text-brand-navy tabular-nums">
                  {gbp.format(t.totalExpectedCost)}
                </span>
                <span className="text-xs text-brand-navy/60">
                  Total expected cost
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-brand-navy/60">
        {RELATED_TESTS_DISCLAIMER}
      </p>
    </section>
  );
};
