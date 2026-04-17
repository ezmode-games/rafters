/**
 * <rafters-skeleton> -- Web Component skeleton loader.
 *
 * Mirrors the semantics of skeleton.tsx (variant) using shadow-DOM-scoped
 * CSS composed via classy-wc. Auto-registers on import and is idempotent
 * against double-define.
 *
 * Attributes:
 *  - variant: 'default' | 'primary' | 'secondary' | 'destructive' | 'success'
 *             | 'warning' | 'info' | 'muted' | 'accent' (default 'default')
 *
 * Shadow DOM structure:
 *   <div class="skeleton" aria-hidden="true">
 *
 * No slot -- skeleton is purely decorative with no slotted content.
 * Unknown variant values fall back to 'default' silently. This matches the
 * React target's runtime behaviour of `skeletonVariantClasses[variant] ?? default`.
 *
 * DOM APIs only -- never innerHTML. Styling comes exclusively from
 * skeletonStylesheet(...) adopted as the per-instance stylesheet.
 *
 * @cognitive-load 1/10
 * @accessibility aria-hidden decorative placeholder.
 *                Animation respects prefers-reduced-motion.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { type SkeletonVariant, skeletonStylesheet } from './skeleton.styles';

const ALLOWED_VARIANTS: ReadonlyArray<SkeletonVariant> = [
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

function parseVariant(value: string | null): SkeletonVariant {
  if (value && (ALLOWED_VARIANTS as ReadonlyArray<string>).includes(value)) {
    return value as SkeletonVariant;
  }
  return 'default';
}

export class RaftersSkeleton extends RaftersElement {
  static readonly observedAttributes: ReadonlyArray<string> = OBSERVED_ATTRIBUTES;

  /** Per-instance stylesheet rebuilt on variant changes. */
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
    if (name === 'variant' && this._instanceSheet) {
      this._instanceSheet.replaceSync(this.composeCss());
    }
    this.update();
  }

  override disconnectedCallback(): void {
    this._instanceSheet = null;
  }

  /**
   * Build the CSS string for the current variant attribute.
   */
  private composeCss(): string {
    return skeletonStylesheet({
      variant: parseVariant(this.getAttribute('variant')),
    });
  }

  /**
   * Render a single decorative div with aria-hidden. No slot -- skeleton
   * is purely a loading placeholder. DOM APIs only -- never innerHTML.
   */
  override render(): Node {
    const inner = document.createElement('div');
    inner.className = 'skeleton';
    inner.setAttribute('aria-hidden', 'true');
    return inner;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-skeleton')) {
  customElements.define('rafters-skeleton', RaftersSkeleton);
}
