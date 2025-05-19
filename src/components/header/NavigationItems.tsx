
import { Link } from "react-router-dom";

// Navigation items for better maintainability
export const navigationItems = [
  { name: "Compare Tests", path: "/compare" },
  { name: "Subscriptions", path: "/subscriptions" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "About Us", path: "/about" }
];

interface NavigationItemsProps {
  onItemClick?: () => void;
  className?: string;
}

export const NavigationItems = ({ onItemClick, className = "" }: NavigationItemsProps) => {
  return (
    <nav className={className} aria-label="Main Navigation">
      {navigationItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          className="text-gray-600 hover:text-health-600 transition-colors font-medium"
          onClick={onItemClick}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
