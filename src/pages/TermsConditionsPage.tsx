import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageBanner from '@/components/sections/PageBanner';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';

const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms & Conditions | myhealth checkup</title>
      </Helmet>
      <Header />
      <main className="flex-grow bg-muted/30">
        <PageBanner
          title="Terms &"
          accent="Conditions"
          subtitle="Please read these terms carefully before using our services."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground text-center mb-8">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <Card className="mb-8">
              <CardHeader><CardTitle>1. Acceptance of Terms</CardTitle></CardHeader>
              <CardContent>
                <p>By accessing and using myhealth checkup's website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>2. Services Description</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-4">myhealth checkup provides a comparison platform for private health testing services in the UK. Our services include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Test comparison and price monitoring</li>
                  <li>Provider reviews and ratings</li>
                  <li>Educational health content</li>
                  <li>AI-powered test recommendations</li>
                  <li>Booking facilitation with accredited providers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>3. Medical Disclaimer</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-semibold text-amber-800 mb-2">Important Medical Notice</p>
                  <p className="text-amber-700 text-sm">Our service is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.</p>
                </div>
                <ul className="text-sm space-y-2">
                  <li>• We do not provide medical advice or diagnosis</li>
                  <li>• Test results should be interpreted by qualified professionals</li>
                  <li>• Emergency medical situations require immediate professional care</li>
                  <li>• We are not responsible for medical decisions made using our platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>4. User Responsibilities</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-4">As a user of our platform, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Provide accurate and truthful information</li>
                  <li>Keep your account credentials secure</li>
                  <li>Use the service for lawful purposes only</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not attempt to interfere with platform security</li>
                  <li>Follow provider-specific terms when booking tests</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>5. Booking and Payments</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div><h4 className="font-semibold mb-2">Test Bookings</h4><p className="text-sm text-muted-foreground">When you book a test through our platform, you enter into a direct contract with the test provider. We act as an intermediary to facilitate the booking process.</p></div>
                  <div><h4 className="font-semibold mb-2">Pricing</h4><p className="text-sm text-muted-foreground">Prices displayed are provided by test providers and may change. Final pricing is confirmed during the booking process with the provider.</p></div>
                  <div><h4 className="font-semibold mb-2">Cancellations & Refunds</h4><p className="text-sm text-muted-foreground">Cancellation and refund policies are determined by individual test providers. Please review their terms before booking.</p></div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>6. Intellectual Property</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-4">All content on our platform, including but not limited to text, graphics, logos, images, software, and data compilations, is owned by myhealth checkup or our licensors and is protected by UK and international copyright laws.</p>
                <p className="text-sm text-muted-foreground">You may not reproduce, distribute, or create derivative works without express written permission.</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>7. Privacy and Data Protection</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-4">Your privacy is important to us. Our collection, use, and protection of your personal data is governed by our Privacy Policy, which complies with UK GDPR requirements.</p>
                <p className="text-sm text-muted-foreground">By using our service, you consent to our Privacy Policy and cookie usage as outlined in our Cookie Policy.</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>8. Limitation of Liability</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-4">To the fullest extent permitted by law, myhealth checkup shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.</p>
                <p className="text-sm text-muted-foreground">Our maximum liability for any claims shall not exceed the amount paid by you for our services in the 12 months preceding the claim.</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader><CardTitle>9. Changes to Terms</CardTitle></CardHeader>
              <CardContent>
                <p>We reserve the right to modify these terms at any time. Material changes will be communicated through our website or email. Continued use of our services after changes constitutes acceptance of the modified terms.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>10. Contact Information</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-4">For questions about these Terms & Conditions, please contact us:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@myhealthcheckup.co.uk</p>
                  <p><strong>Phone:</strong> 0800 123 4567</p>
                  <p><strong>Address:</strong> myhealth checkup, 123 Health Street, London, SW1A 1AA</p>
                  <p><strong>Company Registration:</strong> 12345678 (England & Wales)</p>
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

export default TermsConditionsPage;
