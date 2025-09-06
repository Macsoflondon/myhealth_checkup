import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const FAQsPage = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          q: "What is myhealth checkup?",
          a: "myhealth checkup is the UK's leading comparison platform for private health tests. We help you compare prices, providers, and test options to make informed healthcare decisions."
        },
        {
          q: "Do I need a GP referral for these tests?",
          a: "No! All tests on our platform are private and don't require a GP referral. You can book directly with accredited providers."
        },
        {
          q: "Are the test providers regulated?",
          a: "Yes, all our partner providers are UKAS-accredited and regulated by relevant UK authorities including CQC and MHRA where applicable."
        }
      ]
    },
    {
      title: "Tests & Results",
      faqs: [
        {
          q: "How accurate are the tests?",
          a: "All tests are processed in UKAS-accredited laboratories using the same standards as NHS labs. Results are reviewed by qualified healthcare professionals."
        },
        {
          q: "How long do results take?",
          a: "Turnaround times vary by test type, typically ranging from 2-14 days. Specific timelines are shown for each test during comparison."
        },
        {
          q: "What if my results are abnormal?",
          a: "Many providers offer GP review services or can recommend follow-up care. We also provide educational resources to help you understand your results."
        },
        {
          q: "Can I share results with my GP?",
          a: "Absolutely! All results come with detailed reports that you can share with your NHS GP or private healthcare provider."
        }
      ]
    },
    {
      title: "Booking & Payment",
      faqs: [
        {
          q: "How does the booking process work?",
          a: "Compare tests on our platform, choose your preferred provider, then click 'Book Now' to be directed to their secure booking system."
        },
        {
          q: "Are prices fixed?",
          a: "We display real-time pricing from providers. Final prices are confirmed during the booking process with your chosen provider."
        },
        {
          q: "What payment methods are accepted?",
          a: "Payment methods vary by provider but typically include credit/debit cards, PayPal, and some offer payment plans or 'buy now, pay later' options."
        },
        {
          q: "Can I cancel or reschedule?",
          a: "Cancellation and rescheduling policies vary by provider. Check their specific terms during booking."
        }
      ]
    },
    {
      title: "Sample Collection",
      faqs: [
        {
          q: "What collection methods are available?",
          a: "Options include home test kits, clinic visits, mobile phlebotomy, or self-collection at provider locations."
        },
        {
          q: "How do home test kits work?",
          a: "Kits are posted to you with detailed instructions. Most involve simple finger-prick blood samples or saliva collection."
        },
        {
          q: "Are home tests as accurate as clinic tests?",
          a: "Yes! Home test kits use the same laboratory standards. Clear instructions ensure proper sample collection."
        },
        {
          q: "What if I can't collect the sample myself?",
          a: "Many providers offer mobile phlebotomy services or you can visit their clinic locations for professional collection."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Support</Badge>
              <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground">
                Find answers to common questions about health testing and our platform
              </p>
            </div>

            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem 
                          key={faqIndex} 
                          value={`${categoryIndex}-${faqIndex}`}
                        >
                          <AccordionTrigger className="text-left">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Still Have Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Email Support</h4>
                    <p className="text-sm text-muted-foreground mb-2">support@myhealthhub.co.uk</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Phone Support</h4>
                    <p className="text-sm text-muted-foreground mb-2">0800 123 4567</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 9am-6pm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQsPage;