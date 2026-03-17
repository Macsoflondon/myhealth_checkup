import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Award, Users, Facebook, Instagram, Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import PageHeading from '@/components/ui/page-heading';
import { SectionHeading } from '@/components/ui/section-heading';
import { usePopularTestsFromDatabase, PopularTest } from '@/hooks/usePopularTestsFromDatabase';
import { UnifiedTestCard } from '@/components/cards/UnifiedTestCard';
import { getProviderRating } from '@/constants/providerRatings';
import { getBranding } from '@/data/providerBranding';
import cqcLogo from "@/assets/compliance/cqc-logo.png";
import icoLogo from "@/assets/compliance/ico-logo.png";

const gdprLogo = "/lovable-uploads/b41794bb-1baf-49ff-8691-e808992ec800.png";

const MostPopularTests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { data: popularTests, isLoading, error } = usePopularTestsFromDatabase(12);

  // Map database tests to TestCard format
  const mappedTests: TestCardProps[] = (popularTests || []).map((test: PopularTest) => ({
    id: test.id,
    category: test.category || 'Comprehensive Health Panel',
    name: test.test_name,
    provider: test.provider_name,
    description: `Comprehensive health screening covering essential health markers. ${test.sample_type || 'Blood sample'} collection available.`,
    price: `£${test.price?.toFixed(2) || '0.00'}`,
    turnaround: test.turnaround_time || 'Results in 2-4 working days',
    biomarkers: test.biomarker_count || 0,
    rating: 4.7,
    reviews: Math.floor(Math.random() * 1000) + 500,
    collection: test.sample_type || 'Blood sample',
    url: test.url
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#081129] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <PageHeading 
              title="Most Popular" 
              accent="Tests" 
              className="[&_span]:text-white mb-6"
            />
            <p className="text-xl text-white max-w-2xl mx-auto mb-8">
              Check out our best-selling tests from all providers, trusted by thousands of people across the UK for comprehensive health screening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-health-heading" onClick={() => navigate('/compare')}>
                Browse All Tests
              </Button>
              <Button size="lg" className="bg-[#22C0D4] text-white hover:bg-[#E70D69]" onClick={() => navigate('/find-clinic')}>
                Find a Clinic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 my-[10px] py-[10px] bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeading 
              title="Why Choose" 
              gradientText="Popular Tests?" 
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Proven Track Record</h3>
                <p className="text-muted-foreground">
                  Tests chosen by thousands of satisfied customers for reliable health insights
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Our most popular tests cover the widest range of essential health markers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#e70d69] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Community Trust</h3>
                <p className="text-muted-foreground">
                  Join thousands who trust these tests for their health monitoring needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tests Section - Unified with Footer */}
      <section className="bg-[#081129] py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">

          <div className="flex justify-end mb-4 sm:mb-6">
            <select className="px-3 sm:px-4 md:px-14 py-2 border border-gray-500 rounded-md text-xs sm:text-sm bg-[#e70d69] text-white hover:border-gray-400">
              <option>Biomarkers, high to low</option>
              <option>Price, high to low</option>
              <option>Price, low to high</option>
              <option>Most popular</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#22c0d4]" />
              <span className="ml-3 text-white">Loading popular tests...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-white mb-4">Unable to load tests. Please try again.</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="text-white border-white">
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {mappedTests.map(test => <TestCard key={test.id} {...test} />)}
            </div>
          )}

          <div className="text-center mt-6 sm:mt-8 mb-12 sm:mb-16">
            <Button onClick={() => navigate('/compare')} className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-medium rounded-full w-full sm:w-auto">
              View all tests
            </Button>
          </div>

          {/* Footer Content - Integrated */}
          <div className="border-t border-gray-700 pt-12">
            {/* Navigation Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Services Column */}
              <div>
                <h3 id="footer-services" className="font-semibold text-lg mb-4 text-white">{t('footer.categories')}</h3>
                <ul className="space-y-2" aria-labelledby="footer-services">
                  <li className="py-0"><Link to="/tests/mens-health" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.mensHealth')}</Link></li>
                  <li className="py-0"><Link to="/tests/womens-health" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.womensHealth')}</Link></li>
                  <li className="py-0"><Link to="/tests/heart" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.heartHealth')}</Link></li>
                  <li className="py-0"><Link to="/compare?category=diabetes" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.diabetes')}</Link></li>
                  <li className="py-0"><Link to="/compare?category=thyroid" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.thyroid')}</Link></li>
                  <li className="py-0"><Link to="/compare?category=fertility" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.fertility')}</Link></li>
                </ul>
              </div>

              {/* Quick Links and Legal Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Links Column */}
                <div>
                  <h3 id="footer-info" className="font-semibold text-lg mb-4 text-white">{t('footer.quickLinks')}</h3>
                  <ul className="space-y-2" aria-labelledby="footer-info">
                    <li><Link to="/how-it-works" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.howItWorks')}</Link></li>
                    <li><Link to="/faqs" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.faqs')}</Link></li>
                    <li><Link to="/blog" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.blog')}</Link></li>
                    <li><Link to="/contact" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.contact')}</Link></li>
                  </ul>
                </div>

                {/* Legal Column */}
                <div>
                  <h3 id="footer-company" className="font-semibold text-lg mb-4 text-white">{t('footer.legal')}</h3>
                  <ul className="space-y-2" aria-labelledby="footer-company">
                    <li><Link to="/about" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.aboutUs')}</Link></li>
                    <li><Link to="/privacy-policy" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.privacyPolicy')}</Link></li>
                    <li><Link to="/terms" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.termsConditions')}</Link></li>
                    <li><Link to="/fair-trading" className="text-white hover:text-[#e70d69] transition-colors text-sm">Fair Trading Policy</Link></li>
                    <li><Link to="/how-we-rank" className="text-white hover:text-[#e70d69] transition-colors text-sm">How We Rank</Link></li>
                    <li><Link to="/partners" className="text-white hover:text-[#e70d69] transition-colors text-sm">{t('footer.links.partners')}</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social Media and Quality Assurance */}
            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                {/* Social Media - Left */}
                <div className="flex space-x-6">
                  <a href="https://www.facebook.com/myhealthcheckupuk" className="hover:opacity-75 transition-opacity" aria-label="Follow us on Facebook" target="_blank" rel="noopener noreferrer">
                    <Facebook size={40} style={{ color: '#1877F2' }} />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a href="https://www.Instagram.com/myhealthcheckup_uk" className="hover:opacity-75 transition-opacity" aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer">
                    <Instagram size={40} style={{ color: '#E4405F' }} />
                    <span className="sr-only">Instagram</span>
                  </a>
                </div>
                
                {/* Quality Assurance Logos - Right */}
                <div className="flex gap-6 items-center">
                  <div className="flex flex-col items-center text-center space-y-2 py-[10px]">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
                      <img src={cqcLogo} alt="Care Quality Commission" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-white text-xs font-medium">Care Quality Commission</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
                      <img src={gdprLogo} alt="EU GDPR Compliant" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-white text-xs font-medium">EU GDPR Compliant</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
                      <img src={icoLogo} alt="ICO Registered" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-white text-xs font-medium">ICO Registered</span>
                  </div>
                </div>
              </div>

              {/* Logo and Disclaimer */}
              <div className="mb-6">
                <Link to="/" className="inline-flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 flex items-center justify-center">
                    <img src="/lovable-uploads/myhealth-logo-turquoise.png" alt="myhealth checkup Logo" className="h-8 w-8 rounded-lg" />
                  </div>
                  <span className="text-lg font-bold">
                    <span className="text-[#e70d69]">myhealth</span> <span className="text-[#22c0d4]">checkup</span>
                  </span>
                </Link>
                <p className="mb-2 text-xs font-light text-white max-w-2xl">MYHEALTHCHECKUP LTD is the UK's only health service comparison platform dedicated to CQC‑regulated and UKAS‑accredited providers.</p>
                <p className="text-xs font-light text-white">Company No. 16589056</p>
              </div>
            </div>

            {/* Copyright and Additional Links */}
            <div className="border-t border-gray-700 pt-6 mt-8">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400 max-w-3xl mx-auto">
                  <strong>Important:</strong> MyHealth Checkup is a comparison platform. We do not provide medical services. All testing is conducted by our trusted partner providers who are UKAS-accredited, CQC-regulated, or ISO 15189-certified.
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center text-sm text-white">
                <p className="font-normal text-[#e70d69]">
                  {t('footer.copyright')}
                </p>
                <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <Link to="/accessibility" className="hover:text-[#e70d69] transition-colors">{t('footer.links.accessibility')}</Link>
                  <Link to="/sitemap" className="hover:text-[#e70d69] transition-colors">{t('footer.links.sitemap')}</Link>
                  <Link to="/cookies" className="hover:text-[#e70d69] transition-colors">{t('footer.links.cookiePolicy')}</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MostPopularTests;
