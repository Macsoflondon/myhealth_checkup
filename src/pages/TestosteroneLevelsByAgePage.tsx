import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Beaker, ShieldCheck, Activity } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/lib/seo";

const SLUG = "testosterone-levels-by-age";
const TITLE = "Normal Testosterone Levels by Age (UK Guide)";
const DESCRIPTION =
  "An independent UK guide to typical testosterone levels by age, what the numbers mean, and how to compare private testosterone tests on myhealth checkup.";
const CANONICAL = `${BASE_URL}/blog/${SLUG}`;
const UPDATED = "2026-06-19";

const ranges = [
  { age: "18–29", total: "10.4 – 30.1 nmol/L", free: "0.20 – 0.62 nmol/L" },
  { age: "30–39", total: "9.5 – 27.8 nmol/L", free: "0.18 – 0.55 nmol/L" },
  { age: "40–49", total: "8.6 – 25.5 nmol/L", free: "0.16 – 0.49 nmol/L" },
  { age: "50–59", total: "7.7 – 23.2 nmol/L", free: "0.14 – 0.43 nmol/L" },
  { age: "60–69", total: "6.8 – 21.0 nmol/L", free: "0.13 – 0.39 nmol/L" },
  { age: "70+", total: "6.0 – 19.0 nmol/L", free: "0.11 – 0.35 nmol/L" },
];

const faqs = [
  {
    q: "What is considered a normal testosterone level in the UK?",
    a: "Most UK laboratories report a total testosterone reference range of roughly 8.6 to 29.0 nmol/L for adult men, with typical ranges narrowing as men age. Always interpret your result against the reference range printed on your own lab report, as ranges vary between laboratories and assays.",
  },
  {
    q: "What time of day should testosterone be tested?",
    a: "Testosterone follows a circadian rhythm and peaks in the early morning. UK guidance from the British Society for Sexual Medicine recommends taking the sample between 07:00 and 11:00, ideally fasted, and confirming a low result on a second morning sample before any clinical decision is made.",
  },
  {
    q: "What is the difference between total and free testosterone?",
    a: "Total testosterone measures all circulating testosterone, most of which is bound to proteins such as SHBG. Free testosterone is the small, biologically active fraction. When total testosterone sits at the lower end of the range, calculating free testosterone (using SHBG and albumin) gives a clearer picture.",
  },
  {
    q: "Can I order a private testosterone test in the UK without a GP?",
    a: "Yes. Several CQC-regulated providers offer self-pay testosterone testing through UKAS-accredited laboratories, with either a finger-prick sample at home or a venous draw at a clinic. myhealth checkup lets you compare biomarkers, sample method, turnaround and price side by side.",
  },
  {
    q: "Does a low testosterone result mean I need treatment?",
    a: "A single low reading is not a diagnosis. Clinical guidelines require at least two morning samples plus a review of symptoms, SHBG, LH, FSH and prolactin before any treatment is considered. Speak to a qualified clinician about your results — myhealth checkup does not provide diagnosis or treatment.",
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
    { "@type": "ListItem", position: 3, name: "Testosterone Levels by Age", item: CANONICAL },
  ],
};

const TestosteroneLevelsByAgePage = () => {
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
          <span className="text-white/80">Testosterone Levels by Age</span>
        </nav>

        <header className="mb-10">
          <Badge variant="secondary" className="mb-4">Hormone health · UK guide</Badge>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            Normal testosterone levels by age: a UK guide
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Testosterone shapes energy, mood, libido, body composition and long-term cardiometabolic
            health in men. Levels naturally decline with age, but reference ranges and clinical
            thresholds vary between laboratories. This independent guide explains what UK labs
            consider typical at each life stage and how to choose a private test if you want to
            check your own numbers.
          </p>
          <p className="text-sm text-white/50 mt-4">Last reviewed: 19 June 2026 · Editorially independent · Not medical advice</p>
        </header>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">Why testosterone matters</h2>
          <p>
            Testosterone is the primary male sex hormone, produced mainly in the testes and, in
            smaller amounts, by the adrenal glands. It supports muscle mass, bone density,
            red-blood-cell production, sexual function, mood and cognition. Women produce
            testosterone too, at roughly one-tenth the male concentration, where it contributes to
            libido and overall wellbeing.
          </p>
          <p>
            From around age 30, total testosterone in men typically falls by about 1% per year. In
            most men this gentle decline is asymptomatic. In a minority — the British Society for
            Sexual Medicine estimates around 2% of men aged 40–79 — symptoms combine with
            consistently low blood levels to meet the criteria for testosterone deficiency
            syndrome (sometimes called late-onset hypogonadism).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Typical testosterone ranges by age (UK labs)</h2>
          <p className="mb-4">
            The table below summarises the ranges most commonly reported by UK private laboratories
            using LC-MS/MS or immunoassay methods. Treat these as orientation only — your own lab
            report's reference range is the one that matters clinically.
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Age band</th>
                  <th className="text-left px-4 py-3 font-medium">Total testosterone</th>
                  <th className="text-left px-4 py-3 font-medium">Free testosterone (calculated)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {ranges.map((r) => (
                  <tr key={r.age}>
                    <td className="px-4 py-3 font-medium">{r.age}</td>
                    <td className="px-4 py-3">{r.total}</td>
                    <td className="px-4 py-3">{r.free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/50 mt-3">
            Ranges synthesised from UK laboratory reference intervals (The Doctors Laboratory,
            Synnovis, Randox Health). nmol/L is the standard UK reporting unit; multiply by 28.84 to
            convert to ng/dL.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">What counts as "low" in the UK?</h2>
          <p>
            UK guidance (BSSM, 2022) treats a total testosterone consistently below 12 nmol/L,
            taken on two separate morning samples, as a trigger for further evaluation when
            symptoms are present. Levels below 8 nmol/L generally warrant referral. Between 8 and
            12 nmol/L, clinicians usually calculate free testosterone using SHBG to decide whether
            the result is clinically low.
          </p>
          <p>
            A single result outside the reference range is not a diagnosis. Acute illness, recent
            exercise, poor sleep, certain medications, obesity and alcohol can all transiently
            suppress testosterone. That is why repeat morning testing — and a wider hormone panel
            including SHBG, LH, FSH and prolactin — sits at the heart of UK clinical pathways.
          </p>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-2xl font-semibold">When private testing is worth considering</h2>
          <p>
            NHS testosterone testing is available where clinically indicated, but waits can be
            long and some integrated assessments (calculated free testosterone, SHBG, oestradiol,
            DHEA-S) are not routinely offered in primary care. A private test can be useful when
            you want a baseline, are tracking symptoms such as fatigue or low libido, or want to
            monitor response to lifestyle changes.
          </p>
          <p>
            Insist on laboratories accredited by UKAS to ISO 15189, and clinics regulated by the
            Care Quality Commission. Both standards exist in the UK to safeguard accuracy and
            patient safety. Every provider listed on myhealth checkup meets these criteria.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How to choose the right testosterone test</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <Beaker className="w-6 h-6 mb-2 text-[#22c0d4]" />
                <CardTitle className="text-base">Biomarkers covered</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                Look for total testosterone, SHBG and calculated free testosterone as a minimum.
                Comprehensive panels add LH, FSH, oestradiol and prolactin.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Activity className="w-6 h-6 mb-2 text-[#e70d69]" />
                <CardTitle className="text-base">Sample method</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                Venous draws at a clinic are the reference standard. At-home finger-prick kits are
                convenient, though best confirmed venously if a low result is found.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheck className="w-6 h-6 mb-2 text-[#22c0d4]" />
                <CardTitle className="text-base">Accreditation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/70">
                Confirm the analysing laboratory is UKAS-accredited (ISO 15189) and the clinic is
                CQC-regulated. Both are standard across the providers we list.
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
          <h2 className="text-2xl font-semibold mb-2">Compare testosterone tests on myhealth checkup</h2>
          <p className="text-white/80 mb-6">
            Independent, side-by-side comparison of biomarkers, sample method, typical turnaround
            and price across CQC-regulated UK providers. No upselling, no pay-to-rank.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/hormones">
                Compare testosterone tests <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/tests/mens-health">Browse men's health panels</Link>
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

export default TestosteroneLevelsByAgePage;
