#!/usr/bin/env node

/**
 * Color Intelligence API Seeding Script
 *
 * Seeds the KV cache with color intelligence for commonly used design system colors.
 * Based on the spec: ~500 colors total across major design systems.
 *
 * Complete Tailwind v4 OKLCH colors, Material Design, Brand colors, etc.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'https://rafters.realhandy.tech/api/color-intel';
const DELAY_MS = 500; // 500ms delay between requests

// Load colors from JSON file
const colorsData = JSON.parse(readFileSync(join(__dirname, 'colors-data.json'), 'utf8'));

async function seedColor(color) {
  const payload = {
    oklch: color.oklch,
    token: color.token,
    name: color.name,
  };

  try {
    console.log(`Seeding: ${color.name} (${color.token})`);

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

async function seedAllColors() {
  console.log('🌱 Starting color intelligence seeding...\n');

  // Flatten all color categories into one array
  const allColors = [
    ...colorsData.tailwind,
    ...colorsData.material,
    ...colorsData.brands,
    ...colorsData.semantic,
    ...colorsData.accessibility,
    ...colorsData.grayscale,
  ];

  console.log(`Total colors to seed: ${allColors.length}\n`);
  console.log(
    `Categories: Tailwind (${colorsData.tailwind.length}), Material (${colorsData.material.length}), Brands (${colorsData.brands.length}), Semantic (${colorsData.semantic.length}), Accessibility (${colorsData.accessibility.length}), Grayscale (${colorsData.grayscale.length})\n`
  );

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < allColors.length; i++) {
    const color = allColors[i];
    const result = await seedColor(color);

    if (result) {
      successful++;
    } else {
      failed++;
    }

    // Progress update every 10 colors
    if ((i + 1) % 10 === 0) {
      console.log(
        `\n📊 Progress: ${i + 1}/${allColors.length} (${successful} success, ${failed} failed)\n`
      );
    }

    // Rate limiting delay
    if (i < allColors.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log('\n🏁 Seeding complete!');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success rate: ${((successful / allColors.length) * 100).toFixed(1)}%`);
}

// Run the seeding process
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAllColors().catch(console.error);
}

export { seedAllColors, colorsData };
