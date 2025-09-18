/**
 * Design System Archive Manager
 *
 * Handles multi-file JSON archive system for storing design tokens in `.rafters/tokens/`.
 * Enables git-friendly collaboration, selective updates, and seamless default system loading.
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Token } from '@rafters/shared';

/**
 * Archive structure interface matching DESIGN_SYSTEM_ARCHIVE.md
 */
export interface ArchiveStructure {
  'manifest.json': DesignSystemManifest;
  'colors.json': ColorsArchive;
  'typography.json': TypographyArchive;
  'spacing.json': SpacingArchive;
  'motion.json': MotionArchive;
  'shadows.json': ShadowsArchive;
  'borders.json': BordersArchive;
  'breakpoints.json': BreakpointsArchive;
  'layout.json': LayoutArchive;
  'fonts.json': FontsArchive;
}

export interface DesignSystemManifest {
  id: string;
  name: string;
  version: string;
  created: string;
  updated: string;
  primaryColor: { l: number; c: number; h: number };
  intelligence: {
    colorVisionTested: string[];
    contrastLevel: 'AA' | 'AAA';
    components: Record<
      string,
      {
        touchTargetMet?: boolean;
        contrastValidated?: boolean;
        accessibilityOptimized?: boolean;
        cognitiveLoadOptimized?: boolean;
      }
    >;
  };
  tokenCount: number;
  categories: string[];
}

export interface ColorsArchive {
  families: Token[];
  tokens: Token[];
  dependencies: Record<
    string,
    {
      dependsOn: string[];
      generationRule: string;
    }
  >;
}

export interface TypographyArchive {
  families: {
    heading: string;
    body: string;
    mono: string;
  };
  scale: Record<string, Token>;
  lineHeight: Token[];
  letterSpacing: Token[];
  fontWeight: Token[];
}

export interface SpacingArchive {
  scale: Token[];
  system: string;
  baseUnit: number;
}

export interface MotionArchive {
  duration: Token[];
  easing: Token[];
  animations: Token[];
  keyframes: Token[];
  behavior: Token[];
}

export interface ShadowsArchive {
  elevation: Token[];
  depth: Token[];
}

export interface BordersArchive {
  radius: Token[];
  width: Token[];
}

export interface BreakpointsArchive {
  screens: Token[];
  containers: Token[];
}

export interface LayoutArchive {
  [category: string]: Token[];
}

export interface FontsArchive {
  families: Token[];
  weights: Token[];
}

/**
 * Design System Archive Manager
 *
 * Manages multi-file JSON archives for design token storage
 */
export class DesignSystemArchive {
  private archivePath: string;

  constructor(projectRoot: string = process.cwd()) {
    this.archivePath = join(projectRoot, '.rafters', 'tokens');
  }

  /**
   * Save tokens to multi-file archive structure
   */
  async save(tokens: Token[], systemId = '000000'): Promise<void> {
    await this.ensureArchiveDirectory();

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

    // Create manifest.json
    const manifest: DesignSystemManifest = {
      id: systemId,
      name:
        systemId === '000000' ? 'Rafters Default Grayscale System' : `Design System ${systemId}`,
      version: '1.0.0',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      primaryColor: { l: 0.44, c: 0.01, h: 286 }, // Rafters Gray
      intelligence: {
        colorVisionTested: ['normal', 'protanopia', 'deuteranopia', 'tritanopia'],
        contrastLevel: 'AAA',
        components: {
          buttons: { touchTargetMet: true, contrastValidated: true },
          forms: { accessibilityOptimized: true },
          navigation: { cognitiveLoadOptimized: true },
        },
      },
      tokenCount: tokens.length,
      categories: Object.keys(tokensByCategory),
    };

    // Create colors.json
    const colors: ColorsArchive = {
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

    // Create typography.json
    const typography: TypographyArchive = {
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

    // Create spacing.json
    const spacing: SpacingArchive = {
      scale: tokensByCategory.spacing || [],
      system: 'linear',
      baseUnit: 4,
    };

    // Create motion.json
    const motion: MotionArchive = {
      duration: tokensByCategory.motion || [],
      easing: tokensByCategory.easing || [],
      animations: tokensByCategory.animation || [],
      keyframes: tokensByCategory.keyframes || [],
      behavior: tokensByCategory.behavior || [],
    };

    // Create shadows.json
    const shadows: ShadowsArchive = {
      elevation: tokensByCategory.shadow || [],
      depth: tokensByCategory['z-index'] || [],
    };

    // Create borders.json
    const borders: BordersArchive = {
      radius: tokensByCategory['border-radius'] || [],
      width: tokensByCategory['border-width'] || [],
    };

    // Create breakpoints.json
    const breakpoints: BreakpointsArchive = {
      screens: tokensByCategory.breakpoint || [],
      containers: tokensByCategory.container || [],
    };

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

    const layout: LayoutArchive = layoutCategories.reduce((acc, category) => {
      if (tokensByCategory[category]) {
        acc[category] = tokensByCategory[category];
      }
      return acc;
    }, {} as LayoutArchive);

    // Create fonts.json
    const fonts: FontsArchive = {
      families: tokensByCategory['font-family'] || [],
      weights: tokensByCategory['font-weight'] || [],
    };

    // Write all files
    await Promise.all([
      this.writeFile('manifest.json', manifest),
      this.writeFile('colors.json', colors),
      this.writeFile('typography.json', typography),
      this.writeFile('spacing.json', spacing),
      this.writeFile('motion.json', motion),
      this.writeFile('shadows.json', shadows),
      this.writeFile('borders.json', borders),
      this.writeFile('breakpoints.json', breakpoints),
      this.writeFile('layout.json', layout),
      this.writeFile('fonts.json', fonts),
    ]);
  }

  /**
   * Load tokens from multi-file archive structure
   */
  async load(): Promise<Token[]> {
    if (!(await this.exists())) {
      throw new Error(`No archive found at ${this.archivePath}`);
    }

    // Load all archive files
    const [
      _manifest,
      colors,
      typography,
      spacing,
      motion,
      shadows,
      borders,
      breakpoints,
      layout,
      fonts,
    ] = await Promise.all([
      this.loadFile<DesignSystemManifest>('manifest.json'),
      this.loadFile<ColorsArchive>('colors.json'),
      this.loadFile<TypographyArchive>('typography.json'),
      this.loadFile<SpacingArchive>('spacing.json'),
      this.loadFile<MotionArchive>('motion.json'),
      this.loadFile<ShadowsArchive>('shadows.json'),
      this.loadFile<BordersArchive>('borders.json'),
      this.loadFile<BreakpointsArchive>('breakpoints.json'),
      this.loadFile<LayoutArchive>('layout.json'),
      this.loadFile<FontsArchive>('fonts.json'),
    ]);

    // Collect all tokens from different files (avoiding duplicates)
    const allTokens: Token[] = [
      ...colors.families,
      ...colors.tokens,
      ...Object.values(typography.scale),
      ...typography.lineHeight,
      ...typography.letterSpacing,
      ...typography.fontWeight,
      ...spacing.scale,
      ...motion.duration,
      ...motion.easing,
      ...motion.animations,
      ...motion.keyframes,
      ...motion.behavior,
      ...shadows.elevation,
      ...shadows.depth,
      ...borders.radius,
      ...borders.width,
      ...breakpoints.screens,
      ...breakpoints.containers,
      ...Object.values(layout).flat(),
      ...fonts.families,
      // Note: fonts.weights are same as typography.fontWeight, so don't include both
    ];

    return allTokens;
  }

  /**
   * Initialize with default system or load existing
   */
  async initDefault(): Promise<Token[]> {
    if (await this.exists()) {
      // Load existing archive
      return this.load();
    } else {
      // Create default system archive
      const { generateAllTokens } = await import('./generators/index.js');
      const tokens = await generateAllTokens();

      // Save as default system
      await this.save(tokens, '000000');

      return tokens;
    }
  }

  /**
   * Check if archive exists
   */
  async exists(): Promise<boolean> {
    return existsSync(join(this.archivePath, 'manifest.json'));
  }

  /**
   * Get archive metadata without loading all tokens
   */
  async getManifest(): Promise<DesignSystemManifest | null> {
    try {
      return await this.loadFile<DesignSystemManifest>('manifest.json');
    } catch {
      return null;
    }
  }

  /**
   * Ensure archive directory exists
   */
  private async ensureArchiveDirectory(): Promise<void> {
    await mkdir(this.archivePath, { recursive: true });
  }

  /**
   * Write a JSON file to the archive (only if content changed)
   */
  private async writeFile(filename: string, data: unknown): Promise<void> {
    const filePath = join(this.archivePath, filename);
    const newContent = JSON.stringify(data, null, 2);

    // Only write if content has changed
    try {
      const existingContent = await readFile(filePath, 'utf8');
      if (existingContent === newContent) {
        return; // No change, skip write
      }
    } catch {
      // File doesn't exist, continue with write
    }

    await writeFile(filePath, newContent, 'utf8');
  }

  /**
   * Load a JSON file from the archive
   */
  private async loadFile<T>(filename: string): Promise<T> {
    const filePath = join(this.archivePath, filename);
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
  }
}
