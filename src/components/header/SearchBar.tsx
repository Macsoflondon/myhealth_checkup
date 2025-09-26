import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { compareCategories } from "@/data/compare/categories";

// Category colors following design system
const categoryColorMap: Record<string, string> = {
  'blood-tests': 'bg-red-500 text-white',
  'hormones': 'bg-pink-500 text-white',
  'thyroid': 'bg-emerald-500 text-white',
  'vitamins': 'bg-lime-500 text-white',
  'cancer-screening': 'bg-purple-600 text-white',
  'heart-health': 'bg-red-600 text-white',
  'mens-health': 'bg-[#081129] text-white',
  'womens-health': 'bg-pink-600 text-white',
  'fertility': 'bg-purple-500 text-white',
  'general-health': 'bg-teal-500 text-white',
  'allergy-testing': 'bg-indigo-500 text-white'
};
export const SearchBar = () => {
  const {
    t
  } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or handle search
      console.log("Searching for:", searchQuery);
      setShowDropdown(false);
    }
  };
  const handleFocus = () => {
    setShowDropdown(true);
  };
  const handleBlur = () => {
    // Delay hiding to allow clicking on dropdown items
    setTimeout(() => setShowDropdown(false), 200);
  };
  const allCategories = compareCategories.slice(0, 8); // Limit to prevent overflow

  return <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex w-full">
        <div className="relative flex-1 flex justify-center items-center ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-health-success" />
          <Input type="text" placeholder="Find your perfect health test..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-r-none rounded-lg px-[50px]" />
        </div>
        <Button type="submit" size="default" className="text-white px-6 py-3 rounded-l-none border-l-0 h-full bg-[#e70d69] hover:bg-[#22c0d4]">
          <Search className="h-4 w-4 text-white" />
        </Button>
      </form>

      {/* Test Category Dropdown */}
      {showDropdown && <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 w-full max-w-[600px]">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Find your perfect test by category</h3>
            <div className="grid grid-cols-2 gap-4">
              {allCategories.map(category => <Link key={category.id} to={`/compare?category=${category.id}`} className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setShowDropdown(false)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${categoryColorMap[category.id] || 'bg-gray-400'}`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>)}
            </div>
            
            {/* View All Link */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/assisted-test-finder" className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors" onClick={() => setShowDropdown(false)}>
                View all test categories
                <Search className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>}
    </div>;
};