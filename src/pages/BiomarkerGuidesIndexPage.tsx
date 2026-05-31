import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { biomarkerGuides, guideCategories } from "@/data/biomarkerGuides";
import { BASE_URL } from "@/lib/seo";

const TITLE = "Health Test Guides UK — Biomarkers Explained | myhealth checkup";
const DESCRIPTION =
  "Plain-English guides to UK private blood tests and biomarkers — testosterone, cortisol, thyroid, vitamin D, ferritin, liver, kidney and more.";

const BiomarkerGuidesIndexPage = () => {
  const url = `${BASE_URL}/guides`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: biomarkerGuides.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/guides/${g.slug}`,
      name: g.keyword,
    })),
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-white">
        <header className="mb-12 max-w-3xl">
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
            Health Test Guides
          </h1>
          <p className="text-lg text-white/75">
            Plain-English explainers of the biomarkers behind UK private blood tests —
            what each one measures, why it matters, and how to compare providers with confidence.
          </p>
        </header>

        {guideCategories.map((cat) => {
          const items = biomarkerGuides.filter((g) => g.category === cat);
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-2xl font-semibold mb-5">{cat}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/guides/${g.slug}`}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-[#22c0d4]/40 transition"
                  >
                    <h3 className="font-semibold text-lg text-white mb-2 group-hover:text-[#22c0d4] transition">
                      {g.keyword}
                    </h3>
                    <p className="text-sm text-white/70 mb-4 line-clamp-2">{g.strapline}</p>
                    <span className="inline-flex items-center text-sm text-[#22c0d4]">
                      Read guide <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default BiomarkerGuidesIndexPage;
