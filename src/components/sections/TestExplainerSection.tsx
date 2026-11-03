import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@/lib/router-compat";
import { Sparkles, Shield, Loader2 } from "lucide-react";
import {
  listExplainableTests,
  explainTestForVisitor,
} from "@/lib/ai/test-explainer.functions";
import type { TestExplainerResult } from "@/lib/ai/test-explainer.server";

/**
 * Homepage "Understand any test" panel. The visitor picks a live catalogue
 * test and Claude explains, in plain English, what it measures — strictly
 * from the provider's listed details, with a fixed server-side disclaimer.
 */
export const TestExplainerSection = () => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<TestExplainerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const { data: options = [], isPending: listLoading } = useQuery({
    queryKey: ["test-explainer-options"],
    queryFn: () => listExplainableTests(),
    staleTime: 10 * 60 * 1000,
  });

  const explain = useServerFn(explainTestForVisitor);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options.slice(0, 8);
    return options
      .filter(
        (option) =>
          option.testName.toLowerCase().includes(term) ||
          option.providerName.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [options, query]);

  const selected = options.find((option) => option.id === selectedId) ?? null;

  const handleExplain = async () => {
    if (!selectedId || pending) return;
    setPending(true);
    setError(null);
    try {
      const explanation = await explain({ data: { testId: selectedId } });
      if (!explanation) {
        setError("We could not load that test just now. Please try another.");
        return;
      }
      setResult(explanation);
    } catch {
      setError("The explainer is unavailable right now. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section
      aria-labelledby="test-explainer-heading"
      className="w-full bg-brand-navy"
    >
      <div className="homepage-section-inner py-10 sm:py-14">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="test-explainer-heading"
            className="font-extrabold text-[clamp(1.5rem,3.2vw,2.1rem)] tracking-[-0.02em] leading-[1.15] text-white m-0 font-[Montserrat]"
          >
            Understand{" "}
            <span className="text-[#22c0d4]">any test</span> in plain
            English
          </h2>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed mt-3 mb-0">
            Pick any test from the live catalogue and our AI explains what it
            measures, using only the provider&apos;s listed details.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-8 rounded-2xl border border-brand-turquoise/40 bg-white/[0.04] p-5 sm:p-7 shadow-glow-teal">
          <label
            htmlFor="test-explainer-search"
            className="block text-white font-semibold font-[Montserrat] text-sm sm:text-base mb-2"
          >
            Search for a test
          </label>
          <input
            id="test-explainer-search"
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedId(null);
            }}
            placeholder={
              listLoading ? "Loading the live catalogue…" : "e.g. full blood count, thyroid, vitamin D"
            }
            className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm sm:text-base text-brand-navy placeholder:text-brand-navy/50 focus:outline-none focus:ring-2 focus:ring-brand-turquoise"
          />

          {filtered.length > 0 && (
            <ul
              className="mt-3 grid gap-2"
              aria-label="Matching tests"
            >
              {filtered.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(option.id);
                      setQuery(option.testName);
                      setResult(null);
                      setError(null);
                    }}
                    className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 ${
                      selectedId === option.id
                        ? "border-brand-turquoise bg-brand-turquoise/15 text-white"
                        : "border-white/15 bg-white/[0.03] text-white/85 hover:border-brand-turquoise/60"
                    }`}
                  >
                    <span className="font-semibold">{option.testName}</span>
                    <span className="block text-xs text-white/60 mt-0.5">
                      {option.providerName}
                      {option.price != null &&
                        ` · £${option.price.toFixed(2)}`}
                      {option.biomarkerCount != null &&
                        ` · ${option.biomarkerCount} biomarkers`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleExplain}
              disabled={!selectedId || pending}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-brand-turquoise text-white shadow-glow-teal hover:bg-brand-pink hover:shadow-glow-pink focus-visible:outline-none font-bold font-[Montserrat] text-base px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              )}
              {pending ? "Explaining…" : "Explain this test"}
            </button>
            <span className="flex items-center gap-1 text-white/70 text-xs">
              <Shield className="w-3 h-3 shrink-0" aria-hidden="true" /> No
              account required
            </span>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-center text-sm text-[#ffb3c8]">
              {error}
            </p>
          )}

          {result && selected && (
            <div className="mt-6 rounded-xl border border-white/15 bg-white p-5 sm:p-6 text-left">
              <h3 className="font-bold font-[Montserrat] text-brand-navy text-lg m-0">
                {selected.testName}
              </h3>
              <p className="text-brand-navy/60 text-xs mt-1 mb-0">
                {selected.providerName}
              </p>

              <p className="text-brand-navy text-sm sm:text-base leading-relaxed mt-4">
                {result.explanation.summary}
              </p>

              <h4 className="font-semibold font-[Montserrat] text-brand-navy text-sm mt-5 mb-2">
                What it measures
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-brand-navy/90 text-sm">
                {result.explanation.whatItMeasures.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h4 className="font-semibold font-[Montserrat] text-brand-navy text-sm mt-5 mb-2">
                Who commonly considers it
              </h4>
              <p className="text-brand-navy/90 text-sm leading-relaxed m-0">
                {result.explanation.whoMightConsider}
              </p>

              <h4 className="font-semibold font-[Montserrat] text-brand-navy text-sm mt-5 mb-2">
                Sample and result time
              </h4>
              <p className="text-brand-navy/90 text-sm leading-relaxed m-0">
                {result.explanation.collectionExplained}
              </p>

              <p className="text-brand-navy/60 text-xs leading-relaxed mt-5 border-t border-brand-navy/10 pt-3 mb-0">
                {result.disclaimer}
              </p>

              <div className="mt-4 text-center">
                <Link
                  to="/compare"
                  className="inline-flex items-center justify-center gap-2 bg-brand-navy text-white font-bold font-[Montserrat] text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-brand-pink"
                >
                  Compare prices for tests like this
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestExplainerSection;
