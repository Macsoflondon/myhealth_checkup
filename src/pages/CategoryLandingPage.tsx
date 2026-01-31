import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import UKASBanner from "@/components/UKASBanner";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import HeroSection from "@/components/sections/HeroSection";
import { GroupedTestsTable } from "@/components/compare/GroupedTestsTable";
import { RecommendedTestsCarousel } from "@/components/compare/RecommendedTestsCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Clock, 
  Sparkles,
  TrendingUp,
  Users,
  Scale,
  Activity,
  Search,
  LineChart,
  AlertCircle,
  BarChart3,
  Heart,
  Baby,
  Calendar,
  Zap,
  Pill
} from "lucide-react";
import { getCategoryContent, type CategoryContent } from "@/data/categoryContent";
import { useProvidersByCategory, type ProviderTestRow } from "@/hooks/queries/useProvidersByTestType";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Icon mapping for benefits
const iconMap: Record<string, React.ElementType> = {
  Scale,
  TrendingUp,
  Sparkles,
  Activity,
  Search,
  LineChart,
  Heart,
  AlertCircle,
  BarChart3,
  Baby,
  Calendar,
  Users,
  Zap,
  Shield,
  Pill,
};

const CategoryLandingPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // Get category content
  const content = useMemo(() => {
    if (!category) return null;
    return getCategoryContent(category);
  }, [category]);

  // Fetch tests for this category
  const { data: providerTests = [], isLoading: isLoadingTests } = useProvidersByCategory(
    category || "",
    !!category
  );

  // Fetch recommended tests
  const { data: recommendedTests = [], isLoading: isLoadingRecommended } = useRecommendedTests(
    category || "",
    8
  );

  // Handle test selection for carousel
  const handleSelectTest = (test: any) => {
    navigate(`/compare?category=${category}`);
  };

  // If no content found, show 404-like state
  if (!content) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find tests for this category. Browse our available categories below.
            </p>
            <Button asChild>
              <Link to="/compare">Browse All Tests</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>{content.title}</title>
          <meta name="description" content={content.metaDescription} />
          <meta name="keywords" content={content.keywords.join(", ")} />
          <link rel="canonical" href={`https://myhealthcheckup.co.uk/tests/${content.slug}`} />
          
          {/* Open Graph */}
          <meta property="og:title" content={content.title} />
          <meta property="og:description" content={content.metaDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://myhealthcheckup.co.uk/tests/${content.slug}`} />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalWebPage",
              "name": content.heroTitle,
              "description": content.metaDescription,
              "url": `https://myhealthcheckup.co.uk/tests/${content.slug}`,
              "mainEntity": {
                "@type": "MedicalTest",
                "name": content.name,
                "description": content.introduction
              }
            })}
          </script>
        </Helmet>

        <UKASBanner />
        <MainLayout hideUKASBanner hideHeader hideFooter>
          {/* Hero Section */}
          <HeroSection
            title={content.heroTitle}
            subtitle={content.heroSubtitle}
          >
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white">
                  {providerTests.length}+ Tests Available
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white">Live Prices</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">UKAS Accredited</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white gap-2"
                asChild
              >
                <Link to={`/compare?category=${content.slug}`}>
                  Compare {content.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </HeroSection>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <PageBreadcrumb 
              segments={[
                { label: "Home", href: "/" },
                { label: "Tests", href: "/compare" },
                { label: content.name }
              ]}
              backLabel="Back to All Tests"
            />

            {/* Introduction */}
            <section className="mt-8 mb-12">
              <div className="max-w-3xl">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {content.introduction}
                </p>
              </div>
            </section>

            {/* Recommended Tests Carousel */}
            {!isLoadingRecommended && recommendedTests.length > 0 && (
              <section className="mb-12">
                <RecommendedTestsCarousel
                  tests={recommendedTests}
                  category={content.slug}
                  onSelectTest={handleSelectTest}
                  selectedTestIds={[]}
                  isLoading={isLoadingRecommended}
                />
              </section>
            )}

            {/* Benefits Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Why Test Your {content.name.replace(" Tests", "")}?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {content.benefits.map((benefit, idx) => {
                  const IconComponent = iconMap[benefit.icon] || Sparkles;
                  return (
                    <Card key={idx} className="border-border bg-card">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Health Concerns Section */}
            <section className="mb-12 bg-muted/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Common Health Concerns
              </h2>
              <p className="text-muted-foreground mb-6">
                Consider testing if you're experiencing any of these symptoms or concerns:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {content.healthConcerns.map((concern, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 bg-background rounded-lg p-4 border border-border"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{concern}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Provider Comparison Table */}
            {isLoadingTests ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : providerTests.length > 0 ? (
              <section className="mb-12">
                <GroupedTestsTable
                  tests={providerTests}
                  title={`Compare ${content.name} from UK Providers`}
                />
              </section>
            ) : null}

            {/* Who Should Test Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Who Should Consider {content.name}?
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {content.whoShouldTest.map((who, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium">{who}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {content.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Related Categories */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Related Test Categories
              </h2>
              <div className="flex flex-wrap gap-3">
                {content.relatedCategories.map((relatedSlug) => (
                  <Link
                    key={relatedSlug}
                    to={`/tests/${relatedSlug}`}
                    className="inline-flex"
                  >
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                      {relatedSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Compare {content.name.toLowerCase()} from trusted UK providers. 
                All laboratories are UKAS accredited with results reviewed by qualified professionals.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  asChild
                >
                  <Link to={`/compare?category=${content.slug}`}>
                    Compare {content.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  asChild
                >
                  <Link to="/how-it-works">
                    How It Works
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </MainLayout>
      </div>
    </ErrorBoundary>
  );
};

export default CategoryLandingPage;
