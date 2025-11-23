import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { compareCategories } from "@/data/compare/categories";
import { logger } from "@/lib/logger";

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
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or handle search
      logger.debug("Searching for:", searchQuery);
    }
  };
  return (
    <div className="relative w-full max-w-[400px] md:max-w-[480px]">
      <form onSubmit={handleSearch} className="flex w-full items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Input 
            type="text" 
            placeholder="Search from over 200 tests" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="pl-10 pr-3 h-11 w-full text-sm md:text-base bg-white text-foreground border-border focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 rounded-r-none" 
          />
        </div>
        <Button 
          type="submit" 
          className="h-11 px-4 rounded-l-none bg-brand-pink hover:bg-brand-pink/90 text-white border-l-0"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};