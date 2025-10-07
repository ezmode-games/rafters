/**
 * Headless switch primitive with ARIA support and keyboard navigation
 *
 * @registryName r-switch
 * @registryVersion 0.1.0
 * @registryPath primitives/switch/r-switch.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - switch role, keyboard (Space toggle), 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-switch>Enable notifications</r-switch>
 * <r-switch checked>Already enabled</r-switch>
 * <r-switch disabled>Cannot change</r-switch>
 * <r-switch name="notifications" value="enabled">Notifications</r-switch>
 * ```
 */
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import { preventDefaultForActionKeys } from '../../utils/keyboard';

@customElement('r-switch')
export class RSwitch extends RPrimitiveBase {
  /**
   * Switch role for accessibility
   */
  @property({ type: String, reflect: true }) override role = 'switch';

  /**
   * Tab index for keyboard navigation
   * 0 = in tab order, -1 = not tabbable, >0 = custom tab order (avoid)
   */
  @property({ type: Number, reflect: true }) override tabIndex = 0;

  /**
   * Checked state - true for on, false for off
   */
  @property({ type: Boolean, reflect: true }) checked = false;

  /**
   * Form field name
   */
  @property({ type: String }) name?: string;

  /**
   * Form field value
   */
  @property({ type: String }) value?: string;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeyDown);
    this.updateAriaChecked();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  /**
   * Update checked state and sync ARIA attributes
   */
  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('checked')) {
      this.updateAriaChecked();
      this.dispatchChangeEvent();
    }
  }

  /**
   * Update aria-checked attribute
   */
  private updateAriaChecked(): void {
    this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
  }

  /**
   * Handle click to toggle checked state
   */
  private _handleClick = (): void => {
    if (this.disabled) return;
    this.toggle();
  };

  /**
   * Handle keyboard activation (Space to toggle)
   * WCAG 2.1.1 Keyboard - All functionality available from keyboard
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;

    // Space key toggles the switch
    if (e.key === ' ') {
      preventDefaultForActionKeys(e);
      this.toggle();
    }
  };

  /**
   * Toggle checked state
   */
  private toggle(): void {
    this.checked = !this.checked;
  }

  /**
   * Dispatch change event
   */
  private dispatchChangeEvent(): void {
    this.dispatchPrimitiveEvent('r-switch-change', {
      checked: this.checked,
      name: this.name,
      value: this.value,
    });
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-switch': RSwitch;
  }
}
