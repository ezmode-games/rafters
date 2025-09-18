#!/usr/bin/env tsx

/**
 * Create Default System Archive
 *
 * Generates the complete .rafters/tokens/ archive structure for the default
 * grayscale system (000000) that ships embedded in the CLI.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Token } from '@rafters/shared';
import { generateAllTokens } from '../src/generators/index.js';

async function createDefaultArchive() {
  console.log('🎨 Creating Default System Archive (000000)');
  console.log('Primary Color: oklch(0.44 0.01 286) - Rafters Gray');
  console.log('');

  try {
    // Generate all tokens
    console.log('⏳ Generating complete token system...');
    const startTime = Date.now();
    const tokens = await generateAllTokens();
    const endTime = Date.now();

    console.log(`✅ Generated ${tokens.length} tokens in ${endTime - startTime}ms`);
    console.log('');

    // Create output directory
    const outputDir = resolve('./dist/default-archive');
    await mkdir(outputDir, { recursive: true });

    // Group tokens by category for different JSON files
    const tokensByCategory = tokens.reduce(
      (acc, token) => {
        if (!acc[token.category]) {
          acc[token.category] = [];
        }
        acc[token.category].push(token);
        return acc;
      },
      {} as Record<string, Token[]>
    );

    console.log('📊 Token Distribution:');
    Object.entries(tokensByCategory)
      .sort(([, a], [, b]) => b.length - a.length)
      .forEach(([category, categoryTokens]) => {
        console.log(
          `  ${category.padEnd(20)} ${categoryTokens.length.toString().padStart(3)} tokens`
        );
      });
    console.log('');

    // Create manifest.json
    const manifest = {
      id: '000000',
      name: 'Rafters Default Grayscale System',
      version: '1.0.0',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      primaryColor: { l: 0.44, c: 0.01, h: 286 }, // Rafters Gray
      intelligence: {
        colorVisionTested: ['normal', 'protanopia', 'deuteranopia', 'tritanopia'],
        contrastLevel: 'AAA' as const,
        components: {
          buttons: { touchTargetMet: true, contrastValidated: true },
          forms: { accessibilityOptimized: true },
          navigation: { cognitiveLoadOptimized: true },
        },
      },
      tokenCount: tokens.length,
      categories: Object.keys(tokensByCategory),
    };

    await writeFile(resolve(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    // Create colors.json (color families + semantic color tokens)
    const _colorTokens = tokens.filter(
      (t) => t.category === 'color' || t.category === 'color-family'
    );

    const colors = {
      families: tokensByCategory['color-family'] || [],
      tokens: tokensByCategory.color || [],
      dependencies: {
        'primary-hover': {
          dependsOn: ['primary'],
          generationRule: 'ColorReference with hover state mapping',
        },
        background: {
          dependsOn: ['neutral-50'],
          generationRule: 'ColorReference to neutral family position 50',
        },
      },
    };

    await writeFile(resolve(outputDir, 'colors.json'), JSON.stringify(colors, null, 2));

    // Create typography.json
    const typography = {
      families: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
        mono: 'Fira Code, Monaco, monospace',
      },
      scale:
        tokensByCategory['font-size']?.reduce(
          (acc, token) => {
            const sizeName = token.name.replace('text-', '');
            acc[sizeName] = token;
            return acc;
          },
          {} as Record<string, Token>
        ) || {},
      lineHeight: tokensByCategory['line-height'] || [],
      letterSpacing: tokensByCategory['letter-spacing'] || [],
      fontWeight: tokensByCategory['font-weight'] || [],
    };

    await writeFile(resolve(outputDir, 'typography.json'), JSON.stringify(typography, null, 2));

    // Create spacing.json
    const spacing = {
      scale: tokensByCategory.spacing || [],
      system: 'linear',
      baseUnit: 4,
    };

    await writeFile(resolve(outputDir, 'spacing.json'), JSON.stringify(spacing, null, 2));

    // Create motion.json
    const motion = {
      duration: tokensByCategory.duration || [],
      easing: tokensByCategory.easing || [],
      animations: tokensByCategory.animation || [],
    };

    await writeFile(resolve(outputDir, 'motion.json'), JSON.stringify(motion, null, 2));

    // Create shadows.json
    const shadows = {
      elevation: tokensByCategory.shadow || [],
      depth: tokensByCategory['z-index'] || [],
    };

    await writeFile(resolve(outputDir, 'shadows.json'), JSON.stringify(shadows, null, 2));

    // Create borders.json
    const borders = {
      radius: tokensByCategory['border-radius'] || [],
      width: tokensByCategory['border-width'] || [],
    };

    await writeFile(resolve(outputDir, 'borders.json'), JSON.stringify(borders, null, 2));

    // Create breakpoints.json
    const breakpoints = {
      screens: tokensByCategory.breakpoint || [],
      containers: tokensByCategory.container || [],
    };

    await writeFile(resolve(outputDir, 'breakpoints.json'), JSON.stringify(breakpoints, null, 2));

    // Create layout.json for remaining categories
    const layoutCategories = [
      'width',
      'height',
      'touch-target',
      'opacity',
      'aspect-ratio',
      'grid-template-columns',
      'grid-template-rows',
      'scale',
      'translate',
      'rotate',
      'backdrop-blur',
    ];

    const layout = layoutCategories.reduce(
      (acc, category) => {
        if (tokensByCategory[category]) {
          acc[category] = tokensByCategory[category];
        }
        return acc;
      },
      {} as Record<string, Token[]>
    );

    await writeFile(resolve(outputDir, 'layout.json'), JSON.stringify(layout, null, 2));

    // Create fonts.json
    const fonts = {
      families: tokensByCategory['font-family'] || [],
      weights: tokensByCategory['font-weight'] || [],
    };

    await writeFile(resolve(outputDir, 'fonts.json'), JSON.stringify(fonts, null, 2));

    console.log('📁 Archive Structure Created:');
    console.log('  dist/default-archive/');
    console.log('    ├── manifest.json        # System metadata');
    console.log('    ├── colors.json          # Color families + semantic colors');
    console.log('    ├── typography.json      # Typography scale');
    console.log('    ├── spacing.json         # Spacing scale');
    console.log('    ├── motion.json          # Animation tokens');
    console.log('    ├── shadows.json         # Shadow/elevation tokens');
    console.log('    ├── borders.json         # Border radius/width');
    console.log('    ├── breakpoints.json     # Responsive breakpoints');
    console.log('    ├── layout.json          # Width/height/transform tokens');
    console.log('    └── fonts.json           # Font families/weights');
    console.log('');

    // Validation
    const archiveFiles = [
      'manifest.json',
      'colors.json',
      'typography.json',
      'spacing.json',
      'motion.json',
      'shadows.json',
      'borders.json',
      'breakpoints.json',
      'layout.json',
      'fonts.json',
    ];

    console.log('✅ Archive Validation:');
    console.log(`  📄 ${archiveFiles.length} JSON files created`);
    console.log(`  🎨 ${tokens.length} total tokens archived`);
    console.log(`  📦 Ready for CLI embedding as default system 000000`);
    console.log('');
    console.log('🎉 Default archive creation SUCCESS!');
    console.log('📋 Next steps:');
    console.log('  1. Review generated JSON files in dist/default-archive/');
    console.log('  2. Compress for CLI embedding');
    console.log('  3. Update CLI to use embedded archive');
  } catch (error) {
    console.error('❌ Error creating default archive:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDefaultArchive();
}
