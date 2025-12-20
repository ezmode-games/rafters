/**
 * Deterministic Color Naming Module
 *
 * Generates unique, semantically meaningful color names from OKLCH values
 * using temperature and perceptual weight for word selection.
 *
 * @example
 * ```ts
 * import { generateColorName } from '@rafters/color-utils';
 *
 * const name = generateColorName({ l: 0.65, c: 0.12, h: 230, alpha: 1 });
 * // Returns: "dove-true-cobalt"
 * ```
 */

export { generateColorName, generateColorNameWithMetadata } from './generator.js';
export {
  BLUE_HUB,
  type ChromaBand,
  GREEN_HUB,
  getChromaBand,
  getExpandedMaterialWord,
  getLightnessBand,
  getSubIndex,
  HUE_HUBS,
  type HueCell,
  type HueHub,
  type HueMatrix,
  hasExpandedHub,
  type LightnessBand,
  RED_HUB,
} from './hue-hubs.js';
export {
  C_BUCKET_COUNT,
  getAllBuckets,
  getCBucket,
  getHBucket,
  getLBucket,
  H_BUCKET_COUNT,
  L_BUCKET_COUNT,
  TOTAL_COMBINATIONS,
} from './quantize.js';
export {
  INTENSITY_WORDS,
  type IntensityWord,
  LUMINOSITY_WORDS,
  type LuminosityWord,
  MATERIAL_WORDS,
  type MaterialWord,
} from './word-banks.js';
