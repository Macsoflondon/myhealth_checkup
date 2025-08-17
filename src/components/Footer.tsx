import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Categories for improved site structure and internal linking
  const serviceSections = [{
    name: "Blood Tests",
    link: "/compare?category=blood-tests"
  }, {
    name: "Hormone Tests",
    link: "/compare?category=hormones"
  }, {
    name: "Vitamin Assessments",
    link: "/compare?category=vitamins"
  }, {
    name: "Cancer Screening",
    link: "/compare?category=cancer-screening"
  }, {
    name: "Heart Health",
    link: "/tests/heart"
  }, {
    name: "Men's Health",
    link: "/tests/mens-health"
  }, {
    name: "Women's Health",
    link: "/tests/womens-health"
  }, {
    name: "Diabetes Testing",
    link: "/compare?category=diabetes"
  }, {
    name: "Gut Health",
    link: "/compare?category=gut-health"
  }];
  
  const informationSections = [{
    name: "How It Works",
    link: "/how-it-works"
  }, {
    name: "FAQs",
    link: "/faqs"
  }, {
    name: "Health Resources",
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
    icon: <Facebook size={24} />,
    name: "Facebook",
    url: "https://facebook.com/myhealthhub"
  }, {
    icon: <Twitter size={24} />,
    name: "Twitter",
    url: "https://twitter.com/myhealthhub"
  }, {
    icon: <Instagram size={24} />,
    name: "Instagram",
    url: "https://instagram.com/myhealthhub"
  }, {
    icon: <Youtube size={24} />,
    name: "YouTube",
    url: "https://youtube.com/myhealthhub"
  }];

  return (
    <footer className="bg-background border-t border-border py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="h-10 w-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png" 
                  alt="myhealth checkup Logo" 
                  className="h-10 w-10 rounded-lg" 
                />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">myhealth</span> <span className="text-accent">checkup</span>
              </span>
            </Link>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              MYHEALTHCHECKUP LTD is the UK's only health service comparison platform dedicated to CQC‑regulated and UKAS‑accredited providers. Company No. 16589056
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-lg"
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

          {/* Services section */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Our Services</h3>
            <ul className="space-y-3">
              {serviceSections.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.link} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information section */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Information</h3>
            <ul className="space-y-3">
              {informationSections.map((info, index) => (
                <li key={index}>
                  <Link 
                    to={info.link} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
                  >
                    {info.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company section */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-foreground">Company</h3>
            <ul className="space-y-3">
              {companySections.map((company, index) => (
                <li key={index}>
                  <Link 
                    to={company.link} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
                  >
                    {company.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <p className="text-muted-foreground text-sm text-center lg:text-left">
              © {currentYear} my health checkup. Empowering informed health decisions across the UK. All rights reserved.
            </p>
            
            <nav className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2">
              <Link 
                to="/accessibility" 
                className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
              >
                Accessibility
              </Link>
              <Link 
                to="/sitemap" 
                className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
              >
                Sitemap
              </Link>
              <Link 
                to="/cookies" 
                className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;