/**
 * TDD Tests for DesignSystemArchive
 *
 * Tests the multi-file JSON archive system for design token persistence,
 * ensuring git-friendly collaboration and seamless default system loading.
 */

import { existsSync, rmSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Token } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignSystemArchive } from '../src/archive.js';
import { generateAllTokens } from '../src/generators/index.js';

describe('DesignSystemArchive', () => {
  let archive: DesignSystemArchive;
  let testDir: string;
  let tokens: Token[];

  beforeEach(async () => {
    // Create unique test directory
    testDir = join(process.cwd(), `test-archive-${Date.now()}`);
    await mkdir(testDir, { recursive: true });

    archive = new DesignSystemArchive(testDir);

    // Generate test tokens once
    if (!tokens) {
      tokens = await generateAllTokens();
    }
  }, 30000);

  afterEach(() => {
    // Cleanup test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Archive Structure', () => {
    it('should create complete multi-file archive structure', async () => {
      await archive.save(tokens, '000000');

      // Verify all required files exist
      const requiredFiles = [
        'manifest.json',
        'colors.json',
        'typography.json',
        'spacing.json',
        'motion.json',
        'shadows.json',
        'borders.json',
        'breakpoints.json',
        'layout.json',
        'fonts.json',
      ];

      for (const file of requiredFiles) {
        const filePath = join(testDir, '.rafters', 'tokens', file);
        expect(existsSync(filePath), `${file} should exist`).toBe(true);
      }
    });

    it('should save manifest with correct metadata', async () => {
      await archive.save(tokens, '000000');

      const manifest = await archive.getManifest();
      expect(manifest).toBeDefined();
      expect(manifest?.id).toBe('000000');
      expect(manifest?.name).toBe('Rafters Default Grayscale System');
      expect(manifest?.tokenCount).toBe(tokens.length);
      expect(manifest?.primaryColor).toEqual({ l: 0.44, c: 0.01, h: 286 });
      expect(manifest?.intelligence.contrastLevel).toBe('AAA');
      expect(manifest?.categories.length).toBeGreaterThan(10);
    });

    it('should organize colors into families and tokens', async () => {
      await archive.save(tokens, '000000');

      const colorsPath = join(testDir, '.rafters', 'tokens', 'colors.json');
      const colorsData = JSON.parse(await readFile(colorsPath, 'utf8'));

      expect(colorsData.families).toBeInstanceOf(Array);
      expect(colorsData.tokens).toBeInstanceOf(Array);
      expect(colorsData.dependencies).toBeInstanceOf(Object);

      // Should have color families and semantic tokens
      expect(colorsData.families.length).toBeGreaterThan(0);
      expect(colorsData.tokens.length).toBeGreaterThan(0);

      // Should have dependency tracking
      expect(colorsData.dependencies['primary-hover']).toBeDefined();
      expect(colorsData.dependencies.background).toBeDefined();
    });

    it('should organize typography with proper structure', async () => {
      await archive.save(tokens, '000000');

      const typographyPath = join(testDir, '.rafters', 'tokens', 'typography.json');
      const typographyData = JSON.parse(await readFile(typographyPath, 'utf8'));

      expect(typographyData.families).toBeDefined();
      expect(typographyData.families.heading).toBe('Inter, system-ui, sans-serif');
      expect(typographyData.scale).toBeInstanceOf(Object);
      expect(typographyData.fontWeight).toBeInstanceOf(Array);
      expect(typographyData.letterSpacing).toBeInstanceOf(Array);

      // Should have font sizes converted to scale
      expect(Object.keys(typographyData.scale).length).toBeGreaterThan(0);
    });

    it('should organize motion tokens by type', async () => {
      await archive.save(tokens, '000000');

      const motionPath = join(testDir, '.rafters', 'tokens', 'motion.json');
      const motionData = JSON.parse(await readFile(motionPath, 'utf8'));

      expect(motionData.duration).toBeInstanceOf(Array);
      expect(motionData.easing).toBeInstanceOf(Array);
      expect(motionData.animations).toBeInstanceOf(Array);
      expect(motionData.keyframes).toBeInstanceOf(Array);
      expect(motionData.behavior).toBeInstanceOf(Array);
    });

    it('should organize layout tokens by category', async () => {
      await archive.save(tokens, '000000');

      const layoutPath = join(testDir, '.rafters', 'tokens', 'layout.json');
      const layoutData = JSON.parse(await readFile(layoutPath, 'utf8'));

      // Should have layout categories
      expect(layoutData.width).toBeDefined();
      expect(layoutData.height).toBeDefined();
      expect(layoutData['touch-target']).toBeDefined();
      expect(layoutData.opacity).toBeDefined();

      // Each category should be an array of tokens
      Object.values(layoutData).forEach((categoryTokens) => {
        expect(Array.isArray(categoryTokens)).toBe(true);
      });
    });
  });

  describe('Load/Save Round-trip', () => {
    it('should preserve all tokens in round-trip save/load', async () => {
      // Save tokens
      await archive.save(tokens, '000000');

      // Load tokens back
      const loadedTokens = await archive.load();

      // Should have same number of tokens
      expect(loadedTokens.length).toBe(tokens.length);

      // Should preserve token structure
      const originalTokenNames = new Set(tokens.map((t) => t.name));
      const loadedTokenNames = new Set(loadedTokens.map((t) => t.name));

      expect(loadedTokenNames).toEqual(originalTokenNames);
    });

    it('should preserve token metadata and properties', async () => {
      await archive.save(tokens, '000000');
      const loadedTokens = await archive.load();

      // Find matching tokens and compare properties
      for (const originalToken of tokens.slice(0, 10)) {
        // Test first 10 tokens
        const loadedToken = loadedTokens.find((t) => t.name === originalToken.name);

        expect(loadedToken, `Token ${originalToken.name} should exist after loading`).toBeDefined();
        expect(loadedToken?.category).toBe(originalToken.category);
        expect(loadedToken?.namespace).toBe(originalToken.namespace);
        expect(loadedToken?.value).toEqual(originalToken.value);
      }
    });

    it('should handle empty token arrays gracefully', async () => {
      const emptyTokens: Token[] = [];

      await archive.save(emptyTokens, 'empty-test');
      const loadedTokens = await archive.load();

      expect(loadedTokens).toEqual([]);

      const manifest = await archive.getManifest();
      expect(manifest?.tokenCount).toBe(0);
    });
  });

  describe('Default System Initialization', () => {
    it('should initialize with default system when no archive exists', async () => {
      expect(await archive.exists()).toBe(false);

      const defaultTokens = await archive.initDefault();

      // Should have created archive
      expect(await archive.exists()).toBe(true);

      // Should have default system tokens
      expect(defaultTokens.length).toBeGreaterThanOrEqual(240);

      // Should have created manifest with default system ID
      const manifest = await archive.getManifest();
      expect(manifest?.id).toBe('000000');
      expect(manifest?.name).toBe('Rafters Default Grayscale System');
    }, 30000);

    it('should load existing archive when it exists', async () => {
      // First create an archive
      await archive.save(tokens, 'existing-system');

      // Modify the manifest to verify we're loading existing data
      const manifestPath = join(testDir, '.rafters', 'tokens', 'manifest.json');
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      manifest.name = 'Modified System Name';
      await import('node:fs/promises').then((fs) =>
        fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
      );

      // Initialize should load existing, not create new
      const loadedTokens = await archive.initDefault();

      expect(loadedTokens.length).toBe(tokens.length);

      const loadedManifest = await archive.getManifest();
      expect(loadedManifest?.name).toBe('Modified System Name');
    });
  });

  describe('Archive Management', () => {
    it('should check archive existence correctly', async () => {
      expect(await archive.exists()).toBe(false);

      await archive.save(tokens, '000000');

      expect(await archive.exists()).toBe(true);
    });

    it('should get manifest without loading all tokens', async () => {
      await archive.save(tokens, '000000');

      const manifest = await archive.getManifest();

      expect(manifest).toBeDefined();
      expect(manifest?.tokenCount).toBe(tokens.length);
      expect(manifest?.categories.length).toBeGreaterThan(0);
    });

    it('should return null manifest when archive does not exist', async () => {
      const manifest = await archive.getManifest();
      expect(manifest).toBeNull();
    });

    it('should throw error when loading non-existent archive', async () => {
      expect(await archive.exists()).toBe(false);

      await expect(archive.load()).rejects.toThrow('No archive found');
    });
  });

  describe('File Structure Validation', () => {
    it('should create files in correct .rafters/tokens/ structure', async () => {
      await archive.save(tokens, '000000');

      const archiveDir = join(testDir, '.rafters', 'tokens');
      expect(existsSync(archiveDir)).toBe(true);

      // Check directory structure
      const manifestPath = join(archiveDir, 'manifest.json');
      const colorsPath = join(archiveDir, 'colors.json');

      expect(existsSync(manifestPath)).toBe(true);
      expect(existsSync(colorsPath)).toBe(true);
    });

    it('should create valid JSON files', async () => {
      await archive.save(tokens, '000000');

      const archiveDir = join(testDir, '.rafters', 'tokens');
      const files = [
        'manifest.json',
        'colors.json',
        'typography.json',
        'spacing.json',
        'motion.json',
        'shadows.json',
        'borders.json',
        'breakpoints.json',
        'layout.json',
        'fonts.json',
      ];

      // Verify each file contains valid JSON
      for (const file of files) {
        const filePath = join(archiveDir, file);
        const content = await readFile(filePath, 'utf8');

        expect(() => JSON.parse(content), `${file} should contain valid JSON`).not.toThrow();

        const parsedContent = JSON.parse(content);
        expect(parsedContent, `${file} should not be empty`).toBeDefined();
      }
    });

    it('should handle different system IDs correctly', async () => {
      const customSystemId = 'custom-123';
      await archive.save(tokens, customSystemId);

      const manifest = await archive.getManifest();
      expect(manifest?.id).toBe(customSystemId);
      expect(manifest?.name).toBe(`Design System ${customSystemId}`);
    });
  });

  describe('Git-Friendly Workflow', () => {
    it('should enable selective file updates', async () => {
      await archive.save(tokens, '000000');

      // Get initial file modification times
      const archiveDir = join(testDir, '.rafters', 'tokens');
      const initialStats = await Promise.all([
        import('node:fs/promises').then((fs) => fs.stat(join(archiveDir, 'colors.json'))),
        import('node:fs/promises').then((fs) => fs.stat(join(archiveDir, 'spacing.json'))),
      ]);

      // Wait a moment to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Modify only spacing tokens
      const modifiedTokens = tokens.map((token) => {
        if (token.category === 'spacing' && token.name === '4') {
          return { ...token, value: '20px' }; // Change 1rem to 20px
        }
        return token;
      });

      // Save modified tokens
      await archive.save(modifiedTokens, '000000');

      // Check file modification times
      const newStats = await Promise.all([
        import('node:fs/promises').then((fs) => fs.stat(join(archiveDir, 'colors.json'))),
        import('node:fs/promises').then((fs) => fs.stat(join(archiveDir, 'spacing.json'))),
      ]);

      // Colors file should have same timestamp (unchanged)
      expect(newStats[0].mtime.getTime()).toBe(initialStats[0].mtime.getTime());

      // Spacing file should have new timestamp (changed)
      expect(newStats[1].mtime.getTime()).toBeGreaterThan(initialStats[1].mtime.getTime());
    });
  });
});
