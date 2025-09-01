
import { Link } from "react-router-dom";

// Simple navigation items for the horizontal layout
export const navigationItems = [
  { name: "Find your test", path: "/assisted-test-finder" },
  { name: "Most popular tests", path: "/most-popular-tests" },
  { name: "Women's", path: "/womens-health" },
  { name: "Men's", path: "/mens-health" },
  { name: "Thyroid", path: "/thyroid" },
  { name: "Sports Performance", path: "/sports-performance" },
  { name: "Wellness", path: "/wellness" },
  { name: "Conditions", path: "/conditions" },
  { name: "Health Hub", path: "/health-blog" },
  { name: "At-home tests", path: "/at-home-tests" }
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
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
          onClick={onItemClick}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
