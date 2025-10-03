/**
 * Utilities barrel export
 * @registryType registry:util-index
 */

export {
  announceToScreenReader,
  focusFirst,
  generateAriaId,
  getFocusableElements,
  meetsTouchTargetSize,
  restoreFocus,
  trapFocus,
} from './accessibility';

export { FocusManager } from './focus';

export {
  getNextIndex,
  isActionKey,
  isNavigationKey,
  preventDefaultForActionKeys,
  updateRovingTabindex,
} from './keyboard';
