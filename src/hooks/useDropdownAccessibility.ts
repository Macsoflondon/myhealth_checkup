import { useEffect, useRef, useCallback } from "react";

interface UseDropdownAccessibilityOptions {
  isOpen: boolean;
  onClose: () => void;
}

export const useDropdownAccessibility = ({
  isOpen,
  onClose,
}: UseDropdownAccessibilityOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndexRef = useRef<number>(-1);

  // Get all focusable elements within the dropdown
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(el => el.offsetParent !== null); // Filter out hidden elements
  }, []);

  // Update focusable elements list
  const updateFocusableElements = useCallback(() => {
    focusableElementsRef.current = getFocusableElements();
  }, [getFocusableElements]);

  // Focus an element by index
  const focusElement = useCallback((index: number) => {
    const elements = focusableElementsRef.current;
    if (elements.length === 0) return;

    // Wrap around
    let newIndex = index;
    if (index < 0) {
      newIndex = elements.length - 1;
    } else if (index >= elements.length) {
      newIndex = 0;
    }

    currentFocusIndexRef.current = newIndex;
    elements[newIndex]?.focus();
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      updateFocusableElements();
      const elements = focusableElementsRef.current;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusElement(currentFocusIndexRef.current + 1);
          break;

        case 'ArrowUp':
          e.preventDefault();
          focusElement(currentFocusIndexRef.current - 1);
          break;

        case 'Home':
          e.preventDefault();
          focusElement(0);
          break;

        case 'End':
          e.preventDefault();
          focusElement(elements.length - 1);
          break;

        case 'Tab':
          // Trap focus within dropdown
          if (elements.length === 0) return;

          const firstElement = elements[0];
          const lastElement = elements[elements.length - 1];

          if (e.shiftKey) {
            // Shift+Tab: going backwards
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            // Tab: going forwards
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
          break;

        default:
          break;
      }
    },
    [isOpen, focusElement, updateFocusableElements]
  );

  // Track current focus index when focus changes
  const handleFocusIn = useCallback(() => {
    if (!containerRef.current) return;

    const activeElement = document.activeElement;
    const index = focusableElementsRef.current.findIndex(
      (el) => el === activeElement
    );
    
    if (index !== -1) {
      currentFocusIndexRef.current = index;
    }
  }, []);

  // Set up event listeners and initial focus
  useEffect(() => {
    if (!isOpen) {
      currentFocusIndexRef.current = -1;
      return;
    }

    // Update focusable elements
    updateFocusableElements();

    // Focus search input or first focusable element
    const timer = setTimeout(() => {
      updateFocusableElements();
      const elements = focusableElementsRef.current;
      
      // Try to find and focus the search input first
      const searchInput = containerRef.current?.querySelector('input[type="text"]') as HTMLElement;
      if (searchInput) {
        searchInput.focus();
        const index = elements.findIndex(el => el === searchInput);
        currentFocusIndexRef.current = index !== -1 ? index : 0;
      } else if (elements.length > 0) {
        // Focus close button or first element
        const closeButton = elements.find(el => el.getAttribute('aria-label') === 'Close dropdown');
        if (closeButton) {
          closeButton.focus();
          currentFocusIndexRef.current = elements.indexOf(closeButton);
        } else {
          elements[0]?.focus();
          currentFocusIndexRef.current = 0;
        }
      }
    }, 50);

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    containerRef.current?.addEventListener('focusin', handleFocusIn);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      containerRef.current?.removeEventListener('focusin', handleFocusIn);
    };
  }, [isOpen, handleKeyDown, handleFocusIn, updateFocusableElements]);

  return {
    containerRef,
    updateFocusableElements,
  };
};
