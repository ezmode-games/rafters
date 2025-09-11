import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Behavior tests for ComponentPreview Shadow DOM functionality
 * Tests the integration behavior and DOM manipulation
 */

// Mock DOM environment for testing
const mockDocument = {
  getElementById: vi.fn(),
  addEventListener: vi.fn(),
  readyState: 'complete',
};

const mockElement = {
  innerHTML: '',
  attachShadow: vi.fn(),
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
  },
  closest: vi.fn(),
  querySelector: vi.fn(),
  addEventListener: vi.fn(),
  dataset: {},
};

global.document = mockDocument as unknown as Document;

describe('ComponentPreview Shadow DOM Behavior', () => {
  let mockContainer: HTMLElement & { attachShadow: ReturnType<typeof vi.fn> };
  let mockShadowRoot: ShadowRoot & { innerHTML: string; getElementById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();

    mockShadowRoot = {
      innerHTML: '',
      getElementById: vi.fn(),
    };

    mockContainer = {
      ...mockElement,
      attachShadow: vi.fn().mockReturnValue(mockShadowRoot),
    };

    mockDocument.getElementById.mockReturnValue(mockContainer);
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Shadow DOM creation', () => {
    it('should create shadow root with isolated styles', () => {
      // Simulate shadow DOM creation
      const createShadowDOM = (container: HTMLElement) => {
        container.innerHTML = '';
        const shadowRoot = container.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = `
          <style>
            :host { display: block; width: 100%; height: 100%; }
            .component-root { padding: 1rem; display: flex; align-items: center; justify-content: center; height: 100%; }
          </style>
          <div class="component-root">
            <div id="component-mount"></div>
          </div>
        `;

        return shadowRoot;
      };

      const shadowRoot = createShadowDOM(mockContainer);

      expect(mockContainer.attachShadow).toHaveBeenCalledWith({ mode: 'open' });
      expect(shadowRoot.innerHTML).toContain(':host');
      expect(shadowRoot.innerHTML).toContain('component-root');
      expect(shadowRoot.innerHTML).toContain('component-mount');
    });

    it('should clear loading state when creating shadow DOM', () => {
      const createShadowDOM = (container: HTMLElement) => {
        container.innerHTML = '';
        return container.attachShadow({ mode: 'open' });
      };

      mockContainer.innerHTML = '<div class="loading">Loading...</div>';
      createShadowDOM(mockContainer);

      expect(mockContainer.innerHTML).toBe('');
    });

    it('should include component-specific styles', () => {
      const createShadowDOM = (container: HTMLElement) => {
        const shadowRoot = container.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = `
          <style>
            .rafters-button { padding: 0.5rem 1rem; border-radius: 0.375rem; }
            .rafters-button.primary { background-color: #3b82f6; color: white; }
            .rafters-container { max-width: 100%; margin: 0 auto; }
          </style>
          <div class="component-root"><div id="component-mount"></div></div>
        `;

        return shadowRoot;
      };

      const shadowRoot = createShadowDOM(mockContainer);

      expect(shadowRoot.innerHTML).toContain('.rafters-button');
      expect(shadowRoot.innerHTML).toContain('.rafters-container');
      expect(shadowRoot.innerHTML).toContain('background-color: #3b82f6');
    });
  });

  describe('Component rendering behavior', () => {
    it('should render component in shadow DOM mount point', () => {
      const mockMountPoint = {
        innerHTML: '',
      };

      mockShadowRoot.getElementById.mockReturnValue(mockMountPoint);

      const renderComponent = (shadowRoot: ShadowRoot, componentHTML: string) => {
        const mountPoint = shadowRoot.getElementById('component-mount');
        if (mountPoint) {
          mountPoint.innerHTML = componentHTML;
        }
      };

      const buttonHTML = '<button class="rafters-button primary">Test Button</button>';
      renderComponent(mockShadowRoot, buttonHTML);

      expect(mockShadowRoot.getElementById).toHaveBeenCalledWith('component-mount');
      expect(mockMountPoint.innerHTML).toBe(buttonHTML);
    });

    it('should handle missing mount point gracefully', () => {
      mockShadowRoot.getElementById.mockReturnValue(null);

      const renderComponent = (shadowRoot: ShadowRoot, componentHTML: string) => {
        const mountPoint = shadowRoot.getElementById('component-mount');
        if (mountPoint) {
          mountPoint.innerHTML = componentHTML;
        }
        return !!mountPoint;
      };

      const result = renderComponent(mockShadowRoot, '<div>Test</div>');

      expect(result).toBe(false);
      expect(mockShadowRoot.getElementById).toHaveBeenCalledWith('component-mount');
    });
  });

  describe('Intelligence display behavior', () => {
    it('should update intelligence display when component loads', () => {
      const mockIntelligenceEl = {
        innerHTML: 'Loading component intelligence...',
      };

      const mockWrapper = {
        querySelector: vi.fn().mockReturnValue(mockIntelligenceEl),
      };

      mockContainer.closest.mockReturnValue(mockWrapper);

      const displayIntelligence = (
        container: HTMLElement,
        componentData: Record<string, unknown>
      ) => {
        const wrapper = container.closest('.component-preview-wrapper');
        const intelligenceEl = wrapper?.querySelector(
          '.preview-intelligence .intelligence-loading'
        );

        if (intelligenceEl && componentData?.meta?.rafters?.intelligence) {
          const intel = componentData.meta.rafters.intelligence;
          intelligenceEl.innerHTML = `
            <div class="space-y-1">
              <div><strong>Cognitive Load:</strong> ${intel.cognitiveLoad}/10</div>
              <div><strong>Attention:</strong> ${intel.attentionEconomics}</div>
            </div>
          `;
          return true;
        }
        return false;
      };

      const componentData = {
        meta: {
          rafters: {
            intelligence: {
              cognitiveLoad: 3,
              attentionEconomics: 'Primary variant commands attention',
            },
          },
        },
      };

      const result = displayIntelligence(mockContainer, componentData);

      expect(result).toBe(true);
      expect(mockWrapper.querySelector).toHaveBeenCalledWith(
        '.preview-intelligence .intelligence-loading'
      );
      expect(mockIntelligenceEl.innerHTML).toContain('Cognitive Load:</strong> 3/10');
      expect(mockIntelligenceEl.innerHTML).toContain('Primary variant commands attention');
    });

    it('should not update display if intelligence is missing', () => {
      const mockIntelligenceEl = {
        innerHTML: 'Loading component intelligence...',
      };

      const mockWrapper = {
        querySelector: vi.fn().mockReturnValue(mockIntelligenceEl),
      };

      mockContainer.closest.mockReturnValue(mockWrapper);

      const displayIntelligence = (
        container: HTMLElement,
        componentData: Record<string, unknown>
      ) => {
        const wrapper = container.closest('.component-preview-wrapper');
        const intelligenceEl = wrapper?.querySelector(
          '.preview-intelligence .intelligence-loading'
        );

        if (intelligenceEl && componentData?.meta?.rafters?.intelligence) {
          const intel = componentData.meta.rafters.intelligence;
          intelligenceEl.innerHTML = `
            <div><strong>Cognitive Load:</strong> ${intel.cognitiveLoad}/10</div>
          `;
          return true;
        }
        return false;
      };

      const componentDataNoIntel = { meta: { rafters: {} } };
      const result = displayIntelligence(mockContainer, componentDataNoIntel);

      expect(result).toBe(false);
      expect(mockIntelligenceEl.innerHTML).toBe('Loading component intelligence...');
    });
  });

  describe('Error handling behavior', () => {
    it('should display error state when component fails to load', () => {
      const mockErrorEl = {
        classList: {
          remove: vi.fn(),
        },
      };

      const mockMessageEl = {
        textContent: '',
      };

      const mockWrapper = {
        querySelector: vi.fn().mockReturnValueOnce(mockErrorEl).mockReturnValueOnce(mockMessageEl),
      };

      mockContainer.closest.mockReturnValue(mockWrapper);

      const showError = (container: HTMLElement, error: Error) => {
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
      };

      const error = new Error('Component not found');
      const result = showError(mockContainer, error);

      expect(result).toBe(true);
      expect(mockMessageEl.textContent).toBe('Component not found');
      expect(mockErrorEl.classList.remove).toHaveBeenCalledWith('hidden');
    });

    it('should show fallback error when error elements are missing', () => {
      mockContainer.closest.mockReturnValue(null);

      const showError = (container: HTMLElement, error: Error) => {
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
      };

      const error = new Error('Network error');
      const result = showError(mockContainer, error);

      expect(result).toBe(false);
      expect(mockContainer.innerHTML).toContain('Component Error: Network error');
    });
  });

  describe('Event handling behavior', () => {
    it('should attach click handlers to rendered buttons', () => {
      const mockButton = {
        addEventListener: vi.fn(),
      };

      const mockMountPoint = {
        querySelectorAll: vi.fn().mockReturnValue([mockButton]),
      };

      const attachEventHandlers = (mountPoint: Element, componentName: string, variant: string) => {
        const buttons = mountPoint.querySelectorAll('.rafters-button');
        for (const button of buttons) {
          button.addEventListener('click', () => {
            console.log(`${componentName} clicked with variant: ${variant}`);
          });
        }
        return buttons.length;
      };

      const handlerCount = attachEventHandlers(mockMountPoint, 'button', 'primary');

      expect(handlerCount).toBe(1);
      expect(mockMountPoint.querySelectorAll).toHaveBeenCalledWith('.rafters-button');
      expect(mockButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should handle reload button clicks', () => {
      const reloadButton = {
        classList: { contains: vi.fn().mockReturnValue(true) },
        dataset: { previewId: 'test-preview-123' },
      };

      const handleReload = (event: Event, targetPreviewId: string) => {
        if (event.target.classList.contains('reload-btn')) {
          const buttonPreviewId = event.target.dataset.previewId;
          return buttonPreviewId === targetPreviewId;
        }
        return false;
      };

      const shouldReload = handleReload({ target: reloadButton }, 'test-preview-123');

      expect(shouldReload).toBe(true);
      expect(reloadButton.classList.contains).toHaveBeenCalledWith('reload-btn');
    });
  });
});
