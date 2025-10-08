import { describe, expect, it } from 'vitest';
import { extractBaseClasses, extractClassMappings } from './extract-preview-intelligence';

describe('extractBaseClasses', () => {
  it('should extract base classes from cn() first argument', async () => {
    const source = `cn('flex items-center justify-center', {...})`;
    const result = await extractBaseClasses(source);
    expect(result).toEqual(['flex', 'items-center', 'justify-center']);
  });

  it('should handle multiline cn() calls', async () => {
    const source = `
      cn(
        'inline-flex items-center',
        {...}
      )
    `;
    const result = await extractBaseClasses(source);
    expect(result).toEqual(['inline-flex', 'items-center']);
  });

  it('should return empty array when no cn() found', async () => {
    const source = `const foo = 'bar';`;
    const result = await extractBaseClasses(source);
    expect(result).toEqual([]);
  });
});

describe('extractClassMappings', () => {
  it('should extract variant mappings from conditional objects', async () => {
    const source = `cn('base', {
      'bg-primary text-white': variant === 'primary',
      'bg-secondary': variant === 'secondary',
    })`;
    const result = await extractClassMappings(source);

    expect(result).toEqual([
      {
        propName: 'variant',
        values: {
          primary: ['bg-primary', 'text-white'],
          secondary: ['bg-secondary'],
        },
      },
    ]);
  });

  it('should handle multiple prop groups', async () => {
    const source = `cn('base',
      { 'h-8': size === 'sm', 'h-10': size === 'md' },
      { 'rounded': shape === 'round' }
    )`;
    const result = await extractClassMappings(source);

    expect(result).toHaveLength(2);
    expect(result[0].propName).toBe('size');
    expect(result[0].values).toEqual({
      sm: ['h-8'],
      md: ['h-10'],
    });
    expect(result[1].propName).toBe('shape');
    expect(result[1].values).toEqual({
      round: ['rounded'],
    });
  });

  it('should handle complex class strings with pseudo-classes', async () => {
    const source = `cn({
      'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
    })`;
    const result = await extractClassMappings(source);

    expect(result[0].values.primary).toEqual([
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90',
    ]);
  });

  it('should return empty array when no conditional objects found', async () => {
    const source = `cn('flex items-center')`;
    const result = await extractClassMappings(source);
    expect(result).toEqual([]);
  });
});
