#!/usr/bin/env node

/**
 * Color Seeding Status Monitor
 *
 * Monitors progress of both standard color seeding and spectrum seeding
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getStandardProgress() {
  const logPath = join(__dirname, '..', 'seed-output.log');
  if (!existsSync(logPath)) return null;

  try {
    const logContent = readFileSync(logPath, 'utf8');
    const successCount = (logContent.match(/✅ Cached:/g) || []).length;
    const failCount = (logContent.match(/❌ Failed:/g) || []).length;

    // Get total from colors-data.json
    const colorsData = JSON.parse(readFileSync(join(__dirname, 'colors-data.json'), 'utf8'));
    const total = Object.values(colorsData).reduce((sum, arr) => sum + arr.length, 0);

    return {
      completed: successCount,
      failed: failCount,
      total,
      percentage: ((successCount / total) * 100).toFixed(1),
    };
  } catch (error) {
    console.error('Error reading standard seeding progress:', error.message);
    return null;
  }
}

function getSpectrumInfo() {
  const matrixPath = join(__dirname, 'spectrum-matrix.json');
  if (!existsSync(matrixPath)) return null;

  try {
    const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'));
    return {
      total: matrix.colors ? matrix.colors.length : 0,
      coverage: matrix.metadata?.coverage || null,
    };
  } catch (error) {
    console.error('Error reading spectrum matrix:', error.message);
    return null;
  }
}

function displayStatus() {
  console.log('🎨 Rafters Color Intelligence Seeding Status\\n');

  // Standard colors progress
  console.log('📋 Standard Colors (Tailwind, Material, Brands, etc.)');
  const standardProgress = getStandardProgress();
  if (standardProgress) {
    console.log(
      `   Progress: ${standardProgress.completed}/${standardProgress.total} (${standardProgress.percentage}%)`
    );
    console.log(`   Failed: ${standardProgress.failed}`);

    if (standardProgress.completed === standardProgress.total) {
      console.log('   ✅ Standard seeding COMPLETE!\\n');
    } else {
      const remaining = standardProgress.total - standardProgress.completed;
      console.log(`   ⏳ ${remaining} colors remaining\\n`);
    }
  } else {
    console.log('   ❓ No standard seeding data found\\n');
  }

  // Spectrum matrix info
  console.log('🌈 Full Spectrum Matrix');
  const spectrumInfo = getSpectrumInfo();
  if (spectrumInfo) {
    console.log(`   Matrix size: ${spectrumInfo.total} colors`);
    if (spectrumInfo.coverage) {
      const { lightness, chroma, hue } = spectrumInfo.coverage;
      console.log(`   Coverage: ${lightness.length}L × ${chroma.length}C × ${hue.length}H`);
    }
    console.log('   Status: Ready for seeding');
    console.log('   Command: node scripts/seed-spectrum.js [startIndex] [batchSize]\\n');
  } else {
    console.log('   ❓ No spectrum matrix found\\n');
  }

  // Strategy info
  console.log('🎯 Strategy');
  console.log('   Phase 1: Standard colors (preset palettes) - for rare usage');
  console.log('   Phase 2: Full spectrum matrix - for user exploration');
  console.log('   Goal: Enable discovery of unique colors across OKLCH space');
  console.log('   UX: 10-second generation masked by animations + color choice prompts');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  displayStatus();
}

export { getStandardProgress, getSpectrumInfo };
