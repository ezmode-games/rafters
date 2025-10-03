/**
 * Type declarations for Playwright component test utilities
 * These are exposed globally via playwright/index.ts
 */

import type {
  focusFirst,
  getFocusableElements,
  meetsTouchTargetSize,
  trapFocus,
} from '../src/utils/accessibility';
import type { isElementVisible, moveFocusTo } from '../src/utils/focus';

declare global {
  interface Window {
    meetsTouchTargetSize: typeof meetsTouchTargetSize;
    getFocusableElements: typeof getFocusableElements;
    trapFocus: typeof trapFocus;
    focusFirst: typeof focusFirst;
    isElementVisible: typeof isElementVisible;
    moveFocusTo: typeof moveFocusTo;
  }
}

export {};
