/**
 * Focus trap primitive
 * Client-only, returns cleanup function
 * SSR-safe: checks for window existence
 */

export type CleanupFunction = () => void;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Create a focus trap within an element
 * Returns cleanup function to remove trap
 *
 * @example
 * const cleanup = createFocusTrap(dialogElement);
 * // Later...
 * cleanup();
 */
export function createFocusTrap(element: HTMLElement): CleanupFunction {
  // SSR guard
  if (typeof window === 'undefined') {
    return () => {};
  }

  const previouslyFocused = document.activeElement as HTMLElement;

  // Get all focusable elements
  const getFocusableElements = (): HTMLElement[] => {
    return Array.from(element.querySelectorAll(FOCUSABLE_SELECTOR));
  };

  // Focus first element
  const focusableElements = getFocusableElements();
  if (focusableElements.length > 0) {
    focusableElements[0]?.focus();
  }

  // Handle Tab key to cycle focus
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey) {
      // Shift+Tab: wrap from first to last
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: wrap from last to first
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
    // Restore focus to previously focused element
    previouslyFocused?.focus();
  };
}

/**
 * Prevent scrolling on body when dialog is open
 * Returns cleanup function
 */
export function preventBodyScroll(): CleanupFunction {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;

  // Prevent scroll but maintain scrollbar width to prevent layout shift
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  return () => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  };
}
