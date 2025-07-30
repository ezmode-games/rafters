/**
 * Descriptive color naming system
 * Generates poetic, evocative names for colors based on their OKLCH properties
 */

import type { OKLCH } from '@rafters/shared';

// Color name database organized by hue family and characteristics
const COLOR_NAMES = {
  red: {
    light: ['Rose Quartz', 'Blush', 'Coral Dawn', 'Peach Whisper', 'Salmon Mist'],
    vibrant: ['Crimson Fire', 'Ruby Flame', 'Cherry Burst', 'Scarlet Dream', 'Cardinal Wing'],
    muted: ['Brick Dust', 'Rust Patina', 'Clay Earth', 'Burgundy Shadow', 'Wine Stain'],
    dark: ['Midnight Cherry', 'Deep Garnet', 'Blood Moon', 'Mahogany Depth', 'Dark Berry'],
  },
  orange: {
    light: ['Apricot Glow', 'Peach Cream', 'Sunset Mist', 'Amber Light', 'Citrus Bloom'],
    vibrant: ['Tangerine Burst', 'Sunset Flame', 'Marigold Fire', 'Pumpkin Spice', 'Autumn Blaze'],
    muted: ['Terracotta', 'Burnt Sienna', 'Rust Canyon', 'Copper Patina', 'Clay Pot'],
    dark: ['Burnt Umber', 'Chocolate Earth', 'Coffee Bean', 'Espresso Shadow', 'Bronze Depth'],
  },
  yellow: {
    light: ['Lemon Zest', 'Butter Cream', 'Vanilla Bean', 'Champagne Fizz', 'Golden Mist'],
    vibrant: ['Sunflower Gold', 'Canary Song', 'Lightning Strike', 'Citrus Burst', 'Honey Glow'],
    muted: ['Mustard Seed', 'Olive Branch', 'Wheat Field', 'Antique Gold', 'Amber Honey'],
    dark: ['Golden Shadow', 'Brass Tarnish', 'Caramel Depth', 'Burnt Gold', 'Ochre Earth'],
  },
  green: {
    light: ['Mint Whisper', 'Sage Mist', 'Eucalyptus Breath', 'Spring Dew', 'Pale Jade'],
    vibrant: ['Emerald Flash', 'Forest Crown', 'Jungle Vine', 'Lime Burst', 'Grass Symphony'],
    muted: ['Sage Brush', 'Moss Stone', 'Fern Shadow', 'Olive Grove', 'Cedar Bark'],
    dark: ['Pine Needle', 'Forest Floor', 'Evergreen Shadow', 'Hunter Green', 'Ivy Depth'],
  },
  blue: {
    light: ['Sky Whisper', 'Ice Crystal', 'Powder Blue', 'Cloud Nine', 'Arctic Mist'],
    vibrant: ['Ocean Storm', 'Electric Blue', 'Sapphire Flash', 'Cobalt Dream', 'Azure Sky'],
    muted: ['Stormy Sea', 'Steel Blue', 'Denim Fade', 'Slate Stone', 'Dove Wing'],
    dark: ['Midnight Ocean', 'Navy Depth', 'Twilight Sky', 'Indigo Shadow', 'Deep Sapphire'],
  },
  purple: {
    light: ['Lavender Mist', 'Lilac Dream', 'Orchid Whisper', 'Violet Haze', 'Plum Blossom'],
    vibrant: ['Royal Purple', 'Amethyst Fire', 'Magenta Burst', 'Violet Storm', 'Fuchsia Flash'],
    muted: ['Dusty Rose', 'Mauve Shadow', 'Plum Wine', 'Eggplant Skin', 'Grape Vine'],
    dark: ['Deep Plum', 'Midnight Purple', 'Aubergine Shadow', 'Royal Velvet', 'Blackberry'],
  },
  neutral: {
    light: ['Pearl White', 'Ivory Tower', 'Cloud Nine', 'Silver Mist', 'Moonbeam'],
    vibrant: ['Steel Flash', 'Chrome Shine', 'Silver Lightning', 'Platinum Gleam', 'Mercury Drop'],
    muted: ['Dove Gray', 'Stone Pebble', 'Ash Cloud', 'Concrete', 'Slate Tile'],
    dark: ['Charcoal Shadow', 'Graphite Storm', 'Midnight Fog', 'Coal Dust', 'Obsidian'],
  },
} as const;

// Special cases for extreme lightness values
const EXTREME_NAMES = {
  veryLight: ['Snow White', 'Pure Light', 'Ivory Pearl', 'Cloud White', 'Arctic Snow'],
  veryDark: ['Void Black', 'Midnight Coal', 'Obsidian Stone', 'Deep Shadow', 'Infinite Night'],
} as const;

/**
 * Determine the hue family of a color
 */
export function getHueFamily(
  color: OKLCH
): 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'neutral' {
  // Very low chroma means achromatic/neutral
  if (color.c < 0.04) {
    return 'neutral';
  }

  const hue = color.h;

  // Normalize hue to 0-360 range
  const normalizedHue = ((hue % 360) + 360) % 360;

  if (normalizedHue >= 345 || normalizedHue < 35) return 'red';
  if (normalizedHue >= 35 && normalizedHue < 75) return 'orange';
  if (normalizedHue >= 75 && normalizedHue < 105) return 'yellow';
  if (normalizedHue >= 105 && normalizedHue < 195) return 'green';
  if (normalizedHue >= 195 && normalizedHue < 285) return 'blue';
  if (normalizedHue >= 285 && normalizedHue < 345) return 'purple';

  return 'neutral';
}

/**
 * Determine color intensity category based on lightness and chroma
 */
function getIntensityCategory(color: OKLCH): 'light' | 'vibrant' | 'muted' | 'dark' {
  const { l, c } = color;

  // Very light colors
  if (l > 0.8) return 'light';

  // Very dark colors
  if (l < 0.3) return 'dark';

  // High chroma = vibrant
  if (c > 0.15) return 'vibrant';

  // Low chroma = muted
  return 'muted';
}

/**
 * Generate a descriptive, poetic name for a color
 */
export function generateColorName(color: OKLCH): string {
  // Handle extreme cases
  if (color.l > 0.95) {
    return EXTREME_NAMES.veryLight[Math.floor(Math.random() * EXTREME_NAMES.veryLight.length)];
  }

  if (color.l < 0.05) {
    return EXTREME_NAMES.veryDark[Math.floor(Math.random() * EXTREME_NAMES.veryDark.length)];
  }

  const hueFamily = getHueFamily(color);
  const intensity = getIntensityCategory(color);

  const namePool = COLOR_NAMES[hueFamily][intensity];
  const randomIndex = Math.floor(Math.random() * namePool.length);

  return namePool[randomIndex];
}

/**
 * Generate multiple name suggestions for a color
 */
export function generateColorNameSuggestions(color: OKLCH, count = 3): string[] {
  const suggestions = new Set<string>();
  const hueFamily = getHueFamily(color);
  const intensity = getIntensityCategory(color);

  // Handle extreme cases
  if (color.l > 0.95) {
    while (suggestions.size < count && suggestions.size < EXTREME_NAMES.veryLight.length) {
      const name =
        EXTREME_NAMES.veryLight[Math.floor(Math.random() * EXTREME_NAMES.veryLight.length)];
      suggestions.add(name);
    }
    return Array.from(suggestions);
  }

  if (color.l < 0.05) {
    while (suggestions.size < count && suggestions.size < EXTREME_NAMES.veryDark.length) {
      const name =
        EXTREME_NAMES.veryDark[Math.floor(Math.random() * EXTREME_NAMES.veryDark.length)];
      suggestions.add(name);
    }
    return Array.from(suggestions);
  }

  const namePool = COLOR_NAMES[hueFamily][intensity];

  // Get suggestions from primary intensity category
  while (suggestions.size < count && suggestions.size < namePool.length) {
    const randomIndex = Math.floor(Math.random() * namePool.length);
    suggestions.add(namePool[randomIndex]);
  }

  // If we need more suggestions, try adjacent intensity categories
  if (suggestions.size < count) {
    const intensityOrder: Array<keyof typeof COLOR_NAMES.red> = [
      'light',
      'vibrant',
      'muted',
      'dark',
    ];
    const currentIndex = intensityOrder.indexOf(intensity);

    // Try adjacent intensities
    for (let offset = 1; offset <= 3 && suggestions.size < count; offset++) {
      for (const direction of [-1, 1]) {
        const adjacentIndex = currentIndex + direction * offset;
        if (adjacentIndex >= 0 && adjacentIndex < intensityOrder.length) {
          const adjacentIntensity = intensityOrder[adjacentIndex];
          const adjacentPool = COLOR_NAMES[hueFamily][adjacentIntensity];

          for (const name of adjacentPool) {
            if (suggestions.size < count) {
              suggestions.add(name);
            }
          }
        }
      }
    }
  }

  return Array.from(suggestions).slice(0, count);
}
