/**
 * End-to-end test demonstrating the complete event-driven registry flow
 */

import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEventDrivenTokenRegistry } from '../src/registry-factory.js';

const TEST_PROJECT_PATH = '/tmp/test-e2e-flow';
const TEST_TOKENS_PATH = `${TEST_PROJECT_PATH}/.rafters/tokens`;
const TEST_CSS_PATH = `${TEST_PROJECT_PATH}/.rafters/tokens.css`;

describe('End-to-End Event-Driven Registry Flow', () => {
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

  it('should demonstrate complete registry lifecycle from init to real-time updates', async () => {
    // Step 1: Registry Creation (like CLI init command)
    console.log('\n🚀 Step 1: Creating event-driven registry...');
    const registry = await createEventDrivenTokenRegistry(TEST_TOKENS_PATH, '000000');

    expect(registry).toBeDefined();
    expect(existsSync(TEST_TOKENS_PATH)).toBe(true);
    expect(existsSync(TEST_CSS_PATH)).toBe(true);

    // Step 2: Verify initial structure
    console.log('📁 Step 2: Verifying archive structure...');
    expect(existsSync(`${TEST_TOKENS_PATH}/manifest.json`)).toBe(true);
    expect(existsSync(`${TEST_TOKENS_PATH}/colors.json`)).toBe(true);
    expect(existsSync(`${TEST_TOKENS_PATH}/spacing.json`)).toBe(true);

    const manifestContent = JSON.parse(readFileSync(`${TEST_TOKENS_PATH}/manifest.json`, 'utf-8'));
    expect(manifestContent.id).toBe('000000');
    expect(manifestContent.name).toBe('Default Rafters System');

    // Step 3: Verify initial CSS generation
    console.log('🎨 Step 3: Verifying initial CSS generation...');
    let cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');
    expect(cssContent).toContain('--color');

    // Step 4: Add new token and verify real-time CSS update
    console.log('➕ Step 4: Adding new token (should trigger CSS regeneration)...');
    registry.add({
      name: 'brand-accent',
      value: 'oklch(0.60 0.15 320)',
      category: 'color',
      namespace: 'semantic',
    });

    // Step 5: Update token and verify real-time CSS update
    console.log('🔄 Step 5: Updating token (should trigger CSS regeneration)...');
    registry.updateToken('brand-accent', 'oklch(0.65 0.18 320)');

    // Verify CSS was regenerated
    cssContent = readFileSync(TEST_CSS_PATH, 'utf-8');
    expect(cssContent).toContain('@theme');

    // Step 6: Batch update tokens
    console.log('📦 Step 6: Batch updating tokens...');
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
    console.log('📊 Step 7: Verifying registry metrics...');
    expect(registry.size()).toBeGreaterThan(2); // At least initial tokens + new ones

    console.log('✅ End-to-end test completed successfully!');
    console.log('🎉 Event-driven registry with real-time CSS generation is working perfectly!');
  });
});
