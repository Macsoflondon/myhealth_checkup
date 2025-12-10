import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/myhealth-logo.png";
export const Logo = () => {
  const location = useLocation();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  return (
    <Link to="/" onClick={handleClick} className="flex items-center">
      <img 
        src={logo} 
        alt="My Health Checkup" 
        className="h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 w-auto max-h-[20vh] object-contain"
        loading="eager"
      />
    </Link>
  );
};