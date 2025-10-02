/**
 * Core types for Rafters primitives
 *
 * @registryType registry:primitive-types
 * @registryVersion 0.1.0
 */

/**
 * ARIA roles for primitives
 */
export type AriaRole =
  | 'button'
  | 'checkbox'
  | 'combobox'
  | 'dialog'
  | 'grid'
  | 'gridcell'
  | 'listbox'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'option'
  | 'radio'
  | 'radiogroup'
  | 'slider'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'tabpanel'
  | 'textbox'
  | 'tooltip'
  | 'tree'
  | 'treeitem';

/**
 * ARIA live region politeness
 */
export type AriaLive = 'off' | 'polite' | 'assertive';

/**
 * Keyboard event keys for navigation
 */
export type NavigationKey =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'Enter'
  | 'Space'
  | 'Escape'
  | 'Tab';

/**
 * Validation state for form primitives
 */
export type ValidationState = 'valid' | 'error' | 'warning';

/**
 * Result type for error handling
 */
export type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E };

/**
 * Primitive event detail
 */
export interface PrimitiveEventDetail<T = unknown> {
  value: T;
  timestamp: number;
}

/**
 * Accessibility announcement options
 */
export interface AnnouncementOptions {
  politeness?: AriaLive;
  timeout?: number;
}
