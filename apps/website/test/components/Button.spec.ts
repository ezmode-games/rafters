/**
 * Integration tests for Button component intelligence
 * Tests component JSDoc intelligence parsing and accessibility
 */

import { describe, expect, it } from 'vitest';

describe('Button component intelligence', () => {
  it('should extract cognitive load from JSDoc', async () => {
    // Read the Button component source to extract intelligence
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const buttonPath = path.resolve(__dirname, '../../src/components/Button.tsx');
    const source = await fs.readFile(buttonPath, 'utf-8');

    // Extract JSDoc intelligence patterns
    const cognitiveLoadMatch = source.match(/@cognitive-load\s+(\d+)\/10/);
    expect(cognitiveLoadMatch).toBeTruthy();
    expect(cognitiveLoadMatch?.[1]).toBe('3');
  });

  it('should have trust-building guidelines in JSDoc', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const buttonPath = path.resolve(__dirname, '../../src/components/Button.tsx');
    const source = await fs.readFile(buttonPath, 'utf-8');

    expect(source).toContain('@trust-building');
    expect(source).toContain('Primary variant for main actions only');
  });

  it('should specify accessibility compliance level', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const buttonPath = path.resolve(__dirname, '../../src/components/Button.tsx');
    const source = await fs.readFile(buttonPath, 'utf-8');

    expect(source).toContain('@accessibility');
    expect(source).toContain('WCAG AAA');
    expect(source).toContain('44px touch targets');
  });

  it('should define semantic meaning for variants', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const buttonPath = path.resolve(__dirname, '../../src/components/Button.tsx');
    const source = await fs.readFile(buttonPath, 'utf-8');

    expect(source).toContain('@semantic-meaning');
    expect(source).toContain('primary=main actions');
    expect(source).toContain('destructive=irreversible');
  });

  it('should be available in registry with proper name', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const buttonPath = path.resolve(__dirname, '../../src/components/Button.tsx');
    const source = await fs.readFile(buttonPath, 'utf-8');

    expect(source).toContain('@registry-name button');
  });
});
