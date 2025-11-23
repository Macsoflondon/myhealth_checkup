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
  return <div className="relative w-full max-w-[400px] md:max-w-[480px]">
      <form onSubmit={handleSearch} className="flex w-full">
        <div className="relative flex-1 flex justify-center items-center ">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Search from over 200 tests" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 pr-3 w-full text-sm md:text-base bg-white text-[#081129] border-gray-300 ring-purple-100 focus:border-primary focus:ring-1 focus:ring-primary rounded-r-none rounded-sm py-2 md:py-2.5" />
        </div>
        <Button type="submit" size="sm" className="text-white px-3 md:px-4 py-2 md:py-2.5 rounded-l-none border-l-0 h-full bg-[#e70d69] hover:bg-[#e70d69]/90">
          <Search className="h-4 w-4 text-white" />
        </Button>
      </form>
    </div>;
};