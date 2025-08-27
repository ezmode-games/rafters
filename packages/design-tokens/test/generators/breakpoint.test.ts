/**
 * Breakpoint Generator Tests
 *
 * Tests for responsive breakpoint and container token generation
 */

import { describe, expect, it } from 'vitest';
import { generateBreakpointTokens } from '../../src/generators/breakpoint.js';
import { TokenSchema } from '../../src/index.js';

describe('generateBreakpointTokens', () => {
  it('generates breakpoint and container tokens', () => {
    const tokens = generateBreakpointTokens();

    expect(tokens.length).toBeGreaterThan(10); // 6 breakpoints + 8 containers

    // Check breakpoint tokens
    const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');
    expect(breakpointTokens).toHaveLength(6); // xs through 2xl

    // Check container tokens
    const containerTokens = tokens.filter((t) => t.category === 'container');
    expect(containerTokens).toHaveLength(8); // xs through 4xl
  });

  it('generates proper breakpoint values', () => {
    const tokens = generateBreakpointTokens();
    const breakpoints = tokens.filter((t) => t.category === 'breakpoint');

    const xs = breakpoints.find((t) => t.name === 'xs');
    expect(xs?.value).toBe('320px');

    const md = breakpoints.find((t) => t.name === 'md');
    expect(md?.value).toBe('768px');

    const xl = breakpoints.find((t) => t.name === 'xl');
    expect(xl?.value).toBe('1280px');
  });

  it('generates proper container values', () => {
    const tokens = generateBreakpointTokens();
    const containers = tokens.filter((t) => t.category === 'container');

    const sm = containers.find((t) => t.name === 'sm');
    expect(sm?.value).toBe('24rem');

    const lg = containers.find((t) => t.name === 'lg');
    expect(lg?.value).toBe('32rem');

    const xl4 = containers.find((t) => t.name === '4xl');
    expect(xl4?.value).toBe('56rem');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateBreakpointTokens();

    const xs = tokens.find((t) => t.name === 'xs' && t.category === 'breakpoint');
    expect(xs?.semanticMeaning).toContain('Extra small mobile devices');

    const lg = tokens.find((t) => t.name === 'lg' && t.category === 'breakpoint');
    expect(lg?.semanticMeaning).toContain('Large tablets and small laptops');

    const prose = tokens.find((t) => t.name === '2xl' && t.category === 'container');
    expect(prose?.semanticMeaning).toContain('Max width container');
  });

  it('includes usage context for different breakpoints', () => {
    const tokens = generateBreakpointTokens();

    const xs = tokens.find((t) => t.name === 'xs' && t.category === 'breakpoint');
    expect(xs?.usageContext).toContain('mobile-first');
    expect(xs?.usageContext).toContain('small-phones');

    const xl2 = tokens.find((t) => t.name === '2xl' && t.category === 'breakpoint');
    expect(xl2?.usageContext).toContain('ultrawide');
    expect(xl2?.usageContext).toContain('maximum-layouts');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateBreakpointTokens();

    const xs = tokens.find((t) => t.name === 'xs');
    expect(xs?.cognitiveLoad).toBe(2); // Simple mobile layout

    const xl2 = tokens.find((t) => t.name === '2xl');
    expect(xl2?.cognitiveLoad).toBeGreaterThan(5); // Complex layouts
  });

  it('includes proper trust levels', () => {
    const tokens = generateBreakpointTokens();

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.trustLevel).toBe('low'); // Safe basic breakpoint

    const xl2 = tokens.find((t) => t.name === '2xl');
    expect(xl2?.trustLevel).toBe('medium'); // Requires careful consideration
  });

  it('validates all breakpoint tokens pass schema validation', () => {
    const tokens = generateBreakpointTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper viewport and container awareness', () => {
    const tokens = generateBreakpointTokens();

    const breakpoints = tokens.filter((t) => t.category === 'breakpoint');
    for (const bp of breakpoints) {
      expect(bp.viewportAware).toBe(true);
      expect(bp.generateUtilityClass).toBe(false); // Breakpoints used differently
    }

    const containers = tokens.filter((t) => t.category === 'container');
    for (const container of containers) {
      expect(container.containerQueryAware).toBe(true);
      expect(container.generateUtilityClass).toBe(true);
    }
  });

  it('includes proper namespaces', () => {
    const tokens = generateBreakpointTokens();

    const breakpoints = tokens.filter((t) => t.category === 'breakpoint');
    for (const bp of breakpoints) {
      expect(bp.namespace).toBe('screen');
    }

    const containers = tokens.filter((t) => t.category === 'container');
    for (const container of containers) {
      expect(container.namespace).toBe('container');
    }
  });
});
