/**
 * Headless slider primitive with ARIA support and keyboard navigation
 *
 * @registryName r-slider
 * @registryVersion 0.1.0
 * @registryPath primitives/slider/r-slider.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - slider role, keyboard (Arrow keys adjust), 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-slider value="50" min="0" max="100"></r-slider>
 * <r-slider value="25" min="0" max="100" step="5" disabled></r-slider>
 * <r-slider value="50" orientation="vertical"></r-slider>
 * ```
 */
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';

@customElement('r-slider')
export class RSlider extends RPrimitiveBase {
  static override properties = {
    ...RPrimitiveBase.properties,
    role: { type: String, reflect: true },
    tabIndex: { type: Number, reflect: true },
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    orientation: { type: String },
    name: { type: String },
  };

  /**
   * Slider role for accessibility
   */
  override role = 'slider';

  /**
   * Tab index for keyboard navigation
   * 0 = in tab order, -1 = not tabbable when disabled
   */
  override tabIndex = 0;

  /**
   * Current value of the slider
   */
  value = 0;

  /**
   * Minimum value
   */
  min = 0;

  /**
   * Maximum value
   */
  max = 100;

  /**
   * Step increment/decrement value
   */
  step = 1;

  /**
   * Orientation of the slider
   */
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Name for form association
   */
  name?: string;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('input', this._handleInput);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('input', this._handleInput);
  }

  /**
   * Update disabled state on tabIndex
   */
  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  /**
   * Handle keyboard navigation (Arrow keys, Home, End)
   * WCAG 2.1.1 Keyboard - All functionality available from keyboard
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;

    let handled = false;
    const largeStep = (this.max - this.min) / 10;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        this._incrementValue();
        handled = true;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        this._decrementValue();
        handled = true;
        break;
      case 'Home':
        this.value = this.min;
        this._dispatchChangeEvent();
        handled = true;
        break;
      case 'End':
        this.value = this.max;
        this._dispatchChangeEvent();
        handled = true;
        break;
      case 'PageUp':
        this.value = Math.min(this.max, this.value + largeStep);
        this._dispatchChangeEvent();
        handled = true;
        break;
      case 'PageDown':
        this.value = Math.max(this.min, this.value - largeStep);
        this._dispatchChangeEvent();
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
    }
  };

  /**
   * Handle input event from native range input
   */
  private _handleInput = (e: Event): void => {
    if (this.disabled) return;

    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this._dispatchChangeEvent();
  };

  /**
   * Increment value by step
   */
  private _incrementValue(): void {
    this.value = Math.min(this.max, this.value + this.step);
    this._dispatchChangeEvent();
  }

  /**
   * Decrement value by step
   */
  private _decrementValue(): void {
    this.value = Math.max(this.min, this.value - this.step);
    this._dispatchChangeEvent();
  }

  /**
   * Dispatch custom r-slider event
   */
  private _dispatchChangeEvent(): void {
    this.dispatchPrimitiveEvent('r-slider', {
      value: this.value,
      min: this.min,
      max: this.max,
    });
  }

  override render() {
    return html`
      <input
        part="slider"
        type="range"
        .value=${String(this.value)}
        min=${String(this.min)}
        max=${String(this.max)}
        step=${String(this.step)}
        ?disabled=${this.disabled}
        aria-valuenow=${String(this.value)}
        aria-valuemin=${String(this.min)}
        aria-valuemax=${String(this.max)}
        aria-orientation=${this.orientation}
        name=${this.name ?? ''}
        @input=${this._handleInput}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-slider': RSlider;
  }
}
