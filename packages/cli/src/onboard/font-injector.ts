/**
 * Framework-aware HTML font `<link>` injection (#1512).
 *
 * Given a `DetectedFont[]` (from #1511) and a known framework,
 * inject the Google Fonts `<link>` tags into the project's layout
 * file. The injection is idempotent (already-present families are
 * skipped) and respects per-framework conventions:
 *
 *   - astro: raw `<link>` tags in the `<head>`. If the layout has a
 *     `<slot name="head" />`, tags land BEFORE the slot so the
 *     consumer can still override.
 *   - next-app, next-pages, react-router, remix: JSX tags (`crossOrigin`
 *     attribute, self-closing). Remix injection lands AFTER any
 *     `<Meta />` and `<Links />` to preserve loader-driven ordering.
 *   - vite, wc, vanilla: raw `<link>` tags in static `index.html`.
 *   - unknown: no injection; return the snippet for the caller to
 *     print as a copy-paste fallback.
 *
 * Self-hosted `@font-face` fonts (`source: 'self-hosted'`) need no
 * HTML link -- the CSS handles loading. Only `source: 'google'`
 * fonts get a `<link>` tag.
 */

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DetectedFont } from './font-detector.js';

export type InjectionFramework =
  | 'astro'
  | 'next-app'
  | 'next-pages'
  | 'react-router'
  | 'remix'
  | 'vite'
  | 'wc'
  | 'vanilla'
  | 'unknown';

export type InjectionStyle = 'html' | 'jsx';

export interface InjectionResult {
  /** True when the injector wrote (or no-op'd because all tags were already present). */
  injected: boolean;
  /** Resolved layout file path (relative to cwd). Absent when no layout was found. */
  layoutPath?: string;
  /** Reason for non-injection (when `injected: false`). */
  reason?: 'unknown-framework' | 'no-layout-file' | 'no-google-fonts' | 'already-present';
  /**
   * The Google Fonts families whose tags this call added. Empty when
   * everything was already present.
   */
  addedFamilies: string[];
  /**
   * Source-of-truth copy-paste snippet, in raw HTML form. Always built
   * (even on success) so the caller can log it on the no-layout-file
   * and unknown-framework paths.
   */
  snippet: string;
}

export interface InjectFontLinksOptions {
  cwd: string;
  framework: InjectionFramework;
  fonts: readonly DetectedFont[];
  /** Test override: skip the canonical-path search and use this file. */
  layoutPathOverride?: string;
}

const CANONICAL_LAYOUTS: Record<Exclude<InjectionFramework, 'unknown'>, string[]> = {
  astro: ['src/layouts/BaseLayout.astro', 'src/layouts/Layout.astro'],
  'next-app': ['app/layout.tsx', 'app/layout.jsx'],
  'next-pages': ['pages/_document.tsx', 'pages/_document.jsx'],
  'react-router': ['app/root.tsx', 'app/root.jsx'],
  remix: ['app/root.tsx', 'app/root.jsx'],
  vite: ['index.html'],
  wc: ['index.html'],
  vanilla: ['index.html'],
};

const FRAMEWORK_STYLE: Record<Exclude<InjectionFramework, 'unknown'>, InjectionStyle> = {
  astro: 'html',
  'next-app': 'jsx',
  'next-pages': 'jsx',
  'react-router': 'jsx',
  remix: 'jsx',
  vite: 'html',
  wc: 'html',
  vanilla: 'html',
};

/**
 * Build the Google Fonts `<link>` snippet for the given fonts in the
 * given injection style. Always includes the `preconnect` pair when
 * any Google font is present. Self-hosted and system fonts skip the
 * HTML layer entirely.
 */
type GoogleFont = DetectedFont & { importUrl: string };

function isGoogleFont(f: DetectedFont): f is GoogleFont {
  return f.source === 'google' && typeof f.importUrl === 'string';
}

export function buildFontLinkSnippet(
  fonts: readonly DetectedFont[],
  style: InjectionStyle,
): { snippet: string; googleFonts: GoogleFont[] } {
  const googleFonts = fonts.filter(isGoogleFont);
  if (googleFonts.length === 0) {
    return { snippet: '', googleFonts: [] };
  }
  return { snippet: buildBlock(googleFonts, style, true), googleFonts };
}

/**
 * Inject `<link>` tags into the project's layout file for each Google
 * Fonts family in `fonts`. Self-hosted and system fonts are skipped
 * (the CSS handles those). Idempotent: families whose `importUrl` is
 * already in the layout are skipped.
 */
export async function injectFontLinks(options: InjectFontLinksOptions): Promise<InjectionResult> {
  const { cwd, framework, fonts, layoutPathOverride } = options;

  // Always build the raw-HTML snippet for copy-paste fallback paths.
  const { snippet: htmlSnippet, googleFonts } = buildFontLinkSnippet(fonts, 'html');

  if (googleFonts.length === 0) {
    return { injected: false, reason: 'no-google-fonts', addedFamilies: [], snippet: htmlSnippet };
  }

  if (framework === 'unknown') {
    return {
      injected: false,
      reason: 'unknown-framework',
      addedFamilies: [],
      snippet: htmlSnippet,
    };
  }

  const style = FRAMEWORK_STYLE[framework];
  const layoutPath = layoutPathOverride ?? resolveLayoutPath(cwd, framework);
  if (!layoutPath) {
    return { injected: false, reason: 'no-layout-file', addedFamilies: [], snippet: htmlSnippet };
  }

  const fullPath = join(cwd, layoutPath);
  const content = await readFile(fullPath, 'utf-8');

  // Filter out families whose `importUrl` is already present anywhere
  // in the file -- safe across all framework styles since the URL is a
  // distinctive substring.
  const missing = googleFonts.filter((f) => !content.includes(f.importUrl));
  if (missing.length === 0) {
    return {
      injected: false,
      reason: 'already-present',
      layoutPath,
      addedFamilies: [],
      snippet: htmlSnippet,
    };
  }

  // Need preconnect lines only if not already present.
  const needsPreconnect = !content.includes('href="https://fonts.googleapis.com"');
  const block = buildBlock(missing, style, needsPreconnect);
  const updated = insertIntoHead(content, block, framework);

  if (updated === content) {
    // No `</head>` anchor found; bail out -- caller logs the snippet.
    return {
      injected: false,
      reason: 'no-layout-file',
      layoutPath,
      addedFamilies: [],
      snippet: htmlSnippet,
    };
  }

  await writeFile(fullPath, updated, 'utf-8');
  return {
    injected: true,
    layoutPath,
    addedFamilies: missing.map((f) => f.family),
    snippet: htmlSnippet,
  };
}

function buildBlock(
  fonts: readonly (DetectedFont & { importUrl: string })[],
  style: InjectionStyle,
  needsPreconnect: boolean,
): string {
  const lines: string[] = [];
  if (needsPreconnect) {
    if (style === 'jsx') {
      lines.push('<link rel="preconnect" href="https://fonts.googleapis.com" />');
      lines.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />');
    } else {
      lines.push('<link rel="preconnect" href="https://fonts.googleapis.com">');
      lines.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
    }
  }
  for (const font of fonts) {
    if (style === 'jsx') {
      lines.push(`<link href="${font.importUrl}" rel="stylesheet" />`);
    } else {
      lines.push(`<link href="${font.importUrl}" rel="stylesheet">`);
    }
  }
  return lines.join('\n');
}

/**
 * Insert the block into the file's `<head>`. Framework-specific
 * positioning:
 *
 *   - astro: before `<slot name="head" />` if present; otherwise
 *     before `</head>`.
 *   - remix: after the last `<Meta />` / `<Links />` self-closing tag
 *     within the head; otherwise before `</head>`.
 *   - others: before `</head>`.
 *
 * Returns the file unchanged when no `</head>` anchor exists.
 */
function insertIntoHead(content: string, block: string, framework: InjectionFramework): string {
  if (framework === 'astro') {
    const slotMatch = content.match(/<slot\s+name=["']head["']\s*\/?\s*>/);
    if (slotMatch && slotMatch.index !== undefined) {
      return spliceAt(content, slotMatch.index, indentBlock(block, content, slotMatch.index));
    }
  }

  if (framework === 'remix') {
    const headCloseIdx = content.search(/<\/head>/i);
    if (headCloseIdx >= 0) {
      const headRegion = content.slice(0, headCloseIdx);
      const matches = [...headRegion.matchAll(/<(Meta|Links)\s*\/?>/gi)];
      const lastMatch = matches.at(-1);
      if (lastMatch?.index !== undefined) {
        const afterAnchor = lastMatch.index + lastMatch[0].length;
        return spliceAt(content, afterAnchor, `\n${indentBlock(block, content, afterAnchor)}`);
      }
    }
  }

  const headCloseIdx = content.search(/<\/head>/i);
  if (headCloseIdx < 0) return content;
  return spliceAt(content, headCloseIdx, indentBlock(block, content, headCloseIdx));
}

/**
 * Insert `inserted` at `index` and emit a trailing newline so the
 * surrounding markup stays on its own line. Indentation is inherited
 * from the line `index` sits on.
 */
function spliceAt(source: string, index: number, inserted: string): string {
  return `${source.slice(0, index)}${inserted}\n${source.slice(index)}`;
}

function indentBlock(block: string, source: string, index: number): string {
  const lineStart = source.lastIndexOf('\n', index - 1) + 1;
  const indent = source.slice(lineStart, index).match(/^\s*/)?.[0] ?? '';
  return block
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
}

function resolveLayoutPath(
  cwd: string,
  framework: Exclude<InjectionFramework, 'unknown'>,
): string | null {
  for (const candidate of CANONICAL_LAYOUTS[framework]) {
    if (existsSync(join(cwd, candidate))) return candidate;
  }
  return null;
}
