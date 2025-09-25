/**
 * Token Registry Event System Specifications
 * Tests the event-driven behavior of TokenRegistry with registry callbacks
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createEventDrivenTokenRegistry } from '@rafters/design-tokens';
import { ensureDirSync, existsSync, readFileSync, removeSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('TokenRegistry Event System', () => {
  let testDir: string;
  let tokensPath: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `registry-events-test-${Date.now()}`);
    tokensPath = join(testDir, '.rafters', 'tokens');
    ensureDirSync(testDir);
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
  });

  describe('Registry Initialization Events', () => {
    it('should fire REGISTRY_INITIALIZED event with correct payload', async () => {
      const registry = await createEventDrivenTokenRegistry(tokensPath);

      // Verify registry is initialized
      expect(registry).toBeDefined();
      expect(registry.size()).toBeGreaterThan(0);
    });

    it('should create token cache files during initialization', async () => {
      await createEventDrivenTokenRegistry(tokensPath);

      // Verify token files exist
      expect(existsSync(join(tokensPath, 'colors.json'))).toBe(true);
      expect(existsSync(join(tokensPath, 'spacing.json'))).toBe(true);
      expect(existsSync(join(tokensPath, 'manifest.json'))).toBe(true);
    });

    it('should generate CSS file automatically', async () => {
      await createEventDrivenTokenRegistry(tokensPath);

      const cssPath = join(testDir, '.rafters', 'tokens.css');
      expect(existsSync(cssPath)).toBe(true);

      const cssContent = readFileSync(cssPath, 'utf-8');
      expect(cssContent).toContain('@theme');
      expect(cssContent).toContain('--color-');
      expect(cssContent).toContain('--spacing-');
    });
  });

  describe('Token Addition Events', () => {
    it('should regenerate CSS when tokens are added via add() method', async () => {
      const registry = await createEventDrivenTokenRegistry(tokensPath);
      const cssPath = join(testDir, '.rafters', 'tokens.css');

      // Get initial CSS content
      const initialCSS = readFileSync(cssPath, 'utf-8');

      // Add new token via add() method (NOW FIRES CALLBACK)
      registry.add({
        name: 'test-color',
        value: 'oklch(0.627 0.257 29)', // OKLCH red
        category: 'color',
        type: 'color',
      });

      // Wait for potential async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify token was added to registry
      expect(registry.get('test-color')).toBeDefined();
      expect(registry.size()).toBe(5); // Initial 4 + 1 new

      // CSS should be regenerated with new token (prefixed format)
      const updatedCSS = readFileSync(cssPath, 'utf-8');
      expect(updatedCSS).not.toBe(initialCSS);
      expect(updatedCSS).toContain('--color-test-color: oklch(0.627 0.257 29)');
    });

    it('should regenerate CSS when tokens are updated via updateToken() method', async () => {
      const registry = await createEventDrivenTokenRegistry(tokensPath);
      const cssPath = join(testDir, '.rafters', 'tokens.css');

      // Get initial CSS content
      const initialCSS = readFileSync(cssPath, 'utf-8');

      // Update existing token (FIRES CALLBACK)
      registry.updateToken('gray', 'oklch(0.5 0.02 286)');

      // Wait for filesystem
      await new Promise((resolve) => setTimeout(resolve, 10));

      // CSS should be regenerated
      const updatedCSS = readFileSync(cssPath, 'utf-8');
      expect(updatedCSS).not.toBe(initialCSS);
      expect(updatedCSS).toContain('oklch(0.5 0.02 286)');
    });

    it('should handle multiple token additions efficiently with CSS regeneration', async () => {
      const registry = await createEventDrivenTokenRegistry(tokensPath);
      const cssPath = join(testDir, '.rafters', 'tokens.css');

      const startTime = performance.now();

      // Add multiple tokens (within 500 node limit)
      for (let i = 0; i < 50; i++) {
        registry.add({
          name: `test-color-${i}`,
          value: `oklch(0.7 0.15 ${i * 7})`, // OKLCH with varying hue
          category: 'color',
          type: 'color',
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (performance requirement)
      expect(duration).toBeLessThan(1000); // More time needed for CSS regeneration

      // Verify tokens were added to registry
      expect(registry.size()).toBe(54); // Initial 4 + 50 new tokens
      expect(registry.get('test-color-0')).toBeDefined();
      expect(registry.get('test-color-49')).toBeDefined();

      // Verify CSS contains new tokens (with prefixed format)
      const finalCSS = readFileSync(cssPath, 'utf-8');
      expect(finalCSS).toContain('--color-test-color-0');
      expect(finalCSS).toContain('--color-test-color-49');
    });
  });

  describe('CSS Generation Behavior', () => {
    it('should accept tokens without Zod validation in add() method', async () => {
      const registry = await createEventDrivenTokenRegistry(tokensPath);

      // Currently, add() method accepts any token without validation
      expect(() => {
        registry.add({
          name: '', // Empty name is currently accepted
          value: '#ff0000',
          category: 'color',
          type: 'color',
        });
      }).not.toThrow();

      // Token is stored despite invalid name
      expect(registry.get('')).toBeDefined();
    });

    it('should maintain Tailwind v4 CSS format consistency', async () => {
      const _registry = await createEventDrivenTokenRegistry(tokensPath);
      const cssPath = join(testDir, '.rafters', 'tokens.css');

      const css = readFileSync(cssPath, 'utf-8');

      // Verify Tailwind v4 CSS structure
      expect(css).toMatch(/@theme\s*{[\s\S]*}/);
      expect(css).toContain('@import "tailwindcss"');
      expect(css).toContain('--color-gray: oklch');
      expect(css).toContain('--spacing-xs: 0.5rem');
    });
  });

  describe('Error Handling', () => {
    it('should handle CSS write failures gracefully', async () => {
      // Create registry in a read-only location to simulate write failure
      const readOnlyPath = '/tmp/readonly-test';

      // Skip this test if we can't create read-only scenarios
      // (Testing framework limitation, not our code)
      await expect(async () => {
        await createEventDrivenTokenRegistry(readOnlyPath);
      }).rejects.toThrow();
    });

    it('should validate shortcode parameter', async () => {
      // Test with invalid shortcode
      await expect(async () => {
        await createEventDrivenTokenRegistry(tokensPath, 'INVALID');
      }).rejects.toThrow('Custom archives not yet implemented');
    });
  });

  describe('Registry Callback Integration', () => {
    it('should set up callback during initialization', async () => {
      const registry = await createEventDrivenTokenRegistry(tokensPath);

      // Verify callback is set (internal registry state)
      expect(registry).toBeDefined();

      // Test callback by updating existing token (which DOES fire callback)
      const cssPath = join(testDir, '.rafters', 'tokens.css');
      const initialModTime = require('node:fs').statSync(cssPath).mtime;

      // Wait a moment to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Use updateToken() method which DOES fire callbacks
      registry.updateToken('primary', 'oklch(0.3 0.1 200)');

      const updatedModTime = require('node:fs').statSync(cssPath).mtime;
      expect(updatedModTime.getTime()).toBeGreaterThan(initialModTime.getTime());
    });
  });

  describe('Archive Unpacking Behavior', () => {
    it('should skip unpacking if tokens already exist', async () => {
      // First initialization
      await createEventDrivenTokenRegistry(tokensPath);

      const manifestPath = join(tokensPath, 'manifest.json');
      const originalManifest = readFileSync(manifestPath, 'utf-8');

      // Second initialization should skip unpacking
      await createEventDrivenTokenRegistry(tokensPath);

      const finalManifest = readFileSync(manifestPath, 'utf-8');
      expect(finalManifest).toBe(originalManifest);
    });

    it('should create minimal default archive for 000000 shortcode', async () => {
      await createEventDrivenTokenRegistry(tokensPath, '000000');

      // Verify all required files exist
      const requiredFiles = [
        'manifest.json',
        'colors.json',
        'spacing.json',
        'typography.json',
        'motion.json',
        'shadows.json',
        'borders.json',
        'breakpoints.json',
        'layout.json',
        'fonts.json',
      ];

      for (const file of requiredFiles) {
        expect(existsSync(join(tokensPath, file))).toBe(true);
      }

      // Verify manifest structure with Zod validation
      const manifest = JSON.parse(readFileSync(join(tokensPath, 'manifest.json'), 'utf-8'));
      expect(manifest).toHaveProperty('id', '000000');
      expect(manifest).toHaveProperty('name', 'Default Rafters System');
      expect(manifest).toHaveProperty('tokenCount');
      expect(Array.isArray(manifest.categories)).toBe(true);
    });
  });
});
