/**
 * Bootstrap Colors Command
 *
 * CLI command to seed the color queue with strategic colors for processing
 */

import { Command } from 'commander';
import {
  type BootstrapSeederConfig,
  type KVStore,
  seedColorQueue,
} from '../../../../scripts/seed-color-queue.js';

// Mock KV store for CLI demonstration
class MockKVStore implements KVStore {
  private storage = new Map<string, string>();
  private logPrefix = '📦 KV';

  async put(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
    console.log(`${this.logPrefix} PUT ${key} (${this.formatSize(value.length)})`);
  }

  async get(key: string): Promise<string | null> {
    const value = this.storage.get(key) || null;
    console.log(`${this.logPrefix} GET ${key} → ${value ? this.formatSize(value.length) : 'null'}`);
    return value;
  }

  async list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }> {
    const keys = Array.from(this.storage.keys())
      .filter((key) => !options?.prefix || key.startsWith(options.prefix))
      .map((name) => ({ name }));

    console.log(`${this.logPrefix} LIST ${options?.prefix || 'all'} → ${keys.length} keys`);
    return { keys };
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
    console.log(`${this.logPrefix} DELETE ${key}`);
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  }

  // Debug method to show storage stats
  getStats() {
    const totalSize = Array.from(this.storage.values()).reduce(
      (sum, value) => sum + value.length,
      0
    );

    return {
      keys: this.storage.size,
      totalSize,
      formattedSize: this.formatSize(totalSize),
    };
  }
}

export const bootstrapColorsCommand = new Command('bootstrap-colors')
  .description('Seed color queue with strategic colors for distributed processing')
  .option('-l, --lightness-steps <number>', 'Number of lightness steps in strategic matrix', '9')
  .option('-c, --chroma-steps <number>', 'Number of chroma steps in strategic matrix', '5')
  .option('-h, --hue-steps <number>', 'Number of hue steps in strategic matrix', '12')
  .option('--no-standard-colors', 'Exclude standard design system colors')
  .option('--dry-run', 'Show what would be seeded without making changes')
  .action(async (options) => {
    console.log('🚀 Rafters Color Queue Bootstrap');
    console.log('=====================================\n');

    // Parse configuration
    const config: BootstrapSeederConfig = {
      strategicMatrix: {
        lightnessSteps: Number.parseInt(options.lightnessSteps, 10),
        chromaSteps: Number.parseInt(options.chromaSteps, 10),
        hueSteps: Number.parseInt(options.hueSteps, 10),
      },
      includeStandardColors: options.standardColors !== false,
      kvNamespace: 'RAFTERS_INTEL',
    };

    // Validate configuration
    if (config.strategicMatrix.lightnessSteps < 1 || config.strategicMatrix.lightnessSteps > 20) {
      console.error('❌ Lightness steps must be between 1 and 20');
      process.exit(1);
    }

    if (config.strategicMatrix.chromaSteps < 1 || config.strategicMatrix.chromaSteps > 20) {
      console.error('❌ Chroma steps must be between 1 and 20');
      process.exit(1);
    }

    if (config.strategicMatrix.hueSteps < 1 || config.strategicMatrix.hueSteps > 36) {
      console.error('❌ Hue steps must be between 1 and 36');
      process.exit(1);
    }

    // Calculate expected colors
    const strategicCount =
      config.strategicMatrix.lightnessSteps *
      config.strategicMatrix.chromaSteps *
      config.strategicMatrix.hueSteps;
    const standardCount = config.includeStandardColors ? 32 : 0; // Approximate
    const totalExpected = strategicCount + standardCount;

    console.log('📊 Configuration:');
    console.log(
      `   Strategic Matrix: ${config.strategicMatrix.lightnessSteps}L × ${config.strategicMatrix.chromaSteps}C × ${config.strategicMatrix.hueSteps}H = ${strategicCount} colors`
    );
    console.log(
      `   Standard Colors: ${config.includeStandardColors ? 'Yes' : 'No'} (${standardCount} colors)`
    );
    console.log(`   Total Expected: ${totalExpected} colors`);
    console.log(`   Estimated Time: ${Math.round((totalExpected * 10) / 60)} minutes\n`);

    if (options.dryRun) {
      console.log('🔍 Dry run mode - no changes will be made');
      console.log(`Would seed ${totalExpected} colors to KV queue`);
      return;
    }

    // Create KV store (mock for CLI)
    const kvStore = new MockKVStore();

    try {
      console.log('⏳ Seeding color queue...\n');

      await seedColorQueue(config, kvStore);

      // Show final statistics
      const stats = kvStore.getStats();
      console.log('\n📈 Seeding Statistics:');
      console.log(`   Queue Items: ${stats.keys}`);
      console.log(`   Total Size: ${stats.formattedSize}`);
      console.log(
        `   Average Size: ${(stats.totalSize / stats.keys / 1024).toFixed(1)}KB per item`
      );

      console.log('\n✅ Bootstrap complete!');
      console.log('🔄 Enable the cron processor to start processing colors');
      console.log('📊 Monitor progress at /api/color-queue/progress');
    } catch (error) {
      console.error('\n❌ Bootstrap failed:', (error as Error).message);
      console.error('Stack trace:', (error as Error).stack);
      process.exit(1);
    }
  });

// Add command to CLI program
export default bootstrapColorsCommand;
