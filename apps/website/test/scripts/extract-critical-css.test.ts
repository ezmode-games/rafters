/**
 * Tests for Tailwind Critical CSS Extraction
 */

import { mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { extractCriticalCSS } from '../../src/lib/registry/cssExtractor.js';

const TEST_OUTPUT_DIR = '/tmp/rafters-css-test';

describe.skip('extractCriticalCSS', () => {
  beforeEach(async () => {
    await mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  it('should generate CSS for Tailwind classes', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'test-output.css');
    const result = await extractCriticalCSS({
      classes: ['flex', 'items-center', 'bg-primary'],
      outputPath,
    });

    expect(result.css).toContain('.flex');
    expect(result.css).toContain('display');
    expect(result.css).toContain('.bg-primary');
    expect(result.classCount).toBe(3);
    expect(result.sizeBytes).toBeGreaterThan(0);

    // Verify file was written
    const fileContent = await readFile(outputPath, 'utf8');
    expect(fileContent).toBe(result.css);
  });

  it('should minify CSS when option enabled', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'test-minified.css');
    const result = await extractCriticalCSS({
      classes: ['flex', 'items-center'],
      outputPath,
      minify: true,
    });

    // Minified CSS should not have excessive whitespace
    expect(result.css).not.toMatch(/\n\s+\n/);
    expect(result.sizeBytes).toBeLessThan(1000);
    expect(result.sizeBytes).toBeGreaterThan(0);
  });

  it('should handle custom design token classes', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'test-tokens.css');
    const result = await extractCriticalCSS({
      classes: ['bg-primary', 'text-primary-foreground', 'hover:bg-primary/90'],
      outputPath,
    });

    expect(result.css).toContain('--primary');
    expect(result.classCount).toBe(3);
  });

  it('should handle empty class list', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'test-empty.css');
    const result = await extractCriticalCSS({
      classes: [],
      outputPath,
    });

    expect(result.css).toBe('');
    expect(result.classCount).toBe(0);
    expect(result.sizeBytes).toBe(0);
  });

  it('should handle state variants', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'test-states.css');
    const result = await extractCriticalCSS({
      classes: ['hover:bg-blue-500', 'focus:ring-2', 'disabled:opacity-50'],
      outputPath,
    });

    expect(result.css).toContain('hover:');
    expect(result.css).toContain('focus:');
    expect(result.css).toContain('disabled:');
    expect(result.classCount).toBe(3);
  });

  it('should handle responsive variants', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'test-responsive.css');
    const result = await extractCriticalCSS({
      classes: ['md:flex', 'lg:grid', 'xl:block'],
      outputPath,
    });

    expect(result.css).toContain('@media');
    expect(result.classCount).toBe(3);
  });

  it('should create output directory if missing', async () => {
    const nestedPath = join(TEST_OUTPUT_DIR, 'nested/deep/test.css');
    const result = await extractCriticalCSS({
      classes: ['flex'],
      outputPath: nestedPath,
    });

    expect(result.classCount).toBe(1);

    // Verify file exists at nested path
    const fileContent = await readFile(nestedPath, 'utf8');
    expect(fileContent).toBe(result.css);
  });

  it('should handle arbitrary values', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'test-arbitrary.css');
    const result = await extractCriticalCSS({
      classes: ['w-[200px]', 'bg-[#1da1f2]', 'p-[1.5rem]'],
      outputPath,
    });

    expect(result.css).toContain('200px');
    expect(result.css).toContain('#1da1f2');
    expect(result.css).toContain('1.5rem');
    expect(result.classCount).toBe(3);
  });
});
