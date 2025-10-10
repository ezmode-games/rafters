/**
 * r-component-preview Web Component
 *
 * Renders interactive component previews with CVA-based class swapping.
 * Fetches component intelligence from registry and renders with proper styling.
 */

import {
  type ComponentManifest,
  ComponentManifestSchema,
  type CVAIntelligence,
} from '@rafters/shared';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * State utility classes for disabled and loading states
 */
const STATE_CLASSES = {
  DISABLED: ['opacity-50', 'cursor-not-allowed'],
  LOADING: ['animate-pulse'],
} as const;

@customElement('r-component-preview')
export class RComponentPreview extends LitElement {
  /**
   * Component name to preview (e.g., "button", "input")
   */
  @property({ type: String })
  component = '';

  /**
   * CVA variant prop value (e.g., "default", "destructive")
   */
  @property({ type: String })
  variant?: string;

  /**
   * CVA size prop value (e.g., "sm", "md", "lg")
   */
  @property({ type: String })
  size?: string;

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
   * Registry base URL (defaults to localhost for development)
   */
  @property({ type: String })
  registryUrl = 'http://localhost:4321';

  @state()
  private componentData: ComponentManifest | null = null;

  @state()
  private error: string | null = null;

  @state()
  private isLoading = true;

  /**
   * Fetch component data from registry when connected
   */
  override async connectedCallback() {
    super.connectedCallback();

    if (!this.component) {
      this.error = 'Component name is required';
      this.isLoading = false;
      return;
    }

    try {
      const url = `${this.registryUrl}/registry/components/${this.component}.json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch component data: ${response.status} ${response.statusText}`
        );
      }

      const rawData = await response.json();
      const parseResult = ComponentManifestSchema.safeParse(rawData);

      if (!parseResult.success) {
        throw new Error('Invalid component data format');
      }

      this.componentData = parseResult.data;
      this.isLoading = false;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load component';
      this.isLoading = false;
    }
  }

  /**
   * Compute final class string from CVA intelligence and current props
   */
  private computeClasses(): string {
    if (!this.componentData) return '';

    const cva: CVAIntelligence | undefined = this.componentData.meta?.rafters?.intelligence?.cva;

    if (!cva) return '';

    const classes: string[] = [...(cva.baseClasses || [])];

    // Apply variant/size mappings from propMappings
    if (cva.propMappings) {
      for (const mapping of cva.propMappings) {
        const propName = mapping.propName;
        let propValue: string | undefined;

        // Map property names to component attributes
        if (propName === 'variant' && this.variant) {
          propValue = this.variant;
        } else if (propName === 'size' && this.size) {
          propValue = this.size;
        }

        // Add mapped classes for this prop value
        if (propValue && mapping.values[propValue]) {
          classes.push(...mapping.values[propValue]);
        }
      }
    }

    // Add state classes
    if (this.disabled) {
      classes.push(...STATE_CLASSES.DISABLED);
    }
    if (this.loading) {
      classes.push(...STATE_CLASSES.LOADING);
    }

    return classes.join(' ');
  }

  /**
   * Get critical CSS from component data
   */
  private getCriticalCSS(): string {
    if (!this.componentData) return '';

    const cva: CVAIntelligence | undefined = this.componentData.meta?.rafters?.intelligence?.cva;

    return cva?.css || '';
  }

  /**
   * Render critical CSS style block if available
   */
  private renderCriticalCSS() {
    const criticalCSS = this.getCriticalCSS();
    if (!criticalCSS) return '';

    return html`<style>
      ${unsafeCSS(criticalCSS)}
    </style>`;
  }

  static override styles = css`
    :host {
      display: block;
    }

    .preview-container {
      padding: 1rem;
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 0.5rem;
      background: var(--background, #ffffff);
    }

    .preview-error {
      color: var(--destructive, #ef4444);
      padding: 1rem;
      border: 1px solid var(--destructive, #ef4444);
      border-radius: 0.5rem;
      background: var(--destructive-foreground, #fef2f2);
    }

    .preview-loading {
      padding: 1rem;
      text-align: center;
      color: var(--muted-foreground, #6b7280);
    }
  `;

  override render() {
    if (this.isLoading) {
      return html`
        <div class="preview-loading" role="status" aria-live="polite">
          Loading preview...
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="preview-error" role="alert">
          <strong>Error:</strong> ${this.error}
        </div>
      `;
    }

    if (!this.componentData) {
      return html`
        <div class="preview-error" role="alert">
          <strong>Error:</strong> No component data available
        </div>
      `;
    }

    const computedClasses = this.computeClasses();

    return html`
      ${this.renderCriticalCSS()}

      <div class="preview-container">
        <button
          class="${computedClasses}"
          ?disabled="${this.disabled}"
          aria-disabled="${this.disabled}"
        >
          ${this.loading ? 'Loading...' : 'Preview Button'}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-component-preview': RComponentPreview;
  }
}
