/**
 * Test suite for generate command
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { generateAllTokens } from '@rafters/design-tokens';
import { ensureDirSync, existsSync, readFileSync, removeSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';

// Type definitions for mocked functions
type MockedGenerateAllTokens = MockedFunction<typeof generateAllTokens>;

import { generateTokens } from '../../src/commands/generate.js';
import {
  mixedTokenSet,
  multipleColorTokens,
  multipleSpacingTokens,
  simpleToken,
  uncategorizedToken,
} from '../fixtures/generate-tokens.js';

// Mock external dependencies
vi.mock('@rafters/design-tokens', () => ({
  generateAllTokens: vi.fn(),
  // Mock other exports to prevent import errors
  DesignSystemArchive: vi.fn(),
  fetchArchive: vi.fn(),
  createLocalCSSCallback: vi.fn(),
  exportTokensFromRegistry: vi.fn(),
  TokenRegistry: vi.fn(),
  createEventDrivenTokenRegistry: vi.fn(),
  exportToTailwindV4Complete: vi.fn(),
}));

describe('generate command', () => {
  let testDir: string;
  let originalCwd: string;
  let mockGenerateAllTokens: MockedGenerateAllTokens;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-generate-test-${Date.now()}`);
    ensureDirSync(testDir);
    process.chdir(testDir);

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Get mocked functions
    const { generateAllTokens } = await import('@rafters/design-tokens');
    mockGenerateAllTokens = vi.mocked(generateAllTokens);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
    vi.restoreAllMocks();
  });

  describe('token generation', () => {
    it('should generate tokens and write category files', async () => {
      mockGenerateAllTokens.mockResolvedValue(mixedTokenSet);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      // Check color category file
      const colorFile = join(outputDir, 'color.json');
      expect(existsSync(colorFile)).toBe(true);

      const colorContent = JSON.parse(readFileSync(colorFile, 'utf8'));
      expect(colorContent).toEqual({
        category: 'color',
        version: '0.1.1',
        generated: expect.any(String),
        tokens: [mixedTokenSet[0]],
        metadata: {
          count: 1,
          aiIntelligence: true,
          semanticTokens: true,
        },
      });

      // Check typography category file
      const typographyFile = join(outputDir, 'typography.json');
      expect(existsSync(typographyFile)).toBe(true);

      const typographyContent = JSON.parse(readFileSync(typographyFile, 'utf8'));
      expect(typographyContent.tokens).toEqual([mixedTokenSet[1]]);

      // Check spacing category file
      const spacingFile = join(outputDir, 'spacing.json');
      expect(existsSync(spacingFile)).toBe(true);

      const spacingContent = JSON.parse(readFileSync(spacingFile, 'utf8'));
      expect(spacingContent.tokens).toEqual([mixedTokenSet[2]]);
    });

    it('should write combined tokens file', async () => {
      mockGenerateAllTokens.mockResolvedValue([multipleColorTokens[0], multipleSpacingTokens[0]]);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const combinedFile = join(outputDir, 'tokens.json');
      expect(existsSync(combinedFile)).toBe(true);

      const combinedContent = JSON.parse(readFileSync(combinedFile, 'utf8'));
      expect(combinedContent).toEqual({
        version: '0.1.1',
        generated: expect.any(String),
        tokens: [multipleColorTokens[0], multipleSpacingTokens[0]],
        metadata: {
          totalTokens: 2,
          categories: ['color', 'spacing'],
          aiIntelligence: true,
          semanticTokens: true,
        },
      });
    });

    it('should generate TypeScript definitions', async () => {
      mockGenerateAllTokens.mockResolvedValue([multipleColorTokens[0], multipleSpacingTokens[1]]);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const typesFile = join(outputDir, 'tokens.d.ts');
      expect(existsSync(typesFile)).toBe(true);

      const typesContent = readFileSync(typesFile, 'utf8');
      expect(typesContent).toContain('export interface TokenMetadata');
      expect(typesContent).toContain('export interface TokenFile');
      expect(typesContent).toContain('export interface CombinedTokens');
      expect(typesContent).toContain("export type TokenCategory = 'color' | 'spacing'");
      expect(typesContent).toContain('declare const tokens: CombinedTokens');
    });

    it('should create output directory if it does not exist', async () => {
      mockGenerateAllTokens.mockResolvedValue([simpleToken]);

      const deepOutputDir = join(testDir, 'deep', 'nested', 'tokens');
      await generateTokens({ output: deepOutputDir });

      expect(existsSync(deepOutputDir)).toBe(true);
      expect(existsSync(join(deepOutputDir, 'misc.json'))).toBe(true);
    });
  });

  describe('token categorization', () => {
    it('should handle tokens without category', async () => {
      mockGenerateAllTokens.mockResolvedValue([uncategorizedToken]);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const miscFile = join(outputDir, 'misc.json');
      expect(existsSync(miscFile)).toBe(true);

      const miscContent = JSON.parse(readFileSync(miscFile, 'utf8'));
      expect(miscContent.category).toBe('misc');
      expect(miscContent.tokens).toHaveLength(1);
    });

    it('should group multiple tokens by category correctly', async () => {
      mockGenerateAllTokens.mockResolvedValue([...multipleColorTokens, ...multipleSpacingTokens]);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      // Check color file has 2 tokens
      const colorFile = join(outputDir, 'color.json');
      const colorContent = JSON.parse(readFileSync(colorFile, 'utf8'));
      expect(colorContent.tokens).toHaveLength(2);
      expect(colorContent.metadata.count).toBe(2);

      // Check spacing file has 3 tokens
      const spacingFile = join(outputDir, 'spacing.json');
      const spacingContent = JSON.parse(readFileSync(spacingFile, 'utf8'));
      expect(spacingContent.tokens).toHaveLength(3);
      expect(spacingContent.metadata.count).toBe(3);

      // Check combined file
      const combinedFile = join(outputDir, 'tokens.json');
      const combinedContent = JSON.parse(readFileSync(combinedFile, 'utf8'));
      expect(combinedContent.metadata.totalTokens).toBe(5);
      expect(combinedContent.metadata.categories).toEqual(['color', 'spacing']);
    });
  });

  describe('file content validation', () => {
    it('should include proper metadata in generated files', async () => {
      const mockTokens: Token[] = [
        {
          name: 'test-token',
          value: 'test-value',
          category: 'test',
          type: 'test',
          intelligence: {
            cognitiveLoad: 1,
            semanticMeaning: 'Test token',
          },
        },
      ];

      mockGenerateAllTokens.mockResolvedValue(mockTokens);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const testFile = join(outputDir, 'test.json');
      const testContent = JSON.parse(readFileSync(testFile, 'utf8'));

      expect(testContent).toHaveProperty('category', 'test');
      expect(testContent).toHaveProperty('version', '0.1.1');
      expect(testContent).toHaveProperty('generated');
      expect(testContent).toHaveProperty('tokens');
      expect(testContent).toHaveProperty('metadata');
      expect(testContent.metadata).toEqual({
        count: 1,
        aiIntelligence: true,
        semanticTokens: true,
      });

      // Validate ISO date format
      expect(new Date(testContent.generated).toISOString()).toBe(testContent.generated);
    });

    it('should preserve token intelligence metadata', async () => {
      const mockTokens: Token[] = [
        {
          name: 'primary-button',
          value: '#3b82f6',
          category: 'color',
          type: 'color',
          intelligence: {
            cognitiveLoad: 3,
            trustLevel: 'high',
            accessibility: {
              wcagLevel: 'AAA',
              contrastRatio: 8.5,
              screenReader: true,
            },
            semanticMeaning: 'Primary action color for main user goals',
          },
        },
      ];

      mockGenerateAllTokens.mockResolvedValue(mockTokens);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const colorFile = join(outputDir, 'color.json');
      const colorContent = JSON.parse(readFileSync(colorFile, 'utf8'));

      const token = colorContent.tokens[0];
      expect(token.intelligence).toEqual({
        cognitiveLoad: 3,
        trustLevel: 'high',
        accessibility: {
          wcagLevel: 'AAA',
          contrastRatio: 8.5,
          screenReader: true,
        },
        semanticMeaning: 'Primary action color for main user goals',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty token array', async () => {
      mockGenerateAllTokens.mockResolvedValue([]);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const combinedFile = join(outputDir, 'tokens.json');
      expect(existsSync(combinedFile)).toBe(true);

      const combinedContent = JSON.parse(readFileSync(combinedFile, 'utf8'));
      expect(combinedContent.tokens).toEqual([]);
      expect(combinedContent.metadata.totalTokens).toBe(0);
      expect(combinedContent.metadata.categories).toEqual([]);

      // Types file should still be generated
      const typesFile = join(outputDir, 'tokens.d.ts');
      expect(existsSync(typesFile)).toBe(true);

      const typesContent = readFileSync(typesFile, 'utf8');
      expect(typesContent).toContain('export type TokenCategory = never');
    });

    it('should handle single category with many tokens', async () => {
      const mockTokens: Token[] = Array.from({ length: 50 }, (_, i) => ({
        name: `color-${i}`,
        value: `#${i.toString(16).padStart(6, '0')}`,
        category: 'color',
        type: 'color',
        intelligence: {
          cognitiveLoad: Math.floor(i / 10) + 1,
          semanticMeaning: `Color variant ${i}`,
        },
      }));

      mockGenerateAllTokens.mockResolvedValue(mockTokens);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const colorFile = join(outputDir, 'color.json');
      const colorContent = JSON.parse(readFileSync(colorFile, 'utf8'));
      expect(colorContent.tokens).toHaveLength(50);
      expect(colorContent.metadata.count).toBe(50);

      const combinedFile = join(outputDir, 'tokens.json');
      const combinedContent = JSON.parse(readFileSync(combinedFile, 'utf8'));
      expect(combinedContent.metadata.totalTokens).toBe(50);
      expect(combinedContent.metadata.categories).toEqual(['color']);
    });

    it('should handle generation failure gracefully', async () => {
      mockGenerateAllTokens.mockRejectedValue(new Error('Token generation failed'));

      const outputDir = join(testDir, 'tokens');

      await expect(generateTokens({ output: outputDir })).rejects.toThrow(
        'Token generation failed'
      );
    });

    it('should handle file write errors', async () => {
      const mockTokens: Token[] = [{ name: 'test', value: 'test', category: 'test', type: 'test' }];

      mockGenerateAllTokens.mockResolvedValue(mockTokens);

      // Try to write to a read-only location (should fail)
      const invalidOutputDir = '/root/read-only-path';

      await expect(generateTokens({ output: invalidOutputDir })).rejects.toThrow();
    });
  });

  describe('TypeScript generation', () => {
    it('should generate correct type definitions for multiple categories', async () => {
      const mockTokens: Token[] = [
        { name: 'red', value: '#ff0000', category: 'color', type: 'color' },
        { name: 'large', value: '2rem', category: 'typography', type: 'fontSize' },
        { name: 'wide', value: '2rem', category: 'spacing', type: 'spacing' },
        {
          name: 'shadow',
          value: '0 2px 4px rgba(0,0,0,0.1)',
          category: 'elevation',
          type: 'boxShadow',
        },
      ];

      mockGenerateAllTokens.mockResolvedValue(mockTokens);

      const outputDir = join(testDir, 'tokens');
      await generateTokens({ output: outputDir });

      const typesFile = join(outputDir, 'tokens.d.ts');
      const typesContent = readFileSync(typesFile, 'utf8');

      expect(typesContent).toContain(
        "export type TokenCategory = 'color' | 'typography' | 'spacing' | 'elevation'"
      );
      expect(typesContent).toContain('Generated token type definitions');
      expect(typesContent).toContain('Auto-generated by Rafters CLI');
    });
  });
});
