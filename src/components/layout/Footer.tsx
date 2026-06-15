import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import complianceBadges from "@/assets/compliance/compliance-badges.svg";
import cyberEssentialsLogo from "@/assets/compliance/cyber-essentials-logo.webp";


const Footer = () => {
  const { t } = useTranslation();

  const healthTestLinks = [
    { name: t("footer.links.mensHealth"), link: "/tests/mens-health" },
    { name: t("footer.links.womensHealth"), link: "/tests/womens-health" },
    { name: t("footer.links.heartHealth"), link: "/tests/heart" },
    { name: t("footer.links.diabetes"), link: "/tests/diabetes" },
    { name: t("footer.links.thyroid"), link: "/thyroid" },
    { name: t("footer.links.fertility"), link: "/fertility-tests" },
  ];

  const companyLinks = [
    { name: t("footer.links.aboutUs"), link: "/about" },
    { name: t("footer.links.howItWorks"), link: "/how-it-works" },
    { name: "Our Providers", link: "/providers" },
    { name: t("footer.links.faqs"), link: "/faqs" },
    { name: "Health Resource Hub", link: "/blog" },
    { name: "Test Categories", link: "/test-categories" },
    { name: t("footer.links.contact"), link: "/contact" },
    { name: "Feedback & Complaints", link: "/complaints" },
    { name: "Legal Hub", link: "/legal" },
  ];

  return (
    <footer>
      {/* ========== Top Gradient Divider ========== */}
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      {/* ========== Main Footer ========== */}
      <div className="bg-[#060d20] relative overflow-hidden pt-12 sm:pt-14 pb-8 sm:pb-10">
        {/* Decorative glow orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-turquoise/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <HealthTestsColumn links={healthTestLinks} />
            <CompanyColumn links={companyLinks} />
            <StayInformedColumn />
          </div>

          {/* ========== Brief Medical Disclaimer ========== */}
          <div
            id="medical-disclaimer"
            role="note"
            aria-label="Medical disclaimer"
            className="mt-8 sm:mt-10 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-5 text-center"
          >
            <p className="text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-brand-pink">Medical disclaimer:</span>{" "}
              <span className="text-white/85">
                This site provides comparison information only and does not constitute medical advice. See our{" "}
                <Link to="/about/medical-review" className="underline hover:text-brand-pink transition-colors">
                  Medical Review &amp; Editorial Standards
                </Link>{" "}
                for full details.
              </span>
            </p>
          </div>

        </div>
      </div>

      {/* ========== Copyright ========== */}
      <div className="bg-brand-navy pb-4 pt-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-brand-pink/80 font-sans">
            © 2026 MYHEALTHCHECKUP LTD. Registered in England &amp; Wales, Company No. 16589056. All rights reserved.
          </p>
        </div>
      </div>

      {/* ========== Pink Divider Line ========== */}
      <div className="h-[2px] bg-brand-pink" />

      {/* ========== Brand Bar ========== */}
      <div className="bg-[#060d20] py-5 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-xl sm:text-2xl md:text-3xl">
                <span className="text-white">my</span>
                <span className="text-brand-turquoise text-primary-foreground">health</span>
              </span>
              <span className="font-heading text-base sm:text-lg md:text-xl text-brand-turquoise -ml-2 text-primary">
                checkup
              </span>
            </div>
            <p className="font-heading font-bold text-xs sm:text-sm md:text-base text-white">
              Your <span className="text-brand-pink text-primary">health!</span> Your{" "}
              <span className="text-brand-pink">choice!</span> One{" "}
              <span className="text-brand-turquoise text-primary-foreground">trusted</span> platform!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ========== Column heading ========== */
const ColumnHeading = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-px flex-1 bg-brand-turquoise/30" />
    <span className="text-brand-turquoise text-primary-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] whitespace-nowrap">
      {title}
    </span>
    <div className="h-px flex-1 bg-brand-turquoise/30" />
  </div>
);

/* ========== Health Tests Column (links + social) ========== */
const HealthTestsColumn = ({ links }: { links: { name: string; link: string }[] }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
    <ColumnHeading title="Health Tests" />
    <ul className="space-y-2.5">
      {links.map((item, i) => (
        <li key={i}>
          <Link to={item.link} className="text-white/80 hover:text-brand-pink transition-colors text-xs sm:text-sm font-sans">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>

    {/* Divider + Follow Us */}
    <div className="mt-5 pt-4 border-t border-white/10">
      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-3">Follow Us</p>
      <div className="flex gap-3">
        <SocialIcon href="https://www.instagram.com/myhealthcheckup_uk" label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
          </svg>
        </SocialIcon>
        <SocialIcon href="https://www.facebook.com/myhealthcheckupuk" label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </SocialIcon>
        <SocialIcon href="https://www.tiktok.com/@myhealthcheckup" label="TikTok">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </SocialIcon>
      </div>
    </div>
  </div>
);

/* ========== Company Column (links + compliance badges) ========== */
const CompanyColumn = ({ links }: { links: { name: string; link: string }[] }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
    <ColumnHeading title="Company" />
    <ul className="space-y-2.5">
      {links.map((item, i) => (
        <li key={i}>
          <Link to={item.link} className="text-white/80 hover:text-brand-pink transition-colors text-xs sm:text-sm font-sans">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>

    {/* Divider + Compliance badges */}
    <div className="mt-5 pt-4 border-t border-white/10">
      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-3">Compliance</p>
      <div className="flex gap-3 items-start">
        <img
          src={complianceBadges}
          alt="ICO Registered, Companies House, UK GDPR compliance badges"
          loading="lazy"
          decoding="async"
          className="h-16 sm:h-20 w-auto object-contain"
        />
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-brand-navy flex items-center justify-center p-1.5">
          <img src={cyberEssentialsLogo} alt="Cyber Essentials" loading="lazy" decoding="async" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  </div>
);

/* ========== Stay Informed Column (newsletter) ========== */
const StayInformedColumn = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError(true);
      setTimeout(() => setError(false), 2500);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
      <ColumnHeading title="Stay Informed" />
      <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
        New tests, new providers, straight to your inbox. Provider updates and platform improvements — when they matter.
      </p>
      {submitted ? (
        <p className="text-brand-turquoise font-heading font-bold text-sm tracking-wide">
          Subscribed ✓ — thank you.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your email address"
            aria-label="Email address"
            className="w-full rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/35 outline-none transition-colors focus:border-brand-turquoise"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: `1.5px solid ${error ? "#e70d69" : "rgba(34,192,212,0.28)"}`,
            }}
          />
          <button
            onClick={handleSubmit}
            className="bg-brand-turquoise hover:bg-[#1aa8bb] text-[#081129] font-heading font-extrabold text-xs uppercase tracking-[0.1em] px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            Subscribe
          </button>
        </div>
      )}
      <p className="mt-3 text-[10px] text-white/40 leading-relaxed">
        We will never share your email. Unsubscribe at any time.
      </p>
    </div>
  );
};

/* ========== Social Icon ========== */
const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Follow us on ${label}`}
    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white"
  >
    {children}
  </a>
);

export default Footer;
