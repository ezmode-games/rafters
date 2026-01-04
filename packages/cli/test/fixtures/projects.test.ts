/**
 * Tests for project fixtures
 *
 * Verifies fixture creation, cleanup, and detection accuracy
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  detectFramework,
  detectShadcn,
  detectTailwindVersion,
  isTailwindV3,
} from '../../src/utils/detect.js';
import {
  ALL_FIXTURE_TYPES,
  cleanupFixture,
  createFixture,
  type FixtureType,
  getExpectedDetection,
  withFixture,
} from './projects.js';

// Track fixtures for cleanup
const createdFixtures: string[] = [];

afterEach(async () => {
  // Clean up any fixtures created during tests
  for (const path of createdFixtures) {
    await cleanupFixture(path);
  }
  createdFixtures.length = 0;
});

describe('createFixture', () => {
  it('creates a fixture directory with package.json', async () => {
    const fixturePath = await createFixture('nextjs-shadcn-v4');
    createdFixtures.push(fixturePath);

    expect(existsSync(fixturePath)).toBe(true);
    expect(existsSync(join(fixturePath, 'package.json'))).toBe(true);

    const pkg = JSON.parse(await readFile(join(fixturePath, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('test-nextjs-shadcn');
    expect(pkg.dependencies.next).toBeDefined();
  });

  it('creates shadcn components.json for shadcn fixtures', async () => {
    const fixturePath = await createFixture('nextjs-shadcn-v4');
    createdFixtures.push(fixturePath);

    expect(existsSync(join(fixturePath, 'components.json'))).toBe(true);

    const config = JSON.parse(await readFile(join(fixturePath, 'components.json'), 'utf-8'));
    expect(config.$schema).toContain('shadcn');
    expect(config.tailwind).toBeDefined();
  });

  it('does not create components.json for non-shadcn fixtures', async () => {
    const fixturePath = await createFixture('nextjs-no-shadcn');
    createdFixtures.push(fixturePath);

    expect(existsSync(join(fixturePath, 'components.json'))).toBe(false);
  });

  it('creates additional files in nested directories', async () => {
    const fixturePath = await createFixture('nextjs-shadcn-v4');
    createdFixtures.push(fixturePath);

    expect(existsSync(join(fixturePath, 'src/app/globals.css'))).toBe(true);
    const css = await readFile(join(fixturePath, 'src/app/globals.css'), 'utf-8');
    expect(css).toContain('tailwindcss');
  });

  it('throws for unknown fixture type', async () => {
    await expect(createFixture('unknown-type' as FixtureType)).rejects.toThrow(
      'Unknown fixture type',
    );
  });
});

describe('cleanupFixture', () => {
  it('removes fixture directory', async () => {
    const fixturePath = await createFixture('empty-project');

    expect(existsSync(fixturePath)).toBe(true);

    await cleanupFixture(fixturePath);

    expect(existsSync(fixturePath)).toBe(false);
  });

  it('is idempotent - safe to call multiple times', async () => {
    const fixturePath = await createFixture('empty-project');

    await cleanupFixture(fixturePath);
    await cleanupFixture(fixturePath); // Should not throw
    await cleanupFixture(fixturePath); // Should not throw

    expect(existsSync(fixturePath)).toBe(false);
  });

  it('handles non-existent paths gracefully', async () => {
    await cleanupFixture('/nonexistent/path/that/does/not/exist');
    // Should not throw
  });
});

describe('withFixture', () => {
  it('creates fixture, runs function, and cleans up', async () => {
    let capturedPath = '';

    await withFixture('vite-shadcn-v4', async (path) => {
      capturedPath = path;
      expect(existsSync(path)).toBe(true);
      expect(existsSync(join(path, 'package.json'))).toBe(true);
    });

    // Fixture should be cleaned up after withFixture returns
    expect(existsSync(capturedPath)).toBe(false);
  });

  it('cleans up even if function throws', async () => {
    let capturedPath = '';

    await expect(
      withFixture('vite-no-shadcn', async (path) => {
        capturedPath = path;
        throw new Error('Test error');
      }),
    ).rejects.toThrow('Test error');

    // Fixture should still be cleaned up
    expect(existsSync(capturedPath)).toBe(false);
  });

  it('returns the function result', async () => {
    const result = await withFixture('empty-project', async (path) => {
      return `fixture at ${path}`;
    });

    expect(result).toContain('fixture at');
  });
});

describe('PROPERTY: all fixtures produce valid detection results', () => {
  for (const fixtureType of ALL_FIXTURE_TYPES) {
    it(`${fixtureType}: framework detection matches expected`, async () => {
      const expected = getExpectedDetection(fixtureType);

      await withFixture(fixtureType, async (path) => {
        const framework = await detectFramework(path);
        expect(framework).toBe(expected.framework);
      });
    });

    it(`${fixtureType}: shadcn detection matches expected`, async () => {
      const expected = getExpectedDetection(fixtureType);

      await withFixture(fixtureType, async (path) => {
        const shadcn = await detectShadcn(path);
        expect(shadcn !== null).toBe(expected.hasShadcn);
      });
    });

    it(`${fixtureType}: tailwind version detection matches expected`, async () => {
      const expected = getExpectedDetection(fixtureType);

      await withFixture(fixtureType, async (path) => {
        const version = await detectTailwindVersion(path);
        expect(version).toBe(expected.tailwindVersion);
      });
    });

    it(`${fixtureType}: tailwind v3 detection matches expected`, async () => {
      const expected = getExpectedDetection(fixtureType);

      await withFixture(fixtureType, async (path) => {
        const version = await detectTailwindVersion(path);
        expect(isTailwindV3(version)).toBe(expected.isTailwindV3);
      });
    });
  }
});

describe('framework-specific fixtures', () => {
  it('Next.js fixture has correct dependencies', async () => {
    await withFixture('nextjs-shadcn-v4', async (path) => {
      const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf-8'));
      expect(pkg.dependencies.next).toBeDefined();
      expect(pkg.dependencies.react).toBeDefined();
    });
  });

  it('Vite fixture has vite in devDependencies', async () => {
    await withFixture('vite-shadcn-v4', async (path) => {
      const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf-8'));
      expect(pkg.devDependencies.vite).toBeDefined();
    });
  });

  it('Remix fixture has @remix-run packages', async () => {
    await withFixture('remix-shadcn-v4', async (path) => {
      const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf-8'));
      expect(pkg.dependencies['@remix-run/node']).toBeDefined();
      expect(pkg.dependencies['@remix-run/react']).toBeDefined();
    });
  });

  it('Astro fixture has astro dependency', async () => {
    await withFixture('astro-shadcn-v4', async (path) => {
      const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf-8'));
      expect(pkg.dependencies.astro).toBeDefined();
    });
  });

  it('Tailwind v3 fixture has v3 version', async () => {
    await withFixture('tailwind-v3-error', async (path) => {
      const pkg = JSON.parse(await readFile(join(path, 'package.json'), 'utf-8'));
      expect(pkg.devDependencies.tailwindcss).toContain('3.');
    });
  });
});
