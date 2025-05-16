
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-500 to-wellness-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="font-bold text-xl text-health-700">
            My Health<span className="text-wellness-600">Hub</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/tests" className="text-gray-600 hover:text-health-600 transition-colors font-medium">
            Tests
          </Link>
          <Link to="/subscriptions" className="text-gray-600 hover:text-health-600 transition-colors font-medium">
            Subscriptions
          </Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-health-600 transition-colors font-medium">
            How It Works
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-health-600 transition-colors font-medium">
            About Us
          </Link>
          <Button variant="outline" className="border-health-500 text-health-600 hover:bg-health-50">
            Sign In
          </Button>
          <Button className="bg-health-600 hover:bg-health-700">
            Get Started
          </Button>
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/tests" 
              className="text-gray-600 hover:text-health-600 transition-colors py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tests
            </Link>
            <Link 
              to="/subscriptions" 
              className="text-gray-600 hover:text-health-600 transition-colors py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Subscriptions
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-gray-600 hover:text-health-600 transition-colors py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-health-600 transition-colors py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="w-full border-health-500 text-health-600 hover:bg-health-50">
                Sign In
              </Button>
              <Button className="w-full bg-health-600 hover:bg-health-700">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
