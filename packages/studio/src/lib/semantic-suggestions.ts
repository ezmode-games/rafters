/**
 * Semantic Color Suggestions
 *
 * Generates 3 color suggestions for each of the 9 semantic intents
 * based on the designer's primary color. Uses color theory:
 * - danger/success/warning/info: conventional hues adjusted to primary's chroma/lightness
 * - secondary: hue rotation from primary
 * - muted: desaturated primary
 * - accent: complementary or triadic relationship
 * - background: near-white tinted with primary hue
 * - foreground: near-black tinted with primary hue
 */

import type { SemanticIntent } from '../types';
import type { OKLCH } from '../utils/color-conversion';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function round3(v: number): number {
  return Math.round(v * 1000) / 1000;
}

function oklch(l: number, c: number, h: number): OKLCH {
  return {
    l: round3(clamp(l, 0, 1)),
    c: round3(clamp(c, 0, 0.4)),
    h: round3(((h % 360) + 360) % 360),
  };
}

/**
 * Generate 3 color suggestions for a given semantic intent,
 * derived from the designer's primary color.
 */
export function generateSemanticSuggestions(intent: SemanticIntent, primary: OKLCH): OKLCH[] {
  const { l: pl, c: pc, h: ph } = primary;

  switch (intent) {
    // Conventional semantics: fixed hue ranges, adapted lightness/chroma
    case 'destructive':
      return [
        oklch(clamp(pl + 0.1, 0.55, 0.7), Math.min(0.25, pc * 1.2), 15),
        oklch(clamp(pl + 0.15, 0.6, 0.75), Math.min(0.22, pc * 1.1), 25),
        oklch(clamp(pl + 0.05, 0.5, 0.65), Math.min(0.23, pc * 1.15), 5),
      ];

    case 'success':
      return [
        oklch(clamp(pl + 0.15, 0.6, 0.75), Math.min(0.2, pc * 0.9), 135),
        oklch(clamp(pl + 0.1, 0.55, 0.7), Math.min(0.22, pc), 145),
        oklch(clamp(pl + 0.2, 0.65, 0.8), Math.min(0.24, pc * 1.1), 125),
      ];

    case 'warning':
      return [
        oklch(clamp(pl + 0.15, 0.7, 0.8), Math.min(0.2, pc * 0.95), 45),
        oklch(clamp(pl + 0.2, 0.75, 0.85), Math.min(0.18, pc * 0.9), 55),
        oklch(clamp(pl + 0.17, 0.72, 0.82), Math.min(0.19, pc * 0.92), 35),
      ];

    case 'info':
      return [
        oklch(clamp(pl + 0.1, 0.55, 0.7), Math.min(0.18, pc * 0.85), 230),
        oklch(clamp(pl + 0.15, 0.6, 0.75), Math.min(0.16, pc * 0.8), 220),
        oklch(clamp(pl + 0.05, 0.5, 0.65), Math.min(0.2, pc * 0.9), 240),
      ];

    // Relational semantics: derived from primary
    case 'secondary':
      return [
        oklch(pl, pc * 0.8, ph + 30),
        oklch(pl + 0.05, pc * 0.7, ph + 45),
        oklch(pl - 0.05, pc * 0.9, ph + 20),
      ];

    case 'muted':
      return [
        oklch(pl + 0.1, pc * 0.15, ph),
        oklch(pl + 0.15, pc * 0.1, ph),
        oklch(pl + 0.05, pc * 0.2, ph + 10),
      ];

    case 'accent':
      return [
        oklch(pl, pc * 1.1, ph + 180), // Complementary
        oklch(pl + 0.05, pc, ph + 120), // Triadic
        oklch(pl - 0.05, pc * 1.2, ph + 150), // Split complementary
      ];

    case 'background':
      return [
        oklch(0.98, 0.005, ph),
        oklch(0.96, 0.01, ph),
        oklch(0.99, 0, 0), // Pure white
      ];

    case 'foreground':
      return [
        oklch(0.15, 0.01, ph),
        oklch(0.1, 0.005, ph),
        oklch(0.05, 0, 0), // Near black
      ];

    default:
      return [oklch(0.5, 0.15, 0), oklch(0.55, 0.12, 0), oklch(0.45, 0.18, 0)];
  }
}
