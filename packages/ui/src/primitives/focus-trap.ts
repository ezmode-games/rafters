/**
 * Focus trap primitive
 * Client-only, returns cleanup function
 * SSR-safe: checks for window existence
 */

import type { CleanupFunction } from './types';

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

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? focusable.indexOf(active) : -1;

    if (event.shiftKey) {
      // Shift+Tab: move backward or wrap to last
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
      const target = focusable[prevIndex];
      if (target) {
        event.preventDefault();
        target.focus();
      }
    } else {
      // Tab: move forward or wrap to first
      const nextIndex =
        currentIndex >= 0 && currentIndex < focusable.length - 1 ? currentIndex + 1 : 0;
      const target = focusable[nextIndex];
      if (target) {
        event.preventDefault();
        target.focus();
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
