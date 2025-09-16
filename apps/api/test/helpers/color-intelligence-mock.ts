import { roundOKLCH } from '@rafters/color-utils';
import type { ColorIntelligenceResponse, OKLCH } from '@rafters/shared';
import fixtures from '../fixtures/color-intelligence.json';

/**
 * Mock implementation of color intelligence generation for testing
 * Uses pre-generated fixtures to avoid hitting the real API
 */
export function mockColorIntelligence(oklch: OKLCH): ColorIntelligenceResponse | null {
  const rounded = roundOKLCH(oklch);
  const key = `oklch(${rounded.l}, ${rounded.c}, ${rounded.h})`;

  return (fixtures[key as keyof typeof fixtures] as ColorIntelligenceResponse) || null;
}

/**
 * Generate a deterministic color intelligence response for testing
 * Used when no fixture exists for a given color
 */
export function generateTestColorIntelligence(oklch: OKLCH): ColorIntelligenceResponse {
  const rounded = roundOKLCH(oklch);
  const name = `test-color-${rounded.l}-${rounded.c}-${rounded.h}`;

  return {
    intelligence: {
      suggestedName: name,
      reasoning: `Test color with OKLCH(${rounded.l}, ${rounded.c}, ${rounded.h}) for automated testing.`,
      emotionalImpact: 'Test emotional impact for automated testing scenarios.',
      culturalContext: 'Test cultural context for consistent test scenarios.',
      accessibilityNotes: 'Test accessibility guidance for automated validation.',
      usageGuidance: 'Test usage guidance for component testing scenarios.',
    },
    harmonies: {
      complementary: { l: rounded.l, c: rounded.c, h: (rounded.h + 180) % 360 },
      triadic: [
        { l: rounded.l, c: rounded.c, h: (rounded.h + 120) % 360 },
        { l: rounded.l, c: rounded.c, h: (rounded.h + 240) % 360 },
      ],
      analogous: [
        { l: rounded.l, c: rounded.c, h: (rounded.h + 30) % 360 },
        { l: rounded.l, c: rounded.c, h: (rounded.h - 30 + 360) % 360 },
      ],
      tetradic: [
        { l: rounded.l, c: rounded.c, h: (rounded.h + 90) % 360 },
        { l: rounded.l, c: rounded.c, h: (rounded.h + 180) % 360 },
        { l: rounded.l, c: rounded.c, h: (rounded.h + 270) % 360 },
      ],
      monochromatic: [
        { l: Math.max(0, rounded.l - 0.2), c: rounded.c, h: rounded.h },
        { l: Math.max(0, rounded.l - 0.1), c: rounded.c, h: rounded.h },
        { l: Math.min(1, rounded.l + 0.1), c: rounded.c, h: rounded.h },
        { l: Math.min(1, rounded.l + 0.2), c: rounded.c, h: rounded.h },
      ],
    },
    accessibility: {
      onWhite: {
        wcagAA: rounded.l < 0.6,
        wcagAAA: rounded.l < 0.4,
        contrastRatio: rounded.l < 0.5 ? 4.5 : 2.1,
      },
      onBlack: {
        wcagAA: rounded.l > 0.4,
        wcagAAA: rounded.l > 0.6,
        contrastRatio: rounded.l > 0.5 ? 4.5 : 2.1,
      },
    },
    analysis: {
      temperature:
        rounded.h >= 60 && rounded.h <= 180
          ? 'warm'
          : rounded.h >= 180 && rounded.h <= 300
            ? 'cool'
            : 'neutral',
      isLight: rounded.l > 0.6,
      name: `Test Color ${Math.round(rounded.h)}°`,
    },
  };
}
