/**
 * Tests for generate command
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promises as fs } from 'node:fs';
import { generateTokens } from '../../src/commands/generate';
import * as designTokens from '@rafters/design-tokens';

vi.mock('node:fs', () => ({
  promises: {
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
}));

vi.mock('@rafters/design-tokens', () => ({
  generateAllTokens: vi.fn(),
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
    expect(fs.mkdir).toHaveBeenCalledWith('./test-tokens', { recursive: true });

    // Should write category files
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('color.json'),
      expect.stringContaining('"primary"')
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('spacing.json'),
      expect.stringContaining('"space-md"')
    );

    // Should write combined tokens file
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('tokens.json'),
      expect.stringContaining('"totalTokens": 2')
    );

    // Should write TypeScript definitions
    expect(fs.writeFile).toHaveBeenCalledWith(
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

    expect(fs.mkdir).toHaveBeenCalledWith('./empty-tokens', { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(
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
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('color.json'),
      expect.stringMatching(/"tokens":\s*\[\s*{[^}]*"name":\s*"red"/)
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('spacing.json'),
      expect.stringMatching(/"tokens":\s*\[\s*{[^}]*"name":\s*"sm"/)
    );
  });
});