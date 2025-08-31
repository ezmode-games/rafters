#!/usr/bin/env node

/**
 * OKLCH Spectrum Intelligence Seeding Script
 *
 * Seeds the KV cache with color intelligence for the full OKLCH spectrum.
 * 540 strategic points covering L×C×H combinations for complete exploration.
 *
 * This enables users to explore the full color space rather than preset palettes.
 * 10-second generation time will be masked with animations and prompts.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use local API for seeding during development
const API_URL = process.env.API_URL || 'https://rafters.realhandy.tech/api/color-intel';
const DELAY_MS = 750; // Slightly longer delay for spectrum seeding

// Load spectrum matrix
const spectrumData = JSON.parse(readFileSync(join(__dirname, 'spectrum-matrix.json'), 'utf8'));

async function seedColor(color, index, total) {
  const payload = {
    oklch: color.oklch,
    token: color.token,
    name: color.name,
  };

  try {
    console.log(`[${index + 1}/${total}] Seeding: ${color.name} (${color.token})`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Cached: ${color.name}`);

    return data;
  } catch (error) {
    console.error(`❌ Failed: ${color.name} - ${error.message}`);
    return null;
  }
}

async function seedSpectrumColors(startIndex = 0, batchSize = 50) {
  console.log('🌈 Starting OKLCH spectrum intelligence seeding...\\n');

  const { colors } = spectrumData;
  const totalColors = colors.length;

  console.log(`Total spectrum colors: ${totalColors}`);
  console.log(
    `Coverage: ${
      spectrumData.metadata?.coverage
        ? `${spectrumData.metadata.coverage.lightness.length}L × ${spectrumData.metadata.coverage.chroma.length}C × ${spectrumData.metadata.coverage.hue.length}H`
        : '9L × 5C × 12H'
    }`
  );
  console.log(`Starting from index: ${startIndex}\\n`);

  let successful = 0;
  let failed = 0;

  // Process in batches to allow for restarts
  const endIndex = Math.min(startIndex + batchSize, totalColors);

  for (let i = startIndex; i < endIndex; i++) {
    const color = colors[i];
    const result = await seedColor(color, i, totalColors);

    if (result) {
      successful++;
    } else {
      failed++;
    }

    // Progress update every 10 colors
    if ((i + 1) % 10 === 0 || i === endIndex - 1) {
      const currentBatch = i - startIndex + 1;
      console.log(
        `\\n📊 Batch Progress: ${currentBatch}/${endIndex - startIndex} (${successful} success, ${failed} failed)`
      );
      console.log(
        `📈 Overall Progress: ${i + 1}/${totalColors} (${(((i + 1) / totalColors) * 100).toFixed(1)}%)\\n`
      );
    }

    // Rate limiting delay
    if (i < endIndex - 1) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log(`\\n🏁 Batch ${startIndex}-${endIndex - 1} complete!`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📈 Batch success rate: ${successful > 0 ? ((successful / (endIndex - startIndex)) * 100).toFixed(1) : 0}%`
  );

  if (endIndex < totalColors) {
    console.log('\\n🔄 To continue with next batch, run:');
    console.log(`node scripts/seed-spectrum.js ${endIndex} ${batchSize}`);
  } else {
    console.log('\\n🎉 Full spectrum seeding complete!');
  }
}

// Parse command line arguments
const startIndex = Number.parseInt(process.argv[2]) || 0;
const batchSize = Number.parseInt(process.argv[3]) || 50;

// Run the spectrum seeding process
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSpectrumColors(startIndex, batchSize).catch(console.error);
}

export { seedSpectrumColors, spectrumData };
