import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Star, TrendingUp, Award, Users, Facebook, Instagram } from 'lucide-react';
import { useTranslation } from "react-i18next";
import cqcLogo from "../assets/compliance/cqc-logo.png";
import icoLogo from "../assets/compliance/ico-logo.png";
const gdprLogo = "/lovable-uploads/b41794bb-1baf-49ff-8691-e808992ec800.png";
interface TestCardProps {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  turnaround: string;
  biomarkers: string;
  rating: number;
  reviews: number;
  collection: string;
}
const TestCard = ({
  id,
  category,
  name,
  description,
  price,
  turnaround,
  biomarkers,
  rating,
  reviews,
  collection
}: TestCardProps) => {
  const navigate = useNavigate();
  const handleSelectTest = () => {
    navigate(`/compare?test=${id}`);
  };
  return <Card className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 h-full flex flex-col">
      <div className="bg-[#1a365d] text-white p-5 sm:p-6 md:p-8 text-center">
        <h3 className="text-xs sm:text-sm font-medium">{category}</h3>
      </div>
      
      <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{name}</h4>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-1">{description}</p>
        
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600">{turnaround}</p>
          <p className="text-xs sm:text-sm text-gray-600">{biomarkers}</p>
          
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
            <span className="text-xs sm:text-sm text-gray-600 ml-1">({reviews})</span>
          </div>
        </div>
        
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">{price}</div>
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{collection}</p>
        
        <Button onClick={handleSelectTest} variant="outline" className="w-full py-2.5 sm:py-3 text-sm sm:text-base text-[#081129] border-gray-300 hover:bg-gray-50 mt-auto">
          Select test
        </Button>
      </CardContent>
    </Card>;
};
const MostPopularTests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const popularTests = [{
    id: 'lola-core-health-45',
    category: 'Comprehensive Health Panel',
    name: 'Core Health 45 - Lola Health',
    description: '45 essential biomarkers including blood analysis, cardiovascular health, kidney function, inflammation, vitamins, liver function, thyroid function, diabetes screening, and full blood count. Includes at-home phlebotomy service and doctor-reviewed results.',
    price: '£140.00',
    turnaround: 'Results estimated in 2-4 working days',
    biomarkers: '45 biomarkers',
    rating: 4.7,
    reviews: 847,
    collection: 'At-home phlebotomy service'
  }, {
    id: 'optimal-health',
    category: 'Longevity called. It wants your blood',
    name: 'Optimal Health Blood Test',
    description: 'Unlock a deeper understanding of your health with our most comprehensive panel covering 59 biomarkers',
    price: '£249.00',
    turnaround: 'Results estimated in 4 working days',
    biomarkers: '59 biomarkers',
    rating: 4.9,
    reviews: 1542,
    collection: 'Venous collection'
  }, {
    id: 'ultimate-performance',
    category: 'Unlock your peak performance',
    name: 'Ultimate Performance Blood Test',
    description: 'Are you looking to transform your body composition and physical performance? This test analyzes key markers',
    price: '£199.00',
    turnaround: 'Results estimated in 3 working days',
    biomarkers: '57 biomarkers',
    rating: 4.8,
    reviews: 892,
    collection: 'Finger-prick or Venous collection'
  }, {
    id: 'advanced-well-woman',
    category: 'Get the answers you\'ve been looking for',
    name: 'Advanced Well Woman Blood Test',
    description: 'Take control of your health with our best-selling women\'s health test covering hormones, nutrition and more',
    price: '£159.00',
    turnaround: 'Results estimated in 3 working days',
    biomarkers: '47 biomarkers',
    rating: 4.7,
    reviews: 1234,
    collection: 'Finger-prick or Venous collection'
  }];
  return <>
      {/* Hero Section */}
      <section className="bg-[#081129] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Most Popular Tests</h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8">
              Check out our best-selling tests, trusted by thousands of people across the UK for comprehensive health screening.
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
            <h2 className="text-3xl font-bold text-[#081129] my-[20px] mb-12">
              Why Choose Popular Tests?
            </h2>
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
              <option>Price, high to low</option>
              <option>Price, low to high</option>
              <option>Most popular</option>
              <option>Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {popularTests.map(test => <TestCard key={test.id} {...test} />)}
          </div>

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
                    <img src="/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png" alt="myhealth checkup Logo" className="h-8 w-8 rounded-lg" />
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
    </>;
};
export default MostPopularTests;