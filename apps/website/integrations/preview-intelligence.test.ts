import { describe, expect, it } from 'vitest';
import { previewIntelligence } from './preview-intelligence';

describe('previewIntelligence', () => {
  it('should create valid Astro integration', () => {
    const integration = previewIntelligence();

    expect(integration.name).toBe('rafters-preview-intelligence');
    expect(integration.hooks).toBeDefined();
    expect(integration.hooks['astro:build:start']).toBeDefined();
  });

  it('should use default options when none provided', () => {
    const integration = previewIntelligence();

    expect(integration.name).toBe('rafters-preview-intelligence');
  });

  it('should accept custom output directory', () => {
    const integration = previewIntelligence({ outputDir: '/tmp/test-registry' });

    expect(integration.name).toBe('rafters-preview-intelligence');
  });

  it('should accept minifyCSS option', () => {
    const integration = previewIntelligence({ minifyCSS: false });

    expect(integration.name).toBe('rafters-preview-intelligence');
  });
});
