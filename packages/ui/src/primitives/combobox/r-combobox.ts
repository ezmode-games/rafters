/**
 * Headless combobox primitive with ARIA support and keyboard navigation
 *
 * @registryName r-combobox
 * @registryVersion 0.1.0
 * @registryPath primitives/combobox/r-combobox.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - combobox role, keyboard navigation (Arrow keys, Escape), 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-combobox value="" placeholder="Select option">
 *   <div slot="listbox" role="listbox">
 *     <div role="option">Option 1</div>
 *     <div role="option">Option 2</div>
 *   </div>
 * </r-combobox>
 * <r-combobox disabled></r-combobox>
 * <r-combobox expanded></r-combobox>
 * ```
 */
import { html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import { getNextIndex } from '../../utils/keyboard';

@customElement('r-combobox')
export class RCombobox extends RPrimitiveBase {
  /**
   * Combobox role for accessibility
   */
  @property({ type: String, reflect: true }) override role = 'combobox';

  /**
   * Tab index for keyboard navigation
   */
  @property({ type: Number, reflect: true }) override tabIndex = 0;

  /**
   * Current value of the combobox
   */
  @property({ type: String }) value = '';

  /**
   * Expanded state (listbox visible)
   */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /**
   * Placeholder text
   */
  @property({ type: String }) placeholder?: string;

  /**
   * Form field name
   */
  @property({ type: String }) name?: string;

  /**
   * ID for the listbox element (generated if not provided)
   */
  @property({ type: String, attribute: 'listbox-id' }) listboxId = 'listbox';

  /**
   * Currently active option index for keyboard navigation
   */
  @state() private activeIndex = -1;

  /**
   * Reference to the input element
   */
  @query('input') private inputElement!: HTMLInputElement;

  /**
   * Reference to the listbox slot
   */
  @query('slot[name="listbox"]') private listboxSlot!: HTMLSlotElement;

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
   * Handle keyboard navigation for combobox
   * WCAG 2.1.1 Keyboard - All functionality available from keyboard
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;

    const options = this._getOptions();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this.expanded) {
          this.expanded = true;
          this.activeIndex = 0;
        } else {
          this.activeIndex = getNextIndex(this.activeIndex, options.length, 1);
        }
        this._updateActiveDescendant();
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!this.expanded) {
          this.expanded = true;
          this.activeIndex = options.length - 1;
        } else {
          this.activeIndex = getNextIndex(this.activeIndex, options.length, -1);
        }
        this._updateActiveDescendant();
        break;

      case 'Enter':
        e.preventDefault();
        if (this.expanded && this.activeIndex >= 0) {
          this._selectOption(options[this.activeIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (this.expanded) {
          this.expanded = false;
          this.activeIndex = -1;
          this._updateActiveDescendant();
        }
        break;

      case 'Home':
        if (this.expanded) {
          e.preventDefault();
          this.activeIndex = 0;
          this._updateActiveDescendant();
        }
        break;

      case 'End':
        if (this.expanded) {
          e.preventDefault();
          this.activeIndex = options.length - 1;
          this._updateActiveDescendant();
        }
        break;
    }
  };

  /**
   * Handle click to toggle expanded state
   */
  private _handleClick = (): void => {
    if (this.disabled) return;
    this.expanded = !this.expanded;
    if (!this.expanded) {
      this.activeIndex = -1;
      this._updateActiveDescendant();
    }
  };

  /**
   * Handle input changes
   */
  private _handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    this.value = target.value;

    this.dispatchPrimitiveEvent('r-combobox-input', {
      value: this.value,
    });

    if (!this.expanded) {
      this.expanded = true;
    }
  };

  /**
   * Get all option elements from the listbox slot
   */
  private _getOptions(): Element[] {
    if (!this.listboxSlot) return [];
    const slotted = this.listboxSlot.assignedElements();
    if (slotted.length === 0) return [];

    const listbox = slotted[0];
    return Array.from(listbox.querySelectorAll('[role="option"]'));
  }

  /**
   * Update aria-activedescendant based on current active index
   */
  private _updateActiveDescendant(): void {
    const options = this._getOptions();

    if (this.activeIndex >= 0 && this.activeIndex < options.length) {
      const activeOption = options[this.activeIndex] as HTMLElement;

      // Ensure option has an ID
      if (!activeOption.id) {
        activeOption.id = `${this.listboxId}-option-${this.activeIndex}`;
      }

      this.inputElement?.setAttribute('aria-activedescendant', activeOption.id);

      // Scroll option into view
      activeOption.scrollIntoView({ block: 'nearest' });
    } else {
      this.inputElement?.removeAttribute('aria-activedescendant');
    }
  }

  /**
   * Select an option
   */
  private _selectOption(option: Element): void {
    const optionText = option.textContent?.trim() || '';
    this.value = optionText;
    this.expanded = false;
    this.activeIndex = -1;

    this.dispatchPrimitiveEvent('r-combobox-select', {
      value: this.value,
      option: option,
    });

    this._updateActiveDescendant();
  }

  /**
   * Focus the input
   */
  public override focus(): void {
    this.inputElement?.focus();
  }

  /**
   * Blur the input
   */
  public override blur(): void {
    this.inputElement?.blur();
  }

  override render() {
    return html`
      <input
        part="input"
        type="text"
        .value=${live(this.value)}
        placeholder=${this.placeholder || ''}
        ?disabled=${this.disabled}
        name=${this.name ?? ''}
        role="combobox"
        aria-expanded=${this.expanded ? 'true' : 'false'}
        aria-controls=${this.listboxId}
        aria-haspopup="listbox"
        aria-label=${this.ariaLabel ?? ''}
        aria-labelledby=${this.ariaLabelledBy ?? ''}
        aria-describedby=${this.ariaDescribedBy ?? ''}
        @input=${this._handleInput}
        autocomplete="off"
      />
      <div part="listbox-container" ?hidden=${!this.expanded}>
        <slot name="listbox"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-combobox': RCombobox;
  }
}
