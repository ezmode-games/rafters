/**
 * Headless button primitive with ARIA support and keyboard navigation
 *
 * @registryName r-button
 * @registryVersion 0.1.0
 * @registryPath primitives/button/r-button.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - button role, keyboard navigation, 44px touch targets
 * @dependencies lit, local:base/RPrimitiveBase.ts
 *
 * @example
 * ```html
 * <r-button>Click me</r-button>
 * <r-button disabled>Disabled</r-button>
 * <r-button aria-label="Save document">Save</r-button>
 * ```
 */
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';

@customElement('r-button')
export class RButton extends RPrimitiveBase {
  /**
   * Button role for accessibility
   */
  @property({ type: String, reflect: true }) override role = 'button';

  /**
   * Tab index for keyboard navigation
   * 0 = in tab order, -1 = not tabbable, >0 = custom tab order (avoid)
   */
  @property({ type: Number }) override tabIndex = 0;

  /**
   * Button type for form submission
   * button = no default action, submit = submits form, reset = resets form
   */
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  /**
   * Handle keyboard activation (Enter and Space)
   * WCAG 2.1.1 Keyboard - All functionality available from keyboard
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    // Don't activate if disabled
    if (this.disabled) return;

    // Enter or Space should activate button
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent page scroll on Space
      this.click(); // Trigger click event
    }
  };

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-button': RButton;
  }
}
