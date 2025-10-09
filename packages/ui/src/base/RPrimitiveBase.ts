/**
 * Base class for all Rafters primitives
 *
 * @registryName RPrimitiveBase
 * @registryType registry:base
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath base/RPrimitiveBase.ts
 *
 * @accessibility WCAG AAA foundation with ARIA support
 * @dependencies lit
 *
 * @example
 * ```typescript
 * import { RPrimitiveBase } from '../base/RPrimitiveBase.ts'
 *
 * @customElement('r-custom')
 * export class RCustom extends RPrimitiveBase {
 *   render() {
 *     return html`<div part="base"><slot></slot></div>`
 *   }
 * }
 * ```
 */
import { LitElement } from 'lit';

export abstract class RPrimitiveBase extends LitElement {
  static override properties = {
    disabled: { type: Boolean, reflect: true },
    role: { type: String, reflect: true },
    ariaLabel: { type: String, attribute: 'aria-label' },
    ariaLabelledBy: { type: String, attribute: 'aria-labelledby' },
    ariaDescribedBy: { type: String, attribute: 'aria-describedby' },
  };

  disabled = false;
  override role: string | null = null;
  override ariaLabel: string | null = null;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  _focused = false;
  _hovered = false;

  /**
   * Handle keyboard navigation
   * Override in subclasses for component-specific behavior
   *
   * @param _event - Keyboard event
   */
  protected handleKeyboardNavigation(_event: KeyboardEvent): void {
    // Subclasses implement specific keyboard behavior
    // Default: no-op
  }

  /**
   * Dispatch custom event with proper typing
   *
   * @param name - Event name
   * @param detail - Event detail payload
   * @param timestamp - Optional timestamp (defaults to Date.now() for React 19 purity)
   */
  dispatchPrimitiveEvent<T>(
    name: string,
    detail: T,
    timestamp: number = Date.now()
  ): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          value: detail,
          timestamp,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Manage focus state
   * Automatically tracks focus/blur for state attributes
   */
  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('focus', this._handleFocus);
    this.addEventListener('blur', this._handleBlur);
    this.addEventListener('mouseenter', this._handleMouseEnter);
    this.addEventListener('mouseleave', this._handleMouseLeave);
  }

  /**
   * Cleanup event listeners
   */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener('focus', this._handleFocus);
    this.removeEventListener('blur', this._handleBlur);
    this.removeEventListener('mouseenter', this._handleMouseEnter);
    this.removeEventListener('mouseleave', this._handleMouseLeave);
  }

  /**
   * Handle focus event
   */
  private _handleFocus = (): void => {
    this._focused = true;
  };

  /**
   * Handle blur event
   */
  private _handleBlur = (): void => {
    this._focused = false;
  };

  /**
   * Handle mouse enter event
   */
  private _handleMouseEnter = (): void => {
    this._hovered = true;
  };

  /**
   * Handle mouse leave event
   */
  private _handleMouseLeave = (): void => {
    this._hovered = false;
  };
}
