import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import cqcLogo from "@/assets/compliance/cqc-logo.png";
import icoLogo from "@/assets/compliance/ico-logo.png";
const gdprLogo = "/lovable-uploads/b41794bb-1baf-49ff-8691-e808992ec800.png";
const Footer = () => {
  const {
    t
  } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Categories for improved site structure and internal linking
  const serviceSections = [{
    name: t('footer.links.mensHealth'),
    link: "/tests/mens-health"
  }, {
    name: t('footer.links.womensHealth'),
    link: "/tests/womens-health"
  }, {
    name: t('footer.links.heartHealth'),
    link: "/tests/heart"
  }, {
    name: t('footer.links.diabetes'),
    link: "/compare?category=diabetes"
  }, {
    name: t('footer.links.thyroid'),
    link: "/compare?category=thyroid"
  }, {
    name: t('footer.links.fertility'),
    link: "/compare?category=fertility"
  }];
  const informationSections = [{
    name: t('footer.links.howItWorks'),
    link: "/how-it-works"
  }, {
    name: "Our Providers",
    link: "/providers"
  }, {
    name: "Clinic Locations",
    link: "/locations"
  }, {
    name: t('footer.links.faqs'),
    link: "/faqs"
  }, {
    name: t('footer.links.blog'),
    link: "/blog"
  }, {
    name: t('footer.links.contact'),
    link: "/contact"
  }];
  const companySections = [{
    name: t('footer.links.aboutUs'),
    link: "/about"
  }, {
    name: t('footer.links.privacyPolicy'),
    link: "/privacy-policy"
  }, {
    name: t('footer.links.termsConditions'),
    link: "/terms"
  }, {
    name: "Fair Trading Policy",
    link: "/fair-trading"
  }, {
    name: "How We Rank",
    link: "/how-we-rank"
  }, {
    name: t('footer.links.partners'),
    link: "/partners"
  }];
  const socialLinks = [{
    icon: <Facebook size={40} style={{
      color: '#1877F2'
    }} />,
    name: "Facebook",
    url: "https://www.facebook.com/myhealthcheckupuk"
  }, {
    icon: <Instagram size={40} style={{
      color: '#E4405F'
    }} />,
    name: "Instagram",
    url: "https://www.Instagram.com/myhealthcheckup_uk"
  }];
  return (
    <footer className="pt-10 sm:pt-16 pb-6 sm:pb-8 border-t bg-[#081129]">
      <div className="container mx-auto px-4">
        {/* Top Section - 4 Column Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Categories Column */}
          <div>
            <ul className="space-y-1.5 sm:space-y-2">
              {serviceSections.map((service, index) => (
                <li key={index}>
                  <Link to={service.link} className="text-white/80 hover:text-[#e70d69] transition-colors text-xs sm:text-sm">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <ul className="space-y-1.5 sm:space-y-2">
              {informationSections.map((info, index) => (
                <li key={index}>
                  <Link to={info.link} className="text-white/80 hover:text-[#e70d69] transition-colors text-xs sm:text-sm">
                    {info.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <ul className="space-y-1.5 sm:space-y-2">
              {companySections.map((company, index) => (
                <li key={index}>
                  <Link to={company.link} className="text-white/80 hover:text-[#e70d69] transition-colors text-xs sm:text-sm">
                    {company.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Description Column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-3 sm:mb-4">
              <div className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center">
                <img src="/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png" alt="myhealth checkup Logo" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg" />
              </div>
              <span className="text-base sm:text-lg font-bold">
                <span className="text-[#e70d69]">myhealth</span> <span className="text-[#22c0d4]">checkup</span>
              </span>
            </Link>
            <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-light text-white/90 leading-relaxed">
              MYHEALTHCHECKUP LTD is the UK's leading health service comparison website.
            </p>
            <p className="text-[10px] sm:text-xs font-light text-white/70">Company No. 16589056</p>
          </div>
        </div>

        {/* Bottom Section - Social and Quality Assurance */}
        <div className="border-t border-[#e70d69]/60 pt-6 sm:pt-8">
          {/* Social Media and Quality Assurance Logos */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Social Media */}
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="hover:opacity-75 transition-opacity" 
                  aria-label={`Follow us on ${social.name}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
            
            {/* Quality Assurance Logos */}
            <div className="flex gap-4 sm:gap-6 items-center">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
                  <img src={cqcLogo} alt="Care Quality Commission" className="w-full h-full object-contain" />
                </div>
                <span className="text-white/80 text-[10px] sm:text-xs font-medium">CQC</span>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
                  <img src={gdprLogo} alt="EU GDPR Compliant" className="w-full h-full object-contain" />
                </div>
                <span className="text-white/80 text-[10px] sm:text-xs font-medium">GDPR</span>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
                  <img src={icoLogo} alt="ICO Registered" className="w-full h-full object-contain" />
                </div>
                <span className="text-white/80 text-[10px] sm:text-xs font-medium">ICO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Additional Links */}
        <div className="border-t border-[#e70d69]/60 pt-4 sm:pt-6 mt-6 sm:mt-8">
          <div className="text-center mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-sm text-gray-400 max-w-3xl mx-auto px-2">
              <strong>Important:</strong> MyHealth Checkup is a comparison platform. We do not provide medical services. All testing is conducted by our trusted partner providers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-center text-xs sm:text-sm text-white">
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
      </div>
    </footer>
  );
};

export default Footer;