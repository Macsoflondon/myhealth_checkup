import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from '@/lib/router-compat';
import PageBanner from '@/components/sections/PageBanner';
import {
  Home,
  FlaskConical,
  Info,
  ShieldCheck,
  UserRound,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';

interface SitemapSection {
  title: string;
  icon: LucideIcon;
  links: { name: string; path: string }[];
}

const siteStructure: SitemapSection[] = [{
  title: "Main Pages",
  icon: Home,
  links: [{ name: "Home", path: "/" }, { name: "Compare Tests", path: "/compare" }, { name: "Test Categories", path: "/test-categories" }, { name: "Intelligent Search", path: "/search" }, { name: "How It Works", path: "/how-it-works" }, { name: "About Us", path: "/about" }]
}, {
  title: "Health Testing Services",
  icon: FlaskConical,
  links: [{ name: "Cancer Screening", path: "/tests/cancer" }, { name: "Diabetes Testing", path: "/tests/diabetes" }, { name: "Heart Health", path: "/tests/heart" }, { name: "Vitamin Deficiency", path: "/tests/vitamins" }, { name: "Gut Health", path: "/tests/gut" }, { name: "Men's Health", path: "/tests/mens-health" }, { name: "Women's Health", path: "/tests/womens-health" }]
}, {
  title: "Information & Support",
  icon: Info,
  links: [{ name: "FAQs", path: "/faqs" }, { name: "Health Resources", path: "/blog" }, { name: "Contact Us", path: "/contact" }, { name: "Partners", path: "/partners" }]
}, {
  title: "Legal & Compliance",
  icon: ShieldCheck,
  links: [{ name: "Privacy Policy", path: "/privacy-policy" }, { name: "Terms & Conditions", path: "/terms" }, { name: "Cookie Policy", path: "/cookies" }, { name: "Accessibility", path: "/accessibility" }]
}, {
  title: "User Account",
  icon: UserRound,
  links: [{ name: "Sign In / Register", path: "/auth" }, { name: "Dashboard", path: "/health-dashboard" }]
}];

const SitemapPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Helmet>
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main className="flex-grow bg-[#f7f9fc]">
        <PageBanner
          title="Site"
          accent="Map"
          subtitle="Navigate our complete site structure and find exactly what you're looking for."
        />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteStructure.map((section) => {
                const Icon = section.icon;
                return (
                  <section
                    key={section.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-[#e3e9f2] hover:border-[#22c0d4] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-lg bg-[#22c0d4]/10 flex items-center justify-center text-[#081129]">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <h2 className="text-lg font-bold text-[#081129] font-montserrat">{section.title}</h2>
                    </div>
                    <ul className="space-y-3">
                      {section.links.map((link) => <li key={link.path}>
                          <Link to={link.path} className="text-[#0e9aac] font-medium hover:text-[#081129] hover:underline underline-offset-4 transition-colors text-sm">{link.name}</Link>
                        </li>)}
                    </ul>
                  </section>
                );
              })}

              <section className="bg-[#22c0d4]/10 rounded-xl p-6 border border-[#22c0d4]/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#081129]">
                      <LifeBuoy className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-[#081129] font-montserrat">Need help finding something?</h2>
                  </div>
                  <p className="text-sm text-[#081129]/70 mb-6">Try our intelligent search, or contact our team and we will point you in the right direction.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link to="/search" className="text-sm font-medium text-[#0e9aac] hover:text-[#081129] hover:underline underline-offset-4 transition-colors">Try intelligent search →</Link>
                  <Link to="/contact" className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#22c0d4] to-[#e70d69] text-white font-semibold text-sm py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Contact us
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default SitemapPage;
