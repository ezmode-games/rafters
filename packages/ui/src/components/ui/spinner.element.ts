/**
 * <rafters-spinner> -- Web Component loading spinner.
 *
 * Mirrors the semantics of spinner.tsx (size, variant) using shadow-DOM-scoped
 * CSS composed via classy-wc. Auto-registers on import and is idempotent
 * against double-define.
 *
 * Attributes:
 *  - size:    'sm' | 'default' | 'lg'  (default 'default')
 *  - variant: 'default' | 'primary' | 'secondary' | 'destructive' | 'success'
 *             | 'warning' | 'info' | 'accent' | 'muted'  (default 'default')
 *
 * Shadow DOM structure:
 *   <output class="spinner" aria-label="Loading">
 *     <span class="sr-only">Loading</span>
 *   </output>
 *
 * Unknown attribute values fall back to 'default' silently. This matches the
 * React target's runtime behaviour of
 * `spinnerVariantClasses[variant] ?? default`.
 *
 * DOM APIs only -- never innerHTML. Styling comes exclusively from
 * spinnerStylesheet(...) adopted as the per-instance stylesheet. The
 * `.sr-only` helper is defined inside the component stylesheet because the
 * shadow DOM has no access to the global Tailwind utility.
 *
 * The spin animation respects prefers-reduced-motion via an `@media` block
 * emitted by spinnerStylesheet().
 *
 * @cognitive-load 2/10
 * @accessibility role=status implied by <output>, aria-label announces
 *                "Loading" to assistive tech; sr-only text carries the same
 *                phrase for screen readers that favour text content.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { type SpinnerSize, type SpinnerVariant, spinnerStylesheet } from './spinner.styles';

const ALLOWED_SIZES: ReadonlyArray<SpinnerSize> = ['sm', 'default', 'lg'];

const ALLOWED_VARIANTS: ReadonlyArray<SpinnerVariant> = [
  'default',
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'accent',
  'muted',
];

const OBSERVED_ATTRIBUTES: ReadonlyArray<string> = ['size', 'variant'] as const;

function parseSize(value: string | null): SpinnerSize {
  if (value && (ALLOWED_SIZES as ReadonlyArray<string>).includes(value)) {
    return value as SpinnerSize;
  }
  return 'default';
}

function parseVariant(value: string | null): SpinnerVariant {
  if (value && (ALLOWED_VARIANTS as ReadonlyArray<string>).includes(value)) {
    return value as SpinnerVariant;
  }
  return 'default';
}

export class RaftersSpinner extends RaftersElement {
  static readonly observedAttributes: ReadonlyArray<string> = OBSERVED_ATTRIBUTES;

  /** Per-instance stylesheet rebuilt on size/variant changes. */
  private _instanceSheet: CSSStyleSheet | null = null;

  override connectedCallback(): void {
    if (!this.shadowRoot) return;
    this._instanceSheet = new CSSStyleSheet();
    this._instanceSheet.replaceSync(this.composeCss());
    this.shadowRoot.adoptedStyleSheets = [this._instanceSheet];
    this.update();
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if ((name === 'size' || name === 'variant') && this._instanceSheet) {
      this._instanceSheet.replaceSync(this.composeCss());
    }
    this.update();
  }

  override disconnectedCallback(): void {
    this._instanceSheet = null;
  }

  /**
   * Build the CSS string for the current size/variant attributes.
   */
  private composeCss(): string {
    return spinnerStylesheet({
      size: parseSize(this.getAttribute('size')),
      variant: parseVariant(this.getAttribute('variant')),
    });
  }

  /**
   * Render an <output class="spinner" aria-label="Loading"> containing a
   * .sr-only span for redundant screen-reader text. DOM APIs only -- never
   * innerHTML.
   */
  override render(): Node {
    const output = document.createElement('output');
    output.className = 'spinner';
    output.setAttribute('aria-label', 'Loading');
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = 'Loading';
    output.appendChild(srText);
    return output;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-spinner')) {
  customElements.define('rafters-spinner', RaftersSpinner);
}
