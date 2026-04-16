import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { onboard, previewOnboard } from '../../src/onboard/orchestrator.js';

// Sample shadcn CSS
const SHADCN_CSS = `:root {
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
  --primary: 222 47% 11%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --radius: 0.5rem;
}

.dark {
  --background: 222 84% 5%;
  --foreground: 0 0% 100%;
}`;

// Sample generic CSS
const GENERIC_CSS = `:root {
  --brand-primary: #3b82f6;
  --brand-secondary: #10b981;
  --text-color: #1f2937;
  --spacing-sm: 0.5rem;
}`;

// Empty CSS
const EMPTY_CSS = `body { margin: 0; }`;

describe('Orchestrator', () => {
  const testDir = join(process.cwd(), '.test-orchestrator');

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('onboard', () => {
    it('imports tokens from shadcn project', async () => {
      const appDir = join(testDir, 'app');
      await mkdir(appDir, { recursive: true });
      await writeFile(join(appDir, 'globals.css'), SHADCN_CSS);

      const result = await onboard(testDir);

      expect(result.success).toBe(true);
      expect(result.source).toBe('shadcn');
      expect(result.tokens.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('imports tokens from generic CSS project', async () => {
      const stylesDir = join(testDir, 'styles');
      await mkdir(stylesDir, { recursive: true });
      await writeFile(join(stylesDir, 'variables.css'), GENERIC_CSS);

      const result = await onboard(testDir);

      expect(result.success).toBe(true);
      expect(result.source).toBe('generic-css');
      expect(result.tokens.length).toBeGreaterThan(0);
    });

    it('prefers shadcn over generic CSS when both match', async () => {
      const appDir = join(testDir, 'app');
      const stylesDir = join(testDir, 'styles');
      await mkdir(appDir, { recursive: true });
      await mkdir(stylesDir, { recursive: true });
      await writeFile(join(appDir, 'globals.css'), SHADCN_CSS);
      await writeFile(join(stylesDir, 'variables.css'), GENERIC_CSS);

      const result = await onboard(testDir);

      // shadcn has higher confidence and priority
      expect(result.source).toBe('shadcn');
    });

    it('returns failure when no compatible source found', async () => {
      // Empty directory
      const result = await onboard(testDir);

      expect(result.success).toBe(false);
      expect(result.tokens).toHaveLength(0);
      expect(result.warnings.some((w) => w.level === 'error')).toBe(true);
    });

    it('returns failure for CSS without custom properties', async () => {
      const stylesDir = join(testDir, 'styles');
      await mkdir(stylesDir, { recursive: true });
      await writeFile(join(stylesDir, 'variables.css'), EMPTY_CSS);

      const result = await onboard(testDir);

      expect(result.success).toBe(false);
    });

    it('can force a specific importer', async () => {
      // Use generic CSS that both importers can detect
      const stylesDir = join(testDir, 'styles');
      await mkdir(stylesDir, { recursive: true });
      await writeFile(join(stylesDir, 'variables.css'), GENERIC_CSS);

      // Force generic-css explicitly
      const result = await onboard(testDir, { forceImporter: 'generic-css' });

      expect(result.source).toBe('generic-css');
      expect(result.success).toBe(true);
    });

    it('fails when forced importer cannot handle project', async () => {
      // No CSS files
      const result = await onboard(testDir, { forceImporter: 'shadcn' });

      expect(result.success).toBe(false);
      expect(result.warnings[0].message).toContain('not found');
    });

    it('respects minimum confidence threshold', async () => {
      const stylesDir = join(testDir, 'styles');
      await mkdir(stylesDir, { recursive: true });
      // Create CSS that would have low confidence
      await writeFile(join(stylesDir, 'variables.css'), GENERIC_CSS);

      const result = await onboard(testDir, { minConfidence: 0.95 });

      expect(result.success).toBe(false);
      expect(result.warnings[0].message).toContain('below threshold');
    });

    it('includes stats in result', async () => {
      const appDir = join(testDir, 'app');
      await mkdir(appDir, { recursive: true });
      await writeFile(join(appDir, 'globals.css'), SHADCN_CSS);

      const result = await onboard(testDir);

      expect(result.stats.variablesProcessed).toBeGreaterThan(0);
      expect(result.stats.tokensCreated).toBeGreaterThan(0);
      expect(result.stats.skipped).toBeGreaterThanOrEqual(0);
    });

    it('includes source paths in result', async () => {
      const appDir = join(testDir, 'app');
      await mkdir(appDir, { recursive: true });
      await writeFile(join(appDir, 'globals.css'), SHADCN_CSS);

      const result = await onboard(testDir);

      expect(result.sourcePaths).toHaveLength(1);
      expect(result.sourcePaths[0]).toContain('globals.css');
    });

    it('all tokens have required fields', async () => {
      const appDir = join(testDir, 'app');
      await mkdir(appDir, { recursive: true });
      await writeFile(join(appDir, 'globals.css'), SHADCN_CSS);

      const result = await onboard(testDir);

      for (const token of result.tokens) {
        expect(token.name).toBeDefined();
        expect(token.value).toBeDefined();
        expect(token.category).toBeDefined();
        expect(token.namespace).toBeDefined();
        expect(token.userOverride).toBeNull();
      }
    });
  });

  describe('previewOnboard', () => {
    it('returns all compatible importers', async () => {
      const appDir = join(testDir, 'app');
      await mkdir(appDir, { recursive: true });
      await writeFile(join(appDir, 'globals.css'), SHADCN_CSS);

      const results = await previewOnboard(testDir);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].importer).toBe('shadcn');
      expect(results[0].confidence).toBeGreaterThan(0);
    });

    it('returns empty array when no importers match', async () => {
      const results = await previewOnboard(testDir);

      expect(results).toHaveLength(0);
    });

    it('sorts by confidence', async () => {
      const appDir = join(testDir, 'app');
      const stylesDir = join(testDir, 'styles');
      await mkdir(appDir, { recursive: true });
      await mkdir(stylesDir, { recursive: true });
      await writeFile(join(appDir, 'globals.css'), SHADCN_CSS);
      await writeFile(join(stylesDir, 'variables.css'), GENERIC_CSS);

      const results = await previewOnboard(testDir);

      // Should be sorted by confidence (shadcn first)
      expect(results[0].importer).toBe('shadcn');
      expect(results[0].confidence).toBeGreaterThanOrEqual(results[1]?.confidence ?? 0);
    });
  });
});
