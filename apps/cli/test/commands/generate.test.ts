/**
 * Tests for generate command
 * Uses vi.mock() for external dependencies (file system, external packages)
 * This is appropriate for command-level testing where we want to avoid side effects
 */

import { mkdir, writeFile } from 'node:fs/promises';
import * as designTokens from '@rafters/design-tokens';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateTokens } from '../../src/commands/generate';

// Mock the specific fs functions used in the command
// Using vi.mock() here is appropriate because:
// 1. We're testing command-level functionality
// 2. We want to prevent actual file system operations
// 3. The command depends heavily on these external operations
vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

// Mock external package to avoid complex token generation in tests
// This ensures tests focus on the command logic, not token generation details
vi.mock('@rafters/design-tokens', () => ({
  generateAllTokens: vi.fn().mockResolvedValue([]),
}));

describe('generateTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate tokens and write files', async () => {
    const mockTokens = [
      {
        name: 'primary',
        value: '#007bff',
        category: 'color',
        type: 'color',
        intelligence: {
          cognitiveLoad: 2,
          trustLevel: 'medium' as const,
          semanticMeaning: 'Primary brand color for main actions',
        },
      },
      {
        name: 'space-md',
        value: '16px',
        category: 'spacing',
        type: 'spacing',
        intelligence: {
          cognitiveLoad: 1,
          semanticMeaning: 'Medium spacing for component padding',
        },
      },
    ];

    vi.mocked(designTokens.generateAllTokens).mockResolvedValue(mockTokens);

    await generateTokens({
      output: './test-tokens',
      config: './test-config.js',
    });

    // Should create output directory
    expect(mkdir).toHaveBeenCalledWith('./test-tokens', { recursive: true });

    // Should write category files
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('color.json'),
      expect.stringContaining('"primary"')
    );

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('spacing.json'),
      expect.stringContaining('"space-md"')
    );

    // Should write combined tokens file
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('tokens.json'),
      expect.stringContaining('"totalTokens": 2')
    );

    // Should write TypeScript definitions
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('tokens.d.ts'),
      expect.stringContaining('export type TokenCategory')
    );
  });

  it('should handle empty token arrays', async () => {
    vi.mocked(designTokens.generateAllTokens).mockResolvedValue([]);

    await generateTokens({
      output: './empty-tokens',
      config: './test-config.js',
    });

    expect(mkdir).toHaveBeenCalledWith('./empty-tokens', { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('tokens.json'),
      expect.stringContaining('"totalTokens": 0')
    );
  });

  it('should group tokens by category correctly', async () => {
    const mockTokens = [
      { name: 'red', category: 'color', type: 'color', value: '#ff0000' },
      { name: 'blue', category: 'color', type: 'color', value: '#0000ff' },
      { name: 'sm', category: 'spacing', type: 'spacing', value: '8px' },
    ];

    vi.mocked(designTokens.generateAllTokens).mockResolvedValue(mockTokens);

    await generateTokens({
      output: './grouped-tokens',
      config: './test-config.js',
    });

    // Should write separate files for each category
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('color.json'),
      expect.stringMatching(/"tokens":\s*\[\s*{[^}]*"name":\s*"red"/)
    );

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('spacing.json'),
      expect.stringMatching(/"tokens":\s*\[\s*{[^}]*"name":\s*"sm"/)
    );
  });
});
