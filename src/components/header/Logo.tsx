import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Logo = () => {
  return <Link to="/" className="flex items-center gap-2" aria-label="Health & Wellness Hub Home">
      <div className="h-8 w-8 flex items-center justify-center">
        <img src={logo} alt="MyHealthCheckup Logo" className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex flex-col text-white">
        <span className="font-semibold text-montserrat text-lg leading-tight">My Health</span>
        <span className="font-semibold text-montserrat text-lg leading-tight">Checkup</span>
      </div>
    </Link>;
};