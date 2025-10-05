import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const logo = "/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png";

const navigationItems = [
  { name: "FIND YOUR TEST", path: "/assisted-test-finder", highlighted: true },
  { name: "MOST POPULAR TESTS", path: "/most-popular-tests", highlighted: true },
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
      {/* Top bar with logo and user actions */}
      <div className="px-4 py-3">
        <div className="w-full flex items-center justify-between">
          {/* Logo and tagline */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="myhealth checkup Logo" className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-black">myhealth</span>
              <span className="font-bold text-lg leading-tight text-cyan-500">checkup</span>
            </div>
            <div className="hidden md:block ml-4 text-sm text-cyan-500 font-medium">
              Your health is your greatest asset!
            </div>
          </Link>

          {/* User actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-10 px-3" asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-10 px-3 relative" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold">
                  0
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Centered search bar */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-center">
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search from over 300 tests"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-health-primary focus:ring-1 focus:ring-health-primary rounded-r-none"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-l-none border-l-0 h-full"
                size="default"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="w-full">
            <nav className="flex items-center justify-center gap-4 flex-wrap">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-bold transition-colors px-2 py-1 whitespace-nowrap hover:opacity-80 uppercase ${
                    item.highlighted 
                      ? "text-pink-500" 
                      : "text-gray-700"
                  }`}
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