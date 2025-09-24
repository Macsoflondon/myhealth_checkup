import { Link } from "react-router-dom";
const logo = "/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png";
export const Logo = () => {
  return <Link to="/" aria-label="Health & Wellness Hub Home" className="flex items-center gap-3 mx-0 py-0">
      <img src={logo} alt="myhealth checkup Logo" className="min-h-20 w-20 rounded-lg" />
      <div className="flex flex-col">
        <span className="leading-tight text-3xl text-center font-semibold text-[#081129]">myhealth</span>
        <span className="leading-tight text-3xl py-0 text-[#e70d69] font-semibold text-left my-0">checkup</span>
      </div>
      <div className="hidden sm:block ml-2 md:ml-4 text-xs sm:text-sm md:text-sm text-cyan-500 font-medium">
        
        <span className="md:hidden">Your health matters!</span>
      </div>
    </Link>;
};