import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/myhealth-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
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
        alt="myhealth checkup" 
        className={cn("h-12 sm:h-14 lg:h-16 xl:h-20 object-contain", className)} 
      />
    </Link>
  );
};