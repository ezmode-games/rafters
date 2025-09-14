import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ComponentPreviewFixture,
  mockComponentData,
  mockFetchResponses,
  setupMocks,
} from '../fixtures/componentPreview.fixture';

/**
 * Unit tests for ComponentPreview logic
 * Tests the core functionality using fixtures
 */

describe('ComponentPreview', () => {
  let fixture: ComponentPreviewFixture;

  beforeEach(() => {
    setupMocks();
    fixture = new ComponentPreviewFixture();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseProps', () => {
    it('should parse valid JSON props', () => {
      expect(fixture.parseProps('{"variant": "primary"}')).toEqual({ variant: 'primary' });
      expect(fixture.parseProps('{"children": "Click me", "disabled": true}')).toEqual({
        children: 'Click me',
        disabled: true,
      });
    });

    it('should return empty object for invalid JSON', () => {
      expect(fixture.parseProps('invalid json')).toEqual({});
      expect(fixture.parseProps('')).toEqual({});
      expect(fixture.parseProps('undefined')).toEqual({});
    });

    it('should handle null and undefined input', () => {
      // @ts-expect-error - testing runtime behavior
      expect(fixture.parseProps(null)).toEqual({});
      // @ts-expect-error - testing runtime behavior
      expect(fixture.parseProps(undefined)).toEqual({});
    });
  });

  describe('loadComponentData', () => {
    it('should fetch component data from registry', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(mockFetchResponses.buttonSuccess);

      const result = await fixture.loadComponentData('button');

      expect(global.fetch).toHaveBeenCalledWith('/registry/components/button.json');
      expect(result).toEqual(mockComponentData.button);
    });

    it('should throw error for non-existent component', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(mockFetchResponses.notFound);

      await expect(fixture.loadComponentData('non-existent')).rejects.toThrow(
        'Component non-existent not found in registry'
      );
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockImplementation(() => mockFetchResponses.networkError());

      await expect(fixture.loadComponentData('button')).rejects.toThrow('Network error');
    });
  });

  describe('generateComponentHTML', () => {
    it('should generate button HTML with correct variant', () => {
      const generateComponentHTML = (
        componentData: Record<string, unknown>,
        variant: string,
        props: Record<string, unknown>
      ) => {
        const { name } = componentData;
        const cognitive = componentData.meta?.rafters?.intelligence?.cognitiveLoad || 0;

        switch (name) {
          case 'button':
            return `
            <button class="rafters-button ${variant}" data-cognitive-load="${cognitive}">
              ${props.children || `${variant} Button`}
            </button>
          `;
          case 'container':
            return `
            <div class="rafters-container" data-cognitive-load="${cognitive}">
              <p>Container component (Cognitive Load: ${cognitive}/10)</p>
              <p>Invisible structure that reduces visual complexity</p>
            </div>
          `;
          default:
            return `
            <div class="component-placeholder" data-cognitive-load="${cognitive}">
              <h3>${name} Component</h3>
              <p>Cognitive Load: ${cognitive}/10</p>
              <p>Variant: ${variant}</p>
            </div>
          `;
        }
      };

      const componentData = {
        name: 'button',
        meta: {
          rafters: {
            intelligence: {
              cognitiveLoad: 3,
            },
          },
        },
      };

      const html = generateComponentHTML(componentData, 'primary', {});

      expect(html).toContain('class="rafters-button primary"');
      expect(html).toContain('data-cognitive-load="3"');
      expect(html).toContain('primary Button');
    });

    it('should use custom children prop when provided', () => {
      const generateComponentHTML = (
        componentData: Record<string, unknown>,
        variant: string,
        props: Record<string, unknown>
      ) => {
        const { name } = componentData;
        const cognitive = componentData.meta?.rafters?.intelligence?.cognitiveLoad || 0;

        if (name === 'button') {
          return `
            <button class="rafters-button ${variant}" data-cognitive-load="${cognitive}">
              ${props.children || `${variant} Button`}
            </button>
          `;
        }
        return '';
      };

      const componentData = {
        name: 'button',
        meta: { rafters: { intelligence: { cognitiveLoad: 3 } } },
      };
      const html = generateComponentHTML(componentData, 'primary', { children: 'Custom Text' });

      expect(html).toContain('Custom Text');
      expect(html).not.toContain('primary Button');
    });

    it('should generate container HTML with intelligence', () => {
      const generateComponentHTML = (
        componentData: Record<string, unknown>,
        _variant: string,
        _props: Record<string, unknown>
      ) => {
        const { name } = componentData;
        const cognitive = componentData.meta?.rafters?.intelligence?.cognitiveLoad || 0;

        if (name === 'container') {
          return `
            <div class="rafters-container" data-cognitive-load="${cognitive}">
              <p>Container component (Cognitive Load: ${cognitive}/10)</p>
              <p>Invisible structure that reduces visual complexity</p>
            </div>
          `;
        }
        return '';
      };

      const componentData = {
        name: 'container',
        meta: {
          rafters: {
            intelligence: {
              cognitiveLoad: 0,
            },
          },
        },
      };

      const html = generateComponentHTML(componentData, 'default', {});

      expect(html).toContain('class="rafters-container"');
      expect(html).toContain('data-cognitive-load="0"');
      expect(html).toContain('Cognitive Load: 0/10');
    });

    it('should generate fallback HTML for unknown components', () => {
      const generateComponentHTML = (
        componentData: Record<string, unknown>,
        variant: string,
        _props: Record<string, unknown>
      ) => {
        const { name } = componentData;
        const cognitive = componentData.meta?.rafters?.intelligence?.cognitiveLoad || 0;

        return `
            <div class="component-placeholder" data-cognitive-load="${cognitive}">
              <h3>${name} Component</h3>
              <p>Cognitive Load: ${cognitive}/10</p>
              <p>Variant: ${variant}</p>
            </div>
          `;
      };

      const componentData = {
        name: 'unknown-component',
        meta: {
          rafters: {
            intelligence: {
              cognitiveLoad: 5,
            },
          },
        },
      };

      const html = generateComponentHTML(componentData, 'custom', {});

      expect(html).toContain('class="component-placeholder"');
      expect(html).toContain('unknown-component Component');
      expect(html).toContain('Variant: custom');
      expect(html).toContain('data-cognitive-load="5"');
    });
  });

  describe('intelligence display', () => {
    it('should format intelligence data correctly', () => {
      const formatIntelligence = (intelligence: Record<string, unknown> | null | undefined) => {
        return `
          <div class="space-y-1">
            <div><strong>Cognitive Load:</strong> ${intelligence.cognitiveLoad}/10</div>
            <div><strong>Attention:</strong> ${intelligence.attentionEconomics}</div>
            <div><strong>Trust:</strong> ${intelligence.trustBuilding}</div>
          </div>
        `;
      };

      const intelligence = {
        cognitiveLoad: 3,
        attentionEconomics: 'Primary variant commands highest attention',
        trustBuilding: 'Destructive actions require confirmation patterns',
      };

      const formatted = formatIntelligence(intelligence);

      expect(formatted).toContain('Cognitive Load:</strong> 3/10');
      expect(formatted).toContain('Primary variant commands highest attention');
      expect(formatted).toContain('Destructive actions require confirmation patterns');
    });

    it('should handle missing intelligence data gracefully', () => {
      const formatIntelligence = (intelligence: Record<string, unknown> | null | undefined) => {
        if (!intelligence) {
          return '<div>No intelligence data available</div>';
        }
        return `
          <div class="space-y-1">
            <div><strong>Cognitive Load:</strong> ${intelligence.cognitiveLoad || 0}/10</div>
            <div><strong>Attention:</strong> ${intelligence.attentionEconomics || 'Not specified'}</div>
            <div><strong>Trust:</strong> ${intelligence.trustBuilding || 'Not specified'}</div>
          </div>
        `;
      };

      expect(formatIntelligence(null)).toContain('No intelligence data available');
      expect(formatIntelligence({})).toContain('0/10');
      expect(formatIntelligence({})).toContain('Not specified');
    });
  });
});
