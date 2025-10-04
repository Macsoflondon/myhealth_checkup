import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const Logo = () => {
  return (
    <Link to="/" aria-label="myhealth checkup Home" className="flex items-center gap-2 group">
      <Heart className="h-8 w-8 md:h-10 md:w-10 text-[#FA6980] fill-[#FA6980] transition-transform group-hover:scale-110" />
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg md:text-xl font-['Montserrat'] leading-tight">
          myhealth
        </span>
        <span className="text-[#3A5F85] font-semibold text-sm md:text-base font-['Montserrat'] leading-tight">
          checkup
        </span>
      </div>
    </Link>
  );
};