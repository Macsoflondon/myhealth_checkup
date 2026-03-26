import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Subscriptions from "@/components/sections/Subscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import PageBanner from "@/components/sections/PageBanner";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";

const SubscriptionsPage = () => {
  const benefits = [
    "Regular health monitoring without the hassle",
    "Significant savings compared to individual tests",
    "Priority booking and faster results",
    "Personalised health insights and recommendations",
    "Family health planning support",
    "Cancel or modify anytime"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Health Subscription Plans - myhealth checkup</title>
        <meta name="description" content="Choose from our flexible health subscription plans. Regular testing and monitoring for ongoing health insights with significant savings." />
      </Helmet>
      
      
      <Header />
      <main className="flex-grow">
        <PageBanner
          title="Health Subscription"
          accent="Plans"
          subtitle="Take the guesswork out of health monitoring with our convenient subscription plans."
        />
        <div className="container mx-auto px-4 pt-4">
          <PageBreadcrumb />
        </div>

        <Subscriptions />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Choose a Subscription?</h2>
                <p className="text-xl text-gray-600">
                  Regular health monitoring is key to early detection and prevention
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Benefits of Regular Testing</h3>
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-health-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="border-health-200">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <CardTitle className="text-xl">Member Testimonial</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-gray-600 italic mb-4">
                      "The subscription has been fantastic. I caught my vitamin D deficiency early and my energy levels have completely transformed. The quarterly testing gives me such peace of mind."
                    </blockquote>
                    <cite className="text-sm font-medium">Sarah M., myhealth checkup Member since 2023</cite>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Subscription FAQs</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Can I cancel anytime?</h3>
                  <p className="text-gray-600">Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">What if I miss a test?</h3>
                  <p className="text-gray-600">No problem! You can reschedule your test for up to 3 months after your scheduled date without any additional cost.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Can I add extra tests?</h3>
                  <p className="text-gray-600">Absolutely! Subscribers get a 15% discount on all additional tests and can easily add them to their next appointment.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">How do I manage my subscription?</h3>
                  <p className="text-gray-600">Everything is managed through your personal dashboard where you can schedule tests, view results, and update your plan.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionsPage;
