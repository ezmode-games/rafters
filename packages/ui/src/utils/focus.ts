/**
 * Focus management utilities
 *
 * @registryType registry:util
 * @registryVersion 0.1.0
 */

/**
 * Focus manager for tracking and restoring focus
 */
export class FocusManager {
  private previouslyFocusedElement: HTMLElement | null = null;

  /**
   * Save currently focused element
   */
  saveFocus(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
  }

  /**
   * Restore previously focused element
   */
  restoreFocus(): void {
    if (this.previouslyFocusedElement && document.body.contains(this.previouslyFocusedElement)) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  /**
   * Clear saved focus
   */
  clearFocus(): void {
    this.previouslyFocusedElement = null;
  }
}

/**
 * Check if element is visible for focus purposes
 *
 * @param element - Element to check
 * @returns True if visible
 */
export function isElementVisible(element: HTMLElement): boolean {
  if (element.offsetWidth === 0 && element.offsetHeight === 0) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.visibility !== 'hidden' && style.display !== 'none';
}

/**
 * Move focus to element if visible
 *
 * @param element - Element to focus
 * @returns True if focus was moved
 */
export function moveFocusTo(element: HTMLElement): boolean {
  if (isElementVisible(element)) {
    element.focus();
    return document.activeElement === element;
  }
  return false;
}
