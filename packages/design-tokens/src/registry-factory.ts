/**
 * Registry Factory with Self-Initialization
 *
 * Creates a complete TokenRegistry with archive unpacking, token loading,
 * and callback setup based on environment detection.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Token } from '@rafters/shared';
import { DesignSystemArchive } from './archive.js';
import { createLocalCSSCallback } from './callbacks/local-css-callback.js';
import { TokenRegistry } from './registry.js';

/**
 * Create a fully initialized TokenRegistry with automatic setup and event-driven capabilities
 */
export async function createEventDrivenTokenRegistry(
  tokensPath: string,
  shortcode: string = '000000'
): Promise<TokenRegistry> {
  const registry = new TokenRegistry();

  try {
    // Check if tokens exist, if not unpack archive
    if (!tokensExist(tokensPath)) {
      await unpackArchive(shortcode, tokensPath);
    }

    // Load tokens from unpacked files using existing DesignSystemArchive
    const projectPath = getProjectRoot(tokensPath);
    const archive = new DesignSystemArchive(projectPath);
    const tokens = await archive.load();

    // Add tokens to registry
    for (const token of tokens) {
      registry.add(token);
    }

    // Set up callback based on environment
    if (process.env.RAFTERS_PLUS) {
      // Future: Queue-based callback implementation
      // For now, use local CSS callback as fallback
      const cssCallback = createLocalCSSCallback(registry, projectPath);
      registry.setChangeCallback(cssCallback);
    } else {
      // OSS: Local CSS callback
      const cssCallback = createLocalCSSCallback(registry, projectPath);
      registry.setChangeCallback(cssCallback);
    }

    // Fire initial registry event
    registry.initializeRegistry(tokens.length);

    return registry;
  } catch (error) {
    throw new Error(
      `Registry creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Check if tokens already exist at the given path
 */
function tokensExist(tokensPath: string): boolean {
  return (
    existsSync(join(tokensPath, 'colors.json')) &&
    existsSync(join(tokensPath, 'spacing.json')) &&
    existsSync(join(tokensPath, 'manifest.json'))
  );
}

/**
 * Unpack archive to target directory
 */
async function unpackArchive(shortcode: string, targetDir: string): Promise<void> {
  try {
    if (shortcode === '000000') {
      // Use minimal default archive for reliable testing/offline use
      await createMinimalDefaultArchive(targetDir);
    } else {
      // Future: Fetch custom archive from registry
      throw new Error(`Custom archives not yet implemented for shortcode: ${shortcode}`);
    }
  } catch (error) {
    throw new Error(
      `Archive unpacking failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract project root from .rafters/tokens path
 */
function getProjectRoot(tokensPath: string): string {
  return tokensPath.replace('/.rafters/tokens', '');
}

/**
 * Create minimal default archive for testing/offline use
 */
async function createMinimalDefaultArchive(targetDir: string): Promise<void> {
  const { mkdir, writeFile } = await import('node:fs/promises');

  // Ensure target directory exists
  await mkdir(targetDir, { recursive: true });

  // Create minimal manifest
  const manifest = {
    id: '000000',
    name: 'Default Rafters System',
    version: '1.0.0',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    primaryColor: { l: 0.44, c: 0.01, h: 286 },
    intelligence: {
      colorVisionTested: ['normal', 'deuteranopia'],
      contrastLevel: 'AA' as const,
      components: {},
    },
    tokenCount: 4,
    categories: ['color', 'spacing'],
  };

  // Create colors matching ColorsArchive interface
  const colors = {
    families: [
      {
        name: 'gray',
        value: { name: 'gray', scale: [{ l: 0.99, c: 0.01, h: 286 }] },
        category: 'color',
        namespace: 'family',
      },
    ],
    tokens: [
      {
        name: 'primary',
        value: 'oklch(0.44 0.01 286)',
        category: 'color',
        namespace: 'semantic',
      },
    ],
    dependencies: {},
  };

  // Create spacing matching SpacingArchive interface
  const spacing = {
    scale: [
      {
        name: 'xs',
        value: '0.5rem',
        category: 'spacing',
        namespace: 'size',
      },
      {
        name: 'sm',
        value: '1rem',
        category: 'spacing',
        namespace: 'size',
      },
    ],
    system: 'linear',
    baseUnit: 4,
  };

  // Create typography matching TypographyArchive interface
  const typography = {
    families: {
      heading: 'system-ui',
      body: 'system-ui',
      mono: 'ui-monospace',
    },
    scale: {},
    lineHeight: [] as Token[],
    letterSpacing: [] as Token[],
    fontWeight: [] as Token[],
  };

  // Create motion matching MotionArchive interface
  const motion = {
    duration: [] as Token[],
    easing: [] as Token[],
    animations: [] as Token[],
    keyframes: [] as Token[],
    behavior: [] as Token[],
  };

  // Create shadows matching ShadowsArchive interface
  const shadows = {
    elevation: [] as Token[],
    depth: [] as Token[],
  };

  // Create borders matching BordersArchive interface
  const borders = {
    radius: [] as Token[],
    width: [] as Token[],
  };

  // Create breakpoints matching BreakpointsArchive interface
  const breakpoints = {
    screens: [] as Token[],
    containers: [] as Token[],
  };

  // Create layout (empty)
  const layout = {};

  // Create fonts matching FontsArchive interface
  const fonts = {
    families: [] as Token[],
    weights: [] as Token[],
  };

  // Write all required files
  await writeFile(join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await writeFile(join(targetDir, 'colors.json'), JSON.stringify(colors, null, 2));
  await writeFile(join(targetDir, 'spacing.json'), JSON.stringify(spacing, null, 2));
  await writeFile(join(targetDir, 'typography.json'), JSON.stringify(typography, null, 2));
  await writeFile(join(targetDir, 'motion.json'), JSON.stringify(motion, null, 2));
  await writeFile(join(targetDir, 'shadows.json'), JSON.stringify(shadows, null, 2));
  await writeFile(join(targetDir, 'borders.json'), JSON.stringify(borders, null, 2));
  await writeFile(join(targetDir, 'breakpoints.json'), JSON.stringify(breakpoints, null, 2));
  await writeFile(join(targetDir, 'layout.json'), JSON.stringify(layout, null, 2));
  await writeFile(join(targetDir, 'fonts.json'), JSON.stringify(fonts, null, 2));
}
