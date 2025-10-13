/**
 * Integration Test Example
 * Demonstrates MSW usage with fixture generators
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './setup-msw.js';
import { createComponentManifestFixture } from './fixtures.js';
import type { ComponentManifest } from '../src/types.js';

// Mock API client for testing
class ComponentRegistryClient {
  constructor(private baseUrl: string) {}

  async getComponent(name: string): Promise<ComponentManifest> {
    const response = await fetch(`${this.baseUrl}/api/registry/${name}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch component: ${response.statusText}`);
    }
    return response.json();
  }

  async listComponents(): Promise<{ components: ComponentManifest[] }> {
    const response = await fetch(`${this.baseUrl}/api/registry`);
    if (!response.ok) {
      throw new Error(`Failed to list components: ${response.statusText}`);
    }
    return response.json();
  }

  async createComponent(manifest: ComponentManifest): Promise<ComponentManifest> {
    const response = await fetch(`${this.baseUrl}/api/registry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manifest),
    });
    if (!response.ok) {
      throw new Error(`Failed to create component: ${response.statusText}`);
    }
    return response.json();
  }
}

describe('Component Registry Integration', () => {
  const apiUrl = 'https://api.rafters.dev';
  let client: ComponentRegistryClient;

  beforeEach(() => {
    client = new ComponentRegistryClient(apiUrl);
  });

  describe('GET /api/registry/:name', () => {
    it('should fetch component manifest', async () => {
      const manifest = await client.getComponent('button');

      expect(manifest).toBeDefined();
      expect(manifest.name).toBe('button');
      expect(manifest.type).toBe('registry:component');
      expect(manifest.meta?.rafters).toBeDefined();
    });

    it('should fetch component with dynamic name', async () => {
      // MSW handler creates fixture with any name parameter
      const manifest = await client.getComponent('custom-component');

      expect(manifest).toBeDefined();
      expect(manifest.name).toBe('custom-component');
      expect(manifest.type).toBe('registry:component');
    });
  });

  describe('GET /api/registry', () => {
    it('should list all components', async () => {
      const result = await client.listComponents();

      expect(result.components).toBeDefined();
      expect(result.components.length).toBeGreaterThan(0);
      expect(result.components[0].name).toBeDefined();
    });
  });

  describe('POST /api/registry', () => {
    it('should create new component', async () => {
      const newManifest = createComponentManifestFixture({
        overrides: { name: 'custom-button' },
      });

      const created = await client.createComponent(newManifest);

      expect(created.name).toBe('custom-button');
      expect(created.meta?.rafters?.version).toBe('1.0.0');
    });
  });

  describe('Runtime handler override', () => {
    it('should allow per-test handler customization', async () => {
      // Override handler for this specific test
      server.use(
        http.get(`${apiUrl}/api/registry/special`, () => {
          return HttpResponse.json(
            createComponentManifestFixture({
              overrides: {
                name: 'special',
                description: 'A special test component',
              },
            }),
          );
        }),
      );

      const manifest = await client.getComponent('special');

      expect(manifest.name).toBe('special');
      expect(manifest.description).toBe('A special test component');
    });

    it('should simulate network errors', async () => {
      server.use(
        http.get(`${apiUrl}/api/registry/error`, () => {
          return HttpResponse.json(
            { error: 'Service unavailable' },
            { status: 503 },
          );
        }),
      );

      await expect(client.getComponent('error')).rejects.toThrow();
    });

    it('should simulate delayed responses', async () => {
      server.use(
        http.get(`${apiUrl}/api/registry/slow`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json(
            createComponentManifestFixture({ overrides: { name: 'slow' } }),
          );
        }),
      );

      const start = Date.now();
      const manifest = await client.getComponent('slow');
      const duration = Date.now() - start;

      expect(manifest.name).toBe('slow');
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });
});
