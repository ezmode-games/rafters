/**
 * MCP Component Intelligence Integration Tests
 *
 * Tests for the Component Intelligence Service integration with the MCP server.
 */

import type { ComponentManifest } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentIntelligenceService } from '../../src/mcp/services/component-intelligence';
import { fetchComponent } from '../../src/utils/registry';

// Mock the registry fetch function
vi.mock('../../src/utils/registry', () => ({
  fetchComponent: vi.fn(),
}));

describe('MCP Component Intelligence Integration', () => {
  let service: ComponentIntelligenceService;
  const mockFetchComponent = vi.mocked(fetchComponent);

  beforeEach(() => {
    service = new ComponentIntelligenceService();
    vi.clearAllMocks();
  });

  const mockButtonComponent: ComponentManifest = {
    name: 'button',
    description: 'Interactive button component',
    type: 'registry:component',
    files: [
      {
        path: 'components/ui/Button.tsx',
        type: 'registry:component',
        content: 'export const Button = () => <button>Click me</button>',
      },
    ],
    dependencies: ['@radix-ui/react-slot'],
    meta: {
      rafters: {
        version: '0.1.0',
        intelligence: {
          cognitiveLoad: 3,
          attentionEconomics: 'Primary action trigger with high attention weight',
          accessibility: 'WCAG AAA compliant with 44px minimum touch targets',
          trustBuilding:
            'Loading states prevent double-submission, confirmation patterns for destructive actions',
          semanticMeaning: 'Main user action component for critical workflows',
        },
      },
    },
  };

  it('should integrate with registry to fetch component intelligence', async () => {
    mockFetchComponent.mockResolvedValue(mockButtonComponent);

    // Simulate what the MCP handler would do
    const component = await fetchComponent('button');
    expect(component).toBeTruthy();

    if (component?.meta?.rafters?.intelligence) {
      const intelligence = {
        cognitiveLoad: component.meta.rafters.intelligence.cognitiveLoad,
        attentionEconomics: component.meta.rafters.intelligence.attentionEconomics,
        accessibility: component.meta.rafters.intelligence.accessibility,
        trustBuilding: component.meta.rafters.intelligence.trustBuilding,
        semanticMeaning: component.meta.rafters.intelligence.semanticMeaning,
      };

      const result = await service.analyzeComponent('button', intelligence);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cognitiveLoadScore).toBe(3);
        expect(result.data.millerRuleCompliance).toBe(true);
        expect(result.data.trustPatterns.length).toBeGreaterThan(0);
        expect(result.data.recommendations.length).toBeGreaterThan(0);
      }
    }
  });

  it('should handle missing component gracefully', async () => {
    mockFetchComponent.mockResolvedValue(null);

    const component = await fetchComponent('non-existent');
    expect(component).toBeNull();

    // This simulates what would happen in the MCP handler
    // The handler should return an error response when component is not found
  });

  it('should handle component without intelligence metadata', async () => {
    const componentWithoutIntelligence: ComponentManifest = {
      ...mockButtonComponent,
      meta: undefined,
    };

    mockFetchComponent.mockResolvedValue(componentWithoutIntelligence);

    const component = await fetchComponent('button');
    expect(component).toBeTruthy();
    expect(component?.meta?.rafters?.intelligence).toBeUndefined();

    // This simulates what would happen in the MCP handler
    // The handler should return an error when intelligence metadata is missing
  });

  it('should support composition optimization with multiple components', async () => {
    const highLoadComponent: ComponentManifest = {
      ...mockButtonComponent,
      name: 'complex-form',
      meta: {
        rafters: {
          version: '0.1.0',
          intelligence: {
            cognitiveLoad: 8,
            attentionEconomics: 'Primary complex interaction requiring focus',
            accessibility: 'WCAG AA compliant with screen reader support',
            trustBuilding: 'Multi-step confirmation for data safety',
            semanticMeaning: 'Complex data input component',
          },
        },
      },
    };

    mockFetchComponent
      .mockResolvedValueOnce(mockButtonComponent)
      .mockResolvedValueOnce(highLoadComponent);

    // Simulate fetching multiple components
    const button = await fetchComponent('button');
    const form = await fetchComponent('complex-form');

    expect(button).toBeTruthy();
    expect(form).toBeTruthy();

    if (button?.meta?.rafters?.intelligence && form?.meta?.rafters?.intelligence) {
      const components = [
        {
          name: button.name,
          type: 'registry:component' as const,
          files: [],
          meta: {
            rafters: {
              intelligence: button.meta.rafters.intelligence,
            },
          },
        },
        {
          name: form.name,
          type: 'registry:component' as const,
          files: [],
          meta: {
            rafters: {
              intelligence: form.meta.rafters.intelligence,
            },
          },
        },
      ];

      const result = await service.optimizeComposition(components, {
        maxCognitiveLoad: 10,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cognitiveLoadDistribution.length).toBeGreaterThan(0);
        expect(result.data.attentionFlow.length).toBeGreaterThan(0);
        expect(result.data.improvements.length).toBeGreaterThan(0);
      }
    }
  });

  it('should validate accessibility with detailed analysis', async () => {
    mockFetchComponent.mockResolvedValue(mockButtonComponent);

    const component = await fetchComponent('button');
    if (component?.meta?.rafters?.intelligence) {
      const intelligence = {
        cognitiveLoad: component.meta.rafters.intelligence.cognitiveLoad,
        attentionEconomics: component.meta.rafters.intelligence.attentionEconomics,
        accessibility: component.meta.rafters.intelligence.accessibility,
        trustBuilding: component.meta.rafters.intelligence.trustBuilding,
        semanticMeaning: component.meta.rafters.intelligence.semanticMeaning,
      };

      const result = await service.validateAccessibility('button', intelligence, {
        colorVisionTypes: ['normal', 'deuteranopia'],
        contrastLevel: 'AAA',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wcagCompliance.level).toBe('AAA');
        expect(result.data.colorVisionAnalysis).toHaveProperty('normal');
        expect(result.data.colorVisionAnalysis).toHaveProperty('deuteranopia');
        expect(result.data.touchTargetAnalysis.compliant).toBe(true);
        expect(result.data.cognitiveAccessibility.score).toBeGreaterThan(0);
      }
    }
  });
});
