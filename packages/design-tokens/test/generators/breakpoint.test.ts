/**
 * Breakpoint Generator Tests
 *
 * Validates breakpoint and container token structure, responsive design patterns,
 * and viewport-aware design system tokens.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateBreakpointTokens } from '../../src/generators/breakpoint.js';

describe('Breakpoint Generator', () => {
  describe('generateBreakpointTokens', () => {
    it('should generate complete breakpoint and container token sets', () => {
      const tokens = generateBreakpointTokens();

      // Should generate both breakpoints and containers
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');
      const containerTokens = tokens.filter((t) => t.category === 'container');

      expect(breakpointTokens).toHaveLength(6);
      expect(containerTokens).toHaveLength(8);
      expect(tokens).toHaveLength(14); // 6 breakpoints + 8 containers
    });

    it('should generate standard breakpoint tokens', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      const expectedBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      const tokenNames = breakpointTokens.map((t) => t.name);

      for (const breakpoint of expectedBreakpoints) {
        expect(tokenNames).toContain(breakpoint);
      }
    });

    it('should generate responsive breakpoint values', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      const expectedValues = {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      };

      for (const [name, expectedValue] of Object.entries(expectedValues)) {
        const token = breakpointTokens.find((t) => t.name === name);
        expect(token?.value).toBe(expectedValue);
      }
    });

    it('should generate container tokens with proper sizing', () => {
      const tokens = generateBreakpointTokens();
      const containerTokens = tokens.filter((t) => t.category === 'container');

      const expectedContainers = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
      const tokenNames = containerTokens.map((t) => t.name);

      for (const container of expectedContainers) {
        expect(tokenNames).toContain(container);
      }
    });

    it('should include proper breakpoint metadata', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      for (const token of breakpointTokens) {
        expect(token.category).toBe('breakpoint');
        expect(token.namespace).toBe('screen');
        expect(token.generateUtilityClass).toBe(false); // Breakpoints don't generate utilities
        expect(token.viewportAware).toBe(true);
        expect(token.consequence).toBe('significant'); // Layout changes affect entire experience
      }
    });

    it('should include proper container metadata', () => {
      const tokens = generateBreakpointTokens();
      const containerTokens = tokens.filter((t) => t.category === 'container');

      for (const token of containerTokens) {
        expect(token.category).toBe('container');
        expect(token.namespace).toBe('container');
        expect(token.generateUtilityClass).toBe(true);
        expect(token.containerQueryAware).toBe(true);
        expect(token.consequence).toBe('significant'); // Container changes affect layout
        expect(token.trustLevel).toBe('medium');
      }
    });

    it('should include cognitive load progression for breakpoints', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      // Should increase with screen size complexity
      const xs = breakpointTokens.find((t) => t.name === 'xs');
      expect(xs?.cognitiveLoad).toBe(2);

      const md = breakpointTokens.find((t) => t.name === 'md');
      expect(md?.cognitiveLoad).toBe(4);

      const xl2 = breakpointTokens.find((t) => t.name === '2xl');
      expect(xl2?.cognitiveLoad).toBe(7);
    });

    it('should include cognitive load progression for containers', () => {
      const tokens = generateBreakpointTokens();
      const containerTokens = tokens.filter((t) => t.category === 'container');

      // Should increase with container complexity
      const xs = containerTokens.find((t) => t.name === 'xs');
      expect(xs?.cognitiveLoad).toBe(2);

      const lg = containerTokens.find((t) => t.name === 'lg');
      expect(lg?.cognitiveLoad).toBe(5);

      const xl4 = containerTokens.find((t) => t.name === '4xl');
      expect(xl4?.cognitiveLoad).toBe(9);
    });

    it('should include usage context for breakpoints', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      const xs = breakpointTokens.find((t) => t.name === 'xs');
      expect(xs?.usageContext).toContain('mobile-first');
      expect(xs?.usageContext).toContain('small-phones');

      const lg = breakpointTokens.find((t) => t.name === 'lg');
      expect(lg?.usageContext).toContain('laptops');
      expect(lg?.usageContext).toContain('complex-layouts');

      const xl2 = breakpointTokens.find((t) => t.name === '2xl');
      expect(xl2?.usageContext).toContain('ultrawide');
      expect(xl2?.usageContext).toContain('large-displays');
    });

    it('should include usage context for containers', () => {
      const tokens = generateBreakpointTokens();
      const containerTokens = tokens.filter((t) => t.category === 'container');

      const sm = containerTokens.find((t) => t.name === 'sm');
      expect(sm?.usageContext).toContain('forms');
      expect(sm?.usageContext).toContain('modals');

      const xl2 = containerTokens.find((t) => t.name === '2xl');
      expect(xl2?.usageContext).toContain('reading-width');
      expect(xl2?.usageContext).toContain('optimal-line-length');

      const xl4 = containerTokens.find((t) => t.name === '4xl');
      expect(xl4?.usageContext).toContain('hero-sections');
      expect(xl4?.usageContext).toContain('maximum-content');
    });

    it('should include proper component mappings', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');
      const containerTokens = tokens.filter((t) => t.category === 'container');

      for (const token of breakpointTokens) {
        expect(token.applicableComponents).toContain('layout');
        expect(token.applicableComponents).toContain('grid');
        expect(token.applicableComponents).toContain('responsive');
      }

      for (const token of containerTokens) {
        expect(token.applicableComponents).toContain('layout');
        expect(token.applicableComponents).toContain('wrapper');
        expect(token.applicableComponents).toContain('max-width');
      }
    });

    it('should include accessibility metadata', () => {
      const tokens = generateBreakpointTokens();

      for (const token of tokens) {
        expect(token.accessibilityLevel).toBe('AAA');
      }
    });

    it('should validate against TokenSchema', () => {
      const tokens = generateBreakpointTokens();

      for (const token of tokens) {
        const result = TokenSchema.safeParse(token);
        expect(result.success).toBe(true);
      }
    });

    it('should include proper scale positions', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');
      const containerTokens = tokens.filter((t) => t.category === 'container');

      for (let i = 0; i < breakpointTokens.length; i++) {
        expect(breakpointTokens[i].scalePosition).toBe(i);
      }

      for (let i = 0; i < containerTokens.length; i++) {
        expect(containerTokens[i].scalePosition).toBe(i);
      }
    });

    it('should include semantic meaning for all tokens', () => {
      const tokens = generateBreakpointTokens();

      for (const token of tokens) {
        expect(token.semanticMeaning).toBeTruthy();
        expect(typeof token.semanticMeaning).toBe('string');
        expect(token.semanticMeaning?.length).toBeGreaterThan(10);
      }
    });

    it('should have progressive breakpoint values', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      // Extract numeric values and ensure progression
      const numericValues = breakpointTokens.map((t) => parseInt(t.value as string, 10));

      for (let i = 1; i < numericValues.length; i++) {
        expect(numericValues[i]).toBeGreaterThan(numericValues[i - 1]);
      }
    });

    it('should have progressive container values', () => {
      const tokens = generateBreakpointTokens();
      const containerTokens = tokens.filter((t) => t.category === 'container');

      // Extract numeric values (convert rem to px for comparison)
      const numericValues = containerTokens.map((t) => {
        const remValue = parseFloat(t.value as string);
        return remValue * 16; // Convert rem to px
      });

      for (let i = 1; i < numericValues.length; i++) {
        expect(numericValues[i]).toBeGreaterThan(numericValues[i - 1]);
      }
    });

    it('should have appropriate trust levels', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');
      const containerTokens = tokens.filter((t) => t.category === 'container');

      // Breakpoints should have low to medium trust levels
      for (const token of breakpointTokens) {
        expect(['low', 'medium']).toContain(token.trustLevel);
      }

      // Containers should have medium trust levels
      for (const token of containerTokens) {
        expect(token.trustLevel).toBe('medium');
      }
    });
  });

  describe('Token Structure Validation', () => {
    it('should have consistent breakpoint token structure', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      for (const token of breakpointTokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'breakpoint');
        expect(token).toHaveProperty('namespace', 'screen');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', false);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('viewportAware', true);
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel');
        expect(token).toHaveProperty('consequence', 'significant');
        expect(token).toHaveProperty('usageContext');
      }
    });

    it('should have consistent container token structure', () => {
      const tokens = generateBreakpointTokens();
      const containerTokens = tokens.filter((t) => t.category === 'container');

      for (const token of containerTokens) {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('value');
        expect(token).toHaveProperty('category', 'container');
        expect(token).toHaveProperty('namespace', 'container');
        expect(token).toHaveProperty('semanticMeaning');
        expect(token).toHaveProperty('scalePosition');
        expect(token).toHaveProperty('generateUtilityClass', true);
        expect(token).toHaveProperty('applicableComponents');
        expect(token).toHaveProperty('containerQueryAware', true);
        expect(token).toHaveProperty('accessibilityLevel', 'AAA');
        expect(token).toHaveProperty('cognitiveLoad');
        expect(token).toHaveProperty('trustLevel', 'medium');
        expect(token).toHaveProperty('consequence', 'significant');
        expect(token).toHaveProperty('usageContext');
      }
    });

    it('should have valid value formats', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');
      const containerTokens = tokens.filter((t) => t.category === 'container');

      // Breakpoint values should end with 'px'
      for (const token of breakpointTokens) {
        expect((token.value as string).endsWith('px')).toBe(true);
      }

      // Container values should end with 'rem'
      for (const token of containerTokens) {
        expect((token.value as string).endsWith('rem')).toBe(true);
      }
    });
  });

  describe('Mathematical Accuracy', () => {
    it('should have correct Tailwind breakpoint values', () => {
      const tokens = generateBreakpointTokens();
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      const expectedMapping = {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      };

      for (const [name, expectedValue] of Object.entries(expectedMapping)) {
        const token = breakpointTokens.find((t) => t.name === name);
        expect(token?.value).toBe(expectedValue);
      }
    });

    it('should have reasonable container size progression', () => {
      const tokens = generateBreakpointTokens();
      const containerTokens = tokens.filter((t) => t.category === 'container');

      const expectedMapping = {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
      };

      for (const [name, expectedValue] of Object.entries(expectedMapping)) {
        const token = containerTokens.find((t) => t.name === name);
        expect(token?.value).toBe(expectedValue);
      }
    });
  });
});
