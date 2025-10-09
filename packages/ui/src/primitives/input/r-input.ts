/**
 * Headless text input primitive with validation states and ARIA support
 *
 * @registryName r-input
 * @registryVersion 0.1.0
 * @registryPath primitives/input/r-input.ts
 * @registryType registry:primitive
 *
 * @accessibility WCAG AAA - textbox role, keyboard navigation, clear labels
 * @dependencies lit, local:../../base/RPrimitiveBase.ts
 *
 * @example
 * ```html
 * <r-input value="Hello" placeholder="Enter text"></r-input>
 * <r-input type="email" required></r-input>
 * <r-input disabled></r-input>
 * ```
 */
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import type { ValidationState } from '../../base/types';

@customElement('r-input')
export class RInput extends RPrimitiveBase {
  static override properties = {
    ...RPrimitiveBase.properties,
    type: { type: String },
    value: { type: String },
    placeholder: { type: String },
    required: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    validationState: { type: String, reflect: true },
    errorMessage: { type: String },
    minlength: { type: Number },
    maxlength: { type: Number },
    pattern: { type: String },
    autocomplete: { type: String },
    name: { type: String },
    inputmode: { type: String },
  };

  /**
   * Input type
   */
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'search'
    | 'tel'
    | 'url'
    | 'number' = 'text';

  /**
   * Input value
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
   * Min length
   */
  minlength?: number;

  /**
   * Max length
   */
  maxlength?: number;

  /**
   * Pattern for validation
   */
  pattern?: string;

  /**
   * Autocomplete attribute
   */
  autocomplete?: string;

  /**
   * Input name for forms
   */
  name?: string;

  /**
   * Input mode for mobile keyboards
   */
  inputmode?:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';

  /**
   * Input reference
   */
  @query('input') private inputElement!: HTMLInputElement;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Handle input event
   */
  private _handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
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
      isValid: this.inputElement.validity.valid,
    });
  };

  /**
   * Handle blur event - trigger validation
   */
  private _handleInputBlur = (): void => {
    if (this.required && !this.value) {
      this.validationState = 'error';
      this.errorMessage = 'This field is required';
    } else if (this.pattern && this.value) {
      const regex = new RegExp(this.pattern);
      if (!regex.test(this.value)) {
        this.validationState = 'error';
        this.errorMessage = 'Invalid format';
      } else {
        this.validationState = 'valid';
        this.errorMessage = '';
      }
    } else if (this.value) {
      this.validationState = 'valid';
      this.errorMessage = '';
    }

    this.dispatchPrimitiveEvent('r-blur', { value: this.value });
  };

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

  /**
   * Select input text
   */
  public select(): void {
    this.inputElement?.select();
  }

  override render() {
    return html`
			<input
				part="input"
				type=${this.type}
				.value=${live(this.value)}
				placeholder=${this.placeholder || ''}
				?required=${this.required}
				?readonly=${this.readonly}
				?disabled=${this.disabled}
				minlength=${this.minlength ?? ''}
				maxlength=${this.maxlength ?? ''}
				pattern=${this.pattern ?? ''}
				autocomplete=${this.autocomplete ?? ''}
				name=${this.name ?? ''}
				inputmode=${this.inputmode ?? ''}
				aria-invalid=${this.validationState === 'error' ? 'true' : 'false'}
				aria-errormessage=${this.errorMessage || ''}
				aria-label=${this.ariaLabel ?? ''}
				aria-labelledby=${this.ariaLabelledBy ?? ''}
				aria-describedby=${this.ariaDescribedBy ?? ''}
				aria-required=${this.required ? 'true' : 'false'}
				@input=${this._handleInput}
				@change=${this._handleChange}
				@blur=${this._handleInputBlur}
			/>
		`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'r-input': RInput;
  }
}
