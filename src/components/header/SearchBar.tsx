import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative w-full max-w-[400px] md:max-w-[480px]">
      <form onSubmit={handleSearch} className="flex w-full items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Search across 540+ tests"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-3 h-11 w-full text-sm md:text-base bg-white text-foreground border-border focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 rounded-r-none"
          />
        </div>
        <Button
          type="submit"
          aria-label="Search tests"
          className="h-11 px-4 rounded-l-none bg-brand-pink hover:bg-brand-pink/90 text-white border-l-0"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};
