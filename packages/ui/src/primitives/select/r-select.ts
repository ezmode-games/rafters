/**
 * Headless select primitive with ARIA listbox pattern and WCAG AAA compliance
 *
 * @registryName r-select
 * @registryVersion 0.1.0
 * @registryPath primitives/select/r-select.ts
 * @registryType registry:primitive
 *
 * @cognitiveLoad 4
 * @attentionEconomics Moderate cognitive load (4/10) as selects require users to scan options and make decisions. Clear visual hierarchy and keyboard navigation reduce cognitive burden.
 * @trustBuilding Visual feedback through aria-selected state. Keyboard navigation follows ARIA APG patterns. Clear focus indicators build user confidence.
 * @semanticMeaning Foundation primitive for single or multiple selection from a list following W3C ARIA listbox pattern with WCAG AAA compliance
 *
 * @accessibility WCAG AAA - listbox role, keyboard (Arrow keys, Home/End), 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-select>
 *   <div slot="option" data-value="1">Option 1</div>
 *   <div slot="option" data-value="2">Option 2</div>
 * </r-select>
 * <r-select multiple>
 *   <div slot="option" data-value="a">Option A</div>
 *   <div slot="option" data-value="b">Option B</div>
 * </r-select>
 * <r-select disabled>
 *   <div slot="option" data-value="x">Disabled</div>
 * </r-select>
 * ```
 */
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import { getNextIndex } from '../../utils/keyboard';

@customElement('r-select')
export class RSelect extends RPrimitiveBase {
  static override properties = {
    ...RPrimitiveBase.properties,
    role: { type: String, reflect: true },
    tabIndex: { type: Number, reflect: true },
    value: { type: String, reflect: true },
    multiple: { type: Boolean, reflect: true },
    name: { type: String },
    ariaActiveDescendant: { type: String, attribute: 'aria-activedescendant' },
    ariaMultiselectable: { type: String, attribute: 'aria-multiselectable' },
  };

  /**
   * Listbox role for accessibility
   */
  override role = 'listbox';

  /**
   * Tab index for keyboard navigation
   * 0 = in tab order, -1 = not tabbable
   */
  override tabIndex = 0;

  /**
   * Selected value(s)
   * For single select: string
   * For multiple select: comma-separated string
   */
  value = '';

  /**
   * Whether the select supports multiple selection
   */
  multiple = false;

  /**
   * Form field name for form submission
   */
  name?: string;

  /**
   * Active descendant for ARIA (currently focused option)
   */
  ariaActiveDescendant?: string;

  /**
   * ARIA multiselectable attribute
   */
  get ariaMultiselectable(): string {
    return this.multiple ? 'true' : 'false';
  }

  /**
   * Currently active option index
   */
  private _activeIndex = -1;

  /**
   * Option elements cache
   */
  private _options: HTMLElement[] = [];

  /**
   * Reference to the slot element
   */
  @query('slot[name="option"]') private _optionSlot!: HTMLSlotElement;

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
   * Update options cache when slot content changes
   */
  override firstUpdated(): void {
    this._updateOptions();
    if (this._optionSlot) {
      this._optionSlot.addEventListener('slotchange', () => this._updateOptions());
    }
  }

  /**
   * Update internal options cache
   */
  private _updateOptions(): void {
    if (!this._optionSlot) return;

    const slottedElements = this._optionSlot.assignedElements() as HTMLElement[];
    this._options = slottedElements;

    // Set up ARIA attributes on options
    this._options.forEach((option, index) => {
      option.setAttribute('role', 'option');
      option.setAttribute('id', `option-${index}`);

      const value = option.getAttribute('data-value') || '';
      const isSelected = this._isOptionSelected(value);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      // Make options not directly focusable
      if (!option.hasAttribute('tabindex')) {
        option.setAttribute('tabindex', '-1');
      }
    });

    // Set initial active index if value is set
    if (this.value && this._activeIndex === -1) {
      const selectedValues = this._getSelectedValues();
      if (selectedValues.length > 0) {
        const firstSelectedIndex = this._options.findIndex(
          (opt) => opt.getAttribute('data-value') === selectedValues[0]
        );
        if (firstSelectedIndex !== -1) {
          this._activeIndex = firstSelectedIndex;
          this._updateActiveDescendant();
        }
      }
    }

    // Set first option as active if no selection
    if (this._activeIndex === -1 && this._options.length > 0) {
      this._activeIndex = 0;
      this._updateActiveDescendant();
    }
  }

  /**
   * Check if an option value is selected
   */
  private _isOptionSelected(value: string): boolean {
    const selectedValues = this._getSelectedValues();
    return selectedValues.includes(value);
  }

  /**
   * Get array of selected values
   */
  private _getSelectedValues(): string[] {
    if (!this.value) return [];
    return this.value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
  }

  /**
   * Update aria-activedescendant attribute
   */
  private _updateActiveDescendant(): void {
    if (this._activeIndex >= 0 && this._activeIndex < this._options.length) {
      this.ariaActiveDescendant = `option-${this._activeIndex}`;
    } else {
      this.ariaActiveDescendant = undefined;
    }
  }

  /**
   * Handle keyboard navigation
   * Arrow keys navigate, Space/Enter select, Home/End jump
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;

    const { key } = e;
    let handled = false;

    switch (key) {
      case 'ArrowDown':
        e.preventDefault();
        this._navigateToNext();
        handled = true;
        break;

      case 'ArrowUp':
        e.preventDefault();
        this._navigateToPrevious();
        handled = true;
        break;

      case 'Home':
        e.preventDefault();
        this._navigateToFirst();
        handled = true;
        break;

      case 'End':
        e.preventDefault();
        this._navigateToLast();
        handled = true;
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        this._selectActiveOption();
        handled = true;
        break;

      case 'Escape':
        // Allow escape to bubble for closing containers
        break;

      default:
        // Type-ahead selection could be added here
        break;
    }

    if (handled) {
      this.requestUpdate();
    }
  };

  /**
   * Navigate to next option
   */
  private _navigateToNext(): void {
    if (this._options.length === 0) return;
    this._activeIndex = getNextIndex(this._activeIndex, this._options.length, 1);
    this._updateActiveDescendant();
  }

  /**
   * Navigate to previous option
   */
  private _navigateToPrevious(): void {
    if (this._options.length === 0) return;
    this._activeIndex = getNextIndex(this._activeIndex, this._options.length, -1);
    this._updateActiveDescendant();
  }

  /**
   * Navigate to first option
   */
  private _navigateToFirst(): void {
    if (this._options.length === 0) return;
    this._activeIndex = 0;
    this._updateActiveDescendant();
  }

  /**
   * Navigate to last option
   */
  private _navigateToLast(): void {
    if (this._options.length === 0) return;
    this._activeIndex = this._options.length - 1;
    this._updateActiveDescendant();
  }

  /**
   * Select the currently active option
   */
  private _selectActiveOption(): void {
    if (this._activeIndex < 0 || this._activeIndex >= this._options.length) return;

    const option = this._options[this._activeIndex];
    const value = option.getAttribute('data-value') || '';

    this._selectOption(value);
  }

  /**
   * Handle click on option
   */
  private _handleClick = (e: MouseEvent): void => {
    if (this.disabled) return;

    const target = e.target as HTMLElement;
    const option = target.closest('[role="option"]') as HTMLElement;

    if (!option || !this._options.includes(option)) return;

    const value = option.getAttribute('data-value') || '';
    const index = this._options.indexOf(option);

    this._activeIndex = index;
    this._updateActiveDescendant();
    this._selectOption(value);
  };

  /**
   * Select an option by value
   */
  private _selectOption(value: string): void {
    if (!value) return;

    if (this.multiple) {
      const selectedValues = this._getSelectedValues();
      const index = selectedValues.indexOf(value);

      if (index !== -1) {
        // Deselect
        selectedValues.splice(index, 1);
      } else {
        // Select
        selectedValues.push(value);
      }

      this.value = selectedValues.join(',');
    } else {
      // Single select - replace value
      this.value = value;
    }

    // Update aria-selected on all options
    this._options.forEach((option) => {
      const optionValue = option.getAttribute('data-value') || '';
      const isSelected = this._isOptionSelected(optionValue);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // Dispatch change event
    this.dispatchPrimitiveEvent('r-change', {
      value: this.value,
      multiple: this.multiple,
      selectedValues: this._getSelectedValues(),
    });
  }

  /**
   * Focus the select
   */
  public override focus(): void {
    super.focus();
  }

  /**
   * Blur the select
   */
  public override blur(): void {
    super.blur();
  }

  override render() {
    return html`
      <slot name="option" part="options"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-select': RSelect;
  }
}
