import { Star } from "lucide-react";
import { primaryNavigationItems } from "@/components/header/NavigationItems";
import {
  CATEGORY_MENU_ICONS as ICONS,
  MENU_TURQUOISE as TURQUOISE,
} from "@/components/header/menuIcons";
import { CategoryPillDropdown } from "@/components/layout/CategoryPillDropdown";

const SHORT_NAMES: Record<string, string> = {
  "Most Popular Tests": "Most Popular",
  "At Home Test Kits": "Home Tests",
};

/**
 * Desktop-only category pill row (restored 03/11/2026 at the owner's request).
 * The menu drawer remains the full navigation at every width.
 */
export function DesktopCategoryToolbar() {
  return (
    <nav
      aria-label="Browse by category"
      className="hidden lg:flex w-full justify-center bg-white px-3 py-1.5"
      data-testid="browse-by-category-bar"
    >
      <div className="flex flex-nowrap items-center justify-center gap-x-0 2xl:gap-x-3">
        {primaryNavigationItems.map((item) => {
          const { Icon, color } = ICONS[item.name] ?? {
            Icon: Star,
            color: TURQUOISE,
          };
          return (
            <div key={item.name} className="shrink-0">
              <CategoryPillDropdown
                item={item}
                color={color}
                Icon={Icon}
                compact
                dense
                displayName={SHORT_NAMES[item.name] ?? item.name}
              />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
