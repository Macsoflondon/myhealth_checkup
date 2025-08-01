import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Categories for improved site structure and internal linking
  const serviceSections = [{
    name: "Cancer Screening",
    link: "/tests/cancer"
  }, {
    name: "Diabetes Testing",
    link: "/tests/diabetes"
  }, {
    name: "Heart Health",
    link: "/tests/heart"
  }, {
    name: "Vitamin Deficiency",
    link: "/tests/vitamins"
  }, {
    name: "Gut Health",
    link: "/tests/gut"
  }];
  const informationSections = [{
    name: "How It Works",
    link: "/how-it-works"
  }, {
    name: "FAQs",
    link: "/faqs"
  }, {
    name: "Health Blog",
    link: "/blog"
  }, {
    name: "Contact Us",
    link: "/contact"
  }];
  const companySections = [{
    name: "About Us",
    link: "/about"
  }, {
    name: "Privacy Policy",
    link: "/privacy-policy"
  }, {
    name: "Terms & Conditions",
    link: "/terms"
  }, {
    name: "Partners",
    link: "/partners"
  }];
  const socialLinks = [{
    icon: <Facebook size={20} />,
    name: "Facebook",
    url: "https://facebook.com/myhealthhub"
  }, {
    icon: <Twitter size={20} />,
    name: "Twitter",
    url: "https://twitter.com/myhealthhub"
  }, {
    icon: <Instagram size={20} />,
    name: "Instagram",
    url: "https://instagram.com/myhealthhub"
  }, {
    icon: <Youtube size={20} />,
    name: "YouTube",
    url: "https://youtube.com/myhealthhub"
  }];
  return <footer className="pt-16 pb-8 border-t bg-[#081129]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-500 to-wellness-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-lg text-slate-950 font-bold">
                myhealth <span className="text-wellness-600">checkup</span>
              </span>
            </Link>
            <p className="mb-4 text-xs font-light text-left text-white">MYHEALTHCHECKUP LTD is the UK’s only health service comparison platform dedicated to CQC‑regulated and UKAS‑accredited providers. Company No. 16589056</p>
            <div className="flex space-x-4 rounded decoration-white ">
              {socialLinks.map((social, index) => <a key={index} href={social.url} className="text-gray-400 hover:text-health-600 transition-colors" aria-label={`Follow us on ${social.name}`} target="_blank" rel="noopener noreferrer">
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </a>)}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4" id="footer-services">Our Services</h3>
            <ul className="space-y-2" aria-labelledby="footer-services">
              {serviceSections.map((service, index) => <li key={index}>
                  <Link to={service.link} className="text-white hover:text-white transition-colors">
                    {service.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4" id="footer-info">Information</h3>
            <ul className="space-y-2" aria-labelledby="footer-info">
              {informationSections.map((info, index) => <li key={index}>
                  <Link to={info.link} className="text-white hover:text-white transition-colors">
                    {info.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4" id="footer-company">Company</h3>
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
            <p className="text-white font-normal">
              ©️2025 my health checkup, Empowering informed health decisions across the UK. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link to="/accessibility" className="hover:text-white ">Accessibility</Link>
              <Link to="/sitemap" className="hover:text-health-600 transition-colors">Sitemap</Link>
              <Link to="/cookies" className="hover:text-health-600 transition-colors">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;