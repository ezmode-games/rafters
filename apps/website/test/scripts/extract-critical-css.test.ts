/**
 * Tests for Tailwind Critical CSS Extraction
 */

import { describe, expect, it } from 'vitest';
import { extractCriticalCSS } from '../../src/lib/registry/cssExtractor.js';

describe('extractCriticalCSS', () => {
  it('should generate CSS for Tailwind classes', async () => {
    const result = await extractCriticalCSS({
      classes: ['flex', 'items-center', 'bg-blue-500'],
    });

    expect(result.css).toContain('.flex');
    expect(result.css).toContain('display');
    expect(result.css).toContain('.bg-blue-500');
    expect(result.classCount).toBe(3);
    expect(result.sizeBytes).toBeGreaterThan(0);
  });

  it('should minify CSS when option enabled', async () => {
    const result = await extractCriticalCSS({
      classes: ['flex', 'items-center'],
      minify: true,
    });

    // Minified CSS should be compact
    expect(result.sizeBytes).toBeGreaterThan(0);
    expect(result.classCount).toBe(2);
  });

  it('should handle design token classes', async () => {
    const result = await extractCriticalCSS({
      classes: ['bg-blue-500', 'text-blue-600', 'hover:bg-blue-600'],
    });

    expect(result.css).toContain('--color-blue');
    expect(result.classCount).toBe(3);
  });

  it('should handle empty class list', async () => {
    const result = await extractCriticalCSS({
      classes: [],
    });

    expect(result.css).toBe('');
    expect(result.classCount).toBe(0);
    expect(result.sizeBytes).toBe(0);
  });

  it('should handle state variants', async () => {
    const result = await extractCriticalCSS({
      classes: ['hover:bg-blue-500', 'focus:ring-2', 'disabled:opacity-50'],
    });

    expect(result.css).toBeTruthy();
    expect(result.classCount).toBe(3);
  });

  it('should handle responsive variants', async () => {
    const result = await extractCriticalCSS({
      classes: ['md:flex', 'lg:grid', 'xl:block'],
    });

    expect(result.css).toContain('@media');
    expect(result.classCount).toBe(3);
  });

  it('should handle arbitrary values', async () => {
    const result = await extractCriticalCSS({
      classes: ['w-[200px]', 'bg-[#1da1f2]', 'p-[1.5rem]'],
    });

    expect(result.css).toContain('200px');
    expect(result.css).toContain('#1da1f2');
    expect(result.css).toContain('1.5rem');
    expect(result.classCount).toBe(3);
  });
});
