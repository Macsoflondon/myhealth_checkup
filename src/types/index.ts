/**
 * Centralized type exports
 */

export type {
  Clinic,
  ClinicWithDistance,
  Provider,
  Test,
  TestFeatures,
  CompareTestData,
  UserProfile,
  Order,
  Favorite,
} from './entities';

export type {
  ApiResponse,
  PaginationParams,
  FilterParams,
} from '../api/supabase/base';

/**
 * Live test data from provider_tests table
 */
export interface LiveTestData {
  id: string;
  test_name: string;
  provider_id: string;
  category: string;
  price: number | null;
  description: string | null;
  is_active: boolean;
  image_url: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Draggable item interface for drag and drop operations
 */
export interface DraggableItem {
  id: string;
  index: number;
}

/**
 * Drag handlers interface for drag and drop operations
 */
export interface DragHandlers<T = any> {
  onDragStart: (e: React.DragEvent, item: DraggableItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  draggedItem: DraggableItem | null;
  draggedOverIndex: number | null;
}
