import { describe, expect, it } from 'vitest';
import { extractCriticalCSS } from './extract-critical-css';

describe('extractCriticalCSS', () => {
  it('should generate CSS for Tailwind classes', async () => {
    const result = await extractCriticalCSS({
      classes: ['flex', 'items-center', 'bg-primary'],
      outputPath: '/tmp/test-output.css',
    });

    expect(result.css).toContain('flex');
    expect(result.css).toContain('items-center');
    expect(result.classCount).toBe(3);
    expect(result.sizeBytes).toBeGreaterThan(0);
  });

  it('should handle empty classes array', async () => {
    const result = await extractCriticalCSS({
      classes: [],
      outputPath: '/tmp/test-empty.css',
    });

    expect(result.css).toBe('');
    expect(result.sizeBytes).toBe(0);
    expect(result.classCount).toBe(0);
  });

  it('should minify CSS by default', async () => {
    const result = await extractCriticalCSS({
      classes: ['flex', 'items-center'],
      outputPath: '/tmp/test-minified.css',
      minify: true,
    });

    expect(result.sizeBytes).toBeLessThan(1000);
  });

  it('should handle custom design token classes', async () => {
    const result = await extractCriticalCSS({
      classes: ['bg-primary', 'text-primary-foreground', 'hover:bg-primary/90'],
      outputPath: '/tmp/test-tokens.css',
    });

    expect(result.css).toBeTruthy();
    expect(result.classCount).toBe(3);
  });
});
