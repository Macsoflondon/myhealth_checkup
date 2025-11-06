import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const {
    t
  } = useTranslation();
  const currentYear = new Date().getFullYear();

  const ourServices = [
    { name: "Blood Tests", link: "/compare" },
    { name: "Hormone Tests", link: "/tests/hormones" },
    { name: "Vitamin Assessments", link: "/tests/vitamin-deficiency" },
    { name: "Cancer Screening", link: "/tests/cancer-screening" },
    { name: "Heart Health", link: "/tests/heart" },
    { name: "Men's Health", link: "/tests/mens-health" },
    { name: "Women's Health", link: "/tests/womens-health" },
    { name: "Diabetes Testing", link: "/tests/diabetes" },
    { name: "Gut Health", link: "/tests/gut-health" }
  ];

  const information = [
    { name: "How It Works", link: "/how-it-works" },
    { name: "FAQs", link: "/faqs" },
    { name: "Health Resources", link: "/blog" },
    { name: "Contact Us", link: "/contact" }
  ];

  const company = [
    { name: "About Us", link: "/about" },
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "Terms & Conditions", link: "/terms" },
    { name: "Partners", link: "/partners" }
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "https://www.facebook.com/myhealthcheckupuk" },
    { icon: Twitter, name: "Twitter", url: "https://twitter.com/myhealthcheckup" },
    { icon: Instagram, name: "Instagram", url: "https://www.instagram.com/myhealthcheckup_uk" },
    { icon: Youtube, name: "YouTube", url: "https://www.youtube.com/@myhealthcheckup" }
  ];
  return <footer className="bg-[#1a1b34] text-white pt-12 pb-6">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top section - Logo and description */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img 
              src="/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png" 
              alt="myhealth checkup" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">
              <span className="text-[#22c0d4]">myhealth</span> <span className="text-white">checkup</span>
            </span>
          </Link>
          <p className="text-sm text-white/90 max-w-md leading-relaxed">
            MYHEALTHCHECKUP LTD is the UK's only health service comparison platform dedicated to CQC-regulated and UKAS-accredited providers. Company No. 16589056
          </p>
          
          {/* Social media icons */}
          <div className="flex gap-4 mt-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Three column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-8 border-b border-white/20">
          {/* Our Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              {ourServices.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2">
              {information.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section - Copyright and links */}
        <div className="text-center">
          <p className="text-white/70 text-sm mb-4">
            © {currentYear} my health checkup, Empowering informed health decisions across the UK. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/accessibility" className="text-white/70 hover:text-white transition-colors">
              Accessibility
            </Link>
            <Link to="/sitemap" className="text-white/70 hover:text-white transition-colors">
              Sitemap
            </Link>
            <Link to="/cookies" className="text-white/70 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;