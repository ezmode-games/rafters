/**
 * Tests for Component Class Intelligence Extractor
 * Tests CVA-based extraction for Button and Input components
 */

import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  type ClassMapping,
  extractBaseClasses,
  extractClassMappings,
  type PreviewIntelligence,
  processComponent,
} from '../../scripts/extract-preview-intelligence';

describe('extractBaseClasses', () => {
  it('should extract base classes from cva() first argument', async () => {
    const source = `
      const buttonVariants = cva(
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        {
          variants: {
            variant: {
              primary: 'bg-primary text-primary-foreground',
            }
          }
        }
      );
    `;

    const baseClasses = await extractBaseClasses(source);

    expect(baseClasses).toEqual([
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'text-sm',
      'font-medium',
    ]);
  });

  it('should handle cva() with long base class string', async () => {
    const source = `
      const inputVariants = cva(
        'flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2',
        {
          variants: {}
        }
      );
    `;

    const baseClasses = await extractBaseClasses(source);

    expect(baseClasses).toContain('flex');
    expect(baseClasses).toContain('h-10');
    expect(baseClasses).toContain('w-full');
    expect(baseClasses).toContain('focus-visible:ring-2');
    expect(baseClasses).toContain('file:border-0');
  });

  it('should return empty array when no cva() call found', async () => {
    const source = `const className = 'some-class'`;
    const baseClasses = await extractBaseClasses(source);
    expect(baseClasses).toEqual([]);
  });

  it('should handle cva() with empty base classes', async () => {
    const source = `const variants = cva('', { variants: {} });`;
    const baseClasses = await extractBaseClasses(source);
    expect(baseClasses).toEqual([]);
  });
});

describe('extractClassMappings', () => {
  it('should extract variant prop mappings from cva() config', async () => {
    const source = `
      const buttonVariants = cva(
        'base-class',
        {
          variants: {
            variant: {
              primary: 'bg-primary text-primary-foreground',
              secondary: 'bg-secondary text-secondary-foreground',
            }
          }
        }
      );
    `;

    const mappings = await extractClassMappings(source);

    expect(mappings).toHaveLength(1);
    expect(mappings[0]).toEqual({
      propName: 'variant',
      values: {
        primary: ['bg-primary', 'text-primary-foreground'],
        secondary: ['bg-secondary', 'text-secondary-foreground'],
      },
    });
  });

  it('should extract multiple prop groups from cva() config', async () => {
    const source = `
      const buttonVariants = cva(
        'base-class',
        {
          variants: {
            variant: {
              primary: 'bg-primary',
              secondary: 'bg-secondary',
            },
            size: {
              sm: 'h-8 px-3 text-xs',
              md: 'h-10 px-4',
              lg: 'h-12 px-6 text-base',
            }
          }
        }
      );
    `;

    const mappings = await extractClassMappings(source);

    expect(mappings).toHaveLength(2);

    const variantMapping = mappings.find((m) => m.propName === 'variant');
    expect(variantMapping).toBeDefined();
    expect(variantMapping?.values).toEqual({
      primary: ['bg-primary'],
      secondary: ['bg-secondary'],
    });

    const sizeMapping = mappings.find((m) => m.propName === 'size');
    expect(sizeMapping).toBeDefined();
    expect(sizeMapping?.values).toEqual({
      sm: ['h-8', 'px-3', 'text-xs'],
      md: ['h-10', 'px-4'],
      lg: ['h-12', 'px-6', 'text-base'],
    });
  });

  it('should handle Button.tsx variant structure', async () => {
    const source = `
      const buttonVariants = cva(
        'inline-flex items-center',
        {
          variants: {
            variant: {
              primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
              destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              outline: 'border border-input bg-background hover:bg-accent',
              ghost: 'hover:bg-accent hover:text-accent-foreground',
            },
            size: {
              sm: 'h-8 px-3 text-xs',
              md: 'h-10 px-4',
              lg: 'h-12 px-6 text-base',
              full: 'h-12 px-6 text-base w-full',
            },
          }
        }
      );
    `;

    const mappings = await extractClassMappings(source);

    const variantMapping = mappings.find((m) => m.propName === 'variant');
    expect(variantMapping?.values.primary).toEqual([
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90',
    ]);
    expect(variantMapping?.values.outline).toContain('border');
    expect(variantMapping?.values.outline).toContain('border-input');

    const sizeMapping = mappings.find((m) => m.propName === 'size');
    expect(sizeMapping?.values.full).toContain('w-full');
  });

  it('should handle Input.tsx variant structure with boolean variants', async () => {
    const source = `
      const inputVariants = cva(
        'flex h-10',
        {
          variants: {
            variant: {
              default: 'border-input bg-background',
              error: 'border-destructive bg-destructive/10',
              success: 'border-success bg-success/10',
            },
            sensitive: {
              true: 'shadow-sm border-2',
              false: '',
            },
          }
        }
      );
    `;

    const mappings = await extractClassMappings(source);

    const variantMapping = mappings.find((m) => m.propName === 'variant');
    expect(variantMapping?.values.error).toContain('border-destructive');
    expect(variantMapping?.values.error).toContain('bg-destructive/10');

    const sensitiveMapping = mappings.find((m) => m.propName === 'sensitive');
    expect(sensitiveMapping?.values.true).toEqual(['shadow-sm', 'border-2']);
    expect(sensitiveMapping?.values.false).toEqual([]);
  });

  it('should return empty array when no variants found', async () => {
    const source = `const className = 'some-class'`;
    const mappings = await extractClassMappings(source);
    expect(mappings).toEqual([]);
  });

  it('should return empty array when variants object is empty', async () => {
    const source = `const variants = cva('base', { variants: {} });`;
    const mappings = await extractClassMappings(source);
    expect(mappings).toEqual([]);
  });
});

describe('processComponent', () => {
  it('should extract complete intelligence from Button.tsx', async () => {
    const buttonPath = join(process.cwd(), 'src/components/Button.tsx');
    const intelligence = await processComponent(buttonPath);

    // Validate structure
    expect(intelligence).toMatchObject({
      component: expect.any(String),
      baseClasses: expect.any(Array),
      propMappings: expect.any(Array),
      allClasses: expect.any(Array),
    });

    // Component name
    expect(intelligence.component).toBe('button');

    // Base classes from cva() first argument
    expect(intelligence.baseClasses).toContain('inline-flex');
    expect(intelligence.baseClasses).toContain('items-center');
    expect(intelligence.baseClasses).toContain('justify-center');
    expect(intelligence.baseClasses).toContain('rounded-md');
    expect(intelligence.baseClasses).toContain('text-sm');
    expect(intelligence.baseClasses).toContain('font-medium');

    // Prop mappings - should have variant and size
    expect(intelligence.propMappings.length).toBeGreaterThanOrEqual(2);

    const variantMapping = intelligence.propMappings.find((m) => m.propName === 'variant');
    expect(variantMapping).toBeDefined();
    expect(variantMapping?.propName).toBe('variant');
    expect(Object.keys(variantMapping?.values || {})).toContain('primary');
    expect(Object.keys(variantMapping?.values || {})).toContain('destructive');

    const sizeMapping = intelligence.propMappings.find((m) => m.propName === 'size');
    expect(sizeMapping).toBeDefined();
    expect(sizeMapping?.propName).toBe('size');
    expect(Object.keys(sizeMapping?.values || {})).toContain('sm');
    expect(Object.keys(sizeMapping?.values || {})).toContain('md');
    expect(Object.keys(sizeMapping?.values || {})).toContain('lg');

    // All classes should be collected
    expect(intelligence.allClasses.length).toBeGreaterThan(0);
    expect(intelligence.allClasses).toContain('inline-flex');
    expect(intelligence.allClasses).toContain('bg-primary');
  });

  it('should extract complete intelligence from Input.tsx', async () => {
    const inputPath = join(process.cwd(), 'src/components/Input.tsx');
    const intelligence = await processComponent(inputPath);

    // Validate structure
    expect(intelligence).toMatchObject({
      component: expect.any(String),
      baseClasses: expect.any(Array),
      propMappings: expect.any(Array),
      allClasses: expect.any(Array),
    });

    // Component name
    expect(intelligence.component).toBe('input');

    // Base classes
    expect(intelligence.baseClasses).toContain('flex');
    expect(intelligence.baseClasses).toContain('h-10');
    expect(intelligence.baseClasses).toContain('w-full');
    expect(intelligence.baseClasses).toContain('rounded-md');
    expect(intelligence.baseClasses).toContain('border');

    // Prop mappings - should have variant and sensitive
    expect(intelligence.propMappings.length).toBeGreaterThanOrEqual(2);

    const variantMapping = intelligence.propMappings.find((m) => m.propName === 'variant');
    expect(variantMapping).toBeDefined();
    expect(Object.keys(variantMapping?.values || {})).toContain('default');
    expect(Object.keys(variantMapping?.values || {})).toContain('error');
    expect(Object.keys(variantMapping?.values || {})).toContain('success');

    const sensitiveMapping = intelligence.propMappings.find((m) => m.propName === 'sensitive');
    expect(sensitiveMapping).toBeDefined();
    expect(Object.keys(sensitiveMapping?.values || {})).toContain('true');
    expect(Object.keys(sensitiveMapping?.values || {})).toContain('false');

    // All classes should be collected
    expect(intelligence.allClasses.length).toBeGreaterThan(0);
    expect(intelligence.allClasses).toContain('flex');
    expect(intelligence.allClasses).toContain('border-destructive');
  });

  it('should handle component file not found', async () => {
    const invalidPath = join(process.cwd(), 'src/components/NonExistent.tsx');

    await expect(processComponent(invalidPath)).rejects.toThrow();
  });
});

describe('extraction accuracy - Button.tsx', () => {
  it('should extract all Button variant values', async () => {
    const buttonPath = join(process.cwd(), 'src/components/Button.tsx');
    const intelligence = await processComponent(buttonPath);

    const variantMapping = intelligence.propMappings.find((m) => m.propName === 'variant');
    expect(variantMapping).toBeDefined();

    const expectedVariants = [
      'primary',
      'secondary',
      'destructive',
      'success',
      'warning',
      'info',
      'outline',
      'ghost',
    ];

    const extractedVariants = Object.keys(variantMapping?.values || {});

    for (const variant of expectedVariants) {
      expect(extractedVariants).toContain(variant);
    }

    // Verify specific variant classes
    expect(variantMapping?.values.primary).toContain('bg-primary');
    expect(variantMapping?.values.primary).toContain('text-primary-foreground');
    expect(variantMapping?.values.destructive).toContain('bg-destructive');
    expect(variantMapping?.values.outline).toContain('border');
    expect(variantMapping?.values.ghost).toContain('hover:bg-accent');
  });

  it('should extract all Button size values', async () => {
    const buttonPath = join(process.cwd(), 'src/components/Button.tsx');
    const intelligence = await processComponent(buttonPath);

    const sizeMapping = intelligence.propMappings.find((m) => m.propName === 'size');
    expect(sizeMapping).toBeDefined();

    const expectedSizes = ['sm', 'md', 'lg', 'full'];
    const extractedSizes = Object.keys(sizeMapping?.values || {});

    for (const size of expectedSizes) {
      expect(extractedSizes).toContain(size);
    }

    // Verify specific size classes
    expect(sizeMapping?.values.sm).toEqual(['h-8', 'px-3', 'text-xs']);
    expect(sizeMapping?.values.md).toEqual(['h-10', 'px-4']);
    expect(sizeMapping?.values.lg).toEqual(['h-12', 'px-6', 'text-base']);
    expect(sizeMapping?.values.full).toContain('w-full');
  });

  it('should include hover and state classes in Button variants', async () => {
    const buttonPath = join(process.cwd(), 'src/components/Button.tsx');
    const intelligence = await processComponent(buttonPath);

    const variantMapping = intelligence.propMappings.find((m) => m.propName === 'variant');

    // Check that hover states are preserved
    expect(variantMapping?.values.primary).toContain('hover:bg-primary/90');
    expect(variantMapping?.values.secondary).toContain('hover:bg-secondary/80');
    expect(variantMapping?.values.outline).toContain('hover:bg-accent');
  });
});

describe('extraction accuracy - Input.tsx', () => {
  it('should extract all Input variant values', async () => {
    const inputPath = join(process.cwd(), 'src/components/Input.tsx');
    const intelligence = await processComponent(inputPath);

    const variantMapping = intelligence.propMappings.find((m) => m.propName === 'variant');
    expect(variantMapping).toBeDefined();

    const expectedVariants = ['default', 'error', 'success', 'warning'];
    const extractedVariants = Object.keys(variantMapping?.values || {});

    for (const variant of expectedVariants) {
      expect(extractedVariants).toContain(variant);
    }

    // Verify specific variant classes
    expect(variantMapping?.values.default).toContain('border-input');
    expect(variantMapping?.values.default).toContain('bg-background');
    expect(variantMapping?.values.error).toContain('border-destructive');
    expect(variantMapping?.values.error).toContain('bg-destructive/10');
    expect(variantMapping?.values.success).toContain('border-success');
    expect(variantMapping?.values.warning).toContain('border-warning');
  });

  it('should extract Input sensitive boolean variant', async () => {
    const inputPath = join(process.cwd(), 'src/components/Input.tsx');
    const intelligence = await processComponent(inputPath);

    const sensitiveMapping = intelligence.propMappings.find((m) => m.propName === 'sensitive');
    expect(sensitiveMapping).toBeDefined();

    const extractedValues = Object.keys(sensitiveMapping?.values || {});
    expect(extractedValues).toContain('true');
    expect(extractedValues).toContain('false');

    // Verify classes
    expect(sensitiveMapping?.values.true).toContain('shadow-sm');
    expect(sensitiveMapping?.values.true).toContain('border-2');
    expect(sensitiveMapping?.values.false).toEqual([]);
  });

  it('should include focus-visible states in Input base classes', async () => {
    const inputPath = join(process.cwd(), 'src/components/Input.tsx');
    const intelligence = await processComponent(inputPath);

    // Check that focus-visible is in base classes or all classes
    const hasFocusVisible = intelligence.allClasses.some((c) => c.includes('focus-visible'));
    expect(hasFocusVisible).toBe(true);
  });
});

describe('ClassMapping interface compliance', () => {
  it('should produce ClassMapping objects with propName and values Record', async () => {
    const source = `
      const variants = cva('base', {
        variants: {
          variant: {
            primary: 'bg-primary',
            secondary: 'bg-secondary',
          },
          size: {
            sm: 'h-8',
            lg: 'h-12',
          }
        }
      });
    `;

    const mappings = await extractClassMappings(source);

    for (const mapping of mappings) {
      // Validate interface structure
      expect(mapping).toHaveProperty('propName');
      expect(mapping).toHaveProperty('values');
      expect(typeof mapping.propName).toBe('string');
      expect(typeof mapping.values).toBe('object');

      // Validate values is Record<string, string[]>
      for (const [key, value] of Object.entries(mapping.values)) {
        expect(typeof key).toBe('string');
        expect(Array.isArray(value)).toBe(true);
        for (const className of value) {
          expect(typeof className).toBe('string');
        }
      }
    }
  });

  it('should match ClassMapping TypeScript interface', () => {
    const mockMapping: ClassMapping = {
      propName: 'variant',
      values: {
        primary: ['bg-primary', 'text-white'],
        secondary: ['bg-secondary'],
      },
    };

    expect(mockMapping.propName).toBe('variant');
    expect(Object.keys(mockMapping.values)).toContain('primary');
    expect(mockMapping.values.primary).toEqual(['bg-primary', 'text-white']);
  });

  it('should match PreviewIntelligence TypeScript interface', () => {
    const mockIntelligence: PreviewIntelligence = {
      component: 'button',
      baseClasses: ['inline-flex', 'items-center'],
      propMappings: [
        {
          propName: 'variant',
          values: {
            primary: ['bg-primary'],
          },
        },
      ],
      allClasses: ['inline-flex', 'items-center', 'bg-primary'],
    };

    expect(mockIntelligence.component).toBe('button');
    expect(mockIntelligence.baseClasses).toContain('inline-flex');
    expect(mockIntelligence.propMappings[0].propName).toBe('variant');
    expect(mockIntelligence.allClasses).toContain('bg-primary');
  });
});

describe('performance', () => {
  it('should process Button.tsx in under 100ms', async () => {
    const buttonPath = join(process.cwd(), 'src/components/Button.tsx');
    const start = Date.now();
    await processComponent(buttonPath);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });

  it('should process Input.tsx in under 100ms', async () => {
    const inputPath = join(process.cwd(), 'src/components/Input.tsx');
    const start = Date.now();
    await processComponent(inputPath);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
