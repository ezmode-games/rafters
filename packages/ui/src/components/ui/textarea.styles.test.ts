/**
 * Unit tests for textareaStylesheet()
 *
 * Verifies selector composition, token usage (--motion-duration-* /
 * --motion-ease-* only), graceful fallback on unknown variant/size/resize
 * values, and reduced-motion wrapping.
 */

import { describe, expect, it } from 'vitest';
import {
  type TextareaResize,
  type TextareaSize,
  type TextareaVariant,
  textareaBase,
  textareaDisabled,
  textareaFocusVisible,
  textareaInvalid,
  textareaPlaceholder,
  textareaResizeStyles,
  textareaSizeStyles,
  textareaStylesheet,
  textareaVariantBorderToken,
  textareaVariantRingToken,
  textareaVariantStyles,
} from './textarea.styles';

describe('textareaStylesheet', () => {
  it('emits a :host rule with display: block', () => {
    expect(textareaStylesheet()).toMatch(/:host\s*\{[^}]*display:\s*block/);
  });

  it('emits the focus-visible ring rule using --color-ring', () => {
    const css = textareaStylesheet();
    expect(css).toMatch(/textarea:focus-visible\s*\{/);
    expect(css).toContain('var(--color-ring)');
  });

  it('emits ::placeholder rule using --color-muted-foreground', () => {
    expect(textareaStylesheet()).toMatch(
      /textarea::placeholder\s*\{[^}]*var\(--color-muted-foreground\)/,
    );
  });

  it('emits the :host(:focus-within) textarea focus rule', () => {
    expect(textareaStylesheet()).toMatch(/:host\(:focus-within\)\s+textarea\s*\{/);
  });

  it('emits disabled rules for host and inner textarea', () => {
    const css = textareaStylesheet();
    expect(css).toMatch(/:host\(\[disabled\]\)\s+textarea\s*\{/);
    expect(css).toMatch(/textarea:disabled\s*\{/);
  });

  it('emits aria-invalid rules using --color-destructive', () => {
    const css = textareaStylesheet();
    expect(css).toMatch(/:host\(\[aria-invalid="true"\]\)\s+textarea\s*\{/);
    expect(css).toMatch(/textarea\[aria-invalid="true"\]\s*\{/);
    expect(css).toContain('var(--color-destructive)');
  });

  it('falls back to default variant/size/resize on unknown values', () => {
    expect(() =>
      textareaStylesheet({
        variant: 'space-laser' as never,
        size: 'gigantic' as never,
        resize: 'sideways' as never,
      }),
    ).not.toThrow();
  });

  it('uses --motion-duration-* not --duration-*', () => {
    const css = textareaStylesheet();
    expect(css).not.toMatch(/var\(--duration-/);
    expect(css).not.toMatch(/var\(--ease-/);
    expect(css).toContain('var(--motion-duration-fast)');
    expect(css).toContain('var(--motion-ease-standard)');
  });

  it('emits resize: vertical when resize=vertical', () => {
    expect(textareaStylesheet({ resize: 'vertical' })).toContain('resize: vertical');
  });

  it('emits resize: horizontal when resize=horizontal', () => {
    expect(textareaStylesheet({ resize: 'horizontal' })).toContain('resize: horizontal');
  });

  it('emits resize: both when resize=both', () => {
    expect(textareaStylesheet({ resize: 'both' })).toContain('resize: both');
  });

  it('defaults resize to none when no option is supplied', () => {
    expect(textareaStylesheet()).toContain('resize: none');
  });

  it('wraps transition removal in prefers-reduced-motion', () => {
    expect(textareaStylesheet()).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  it('uses box-sizing: border-box on the base rule', () => {
    expect(textareaStylesheet()).toContain('box-sizing: border-box');
  });

  it('uses font: inherit on the base rule', () => {
    expect(textareaStylesheet()).toContain('font: inherit');
  });

  it('uses width: 100% on the base rule', () => {
    expect(textareaStylesheet()).toContain('width: 100%');
  });

  it('uses spacing tokens for padding via tokenVar only', () => {
    const css = textareaStylesheet();
    expect(css).toContain('var(--spacing-2)');
    expect(css).toContain('var(--spacing-3)');
  });

  it('uses radius-md via tokenVar', () => {
    expect(textareaStylesheet()).toContain('border-radius: var(--radius-md)');
  });

  it('uses color-background via tokenVar on the base rule', () => {
    expect(textareaStylesheet()).toContain('background-color: var(--color-background)');
  });

  it('uses color-foreground via tokenVar on the base rule', () => {
    expect(textareaStylesheet()).toContain('color: var(--color-foreground)');
  });

  it('selects destructive variant border via --color-destructive', () => {
    const css = textareaStylesheet({ variant: 'destructive' });
    expect(css).toContain('var(--color-destructive)');
  });

  it('selects success variant border via --color-success', () => {
    const css = textareaStylesheet({ variant: 'success' });
    expect(css).toContain('var(--color-success)');
  });

  it('emits different min-height for sm, default, and lg sizes', () => {
    expect(textareaStylesheet({ size: 'sm' })).toContain('min-height: 4rem');
    expect(textareaStylesheet({ size: 'default' })).toContain('min-height: 5rem');
    expect(textareaStylesheet({ size: 'lg' })).toContain('min-height: 7rem');
  });

  it('emits --rafters-textarea-ring custom property per variant', () => {
    const css = textareaStylesheet({ variant: 'destructive' });
    expect(css).toContain('--rafters-textarea-ring');
  });

  it('never emits a raw var(--duration- or var(--ease- token', () => {
    const css = textareaStylesheet({
      variant: 'destructive',
      size: 'lg',
      resize: 'vertical',
    });
    expect(css).not.toContain('var(--duration-');
    expect(css).not.toContain('var(--ease-');
  });

  it('emits no raw hex or rgb literals -- tokens only', () => {
    const css = textareaStylesheet({ variant: 'destructive', size: 'lg' });
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(css).not.toMatch(/rgb\(/);
  });

  describe('exports', () => {
    it('exposes textareaBase as a CSSProperties map with token-driven values', () => {
      expect(textareaBase['border-color']).toBe('var(--color-input)');
      expect(textareaBase['background-color']).toBe('var(--color-background)');
      expect(textareaBase['border-radius']).toBe('var(--radius-md)');
      expect(textareaBase.color).toBe('var(--color-foreground)');
      expect(textareaBase.display).toBe('block');
      expect(textareaBase.width).toBe('100%');
      expect(textareaBase['box-sizing']).toBe('border-box');
    });

    it('exposes textareaPlaceholder with opacity:1 and muted-foreground color', () => {
      expect(textareaPlaceholder.color).toBe('var(--color-muted-foreground)');
      expect(textareaPlaceholder.opacity).toBe('1');
    });

    it('exposes textareaDisabled with cursor:not-allowed and opacity:0.5', () => {
      expect(textareaDisabled.cursor).toBe('not-allowed');
      expect(textareaDisabled.opacity).toBe('0.5');
    });

    it('exposes textareaFocusVisible with outline:none and color-ring box-shadow', () => {
      expect(textareaFocusVisible.outline).toBe('none');
      expect(textareaFocusVisible['border-color']).toBe('var(--color-ring)');
      expect(textareaFocusVisible['box-shadow']).toContain('var(--color-ring)');
    });

    it('exposes textareaInvalid with destructive border', () => {
      expect(textareaInvalid['border-color']).toBe('var(--color-destructive)');
    });

    it('exposes a variant style map for every documented variant', () => {
      const variants: ReadonlyArray<TextareaVariant> = [
        'default',
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
        'muted',
        'accent',
      ];
      for (const v of variants) {
        expect(textareaVariantStyles[v]).toBeDefined();
        expect(textareaVariantBorderToken[v]).toBeDefined();
        expect(textareaVariantRingToken[v]).toBeDefined();
      }
    });

    it('exposes a size style map for every documented size', () => {
      const sizes: ReadonlyArray<TextareaSize> = ['sm', 'default', 'lg'];
      for (const s of sizes) {
        expect(textareaSizeStyles[s]).toBeDefined();
      }
    });

    it('exposes a resize style map for every documented resize value', () => {
      const resizeValues: ReadonlyArray<TextareaResize> = [
        'none',
        'vertical',
        'horizontal',
        'both',
      ];
      for (const r of resizeValues) {
        expect(textareaResizeStyles[r]).toBeDefined();
        expect(textareaResizeStyles[r].resize).toBe(r);
      }
    });

    it('default variant border token aliases color-primary', () => {
      expect(textareaVariantBorderToken.default).toBe('color-primary');
      expect(textareaVariantRingToken.default).toBe('color-primary-ring');
    });

    it('muted variant border token aliases color-input', () => {
      expect(textareaVariantBorderToken.muted).toBe('color-input');
      expect(textareaVariantRingToken.muted).toBe('color-ring');
    });
  });

  it('handles every documented variant without throwing', () => {
    const variants: ReadonlyArray<TextareaVariant> = [
      'default',
      'primary',
      'secondary',
      'destructive',
      'success',
      'warning',
      'info',
      'muted',
      'accent',
    ];
    for (const variant of variants) {
      expect(() => textareaStylesheet({ variant })).not.toThrow();
    }
  });

  it('handles every documented size without throwing', () => {
    const sizes: ReadonlyArray<TextareaSize> = ['sm', 'default', 'lg'];
    for (const size of sizes) {
      expect(() => textareaStylesheet({ size })).not.toThrow();
    }
  });

  it('handles every documented resize value without throwing', () => {
    const resizes: ReadonlyArray<TextareaResize> = ['none', 'vertical', 'horizontal', 'both'];
    for (const resize of resizes) {
      expect(() => textareaStylesheet({ resize })).not.toThrow();
    }
  });
});
