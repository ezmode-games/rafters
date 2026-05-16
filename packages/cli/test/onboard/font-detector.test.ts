/**
 * Tests for the font detector (#1511).
 *
 * The detector walks the parsed CSS for `@import` URLs and `@font-face`
 * blocks. Output is a deduplicated `DetectedFont[]` keyed by family
 * name, with `source: 'google' | 'self-hosted' | 'system'`.
 */

import { describe, expect, it } from 'vitest';
import { parseCSSFile } from '../../src/onboard/css-parser.js';
import { detectFonts, isMonoFamily } from '../../src/onboard/font-detector.js';

function detect(css: string) {
  const parsed = parseCSSFile(css);
  return detectFonts(parsed, css);
}

describe('detectFonts -- Google Fonts @import', () => {
  it('detects a single Google Fonts import (legacy css endpoint)', () => {
    const css = `@import url('https://fonts.googleapis.com/css?family=Inter');
:root { --font-sans: 'Inter', sans-serif; }
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(1);
    expect(fonts[0]).toMatchObject({
      family: 'Inter',
      source: 'google',
    });
    expect(fonts[0]?.importUrl).toContain('fonts.googleapis.com');
  });

  it('detects css2 import with weights', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
:root { --font-sans: 'Inter', sans-serif; }
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(1);
    expect(fonts[0]?.family).toBe('Inter');
    expect(fonts[0]?.weights).toEqual(['400', '500', '700', '900']);
  });

  it('detects multiple families in one css2 url', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400&display=swap');
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(2);
    const inter = fonts.find((f) => f.family === 'Inter');
    const mono = fonts.find((f) => f.family === 'JetBrains Mono');
    expect(inter?.weights).toEqual(['400', '700']);
    expect(mono?.weights).toEqual(['400']);
  });

  it('handles ital,wght axis (italic + weight pairs)', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;1,500');
`;
    const fonts = detect(css);
    expect(fonts[0]?.family).toBe('Inter');
    expect(fonts[0]?.weights).toEqual(['400', '500']);
    expect(fonts[0]?.styles).toEqual(['normal', 'italic']);
  });

  it('deduplicates multiple @imports for the same family', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700');
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(1);
    expect(fonts[0]?.family).toBe('Inter');
  });

  it('returns plus-spaced family names with spaces', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400');
`;
    const fonts = detect(css);
    expect(fonts[0]?.family).toBe('Plus Jakarta Sans');
  });
});

describe('detectFonts -- @font-face self-hosted', () => {
  it('detects a single @font-face declaration', () => {
    const css = `@font-face {
  font-family: 'Custom Sans';
  src: url('/fonts/Custom.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(1);
    expect(fonts[0]?.family).toBe('Custom Sans');
    expect(fonts[0]?.source).toBe('self-hosted');
    expect(fonts[0]?.weights).toEqual(['400']);
    expect(fonts[0]?.styles).toEqual(['normal']);
    expect(fonts[0]?.fontFaceBlock).toContain('@font-face');
    expect(fonts[0]?.fontFaceBlock).toContain('/fonts/Custom.woff2');
  });

  it('captures variable-font weight ranges', () => {
    const css = `@font-face {
  font-family: 'Variable Sans';
  src: url('/fonts/Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
}
`;
    const fonts = detect(css);
    expect(fonts[0]?.weights).toEqual(['100', '900']);
  });

  it('self-hosted wins over Google import for the same family', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400');
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter.woff2') format('woff2');
}
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(1);
    expect(fonts[0]?.source).toBe('self-hosted');
  });
});

describe('detectFonts -- system fonts via --font-* custom properties', () => {
  it('detects --font-sans referencing a non-imported family as system', () => {
    const css = `:root {
  --font-sans: 'Helvetica Neue', Arial, sans-serif;
  --spacing: 4px;
  --color: #000;
}
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(1);
    expect(fonts[0]).toEqual({ family: 'Helvetica Neue', source: 'system' });
  });

  it('ignores generic keywords like system-ui / sans-serif', () => {
    const css = `:root {
  --font-sans: system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
  --color: red;
}
`;
    const fonts = detect(css);
    // system-ui and ui-monospace are generic keywords -- not real families
    expect(fonts).toHaveLength(0);
  });

  it('does not double-count a family already detected via @import', () => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400');
:root { --font-sans: 'Inter', sans-serif; --color: red; }
`;
    const fonts = detect(css);
    expect(fonts).toHaveLength(1);
    expect(fonts[0]?.source).toBe('google');
  });
});

describe('detectFonts -- empty / non-font CSS', () => {
  it('returns empty array on CSS with no fonts', () => {
    const css = `:root { --color: red; --spacing: 4px; --x: 1; }`;
    expect(detect(css)).toEqual([]);
  });

  it('returns empty array on empty CSS', () => {
    expect(detect('')).toEqual([]);
  });

  it('ignores non-Google @imports', () => {
    const css = `@import url('https://example.com/styles.css');
:root { --color: red; --x: 1; --y: 2; }
`;
    expect(detect(css)).toEqual([]);
  });
});

describe('isMonoFamily', () => {
  it.each([
    ['JetBrains Mono', true],
    ['Fira Code', true],
    ['Source Code Pro', true],
    ['Iosevka', true],
    ['Courier New', true],
    ['Cascadia Code', true],
    ['Inter', false],
    ['Plus Jakarta Sans', false],
    ['Helvetica', false],
  ])('isMonoFamily(%s) -> %s', (family, expected) => {
    expect(isMonoFamily(family)).toBe(expected);
  });
});
