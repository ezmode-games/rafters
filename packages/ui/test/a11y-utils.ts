/**
 * Shared utilities for Playwright accessibility tests
 */

import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/**
 * Best-practice rules to exclude for isolated component testing.
 * These rules check for page-level requirements that don't apply
 * when testing individual components.
 */
export const COMPONENT_EXCLUDED_RULES = [
  'page-has-heading-one', // Page should have h1
  'region', // Content should be in landmarks
  'landmark-one-main', // Page should have main landmark
  'landmark-unique', // Landmarks should be unique
  'bypass', // Page should have skip link
];

/**
 * Run axe accessibility analysis with component-appropriate settings
 */
export async function analyzeA11y(page: Page) {
  return new AxeBuilder({ page }).disableRules(COMPONENT_EXCLUDED_RULES).analyze();
}

/**
 * Assert no accessibility violations
 */
export function expectNoViolations(results: Awaited<ReturnType<typeof analyzeA11y>>) {
  if (results.violations.length > 0) {
    const violations = results.violations.map((v) => ({
      id: v.id,
      description: v.description,
      impact: v.impact,
      nodes: v.nodes.length,
    }));
    throw new Error(`Accessibility violations found:\n${JSON.stringify(violations, null, 2)}`);
  }
}
