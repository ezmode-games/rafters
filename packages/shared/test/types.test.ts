/**
 * Unit tests for Zod schemas and type validation
 * Tests all schema validation logic in isolation
 */

import { describe, expect, it } from 'vitest';
import {
  ColorIntelligenceSchema,
  ColorReferenceSchema,
  ColorValueSchema,
  ComponentIntelligenceSchema,
  ComponentManifestSchema,
  DesignSystemSchema,
  OKLCHSchema,
  SeedQueueStatsSchema,
  TokenSchema,
} from '../src/types.js';

describe('OKLCHSchema', () => {
  it('should validate valid OKLCH color values', () => {
    const validOKLCH = {
      l: 0.5,
      c: 0.2,
      h: 240,
    };

    const result = OKLCHSchema.safeParse(validOKLCH);
    expect(result.success).toBe(true);
  });

  it('should validate OKLCH color with alpha', () => {
    const withAlpha = {
      l: 0.5,
      c: 0.2,
      h: 240,
      alpha: 0.8,
    };

    const result = OKLCHSchema.safeParse(withAlpha);
    expect(result.success).toBe(true);
  });

  it('should reject invalid lightness values', () => {
    const invalidLightness = {
      l: 1.5, // > 1 is invalid
      c: 0.2,
      h: 240,
    };

    const result = OKLCHSchema.safeParse(invalidLightness);
    expect(result.success).toBe(false);
  });

  it('should reject negative chroma values', () => {
    const negativeChroma = {
      l: 0.5,
      c: -0.1, // Negative is invalid
      h: 240,
    };

    const result = OKLCHSchema.safeParse(negativeChroma);
    expect(result.success).toBe(false);
  });

  it('should reject invalid hue values', () => {
    const invalidHue = {
      l: 0.5,
      c: 0.2,
      h: 400, // > 360 is invalid
    };

    const result = OKLCHSchema.safeParse(invalidHue);
    expect(result.success).toBe(false);
  });
});

describe('ColorValueSchema', () => {
  const minimalColorValue = {
    name: 'Ocean Blue',
    scale: [],
  };

  const completeColorValue = {
    name: 'Ocean Blue',
    scale: [
      { l: 0.95, c: 0.05, h: 240 },
      { l: 0.5, c: 0.2, h: 240 },
    ],
    token: 'primary',
    value: '500',
    use: 'Primary brand color for CTAs',
    states: {
      hover: 'ocean-blue-600',
      focus: 'ocean-blue-700',
    },
    intelligence: {
      suggestedName: 'Ocean Blue',
      reasoning: 'Ocean blue conveys trust',
      emotionalImpact: 'Calming yet authoritative',
      culturalContext: 'Universally positive',
      accessibilityNotes: 'AAA contrast on white',
      usageGuidance: 'Ideal for primary CTAs',
    },
    tokenId: 'color-0.500-0.120-240.0',
  };

  it('should validate minimal ColorValue', () => {
    const result = ColorValueSchema.safeParse(minimalColorValue);
    expect(result.success).toBe(true);
  });

  it('should validate complete ColorValue', () => {
    const result = ColorValueSchema.safeParse(completeColorValue);
    expect(result.success).toBe(true);
  });

  it('should reject ColorValue without required fields', () => {
    const invalidColorValue = {
      // Missing name and scale
      token: 'primary',
    };

    const result = ColorValueSchema.safeParse(invalidColorValue);
    expect(result.success).toBe(false);
  });

  it('should validate scale with valid OKLCH values', () => {
    const withValidScale = {
      ...minimalColorValue,
      scale: [
        { l: 0.1, c: 0.05, h: 240 },
        { l: 0.9, c: 0.15, h: 240 },
      ],
    };

    const result = ColorValueSchema.safeParse(withValidScale);
    expect(result.success).toBe(true);
  });

  it('should reject scale with invalid OKLCH values', () => {
    const withInvalidScale = {
      ...minimalColorValue,
      scale: [
        { l: 1.5, c: 0.05, h: 240 }, // Invalid lightness
      ],
    };

    const result = ColorValueSchema.safeParse(withInvalidScale);
    expect(result.success).toBe(false);
  });
});

describe('ColorReferenceSchema', () => {
  it('should validate color reference with family and position', () => {
    const validReference = {
      family: 'ocean-blue',
      position: '600',
    };

    const result = ColorReferenceSchema.safeParse(validReference);
    expect(result.success).toBe(true);
  });

  it('should validate various scale positions', () => {
    const positions = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

    positions.forEach((position) => {
      const reference = {
        family: 'test-family',
        position,
      };

      const result = ColorReferenceSchema.safeParse(reference);
      expect(result.success).toBe(true);
    });
  });

  it('should require both family and position', () => {
    const missingPosition = {
      family: 'ocean-blue',
      // Missing position
    };

    const result = ColorReferenceSchema.safeParse(missingPosition);
    expect(result.success).toBe(false);
  });

  it('should require valid string values', () => {
    const invalidTypes = {
      family: 123, // Should be string
      position: true, // Should be string
    };

    const result = ColorReferenceSchema.safeParse(invalidTypes);
    expect(result.success).toBe(false);
  });
});

describe('TokenSchema', () => {
  const basicToken = {
    name: 'primary-500',
    value: '#3b82f6',
    category: 'color',
    namespace: 'semantic',
  };

  it('should validate basic token structure', () => {
    const result = TokenSchema.safeParse(basicToken);
    expect(result.success).toBe(true);
  });

  it('should validate token with ColorValue', () => {
    const colorToken = {
      ...basicToken,
      value: {
        name: 'Ocean Blue',
        scale: [{ l: 0.5, c: 0.2, h: 240 }],
      },
    };

    const result = TokenSchema.safeParse(colorToken);
    expect(result.success).toBe(true);
  });

  it('should validate token with ColorReference', () => {
    const colorReferenceToken = {
      ...basicToken,
      value: {
        family: 'ocean-blue',
        position: '600',
      },
      category: 'color',
      namespace: 'rafters',
      semanticMeaning: 'Primary brand color for main actions',
    };

    const result = TokenSchema.safeParse(colorReferenceToken);
    expect(result.success).toBe(true);
  });

  it('should validate token with AI intelligence', () => {
    const intelligentToken = {
      ...basicToken,
      semanticMeaning: 'Primary brand color for main actions',
      trustLevel: 'high' as const,
      cognitiveLoad: 3,
      accessibilityLevel: 'AA' as const,
      consequence: 'reversible' as const,
    };

    const result = TokenSchema.safeParse(intelligentToken);
    expect(result.success).toBe(true);
  });

  it('should reject token without required fields', () => {
    const incompleteToken = {
      name: 'primary-500',
      // Missing value, category, namespace
    };

    const result = TokenSchema.safeParse(incompleteToken);
    expect(result.success).toBe(false);
  });

  it('should reject invalid cognitive load values', () => {
    const invalidToken = {
      ...basicToken,
      cognitiveLoad: 15, // > 10 is invalid
    };

    const result = TokenSchema.safeParse(invalidToken);
    expect(result.success).toBe(false);
  });
});

describe('ComponentIntelligenceSchema', () => {
  const validIntelligence = {
    cognitiveLoad: 3,
    attentionHierarchy: 'Primary action component - single per section',
    accessibilityRules: 'WCAG AA compliant, 44px minimum touch target',
    usageContext: 'Use for main user goals and primary CTAs',
  };

  it('should validate component intelligence', () => {
    const result = ComponentIntelligenceSchema.safeParse(validIntelligence);
    expect(result.success).toBe(true);
  });

  it('should validate with optional fields', () => {
    const withOptionals = {
      ...validIntelligence,
      safetyConstraints: 'Destructive actions require confirmation',
      decisionConstraints: 'Maximum one primary button per page section',
    };

    const result = ComponentIntelligenceSchema.safeParse(withOptionals);
    expect(result.success).toBe(true);
  });

  it('should reject invalid cognitive load', () => {
    const invalidIntelligence = {
      ...validIntelligence,
      cognitiveLoad: 0, // < 1 is invalid
    };

    const result = ComponentIntelligenceSchema.safeParse(invalidIntelligence);
    expect(result.success).toBe(false);
  });
});

describe('ColorIntelligenceSchema', () => {
  const validColorIntel = {
    suggestedName: 'Ocean Blue',
    reasoning: 'Blue conveys trust and professionalism',
    emotionalImpact: 'Calming and authoritative',
    culturalContext: 'Universally positive in business contexts',
    accessibilityNotes: 'Provides AAA contrast on white backgrounds',
    usageGuidance: 'Ideal for primary CTAs and brand elements',
  };

  it('should validate color intelligence', () => {
    const result = ColorIntelligenceSchema.safeParse(validColorIntel);
    expect(result.success).toBe(true);
  });

  it('should require all fields', () => {
    const incomplete = {
      suggestedName: 'Ocean Blue',
      reasoning: 'Blue conveys trust',
      // Missing other required fields
    };

    const result = ColorIntelligenceSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});

describe('SeedQueueStatsSchema', () => {
  const validStats = {
    strategicColors: 540,
    standardColors: 306,
    totalColors: 846,
    totalSent: 100,
  };

  it('should validate seed queue statistics', () => {
    const result = SeedQueueStatsSchema.safeParse(validStats);
    expect(result.success).toBe(true);
  });

  it('should require all numeric fields', () => {
    const incomplete = {
      strategicColors: 540,
      // Missing other required fields
    };

    const result = SeedQueueStatsSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});

describe('ComponentManifestSchema', () => {
  const validManifest = {
    name: 'button',
    type: 'registry:component' as const,
    files: [
      {
        path: 'ui/button.tsx',
        content: 'export function Button() { return <button />; }',
        type: 'registry:component',
      },
    ],
  };

  it('should validate component manifest', () => {
    const result = ComponentManifestSchema.safeParse(validManifest);
    expect(result.success).toBe(true);
  });

  it('should validate with rafters intelligence metadata', () => {
    const withRafters = {
      ...validManifest,
      meta: {
        rafters: {
          version: '1.0.0',
          intelligence: {
            cognitiveLoad: 3,
            attentionEconomics: 'Primary action - limit one per section',
            accessibility: 'WCAG AA, 44px minimum touch target',
            trustBuilding: 'High contrast, clear affordance',
            semanticMeaning: 'Primary actions and CTAs',
          },
        },
      },
    };

    const result = ComponentManifestSchema.safeParse(withRafters);
    expect(result.success).toBe(true);
  });

  it('should reject invalid component type', () => {
    const invalidType = {
      ...validManifest,
      type: 'invalid-type',
    };

    const result = ComponentManifestSchema.safeParse(invalidType);
    expect(result.success).toBe(false);
  });
});

describe('DesignSystemSchema', () => {
  const validDesignSystem = {
    id: 'my-design-system',
    name: 'My Design System',
    primaryColor: { l: 0.5, c: 0.2, h: 240 },
    tokens: [],
    typography: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
      scale: { sm: 14, md: 16, lg: 18 },
    },
    intelligence: {
      colorVisionTested: ['normal', 'deuteranopia'],
      contrastLevel: 'AA' as const,
      components: {},
    },
    metadata: {
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-02T00:00:00Z',
      version: '1.0.0',
    },
  };

  it('should validate complete design system', () => {
    const result = DesignSystemSchema.safeParse(validDesignSystem);
    expect(result.success).toBe(true);
  });

  it('should require all core fields', () => {
    const incomplete = {
      id: 'my-design-system',
      name: 'My Design System',
      // Missing other required fields
    };

    const result = DesignSystemSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});
