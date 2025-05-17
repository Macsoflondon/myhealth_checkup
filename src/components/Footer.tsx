
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-500 to-wellness-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl">
                My Health<span className="text-wellness-600">Hub</span>
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Your personal health hub – hospital-grade tests, high-street convenience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-health-600 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-600 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-600 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-600 transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/tests/cancer" className="text-gray-600 hover:text-health-600 transition-colors">Cancer Screening</Link></li>
              <li><Link to="/tests/diabetes" className="text-gray-600 hover:text-health-600 transition-colors">Diabetes Testing</Link></li>
              <li><Link to="/tests/heart" className="text-gray-600 hover:text-health-600 transition-colors">Heart Health</Link></li>
              <li><Link to="/tests/vitamins" className="text-gray-600 hover:text-health-600 transition-colors">Vitamin Deficiency</Link></li>
              <li><Link to="/tests/gut" className="text-gray-600 hover:text-health-600 transition-colors">Gut Health</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-health-600 transition-colors">How It Works</Link></li>
              <li><Link to="/subscriptions" className="text-gray-600 hover:text-health-600 transition-colors">Our Subscriptions</Link></li>
              <li><Link to="/faqs" className="text-gray-600 hover:text-health-600 transition-colors">FAQs</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-health-600 transition-colors">Health Blog</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-health-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-health-600 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-health-600 transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-health-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-health-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/partners" className="text-gray-600 hover:text-health-600 transition-colors">Partners</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} My Health Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
