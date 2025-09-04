
import { Link } from "react-router-dom";

// Navigation items matching the uploaded design
export const navigationItems = [
  { name: "FIND YOUR TEST", path: "/assisted-test-finder", highlighted: true },
  { name: "MOST POPULAR TESTS", path: "/most-popular-tests", highlighted: true },
  { name: "WOMEN'S HEALTH", path: "/womens-health" },
  { name: "MEN'S HEALTH", path: "/mens-health" },
  { name: "GENERAL WELLNESS", path: "/wellness" },
  { name: "THYROID HEALTH", path: "/thyroid" },
  { name: "SPORTS PERFORMANCE", path: "/sports-performance" },
  { name: "PRENATAL BLOOD", path: "/fertility-tests" },
  { name: "HEALTH HUB", path: "/health-blog" },
  { name: "AT-HOME TESTS", path: "/at-home-tests" }
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
          className={`text-[10px] font-bold transition-colors px-1.5 py-1 whitespace-nowrap hover:opacity-80 uppercase ${
            (item as any).highlighted 
              ? "text-pink-500" 
              : "text-gray-700"
          }`}
          onClick={onItemClick}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
