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
  return;
};