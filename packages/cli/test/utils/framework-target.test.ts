import { describe, expect, it } from 'vitest';
import { frameworkToTarget, targetToExtension } from '../../src/utils/detect.js';

describe('frameworkToTarget', () => {
  it('maps astro to astro', () => {
    expect(frameworkToTarget('astro')).toBe('astro');
  });

  it('maps next to react', () => {
    expect(frameworkToTarget('next')).toBe('react');
  });

  it('maps vite to react', () => {
    expect(frameworkToTarget('vite')).toBe('react');
  });

  it('maps remix to react', () => {
    expect(frameworkToTarget('remix')).toBe('react');
  });

  it('maps react-router to react', () => {
    expect(frameworkToTarget('react-router')).toBe('react');
  });

  it('maps unknown to react', () => {
    expect(frameworkToTarget('unknown')).toBe('react');
  });
});

describe('targetToExtension', () => {
  it('react -> .tsx', () => {
    expect(targetToExtension('react')).toBe('.tsx');
  });

  it('astro -> .astro', () => {
    expect(targetToExtension('astro')).toBe('.astro');
  });

  it('vue -> .vue', () => {
    expect(targetToExtension('vue')).toBe('.vue');
  });

  it('svelte -> .svelte', () => {
    expect(targetToExtension('svelte')).toBe('.svelte');
  });
});
