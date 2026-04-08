import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageBanner from '@/components/sections/PageBanner';
import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Cookie, Users, Handshake, Scale, Award } from 'lucide-react';

const legalPages = [
  { title: 'Privacy Policy', path: '/privacy-policy', icon: Shield, description: 'How we collect, use, and protect your personal data.' },
  { title: 'Terms & Conditions', path: '/terms', icon: FileText, description: 'The terms governing your use of our platform.' },
  { title: 'Cookie Policy', path: '/cookies', icon: Cookie, description: 'How we use cookies and similar technologies.' },
  { title: 'Modern Slavery Statement', path: '/modern-slavery', icon: Users, description: 'Our commitment to preventing modern slavery.' },
  { title: 'Affiliate Disclosure', path: '/affiliate-disclosure', icon: Handshake, description: 'How we earn revenue and maintain editorial independence.' },
  { title: 'Fair Trading Policy', path: '/fair-trading', icon: Scale, description: 'Our commitment to fair and transparent trading practices.' },
  { title: 'How We Rank', path: '/how-we-rank', icon: Award, description: 'Our methodology for ranking and comparing providers.' },
];

const LegalPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Legal | myhealth checkup</title>
        <meta name="description" content="Legal policies and compliance documents for myhealth checkup." />
      </Helmet>
      <Header />
      <main className="flex-grow bg-white">
        <PageBanner title="Legal" subtitle="Our policies, terms, and compliance documents." />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            {legalPages.map(({ title, path, icon: Icon, description }) => (
              <Link key={path} to={path}>
                <Card className="h-full hover:shadow-lg transition-shadow border-brand-navy/10 hover:border-brand-turquoise/40">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground mb-1">{title}</h2>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
