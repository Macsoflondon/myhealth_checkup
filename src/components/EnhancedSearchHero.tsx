
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnhancedSearchHero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Find the best blood tests, health checks, and diagnostic services across the UK. 
            <br />
            <span className="text-blue-200">Compare prices, reviews, and book instantly.</span>
          </h1>
          
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for blood tests, providers, or conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 text-gray-800 placeholder-gray-500"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-xl"
                >
                  Search Tests
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-100">10+</p>
              <p className="text-blue-200">Leading Providers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-100">300+</p>
              <p className="text-blue-200">Available Tests</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-100">24-48hrs</p>
              <p className="text-blue-200">Fast Results</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-100">96%</p>
              <p className="text-blue-200">Satisfied Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedSearchHero;
