/**
 * Generate Token Cache - Build-time token generation script
 *
 * This script runs at build time to generate a static cache of all tokens
 * from the @rafters/design-tokens package. The cache is regenerated when
 * the design-tokens package version changes.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const cacheDir = join(__dirname, '../src/data');
const cacheFile = join(cacheDir, 'token-cache.json');
const versionFile = join(cacheDir, 'token-version.json');

// Get current design-tokens package version
function getCurrentVersion() {
  try {
    const packagePath = join(__dirname, '../../../packages/design-tokens/package.json');
    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
    return pkg.version;
  } catch (error) {
    console.error('Failed to read design-tokens package.json:', error.message);
    return null;
  }
}

// Check if cache needs regeneration
function needsRegeneration() {
  const currentVersion = getCurrentVersion();
  if (!currentVersion) return true;

  if (!existsSync(cacheFile) || !existsSync(versionFile)) {
    return true;
  }

  try {
    const versionData = JSON.parse(readFileSync(versionFile, 'utf8'));
    return versionData.version !== currentVersion;
  } catch {
    return true;
  }
}

// Generate token cache
async function generateTokenCache() {
  console.log('🔄 Generating token cache...');

  try {
    // Import generators dynamically (ESM modules)
    const { generateAllTokens, generateColorTokens } = await import('@rafters/design-tokens');

    // Generate all tokens (both functions are now async)
    const allTokens = await generateAllTokens();
    const colorTokens = await generateColorTokens();

    // Group tokens by category
    const tokensByCategory = allTokens.reduce((acc, token) => {
      if (!acc[token.category]) {
        acc[token.category] = [];
      }
      acc[token.category].push(token);
      return acc;
    }, {});

    // Separate semantic colors from color families
    const semanticColors = colorTokens.filter(
      (token) => !token.name.includes('-') || token.name.endsWith('-dark')
    );

    const colorFamilies = colorTokens.filter(
      (token) => token.name.includes('-') && !token.name.endsWith('-dark')
    );

    // Group color families by base name
    const familyGroups = colorFamilies.reduce((acc, token) => {
      const baseName = token.name.split('-')[0];
      if (!acc[baseName]) {
        acc[baseName] = [];
      }
      acc[baseName].push(token);
      return acc;
    }, {});

    // Create cache data
    const cacheData = {
      generatedAt: new Date().toISOString(),
      version: getCurrentVersion(),
      stats: {
        totalTokens: allTokens.length,
        categories: Object.keys(tokensByCategory).length,
        colorTokens: colorTokens.length,
        semanticColors: semanticColors.length,
        colorFamilies: Object.keys(familyGroups).length,
      },
      allTokens,
      tokensByCategory,
      colorTokens: {
        all: colorTokens,
        semantic: semanticColors,
        families: familyGroups,
      },
    };

    // Ensure cache directory exists
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }

    // Write cache files
    writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
    writeFileSync(
      versionFile,
      JSON.stringify(
        {
          version: getCurrentVersion(),
          generatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    console.log('✅ Token cache generated successfully');
    console.log(
      `📊 Stats: ${cacheData.stats.totalTokens} tokens, ${cacheData.stats.categories} categories`
    );

    return cacheData;
  } catch (error) {
    console.error('❌ Failed to generate token cache:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  if (needsRegeneration()) {
    await generateTokenCache();
  } else {
    console.log('✅ Token cache is up-to-date');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { generateTokenCache, needsRegeneration, getCurrentVersion };
