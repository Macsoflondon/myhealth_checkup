import { Star } from "lucide-react";
import { categoryNavigationItems } from "@/components/header/NavigationItems";
import {
  CATEGORY_MENU_ICONS as ICONS,
  MENU_TURQUOISE as TURQUOISE,
} from "@/components/header/menuIcons";
import { CategoryPillDropdown } from "@/components/layout/CategoryPillDropdown";

/**
 * Desktop category row (1024px and up), rendered by BrowseByCategoryBar under
 * the brand bar on the homepage and on every page that carries the shared
 * header. Labels come straight from `categoryNavigationItems`, the same list
 * the menu drawer uses, so both always show the same names. The drawer stays
 * the full navigation at every width.
 */
export function DesktopCategoryToolbar() {
  return (
    <nav
      aria-label="Browse by category"
      className="hidden lg:flex w-full basis-full overflow-x-auto bg-white px-2 py-1.5 xl:px-3 [scrollbar-width:none]"
      data-testid="browse-by-category-bar"
    >
      <div className="mx-auto flex w-max flex-nowrap items-center gap-x-0 2xl:gap-x-1">
        {categoryNavigationItems.map((item) => {
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
              />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
