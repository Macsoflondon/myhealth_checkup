import { Link } from "react-router-dom";
export const Logo = () => {
  return <Link to="/" className="flex items-center gap-2" aria-label="Health & Wellness Hub Home">
      <div className="h-8 w-8 bg-gradient-to-r from-health-500 to-wellness-500 flex items-center justify-center bg-[#081129] rounded-lg">
        <span className="text-white font-bold text-lg">
      </span>
      </div>
      <span className="font-semibold text -montserrat text-center text-white text-3xl">myhealthcheckup.co.uk</span>
    </Link>;
};