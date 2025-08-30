/**
 * Design Token Generator Tests - Legacy Import Support
 *
 * This file maintains backward compatibility for tests that import from the main index.
 * Individual generator tests have been moved to ./generators/ folder.
 */

import { describe, expect, it } from 'vitest';
import {
  TokenSchema,
  generateDepthScale,
  generateHeightScale,
  generateSpacingScale,
  generateTypographyScale,
} from '../src/index.js';

describe('Legacy import compatibility', () => {
  it('generators are still accessible from main index', () => {
    expect(generateSpacingScale).toBeDefined();
    expect(generateDepthScale).toBeDefined();
    expect(generateHeightScale).toBeDefined();
    expect(generateTypographyScale).toBeDefined();
  });

  it('basic functionality still works through main index', () => {
    const tokens = generateSpacingScale('linear', 4, 1.25, 2, false);
    expect(tokens.length).toBeGreaterThan(0);

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });
});
