import { Link } from "react-router-dom";
import logo from "@/assets/myhealth-full-logo.png";

export const Logo = () => {
  return (
    <Link to="/" aria-label="myhealth checkup Home" className="flex items-center">
      <img 
        src={logo} 
        alt="myhealth checkup" 
        className="h-30 md:h-36 w-auto"
      />
    </Link>
  );
};