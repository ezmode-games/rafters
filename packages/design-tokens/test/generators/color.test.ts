/**
 * Color Generator v2 Tests
 *
 * Tests the schema-driven color generator that uses ColorValue intelligence
 * and color-utils functions instead of hardcoded procedures.
 */

import type { ColorValue } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateColorTokens } from '../../src/generators/color';

// Mock the color-utils functions
vi.mock('@rafters/shared', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    calculateDarkModeReference: vi.fn(() => ({ family: 'mock-family', position: '300' })),
    calculateForegroundReference: vi.fn(() => ({ family: 'neutral', position: '900' })),
    generateColorStates: vi.fn(() => ({
      hover: { family: 'mock-family', position: '700' },
      active: { family: 'mock-family', position: '800' },
      focus: { family: 'mock-family', position: '600' },
      disabled: { family: 'neutral', position: '400' },
    })),
    selectSemanticColorFromSuggestions: vi.fn((_colorValue, _type) => ({ l: 0.5, c: 0.1, h: 0 })),
    extractCognitiveLoad: vi.fn(() => 3),
    extractTrustLevel: vi.fn(() => 'high'),
    extractAccessibilityLevel: vi.fn(() => 'AA'),
  };
});

// Mock fetch for API calls
const mockColorValue: ColorValue = {
  name: 'Test Color',
  scale: [
    { l: 0.95, c: 0.02, h: 240 }, // 50
    { l: 0.9, c: 0.04, h: 240 }, // 100
    { l: 0.8, c: 0.06, h: 240 }, // 200
    { l: 0.7, c: 0.08, h: 240 }, // 300
    { l: 0.6, c: 0.1, h: 240 }, // 400
    { l: 0.5, c: 0.12, h: 240 }, // 500
    { l: 0.4, c: 0.14, h: 240 }, // 600
    { l: 0.3, c: 0.12, h: 240 }, // 700
    { l: 0.2, c: 0.1, h: 240 }, // 800
    { l: 0.1, c: 0.08, h: 240 }, // 900
    { l: 0.05, c: 0.04, h: 240 }, // 950
  ],
  value: '600',
  intelligence: {
    suggestedName: 'Ocean Depths',
    reasoning: 'Deep blue with calming properties',
    emotionalImpact: 'Trustworthy and professional',
    culturalContext: 'Universal positive associations',
    accessibilityNotes: 'Good contrast across the scale',
    usageGuidance: 'Ideal for primary actions and navigation',
  },
  harmonies: {
    complementary: { l: 0.5, c: 0.12, h: 60 },
    triadic: [
      { l: 0.5, c: 0.12, h: 120 },
      { l: 0.5, c: 0.12, h: 0 },
    ],
    analogous: [
      { l: 0.5, c: 0.12, h: 210 },
      { l: 0.5, c: 0.12, h: 270 },
    ],
    tetradic: [
      { l: 0.5, c: 0.12, h: 90 },
      { l: 0.5, c: 0.12, h: 180 },
      { l: 0.5, c: 0.12, h: 270 },
    ],
    monochromatic: [
      { l: 0.3, c: 0.12, h: 240 },
      { l: 0.7, c: 0.12, h: 240 },
    ],
  },
  accessibility: {
    wcagAA: { normal: [[]], large: [[]] },
    wcagAAA: { normal: [[]], large: [[]] },
    onWhite: { wcagAA: true, wcagAAA: false, contrastRatio: 7.2, aa: [], aaa: [] },
    onBlack: { wcagAA: true, wcagAAA: false, contrastRatio: 4.8, aa: [], aaa: [] },
  },
  analysis: { temperature: 'cool', isLight: false, name: 'test-color' },
  atmosphericWeight: { distanceWeight: 0.4, temperature: 'cool', atmosphericRole: 'midground' },
  perceptualWeight: { weight: 0.5, density: 'medium', balancingRecommendation: 'Balanced weight' },
  semanticSuggestions: {
    danger: [{ l: 0.5, c: 0.15, h: 0 }],
    success: [{ l: 0.5, c: 0.15, h: 120 }],
    warning: [{ l: 0.5, c: 0.15, h: 60 }],
    info: [{ l: 0.5, c: 0.15, h: 200 }],
  },
};

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Color Generator v2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockColorValue),
    });
  });

  describe('generateColorTokens', () => {
    it('should generate family and semantic tokens', async () => {
      const result = await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: false,
      });

      expect(result.familyTokens).toHaveLength(9); // 9 semantic roles
      expect(result.semanticTokens.length).toBeGreaterThan(0);
      expect(result.colorValues).toBeDefined();
    });

    it('should use AI-generated family names', async () => {
      const result = await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: false,
      });

      const familyNames = result.familyTokens.map((t) => t.name);
      expect(familyNames).toContain('ocean-depths'); // From mocked suggestedName
    });

    it('should create proper family tokens with ColorValue objects', async () => {
      const result = await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: false,
      });

      const familyToken = result.familyTokens[0];
      expect(familyToken.category).toBe('color-family');
      expect(familyToken.namespace).toBe('color');
      expect(familyToken.generateUtilityClass).toBe(false);
      expect(typeof familyToken.value).toBe('object');
      expect(familyToken.value).toHaveProperty('scale');
      expect(familyToken.value).toHaveProperty('intelligence');
    });

    it('should create semantic tokens with ColorReference objects', async () => {
      const result = await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: false,
      });

      const semanticToken = result.semanticTokens.find((t) => t.name === 'primary');
      expect(semanticToken).toBeDefined();
      expect(semanticToken?.category).toBe('color');
      expect(semanticToken?.namespace).toBe('rafters');
      expect(semanticToken?.generateUtilityClass).toBe(true);
      expect(semanticToken?.value).toHaveProperty('family');
      expect(semanticToken?.value).toHaveProperty('position');
    });

    it('should generate dark mode tokens when enabled', async () => {
      const result = await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: true,
      });

      const darkTokens = result.semanticTokens.filter((t) => t.name.endsWith('-dark'));
      expect(darkTokens.length).toBeGreaterThan(0);
    });

    it('should include all semantic roles including highlight', async () => {
      const result = await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: false,
      });

      const semanticNames = result.semanticTokens.map((t) => t.name);
      expect(semanticNames).toContain('primary');
      expect(semanticNames).toContain('secondary');
      expect(semanticNames).toContain('accent');
      expect(semanticNames).toContain('highlight');
      expect(semanticNames).toContain('neutral');
      expect(semanticNames).toContain('destructive');
      expect(semanticNames).toContain('success');
      expect(semanticNames).toContain('warning');
      expect(semanticNames).toContain('info');
    });

    it('should use color-utils functions for intelligent metadata extraction', async () => {
      const { extractCognitiveLoad, extractTrustLevel, extractAccessibilityLevel } = await import(
        '@rafters/shared'
      );

      await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: false,
      });

      expect(extractCognitiveLoad).toHaveBeenCalled();
      expect(extractTrustLevel).toHaveBeenCalled();
      expect(extractAccessibilityLevel).toHaveBeenCalled();
    });

    it('should validate input configuration with Zod', async () => {
      await expect(
        generateColorTokens({
          baseColor: { l: 2, c: 0.01, h: 286 }, // Invalid lightness > 1
          apiUrl: 'https://test.api.com',
          generateDarkMode: false,
        })
      ).rejects.toThrow();
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(
        generateColorTokens({
          baseColor: { l: 0.44, c: 0.01, h: 286 },
          apiUrl: 'https://test.api.com',
          generateDarkMode: false,
        })
      ).rejects.toThrow('API error: 500');
    });

    it('should generate UI tokens for interface elements', async () => {
      const result = await generateColorTokens({
        baseColor: { l: 0.44, c: 0.01, h: 286 },
        apiUrl: 'https://test.api.com',
        generateDarkMode: false,
      });

      const uiTokenNames = result.semanticTokens.map((t) => t.name);
      expect(uiTokenNames).toContain('background');
      expect(uiTokenNames).toContain('foreground');
      expect(uiTokenNames).toContain('border');
      expect(uiTokenNames).toContain('muted');
    });
  });
});
