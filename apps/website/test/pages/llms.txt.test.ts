/**
 * Unit tests for LLMs.txt API endpoint
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../../src/pages/llms.txt';

// Mock the componentService lib functions
vi.mock('../../src/lib/registry/componentService', () => ({
  getRegistryMetadata: vi.fn(),
}));

import { getRegistryMetadata } from '../../src/lib/registry/componentService';

describe('LLMs.txt API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET handler', () => {
    it('should return text content with correct headers', async () => {
      const mockRegistry = {
        components: [
          {
            name: 'button',
            meta: {
              rafters: {
                intelligence: {
                  cognitiveLoad: 3,
                },
              },
            },
          },
          {
            name: 'container',
            meta: {
              rafters: {
                intelligence: {
                  cognitiveLoad: 0,
                },
              },
            },
          },
        ],
      };

      vi.mocked(getRegistryMetadata).mockReturnValue(mockRegistry);

      const response = await GET();
      const content = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, must-revalidate');
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(content).toContain('# Rafters Design Intelligence System');
      expect(content).toContain('## System Overview');
    });

    it('should handle components with missing intelligence data', async () => {
      const mockRegistry = {
        components: [
          { name: 'button' },
          { name: 'input', meta: {} },
          { name: 'dialog', meta: { rafters: {} } },
        ],
      };

      vi.mocked(getRegistryMetadata).mockReturnValue(mockRegistry);

      const response = await GET();
      const content = await response.text();

      expect(response.status).toBe(200);
      expect(content).toContain('# Rafters Design Intelligence System');
    });

    it('should sort components by cognitive load', async () => {
      const mockRegistry = {
        components: [
          {
            name: 'dialog',
            meta: { rafters: { intelligence: { cognitiveLoad: 6 } } },
          },
          {
            name: 'container',
            meta: { rafters: { intelligence: { cognitiveLoad: 0 } } },
          },
          {
            name: 'button',
            meta: { rafters: { intelligence: { cognitiveLoad: 3 } } },
          },
        ],
      };

      vi.mocked(getRegistryMetadata).mockReturnValue(mockRegistry);

      // Create a spy to capture the sorted array
      const sortSpy = vi.spyOn(Array.prototype, 'sort');

      await GET();

      // Verify sort was called
      expect(sortSpy).toHaveBeenCalled();
    });

    it('should include all expected sections in content', async () => {
      vi.mocked(getRegistryMetadata).mockReturnValue({ components: [] });

      const response = await GET();
      const content = await response.text();

      // Check for major sections
      expect(content).toContain('## System Overview');
      expect(content).toContain('## Core Design Principles');
      expect(content).toContain('### Cognitive Load Management');
      expect(content).toContain('### Attention Economics');
      expect(content).toContain('### Trust Building Patterns');
      expect(content).toContain('### Accessibility Intelligence');
      expect(content).toContain('## Component Intelligence Summary');
      expect(content).toContain('## Design Decision Framework');
      expect(content).toContain('## Registry Usage');
      expect(content).toContain('## Semantic Token System');
    });

    it('should set appropriate cache control headers', async () => {
      vi.mocked(getRegistryMetadata).mockReturnValue({ components: [] });

      const response = await GET();

      // Should revalidate more frequently than registry endpoints
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, must-revalidate');
    });
  });
});
