import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Beaker, ShieldCheck } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { guidesBySlug, biomarkerGuides } from "@/data/biomarkerGuides";
import { BASE_URL } from "@/lib/seo";

const BiomarkerGuidePage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const guide = guidesBySlug(slug);

  if (!guide) return <Navigate to="/guides" replace />;

  const canonicalUrl = `${BASE_URL}/guides/${guide.slug}`;
  const related = biomarkerGuides
    .filter((g) => g.slug !== guide.slug && g.category === guide.category)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: canonicalUrl,
    inLanguage: "en-GB",
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
    mainEntity: guide.faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: guide.keyword, item: canonicalUrl },
    ],
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{`${guide.title} | myhealth checkup`}</title>
        <meta name="description" content={guide.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.description} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-white">
        <nav className="text-sm text-white/60 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/guides" className="hover:text-white">Guides</Link>
          <span className="mx-2">/</span>
          <span className="text-white/80">{guide.keyword}</span>
        </nav>

        <header className="mb-10">
          <Badge variant="secondary" className="mb-4">{guide.category}</Badge>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            {guide.keyword}
          </h1>
          <p className="text-lg text-white/70">{guide.strapline}</p>
        </header>

        <section className="mb-10">
          <p className="text-base lg:text-lg leading-relaxed text-white/85">{guide.intro}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Beaker className="h-5 w-5 text-[#22c0d4]" /> What it measures
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {guide.biomarkers.map((b) => (
              <Card key={b.name} className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-white">{b.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-white/70">{b.what}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why it matters</h2>
          <ul className="space-y-3">
            {guide.whyItMatters.map((p) => (
              <li key={p} className="flex gap-3 text-white/85">
                <CheckCircle2 className="h-5 w-5 text-[#22c0d4] flex-shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How testing works</h2>
          <ol className="space-y-3 list-decimal list-inside text-white/85">
            {guide.howItWorks.map((s) => (
              <li key={s} className="pl-2">{s}</li>
            ))}
          </ol>
        </section>

        <section className="mb-12 rounded-2xl border border-white/10 bg-gradient-to-br from-[#22c0d4]/10 to-[#e70d69]/10 p-6 lg:p-8">
          <div className="flex items-start gap-4 mb-4">
            <ShieldCheck className="h-6 w-6 text-[#22c0d4] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Compare {guide.keyword} prices in the UK</h2>
              <p className="text-white/75">
                Side-by-side comparison of CQC-regulated providers and UKAS-accredited laboratories.
                Transparent pricing, typical turnaround times and sample methods.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-[#22c0d4] to-[#e70d69] text-white hover:opacity-90">
            <Link to={guide.compareHref}>
              Compare providers <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently asked questions</h2>
          <div className="space-y-5">
            {guide.faqs.map((f) => (
              <div key={f.q} className="border-b border-white/10 pb-5 last:border-0">
                <h3 className="text-lg font-semibold mb-2">{f.q}</h3>
                <p className="text-white/75 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Related guides</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/guides/${r.slug}`}
                  className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >
                  <div className="text-sm text-white/60 mb-1">{r.category}</div>
                  <div className="font-semibold text-white">{r.keyword}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-white/50 mt-12">
          This guide is for general information only and does not constitute medical advice.
          Always discuss test results with a qualified clinician.
        </p>
      </article>
    </MainLayout>
  );
};

export default BiomarkerGuidePage;
