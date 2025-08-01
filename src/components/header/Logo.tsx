import { Link } from "react-router-dom";
const logo = "/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png";
export const Logo = () => {
  return <Link to="/" className="flex items-center gap-2" aria-label="Health & Wellness Hub Home">
      <div className="h-8 w-8 flex items-center justify-center">
        <img src={logo} alt="myhealth checkup Logo" className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex flex-col text-white">
        <span className="font-semibold text-montserrat text-lg leading-tight text-left text-white">myhealth</span>
        <span className="font-semibold text-montserrat text-lg leading-tight text-[#22c0d4]">checkup</span>
      </div>
    </Link>;
};