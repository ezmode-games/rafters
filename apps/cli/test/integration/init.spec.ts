/**
 * Integration tests for 'rafters init' command
 *
 * Tests the init command against real project fixtures with real filesystem operations.
 * Validates directory structure creation, config file generation, token files, and error handling.
 */

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ensureCLIBuilt, runCLI, runCLIExpectingFailure } from '../helpers/cliRunner.js';
import { detectFramework } from '../helpers/frameworkDetection.js';
import { cleanupAllTempApps, createTempTestApp } from '../helpers/testApp.js';
import type { TestFixtureInfo } from '../types.js';

describe.skip('rafters init', { timeout: 30000 }, () => {
  let testApp: TestFixtureInfo;

  // Helper function to create answers file for non-interactive testing
  interface AnswersConfig {
    componentsDir?: string;
    cssFile?: string;
    studioShortcode?: string;
    tokenFormat?: string;
    packageManager?: string;
  }
  const createAnswersFile = (testAppPath: string, overrides: Partial<AnswersConfig> = {}) => {
    const answersPath = join(testAppPath, 'rafters-answers.json');
    const defaultAnswers = {
      componentsDir: './src/components/ui',
      cssFile: './src/app/globals.css',
      studioShortcode: '',
      tokenFormat: 'tailwind',
      packageManager: 'npm',
      ...overrides,
    };
    writeFileSync(answersPath, JSON.stringify(defaultAnswers, null, 2));
    return 'rafters-answers.json';
  };

  // Helper function to check if token files exist
  const hasTokenFiles = (testAppPath: string): boolean => {
    const raftersDir = join(testAppPath, '.rafters');
    const possibleTokenPaths = [
      join(raftersDir, 'tokens.json'),
      join(raftersDir, 'tokens'),
      join(testAppPath, 'design-tokens'),
      join(testAppPath, 'tokens.json'),
    ];

    for (const path of possibleTokenPaths) {
      if (existsSync(path)) {
        return true;
      }
    }
    return false;
  };

  beforeEach(async () => {
    // Ensure CLI is built before running tests
    await ensureCLIBuilt();

    // Clean up any existing temp apps before each test
    await cleanupAllTempApps();
  });

  afterEach(async () => {
    // Cleanup test app after each test
    if (testApp) {
      await testApp.cleanup();
    }
  });

  describe('Framework Detection', () => {
    it('should detect Next.js projects correctly', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Use framework detection helper to verify setup
      const frameworkResult = detectFramework(testApp.path);
      expect(frameworkResult.framework).toBe('nextjs');
      expect(frameworkResult.confidence).toBeGreaterThan(0.5);
      expect(frameworkResult.evidence).toContain('Next.js dependency found');
    });

    it('should detect Vite projects correctly', async () => {
      testApp = await createTempTestApp('vite-react');

      const frameworkResult = detectFramework(testApp.path);
      expect(frameworkResult.framework).toBe('vite');
      expect(frameworkResult.confidence).toBeGreaterThan(0.5);
      expect(frameworkResult.evidence.some((e) => e.includes('vite'))).toBe(true);
    });

    it('should detect React Router 7 projects correctly', async () => {
      testApp = await createTempTestApp('rr7-app');

      const frameworkResult = detectFramework(testApp.path);
      // React Router may be detected as vite with React Router evidence
      expect(['react-router', 'vite']).toContain(frameworkResult.framework);
      expect(frameworkResult.confidence).toBeGreaterThan(0.3);
    });

    it('should handle empty projects', async () => {
      testApp = await createTempTestApp('empty-project');

      const frameworkResult = detectFramework(testApp.path);
      expect(frameworkResult.framework).toBe('unknown');
      expect(frameworkResult.confidence).toBe(0);
    });
  });

  describe('Directory Structure Creation', () => {
    it('should create .rafters directory structure in Next.js project', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Create answers file for non-interactive testing
      const configFile = createAnswersFile(testApp.path);

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      // Verify directory structure
      expect(existsSync(join(testApp.path, '.rafters'))).toBe(true);
      expect(existsSync(join(testApp.path, '.rafters', 'config.json'))).toBe(true);
      expect(existsSync(join(testApp.path, '.rafters', 'agent-instructions.md'))).toBe(true);
      expect(existsSync(join(testApp.path, '.rafters', 'component-manifest.json'))).toBe(true);
      expect(existsSync(join(testApp.path, 'src', 'components', 'ui'))).toBe(true);
      expect(existsSync(join(testApp.path, 'src', 'lib'))).toBe(true);
      expect(existsSync(join(testApp.path, 'src', 'lib', 'utils.ts'))).toBe(true);
    });

    it('should create .rafters directory structure in Vite project', async () => {
      testApp = await createTempTestApp('vite-react');

      const configFile = createAnswersFile(testApp.path, {
        cssFile: './src/index.css',
      });

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      if (result.exitCode !== 0) {
        console.log('Vite project init STDERR:', result.stderr);
        console.log('Vite project init STDOUT:', result.stdout);
      }
      expect(result.exitCode).toBe(0);

      // Verify basic directory structure
      expect(existsSync(join(testApp.path, '.rafters'))).toBe(true);
      expect(existsSync(join(testApp.path, '.rafters', 'config.json'))).toBe(true);
      expect(existsSync(join(testApp.path, 'src', 'components', 'ui'))).toBe(true);
    });

    it('should create design token directories', async () => {
      testApp = await createTempTestApp('nextjs-app');

      const configFile = createAnswersFile(testApp.path);

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      // Check for token-related directories and files
      const raftersDir = join(testApp.path, '.rafters');
      expect(existsSync(raftersDir)).toBe(true);

      // Check for token files (location may vary based on token format)
      expect(hasTokenFiles(testApp.path)).toBe(true);
    });
  });

  describe('Configuration File Generation', () => {
    it('should generate valid config.json with framework detection', async () => {
      testApp = await createTempTestApp('nextjs-app');

      const configFile = createAnswersFile(testApp.path, {
        componentsDir: './src/components/ui',
        cssFile: './src/app/globals.css',
        tokenFormat: 'tailwind',
        packageManager: 'npm',
      });

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      const configPath = join(testApp.path, '.rafters', 'config.json');
      expect(existsSync(configPath)).toBe(true);

      const config = JSON.parse(readFileSync(configPath, 'utf8'));

      // Verify config structure and values
      expect(config).toHaveProperty('componentsDir');
      expect(config).toHaveProperty('cssFile');
      expect(config).toHaveProperty('tokenFormat');
      expect(config).toHaveProperty('packageManager');
      expect(config).toHaveProperty('registry');
      expect(config).toHaveProperty('version');

      // Verify specific values
      expect(config.componentsDir).toBe('./src/components/ui');
      expect(config.cssFile).toBe('./src/app/globals.css');
      expect(config.tokenFormat).toBe('tailwind');
      expect(config.packageManager).toBe('npm');
    });

    it('should generate component manifest file', async () => {
      testApp = await createTempTestApp('nextjs-app');

      const configFile = createAnswersFile(testApp.path);

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      const manifestPath = join(testApp.path, '.rafters', 'component-manifest.json');
      expect(existsSync(manifestPath)).toBe(true);

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

      expect(manifest).toHaveProperty('version');
      expect(manifest).toHaveProperty('initialized');
      expect(manifest).toHaveProperty('components');
      expect(manifest.version).toBe('1.0.0');
      expect(typeof manifest.initialized).toBe('string');
      expect(manifest.components).toEqual({});
    });

    it('should generate agent instructions file', async () => {
      testApp = await createTempTestApp('nextjs-app');

      const configFile = createAnswersFile(testApp.path);

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      const instructionsPath = join(testApp.path, '.rafters', 'agent-instructions.md');
      expect(existsSync(instructionsPath)).toBe(true);

      const instructions = readFileSync(instructionsPath, 'utf8');
      expect(instructions).toContain('Rafters AI Agent Instructions');
      expect(instructions).toContain('Component Usage Guidelines');
      expect(instructions).toContain('Key Principles');
    });
  });

  describe('Token File Creation', () => {
    it('should create design token files for Tailwind format', async () => {
      testApp = await createTempTestApp('nextjs-app');

      const configFile = createAnswersFile(testApp.path, {
        tokenFormat: 'tailwind',
      });

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      // Check for token files in various possible locations
      expect(hasTokenFiles(testApp.path)).toBe(true);
    });

    it('should create design token files for CSS format', async () => {
      testApp = await createTempTestApp('vite-react');

      const configFile = createAnswersFile(testApp.path, {
        cssFile: './src/index.css',
        tokenFormat: 'css',
      });

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      if (result.exitCode !== 0) {
        console.log('CSS format init STDERR:', result.stderr);
        console.log('CSS format init STDOUT:', result.stdout);
      }
      expect(result.exitCode).toBe(0);

      // For CSS format, tokens should be embedded in CSS files
      const possibleCssPaths = [
        join(testApp.path, 'src', 'index.css'),
        join(testApp.path, 'src', 'app.css'),
        join(testApp.path, 'src', 'styles.css'),
      ];

      const cssFileExists = possibleCssPaths.some((path) => existsSync(path));
      expect(cssFileExists).toBe(true);
    });

    it('should handle Studio token fetching (with fallback)', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Provide invalid studio shortcode to test fallback
      const configFile = createAnswersFile(testApp.path, {
        studioShortcode: 'INVALID123',
      });

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      // Should still create token files even with invalid Studio shortcode
      const raftersDir = join(testApp.path, '.rafters');
      expect(existsSync(raftersDir)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should fail when no package.json exists', async () => {
      testApp = await createTempTestApp('empty-project');

      // Remove package.json to simulate invalid project
      rmSync(join(testApp.path, 'package.json'), { force: true });

      const result = await runCLIExpectingFailure(
        ['init'],
        {
          cwd: testApp.path,
          env: { CI: 'true' },
        },
        1
      );

      expect(result.stderr || result.stdout).toContain('No package.json found');
    });

    it('should fail when .rafters directory already exists', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // First initialization
      const configFile = createAnswersFile(testApp.path);
      const result1 = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result1.exitCode).toBe(0);
      expect(existsSync(join(testApp.path, '.rafters'))).toBe(true);

      // Second initialization should fail
      const result2 = await runCLIExpectingFailure(
        ['init', '--config', configFile],
        {
          cwd: testApp.path,
          env: { CI: 'true' },
        },
        1
      );

      expect(result2.stderr || result2.stdout).toContain('already initialized');
    });

    it('should fail when React is not found in dependencies', async () => {
      testApp = await createTempTestApp('empty-project');

      const result = await runCLIExpectingFailure(
        ['init'],
        {
          cwd: testApp.path,
          env: { CI: 'true' },
        },
        1
      );

      expect(result.stderr || result.stdout).toContain('React not found');
    });

    it.skip('should provide helpful error messages for invalid input (only validates in interactive mode)', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Provide invalid CSS file extension
      const configFile = createAnswersFile(testApp.path, {
        cssFile: './src/styles.txt', // Invalid .txt extension
      });

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Should either reject the input or provide error message
      expect(result.exitCode !== 0 || result.stdout.includes('must end with .css')).toBe(true);
    });
  });

  describe('Clean and Re-initialize', () => {
    it('should allow re-initialization after clean command', async () => {
      testApp = await createTempTestApp('nextjs-app');
      const configFile = createAnswersFile(testApp.path);

      // First initialization
      const result1 = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result1.exitCode).toBe(0);
      expect(existsSync(join(testApp.path, '.rafters'))).toBe(true);

      // Run clean command with --force flag
      const cleanResult = await runCLI(['clean', '--force'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(cleanResult.exitCode).toBe(0);
      expect(existsSync(join(testApp.path, '.rafters'))).toBe(false);

      // Second initialization should now succeed
      const result2 = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result2.exitCode).toBe(0);
      expect(existsSync(join(testApp.path, '.rafters'))).toBe(true);
    });
  });

  describe('File Content Validation', () => {
    it('should create utils.ts with proper content', async () => {
      testApp = await createTempTestApp('nextjs-app');

      const configFile = createAnswersFile(testApp.path);

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      const utilsPath = join(testApp.path, 'src', 'lib', 'utils.ts');
      expect(existsSync(utilsPath)).toBe(true);

      const utilsContent = readFileSync(utilsPath, 'utf8');
      expect(utilsContent).toContain("import { type ClassValue, clsx } from 'clsx'");
      expect(utilsContent).toContain("import { twMerge } from 'tailwind-merge'");
      expect(utilsContent).toContain('export function cn(');
    });

    it('should validate config file schema', async () => {
      testApp = await createTempTestApp('nextjs-app');

      const configFile = createAnswersFile(testApp.path);

      const result = await runCLI(['init', '--config', configFile], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(result.exitCode).toBe(0);

      const configPath = join(testApp.path, '.rafters', 'config.json');
      const config = JSON.parse(readFileSync(configPath, 'utf8'));

      // Validate all expected config properties exist and have correct types
      expect(typeof config.componentsDir).toBe('string');
      expect(typeof config.cssFile).toBe('string');
      expect(typeof config.tokenFormat).toBe('string');
      expect(typeof config.packageManager).toBe('string');
      expect(typeof config.registry).toBe('string');
      expect(typeof config.version).toBe('string');

      // Validate enum values
      expect(['tailwind', 'css', 'react-native']).toContain(config.tokenFormat);
      expect(['pnpm', 'npm', 'yarn']).toContain(config.packageManager);
    });
  });
});
