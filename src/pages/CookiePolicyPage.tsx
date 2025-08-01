import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">PECR Compliant</Badge>
              <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
              <p className="text-xl text-muted-foreground">
                This Cookie Policy explains how myhealthcheckup Ltd uses cookies and similar technologies
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Effective Date: 01/08/2025
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mt-4 text-left">
                <p className="text-sm text-gray-700">
                  <strong>Company:</strong> myhealthcheckup Ltd (trading as myhealth checkup)<br/>
                  <strong>Company Registration Number:</strong> 16589056<br/>
                  <strong>Website:</strong> myhealthcheckup.co.uk
                </p>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Cookies are small text files stored on your device when you visit a website. They allow us to recognise your device and improve your experience.
                </p>
                <p className="text-sm text-muted-foreground">
                  By using the Website, you agree to the use of cookies as described in this Policy.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-800 mb-2">Strictly Necessary Cookies</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Required for Website functionality (e.g., login, security).
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Authentication and security</li>
                    <li>• Website functionality</li>
                    <li>• Form submissions</li>
                    <li>• Load balancing</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Performance & Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Help us understand how visitors use our Website.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Google Analytics</li>
                    <li>• Page view tracking</li>
                    <li>• User journey analysis</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Functional Cookies</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Remember preferences (e.g., saved tests).
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Language preferences</li>
                    <li>• Theme settings</li>
                    <li>• Saved test preferences</li>
                    <li>• Accessibility options</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Used for personalised advertising (only with your consent).
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Social media integration</li>
                    <li>• Advertising networks</li>
                    <li>• Retargeting campaigns</li>
                    <li>• Conversion tracking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Cookie Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Session Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Deleted when you close your browser. Used for essential site functionality.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Remain on your device for a set period (typically 1-24 months) for preferences and analytics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  You can control and delete cookies in several ways:
                </p>
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Our Cookie Settings</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use our cookie preference center to control which types of cookies you accept.
                    </p>
                    <Button>Manage Cookie Preferences</Button>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Browser Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Most browsers allow you to control cookies through their settings. 
                      Note that disabling cookies may affect website functionality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">We may use third-party services that set their own cookies:</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Google Analytics:</strong> Website performance and user behavior analysis</li>
                  <li>• <strong>Payment Processors:</strong> Secure payment processing</li>
                  <li>• <strong>Customer Support:</strong> Live chat and help desk functionality</li>
                  <li>• <strong>Social Media:</strong> Social sharing and integration features</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you have questions about our cookie policy, please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Email:</strong> privacy@myhealthcheckup.co.uk</p>
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

export default CookiePolicyPage;