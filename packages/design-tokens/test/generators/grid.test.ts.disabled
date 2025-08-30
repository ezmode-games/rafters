/**
 * Grid Generator Tests
 *
 * Tests for CSS Grid layout token generation
 */

import { describe, expect, it } from 'vitest';
import { generateGridTokens } from '../../src/generators/grid.js';
import { TokenSchema } from '../../src/index.js';

describe('generateGridTokens', () => {
  it('generates grid template columns and rows tokens', () => {
    const tokens = generateGridTokens();

    expect(tokens.length).toBeGreaterThan(15); // 12 columns + 5 rows

    // Check column tokens
    const columnTokens = tokens.filter((t) => t.category === 'grid-template-columns');
    expect(columnTokens.length).toBe(12);

    // Check row tokens
    const rowTokens = tokens.filter((t) => t.category === 'grid-template-rows');
    expect(rowTokens.length).toBe(5);
  });

  it('generates proper auto-fit and auto-fill column tokens', () => {
    const tokens = generateGridTokens();
    const columns = tokens.filter((t) => t.category === 'grid-template-columns');

    const autoFitSm = columns.find((t) => t.name === 'auto-fit-sm');
    expect(autoFitSm).toBeDefined();
    expect(autoFitSm?.value).toBe('repeat(auto-fit, minmax(200px, 1fr))');

    const autoFillLg = columns.find((t) => t.name === 'auto-fill-lg');
    expect(autoFillLg).toBeDefined();
    expect(autoFillLg?.value).toBe('repeat(auto-fill, minmax(360px, 1fr))');
  });

  it('generates proper equal column tokens', () => {
    const tokens = generateGridTokens();
    const columns = tokens.filter((t) => t.category === 'grid-template-columns');

    const twoCols = columns.find((t) => t.name === '2-cols');
    expect(twoCols?.value).toBe('repeat(2, 1fr)');

    const fourCols = columns.find((t) => t.name === '4-cols');
    expect(fourCols?.value).toBe('repeat(4, 1fr)');

    const twelveCols = columns.find((t) => t.name === '12-cols');
    expect(twelveCols?.value).toBe('repeat(12, 1fr)');
  });

  it('generates proper sidebar layout tokens', () => {
    const tokens = generateGridTokens();
    const columns = tokens.filter((t) => t.category === 'grid-template-columns');

    const sidebar = columns.find((t) => t.name === 'sidebar');
    expect(sidebar?.value).toBe('250px 1fr');

    const mainSidebar = columns.find((t) => t.name === 'main-sidebar');
    expect(mainSidebar?.value).toBe('1fr 250px');
  });

  it('generates proper row layout tokens', () => {
    const tokens = generateGridTokens();
    const rows = tokens.filter((t) => t.category === 'grid-template-rows');

    const auto = rows.find((t) => t.name === 'auto');
    expect(auto?.value).toBe('auto');

    const headerMainFooter = rows.find((t) => t.name === 'header-main-footer');
    expect(headerMainFooter?.value).toBe('auto 1fr auto');

    const masonry = rows.find((t) => t.name === 'masonry');
    expect(masonry?.value).toBe('masonry');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateGridTokens();

    const autoFitSm = tokens.find((t) => t.name === 'auto-fit-sm');
    expect(autoFitSm?.semanticMeaning).toContain('Auto-fit grid for small cards');

    const headerMainFooter = tokens.find((t) => t.name === 'header-main-footer');
    expect(headerMainFooter?.semanticMeaning).toContain('Header, main content, footer layout');

    const masonry = tokens.find((t) => t.name === 'masonry');
    expect(masonry?.semanticMeaning).toContain('Masonry layout rows');
  });

  it('includes usage context for different grid layouts', () => {
    const tokens = generateGridTokens();

    const autoFitMd = tokens.find((t) => t.name === 'auto-fit-md');
    expect(autoFitMd?.usageContext).toContain('medium-cards');
    expect(autoFitMd?.usageContext).toContain('product-grids');

    const sidebar = tokens.find((t) => t.name === 'sidebar');
    expect(sidebar?.usageContext).toContain('navigation');
    expect(sidebar?.usageContext).toContain('admin-panels');

    const masonry = tokens.find((t) => t.name === 'masonry');
    expect(masonry?.usageContext).toContain('pinterest-style');
    expect(masonry?.usageContext).toContain('gallery-masonry');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateGridTokens();

    const twoCols = tokens.find((t) => t.name === '2-cols');
    expect(twoCols?.cognitiveLoad).toBe(2); // Simple layout

    const twelveCols = tokens.find((t) => t.name === '12-cols');
    expect(twelveCols?.cognitiveLoad).toBe(8); // Complex layout system

    const masonry = tokens.find((t) => t.name === 'masonry');
    expect(masonry?.cognitiveLoad).toBe(7); // Advanced layout technique
  });

  it('includes proper trust levels', () => {
    const tokens = generateGridTokens();

    const twoCols = tokens.find((t) => t.name === '2-cols');
    expect(twoCols?.trustLevel).toBe('low'); // Safe, simple layout

    const twelveCols = tokens.find((t) => t.name === '12-cols');
    expect(twelveCols?.trustLevel).toBe('high'); // Complex, needs expertise

    const autoFitLg = tokens.find((t) => t.name === 'auto-fit-lg');
    expect(autoFitLg?.trustLevel).toBe('medium'); // Requires understanding
  });

  it('validates all grid tokens pass schema validation', () => {
    const tokens = generateGridTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper namespaces and categories', () => {
    const tokens = generateGridTokens();

    const columns = tokens.filter((t) => t.category === 'grid-template-columns');
    for (const column of columns) {
      expect(column.namespace).toBe('grid-cols');
      expect(column.generateUtilityClass).toBe(true);
    }

    const rows = tokens.filter((t) => t.category === 'grid-template-rows');
    for (const row of rows) {
      expect(row.namespace).toBe('grid-rows');
      expect(row.generateUtilityClass).toBe(true);
    }
  });

  it('marks layout changes as significant consequence', () => {
    const tokens = generateGridTokens();

    // All grid tokens should have significant consequence since they affect entire page structure
    for (const token of tokens) {
      expect(token.consequence).toBe('significant');
    }
  });
});
