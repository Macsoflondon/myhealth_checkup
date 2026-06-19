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
      className={`dropdown-content absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl min-w-[280px] overflow-y-auto ${
        isMobile ? "max-h-[60vh]" : "max-h-[75vh]"
      }`}
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
        position: "absolute",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div className="p-5">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              className="state-layer block p-2.5 rounded-lg transition-shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
              onClick={(e) => handleLinkClick(e, item.path)}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-500 transition-colors">
                {item.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
