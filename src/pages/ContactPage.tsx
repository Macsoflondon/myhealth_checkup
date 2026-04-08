import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import PageBreadcrumb from '@/components/common/PageBreadcrumb';
import PageBanner from '@/components/sections/PageBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Globe, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name must be less than 100 characters').regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters').regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().trim().max(20, 'Phone number must be less than 20 characters').regex(/^[\d\s+()-]*$/, 'Phone number contains invalid characters').optional().or(z.literal('')),
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const providerContacts = [
  { name: 'Medichecks', phone: '0345 060 0600' },
  { name: 'GoodBody Clinic', phone: '01225 444 144' },
  { name: 'Randox Health', phone: '028 9442 2413' },
  { name: 'London Medical Laboratory', phone: '0207 183 6122' },
  { name: 'Clinilabs', phone: '020 4525 8805' },
  { name: 'London Health Company', phone: '020 8087 0017' },
  { name: 'Medical Diagnosis', phone: '020 8830 0503' },
  { name: 'Thriva', phone: null },
  { name: 'Lola Health', phone: null },
];

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      logger.info('Contact form submitted:', { ...data, email: data.email.substring(0, 3) + '***' });
      toast({ title: 'Message sent', description: 'Thank you for your message. We will respond within 24 hours.' });
      form.reset();
    } catch (error) {
      toast({ title: 'Error', description: 'There was a problem sending your message. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us | myhealth checkup</title>
        <meta name="description" content="Get in touch with myhealth checkup. We're here to help with questions about health tests, providers, and our comparison platform." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact myhealth checkup",
          "description": "Get in touch with myhealth checkup for questions about health tests and providers.",
          "url": "https://myhealthcheckup.co.uk/contact",
          "isPartOf": { "@type": "WebSite", "name": "myhealth checkup", "url": "https://myhealthcheckup.co.uk" }
        })}</script>
      </Helmet>
      <Header />
      <main className="flex-grow bg-[#081129] md:bg-white">
        <PageBreadcrumb segments={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} backLabel="Back" />
        <PageBanner title="Contact Us" subtitle="We're here to help with any questions about health testing or our platform" />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="text-[#081129]">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl><Input placeholder="Enter your first name" maxLength={100} className="placeholder:text-[#22c0d4]" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl><Input placeholder="Enter your last name" maxLength={100} className="placeholder:text-[#22c0d4]" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" placeholder="Enter your email" maxLength={255} className="placeholder:text-[#22c0d4]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl><Input type="tel" placeholder="Enter your phone number" maxLength={20} className="placeholder:text-[#22c0d4]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl><Input placeholder="What's this about?" maxLength={200} className="placeholder:text-[#22c0d4]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl><Textarea placeholder="Tell us how we can help you..." className="min-h-[120px] text-base bg-white placeholder:text-[#22c0d4]" maxLength={2000} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>) : 'Send Message'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Provider Contact Directory */}
                <Card className="text-[#081129]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Provider Contact Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contact our trusted providers directly for test-specific enquiries.
                    </p>
                    <div className="space-y-3">
                      {providerContacts.map((provider) => (
                        <div key={provider.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="font-medium text-sm">{provider.name}</span>
                          {provider.phone ? (
                            <a href={`tel:${provider.phone.replace(/\s/g, '')}`} className="text-sm text-[#22c0d4] hover:text-[#e70d69] font-medium transition-colors">
                              {provider.phone}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Online support only
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-[#081129]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">All Enquiries</p>
                        <p className="text-sm text-primary">support@myhealthcheckup.co.uk</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Response time: Within 24 hours</p>
                  </CardContent>
                </Card>

                <Card className="text-[#081129]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Office Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <address className="not-italic">
                      <p className="font-medium">myhealth checkup Ltd</p>
                      <p>2/369 Clapham Road</p>
                      <p>SW London, SW9 9BT</p>
                      <p>United Kingdom</p>
                    </address>
                    <p className="text-sm mt-4 text-muted-foreground">Company Registration: 16589056 (England & Wales)</p>
                  </CardContent>
                </Card>

                <Card className="text-[#081129]">
                  <CardHeader>
                    <CardTitle>Emergency Medical Situations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-destructive/30 rounded-lg p-4 bg-destructive">
                      <p className="font-medium mb-2 text-destructive-foreground">Important Notice</p>
                      <p className="text-sm text-destructive-foreground">
                        If you have a medical emergency, please call 999 or visit your nearest A&E department immediately.
                        Our service is not suitable for urgent medical situations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
