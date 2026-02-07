import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cqcLogo from "@/assets/compliance/cqc-logo.png";
import icoLogo from "@/assets/compliance/ico-logo.png";
const gdprLogo = "/lovable-uploads/b41794bb-1baf-49ff-8691-e808992ec800.png";

const Footer = () => {
  const { t } = useTranslation();

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
      {/* ========== Main Footer - Navy Background ========== */}
      <div className="bg-[#081129] pt-8 sm:pt-10 pb-4 sm:pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-[auto_auto_1fr_auto] gap-6 sm:gap-8 lg:gap-10">

            {/* Column 1 - Category Links */}
            <div>
              <ul className="space-y-2.5 sm:space-y-3">
                {categoryLinks.map((item, index) => (
                  <li key={index}>
                    <Link to={item.link} className="text-white hover:text-[#e70d69] transition-colors text-xs sm:text-sm font-sans">
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
                    <Link to={item.link} className="text-white hover:text-[#e70d69] transition-colors text-xs sm:text-sm font-sans">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Social + Disclaimer + Company Info */}
            <div className="col-span-2 lg:col-span-1">
              {/* Follow Us + Social Icons */}
              <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                <span className="text-white font-heading font-bold text-base sm:text-lg md:text-xl whitespace-nowrap">Follow Us</span>
                <div className="flex gap-3 sm:gap-4">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/myhealthcheckup_uk"
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Follow us on Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#ig-grad)" />
                      <rect x="12" y="12" width="24" height="24" rx="6" stroke="white" strokeWidth="2" fill="none"/>
                      <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2" fill="none"/>
                      <circle cx="32" cy="16" r="2" fill="white"/>
                      <defs>
                        <linearGradient id="ig-grad" x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FD5"/>
                          <stop offset="0.5" stopColor="#E4405F"/>
                          <stop offset="1" stopColor="#833AB4"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/myhealthcheckupuk"
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Follow us on Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="20" fill="#1877F2"/>
                      <path d="M26.5 25.5H30L31 21.5H26.5V19.5C26.5 18.47 26.5 17.5 28.5 17.5H31V14.14C30.652 14.097 29.284 14 27.842 14C24.834 14 22.5 16.082 22.5 19.5V21.5H19V25.5H22.5V34H26.5V25.5Z" fill="white"/>
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@myhealthcheckup"
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Follow us on TikTok"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="20" fill="#081129" stroke="white" strokeWidth="1.5"/>
                      <path d="M31 18.5C31 18.5 30 22 27 22V29C27 31.761 24.761 34 22 34C19.239 34 17 31.761 17 29C17 26.239 19.239 24 22 24V27C20.895 27 20 27.895 20 29C20 30.105 20.895 31 22 31C23.105 31 24 30.105 24 29V14H27C27 16.485 29.015 18.5 31 18.5Z" fill="white"/>
                      <path d="M30 17.5C30 17.5 29 21 26 21V28C26 30.761 23.761 33 21 33C18.239 33 16 30.761 16 28C16 25.239 18.239 23 21 23V26C19.895 26 19 26.895 19 28C19 29.105 19.895 30 21 30C22.105 30 23 29.105 23 28V13H26C26 15.485 28.015 17.5 30 17.5Z" fill="#E4405F" fillOpacity="0.6"/>
                      <path d="M32 19.5C32 19.5 31 23 28 23V30C28 32.761 25.761 35 23 35C20.239 35 18 32.761 18 30C18 27.239 20.239 25 23 25V28C21.895 28 21 28.895 21 30C21 31.105 21.895 32 23 32C24.105 32 25 31.105 25 30V15H28C28 17.485 30.015 19.5 32 19.5Z" fill="#22c0d4" fillOpacity="0.6"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs sm:text-sm leading-relaxed mb-4">
                <span className="font-semibold text-[#e70d69]">Important:</span>{" "}
                <span className="text-white/80">
                  MyHealth Checkup is a comparison platform. We do not provide medical services. All testing is conducted by our trusted partner providers.
                </span>
              </p>

              {/* Company Info */}
              <p className="text-xs sm:text-sm text-white/90 font-sans mb-1">
                MYHEALTHCHECKUP LTD is the UK's leading health service comparison website.
              </p>
              <p className="text-[10px] sm:text-xs text-white/50">Company No. 16589056</p>
            </div>

            {/* Column 4 - Compliance Badges */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex flex-row lg:flex-col gap-3 sm:gap-4 items-start">
                <ComplianceBadge image={icoLogo} label="ICO Registered" />
                <ComplianceBadge label="Companies House" text="🏛" />
                <ComplianceBadge image={gdprLogo} label="UK GDPR" />
                <ComplianceBadge label="Cyber Essentials" text="✓" isCyberEssentials />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Copyright Line ========== */}
      <div className="bg-[#081129] pb-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-[#e70d69] font-sans">
            © 2026 myhealth checkup. All rights reserved.{" "}
            <Link to="/accessibility" className="text-[#e70d69] hover:text-white transition-colors underline-offset-2 hover:underline">
              Accessibility
            </Link>
          </p>
        </div>
      </div>

      {/* ========== Pink Divider Line ========== */}
      <div className="h-[2px] bg-[#e70d69]" />

      {/* ========== Brand Bar - Dark with Logo ========== */}
      <div className="bg-[#060d20] py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Heart Logo */}
            <img
              src="/lovable-uploads/myhealth-logo-bg-pink.png"
              alt="myhealth checkup"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg"
            />
            {/* Brand Name */}
            <span className="font-heading font-bold text-lg sm:text-xl md:text-2xl">
              <span className="text-white">my</span>
              <span className="text-[#22c0d4]">health</span>
            </span>
            <span className="font-heading text-sm sm:text-base md:text-lg text-[#22c0d4] -ml-2">
              checkup
            </span>
            {/* Slogan */}
            <p className="font-heading font-bold text-xs sm:text-sm md:text-base text-white ml-1 sm:ml-2">
              Your <span className="text-[#e70d69]">health!</span> Your <span className="text-[#e70d69]">choice!</span> One <span className="text-[#22c0d4]">trusted</span> platform!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

/** Compliance badge component */
const ComplianceBadge = ({
  image,
  label,
  text,
  isCyberEssentials,
}: {
  image?: string;
  label: string;
  text?: string;
  isCyberEssentials?: boolean;
}) => (
  <div className="flex flex-col items-center text-center space-y-1">
    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center p-1.5 shadow-lg ${
      isCyberEssentials ? 'bg-[#22c0d4]' : 'bg-white'
    }`}>
      {image ? (
        <img src={image} alt={label} className="w-full h-full object-contain" />
      ) : isCyberEssentials ? (
        <div className="flex flex-col items-center">
          <span className="text-white font-bold text-lg">✓</span>
          <span className="text-white text-[6px] font-bold leading-tight uppercase">Cyber<br/>Essentials</span>
        </div>
      ) : (
        <span className="text-[#081129] text-xl">{text}</span>
      )}
    </div>
    <span className="text-white/70 text-[8px] sm:text-[9px] font-medium">{label}</span>
  </div>
);

export default Footer;
