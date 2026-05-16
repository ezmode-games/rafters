/**
 * Heavy framework-coverage tests for the HTML font injector (#1512).
 *
 * Each framework target gets:
 *   - canonical layout exists -> inject (tags land at the right anchor)
 *   - already-injected -> no-op
 *   - partial-injection -> only missing tags added; preconnect not duplicated
 *   - multiple-fonts -> one preconnect pair + N stylesheet links
 *   - no-canonical-layout -> InjectionResult.injected: false, snippet returned
 *
 * Plus framework-specific positioning tests:
 *   - JSX frameworks: crossOrigin attribute name and self-closing tags
 *   - Remix: injection lands AFTER <Meta /> and <Links />
 *   - Astro: injection lands BEFORE <slot name="head" /> if present
 *
 * Plus the unknown-framework copy-paste-fallback path.
 */

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { DetectedFont } from '../../src/onboard/font-detector.js';
import {
  buildFontLinkSnippet,
  type InjectionFramework,
  injectFontLinks,
} from '../../src/onboard/font-injector.js';

const INTER: DetectedFont = {
  family: 'Inter',
  source: 'google',
  importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
};

const JETBRAINS: DetectedFont = {
  family: 'JetBrains Mono',
  source: 'google',
  importUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
};

const SELF_HOSTED_CUSTOM: DetectedFont = {
  family: 'Custom Sans',
  source: 'self-hosted',
  fontFaceBlock: `@font-face { font-family: 'Custom Sans'; src: url(/fonts/Custom.woff2) format('woff2'); }`,
};

const SYSTEM_HELVETICA: DetectedFont = { family: 'Helvetica Neue', source: 'system' };

let workDir: string;

beforeEach(async () => {
  workDir = await mkdtemp(join(tmpdir(), 'font-injector-'));
});

afterEach(async () => {
  await rm(workDir, { recursive: true, force: true });
});

async function writeLayout(relPath: string, content: string): Promise<string> {
  const abs = join(workDir, relPath);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, content, 'utf-8');
  return relPath;
}

async function readLayout(relPath: string): Promise<string> {
  return readFile(join(workDir, relPath), 'utf-8');
}

// ---- snippet builder (style fan-out) -------------------------------------

describe('buildFontLinkSnippet', () => {
  it('renders raw HTML link tags for the html style', () => {
    const { snippet, googleFonts } = buildFontLinkSnippet([INTER, JETBRAINS], 'html');
    expect(googleFonts).toHaveLength(2);
    expect(snippet).toContain('<link rel="preconnect" href="https://fonts.googleapis.com">');
    expect(snippet).toContain(
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    );
    expect(snippet).toContain(`<link href="${INTER.importUrl}" rel="stylesheet">`);
    expect(snippet).toContain(`<link href="${JETBRAINS.importUrl}" rel="stylesheet">`);
  });

  it('renders JSX link tags for the jsx style (crossOrigin, self-closing)', () => {
    const { snippet } = buildFontLinkSnippet([INTER], 'jsx');
    expect(snippet).toContain('crossOrigin=""');
    expect(snippet).not.toContain(' crossorigin>');
    expect(snippet).toContain(`<link href="${INTER.importUrl}" rel="stylesheet" />`);
  });

  it('returns empty snippet when no Google fonts present (system / self-hosted only)', () => {
    const { snippet, googleFonts } = buildFontLinkSnippet(
      [SELF_HOSTED_CUSTOM, SYSTEM_HELVETICA],
      'html',
    );
    expect(snippet).toBe('');
    expect(googleFonts).toEqual([]);
  });
});

// ---- canonical-injection per framework -----------------------------------

interface FrameworkCase {
  framework: Exclude<InjectionFramework, 'unknown'>;
  layoutPath: string;
  emptyLayout: string;
}

const ASTRO_EMPTY = `---
const { title = 'App' } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
`;

const NEXT_APP_EMPTY = `import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;

const NEXT_PAGES_EMPTY = `import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
`;

const REACT_ROUTER_EMPTY = `import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;

const REMIX_EMPTY = `import { Links, Meta, Outlet, Scripts } from '@remix-run/react';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
`;

const VITE_EMPTY = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const FRAMEWORK_CASES: FrameworkCase[] = [
  { framework: 'astro', layoutPath: 'src/layouts/BaseLayout.astro', emptyLayout: ASTRO_EMPTY },
  { framework: 'next-app', layoutPath: 'app/layout.tsx', emptyLayout: NEXT_APP_EMPTY },
  { framework: 'next-pages', layoutPath: 'pages/_document.tsx', emptyLayout: NEXT_PAGES_EMPTY },
  { framework: 'react-router', layoutPath: 'app/root.tsx', emptyLayout: REACT_ROUTER_EMPTY },
  { framework: 'remix', layoutPath: 'app/root.tsx', emptyLayout: REMIX_EMPTY },
  { framework: 'vite', layoutPath: 'index.html', emptyLayout: VITE_EMPTY },
  { framework: 'wc', layoutPath: 'index.html', emptyLayout: VITE_EMPTY },
  { framework: 'vanilla', layoutPath: 'index.html', emptyLayout: VITE_EMPTY },
];

describe.each(FRAMEWORK_CASES)(
  'injectFontLinks -- $framework',
  ({ framework, layoutPath, emptyLayout }) => {
    it('injects into canonical layout when none exists yet', async () => {
      await writeLayout(layoutPath, emptyLayout);

      const result = await injectFontLinks({
        cwd: workDir,
        framework,
        fonts: [INTER],
      });

      expect(result.injected).toBe(true);
      expect(result.layoutPath).toBe(layoutPath);
      expect(result.addedFamilies).toEqual(['Inter']);

      const updated = await readLayout(layoutPath);
      expect(updated).toContain(INTER.importUrl);
      // Tags landed before </head>
      const headCloseIdx = updated.search(/<\/head>/i);
      const linkIdx = updated.indexOf(INTER.importUrl);
      expect(linkIdx).toBeGreaterThan(-1);
      expect(linkIdx).toBeLessThan(headCloseIdx);
    });

    it('is a no-op when all requested fonts are already present', async () => {
      const withInter = emptyLayout.replace(
        /<\/head>/i,
        `  <link href="${INTER.importUrl}" rel="stylesheet">\n  </head>`,
      );
      await writeLayout(layoutPath, withInter);

      const result = await injectFontLinks({
        cwd: workDir,
        framework,
        fonts: [INTER],
      });

      expect(result.injected).toBe(false);
      expect(result.reason).toBe('already-present');
      expect(result.addedFamilies).toEqual([]);

      // File unchanged on disk
      expect(await readLayout(layoutPath)).toBe(withInter);
    });

    it('adds only the missing font when one is already present', async () => {
      const withInter = emptyLayout.replace(
        /<\/head>/i,
        `  <link href="${INTER.importUrl}" rel="stylesheet">\n` +
          `  <link rel="preconnect" href="https://fonts.googleapis.com">\n  </head>`,
      );
      await writeLayout(layoutPath, withInter);

      const result = await injectFontLinks({
        cwd: workDir,
        framework,
        fonts: [INTER, JETBRAINS],
      });

      expect(result.injected).toBe(true);
      expect(result.addedFamilies).toEqual(['JetBrains Mono']);

      const updated = await readLayout(layoutPath);
      // Inter present once, JetBrains added
      expect(
        updated.match(new RegExp(INTER.importUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')),
      ).toHaveLength(1);
      expect(updated).toContain(JETBRAINS.importUrl);
      // Preconnect not duplicated -- it was already there.
      const preconnectCount = (
        updated.match(/<link rel="preconnect" href="https:\/\/fonts.googleapis.com"/g) ?? []
      ).length;
      expect(preconnectCount).toBe(1);
    });

    it('writes one preconnect pair plus N stylesheet links for multiple fonts', async () => {
      await writeLayout(layoutPath, emptyLayout);

      const result = await injectFontLinks({
        cwd: workDir,
        framework,
        fonts: [INTER, JETBRAINS],
      });

      expect(result.injected).toBe(true);
      expect(result.addedFamilies).toEqual(['Inter', 'JetBrains Mono']);

      const updated = await readLayout(layoutPath);
      const preconnectCount = (updated.match(/href="https:\/\/fonts.googleapis.com"/g) ?? [])
        .length;
      expect(preconnectCount).toBe(1);
      expect(updated).toContain(INTER.importUrl);
      expect(updated).toContain(JETBRAINS.importUrl);
    });

    it('returns no-layout-file when canonical path is missing', async () => {
      const result = await injectFontLinks({
        cwd: workDir,
        framework,
        fonts: [INTER],
      });

      expect(result.injected).toBe(false);
      expect(result.reason).toBe('no-layout-file');
      expect(result.snippet).toContain(INTER.importUrl);
      expect(result.snippet).toContain('preconnect');
    });
  },
);

// ---- JSX-specific positioning --------------------------------------------

describe('injectFontLinks -- JSX attribute conventions', () => {
  it.each(['next-app', 'next-pages', 'react-router', 'remix'] as const)(
    '%s uses crossOrigin attribute and self-closing link tags',
    async (framework) => {
      const layoutMap: Record<typeof framework, [string, string]> = {
        'next-app': ['app/layout.tsx', NEXT_APP_EMPTY],
        'next-pages': ['pages/_document.tsx', NEXT_PAGES_EMPTY],
        'react-router': ['app/root.tsx', REACT_ROUTER_EMPTY],
        remix: ['app/root.tsx', REMIX_EMPTY],
      };
      const [path, content] = layoutMap[framework];
      await writeLayout(path, content);

      await injectFontLinks({ cwd: workDir, framework, fonts: [INTER] });

      const updated = await readLayout(path);
      expect(updated).toContain('crossOrigin=""');
      expect(updated).not.toMatch(/ crossorigin>/);
      expect(updated).toMatch(/<link\s[^>]*\/>/);
    },
  );
});

describe('injectFontLinks -- Remix ordering', () => {
  it('lands AFTER the last <Meta /> / <Links /> in the head', async () => {
    await writeLayout('app/root.tsx', REMIX_EMPTY);
    await injectFontLinks({ cwd: workDir, framework: 'remix', fonts: [INTER] });

    const updated = await readLayout('app/root.tsx');
    const linksIdx = updated.indexOf('<Links />');
    const metaIdx = updated.indexOf('<Meta />');
    const interIdx = updated.indexOf(INTER.importUrl);
    expect(interIdx).toBeGreaterThan(linksIdx);
    expect(interIdx).toBeGreaterThan(metaIdx);
  });
});

describe('injectFontLinks -- Astro slot positioning', () => {
  it('lands BEFORE <slot name="head" /> when present', async () => {
    const layoutWithSlot = `---
---
<html><head>
  <meta charset="utf-8" />
  <slot name="head" />
</head><body><slot /></body></html>
`;
    await writeLayout('src/layouts/BaseLayout.astro', layoutWithSlot);
    await injectFontLinks({ cwd: workDir, framework: 'astro', fonts: [INTER] });

    const updated = await readLayout('src/layouts/BaseLayout.astro');
    const slotIdx = updated.indexOf('<slot name="head" />');
    const interIdx = updated.indexOf(INTER.importUrl);
    expect(interIdx).toBeGreaterThan(-1);
    expect(interIdx).toBeLessThan(slotIdx);
  });

  it('falls back to before </head> when no slot is present', async () => {
    await writeLayout('src/layouts/BaseLayout.astro', ASTRO_EMPTY);
    await injectFontLinks({ cwd: workDir, framework: 'astro', fonts: [INTER] });

    const updated = await readLayout('src/layouts/BaseLayout.astro');
    const headCloseIdx = updated.search(/<\/head>/i);
    const interIdx = updated.indexOf(INTER.importUrl);
    expect(interIdx).toBeGreaterThan(-1);
    expect(interIdx).toBeLessThan(headCloseIdx);
  });
});

// ---- unknown framework + non-google fonts --------------------------------

describe('injectFontLinks -- non-injectable inputs', () => {
  it('returns unknown-framework with snippet for framework: unknown', async () => {
    const result = await injectFontLinks({
      cwd: workDir,
      framework: 'unknown',
      fonts: [INTER],
    });
    expect(result.injected).toBe(false);
    expect(result.reason).toBe('unknown-framework');
    expect(result.snippet).toContain(INTER.importUrl);
    expect(result.snippet).toContain('preconnect');
  });

  it('returns no-google-fonts when only self-hosted / system fonts present', async () => {
    await writeLayout('index.html', VITE_EMPTY);
    const result = await injectFontLinks({
      cwd: workDir,
      framework: 'vite',
      fonts: [SELF_HOSTED_CUSTOM, SYSTEM_HELVETICA],
    });
    expect(result.injected).toBe(false);
    expect(result.reason).toBe('no-google-fonts');
    expect(result.snippet).toBe('');
  });
});

// ---- alternate canonical path fallback -----------------------------------

describe('injectFontLinks -- canonical path fallback', () => {
  it('astro tries Layout.astro when BaseLayout.astro is absent', async () => {
    await writeLayout('src/layouts/Layout.astro', ASTRO_EMPTY);
    const result = await injectFontLinks({
      cwd: workDir,
      framework: 'astro',
      fonts: [INTER],
    });
    expect(result.injected).toBe(true);
    expect(result.layoutPath).toBe('src/layouts/Layout.astro');
  });
});

// ---- explicit override path ----------------------------------------------

describe('injectFontLinks -- layoutPathOverride', () => {
  it('honours the override path verbatim', async () => {
    const custom = 'src/custom/Layout.astro';
    await writeLayout(custom, ASTRO_EMPTY);
    const result = await injectFontLinks({
      cwd: workDir,
      framework: 'astro',
      fonts: [INTER],
      layoutPathOverride: custom,
    });
    expect(result.injected).toBe(true);
    expect(result.layoutPath).toBe(custom);
  });
});
