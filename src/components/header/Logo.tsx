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
        className="h-16 sm:h-18 md:h-20 lg:h-24 w-auto"
        loading="eager"
      />
    </Link>
  );
};