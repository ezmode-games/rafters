import { describe, expect, it } from 'vitest';
import { calcPlugin, TokenGraph } from '../../src/index.js';

describe('calcPlugin', () => {
  it('declares dependency on every token in the tokens list', () => {
    expect(calcPlugin.dependsOn({ expression: '{a} + {b}', tokens: ['a', 'b'] })).toEqual([
      'a',
      'b',
    ]);
  });

  it('substitutes token values and evaluates', () => {
    const g = new TokenGraph([calcPlugin]);
    g.seed('base', '4');
    g.bind('result', 'calc', { expression: '{base} * 2', tokens: ['base'] });
    expect(g.get('result')).toBe('8');
  });

  it('preserves the unit of the first token with a unit', () => {
    const g = new TokenGraph([calcPlugin]);
    g.seed('base', '16px');
    g.bind('result', 'calc', { expression: '{base} * 2', tokens: ['base'] });
    expect(g.get('result')).toBe('32px');
  });

  it('detects unit from literal in the expression when no token has one', () => {
    const g = new TokenGraph([calcPlugin]);
    g.seed('factor', '3');
    g.bind('result', 'calc', { expression: '{factor} * 4rem', tokens: ['factor'] });
    expect(g.get('result')).toBe('12rem');
  });

  it('cascades when a referenced token changes', () => {
    const g = new TokenGraph([calcPlugin]);
    g.seed('base', '8');
    g.bind('doubled', 'calc', { expression: '{base} * 2', tokens: ['base'] });
    expect(g.get('doubled')).toBe('16');
    g.set('base', '20', { reason: 'cascade test' });
    expect(g.get('doubled')).toBe('40');
  });

  it('throws when a referenced token is non-numeric', () => {
    const g = new TokenGraph([calcPlugin]);
    g.seed('base', 'not-a-number');
    expect(() => g.bind('result', 'calc', { expression: '{base} * 2', tokens: ['base'] })).toThrow(
      /not numeric/,
    );
  });

  it('throws when a referenced token is not a string', () => {
    const g = new TokenGraph([calcPlugin]);
    g.seed('base', 42);
    expect(() => g.bind('result', 'calc', { expression: '{base} * 2', tokens: ['base'] })).toThrow(
      /not a string/,
    );
  });
});
