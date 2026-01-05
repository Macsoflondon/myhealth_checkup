import { useState, useCallback } from 'react';

export interface DraggableItem {
  id: string;
  index: number;
}

export interface DragHandlers<T = any> {
  onDragStart: (e: React.DragEvent, item: DraggableItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  draggedItem: DraggableItem | null;
  draggedOverIndex: number | null;
}

interface UseDraggableOptions<T> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  getId: (item: T) => string;
}

export function useDraggable<T>({
  items,
  onReorder,
  getId,
}: UseDraggableOptions<T>): DragHandlers<T> {
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  const onDragStart = useCallback((e: React.DragEvent, item: DraggableItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    
    // Add dragging class to the element
    const target = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => {
      target.classList.add('is-dragging');
    });
  }, []);

  const onDragEnd = useCallback((e: React.DragEvent) => {
    // Remove dragging class
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('is-dragging');
    
    setDraggedItem(null);
    setDraggedOverIndex(null);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const target = e.currentTarget as HTMLElement;
    const targetIndex = parseInt(target.dataset.index || '0', 10);
    
    if (draggedItem && targetIndex !== draggedItem.index) {
      setDraggedOverIndex(targetIndex);
    }
  }, [draggedItem]);

  const onDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.index === targetIndex) {
      setDraggedOverIndex(null);
      return;
    }

    // Reorder items
    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(draggedItem.index, 1);
    reorderedItems.splice(targetIndex, 0, movedItem);

    onReorder(reorderedItems);
    setDraggedOverIndex(null);
  }, [draggedItem, items, onReorder]);

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    draggedItem,
    draggedOverIndex,
  };
}
