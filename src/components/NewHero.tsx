import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, CheckCircle2, Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const NewHero = () => {
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
  const popularSearches = ["Thyroid Function", "Hormone Health", "Vitamin D", "Full Blood Count", "Cholesterol", "Diabetes Check", "Iron Levels", "B12 & Folate"];
  return <section className="relative overflow-hidden bg-gradient-to-br from-health-primary via-health-secondary to-health-accent text-white min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="wave-pattern h-full w-full mx-[100px]"></div>
      </div>
      
      <div className="container relative z-10 bg-0 mx-0 px-0 py-[64px] w-full">
        <div className="max-w-6xl mx-auto text-center">
          {/* Full Logo */}
          <div className="mb-8">
            <img src="/lovable-uploads/fb38b3cb-2951-43b1-b026-3fc3b7493fc6.png" alt="myhealth checkup - Your health is your greatest asset" className="mx-auto max-w-screen-2xl w-full h-auto" />
          </div>
          {/* Main Headline */}
          <h1 className="text-4xl lg:text-6xl mb-6 leading-tight text-center font-semibold text-zinc-50 md:text-5xl">
            <span className="block bg-gradient-to-r from-white to-health-accent bg-clip-text text-white text-center font-light">Compare the UK’s most trusted health and wellness tests providers - all in one place</span>
          </h1>
          
          

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur rounded-lg py-3 px-4">
              <CheckCircle2 className="w-5 h-5 text-health-success" />
              <span className="text-sm font-medium">No GP referral needed</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur rounded-lg py-3 px-4">
              <Shield className="w-5 h-5 text-health-success" />
              <span className="text-sm font-medium">UKAS-accredited labs</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur rounded-lg py-3 px-4">
              <MapPin className="w-5 h-5 text-health-success" />
              <span className="text-sm font-medium">In-clinic or home kits</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur rounded-lg py-3 px-4">
              <Clock className="w-5 h-5 text-health-success" />
              <span className="text-sm font-medium">Fast, expert-reviewed results</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Search for blood tests, conditions, or health concerns..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-health-primary focus:outline-none text-gray-800 placeholder-gray-500" />
                </div>
                <Button onClick={handleSearch} size="lg" className="px-8 py-4 text-lg bg-health-accent hover:bg-health-accent/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                  Find Tests
                </Button>
              </div>
              
              {/* Popular Searches */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => <button key={index} onClick={() => setSearchTerm(search)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-health-primary hover:text-white rounded-full transition-all duration-200 text-gray-700">
                      {search}
                    </button>)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2"> 5+</div>
              <div className="text-white/80">Trusted Providers</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2">30+</div>
              <div className="text-white/80">Available Tests</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2">48-72hrs</div>
              <div className="text-white/80">Fast Results</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-3xl font-bold text-white mb-2">50,000+</div>
              <div className="text-white/80">Tests Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default NewHero;