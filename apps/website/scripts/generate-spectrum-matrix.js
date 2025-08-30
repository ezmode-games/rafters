#!/usr/bin/env node

/**
 * OKLCH Spectrum Matrix Generator
 *
 * Creates strategic coverage of the full OKLCH color space for exploration.
 * Instead of standard color palettes, users explore the complete spectrum.
 *
 * Matrix Coverage:
 * - L: 0.1 to 0.9 (9 lightness values)
 * - C: 0.05 to 0.25 (5 chroma values)
 * - H: 0 to 330 in 30° steps (12 hue values)
 * - Total: 540 strategic exploration points
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Matrix parameters for full spectrum coverage
const LIGHTNESS_VALUES = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const CHROMA_VALUES = [0.05, 0.1, 0.15, 0.2, 0.25];
const HUE_VALUES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

function generateSpectrumColors() {
  const colors = [];

  for (const l of LIGHTNESS_VALUES) {
    for (const c of CHROMA_VALUES) {
      for (const h of HUE_VALUES) {
        // Create semantic token name based on position
        const lightness = l <= 0.3 ? 'dark' : l <= 0.7 ? 'medium' : 'light';
        const saturation = c <= 0.1 ? 'muted' : c <= 0.2 ? 'vibrant' : 'intense';
        const hue = getHueName(h);

        const token = `spectrum-${hue}-${saturation}-${lightness}`;
        const name = `${hue.charAt(0).toUpperCase() + hue.slice(1)} ${saturation} ${lightness}`;

        colors.push({
          oklch: { l, c, h },
          token,
          name,
          category: 'spectrum-exploration',
        });
      }
    }
  }

  return colors;
}

function getHueName(hue) {
  const hueNames = {
    0: 'red',
    30: 'red-orange',
    60: 'orange',
    90: 'yellow-orange',
    120: 'yellow',
    150: 'yellow-green',
    180: 'green',
    210: 'green-cyan',
    240: 'cyan',
    270: 'cyan-blue',
    300: 'blue',
    330: 'blue-magenta',
  };
  return hueNames[hue];
}

function generateMatrix() {
  const colors = generateSpectrumColors();

  const matrix = {
    metadata: {
      title: 'OKLCH Full Spectrum Exploration Matrix',
      description: 'Strategic coverage of OKLCH color space for user exploration',
      totalColors: colors.length,
      coverage: {
        lightness: LIGHTNESS_VALUES,
        chroma: CHROMA_VALUES,
        hue: HUE_VALUES,
      },
      generatedAt: new Date().toISOString(),
    },
    colors,
  };

  // Save to file
  const outputPath = join(__dirname, 'spectrum-matrix.json');
  writeFileSync(outputPath, JSON.stringify(matrix, null, 2));

  console.log(`Generated ${colors.length} spectrum colors`);
  console.log(
    `Matrix coverage: ${LIGHTNESS_VALUES.length}L × ${CHROMA_VALUES.length}C × ${HUE_VALUES.length}H`
  );
  console.log(`Saved to: ${outputPath}`);

  return matrix;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMatrix();
}

export { generateMatrix, generateSpectrumColors };
