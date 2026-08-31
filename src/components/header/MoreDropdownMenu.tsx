import React, { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { X, ChevronDown, User, LayoutDashboard, LogOut } from "lucide-react";
import { useDropdownAccessibility } from "@/hooks/useDropdownAccessibility";
import { useActiveLanguage } from "@/components/header/LanguageSwitcher";
import { menuIconFor, MENU_PINK } from "@/components/header/menuIcons";

interface MoreDropdownItem {
  name: string;
  path: string;
  hasDropdown?: boolean;
  dropdownItems?: Array<{ name: string; path: string }>;
}

interface MoreDropdownSection {
  title: string;
  items: MoreDropdownItem[];
}

interface AccountItem {
  name: string;
  path: string;
  onClick?: () => void;
}

interface MoreDropdownMenuProps {
  sections: MoreDropdownSection[];
  onItemClick?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  accountItems?: AccountItem[];
  languageList?: React.ReactNode;
}

const accountIcon = (name: string) => {
  if (name === "Sign in") return <User className="w-4 h-4" />;
  if (name === "Dashboard") return <LayoutDashboard className="w-4 h-4" />;
  if (name === "Sign Out") return <LogOut className="w-4 h-4" />;
  return null;
};

/**
 * Desktop "More" panel — visually identical to the mobile hamburger drawer:
 * off-white surface, uppercase section labels, white pill cards with tinted
 * icon chips. Anchored under the More button instead of a side drawer.
 */
export const MoreDropdownMenu: React.FC<MoreDropdownMenuProps> = ({
  sections,
  onItemClick,
  onClose,
  isMobile = false,
  accountItems,
  languageList,
}) => {
  const navigate = useNavigate();
  const currentLanguage = useActiveLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Accessibility hook for focus trapping and arrow key navigation
  const { containerRef } = useDropdownAccessibility({
    isOpen: true,
    onClose: onClose || (() => {}),
  });

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Close dropdown first
    onClose?.();
    onItemClick?.();

    // Navigate after a short delay to ensure the dropdown has closed
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 10);
  };

  return (
    <div
      ref={containerRef}
      role="menu"
      aria-label="More options dropdown menu"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className={`dropdown-content absolute top-full right-0 mt-2 bg-[#f7f7f8] border border-[#081129] rounded-lg shadow-2xl w-[340px] overflow-y-auto ${
        isMobile ? "max-h-[60vh]" : "max-h-[75vh]"
      }`}
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
        position: "absolute",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Header — matches the drawer's sheet header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#081129]/10">
        <h2 className="text-[#081129] text-base font-[Montserrat] font-semibold">
          More
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-[#081129] hover:bg-[#081129]/5 transition-colors"
          aria-label="Close dropdown"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="px-3 py-4">
        <div className="space-y-6">
          {/* Account + language — pill row kept at the top like the drawer */}
          {(languageList || (accountItems && accountItems.length > 0)) && (
            <div>
              <div className="flex items-center gap-2 flex-wrap px-1">
                {languageList && (
                  <button
                    type="button"
                    onClick={() => setLangOpen((v) => !v)}
                    aria-expanded={langOpen}
                    aria-label="Select language"
                    className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-[#e70d69] bg-white px-2.5 py-2 transition-colors hover:bg-[#e70d69]/5"
                  >
                    <span className="text-[16px] leading-none">
                      {currentLanguage.flag}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#e70d69] transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
                {accountItems?.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#e70d69] bg-white px-4 py-2 no-underline transition-colors hover:bg-[#e70d69] group/acct"
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        e.stopPropagation();
                        item.onClick();
                      } else {
                        handleLinkClick(e, item.path);
                      }
                    }}
                  >
                    <span className="text-[#081129] group-hover/acct:text-white transition-colors [&>svg]:w-4 [&>svg]:h-4">
                      {accountIcon(item.name)}
                    </span>
                    <span className="text-[12.5px] font-semibold font-[Montserrat] text-[#081129] group-hover/acct:text-white transition-colors whitespace-nowrap">
                      {item.name}
                    </span>
                  </a>
                ))}
              </div>

              {languageList && langOpen && (
                <div className="mt-3 rounded-xl border border-[#081129]/10 bg-white p-2 max-h-[280px] overflow-y-auto">
                  {languageList}
                </div>
              )}
            </div>
          )}

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/40 mb-3">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {section.items.map((item) => {
                  const { Icon, color } = menuIconFor(item.name);
                  const hasSubs = Boolean(item.hasDropdown && item.dropdownItems?.length);
                  const isExpanded = expandedItem === item.name;
                  return (
                    <div
                      key={item.path + item.name}
                      className="rounded-xl bg-white border-[1.5px] border-[#081129]/10 overflow-hidden"
                    >
                      <div className="flex items-stretch">
                        <a
                          href={item.path}
                          onClick={(e) => handleLinkClick(e, item.path)}
                          className="group flex items-center gap-3 px-3 py-2.5 flex-1 min-w-0 no-underline"
                        >
                          <span
                            className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0"
                            style={{ background: `${color}1a` }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
                          </span>
                          <span className="text-sm font-semibold text-[#081129] font-[Montserrat] truncate">
                            {item.name}
                          </span>
                        </a>
                        {hasSubs && (
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-label={`Expand ${item.name}`}
                            onClick={() =>
                              setExpandedItem((cur) => (cur === item.name ? null : item.name))
                            }
                            className="shrink-0 px-3 flex items-center justify-center border-l border-[#081129]/10 text-[#081129]/60"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>
                      {hasSubs && isExpanded && (
                        <ul className="border-t border-[#081129]/10 bg-[#f7f7f8] py-1">
                          {item.dropdownItems!.map((sub) => (
                            <li key={sub.path + sub.name}>
                              <a
                                href={sub.path}
                                onClick={(e) => handleLinkClick(e, sub.path)}
                                className="flex items-center gap-2.5 pl-14 pr-3 py-2 text-[13px] font-medium text-[#081129] font-[Montserrat] no-underline hover:bg-white transition-colors"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ background: color }}
                                />
                                <span className="truncate">{sub.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};
