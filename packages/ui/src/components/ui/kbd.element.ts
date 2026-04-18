/**
 * <rafters-kbd> -- Web Component keyboard key indicator primitive.
 *
 * Framework-target for the Kbd component, parallel to kbd.tsx (React)
 * and kbd.astro (Astro). Consumes kbdStylesheet() from kbd.styles.ts
 * to guarantee visual parity across framework targets.
 *
 * Shadow DOM structure:
 *   <kbd class="kbd"><slot></slot></kbd>
 *
 * No attributes -- the React target has no variants or sizes either.
 *
 * @cognitive-load 1/10 Simple visual indicator, no interaction required.
 * @accessibility Semantic <kbd> element preserved in the shadow root.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { kbdStylesheet } from './kbd.styles';

export class RaftersKbd extends RaftersElement {
  static readonly observedAttributes: ReadonlyArray<string> = [];

  /** Per-instance stylesheet owned by this element. */
  private _instanceSheet: CSSStyleSheet | null = null;

  override connectedCallback(): void {
    if (!this.shadowRoot) return;
    this._instanceSheet = new CSSStyleSheet();
    this._instanceSheet.replaceSync(kbdStylesheet());
    this.shadowRoot.adoptedStyleSheets = [this._instanceSheet];
    this.update();
  }

  override disconnectedCallback(): void {
    this._instanceSheet = null;
  }

  /**
   * Render a single semantic <kbd> with a default <slot>.
   * DOM APIs only -- never innerHTML. The inner kbd carries only the
   * `.kbd` class so visual state comes exclusively from the per-instance
   * stylesheet.
   */
  override render(): Node {
    const inner = document.createElement('kbd');
    inner.className = 'kbd';
    const slot = document.createElement('slot');
    inner.appendChild(slot);
    return inner;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-kbd')) {
  customElements.define('rafters-kbd', RaftersKbd);
}
