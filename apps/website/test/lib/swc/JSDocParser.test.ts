/**
 * JSDoc Intelligence Parser Test Suite
 *
 * Comprehensive tests for the JSDocIntelligenceParser class covering
 * all JSDoc patterns, error handling, and performance requirements.
 */

import { describe, expect, test } from 'vitest';
import { JSDocIntelligenceParser } from '../../../src/lib/swc/JSDocParser';

describe('JSDocIntelligenceParser', () => {
  const parser = new JSDocIntelligenceParser();

  describe('Basic Intelligence Extraction', () => {
    test('extracts cognitive load with numeric format', () => {
      const buttonSource = `
/**
 * @cognitive-load 3/10 - Simple action trigger
 * @attention-economics Primary variant commands highest attention
 */
export function Button() { return <button />; }
`;

      const intelligence = parser.parseIntelligence(buttonSource);
      expect(intelligence?.cognitiveLoad).toBe(3);
      expect(intelligence?.attentionEconomics).toContain('Primary variant');
    });

    test('extracts all standard tags', () => {
      const source = `
/**
 * @cognitive-load 5/10 - Complex interactions
 * @attention-economics Use primary sparingly for main actions
 * @trust-building Destructive actions require confirmation
 * @accessibility WCAG AAA compliant with proper ARIA
 * @semantic-meaning primary=main, secondary=supporting
 */
export function Component() { return <div />; }
`;

      const intelligence = parser.parseIntelligence(source);
      expect(intelligence).toBeTruthy();
      expect(intelligence?.cognitiveLoad).toBe(5);
      expect(intelligence?.attentionEconomics).toBe('Use primary sparingly for main actions');
      expect(intelligence?.trustBuilding).toBe('Destructive actions require confirmation');
      expect(intelligence?.accessibility).toBe('WCAG AAA compliant with proper ARIA');
      expect(intelligence?.semanticMeaning).toBe('primary=main, secondary=supporting');
    });
  });

  describe('Usage Patterns Parsing', () => {
    test('parses multiline usage patterns with DO/NEVER format', () => {
      const patternsSource = `
/**
 * @usage-patterns
 * DO: Primary: Main user goal, maximum 1 per section
 * DO: Secondary: Alternative paths
 * NEVER: Multiple primary buttons competing
 */
export function Button() { return <button />; }
`;

      const patterns = parser.parseIntelligence(patternsSource);
      expect(patterns?.usagePatterns.dos).toHaveLength(2);
      expect(patterns?.usagePatterns.nevers).toHaveLength(1);
      expect(patterns?.usagePatterns.dos[0]).toBe('Primary: Main user goal, maximum 1 per section');
      expect(patterns?.usagePatterns.dos[1]).toBe('Secondary: Alternative paths');
      expect(patterns?.usagePatterns.nevers[0]).toBe('Multiple primary buttons competing');
    });

    test('handles complex usage patterns with JSDoc formatting', () => {
      const complexSource = `
/**
 * @usage-patterns
 * DO: Primary: Main user goal, maximum 1 per section
 * DO: Secondary: Alternative paths, supporting actions
 * DO: Destructive: Permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 * NEVER: Destructive actions without proper safeguards
 */
export function Button() { return <button />; }
`;

      const intelligence = parser.parseIntelligence(complexSource);
      expect(intelligence?.usagePatterns.dos).toHaveLength(3);
      expect(intelligence?.usagePatterns.nevers).toHaveLength(2);
      expect(intelligence?.usagePatterns.dos[2]).toBe(
        'Destructive: Permanent actions, requires confirmation patterns'
      );
      expect(intelligence?.usagePatterns.nevers[1]).toBe(
        'Destructive actions without proper safeguards'
      );
    });
  });

  describe('Design Guides Parsing', () => {
    test('parses design guides with name:url format', () => {
      const guidesSource = `
/**
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 */
export function Button() { return <button />; }
`;

      const guides = parser.parseIntelligence(guidesSource);
      expect(guides?.designGuides).toHaveLength(2);
      expect(guides?.designGuides[0]).toEqual({
        name: 'Attention Economics',
        url: 'https://rafters.realhandy.tech/docs/llm/attention-economics',
      });
      expect(guides?.designGuides[1]).toEqual({
        name: 'Trust Building',
        url: 'https://rafters.realhandy.tech/docs/llm/trust-building',
      });
    });

    test('handles design guides with varied formatting', () => {
      const variedSource = `
/**
 * @design-guides
 * - Component Patterns: https://rafters.realhandy.tech/docs/llm/component-patterns
 * - Accessibility Guidelines: https://rafters.realhandy.tech/docs/accessibility
 * - Design System Rules: https://example.com/design-system
 */
export function Component() { return <div />; }
`;

      const intelligence = parser.parseIntelligence(variedSource);
      expect(intelligence?.designGuides).toHaveLength(3);
      expect(intelligence?.designGuides[2]).toEqual({
        name: 'Design System Rules',
        url: 'https://example.com/design-system',
      });
    });
  });

  describe('Examples Parsing', () => {
    test('extracts example code blocks with TSX syntax', () => {
      const exampleSource = `
/**
 * @example
 * \`\`\`tsx
 * <Button variant="primary">Save Changes</Button>
 * <Button variant="destructive" destructiveConfirm>Delete Account</Button>
 * \`\`\`
 */
export function Button() { return <button />; }
`;

      const examples = parser.parseIntelligence(exampleSource);
      expect(examples?.examples).toHaveLength(1);
      expect(examples?.examples[0].code).toContain(
        '<Button variant="primary">Save Changes</Button>'
      );
      expect(examples?.examples[0].code).toContain(
        '<Button variant="destructive" destructiveConfirm>Delete Account</Button>'
      );
    });

    test('handles multiple example blocks', () => {
      const multiExampleSource = `
/**
 * @example
 * \`\`\`tsx
 * <Button variant="primary">Primary Action</Button>
 * \`\`\`
 * 
 * @example
 * \`\`\`tsx
 * <Button variant="secondary">Secondary Action</Button>
 * \`\`\`
 */
export function Button() { return <button />; }
`;

      const intelligence = parser.parseIntelligence(multiExampleSource);
      expect(intelligence?.examples).toHaveLength(2);
      expect(intelligence?.examples[0].code).toBe(
        '<Button variant="primary">Primary Action</Button>'
      );
      expect(intelligence?.examples[1].code).toBe(
        '<Button variant="secondary">Secondary Action</Button>'
      );
    });

    test('handles examples without language specification', () => {
      const plainExampleSource = `
/**
 * @example
 * \`\`\`
 * <Button>Click Me</Button>
 * \`\`\`
 */
export function Button() { return <button />; }
`;

      const intelligence = parser.parseIntelligence(plainExampleSource);
      expect(intelligence?.examples).toHaveLength(1);
      expect(intelligence?.examples[0].code).toBe('<Button>Click Me</Button>');
    });
  });

  describe('Real Component Integration', () => {
    test('parses actual Button component JSDoc', () => {
      // Using the actual Button component JSDoc as seen in the repository
      const realButtonSource = `
/**
 * Interactive button component for user actions
 *
 * @registry-name button
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Button.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Size hierarchy: sm=tertiary actions, md=secondary interactions, lg=primary calls-to-action. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trust-building Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semantic-meaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usage-patterns
 * DO: Primary: Main user goal, maximum 1 per section
 * DO: Secondary: Alternative paths, supporting actions
 * DO: Destructive: Permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Component Patterns: https://rafters.realhandy.tech/docs/llm/component-patterns
 *
 * @dependencies @radix-ui/react-slot
 *
 * @example
 * \`\`\`tsx
 * // Primary action - highest attention, use once per section
 * <Button variant="primary">Save Changes</Button>
 *
 * // Destructive action - requires confirmation UX
 * <Button variant="destructive" destructiveConfirm>Delete Account</Button>
 *
 * // Loading state - prevents double submission
 * <Button loading>Processing...</Button>
 * \`\`\`
 */
export function Button() { return <button />; }
`;

      const intelligence = parser.parseIntelligence(realButtonSource);
      expect(intelligence).toBeTruthy();
      expect(intelligence?.cognitiveLoad).toBe(3);
      expect(intelligence?.attentionEconomics).toContain('Size hierarchy');
      expect(intelligence?.trustBuilding).toContain(
        'Destructive actions require confirmation patterns'
      );
      expect(intelligence?.accessibility).toContain('WCAG AAA compliant');
      expect(intelligence?.semanticMeaning).toContain('Variant mapping');

      expect(intelligence?.usagePatterns.dos).toHaveLength(3);
      expect(intelligence?.usagePatterns.nevers).toHaveLength(1);

      expect(intelligence?.designGuides).toHaveLength(3);
      expect(intelligence?.designGuides[0].name).toBe('Attention Economics');

      expect(intelligence?.examples).toHaveLength(1);
      expect(intelligence?.examples[0].code).toContain('Primary action - highest attention');
    });
  });

  describe('Error Handling', () => {
    test('returns null for files without JSDoc comments', () => {
      const noJSDoc = 'export function Button() { return <button />; }';
      expect(parser.parseIntelligence(noJSDoc)).toBeNull();
    });

    test('returns null for JSDoc comments without Rafters intelligence tags', () => {
      const noIntelligence = `
/**
 * Regular JSDoc comment
 * @param props The component props
 * @returns JSX element
 */
export function Button() { return <button />; }
`;
      expect(parser.parseIntelligence(noIntelligence)).toBeNull();
    });

    test('handles malformed JSDoc gracefully', () => {
      const malformed = '/** @cognitive-load invalid */ export function Button() {}';
      expect(parser.parseIntelligence(malformed)).toBeNull();
    });

    test('handles incomplete JSDoc blocks gracefully', () => {
      const incomplete = `
/**
 * @cognitive-load 3/10
 * Missing closing comment
export function Button() { return <button />; }
`;
      expect(parser.parseIntelligence(incomplete)).toBeNull();
    });

    test('handles edge cases in cognitive load parsing', () => {
      const edgeCases = [
        '/** @cognitive-load abc */ export function Button() {}', // Non-numeric
        '/** @cognitive-load */ export function Button() {}', // Empty
        '/** @cognitive-load 15 */ export function Button() {}', // No description
      ];

      for (const source of edgeCases) {
        const result = parser.parseIntelligence(source);
        // Should either be null or have cognitiveLoad of 0 or parsed number
        if (result) {
          expect(typeof result.cognitiveLoad).toBe('number');
        }
      }
    });
  });

  describe('Performance Requirements', () => {
    test('parses typical component JSDoc in under 10ms', () => {
      const typicalSource = `
/**
 * @cognitive-load 3/10 - Simple action trigger
 * @attention-economics Primary variant commands highest attention
 * @trust-building Destructive actions require confirmation patterns
 * @accessibility WCAG AAA compliant with proper ARIA
 * @semantic-meaning primary=main actions, secondary=supporting
 * 
 * @usage-patterns
 * DO: Primary: Main user goal, maximum 1 per section
 * DO: Secondary: Alternative paths
 * NEVER: Multiple primary buttons competing
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 *
 * @example
 * \`\`\`tsx
 * <Button variant="primary">Save Changes</Button>
 * \`\`\`
 */
export function Button() { return <button />; }
`;

      const start = performance.now();
      const intelligence = parser.parseIntelligence(typicalSource);
      const end = performance.now();

      expect(intelligence).toBeTruthy();
      expect(end - start).toBeLessThan(10);
    });

    test('handles large files efficiently', () => {
      // Create a large source file with the JSDoc at the top
      const largeFileContent = 'const dummy = "x".repeat(1000);\\n'.repeat(1000);
      const largeSource = `
/**
 * @cognitive-load 4/10 - Complex component
 * @attention-economics Careful attention management required
 */
${largeFileContent}
export function LargeComponent() { return <div />; }
`;

      const start = performance.now();
      const intelligence = parser.parseIntelligence(largeSource);
      const end = performance.now();

      expect(intelligence).toBeTruthy();
      expect(intelligence?.cognitiveLoad).toBe(4);
      expect(end - start).toBeLessThan(50); // Allow more time for large files
    });
  });

  describe('Edge Cases and Robustness', () => {
    test('handles JSDoc with no closing comment', () => {
      const unclosed = '/** @cognitive-load 3/10 \\n export function Button() {}';
      expect(parser.parseIntelligence(unclosed)).toBeNull();
    });

    test('handles multiple JSDoc blocks (uses first one)', () => {
      const multipleBlocks = `
/**
 * @cognitive-load 3/10 - First block
 */
/**
 * @cognitive-load 5/10 - Second block
 */
export function Button() { return <button />; }
`;
      const intelligence = parser.parseIntelligence(multipleBlocks);
      expect(intelligence?.cognitiveLoad).toBe(3);
    });

    test('handles empty strings and whitespace-only content', () => {
      expect(parser.parseIntelligence('')).toBeNull();
      expect(parser.parseIntelligence('   \\n\\t  ')).toBeNull();
      expect(parser.parseIntelligence('/* regular comment */')).toBeNull();
    });

    test('parses JSDoc with extra whitespace and formatting', () => {
      const messyFormatting = `
      /**
       *     @cognitive-load    5/10   -   Complex formatting test   
       *     @attention-economics      Lots of extra spacing    
       * 
       * @usage-patterns
       *    DO:   Extra   spaces  :   Test pattern   
       *    NEVER:  Another  test  pattern  
       * 
       * @design-guides  
       *   -   Spaced Name   :   https://example.com/spaced   
       */
export function SpacedComponent() { return <div />; }
`;

      const intelligence = parser.parseIntelligence(messyFormatting);
      expect(intelligence).toBeTruthy();
      expect(intelligence?.cognitiveLoad).toBe(5);
      expect(intelligence?.attentionEconomics.trim()).toBe('Lots of extra spacing');
      expect(intelligence?.usagePatterns.dos[0].trim()).toBe('Extra   spaces  :   Test pattern');
      expect(intelligence?.designGuides[0].name.trim()).toBe('Spaced Name');
    });
  });
});
