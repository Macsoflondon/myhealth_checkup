import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cqcLogo from "@/assets/compliance/cqc-logo.png";
import icoLogo from "@/assets/compliance/ico-logo.png";
const gdprLogo = "/lovable-uploads/b41794bb-1baf-49ff-8691-e808992ec800.png";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const categoryLinks = [
    { name: t('footer.links.mensHealth'), link: "/tests/mens-health" },
    { name: t('footer.links.womensHealth'), link: "/tests/womens-health" },
    { name: t('footer.links.heartHealth'), link: "/tests/heart" },
    { name: t('footer.links.diabetes'), link: "/compare?category=diabetes" },
    { name: t('footer.links.thyroid'), link: "/compare?category=thyroid" },
    { name: t('footer.links.fertility'), link: "/compare?category=fertility" },
    { name: t('footer.links.cookiePolicy'), link: "/cookies" },
  ];

  const companyLinks = [
    { name: t('footer.links.aboutUs'), link: "/about" },
    { name: t('footer.links.howItWorks'), link: "/how-it-works" },
    { name: "Our Providers", link: "/providers" },
    { name: "Clinic Locations", link: "/locations" },
    { name: t('footer.links.faqs'), link: "/faqs" },
    { name: t('footer.links.blog'), link: "/blog" },
    { name: t('footer.links.contact'), link: "/contact" },
  ];

  return (
    <footer>
      {/* ========== Top Area - White Background ========== */}
      <div className="bg-white pt-10 pb-8 sm:pt-12 sm:pb-10 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_auto_auto] gap-8 lg:gap-10 mb-8 sm:mb-10">
            
            {/* Column 1 - Category Links */}
            <div>
              <ul className="space-y-2.5 sm:space-y-3">
                {categoryLinks.map((item, index) => (
                  <li key={index}>
                    <Link to={item.link} className="text-[#081129] hover:text-[#e70d69] transition-colors text-xs sm:text-sm font-sans">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 - Company Links */}
            <div>
              <ul className="space-y-2.5 sm:space-y-3">
                {companyLinks.map((item, index) => (
                  <li key={index}>
                    <Link to={item.link} className="text-[#081129] hover:text-[#e70d69] transition-colors text-xs sm:text-sm font-sans">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Social Icons */}
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs sm:text-sm text-[#081129] font-semibold mb-3 block">Follow Us</span>
              <div className="flex gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/myhealthcheckup_uk"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#e70d69] group transition-colors"
                  aria-label="Follow us on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" className="text-[#081129] group-hover:text-white transition-colors" fill="none"/>
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" className="text-[#081129] group-hover:text-white transition-colors" fill="none"/>
                    <circle cx="17.5" cy="6.5" r="1.5" className="fill-[#081129] group-hover:fill-white transition-colors"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/myhealthcheckupuk"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#e70d69] group transition-colors"
                  aria-label="Follow us on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#081129] group-hover:text-white transition-colors" fill="none"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@myhealthcheckup"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#e70d69] group transition-colors"
                  aria-label="Follow us on TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#081129] group-hover:text-white transition-colors" fill="none"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 4 - Compliance Badges */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <div className="flex flex-row lg:flex-col gap-3 sm:gap-4">
                <ComplianceBadge image={icoLogo} label="ICO Registered" />
                <ComplianceBadge label="Companies House" text="CH" />
                <ComplianceBadge image={gdprLogo} label="UK GDPR" />
                <ComplianceBadge image={cqcLogo} label="CQC" />
              </div>
            </div>
          </div>

          {/* Disclaimer & Company Info */}
          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <div className="max-w-4xl">
              <p className="text-xs sm:text-sm leading-relaxed mb-4">
                <span className="font-semibold text-[#e70d69]">Important:</span>{" "}
                <span className="text-gray-600">
                  MyHealth Checkup is a comparison platform. We do not provide medical services. All testing is conducted by our trusted partner providers. We may receive a referral fee when you book through our links. This does not affect our rankings or the prices you pay.
                </span>
              </p>
              <p className="text-xs sm:text-sm text-[#081129] font-sans mb-1">
                MYHEALTHCHECKUP LTD is the UK's leading health service comparison website.
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">Company No. 16589056</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Copyright Bar - Navy ========== */}
      <div className="bg-[#081129] py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm">
            <p className="text-[#e70d69] font-medium">
              {t('footer.copyright')}
            </p>
            <nav className="flex gap-4">
              <Link to="/accessibility" className="text-white hover:text-[#e70d69] transition-colors">
                {t('footer.links.accessibility')}
              </Link>
              <Link to="/sitemap" className="text-white hover:text-[#e70d69] transition-colors">
                {t('footer.links.sitemap')}
              </Link>
              <Link to="/privacy-policy" className="text-white hover:text-[#e70d69] transition-colors">
                {t('footer.links.privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-white hover:text-[#e70d69] transition-colors">
                {t('footer.links.termsConditions')}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* ========== Brand Bar - Gradient ========== */}
      <div className="bg-gradient-to-r from-[#e70d69] to-[#22c0d4] py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/lovable-uploads/myhealth-logo-bg-pink.png"
              alt="myhealth checkup"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
            />
            <p className="text-white font-heading font-bold text-xs sm:text-sm md:text-base">
              Your health! Your choice! One trusted platform!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

/** Small compliance badge component */
const ComplianceBadge = ({ image, label, text }: { image?: string; label: string; text?: string }) => (
  <div className="flex flex-col items-center text-center space-y-1">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-md border border-gray-100">
      {image ? (
        <img src={image} alt={label} className="w-full h-full object-contain" />
      ) : (
        <span className="text-[#081129] font-bold text-xs">{text}</span>
      )}
    </div>
    <span className="text-gray-500 text-[8px] sm:text-[9px] font-medium">{label}</span>
  </div>
);

export default Footer;
