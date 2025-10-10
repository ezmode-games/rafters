/**
 * Headless radio button primitive with ARIA support and keyboard navigation
 *
 * @registryName r-radio
 * @registryVersion 0.1.0
 * @registryPath primitives/radio/r-radio.ts
 * @registryType registry:primitive
 *
 * @cognitiveLoad 3
 * @attentionEconomics Low-moderate cognitive load (3/10) as radio buttons are familiar. Arrow key navigation pattern requires brief learning but is standard.
 * @trustBuilding Clear visual state (checked/unchecked). Predictable single-selection behavior. Roving tabindex reduces tab stops. Proper ARIA for screen readers.
 * @semanticMeaning Foundation primitive for single-selection choice inputs following W3C ARIA radio pattern with WCAG AAA compliance
 *
 * @accessibility WCAG AAA - radio role, keyboard navigation (Arrow keys), 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-radio name="color" value="red">Red</r-radio>
 * <r-radio name="color" value="blue" checked>Blue</r-radio>
 * <r-radio name="color" value="green" disabled>Green</r-radio>
 * ```
 */
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import { getNextIndex, updateRovingTabindex } from '../../utils/keyboard';

@customElement('r-radio')
export class RRadio extends RPrimitiveBase {
  static override properties = {
    ...RPrimitiveBase.properties,
    role: { type: String, reflect: true },
    checked: { type: Boolean, reflect: true },
    tabIndex: { type: Number, reflect: true },
    name: { type: String, reflect: true },
    value: { type: String },
  };

  override role = 'radio';
  checked = false;
  override tabIndex = -1;
  name!: string;
  value!: string;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeyDown);

    // Update aria-checked attribute
    this.setAttribute('aria-checked', String(this.checked));

    // Use setTimeout to ensure all radios in the group are connected
    setTimeout(() => {
      if (this.checked) {
        this._updateGroupTabindex();
      } else if (this._isFirstInGroup() && !this._hasCheckedRadio()) {
        this.tabIndex = 0;
      }
    }, 0);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  /**
   * Update aria-checked when checked property changes
   */
  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('checked')) {
      this.setAttribute('aria-checked', String(this.checked));

      // Update tabindex for roving focus
      if (this.checked) {
        this._updateGroupTabindex();
      }
    }
  }

  /**
   * Handle click event
   */
  private _handleClick = (): void => {
    if (this.disabled) return;

    this._selectRadio();
  };

  /**
   * Handle keyboard navigation (Arrow keys and Space)
   * WCAG 2.1.1 Keyboard - All functionality available from keyboard
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;

    const radios = this._getRadioGroup();
    const currentIndex = radios.indexOf(this);

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft': {
        e.preventDefault();
        const prevIndex = getNextIndex(currentIndex, radios.length, -1);
        this._selectRadioAtIndex(radios, prevIndex);
        break;
      }

      case 'ArrowDown':
      case 'ArrowRight': {
        e.preventDefault();
        const nextIndex = getNextIndex(currentIndex, radios.length, 1);
        this._selectRadioAtIndex(radios, nextIndex);
        break;
      }

      case ' ': {
        e.preventDefault();
        this._selectRadio();
        break;
      }
    }
  };

  /**
   * Select this radio button
   */
  private _selectRadio(): void {
    if (this.checked) return;

    // Uncheck all other radios in the group
    const radios = this._getRadioGroup();
    for (const radio of radios) {
      if (radio !== this) {
        radio.checked = false;
      }
    }

    // Check this radio
    this.checked = true;

    // Dispatch change event
    this.dispatchPrimitiveEvent('r-change', {
      name: this.name,
      value: this.value,
      checked: this.checked,
    });
  }

  /**
   * Select radio at specific index
   */
  private _selectRadioAtIndex(radios: RRadio[], index: number): void {
    const radio = radios[index];
    if (radio && !radio.disabled) {
      radio._selectRadio();
      radio.focus();
    } else if (radio?.disabled) {
      // Find next enabled radio
      const direction = index > radios.indexOf(this) ? 1 : -1;
      let nextIndex = index;
      let attempts = 0;
      while (attempts < radios.length) {
        nextIndex = getNextIndex(nextIndex, radios.length, direction);
        const nextRadio = radios[nextIndex];
        if (nextRadio && !nextRadio.disabled) {
          nextRadio._selectRadio();
          nextRadio.focus();
          return;
        }
        attempts++;
      }
    }
  }

  /**
   * Get all radios in the same group
   */
  private _getRadioGroup(): RRadio[] {
    if (!this.name) return [this];

    const root = this.getRootNode() as Document | ShadowRoot;
    const selector = `r-radio[name="${this.name}"]`;
    const radios = Array.from(root.querySelectorAll(selector)) as RRadio[];

    return radios;
  }

  /**
   * Check if this is the first radio in the group
   */
  private _isFirstInGroup(): boolean {
    const radios = this._getRadioGroup();
    return radios[0] === this;
  }

  /**
   * Check if any radio in the group is checked
   */
  private _hasCheckedRadio(): boolean {
    const radios = this._getRadioGroup();
    return radios.some((r) => r.checked);
  }

  /**
   * Update tabindex for all radios in the group (roving tabindex)
   */
  private _updateGroupTabindex(): void {
    const radios = this._getRadioGroup();
    const checkedIndex = radios.findIndex((r) => r.checked);
    const activeIndex = checkedIndex >= 0 ? checkedIndex : 0;

    updateRovingTabindex(radios, activeIndex);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-radio': RRadio;
  }
}
