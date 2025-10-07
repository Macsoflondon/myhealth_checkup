import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, ExternalLink, AlertCircle } from 'lucide-react';

const providerContacts = [
  {
    id: "medichecks",
    name: "Medichecks",
    logo: "/lovable-uploads/provider-medichecks.png",
    website: "https://medichecks.com",
    phone: "0333 366 0190",
    email: null,
    note: "Contact via website for email support"
  },
  {
    id: "thriva",
    name: "Thriva",
    logo: "/lovable-uploads/provider-thriva.png",
    website: "https://thriva.co",
    phone: null,
    email: null,
    note: "Email support only - contact via website"
  },
  {
    id: "randox",
    name: "Randox Health",
    logo: "/lovable-uploads/provider-randox.png",
    website: "https://randoxhealth.com",
    phone: "0800 2545 130",
    email: "info@randoxhealth.com",
    note: null
  },
  {
    id: "london-medical-laboratory",
    name: "London Medical Laboratory",
    logo: "/lovable-uploads/provider-london-medical.png",
    website: "https://londonmedicallaboratory.com",
    phone: "020 7486 3481",
    email: "info@londonmedicallaboratory.com",
    note: null
  },
  {
    id: "goodbody-clinic",
    name: "GoodBody Clinic",
    logo: "/lovable-uploads/provider-goodbody.png",
    website: "https://goodbody.co.uk",
    phone: "020 7038 3888",
    email: "bookings@goodbodyclinic.co.uk",
    note: null
  },
  {
    id: "lola-health",
    name: "Lola Health",
    logo: "/lovable-uploads/provider-lola-health.png",
    website: "https://lolahealth.com",
    phone: null,
    email: null,
    note: "Email support only - contact via website"
  },
  {
    id: "tuli-health",
    name: "Tuli Health",
    logo: "/lovable-uploads/provider-tuli-health.png",
    website: "https://tulihealth.com",
    phone: null,
    email: "support@tulihealth.co.uk",
    note: "Email support only"
  }
];
const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Contact Our Trusted Providers</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get in touch directly with any of our verified health testing providers for bookings, support, and enquiries
              </p>
            </div>

            {/* Provider Contact Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {providerContacts.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={provider.logo} 
                        alt={`${provider.name} logo`}
                        className="h-12 w-12 object-contain"
                      />
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                    </div>
                    {provider.note && (
                      <Badge variant="secondary" className="text-xs">
                        {provider.note}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Phone */}
                    {provider.phone && (
                      <a 
                        href={`tel:${provider.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="font-medium">{provider.phone}</span>
                      </a>
                    )}

                    {/* Email */}
                    {provider.email && (
                      <a 
                        href={`mailto:${provider.email}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors break-all"
                      >
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{provider.email}</span>
                      </a>
                    )}

                    {/* Website Button */}
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      asChild
                    >
                      <a 
                        href={provider.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Notice */}
            <Card className="max-w-3xl mx-auto border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Emergency Medical Situations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  If you have a medical emergency, please call <strong className="text-foreground">999</strong> or visit your nearest A&E department immediately. 
                  These services are not suitable for urgent medical situations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default ContactPage;