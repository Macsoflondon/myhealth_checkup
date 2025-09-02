import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const logo = "/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png";

const navigationItems = [
  { name: "FIND YOUR TEST", path: "/assisted-test-finder" },
  { name: "MOST POPULAR TESTS", path: "/most-popular-tests" },
  { name: "WOMEN'S HEALTH", path: "/womens-health" },
  { name: "MEN'S HEALTH", path: "/mens-health" },
  { name: "GENERAL WELLNESS", path: "/wellness" },
  { name: "THYROID HEALTH", path: "/thyroid" },
  { name: "SPORTS PERFORMANCE", path: "/sports-performance" },
  { name: "PRENATAL BLOOD", path: "/fertility-tests" },
  { name: "HEALTH HUB", path: "/health-blog" },
  { name: "AT-HOME TESTS", path: "/at-home-tests" }
];

export const HeroToolbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top bar with logo, search, and user actions */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo and tagline */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="myhealth checkup Logo" className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-gray-900">myhealth</span>
              <span className="font-bold text-lg leading-tight text-health-primary">checkup</span>
            </div>
            <div className="hidden md:block ml-4 text-sm text-gray-600 italic">
              Your health is your greatest asset!
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search from over 300 tests"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-health-primary focus:ring-1 focus:ring-health-primary"
              />
            </div>
          </form>

          {/* User actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-10 px-3" asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Account</span>
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-10 px-3 relative" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-1 -right-1 bg-health-accent text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px]">
                  0
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center justify-center gap-1 flex-wrap">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-xs font-medium text-gray-700 hover:text-health-primary hover:bg-white transition-colors px-3 py-2 rounded-md whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};