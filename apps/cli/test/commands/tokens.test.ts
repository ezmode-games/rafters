import { existsSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import functions to test
import {
  calculateCognitiveLoad,
  getColorIntelligence,
  getToken,
  getTokensByCategory,
  getTokensByTrustLevel,
  tokensCommand,
  validateColorCombination,
} from '../../src/commands/tokens.js';

// Mock all external dependencies
vi.mock('fs');
vi.mock('path');
vi.mock('chalk', () => ({
  default: {
    red: vi.fn((text) => text),
    green: vi.fn((text) => text),
    cyan: vi.fn((text) => text),
    yellow: vi.fn((text) => text),
    gray: vi.fn((text) => text),
  },
}));

// Create mock token registry
const mockTokenRegistry = {
  get: vi.fn(),
  list: vi.fn(),
};

// Mock the design-tokens module
vi.mock('@rafters/design-tokens', () => ({
  createTokenRegistry: vi.fn(() => mockTokenRegistry),
}));

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  error: vi.fn(),
};

// Mock process.exit to throw instead
const mockProcessExit = vi.fn((code) => {
  throw new Error(`process.exit(${code})`);
});

describe('Token Commands', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(join).mockReturnValue('/mock/.rafters/tokens');
    vi.spyOn(process, 'cwd').mockReturnValue('/mock');
    vi.spyOn(console, 'log').mockImplementation(mockConsole.log);
    vi.spyOn(console, 'error').mockImplementation(mockConsole.error);
    vi.spyOn(process, 'exit').mockImplementation(mockProcessExit);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getToken', () => {
    it('should return token when found', () => {
      const mockToken = {
        name: 'primary',
        value: 'oklch(0.45 0.12 240)',
        category: 'color',
        semanticMeaning: 'Primary brand color',
        cognitiveLoad: 3,
        trustLevel: 'high',
      };

      mockTokenRegistry.get.mockReturnValue(mockToken);

      const result = getToken('primary');

      expect(result).toEqual(mockToken);
      expect(mockTokenRegistry.get).toHaveBeenCalledWith('primary');
    });

    it('should return undefined when token not found', () => {
      mockTokenRegistry.get.mockReturnValue(undefined);

      const result = getToken('nonexistent');

      expect(result).toBeUndefined();
      expect(mockTokenRegistry.get).toHaveBeenCalledWith('nonexistent');
    });

    it('should throw error when .rafters directory does not exist', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      expect(() => getToken('primary')).toThrow('process.exit(1)');
      expect(mockConsole.error).toHaveBeenCalledWith(
        '✗ No .rafters/tokens directory found. Run "rafters init" first.'
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('getTokensByCategory', () => {
    it('should filter tokens by category', () => {
      const mockTokens = [
        { name: 'primary', category: 'color', trustLevel: 'high' },
        { name: 'lg', category: 'spacing', trustLevel: 'low' },
        { name: 'success', category: 'color', trustLevel: 'low' },
      ];

      mockTokenRegistry.list.mockReturnValue(mockTokens);

      const result = getTokensByCategory('color');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('primary');
      expect(result[1].name).toBe('success');
    });

    it('should return empty array when category has no tokens', () => {
      const mockTokens = [{ name: 'primary', category: 'color', trustLevel: 'high' }];

      mockTokenRegistry.list.mockReturnValue(mockTokens);

      const result = getTokensByCategory('nonexistent');

      expect(result).toHaveLength(0);
    });

    it('should handle empty token registry', () => {
      mockTokenRegistry.list.mockReturnValue([]);

      const result = getTokensByCategory('color');

      expect(result).toHaveLength(0);
    });
  });

  describe('getTokensByTrustLevel', () => {
    it('should filter tokens by trust level', () => {
      const mockTokens = [
        { name: 'primary', category: 'color', trustLevel: 'high' },
        { name: 'success', category: 'color', trustLevel: 'low' },
        { name: 'destructive', category: 'color', trustLevel: 'critical' },
        { name: 'secondary', category: 'color', trustLevel: 'high' },
      ];

      mockTokenRegistry.list.mockReturnValue(mockTokens);

      const result = getTokensByTrustLevel('high');

      expect(result).toHaveLength(2);
      expect(result.map((t) => t.name)).toEqual(['primary', 'secondary']);
    });

    it('should return empty array for non-existent trust level', () => {
      const mockTokens = [{ name: 'primary', category: 'color', trustLevel: 'high' }];

      mockTokenRegistry.list.mockReturnValue(mockTokens);

      const result = getTokensByTrustLevel('nonexistent');

      expect(result).toHaveLength(0);
    });
  });

  describe('getColorIntelligence', () => {
    it('should return color intelligence for ColorValue object', () => {
      const mockColorToken = {
        name: 'primary',
        category: 'color',
        value: {
          name: 'primary',
          scale: [
            { l: 0.3, c: 0.12, h: 240 },
            { l: 0.45, c: 0.12, h: 240 },
          ],
          states: { hover: 'oklch(0.4 0.12 240)', focus: 'oklch(0.35 0.12 240)' },
          use: 'Primary actions and brand elements',
          intelligence: {
            reasoning: 'Blue creates trust and reliability',
            emotionalImpact: 'Calming, trustworthy',
          },
          harmonies: { complementary: ['orange'] },
          accessibility: { contrast: { white: 4.5 } },
          analysis: { saturation: 'moderate', warmth: 'cool' },
        },
        semanticMeaning: 'Primary brand color',
      };

      mockTokenRegistry.get.mockReturnValue(mockColorToken);

      const result = getColorIntelligence('primary');

      expect(result).toBeTruthy();
      expect(result?.token).toEqual(mockColorToken);
      expect(result?.intelligence).toEqual({
        reasoning: 'Blue creates trust and reliability',
        emotionalImpact: 'Calming, trustworthy',
      });
      expect(result?.scale).toHaveLength(2);
      expect(result?.states).toEqual({
        hover: 'oklch(0.4 0.12 240)',
        focus: 'oklch(0.35 0.12 240)',
      });
      expect(result?.harmonies).toEqual({ complementary: ['orange'] });
      expect(result?.accessibility).toEqual({ contrast: { white: 4.5 } });
      expect(result?.analysis).toEqual({ saturation: 'moderate', warmth: 'cool' });
    });

    it('should handle string value tokens with fallbacks', () => {
      const mockColorToken = {
        name: 'basic-color',
        category: 'color',
        value: 'oklch(0.5 0.1 120)',
        semanticMeaning: 'Basic color token',
      };

      mockTokenRegistry.get.mockReturnValue(mockColorToken);

      const result = getColorIntelligence('basic-color');

      expect(result).toBeTruthy();
      expect(result?.token).toEqual(mockColorToken);
      expect(result?.scale).toEqual([]);
      expect(result?.states).toEqual({});
      expect(result?.use).toBe('Basic color token');
      expect(result?.intelligence).toBeNull();
    });

    it('should return null for non-color token', () => {
      const mockSpacingToken = {
        name: 'lg',
        category: 'spacing',
        value: '16px',
      };

      mockTokenRegistry.get.mockReturnValue(mockSpacingToken);

      const result = getColorIntelligence('lg');

      expect(result).toBeNull();
    });

    it('should return null when token not found', () => {
      mockTokenRegistry.get.mockReturnValue(undefined);

      const result = getColorIntelligence('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('calculateCognitiveLoad', () => {
    it('should sum cognitive load of tokens', () => {
      const mockTokens = [
        { name: 'primary', cognitiveLoad: 3 },
        { name: 'success', cognitiveLoad: 2 },
        { name: 'warning', cognitiveLoad: 4 },
      ];

      mockTokenRegistry.get
        .mockReturnValueOnce(mockTokens[0])
        .mockReturnValueOnce(mockTokens[1])
        .mockReturnValueOnce(mockTokens[2]);

      const result = calculateCognitiveLoad(['primary', 'success', 'warning']);

      expect(result).toBe(9);
    });

    it('should handle missing tokens gracefully', () => {
      mockTokenRegistry.get
        .mockReturnValueOnce({ name: 'primary', cognitiveLoad: 3 })
        .mockReturnValueOnce(undefined) // missing token
        .mockReturnValueOnce({ name: 'warning', cognitiveLoad: 4 });

      const result = calculateCognitiveLoad(['primary', 'missing', 'warning']);

      expect(result).toBe(7);
    });

    it('should handle tokens without cognitiveLoad property', () => {
      mockTokenRegistry.get
        .mockReturnValueOnce({ name: 'primary', cognitiveLoad: 3 })
        .mockReturnValueOnce({ name: 'nocognitive' }) // no cognitiveLoad
        .mockReturnValueOnce({ name: 'warning', cognitiveLoad: 4 });

      const result = calculateCognitiveLoad(['primary', 'nocognitive', 'warning']);

      expect(result).toBe(7);
    });

    it('should handle empty token list', () => {
      const result = calculateCognitiveLoad([]);

      expect(result).toBe(0);
    });
  });

  describe('validateColorCombination', () => {
    it('should validate color combination within limits', () => {
      const mockTokens = [
        { name: 'primary', category: 'color', cognitiveLoad: 3, trustLevel: 'high' },
        { name: 'success', category: 'color', cognitiveLoad: 2, trustLevel: 'low' },
      ];

      // Mock both calls for getToken (color filtering) and calculateCognitiveLoad
      mockTokenRegistry.get
        .mockReturnValueOnce(mockTokens[0]) // First call for primary (color filtering)
        .mockReturnValueOnce(mockTokens[1]) // Second call for success (color filtering)
        .mockReturnValueOnce(mockTokens[0]) // Third call for primary (cognitive load)
        .mockReturnValueOnce(mockTokens[1]); // Fourth call for success (cognitive load)

      const result = validateColorCombination(['primary', 'success']);

      expect(result.valid).toBe(true);
      expect(result.totalCognitiveLoad).toBe(5);
      expect(result.trustLevels.high).toBe(1);
      expect(result.trustLevels.low).toBe(1);
      expect(result.trustLevels.medium).toBe(0);
      expect(result.trustLevels.critical).toBe(0);
      expect(result.warnings).toHaveLength(0);
      expect(result.recommendation).toBe('Color combination is well-balanced');
    });

    it('should warn about high cognitive load', () => {
      const mockTokens = [
        { name: 'primary', category: 'color', cognitiveLoad: 8, trustLevel: 'high' },
        { name: 'destructive', category: 'color', cognitiveLoad: 9, trustLevel: 'critical' },
      ];

      mockTokenRegistry.get
        .mockReturnValueOnce(mockTokens[0]) // getToken for primary (color filtering)
        .mockReturnValueOnce(mockTokens[1]) // getToken for destructive (color filtering)
        .mockReturnValueOnce(mockTokens[0]) // getToken for primary (cognitive load)
        .mockReturnValueOnce(mockTokens[1]); // getToken for destructive (cognitive load)

      const result = validateColorCombination(['primary', 'destructive']);

      expect(result.valid).toBe(false);
      expect(result.totalCognitiveLoad).toBe(17);
      expect(result.warnings).toContain('High cognitive load (17/15) - may overwhelm users');
      expect(result.recommendation).toBe('Consider simplifying or reorganizing color hierarchy');
    });

    it('should warn about multiple critical trust levels', () => {
      const mockTokens = [
        { name: 'destructive1', category: 'color', cognitiveLoad: 3, trustLevel: 'critical' },
        { name: 'destructive2', category: 'color', cognitiveLoad: 3, trustLevel: 'critical' },
      ];

      mockTokenRegistry.get.mockReturnValueOnce(mockTokens[0]).mockReturnValueOnce(mockTokens[1]);

      const result = validateColorCombination(['destructive1', 'destructive2']);

      expect(result.valid).toBe(false);
      expect(result.warnings).toContain(
        'Multiple critical trust levels (2) - avoid competing for attention'
      );
    });

    it('should warn about many high trust elements', () => {
      const mockTokens = [
        { name: 'high1', category: 'color', cognitiveLoad: 2, trustLevel: 'high' },
        { name: 'high2', category: 'color', cognitiveLoad: 2, trustLevel: 'high' },
        { name: 'high3', category: 'color', cognitiveLoad: 2, trustLevel: 'high' },
      ];

      mockTokenRegistry.get
        .mockReturnValueOnce(mockTokens[0])
        .mockReturnValueOnce(mockTokens[1])
        .mockReturnValueOnce(mockTokens[2]);

      const result = validateColorCombination(['high1', 'high2', 'high3']);

      expect(result.valid).toBe(false);
      expect(result.warnings).toContain('Many high trust elements (3) - consider hierarchy');
    });

    it('should handle non-color tokens in the mix', () => {
      const mockTokens = [
        { name: 'primary', category: 'color', cognitiveLoad: 3, trustLevel: 'high' },
        { name: 'spacing', category: 'spacing', cognitiveLoad: 1, trustLevel: 'low' },
      ];

      mockTokenRegistry.get.mockReturnValueOnce(mockTokens[0]).mockReturnValueOnce(mockTokens[1]);

      const result = validateColorCombination(['primary', 'spacing']);

      // Should only consider color tokens for trust level analysis
      expect(result.trustLevels.high).toBe(1);
      expect(result.trustLevels.low).toBe(0); // spacing token filtered out
    });

    it('should handle empty color list', () => {
      const result = validateColorCombination([]);

      expect(result.valid).toBe(true);
      expect(result.totalCognitiveLoad).toBe(0);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('tokensCommand', () => {
    describe('get action', () => {
      it('should display token information', async () => {
        const mockToken = {
          name: 'primary',
          category: 'color',
          value: 'oklch(0.45 0.12 240)',
          semanticMeaning: 'Primary brand color',
          cognitiveLoad: 3,
          trustLevel: 'high',
        };

        mockTokenRegistry.get.mockReturnValue(mockToken);

        await tokensCommand('get', ['primary'], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Token:', 'primary');
        expect(mockConsole.log).toHaveBeenCalledWith('Category:', 'color');
        expect(mockConsole.log).toHaveBeenCalledWith('Value:', 'oklch(0.45 0.12 240)');
        expect(mockConsole.log).toHaveBeenCalledWith('Semantic:', 'Primary brand color');
        expect(mockConsole.log).toHaveBeenCalledWith('Cognitive Load:', 3);
        expect(mockConsole.log).toHaveBeenCalledWith('Trust Level:', 'high');
      });

      it('should display ColorValue object as [ColorValue object]', async () => {
        const mockToken = {
          name: 'primary',
          category: 'color',
          value: {
            name: 'primary',
            scale: [{ l: 0.45, c: 0.12, h: 240 }],
          },
          semanticMeaning: 'Primary brand color',
          cognitiveLoad: 3,
          trustLevel: 'high',
        };

        mockTokenRegistry.get.mockReturnValue(mockToken);

        await tokensCommand('get', ['primary'], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Value:', 'ColorValue object');
      });

      it('should show JSON output when --json flag provided', async () => {
        const mockToken = {
          name: 'primary',
          category: 'color',
          value: 'oklch(0.45 0.12 240)',
        };

        mockTokenRegistry.get.mockReturnValue(mockToken);

        await tokensCommand('get', ['primary'], { json: true });

        expect(mockConsole.log).toHaveBeenCalledWith(`\n${JSON.stringify(mockToken, null, 2)}`);
      });

      it('should error when token name not provided', async () => {
        await expect(async () => {
          await tokensCommand('get', [], {});
        }).rejects.toThrow('process.exit(1)');

        expect(mockConsole.error).toHaveBeenCalledWith('✗ Token name required');
      });

      it('should error when token not found', async () => {
        mockTokenRegistry.get.mockReturnValue(undefined);

        await expect(async () => {
          await tokensCommand('get', ['nonexistent'], {});
        }).rejects.toThrow('process.exit(1)');

        expect(mockConsole.error).toHaveBeenCalledWith('✗ Token "nonexistent" not found');
      });
    });

    describe('list action', () => {
      it('should list all tokens grouped by category', async () => {
        const mockTokens = [
          { name: 'primary', category: 'color', value: 'oklch(0.45 0.12 240)' },
          { name: 'lg', category: 'spacing', value: '16px' },
        ];

        mockTokenRegistry.list.mockReturnValue(mockTokens);

        await tokensCommand('list', [], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Tokens:');
        expect(mockConsole.log).toHaveBeenCalledWith('\ncolor (1):');
        expect(mockConsole.log).toHaveBeenCalledWith('  primary: oklch(0.45 0.12 240)');
        expect(mockConsole.log).toHaveBeenCalledWith('\nspacing (1):');
        expect(mockConsole.log).toHaveBeenCalledWith('  lg: 16px');
        expect(mockConsole.log).toHaveBeenCalledWith('\nTotal: 2 tokens');
      });

      it('should filter by category when provided', async () => {
        const allTokens = [
          { name: 'primary', category: 'color', value: 'oklch(0.45 0.12 240)' },
          { name: 'lg', category: 'spacing', value: '16px' },
        ];

        mockTokenRegistry.list.mockReturnValue(allTokens);

        await tokensCommand('list', ['color'], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Tokens in color:');
        expect(mockConsole.log).toHaveBeenCalledWith('\ncolor (1):');
        expect(mockConsole.log).toHaveBeenCalledWith('  primary: oklch(0.45 0.12 240)');
        expect(mockConsole.log).toHaveBeenCalledWith('\nTotal: 1 tokens');
      });

      it('should handle ColorValue objects in list', async () => {
        const mockTokens = [
          {
            name: 'primary',
            category: 'color',
            value: { name: 'primary', scale: [] },
          },
        ];

        mockTokenRegistry.list.mockReturnValue(mockTokens);

        await tokensCommand('list', [], {});

        expect(mockConsole.log).toHaveBeenCalledWith('  primary: [ColorValue]');
      });

      it('should handle empty token registry', async () => {
        mockTokenRegistry.list.mockReturnValue([]);

        await tokensCommand('list', [], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Tokens:');
        expect(mockConsole.log).toHaveBeenCalledWith('\nTotal: 0 tokens');
      });
    });

    describe('color action', () => {
      it('should display color intelligence', async () => {
        const mockToken = {
          name: 'primary',
          category: 'color',
          value: {
            name: 'primary',
            scale: [{ l: 0.45, c: 0.12, h: 240 }],
            states: { hover: 'oklch(0.4 0.12 240)' },
            use: 'Primary actions',
            intelligence: {
              reasoning: 'Blue creates trust',
              emotionalImpact: 'Calming',
            },
          },
        };

        mockTokenRegistry.get.mockReturnValue(mockToken);

        await tokensCommand('color', ['primary'], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Color Intelligence:', 'primary');
        expect(mockConsole.log).toHaveBeenCalledWith('Use:', 'Primary actions');
        expect(mockConsole.log).toHaveBeenCalledWith('Scale positions:', 1);
        expect(mockConsole.log).toHaveBeenCalledWith('States:', 'hover');
        expect(mockConsole.log).toHaveBeenCalledWith('\nAI Intelligence:');
        expect(mockConsole.log).toHaveBeenCalledWith('Reasoning:', 'Blue creates trust');
        expect(mockConsole.log).toHaveBeenCalledWith('Emotional:', 'Calming');
      });

      it('should show JSON output when --json flag provided', async () => {
        const mockToken = {
          name: 'primary',
          category: 'color',
          value: { name: 'primary', scale: [], states: {} },
        };

        mockTokenRegistry.get.mockReturnValue(mockToken);

        await tokensCommand('color', ['primary'], { json: true });

        // Check that JSON output was logged (should be the last call)
        const logCalls = mockConsole.log.mock.calls;
        const jsonCall = logCalls.find((call) => call[0].startsWith('\n{'));
        expect(jsonCall).toBeDefined();

        // Parse and verify the JSON structure
        const jsonOutput = JSON.parse(jsonCall[0].substring(1)); // Remove leading \n
        expect(jsonOutput.token).toEqual(mockToken);
        expect(jsonOutput.scale).toEqual([]);
        expect(jsonOutput.states).toEqual({});
      });

      it('should error when color token name not provided', async () => {
        await expect(async () => {
          await tokensCommand('color', [], {});
        }).rejects.toThrow('process.exit(1)');

        expect(mockConsole.error).toHaveBeenCalledWith('✗ Color token name required');
      });

      it('should error when color token not found', async () => {
        mockTokenRegistry.get.mockReturnValue(undefined);

        await expect(async () => {
          await tokensCommand('color', ['nonexistent'], {});
        }).rejects.toThrow('process.exit(1)');

        expect(mockConsole.error).toHaveBeenCalledWith('✗ Color token "nonexistent" not found');
      });

      it('should handle no states gracefully', async () => {
        const mockToken = {
          name: 'primary',
          category: 'color',
          value: {
            name: 'primary',
            scale: [],
            states: {},
            use: 'Primary actions',
          },
        };

        mockTokenRegistry.get.mockReturnValue(mockToken);

        await tokensCommand('color', ['primary'], {});

        expect(mockConsole.log).toHaveBeenCalledWith('States:', 'none');
      });
    });

    describe('validate action', () => {
      it('should validate color combination', async () => {
        const mockTokens = [
          { name: 'primary', category: 'color', cognitiveLoad: 3, trustLevel: 'high' },
          { name: 'success', category: 'color', cognitiveLoad: 2, trustLevel: 'low' },
        ];

        // Mock calls for both validateColorCombination (color filtering + cognitive load calculation)
        mockTokenRegistry.get
          .mockReturnValueOnce(mockTokens[0]) // getToken for primary (color filtering)
          .mockReturnValueOnce(mockTokens[1]) // getToken for success (color filtering)
          .mockReturnValueOnce(mockTokens[0]) // getToken for primary (cognitive load)
          .mockReturnValueOnce(mockTokens[1]); // getToken for success (cognitive load)

        await tokensCommand('validate', ['primary', 'success'], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Color Validation:');
        expect(mockConsole.log).toHaveBeenCalledWith('Colors:', 'primary, success');
        expect(mockConsole.log).toHaveBeenCalledWith('Valid:', '✓ Yes');
        expect(mockConsole.log).toHaveBeenCalledWith('Cognitive Load:', '5/15');
        expect(mockConsole.log).toHaveBeenCalledWith('\nRecommendation:');
        expect(mockConsole.log).toHaveBeenCalledWith('Color combination is well-balanced');
      });

      it('should show validation warnings', async () => {
        const mockTokens = [
          { name: 'primary', category: 'color', cognitiveLoad: 10, trustLevel: 'critical' },
          { name: 'destructive', category: 'color', cognitiveLoad: 8, trustLevel: 'critical' },
        ];

        // Mock calls for both validateColorCombination (color filtering + cognitive load calculation)
        mockTokenRegistry.get
          .mockReturnValueOnce(mockTokens[0]) // getToken for primary (color filtering)
          .mockReturnValueOnce(mockTokens[1]) // getToken for destructive (color filtering)
          .mockReturnValueOnce(mockTokens[0]) // getToken for primary (cognitive load)
          .mockReturnValueOnce(mockTokens[1]); // getToken for destructive (cognitive load)

        await tokensCommand('validate', ['primary', 'destructive'], {});

        expect(mockConsole.log).toHaveBeenCalledWith('Valid:', '✗ No');
        expect(mockConsole.log).toHaveBeenCalledWith('\nWarnings:');
        expect(mockConsole.log).toHaveBeenCalledWith(
          '  - High cognitive load (18/15) - may overwhelm users'
        );
        expect(mockConsole.log).toHaveBeenCalledWith(
          '  - Multiple critical trust levels (2) - avoid competing for attention'
        );
      });

      it('should error when no colors provided', async () => {
        await expect(async () => {
          await tokensCommand('validate', [], {});
        }).rejects.toThrow('process.exit(1)');

        expect(mockConsole.error).toHaveBeenCalledWith('✗ At least one color required');
      });
    });

    describe('unknown action', () => {
      it('should error for unknown action', async () => {
        await expect(async () => {
          await tokensCommand('unknown', [], {});
        }).rejects.toThrow('process.exit(1)');

        expect(mockConsole.error).toHaveBeenCalledWith('✗ Unknown action: unknown');
        expect(mockConsole.log).toHaveBeenCalledWith(
          'Available actions: get, list, color, validate'
        );
      });
    });
  });
});
