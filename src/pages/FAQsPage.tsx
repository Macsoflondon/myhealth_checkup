import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, Phone, ThumbsUp, ThumbsDown, TrendingUp, Shield, FileCheck } from 'lucide-react';
const FAQsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter FAQs based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => searchQuery === '' || faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(category => category.faqs.length > 0);
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-muted/30">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Find answers to common questions about health testing and our platform
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="text" placeholder="Search FAQs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-12 text-base bg-white" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 bg-white">
          <div className="max-w-5xl mx-auto">
            {/* Popular Questions */}
            {searchQuery === '' && <Card className="mb-12 border-primary/20">
                <CardHeader className="bg-[#081129]">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Popular Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-[#081129]">
                  <div className="grid gap-4">
                    {popularQuestions.map((faq, idx) => <div key={idx} className="p-4 rounded-lg transition-colors bg-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2 text-foreground">{faq.q}</h4>
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {faq.category}
                          </Badge>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>}

            {/* Search Results Count */}
            {searchQuery && <div className="mb-6 text-muted-foreground">
                Found {filteredCategories.reduce((sum, cat) => sum + cat.faqs.length, 0)} results for "{searchQuery}"
              </div>}

            {/* FAQ Categories */}
            <div className="space-y-6">
              {filteredCategories.map((category, categoryIndex) => <Card key={categoryIndex}>
                  <CardHeader className="from-primary/5 to-secondary/5 bg-[t#] rounded bg-[#e70d69]">
                    <CardTitle className="flex items-center gap-3 font-medium text-white text-left">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <div>
                        <div className="text-xl">{category.title}</div>
                        
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 bg-[t] bg-[#081129]">
                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, faqIndex) => <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border-b last:border-0">
                          <AccordionTrigger className="text-left hover:text-primary transition-colors py-4">
                            <div className="flex items-start gap-3 pr-4">
                              <span className="font-semibold text-[\xA2#] text-white">{faq.q}</span>
                              {faq.popular && <Badge variant="secondary" className="shrink-0 ml-2">
                                  Popular
                                </Badge>}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4">
                            <p className="leading-relaxed">{faq.a}</p>
                          </AccordionContent>
                        </AccordionItem>)}
                    </Accordion>
                  </CardContent>
                </Card>)}
            </div>

            {/* No Results */}
            {filteredCategories.length === 0 && searchQuery && <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or browse all categories
                  </p>
                  <Button onClick={() => setSearchQuery('')} variant="outline">
                    Clear Search
                  </Button>
                </CardContent>
              </Card>}

            {/* Quick Links */}
            {searchQuery === '' && <Card className="mt-12 bg-gradient-to-br from-muted/50 to-muted/30">
                <CardHeader>
                  <CardTitle>Related Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link to="/how-it-works">
                      <div className="p-4 rounded-lg bg-background hover:bg-primary/5 transition-colors border">
                        <h4 className="font-semibold mb-2">How It Works</h4>
                        <p className="text-sm text-muted-foreground">
                          Learn about our testing process
                        </p>
                      </div>
                    </Link>
                    <Link to="/compare-tests">
                      <div className="p-4 rounded-lg bg-background hover:bg-primary/5 transition-colors border">
                        <h4 className="font-semibold mb-2">Compare Tests</h4>
                        <p className="text-sm text-muted-foreground">
                          Find and compare health tests
                        </p>
                      </div>
                    </Link>
                    <Link to="/trusted-providers">
                      <div className="p-4 rounded-lg bg-background hover:bg-primary/5 transition-colors border">
                        <h4 className="font-semibold mb-2">Our Providers</h4>
                        <p className="text-sm text-muted-foreground">
                          Meet our accredited partners
                        </p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>}

            {/* Contact Support */}
            <Card className="mt-12 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Still Have Questions?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Can't find what you're looking for? Our friendly support team is here to help.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                        <Mail className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-lg">Email Support</h4>
                    </div>
                    <p className="text-sm mb-2 font-medium">support@myhealthcheckup.co.uk</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                  <div className="p-6 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                        <Phone className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-lg">Phone Support</h4>
                    </div>
                    <p className="text-sm mb-2 font-medium">0800 123 4567</p>
                    <p className="text-xs text-muted-foreground">Monday - Friday, 9am - 6pm GMT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default FAQsPage;