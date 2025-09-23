/**
 * Test the CSS generation callback functionality
 */

import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEventDrivenTokenRegistry } from '../src/registry-factory.js';

const TEST_PROJECT_PATH = '/tmp/test-css-generation';
const TEST_TOKENS_PATH = `${TEST_PROJECT_PATH}/.rafters/tokens`;
const TEST_CSS_PATH = `${TEST_PROJECT_PATH}/.rafters/tokens.css`;

describe('CSS Generation Callback', () => {
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

  it('should generate CSS file on registry initialization', async () => {
    const _registry = await createEventDrivenTokenRegistry(TEST_TOKENS_PATH, '000000');

    // Verify CSS file was created
    expect(existsSync(TEST_CSS_PATH)).toBe(true);

    // Verify CSS content contains expected tokens
    const cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');
    expect(cssContent).toContain('--color');
  });

  it('should regenerate CSS when tokens are updated', async () => {
    const registry = await createEventDrivenTokenRegistry(TEST_TOKENS_PATH, '000000');

    // Update a token
    registry.updateToken('primary', 'oklch(0.50 0.15 240)');

    // Verify CSS was regenerated (file should still exist and have updated content)
    expect(existsSync(TEST_CSS_PATH)).toBe(true);

    const cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');
  });

  it('should handle multiple token updates in batch', async () => {
    const registry = await createEventDrivenTokenRegistry(TEST_TOKENS_PATH, '000000');

    // Add another token first
    registry.add({
      name: 'secondary',
      value: 'oklch(0.60 0.10 120)',
      category: 'color',
      namespace: 'semantic',
    });

    // Update multiple tokens
    registry.updateMultipleTokens([
      { name: 'primary', value: 'oklch(0.50 0.15 240)' },
      { name: 'secondary', value: 'oklch(0.65 0.12 120)' },
    ]);

    // Verify CSS was regenerated
    expect(existsSync(TEST_CSS_PATH)).toBe(true);

    const cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');
  });
});
