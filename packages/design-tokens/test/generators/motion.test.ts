/**
 * Motion Generator Tests
 *
 * Validates motion token structure including durations, easing curves,
 * behavioral animations, and mathematical progressions with music ratios.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateMotionTokens } from '../../src/generators/motion.js';

describe('Motion Generator', () => {
  describe('generateMotionTokens', () => {
    it('should generate complete motion token set with all categories', () => {
      const tokens = generateMotionTokens('golden', 75, true);

      const durationTokens = tokens.filter((t) => t.category === 'motion');
      const easingTokens = tokens.filter((t) => t.category === 'easing');
      const behaviorTokens = tokens.filter((t) => t.category === 'behavior');

      expect(durationTokens).toHaveLength(13); // expressiveness levels
      expect(easingTokens.length).toBeGreaterThan(8); // includes advanced
      expect(behaviorTokens.length).toBeGreaterThan(10); // behavior animations
      expect(tokens.length).toBeGreaterThan(30);
    });

    it('should generate duration tokens with musical progressions', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const standard = durationTokens.find((t) => t.name === 'standard');
      expect(standard).toBeDefined();
      expect(standard?.mathRelationship).toBeUndefined(); // Base token

      const engage = durationTokens.find((t) => t.name === 'engage');
      expect(engage?.mathRelationship).toContain('golden');
      expect(engage?.progressionSystem).toBe('golden');
    });

    it('should generate core easing curves', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const easingTokens = tokens.filter((t) => t.category === 'easing');

      const expectedEasings = [
        'linear',
        'breath',
        'flow',
        'emerge',
        'retreat',
        'heartbeat',
        'dance',
        'snap',
      ];
      const easingNames = easingTokens.map((t) => t.name);

      for (const easing of expectedEasings) {
        expect(easingNames).toContain(easing);
      }
    });

    it('should generate advanced easing curves when enabled', () => {
      const tokens = generateMotionTokens('golden', 75, true);
      const easingTokens = tokens.filter((t) => t.category === 'easing');

      const advancedEasings = ['bounce', 'spring', 'thunder', 'whisper', 'wind'];
      const easingNames = easingTokens.map((t) => t.name);

      for (const easing of advancedEasings) {
        expect(easingNames).toContain(easing);
      }
    });

    it('should generate behavioral animations', () => {
      const tokens = generateMotionTokens('golden', 75, true);
      const behaviorTokens = tokens.filter((t) => t.category === 'behavior');

      const expectedBehaviors = [
        'fade-in',
        'fade-out',
        'grow',
        'shrink',
        'rise',
        'fall',
        'pop',
        'pulse',
      ];
      const behaviorNames = behaviorTokens.map((t) => t.name);

      for (const behavior of expectedBehaviors) {
        expect(behaviorNames).toContain(behavior);
      }
    });

    it('should include proper duration progression using musical ratios', () => {
      const tokens = generateMotionTokens('major-third', 100, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const standard = durationTokens.find((t) => t.name === 'standard');
      expect(standard?.value).toBe('100ms'); // Base value

      const engage = durationTokens.find((t) => t.name === 'engage');
      const engageMs = parseInt(engage?.value as string, 10);
      expect(engageMs).toBeGreaterThan(100); // Should be scaled up
    });

    it('should include motion duration metadata', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      for (const token of durationTokens) {
        expect(token).toHaveProperty('motionDuration');
        expect(typeof token.motionDuration).toBe('number');
        expect(token.motionDuration).toBeGreaterThan(0);
      }
    });

    it('should include accessibility metadata for all motion tokens', () => {
      const tokens = generateMotionTokens('golden', 75, true);

      for (const token of tokens) {
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.reducedMotionAware).toBe(true);
        expect(token.generateUtilityClass).toBe(true);
        expect(token.applicableComponents).toContain('all');
      }
    });

    it('should include proper cognitive load progression for durations', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const inform = durationTokens.find((t) => t.name === 'inform');
      expect(inform?.cognitiveLoad).toBe(1); // Subtle

      const hero = durationTokens.find((t) => t.name === 'hero');
      expect(hero?.cognitiveLoad).toBe(6); // Impactful

      const expressive = durationTokens.find((t) => t.name === 'expressive');
      expect(expressive?.cognitiveLoad).toBe(9); // Cinematic
    });

    it('should include proper trust level assessment', () => {
      const tokens = generateMotionTokens('golden', 75, true);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const guide = durationTokens.find((t) => t.name === 'guide');
      expect(guide?.trustLevel).toBe('low');

      const hero = durationTokens.find((t) => t.name === 'hero');
      expect(hero?.trustLevel).toBe('medium');

      const cinematic = durationTokens.find((t) => t.name === 'cinematic');
      expect(cinematic?.trustLevel).toBe('high');
    });

    it('should include usage context for durations', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const inform = durationTokens.find((t) => t.name === 'inform');
      expect(inform?.usageContext).toContain('micro-interactions');

      const celebrate = durationTokens.find((t) => t.name === 'celebrate');
      expect(celebrate?.usageContext).toContain('celebrations');

      const dramatic = durationTokens.find((t) => t.name === 'dramatic');
      expect(dramatic?.usageContext).toContain('dramatic-effects');
    });

    it('should include usage context for easings', () => {
      const tokens = generateMotionTokens('golden', 75, true);
      const easingTokens = tokens.filter((t) => t.category === 'easing');

      const emerge = easingTokens.find((t) => t.name === 'emerge');
      expect(emerge?.usageContext).toContain('fade-in');
      expect(emerge?.usageContext).toContain('reveal');

      const retreat = easingTokens.find((t) => t.name === 'retreat');
      expect(retreat?.usageContext).toContain('fade-out');

      const snap = easingTokens.find((t) => t.name === 'snap');
      expect(snap?.usageContext).toContain('button-feedback');
    });

    it('should include behavior animations with proper structure', () => {
      const tokens = generateMotionTokens('golden', 75, true);
      const behaviorTokens = tokens.filter((t) => t.category === 'behavior');

      for (const token of behaviorTokens) {
        const value = JSON.parse(token.value as string);
        expect(value).toHaveProperty('properties');
        expect(value).toHaveProperty('duration');
        expect(value).toHaveProperty('easing');
        expect(value.duration).toMatch(/var\(--duration-\w+\)/);
        expect(value.easing).toMatch(/var\(--ease-\w+\)/);
      }
    });

    it('should support different musical ratio systems', () => {
      const systems = ['major-third', 'perfect-fourth', 'perfect-fifth'];

      for (const system of systems) {
        const tokens = generateMotionTokens(
          system as 'major-third' | 'perfect-fourth' | 'perfect-fifth',
          75,
          false
        );
        const durationTokens = tokens.filter((t) => t.category === 'motion');
        const standard = durationTokens.find((t) => t.name === 'standard');

        expect(standard?.progressionSystem).toBe(system);
        expect(standard?.value).toBe('75ms');
      }
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateMotionTokens('golden', 75, true);

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');
      const easingTokens = tokens.filter((t) => t.category === 'easing');
      const behaviorTokens = tokens.filter((t) => t.category === 'behavior');

      for (let i = 0; i < durationTokens.length; i++) {
        expect(durationTokens[i].scalePosition).toBe(i);
      }

      for (let i = 0; i < easingTokens.length; i++) {
        expect(easingTokens[i].scalePosition).toBe(i);
      }

      for (let i = 0; i < behaviorTokens.length; i++) {
        expect(behaviorTokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning for all tokens', () => {
      const tokens = generateMotionTokens('golden', 75, true);

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(15);
      }
    });

    it('should handle different base speeds', () => {
      const tokens1 = generateMotionTokens('golden', 50, false);
      const tokens2 = generateMotionTokens('golden', 100, false);

      const standard1 = tokens1.find((t) => t.name === 'standard' && t.category === 'motion');
      const standard2 = tokens2.find((t) => t.name === 'standard' && t.category === 'motion');

      expect(standard1?.value).toBe('50ms');
      expect(standard2?.value).toBe('100ms');
    });

    it('should exclude advanced easing when disabled', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const easingTokens = tokens.filter((t) => t.category === 'easing');

      const advancedEasings = ['bounce', 'spring', 'thunder', 'whisper', 'wind'];
      const easingNames = easingTokens.map((t) => t.name);

      for (const easing of advancedEasings) {
        expect(easingNames).not.toContain(easing);
      }
    });

    it('should include proper consequence assessment', () => {
      const tokens = generateMotionTokens('golden', 75, true);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const cinematic = durationTokens.find((t) => t.name === 'cinematic');
      expect(cinematic?.consequence).toBe('significant');

      const standard = durationTokens.find((t) => t.name === 'standard');
      expect(standard?.consequence).toBe('reversible');
    });
  });

  describe('Mathematical Accuracy', () => {
    it('should produce accurate golden ratio progression', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');
      const golden = 1.618033988749895;

      const standard = durationTokens.find((t) => t.name === 'standard');
      const standardMs = parseInt(standard?.value as string, 10);
      expect(standardMs).toBe(75);

      const engage = durationTokens.find((t) => t.name === 'engage');
      const engageMs = parseInt(engage?.value as string, 10);
      const expectedEngage = Math.round(75 * golden);
      expect(engageMs).toBeCloseTo(expectedEngage, 0);
    });

    it('should produce accurate major-third progression', () => {
      const tokens = generateMotionTokens('major-third', 100, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const standard = durationTokens.find((t) => t.name === 'standard');
      expect(parseInt(standard?.value as string, 10)).toBe(100);

      // Major third ratio is 1.25
      const engage = durationTokens.find((t) => t.name === 'engage');
      const engageMs = parseInt(engage?.value as string, 10);
      expect(engageMs).toBeCloseTo(125, 5); // 100 * 1.25
    });
  });

  describe('Error Handling', () => {
    it('should handle zero base speed gracefully', () => {
      const tokens = generateMotionTokens('golden', 0, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      expect(durationTokens.length).toBeGreaterThan(0);
      // Should still generate tokens, even with 0 base
    });

    it('should handle negative base speed directly', () => {
      const tokens = generateMotionTokens('golden', -75, false);
      const durationTokens = tokens.filter((t) => t.category === 'motion');

      const standard = durationTokens.find((t) => t.name === 'standard');
      expect(parseInt(standard?.value as string, 10)).toBe(-75); // Uses negative value directly
    });
  });
});
