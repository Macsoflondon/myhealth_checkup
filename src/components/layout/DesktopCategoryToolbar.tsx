import { Star } from "lucide-react";
import { primaryNavigationItems } from "@/components/header/NavigationItems";
import {
  CATEGORY_MENU_ICONS as ICONS,
  MENU_TURQUOISE as TURQUOISE,
} from "@/components/header/menuIcons";
import { CategoryPillDropdown } from "@/components/layout/CategoryPillDropdown";
import { displayLabel } from "@/lib/display-label";

const SHORT_NAMES: Record<string, string> = {
  "Most popular tests": "Most popular",
  "At Home Test Kits": "Home tests",
};

/**
 * Desktop-only category pill row (restored 03/11/2026 at the owner's request).
 * The menu drawer remains the full navigation at every width.
 */
export function DesktopCategoryToolbar() {
  return (
    <nav
      aria-label="Browse by category"
      className="hidden lg:flex w-full overflow-x-auto bg-white px-3 py-1.5 [scrollbar-width:none]"
      data-testid="browse-by-category-bar"
    >
      <div className="mx-auto flex w-max flex-nowrap items-center gap-x-0 2xl:gap-x-3">
        {primaryNavigationItems
          .filter((item) => item.name in ICONS && item.name !== "How it works")
          .map((item) => {
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
                displayName={SHORT_NAMES[item.name] ?? displayLabel(item.name)}
              />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
