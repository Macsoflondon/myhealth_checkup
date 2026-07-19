import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Beaker, Droplets, ShieldCheck } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/lib/seo";

const SLUG = "ferritin-vs-iron-comparison-guide";
const TITLE = "Ferritin vs Iron: What's the Difference and Which Test Do You Need?";
const DESCRIPTION =
  "Independent 2026 UK guide comparing ferritin and serum iron blood tests. Understand what each measures, when to test, healthy ranges, and how to interpret results for energy, fatigue and iron deficiency.";
const CANONICAL = `${BASE_URL}/blog/${SLUG}`;
const UPDATED = "2026-07-19";

const comparisonRows = [
  {
    trait: "What it measures",
    ferritin: "Stored iron inside cells (mainly liver, spleen, bone marrow).",
    iron: "Iron currently circulating in blood, bound to transferrin.",
  },
  {
    trait: "Best for detecting",
    ferritin: "Early iron deficiency, depleted stores, cause of fatigue.",
    iron: "Acute changes, iron overload, response to supplementation.",
  },
  {
    trait: "Typical UK reference range",
    ferritin: "30 – 300 ng/mL (men), 15 – 200 ng/mL (women)",
    iron: "10 – 30 µmol/L (varies by lab and time of day)",
  },
  {
    trait: "Affected by inflammation",
    ferritin: "Yes — can appear falsely normal or high during infection.",
    iron: "Less so, but drops during acute illness.",
  },
  {
    trait: "Time-of-day sensitivity",
    ferritin: "Stable — any time of day is fine.",
    iron: "Highest in the morning; fast for accurate reading.",
  },
  {
    trait: "Sample type",
    ferritin: "Finger-prick or venous.",
    iron: "Usually venous (part of an iron studies panel).",
  },
];

const whenToTest = [
  {
    label: "Persistent tiredness or low energy",
    detail:
      "Ferritin is the more useful first test — stores drop before circulating iron does, so low ferritin flags deficiency months earlier.",
  },
  {
    label: "Heavy periods, pregnancy or plant-based diet",
    detail:
      "Groups at higher risk of depletion should track ferritin annually. A serum iron alone can miss early depletion.",
  },
  {
    label: "Restless legs, hair thinning, brittle nails",
    detail:
      "Classic low-ferritin symptoms even when haemoglobin is still in range. Test ferritin plus a full blood count.",
  },
  {
    label: "Suspected iron overload or haemochromatosis",
    detail:
      "Order iron studies (serum iron, transferrin saturation, ferritin together). High ferritin with high transferrin saturation warrants GP review.",
  },
  {
    label: "Monitoring supplementation",
    detail:
      "Recheck serum iron and ferritin after 8 – 12 weeks. Ferritin recovers slower than serum iron and is the truer marker of replenished stores.",
  },
];

const providerSnapshot = [
  { provider: "Medichecks", ferritin: "£29 (finger-prick)", ironStudies: "£49 (Iron Status)" },
  { provider: "Thriva", ferritin: "£39 (finger-prick)", ironStudies: "£59 (Iron)" },
  { provider: "Randox Health", ferritin: "£45 (in-clinic)", ironStudies: "£95 (Iron Profile)" },
  { provider: "Goodbody Clinic", ferritin: "£45 (in-clinic)", ironStudies: "£89 (Iron Studies)" },
  { provider: "London Medical Lab", ferritin: "£39 (finger-prick)", ironStudies: "£69 (Iron Profile)" },
];

const faqs = [
  {
    q: "What is the difference between ferritin and iron?",
    a: "Ferritin is a protein that stores iron inside your cells; the ferritin blood test estimates how much iron your body has in reserve. Serum iron measures the iron currently circulating in your bloodstream bound to transferrin. Ferritin falls first when you become deficient, which is why it is the preferred early-warning marker.",
  },
  {
    q: "Which test should I ask for if I feel tired?",
    a: "For unexplained fatigue in the UK, ferritin is typically the more informative starting test. Pairing it with a full blood count and, ideally, transferrin saturation gives a complete picture without over-testing.",
  },
  {
    q: "Can ferritin be normal but iron still low?",
    a: "Yes. Inflammation, infection or recent illness can push ferritin artificially high while iron availability remains poor. This is why clinicians often review ferritin alongside CRP and transferrin saturation, not in isolation.",
  },
  {
    q: "What is a healthy ferritin level in the UK?",
    a: "Most UK laboratories flag ferritin below 30 ng/mL as low in men and below 15 ng/mL in women, though many clinicians treat symptoms of deficiency when levels fall under 50 – 70 ng/mL. Ranges vary between accredited laboratories, so always interpret results against your provider's reference range.",
  },
  {
    q: "Do I need to fast for a ferritin or iron test?",
    a: "Ferritin does not require fasting. Serum iron is best drawn fasting in the morning because levels naturally vary throughout the day. Follow the specific instructions from your chosen UKAS-accredited provider.",
  },
];

const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";

export default function FerritinVsIronComparisonGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: { "@type": "Organization", name: "myhealth checkup" },
    publisher: {
      "@type": "Organization",
      name: "myhealth checkup",
      url: BASE_URL,
    },
    mainEntityOfPage: CANONICAL,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Health Resource Hub", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: "Ferritin vs Iron", item: CANONICAL },
    ],
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <article className="bg-white">
        <header className="bg-[#081129] text-white py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Iron Health Guide</Badge>
            <h1
              className="text-3xl sm:text-5xl font-bold leading-tight mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Ferritin vs Iron: What's the Difference and Which Test Do You Need?
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              An independent UK guide to two of the most commonly confused blood tests. Understand what
              each result actually means so you can choose the right test for fatigue, iron deficiency
              or ongoing monitoring — without paying for markers you don't need.
            </p>
            <p className="text-white/50 text-sm mt-4">Last updated {UPDATED}</p>
          </div>
        </header>

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081129]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              The short answer
            </h2>
            <p className="text-[#081129]/80 leading-relaxed">
              Ferritin measures <strong>stored iron</strong> — the reserves your body draws on. Serum
              iron measures <strong>circulating iron</strong> in your bloodstream at that moment. For
              most people investigating fatigue, low energy, hair thinning or heavy periods, ferritin
              is the more informative starting test because stores drop before your circulating iron or
              haemoglobin does. Serum iron is more useful as part of a full iron studies panel when
              investigating iron overload, monitoring supplementation or interpreting borderline
              ferritin results.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-[#F5F5F5]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081129] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Ferritin vs iron at a glance
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[#081129]/10 bg-white">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-[#081129] text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Trait</th>
                    <th className="text-left px-4 py-3 font-semibold">Ferritin</th>
                    <th className="text-left px-4 py-3 font-semibold">Serum iron</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.trait} className="border-t border-[#081129]/10 align-top">
                      <td className="px-4 py-3 font-semibold text-[#081129]">{row.trait}</td>
                      <td className="px-4 py-3 text-[#081129]/80">{row.ferritin}</td>
                      <td className="px-4 py-3 text-[#081129]/80">{row.iron}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081129] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              When each test is the right choice
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {whenToTest.map((item) => (
                <Card key={item.label} className="border-[#081129]/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#081129]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[#081129]/80 leading-relaxed">{item.detail}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-[#F5F5F5]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081129] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Typical UK prices (2026)
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-[#081129]/10 bg-white">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-[#081129] text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Provider</th>
                    <th className="text-left px-4 py-3 font-semibold">Ferritin only</th>
                    <th className="text-left px-4 py-3 font-semibold">Full iron studies panel</th>
                  </tr>
                </thead>
                <tbody>
                  {providerSnapshot.map((row) => (
                    <tr key={row.provider} className="border-t border-[#081129]/10">
                      <td className="px-4 py-3 font-semibold text-[#081129]">{row.provider}</td>
                      <td className="px-4 py-3 text-[#081129]/80">{row.ferritin}</td>
                      <td className="px-4 py-3 text-[#081129]/80">{row.ironStudies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#081129]/60 mt-4">
              Typical published prices from CQC-regulated UK providers. Phlebotomy or clinician review
              fees may apply — check each provider's listing before booking.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081129]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              How to interpret your results
            </h2>
            <p className="text-[#081129]/80 leading-relaxed">
              A single number rarely tells the whole story. Ferritin can be pushed up by inflammation,
              recent infection, alcohol or liver disease, so a "normal" ferritin during a flare of
              illness may still hide true deficiency. Serum iron swings across the day and rises after
              supplementation, so a one-off reading can mislead. Where possible, review ferritin
              alongside transferrin saturation, a full blood count and inflammatory markers (CRP) — most
              accredited providers include these in a full iron studies panel.
            </p>
            <p className="text-[#081129]/80 leading-relaxed">
              Symptomatic patients with ferritin under 30 ng/mL are widely accepted as iron-deficient in
              the UK, and many clinicians will treat borderline results (30 – 70 ng/mL) when symptoms
              persist. Ferritin above the upper reference range warrants review with a GP, especially
              alongside raised transferrin saturation.
            </p>
            <p className="text-[#081129]/70 text-sm leading-relaxed border-l-4 border-[#22c0d4] pl-4">
              This guide is educational and does not replace advice from your GP or a qualified
              healthcare professional. Always discuss abnormal results with a clinician before starting
              or stopping treatment.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-[#F5F5F5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081129] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <Card key={f.q} className="border-[#081129]/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-[#081129]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {f.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[#081129]/80 leading-relaxed">{f.a}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081129]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Compare ferritin and iron tests side by side
            </h2>
            <p className="text-[#081129]/80 max-w-2xl mx-auto">
              See prices, biomarkers, sample method and turnaround from every CQC-regulated provider we
              track — with no pay-to-rank ordering.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-[#22c0d4] to-[#e70d69] text-white">
                <Link to="/biomarker-database?search=ferritin">
                  Compare ferritin tests <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/find-test">Take the health quiz</Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </MainLayout>
  );
}
