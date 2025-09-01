
import { MegaMenu } from "./MegaMenu";
import { MobileMegaMenu } from "./MobileMegaMenu";

// Keep the simple array export for backwards compatibility
export const navigationItems = [
  { name: "Find your test", path: "/assisted-test-finder" },
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
  isMobile?: boolean;
}

export const NavigationItems = ({ onItemClick, className = "", isMobile = false }: NavigationItemsProps) => {
  if (isMobile) {
    return <MobileMegaMenu onItemClick={onItemClick} className={className} />;
  }
  
  return <MegaMenu onItemClick={onItemClick} className={className} />;
};
