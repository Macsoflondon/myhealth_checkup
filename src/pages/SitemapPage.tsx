import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
const SitemapPage = () => {
  const siteStructure = [{
    title: "Main Pages",
    links: [{
      name: "Home",
      path: "/"
    }, {
      name: "Compare Tests",
      path: "/compare"
    }, {
      name: "Intelligent Search",
      path: "/search"
    }, {
      name: "How It Works",
      path: "/how-it-works"
    }, {
      name: "About Us",
      path: "/about"
    }]
  }, {
    title: "Health Testing Services",
    links: [{
      name: "Cancer Screening",
      path: "/tests/cancer"
    }, {
      name: "Diabetes Testing",
      path: "/tests/diabetes"
    }, {
      name: "Heart Health",
      path: "/tests/heart"
    }, {
      name: "Vitamin Deficiency",
      path: "/tests/vitamins"
    }, {
      name: "Gut Health",
      path: "/tests/gut"
    }, {
      name: "Men's Health",
      path: "/tests/mens-health"
    }, {
      name: "Women's Health",
      path: "/tests/womens-health"
    }]
  }, {
    title: "Information & Support",
    links: [{
      name: "FAQs",
      path: "/faqs"
    }, {
      name: "Health Resources",
      path: "/blog"
    }, {
      name: "Contact Us",
      path: "/contact"
    }, {
      name: "Partners",
      path: "/partners"
    }]
  }, {
    title: "Legal & Compliance",
    links: [{
      name: "Privacy Policy",
      path: "/privacy-policy"
    }, {
      name: "Terms & Conditions",
      path: "/terms"
    }, {
      name: "Cookie Policy",
      path: "/cookies"
    }, {
      name: "Accessibility",
      path: "/accessibility"
    }]
  }, {
    title: "User Account",
    links: [{
      name: "Sign In / Register",
      path: "/auth"
    }, {
      name: "Dashboard",
      path: "/dashboard"
    }]
  }];
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-[#081129]">
        <div className="container mx-auto px-4 py-12 bg-[#081129]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-6 text-[#22c0d4]">Site Map</h1>
              <p className="font-normal text-xl text-white">
                Navigate our complete site structure and find exactly what you're looking for.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteStructure.map((section, index) => <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => <li key={linkIndex}>
                          <Link to={link.path} className="text-primary hover:text-primary/80 transition-colors text-sm">
                            {link.name}
                          </Link>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>)}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Need Help Finding Something?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Can't find what you're looking for? Our search function and customer support team are here to help.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/search" className="text-primary hover:text-primary/80">
                    Try our intelligent search →
                  </Link>
                  <Link to="/contact" className="text-primary hover:text-primary/80">
                    Contact support →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default SitemapPage;