/**
 * Test suite for validate command
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirSync, existsSync, removeSync, writeJsonSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateTokens } from '../../src/commands/validate.js';
import {
  invalidTokenFileStructure,
  lowContrastTokenFile,
  tokenFileWithHighIntelligenceCoverage,
  tokenFileWithInconsistentMetadata,
  tokenFileWithInvalidAccessibilityLevel,
  tokenFileWithInvalidCognitiveLoad,
  tokenFileWithInvalidToken,
  tokenFileWithInvalidTrustLevel,
  tokenFileWithLowIntelligenceCoverage,
  tokenFileWithModerateIntelligenceCoverage,
  tokenFileWithoutIntelligence,
  validColorTokenFile,
  validTypographyTokenFile,
} from '../fixtures/tokens.js';

describe('validate command', () => {
  let testDir: string;
  let originalCwd: string;
  let tokensDir: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-validate-test-${Date.now()}`);
    tokensDir = join(testDir, 'tokens');
    ensureDirSync(tokensDir);
    process.chdir(testDir);

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
    vi.restoreAllMocks();
  });

  describe('basic validation', () => {
    it('should validate well-formed token files', async () => {
      writeJsonSync(join(tokensDir, 'color.json'), validColorTokenFile);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required directories', async () => {
      const nonExistentDir = join(testDir, 'nonexistent');

      const result = await validateTokens({ path: nonExistentDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('No such file or directory'));
    });

    it('should handle path that is not a directory', async () => {
      const filePath = join(testDir, 'not-a-directory.txt');
      require('node:fs').writeFileSync(filePath, 'test content');

      const result = await validateTokens({ path: filePath });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(`Tokens path is not a directory: ${filePath}`);
    });

    it('should detect empty token directories', async () => {
      // tokensDir exists but is empty
      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No token files found in directory');
    });
  });

  describe('token file structure validation', () => {
    it('should detect invalid JSON files', async () => {
      require('node:fs').writeFileSync(join(tokensDir, 'invalid.json'), 'invalid json content');

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Failed to read/parse token file'));
    });

    it('should validate token file schema', async () => {
      writeJsonSync(join(tokensDir, 'invalid.json'), invalidTokenFileStructure);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Invalid token file structure'));
    });

    it('should validate individual token schemas', async () => {
      writeJsonSync(join(tokensDir, 'color.json'), tokenFileWithInvalidToken);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Invalid token at index 1'));
      expect(result.errors).toContain(expect.stringContaining('name: Required'));
    });

    it('should validate metadata consistency', async () => {
      writeJsonSync(join(tokensDir, 'spacing.json'), tokenFileWithInconsistentMetadata);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Token count mismatch'));
      expect(result.errors).toContain(expect.stringContaining('metadata says 1, actual 2'));
    });
  });

  describe('intelligence metadata validation', () => {
    it('should validate cognitive load ranges', async () => {
      writeJsonSync(join(tokensDir, 'typography.json'), tokenFileWithInvalidCognitiveLoad);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Invalid token at index 0'));
      expect(result.errors).toContain(expect.stringContaining('cognitiveLoad'));
    });

    it('should validate trust level enum values', async () => {
      writeJsonSync(join(tokensDir, 'color.json'), tokenFileWithInvalidTrustLevel);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Invalid token at index 0'));
    });

    it('should validate accessibility level enum values', async () => {
      writeJsonSync(join(tokensDir, 'color.json'), tokenFileWithInvalidAccessibilityLevel);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Invalid token at index 0'));
    });
  });

  describe('warning conditions', () => {
    it('should warn about missing AI intelligence metadata', async () => {
      writeJsonSync(join(tokensDir, 'spacing.json'), tokenFileWithoutIntelligence);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain("Token 'space-md' missing AI intelligence metadata");
    });

    it('should warn about missing recommended token categories', async () => {
      // Only provide typography, missing color and spacing
      writeJsonSync(join(tokensDir, 'typography.json'), validTypographyTokenFile);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Missing recommended token category: color');
      expect(result.warnings).toContain('Missing recommended token category: spacing');
    });

    it('should warn about low contrast ratios', async () => {
      writeJsonSync(join(tokensDir, 'color.json'), lowContrastTokenFile);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        "Color token 'low-contrast-color' has low contrast ratio: 3"
      );
    });
  });

  describe('intelligence coverage analysis', () => {
    it('should warn about low AI intelligence coverage', async () => {
      writeJsonSync(join(tokensDir, 'color.json'), tokenFileWithLowIntelligenceCoverage);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        expect.stringContaining('Low AI intelligence coverage: 25.0% (1/4)')
      );
    });

    it('should warn about moderate AI intelligence coverage', async () => {
      writeJsonSync(join(tokensDir, 'spacing.json'), tokenFileWithModerateIntelligenceCoverage);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        expect.stringContaining('Moderate AI intelligence coverage: 60.0%')
      );
      expect(result.warnings).toContain(
        expect.stringContaining('consider adding more intelligence metadata')
      );
    });

    it('should not warn about high AI intelligence coverage', async () => {
      writeJsonSync(join(tokensDir, 'color.json'), tokenFileWithHighIntelligenceCoverage);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.warnings.filter((w) => w.includes('intelligence coverage'))).toHaveLength(0);
    });
  });

  describe('multiple token files', () => {
    it('should validate multiple token files successfully', async () => {
      const colorFile = {
        category: 'color',
        version: '1.0.0',
        generated: new Date().toISOString(),
        tokens: [
          {
            name: 'primary',
            value: '#3b82f6',
            category: 'color',
            type: 'color',
            intelligence: { cognitiveLoad: 2 },
          },
        ],
        metadata: { count: 1, aiIntelligence: true, semanticTokens: true },
      };

      const spacingFile = {
        category: 'spacing',
        version: '1.0.0',
        generated: new Date().toISOString(),
        tokens: [
          {
            name: 'md',
            value: '1rem',
            category: 'spacing',
            type: 'spacing',
            intelligence: { cognitiveLoad: 1 },
          },
        ],
        metadata: { count: 1, aiIntelligence: true, semanticTokens: true },
      };

      const typographyFile = {
        category: 'typography',
        version: '1.0.0',
        generated: new Date().toISOString(),
        tokens: [
          {
            name: 'base',
            value: '1rem',
            category: 'typography',
            type: 'fontSize',
            intelligence: { cognitiveLoad: 1 },
          },
        ],
        metadata: { count: 1, aiIntelligence: true, semanticTokens: true },
      };

      writeJsonSync(join(tokensDir, 'color.json'), colorFile);
      writeJsonSync(join(tokensDir, 'spacing.json'), spacingFile);
      writeJsonSync(join(tokensDir, 'typography.json'), typographyFile);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      // Should not warn about missing categories since all are present
      expect(
        result.warnings.filter((w) => w.includes('Missing recommended token category'))
      ).toHaveLength(0);
    });

    it('should handle mixed valid and invalid files', async () => {
      const validFile = {
        category: 'color',
        version: '1.0.0',
        generated: new Date().toISOString(),
        tokens: [{ name: 'primary', value: '#3b82f6', category: 'color', type: 'color' }],
        metadata: { count: 1, aiIntelligence: true, semanticTokens: true },
      };

      const invalidFile = {
        // Missing required fields
        tokens: [],
      };

      writeJsonSync(join(tokensDir, 'valid.json'), validFile);
      writeJsonSync(join(tokensDir, 'invalid.json'), invalidFile);

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('Invalid token file structure'));
    });
  });

  describe('edge cases', () => {
    it('should handle non-JSON files in token directory', async () => {
      const validFile = {
        category: 'color',
        version: '1.0.0',
        generated: new Date().toISOString(),
        tokens: [{ name: 'primary', value: '#3b82f6', category: 'color', type: 'color' }],
        metadata: { count: 1, aiIntelligence: true, semanticTokens: true },
      };

      writeJsonSync(join(tokensDir, 'color.json'), validFile);
      require('node:fs').writeFileSync(join(tokensDir, 'readme.txt'), 'This is not a JSON file');
      require('node:fs').writeFileSync(join(tokensDir, 'config.yaml'), 'yaml: content');

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(true);
      // Should ignore non-JSON files and only validate JSON files
    });

    it('should handle validation errors gracefully', async () => {
      // Create a scenario that would cause an error during validation
      const validFile = {
        category: 'color',
        version: '1.0.0',
        generated: new Date().toISOString(),
        tokens: [{ name: 'primary', value: '#3b82f6', category: 'color', type: 'color' }],
        metadata: { count: 1, aiIntelligence: true, semanticTokens: true },
      };

      writeJsonSync(join(tokensDir, 'color.json'), validFile);

      // Mock readFile to throw an error for one specific call
      const readFileMock = vi.fn();
      readFileMock.mockImplementation((path: string) => {
        if (path.includes('color.json')) {
          return Promise.reject(new Error('Mocked read error'));
        }
        return Promise.resolve('{}');
      });
      vi.doMock('node:fs', () => ({
        promises: {
          readFile: readFileMock,
        },
      }));

      const result = await validateTokens({ path: tokensDir });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        expect.stringContaining('Validation error: Mocked read error')
      );
    });
  });
});
