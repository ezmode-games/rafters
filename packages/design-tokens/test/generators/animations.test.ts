/**
 * Animations Generator Tests
 *
 * Validates animation token structure, keyframes, behavioral intelligence,
 * and comprehensive animation system with semantic naming.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateAnimations } from '../../src/generators/animations.js';

describe('Animations Generator', () => {
  describe('generateAnimations', () => {
    it('should generate complete animation tokens with keyframes', () => {
      const tokens = generateAnimations(true);

      expect(tokens.length).toBeGreaterThan(20); // Should include experimental animations

      // Check main animation token structure
      const fadeInToken = tokens.find((t) => t.name === 'fade-in');
      expect(fadeInToken).toBeDefined();
      expect(fadeInToken?.category).toBe('animation');
      expect(fadeInToken?.namespace).toBe('animate');
      expect(fadeInToken?.generateUtilityClass).toBe(true);

      // Validate animation value structure
      const animationValue = JSON.parse(fadeInToken?.value as string);
      expect(animationValue).toHaveProperty('keyframes');
      expect(animationValue).toHaveProperty('duration');
      expect(animationValue).toHaveProperty('timingFunction');
      expect(animationValue).toHaveProperty('fillMode');
      expect(animationValue).toHaveProperty('iterationCount');
    });

    it('should generate core animation set without experimental', () => {
      const tokens = generateAnimations(false);
      const coreAnimations = [
        'fade-in',
        'fade-out',
        'scale-in',
        'scale-out',
        'slide-up',
        'slide-down',
        'slide-left',
        'slide-right',
        'spin',
        'pulse',
        'bounce',
        'wiggle',
      ];

      const animationTokens = tokens.filter((t) => t.category === 'animation');
      expect(animationTokens.length).toBe(coreAnimations.length);

      for (const animation of coreAnimations) {
        const token = animationTokens.find((t) => t.name === animation);
        expect(token).toBeDefined();
        expect(token?.semanticMeaning).toBeTruthy();
      }
    });

    it('should generate experimental animations when enabled', () => {
      const tokens = generateAnimations(true);
      const experimentalAnimations = ['heartbeat', 'float', 'glow-pulse', 'typewriter'];

      const animationTokens = tokens.filter((t) => t.category === 'animation');

      for (const animation of experimentalAnimations) {
        const token = animationTokens.find((t) => t.name === animation);
        expect(token).toBeDefined();
        expect(token?.semanticMeaning).toBeTruthy();
      }
    });

    it('should generate keyframes tokens for each animation', () => {
      const tokens = generateAnimations(true);
      const keyframeTokens = tokens.filter((t) => t.category === 'keyframes');

      expect(keyframeTokens.length).toBeGreaterThan(0);

      // Check keyframes token structure
      const fadeInKeyframes = keyframeTokens.find((t) => t.name === 'fade-in-keyframes');
      expect(fadeInKeyframes).toBeDefined();
      expect(fadeInKeyframes?.category).toBe('keyframes');
      expect(fadeInKeyframes?.namespace).toBe('keyframes');
      expect(fadeInKeyframes?.generateUtilityClass).toBe(false);

      // Validate keyframes value structure
      const keyframesValue = JSON.parse(fadeInKeyframes?.value as string);
      expect(keyframesValue).toHaveProperty('0%');
      expect(keyframesValue).toHaveProperty('100%');
    });

    it('should include proper cognitive load assessment', () => {
      const tokens = generateAnimations(true);
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      // Simple animations should have lower cognitive load
      const fadeIn = animationTokens.find((t) => t.name === 'fade-in');
      expect(fadeIn?.cognitiveLoad).toBeLessThanOrEqual(3);

      // Complex animations should have higher cognitive load
      const bounce = animationTokens.find((t) => t.name === 'bounce');
      expect(bounce?.cognitiveLoad).toBeGreaterThanOrEqual(4);
    });

    it('should include proper trust level assessment', () => {
      const tokens = generateAnimations(true);
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      // Simple animations should have low trust level
      const fadeIn = animationTokens.find((t) => t.name === 'fade-in');
      expect(fadeIn?.trustLevel).toBe('low');

      // Complex animations might have medium trust level
      const bounce = animationTokens.find((t) => t.name === 'bounce');
      expect(['low', 'medium']).toContain(bounce?.trustLevel);
    });

    it('should include proper usage context metadata', () => {
      const tokens = generateAnimations(true);
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      const fadeIn = animationTokens.find((t) => t.name === 'fade-in');
      expect(fadeIn?.usageContext).toContain('content-reveal');
      expect(fadeIn?.usageContext).toContain('modal-open');

      const spin = animationTokens.find((t) => t.name === 'spin');
      expect(spin?.usageContext).toContain('loading-spinner');
      expect(spin?.usageContext).toContain('processing');
    });

    it('should include accessibility metadata', () => {
      const tokens = generateAnimations(true);
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      for (const token of animationTokens) {
        expect(token.accessibilityLevel).toBe('AAA');
        expect(token.reducedMotionAware).toBe(true);
        expect(token.consequence).toBe('reversible');
      }
    });

    it('should validate keyframes structure for specific animations', () => {
      const tokens = generateAnimations(true);

      // Test fade-in keyframes
      const fadeInKeyframes = tokens.find((t) => t.name === 'fade-in-keyframes');
      const keyframes = JSON.parse(fadeInKeyframes?.value as string);
      expect(keyframes['0%']).toEqual({ opacity: '0' });
      expect(keyframes['100%']).toEqual({ opacity: '1' });

      // Test spin keyframes
      const spinKeyframes = tokens.find((t) => t.name === 'spin-keyframes');
      const spinKeyframesValue = JSON.parse(spinKeyframes?.value as string);
      expect(spinKeyframesValue['0%']).toEqual({ transform: 'rotate(0deg)' });
      expect(spinKeyframesValue['100%']).toEqual({ transform: 'rotate(360deg)' });
    });

    it('should include proper animation duration references', () => {
      const tokens = generateAnimations(true);
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      for (const token of animationTokens) {
        const animationValue = JSON.parse(token.value as string);
        expect(animationValue.duration).toMatch(/var\(--duration-\w+\)/);
        expect(animationValue.timingFunction).toMatch(/var\(--ease-\w+\)|linear|steps\(\d+, \w+\)/);
      }
    });

    it('should handle infinite iteration count for appropriate animations', () => {
      const tokens = generateAnimations(true);

      const spin = tokens.find((t) => t.name === 'spin' && t.category === 'animation');
      const spinValue = JSON.parse(spin?.value as string);
      expect(spinValue.iterationCount).toBe('infinite');

      const pulse = tokens.find((t) => t.name === 'pulse' && t.category === 'animation');
      const pulseValue = JSON.parse(pulse?.value as string);
      expect(pulseValue.iterationCount).toBe('infinite');
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateAnimations(true);

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);

        if (!result.success) {
          console.log('Token validation failed:', token.name, result.error.errors);
        }
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateAnimations(true);
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      for (let i = 0; i < animationTokens.length; i++) {
        expect(animationTokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning for all animations', () => {
      const tokens = generateAnimations(true);
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      for (const token of animationTokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(10);
      }
    });

    it('should generate proper wiggle animation with limited iterations', () => {
      const tokens = generateAnimations(true);

      const wiggle = tokens.find((t) => t.name === 'wiggle' && t.category === 'animation');
      expect(wiggle).toBeDefined();

      const wiggleValue = JSON.parse(wiggle?.value as string);
      expect(wiggleValue.iterationCount).toBe('3');

      const wiggleKeyframes = tokens.find((t) => t.name === 'wiggle-keyframes');
      const keyframes = JSON.parse(wiggleKeyframes?.value as string);
      expect(keyframes['0%, 100%']).toEqual({ transform: 'rotate(0deg)' });
      expect(keyframes['25%']).toEqual({ transform: 'rotate(3deg)' });
      expect(keyframes['75%']).toEqual({ transform: 'rotate(-3deg)' });
    });
  });

  describe('Error Handling', () => {
    it('should handle false includeExperimental parameter gracefully', () => {
      const tokens = generateAnimations(false);
      expect(tokens.length).toBeGreaterThan(0);

      // Should not include experimental animations
      const experimentalNames = ['heartbeat', 'float', 'glow-pulse', 'typewriter'];
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      for (const expName of experimentalNames) {
        const found = animationTokens.find((t) => t.name === expName);
        expect(found).toBeUndefined();
      }
    });

    it('should handle undefined includeExperimental parameter gracefully', () => {
      const tokens = generateAnimations();
      expect(tokens.length).toBeGreaterThan(0);

      // Should include experimental animations by default
      const experimentalNames = ['heartbeat', 'float', 'glow-pulse', 'typewriter'];
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      for (const expName of experimentalNames) {
        const found = animationTokens.find((t) => t.name === expName);
        expect(found).toBeDefined();
      }
    });
  });
});
