import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import complianceBadges from "@/assets/compliance/compliance-badges.svg";
import cyberEssentialsLogo from "@/assets/compliance/cyber-essentials-logo.png";
import myhealthLogo from "@/assets/myhealth-logo.png";

const Footer = () => {
  const { t } = useTranslation();

  const healthTestLinks = [
    { name: t('footer.links.mensHealth'), link: "/tests/mens-health" },
    { name: t('footer.links.womensHealth'), link: "/tests/womens-health" },
    { name: t('footer.links.heartHealth'), link: "/tests/heart" },
    { name: t('footer.links.diabetes'), link: "/tests/diabetes" },
    { name: t('footer.links.thyroid'), link: "/thyroid" },
    { name: t('footer.links.fertility'), link: "/fertility-tests" },
  ];

  const companyLinks = [
    { name: t('footer.links.aboutUs'), link: "/about" },
    { name: t('footer.links.howItWorks'), link: "/how-it-works" },
    { name: "Our Providers", link: "/providers" },
    { name: "Clinic Locations", link: "/locations" },
    { name: t('footer.links.faqs'), link: "/faqs" },
    { name: "Health Resource Hub", link: "/blog" },
    { name: "Test Categories", link: "/test-categories" },
    { name: t('footer.links.contact'), link: "/contact" },
  ];


  return (
    <footer>
      {/* ========== Top Gradient Divider ========== */}
      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

      {/* ========== Main Footer ========== */}
      <div className="bg-brand-navy relative overflow-hidden pt-12 sm:pt-14 pb-8 sm:pb-10">
        {/* Decorative glow orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-turquoise/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <FooterColumn title="Health Tests" links={healthTestLinks} />
            <FooterColumn title="Company" links={companyLinks} />
            <ConnectColumn />
          </div>

          {/* ========== Disclaimer Row ========== */}
          <div className="mt-8 sm:mt-10 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-5 text-center">
            <p className="text-xs sm:text-sm leading-relaxed mb-2">
              <span className="font-semibold text-brand-pink">Important:</span>{" "}
              <span className="text-white/80">
                MyHealth Checkup is a comparison platform. We do not provide medical services. All testing is conducted by our trusted partner providers.
              </span>
            </p>
            <p className="text-xs sm:text-sm text-white/90 font-sans">
              MYHEALTHCHECKUP LTD is the UK's leading health service comparison website. &#x200B;Company No. 16589056
            </p>
          </div>
        </div>
      </div>

      {/* ========== Copyright Line ========== */}
      <div className="bg-brand-navy pb-4 pt-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-brand-pink font-sans">
            © 2026 myhealth checkup. All rights reserved.{" "}
            <Link to="/legal" className="text-brand-pink hover:text-white transition-colors underline-offset-2 hover:underline">Legal</Link>
            {" | "}
            <Link to="/terms" className="text-brand-pink hover:text-white transition-colors underline-offset-2 hover:underline">Terms &amp; Conditions</Link>
          </p>
        </div>
      </div>

      {/* ========== Pink Divider Line ========== */}
      <div className="h-[2px] bg-brand-pink" />

      {/* ========== Brand Bar ========== */}
      <div className="bg-[#060d20] py-5 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-xl sm:text-2xl md:text-3xl">
                <span className="text-white">my</span>
                <span className="text-brand-turquoise text-primary-foreground">health</span>
              </span>
              <span className="font-heading text-base sm:text-lg md:text-xl text-brand-turquoise -ml-2 text-primary">
                checkup
              </span>
            </div>
            {/* Slogan */}
            <p className="font-heading font-bold text-xs sm:text-sm md:text-base text-white">
              Your <span className="text-brand-pink text-primary">health!</span> Your <span className="text-brand-pink">choice!</span> One <span className="text-brand-turquoise text-primary-foreground">trusted</span> platform!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ========== Footer Column Component ========== */
const FooterColumn = ({ title, links }: { title: string; links: { name: string; link: string }[] }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
    {/* Column heading with flanking lines */}
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px flex-1 bg-brand-turquoise/30" />
      <span className="text-brand-turquoise text-primary-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] whitespace-nowrap">
        {title}
      </span>
      <div className="h-px flex-1 bg-brand-turquoise/30" />
    </div>
    <ul className="space-y-2.5">
      {links.map((item, i) => (
        <li key={i}>
          <Link
            to={item.link}
            className="text-white/80 hover:text-brand-pink transition-colors text-xs sm:text-sm font-sans"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/* ========== Connect Column Component ========== */
const ConnectColumn = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5">
    {/* Heading */}
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px flex-1 bg-brand-turquoise/30" />
      <span className="text-brand-turquoise text-primary-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
        Connect
      </span>
      <div className="h-px flex-1 bg-brand-turquoise/30" />
    </div>

    {/* Social Icons */}
    <p className="text-white/60 text-[10px] uppercase tracking-wider mb-2">Follow Us</p>
    <div className="flex gap-3 mb-5">
      <SocialIcon href="https://www.instagram.com/myhealthcheckup_uk" label="Instagram">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="17.5" cy="6.5" r="1.25" fill="currentColor"/></svg>
      </SocialIcon>
      <SocialIcon href="https://www.facebook.com/myhealthcheckupuk" label="Facebook">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      </SocialIcon>
      <SocialIcon href="https://www.tiktok.com/@myhealthcheckup" label="TikTok">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      </SocialIcon>
    </div>

    {/* Compliance Badges */}
    <p className="text-white/60 text-[10px] uppercase tracking-wider mb-2">Compliance</p>
    <div className="flex gap-3 items-start">
      <img src={complianceBadges} alt="ICO Registered, Companies House, UK GDPR compliance badges" className="h-16 sm:h-20 w-auto object-contain" />
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-brand-navy flex items-center justify-center p-1.5">
        <img src={cyberEssentialsLogo} alt="Cyber Essentials" className="w-full h-full object-contain" />
      </div>
    </div>
  </div>
);

/* ========== Social Icon Wrapper ========== */
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
