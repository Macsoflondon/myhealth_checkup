import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useDropdownAccessibility } from "@/hooks/useDropdownAccessibility";

export interface NavDropdownItem {
  name: string;
  path: string;
}

interface NavItemDropdownProps {
  title: string;
  items: NavDropdownItem[];
  onItemClick?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export const NavItemDropdown: React.FC<NavItemDropdownProps> = ({
  title,
  items,
  onItemClick,
  onClose,
  isMobile = false,
}) => {
  const navigate = useNavigate();

  const { containerRef } = useDropdownAccessibility({
    isOpen: true,
    onClose: onClose || (() => {}),
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    e.stopPropagation();

    onClose?.();
    onItemClick?.();

    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 10);
  };

  return (
    <div
      ref={containerRef}
      role="menu"
      aria-label={`${title} dropdown menu`}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="dropdown-content absolute top-full left-0 pt-2"
      style={{
        zIndex: 9999,
        position: "absolute",
      }}
    >
      <div
        className={`bg-white rounded-xl border border-brand-navy/10 min-w-[280px] overflow-y-auto ${
          isMobile ? "max-h-[60vh]" : "max-h-[75vh]"
        }`}
        style={{
          boxShadow: "0 8px 24px rgba(8, 17, 41, 0.12)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="p-5">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-brand-navy">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-brand-navy/60 hover:text-brand-navy hover:bg-brand-navy/5 transition-colors"
              aria-label="Close dropdown"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dropdown Items */}
          <div className="grid grid-cols-1 gap-1.5">
            {items.map((item) => (
              <a
                key={item.path + item.name}
                href={item.path}
                className="block p-2.5 rounded-lg transition-colors border border-transparent hover:border-brand-navy/10 hover:bg-brand-navy/[0.03] cursor-pointer"
                onClick={(e) => handleLinkClick(e, item.path)}
              >
                <span className="text-sm font-medium text-brand-navy hover:text-brand-pink transition-colors">
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
