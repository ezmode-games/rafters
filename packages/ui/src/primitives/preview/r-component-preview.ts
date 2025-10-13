/**
 * r-component-preview - Component Preview Web Component
 *
 * Renders framework component previews with smart class swapping for infinite prop combinations.
 * Fetches preview data from registry and computes classes using CVA intelligence.
 *
 * @element r-component-preview
 * @fires preview-loaded - Fired when preview data is successfully loaded
 * @fires preview-error - Fired when preview loading fails
 */

import { type Preview, PreviewSchema } from '@rafters/shared';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FrameworkAdapter } from './adapters/framework-adapter';
import { ReactAdapter } from './adapters/react-adapter';

@customElement('r-component-preview')
export class RComponentPreview extends LitElement {
  /**
   * Component name to preview (e.g., "button")
   */
  @property({ type: String })
  component = '';

  /**
   * Preview variant to render (e.g., "default", "primary")
   */
  @property({ type: String })
  variant = 'default';

  /**
   * Disabled state
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Loading state
   */
  @property({ type: Boolean })
  loading = false;

  /**
   * Dynamic props for class computation
   */
  @property({
    type: Object,
    converter: {
      fromAttribute: (value: string | null) => {
        if (!value) return {};
        try {
          // Decode HTML entities that Astro adds to attribute values
          const decoded = value
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
          return JSON.parse(decoded);
        } catch {
          return {};
        }
      },
    },
  })
  props: Record<string, unknown> = {};

  /**
   * Preview data fetched from registry
   */
  @state()
  private previewData: Preview | null = null;

  /**
   * Error message if fetch fails
   */
  @state()
  private error: string | null = null;

  /**
   * Loading state while fetching
   */
  @state()
  private isLoading = false;

  /**
   * Global stylesheet loaded once and shared across all instances
   */
  private static globalStylesheet: string | null = null;
  private static stylesheetLoadPromise: Promise<void> | null = null;

  /**
   * Framework adapter for rendering compiled components
   */
  private adapter: FrameworkAdapter | null = null;

  /**
   * Container element for framework component mounting
   */
  private container: HTMLElement | null = null;

  /**
   * Lifecycle: Fetch preview data when component connects to DOM
   */
  override async connectedCallback() {
    super.connectedCallback();
    await this.loadGlobalStylesheet();
    await this.fetchPreviewData();
    await this.renderFrameworkComponent();
  }

  /**
   * Load global stylesheet once (shared across all instances)
   */
  private async loadGlobalStylesheet(): Promise<void> {
    // If already loaded, return immediately
    if (RComponentPreview.globalStylesheet !== null) {
      return;
    }

    // If currently loading, wait for that promise
    if (RComponentPreview.stylesheetLoadPromise !== null) {
      return RComponentPreview.stylesheetLoadPromise;
    }

    // Start loading
    RComponentPreview.stylesheetLoadPromise = (async () => {
      try {
        const response = await fetch('/globals.css');
        if (!response.ok) {
          throw new Error(`Failed to fetch globals.css: ${response.statusText}`);
        }
        RComponentPreview.globalStylesheet = await response.text();
      } catch (err) {
        console.error('Failed to load global stylesheet:', err);
        RComponentPreview.globalStylesheet = '';
      } finally {
        RComponentPreview.stylesheetLoadPromise = null;
      }
    })();

    return RComponentPreview.stylesheetLoadPromise;
  }

  /**
   * Fetch preview data from registry endpoint
   */
  private async fetchPreviewData(): Promise<void> {
    if (!this.component) {
      this.error = 'Component name is required';
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const url = `/registry/components/${this.component}/preview/${this.variant}.json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch preview: ${response.statusText}`);
      }

      const json = await response.json();
      const data = PreviewSchema.parse(json);

      this.previewData = data;
      this.dispatchEvent(new CustomEvent('preview-loaded', { detail: data }));
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load preview';
      this.dispatchEvent(new CustomEvent('preview-error', { detail: this.error }));
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Compute final classes from CVA intelligence and current props
   * Public for testing purposes
   */
  computeClasses(): string {
    if (!this.previewData?.cva) {
      return '';
    }

    const { cva } = this.previewData;

    const classes: string[] = [...cva.baseClasses];

    // Add mapped classes based on prop values
    for (const mapping of cva.propMappings) {
      const propValue = this.props[mapping.propName];
      if (propValue && typeof propValue === 'string') {
        const mappedClasses = mapping.values[propValue];
        if (mappedClasses) {
          classes.push(...mappedClasses);
        }
      }
    }

    // Add state classes
    if (this.disabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
    }
    if (this.loading) {
      classes.push('animate-pulse');
    }

    return classes.join(' ');
  }

  /**
   * Render framework component using adapter
   */
  private async renderFrameworkComponent(): Promise<void> {
    if (!this.previewData) return;

    try {
      // Get framework adapter (only React for now)
      this.adapter = new ReactAdapter();
      await this.adapter.loadRuntime();

      // Create container for React mounting
      this.container = document.createElement('div');
      this.container.className = 'framework-component-container';

      // Get slot content to pass as children
      const children = this.textContent?.trim() || null;

      // Mount the compiled component
      await this.adapter.mount(this.container, this.previewData.compiledJs, this.props, children);

      // Add container to shadow DOM (after first render completes)
      await this.updateComplete;
      const previewContainer = this.shadowRoot?.querySelector('.preview-container');
      if (previewContainer) {
        previewContainer.appendChild(this.container);
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to render component';
      this.requestUpdate();
    }
  }

  /**
   * Lifecycle: Cleanup on disconnect
   */
  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.adapter) {
      this.adapter.unmount();
      this.adapter = null;
    }
    this.container = null;
  }

  /**
   * Render the component preview
   */
  override render() {
    // Loading state
    if (this.isLoading) {
      return html`
				<div class="preview-loading" role="status" aria-live="polite">
					<span class="sr-only">Loading preview...</span>
					<div class="loading-spinner" aria-hidden="true"></div>
				</div>
			`;
    }

    // Error state
    if (this.error) {
      return html`
				<div class="preview-error" role="alert" aria-live="assertive">
					<span class="error-icon" aria-hidden="true">⚠</span>
					<span class="error-message">${this.error}</span>
				</div>
			`;
    }

    // No data
    if (!this.previewData) {
      return html`
				<div class="preview-empty" role="status">
					<span>No preview data available</span>
				</div>
			`;
    }

    // Inject complete global stylesheet into Shadow DOM
    const globalCSS = RComponentPreview.globalStylesheet || '';

    return html`
			<style>
				${unsafeCSS(globalCSS)}
			</style>
			<div
				class="preview-container"
				role="region"
				aria-label="Component preview"
			>
				<!-- React component will be mounted here by renderFrameworkComponent() -->
			</div>
		`;
  }

  /**
   * Component styles (for preview container, not the component itself)
   */
  static override styles = css`
		:host {
			display: block;
			position: relative;
		}

		.preview-loading,
		.preview-error,
		.preview-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100px;
			padding: 1rem;
		}

		.preview-error {
			gap: 0.5rem;
			color: #dc2626;
			background: #fee2e2;
			border: 1px solid #fecaca;
			border-radius: 0.375rem;
		}

		.error-icon {
			font-size: 1.25rem;
		}

		.loading-spinner {
			width: 2rem;
			height: 2rem;
			border: 3px solid #e5e7eb;
			border-top-color: #3b82f6;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}

		.sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border-width: 0;
		}

		.preview-container {
			position: relative;
		}
	`;
}

declare global {
  interface HTMLElementTagNameMap {
    'r-component-preview': RComponentPreview;
  }
}
