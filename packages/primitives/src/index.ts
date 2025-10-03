/**
 * Rafters Primitives - 100% Headless Web Components
 *
 * @registryPackage @rafters/primitives
 * @registryVersion 0.1.0
 * @registryType registry:package
 *
 * @description Framework-agnostic Web Components with WCAG AAA compliance
 * @accessibility Full ARIA support, Section 508 compliant
 * @dependencies lit (peer)
 */

// Base classes and types
export { RPrimitiveBase } from './base/RPrimitiveBase';
export type {
  AnnouncementOptions,
  AriaLive,
  AriaRole,
  NavigationKey,
  PrimitiveEventDetail,
  Result,
  ValidationState,
} from './base/types';
// Primitives
export { RButton } from './primitives/button/r-button';
// Utilities
export {
  focusFirst,
  generateAriaId,
  getFocusableElements,
  meetsTouchTargetSize,
  restoreFocus,
  trapFocus,
} from './utils/accessibility';
export { FocusManager, isElementVisible, moveFocusTo } from './utils/focus';
export {
  getNextIndex,
  isActionKey,
  isNavigationKey,
  preventDefaultForActionKeys,
  updateRovingTabindex,
} from './utils/keyboard';
