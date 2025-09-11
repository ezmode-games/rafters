/**
 * Test fixtures for ComponentPreview
 * Provides reusable test data and mock implementations
 */
import { vi } from 'vitest';

export const mockComponentData = {
  button: {
    name: 'button',
    type: 'registry:component',
    description: 'Interactive button component for user actions',
    meta: {
      rafters: {
        version: '0.1.0',
        intelligence: {
          cognitiveLoad: 3,
          attentionEconomics: 'Primary variant commands highest attention - use sparingly',
          trustBuilding: 'Destructive actions require confirmation patterns',
          accessibility: 'WCAG AAA compliant with 44px minimum touch targets',
          semanticMeaning:
            'primary=main actions, secondary=supporting actions, destructive=irreversible actions',
        },
        usagePatterns: {
          dos: [
            'Primary: Main user goal, maximum 1 per section',
            'Secondary: Alternative paths, supporting actions',
          ],
          nevers: ['Multiple primary buttons competing for attention'],
        },
      },
    },
  },

  container: {
    name: 'container',
    type: 'registry:component',
    description: 'Layout container component for content width control',
    meta: {
      rafters: {
        version: '0.1.0',
        intelligence: {
          cognitiveLoad: 0,
          attentionEconomics:
            'Neutral structural element - controls content width without competing for attention',
          trustBuilding: 'Predictable boundaries and consistent spacing patterns',
          accessibility: 'Semantic HTML elements with proper landmark roles',
          semanticMeaning: 'Content width control and semantic structure',
        },
        usagePatterns: {
          dos: [
            'Use padding prop for internal breathing room',
            'Apply semantic structure with as="main|section|article"',
          ],
          nevers: ['Use margins for content spacing (use padding instead)'],
        },
      },
    },
  },

  grid: {
    name: 'grid',
    type: 'registry:component',
    description: 'Intelligent layout grid with semantic presets',
    meta: {
      rafters: {
        version: '0.1.0',
        intelligence: {
          cognitiveLoad: 4,
          attentionEconomics:
            'Preset hierarchy: linear=democratic attention, golden=hierarchical flow',
          trustBuilding: 'Mathematical spacing (golden ratio), consistent preset behavior',
          accessibility: 'WCAG AAA compliance with keyboard navigation',
          semanticMeaning: 'Layout intelligence: linear=equal-priority, golden=natural hierarchy',
        },
        usagePatterns: {
          dos: [
            'Linear - Product catalogs, image galleries, equal-priority content',
            'Golden - Editorial layouts, feature showcases',
          ],
          nevers: ['Exceed cognitive load limits (8 items max on wide screens)'],
        },
      },
    },
  },
};

export const mockProps = {
  empty: {},
  buttonPrimary: { variant: 'primary', children: 'Click me' },
  buttonDestructive: { variant: 'destructive', children: 'Delete', disabled: false },
  containerMain: { as: 'main', padding: 'comfortable' },
  gridLinear: { preset: 'linear', gap: 'md' },
};

export const expectedHTML = {
  buttonPrimary: '<button class="rafters-button primary" data-cognitive-load="3">Click me</button>',
  buttonDefault:
    '<button class="rafters-button default" data-cognitive-load="3">default Button</button>',
  container: '<div class="rafters-container" data-cognitive-load="0">',
  gridPlaceholder: '<div class="component-placeholder" data-cognitive-load="4">',
};

export const mockDOMElements = {
  createContainer: () => ({
    innerHTML: '',
    attachShadow: vi.fn().mockReturnValue({
      innerHTML: '',
      getElementById: vi.fn(),
    }),
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
    },
    closest: vi.fn(),
    querySelector: vi.fn(),
    addEventListener: vi.fn(),
    dataset: {},
  }),

  createShadowRoot: () => ({
    innerHTML: '',
    getElementById: vi.fn(),
  }),

  createWrapper: (hasIntelligence = true, hasError = true) => ({
    querySelector: vi.fn((selector: string) => {
      if (selector.includes('intelligence-loading') && hasIntelligence) {
        return { innerHTML: 'Loading component intelligence...' };
      }
      if (selector.includes('error-state') && hasError) {
        return { classList: { remove: vi.fn() } };
      }
      if (selector.includes('error-message') && hasError) {
        return { textContent: '' };
      }
      return null;
    }),
  }),
};

export const mockFetchResponses = {
  buttonSuccess: {
    ok: true,
    json: () => Promise.resolve(mockComponentData.button),
  },

  containerSuccess: {
    ok: true,
    json: () => Promise.resolve(mockComponentData.container),
  },

  notFound: {
    ok: false,
    status: 404,
  },

  networkError: () => Promise.reject(new Error('Network error')),
};

export class ComponentPreviewFixture {
  private componentName: string;
  private variant: string;
  private props: Record<string, unknown>;
  private mockContainer: HTMLElement & { attachShadow: ReturnType<typeof vi.fn> };
  private mockShadowRoot: ShadowRoot & {
    innerHTML: string;
    getElementById: ReturnType<typeof vi.fn>;
  };

  constructor(componentName = 'button', variant = 'primary', props = {}) {
    this.componentName = componentName;
    this.variant = variant;
    this.props = props;
    this.mockContainer = mockDOMElements.createContainer();
    this.mockShadowRoot = mockDOMElements.createShadowRoot();
    this.mockContainer.attachShadow.mockReturnValue(this.mockShadowRoot);
  }

  // Core methods that would be in the actual ComponentPreview class
  parseProps(propsString: string) {
    try {
      return JSON.parse(propsString || '{}');
    } catch (e) {
      // Only log in non-test environments to avoid noise
      if (!globalThis.vitest) {
        console.warn('Failed to parse props:', e);
      }
      return {};
    }
  }

  async loadComponentData(componentName: string) {
    const response = await fetch(`/registry/components/${componentName}.json`);
    if (!response.ok) {
      throw new Error(`Component ${componentName} not found in registry`);
    }
    return response.json();
  }

  generateComponentHTML(
    componentData: Record<string, unknown>,
    variant: string,
    props: Record<string, unknown>
  ) {
    const { name } = componentData;
    const cognitive = componentData.meta?.rafters?.intelligence?.cognitiveLoad || 0;

    switch (name) {
      case 'button':
        return `<button class="rafters-button ${variant}" data-cognitive-load="${cognitive}">${props.children || `${variant} Button`}</button>`;

      case 'container':
        return `<div class="rafters-container" data-cognitive-load="${cognitive}"><p>Container component (Cognitive Load: ${cognitive}/10)</p></div>`;

      case 'grid':
        return `<div class="rafters-grid" data-cognitive-load="${cognitive}"><div class="rafters-grid-item">Grid Item 1</div></div>`;

      default:
        return `<div class="component-placeholder" data-cognitive-load="${cognitive}"><h3>${name} Component</h3><p>Variant: ${variant}</p></div>`;
    }
  }

  formatIntelligence(intelligence: Record<string, unknown> | null | undefined) {
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
  }

  createShadowDOM(container: HTMLElement) {
    container.innerHTML = '';
    const shadowRoot = container.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; height: 100%; }
        .component-root { padding: 1rem; display: flex; align-items: center; justify-content: center; height: 100%; }
        .rafters-button { padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; }
        .rafters-button.primary { background-color: #3b82f6; color: white; }
        .rafters-container { max-width: 100%; margin: 0 auto; padding: 1rem; }
      </style>
      <div class="component-root">
        <div id="component-mount"></div>
      </div>
    `;

    return shadowRoot;
  }

  renderComponent(shadowRoot: ShadowRoot, componentHTML: string) {
    const mountPoint = shadowRoot.getElementById('component-mount');
    if (mountPoint) {
      mountPoint.innerHTML = componentHTML;
      return true;
    }
    return false;
  }

  displayIntelligence(container: HTMLElement, componentData: Record<string, unknown>) {
    const wrapper = container.closest('.component-preview-wrapper');
    const intelligenceEl = wrapper?.querySelector('.preview-intelligence .intelligence-loading');

    if (intelligenceEl && componentData?.meta?.rafters?.intelligence) {
      const intel = componentData.meta.rafters.intelligence;
      intelligenceEl.innerHTML = this.formatIntelligence(intel);
      return true;
    }
    return false;
  }

  showError(container: HTMLElement, error: Error) {
    const wrapper = container.closest('.component-preview-wrapper');
    const errorEl = wrapper?.querySelector('.error-state');
    const messageEl = wrapper?.querySelector('.error-message');

    if (errorEl && messageEl) {
      messageEl.textContent = error.message;
      errorEl.classList.remove('hidden');
      return true;
    }

    // Fallback
    container.innerHTML = `
      <div class="error-fallback">
        <div>Component Error: ${error.message}</div>
      </div>
    `;
    return false;
  }

  // Getters for test access
  get container() {
    return this.mockContainer;
  }
  get shadowRoot() {
    return this.mockShadowRoot;
  }
  get name() {
    return this.componentName;
  }
}

// Global mock setup for vitest
export const setupMocks = () => {
  const mockDocument = {
    getElementById: vi.fn(),
    addEventListener: vi.fn(),
    readyState: 'complete',
  };

  global.document = mockDocument as unknown as Document;
  global.fetch = vi.fn();

  return { mockDocument };
};
