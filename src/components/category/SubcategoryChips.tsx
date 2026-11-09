import { Link } from "@/lib/router-compat";
import { displayLabel } from "@/lib/display-label";
import { SUBCATEGORY_MAP } from "@/config/subcategoryMap";

interface Props {
  canonicalCategory: string;
  parentPath: string;
  activeSlug: string | null;
}

/** On-page subsection links, driven by the same map as the category menus. */
export function SubcategoryChips({ canonicalCategory, parentPath, activeSlug }: Props) {
  const subs = SUBCATEGORY_MAP[canonicalCategory] ?? [];
  if (subs.length === 0) return null;
  const base =
    "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors";
  const on = "border-primary bg-primary text-primary-foreground";
  const off = "border-secondary bg-white text-foreground hover:bg-secondary/10";
  return (
    <nav aria-label="Subsections" className="bg-white px-4 pt-8 sm:px-6 lg:px-12 xl:px-16">
      <ul className="mx-auto flex max-w-6xl flex-wrap gap-2">
        <li>
          <Link to={parentPath} className={`${base} ${activeSlug ? off : on}`}>
            All
          </Link>
        </li>
        {subs.map((s) => (
          <li key={s.slug}>
            <Link
              to={`${parentPath}?subcategory=${s.slug}`}
              aria-current={activeSlug === s.slug ? "page" : undefined}
              className={`${base} ${activeSlug === s.slug ? on : off}`}
            >
              {displayLabel(s.label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
