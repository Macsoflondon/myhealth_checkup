
import { Link } from "react-router-dom";

// Navigation items for better maintainability
export const navigationItems = [
  { name: "Find your test", path: "/find-test" },
  { name: "Most popular tests", path: "/most-popular-tests" },
  { name: "At-home tests", path: "/at-home-tests" },
  { name: "Women's", path: "/womens-health" },
  { name: "Men's", path: "/mens-health" },
  { name: "Thyroid", path: "/thyroid" },
  { name: "Sports Performance", path: "/sports-performance" },
  { name: "Wellness", path: "/wellness" },
  { name: "Conditions", path: "/conditions" },
  { name: "Health Hub", path: "/health-blog" },
  { name: "My results", path: "/dashboard" }
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
