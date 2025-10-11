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

import type { Preview } from '@rafters/shared';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface CVAIntelligence {
  baseClasses: string[];
  propMappings: Array<{
    propName: string;
    values: Record<string, string[]>;
  }>;
  allClasses: string[];
}

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
  @property({ type: Object })
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
   * Lifecycle: Fetch preview data when component connects to DOM
   */
  override async connectedCallback() {
    super.connectedCallback();
    await this.fetchPreviewData();
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

      const data = await response.json();

      // Basic validation
      if (!data.cva || !data.css || !data.dependencies) {
        throw new Error('Invalid preview data: missing required fields');
      }

      this.previewData = data as Preview;
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

    const cva = this.previewData.cva as CVAIntelligence;
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

    const computedClasses = this.computeClasses();

    // Inject critical CSS into Shadow DOM
    const criticalCSS = this.previewData.css || '';

    return html`
			<style>
				${unsafeCSS(criticalCSS)}
			</style>
			<div
				class="preview-container"
				role="region"
				aria-label="Component preview"
			>
				<div
					class="${computedClasses}"
					?disabled="${this.disabled}"
					aria-busy="${this.loading}"
				>
					<slot></slot>
				</div>
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
