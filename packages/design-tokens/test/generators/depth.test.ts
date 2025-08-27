/**
 * Depth Generator Tests
 *
 * Tests for shadow and z-index token generation
 */

import { describe, expect, it } from 'vitest';
import { generateDepthScale } from '../../src/generators/depth.js';
import { TokenSchema } from '../../src/index.js';

describe('generateDepthScale', () => {
  it('generates shadow and semantic z-index tokens', () => {
    const tokens = generateDepthScale('linear', 10);

    // Should have shadow tokens + z-index tokens
    expect(tokens.length).toBeGreaterThan(10);

    // Check shadow tokens (now use simple names, filter by category)
    const shadowSm = tokens.find((t) => t.name === 'sm' && t.category === 'shadow');
    expect(shadowSm).toBeDefined();
    expect(shadowSm?.category).toBe('shadow');
    expect(shadowSm?.value).toContain('rgb(0 0 0');

    // Check semantic z-index tokens
    const zSticky = tokens.find((t) => t.name === 'sticky' && t.category === 'z-index');
    expect(zSticky).toBeDefined();
    expect(zSticky?.category).toBe('z-index');
    expect(zSticky?.value).toBe('10');
    expect(zSticky?.semanticMeaning).toContain('Sticky elements');

    const zModal = tokens.find((t) => t.name === 'modal' && t.category === 'z-index');
    expect(zModal?.value).toBe('1000');
    expect(zModal?.semanticMeaning).toContain('Modal dialogs');
  });

  it('generates semantic z-index layers', () => {
    const tokens = generateDepthScale('exponential', 10);

    // Test semantic layer hierarchy (filter by z-index category)
    const zBase = tokens.find((t) => t.name === 'base' && t.category === 'z-index');
    expect(zBase?.value).toBe('0'); // Base layer

    const zDropdown = tokens.find((t) => t.name === 'dropdown' && t.category === 'z-index');
    expect(zDropdown?.value).toBe('100'); // Dropdown layer

    const zTooltip = tokens.find((t) => t.name === 'tooltip' && t.category === 'z-index');
    expect(zTooltip?.value).toBe('50000'); // Highest priority

    // Verify semantic meanings
    expect(zDropdown?.semanticMeaning).toContain('Dropdowns and select menus');
    expect(zTooltip?.semanticMeaning).toContain('Tooltips (highest priority)');
  });

  it('validates token schema compliance', () => {
    const tokens = generateDepthScale('linear', 10);

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });
});
