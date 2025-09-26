/**
 * Color Intelligence Uncertainty Integration Tests
 * Tests the integration of uncertainty quantification into color intelligence service
 */

import { ColorValueSchema } from '@rafters/shared';
import { describe, expect, test } from 'vitest';
import { calculateInputConfidence, scoreResponseQuality } from '../../src/lib/uncertainty/client';

describe('Color Intelligence Uncertainty Integration', () => {
  test('calculates input confidence correctly', () => {
    const highQualityOKLCH = {
      l: 0.7, // Good lightness
      c: 0.15, // Reasonable chroma
      h: 180, // Integer hue
    };

    const lowQualityOKLCH = {
      l: 0.01, // Very low lightness
      c: 0.5, // Very high chroma
      h: 45.7, // Decimal hue
    };

    const highConfidence = calculateInputConfidence(highQualityOKLCH);
    const lowConfidence = calculateInputConfidence(lowQualityOKLCH);

    expect(highConfidence).toBeGreaterThan(lowConfidence);
    expect(highConfidence).toBeLessThanOrEqual(0.95); // Capped at 95%
    expect(lowConfidence).toBeGreaterThan(0); // Always > 0
    expect(highConfidence).toBeGreaterThan(0.6); // Should be reasonably high
  });

  test('scores response quality correctly', () => {
    const completeIntelligence = {
      suggestedName: 'Ocean Blue',
      reasoning: 'This color represents the deep ocean with excellent OKLCH values',
      emotionalImpact: 'Calming and trustworthy, evokes feelings of stability and peace',
      culturalContext: 'In Western cultures, blue represents trust and professionalism',
      accessibilityNotes: 'Meets WCAG AA standards for contrast when used appropriately',
      usageGuidance: 'Recommended for backgrounds and large areas, avoid for small text',
    };

    const incompleteIntelligence = {
      suggestedName: 'Blue',
      reasoning: 'Blue color',
      emotionalImpact: 'Nice',
      culturalContext: 'Good',
      accessibilityNotes: 'OK',
      usageGuidance: 'Use',
    };

    const completeScore = scoreResponseQuality(completeIntelligence);
    const incompleteScore = scoreResponseQuality(incompleteIntelligence);

    expect(completeScore).toBeGreaterThan(incompleteScore);
    expect(completeScore).toBeGreaterThan(0.8); // Should be high quality
    expect(incompleteScore).toBeLessThan(0.5); // Should be low quality
    expect(completeScore).toBeLessThanOrEqual(1.0);
    expect(incompleteScore).toBeGreaterThan(0);
  });

  test('validates ColorValueSchema with metadata', () => {
    const colorValueWithMetadata = {
      name: 'Test Blue',
      scale: [{ l: 0.7, c: 0.15, h: 180 }],
      intelligence: {
        suggestedName: 'Ocean Blue',
        reasoning: 'Deep blue color with good contrast',
        emotionalImpact: 'Calming and professional',
        culturalContext: 'Universal trust color',
        accessibilityNotes: 'WCAG AA compliant',
        usageGuidance: 'Great for backgrounds and headers',
        metadata: {
          predictionId: 'test-prediction-123',
          confidence: 0.85,
          uncertaintyBounds: {
            lower: 0.75,
            upper: 0.95,
            confidenceInterval: 0.95,
          },
          qualityScore: 0.9,
          method: 'bootstrap',
        },
      },
    };

    expect(() => ColorValueSchema.parse(colorValueWithMetadata)).not.toThrow();

    const validated = ColorValueSchema.parse(colorValueWithMetadata);
    expect(validated.intelligence?.metadata).toBeDefined();
    expect(validated.intelligence?.metadata?.predictionId).toBe('test-prediction-123');
    expect(validated.intelligence?.metadata?.confidence).toBe(0.85);
  });
});
