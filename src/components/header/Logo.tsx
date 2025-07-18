import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Logo = () => {
  return <Link to="/" className="flex items-center gap-2" aria-label="Health & Wellness Hub Home">
      <div className="h-8 w-8 flex items-center justify-center">
        <img src={logo} alt="MyHealthCheckup Logo" className="h-8 w-8 rounded-lg" />
      </div>
      <span className="font-semibold text -montserrat text-center text-white text-3xl">myhealthcheckup.co.uk</span>
    </Link>;
};