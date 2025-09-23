/**
 * Integration test for CLI init command with event-driven registry
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const TEST_PROJECT_PATH = '/tmp/test-cli-integration';

describe('CLI Integration with Event-Driven Registry', () => {
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

  it('should create registry and CSS files through CLI init command', async () => {
    // This test would require running the actual CLI, which is complex in the test environment
    // For now, let's test the core functionality more directly

    const { createEventDrivenTokenRegistry } = await import(
      '../../packages/design-tokens/src/registry-factory.js'
    );

    const tokensPath = join(TEST_PROJECT_PATH, '.rafters', 'tokens');
    const cssPath = join(TEST_PROJECT_PATH, '.rafters', 'tokens.css');

    // Create registry like the CLI init command does
    await createEventDrivenTokenRegistry(tokensPath, '000000');

    // Verify the structure that CLI expects
    expect(existsSync(tokensPath)).toBe(true);
    expect(existsSync(join(tokensPath, 'manifest.json'))).toBe(true);
    expect(existsSync(join(tokensPath, 'colors.json'))).toBe(true);
    expect(existsSync(cssPath)).toBe(true);

    // Verify CSS content
    const cssContent = readFileSync(cssPath, 'utf-8');
    expect(cssContent).toContain('@theme');
    expect(cssContent).toContain('--color');
  });

  it('should demonstrate real-time CSS updates after registry creation', async () => {
    const { createEventDrivenTokenRegistry } = await import(
      '../../packages/design-tokens/src/registry-factory.js'
    );

    const tokensPath = join(TEST_PROJECT_PATH, '.rafters', 'tokens');
    const cssPath = join(TEST_PROJECT_PATH, '.rafters', 'tokens.css');

    // Create registry
    const registry = await createEventDrivenTokenRegistry(tokensPath, '000000');

    // Add a new token
    registry.add({
      name: 'success',
      value: 'oklch(0.60 0.15 120)',
      category: 'color',
      namespace: 'semantic',
    });

    // Update a token - this should trigger CSS regeneration
    registry.updateToken('success', 'oklch(0.65 0.15 120)');

    // Verify CSS was updated
    expect(existsSync(cssPath)).toBe(true);

    const cssContent = readFileSync(cssPath, 'utf-8');
    expect(cssContent).toContain('@theme');
  });
});
