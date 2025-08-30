/**
 * Transform Generator Tests
 *
 * Tests for transform token generation for animations and interactions
 */

import { describe, expect, it } from 'vitest';
import { generateTransformTokens } from '../../src/generators/transform.js';
import { TokenSchema } from '../../src/index.js';

describe('generateTransformTokens', () => {
  it('generates scale, translate, and rotate transform tokens', () => {
    const tokens = generateTransformTokens();

    expect(tokens.length).toBeGreaterThan(15); // 6 scale + 7 translate + 4 rotate

    // Check scale tokens
    const scaleTokens = tokens.filter((t) => t.category === 'scale');
    expect(scaleTokens.length).toBe(6);

    // Check translate tokens
    const translateTokens = tokens.filter((t) => t.category === 'translate');
    expect(translateTokens.length).toBe(7);

    // Check rotate tokens
    const rotateTokens = tokens.filter((t) => t.category === 'rotate');
    expect(rotateTokens.length).toBe(4);
  });

  it('generates proper scale transform values', () => {
    const tokens = generateTransformTokens();
    const scales = tokens.filter((t) => t.category === 'scale');

    const hover = scales.find((t) => t.name === 'hover');
    expect(hover?.value).toBe('1.02');

    const active = scales.find((t) => t.name === 'active');
    expect(active?.value).toBe('0.98');

    const dramatic = scales.find((t) => t.name === 'dramatic');
    expect(dramatic?.value).toBe('1.25');
  });

  it('generates proper translate transform values', () => {
    const tokens = generateTransformTokens();
    const translates = tokens.filter((t) => t.category === 'translate');

    const center = translates.find((t) => t.name === 'center');
    expect(center?.value).toBe('-50%');

    const slideUp = translates.find((t) => t.name === 'slide-up');
    expect(slideUp?.value).toBe('0, -100%');

    const slideRight = translates.find((t) => t.name === 'slide-right');
    expect(slideRight?.value).toBe('100%, 0');
  });

  it('generates proper rotate transform values', () => {
    const tokens = generateTransformTokens();
    const rotates = tokens.filter((t) => t.category === 'rotate');

    const quarter = rotates.find((t) => t.name === 'quarter');
    expect(quarter?.value).toBe('90deg');

    const half = rotates.find((t) => t.name === 'half');
    expect(half?.value).toBe('180deg');

    const threeQuarter = rotates.find((t) => t.name === 'three-quarter');
    expect(threeQuarter?.value).toBe('270deg');
  });

  it('includes proper interaction types for scale tokens', () => {
    const tokens = generateTransformTokens();

    const hover = tokens.find((t) => t.name === 'hover' && t.category === 'scale');
    expect(hover?.interactionType).toBe('hover');

    const active = tokens.find((t) => t.name === 'active' && t.category === 'scale');
    expect(active?.interactionType).toBe('active');

    const focus = tokens.find((t) => t.name === 'focus' && t.category === 'scale');
    expect(focus?.interactionType).toBe('focus');

    const disabled = tokens.find((t) => t.name === 'disabled' && t.category === 'scale');
    expect(disabled?.interactionType).toBe('disabled');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateTransformTokens();

    const hover = tokens.find((t) => t.name === 'hover' && t.category === 'scale');
    expect(hover?.semanticMeaning).toContain('Subtle hover scale');

    const slideUp = tokens.find((t) => t.name === 'slide-up');
    expect(slideUp?.semanticMeaning).toContain('Slide up animation');

    const flip = tokens.find((t) => t.name === 'flip');
    expect(flip?.semanticMeaning).toContain('Flip rotation for icons');
  });

  it('includes usage context for different transform types', () => {
    const tokens = generateTransformTokens();

    const hover = tokens.find((t) => t.name === 'hover' && t.category === 'scale');
    expect(hover?.usageContext).toContain('button-hover');
    expect(hover?.usageContext).toContain('interactive-feedback');

    const center = tokens.find((t) => t.name === 'center');
    expect(center?.usageContext).toContain('absolute-center');
    expect(center?.usageContext).toContain('modal-center');

    const flip = tokens.find((t) => t.name === 'flip');
    expect(flip?.usageContext).toContain('icon-flip');
    expect(flip?.usageContext).toContain('toggle-states');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateTransformTokens();

    const active = tokens.find((t) => t.name === 'active' && t.category === 'scale');
    expect(active?.cognitiveLoad).toBe(1); // Simple feedback

    const dramatic = tokens.find((t) => t.name === 'dramatic' && t.category === 'scale');
    expect(dramatic?.cognitiveLoad).toBe(7); // High attention impact

    const slideUp = tokens.find((t) => t.name === 'slide-up');
    expect(slideUp?.cognitiveLoad).toBe(4); // Animation complexity
  });

  it('includes proper trust levels', () => {
    const tokens = generateTransformTokens();

    const hover = tokens.find((t) => t.name === 'hover' && t.category === 'scale');
    expect(hover?.trustLevel).toBe('low'); // Safe interaction feedback

    const dramatic = tokens.find((t) => t.name === 'dramatic' && t.category === 'scale');
    expect(dramatic?.trustLevel).toBe('high'); // Needs careful use

    const emphasis = tokens.find((t) => t.name === 'emphasis' && t.category === 'scale');
    expect(emphasis?.trustLevel).toBe('medium'); // Moderate impact
  });

  it('validates all transform tokens pass schema validation', () => {
    const tokens = generateTransformTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateTransformTokens();

    const hover = tokens.find((t) => t.name === 'hover' && t.category === 'scale');
    expect(hover?.applicableComponents).toContain('button');
    expect(hover?.applicableComponents).toContain('card');

    const center = tokens.find((t) => t.name === 'center');
    expect(center?.applicableComponents).toContain('modal');
    expect(center?.applicableComponents).toContain('tooltip');

    const quarter = tokens.find((t) => t.name === 'quarter');
    expect(quarter?.applicableComponents).toContain('icon');
    expect(quarter?.applicableComponents).toContain('dropdown');
  });

  it('has proper namespaces for different transform types', () => {
    const tokens = generateTransformTokens();

    const scales = tokens.filter((t) => t.category === 'scale');
    for (const scale of scales) {
      expect(scale.namespace).toBe('scale');
    }

    const translates = tokens.filter((t) => t.category === 'translate');
    for (const translate of translates) {
      expect(translate.namespace).toBe('translate');
    }

    const rotates = tokens.filter((t) => t.category === 'rotate');
    for (const rotate of rotates) {
      expect(rotate.namespace).toBe('rotate');
    }
  });
});
