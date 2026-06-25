import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, Database, Cookie, UserCheck, Mail, AlertTriangle, Server } from 'lucide-react';
import PageBanner from '@/components/sections/PageBanner';
import { Link } from 'react-router-dom';

const TrustCentrePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Trust Centre | myhealth checkup</title>
        <meta
          name="description"
          content="How myhealth checkup handles security, privacy, data protection and the controls in place to keep your information safe."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/trust" />
        <meta property="og:title" content="Trust Centre | myhealth checkup" />
        <meta property="og:description" content="Security, privacy and data protection controls at myhealth checkup." />
        <meta property="og:url" content="https://myhealthcheckup.co.uk/trust" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner
          title="Trust Centre"
          subtitle="Transparency about the security, privacy and data-protection controls we operate."
        />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-sm text-muted-foreground">
              This page is maintained by MYHEALTHCHECKUP LTD to answer common security and privacy
              questions about myhealth checkup. It describes controls currently in place and is
              editable project content — it is not an independent certification or attestation.
              Lovable provides the underlying hosting platform; certain platform-level capabilities
              are noted below, but the controls described here remain the responsibility of MYHEALTHCHECKUP LTD.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Encryption in transit</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  All traffic to myhealthcheckup.co.uk is served over HTTPS using modern TLS.
                  API calls to our backend use authenticated, TLS-encrypted connections.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5" /> Hosting & platform</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  The application is hosted on Lovable's managed platform with a Supabase
                  (PostgreSQL) backend operating in EU data regions. Database and edge function
                  access is restricted to authorised service credentials.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5" /> Authentication & access</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  User accounts use email/password or Google OAuth. Administrative actions require
                  multi-factor authentication (AAL2). Role-based access is enforced server-side via
                  PostgreSQL row-level security policies.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Data we collect</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  We collect the minimum data needed to run the comparison service: name, email,
                  phone number (optional), and saved tests/providers. We do not store raw medical
                  results or identifiable diagnostic data on behalf of users browsing the site.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Cookie className="h-5 w-5" /> Cookies & analytics</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Non-essential cookies are loaded only after consent. See our{' '}
                  <Link to="/cookies" className="underline">Cookie Policy</Link> for the full list of
                  cookies and the providers behind them.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Your rights (UK GDPR)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  You can request access, correction, deletion or export of your personal data at
                  any time. See the{' '}
                  <Link to="/privacy-policy" className="underline">Privacy Policy</Link> for the full
                  process and statutory response times.
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Reporting a vulnerability</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  If you believe you have discovered a security vulnerability affecting myhealth
                  checkup, please report it privately. Do not publicly disclose details until we
                  have had a reasonable opportunity to investigate and remediate.
                </p>
                <p>
                  Security contact:{' '}
                  <a href="mailto:security@myhealthcheckup.co.uk" className="underline">
                    security@myhealthcheckup.co.uk
                  </a>
                  . Machine-readable details are published at{' '}
                  <a href="/.well-known/security.txt" className="underline">/.well-known/security.txt</a>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Compliance & contact</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  We operate under UK GDPR and the Data Protection Act 2018. Provider listings are
                  restricted to UKAS-accredited laboratories and CQC-regulated clinics where
                  applicable — see{' '}
                  <Link to="/how-we-rank" className="underline">How we rank</Link> for our editorial
                  and inclusion standards.
                </p>
                <p>
                  Privacy queries:{' '}
                  <a href="mailto:privacy@myhealthcheckup.co.uk" className="underline">
                    privacy@myhealthcheckup.co.uk
                  </a>
                </p>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              We do not claim certification under SOC 2, ISO 27001, HIPAA or any other standard
              unless explicitly stated on this page. Statements above reflect controls currently in
              operation and are reviewed periodically.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrustCentrePage;
