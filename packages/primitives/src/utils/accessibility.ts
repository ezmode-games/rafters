/**
 * Accessibility utilities for WCAG AAA compliance
 *
 * @registryType registry:util
 * @registryVersion 0.1.0
 */

/**
 * Check if element meets WCAG AAA touch target size (44x44px)
 *
 * @param element - Element to check
 * @returns True if meets requirement
 */
export function meetsTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
}

/**
 * Get focusable elements within container
 *
 * @param container - Container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    return (
      el.offsetWidth > 0 &&
      el.offsetHeight > 0 &&
      window.getComputedStyle(el).visibility !== 'hidden'
    );
  });
}

/**
 * Trap focus within element
 * Useful for modals and dialogs
 *
 * @param element - Container element
 * @param event - Keyboard event
 * @returns True if focus was trapped
 */
export function trapFocus(element: HTMLElement, event: KeyboardEvent): boolean {
  if (event.key !== 'Tab') return false;

  const focusableElements = getFocusableElements(element);
  if (focusableElements.length === 0) return false;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement as HTMLElement;

  if (event.shiftKey) {
    // Shift + Tab
    if (activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return true;
    }
  } else {
    // Tab
    if (activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
      return true;
    }
  }

  return false;
}

/**
 * Set focus to first focusable element
 *
 * @param container - Container element
 * @returns True if focus was set
 */
export function focusFirst(container: HTMLElement): boolean {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }
  return false;
}

/**
 * Restore focus to previously focused element
 *
 * @param element - Element to restore focus to
 */
export function restoreFocus(element: HTMLElement | null): void {
  if (element && document.body.contains(element)) {
    element.focus();
  }
}

/**
 * Generate unique ID for ARIA associations
 *
 * @param prefix - ID prefix
 * @returns Unique ID
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
