import React from "react";
import { Link } from "react-router-dom";

interface MoreDropdownSection {
  title: string;
  items: Array<{ name: string; path: string }>;
}

interface MoreDropdownMenuProps {
  sections: MoreDropdownSection[];
  onItemClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: (event?: React.MouseEvent) => void;
}

export const MoreDropdownMenu: React.FC<MoreDropdownMenuProps> = ({
  sections,
  onItemClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      className="dropdown-content absolute top-full right-0 mt-2 bg-background border border-border rounded-lg shadow-2xl z-[9999] min-w-[280px] max-h-[70vh] overflow-y-auto"
      style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4">
        {sections.map((section, sectionIndex) => (
          <div key={section.title}>
            {/* Section Heading */}
            <div className="px-2 py-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            
            {/* Section Items */}
            <div className="grid grid-cols-1 gap-1 mb-3">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block p-2 rounded-lg hover:bg-accent transition-colors"
                  onClick={onItemClick}
                >
                  <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* Divider between sections (except last) */}
            {sectionIndex < sections.length - 1 && (
              <div className="border-t border-border mb-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
