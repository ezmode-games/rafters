/**
 * @rafters/chrome - Universal Rafters application shell
 *
 * Provides canvas-first chrome: thin icon rail, hover-reveal content panels,
 * and full-bleed workspace area. Wraps Studio, Editor, and all Rafters apps.
 *
 * Layout uses depth inversion: panels render BELOW the canvas in z-depth,
 * giving the workspace maximum visual prominence.
 */

export type {
  ChromeControls,
  ChromePanel,
  ChromeProps,
  ChromeRailItem,
} from './components/chrome.js';
export { Chrome } from './components/chrome.js';
