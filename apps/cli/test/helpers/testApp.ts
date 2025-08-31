/**
 * Test app fixture management for CLI integration tests
 *
 * Provides utilities to create, manage, and cleanup temporary test applications
 * using the same generators that real users run.
 */

import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { TestAppOptions, TestFixtureInfo } from '../types.js';

const CLI_ROOT = join(process.cwd());
const FIXTURES_DIR = join(CLI_ROOT, 'test', 'fixtures');
const TEMP_DIR = tmpdir();

/**
 * Create a temporary test application from a fixture
 */
export async function createTempTestApp(
  type: TestAppOptions['type'],
  options: Omit<TestAppOptions, 'type'> = {}
): Promise<TestFixtureInfo> {
  const { name = `test-${type}-${Date.now()}`, preserve = false } = options;

  // Ensure fixtures directory exists and has the requested fixture
  await ensureFixturesExist();

  const fixtureSource = join(FIXTURES_DIR, type);
  if (!existsSync(fixtureSource)) {
    throw new Error(
      `Test fixture "${type}" not found at ${fixtureSource}. Run 'node scripts/create-test-fixtures.js' first.`
    );
  }

  // Create temporary directory for this test app
  const tempPath = join(TEMP_DIR, name);
  if (existsSync(tempPath)) {
    rmSync(tempPath, { recursive: true, force: true });
  }

  // Copy fixture to temporary location
  cpSync(fixtureSource, tempPath, { recursive: true });

  const cleanup = async (): Promise<void> => {
    if (!preserve && existsSync(tempPath)) {
      rmSync(tempPath, { recursive: true, force: true });
    }
  };

  return {
    path: tempPath,
    type,
    isTemporary: true,
    cleanup,
  };
}

/**
 * Ensure test fixtures exist, create them if missing
 */
async function ensureFixturesExist(): Promise<void> {
  if (!existsSync(FIXTURES_DIR)) {
    console.log('Creating test fixtures (this may take a few minutes)...');
    try {
      execSync('node scripts/create-test-fixtures.js', {
        cwd: CLI_ROOT,
        stdio: 'inherit',
      });
    } catch (error) {
      throw new Error(
        `Failed to create test fixtures: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  // Verify all expected fixtures exist
  const expectedFixtures: TestAppOptions['type'][] = [
    'nextjs-app',
    'rr7-app',
    'vite-react',
    'empty-project',
    'initialized-project',
  ];

  const missingFixtures = expectedFixtures.filter(
    (fixture) => !existsSync(join(FIXTURES_DIR, fixture))
  );

  if (missingFixtures.length > 0) {
    throw new Error(
      `Missing test fixtures: ${missingFixtures.join(', ')}. Run 'node scripts/create-test-fixtures.js' to regenerate.`
    );
  }
}

/**
 * Clean up all temporary test apps (utility for test cleanup)
 */
export async function cleanupAllTempApps(): Promise<void> {
  const tempDirs = [
    join(TEMP_DIR, 'test-nextjs-app-*'),
    join(TEMP_DIR, 'test-rr7-app-*'),
    join(TEMP_DIR, 'test-vite-react-*'),
    join(TEMP_DIR, 'test-empty-project-*'),
  ];

  for (const pattern of tempDirs) {
    try {
      // Use shell glob expansion to find matching directories
      execSync(`rm -rf ${pattern}`, { stdio: 'ignore' });
    } catch {
      // Ignore errors - directories may not exist
    }
  }
}

/**
 * Get information about available test fixtures
 */
export function getAvailableFixtures(): TestAppOptions['type'][] {
  if (!existsSync(FIXTURES_DIR)) {
    return [];
  }

  const fixtures: TestAppOptions['type'][] = [];
  const expectedTypes: TestAppOptions['type'][] = [
    'nextjs-app',
    'rr7-app',
    'vite-react',
    'empty-project',
    'initialized-project',
  ];

  for (const type of expectedTypes) {
    if (existsSync(join(FIXTURES_DIR, type))) {
      fixtures.push(type);
    }
  }

  return fixtures;
}

/**
 * Validate that a test app has the expected structure for its type
 */
export function validateTestAppStructure(testApp: TestFixtureInfo): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { path, type } = testApp;

  if (!existsSync(path)) {
    return { valid: false, errors: ['Test app directory does not exist'] };
  }

  // Check for package.json (all fixture types should have this)
  const packageJsonPath = join(path, 'package.json');
  if (!existsSync(packageJsonPath)) {
    errors.push('package.json not found');
  }

  // Type-specific validations
  switch (type) {
    case 'nextjs-app':
      if (
        !existsSync(join(path, 'next.config.js')) &&
        !existsSync(join(path, 'next.config.mjs')) &&
        !existsSync(join(path, 'next.config.ts'))
      ) {
        errors.push('Next.js config file not found');
      }
      // Check for app directory in root or src
      if (!existsSync(join(path, 'app')) && !existsSync(join(path, 'src', 'app'))) {
        errors.push('Next.js app directory not found');
      }
      break;

    case 'vite-react':
      if (!existsSync(join(path, 'vite.config.ts')) && !existsSync(join(path, 'vite.config.js'))) {
        errors.push('Vite config file not found');
      }
      if (!existsSync(join(path, 'src'))) {
        errors.push('Vite src directory not found');
      }
      break;

    case 'rr7-app':
      // React Router 7 specific checks
      if (!existsSync(join(path, 'app'))) {
        errors.push('React Router 7 app directory not found');
      }
      break;

    case 'empty-project':
      // Minimal validation for empty project
      break;

    case 'initialized-project':
      // Check for .rafters directory and tokens
      if (!existsSync(join(path, '.rafters'))) {
        errors.push('.rafters directory not found');
      }
      if (!existsSync(join(path, '.rafters', 'tokens'))) {
        errors.push('.rafters/tokens directory not found');
      }
      if (!existsSync(join(path, '.rafters', 'config.json'))) {
        errors.push('.rafters/config.json not found');
      }
      break;
  }

  return { valid: errors.length === 0, errors };
}
