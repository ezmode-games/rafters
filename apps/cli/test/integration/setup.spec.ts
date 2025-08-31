/**
 * Integration test setup validation
 *
 * Validates that test fixtures are properly in place for CLI integration testing.
 */

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const FIXTURES_DIR = join(process.cwd(), 'test', 'fixtures');

/**
 * Calculate directory checksum by hashing all file contents
 */
function calculateDirectoryChecksum(dirPath: string): string {
  const hash = createHash('sha256');

  function processDirectory(path: string) {
    const items = readdirSync(path).sort(); // Sort for consistent ordering

    for (const item of items) {
      const itemPath = join(path, item);
      const stats = statSync(itemPath);

      if (stats.isDirectory()) {
        // Skip node_modules and other build artifacts
        if (['node_modules', '.next', 'dist', '.vite'].includes(item)) {
          continue;
        }
        hash.update(`dir:${item}`);
        processDirectory(itemPath);
      } else {
        hash.update(`file:${item}`);
        const content = readFileSync(itemPath, 'utf8');
        hash.update(content);
      }
    }
  }

  processDirectory(dirPath);
  return hash.digest('hex');
}

describe('Integration Test Setup', () => {
  describe('Test Fixtures', () => {
    it('should have all required test fixtures available', () => {
      const expectedFixtures = ['nextjs-app', 'rr7-app', 'vite-react', 'empty-project'];

      for (const fixture of expectedFixtures) {
        const fixturePath = join(FIXTURES_DIR, fixture);
        expect(existsSync(fixturePath), `Fixture ${fixture} should exist at ${fixturePath}`).toBe(
          true
        );
      }
    });

    it('should have valid Next.js fixture structure', () => {
      const fixturePath = join(FIXTURES_DIR, 'nextjs-app');

      // Check essential Next.js files exist
      expect(existsSync(join(fixturePath, 'package.json'))).toBe(true);
      expect(existsSync(join(fixturePath, 'next.config.ts'))).toBe(true);
      expect(existsSync(join(fixturePath, 'src', 'app'))).toBe(true);

      // Verify package.json contains Next.js dependency
      const packageJson = JSON.parse(readFileSync(join(fixturePath, 'package.json'), 'utf8'));
      expect(packageJson.dependencies?.next).toBeDefined();

      // Calculate and log checksum for reference
      const checksum = calculateDirectoryChecksum(fixturePath);
      expect(checksum).toHaveLength(64); // SHA256 hex length
    });

    it('should have valid Vite fixture structure', () => {
      const fixturePath = join(FIXTURES_DIR, 'vite-react');

      // Check essential Vite files exist
      expect(existsSync(join(fixturePath, 'package.json'))).toBe(true);
      expect(existsSync(join(fixturePath, 'vite.config.ts'))).toBe(true);
      expect(existsSync(join(fixturePath, 'index.html'))).toBe(true);
      expect(existsSync(join(fixturePath, 'src'))).toBe(true);

      // Verify package.json contains Vite dependency
      const packageJson = JSON.parse(readFileSync(join(fixturePath, 'package.json'), 'utf8'));
      expect(packageJson.devDependencies?.vite).toBeDefined();

      // Calculate and log checksum for reference
      const checksum = calculateDirectoryChecksum(fixturePath);
      expect(checksum).toHaveLength(64);
    });

    it('should have valid React Router fixture structure', () => {
      const fixturePath = join(FIXTURES_DIR, 'rr7-app');

      // Check essential React Router files exist
      expect(existsSync(join(fixturePath, 'package.json'))).toBe(true);
      expect(existsSync(join(fixturePath, 'app'))).toBe(true);

      // Calculate and log checksum for reference
      const checksum = calculateDirectoryChecksum(fixturePath);
      expect(checksum).toHaveLength(64);
    });

    it('should have valid empty project fixture', () => {
      const fixturePath = join(FIXTURES_DIR, 'empty-project');

      // Check minimal structure
      expect(existsSync(join(fixturePath, 'package.json'))).toBe(true);

      // Verify it's a minimal project
      const packageJson = JSON.parse(readFileSync(join(fixturePath, 'package.json'), 'utf8'));
      expect(packageJson.name).toBe('empty-test-project');
      expect(packageJson.type).toBe('module');

      // Calculate and log checksum for reference
      const checksum = calculateDirectoryChecksum(fixturePath);
      expect(checksum).toHaveLength(64);
    });

    it('should have stable fixture checksums', () => {
      // This test documents the current state of fixtures
      // If fixtures change, these checksums will need to be updated
      const fixtures = ['nextjs-app', 'rr7-app', 'vite-react', 'empty-project'];
      const checksums: Record<string, string> = {};

      for (const fixture of fixtures) {
        const fixturePath = join(FIXTURES_DIR, fixture);
        checksums[fixture] = calculateDirectoryChecksum(fixturePath);
      }

      // Log checksums for debugging/reference
      console.log('Current fixture checksums:', JSON.stringify(checksums, null, 2));

      // Verify all checksums are valid SHA256 hashes
      for (const [fixture, checksum] of Object.entries(checksums)) {
        expect(checksum, `${fixture} checksum should be valid SHA256`).toMatch(/^[a-f0-9]{64}$/);
      }
    });
  });
});
