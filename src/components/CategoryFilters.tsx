import React from 'react';
import { Badge } from '@/components/ui/badge';
import { compareCategories } from '@/data/compare/categories';

interface CategoryFiltersProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {compareCategories.map((category) => (
        <Badge
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onCategoryChange?.(category.id)}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilters;