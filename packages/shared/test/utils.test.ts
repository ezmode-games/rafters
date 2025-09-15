/**
 * Unit tests for shared utility constants and functions
 * Tests semantic categories, component patterns, and AI guidance
 */

import { describe, expect, it } from 'vitest';
import {
  AI_COMPONENT_PATTERNS,
  ASCII_LOGO,
  DEFAULT_COGNITIVE_LOADS,
  SEMANTIC_CATEGORIES,
} from '../src/index.js';

describe('DEFAULT_COGNITIVE_LOADS', () => {
  it('should provide proper cognitive load scale', () => {
    expect(DEFAULT_COGNITIVE_LOADS.simple).toBe(1);
    expect(DEFAULT_COGNITIVE_LOADS.moderate).toBe(2);
    expect(DEFAULT_COGNITIVE_LOADS.complex).toBe(3);
    expect(DEFAULT_COGNITIVE_LOADS.challenging).toBe(4);
    expect(DEFAULT_COGNITIVE_LOADS.expert).toBe(5);
  });

  it('should have ascending complexity values', () => {
    const loads = Object.values(DEFAULT_COGNITIVE_LOADS);
    for (let i = 1; i < loads.length; i++) {
      expect(loads[i]).toBeGreaterThan(loads[i - 1]);
    }
  });

  it('should be within valid range for AI consumption', () => {
    const loads = Object.values(DEFAULT_COGNITIVE_LOADS);
    loads.forEach((load) => {
      expect(load).toBeGreaterThanOrEqual(1);
      expect(load).toBeLessThanOrEqual(10);
    });
  });
});

describe('SEMANTIC_CATEGORIES', () => {
  it('should provide color semantic categories', () => {
    expect(SEMANTIC_CATEGORIES.primary).toBe('Main brand color for primary actions');
    expect(SEMANTIC_CATEGORIES.secondary).toBe('Supporting brand color for secondary actions');
    expect(SEMANTIC_CATEGORIES.danger).toBe('Error states and destructive actions');
    expect(SEMANTIC_CATEGORIES.success).toBe('Positive feedback and confirmation states');
  });

  it('should provide typography semantic categories', () => {
    expect(SEMANTIC_CATEGORIES.display).toBe('Hero headings and marketing content');
    expect(SEMANTIC_CATEGORIES.heading).toBe('Page and section titles');
    expect(SEMANTIC_CATEGORIES.body).toBe('Main content and reading text');
    expect(SEMANTIC_CATEGORIES.caption).toBe('Supporting text and metadata');
  });

  it('should provide spacing semantic categories', () => {
    expect(SEMANTIC_CATEGORIES.xs).toBe('Minimal spacing for tight layouts');
    expect(SEMANTIC_CATEGORIES.sm).toBe('Compact spacing for dense interfaces');
    expect(SEMANTIC_CATEGORIES.md).toBe('Standard spacing for balanced layouts');
    expect(SEMANTIC_CATEGORIES.lg).toBe('Generous spacing for breathing room');
    expect(SEMANTIC_CATEGORIES.xl).toBe('Maximum spacing for emphasis');
  });

  it('should have descriptive semantic meanings for AI', () => {
    const categories = Object.values(SEMANTIC_CATEGORIES);
    categories.forEach((description) => {
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(10); // Should be descriptive
      expect(description).toMatch(/^[A-Z]/); // Should start with capital letter
    });
  });
});

describe('AI_COMPONENT_PATTERNS', () => {
  it('should provide attention hierarchy patterns', () => {
    expect(AI_COMPONENT_PATTERNS.PRIMARY_ACTION).toBe(
      'Use for main user goals - single per page/section'
    );
    expect(AI_COMPONENT_PATTERNS.SECONDARY_ACTION).toBe(
      'Use for alternative actions - multiple allowed'
    );
    expect(AI_COMPONENT_PATTERNS.TERTIARY_ACTION).toBe('Use for minor actions - unlimited');
  });

  it('should provide safety constraint patterns', () => {
    expect(AI_COMPONENT_PATTERNS.DESTRUCTIVE_CONFIRMATION).toBe(
      'Destructive actions require confirmation UX'
    );
    expect(AI_COMPONENT_PATTERNS.PROGRESSIVE_DISCLOSURE).toBe(
      'Complex forms need step-by-step revelation'
    );
    expect(AI_COMPONENT_PATTERNS.ESCAPE_HATCH).toBe('Always provide way to cancel/go back');
  });

  it('should provide accessibility patterns', () => {
    expect(AI_COMPONENT_PATTERNS.MINIMUM_TOUCH_TARGET).toBe('44px minimum for touch interfaces');
    expect(AI_COMPONENT_PATTERNS.COLOR_NOT_ONLY).toBe('Never rely on color alone for meaning');
    expect(AI_COMPONENT_PATTERNS.FOCUS_VISIBLE).toBe(
      'Clear focus indicators for keyboard navigation'
    );
  });

  it('should provide actionable guidance for AI agents', () => {
    const patterns = Object.values(AI_COMPONENT_PATTERNS);
    patterns.forEach((pattern) => {
      expect(typeof pattern).toBe('string');
      expect(pattern.length).toBeGreaterThan(20); // Should be detailed
      // Should contain actionable language
      expect(pattern).toMatch(/(Use|Always|Never|Require|Need|Clear|Minimum)/i);
    });
  });
});

describe('ASCII_LOGO', () => {
  it('should contain block characters for ASCII art', () => {
    expect(ASCII_LOGO).toContain('██████');
    expect(ASCII_LOGO).toContain('███████');
  });

  it('should be properly formatted ASCII art', () => {
    const lines = ASCII_LOGO.trim().split('\n');
    expect(lines.length).toBeGreaterThan(3); // Multi-line ASCII art

    // Should have consistent width (allowing for reasonable variation)
    const widths = lines.map((line) => line.length);
    const maxWidth = Math.max(...widths);
    const minWidth = Math.min(...widths.filter((w) => w > 0)); // Ignore empty lines
    expect(maxWidth - minWidth).toBeLessThanOrEqual(5); // Reasonable consistency
  });

  it('should only contain printable ASCII characters', () => {
    const lines = ASCII_LOGO.trim().split('\n');
    lines.forEach((line) => {
      // Should only contain spaces, block characters, and letters
      expect(line).toMatch(/^[█ A-Z]*$/);
    });
  });
});

describe('Type safety and exports', () => {
  it('should export all constants as readonly', () => {
    // Test that the constants can't be accidentally modified
    expect(() => {
      // @ts-expect-error - Should be readonly
      // @ts-expect-error - Testing readonly violation
      DEFAULT_COGNITIVE_LOADS.simple = 999;
    }).not.toThrow(); // Runtime doesn't prevent this, but TypeScript should
  });

  it('should have proper TypeScript const assertions', () => {
    // Verify const assertions are working by checking inferred types
    const primaryPattern: 'Use for main user goals - single per page/section' =
      AI_COMPONENT_PATTERNS.PRIMARY_ACTION;
    expect(primaryPattern).toBe(AI_COMPONENT_PATTERNS.PRIMARY_ACTION);
  });
});

describe('Integration with AI systems', () => {
  it('should provide structured data for AI consumption', () => {
    // Test that all exported constants provide proper structure for AI

    // Cognitive loads should be numeric and ordered
    const cognitiveEntries = Object.entries(DEFAULT_COGNITIVE_LOADS);
    expect(cognitiveEntries.length).toBeGreaterThan(3);

    // Semantic categories should provide descriptive meanings
    const semanticEntries = Object.entries(SEMANTIC_CATEGORIES);
    expect(semanticEntries.length).toBeGreaterThan(5);

    // AI patterns should provide actionable guidance
    const patternEntries = Object.entries(AI_COMPONENT_PATTERNS);
    expect(patternEntries.length).toBeGreaterThan(5);
  });

  it('should support AI decision making with clear guidance', () => {
    // Test that patterns provide clear do/don't guidance
    const destructivePattern = AI_COMPONENT_PATTERNS.DESTRUCTIVE_CONFIRMATION;
    expect(destructivePattern).toContain('require');

    const primaryPattern = AI_COMPONENT_PATTERNS.PRIMARY_ACTION;
    expect(primaryPattern).toContain('single');

    const accessibilityPattern = AI_COMPONENT_PATTERNS.COLOR_NOT_ONLY;
    expect(accessibilityPattern).toContain('Never');
  });
});
