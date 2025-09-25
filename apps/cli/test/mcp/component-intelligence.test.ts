/**
 * Component Intelligence Service Tests
 *
 * Comprehensive test coverage for cognitive load analysis, attention hierarchy,
 * and accessibility intelligence features.
 */

import type { ComponentRegistry, Intelligence } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentIntelligenceService } from '../../src/mcp/services/component-intelligence';

describe('ComponentIntelligenceService', () => {
  let service: ComponentIntelligenceService;

  // Test fixtures
  const mockButtonIntelligence: Intelligence = {
    cognitiveLoad: 3,
    attentionEconomics: 'Size hierarchy: sm=tertiary, md=secondary, lg=primary',
    accessibility: 'WCAG AAA compliant with 44px minimum touch targets, high contrast ratios',
    trustBuilding:
      'Destructive actions require confirmation patterns. Loading states prevent double-submission.',
    semanticMeaning:
      'Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions',
  };

  const mockComplexComponentIntelligence: Intelligence = {
    cognitiveLoad: 8,
    attentionEconomics: 'Primary attention with multiple interaction states',
    accessibility: 'WCAG AA compliant, keyboard navigation, screen reader optimized',
    trustBuilding: 'Multi-step confirmation for data loss prevention',
    semanticMeaning: 'Complex form component with validation patterns',
  };

  const mockComponentRegistry: ComponentRegistry = {
    name: 'button',
    type: 'registry:component',
    files: ['button.tsx'],
    meta: {
      rafters: {
        intelligence: {
          cognitiveLoad: 3,
          attentionEconomics: 'Primary action component',
          accessibility: 'WCAG AAA compliant',
          trustBuilding: 'Loading states and confirmation patterns',
          semanticMeaning: 'Main user action trigger',
        },
      },
    },
  };

  beforeEach(() => {
    service = new ComponentIntelligenceService();
  });

  describe('analyzeComponent', () => {
    it('should analyze component with basic intelligence data', async () => {
      const result = await service.analyzeComponent('button', mockButtonIntelligence);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cognitiveLoadScore).toBe(3);
        expect(result.data.millerRuleCompliance).toBe(true);
        expect(result.data.attentionWeight).toBeGreaterThan(0);
        expect(result.data.trustPatterns).toContain('confirmation_pattern');
        expect(result.data.trustPatterns).toContain('loading_state');
        expect(result.confidence).toBeGreaterThan(0.8);
      }
    });

    it('should identify Miller rule violations for complex components', async () => {
      const result = await service.analyzeComponent(
        'complex-form',
        mockComplexComponentIntelligence
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cognitiveLoadScore).toBe(8);
        expect(result.data.millerRuleCompliance).toBe(false);
        expect(result.data.recommendations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'cognitive',
              priority: 'high',
            }),
          ])
        );
      }
    });

    it('should analyze attention weights correctly', async () => {
      const primaryIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        attentionEconomics: 'Primary attention target for main user goal',
      };

      const secondaryIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        attentionEconomics: 'Secondary supporting action',
      };

      const primaryResult = await service.analyzeComponent('primary-button', primaryIntelligence);
      const secondaryResult = await service.analyzeComponent(
        'secondary-button',
        secondaryIntelligence
      );

      expect(primaryResult.success).toBe(true);
      expect(secondaryResult.success).toBe(true);

      if (primaryResult.success && secondaryResult.success) {
        expect(primaryResult.data.attentionWeight).toBeGreaterThan(
          secondaryResult.data.attentionWeight
        );
      }
    });

    it('should identify accessibility gaps', async () => {
      const limitedAccessibilityIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        accessibility: 'Basic styling only',
      };

      const result = await service.analyzeComponent(
        'limited-button',
        limitedAccessibilityIntelligence,
        { deviceContext: 'mobile' }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.accessibilityGaps).toContain('wcag_compliance_unspecified');
        expect(result.data.accessibilityGaps).toContain('keyboard_navigation');
        expect(result.data.accessibilityGaps).toContain('screen_reader_support');
        expect(result.data.accessibilityGaps).toContain('touch_target_size');
      }
    });

    it('should generate appropriate recommendations', async () => {
      const context = {
        layoutComplexity: 8,
        userExpertise: 'novice' as const,
        taskUrgency: 'high' as const,
        deviceContext: 'mobile' as const,
      };

      const result = await service.analyzeComponent(
        'complex-button',
        mockComplexComponentIntelligence,
        context
      );

      expect(result.success).toBe(true);
      if (result.success) {
        const recommendations = result.data.recommendations;
        expect(recommendations.length).toBeGreaterThan(0);

        // Should have cognitive load recommendation
        expect(recommendations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'cognitive',
              priority: 'high',
            }),
          ])
        );

        // Should have accessibility recommendation for novice users
        expect(recommendations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'accessibility',
              priority: 'high',
            }),
          ])
        );
      }
    });

    it('should handle errors gracefully', async () => {
      // Test with invalid intelligence data
      const invalidIntelligence = {} as Intelligence;

      const result = await service.analyzeComponent('invalid', invalidIntelligence);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Component analysis failed');
      expect(result.confidence).toBe(0);
    });
  });

  describe('optimizeComposition', () => {
    const highCognitiveLoadComponents: ComponentRegistry[] = [
      {
        ...mockComponentRegistry,
        name: 'complex-form',
        meta: {
          rafters: {
            intelligence: {
              ...mockComponentRegistry.meta.rafters.intelligence,
              cognitiveLoad: 9,
            },
          },
        },
      },
      {
        ...mockComponentRegistry,
        name: 'data-table',
        meta: {
          rafters: {
            intelligence: {
              ...mockComponentRegistry.meta.rafters.intelligence,
              cognitiveLoad: 8,
            },
          },
        },
      },
      {
        ...mockComponentRegistry,
        name: 'navigation',
        meta: {
          rafters: {
            intelligence: {
              ...mockComponentRegistry.meta.rafters.intelligence,
              cognitiveLoad: 5,
            },
          },
        },
      },
    ];

    it('should optimize high cognitive load compositions', async () => {
      const constraints = {
        maxCognitiveLoad: 10,
        maxAttentionPoints: 2,
      };

      const result = await service.optimizeComposition(highCognitiveLoadComponents, constraints);

      expect(result.success).toBe(true);
      if (result.success) {
        const totalOptimizedLoad = result.data.cognitiveLoadDistribution.reduce(
          (sum, item) => sum + item.load,
          0
        );

        expect(totalOptimizedLoad).toBeLessThanOrEqual(constraints.maxCognitiveLoad);
        expect(result.data.improvements.length).toBeGreaterThan(0);
        expect(result.data.accessibilityScore).toBeGreaterThan(0);
      }
    });

    it('should preserve optimal compositions', async () => {
      const lowCognitiveLoadComponents: ComponentRegistry[] = [
        {
          ...mockComponentRegistry,
          name: 'simple-button',
          meta: {
            rafters: {
              intelligence: {
                ...mockComponentRegistry.meta.rafters.intelligence,
                cognitiveLoad: 2,
              },
            },
          },
        },
        {
          ...mockComponentRegistry,
          name: 'text-label',
          meta: {
            rafters: {
              intelligence: {
                ...mockComponentRegistry.meta.rafters.intelligence,
                cognitiveLoad: 1,
              },
            },
          },
        },
      ];

      const result = await service.optimizeComposition(lowCognitiveLoadComponents);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.improvements).toContain(
          'Composition already optimized for cognitive load'
        );
        expect(result.confidence).toBeGreaterThan(0.9);
      }
    });

    it('should generate attention flow correctly', async () => {
      const mixedAttentionComponents: ComponentRegistry[] = [
        {
          ...mockComponentRegistry,
          name: 'primary-cta',
          meta: {
            rafters: {
              intelligence: {
                ...mockComponentRegistry.meta.rafters.intelligence,
                cognitiveLoad: 3,
                attentionEconomics: 'Primary attention target',
              },
            },
          },
        },
        {
          ...mockComponentRegistry,
          name: 'secondary-action',
          meta: {
            rafters: {
              intelligence: {
                ...mockComponentRegistry.meta.rafters.intelligence,
                cognitiveLoad: 2,
                attentionEconomics: 'Secondary supporting action',
              },
            },
          },
        },
        {
          ...mockComponentRegistry,
          name: 'tertiary-link',
          meta: {
            rafters: {
              intelligence: {
                ...mockComponentRegistry.meta.rafters.intelligence,
                cognitiveLoad: 1,
                attentionEconomics: 'Tertiary contextual information',
              },
            },
          },
        },
      ];

      const result = await service.optimizeComposition(mixedAttentionComponents);

      expect(result.success).toBe(true);
      if (result.success) {
        const attentionFlow = result.data.attentionFlow;
        expect(attentionFlow.length).toBeGreaterThanOrEqual(3);
        expect(attentionFlow[0].component).toBe('primary-cta');
        expect(attentionFlow[1].component).toBe('secondary-action');
        expect(attentionFlow[2].component).toBe('tertiary-link');
      }
    });

    it('should handle empty component arrays', async () => {
      const result = await service.optimizeComposition([]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cognitiveLoadDistribution).toEqual([]);
        expect(result.data.attentionFlow).toEqual([]);
        expect(result.data.accessibilityScore).toBe(0);
      }
    });
  });

  describe('assessAttentionHierarchy', () => {
    const mockLayout = {
      components: [
        {
          name: 'header',
          position: { x: 0, y: 0 },
          size: { width: 1200, height: 80 },
          zIndex: 10,
        },
        {
          name: 'main-content',
          position: { x: 100, y: 100 },
          size: { width: 800, height: 600 },
          zIndex: 1,
        },
        {
          name: 'sidebar',
          position: { x: 950, y: 100 },
          size: { width: 250, height: 600 },
          zIndex: 1,
        },
      ],
      viewportSize: { width: 1200, height: 800 },
    };

    it('should analyze attention hierarchy correctly', async () => {
      const result = await service.assessAttentionHierarchy(mockLayout);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.visualWeight).toHaveProperty('header');
        expect(result.data.visualWeight).toHaveProperty('main-content');
        expect(result.data.visualWeight).toHaveProperty('sidebar');

        // Header should have highest visual weight due to z-index and position
        expect(result.data.visualWeight.header).toBeGreaterThan(
          result.data.visualWeight['main-content']
        );

        expect(result.data.attentionFlow).toContain('header');
        expect(result.data.attentionFlow).toContain('main-content');
        expect(result.data.attentionFlow).toContain('sidebar');
      }
    });

    it('should identify attention violations', async () => {
      const competingPrimaryLayout = {
        components: [
          {
            name: 'button1',
            position: { x: 200, y: 200 }, // More centered
            size: { width: 700, height: 500 }, // Much larger size
            zIndex: 15,
          },
          {
            name: 'button2',
            position: { x: 400, y: 200 }, // More centered
            size: { width: 700, height: 500 }, // Much larger size
            zIndex: 15,
          },
        ],
        viewportSize: { width: 1200, height: 800 },
      };

      const result = await service.assessAttentionHierarchy(competingPrimaryLayout);

      expect(result.success).toBe(true);
      if (result.success) {
        // Should detect competing primary elements due to large size and high z-index
        expect(result.data.violations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'competing_primary',
              severity: 'error',
            }),
          ])
        );
      }
    });

    it('should detect weak hierarchy', async () => {
      const weakHierarchyLayout = {
        components: [
          {
            name: 'element1',
            position: { x: 100, y: 100 },
            size: { width: 200, height: 200 },
          },
          {
            name: 'element2',
            position: { x: 350, y: 100 },
            size: { width: 200, height: 200 },
          },
          {
            name: 'element3',
            position: { x: 600, y: 100 },
            size: { width: 200, height: 200 },
          },
        ],
        viewportSize: { width: 1200, height: 800 },
      };

      const result = await service.assessAttentionHierarchy(weakHierarchyLayout);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.violations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: 'weak_hierarchy',
              severity: 'warning',
            }),
          ])
        );
      }
    });

    it('should handle invalid layout data', async () => {
      const invalidLayout = {
        components: [],
        viewportSize: { width: -100, height: -100 },
      };

      const result = await service.assessAttentionHierarchy(invalidLayout);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Attention hierarchy assessment failed');
    });
  });

  describe('validateAccessibility', () => {
    it('should validate WCAG compliance levels', async () => {
      const aaaIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        accessibility: 'WCAG AAA compliant with keyboard navigation and screen reader support',
      };

      const result = await service.validateAccessibility('accessible-button', aaaIntelligence);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wcagCompliance.level).toBe('AAA');
        expect(result.data.wcagCompliance.violations).toHaveLength(0);
      }
    });

    it('should identify accessibility violations', async () => {
      const poorA11yIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        accessibility: 'Basic styling with colors only',
      };

      const result = await service.validateAccessibility('poor-a11y-button', poorA11yIntelligence);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wcagCompliance.level).toBe('FAIL');
        expect(result.data.wcagCompliance.violations.length).toBeGreaterThan(0);

        expect(result.data.wcagCompliance.violations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              guideline: 'WCAG 2.1',
              impact: 'critical',
            }),
          ])
        );
      }
    });

    it('should analyze color vision accessibility', async () => {
      const context = {
        colorVisionTypes: ['normal', 'deuteranopia', 'protanopia'] as const,
        contrastLevel: 'AAA' as const,
      };

      const result = await service.validateAccessibility(
        'color-button',
        mockButtonIntelligence,
        context
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.colorVisionAnalysis).toHaveProperty('normal');
        expect(result.data.colorVisionAnalysis).toHaveProperty('deuteranopia');
        expect(result.data.colorVisionAnalysis).toHaveProperty('protanopia');

        // Deuteranopia and protanopia should have recommendations
        expect(result.data.colorVisionAnalysis.deuteranopia.recommendations).toContain(
          'Test with color vision simulation tools'
        );
      }
    });

    it('should analyze touch target compliance', async () => {
      const touchCompliantIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        accessibility: 'WCAG AA compliant with 44px minimum touch targets',
      };

      const result = await service.validateAccessibility(
        'touch-button',
        touchCompliantIntelligence
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.touchTargetAnalysis.compliant).toBe(true);
        expect(result.data.touchTargetAnalysis.minSize).toBe(44);
        expect(result.data.touchTargetAnalysis.violations).toHaveLength(0);
      }
    });

    it('should calculate cognitive accessibility scores', async () => {
      const lowCognitiveLoadIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        cognitiveLoad: 2,
      };

      const highCognitiveLoadIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        cognitiveLoad: 9,
      };

      const lowResult = await service.validateAccessibility(
        'simple-button',
        lowCognitiveLoadIntelligence
      );

      const highResult = await service.validateAccessibility(
        'complex-button',
        highCognitiveLoadIntelligence
      );

      expect(lowResult.success).toBe(true);
      expect(highResult.success).toBe(true);

      if (lowResult.success && highResult.success) {
        expect(lowResult.data.cognitiveAccessibility.score).toBeGreaterThan(
          highResult.data.cognitiveAccessibility.score
        );

        expect(
          highResult.data.cognitiveAccessibility.simplificationSuggestions.length
        ).toBeGreaterThan(0);
        expect(highResult.data.cognitiveAccessibility.simplificationSuggestions).toContain(
          'Consider breaking into multiple smaller components'
        );
      }
    });

    it('should handle accessibility analysis errors', async () => {
      const invalidIntelligence = {
        cognitiveLoad: 'invalid' as unknown as number,
      } as Intelligence;

      const result = await service.validateAccessibility('invalid', invalidIntelligence);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Accessibility validation failed');
      expect(result.confidence).toBe(0);
    });
  });

  describe('CognitiveLoadModel', () => {
    it("should apply Miller's 7±2 rule correctly", async () => {
      // Test component with exactly 7 elements (should be compliant)
      const sevenElementIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        cognitiveLoad: 7,
      };

      // Test component with 9 elements (should violate Miller's rule)
      const nineElementIntelligence: Intelligence = {
        ...mockButtonIntelligence,
        cognitiveLoad: 9,
      };

      const sevenResult = await service.analyzeComponent(
        'seven-element-component',
        sevenElementIntelligence
      );

      const nineResult = await service.analyzeComponent(
        'nine-element-component',
        nineElementIntelligence
      );

      expect(sevenResult.success).toBe(true);
      expect(nineResult.success).toBe(true);

      if (sevenResult.success && nineResult.success) {
        expect(sevenResult.data.millerRuleCompliance).toBe(true);
        expect(nineResult.data.millerRuleCompliance).toBe(false);
      }
    });
  });
});
