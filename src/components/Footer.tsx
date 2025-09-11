import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import cqcLogo from "../assets/compliance/cqc-logo.png";
import icoLogo from "../assets/compliance/ico-logo.png";
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
  return <footer className="pt-16 pb-8 border-t bg-[#081129]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-8 w-8 flex items-center justify-center">
                <img src="/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png" alt="myhealth checkup Logo" className="h-8 w-8 rounded-lg" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">myhealth</span> <span className="text-wellness-600">checkup</span>
              </span>
            </Link>
            <p className="mb-2 text-xs font-light text-left text-white">MYHEALTHCHECKUP LTD is the UK's only health service comparison platform dedicated to CQC‑regulated and UKAS‑accredited providers.</p>
            <p className="mb-4 text-xs font-light text-left text-white">Company No. 16589056</p>
            <div className="flex space-x-6 rounded decoration-white mb-6">
              {socialLinks.map((social, index) => <a key={index} href={social.url} className="hover:opacity-75 transition-opacity" aria-label={`Follow us on ${social.name}`} target="_blank" rel="noopener noreferrer">
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </a>)}
            </div>
            
            {/* Regulatory Body Logos - Evenly Spaced */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-1 shadow-md">
                  <img src={cqcLogo} alt="Care Quality Commission" className="w-full h-full object-contain" />
                </div>
                <span className="text-white text-xs font-medium">Care Quality Commission</span>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-1 shadow-md">
                  <img src={gdprLogo} alt="EU GDPR Compliant" className="w-full h-full object-contain" />
                </div>
                <span className="text-white text-xs font-medium">EU GDPR Compliant</span>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-20 h-20 rounded-lg flex items-center justify-center p-1 shadow-md bg-[#081129]">
                  <img src={icoLogo} alt="ICO Registered" className="w-full h-full object-contain" />
                </div>
                <span className="text-white text-xs font-medium">ICO Registered</span>
              </div>
            </div>
          </div>

          <div className="text-[t] text-[#e70d69] font-medium">
            <h3 id="footer-services" className="font-semibold mb-4 text-[s#] text-white">{t('footer.categories')}</h3>
            <ul className="space-y-2" aria-labelledby="footer-services">
              {serviceSections.map((service, index) => <li key={index}>
                  <Link to={service.link} className="text-white hover:text-white transition-colors">
                    {service.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 id="footer-info" className="font-semibold text-lg mb-4 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2" aria-labelledby="footer-info">
              {informationSections.map((info, index) => <li key={index}>
                  <Link to={info.link} className="text-white hover:text-white transition-colors">
                    {info.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 id="footer-company" className="font-semibold text-lg mb-4 text-white">{t('footer.legal')}</h3>
            <ul className="space-y-2" aria-labelledby="footer-company">
              {companySections.map((company, index) => <li key={index}>
                  <Link to={company.link} className="text-white hover:text-white transition-colors">
                    {company.name}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center text-sm text-white ">
            <p className="font-normal text-[#e70d69]">
              {t('footer.copyright')}
            </p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link to="/accessibility" className="hover:text-white ">{t('footer.links.accessibility')}</Link>
              <Link to="/sitemap" className="hover:text-health-600 transition-colors">{t('footer.links.sitemap')}</Link>
              <Link to="/cookies" className="hover:text-health-600 transition-colors">{t('footer.links.cookiePolicy')}</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;