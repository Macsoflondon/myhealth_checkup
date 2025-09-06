import React from 'react';
import { Badge } from '@/components/ui/badge';
interface CategoryItem {
  id: string;
  name: string;
  color: string;
  path?: string;
}
const categoryItems: CategoryItem[] = [{
  id: 'annual-health',
  name: 'Annual health report',
  color: 'bg-red-500',
  path: '/annual-health'
}, {
  id: 'biomarkers',
  name: 'Biomarkers',
  color: 'bg-teal-500',
  path: '/biomarkers'
}, {
  id: 'blood-testing',
  name: 'Blood testing',
  color: 'bg-pink-500',
  path: '/blood-testing'
}, {
  id: 'fertility',
  name: 'Fertility',
  color: 'bg-orange-500',
  path: '/fertility-tests'
}, {
  id: 'general-health',
  name: 'General health',
  color: 'bg-red-600',
  path: '/general-health'
}, {
  id: 'hormone-health',
  name: 'Hormone health',
  color: 'bg-red-500',
  path: '/hormone-health'
}, {
  id: 'longevity',
  name: 'Longevity',
  color: 'bg-emerald-500',
  path: '/longevity'
}, {
  id: 'menopause',
  name: 'Menopause',
  color: 'bg-purple-500',
  path: '/menopause'
}, {
  id: 'mens-health',
  name: "Men's health",
  color: 'bg-sky-400',
  path: '/mens-health'
}, {
  id: 'mental-health',
  name: 'Mental health',
  color: 'bg-red-500',
  path: '/mental-health'
}, {
  id: 'nutrition',
  name: 'Nutrition',
  color: 'bg-lime-500',
  path: '/nutrition'
}, {
  id: 'pcos',
  name: 'PCOS',
  color: 'bg-purple-500',
  path: '/pcos'
}, {
  id: 'skin-health',
  name: 'Skin health',
  color: 'bg-orange-300',
  path: '/skin-health'
}, {
  id: 'sports-performance',
  name: 'Sports performance',
  color: 'bg-blue-500',
  path: '/sports-performance'
}, {
  id: 'testosterone',
  name: 'Testosterone',
  color: 'bg-sky-400',
  path: '/testosterone'
}, {
  id: 'thyroid',
  name: 'Thyroid',
  color: 'bg-emerald-500',
  path: '/thyroid'
}, {
  id: 'vitamin-d',
  name: 'Vitamin D',
  color: 'bg-lime-400',
  path: '/vitamin-d'
}, {
  id: 'vitamin-index',
  name: 'Vitamin index',
  color: 'bg-lime-400',
  path: '/vitamin-index'
}, {
  id: 'womens-health',
  name: "Women's health",
  color: 'bg-pink-500',
  path: '/womens-health'
}, {
  id: 'all-health',
  name: 'All health articles',
  color: 'bg-pink-500',
  path: '/health-blog'
}];
const CategoryFilters: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {categoryItems.map((category) => (
        <Badge
          key={category.id}
          variant="secondary"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: category.color }}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
};
export default CategoryFilters;