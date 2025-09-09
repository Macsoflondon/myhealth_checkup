import { Link } from "react-router-dom";
const logo = "/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png";
export const Logo = () => {
  return <Link to="/" className="flex items-center gap-3" aria-label="Health & Wellness Hub Home">
      <img src={logo} alt="myhealth checkup Logo" className="h-10 w-10 rounded-lg" />
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight text-[#1a1b34]">myhealth</span>
        <span className="text-lg leading-tight text-cyan-500 font-normal">checkup</span>
      </div>
      <div className="hidden sm:block ml-2 md:ml-4 text-xs sm:text-sm md:text-sm text-cyan-500 font-medium">
        <span className="hidden md:inline">Your health is your greatest asset!</span>
        <span className="md:hidden">Your health matters!</span>
      </div>
    </Link>;
};