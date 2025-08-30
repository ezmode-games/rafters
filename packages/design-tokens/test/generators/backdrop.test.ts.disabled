/**
 * Backdrop Generator Tests
 *
 * Tests for backdrop filter token generation
 */

import { describe, expect, it } from 'vitest';
import { generateBackdropTokens } from '../../src/generators/backdrop.js';
import { TokenSchema } from '../../src/index.js';

describe('generateBackdropTokens', () => {
  it('generates backdrop blur tokens with mathematical progression', () => {
    const tokens = generateBackdropTokens();

    expect(tokens.length).toBe(8); // none through 3xl

    // Check none
    const none = tokens.find((t) => t.name === 'none');
    expect(none?.value).toBe('0');

    // Check small
    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.value).toBe('4px');

    // Check default
    const defaultBlur = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBlur?.value).toBe('8px');

    // Check maximum
    const xl3 = tokens.find((t) => t.name === '3xl');
    expect(xl3?.value).toBe('64px');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateBackdropTokens();

    const none = tokens.find((t) => t.name === 'none');
    expect(none?.semanticMeaning).toBe('No backdrop blur');

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.semanticMeaning).toContain('Small backdrop blur for overlays');

    const defaultBlur = tokens.find((t) => t.name === 'DEFAULT');
    expect(defaultBlur?.semanticMeaning).toContain('Default backdrop blur for modals');

    const xl3 = tokens.find((t) => t.name === '3xl');
    expect(xl3?.semanticMeaning).toContain('Ultra blur for artistic effects');
  });

  it('includes usage context for different blur levels', () => {
    const tokens = generateBackdropTokens();

    const none = tokens.find((t) => t.name === 'none');
    expect(none?.usageContext).toContain('no-blur');
    expect(none?.usageContext).toContain('transparent');

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.usageContext).toContain('subtle-overlay');
    expect(sm?.usageContext).toContain('minimal-blur');

    const lg = tokens.find((t) => t.name === 'lg');
    expect(lg?.usageContext).toContain('strong-focus');
    expect(lg?.usageContext).toContain('modal-emphasis');

    const xl3 = tokens.find((t) => t.name === '3xl');
    expect(xl3?.usageContext).toContain('ultra-blur');
    expect(xl3?.usageContext).toContain('extreme-separation');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateBackdropTokens();

    const none = tokens.find((t) => t.name === 'none');
    expect(none?.cognitiveLoad).toBe(1); // No visual impact

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.cognitiveLoad).toBe(2); // Minimal impact

    const lg = tokens.find((t) => t.name === 'lg');
    expect(lg?.cognitiveLoad).toBe(5); // Noticeable separation

    const xl3 = tokens.find((t) => t.name === '3xl');
    expect(xl3?.cognitiveLoad).toBe(8); // High visual impact
  });

  it('includes proper trust levels based on impact', () => {
    const tokens = generateBackdropTokens();

    const none = tokens.find((t) => t.name === 'none');
    expect(none?.trustLevel).toBe('low'); // No risk

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.trustLevel).toBe('low'); // Subtle effect

    const lg = tokens.find((t) => t.name === 'lg');
    expect(lg?.trustLevel).toBe('medium'); // Noticeable effect

    const xl2 = tokens.find((t) => t.name === '2xl');
    expect(xl2?.trustLevel).toBe('high'); // Strong visual effect

    const xl3 = tokens.find((t) => t.name === '3xl');
    expect(xl3?.trustLevel).toBe('high'); // Maximum impact
  });

  it('includes math relationships for blur values', () => {
    const tokens = generateBackdropTokens();

    const none = tokens.find((t) => t.name === 'none');
    expect(none?.mathRelationship).toBe('No blur');

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.mathRelationship).toBe('blur(4px)');

    const lg = tokens.find((t) => t.name === 'lg');
    expect(lg?.mathRelationship).toBe('blur(16px)');
  });

  it('validates all backdrop tokens pass schema validation', () => {
    const tokens = generateBackdropTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateBackdropTokens();

    for (const token of tokens) {
      expect(token.applicableComponents).toContain('modal');
      expect(token.applicableComponents).toContain('dialog');
      expect(token.applicableComponents).toContain('overlay');
      expect(token.applicableComponents).toContain('backdrop');
    }
  });

  it('has proper namespace and category', () => {
    const tokens = generateBackdropTokens();

    for (const token of tokens) {
      expect(token.namespace).toBe('backdrop-blur');
      expect(token.category).toBe('backdrop-blur');
      expect(token.generateUtilityClass).toBe(true);
    }
  });

  it('includes proper consequence levels', () => {
    const tokens = generateBackdropTokens();

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.consequence).toBe('reversible'); // Low trust level

    const xl2 = tokens.find((t) => t.name === '2xl');
    expect(xl2?.consequence).toBe('significant'); // High trust level
  });
});
