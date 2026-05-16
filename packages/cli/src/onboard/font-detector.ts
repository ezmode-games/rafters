/**
 * Font detection in source CSS (#1511).
 *
 * `rafters init` reads the project's main stylesheet and recovers any
 * fonts loaded via `@import url('https://fonts.googleapis.com/...')`
 * or `@font-face { ... }`. The result is preserved through the rafters
 * output CSS so the consumer's typography keeps working after init.
 *
 * The framework-aware HTML `<link>` injection (sibling #1512 issue)
 * consumes the same `DetectedFont[]`.
 */

import * as csstree from 'css-tree';
import type { ParsedCSS } from './css-parser.js';

export interface DetectedFont {
  /** Font family name, normalised (no surrounding quotes). */
  family: string;
  /** Where the font is loaded from. */
  source: 'google' | 'self-hosted' | 'system';
  /** Google Fonts URL when `source === 'google'`. Absent otherwise. */
  importUrl?: string;
  /** Verbatim @font-face block when `source === 'self-hosted'`. */
  fontFaceBlock?: string;
  /** Weight values discovered (Google `wght@...` or @font-face descriptors). */
  weights?: string[];
  /** Style values discovered (`normal`, `italic`, ...). */
  styles?: string[];
}

const GOOGLE_FONTS_HOST = 'fonts.googleapis.com';

/**
 * Walk parsed CSS for fonts and return the deduplicated list.
 * `rawCss` is the original text used as a fallback when the AST loses
 * fidelity on a particular at-rule.
 */
export function detectFonts(parsed: ParsedCSS, rawCss: string): DetectedFont[] {
  let ast: csstree.CssNode;
  try {
    ast = csstree.parse(rawCss, { positions: true });
  } catch {
    return [];
  }

  const fonts = new Map<string, DetectedFont>();

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node) {
      if (node.type !== 'Atrule') return;

      if (node.name === 'import') {
        const url = extractImportUrl(node);
        if (!url) return;
        if (!isGoogleFontsUrl(url)) return;
        const parsedFamilies = parseGoogleFontsUrl(url);
        for (const font of parsedFamilies) {
          const existing = fonts.get(font.family);
          if (existing && existing.source === 'self-hosted') {
            // self-hosted entry wins over a separate Google import for the
            // same family -- the user already had a local copy.
            continue;
          }
          fonts.set(font.family, { ...font, importUrl: url });
        }
      } else if (node.name === 'font-face') {
        const block = csstree.generate(node);
        const family = extractFontFaceFamily(node);
        if (!family) return;
        const weights = extractFontFaceDescriptor(node, 'font-weight');
        const styles = extractFontFaceDescriptor(node, 'font-style');
        const detected: DetectedFont = {
          family,
          source: 'self-hosted',
          fontFaceBlock: block,
          ...(weights.length ? { weights } : {}),
          ...(styles.length ? { styles } : {}),
        };
        // self-hosted always wins on collision -- it's the explicit local
        // declaration, not a CDN preference.
        fonts.set(family, detected);
      }
    },
  });

  // System fonts: any --font-* custom property naming a family that we
  // haven't loaded via @import or @font-face. Heuristic surfaces fonts
  // the user references but never imports (they expect system fonts).
  for (const v of parsed.variables) {
    if (!/^--font(-|$)/.test(v.name)) continue;
    const familyName = extractPrimaryFamily(v.value);
    if (!familyName) continue;
    if (fonts.has(familyName)) continue;
    if (isLikelyGenericKeyword(familyName)) continue;
    fonts.set(familyName, { family: familyName, source: 'system' });
  }

  return [...fonts.values()];
}

function extractImportUrl(atrule: csstree.Atrule): string | null {
  if (!atrule.prelude) return null;
  const text = csstree.generate(atrule.prelude);
  const match = text.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)|['"]([^'"]+)['"]/);
  return match?.[1] ?? match?.[2] ?? null;
}

function isGoogleFontsUrl(url: string): boolean {
  return url.includes(GOOGLE_FONTS_HOST);
}

/**
 * Parse a Google Fonts URL into per-family records. Handles both `css`
 * (legacy single family) and `css2` (multi-family `&family=` repeats)
 * endpoints.
 *
 * Example: `css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap`
 * yields `[{family:'Inter', weights:['400','500','700'], ...},
 *          {family:'JetBrains Mono', weights:['400','700'], ...}]`.
 */
function parseGoogleFontsUrl(url: string): DetectedFont[] {
  const queryIndex = url.indexOf('?');
  if (queryIndex < 0) return [];
  const query = url.slice(queryIndex + 1);
  const params = query.split('&');

  const families: DetectedFont[] = [];
  for (const param of params) {
    if (!param.startsWith('family=')) continue;
    const raw = decodeURIComponent(param.slice('family='.length));
    // Format: `Inter:wght@400;500;700` or `Plus+Jakarta+Sans:ital,wght@0,400;1,500`
    const [familyPart, axes] = raw.split(':');
    if (!familyPart) continue;
    const family = familyPart.replace(/\+/g, ' ');
    const weights: string[] = [];
    const styles: string[] = [];
    if (axes) {
      // `wght@400;500;700` or `ital,wght@0,400;1,500`
      const [axisNames, valuesPart] = axes.split('@');
      if (axisNames && valuesPart) {
        const axisList = axisNames.split(',');
        const wghtIndex = axisList.indexOf('wght');
        const italIndex = axisList.indexOf('ital');
        const tuples = valuesPart.split(';');
        for (const tuple of tuples) {
          const parts = tuple.split(',');
          if (wghtIndex >= 0 && parts[wghtIndex]) {
            const w = parts[wghtIndex];
            if (w && !weights.includes(w)) weights.push(w);
          }
          if (italIndex >= 0 && parts[italIndex]) {
            const style = parts[italIndex] === '1' ? 'italic' : 'normal';
            if (!styles.includes(style)) styles.push(style);
          }
        }
      }
    }
    families.push({
      family,
      source: 'google',
      ...(weights.length ? { weights } : {}),
      ...(styles.length ? { styles } : {}),
    });
  }
  return families;
}

function extractFontFaceFamily(atrule: csstree.Atrule): string | null {
  if (!atrule.block) return null;
  let found: string | null = null;
  csstree.walk(atrule.block, {
    visit: 'Declaration',
    enter(decl) {
      if (decl.type !== 'Declaration') return;
      if (decl.property !== 'font-family') return;
      const text = csstree.generate(decl.value).trim();
      found = stripFamilyQuotes(text);
    },
  });
  return found;
}

function extractFontFaceDescriptor(atrule: csstree.Atrule, descriptor: string): string[] {
  if (!atrule.block) return [];
  const values: string[] = [];
  csstree.walk(atrule.block, {
    visit: 'Declaration',
    enter(decl) {
      if (decl.type !== 'Declaration') return;
      if (decl.property !== descriptor) return;
      const text = csstree.generate(decl.value).trim();
      // `font-weight: 400` or `font-weight: 400 700` (variable range)
      for (const token of text.split(/\s+/)) {
        if (token && !values.includes(token)) values.push(token);
      }
    },
  });
  return values;
}

/**
 * `--font-sans: 'Inter', sans-serif` -> `Inter`.
 * Strips quotes, takes the first comma-separated entry.
 */
function extractPrimaryFamily(value: string): string | null {
  const first = value.split(',')[0]?.trim();
  if (!first) return null;
  return stripFamilyQuotes(first);
}

function stripFamilyQuotes(raw: string): string {
  return raw.replace(/^['"]|['"]$/g, '').trim();
}

const GENERIC_FAMILY_KEYWORDS = new Set([
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-sans-serif',
  'ui-serif',
  'ui-monospace',
  'ui-rounded',
  'inherit',
  'initial',
  'unset',
  'revert',
]);

function isLikelyGenericKeyword(name: string): boolean {
  return GENERIC_FAMILY_KEYWORDS.has(name.toLowerCase());
}

const MONO_FAMILY_HINTS = [
  'mono',
  'code',
  'console',
  'courier',
  'jetbrains',
  'fira code',
  'source code',
  'iosevka',
  'cascadia',
];

/**
 * Heuristic: is this family monospace? Used by callers to pick which
 * detected font fills `BaseSystemConfig.monoFontFamily` vs
 * `BaseSystemConfig.fontFamily`.
 */
export function isMonoFamily(family: string): boolean {
  const lower = family.toLowerCase();
  return MONO_FAMILY_HINTS.some((hint) => lower.includes(hint));
}
