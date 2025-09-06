/**
 * Color Queue Seeder Script
 *
 * Seeds the KV store with OKLCH colors for distributed processing.
 * Generates strategic matrix + standard colors and writes them as pending queue items.
 */

import type { OKLCH } from '@rafters/shared';

// Configuration interface
export interface BootstrapSeederConfig {
  strategicMatrix: {
    lightnessSteps: number;
    chromaSteps: number;
    hueSteps: number;
  };
  includeStandardColors: boolean;
  kvNamespace: string;
}

// Color queue item structure
export interface ColorQueueItem {
  oklch: OKLCH;
  state: 'pending' | 'processing' | 'completed';
  processingStarted?: string;
  processingTimeout: number;
  retryCount: number;
  lastError?: string;
}

// Progress tracking structure
export interface QueueProgress {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  estimatedCompletion: string;
}

// KV interface for dependency injection
export interface KVStore {
  put(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
  delete(key: string): Promise<void>;
}

/**
 * Generate strategic OKLCH matrix for comprehensive color coverage
 * Creates perceptually uniform distribution across lightness, chroma, and hue
 */
export function generateStrategicMatrix(config: BootstrapSeederConfig['strategicMatrix']): OKLCH[] {
  // Validate configuration
  if (config.lightnessSteps <= 0 || config.chromaSteps <= 0 || config.hueSteps <= 0) {
    throw new Error('All matrix steps must be positive numbers');
  }

  const colors: OKLCH[] = [];

  // Generate evenly distributed lightness values (0.1 to 0.9)
  for (let lStep = 0; lStep < config.lightnessSteps; lStep++) {
    const l = 0.1 + (0.8 * lStep) / (config.lightnessSteps - 1);

    // Generate evenly distributed chroma values (0.05 to 0.25)
    for (let cStep = 0; cStep < config.chromaSteps; cStep++) {
      const c = 0.05 + (0.2 * cStep) / (config.chromaSteps - 1);

      // Generate evenly distributed hue values (0 to 359)
      for (let hStep = 0; hStep < config.hueSteps; hStep++) {
        const h = (360 * hStep) / config.hueSteps;

        colors.push({ l, c, h });
      }
    }
  }

  return colors;
}

/**
 * Load standard colors from design systems
 * Includes Tailwind, Material Design, brand colors, and accessibility colors
 * Loads all 306 colors from the comprehensive colors-data.json file
 */
export async function loadStandardColors(): Promise<OKLCH[]> {
  try {
    // Only try to load from filesystem in Node.js environment
    if (typeof process === 'undefined') {
      throw new Error('Filesystem not available in Worker environment');
    }

    // Import colors-data.json from the proper location
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');

    const colorsDataPath = join(process.cwd(), 'apps/website/scripts/colors-data.json');
    const colorsData = JSON.parse(readFileSync(colorsDataPath, 'utf8'));

    const allColors: OKLCH[] = [];

    // Extract OKLCH values from all categories
    for (const category of Object.values(colorsData)) {
      if (Array.isArray(category)) {
        for (const colorEntry of category) {
          if (colorEntry.oklch && typeof colorEntry.oklch === 'object') {
            allColors.push({
              l: colorEntry.oklch.l,
              c: colorEntry.oklch.c,
              h: colorEntry.oklch.h,
              alpha: colorEntry.oklch.alpha || 1,
            });
          }
        }
      }
    }

    console.log(`✓ Loaded ${allColors.length} standard design system colors`);
    return allColors;
  } catch (error) {
    console.warn('Failed to load colors-data.json, falling back to minimal set:', error);

    // Fallback to minimal colors if file loading fails
    const fallbackColors: OKLCH[] = [
      // Just the essential colors as fallback
      { l: 0.98, c: 0.01, h: 0 }, // Near white
      { l: 0.05, c: 0.01, h: 0 }, // Near black
      { l: 0.45, c: 0.15, h: 240 }, // Primary blue
      { l: 0.55, c: 0.25, h: 15 }, // Error red
      { l: 0.75, c: 0.2, h: 135 }, // Success green
    ];

    return fallbackColors;
  }
}

/**
 * Generate unique queue item key from OKLCH color
 */
function generateQueueItemKey(oklch: OKLCH, index: number): string {
  const l = Math.round(oklch.l * 100)
    .toString()
    .padStart(3, '0');
  const c = Math.round(oklch.c * 100)
    .toString()
    .padStart(3, '0');
  const h = Math.round(oklch.h).toString().padStart(3, '0');
  const idx = index.toString().padStart(6, '0');

  return `color-queue:item:${l}-${c}-${h}-${idx}`;
}

/**
 * Create progress tracking entry
 */
function createProgressEntry(totalColors: number): QueueProgress {
  const estimatedSeconds = totalColors * 60; // 60 seconds per color (1 minute)
  const estimatedCompletion = new Date(Date.now() + estimatedSeconds * 1000).toISOString();

  return {
    total: totalColors,
    pending: totalColors,
    processing: 0,
    completed: 0,
    failed: 0,
    estimatedCompletion,
  };
}

/**
 * Main seeder function - populates KV store with color queue items
 */
export async function seedColorQueue(config: BootstrapSeederConfig, kv: KVStore): Promise<void> {
  console.log('🎨 Starting color queue seeding...');

  // Generate strategic matrix
  console.log(
    `Generating strategic matrix: ${config.strategicMatrix.lightnessSteps}L × ${config.strategicMatrix.chromaSteps}C × ${config.strategicMatrix.hueSteps}H`
  );
  const strategicColors = generateStrategicMatrix(config.strategicMatrix);
  console.log(`✓ Generated ${strategicColors.length} strategic colors`);

  // Load standard colors if requested
  let standardColors: OKLCH[] = [];
  if (config.includeStandardColors) {
    console.log('Loading standard design system colors...');
    standardColors = await loadStandardColors();
    console.log(`✓ Loaded ${standardColors.length} standard colors`);
  }

  // Combine all colors
  const allColors = [...strategicColors, ...standardColors];
  console.log(`📊 Total colors to process: ${allColors.length}`);

  // Create progress tracking entry
  const progress = createProgressEntry(allColors.length);
  await kv.put('color-queue:progress', JSON.stringify(progress));
  console.log('✓ Created progress tracking entry');

  // Seed all colors to KV queue
  console.log('Writing colors to KV queue...');
  const batchSize = 50; // Process in batches to avoid overwhelming KV

  for (let i = 0; i < allColors.length; i += batchSize) {
    const batch = allColors.slice(i, i + batchSize);

    const promises = batch.map(async (oklch, batchIndex) => {
      const globalIndex = i + batchIndex;
      const queueItem: ColorQueueItem = {
        oklch,
        state: 'pending',
        processingTimeout: 30000, // 30 seconds
        retryCount: 0,
      };

      const key = generateQueueItemKey(oklch, globalIndex);
      await kv.put(key, JSON.stringify(queueItem));
    });

    await Promise.all(promises);

    console.log(
      `✓ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allColors.length / batchSize)} (${i + batch.length}/${allColors.length} colors)`
    );
  }

  console.log('🎉 Color queue seeding complete!');
  console.log(`📈 Seeded ${allColors.length} colors for distributed processing`);
  console.log(`⏱️  Estimated completion time: ${progress.estimatedCompletion}`);
  console.log('🔄 Cron processor will handle 1 color every minute');
}

/**
 * CLI runner function
 */
export async function runSeeder() {
  // Default configuration for production: 846+ strategic colors
  // Strategic matrix: 9L × 5C × 12H = 540 colors
  // Standard colors: 306 design system colors from colors-data.json
  // Total: 846+ colors for comprehensive intelligence coverage
  const defaultConfig: BootstrapSeederConfig = {
    strategicMatrix: {
      lightnessSteps: 9, // 9 lightness steps (0.1 to 0.9)
      chromaSteps: 5, // 5 chroma steps (0.05 to 0.25)
      hueSteps: 12, // 12 hue steps (30° intervals)
    },
    includeStandardColors: true, // 306 colors from all design systems
    kvNamespace: 'RAFTERS_INTEL',
  };

  // Mock KV for CLI usage - in production this would use actual Cloudflare KV
  const mockKV: KVStore = {
    async put(key: string, value: string) {
      console.log(`KV PUT: ${key} (${value.length} bytes)`);
    },
    async get(key: string) {
      console.log(`KV GET: ${key}`);
      return null;
    },
    async list(options?: { prefix?: string }) {
      console.log(`KV LIST: ${options?.prefix || 'all'}`);
      return { keys: [] };
    },
    async delete(key: string) {
      console.log(`KV DELETE: ${key}`);
    },
  };

  try {
    await seedColorQueue(defaultConfig, mockKV);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run if called directly (Node.js only)
if (typeof process !== 'undefined' && process.argv) {
  // Dynamic import to avoid issues in Worker environment
  import('node:url')
    .then(({ fileURLToPath }) => {
      if (fileURLToPath(import.meta.url) === process.argv[1]) {
        runSeeder();
      }
    })
    .catch(() => {
      // Ignore import errors in Worker environment
    });
}
