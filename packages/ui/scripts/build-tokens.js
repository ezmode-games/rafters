#!/usr/bin/env node

/**
 * Smart Build Script for Design Token CSS Generation
 *
 * This script automatically generates CSS files in packages/ui when design tokens change.
 * It watches for changes in @rafters/design-tokens and regenerates CSS files accordingly.
 *
 * Triggers:
 * - Changes to design-tokens source files
 * - Changes to token schemas
 * - Changes to motion definitions
 * - Manual rebuild requests
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const TOKENS_PACKAGE_PATH = path.resolve(__dirname, '../../design-tokens');
const UI_SRC_DIR = path.resolve(__dirname, '../src');
const OUTPUT_FILES = {
  css: path.join(UI_SRC_DIR, 'style.css'),
};

// Watch patterns for token changes
const WATCH_PATTERNS = [
  path.join(TOKENS_PACKAGE_PATH, 'src/**/*.ts'),
  path.join(TOKENS_PACKAGE_PATH, 'src/**/*.js'),
  path.join(TOKENS_PACKAGE_PATH, 'src/schemas/**/*.ts'),
  path.join(TOKENS_PACKAGE_PATH, 'src/motion/**/*.ts'),
  path.join(TOKENS_PACKAGE_PATH, 'src/motion/**/*.js'),
];

// Fallback token definitions for reliable CSS generation
const FALLBACK_TOKENS = {
  // Core colors
  '--color-primary': 'oklch(0.45 0.12 240)',
  '--color-primary-foreground': 'oklch(0.98 0.002 240)',
  '--color-secondary': 'oklch(0.35 0.08 240)',
  '--color-secondary-foreground': 'oklch(0.95 0.005 240)',
  '--color-background': 'oklch(1 0 0)',
  '--color-foreground': 'oklch(0.15 0.005 240)',
  '--color-muted': 'oklch(0.96 0.005 240)',
  '--color-muted-foreground': 'oklch(0.45 0.02 240)',
  '--color-border': 'oklch(0.88 0.02 240)',
  '--color-input': 'oklch(0.88 0.02 240)',
  '--color-ring': 'oklch(0.45 0.12 240)',

  // Semantic colors
  '--color-destructive': 'oklch(0.4 0.15 20)',
  '--color-destructive-foreground': 'oklch(0.98 0.002 20)',
  '--color-success': 'oklch(0.45 0.1 150)',
  '--color-success-foreground': 'oklch(0.98 0.002 150)',
  '--color-warning': 'oklch(0.55 0.12 60)',
  '--color-warning-foreground': 'oklch(0.15 0.02 60)',

  // Typography
  '--font-family-sans': '"Inter", system-ui, sans-serif',
  '--font-family-mono': '"JetBrains Mono", "Fira Code", monospace',
  '--font-size-xs': '0.75rem',
  '--font-size-sm': '0.875rem',
  '--font-size-base': '1rem',
  '--font-size-lg': '1.125rem',
  '--font-size-xl': '1.25rem',
  '--font-size-2xl': '1.5rem',
  '--font-size-3xl': '1.875rem',
  '--font-size-4xl': '2.25rem',

  // Spacing
  '--spacing-0': '0',
  '--spacing-px': '1px',
  '--spacing-0.5': '0.125rem',
  '--spacing-1': '0.25rem',
  '--spacing-1.5': '0.375rem',
  '--spacing-2': '0.5rem',
  '--spacing-2.5': '0.625rem',
  '--spacing-3': '0.75rem',
  '--spacing-3.5': '0.875rem',
  '--spacing-4': '1rem',
  '--spacing-5': '1.25rem',
  '--spacing-6': '1.5rem',
  '--spacing-8': '2rem',
  '--spacing-10': '2.5rem',
  '--spacing-12': '3rem',
  '--spacing-16': '4rem',
  '--spacing-20': '5rem',
  '--spacing-24': '6rem',
  '--spacing-32': '8rem',
  '--spacing-40': '10rem',
  '--spacing-48': '12rem',
  '--spacing-56': '14rem',
  '--spacing-64': '16rem',

  // Motion
  '--duration-instant': '75ms',
  '--duration-fast': '150ms',
  '--duration-standard': '300ms',
  '--duration-deliberate': '500ms',
  '--duration-slow': '700ms',
  '--duration-dramatic': '1000ms',
  '--ease-linear': 'linear',
  '--ease-smooth': 'ease-in-out',
  '--ease-accelerating': 'ease-out',
  '--ease-decelerating': 'ease-in',
  '--ease-bouncy': 'cubic-bezier(0.175,0.885,0.32,1.275)',
  '--ease-snappy': 'cubic-bezier(0.25,0.46,0.45,0.94)',

  // Borders and shadows
  '--border-radius-sm': '4px',
  '--border-radius-md': '6px',
  '--border-radius-lg': '8px',
  '--border-radius-xl': '12px',
  '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '--shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '--shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '--shadow-inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  '--shadow-none': 'none',

  // Ring system
  '--ring-width-standard': '2px',
  '--ring-width-enhanced': '3px',
  '--ring-width-prominent': '4px',
  '--ring-offset-standard': '2px',
  '--ring-offset-enhanced': '3px',
  '--ring-opacity-standard': '0.5',
  '--ring-opacity-enhanced': '0.7',
  '--ring-opacity-prominent': '0.9',

  // Opacity
  '--opacity-disabled': '0.5',
  '--opacity-loading': '0.7',
  '--opacity-overlay': '0.8',
  '--opacity-backdrop': '0.25',
};

/**
 * Ensure output directory exists
 */
async function ensureOutputDir() {
  try {
    await fs.access(UI_SRC_DIR);
  } catch {
    await fs.mkdir(UI_SRC_DIR, { recursive: true });
    console.log(`Created src directory: ${UI_SRC_DIR}`);
  }
}

/**
 * Get design token values from the built package and format for Tailwind v4
 */
async function getDesignTokens() {
  try {
    // Import the design tokens package
    const module = await import('@rafters/design-tokens');

    console.log('Available exports:', Object.keys(module));

    if (module.defaultGrayscaleSystem) {
      console.log('Using design tokens from grayscale system');
      const system = module.defaultGrayscaleSystem;
      console.log('System structure:', Object.keys(system));

      // Extract ALL tokens from ALL categories in the design system
      const tokens = {};

      // Process all categories
      const categories = [
        'colors',
        'typography',
        'spacing',
        'state',
        'border',
        'shadow',
        'ring',
        'opacity',
      ];

      for (const category of categories) {
        if (system[category]) {
          console.log(`Processing ${category}: ${Object.keys(system[category]).length} tokens`);
          for (const [key, token] of Object.entries(system[category])) {
            tokens[token.name] = token.value;
          }
        }
      }

      // Handle motion tokens specially (they have timing and easing subcategories)
      if (system.motion) {
        if (system.motion.timing) {
          console.log(
            `Processing motion.timing: ${Object.keys(system.motion.timing).length} tokens`
          );
          for (const [key, token] of Object.entries(system.motion.timing)) {
            // Convert Tailwind utility classes to CSS values for motion tokens
            const cssValue = token.value;
            if (cssValue.includes('duration-')) {
              // Extract duration value: "duration-75 motion-reduce:duration-[1ms]" -> "75ms"
              const durationMatch = cssValue.match(/duration-(\d+)/);
              if (durationMatch) {
                tokens[`--duration-${key}`] = `${durationMatch[1]}ms`;
              }
            }
          }
        }
        if (system.motion.easing) {
          console.log(
            `Processing motion.easing: ${Object.keys(system.motion.easing).length} tokens`
          );
          for (const [key, token] of Object.entries(system.motion.easing)) {
            // Convert easing utility classes to CSS values
            const cssValue = token.value;
            if (cssValue.includes('ease-')) {
              // Extract easing value: "ease-[cubic-bezier(...)]" -> "cubic-bezier(...)"
              const easingMatch = cssValue.match(/ease-\[([^\]]+)\]/);
              if (easingMatch) {
                tokens[`--ease-${key}`] = easingMatch[1];
              } else if (cssValue === 'ease-linear') {
                tokens[`--ease-${key}`] = 'linear';
              } else if (cssValue === 'ease-in-out') {
                tokens[`--ease-${key}`] = 'ease-in-out';
              } else if (cssValue === 'ease-out') {
                tokens[`--ease-${key}`] = 'ease-out';
              } else if (cssValue === 'ease-in') {
                tokens[`--ease-${key}`] = 'ease-in';
              }
            }
          }
        }
      }

      // Add missing standard tokens that Tailwind/components expect
      if (!tokens['--color-border'])
        tokens['--color-border'] = tokens['--color-muted'] || 'oklch(0.88 0.02 240)';
      if (!tokens['--color-input'])
        tokens['--color-input'] = tokens['--color-border'] || 'oklch(0.88 0.02 240)';
      if (!tokens['--color-ring'])
        tokens['--color-ring'] = tokens['--color-primary'] || 'oklch(0.45 0.12 240)';

      // Add border radius tokens (missing from system)
      tokens['--border-radius-sm'] = '0.125rem';
      tokens['--border-radius'] = '0.25rem';
      tokens['--border-radius-md'] = '0.375rem';
      tokens['--border-radius-lg'] = '0.5rem';
      tokens['--border-radius-xl'] = '0.75rem';
      tokens['--border-radius-2xl'] = '1rem';
      tokens['--border-radius-3xl'] = '1.5rem';

      console.log(`Total tokens extracted: ${Object.keys(tokens).length}`);
      return tokens;
    }

    // Fallback to API if direct access doesn't work
    if (module.designSystemsAPI) {
      console.log('Using design tokens from package API');
      const css = module.designSystemsAPI.exportCSS('000000');
      if (css) {
        // Extract token values from CSS
        const tokenPattern = /\s*(--[a-zA-Z0-9-]+):\s*([^;]+);/g;
        const tokens = {};
        let match = tokenPattern.exec(css);
        while (match !== null) {
          tokens[match[1]] = match[2].trim();
          match = tokenPattern.exec(css);
        }
        return tokens;
      }
    }
  } catch (error) {
    console.log('Cannot import design tokens package, using fallback tokens');
  }

  console.log('Using fallback token definitions');
  return FALLBACK_TOKENS;
}

/**
 * Generate complete Tailwind v4 stylesheet with design tokens, themes, and class mappings
 */
async function generateCSS() {
  try {
    console.log('Generating complete Tailwind v4 stylesheet...');

    const tokens = await getDesignTokens();

    // Generate complete Tailwind v4 stylesheet
    const stylesheet = `/**
 * GENERATED TAILWIND V4 STYLESHEET
 * 
 * This file is automatically generated from @rafters/design-tokens
 * DO NOT EDIT MANUALLY - Changes will be overwritten
 * 
 * Generated on: ${new Date().toISOString()}
 * Source: Rafters design token system
 */

@import "tailwindcss";

@theme {
  /* === DESIGN TOKENS === */
  /* All design tokens as CSS custom properties */
  
  /* Colors */
${Object.entries(tokens)
  .filter(([name]) => name.includes('color'))
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}

  /* Typography */
${Object.entries(tokens)
  .filter(([name]) => name.includes('font'))
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}

  /* Spacing */
${Object.entries(tokens)
  .filter(([name]) => name.includes('spacing'))
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}

  /* Border Radius */
${Object.entries(tokens)
  .filter(([name]) => name.includes('radius'))
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}

  /* Shadows */
${Object.entries(tokens)
  .filter(([name]) => name.includes('shadow'))
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}

  /* Motion */
${Object.entries(tokens)
  .filter(([name]) => name.includes('duration') || name.includes('ease'))
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}

  /* Opacity & Other */
${Object.entries(tokens)
  .filter(
    ([name]) =>
      !name.includes('color') &&
      !name.includes('font') &&
      !name.includes('spacing') &&
      !name.includes('radius') &&
      !name.includes('shadow') &&
      !name.includes('duration') &&
      !name.includes('ease')
  )
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}

}

/* === DARK THEME === */
@media (prefers-color-scheme: dark) {
  @theme {
    /* Dark theme token overrides */
    --color-background: oklch(0.09 0 0);
    --color-foreground: oklch(0.95 0 0);
    --color-primary: oklch(0.8 0 0);
    --color-primary-foreground: oklch(0.1 0 0);
    --color-secondary: oklch(0.15 0 0);
    --color-secondary-foreground: oklch(0.9 0 0);
    --color-muted: oklch(0.15 0 0);
    --color-muted-foreground: oklch(0.65 0 0);
    --color-accent: oklch(0.15 0 0);
    --color-accent-foreground: oklch(0.9 0 0);
    --color-popover: oklch(0.09 0 0);
    --color-popover-foreground: oklch(0.95 0 0);
    --color-card: oklch(0.09 0 0);
    --color-card-foreground: oklch(0.95 0 0);
    --color-border: oklch(0.27 0 0);
    --color-input: oklch(0.27 0 0);
  }
}`;

    await fs.writeFile(OUTPUT_FILES.css, stylesheet, 'utf8');
    console.log(`Generated complete Tailwind v4 stylesheet: ${OUTPUT_FILES.css}`);

    return true;
  } catch (error) {
    console.error('Failed to generate stylesheet:', error.message);
    return false;
  }
}

/**
 * Build all token outputs
 */
async function buildTokens() {
  console.log('Building complete Tailwind v4 stylesheet...');

  await ensureOutputDir();

  const success = await generateCSS();

  if (success) {
    console.log('Successfully built complete Tailwind v4 stylesheet');
  } else {
    console.log('Failed to build Tailwind v4 stylesheet');
  }

  return success;
}

/**
 * Watch for changes and rebuild
 */
async function startWatcher() {
  try {
    const chokidar = await import('chokidar');

    console.log('Watching for design token changes...');
    console.log('Watching patterns:');
    for (const pattern of WATCH_PATTERNS) {
      console.log(`  - ${pattern}`);
    }

    const watcher = chokidar.default.watch(WATCH_PATTERNS, {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/test/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      ignoreInitial: false,
      persistent: true,
    });

    // Debounce rebuilds to avoid excessive rebuilding
    let rebuildTimeout;
    const debouncedRebuild = () => {
      clearTimeout(rebuildTimeout);
      rebuildTimeout = setTimeout(async () => {
        console.log('\nDesign token files changed, rebuilding...');
        await buildTokens();
      }, 300);
    };

    watcher
      .on('add', (filePath) => {
        console.log(`Added: ${path.relative(process.cwd(), filePath)}`);
        debouncedRebuild();
      })
      .on('change', (filePath) => {
        console.log(`Changed: ${path.relative(process.cwd(), filePath)}`);
        debouncedRebuild();
      })
      .on('unlink', (filePath) => {
        console.log(`Removed: ${path.relative(process.cwd(), filePath)}`);
        debouncedRebuild();
      })
      .on('error', (error) => {
        console.error('Watcher error:', error);
      });

    return watcher;
  } catch (error) {
    console.error('Failed to import chokidar:', error.message);
    console.error('Install chokidar for watch mode: pnpm add -D chokidar');
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const isWatchMode = args.includes('--watch') || args.includes('-w');
  const isVerbose = args.includes('--verbose') || args.includes('-v');

  if (isVerbose) {
    console.log('Configuration:');
    console.log(`  Tokens package: ${TOKENS_PACKAGE_PATH}`);
    console.log(`  UI src dir: ${UI_SRC_DIR}`);
    console.log(`  Output file: ${OUTPUT_FILES.css}`);
    console.log('');
  }

  // Initial build
  const success = await buildTokens();

  if (!success) {
    console.error('Initial build failed');
    process.exit(1);
  }

  if (isWatchMode) {
    const watcher = await startWatcher();

    if (!watcher) {
      console.error('Failed to start watcher');
      process.exit(1);
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down token watcher...');
      watcher.close();
      process.exit(0);
    });

    console.log('\nToken watcher is running. Press Ctrl+C to stop.');
  } else {
    console.log('\nToken build complete. Use --watch to enable file watching.');
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Run main function
main().catch((error) => {
  console.error('Build script failed:', error);
  process.exit(1);
});
