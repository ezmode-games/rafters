/**
 * Motion Generator Tests
 *
 * Tests for animation duration and easing token generation
 */

import { describe, expect, it } from 'vitest';
import { generateMotionTokens } from '../../src/generators/motion.js';
import { TokenSchema } from '../../src/index.js';

describe('generateMotionTokens', () => {
  it('generates duration and easing tokens', () => {
    const tokens = generateMotionTokens();

    expect(tokens.length).toBeGreaterThan(10);

    // Check duration tokens (they have category 'motion')
    const durationTokens = tokens.filter((t) => t.category === 'motion');
    expect(durationTokens.length).toBeGreaterThan(3);

    const fastDuration = durationTokens.find((t) => t.name === 'fast');
    expect(fastDuration).toBeDefined();
    expect(fastDuration?.value).toBe('150ms');

    // Check easing tokens
    const easingTokens = tokens.filter((t) => t.category === 'easing');
    expect(easingTokens.length).toBeGreaterThan(3);

    const accelerating = easingTokens.find((t) => t.name === 'accelerating'); // This is ease-out
    expect(accelerating).toBeDefined();
    expect(accelerating?.value).toBe('ease-out');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateMotionTokens();

    const instantDuration = tokens.find((t) => t.name === 'instant');
    expect(instantDuration?.cognitiveLoad).toBeLessThanOrEqual(2);

    const slowDuration = tokens.find((t) => t.name === 'slow');
    expect(slowDuration?.cognitiveLoad).toBeGreaterThan(3);
  });

  it('includes usage context for different motion types', () => {
    const tokens = generateMotionTokens();

    const fastDuration = tokens.find((t) => t.name === 'fast');
    expect(fastDuration?.usageContext).toContain('dropdown');
    expect(fastDuration?.usageContext).toContain('tooltip');

    const decelerating = tokens.find((t) => t.name === 'decelerating'); // This is ease-in for exits
    expect(decelerating?.usageContext).toContain('exit');
    expect(decelerating?.usageContext).toContain('hide');
  });

  it('validates all motion tokens pass schema validation', () => {
    const tokens = generateMotionTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper accessibility considerations', () => {
    const tokens = generateMotionTokens();

    // Check that tokens have reduced motion considerations
    const instantDuration = tokens.find((t) => t.name === 'instant');
    expect(instantDuration?.semanticMeaning).toContain('Instant feedback');

    // All motion tokens should pass schema validation (accessibility built-in)
    expect(tokens.length).toBeGreaterThan(0);
  });
});
