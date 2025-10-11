/**
 * Tests for Component Preview Compiler
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  compileAllPreviews,
  compileComponentPreview,
} from '../../../src/lib/registry/previewCompiler';

const FIXTURES_DIR = join(__dirname, '../../fixtures/components');
const TEST_BUTTON_PATH = join(FIXTURES_DIR, 'TestButton.tsx');
const INVALID_COMPONENT_PATH = join(FIXTURES_DIR, 'InvalidComponent.tsx');
const testButtonSource = readFileSync(TEST_BUTTON_PATH, 'utf-8');
const invalidComponentSource = readFileSync(INVALID_COMPONENT_PATH, 'utf-8');

describe('compileComponentPreview', () => {
  it('should compile React component to plain JavaScript', async () => {
    const result = await compileComponentPreview({
      componentPath: TEST_BUTTON_PATH,
      componentContent: testButtonSource,
      framework: 'react',
      variant: 'primary',
      props: { variant: 'primary' },
    });

    expect(result.error).toBeUndefined();
    expect(result.compiledJs).toBeTruthy();
    expect(result.compiledJs.length).toBeGreaterThan(0);
    expect(result.framework).toBe('react');
    expect(result.variant).toBe('primary');
    expect(result.sizeBytes).toBeGreaterThan(0);
  });

  it('should handle compilation errors gracefully', async () => {
    const result = await compileComponentPreview({
      componentPath: INVALID_COMPONENT_PATH,
      componentContent: invalidComponentSource,
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
      componentPath: TEST_BUTTON_PATH,
      componentContent: testButtonSource,
      framework: 'angular' as 'react',
      variant: 'default',
    });

    expect(result.error).toBeDefined();
    expect(result.error).toContain('Unsupported framework: angular');
  });

  it('should use default variant when not specified', async () => {
    const result = await compileComponentPreview({
      componentPath: TEST_BUTTON_PATH,
      componentContent: testButtonSource,
      framework: 'react',
    });

    expect(result.variant).toBe('default');
    expect(result.props).toEqual({});
  });

  it('should include props in result', async () => {
    const props = { variant: 'primary', size: 'lg' };
    const result = await compileComponentPreview({
      componentPath: TEST_BUTTON_PATH,
      componentContent: testButtonSource,
      framework: 'react',
      variant: 'primary',
      props,
    });

    expect(result.props).toEqual(props);
  });

  it('should calculate size in bytes', async () => {
    const result = await compileComponentPreview({
      componentPath: TEST_BUTTON_PATH,
      componentContent: testButtonSource,
      framework: 'react',
      variant: 'default',
    });

    expect(result.sizeBytes).toBeGreaterThan(0);
    expect(typeof result.sizeBytes).toBe('number');
  });
});

describe('compileAllPreviews', () => {
  const mockCVA = {
    baseClasses: ['inline-flex', 'items-center'],
    propMappings: [
      {
        propName: 'variant',
        values: {
          primary: ['bg-blue-600', 'text-white'],
          secondary: ['bg-gray-200', 'text-gray-900'],
        },
      },
    ],
    allClasses: ['inline-flex', 'items-center', 'bg-blue-600', 'text-white', 'bg-gray-200', 'text-gray-900'],
    css: '.inline-flex { display: inline-flex; }',
  };
  const mockCSS = '.inline-flex { display: inline-flex; }';
  const mockDependencies = ['react', 'class-variance-authority'];

  it('should generate previews for component with CVA, CSS, and dependencies', async () => {
    const previews = await compileAllPreviews(
      'button',
      TEST_BUTTON_PATH,
      testButtonSource,
      'react',
      mockCVA,
      mockCSS,
      mockDependencies
    );

    expect(previews.length).toBeGreaterThan(0);
    expect(previews[0].compiledJs).toBeTruthy();
    expect(previews[0].framework).toBe('react');
    expect(previews[0].cva).toEqual(mockCVA);
    expect(previews[0].css).toBe(mockCSS);
    expect(previews[0].dependencies).toEqual(mockDependencies);
  });

  it('should only include successful compilations', async () => {
    const previews = await compileAllPreviews(
      'invalid',
      INVALID_COMPONENT_PATH,
      invalidComponentSource,
      'react',
      mockCVA,
      mockCSS,
      mockDependencies
    );

    // Should not include failed compilations
    expect(previews.length).toBe(0);
  });

  it('should generate default variant with rendering requirements', async () => {
    const previews = await compileAllPreviews(
      'button',
      TEST_BUTTON_PATH,
      testButtonSource,
      'react',
      mockCVA,
      mockCSS,
      mockDependencies
    );

    const defaultPreview = previews.find((p) => p.variant === 'default');
    expect(defaultPreview).toBeDefined();
    expect(defaultPreview?.compiledJs).toBeTruthy();
    expect(defaultPreview?.cva).toEqual(mockCVA);
    expect(defaultPreview?.css).toBe(mockCSS);
    expect(defaultPreview?.dependencies).toEqual(mockDependencies);
  });
});
