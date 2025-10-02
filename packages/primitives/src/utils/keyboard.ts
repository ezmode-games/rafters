/**
 * Keyboard navigation utilities
 *
 * @registryType registry:util
 * @registryVersion 0.1.0
 */

import type { NavigationKey } from '../base/types';

/**
 * Check if key is a navigation key
 *
 * @param key - Key name from KeyboardEvent
 * @returns True if navigation key
 */
export function isNavigationKey(key: string): key is NavigationKey {
  const navigationKeys: NavigationKey[] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    'Enter',
    'Space',
    'Escape',
    'Tab',
  ];
  return navigationKeys.includes(key as NavigationKey);
}

/**
 * Check if key should trigger action (Enter or Space)
 *
 * @param event - Keyboard event
 * @returns True if action key
 */
export function isActionKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

/**
 * Get next/previous index with wrapping
 *
 * @param currentIndex - Current index
 * @param length - Array length
 * @param direction - Direction (1 for next, -1 for previous)
 * @returns Next index
 */
export function getNextIndex(currentIndex: number, length: number, direction: 1 | -1): number {
  const nextIndex = currentIndex + direction;

  if (nextIndex < 0) {
    return length - 1;
  }

  if (nextIndex >= length) {
    return 0;
  }

  return nextIndex;
}

/**
 * Handle roving tabindex for keyboard navigation
 * Updates tabindex attributes for a collection of elements
 *
 * @param elements - Collection of elements
 * @param activeIndex - Index of active element
 */
export function updateRovingTabindex(elements: HTMLElement[], activeIndex: number): void {
  elements.forEach((element, index) => {
    element.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
  });
}

/**
 * Prevent default for action keys
 *
 * @param event - Keyboard event
 */
export function preventDefaultForActionKeys(event: KeyboardEvent): void {
  if (isActionKey(event)) {
    event.preventDefault();
  }
}
