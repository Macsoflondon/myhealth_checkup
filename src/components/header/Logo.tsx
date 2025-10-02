import { Link } from "react-router-dom";
import logo from "@/assets/myhealth-logo.png";
export const Logo = () => {
  return <Link to="/" aria-label="myhealth checkup Home" className="flex items-center">
      <img src={logo} alt="myhealth checkup Logo" className="h-40 md:h-16 w-" />
    </Link>;
};