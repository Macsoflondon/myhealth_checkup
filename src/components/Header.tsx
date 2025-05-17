
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Heart, ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("You have been signed out");
    navigate("/");
  };
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation items for better maintainability
  const navigationItems = [
    { name: "Compare Tests", path: "/compare" },
    { name: "Subscriptions", path: "/subscriptions" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About Us", path: "/about" }
  ];

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" aria-label="My Health Hub Home">
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
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          {navigationItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className="text-gray-600 hover:text-health-600 transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-health-500 text-health-600 hover:bg-health-50">
                  <User className="h-4 w-4 mr-2" /> Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/dashboard?tab=favorites")}>
                  <Heart className="h-4 w-4 mr-2" /> My Favorites
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard?tab=orders")}>
                  <ShoppingBag className="h-4 w-4 mr-2" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-health-500 text-health-600 hover:bg-health-50"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
              <Button 
                className="bg-health-600 hover:bg-health-700"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      <div 
        id="mobile-menu"
        className={`lg:hidden bg-white border-t py-4 px-4 shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex flex-col space-y-4" aria-label="Mobile Navigation">
          {navigationItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className="text-gray-600 hover:text-health-600 transition-colors py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 mt-2">
              <Link 
                to="/dashboard?tab=favorites"
                className="flex items-center gap-2 text-gray-600 hover:text-health-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" /> My Favorites
              </Link>
              <Link 
                to="/dashboard?tab=orders"
                className="flex items-center gap-2 text-gray-600 hover:text-health-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" /> My Orders
              </Link>
              <Button 
                variant="outline" 
                className="w-full border-red-500 text-red-600 hover:bg-red-50 mt-2"
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 mt-2">
              <Button 
                variant="outline" 
                className="w-full border-health-500 text-health-600 hover:bg-health-50"
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button 
                className="w-full bg-health-600 hover:bg-health-700"
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
