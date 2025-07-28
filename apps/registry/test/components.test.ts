/**
 * Tests for component endpoints
 */

import { describe, expect, it } from 'vitest';
import app from '../src/index';

describe('Components API', () => {
  it('should list all components', async () => {
    const res = await app.request('/components');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.components).toBeDefined();
    expect(Array.isArray(data.components)).toBe(true);
    expect(data.total).toBeGreaterThan(0);
  });

  it('should return component details', async () => {
    const res = await app.request('/components/button');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toBe('button');
    expect(data.intelligence).toBeDefined();
    expect(data.intelligence.cognitiveLoad).toBeGreaterThan(0);
    expect(data.files).toBeDefined();
    expect(Array.isArray(data.files)).toBe(true);
  });

  it('should return 404 for non-existent component', async () => {
    const res = await app.request('/components/NonExistentComponent');
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toBe('Component not found');
    expect(data.availableComponents).toBeDefined();
  });

  it('should return component source code', async () => {
    const res = await app.request('/components/button/source');

    // Should either return source code or 404 if not available
    if (res.status === 200) {
      expect(res.headers.get('Content-Type')).toContain('text/plain');
      expect(res.headers.get('X-Component-Name')).toBe('button');
    } else {
      expect(res.status).toBe(404);
    }
  });

  it('should return component stories', async () => {
    const res = await app.request('/components/button/stories');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.component).toBe('button');
    expect(data.stories).toBeDefined();
    expect(Array.isArray(data.stories)).toBe(true);
  });

  it('should validate component intelligence structure', async () => {
    const res = await app.request('/components/button');
    expect(res.status).toBe(200);

    const data = await res.json();
    const intelligence = data.intelligence;

    expect(intelligence).toBeDefined();
    expect(intelligence.cognitiveLoad).toBeTypeOf('number');
    expect(intelligence.attentionEconomics).toBeTypeOf('string');
    expect(intelligence.accessibility).toBeTypeOf('string');
    expect(intelligence.trustBuilding).toBeTypeOf('string');
    expect(intelligence.semanticMeaning).toBeTypeOf('string');
  });
});
