
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Categories for improved site structure and internal linking
  const serviceSections = [
    { name: "Cancer Screening", link: "/tests/cancer" },
    { name: "Diabetes Testing", link: "/tests/diabetes" },
    { name: "Heart Health", link: "/tests/heart" },
    { name: "Vitamin Deficiency", link: "/tests/vitamins" },
    { name: "Gut Health", link: "/tests/gut" }
  ];
  
  const informationSections = [
    { name: "How It Works", link: "/how-it-works" },
    { name: "Our Subscriptions", link: "/subscriptions" },
    { name: "FAQs", link: "/faqs" },
    { name: "Health Blog", link: "/blog" },
    { name: "Contact Us", link: "/contact" }
  ];
  
  const companySections = [
    { name: "About Us", link: "/about" },
    { name: "Careers", link: "/careers" },
    { name: "Privacy Policy", link: "/privacy" },
    { name: "Terms & Conditions", link: "/terms" },
    { name: "Partners", link: "/partners" }
  ];
  
  const socialLinks = [
    { icon: <Facebook size={20} />, name: "Facebook", url: "https://facebook.com/mysalushub" },
    { icon: <Twitter size={20} />, name: "Twitter", url: "https://twitter.com/mysalushub" },
    { icon: <Instagram size={20} />, name: "Instagram", url: "https://instagram.com/mysalushub" },
    { icon: <Youtube size={20} />, name: "YouTube", url: "https://youtube.com/mysalushub" }
  ];

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/e753d923-ba88-49b9-a8db-af71babcd66d.png" 
                alt="My SalusHub Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 mb-4">
              Your personal health hub – hospital-grade tests, high-street convenience.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  className="text-gray-400 hover:text-health-600 transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-health-700" id="footer-services">Our Services</h3>
            <ul className="space-y-2" aria-labelledby="footer-services">
              {serviceSections.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.link} 
                    className="text-gray-600 hover:text-health-600 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-health-700" id="footer-info">Information</h3>
            <ul className="space-y-2" aria-labelledby="footer-info">
              {informationSections.map((info, index) => (
                <li key={index}>
                  <Link 
                    to={info.link} 
                    className="text-gray-600 hover:text-health-600 transition-colors"
                  >
                    {info.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-health-700" id="footer-company">Company</h3>
            <ul className="space-y-2" aria-labelledby="footer-company">
              {companySections.map((company, index) => (
                <li key={index}>
                  <Link 
                    to={company.link} 
                    className="text-gray-600 hover:text-health-600 transition-colors"
                  >
                    {company.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center text-sm text-gray-500">
            <p>
              &copy; {currentYear} My SalusHub. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link to="/accessibility" className="hover:text-health-600 transition-colors">Accessibility</Link>
              <Link to="/sitemap" className="hover:text-health-600 transition-colors">Sitemap</Link>
              <Link to="/cookies" className="hover:text-health-600 transition-colors">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
