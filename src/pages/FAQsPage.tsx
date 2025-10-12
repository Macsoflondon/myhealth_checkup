import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, Phone, TrendingUp, Shield, FileCheck, ChevronRight, ArrowUp, AlertCircle } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
const FAQsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const faqCategories = [{
    title: "Getting Started",
    icon: <TrendingUp className="h-5 w-5" />,
    faqs: [{
      q: "What is myhealth checkup?",
      a: "myhealth checkup is the UK's leading comparison platform for private health tests. We help you compare prices, providers, and test options to make informed healthcare decisions.",
      popular: true
    }, {
      q: "Do I need a GP referral for these tests?",
      a: "No! All tests on our platform are private and don't require a GP referral. You can book directly with accredited providers.",
      popular: true
    }, {
      q: "Are the test providers regulated?",
      a: "Yes, all our partner providers are UKAS-accredited and regulated by relevant UK authorities including CQC and MHRA where applicable."
    }, {
      q: "How do I choose the right test for me?",
      a: "Use our intelligent test finder tool to answer a few questions about your health concerns. You can also browse by category or search for specific biomarkers you want to check."
    }, {
      q: "Can I take multiple tests at once?",
      a: "Yes! Many providers offer comprehensive test panels that check multiple biomarkers in one sample. You can also order multiple individual tests, though combined panels are often more cost-effective."
    }, {
      q: "Are your tests suitable for all ages?",
      a: "Most tests are suitable for adults aged 18+. Some tests have specific age requirements or recommendations. Age-appropriate guidance is shown on each test page."
    }, {
      q: "Do I need to register before ordering?",
      a: "No registration is required to browse and compare tests. However, you'll need to register with your chosen provider during the booking process."
    }, {
      q: "What's the difference between home kits and clinic visits?",
      a: "Home kits offer convenience and privacy with finger-prick samples. Clinic visits use venous blood draws, which some find easier and may be required for certain comprehensive tests."
    }]
  }, {
    title: "Tests & Results",
    icon: <FileCheck className="h-5 w-5" />,
    faqs: [{
      q: "How accurate are the tests?",
      a: "All tests are processed in UKAS-accredited laboratories using the same standards as NHS labs. Results are reviewed by qualified healthcare professionals.",
      popular: true
    }, {
      q: "How long do results take?",
      a: "Turnaround times vary by test type, typically ranging from 2-14 days. Specific timelines are shown for each test during comparison.",
      popular: true
    }, {
      q: "What if my results are abnormal?",
      a: "Many providers offer GP review services or can recommend follow-up care. We also provide educational resources to help you understand your results."
    }, {
      q: "Can I share results with my GP?",
      a: "Absolutely! All results come with detailed reports that you can share with your NHS GP or private healthcare provider."
    }, {
      q: "Are blood tests painful?",
      a: "Finger-prick tests involve minimal discomfort - just a quick pinch. Venous blood draws may cause slight discomfort but are performed by trained professionals."
    }, {
      q: "What's the difference between finger-prick and venous blood tests?",
      a: "Finger-prick tests use capillary blood from your fingertip - convenient for home testing. Venous blood is drawn from a vein and allows for more comprehensive panels. Both are equally accurate for most biomarkers."
    }, {
      q: "Can I use test results for insurance purposes?",
      a: "Some insurance providers accept private test results, but requirements vary. Check with your insurer before testing. Note that some insurers may ask about private test results in future applications."
    }, {
      q: "Will my test results be reviewed by a doctor?",
      a: "Yes, all results are reviewed by qualified healthcare professionals. Many providers also offer optional GP consultations to discuss your results in detail."
    }, {
      q: "What accreditations do your labs hold?",
      a: "All partner laboratories are UKAS-accredited to ISO 15189 standards - the same accreditation held by NHS laboratories, ensuring the highest quality and accuracy."
    }, {
      q: "How do your tests compare to NHS tests?",
      a: "The tests use identical laboratory standards and equipment. The main difference is speed (private results in days vs weeks) and accessibility (no GP referral needed)."
    }]
  }, {
    title: "Understanding Your Results",
    icon: <FileCheck className="h-5 w-5" />,
    faqs: [{
      q: "What do my biomarker values mean?",
      a: "Each biomarker result includes your value, the reference range, and clinical significance. Most providers offer detailed guides and many include GP review services to explain your results."
    }, {
      q: "What is a reference range and why does it vary by lab?",
      a: "Reference ranges represent typical values for healthy individuals. They can vary slightly between labs due to different equipment and methodologies, but all ranges are clinically validated."
    }, {
      q: "Why are some results flagged as 'abnormal'?",
      a: "Results outside the reference range are flagged for attention. However, 'abnormal' doesn't always mean concerning - it simply indicates further review may be needed. Context is important."
    }, {
      q: "Can I download my results as a PDF?",
      a: "Yes, all providers offer downloadable PDF reports that you can save, print, or share with healthcare professionals."
    }, {
      q: "How do I track results over time?",
      a: "Most providers offer online dashboards where you can view historical results. Comparing tests over time helps track trends and monitor improvements."
    }, {
      q: "What if I don't understand my results?",
      a: "Many providers include detailed result explanations and educational resources. Optional GP consultations are also available for personalised interpretation and next steps."
    }]
  }, {
    title: "Sample Collection & Testing Process",
    icon: <FileCheck className="h-5 w-5" />,
    faqs: [{
      q: "What collection methods are available?",
      a: "Options include home test kits, clinic visits, mobile phlebotomy, or self-collection at provider locations.",
      popular: true
    }, {
      q: "How do home test kits work?",
      a: "Kits are posted to you with detailed instructions. Most involve simple finger-prick blood samples or saliva collection."
    }, {
      q: "Are home tests as accurate as clinic tests?",
      a: "Yes! Home test kits use the same laboratory standards. Clear instructions ensure proper sample collection."
    }, {
      q: "What if I can't collect the sample myself?",
      a: "Many providers offer mobile phlebotomy services or you can visit their clinic locations for professional collection."
    }, {
      q: "Do I need to fast before my test?",
      a: "Fasting requirements vary by test type. Lipid profiles and glucose tests typically require 8-12 hours fasting. Specific instructions are provided with your test kit."
    }, {
      q: "What time of day should I take my blood sample?",
      a: "Morning samples (before 10am) are recommended for most tests, especially hormone panels, as biomarker levels can vary throughout the day."
    }, {
      q: "How do I ensure I collect enough blood for the sample?",
      a: "Warm your hands, stay hydrated, and follow the kit instructions carefully. Most kits include extra lancets in case you need another attempt."
    }, {
      q: "What happens if my sample is rejected?",
      a: "Rejected samples are rare but can occur due to insufficient volume or contamination. Providers will send a replacement kit free of charge."
    }, {
      q: "How should I store my sample before posting?",
      a: "Store at room temperature unless specified otherwise. Post on the same day of collection or the next morning using the prepaid envelope provided."
    }, {
      q: "Can I take the test during menstruation?",
      a: "For most tests, yes. However, sex hormone tests should be taken on specific cycle days (typically day 3 for fertility tests). Instructions will specify timing requirements."
    }, {
      q: "What medications might affect my results?",
      a: "Biotin supplements, blood thinners, and hormones can affect some results. Don't stop prescribed medications - note them on your test form and discuss with your GP."
    }, {
      q: "How do I activate my test kit?",
      a: "Most kits require online activation using a unique code. This links your sample to your account and ensures secure result delivery."
    }, {
      q: "What if I'm needle-phobic?",
      a: "Modern finger-prick lancets are quick and minimally painful. If you're still concerned, book a clinic appointment where trained professionals can help."
    }, {
      q: "Can someone help me collect my sample?",
      a: "Yes, a family member or friend can assist with finger-prick collection. For venous draws, book a mobile phlebotomy service or clinic appointment."
    }, {
      q: "What if I can't get enough blood from my finger?",
      a: "Run your hands under warm water, massage your finger towards the tip, and keep your hand below heart level. Kits include extra lancets if needed."
    }, {
      q: "What happens after I post my sample?",
      a: "Your sample is tracked, arrives at the lab within 1-2 days, undergoes analysis, is reviewed by healthcare professionals, and results are typically available within the stated turnaround time."
    }]
  }, {
    title: "Booking & Payment",
    icon: <Shield className="h-5 w-5" />,
    faqs: [{
      q: "How does the booking process work?",
      a: "Compare tests on our platform, choose your preferred provider, then click 'Book Now' to be directed to their secure booking system."
    }, {
      q: "Are prices fixed?",
      a: "We display real-time pricing from providers. Final prices are confirmed during the booking process with your chosen provider."
    }, {
      q: "What payment methods are accepted?",
      a: "Payment methods vary by provider but typically include credit/debit cards, PayPal, and some offer payment plans or 'buy now, pay later' options."
    }, {
      q: "Can I cancel or reschedule?",
      a: "Cancellation and rescheduling policies vary by provider. Check their specific terms during booking."
    }, {
      q: "What's your refund policy?",
      a: "Refund policies are set by individual providers. Most offer refunds if you cancel before the kit is dispatched. Check provider terms during booking."
    }, {
      q: "Can I gift a test to someone?",
      a: "Yes! Many providers offer gift vouchers or allow you to purchase tests for others. The recipient will need to activate the kit in their name."
    }, {
      q: "Do you offer subscriptions or regular testing?",
      a: "Some providers offer subscription plans for regular monitoring at discounted rates. These are ideal for tracking long-term health metrics."
    }, {
      q: "Are there any additional fees?",
      a: "Prices shown include testing and standard delivery. Additional fees may apply for express delivery, mobile phlebotomy, or optional GP consultations."
    }]
  }, {
    title: "Delivery & Logistics",
    icon: <Mail className="h-5 w-5" />,
    faqs: [{
      q: "How long does delivery take?",
      a: "Standard delivery is typically 2-3 working days. Express options are available from most providers for next-day delivery."
    }, {
      q: "Can I track my test kit delivery?",
      a: "Yes, you'll receive tracking information via email once your kit is dispatched."
    }, {
      q: "What if I'm not home for delivery?",
      a: "Kits are small enough to fit through most letterboxes. If not, a collection card will be left by the courier."
    }, {
      q: "How quickly must I return my sample?",
      a: "Samples should be posted on the same day of collection or the next morning. Prepaid Royal Mail envelopes are provided for convenient posting."
    }, {
      q: "Is return postage included?",
      a: "Yes, all kits include prepaid return envelopes. Simply drop in any Royal Mail postbox - no trip to the post office needed."
    }, {
      q: "Can I collect my kit from a pharmacy?",
      a: "Currently, kits are home-delivered. However, you can choose a clinic appointment if you prefer immediate collection and testing."
    }]
  }, {
    title: "Privacy & Data Security",
    icon: <Shield className="h-5 w-5" />,
    faqs: [{
      q: "How is my personal health data protected?",
      a: "All providers are GDPR-compliant with ISO 27001 certified data security. Your data is encrypted in transit and at rest, stored on secure UK servers.",
      popular: true
    }, {
      q: "Who has access to my test results?",
      a: "Only you and qualified healthcare professionals reviewing your results. Your data is never shared without explicit consent."
    }, {
      q: "Are my results stored securely?",
      a: "Yes, all results are stored on encrypted, secure servers in compliance with UK data protection regulations and NHS data security standards."
    }, {
      q: "Can I request my data be deleted?",
      a: "Yes, under GDPR you have the right to erasure. Contact your provider's data protection team to request deletion of your personal data."
    }, {
      q: "Do you share data with third parties?",
      a: "No personal data is shared with third parties except as required for test processing (e.g., accredited laboratories). No data is sold or used for marketing without consent."
    }, {
      q: "Is my data encrypted?",
      a: "Yes, all personal and health data is encrypted using industry-standard AES-256 encryption during transmission and storage."
    }]
  }, {
    title: "Medical & Clinical Questions",
    icon: <FileCheck className="h-5 w-5" />,
    faqs: [{
      q: "Can I take a test if I'm pregnant or breastfeeding?",
      a: "Most tests are safe during pregnancy and breastfeeding, but reference ranges may differ. Inform your provider of your status for accurate interpretation."
    }, {
      q: "Should I continue taking my medications before testing?",
      a: "Yes, continue all prescribed medications unless instructed otherwise by your doctor. Note medications on your test form as they may affect some results."
    }, {
      q: "Can I exercise before my test?",
      a: "Avoid strenuous exercise 24 hours before testing as it can affect some biomarkers. Light activity is fine, but rest is recommended before sample collection."
    }, {
      q: "What if I have a medical condition?",
      a: "Private tests are suitable for people with existing conditions. Results can help monitor your condition, but always share them with your treating physician."
    }, {
      q: "Can I use results to monitor chronic conditions?",
      a: "Yes, regular private testing is excellent for monitoring conditions like diabetes, thyroid disorders, or vitamin deficiencies between NHS appointments."
    }, {
      q: "When should I retest?",
      a: "Retesting frequency depends on your condition and biomarkers. Generally, 3-6 months for monitoring; 3-12 months for routine health checks. Your results report will include guidance."
    }]
  }, {
    title: "Comparisons & Choosing Providers",
    icon: <TrendingUp className="h-5 w-5" />,
    faqs: [{
      q: "How do you select providers?",
      a: "All providers must meet strict criteria: UKAS-accredited labs, CQC registration where applicable, ISO certifications, excellent customer reviews, and transparent pricing.",
      popular: true
    }, {
      q: "Are all providers UKAS-accredited?",
      a: "Yes, 100% of our partner providers use UKAS-accredited laboratories to ISO 15189 standards, ensuring the highest quality and accuracy."
    }, {
      q: "What's the difference between providers?",
      a: "Providers differ in price, turnaround times, collection methods, additional services (like GP consultations), and user experience. We compare all factors to help you choose."
    }, {
      q: "Why do prices vary between providers?",
      a: "Pricing reflects different business models, included services, and operational costs. Some focus on volume efficiency, others on premium services like doctor support."
    }, {
      q: "Can I switch providers between tests?",
      a: "Yes, you're free to choose different providers for different tests. However, using the same provider makes it easier to track trends over time."
    }, {
      q: "How often are prices updated?",
      a: "Prices are updated in real-time through our live price feed system, ensuring you always see current market rates."
    }]
  }];

  // Popular questions from all categories
  const popularQuestions = faqCategories.flatMap(cat => cat.faqs.filter(faq => faq.popular).map(faq => ({
    ...faq,
    category: cat.title
  })));

  // Memoize filtered categories for performance
  const filteredCategories = useMemo(() => faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => debouncedSearch === '' || faq.q.toLowerCase().includes(debouncedSearch.toLowerCase()) || faq.a.toLowerCase().includes(debouncedSearch.toLowerCase()))
  })).filter(category => category.faqs.length > 0), [debouncedSearch]);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(cat => cat.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    })))
  };
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>FAQs - Frequently Asked Questions | myhealth checkup</title>
        <meta name="description" content="Find answers to common questions about private health testing, sample collection, results, pricing, and more. Get expert guidance on choosing the right tests." />
        <meta name="keywords" content="health test FAQs, private blood test questions, UK health testing, UKAS accredited tests" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/faqs" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow bg-muted/30">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-3 sm:py-4 bg-[#081129]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-white hover:text-foreground transition-colors">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">
                  FAQs
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white">
          <div className="container mx-auto px-4 py-12 sm:py-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto">
              Find answers to common questions about health testing and our platform
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl sm:max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <Input type="search" placeholder="Search FAQs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 sm:pl-12 py-5 sm:py-6 text-base sm:text-lg bg-white text-gray-900 border-none shadow-lg focus-visible:ring-2 focus-visible:ring-white/50" aria-label="Search frequently asked questions" aria-describedby="search-description" />
                <span id="search-description" className="sr-only">
                  Type to search through all FAQ categories and questions
                </span>
                {searchQuery && <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 h-8 w-8 p-0" aria-label="Clear search">
                    ×
                  </Button>}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Questions */}
        {debouncedSearch === '' && <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="bg-[hsl(var(--section-dark))] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
                Popular Questions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {popularQuestions.map((faq, idx) => <Card key={idx} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                    <CardHeader className="p-4 sm:p-6">
                      <Badge className="mb-2 sm:mb-3 bg-primary/20 text-white border-primary/30 w-fit text-xs sm:text-sm">
                        {faq.category}
                      </Badge>
                      <CardTitle className="text-base sm:text-lg text-white group-hover:text-primary transition-colors">
                        {faq.q}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <p className="text-white/80 text-sm line-clamp-3">{faq.a}</p>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </div>}

        {/* FAQ Categories */}
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {filteredCategories.length > 0 ? <Accordion type="single" collapsible className="space-y-4 sm:space-y-6">
              {filteredCategories.map((category, catIdx) => <div key={catIdx} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-primary/20 p-1.5 sm:p-2 rounded-lg text-primary flex-shrink-0">
                        {category.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 min-w-0">
                        {category.title}
                      </h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm flex-shrink-0">
                        {category.faqs.length}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <Accordion type="single" collapsible>
                      {category.faqs.map((faq, faqIdx) => <AccordionItem key={faqIdx} value={`faq-${catIdx}-${faqIdx}`} className="border-b last:border-0">
                          <AccordionTrigger className="text-left hover:text-primary transition-colors py-3 sm:py-4 text-gray-900 font-medium text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[44px]">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-700 pb-3 sm:pb-4 leading-relaxed text-sm sm:text-base">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>)}
                    </Accordion>
                  </div>
                </div>)}
            </Accordion> : <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-lg px-4">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
                We couldn't find any FAQs matching "{debouncedSearch}". Try different keywords or browse all categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setSearchQuery('')} className="bg-primary hover:bg-primary/90 min-h-[44px]">
                  Clear Search
                </Button>
                <Button variant="outline" onClick={scrollToTop} className="min-h-[44px]">
                  Back to Top
                </Button>
              </div>
            </div>}
        </div>

        {/* Related Resources */}
        <div className="container mx-auto px-4 py-8 sm:py-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Related Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-primary text-lg sm:text-xl">Browse Tests</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    Explore our comprehensive range of health tests from UKAS-accredited providers.
                  </p>
                  <Link to="/compare-tests">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white min-h-[44px]">
                      View All Tests
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-primary text-lg sm:text-xl">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    Learn about our simple 3-step process from booking to receiving your results.
                  </p>
                  <Link to="/how-it-works">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white min-h-[44px]">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
                Our support team is here to help you find the right test for your needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="bg-primary/10 p-3 sm:p-4 rounded-full">
                        <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Email Support</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      Get detailed answers to your questions
                    </p>
                    <a href="mailto:support@myhealthcheckup.co.uk" className="text-primary hover:text-primary/80 font-semibold text-base sm:text-lg break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                      support@myhealthcheckup.co.uk
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="bg-primary/10 p-3 sm:p-4 rounded-full">
                        <Phone className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Phone Support</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      Speak with our team directly
                    </p>
                    <a href="tel:+442012345678" className="text-primary hover:text-primary/80 font-semibold text-base sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                      +44 20 1234 5678
                    </a>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Mon-Fri: 9am-6pm GMT
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back to Top Button */}
        {showBackToTop && <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Scroll back to top">
            <ArrowUp className="h-6 w-6" />
          </button>}
      </main>
      <Footer />
    </div>;
};
export default FAQsPage;