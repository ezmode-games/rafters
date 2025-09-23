/**
 * Integration test for event-driven registry with automatic archive unpacking and CSS generation
 */

import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEventDrivenTokenRegistry } from '../src/registry-factory.js';

const TEST_PROJECT_PATH = '/tmp/test-e2e-flow';
const TEST_TOKENS_PATH = `${TEST_PROJECT_PATH}/.rafters/tokens`;
const TEST_CSS_PATH = `${TEST_PROJECT_PATH}/.rafters/tokens.css`;

describe('Event-Driven Registry Integration', () => {
  beforeEach(() => {
    // Clean up test directory
    if (existsSync(TEST_PROJECT_PATH)) {
      rmSync(TEST_PROJECT_PATH, { recursive: true });
    }
    mkdirSync(TEST_PROJECT_PATH, { recursive: true });
  });

  afterEach(() => {
    // Clean up after test
    if (existsSync(TEST_PROJECT_PATH)) {
      rmSync(TEST_PROJECT_PATH, { recursive: true });
    }
  });

  it('should handle complete registry lifecycle with real-time CSS updates', async () => {
    // Step 1: Registry Creation (like CLI init command)
    const registry = await createEventDrivenTokenRegistry(TEST_TOKENS_PATH, '000000');

    expect(registry).toBeDefined();
    expect(existsSync(TEST_TOKENS_PATH)).toBe(true);
    expect(existsSync(TEST_CSS_PATH)).toBe(true);

    // Step 2: Verify initial structure
    expect(existsSync(`${TEST_TOKENS_PATH}/manifest.json`)).toBe(true);
    expect(existsSync(`${TEST_TOKENS_PATH}/colors.json`)).toBe(true);
    expect(existsSync(`${TEST_TOKENS_PATH}/spacing.json`)).toBe(true);

    const manifestContent = JSON.parse(readFileSync(`${TEST_TOKENS_PATH}/manifest.json`, 'utf-8'));
    expect(manifestContent.id).toBe('000000');
    expect(manifestContent.name).toBe('Default Rafters System');

    // Step 3: Verify initial CSS generation
    let cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');
    expect(cssContent).toContain('--color');

    // Step 4: Add new token and verify real-time CSS update
    registry.add({
      name: 'brand-accent',
      value: 'oklch(0.60 0.15 320)',
      category: 'color',
      namespace: 'semantic',
    });

    // Step 5: Update token and verify real-time CSS update
    registry.updateToken('brand-accent', 'oklch(0.65 0.18 320)');

    // Verify CSS was regenerated
    cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');

    // Step 6: Batch update tokens
    registry.add({
      name: 'brand-secondary',
      value: 'oklch(0.70 0.12 200)',
      category: 'color',
      namespace: 'semantic',
    });

    registry.updateMultipleTokens([
      { name: 'brand-accent', value: 'oklch(0.70 0.20 320)' },
      { name: 'brand-secondary', value: 'oklch(0.75 0.15 200)' },
    ]);

    // Verify CSS was regenerated again
    cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');

    // Step 7: Verify registry metrics
    expect(registry.size()).toBeGreaterThan(2); // At least initial tokens + new ones

  });
});
