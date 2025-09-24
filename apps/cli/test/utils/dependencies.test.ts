/**
 * Test suite for dependencies utility
 */

import type { execa } from 'execa';
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';
import { getCoreDependencies, installDependencies } from '../../src/utils/dependencies.js';

// Mock execa
vi.mock('execa', () => ({
  execa: vi.fn(),
}));

// Type definitions for mocked functions
type MockedExeca = MockedFunction<typeof execa>;

describe('dependencies utility', () => {
  let mockExeca: MockedExeca;

  beforeEach(async () => {
    const { execa } = await import('execa');
    mockExeca = vi.mocked(execa);
    mockExeca.mockResolvedValue({ stdout: '', stderr: '' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('installDependencies', () => {
    it('should install dependencies with npm', async () => {
      const dependencies = ['react', 'react-dom'];
      const cwd = '/test/directory';

      await installDependencies(dependencies, 'npm', cwd);

      expect(mockExeca).toHaveBeenCalledWith('npm', ['install', 'react', 'react-dom'], { cwd });
    });

    it('should install dependencies with yarn', async () => {
      const dependencies = ['@types/node', 'typescript'];

      await installDependencies(dependencies, 'yarn');

      expect(mockExeca).toHaveBeenCalledWith('yarn', ['add', '@types/node', 'typescript'], {
        cwd: process.cwd(),
      });
    });

    it('should install dependencies with pnpm', async () => {
      const dependencies = ['eslint', 'prettier'];
      const cwd = '/custom/path';

      await installDependencies(dependencies, 'pnpm', cwd);

      expect(mockExeca).toHaveBeenCalledWith('pnpm', ['add', 'eslint', 'prettier'], { cwd });
    });

    it('should use process.cwd() as default working directory', async () => {
      const dependencies = ['lodash'];

      await installDependencies(dependencies, 'npm');

      expect(mockExeca).toHaveBeenCalledWith('npm', ['install', 'lodash'], { cwd: process.cwd() });
    });

    it('should not run install command for empty dependencies array', async () => {
      await installDependencies([], 'npm');

      expect(mockExeca).not.toHaveBeenCalled();
    });

    it('should handle single dependency', async () => {
      await installDependencies(['single-package'], 'yarn');

      expect(mockExeca).toHaveBeenCalledWith('yarn', ['add', 'single-package'], {
        cwd: process.cwd(),
      });
    });

    it('should handle scoped packages', async () => {
      const dependencies = ['@radix-ui/react-dialog', '@types/react'];

      await installDependencies(dependencies, 'pnpm', '/project');

      expect(mockExeca).toHaveBeenCalledWith(
        'pnpm',
        ['add', '@radix-ui/react-dialog', '@types/react'],
        { cwd: '/project' }
      );
    });

    it('should propagate installation errors', async () => {
      const error = new Error('Package not found');
      mockExeca.mockRejectedValue(error);

      await expect(installDependencies(['nonexistent-package'], 'npm')).rejects.toThrow(
        'Package not found'
      );
    });

    it('should handle network timeouts gracefully', async () => {
      const timeoutError = new Error('Network timeout');
      mockExeca.mockRejectedValue(timeoutError);

      await expect(installDependencies(['timeout-package'], 'yarn')).rejects.toThrow(
        'Network timeout'
      );
    });

    it('should work with different package manager configurations', async () => {
      // Test all supported package managers
      const dependencies = ['test-package'];

      await installDependencies(dependencies, 'npm');
      expect(mockExeca).toHaveBeenLastCalledWith('npm', ['install', 'test-package'], {
        cwd: process.cwd(),
      });

      await installDependencies(dependencies, 'yarn');
      expect(mockExeca).toHaveBeenLastCalledWith('yarn', ['add', 'test-package'], {
        cwd: process.cwd(),
      });

      await installDependencies(dependencies, 'pnpm');
      expect(mockExeca).toHaveBeenLastCalledWith('pnpm', ['add', 'test-package'], {
        cwd: process.cwd(),
      });
    });
  });

  describe('getCoreDependencies', () => {
    it('should return the correct core dependencies', () => {
      const coreDeps = getCoreDependencies();

      expect(coreDeps).toEqual(['@radix-ui/react-slot', 'clsx', 'tailwind-merge']);
    });

    it('should return dependencies in consistent order', () => {
      const deps1 = getCoreDependencies();
      const deps2 = getCoreDependencies();

      expect(deps1).toEqual(deps2);
    });

    it('should include all required core dependencies', () => {
      const coreDeps = getCoreDependencies();

      expect(coreDeps).toContain('@radix-ui/react-slot');
      expect(coreDeps).toContain('clsx');
      expect(coreDeps).toContain('tailwind-merge');
      expect(coreDeps).toHaveLength(3);
    });

    it('should return a new array instance each time', () => {
      const deps1 = getCoreDependencies();
      const deps2 = getCoreDependencies();

      expect(deps1).not.toBe(deps2); // Different references
      expect(deps1).toEqual(deps2); // Same content
    });

    it('should not modify the returned array', () => {
      const originalDeps = getCoreDependencies();
      const modifiedDeps = [...originalDeps];
      modifiedDeps.push('extra-dependency');

      const freshDeps = getCoreDependencies();
      expect(freshDeps).toEqual(originalDeps);
      expect(freshDeps).not.toEqual(modifiedDeps);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle very large dependency lists', async () => {
      const largeDependencyList = Array.from({ length: 100 }, (_, i) => `package-${i}`);

      await installDependencies(largeDependencyList, 'pnpm');

      expect(mockExeca).toHaveBeenCalledWith('pnpm', ['add', ...largeDependencyList], {
        cwd: process.cwd(),
      });
    });

    it('should handle dependencies with special characters', async () => {
      const specialDeps = ['@scope/package-name', 'package_with_underscore'];

      await installDependencies(specialDeps, 'npm');

      expect(mockExeca).toHaveBeenCalledWith(
        'npm',
        ['install', '@scope/package-name', 'package_with_underscore'],
        { cwd: process.cwd() }
      );
    });
  });
});
