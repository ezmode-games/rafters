/**
 * Headless textarea primitive with validation states and ARIA support
 *
 * @registryName r-textarea
 * @registryVersion 0.1.0
 * @registryPath primitives/textarea/r-textarea.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - textbox role, keyboard navigation, clear labels, 44px touch targets
 * @dependencies lit, local:../../base/RPrimitiveBase.ts, local:../../utils/keyboard.ts
 *
 * @example
 * ```html
 * <r-textarea value="Hello" placeholder="Enter text"></r-textarea>
 * <r-textarea rows="5" maxlength="500"></r-textarea>
 * <r-textarea disabled></r-textarea>
 * ```
 */
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import type { ValidationState } from '../../base/types';

@customElement('r-textarea')
export class RTextarea extends RPrimitiveBase {
  static override properties = {
    ...RPrimitiveBase.properties,
    value: { type: String },
    placeholder: { type: String },
    required: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    validationState: { type: String, reflect: true },
    errorMessage: { type: String },
    rows: { type: Number },
    maxlength: { type: Number },
    name: { type: String },
  };

  /**
   * Textarea value
   */
  value = '';

  /**
   * Placeholder text
   */
  placeholder = '';

  /**
   * Required field
   */
  required = false;

  /**
   * Read-only state
   */
  readonly = false;

  /**
   * Validation state
   */
  validationState?: ValidationState;

  /**
   * Error message
   */
  errorMessage = '';

  /**
   * Number of visible text rows
   */
  rows = 3;

  /**
   * Max length
   */
  maxlength?: number;

  /**
   * Textarea name for forms
   */
  name?: string;

  /**
   * Textarea reference
   */
  @query('textarea') private textareaElement!: HTMLTextAreaElement;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Handle input event
   */
  private _handleInput = (e: Event): void => {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;

    this.dispatchPrimitiveEvent('r-input', {
      value: this.value,
      isValid: target.validity.valid,
    });
  };

  /**
   * Handle change event
   */
  private _handleChange = (): void => {
    this.dispatchPrimitiveEvent('r-change', {
      value: this.value,
      isValid: this.textareaElement.validity.valid,
    });
  };

  /**
   * Handle blur event - trigger validation
   */
  private _handleTextareaBlur = (): void => {
    if (this.required && !this.value) {
      this.validationState = 'error';
      this.errorMessage = 'This field is required';
    } else if (this.value) {
      this.validationState = 'valid';
      this.errorMessage = '';
    }

    this.dispatchPrimitiveEvent('r-blur', { value: this.value });
  };

  /**
   * Focus the textarea
   */
  public override focus(): void {
    this.textareaElement?.focus();
  }

  /**
   * Blur the textarea
   */
  public override blur(): void {
    this.textareaElement?.blur();
  }

  /**
   * Select textarea text
   */
  public select(): void {
    this.textareaElement?.select();
  }

  override render() {
    return html`
			<textarea
				part="textarea"
				.value=${live(this.value)}
				placeholder=${this.placeholder || ''}
				?required=${this.required}
				?readonly=${this.readonly}
				?disabled=${this.disabled}
				rows=${this.rows}
				maxlength=${this.maxlength ?? ''}
				name=${this.name ?? ''}
				aria-invalid=${this.validationState === 'error' ? 'true' : 'false'}
				aria-errormessage=${this.errorMessage || ''}
				aria-label=${this.ariaLabel ?? ''}
				aria-labelledby=${this.ariaLabelledBy ?? ''}
				aria-describedby=${this.ariaDescribedBy ?? ''}
				aria-required=${this.required ? 'true' : 'false'}
				@input=${this._handleInput}
				@change=${this._handleChange}
				@blur=${this._handleTextareaBlur}
			></textarea>
		`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-textarea': RTextarea;
  }
}
