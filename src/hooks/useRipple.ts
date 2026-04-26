import { useCallback } from 'react';

interface RippleEvent {
  clientX: number;
  clientY: number;
  currentTarget: HTMLElement;
}

export const useRipple = () => {
  const createRipple = useCallback((event: RippleEvent) => {
    const button = event.currentTarget;
    const clientX = event.clientX;
    const clientY = event.clientY;
    
    // Defer to next frame to avoid forced reflow
    requestAnimationFrame(() => {
      // Batch read: get all layout info first
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;
      const existingRipple = button.querySelector('.ripple-effect');

      // Batch write: perform all DOM mutations together
      if (existingRipple) {
        existingRipple.remove();
      }
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px;`;
      ripple.classList.add('ripple-effect');
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }, []);

  return createRipple;
};
