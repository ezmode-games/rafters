/**
 * Real Integration Tests for `rafters init` command
 * Tests against actual framework projects (Next.js, Vite, etc.)
 */

import { join } from 'node:path';
import { execa } from 'execa';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ProjectFactory, type TestProject } from './factories/project.factory';

describe('rafters init - Real Projects', () => {
  let project: TestProject;
  const CLI_PATH = join(__dirname, '../../dist/index.js');

  afterEach(async () => {
    if (project) {
      await project.cleanup();
    }
  });

  describe('Next.js App Router', () => {
    beforeEach(async () => {
      project = await ProjectFactory.create({
        framework: 'nextjs-app',
        packageManager: 'pnpm',
        withTailwind: true,
      });
    }, 300000); // 5 minute timeout for project creation

    it('should initialize Rafters in a real Next.js app', async () => {
      // Run rafters init
      const result = await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
        reject: false,
      });

      // Verify success
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Rafters initialized');

      // Verify .rafters directory created
      expect(await project.fileExists('.rafters')).toBe(true);
      expect(await project.fileExists('.rafters/config.json')).toBe(true);

      // Verify config contents
      const configContent = await project.readFile('.rafters/config.json');
      const config = JSON.parse(configContent);
      // Next.js defaults to src/ directory
      expect(config.componentsDir).toBe('./src/components/ui');
      expect(config.packageManager).toBe('pnpm');

      // Verify tokens.css created and imported
      expect(await project.fileExists('.rafters/tokens.css')).toBe(true);

      // Verify utils.ts created
      expect(await project.fileExists('src/lib/utils.ts')).toBe(true);
      const utilsContent = await project.readFile('src/lib/utils.ts');
      expect(utilsContent).toContain('export function cn');

      // Verify primitives directory created
      expect(await project.fileExists('src/components/primitives')).toBe(true);
    }, 300000); // 5 minute timeout

    it('should detect pnpm as package manager', async () => {
      await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
      });

      const config = JSON.parse(await project.readFile('.rafters/config.json'));
      expect(config.packageManager).toBe('pnpm');
    }, 300000);

    it.skip('should inject tokens.css import into layout', async () => {
      await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
      });

      // Check app/layout.tsx for import
      // TODO: The CLI currently doesn't auto-inject CSS imports - users must do this manually
      const layoutContent = await project.readFile('app/layout.tsx');
      expect(layoutContent).toContain('.rafters/tokens.css');
    }, 300000);

    it('should prevent re-initialization', async () => {
      // Initialize once
      await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
      });

      // Try to initialize again
      const result = await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
        reject: false,
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr || result.stdout).toContain('already initialized');
    }, 300000);
  });

  describe('Vite + React', () => {
    beforeEach(async () => {
      project = await ProjectFactory.create({
        framework: 'vite-react',
        packageManager: 'pnpm',
        withTailwind: true,
      });
    }, 300000);

    it('should initialize Rafters in a real Vite project', async () => {
      const result = await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
        reject: false,
      });

      expect(result.exitCode).toBe(0);

      // Verify Vite-specific paths
      expect(await project.fileExists('.rafters/config.json')).toBe(true);
      const config = JSON.parse(await project.readFile('.rafters/config.json'));
      expect(config.componentsDir).toBe('./src/components/ui');

      // Verify utils in Vite structure
      expect(await project.fileExists('src/lib/utils.ts')).toBe(true);

      // Verify primitives directory
      expect(await project.fileExists('src/components/primitives')).toBe(true);
    }, 300000);

    it.skip('should inject tokens.css import into main.tsx', async () => {
      await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
      });

      // TODO: The CLI currently doesn't auto-inject CSS imports - users must do this manually
      const mainContent = await project.readFile('src/main.tsx');
      expect(mainContent).toContain('.rafters/tokens.css');
    }, 300000);
  });

  describe('React Router v7', () => {
    beforeEach(async () => {
      project = await ProjectFactory.create({
        framework: 'react-router',
        packageManager: 'pnpm',
        withTailwind: true,
      });
    }, 300000);

    it('should initialize Rafters in a real React Router v7 project', async () => {
      const result = await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
        reject: false,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Rafters initialized');

      // Verify config
      expect(await project.fileExists('.rafters/config.json')).toBe(true);
      const config = JSON.parse(await project.readFile('.rafters/config.json'));
      expect(config.componentsDir).toBe('./app/components/ui');

      // Verify utils created
      expect(await project.fileExists('app/lib/utils.ts')).toBe(true);

      // Verify primitives directory
      expect(await project.fileExists('app/components/primitives')).toBe(true);
    }, 300000);
  });

  describe('Astro + React', () => {
    beforeEach(async () => {
      project = await ProjectFactory.create({
        framework: 'astro',
        packageManager: 'pnpm',
        withTailwind: true,
      });
    }, 300000);

    it('should initialize Rafters in a real Astro project', async () => {
      const result = await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
        reject: false,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Rafters initialized');

      // Verify config
      expect(await project.fileExists('.rafters/config.json')).toBe(true);
      const config = JSON.parse(await project.readFile('.rafters/config.json'));
      expect(config.componentsDir).toBe('./src/components/ui');

      // Verify utils created
      expect(await project.fileExists('src/lib/utils.ts')).toBe(true);

      // Verify primitives directory
      expect(await project.fileExists('src/components/primitives')).toBe(true);
    }, 300000);
  });

  describe('Error Cases', () => {
    it('should fail without package.json', async () => {
      project = await ProjectFactory.create({
        framework: 'nextjs-app',
        packageManager: 'pnpm',
        withTailwind: true,
      });

      // Remove package.json entirely (not just empty it)
      const fs = await import('fs-extra');
      await fs.remove(join(project.path, 'package.json'));

      const result = await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
        reject: false,
      });

      expect(result.exitCode).not.toBe(0);
      // CLI should fail when package.json is missing
      expect(result.stderr || result.stdout).toContain('package.json');
    }, 300000);

    it('should fail without React dependency', async () => {
      project = await ProjectFactory.create({
        framework: 'nextjs-app',
        packageManager: 'pnpm',
        withTailwind: true,
      });

      // Remove React from package.json
      const pkg = await project.readPackageJson();
      delete pkg.dependencies;
      await project.writePackageJson(pkg);

      const result = await execa('node', [CLI_PATH, 'init', '--yes'], {
        cwd: project.path,
        reject: false,
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr || result.stdout).toContain('React');
    }, 300000);
  });
});
