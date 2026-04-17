/**
 * <rafters-alert> -- Web Component alert primitive.
 *
 * Mirrors the semantics of alert.tsx (variant) using shadow-DOM-scoped CSS
 * composed via classy-wc. Auto-registers on import and is idempotent
 * against double-define.
 *
 * Attributes:
 *  - variant: 'default' | 'primary' | 'secondary' | 'destructive' | 'success'
 *             | 'warning' | 'info' | 'muted' | 'accent'  (default 'default')
 *
 * The inner <div class="alert" role="alert"> is plain shadow-DOM markup --
 * NO Tailwind classes. Styling comes exclusively from alertStylesheet(...)
 * adopted as the per-instance stylesheet.
 *
 * Unknown variant values fall back to 'default' silently and NEVER throw.
 * Subcomponents (title/description/action) are out of scope -- consumers
 * compose with plain slotted elements.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { type AlertVariant, alertStylesheet } from './alert.styles';

const ALLOWED_VARIANTS: ReadonlyArray<AlertVariant> = [
  'default',
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'muted',
  'accent',
];

const OBSERVED_ATTRIBUTES: ReadonlyArray<string> = ['variant'] as const;

function parseVariant(value: string | null): AlertVariant {
  if (value && (ALLOWED_VARIANTS as ReadonlyArray<string>).includes(value)) {
    return value as AlertVariant;
  }
  return 'default';
}

export class RaftersAlert extends RaftersElement {
  static readonly observedAttributes: ReadonlyArray<string> = OBSERVED_ATTRIBUTES;

  /** Per-instance stylesheet rebuilt on every attribute change. */
  private _instanceSheet: CSSStyleSheet | null = null;

  override connectedCallback(): void {
    if (!this.shadowRoot) return;
    this._instanceSheet = new CSSStyleSheet();
    this._instanceSheet.replaceSync(this.composeCss());
    this.shadowRoot.adoptedStyleSheets = [this._instanceSheet];
    this.update();
  }

  override attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if (this._instanceSheet) {
      this._instanceSheet.replaceSync(this.composeCss());
    }
    this.update();
  }

  override disconnectedCallback(): void {
    this._instanceSheet = null;
  }

  /**
   * Build the CSS string for the current attribute values.
   */
  private composeCss(): string {
    return alertStylesheet({
      variant: parseVariant(this.getAttribute('variant')),
    });
  }

  /**
   * Render the semantic <div class="alert" role="alert"> with a single
   * default <slot>. DOM APIs only -- never innerHTML.
   */
  override render(): Node {
    const wrapper = document.createElement('div');
    wrapper.className = 'alert';
    wrapper.setAttribute('role', 'alert');
    const slot = document.createElement('slot');
    wrapper.appendChild(slot);
    return wrapper;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-alert')) {
  customElements.define('rafters-alert', RaftersAlert);
}
