import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export const UtilityBar = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 hidden lg:block">
      <div className="px-6 lg:px-16 py-2 flex justify-between items-center text-sm">
        {/* Left: Phone */}
        <a 
          href="tel:+442045380363" 
          className="text-gray-700 hover:text-[#E70D69] transition-colors flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span>020 4538 0363</span>
        </a>
        
        {/* Right: Utility Links */}
        <div className="flex gap-6">
          <Link 
            to="/partners" 
            className="text-gray-700 hover:text-[#E70D69] transition-colors"
          >
            Partner Services
          </Link>
          <Link 
            to="/reviews" 
            className="text-gray-700 hover:text-[#E70D69] transition-colors"
          >
            Reviews
          </Link>
          <Link 
            to="/customer-stories" 
            className="text-gray-700 hover:text-[#E70D69] transition-colors"
          >
            Customer Stories
          </Link>
          <Link 
            to="/how-it-works" 
            className="text-gray-700 hover:text-[#E70D69] transition-colors"
          >
            How It Works
          </Link>
        </div>
      </div>
    </div>
  );
};
