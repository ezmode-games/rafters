/**
 * Smoke tests for the onboard wire-up (#1513).
 *
 * The wire-up composes the four leaf modules. Each leaf is unit-
 * tested separately (palette-prompt.test.ts, scale-inference.test.ts,
 * font-detector.test.ts, font-injector.test.ts). These tests prove
 * the composition correctly threads decisions through the pipeline.
 */

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildSemanticOverlays,
  decisionsToConfigOverrides,
  type OnboardDecisions,
  runOnboardWireUp,
} from '../../src/onboard/wire-up.js';

let workDir: string;

beforeEach(async () => {
  workDir = await mkdtemp(join(tmpdir(), 'wire-up-'));
});

afterEach(async () => {
  await rm(workDir, { recursive: true, force: true });
});

async function writeCss(content: string): Promise<void> {
  const stylesDir = join(workDir, 'styles');
  await mkdir(stylesDir, { recursive: true });
  await writeFile(join(stylesDir, 'variables.css'), content, 'utf-8');
}

describe('runOnboardWireUp -- no-detection paths', () => {
  it('returns no-detection when no orchestrator matches the cwd', async () => {
    const result = await runOnboardWireUp(workDir, { agent: true, acceptDetected: true });
    expect(result.kind).toBe('no-detection');
  });
});

describe('runOnboardWireUp -- agent without --accept-detected on a brand system', () => {
  it('emits needs-decision when >= 2 palettes detected and no flag', async () => {
    const factions = ['empire', 'republic'];
    const positions = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    const lines: string[] = [];
    for (const f of factions) {
      for (const p of positions) {
        lines.push(`  --${f}-${p}: oklch(0.5 0.1 ${f.length * 30});`);
      }
    }
    await writeCss(`:root {\n${lines.join('\n')}\n}\n`);

    const result = await runOnboardWireUp(workDir, { agent: true, acceptDetected: false });
    expect(result.kind).toBe('needs-decision');
    if (result.kind !== 'needs-decision') return;
    expect(result.palettes).toEqual(['empire', 'republic']);
  });
});

describe('runOnboardWireUp -- agent + --accept-detected', () => {
  it('captures palette assignments in canonical slot order', async () => {
    const positions = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    const lines: string[] = [];
    for (const f of ['empire', 'republic']) {
      for (const p of positions) {
        lines.push(`  --${f}-${p}: oklch(0.5 0.1 ${f.length * 30});`);
      }
    }
    await writeCss(`:root {\n${lines.join('\n')}\n}\n`);

    const result = await runOnboardWireUp(workDir, { agent: true, acceptDetected: true });
    expect(result.kind).toBe('decisions');
    if (result.kind !== 'decisions') return;
    expect(result.decisions.palettes.assigned).toEqual([
      { family: 'empire', slot: 'primary' },
      { family: 'republic', slot: 'secondary' },
    ]);
  });

  it('captures spacing inference + detected fonts in the decision record', async () => {
    const tailwindSpacing = ['0', '0.25rem', '0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem'];
    const positions = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    const lines: string[] = [];
    for (const f of ['empire', 'republic']) {
      for (const p of positions) {
        lines.push(`  --${f}-${p}: oklch(0.5 0.1 ${f.length * 30});`);
      }
    }
    for (const [i, v] of tailwindSpacing.entries()) {
      lines.push(`  --spacing-${i}: ${v};`);
    }
    const css = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');\n:root {\n${lines.join('\n')}\n  --font-sans: 'Inter', sans-serif;\n}\n`;
    await writeCss(css);

    const result = await runOnboardWireUp(workDir, { agent: true, acceptDetected: true });
    expect(result.kind).toBe('decisions');
    if (result.kind !== 'decisions') return;

    // spacing inferred as linear base 4
    expect(result.decisions.spacing).toEqual({ baseSpacingUnit: 4, progressionRatio: 'linear' });

    // Inter detected as Google
    const inter = result.decisions.fonts.find((f) => f.family === 'Inter');
    expect(inter?.source).toBe('google');
  });
});

describe('decisionsToConfigOverrides', () => {
  it('maps spacing + radius + fonts into BaseSystemConfig overrides', () => {
    const decisions: OnboardDecisions = {
      source: 'generic-css',
      sourcePath: 'styles/variables.css',
      detectedAt: '2026-05-16T00:00:00.000Z',
      palettes: { assigned: [], skipped: [] },
      spacing: { baseSpacingUnit: 4, progressionRatio: 'linear' },
      radius: { baseRadius: 8, progressionRatio: 'linear' },
      fonts: [
        { family: 'Inter', source: 'google', importUrl: 'x' },
        { family: 'JetBrains Mono', source: 'google', importUrl: 'y' },
      ],
    };

    const overrides = decisionsToConfigOverrides(decisions);
    expect(overrides.baseSpacingUnit).toBe(4);
    expect(overrides.progressionRatio).toBe('linear');
    expect(overrides.baseRadiusOverride).toBe(8);
    // Single-word family names emit unquoted; spaces force quotes.
    expect(overrides.fontFamily).toBe('Inter, sans-serif');
    expect(overrides.monoFontFamily).toBe('"JetBrains Mono", monospace');
  });

  it('omits override fields when decisions lack them', () => {
    const decisions: OnboardDecisions = {
      source: 'generic-css',
      sourcePath: '',
      detectedAt: '',
      palettes: { assigned: [], skipped: [] },
      fonts: [],
    };

    const overrides = decisionsToConfigOverrides(decisions);
    expect(overrides.baseSpacingUnit).toBeUndefined();
    expect(overrides.fontFamily).toBeUndefined();
  });
});

describe('buildSemanticOverlays', () => {
  it('emits a ColorReference at position 500 for each assigned palette', () => {
    const decisions: OnboardDecisions = {
      source: 'generic-css',
      sourcePath: '',
      detectedAt: '',
      palettes: {
        assigned: [
          { family: 'empire', slot: 'primary' },
          { family: 'republic', slot: 'accent' },
        ],
        skipped: ['hutt'],
      },
      fonts: [],
    };

    expect(buildSemanticOverlays(decisions)).toEqual([
      { tokenName: 'primary', value: { family: 'empire', position: '500' } },
      { tokenName: 'accent', value: { family: 'republic', position: '500' } },
    ]);
  });

  it('emits nothing when no palettes were assigned', () => {
    expect(
      buildSemanticOverlays({
        source: '',
        sourcePath: '',
        detectedAt: '',
        palettes: { assigned: [], skipped: [] },
        fonts: [],
      }),
    ).toEqual([]);
  });
});
