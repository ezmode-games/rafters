/**
 * Tests for validate command
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promises as fs } from 'node:fs';
import { validateTokens } from '../../src/commands/validate';

vi.mock('node:fs', () => ({
  promises: {
    readFile: vi.fn(),
    readdir: vi.fn(),
    stat: vi.fn(),
  },
}));

describe('validateTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate valid token files successfully', async () => {
    vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => true } as any);
    vi.mocked(fs.readdir).mockResolvedValue(['color.json', 'spacing.json']);

    const validTokenFile = {
      category: 'color',
      version: '0.1.1',
      generated: '2024-01-01T00:00:00.000Z',
      tokens: [
        {
          name: 'primary',
          value: '#007bff',
          category: 'color',
          type: 'color',
          intelligence: {
            cognitiveLoad: 2,
            trustLevel: 'medium',
            accessibility: {
              wcagLevel: 'AA',
              contrastRatio: 7.2,
              screenReader: true,
            },
            semanticMeaning: 'Primary brand color',
          },
        },
      ],
      metadata: {
        count: 1,
        aiIntelligence: true,
        semanticTokens: true,
      },
    };

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(validTokenFile));

    const result = await validateTokens({ path: './tokens' });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect invalid token file structure', async () => {
    vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => true } as any);
    vi.mocked(fs.readdir).mockResolvedValue(['invalid.json']);

    const invalidTokenFile = {
      // Missing required fields
      tokens: [],
    };

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(invalidTokenFile));

    const result = await validateTokens({ path: './tokens' });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Invalid token file structure');
  });

  it('should warn about missing AI intelligence metadata', async () => {
    vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => true } as any);
    vi.mocked(fs.readdir).mockResolvedValue(['color.json']);

    const tokenFileWithoutIntelligence = {
      category: 'color',
      version: '0.1.1',
      generated: '2024-01-01T00:00:00.000Z',
      tokens: [
        {
          name: 'primary',
          value: '#007bff',
          category: 'color',
          type: 'color',
          // No intelligence metadata
        },
      ],
      metadata: {
        count: 1,
        aiIntelligence: true,
        semanticTokens: true,
      },
    };

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(tokenFileWithoutIntelligence));

    const result = await validateTokens({ path: './tokens' });

    expect(result.valid).toBe(true);
    expect(result.warnings).toContain("Token 'primary' missing AI intelligence metadata");
  });

  it('should warn about low contrast ratios', async () => {
    vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => true } as any);
    vi.mocked(fs.readdir).mockResolvedValue(['color.json']);

    const tokenFileWithLowContrast = {
      category: 'color',
      version: '0.1.1',
      generated: '2024-01-01T00:00:00.000Z',
      tokens: [
        {
          name: 'low-contrast',
          value: '#cccccc',
          category: 'color',
          type: 'color',
          intelligence: {
            accessibility: {
              contrastRatio: 2.1, // Below 4.5 threshold
            },
          },
        },
      ],
      metadata: {
        count: 1,
        aiIntelligence: true,
        semanticTokens: true,
      },
    };

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(tokenFileWithLowContrast));

    const result = await validateTokens({ path: './tokens' });

    expect(result.valid).toBe(true);
    expect(result.warnings.some(w => w.includes('low contrast ratio'))).toBe(true);
  });

  it('should handle directory not found', async () => {
    vi.mocked(fs.stat).mockRejectedValue(new Error('ENOENT: no such file or directory'));

    const result = await validateTokens({ path: './nonexistent' });

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Validation error');
  });

  it('should handle empty token directory', async () => {
    vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => true } as any);
    vi.mocked(fs.readdir).mockResolvedValue([]);

    const result = await validateTokens({ path: './empty' });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('No token files found in directory');
  });
});