/**
 * Playwright Component Testing Entry Point
 * This file is loaded by the index.html during component testing
 */

// Import utility functions and expose them globally for tests
import {
  focusFirst,
  getFocusableElements,
  meetsTouchTargetSize,
  trapFocus,
} from '../src/utils/accessibility';
import { isElementVisible, moveFocusTo } from '../src/utils/focus';

// Expose utilities on window for component tests to access
interface WindowWithTestUtils extends Window {
  meetsTouchTargetSize: typeof meetsTouchTargetSize;
  getFocusableElements: typeof getFocusableElements;
  trapFocus: typeof trapFocus;
  focusFirst: typeof focusFirst;
  isElementVisible: typeof isElementVisible;
  moveFocusTo: typeof moveFocusTo;
}

const testWindow = window as unknown as WindowWithTestUtils;
testWindow.meetsTouchTargetSize = meetsTouchTargetSize;
testWindow.getFocusableElements = getFocusableElements;
testWindow.trapFocus = trapFocus;
testWindow.focusFirst = focusFirst;
testWindow.isElementVisible = isElementVisible;
testWindow.moveFocusTo = moveFocusTo;

console.log('[Playwright CT] Component testing environment ready');
