import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
const ContactPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12 bg-[#081129]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              
              <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-white">
                We're here to help with any questions about health testing or our platform
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">First Name</label>
                        <Input placeholder="Enter your first name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Last Name</label>
                        <Input placeholder="Enter your last name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <Input type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number (Optional)</label>
                      <Input type="tel" placeholder="Enter your phone number" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input placeholder="What's this about?" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea placeholder="Tell us how we can help you..." className="min-h-[120px] text-base bg-white" />
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Phone Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold mb-2">0800 123 4567</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Speak to our health testing experts
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="bg-[#081129]">Monday - Friday: 9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="h-4 w-4 opacity-0" />
                      <span className="rounded-xl">Saturday: 10:00 AM - 4:00 PM</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 bg-white">
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
                      <div>
                        
                        
                      </div>
                      
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Response time: Within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-[#008811] bg-[Transparen]">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Office Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <address className="not-italic">
                      <p className="font-medium">myhealth checkup Ltd</p>
                      <p>2/369 Clapham Road</p>
                      <p>London, SW9 9BT</p>
                      <p>United Kingdom</p>
                    </address>
                    <p className="text-sm mt-4 text-[#081129]">Company Registration: 16589056 (England & Wales)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Medical Situations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-red-200 rounded-lg p-4 bg-[#f04646]">
                      <p className="font-medium mb-2 text-white">Important Notice</p>
                      <p className="text-sm text-white">
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
    </div>;
};
export default ContactPage;