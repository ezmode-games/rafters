/**
 * Headless datepicker primitive with ARIA grid pattern and keyboard navigation
 *
 * @registryName r-datepicker
 * @registryVersion 0.1.0
 * @registryPath primitives/datepicker/r-datepicker.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - grid role for calendar, keyboard navigation (Arrow keys navigate days, Enter selects, Escape closes), 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-datepicker value="2024-01-15"></r-datepicker>
 * <r-datepicker expanded min="2024-01-01" max="2024-12-31"></r-datepicker>
 * <r-datepicker disabled></r-datepicker>
 * ```
 */
import { html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';

@customElement('r-datepicker')
export class RDatepicker extends RPrimitiveBase {
  /**
   * Selected date value in ISO format (YYYY-MM-DD)
   */
  @property({ type: String }) value = '';

  /**
   * Whether the calendar is expanded
   */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /**
   * Minimum selectable date (ISO format YYYY-MM-DD)
   */
  @property({ type: String }) min?: string;

  /**
   * Maximum selectable date (ISO format YYYY-MM-DD)
   */
  @property({ type: String }) max?: string;

  /**
   * Form field name
   */
  @property({ type: String }) name?: string;

  /**
   * Currently displayed month (ISO format YYYY-MM)
   */
  @state() private _displayMonth = '';

  /**
   * Currently focused date in calendar (ISO format YYYY-MM-DD)
   */
  @state() private _focusedDate = '';

  /**
   * Grid container element
   */
  @query('[role="grid"]') private gridElement!: HTMLElement | null;

  /**
   * Days of week labels
   */
  private readonly daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  /**
   * Month names
   */
  private readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);

    // Initialize display month
    if (!this._displayMonth) {
      const date = this.value ? new Date(this.value) : new Date();
      this._displayMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    // Initialize focused date
    if (!this._focusedDate) {
      this._focusedDate = this.value || this._getTodayISO();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  /**
   * Handle keyboard navigation
   * Arrow keys navigate calendar grid, Enter selects, Escape closes
   */
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled || !this.expanded) return;

    const focusedDate = new Date(this._focusedDate);
    let handled = false;

    switch (e.key) {
      case 'ArrowRight':
        focusedDate.setDate(focusedDate.getDate() + 1);
        handled = true;
        break;
      case 'ArrowLeft':
        focusedDate.setDate(focusedDate.getDate() - 1);
        handled = true;
        break;
      case 'ArrowDown':
        focusedDate.setDate(focusedDate.getDate() + 7);
        handled = true;
        break;
      case 'ArrowUp':
        focusedDate.setDate(focusedDate.getDate() - 7);
        handled = true;
        break;
      case 'Home':
        focusedDate.setDate(1);
        handled = true;
        break;
      case 'End':
        focusedDate.setMonth(focusedDate.getMonth() + 1, 0);
        handled = true;
        break;
      case 'PageUp':
        if (e.shiftKey) {
          focusedDate.setFullYear(focusedDate.getFullYear() - 1);
        } else {
          focusedDate.setMonth(focusedDate.getMonth() - 1);
        }
        handled = true;
        break;
      case 'PageDown':
        if (e.shiftKey) {
          focusedDate.setFullYear(focusedDate.getFullYear() + 1);
        } else {
          focusedDate.setMonth(focusedDate.getMonth() + 1);
        }
        handled = true;
        break;
      case 'Enter':
      case ' ':
        this._selectDate(this._focusedDate);
        handled = true;
        break;
      case 'Escape':
        this.expanded = false;
        this.dispatchPrimitiveEvent('r-datepicker-close', { expanded: false });
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();

      // Update focused date and ensure it's in valid range
      const newDateISO = this._dateToISO(focusedDate);
      if (this._isDateInRange(newDateISO)) {
        this._focusedDate = newDateISO;
        // Update display month if needed
        const newMonth = `${focusedDate.getFullYear()}-${String(focusedDate.getMonth() + 1).padStart(2, '0')}`;
        if (newMonth !== this._displayMonth) {
          this._displayMonth = newMonth;
        }
      }
    }
  };

  /**
   * Select a date
   */
  private _selectDate(dateISO: string): void {
    if (!this._isDateInRange(dateISO)) return;

    const previousValue = this.value;
    this.value = dateISO;

    this.dispatchPrimitiveEvent('r-datepicker-change', {
      value: this.value,
      previousValue,
    });

    this.expanded = false;
    this.dispatchPrimitiveEvent('r-datepicker-close', { expanded: false });
  }

  /**
   * Check if date is in valid range (min/max)
   */
  private _isDateInRange(dateISO: string): boolean {
    const date = new Date(dateISO);
    const time = date.getTime();

    if (this.min) {
      const minDate = new Date(this.min);
      if (time < minDate.getTime()) return false;
    }

    if (this.max) {
      const maxDate = new Date(this.max);
      if (time > maxDate.getTime()) return false;
    }

    return true;
  }

  /**
   * Convert Date to ISO string (YYYY-MM-DD)
   */
  private _dateToISO(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Get today's date in ISO format
   */
  private _getTodayISO(): string {
    return this._dateToISO(new Date());
  }

  /**
   * Navigate to previous month
   */
  private _previousMonth(): void {
    const [year, month] = this._displayMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    this._displayMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Navigate to next month
   */
  private _nextMonth(): void {
    const [year, month] = this._displayMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    this._displayMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Get calendar grid data for current display month
   */
  private _getCalendarGrid(): Array<string | null> {
    const [year, month] = this._displayMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const grid: Array<string | null> = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      grid.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateISO = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      grid.push(dateISO);
    }

    return grid;
  }

  /**
   * Toggle expanded state
   */
  public toggle(): void {
    if (this.disabled) return;

    this.expanded = !this.expanded;
    this.dispatchPrimitiveEvent(this.expanded ? 'r-datepicker-open' : 'r-datepicker-close', {
      expanded: this.expanded,
    });
  }

  /**
   * Focus the datepicker
   */
  public override focus(): void {
    if (this.gridElement) {
      this.gridElement.focus();
    }
  }

  override render() {
    const [year, month] = this._displayMonth.split('-').map(Number);
    const monthName = this.monthNames[month - 1];
    const calendarGrid = this._getCalendarGrid();

    return html`
      <div part="base" class="r-datepicker">
        <button
          part="toggle"
          type="button"
          aria-label="Choose date"
          aria-expanded="${this.expanded}"
          ?disabled=${this.disabled}
          @click=${this.toggle}
        >
          <span part="value">${this.value || 'Select date'}</span>
        </button>

        ${
          this.expanded
            ? html`
              <div
                part="calendar"
                role="dialog"
                aria-modal="true"
                aria-label="Choose date"
              >
                <div part="header">
                  <button
                    part="prev-month"
                    type="button"
                    aria-label="Previous month"
                    @click=${this._previousMonth}
                    ?disabled=${this.disabled}
                  >
                    ‹
                  </button>
                  <h2 part="month-year" aria-live="polite" aria-atomic="true">
                    ${monthName} ${year}
                  </h2>
                  <button
                    part="next-month"
                    type="button"
                    aria-label="Next month"
                    @click=${this._nextMonth}
                    ?disabled=${this.disabled}
                  >
                    ›
                  </button>
                </div>

                <div
                  part="grid"
                  role="grid"
                  aria-labelledby="month-year"
                  tabindex="0"
                >
                  <div part="grid-header" role="row">
                    ${this.daysOfWeek.map(
                      (day) => html`
                        <div part="grid-header-cell" role="columnheader" aria-label="${day}">
                          <abbr title="${day}">${day}</abbr>
                        </div>
                      `
                    )}
                  </div>

                  ${this._renderGridRows(calendarGrid)}
                </div>
              </div>
            `
            : null
        }

        ${
          this.name ? html`<input type="hidden" name="${this.name}" value="${this.value}" />` : null
        }
      </div>
    `;
  }

  /**
   * Render calendar grid rows
   */
  private _renderGridRows(grid: Array<string | null>) {
    const rows: Array<Array<string | null>> = [];
    for (let i = 0; i < grid.length; i += 7) {
      rows.push(grid.slice(i, i + 7));
    }

    return rows.map(
      (row) => html`
        <div part="grid-row" role="row">
          ${row.map((dateISO) => this._renderGridCell(dateISO))}
        </div>
      `
    );
  }

  /**
   * Render a calendar grid cell
   */
  private _renderGridCell(dateISO: string | null) {
    if (!dateISO) {
      return html`<div part="grid-cell-empty" role="gridcell"></div>`;
    }

    const date = new Date(dateISO);
    const day = date.getDate();
    const isSelected = dateISO === this.value;
    const isFocused = dateISO === this._focusedDate;
    const isToday = dateISO === this._getTodayISO();
    const isDisabled = !this._isDateInRange(dateISO);

    const classes = {
      selected: isSelected,
      focused: isFocused,
      today: isToday,
      disabled: isDisabled,
    };

    return html`
      <div
        part="grid-cell ${Object.keys(classes)
          .filter((k) => classes[k as keyof typeof classes])
          .join(' ')}"
        role="gridcell"
        aria-selected="${isSelected}"
        aria-disabled="${isDisabled}"
        tabindex="${isFocused ? 0 : -1}"
        @click=${() => !isDisabled && this._selectDate(dateISO)}
      >
        <span part="day">${day}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-datepicker': RDatepicker;
  }
}
