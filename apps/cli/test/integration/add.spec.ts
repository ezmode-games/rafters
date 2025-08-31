/**
 * Integration tests for 'rafters add' command
 *
 * Tests component installation against real registry endpoints with real filesystem operations.
 * Validates component fetching, dependency installation, file creation, and import transformations.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ensureCLIBuilt, runCLI, runCLIExpectingFailure } from '../helpers/cliRunner.js';
import { MockRegistryServer } from '../helpers/mockRegistry.js';
import { cleanupAllTempApps, createTempTestApp } from '../helpers/testApp.js';
import type { TestFixtureInfo } from '../types.js';

describe('rafters add', { timeout: 30000 }, () => {
  let testApp: TestFixtureInfo;
  let mockRegistry: MockRegistryServer;
  let registryUrl: string;

  // Helper function to check if component was installed correctly
  const validateComponentInstallation = (
    testAppPath: string,
    componentName: string,
    framework: 'nextjs' | 'vite' | 'react-router'
  ) => {
    const expectedPath = join(testAppPath, 'src', 'components', 'ui', `${componentName}.tsx`);

    // Check component file exists
    expect(existsSync(expectedPath)).toBe(true);

    // Check component content is valid React/TypeScript
    const content = readFileSync(expectedPath, 'utf8');
    expect(content).toContain('export');
    expect(content.length).toBeGreaterThan(100); // Should have substantial content

    // Check for import transformations based on framework
    if (framework === 'nextjs') {
      // Should use @/lib/utils import pattern for Next.js
      expect(content).toMatch(/@\/lib\/utils|\.\/\.\.\/.*utils/);
    }

    return { path: expectedPath, content };
  };

  // Helper function to check component manifest was updated
  const validateComponentManifest = (testAppPath: string, componentName: string) => {
    const manifestPath = join(testAppPath, '.rafters', 'component-manifest.json');
    expect(existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    expect(manifest.components).toBeDefined();
    expect(manifest.components[componentName]).toBeDefined();

    const component = manifest.components[componentName];
    expect(component.path).toBeDefined();
    expect(component.installed).toBeDefined();
    expect(component.version).toBeDefined();
    expect(component.intelligence).toBeDefined();

    return manifest;
  };

  beforeEach(async () => {
    // Ensure CLI is built before running tests
    await ensureCLIBuilt();

    // Start mock registry server
    mockRegistry = new MockRegistryServer();
    registryUrl = await mockRegistry.start();

    // Clean up any existing temp apps before each test
    await cleanupAllTempApps();
  });

  afterEach(async () => {
    // Cleanup test app after each test
    if (testApp) {
      await testApp.cleanup();
    }

    // Stop mock registry server
    if (mockRegistry) {
      await mockRegistry.stop();
    }
  });

  describe('Component Installation', () => {
    it('should install button component in Next.js project', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // First initialize the project
      const initResult = await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });
      expect(initResult.exitCode).toBe(0);

      // Then add the button component using mock registry
      const addResult = await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: {
          CI: 'true',
          RAFTERS_REGISTRY_URL: registryUrl,
        },
      });

      expect(addResult.exitCode).toBe(0);
      expect(addResult.stdout).toContain('button');

      // Validate installation
      validateComponentInstallation(testApp.path, 'button', 'nextjs');
      validateComponentManifest(testApp.path, 'button');
    });

    it('should install multiple components at once', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Initialize project
      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Add multiple components
      const addResult = await runCLI(['add', 'button', 'card'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(addResult.exitCode).toBe(0);

      // Validate both components were installed
      validateComponentInstallation(testApp.path, 'button', 'nextjs');
      validateComponentInstallation(testApp.path, 'card', 'nextjs');

      const manifest = validateComponentManifest(testApp.path, 'button');
      expect(manifest.components.card).toBeDefined();
    });

    it('should handle component installation in Vite project', async () => {
      testApp = await createTempTestApp('vite-react');

      // Initialize Vite project
      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Add component
      const addResult = await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(addResult.exitCode).toBe(0);
      validateComponentInstallation(testApp.path, 'button', 'vite');
    });
  });

  describe('Error Handling', () => {
    it('should fail gracefully when component not found', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Initialize project
      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Try to add non-existent component
      const addResult = await runCLIExpectingFailure(['add', 'nonexistent-component'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(addResult.exitCode).not.toBe(0);
      expect(addResult.stderr || addResult.stdout).toContain('not found');
    });

    it('should fail when rafters not initialized', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Try to add component without initializing first
      const addResult = await runCLIExpectingFailure(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(addResult.exitCode).not.toBe(0);
    });

    it('should handle existing component without --force flag', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Initialize and add component first time
      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Try to add same component again
      const addResult = await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Should succeed but skip installation
      expect(addResult.exitCode).toBe(0);
      expect(addResult.stdout).toContain('already exists');
    });

    it('should overwrite existing component with --force flag', async () => {
      testApp = await createTempTestApp('nextjs-app');

      // Initialize and add component first time
      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Force add same component again
      const addResult = await runCLI(['add', 'button', '--force'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(addResult.exitCode).toBe(0);
      expect(addResult.stdout).toContain('overwrite');
    });
  });

  describe('Import Transformations', () => {
    it('should transform imports correctly for Next.js projects', async () => {
      testApp = await createTempTestApp('nextjs-app');

      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: {
          CI: 'true',
          RAFTERS_REGISTRY_URL: registryUrl,
        },
      });

      const { content } = validateComponentInstallation(testApp.path, 'button', 'nextjs');

      // Should use proper import paths for Next.js
      expect(content).toMatch(/@\/lib\/utils|\.\.\/.*\/lib\/utils/);
    });

    it('should create utils.ts if it does not exist', async () => {
      testApp = await createTempTestApp('nextjs-app');

      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Utils should be created during init
      const utilsPath = join(testApp.path, 'src', 'lib', 'utils.ts');
      expect(existsSync(utilsPath)).toBe(true);

      const utilsContent = readFileSync(utilsPath, 'utf8');
      expect(utilsContent).toContain('cn');
      expect(utilsContent).toContain('clsx');
      expect(utilsContent).toContain('twMerge');
    });
  });

  describe('Dependency Management', () => {
    it('should skip dependency installation in test mode', async () => {
      testApp = await createTempTestApp('nextjs-app');

      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      const addResult = await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      expect(addResult.exitCode).toBe(0);

      // Should mention skipping dependency installation in test mode
      // (This is similar to how init command handles it)
      if (addResult.stdout.includes('Installing dependencies')) {
        expect(addResult.stdout).toContain('Skipping');
      }
    });
  });

  describe('Component Manifest Management', () => {
    it('should update component manifest with intelligence metadata', async () => {
      testApp = await createTempTestApp('nextjs-app');

      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      const manifest = validateComponentManifest(testApp.path, 'button');
      const buttonComponent = manifest.components.button;

      // Check intelligence metadata
      expect(buttonComponent.intelligence).toBeDefined();
      expect(typeof buttonComponent.intelligence.cognitiveLoad).toBe('number');
      expect(typeof buttonComponent.intelligence.attentionEconomics).toBe('string');
      expect(typeof buttonComponent.intelligence.accessibility).toBe('string');
    });

    it('should preserve existing manifest when adding new components', async () => {
      testApp = await createTempTestApp('nextjs-app');

      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Add first component
      await runCLI(['add', 'button'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Add second component
      await runCLI(['add', 'card'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      const manifest = validateComponentManifest(testApp.path, 'button');
      expect(manifest.components.button).toBeDefined();
      expect(manifest.components.card).toBeDefined();
    });
  });

  describe('Network Resilience', () => {
    it('should handle network timeout gracefully', async () => {
      testApp = await createTempTestApp('nextjs-app');

      await runCLI(['init', '--yes'], {
        cwd: testApp.path,
        env: { CI: 'true' },
      });

      // Mock network timeout by using invalid registry URL
      const addResult = await runCLIExpectingFailure(['add', 'button'], {
        cwd: testApp.path,
        env: {
          CI: 'true',
          RAFTERS_REGISTRY_URL: 'https://nonexistent-registry-12345.com',
        },
      });

      expect(addResult.exitCode).not.toBe(0);
      expect(addResult.stderr || addResult.stdout).toMatch(/timeout|network|fetch|ENOTFOUND/i);
    });
  });
});

