import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cqcLogo from "@/assets/compliance/cqc-logo.png";
import icoLogo from "@/assets/compliance/ico-logo.png";
const gdprLogo = "/lovable-uploads/b41794bb-1baf-49ff-8691-e808992ec800.png";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const serviceSections = [
    { name: t('footer.links.mensHealth'), link: "/tests/mens-health" },
    { name: t('footer.links.womensHealth'), link: "/tests/womens-health" },
    { name: t('footer.links.heartHealth'), link: "/tests/heart" },
    { name: t('footer.links.diabetes'), link: "/compare?category=diabetes" },
    { name: t('footer.links.thyroid'), link: "/compare?category=thyroid" },
    { name: t('footer.links.fertility'), link: "/compare?category=fertility" },
  ];

  const informationSections = [
    { name: t('footer.links.howItWorks'), link: "/how-it-works" },
    { name: "Our Providers", link: "/providers" },
    { name: "Clinic Locations", link: "/locations" },
    { name: t('footer.links.faqs'), link: "/faqs" },
    { name: t('footer.links.blog'), link: "/blog" },
    { name: t('footer.links.contact'), link: "/contact" },
  ];

  const companySections = [
    { name: t('footer.links.aboutUs'), link: "/about" },
    { name: t('footer.links.privacyPolicy'), link: "/privacy-policy" },
    { name: t('footer.links.termsConditions'), link: "/terms" },
    { name: "Fair Trading Policy", link: "/fair-trading" },
    { name: "How We Rank", link: "/how-we-rank" },
    { name: t('footer.links.partners'), link: "/partners" },
  ];

  return (
    <footer className="pt-8 sm:pt-10 pb-6 sm:pb-8 bg-[#081129]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid - All elements in one row on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[auto_auto_auto_1fr_auto_auto] gap-6 sm:gap-6 lg:gap-4 mb-6 sm:mb-8">
          {/* Categories Column */}
          <div>
            <ul className="space-y-2 sm:space-y-2.5">
              {serviceSections.map((service, index) => (
                <li key={index}>
                  <Link to={service.link} className="text-white hover:text-[#e70d69] transition-colors text-xs sm:text-sm whitespace-nowrap">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <ul className="space-y-2 sm:space-y-2.5">
              {informationSections.map((info, index) => (
                <li key={index}>
                  <Link to={info.link} className="text-white hover:text-[#e70d69] transition-colors text-xs sm:text-sm whitespace-nowrap">
                    {info.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <ul className="space-y-2 sm:space-y-2.5">
              {companySections.map((company, index) => (
                <li key={index}>
                  <Link to={company.link} className="text-white hover:text-[#e70d69] transition-colors text-xs sm:text-sm whitespace-nowrap">
                    {company.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Description Column - Gets remaining space */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:px-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-3 sm:mb-4">
              <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                <img src="/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png" alt="myhealth checkup Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
              </div>
              <span className="text-base sm:text-lg font-bold">
                <span className="text-[#e70d69]">myhealth</span> <span className="text-[#22c0d4]">checkup</span>
              </span>
            </Link>
            <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-white/90 leading-relaxed max-w-xs">
              MYHEALTHCHECKUP LTD is the UK's leading health service comparison website.
            </p>
            <p className="text-[10px] sm:text-xs text-white/60">Company No. 16589056</p>
          </div>

          {/* Social Media Column */}
          <div className="flex flex-col items-start lg:items-center justify-start gap-3">
            <span className="text-[10px] sm:text-xs text-white/60 font-medium">Follow Us</span>
            <div className="flex gap-3">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/myhealthcheckupuk" 
                className="hover:opacity-75 transition-opacity" 
                aria-label="Follow us on Facebook" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" stroke="#1877F2" strokeWidth="2" fill="none"/>
                  <path d="M26.5 25.5H30L31 21.5H26.5V19.5C26.5 18.47 26.5 17.5 28.5 17.5H31V14.14C30.652 14.097 29.284 14 27.842 14C24.834 14 22.5 16.082 22.5 19.5V21.5H19V25.5H22.5V34H26.5V25.5Z" fill="#1877F2"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/myhealthcheckup_uk" 
                className="hover:opacity-75 transition-opacity" 
                aria-label="Follow us on Instagram" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="32" height="32" rx="8" stroke="url(#instagram-gradient)" strokeWidth="2" fill="none"/>
                  <circle cx="24" cy="24" r="7" stroke="url(#instagram-gradient)" strokeWidth="2" fill="none"/>
                  <circle cx="33" cy="15" r="2" fill="url(#instagram-gradient)"/>
                  <defs>
                    <linearGradient id="instagram-gradient" x1="8" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FD5"/>
                      <stop offset="0.5" stopColor="#E4405F"/>
                      <stop offset="1" stopColor="#833AB4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </a>
            </div>
          </div>

          {/* Compliance Badges Column */}
          <div className="flex flex-row lg:flex-col gap-2 items-start lg:items-center justify-start">
            <div className="flex flex-col items-center text-center space-y-0.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-lg">
                <img src={cqcLogo} alt="Care Quality Commission" className="w-full h-full object-contain" />
              </div>
              <span className="text-white/80 text-[8px] sm:text-[9px] font-medium">CQC</span>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-0.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-lg">
                <img src={gdprLogo} alt="EU GDPR Compliant" className="w-full h-full object-contain" />
              </div>
              <span className="text-white/80 text-[8px] sm:text-[9px] font-medium">GDPR</span>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-0.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-lg">
                <img src={icoLogo} alt="ICO Registered" className="w-full h-full object-contain" />
              </div>
              <span className="text-white/80 text-[8px] sm:text-[9px] font-medium">ICO</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#e70d69]/50 to-transparent mb-4 sm:mb-6" />

        {/* Copyright and Additional Links */}
        <div className="text-center mb-3 sm:mb-4">
          <p className="text-[10px] sm:text-xs text-gray-400 max-w-3xl mx-auto px-2">
            <strong>Important:</strong> MyHealth Checkup is a comparison platform. We do not provide medical services. All testing is conducted by our trusted partner providers.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-center text-[10px] sm:text-xs text-white">
          <p className="font-normal text-[#e70d69]">
            {t('footer.copyright')}
          </p>
          <nav className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1">
            <Link to="/accessibility" className="hover:text-[#e70d69] transition-colors">{t('footer.links.accessibility')}</Link>
            <Link to="/sitemap" className="hover:text-[#e70d69] transition-colors">{t('footer.links.sitemap')}</Link>
            <Link to="/cookies" className="hover:text-[#e70d69] transition-colors">{t('footer.links.cookiePolicy')}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
