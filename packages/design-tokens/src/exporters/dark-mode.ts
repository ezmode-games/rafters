import type { OKLCH } from '@rafters/shared';

/**
 * Compute a dark-mode scale from a light scale.
 *
 * Algorithm (the design judgment, encoded once here so it can be inspected, tested,
 * and overridden by the designer when they need to):
 *
 *  1. Position-mirror — position 50 in light becomes position 950 in dark and so on.
 *     The OKLCH lightness for dark[i] is taken from light[N-1-i]. This preserves the
 *     scale's perceptual progression while inverting the brightness direction.
 *
 *  2. Chroma adjust — dark-context colors read more saturated to the eye, so chroma
 *     is reduced by ~15% to keep apparent saturation matched against the light scale.
 *
 *  3. Hue is unchanged. Hue is identity within a family.
 *
 * If a designer needs a different algorithm for a specific family (e.g. a brand with
 * a non-mirrored dark mode), they override the per-position dark token's value
 * directly. The override carries the why-gate; this function is the baseline math.
 */
export function computeDarkScale(lightScale: readonly OKLCH[]): OKLCH[] {
  const n = lightScale.length;
  const out: OKLCH[] = [];
  for (let i = 0; i < n; i++) {
    const mirror = lightScale[n - 1 - i];
    if (!mirror) continue;
    out.push({
      l: mirror.l,
      c: mirror.c * 0.85,
      h: mirror.h,
      alpha: mirror.alpha ?? 1,
    });
  }
  return out;
}
