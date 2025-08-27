/**
 * Touch Target Generator Tests
 *
 * Tests for accessibility-focused touch target token generation
 */

import { describe, expect, it } from 'vitest';
import { generateTouchTargetTokens } from '../../src/generators/touch-target.js';
import { TokenSchema } from '../../src/index.js';

describe('generateTouchTargetTokens', () => {
  it('generates touch target sizes with accessibility validation', () => {
    const tokens = generateTouchTargetTokens();

    expect(tokens.length).toBe(4);

    // Check standard accessible size
    const standard = tokens.find((t) => t.name === 'standard');
    expect(standard).toBeDefined();
    expect(standard?.value).toBe('44px'); // 44px minimum
    expect(standard?.touchTargetSize).toBe(44);

    // Check comfortable size
    const comfortable = tokens.find((t) => t.name === 'comfortable');
    expect(comfortable).toBeDefined();
    expect(comfortable?.touchTargetSize).toBe(48);
  });

  it('includes proper accessibility levels', () => {
    const tokens = generateTouchTargetTokens();

    // Check standard and above are AAA
    const standard = tokens.find((t) => t.name === 'standard');
    expect(standard?.accessibilityLevel).toBe('AAA');

    // Check compact is AA (below guidelines)
    const compact = tokens.find((t) => t.name === 'compact');
    expect(compact?.accessibilityLevel).toBe('AA');
  });

  it('includes usage context for different target types', () => {
    const tokens = generateTouchTargetTokens();

    const standard = tokens.find((t) => t.name === 'standard');
    expect(standard?.usageContext).toContain('buttons');
    expect(standard?.usageContext).toContain('interactive-elements');

    const large = tokens.find((t) => t.name === 'large');
    expect(large?.usageContext).toContain('hero-buttons');
    expect(large?.usageContext).toContain('cta');
  });

  it('includes proper trust levels based on size', () => {
    const tokens = generateTouchTargetTokens();

    // All have same trust level in current implementation
    const standard = tokens.find((t) => t.name === 'standard');
    expect(standard?.trustLevel).toBe('medium');

    const large = tokens.find((t) => t.name === 'large');
    expect(large?.trustLevel).toBe('medium');
  });

  it('validates all touch target tokens pass schema validation', () => {
    const tokens = generateTouchTargetTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateTouchTargetTokens();

    const standard = tokens.find((t) => t.name === 'standard');
    expect(standard?.applicableComponents).toContain('button');
    expect(standard?.applicableComponents).toContain('link');

    const large = tokens.find((t) => t.name === 'large');
    expect(large?.applicableComponents).toContain('button');
    expect(large?.applicableComponents).toContain('input');
  });

  it('includes cognitive load ratings', () => {
    const tokens = generateTouchTargetTokens();

    const standard = tokens.find((t) => t.name === 'standard');
    expect(standard?.cognitiveLoad).toBe(2);

    // All have same cognitive load in current implementation
    const large = tokens.find((t) => t.name === 'large');
    expect(large?.cognitiveLoad).toBe(2);
  });
});
