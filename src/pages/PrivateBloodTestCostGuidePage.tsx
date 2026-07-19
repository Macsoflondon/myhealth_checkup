import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, PoundSterling, ShieldCheck, Beaker } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/lib/seo";

const SLUG = "private-blood-test-cost-guide";
const TITLE = "How Much Does a Private Blood Test Cost in the UK?";
const DESCRIPTION =
  "Independent 2026 UK price guide to private blood tests. Compare entry-level, standard and comprehensive panel costs across Medichecks, Randox, Thriva, Goodbody and more.";
const CANONICAL = `${BASE_URL}/blog/${SLUG}`;
const UPDATED = "2026-07-19";

const priceBands = [
  {
    tier: "Entry-level single markers",
    range: "£19 – £45",
    examples: "Vitamin D, ferritin, TSH, HbA1c, PSA (finger-prick, at-home)",
  },
  {
    tier: "Focused panels",
    range: "£45 – £99",
    examples: "Thyroid, iron status, cholesterol, female or male hormone screens",
  },
  {
    tier: "General wellness panels",
    range: "£99 – £199",
    examples: "20–40 markers covering thyroid, liver, kidney, cholesterol, vitamins",
  },
  {
    tier: "Advanced / premium panels",
    range: "£199 – £399",
    examples: "60+ markers, advanced lipids, hormones, inflammation, tumour markers",
  },
  {
    tier: "Executive / longevity panels",
    range: "£399 – £900+",
    examples: "80–100+ markers, clinician review, sometimes imaging or genetics",
  },
];

const providerSnapshot = [
  { provider: "Medichecks", entry: "£29", panel: "£99 (Ultimate Performance)", venous: "+£35" },
  { provider: "Randox Health", entry: "£45", panel: "£295 (Everyman/Everywoman)", venous: "Included in-clinic" },
  { provider: "Thriva", entry: "£39", panel: "£109 (Advanced)", venous: "+£29" },
  { provider: "Goodbody Clinic", entry: "£45", panel: "£179 (Advanced Wellness)", venous: "Included" },
  { provider: "London Medical Lab", entry: "£39", panel: "£189 (General Health)", venous: "+£30" },
  { provider: "Bluecrest Wellness", entry: "£129", panel: "£249 (Ultimate)", venous: "Included" },
];

const hiddenCosts = [
  {
    label: "Phlebotomy / venous draw",
    detail:
      "£25 – £45 on top of the kit price when a finger-prick sample is not enough. Some clinics bundle this in; most home-kit providers charge separately.",
  },
  {
    label: "Clinician review or GP consultation",
    detail:
      "£20 – £75 for a written doctor review. Many panels include a basic comment; a full telephone or video consultation costs extra.",
  },
  {
    label: "Postage and return shipping",
    detail: "Typically £0 – £6.99. Tracked return postage is worth paying for on hormone-sensitive samples.",
  },
  {
    label: "Repeat or confirmatory testing",
    detail:
      "Testosterone, cortisol and thyroid results are commonly repeated on a second morning sample. Budget for one repeat when interpreting borderline results.",
  },
];

const faqs = [
  {
    q: "How much does a private blood test cost in the UK?",
    a: "Prices in 2026 start at around £19 for a single-marker finger-prick test and rise to £900+ for premium executive panels with clinician review. A typical general wellness panel covering 20–40 markers sits between £99 and £199 across the major CQC-regulated UK providers.",
  },
  {
    q: "How much is a private blood test in the UK for hormones?",
    a: "Focused hormone panels — such as thyroid, female hormone or male hormone screens — typically cost £45 to £99 at home and £75 to £149 in-clinic. Comprehensive panels adding SHBG, oestradiol, prolactin, LH and FSH usually sit between £99 and £199.",
  },
  {
    q: "Why do private blood test prices vary so much?",
    a: "Prices reflect the number of biomarkers, the assay method (LC-MS/MS versus immunoassay), whether a phlebotomist or clinic visit is included, and whether a doctor reviews the results. Larger panels use more reagents and clinician time, which is where most of the cost sits.",
  },
  {
    q: "Are cheaper private blood tests less accurate?",
    a: "Not necessarily. All laboratories listed on myhealth checkup are UKAS-accredited to ISO 15189, meaning analytical accuracy is independently audited regardless of price. Cheaper tests usually cover fewer markers, not lower-quality analysis.",
  },
  {
    q: "Can I claim a private blood test on health insurance?",
    a: "Most UK private medical insurance policies only cover diagnostic tests requested by a specialist as part of active treatment. Self-referred wellness testing is generally paid out of pocket. Check your policy wording before assuming reimbursement.",
  },
  {
    q: "Is a home finger-prick test the same as a clinic blood draw?",
    a: "For most common markers — cholesterol, HbA1c, vitamin D, thyroid, ferritin — finger-prick capillary sampling is analytically equivalent to venous blood when collected correctly. A small number of tests (for example insulin, some hormones and full haematology) require a venous draw.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: CANONICAL,
  inLanguage: "en-GB",
  datePublished: UPDATED,
  dateModified: UPDATED,
  isAccessibleForFree: true,
  author: { "@type": "Organization", name: "myhealth checkup" },
  publisher: {
    "@type": "Organization",
    name: "MYHEALTHCHECKUP LTD",
    url: BASE_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Health Resource Hub", item: `${BASE_URL}/blog` },
    { "@type": "ListItem", position: 3, name: "Private Blood Test Cost Guide", item: CANONICAL },
  ],
};

export const PrivateBloodTestCostGuidePage = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>{`${TITLE} | myhealth checkup`.slice(0, 60)}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:locale" content="en_GB" />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white">
        <nav className="text-sm text-white/60 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-white">Health Resource Hub</Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">Private blood test cost guide</span>
        </nav>

        <header className="mb-10">
          <Badge variant="secondary" className="mb-4">Pricing · UK guide</Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            How much does a private blood test cost in the UK?
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Private blood tests in the UK range from £19 for a single marker to over £900 for
            premium executive panels. This independent 2026 guide breaks down what you actually
            pay across the major CQC-regulated providers, where hidden fees appear, and how to
            match panel depth to what you want to learn.
          </p>
          <p className="text-sm text-white/50 mt-4">
            Last reviewed: 19 July 2026 · Editorially independent · Prices are typical retail rates and change frequently
          </p>
        </header>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">Typical UK price bands</h2>
          <p>
            Private testing in the UK is competitive, so pricing clusters into predictable tiers.
            Most consumers pay between £99 and £199 for a general wellness panel, with entry-level
            single markers available from £19 for basic finger-prick tests.
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Tier</th>
                  <th className="text-left px-4 py-3 font-medium">Typical price</th>
                  <th className="text-left px-4 py-3 font-medium">What you get</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {priceBands.map((b) => (
                  <tr key={b.tier}>
                    <td className="px-4 py-3 font-medium">{b.tier}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{b.range}</td>
                    <td className="px-4 py-3">{b.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Provider price snapshot (2026)</h2>
          <p className="mb-4">
            Indicative pricing for a comparable entry-level test and a comprehensive wellness
            panel across the largest UK direct-to-consumer providers. Actual prices update
            frequently — always check the live comparison on the panel page.
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Provider</th>
                  <th className="text-left px-4 py-3 font-medium">Entry-level</th>
                  <th className="text-left px-4 py-3 font-medium">General wellness panel</th>
                  <th className="text-left px-4 py-3 font-medium">Clinic draw</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {providerSnapshot.map((p) => (
                  <tr key={p.provider}>
                    <td className="px-4 py-3 font-medium">{p.provider}</td>
                    <td className="px-4 py-3">{p.entry}</td>
                    <td className="px-4 py-3">{p.panel}</td>
                    <td className="px-4 py-3">{p.venous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/50 mt-3">
            Prices sourced from each provider's public UK website, July 2026. Includes VAT where
            applicable. Excludes optional add-ons such as consultant review or expedited turnaround.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">Hidden costs to check before you buy</h2>
          <p>
            The headline price on a private blood test rarely tells the full story. These
            extras are the most common source of surprise on invoices.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {hiddenCosts.map((h) => (
              <Card key={h.label}>
                <CardHeader>
                  <CardTitle className="text-base">{h.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-white/70">{h.detail}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">How to match panel depth to your goal</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <PoundSterling className="w-6 h-6 mb-2 text-[#22c0d4]" />
                <CardTitle className="text-base">Checking a single concern</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                A single-marker test (vitamin D, TSH, ferritin, PSA) at £19–£45 is usually
                enough when you already know what you want to measure.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Beaker className="w-6 h-6 mb-2 text-[#e70d69]" />
                <CardTitle className="text-base">Baseline or annual review</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                A general wellness panel at £99–£199 covers thyroid, liver, kidney,
                cholesterol, iron and key vitamins — the standard MOT for most adults.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheck className="w-6 h-6 mb-2 text-[#22c0d4]" />
                <CardTitle className="text-base">Symptom investigation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                An advanced panel at £199–£399 adds hormones, inflammation and advanced
                lipids — worth it when symptoms don't fit a single system.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">Are private blood tests worth the cost?</h2>
          <p>
            Value depends on what a result changes. A £39 vitamin D or ferritin test that
            prompts a course of supplementation and resolves fatigue represents strong value.
            A £399 premium panel that duplicates markers your GP would run for free on the NHS
            is harder to justify unless you specifically want the speed or the extras.
          </p>
          <p>
            Before you buy, ask two questions. First, what decision will the result change?
            Second, is the same marker available on the NHS without a wait that materially
            affects you? Where the answer is "nothing" or "yes", spend less. Where a fast,
            broader result would genuinely inform a lifestyle or medical decision, the
            premium is usually money well spent.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">What to look for beyond price</h2>
          <p>
            The three non-negotiables when comparing providers on price alone: UKAS accreditation
            (ISO 15189) on the analysing laboratory, CQC regulation on the clinic, and a
            clearly stated turnaround time. All providers listed on myhealth checkup meet these
            standards; the comparison table shows the differences that actually matter — number
            of biomarkers, sample method, typical turnaround, and total delivered price.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <Card key={f.q}>
                <CardHeader>
                  <CardTitle className="text-base">{f.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-white/80">{f.a}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#22c0d4]/15 to-[#e70d69]/15 p-6 lg:p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-2">Compare live prices across UK providers</h2>
          <p className="text-white/80 mb-6">
            Independent, side-by-side price comparison across CQC-regulated UK laboratories.
            No pay-to-rank, no upselling — just what each test actually costs delivered.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/compare">
                Compare blood test prices <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/test-categories">Browse test categories</Link>
            </Button>
          </div>
        </section>

        <p className="text-xs text-white/50">
          Editorial note: prices in this guide are typical retail rates from public provider
          websites in July 2026 and change frequently. This article is for information only and
          does not constitute medical advice. myhealth checkup is an independent comparison
          platform and does not provide clinical care.
        </p>
      </article>
    </MainLayout>
  );
};

export default PrivateBloodTestCostGuidePage;
