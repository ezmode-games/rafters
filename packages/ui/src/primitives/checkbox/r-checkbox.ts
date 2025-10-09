/**
 * Headless checkbox primitive with ARIA support and tri-state capability
 *
 * @registryName r-checkbox
 * @registryVersion 0.1.0
 * @registryPath primitives/checkbox/r-checkbox.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - checkbox role, keyboard (Space toggle), 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-checkbox>Accept terms</r-checkbox>
 * <r-checkbox checked>Enabled by default</r-checkbox>
 * <r-checkbox disabled>Disabled state</r-checkbox>
 * <r-checkbox indeterminate>Partially selected</r-checkbox>
 * ```
 */
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import { preventDefaultForActionKeys } from '../../utils/keyboard';

@customElement('r-checkbox')
export class RCheckbox extends RPrimitiveBase {
  static override properties = {
    ...RPrimitiveBase.properties,
    role: { type: String, reflect: true },
    tabIndex: { type: Number, reflect: true },
    checked: { type: Boolean, reflect: true },
    indeterminate: { type: Boolean, reflect: true },
    name: { type: String },
    value: { type: String },
  };

  override role = 'checkbox';
  override tabIndex = 0;
  checked = false;
  indeterminate = false;
  name?: string;
  value?: string;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('click', this._handleClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('click', this._handleClick);
  }

  /**
   * Handle keyboard activation (Space to toggle)
   * Per W3C ARIA, Space toggles checkbox (not Enter)
   * WCAG 2.1.1 Keyboard - All functionality available from keyboard
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    // Don't activate if disabled
    if (this.disabled) return;

    // Only Space key toggles checkbox (not Enter)
    if (e.key === ' ') {
      preventDefaultForActionKeys(e); // Prevent page scroll
      this._toggle();
    }
  };

  /**
   * Handle click to toggle checkbox
   */
  private _handleClick = (): void => {
    if (this.disabled) return;
    this._toggle();
  };

  /**
   * Toggle checkbox state
   * Clears indeterminate and toggles checked
   */
  private _toggle(): void {
    // Clear indeterminate on toggle
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }

    // Dispatch change event
    this.dispatchPrimitiveEvent('r-checkbox-change', {
      checked: this.checked,
      indeterminate: this.indeterminate,
      name: this.name,
      value: this.value,
    });
  }

  override render() {
    // Update aria-checked based on state
    const ariaChecked = this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false';
    this.setAttribute('aria-checked', ariaChecked);

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-checkbox': RCheckbox;
  }
}
