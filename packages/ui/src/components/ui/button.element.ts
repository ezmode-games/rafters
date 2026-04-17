/**
 * <rafters-button> -- Web Component button primitive.
 *
 * Mirrors the semantics of button.tsx (variant, size, disabled, type) using
 * shadow-DOM-scoped CSS composed via classy-wc. Auto-registers on import and
 * is idempotent against double-define.
 *
 * Attributes:
 *  - variant: 'default' | 'primary' | 'secondary' | 'destructive' | 'success'
 *             | 'warning' | 'info' | 'muted' | 'accent' | 'outline' | 'ghost'
 *             | 'link'  (default 'default')
 *  - size:    'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs'
 *             | 'icon-sm' | 'icon-lg'  (default 'default')
 *  - disabled: boolean (presence-based)
 *  - type:    'button' | 'submit' | 'reset'  (default 'button')
 *
 * The inner <button> is plain shadow-DOM markup -- NO Tailwind classes.
 * Styling comes exclusively from buttonStylesheet(...) adopted as the
 * per-instance stylesheet.
 *
 * Click events bubble naturally from the inner <button> to the host.
 * Default type MUST be 'button' to prevent accidental form submission.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { type ButtonSize, type ButtonVariant, buttonStylesheet } from './button.styles';

export type ButtonType = 'button' | 'submit' | 'reset';

const ALLOWED_VARIANTS: ReadonlyArray<ButtonVariant> = [
  'default',
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'muted',
  'accent',
  'outline',
  'ghost',
  'link',
];

const ALLOWED_SIZES: ReadonlyArray<ButtonSize> = [
  'default',
  'xs',
  'sm',
  'lg',
  'icon',
  'icon-xs',
  'icon-sm',
  'icon-lg',
];

const ALLOWED_TYPES: ReadonlyArray<ButtonType> = ['button', 'submit', 'reset'];

const OBSERVED_ATTRIBUTES: ReadonlyArray<string> = ['variant', 'size', 'disabled', 'type'] as const;

function parseVariant(value: string | null): ButtonVariant {
  if (value && (ALLOWED_VARIANTS as ReadonlyArray<string>).includes(value)) {
    return value as ButtonVariant;
  }
  return 'default';
}

function parseSize(value: string | null): ButtonSize {
  if (value && (ALLOWED_SIZES as ReadonlyArray<string>).includes(value)) {
    return value as ButtonSize;
  }
  return 'default';
}

function parseType(value: string | null): ButtonType {
  if (value && (ALLOWED_TYPES as ReadonlyArray<string>).includes(value)) {
    return value as ButtonType;
  }
  return 'button';
}

export class RaftersButton extends RaftersElement {
  static observedAttributes: ReadonlyArray<string> = OBSERVED_ATTRIBUTES;

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
    return buttonStylesheet({
      variant: parseVariant(this.getAttribute('variant')),
      size: parseSize(this.getAttribute('size')),
      disabled: this.hasAttribute('disabled'),
    });
  }

  /**
   * Render the inner semantic <button> with a single default <slot>.
   * DOM APIs only -- never innerHTML. The inner button carries NO classes
   * other than `.button` so visual state comes exclusively from the
   * per-instance stylesheet.
   */
  override render(): Node {
    const inner = document.createElement('button');
    inner.className = 'button';
    inner.setAttribute('type', parseType(this.getAttribute('type')));
    inner.disabled = this.hasAttribute('disabled');
    const slot = document.createElement('slot');
    inner.appendChild(slot);
    return inner;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-button')) {
  customElements.define('rafters-button', RaftersButton);
}
