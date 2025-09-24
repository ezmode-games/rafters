/**
 * Test suite for configuration utilities
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirSync, existsSync, removeSync, writeJsonSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  configExists,
  detectFramework,
  detectPackageManager,
  findCssFile,
  hasReact,
  isNodeProject,
} from '../../src/utils/config.js';

describe('config utilities', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-config-test-${Date.now()}`);
    ensureDirSync(testDir);
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
  });

  describe('isNodeProject', () => {
    it('should return false when no package.json exists', () => {
      expect(isNodeProject(testDir)).toBe(false);
    });

    it('should return true when package.json exists', () => {
      writeJsonSync(join(testDir, 'package.json'), { name: 'test' });
      expect(isNodeProject(testDir)).toBe(true);
    });
  });

  describe('hasReact', () => {
    it('should return false when React is not in dependencies', () => {
      writeJsonSync(join(testDir, 'package.json'), {
        name: 'test',
        dependencies: {},
      });
      expect(hasReact(testDir)).toBe(false);
    });

    it('should return true when React is in dependencies', () => {
      writeJsonSync(join(testDir, 'package.json'), {
        name: 'test',
        dependencies: {
          react: '^19.0.0',
        },
      });
      expect(hasReact(testDir)).toBe(true);
    });

    it('should return true when React is in devDependencies', () => {
      writeJsonSync(join(testDir, 'package.json'), {
        name: 'test',
        devDependencies: {
          react: '^19.0.0',
        },
      });
      expect(hasReact(testDir)).toBe(true);
    });
  });

  describe('configExists', () => {
    it('should return false when no .rafters directory exists', () => {
      expect(configExists(testDir)).toBe(false);
    });

    it('should return true when .rafters directory exists', () => {
      const fs = require('fs-extra');
      fs.ensureDirSync(join(testDir, '.rafters'));
      expect(configExists(testDir)).toBe(true);
    });
  });

  describe('detectFramework', () => {
    it('should detect Next.js', () => {
      writeJsonSync(join(testDir, 'package.json'), {
        dependencies: { next: '^14.0.0' },
      });
      expect(detectFramework(testDir)).toBe('next');
    });

    it('should detect Vite', () => {
      writeJsonSync(join(testDir, 'package.json'), {
        devDependencies: { vite: '^5.0.0' },
      });
      expect(detectFramework(testDir)).toBe('vite');
    });

    it('should detect Create React App', () => {
      writeJsonSync(join(testDir, 'package.json'), {
        dependencies: { 'react-scripts': '^5.0.0' },
      });
      expect(detectFramework(testDir)).toBe('create-react-app');
    });

    it('should return unknown for unrecognized frameworks', () => {
      writeJsonSync(join(testDir, 'package.json'), {
        dependencies: { react: '^19.0.0' },
      });
      expect(detectFramework(testDir)).toBe('unknown');
    });
  });

  describe('detectPackageManager', () => {
    it('should detect pnpm when pnpm-lock.yaml exists', () => {
      const fs = require('fs-extra');
      fs.writeFileSync(join(testDir, 'pnpm-lock.yaml'), '');
      expect(detectPackageManager(testDir)).toBe('pnpm');
    });

    it('should detect yarn when yarn.lock exists', () => {
      const fs = require('fs-extra');
      fs.writeFileSync(join(testDir, 'yarn.lock'), '');
      expect(detectPackageManager(testDir)).toBe('yarn');
    });

    it('should detect npm when package-lock.json exists', () => {
      const fs = require('fs-extra');
      fs.writeFileSync(join(testDir, 'package-lock.json'), '{}');
      expect(detectPackageManager(testDir)).toBe('npm');
    });

    it('should default to npm when no lock files exist', () => {
      expect(detectPackageManager(testDir)).toBe('npm');
    });
  });

  describe('findCssFile', () => {
    beforeEach(() => {
      const fs = require('fs-extra');
      fs.ensureDirSync(join(testDir, 'src'));
      fs.ensureDirSync(join(testDir, 'app'));
    });

    it('should find globals.css in src directory', () => {
      const fs = require('fs-extra');
      fs.writeFileSync(join(testDir, 'src/globals.css'), '');
      expect(findCssFile(testDir)).toBe('./src/globals.css');
    });

    it('should find globals.css in app directory', () => {
      const fs = require('fs-extra');
      fs.writeFileSync(join(testDir, 'app/globals.css'), '');
      expect(findCssFile(testDir)).toBe('./app/globals.css');
    });

    it('should return null when no CSS file is found', () => {
      expect(findCssFile(testDir)).toBeNull();
    });
  });
});
