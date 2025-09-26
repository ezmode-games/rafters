/**
 * User Empathy Intelligence Service Tests
 *
 * Comprehensive tests for accessibility analysis, color vision simulation,
 * cultural sensitivity analysis, and user reaction prediction capabilities.
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, test } from 'vitest';
import {
  CULTURAL_COLOR_MEANINGS,
  calculateColorDifferentiability,
  categorizeColor,
  type DesignSpec,
  simulateColorVision,
  UserEmpathyService,
  type UserProfile,
  type UserSegment,
} from '../../../src/mcp/services/user-empathy';

describe('UserEmpathyService', () => {
  const service = new UserEmpathyService();

  // Test data
  const testColors: OKLCH[] = [
    { l: 0.7, c: 0.15, h: 180 }, // Ocean blue
    { l: 0.3, c: 0.1, h: 0 }, // Dark red
    { l: 0.9, c: 0.02, h: 60 }, // Light yellow
    { l: 0.1, c: 0.05, h: 120 }, // Dark green
  ];

  const testDesign: DesignSpec = {
    colors: [
      {
        oklch: { l: 0.7, c: 0.15, h: 180 },
        role: 'primary',
        usage: ['background', 'buttons'],
      },
      {
        oklch: { l: 0.1, c: 0.05, h: 120 },
        role: 'text',
        usage: ['headers', 'body'],
      },
      {
        oklch: { l: 0.9, c: 0.02, h: 60 },
        role: 'accent',
        usage: ['highlights'],
      },
    ],
    components: [
      {
        type: 'button',
        properties: { variant: 'primary', size: 'medium' },
        accessibility: {
          touchTarget: 48,
          contrastRatio: 4.5,
          keyboardNavigable: true,
        },
      },
      {
        type: 'form',
        properties: { fields: 5, validation: true },
        accessibility: {
          touchTarget: 32, // Too small
          keyboardNavigable: true,
        },
      },
    ],
    layout: {
      direction: 'ltr',
      density: 'comfortable',
    },
  };

  const testUserProfiles: UserProfile[] = [
    {
      id: 'user1',
      name: 'Standard User',
      colorVision: 'normal',
      culturalBackground: ['western'],
      accessibilityNeeds: [],
      languageDirection: 'ltr',
      devicePreference: 'desktop',
    },
    {
      id: 'user2',
      name: 'Deuteranopic User',
      colorVision: 'deuteranopia',
      culturalBackground: ['western'],
      accessibilityNeeds: ['color-vision-support'],
      languageDirection: 'ltr',
      devicePreference: 'mobile',
      cognitiveProfile: {
        processingSpeed: 'low',
        workingMemory: 'average',
        attentionControl: 'high',
      },
    },
  ];

  const testUserSegments: UserSegment[] = [
    {
      name: 'Tech Enthusiasts',
      demographics: {
        ageRange: '25-40',
        regions: ['north-america', 'europe'],
        techSavviness: 'high',
      },
      preferences: {
        colorPreferences: ['blue', 'green'],
        layoutDensity: 'compact',
        interactionStyle: 'mouse',
      },
      accessibilityNeeds: [],
    },
    {
      name: 'Senior Users',
      demographics: {
        ageRange: '65+',
        regions: ['global'],
        techSavviness: 'low',
      },
      preferences: {
        colorPreferences: ['blue', 'gray'],
        layoutDensity: 'spacious',
        interactionStyle: 'touch',
      },
      accessibilityNeeds: ['large-text', 'high-contrast'],
    },
  ];

  describe('Color Vision Simulation', () => {
    test('should preserve normal color vision', () => {
      const originalColor: OKLCH = { l: 0.7, c: 0.15, h: 180 };
      const simulated = simulateColorVision(originalColor, 'normal');

      expect(simulated).toEqual(originalColor);
    });

    test('should simulate deuteranopia correctly', () => {
      const greenColor: OKLCH = { l: 0.7, c: 0.2, h: 120 }; // Green
      const simulated = simulateColorVision(greenColor, 'deuteranopia');

      expect(simulated.l).toBe(greenColor.l); // Lightness preserved
      expect(simulated.c).toBeLessThan(greenColor.c); // Chroma reduced
      expect(simulated.h).not.toBe(greenColor.h); // Hue shifted
    });

    test('should simulate protanopia correctly', () => {
      const redColor: OKLCH = { l: 0.6, c: 0.2, h: 30 }; // Red
      const simulated = simulateColorVision(redColor, 'protanopia');

      expect(simulated.l).toBe(redColor.l); // Lightness preserved
      expect(simulated.c).toBeLessThan(redColor.c); // Chroma reduced significantly
      expect(Math.abs(simulated.h - redColor.h)).toBeGreaterThan(10); // Hue shifted
    });

    test('should simulate tritanopia correctly', () => {
      const blueColor: OKLCH = { l: 0.5, c: 0.2, h: 240 }; // Blue
      const simulated = simulateColorVision(blueColor, 'tritanopia');

      expect(simulated.l).toBe(blueColor.l); // Lightness preserved
      expect(simulated.c).toBeLessThan(blueColor.c); // Chroma reduced
      expect(Math.abs(simulated.h - blueColor.h)).toBeGreaterThan(5); // Hue shifted
    });

    test('should calculate color differentiability', () => {
      const color1: OKLCH = { l: 0.8, c: 0.1, h: 180 }; // Light blue
      const color2: OKLCH = { l: 0.2, c: 0.1, h: 180 }; // Dark blue

      const normalDiff = calculateColorDifferentiability(color1, color2, 'normal');
      const deuteranopicDiff = calculateColorDifferentiability(color1, color2, 'deuteranopia');

      expect(normalDiff).toBeGreaterThan(0.5); // High lightness difference
      expect(deuteranopicDiff).toBeCloseTo(normalDiff, 1); // Should be similar for lightness difference
    });

    test('should detect poor differentiability for similar hues', () => {
      const redColor: OKLCH = { l: 0.6, c: 0.2, h: 10 };
      const greenColor: OKLCH = { l: 0.6, c: 0.2, h: 110 };

      const normalDiff = calculateColorDifferentiability(redColor, greenColor, 'normal');
      const deuteranopicDiff = calculateColorDifferentiability(
        redColor,
        greenColor,
        'deuteranopia'
      );

      expect(normalDiff).toBeGreaterThan(deuteranopicDiff);
      expect(deuteranopicDiff).toBeLessThan(0.3); // Poor differentiability for deuteranopia
    });
  });

  describe('Color Categorization', () => {
    test('should categorize colors correctly', () => {
      expect(categorizeColor({ l: 0.05, c: 0.01, h: 0 })).toBe('black');
      expect(categorizeColor({ l: 0.95, c: 0.01, h: 0 })).toBe('white');
      expect(categorizeColor({ l: 0.7, c: 0.2, h: 10 })).toBe('red');
      expect(categorizeColor({ l: 0.6, c: 0.15, h: 120 })).toBe('green');
      expect(categorizeColor({ l: 0.5, c: 0.18, h: 240 })).toBe('blue');
      expect(categorizeColor({ l: 0.7, c: 0.1, h: 60 })).toBe('yellow');
    });

    test('should handle edge cases', () => {
      expect(categorizeColor({ l: 0.5, c: 0.01, h: 180 })).toBe('gray'); // Low chroma
      expect(categorizeColor({ l: 0.6, c: 0.15, h: 359 })).toBe('red'); // Near 360°
      expect(categorizeColor({ l: 0.6, c: 0.15, h: 1 })).toBe('red'); // Near 0°
    });
  });

  describe('Cultural Color Meanings Database', () => {
    test('should have comprehensive color meanings', () => {
      expect(CULTURAL_COLOR_MEANINGS.red).toBeDefined();
      expect(CULTURAL_COLOR_MEANINGS.red.western).toBeDefined();
      expect(CULTURAL_COLOR_MEANINGS.red.chinese).toBeDefined();

      expect(CULTURAL_COLOR_MEANINGS.red.western.meanings).toContain('passion');
      expect(CULTURAL_COLOR_MEANINGS.red.chinese.meanings).toContain('luck');
    });

    test('should include sentiment and confidence', () => {
      const redWestern = CULTURAL_COLOR_MEANINGS.red.western;
      expect(redWestern.sentiment).toBeDefined();
      expect(redWestern.confidence).toBeGreaterThan(0);
      expect(redWestern.confidence).toBeLessThanOrEqual(1);
    });

    test('should have negative sentiments for some cultures', () => {
      const whiteInChinese = CULTURAL_COLOR_MEANINGS.white.chinese;
      expect(whiteInChinese.sentiment).toBe('negative');
      expect(whiteInChinese.meanings).toContain('death');
    });
  });

  describe('Accessibility Impact Analysis', () => {
    test('should analyze accessibility impact successfully', async () => {
      const result = await service.analyzeAccessibilityImpact(testDesign, testUserProfiles);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should identify WCAG compliance issues', async () => {
      const poorContrastDesign: DesignSpec = {
        ...testDesign,
        colors: [
          {
            oklch: { l: 0.9, c: 0.02, h: 60 }, // Light yellow
            role: 'background',
            usage: ['background'],
          },
          {
            oklch: { l: 0.95, c: 0.01, h: 60 }, // Very light yellow
            role: 'text',
            usage: ['text'],
          },
        ],
      };

      const result = await service.analyzeAccessibilityImpact(poorContrastDesign, testUserProfiles);

      expect(result.success).toBe(true);
      expect(result.data?.wcagCompliance.aa).toBe(false);
      expect(result.data?.wcagCompliance.issues.length).toBeGreaterThan(0);
      expect(result.data?.wcagCompliance.issues[0].type).toBe('contrast');
    });

    test('should analyze color vision impact', async () => {
      const result = await service.analyzeAccessibilityImpact(testDesign, testUserProfiles);

      expect(result.data?.colorVisionImpact).toHaveLength(4); // normal, deuteranopia, protanopia, tritanopia
      expect(result.data?.colorVisionImpact[0].visionType).toBe('normal');
      expect(result.data?.colorVisionImpact[1].visionType).toBe('deuteranopia');
    });

    test('should calculate cognitive load', async () => {
      const result = await service.analyzeAccessibilityImpact(testDesign, testUserProfiles);

      expect(result.data?.cognitiveLoad.overall).toBeGreaterThan(0);
      expect(result.data?.cognitiveLoad.overall).toBeLessThanOrEqual(10);
      expect(result.data?.cognitiveLoad.perComponent).toBeDefined();
      expect(result.data?.cognitiveLoad.recommendations).toBeDefined();
    });

    test('should analyze motor accessibility', async () => {
      const result = await service.analyzeAccessibilityImpact(testDesign, testUserProfiles);

      expect(result.data?.motorAccessibility.touchTargets).toBeDefined();
      expect(result.data?.motorAccessibility.keyboardNavigation).toBe(true);

      // Should identify touch target issue for form (32px < 44px requirement)
      const smallTouchTarget = result.data?.motorAccessibility.touchTargets.find(
        (target) => target.component === 'form'
      );
      expect(smallTouchTarget?.meetRequirements).toBe(false);
      expect(result.data?.motorAccessibility.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Color Vision Experience Simulation', () => {
    test('should simulate color vision experience successfully', async () => {
      const result = await service.simulateColorVisionExperience(testColors, [
        'normal',
        'deuteranopia',
        'protanopia',
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should provide simulations for all vision types', async () => {
      const result = await service.simulateColorVisionExperience(testColors, [
        'normal',
        'deuteranopia',
        'tritanopia',
      ]);

      expect(result.data?.simulations).toHaveLength(3);
      expect(result.data?.simulations[0].visionType).toBe('normal');
      expect(result.data?.simulations[1].visionType).toBe('deuteranopia');
      expect(result.data?.simulations[2].visionType).toBe('tritanopia');
    });

    test('should calculate differentiability correctly', async () => {
      const result = await service.simulateColorVisionExperience(testColors, [
        'normal',
        'deuteranopia',
      ]);

      const normalSim = result.data?.simulations.find((s) => s.visionType === 'normal');
      const deuteranopiaSim = result.data?.simulations.find((s) => s.visionType === 'deuteranopia');

      // Normal vision should preserve original colors and have perfect differentiability
      expect(normalSim?.simulatedColors.every((c) => c.differentiability === 1)).toBe(true);
      // Verify colors are unchanged for normal vision
      normalSim?.simulatedColors.forEach((simColor, index) => {
        expect(simColor.oklch).toEqual(testColors[index]);
      });

      // Deuteranopia should have some differentiability loss
      expect(deuteranopiaSim?.overallImpact).toBeGreaterThan(0);
    });

    test('should identify critical issues', async () => {
      const problematicColors: OKLCH[] = [
        { l: 0.6, c: 0.2, h: 10 }, // Red
        { l: 0.6, c: 0.2, h: 120 }, // Green - problematic for red-green color blindness
      ];

      const result = await service.simulateColorVisionExperience(problematicColors, [
        'deuteranopia',
      ]);

      const deuteranopiaSim = result.data?.simulations.find((s) => s.visionType === 'deuteranopia');
      expect(deuteranopiaSim?.criticalIssues.length).toBeGreaterThan(0);
      expect(deuteranopiaSim?.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Cultural Sensitivity Analysis', () => {
    test('should analyze cultural sensitivity successfully', async () => {
      const result = await service.analyzeCulturalSensitivity(testDesign, [
        'western',
        'chinese',
        'islamic',
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should analyze color meanings for each culture', async () => {
      const result = await service.analyzeCulturalSensitivity(testDesign, ['western', 'chinese']);

      expect(result.data?.culturalAnalysis).toHaveLength(2);

      const westernAnalysis = result.data?.culturalAnalysis.find((c) => c.culture === 'western');
      const chineseAnalysis = result.data?.culturalAnalysis.find((c) => c.culture === 'chinese');

      expect(westernAnalysis?.colorMeanings.length).toBeGreaterThan(0);
      expect(chineseAnalysis?.colorMeanings.length).toBeGreaterThan(0);
    });

    test('should identify cultural issues', async () => {
      const problematicDesign: DesignSpec = {
        ...testDesign,
        colors: [
          {
            oklch: { l: 0.95, c: 0.02, h: 60 }, // White - negative in Chinese culture
            role: 'primary',
            usage: ['background'],
          },
        ],
        layout: {
          direction: 'ltr', // Problematic for RTL cultures
          density: 'comfortable',
        },
      };

      const result = await service.analyzeCulturalSensitivity(problematicDesign, [
        'chinese',
        'arabic',
      ]);

      const chineseAnalysis = result.data?.culturalAnalysis.find((c) => c.culture === 'chinese');
      const arabicAnalysis = result.data?.culturalAnalysis.find((c) => c.culture === 'arabic');

      // Should identify white color issue for Chinese culture
      expect(chineseAnalysis?.colorMeanings.some((m) => m.sentiment === 'negative')).toBe(true);

      // Should identify RTL layout issue for Arabic culture
      expect(arabicAnalysis?.culturalIssues.some((i) => i.type === 'layout')).toBe(true);
    });

    test('should provide recommendations', async () => {
      const result = await service.analyzeCulturalSensitivity(testDesign, ['western', 'chinese']);

      expect(result.data?.globalRecommendations).toBeDefined();

      result.data?.culturalAnalysis.forEach((analysis) => {
        expect(analysis.recommendations).toBeDefined();
      });
    });

    test('should calculate cultural scores', async () => {
      const result = await service.analyzeCulturalSensitivity(testDesign, ['western', 'chinese']);

      expect(result.data?.overallScore).toBeGreaterThan(0);
      expect(result.data?.overallScore).toBeLessThanOrEqual(1);

      result.data?.culturalAnalysis.forEach((analysis) => {
        expect(analysis.score).toBeGreaterThan(0);
        expect(analysis.score).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('User Reaction Prediction', () => {
    test('should predict user reactions successfully', async () => {
      const result = await service.predictUserReactions(testDesign, testUserSegments);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should analyze reactions for each segment', async () => {
      const result = await service.predictUserReactions(testDesign, testUserSegments);

      expect(result.data?.segmentReactions).toHaveLength(2);

      const techEnthusiasts = result.data?.segmentReactions.find(
        (r) => r.segment === 'Tech Enthusiasts'
      );
      const seniorUsers = result.data?.segmentReactions.find((r) => r.segment === 'Senior Users');

      expect(techEnthusiasts).toBeDefined();
      expect(seniorUsers).toBeDefined();

      expect(techEnthusiasts?.keyFactors.length).toBeGreaterThan(0);
      expect(seniorUsers?.keyFactors.length).toBeGreaterThan(0);
    });

    test('should calculate sentiment correctly', async () => {
      const result = await service.predictUserReactions(testDesign, testUserSegments);

      expect(['very_negative', 'negative', 'neutral', 'positive', 'very_positive']).toContain(
        result.data?.overallSentiment
      );

      result.data?.segmentReactions.forEach((reaction) => {
        expect(['very_negative', 'negative', 'neutral', 'positive', 'very_positive']).toContain(
          reaction.sentiment
        );
        expect(reaction.confidence).toBeGreaterThan(0);
        expect(reaction.confidence).toBeLessThanOrEqual(1);
      });
    });

    test('should identify risk factors', async () => {
      const result = await service.predictUserReactions(testDesign, testUserSegments);

      expect(result.data?.riskFactors).toBeDefined();

      result.data?.riskFactors.forEach((risk) => {
        expect(['low', 'medium', 'high', 'critical']).toContain(risk.severity);
        expect(risk.affectedSegments.length).toBeGreaterThan(0);
        expect(risk.description).toBeTruthy();
        expect(risk.mitigation).toBeTruthy();
      });
    });

    test('should provide segment-specific recommendations', async () => {
      const result = await service.predictUserReactions(testDesign, testUserSegments);

      result.data?.segmentReactions.forEach((reaction) => {
        if (reaction.sentiment === 'negative' || reaction.sentiment === 'very_negative') {
          expect(reaction.recommendations.length).toBeGreaterThan(0);
        }
      });
    });

    test('should detect accessibility gaps', async () => {
      const inaccessibleDesign: DesignSpec = {
        ...testDesign,
        components: [
          {
            type: 'button',
            properties: { variant: 'text' },
            // No accessibility properties - should trigger accessibility gap
          },
        ],
      };

      const accessibilityNeedSegments: UserSegment[] = [
        {
          ...testUserSegments[1], // Senior Users
          accessibilityNeeds: ['large-text', 'high-contrast'], // Has accessibility needs
        },
      ];

      const result = await service.predictUserReactions(
        inaccessibleDesign,
        accessibilityNeedSegments
      );

      const seniorReaction = result.data?.segmentReactions[0];
      expect(seniorReaction?.keyFactors.some((f) => f.factor === 'accessibility_gap')).toBe(true);

      // Should identify accessibility exclusion risk
      const accessibilityRisk = result.data?.riskFactors.find(
        (r) => r.type === 'accessibility_exclusion'
      );
      expect(accessibilityRisk).toBeDefined();
      expect(accessibilityRisk?.severity).toBe('critical');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid design specs gracefully', async () => {
      const invalidDesign = { colors: null } as unknown as DesignSpec;

      const result = await service.analyzeAccessibilityImpact(invalidDesign, testUserProfiles);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.wcagCompliance.issues).toEqual([]);
    });

    test('should handle empty user profiles', async () => {
      const result = await service.analyzeAccessibilityImpact(testDesign, []);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    test('should handle empty color arrays', async () => {
      const result = await service.simulateColorVisionExperience([], ['normal']);

      expect(result.success).toBe(true);
      expect(result.data?.simulations[0].simulatedColors).toHaveLength(0);
    });
  });

  describe('Performance', () => {
    test('should complete accessibility analysis within 500ms', async () => {
      const startTime = Date.now();
      const result = await service.analyzeAccessibilityImpact(testDesign, testUserProfiles);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(500);
      expect(result.processingTime).toBeLessThan(500);
    });

    test('should handle large design specs efficiently', async () => {
      const largeDesign: DesignSpec = {
        colors: Array(20)
          .fill(null)
          .map((_, i) => ({
            oklch: { l: 0.5, c: 0.1, h: i * 18 }, // Colors across hue spectrum
            role: `color_${i}`,
            usage: ['decoration'],
          })),
        components: Array(10)
          .fill(null)
          .map((_, i) => ({
            type: 'component',
            properties: { id: i },
            accessibility: {
              touchTarget: 44,
              keyboardNavigable: true,
            },
          })),
      };

      const startTime = Date.now();
      const result = await service.analyzeAccessibilityImpact(largeDesign, testUserProfiles);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Still reasonably fast for large designs
    });
  });
});
