/**
 * Tests for Component Preview Compiler
 * Using fixture generators instead of inline mocks
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PreviewSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { createCVAIntelligenceFixture } from '../../../../../packages/shared/test/fixtures.js';
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

    // Validate compiled output contains IIFE wrapper
    expect(result.compiledJs).toContain('ComponentPreview');
  });

  it('should externalize React and dependencies correctly', async () => {
    const result = await compileComponentPreview({
      componentPath: TEST_BUTTON_PATH,
      componentContent: testButtonSource,
      framework: 'react',
      variant: 'default',
    });

    expect(result.error).toBeUndefined();
    // Check that external dependencies are not bundled
    expect(result.compiledJs).not.toContain('function createElement');
    expect(result.compiledJs).not.toContain('react-dom');
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

  it('should produce valid IIFE format', async () => {
    const result = await compileComponentPreview({
      componentPath: TEST_BUTTON_PATH,
      componentContent: testButtonSource,
      framework: 'react',
      variant: 'default',
    });

    expect(result.error).toBeUndefined();
    // IIFE should define ComponentPreview global
    expect(result.compiledJs).toMatch(/var ComponentPreview\s*=/);
  });
});

describe('compileAllPreviews', () => {
  it('should generate previews with CVA, CSS, and dependencies using fixtures', async () => {
    // Use fixture generator instead of inline mock
    const mockCVA = createCVAIntelligenceFixture({
      seed: 42,
      overrides: {
        baseClasses: ['inline-flex', 'items-center'],
      },
    });
    const mockCSS = '.inline-flex { display: inline-flex; }';
    const mockDependencies = ['react', 'class-variance-authority'];

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

    // Validate against Preview schema
    expect(PreviewSchema.parse(previews[0])).toBeTruthy();
  });

  it('should only include successful compilations', async () => {
    const mockCVA = createCVAIntelligenceFixture({ seed: 42 });
    const mockCSS = '.test { color: red; }';
    const mockDependencies = ['react'];

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

  it('should generate default variant with all required Preview fields', async () => {
    const mockCVA = createCVAIntelligenceFixture({ seed: 42 });
    const mockCSS = '.button { padding: 8px; }';
    const mockDependencies = ['react', '@rafters/shared'];

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

    if (defaultPreview) {
      // Validate all required fields are present
      expect(defaultPreview.compiledJs).toBeTruthy();
      expect(defaultPreview.cva).toEqual(mockCVA);
      expect(defaultPreview.css).toBe(mockCSS);
      expect(defaultPreview.dependencies).toEqual(mockDependencies);
      expect(defaultPreview.framework).toBe('react');
      expect(defaultPreview.variant).toBe('default');

      // Schema validation ensures all fields are correct
      const validated = PreviewSchema.parse(defaultPreview);
      expect(validated).toBeTruthy();
    }
  });

  it('should generate deterministic previews with fixture seeds', async () => {
    const mockCVA1 = createCVAIntelligenceFixture({ seed: 100 });
    const mockCVA2 = createCVAIntelligenceFixture({ seed: 100 });

    // Same seed should produce same CVA
    expect(mockCVA1).toEqual(mockCVA2);

    const previews1 = await compileAllPreviews(
      'button',
      TEST_BUTTON_PATH,
      testButtonSource,
      'react',
      mockCVA1,
      '.test {}',
      ['react']
    );

    const previews2 = await compileAllPreviews(
      'button',
      TEST_BUTTON_PATH,
      testButtonSource,
      'react',
      mockCVA2,
      '.test {}',
      ['react']
    );

    // CVA should be identical due to seed
    expect(previews1[0]?.cva).toEqual(previews2[0]?.cva);
  });
});
