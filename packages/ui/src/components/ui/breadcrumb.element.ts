/**
 * <rafters-breadcrumb> -- Web Component wayfinding container.
 *
 * Framework-target for the Breadcrumb outer <nav> wrapper, parallel to
 * breadcrumb.tsx (React) and breadcrumb.astro (Astro). Scope is limited
 * to the outer container; the list/item/link/page/separator/ellipsis
 * children are deferred to a follow-up issue -- consumers compose plain
 * semantic children into the default slot for now.
 *
 * Shadow DOM structure:
 *   <nav class="breadcrumb" aria-label="Breadcrumb"><slot></slot></nav>
 *
 * Attributes: none. No attribute-driven variants on the outer nav.
 *
 * Auto-registers on import and is idempotent against double-define.
 * Styling comes exclusively from breadcrumbStylesheet() adopted as the
 * per-instance stylesheet. No raw custom-property literals live in this
 * file; every token reference resolves through tokenVar() inside
 * breadcrumb.styles.ts. No innerHTML is used either. The per-instance
 * CSSStyleSheet pattern avoids the static styles mutation bug from PR #1308.
 *
 * @cognitive-load 2/10
 * @accessibility aria-label="Breadcrumb" on the nav element; slotted
 *                children retain their own semantic roles in the light tree.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { breadcrumbStylesheet } from './breadcrumb.styles';

export class RaftersBreadcrumb extends RaftersElement {
  static readonly observedAttributes: ReadonlyArray<string> = [];

  /** Per-instance stylesheet created on connect. */
  private _instanceSheet: CSSStyleSheet | null = null;

  override connectedCallback(): void {
    if (!this.shadowRoot) return;
    this._instanceSheet = new CSSStyleSheet();
    this._instanceSheet.replaceSync(breadcrumbStylesheet());
    this.shadowRoot.adoptedStyleSheets = [this._instanceSheet];
    this.update();
  }

  override disconnectedCallback(): void {
    this._instanceSheet = null;
  }

  /**
   * Render the semantic <nav aria-label="Breadcrumb"> wrapper with a single
   * default <slot>. DOM APIs only -- never innerHTML. The outer nav carries
   * only the `.breadcrumb` class so visual state comes exclusively from the
   * per-instance stylesheet.
   */
  override render(): Node {
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const slot = document.createElement('slot');
    nav.appendChild(slot);
    return nav;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-breadcrumb')) {
  customElements.define('rafters-breadcrumb', RaftersBreadcrumb);
}
