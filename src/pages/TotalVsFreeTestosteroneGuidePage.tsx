import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Beaker, ShieldCheck, Activity } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/lib/seo";

const SLUG = "total-vs-free-testosterone";
const TITLE = "Total vs Free Testosterone: UK Guide";
const DESCRIPTION =
  "Independent UK guide explaining total vs free testosterone, why free testosterone levels matter for men's health, and how to compare private tests.";
const CANONICAL = `${BASE_URL}/blog/${SLUG}`;
const UPDATED = "2026-07-25";

const compareRows = [
  {
    label: "What it measures",
    total: "All testosterone circulating in blood, including protein-bound.",
    free: "The small unbound fraction that can enter cells and act on tissues.",
  },
  {
    label: "Typical share",
    total: "100% of circulating testosterone.",
    free: "Roughly 1–3% of total testosterone in most adult men.",
  },
  {
    label: "How it is obtained",
    total: "Direct assay (LC-MS/MS or immunoassay) on a blood sample.",
    free: "Usually calculated from total testosterone, SHBG and albumin (Vermeulen equation).",
  },
  {
    label: "Best used for",
    total: "First-line screening and tracking trends over time.",
    free: "Clarifying borderline results, especially when SHBG is high or low.",
  },
  {
    label: "UK reporting unit",
    total: "nmol/L",
    free: "pmol/L or nmol/L (calculated)",
  },
];

const faqs = [
  {
    q: "What is the difference between total and free testosterone?",
    a: "Total testosterone is the combined amount of the hormone in your blood — most of it bound to proteins such as SHBG (sex hormone binding globulin) and albumin. Free testosterone is the small, unbound fraction that can actually enter cells and act on tissues. When symptoms and total testosterone don't line up, free testosterone often gives a clearer picture.",
  },
  {
    q: "Why do free testosterone levels matter?",
    a: "Only free (and loosely albumin-bound) testosterone is biologically active. Two men can have identical total testosterone yet very different free levels because their SHBG differs. That's why UK guidance recommends calculating free testosterone whenever total sits in the lower reference range or symptoms suggest deficiency.",
  },
  {
    q: "What is a normal free testosterone level for men in the UK?",
    a: "Most UK laboratories report a calculated free testosterone range of roughly 0.20 to 0.62 nmol/L (200–620 pmol/L) for healthy adult men, narrowing with age. Ranges vary by lab and assay, so always interpret against the reference range on your own report.",
  },
  {
    q: "Should I test total or free testosterone?",
    a: "Start with total testosterone plus SHBG and albumin — this lets the lab calculate free testosterone in one draw. Standalone free testosterone assays (direct analogue immunoassays) are considered less reliable than the calculated value used in UK clinical pathways.",
  },
  {
    q: "Can free testosterone be low when total is normal?",
    a: "Yes. High SHBG — common with ageing, thyroid overactivity, liver disease or oestrogen exposure — binds more testosterone and reduces the free fraction. Men in this situation may have symptoms of low testosterone despite a normal total reading.",
  },
  {
    q: "When should I retest?",
    a: "UK guidance (BSSM, 2022) recommends confirming any low or borderline result on a second early-morning sample (before 11:00), ideally fasted, before any clinical decision. A single low reading is not a diagnosis.",
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
    { "@type": "ListItem", position: 3, name: "Total vs Free Testosterone", item: CANONICAL },
  ],
};

const TotalVsFreeTestosteroneGuidePage = () => {
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
        <meta name="twitter:card" content="summary_large_image" />
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
          <span className="text-white/80">Total vs Free Testosterone</span>
        </nav>

        <header className="mb-10">
          <Badge variant="secondary" className="mb-4">Hormone health · UK guide</Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            Total vs free testosterone: what the numbers really mean
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            If you have ever looked at a testosterone blood test result, you have probably seen
            two figures side by side: total testosterone and free testosterone. They sound
            similar, but clinically they answer different questions. This independent UK guide
            explains what each measures, why free testosterone levels often matter more than
            total, and how to choose a private test that reports both.
          </p>
          <p className="text-sm text-white/50 mt-4">Last reviewed: 25 July 2026 · Editorially independent · Not medical advice</p>
        </header>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">The short answer</h2>
          <p>
            Total testosterone is the combined amount of testosterone circulating in your
            bloodstream. The vast majority of it is bound to two carrier proteins — SHBG (sex
            hormone binding globulin) and albumin — and cannot act on your tissues while it is
            bound. Free testosterone is the tiny unbound fraction, typically 1–3% of the total,
            that is biologically active. Because SHBG varies widely between individuals, two men
            with identical total testosterone can have very different free testosterone, and
            therefore very different symptoms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Side-by-side comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="text-left px-4 py-3 font-medium"> </th>
                  <th className="text-left px-4 py-3 font-medium">Total testosterone</th>
                  <th className="text-left px-4 py-3 font-medium">Free testosterone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {compareRows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-3 font-medium">{r.label}</td>
                    <td className="px-4 py-3">{r.total}</td>
                    <td className="px-4 py-3">{r.free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">Why free testosterone can matter more</h2>
          <p>
            Only the free (and loosely albumin-bound) fraction can cross cell membranes and bind
            to androgen receptors. That means it is free testosterone, not total, that drives
            libido, energy, mood, red-blood-cell production and the maintenance of muscle and
            bone. If SHBG is high — common with ageing, thyroid overactivity, liver disease,
            certain anticonvulsants and oestrogen exposure — more testosterone is locked away and
            the free fraction falls, even when total looks normal on paper. The opposite happens
            when SHBG is low (obesity, insulin resistance, type 2 diabetes, hypothyroidism): free
            testosterone can be preserved despite a modest total.
          </p>
          <p>
            This is why UK guidance from the British Society for Sexual Medicine (BSSM, 2022)
            recommends calculating free testosterone from total testosterone, SHBG and albumin
            whenever a man's total sits in the lower half of the reference range (roughly 8–12
            nmol/L) or symptoms suggest deficiency. The calculation — usually the Vermeulen
            equation — is considered more reliable than direct free testosterone immunoassays,
            which can be inaccurate.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">How to interpret your result</h2>
          <p>
            UK laboratories typically report total testosterone in nmol/L and calculated free
            testosterone in pmol/L (occasionally nmol/L). Broadly, adult men fall in these
            ranges, although your own lab report's interval is the one that matters:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/85">
            <li>Total testosterone: about 8.6 to 29.0 nmol/L, narrowing with age.</li>
            <li>SHBG: about 18 to 54 nmol/L in adult men.</li>
            <li>Calculated free testosterone: about 200 to 620 pmol/L (0.20 to 0.62 nmol/L).</li>
          </ul>
          <p>
            A total consistently below 12 nmol/L on two morning samples, combined with symptoms,
            triggers further evaluation. Below 8 nmol/L usually warrants referral. Between 8 and
            12 nmol/L, calculated free testosterone below approximately 225 pmol/L is often
            considered clinically low. These are thresholds for discussion with a qualified
            clinician, not self-diagnosis — one-off readings can be knocked around by illness,
            poor sleep, alcohol, medications and even the time of day.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">Choosing a private test that reports both</h2>
          <p>
            A useful private hormone panel for men should include, as a minimum, total
            testosterone, SHBG and albumin — the three ingredients needed to calculate free
            testosterone. More comprehensive panels add LH, FSH, oestradiol, prolactin and DHEA-S,
            which help clinicians work out whether a low result originates in the testes or the
            pituitary. Look for laboratories accredited by UKAS to ISO 15189 and clinics
            regulated by the Care Quality Commission. Every provider listed on myhealth checkup
            meets these criteria.
          </p>
          <p>
            Timing matters more than most patients realise. Testosterone peaks in the early
            morning and can drop by 20–30% by the afternoon. UK clinical pathways expect samples
            between 07:00 and 11:00, ideally fasted, with any low or borderline result confirmed
            on a second morning draw before decisions are made.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What a good test looks like</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <Beaker className="w-6 h-6 mb-2 text-[#22c0d4]" />
                <CardTitle className="text-base">Biomarkers covered</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                Total testosterone, SHBG and albumin at minimum, so free testosterone can be
                calculated. Ideally LH, FSH and oestradiol too.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Activity className="w-6 h-6 mb-2 text-[#e70d69]" />
                <CardTitle className="text-base">Sample method</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                Venous draws at a clinic remain the reference standard. At-home finger-prick
                kits are convenient — confirm low results venously.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheck className="w-6 h-6 mb-2 text-[#22c0d4]" />
                <CardTitle className="text-base">Accreditation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                UKAS ISO 15189 laboratory and CQC-regulated clinic. These are non-negotiable and
                standard across the providers we list.
              </CardContent>
            </Card>
          </div>
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
          <h2 className="text-2xl font-semibold mb-2">Compare male hormone tests on myhealth checkup</h2>
          <p className="text-white/80 mb-6">
            Independent, side-by-side comparison of biomarkers, sample method, typical turnaround
            and price across CQC-regulated UK providers. No upselling, no pay-to-rank.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/hormones">
                Compare male hormone tests <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/blog/testosterone-levels-by-age">Read: testosterone levels by age</Link>
            </Button>
          </div>
        </section>

        <p className="text-xs text-white/50">
          Editorial note: this article is for information only and does not constitute medical
          advice, diagnosis or treatment. Always discuss test results with a qualified clinician.
          myhealth checkup is an independent comparison platform and does not provide clinical
          care. Turnaround times are typical, not guaranteed.
        </p>
      </article>
    </MainLayout>
  );
};

export default TotalVsFreeTestosteroneGuidePage;
