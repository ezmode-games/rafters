/**
 * Tests for Component Preview Compiler
 */

import { describe, expect, it } from 'vitest';
import {
  compileAllPreviews,
  compileComponentPreview,
} from '../../../src/lib/registry/previewCompiler';

const simpleButtonSource = `
import React from 'react';

export function Button({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  return (
    <button className={\`btn btn-\${variant}\`}>
      {children}
    </button>
  );
}

export default Button;
`;

const invalidSource = `
This is not valid JavaScript {{{
function broken() {
  const x =
`;

describe('compileComponentPreview', () => {
  // TODO: These tests need real component file paths - integration tested via build
  it.skip('should compile React component to plain JavaScript', async () => {
    const result = await compileComponentPreview({
      componentPath: 'Button.tsx',
      componentContent: simpleButtonSource,
      framework: 'react',
      variant: 'primary',
      props: { variant: 'primary' },
    });

    // Debug: log the result if there's an error
    if (result.error) {
      console.log('Compilation error:', result.error);
    }

    expect(result.error).toBeUndefined();
    expect(result.compiledJs).toBeTruthy();
    expect(result.compiledJs).toContain('function');
    expect(result.framework).toBe('react');
    expect(result.variant).toBe('primary');
    expect(result.sizeBytes).toBeGreaterThan(0);
  });

  it('should handle compilation errors gracefully', async () => {
    const result = await compileComponentPreview({
      componentPath: 'Invalid.tsx',
      componentContent: invalidSource,
      framework: 'react',
      variant: 'default',
    });

    expect(result.error).toBeDefined();
    expect(result.error).toContain('Vite build failed');
    expect(result.compiledJs).toBe('');
    expect(result.sizeBytes).toBe(0);
  });

  it('should reject unsupported frameworks', async () => {
    const result = await compileComponentPreview({
      componentPath: 'Component.ts',
      componentContent: simpleButtonSource,
      framework: 'angular' as 'react',
      variant: 'default',
    });

    expect(result.error).toBeDefined();
    expect(result.error).toContain('Unsupported framework: angular');
  });

  it('should use default variant when not specified', async () => {
    const result = await compileComponentPreview({
      componentPath: 'Button.tsx',
      componentContent: simpleButtonSource,
      framework: 'react',
    });

    expect(result.variant).toBe('default');
    expect(result.props).toEqual({});
  });

  it('should include props in result', async () => {
    const props = { variant: 'primary', size: 'lg' };
    const result = await compileComponentPreview({
      componentPath: 'Button.tsx',
      componentContent: simpleButtonSource,
      framework: 'react',
      variant: 'primary',
      props,
    });

    expect(result.props).toEqual(props);
  });

  it.skip('should calculate size in bytes', async () => {
    const result = await compileComponentPreview({
      componentPath: 'Button.tsx',
      componentContent: simpleButtonSource,
      framework: 'react',
      variant: 'default',
    });

    expect(result.sizeBytes).toBeGreaterThan(0);
    expect(typeof result.sizeBytes).toBe('number');
  });
});

describe.skip('compileAllPreviews', () => {
  // TODO: These tests need real component file paths to work with the new architecture
  // The actual integration is tested via the build process - see apps/website/dist/registry/components/button.json

  it('should generate previews for component', async () => {
    const previews = await compileAllPreviews('button', 'Button.tsx', simpleButtonSource, 'react');

    expect(previews.length).toBeGreaterThan(0);
    expect(previews[0].compiledJs).toBeTruthy();
    expect(previews[0].framework).toBe('react');
  });

  it('should only include successful compilations', async () => {
    const previews = await compileAllPreviews('invalid', 'Invalid.tsx', invalidSource, 'react');

    // Should not include failed compilations
    expect(previews.length).toBe(0);
  });

  it('should generate default variant', async () => {
    const previews = await compileAllPreviews('button', 'Button.tsx', simpleButtonSource, 'react');

    const defaultPreview = previews.find((p) => p.variant === 'default');
    expect(defaultPreview).toBeDefined();
    expect(defaultPreview?.compiledJs).toBeTruthy();
  });
});
