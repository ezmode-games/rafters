/**
 * Elegant API for design system CRUD operations
 * Small, focused, type-safe
 */

import type { OKLCH } from '@rafters/shared';
import Sqids from 'sqids';
import { z } from 'zod';
import { type SmartColorToken, createColorDesignSystem } from './color-tool.js';
import type { GrayscaleDesignSystem } from './grayscale.js';
import { GrayscaleDesignSystemSchema, defaultGrayscaleSystem } from './grayscale.js';

/**
 * Generate motion tokens for API exports (avoids circular dependency)
 */
const getMotionTokensForAPI = (): Array<{ name: string; value: string; category: string }> => {
  const tokens: Array<{ name: string; value: string; category: string }> = [];

  try {
    // Import motion objects at function level to avoid circular deps
    const { timing } = require('./motion/timing.js') as {
      timing: Record<string, { value: string }>;
    };
    const { easing } = require('./motion/easing.js') as {
      easing: Record<string, { value: string }>;
    };

    // Generate timing tokens from the actual timing objects
    for (const [key, token] of Object.entries(timing)) {
      if (typeof token === 'object' && token.value) {
        const durationMatch = token.value.match(/duration-(\d+)/);
        const duration = durationMatch ? `${durationMatch[1]}ms` : '300ms';

        tokens.push({
          name: `--duration-${key}`,
          value: duration,
          category: 'timing',
        });
      }
    }

    // Generate easing tokens from the actual easing objects
    for (const [key, token] of Object.entries(easing)) {
      if (typeof token === 'object' && token.value) {
        let cssValue: string = token.value;
        if (token.value.startsWith('ease-[')) {
          cssValue = token.value.replace('ease-[', '').replace(']', '');
        }

        tokens.push({
          name: `--ease-${key}`,
          value: cssValue,
          category: 'easing',
        });
      }
    }
  } catch (error) {
    // During testing or if motion modules aren't available, provide fallback tokens
    const fallbackTiming = {
      instant: '75ms',
      fast: '150ms',
      standard: '300ms',
      deliberate: '500ms',
      slow: '700ms',
      dramatic: '1000ms',
    };

    for (const [key, value] of Object.entries(fallbackTiming)) {
      tokens.push({
        name: `--duration-${key}`,
        value,
        category: 'timing',
      });
    }

    const fallbackEasing = {
      linear: 'ease-linear',
      smooth: 'ease-in-out',
      accelerating: 'ease-out',
      decelerating: 'ease-in',
      bouncy: 'cubic-bezier(0.175,0.885,0.32,1.275)',
      snappy: 'cubic-bezier(0.25,0.46,0.45,0.94)',
    };

    for (const [key, value] of Object.entries(fallbackEasing)) {
      tokens.push({
        name: `--ease-${key}`,
        value,
        category: 'easing',
      });
    }
  }

  return tokens;
};

/**
 * Design system with metadata
 */
const StoredDesignSystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  system: GrayscaleDesignSystemSchema,
  colorTokens: z.array(z.any()).optional(), // SmartColorToken[] for custom colors
});

type StoredDesignSystem = z.infer<typeof StoredDesignSystemSchema>;

/**
 * In-memory storage (replace with DB in production)
 */
class DesignSystemStore {
  private systems = new Map<string, StoredDesignSystem>();
  private sqids = new Sqids();

  constructor() {
    // Initialize with default grayscale
    this.systems.set('000000', {
      id: '000000',
      name: 'Grayscale Default',
      description: 'AI-intelligent grayscale design system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      system: defaultGrayscaleSystem,
    });
  }

  generateId(): string {
    return this.sqids.encode([Date.now()]);
  }

  get(id: string): StoredDesignSystem | null {
    return this.systems.get(id) || null;
  }

  list(): StoredDesignSystem[] {
    return Array.from(this.systems.values());
  }

  create(data: Omit<StoredDesignSystem, 'id' | 'createdAt' | 'updatedAt'>): StoredDesignSystem {
    const id = this.generateId();
    const now = new Date().toISOString();

    const system: StoredDesignSystem = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.systems.set(id, system);
    return system;
  }

  update(
    id: string,
    data: Partial<Omit<StoredDesignSystem, 'id' | 'createdAt'>>
  ): StoredDesignSystem | null {
    const existing = this.systems.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.systems.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    if (id === '000000') return false; // Can't delete default
    return this.systems.delete(id);
  }
}

/**
 * Singleton store instance
 */
const store = new DesignSystemStore();

/**
 * Clean public API
 */
export const designSystemsAPI = {
  /**
   * Get a design system by ID
   */
  get(id: string): StoredDesignSystem | null {
    return store.get(id);
  },

  /**
   * List all design systems
   */
  list(): StoredDesignSystem[] {
    return store.list();
  },

  /**
   * Create a new design system from a primary color
   */
  createFromColor(primaryColor: OKLCH, name: string, description?: string): StoredDesignSystem {
    // Generate complete color system
    const colorSystem = createColorDesignSystem(primaryColor);

    // Create a grayscale-based system with custom colors
    return store.create({
      name,
      description,
      system: defaultGrayscaleSystem, // Start with grayscale base
      colorTokens: colorSystem.allTokens,
    });
  },

  /**
   * Create a custom design system
   */
  create(system: GrayscaleDesignSystem, name: string, description?: string): StoredDesignSystem {
    return store.create({
      name,
      description,
      system,
    });
  },

  /**
   * Update a design system
   */
  update(
    id: string,
    updates: {
      name?: string;
      description?: string;
      system?: GrayscaleDesignSystem;
      colorTokens?: SmartColorToken[];
    }
  ): StoredDesignSystem | null {
    return store.update(id, updates);
  },

  /**
   * Delete a design system
   */
  delete(id: string): boolean {
    return store.delete(id);
  },

  /**
   * Export design system as CSS variables
   */
  exportCSS(id: string): string | null {
    const system = store.get(id);
    if (!system) return null;

    let css = ':root {\n';

    // Export grayscale tokens
    const tokens = [
      ...Object.values(system.system.colors),
      ...Object.values(system.system.typography),
      ...Object.values(system.system.spacing),
      ...Object.values(system.system.state),
      ...getMotionTokensForAPI(), // Use processed motion tokens
      ...Object.values(system.system.border),
      ...Object.values(system.system.shadow),
      ...Object.values(system.system.ring),
      ...Object.values(system.system.opacity),
    ];

    for (const token of tokens) {
      css += `  ${token.name}: ${token.value};\n`;
    }

    // Export custom color tokens if present
    if (system.colorTokens) {
      css += '\n  /* Custom Colors */\n';
      for (const token of system.colorTokens) {
        const t = token as SmartColorToken;
        if (t.states) {
          css += `  ${t.name}: oklch(${t.states.base.l} ${t.states.base.c} ${t.states.base.h});\n`;
          css += `  ${t.name}-hover: oklch(${t.states.hover.l} ${t.states.hover.c} ${t.states.hover.h});\n`;
          css += `  ${t.name}-focus: oklch(${t.states.focus.l} ${t.states.focus.c} ${t.states.focus.h});\n`;
          css += `  ${t.name}-active: oklch(${t.states.active.l} ${t.states.active.c} ${t.states.active.h});\n`;
        }
      }
    }

    css += '}\n';
    return css;
  },

  /**
   * Export as Tailwind v4 @theme
   */
  exportTailwind(id: string): string | null {
    const system = store.get(id);
    if (!system) return null;

    let theme = '@theme {\n';

    // Group tokens by category
    const categories: Record<string, Array<{ name: string; value: string; category: string }>> = {};

    const allTokens = [
      ...Object.values(system.system.colors),
      ...Object.values(system.system.typography),
      ...Object.values(system.system.spacing),
      ...Object.values(system.system.state),
      ...getMotionTokensForAPI(), // Use processed motion tokens
      ...Object.values(system.system.border),
      ...Object.values(system.system.shadow),
      ...Object.values(system.system.ring),
      ...Object.values(system.system.opacity),
    ];

    for (const token of allTokens) {
      const category = token.category;
      if (!categories[category]) categories[category] = [];
      categories[category].push(token);
    }

    // Output by category
    for (const [category, tokens] of Object.entries(categories)) {
      theme += `  /* ${category} */\n`;
      for (const token of tokens) {
        theme += `  ${token.name}: ${token.value};\n`;
      }
      theme += '\n';
    }

    theme += '}\n';
    return theme;
  },
};
