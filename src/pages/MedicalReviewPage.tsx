import { Helmet } from "react-helmet-async";
import { ShieldCheck, ExternalLink, Award, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/sections/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * Medical reviewer credentials are kept in code (not the DB) so they're
 * crawlable in the static SPA shell once prerendered, and so legal can
 * review changes via PR rather than via an admin form.
 */
const REVIEWER = {
  name: "Nathanial Smith",
  role: "Clinical Reviewer — Registered Healthcare Professional",
  registration: {
    body: "Health and Care Professions Council (HCPC)",
    number: "PA43353",
    verifyUrl: "https://www.hcpc-uk.org/check-the-register/professional-registration-detail/?query=PA43353&profession=PA",
  },
  scope:
    "Reviews comparison content for clinical accuracy, biomarker descriptions, sample collection guidance, and general health-test explainers. Does not review or endorse individual provider commercial claims.",
  reviewedSince: "2025-04",
};

const MedicalReviewPage = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: REVIEWER.name,
    jobTitle: "Registered Healthcare Professional",
    description: REVIEWER.scope,
    affiliation: {
      "@type": "Organization",
      name: "myhealth checkup",
      url: "https://www.myhealthcheckup.co.uk/",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional Registration",
        recognizedBy: { "@type": "Organization", name: REVIEWER.registration.body },
        identifier: REVIEWER.registration.number,
      },
    ],
    url: "https://www.myhealthcheckup.co.uk/about/medical-review",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Medical Review & Editorial Standards | myhealth checkup</title>
        <meta
          name="description"
          content="Our clinical content is reviewed by a Registered Healthcare Professional (HCPC). See reviewer credentials, scope of review, and editorial standards."
        />
        <link rel="canonical" href="https://www.myhealthcheckup.co.uk/about/medical-review" />
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <Header />

      <main className="flex-grow bg-background">
        <PageBanner
          title="Medical Review"
          accent="& Editorial Standards"
          subtitle="Who reviews our clinical content, what they review, and how to verify their registration."
        />

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-7 h-7 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{REVIEWER.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{REVIEWER.role}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="font-mono">
                      {REVIEWER.registration.body}: {REVIEWER.registration.number}
                    </Badge>
                    <Badge variant="outline">Reviewing since {REVIEWER.reviewedSince}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="font-heading font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" /> Scope of review
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{REVIEWER.scope}</p>
              </div>

              <div>
                <h2 className="font-heading font-semibold mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" aria-hidden="true" /> Verify registration
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Anyone can verify {REVIEWER.name}'s HCPC registration directly with the regulator. Search registration
                  number{" "}
                  <span className="font-mono font-semibold text-foreground">{REVIEWER.registration.number}</span> on the
                  HCPC public register.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <a
                    href={REVIEWER.registration.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    Open HCPC public register <ExternalLink className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </a>
                </Button>
              </div>

              <div className="bg-muted/40 rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Important:</strong> Our content is informational and comparative; it does not constitute
                  medical advice, diagnosis or prescription. Always consult your GP or a suitably qualified
                  clinician for individual medical guidance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Editorial standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                All clinical explainer content (biomarker descriptions, test category overviews, "who should test"
                guidance) is reviewed before publication and re-reviewed at least every 12 months, or sooner when UK
                regulatory guidance changes.
              </p>
              <p>
                Commercial information — pricing, turnaround times, sample methods — is sourced directly from each
                provider's published catalogue and refreshed daily by automated feeds. Commercial data is not part of
                clinical review.
              </p>
              <p>
                For our full ranking methodology, update cadence and conflict-of-interest policy, see{" "}
                <Link to="/how-we-rank" className="text-primary underline underline-offset-2 font-medium">
                  How we rank
                </Link>
                .
              </p>
            </CardContent>
          </Card>
          <Card className="mb-8 border-brand-pink/30">
            <CardHeader>
              <CardTitle className="text-brand-pink">Medical disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                This site provides comparison information only and does not constitute medical advice, diagnosis,
                or treatment. Always consult your GP or a suitably qualified clinician for individual medical
                guidance.
              </p>
              <p>
                Clinical content is reviewed by {REVIEWER.name}, Registered Healthcare Professional ({REVIEWER.registration.body}:{" "}
                <span className="font-mono font-semibold text-foreground">{REVIEWER.registration.number}</span>).
                myhealth checkup is not a medical provider and does not deliver clinical care.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MedicalReviewPage;
