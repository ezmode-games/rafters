/**
 * Accessibility testing utilities for Rafters primitives
 * WCAG AAA compliance validation with axe-core and Playwright
 *
 * @registryType registry:test-util
 * @registryVersion 0.1.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { createHtmlReport } from 'axe-html-reporter';

/**
 * WCAG conformance levels
 */
export type WCAGLevel = 'A' | 'AA' | 'AAA';

/**
 * Touch target size requirements for WCAG 2.5.5
 */
export const WCAG_TOUCH_TARGET = {
  AAA: 44,
  AA: 24,
  MINIMUM: 44, // Rafters enforces AAA
} as const;

/**
 * Contrast ratio requirements for WCAG 1.4.3 and 1.4.6
 */
export const WCAG_CONTRAST = {
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
} as const;

/**
 * Axe-core scan options for different WCAG levels
 */
export interface AxeScanOptions {
  level: WCAGLevel;
  tags?: string[];
  rules?: Record<string, { enabled: boolean }>;
}

/**
 * Accessibility test result
 */
export interface A11yTestResult {
  passed: boolean;
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    nodes: Array<{
      html: string;
      target: string[];
      failureSummary: string;
    }>;
  }>;
  timestamp: string;
}

/**
 * Run axe-core accessibility scan on page
 *
 * @param page - Playwright page instance
 * @param options - Scan configuration options
 * @returns Test result with violations
 */
export async function runAxeScan(
  page: Page,
  options: AxeScanOptions = { level: 'AAA' }
): Promise<A11yTestResult> {
  const builder = new AxeBuilder({ page });

  // Configure tags based on WCAG level
  const tags = options.tags ?? [
    `wcag2${options.level.toLowerCase()}`,
    `wcag21${options.level.toLowerCase()}`,
  ];

  builder.withTags(tags);

  // Apply custom rules if provided
  if (options.rules) {
    for (const [ruleId, config] of Object.entries(options.rules)) {
      if (config.enabled) {
        builder.disableRules([ruleId]);
      }
    }
  }

  const results = await builder.analyze();

  return {
    passed: results.violations.length === 0,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact ?? 'unknown',
      description: v.description,
      nodes: v.nodes.map((n) => ({
        html: n.html,
        target: n.target,
        failureSummary: n.failureSummary ?? 'No summary available',
      })),
    })),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate HTML report for accessibility test results
 *
 * @param results - Test results from runAxeScan
 * @param outputPath - File path for HTML report
 */
export async function generateA11yReport(
  results: A11yTestResult,
  outputPath: string
): Promise<void> {
  const reportDir = path.dirname(outputPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const htmlReport = createHtmlReport({
    results: {
      violations: results.violations,
      passes: [],
      incomplete: [],
      inapplicable: [],
    },
    options: {
      projectKey: 'rafters-primitives',
      outputDir: reportDir,
      reportFileName: path.basename(outputPath),
    },
  });

  fs.writeFileSync(outputPath, htmlReport);
}

/**
 * Verify element has correct ARIA role
 *
 * @param locator - Playwright locator for element
 * @param expectedRole - Expected ARIA role
 */
export async function verifyAriaRole(locator: Locator, expectedRole: string): Promise<void> {
  await expect(locator).toHaveAttribute('role', expectedRole);
}

/**
 * Verify element has ARIA label
 *
 * @param locator - Playwright locator for element
 */
export async function verifyAriaLabel(locator: Locator): Promise<void> {
  const ariaLabel = await locator.getAttribute('aria-label');
  const ariaLabelledBy = await locator.getAttribute('aria-labelledby');

  expect(ariaLabel || ariaLabelledBy).toBeTruthy();
}

/**
 * Verify element meets minimum touch target size
 *
 * @param locator - Playwright locator for element
 * @param level - WCAG conformance level (defaults to AAA)
 */
export async function verifyTouchTargetSize(
  locator: Locator,
  level: WCAGLevel = 'AAA'
): Promise<void> {
  const box = await locator.boundingBox();
  expect(box).toBeTruthy();

  const minSize = WCAG_TOUCH_TARGET[level];
  expect(box?.width).toBeGreaterThanOrEqual(minSize);
  expect(box?.height).toBeGreaterThanOrEqual(minSize);
}

/**
 * Verify element is keyboard accessible
 *
 * @param page - Playwright page instance
 * @param locator - Playwright locator for element
 * @param key - Key to press (e.g., 'Enter', 'Space')
 */
export async function verifyKeyboardAccessible(
  page: Page,
  locator: Locator,
  key: string
): Promise<void> {
  await locator.focus();
  await expect(locator).toBeFocused();

  const wasFocused = await locator.evaluate((el) => document.activeElement === el);
  expect(wasFocused).toBe(true);

  await page.keyboard.press(key);
}

/**
 * Verify element has visible focus indicator
 *
 * @param locator - Playwright locator for element
 */
export async function verifyFocusIndicator(locator: Locator): Promise<void> {
  await locator.focus();

  const outlineWidth = await locator.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.outlineWidth;
  });

  expect(outlineWidth).not.toBe('0px');
}

/**
 * Verify disabled element is not focusable
 *
 * @param locator - Playwright locator for element
 */
export async function verifyDisabledNotFocusable(locator: Locator): Promise<void> {
  await expect(locator).toHaveAttribute('disabled');

  const isFocusable = await locator.evaluate((el) => {
    if (el instanceof HTMLElement) {
      el.focus();
      return document.activeElement === el;
    }
    return false;
  });

  expect(isFocusable).toBe(false);
}

/**
 * Verify element has proper validation state
 *
 * @param locator - Playwright locator for element
 * @param isInvalid - Whether element should be in invalid state
 */
export async function verifyValidationState(locator: Locator, isInvalid: boolean): Promise<void> {
  if (isInvalid) {
    await expect(locator).toHaveAttribute('aria-invalid', 'true');

    const hasErrorMessage =
      (await locator.getAttribute('aria-errormessage')) ||
      (await locator.getAttribute('aria-describedby'));

    expect(hasErrorMessage).toBeTruthy();
  } else {
    const ariaInvalid = await locator.getAttribute('aria-invalid');
    expect(ariaInvalid).not.toBe('true');
  }
}

/**
 * Complete accessibility test suite for a primitive
 *
 * @param page - Playwright page instance
 * @param locator - Playwright locator for element
 * @param config - Test configuration
 */
export interface PrimitiveA11yConfig {
  role: string;
  level: WCAGLevel;
  requiresLabel?: boolean;
  keyboardKeys?: string[];
  supportsDisabled?: boolean;
}

export async function testPrimitiveAccessibility(
  page: Page,
  locator: Locator,
  config: PrimitiveA11yConfig
): Promise<A11yTestResult> {
  // Run axe-core scan
  const scanResult = await runAxeScan(page, { level: config.level });

  // Verify ARIA role
  await verifyAriaRole(locator, config.role);

  // Verify ARIA label if required
  if (config.requiresLabel) {
    await verifyAriaLabel(locator);
  }

  // Verify touch target size
  await verifyTouchTargetSize(locator, config.level);

  // Verify keyboard accessibility
  if (config.keyboardKeys && config.keyboardKeys.length > 0) {
    for (const key of config.keyboardKeys) {
      await verifyKeyboardAccessible(page, locator, key);
    }
  }

  // Verify focus indicator
  await verifyFocusIndicator(locator);

  // Verify disabled state if supported
  if (config.supportsDisabled) {
    // Test will need to handle this separately based on primitive behavior
  }

  return scanResult;
}

/**
 * Test shadow DOM accessibility
 *
 * @param page - Playwright page instance
 * @param selector - CSS selector for host element
 */
export async function testShadowDOMAccessibility(page: Page, selector: string): Promise<void> {
  const shadowHost = page.locator(selector);

  // Verify shadow root exists
  const hasShadowRoot = await shadowHost.evaluate((el) => !!el.shadowRoot);
  expect(hasShadowRoot).toBe(true);

  // Run axe scan on shadow DOM content
  const result = await runAxeScan(page, { level: 'AAA' });
  expect(result.passed).toBe(true);
}

/**
 * Comprehensive accessibility test report
 */
export interface ComprehensiveA11yReport {
  primitive: string;
  timestamp: string;
  wcagLevel: WCAGLevel;
  tests: {
    axeScan: A11yTestResult;
    ariaCompliance: boolean;
    keyboardNavigation: boolean;
    touchTargets: boolean;
    focusManagement: boolean;
  };
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    successRate: string;
  };
}

/**
 * Generate comprehensive accessibility report for primitive
 *
 * @param primitive - Primitive name (e.g., 'r-button')
 * @param page - Playwright page instance
 * @param locator - Playwright locator for element
 * @param config - Test configuration
 * @returns Comprehensive test report
 */
export async function generateComprehensiveReport(
  primitive: string,
  page: Page,
  locator: Locator,
  config: PrimitiveA11yConfig
): Promise<ComprehensiveA11yReport> {
  const tests = {
    axeScan: await runAxeScan(page, { level: config.level }),
    ariaCompliance: false,
    keyboardNavigation: false,
    touchTargets: false,
    focusManagement: false,
  };

  // Test ARIA compliance
  try {
    await verifyAriaRole(locator, config.role);
    if (config.requiresLabel) {
      await verifyAriaLabel(locator);
    }
    tests.ariaCompliance = true;
  } catch {
    tests.ariaCompliance = false;
  }

  // Test keyboard navigation
  try {
    if (config.keyboardKeys && config.keyboardKeys.length > 0) {
      for (const key of config.keyboardKeys) {
        await verifyKeyboardAccessible(page, locator, key);
      }
    }
    tests.keyboardNavigation = true;
  } catch {
    tests.keyboardNavigation = false;
  }

  // Test touch targets
  try {
    await verifyTouchTargetSize(locator, config.level);
    tests.touchTargets = true;
  } catch {
    tests.touchTargets = false;
  }

  // Test focus management
  try {
    await verifyFocusIndicator(locator);
    tests.focusManagement = true;
  } catch {
    tests.focusManagement = false;
  }

  const totalTests = 5;
  const passed = [
    tests.axeScan.passed,
    tests.ariaCompliance,
    tests.keyboardNavigation,
    tests.touchTargets,
    tests.focusManagement,
  ].filter(Boolean).length;

  return {
    primitive,
    timestamp: new Date().toISOString(),
    wcagLevel: config.level,
    tests,
    summary: {
      totalTests,
      passed,
      failed: totalTests - passed,
      successRate: `${((passed / totalTests) * 100).toFixed(1)}%`,
    },
  };
}
