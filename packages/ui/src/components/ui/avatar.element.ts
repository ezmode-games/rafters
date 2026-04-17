/**
 * <rafters-avatar> -- Web Component avatar primitive.
 *
 * Mirrors the outer container semantics of avatar.tsx (React) and
 * avatar.astro (Astro) using shadow-DOM-scoped CSS composed via classy-wc.
 * Auto-registers on import and is idempotent against double-define.
 *
 * This issue scopes to the OUTER <rafters-avatar> only. The inner
 * <rafters-avatar-image> and <rafters-avatar-fallback> subcomponents require
 * image-load status coordination and are deferred to a follow-up.
 *
 * Attributes:
 *  - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'  (default 'md')
 *
 * The inner <span> is plain shadow-DOM markup -- NO Tailwind classes.
 * Styling comes exclusively from avatarStylesheet(...) adopted as the
 * per-instance stylesheet. Unknown size values fall back to 'md' silently
 * and NEVER throw.
 *
 * @cognitive-load 2/10
 * @accessibility Semantic generic span; slotted content remains in the light tree.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { type AvatarSize, avatarStylesheet, isAvatarSize } from './avatar.styles';

const OBSERVED_ATTRIBUTES: ReadonlyArray<string> = ['size'] as const;

function parseSize(value: string | null): AvatarSize {
  return isAvatarSize(value) ? value : 'md';
}

export class RaftersAvatar extends RaftersElement {
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
    return avatarStylesheet({
      size: parseSize(this.getAttribute('size')),
    });
  }

  /**
   * Render a single <span class="avatar"> containing a default <slot>.
   * DOM APIs only -- never innerHTML. The inner span carries NO classes
   * other than `.avatar` so visual state comes exclusively from the
   * per-instance stylesheet.
   */
  override render(): Node {
    const inner = document.createElement('span');
    inner.className = 'avatar';
    const slot = document.createElement('slot');
    inner.appendChild(slot);
    return inner;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-avatar')) {
  customElements.define('rafters-avatar', RaftersAvatar);
}
