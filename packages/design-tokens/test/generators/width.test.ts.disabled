/**
 * Width Generator Tests
 *
 * Tests for width token generation for component sizing
 */

import { describe, expect, it } from 'vitest';
import { generateWidthTokens } from '../../src/generators/width.js';
import { TokenSchema } from '../../src/index.js';

describe('generateWidthTokens', () => {
  it('generates semantic width tokens for different use cases', () => {
    const tokens = generateWidthTokens();

    expect(tokens.length).toBe(13); // All width tokens

    // Check intrinsic sizing
    const min = tokens.find((t) => t.name === 'min');
    expect(min?.value).toBe('min-content');

    const max = tokens.find((t) => t.name === 'max');
    expect(max?.value).toBe('max-content');

    const fit = tokens.find((t) => t.name === 'fit');
    expect(fit?.value).toBe('fit-content');
  });

  it('generates proper full width tokens', () => {
    const tokens = generateWidthTokens();

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.value).toBe('100%');

    const screen = tokens.find((t) => t.name === 'screen');
    expect(screen?.value).toBe('100vw');
  });

  it('generates proper reading width token', () => {
    const tokens = generateWidthTokens();

    const prose = tokens.find((t) => t.name === 'prose');
    expect(prose?.value).toBe('65ch');
    expect(prose?.semanticMeaning).toContain('Optimal reading width');
  });

  it('generates proper dialog width tokens', () => {
    const tokens = generateWidthTokens();

    const dialogSm = tokens.find((t) => t.name === 'dialog-sm');
    expect(dialogSm?.value).toBe('320px');

    const dialogMd = tokens.find((t) => t.name === 'dialog-md');
    expect(dialogMd?.value).toBe('480px');

    const dialogXl = tokens.find((t) => t.name === 'dialog-xl');
    expect(dialogXl?.value).toBe('800px');
  });

  it('generates proper sidebar width tokens', () => {
    const tokens = generateWidthTokens();

    const sidebarSm = tokens.find((t) => t.name === 'sidebar-sm');
    expect(sidebarSm?.value).toBe('240px');

    const sidebar = tokens.find((t) => t.name === 'sidebar');
    expect(sidebar?.value).toBe('280px');

    const sidebarLg = tokens.find((t) => t.name === 'sidebar-lg');
    expect(sidebarLg?.value).toBe('320px');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateWidthTokens();

    const min = tokens.find((t) => t.name === 'min');
    expect(min?.semanticMeaning).toContain('Minimum content width');

    const prose = tokens.find((t) => t.name === 'prose');
    expect(prose?.semanticMeaning).toContain('Optimal reading width');

    const dialogLg = tokens.find((t) => t.name === 'dialog-lg');
    expect(dialogLg?.semanticMeaning).toContain('Large dialog width');
  });

  it('includes usage context for different width purposes', () => {
    const tokens = generateWidthTokens();

    const min = tokens.find((t) => t.name === 'min');
    expect(min?.usageContext).toContain('intrinsic-sizing');
    expect(min?.usageContext).toContain('flexible-layouts');

    const prose = tokens.find((t) => t.name === 'prose');
    expect(prose?.usageContext).toContain('reading-content');
    expect(prose?.usageContext).toContain('readability');

    const dialogSm = tokens.find((t) => t.name === 'dialog-sm');
    expect(dialogSm?.usageContext).toContain('small-modals');
    expect(dialogSm?.usageContext).toContain('confirmations');

    const sidebar = tokens.find((t) => t.name === 'sidebar');
    expect(sidebar?.usageContext).toContain('navigation-sidebar');
    expect(sidebar?.usageContext).toContain('side-panels');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateWidthTokens();

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.cognitiveLoad).toBe(1); // Simple, common pattern

    const prose = tokens.find((t) => t.name === 'prose');
    expect(prose?.cognitiveLoad).toBe(2); // Optimized for readability

    const screen = tokens.find((t) => t.name === 'screen');
    expect(screen?.cognitiveLoad).toBe(5); // Viewport-based, needs consideration

    const dialogXl = tokens.find((t) => t.name === 'dialog-xl');
    expect(dialogXl?.cognitiveLoad).toBe(6); // Large modals need careful UX
  });

  it('includes proper trust levels', () => {
    const tokens = generateWidthTokens();

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.trustLevel).toBe('low'); // Safe, standard pattern

    const screen = tokens.find((t) => t.name === 'screen');
    expect(screen?.trustLevel).toBe('medium'); // Viewport units need consideration

    const dialogXl = tokens.find((t) => t.name === 'dialog-xl');
    expect(dialogXl?.trustLevel).toBe('high'); // Large modals affect UX significantly
  });

  it('validates all width tokens pass schema validation', () => {
    const tokens = generateWidthTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateWidthTokens();

    const dialogMd = tokens.find((t) => t.name === 'dialog-md');
    expect(dialogMd?.applicableComponents).toContain('dialog');
    expect(dialogMd?.applicableComponents).toContain('modal');

    const sidebar = tokens.find((t) => t.name === 'sidebar');
    expect(sidebar?.applicableComponents).toContain('sidebar');
    expect(sidebar?.applicableComponents).toContain('navigation');

    const prose = tokens.find((t) => t.name === 'prose');
    expect(prose?.applicableComponents).toContain('content');
    expect(prose?.applicableComponents).toContain('article');

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.applicableComponents).toContain('layout');
  });

  it('has proper namespace and category', () => {
    const tokens = generateWidthTokens();

    for (const token of tokens) {
      expect(token.namespace).toBe('w');
      expect(token.category).toBe('width');
      expect(token.generateUtilityClass).toBe(true);
    }
  });

  it('includes proper consequence levels', () => {
    const tokens = generateWidthTokens();

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.consequence).toBe('reversible'); // Low trust level

    const dialogXl = tokens.find((t) => t.name === 'dialog-xl');
    expect(dialogXl?.consequence).toBe('significant'); // High trust level
  });
});
