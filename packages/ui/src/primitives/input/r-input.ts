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
import { customElement, property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { RPrimitiveBase } from '../../base/RPrimitiveBase';
import type { ValidationState } from '../../base/types';

@customElement('r-input')
export class RInput extends RPrimitiveBase {
  @property({ type: String }) type:
    | 'text'
    | 'email'
    | 'password'
    | 'search'
    | 'tel'
    | 'url'
    | 'number' = 'text';

  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: String, reflect: true }) validationState?: ValidationState;
  @property({ type: String }) errorMessage = '';
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property({ type: String }) pattern?: string;
  @property({ type: String }) autocomplete?: string;
  @property({ type: String }) name?: string;

  @query('input') private inputElement!: HTMLInputElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'textbox');
  }

  private _handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    this.value = target.value;

    this.dispatchPrimitiveEvent('r-input', {
      value: this.value,
      isValid: target.validity.valid,
    });
  };

  private _handleChange = (): void => {
    this.dispatchPrimitiveEvent('r-change', {
      value: this.value,
      isValid: this.inputElement.validity.valid,
    });
  };

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

  public override focus(): void {
    this.inputElement?.focus();
  }

  public override blur(): void {
    this.inputElement?.blur();
  }

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
        aria-invalid=${this.validationState === 'error' ? 'true' : 'false'}
        aria-errormessage=${this.errorMessage || ''}
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
