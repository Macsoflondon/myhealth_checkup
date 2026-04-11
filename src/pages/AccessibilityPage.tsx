import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Ear, MousePointer, Keyboard } from 'lucide-react';
import PageBanner from '@/components/sections/PageBanner';

const AccessibilityPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Accessibility | myhealth checkup</title>
        <meta name="description" content="Our commitment to making myhealth checkup accessible to everyone. WCAG 2.1 AA compliant with screen reader support and keyboard navigation." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/accessibility" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Accessibility Statement"
          subtitle="We're committed to ensuring our website is accessible to everyone, regardless of ability or technology used."
        />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6" />
                    Visual Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• High contrast colour schemes</li>
                    <li>• Scalable text up to 200%</li>
                    <li>• Alt text for all images</li>
                    <li>• Screen reader compatibility</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-6 w-6" />
                    Keyboard Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Full keyboard navigation</li>
                    <li>• Clear focus indicators</li>
                    <li>• Logical tab order</li>
                    <li>• Skip navigation links</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ear className="h-6 w-6" />
                    Audio & Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Captions for videos</li>
                    <li>• Audio descriptions available</li>
                    <li>• No auto-playing media</li>
                    <li>• Volume controls provided</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-6 w-6" />
                    Motor Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Large clickable areas</li>
                    <li>• No time-limited actions</li>
                    <li>• Drag and drop alternatives</li>
                    <li>• Multiple input methods</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Standards Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>This website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.</p>
                <p>We regularly test our site with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Automated accessibility testing tools</li>
                  <li>Manual keyboard navigation testing</li>
                  <li>Screen reader testing (NVDA, JAWS, VoiceOver)</li>
                  <li>User testing with people with disabilities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you encounter any accessibility barriers or have suggestions for improvement, 
                  please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                   <p><strong>Email:</strong> accessibility@myhealthcheckup.co.uk</p>
                   <p><strong>Response time:</strong> We aim to respond within 2 business days</p>
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

export default AccessibilityPage;
