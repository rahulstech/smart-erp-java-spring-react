import { useEffect } from 'react';

/**
 * Custom hook to enable form input navigation using Shift + Arrow keys.
 * Shift + ArrowDown / Shift + ArrowRight: moves focus to the next input/select/textarea.
 * Shift + ArrowUp / Shift + ArrowLeft: moves focus to the previous input/select/textarea.
 */
export function useFormNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on Shift + Arrow keys
      if (!e.shiftKey) return;
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement) return;

      const tagName = activeElement.tagName.toLowerCase();
      if (!['input', 'select', 'textarea'].includes(tagName)) return;

      // Find the parent form or container to scope the inputs
      const container = activeElement.closest('form') || document.body;
      const focusables = Array.from(
        container.querySelectorAll(
          'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])'
        )
      ) as HTMLElement[];

      if (focusables.length <= 1) return;

      const activeIndex = focusables.indexOf(activeElement);
      if (activeIndex === -1) return;

      // Prevent default behavior (like text selection or scrolling)
      e.preventDefault();

      let nextIndex = activeIndex;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIndex = (activeIndex + 1) % focusables.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        nextIndex = (activeIndex - 1 + focusables.length) % focusables.length;
      }

      focusables[nextIndex]?.focus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
