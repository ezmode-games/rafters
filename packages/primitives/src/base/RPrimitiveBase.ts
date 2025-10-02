/**
 * Base class for all Rafters primitives
 *
 * @registryName RPrimitiveBase
 * @registryType registry:primitive-base
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath base/RPrimitiveBase.ts
 *
 * @accessibility WCAG AAA foundation with ARIA support
 * @dependencies lit
 *
 * @example
 * ```typescript
 * import { RPrimitiveBase } from '@rafters/primitives/base'
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
import { property, state } from 'lit/decorators.js';
import type { AnnouncementOptions } from './types';

export abstract class RPrimitiveBase extends LitElement {
  /**
   * Disabled state (reflects to attribute for CSS targeting)
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * ARIA role for the component
   */
  @property({ type: String, reflect: true }) override role: string | null = null;

  /**
   * ARIA label for accessibility
   */
  @property({ attribute: 'aria-label' }) override ariaLabel: string | null = null;

  /**
   * ARIA labelledby reference
   */
  @property({ attribute: 'aria-labelledby' }) ariaLabelledBy?: string;

  /**
   * ARIA describedby reference
   */
  @property({ attribute: 'aria-describedby' }) ariaDescribedBy?: string;

  /**
   * Focus state (internal)
   */
  @state() protected _focused = false;

  /**
   * Hover state (internal)
   */
  @state() protected _hovered = false;

  /**
   * Announce message to screen readers
   * Creates temporary live region for accessibility announcements
   *
   * @param message - Text to announce
   * @param options - Announcement options (politeness, timeout)
   */
  protected announceToScreenReader(message: string, options: AnnouncementOptions = {}): void {
    const { politeness = 'polite', timeout = 1000 } = options;

    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      announcement.remove();
    }, timeout);
  }

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
  protected dispatchPrimitiveEvent<T>(
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
