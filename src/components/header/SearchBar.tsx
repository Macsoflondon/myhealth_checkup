import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or handle search
      console.log("Searching for:", searchQuery);
    }
  };
  return <form onSubmit={handleSearch} className="flex w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input type="text" placeholder="Search from over 300 tests" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-r-none" />
      </div>
      <Button type="submit" size="default" className="text-white px-6 py-3 rounded-l-none border-l-0 h-full bg-[#fc0173]">
        <Search className="h-4 w-4" />
      </Button>
    </form>;
};