/**
 * <rafters-progress> -- Web Component progress primitive.
 *
 * Mirrors the semantics of progress.tsx (value, max, variant, size) using
 * shadow-DOM-scoped CSS composed via classy-wc. Auto-registers on import and
 * is idempotent against double-define.
 *
 * Attributes:
 *  - value:   number in [0, max] (default: absent = indeterminate)
 *  - max:     number > 0 (default 100; non-numeric or non-positive falls back to 100)
 *  - variant: 'default' | 'primary' | 'secondary' | 'destructive'
 *             | 'success' | 'warning' | 'info' | 'accent' (default 'default')
 *  - size:    'sm' | 'default' | 'lg' (default 'default')
 *
 * Shadow DOM structure:
 *   <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax=max
 *        [aria-valuenow=clampedValue] [aria-valuetext="N%"]>
 *     <div class="progress-indicator" style="width: N%">
 *   </div>
 *
 * When indeterminate the host gets `aria-busy="true"`, the indicator
 * carries a `data-indeterminate` attribute (used by the stylesheet to
 * apply the slide animation), and no inline width is set.
 *
 * DOM APIs only -- never innerHTML. Styling comes exclusively from
 * progressStylesheet(...) adopted as the per-instance stylesheet.
 *
 * @cognitive-load 4/10
 * @accessibility role="progressbar" with aria-valuemin/max/now/text.
 *                Host aria-busy="true" when indeterminate.
 */

import { RaftersElement } from '../../primitives/rafters-element';
import { type ProgressSize, type ProgressVariant, progressStylesheet } from './progress.styles';

const ALLOWED_VARIANTS: ReadonlyArray<ProgressVariant> = [
  'default',
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'accent',
];

const ALLOWED_SIZES: ReadonlyArray<ProgressSize> = ['sm', 'default', 'lg'];

const OBSERVED_ATTRIBUTES: ReadonlyArray<string> = ['value', 'max', 'variant', 'size'] as const;

function parseVariant(value: string | null): ProgressVariant {
  if (value && (ALLOWED_VARIANTS as ReadonlyArray<string>).includes(value)) {
    return value as ProgressVariant;
  }
  return 'default';
}

function parseSize(value: string | null): ProgressSize {
  if (value && (ALLOWED_SIZES as ReadonlyArray<string>).includes(value)) {
    return value as ProgressSize;
  }
  return 'default';
}

function parseMax(raw: string | null): number {
  if (raw === null) return 100;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 100;
  return n;
}

interface ParsedValue {
  indeterminate: boolean;
  clamped: number;
}

function parseValue(raw: string | null, max: number): ParsedValue {
  if (raw === null) return { indeterminate: true, clamped: 0 };
  const n = Number(raw);
  if (!Number.isFinite(n)) return { indeterminate: true, clamped: 0 };
  const clamped = Math.min(Math.max(n, 0), max);
  return { indeterminate: false, clamped };
}

export class RaftersProgress extends RaftersElement {
  static readonly observedAttributes: ReadonlyArray<string> = OBSERVED_ATTRIBUTES;

  /** Per-instance stylesheet rebuilt on variant/size changes. */
  private _instanceSheet: CSSStyleSheet | null = null;

  override connectedCallback(): void {
    if (!this.shadowRoot) return;
    this._instanceSheet = new CSSStyleSheet();
    this._instanceSheet.replaceSync(this.composeCss());
    this.shadowRoot.adoptedStyleSheets = [this._instanceSheet];
    this.update();
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if ((name === 'variant' || name === 'size') && this._instanceSheet) {
      this._instanceSheet.replaceSync(this.composeCss());
    }
    this.update();
  }

  override disconnectedCallback(): void {
    this._instanceSheet = null;
  }

  /**
   * Build the CSS string for the current variant/size attributes.
   */
  private composeCss(): string {
    return progressStylesheet({
      variant: parseVariant(this.getAttribute('variant')),
      size: parseSize(this.getAttribute('size')),
    });
  }

  /**
   * Render the track + indicator. DOM APIs only -- never innerHTML.
   *
   * Host ARIA attributes are written on `this` so they surface on the
   * custom element itself (light DOM side). The inner track carries the
   * role="progressbar" and aria-value* attributes so assistive tech that
   * pierces through to the shadow DOM still finds a compliant node.
   */
  override render(): Node {
    const max = parseMax(this.getAttribute('max'));
    const { indeterminate, clamped } = parseValue(this.getAttribute('value'), max);

    // Host-level ARIA state for screen readers that read the light tree.
    if (indeterminate) {
      this.setAttribute('aria-busy', 'true');
    } else {
      this.removeAttribute('aria-busy');
    }

    const track = document.createElement('div');
    track.className = 'progress';
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', String(max));

    if (!indeterminate) {
      track.setAttribute('aria-valuenow', String(clamped));
      const percent = Math.round((clamped / max) * 100);
      track.setAttribute('aria-valuetext', `${percent}%`);
    }

    const indicator = document.createElement('div');
    indicator.className = 'progress-indicator';
    if (indeterminate) {
      indicator.setAttribute('data-indeterminate', '');
    } else {
      const percent = (clamped / max) * 100;
      indicator.setAttribute('style', `width: ${percent}%`);
    }

    track.appendChild(indicator);
    return track;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('rafters-progress')) {
  customElements.define('rafters-progress', RaftersProgress);
}
