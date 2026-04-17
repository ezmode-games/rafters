import { describe, expect, it } from 'vitest';
import {
  type ButtonSize,
  type ButtonVariant,
  buttonBase,
  buttonDisabled,
  buttonSizeStyles,
  buttonStylesheet,
  buttonVariantActive,
  buttonVariantFocusRing,
  buttonVariantHover,
  buttonVariantStyles,
} from './button.styles';

const ALL_VARIANTS: ReadonlyArray<ButtonVariant> = [
  'default',
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'muted',
  'accent',
  'outline',
  'ghost',
  'link',
];

const ALL_SIZES: ReadonlyArray<ButtonSize> = [
  'default',
  'xs',
  'sm',
  'lg',
  'icon',
  'icon-xs',
  'icon-sm',
  'icon-lg',
];

describe('buttonStylesheet', () => {
  it('returns base + default variant + default size when no options given', () => {
    const css = buttonStylesheet();
    expect(css).toContain('.button');
    expect(css).toContain('var(--color-primary)');
    expect(css).toContain('var(--color-primary-foreground)');
    expect(css).toContain('height: 2.5rem');
  });

  it('emits all 12 variants without throwing', () => {
    for (const v of ALL_VARIANTS) {
      expect(() => buttonStylesheet({ variant: v })).not.toThrow();
    }
  });

  it('emits all 8 sizes without throwing', () => {
    for (const s of ALL_SIZES) {
      expect(() => buttonStylesheet({ size: s })).not.toThrow();
    }
  });

  it('uses tokenVar() for all token references (no --duration/--ease)', () => {
    const css = buttonStylesheet({ variant: 'primary' });
    expect(css).not.toMatch(/var\(--duration-/);
    expect(css).not.toMatch(/var\(--ease-/);
    expect(css).toMatch(/var\(--motion-duration-/);
    expect(css).toMatch(/var\(--motion-ease-/);
  });

  it('applies disabled styles when disabled=true', () => {
    const css = buttonStylesheet({ disabled: true });
    expect(css).toContain('opacity: 0.5');
    expect(css).toContain('cursor: not-allowed');
    expect(css).toContain('pointer-events: none');
  });

  it('falls back to default for unknown variant/size', () => {
    const css = buttonStylesheet({
      variant: 'bogus' as never,
      size: 'huge' as never,
    });
    expect(css).toContain('var(--color-primary)');
    expect(css).toContain('height: 2.5rem');
  });

  it('emits focus-visible ring rule using the destructive-ring token', () => {
    const css = buttonStylesheet({ variant: 'destructive' });
    expect(css).toContain('.button:focus-visible');
    expect(css).toContain('var(--color-destructive-ring)');
  });

  it('emits hover and active rules for semantic variants', () => {
    const css = buttonStylesheet({ variant: 'primary' });
    expect(css).toContain('.button:hover:not(:disabled)');
    expect(css).toContain('var(--color-primary-hover)');
    expect(css).toContain('.button:active:not(:disabled)');
    expect(css).toContain('var(--color-primary-active)');
  });

  it('emits a prefers-reduced-motion at-rule that kills transitions', () => {
    const css = buttonStylesheet();
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('transition: none');
  });

  it('never emits a raw var() that is not a CSS custom property reference', () => {
    const css = buttonStylesheet({ variant: 'primary', size: 'lg' });
    // Every var() must start with --
    const matches = css.match(/var\([^)]+\)/g) ?? [];
    for (const m of matches) {
      expect(m).toMatch(/var\(--/);
    }
  });

  it('uses only --motion-duration-* and --motion-ease-* motion tokens', () => {
    const css = buttonStylesheet({
      variant: 'destructive',
      size: 'lg',
      disabled: true,
    });
    expect(css).toMatch(/var\(--motion-duration-fast\)/);
    expect(css).toMatch(/var\(--motion-ease-standard\)/);
    expect(css).not.toMatch(/var\(--duration-/);
    expect(css).not.toMatch(/var\(--ease-/);
  });

  it('emits :host display: inline-flex', () => {
    const css = buttonStylesheet();
    expect(css).toMatch(/:host\s*\{[^}]*display:\s*inline-flex/);
  });

  it('link variant emits transparent background and primary color', () => {
    const css = buttonStylesheet({ variant: 'link' });
    expect(css).toContain('background-color: transparent');
    expect(css).toContain('var(--color-primary)');
  });

  it('outline variant emits a 1px solid border with color-input', () => {
    const css = buttonStylesheet({ variant: 'outline' });
    expect(css).toContain('border-width: 1px');
    expect(css).toContain('border-style: solid');
    expect(css).toContain('var(--color-input)');
  });

  it('ghost variant emits transparent background with foreground color', () => {
    const css = buttonStylesheet({ variant: 'ghost' });
    expect(css).toContain('background-color: transparent');
    expect(css).toContain('var(--color-foreground)');
  });

  it('link hover adds text-decoration: underline', () => {
    const css = buttonStylesheet({ variant: 'link' });
    expect(css).toContain('text-decoration: underline');
  });

  it('semantic hover/active tokens cover every semantic variant', () => {
    const semantic: ReadonlyArray<ButtonVariant> = [
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
    for (const v of semantic) {
      const css = buttonStylesheet({ variant: v });
      // muted hover/active uses its own tokens too
      const normalized = v === 'default' ? 'primary' : v;
      expect(css).toContain(`var(--color-${normalized}-hover)`);
      expect(css).toContain(`var(--color-${normalized}-active)`);
    }
  });

  it('focus ring uses the neutral --color-ring for outline/ghost/muted/link', () => {
    for (const v of ['outline', 'ghost', 'muted', 'link'] as const) {
      const css = buttonStylesheet({ variant: v });
      expect(css).toContain('var(--color-ring)');
    }
  });

  it('emits distinct heights per size', () => {
    expect(buttonStylesheet({ size: 'default' })).toContain('height: 2.5rem');
    expect(buttonStylesheet({ size: 'xs' })).toContain('height: 1.5rem');
    expect(buttonStylesheet({ size: 'sm' })).toContain('height: 2rem');
    expect(buttonStylesheet({ size: 'lg' })).toContain('height: 3rem');
  });

  it('icon sizes set both height and width', () => {
    const iconCss = buttonStylesheet({ size: 'icon' });
    expect(iconCss).toContain('height: 2.5rem');
    expect(iconCss).toContain('width: 2.5rem');

    const iconXsCss = buttonStylesheet({ size: 'icon-xs' });
    expect(iconXsCss).toContain('height: 1.5rem');
    expect(iconXsCss).toContain('width: 1.5rem');

    const iconSmCss = buttonStylesheet({ size: 'icon-sm' });
    expect(iconSmCss).toContain('height: 2rem');
    expect(iconSmCss).toContain('width: 2rem');

    const iconLgCss = buttonStylesheet({ size: 'icon-lg' });
    expect(iconLgCss).toContain('height: 3rem');
    expect(iconLgCss).toContain('width: 3rem');
  });

  it('uses label font-size tokens per size', () => {
    expect(buttonStylesheet({ size: 'xs' })).toContain('var(--font-size-label-small)');
    expect(buttonStylesheet({ size: 'sm' })).toContain('var(--font-size-label-small)');
    expect(buttonStylesheet({ size: 'default' })).toContain('var(--font-size-label-medium)');
    expect(buttonStylesheet({ size: 'lg' })).toContain('var(--font-size-label-large)');
  });

  it('emits a :disabled rule that carries the disabled declarations', () => {
    const css = buttonStylesheet();
    expect(css).toContain('.button:disabled');
    // Closing match on the opacity declaration for defensive scoping.
    expect(css).toMatch(/\.button:disabled\s*\{[^}]*opacity:\s*0\.5/);
  });

  it('exports buttonBase with inline-flex and cursor pointer', () => {
    expect(buttonBase).toMatchObject({
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      cursor: 'pointer',
    });
  });

  it('exports buttonDisabled with opacity, cursor, and pointer-events', () => {
    expect(buttonDisabled).toMatchObject({
      opacity: '0.5',
      cursor: 'not-allowed',
      'pointer-events': 'none',
    });
  });

  it('exports style maps covering every variant/size key', () => {
    for (const v of ALL_VARIANTS) {
      expect(buttonVariantStyles[v]).toBeDefined();
      expect(buttonVariantHover[v]).toBeDefined();
      expect(buttonVariantActive[v]).toBeDefined();
      expect(buttonVariantFocusRing[v]).toBeDefined();
    }
    for (const s of ALL_SIZES) {
      expect(buttonSizeStyles[s]).toBeDefined();
    }
  });

  it('never emits a raw hex colour or rgb() literal', () => {
    const css = buttonStylesheet({
      variant: 'destructive',
      size: 'lg',
      disabled: true,
    });
    expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(css).not.toMatch(/rgb\(/);
  });
});
