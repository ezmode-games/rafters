/**
 * Aspect Ratio Generator Tests
 *
 * Tests for aspect ratio token generation for media and layout
 */

import { describe, expect, it } from 'vitest';
import { generateAspectRatioTokens } from '../../src/generators/aspect-ratio.js';
import { TokenSchema } from '../../src/index.js';

describe('generateAspectRatioTokens', () => {
  it('generates aspect ratio tokens for media and layout', () => {
    const tokens = generateAspectRatioTokens();

    expect(tokens.length).toBe(7); // square, video, photo, golden, portrait, landscape, ultrawide

    // Check square
    const square = tokens.find((t) => t.name === 'square');
    expect(square).toBeDefined();
    expect(square?.value).toBe('1 / 1');

    // Check video
    const video = tokens.find((t) => t.name === 'video');
    expect(video).toBeDefined();
    expect(video?.value).toBe('16 / 9');

    // Check golden ratio
    const golden = tokens.find((t) => t.name === 'golden');
    expect(golden).toBeDefined();
    expect(golden?.value).toBe('1.618 / 1');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateAspectRatioTokens();

    const square = tokens.find((t) => t.name === 'square');
    expect(square?.semanticMeaning).toContain('Square aspect ratio for avatars');

    const video = tokens.find((t) => t.name === 'video');
    expect(video?.semanticMeaning).toContain('Video aspect ratio for media');

    const golden = tokens.find((t) => t.name === 'golden');
    expect(golden?.semanticMeaning).toContain('Golden ratio for aesthetic layouts');
  });

  it('includes usage context for different aspect ratios', () => {
    const tokens = generateAspectRatioTokens();

    const square = tokens.find((t) => t.name === 'square');
    expect(square?.usageContext).toContain('avatars');
    expect(square?.usageContext).toContain('icons');
    expect(square?.usageContext).toContain('thumbnails');

    const video = tokens.find((t) => t.name === 'video');
    expect(video?.usageContext).toContain('video');
    expect(video?.usageContext).toContain('presentations');

    const ultrawide = tokens.find((t) => t.name === 'ultrawide');
    expect(ultrawide?.usageContext).toContain('cinematic');
    expect(ultrawide?.usageContext).toContain('banner');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateAspectRatioTokens();

    const square = tokens.find((t) => t.name === 'square');
    expect(square?.cognitiveLoad).toBe(1); // Simple, familiar ratio

    const golden = tokens.find((t) => t.name === 'golden');
    expect(golden?.cognitiveLoad).toBe(4); // Aesthetic but complex

    const ultrawide = tokens.find((t) => t.name === 'ultrawide');
    expect(ultrawide?.cognitiveLoad).toBe(5); // Specialized use case
  });

  it('includes proper trust levels', () => {
    const tokens = generateAspectRatioTokens();

    const square = tokens.find((t) => t.name === 'square');
    expect(square?.trustLevel).toBe('low'); // Safe for common use

    const video = tokens.find((t) => t.name === 'video');
    expect(video?.trustLevel).toBe('low'); // Standard media ratio

    const golden = tokens.find((t) => t.name === 'golden');
    expect(golden?.trustLevel).toBe('medium'); // Requires design consideration

    const ultrawide = tokens.find((t) => t.name === 'ultrawide');
    expect(ultrawide?.trustLevel).toBe('medium'); // Specialized ratio
  });

  it('validates all aspect ratio tokens pass schema validation', () => {
    const tokens = generateAspectRatioTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateAspectRatioTokens();

    const video = tokens.find((t) => t.name === 'video');
    expect(video?.applicableComponents).toContain('video');
    expect(video?.applicableComponents).toContain('iframe');
    expect(video?.applicableComponents).toContain('embed');

    const square = tokens.find((t) => t.name === 'square');
    expect(square?.applicableComponents).toContain('avatar');
    expect(square?.applicableComponents).toContain('icon');

    const photo = tokens.find((t) => t.name === 'photo');
    expect(photo?.applicableComponents).toContain('img');
    expect(photo?.applicableComponents).toContain('figure');
  });

  it('has proper namespace and category', () => {
    const tokens = generateAspectRatioTokens();

    for (const token of tokens) {
      expect(token.namespace).toBe('aspect');
      expect(token.category).toBe('aspect-ratio');
      expect(token.generateUtilityClass).toBe(true);
    }
  });
});
