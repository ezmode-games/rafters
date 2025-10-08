import { css, html, LitElement, type TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { z } from 'zod';

const PreviewIntelligenceSchema = z.object({
  component: z.string(),
  baseClasses: z.array(z.string()),
  propMappings: z.array(
    z.object({
      propName: z.string(),
      values: z.record(z.string(), z.array(z.string())),
    })
  ),
  allClasses: z.array(z.string()),
  criticalCSS: z.string(),
});

type PreviewIntelligence = z.infer<typeof PreviewIntelligenceSchema>;

@customElement('r-component-preview')
export class RComponentPreview extends LitElement {
  @property({ type: String }) component = '';
  @property({ type: String }) variant = 'default';
  @property({ type: String }) size = 'md';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loading = false;

  @state() private intelligence: PreviewIntelligence | null = null;
  @state() private error: string | null = null;

  static override styles = css`
    :host {
      display: block;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .preview-container {
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background);
      border-radius: 0.375rem;
      padding: 2rem;
    }
    .error {
      color: var(--destructive);
      text-align: center;
    }
    .loading {
      text-align: center;
      color: var(--muted-foreground);
    }
  `;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    await this.loadIntelligence();
  }

  private async loadIntelligence(): Promise<void> {
    try {
      const response = await fetch(`/registry/previews/${this.component}.json`);
      if (!response.ok) {
        throw new Error(`Component ${this.component} not found in registry`);
      }

      const data = await response.json();
      this.intelligence = PreviewIntelligenceSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.error = 'Invalid preview intelligence format';
      } else if (error instanceof Error) {
        this.error = error.message;
      } else {
        this.error = 'Unknown error';
      }
    }
  }

  private computeClasses(): string {
    if (!this.intelligence) return '';

    const classes = [...this.intelligence.baseClasses];

    for (const mapping of this.intelligence.propMappings) {
      const propValue = this[mapping.propName as keyof this] as string;
      const mappedClasses = mapping.values[propValue];
      if (mappedClasses) {
        classes.push(...mappedClasses);
      }
    }

    if (this.disabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
    }

    if (this.loading) {
      classes.push('animate-pulse');
    }

    return classes.join(' ');
  }

  private renderComponentContent(): TemplateResult | string {
    switch (this.component) {
      case 'button':
        return html`${this.variant} Button`;
      case 'input':
        return html`<span>Input placeholder</span>`;
      default:
        return 'Preview';
    }
  }

  override render(): TemplateResult {
    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }

    if (!this.intelligence) {
      return html`<div class="loading">Loading preview...</div>`;
    }

    const criticalStyles = this.intelligence.criticalCSS
      ? html`<style>
          ${unsafeCSS(this.intelligence.criticalCSS)}
        </style>`
      : '';

    return html`
      ${criticalStyles}
      <div class="preview-container">
        <button
          class="${this.computeClasses()}"
          ?disabled="${this.disabled}"
          role="button"
          tabindex="0"
          aria-label="${this.component} preview - ${this.variant} variant, ${this.size} size"
          aria-busy="${this.loading}"
        >
          ${this.renderComponentContent()}
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
