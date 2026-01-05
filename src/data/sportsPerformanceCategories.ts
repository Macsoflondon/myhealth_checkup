import { Dumbbell, Activity, Zap, TrendingUp } from 'lucide-react';

export interface SportsCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  testCount: number;
  link: string;
}

export const sportsPerformanceCategories: SportsCategory[] = [
  {
    id: 'athletic-performance',
    name: 'Athletic Performance Optimization',
    icon: Dumbbell,
    description: 'Comprehensive biomarker analysis for peak athletic performance and muscle function',
    color: '#FA6980',
    testCount: 12,
    link: '/compare?category=sports-performance'
  },
  {
    id: 'endurance-recovery',
    name: 'Endurance & Recovery Testing',
    icon: Activity,
    description: 'Monitor recovery markers, inflammation, and endurance capacity for optimal training',
    color: '#22C0D4',
    testCount: 8,
    link: '/compare?category=sports-performance'
  },
  {
    id: 'sports-nutrition',
    name: 'Sports Nutrition Analysis',
    icon: Zap,
    description: 'Assess vitamin, mineral, and nutritional status to fuel athletic excellence',
    color: '#E70D69',
    testCount: 15,
    link: '/compare?category=sports-performance'
  },
  {
    id: 'performance-optimization',
    name: 'Performance Optimization',
    icon: TrendingUp,
    description: 'Advanced testing for competitive athletes seeking data-driven performance gains',
    color: '#3A5F85',
    testCount: 6,
    link: '/compare?category=sports-performance'
  }
];
