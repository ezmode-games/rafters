/**
 * Shared class resolution for Typography components.
 *
 * Variant defaults are stored dimensionally (size, weight, color, line, tracking,
 * family, align, transform) rather than as flat utility strings. Token prop
 * overrides replace the matching dimension at emit time, so defaults never fight
 * overrides in the Tailwind cascade (which orders utilities alphabetically and
 * thus cannot be trusted for overrides: `text-accent` would lose to
 * `text-foreground` on 'a' < 'f').
 */

import { getFillMetadata, resolveFillClasses } from '../../primitives/fill-resolver';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted'
  | 'code'
  | 'codeblock'
  | 'blockquote'
  | 'mark'
  | 'abbr'
  | 'ul'
  | 'ol'
  | 'li';

export interface TypographyTokenProps {
  size?: string | undefined;
  weight?: string | undefined;
  color?: string | undefined;
  line?: string | undefined;
  tracking?: string | undefined;
  family?: string | undefined;
  align?: string | undefined;
  transform?: string | undefined;
}

interface CqOverrides {
  size?: string;
  weight?: string;
  line?: string;
  tracking?: string;
}

interface VariantDefaults extends TypographyTokenProps {
  layout?: string;
  cq?: Record<string, CqOverrides>;
}

const VARIANTS: Record<TypographyVariant, VariantDefaults> = {
  h1: {
    size: '4xl',
    weight: 'bold',
    tracking: 'tight',
    color: 'foreground',
    layout: 'scroll-m-20',
    cq: { lg: { size: '5xl' } },
  },
  h2: {
    size: '3xl',
    weight: 'semibold',
    tracking: 'tight',
    color: 'foreground',
    layout: 'scroll-m-20',
  },
  h3: {
    size: '2xl',
    weight: 'semibold',
    tracking: 'tight',
    color: 'foreground',
    layout: 'scroll-m-20',
  },
  h4: {
    size: 'xl',
    weight: 'semibold',
    tracking: 'tight',
    color: 'foreground',
    layout: 'scroll-m-20',
  },
  p: { line: '7', color: 'foreground' },
  lead: { size: 'xl', color: 'muted-foreground' },
  large: { size: 'lg', weight: 'semibold', color: 'foreground' },
  small: { size: 'sm', weight: 'medium', line: 'none', color: 'foreground' },
  muted: { size: 'sm', color: 'muted-foreground' },
  code: {
    size: 'sm',
    family: 'mono',
    color: 'foreground',
    layout: 'rounded bg-muted px-1 py-0.5',
  },
  codeblock: {
    size: 'sm',
    family: 'mono',
    color: 'foreground',
    layout: 'relative rounded-lg bg-muted p-4 overflow-x-auto [&_code]:bg-transparent [&_code]:p-0',
  },
  blockquote: { color: 'foreground', layout: 'mt-6 border-l-2 border-border pl-6 italic' },
  mark: { color: 'accent-foreground', layout: 'bg-accent px-1 rounded' },
  abbr: { layout: 'cursor-help underline decoration-dotted underline-offset-4' },
  ul: { color: 'foreground', layout: 'my-6 ml-6 list-disc [&>li]:mt-2' },
  ol: { color: 'foreground', layout: 'my-6 ml-6 list-decimal [&>li]:mt-2' },
  li: { line: '7' },
};

const DIM_TO_UTIL: Record<keyof TypographyTokenProps, (v: string) => string> = {
  size: (v) => `text-${v}`,
  weight: (v) => `font-${v}`,
  line: (v) => `leading-${v}`,
  tracking: (v) => `tracking-${v}`,
  family: (v) => `font-${v}`,
  align: (v) => `text-${v}`,
  transform: (v) => v,
  color: (v) => {
    const fill = getFillMetadata(v);
    return fill ? resolveFillClasses(fill, 'text') : `text-${v}`;
  },
};

function emitDim(dim: keyof TypographyTokenProps, value: string, prefix = ''): string {
  const util = DIM_TO_UTIL[dim](value);
  if (!prefix) return util;
  return util
    .split(/\s+/)
    .map((u) => `${prefix}${u}`)
    .join(' ');
}

function pickDefined<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] != null) out[key] = obj[key];
  }
  return out;
}

export function resolveTypography(
  variant: TypographyVariant,
  overrides: TypographyTokenProps = {},
): string {
  const defaults = VARIANTS[variant];
  const dims: TypographyTokenProps = { ...defaults, ...pickDefined(overrides) };
  delete (dims as VariantDefaults).layout;
  delete (dims as VariantDefaults).cq;

  const classes: string[] = [];
  if (defaults.layout) classes.push(defaults.layout);

  for (const key of Object.keys(DIM_TO_UTIL) as (keyof TypographyTokenProps)[]) {
    const value = dims[key];
    if (value != null) classes.push(emitDim(key, value));
  }

  // CQ defaults survive only where the prop didn't override the same dimension.
  if (defaults.cq) {
    for (const [breakpoint, cqOverrides] of Object.entries(defaults.cq)) {
      for (const key of Object.keys(cqOverrides) as (keyof CqOverrides)[]) {
        if (overrides[key] != null) continue;
        const value = cqOverrides[key];
        if (value != null) classes.push(emitDim(key, value, `@${breakpoint}:`));
      }
    }
  }

  return classes.join(' ');
}

/**
 * Back-compat flat string map. Computed from the dimensional defaults.
 * Prefer `resolveTypography(variant, props)` when overrides are in play.
 */
export const typographyClasses = Object.fromEntries(
  (Object.keys(VARIANTS) as TypographyVariant[]).map((v) => [v, resolveTypography(v)]),
) as Record<TypographyVariant, string>;

/**
 * @deprecated Use `resolveTypography(variant, props)` so overrides replace
 * defaults instead of appending. Kept so existing consumers don't break.
 */
export function tokenPropsToClasses(props: TypographyTokenProps): string {
  const classes: string[] = [];
  for (const key of Object.keys(DIM_TO_UTIL) as (keyof TypographyTokenProps)[]) {
    const value = props[key];
    if (value != null) classes.push(emitDim(key, value));
  }
  return classes.join(' ');
}
