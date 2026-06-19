import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { RefreshCw, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useTestFinder, testFinderStore } from "@/stores/testFinderStore";
import { buildExplanation } from "@/lib/testFinder/scoring";
import { computeTotalCost, formatGBP } from "@/lib/testFinder/cost";
import { VerificationMark } from "@/components/testFinder/VerificationMark";

const TestFinderRecommendationsPage = () => {
  const navigate = useNavigate();
  const profile = useTestFinder((s) => s.profile);
  const recs = useTestFinder((s) => s.recommendations);
  const selected = useTestFinder((s) => s.selectedTestIds);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#081129] text-white">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">No quiz results yet</h1>
          <button
            onClick={() => navigate("/find-test")}
            className="bg-brand-turquoise text-[#081129] font-semibold px-5 py-2.5 rounded-full"
          >
            Start the quiz
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const compareNow = () => {
    testFinderStore.setSelected(recs.slice(0, 3).map((r) => r.id));
    navigate("/find-test/compare");
  };

  return (
    <>
      <Helmet>
        <title>Your Recommended Tests | myhealth checkup</title>
        <meta
          name="description"
          content="Personalised health test recommendations based on your goals, concerns, and preferences."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/find-test/recommendations" />
      </Helmet>
      <div className="min-h-screen bg-[#081129] text-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Your recommended tests</h1>
              <p className="text-white/65 mt-2 text-sm sm:text-base">
                Ranked by relevance to your profile. Add the ones you'd like to compare.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/find-test")}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white border border-white/15 px-4 py-2 rounded-full"
              >
                <RefreshCw className="w-4 h-4" /> Restart quiz
              </button>
              <button
                onClick={compareNow}
                disabled={recs.length === 0}
                className="flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/90 disabled:opacity-40 text-white font-semibold text-sm px-5 py-2 rounded-full"
              >
                Compare top 3 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {recs.length === 0 ? (
            <div className="bg-[#0F2238] border border-white/10 rounded-2xl p-10 text-center text-white/60">
              No matches yet. Try restarting the quiz with broader preferences.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recs.map((t) => {
                const lines = buildExplanation(t, profile);
                const cost = computeTotalCost(t);
                const isSelected = selected.includes(t.id);
                return (
                  <article
                    key={t.id}
                    className="bg-[#0F2238] border border-white/10 rounded-2xl p-5 flex flex-col"
                  >
                    <div className="text-brand-turquoise font-semibold text-sm">
                      {t.provider}
                    </div>
                    <h3 className="text-white font-semibold text-lg mt-1 leading-snug">
                      {t.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <VerificationMark status={t.verification.price}>
                        <span className="text-brand-pink font-bold text-2xl">
                          {formatGBP(t.price)}
                        </span>
                      </VerificationMark>
                      <span className="text-xs text-white/50">
                        {cost.isEstimate ? "from" : "all-in"} {formatGBP(cost.total)}
                      </span>
                    </div>
                    <div className="text-xs text-white/55 mt-1">
                      {t.biomarkers} biomarkers · {t.turnaround_label}
                    </div>

                    {lines.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {lines.map((l, i) => (
                          <li
                            key={i}
                            className="text-xs text-white/75 leading-relaxed pl-3 border-l-2 border-brand-turquoise/60"
                          >
                            {l}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-4 flex gap-2">
                      <button
                        onClick={() => testFinderStore.toggleSelected(t.id)}
                        className={`flex-1 text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${
                          isSelected
                            ? "bg-brand-turquoise text-[#081129] border-brand-turquoise"
                            : "border-white/20 text-white/80 hover:border-brand-turquoise"
                        }`}
                      >
                        {isSelected ? "Added to compare" : "Add to compare"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TestFinderRecommendationsPage;
