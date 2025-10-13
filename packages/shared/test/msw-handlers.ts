/**
 * MSW Request Handlers
 * Mock API handlers for integration testing
 *
 * These handlers use our fixture generators to provide realistic
 * mock data for API endpoints during testing.
 */

import { http, HttpResponse } from 'msw';
import {
  createComponentManifestFixture,
  createColorValueFixture,
  createTokenFixture,
} from './fixtures.js';
import type { ComponentManifest, ColorIntelligenceResponse } from '../src/types.js';

/**
 * Base URL for API endpoints
 * Override with MSW_API_BASE_URL env var in tests
 */
const API_BASE = process.env.MSW_API_BASE_URL || 'https://api.rafters.dev';

/**
 * Component Registry Handlers
 * Mock the component registry API endpoints
 */
export const componentHandlers = [
  // GET /api/registry/:name - Get component manifest
  http.get(`${API_BASE}/api/registry/:name`, ({ params }) => {
    const { name } = params;

    const manifest = createComponentManifestFixture({
      overrides: {
        name: name as string,
      },
    });

    return HttpResponse.json(manifest);
  }),

  // GET /api/registry - List all components
  http.get(`${API_BASE}/api/registry`, () => {
    const components: ComponentManifest[] = [
      createComponentManifestFixture({ overrides: { name: 'button' } }),
      createComponentManifestFixture({ overrides: { name: 'input' } }),
      createComponentManifestFixture({ overrides: { name: 'card' } }),
    ];

    return HttpResponse.json({ components });
  }),

  // POST /api/registry - Create component (protected)
  http.post(`${API_BASE}/api/registry`, async ({ request }) => {
    const body = (await request.json()) as ComponentManifest;

    // Validate and return created manifest
    return HttpResponse.json(
      {
        ...body,
        meta: {
          ...body.meta,
          rafters: {
            ...body.meta?.rafters,
            version: '1.0.0',
          },
        },
      },
      { status: 201 },
    );
  }),
];

/**
 * Color Intelligence Handlers
 * Mock the color intelligence API endpoints
 */
export const colorHandlers = [
  // POST /api/color-intel - Get AI color analysis
  http.post(`${API_BASE}/api/color-intel`, async ({ request }) => {
    const body = (await request.json()) as { color: string };

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response: ColorIntelligenceResponse = {
      intelligence: {
        suggestedName: 'ocean-blue',
        reasoning: 'Deep blue with medium saturation suggests water and trustworthiness',
        emotionalImpact: 'Calm, professional, trustworthy',
        culturalContext: 'Universally associated with stability and reliability',
        accessibilityNotes: 'Sufficient contrast for text when paired with light backgrounds',
        usageGuidance: 'Ideal for primary actions and brand elements',
      },
      harmonies: {
        complementary: { l: 0.7, c: 0.15, h: 70 },
        triadic: [
          { l: 0.7, c: 0.15, h: 10 },
          { l: 0.7, c: 0.15, h: 130 },
        ],
        analogous: [
          { l: 0.7, c: 0.15, h: 220 },
          { l: 0.7, c: 0.15, h: 280 },
        ],
        tetradic: [
          { l: 0.7, c: 0.15, h: 70 },
          { l: 0.7, c: 0.15, h: 130 },
          { l: 0.7, c: 0.15, h: 190 },
        ],
        monochromatic: [
          { l: 0.9, c: 0.08, h: 250 },
          { l: 0.8, c: 0.12, h: 250 },
          { l: 0.6, c: 0.18, h: 250 },
          { l: 0.4, c: 0.18, h: 250 },
        ],
      },
      accessibility: {
        onWhite: {
          wcagAA: true,
          wcagAAA: false,
          contrastRatio: 4.8,
          aa: [5, 6, 7, 8, 9],
          aaa: [7, 8, 9],
        },
        onBlack: {
          wcagAA: true,
          wcagAAA: true,
          contrastRatio: 8.2,
          aa: [0, 1, 2, 3, 4],
          aaa: [0, 1, 2],
        },
      },
      analysis: {
        temperature: 'cool',
        isLight: false,
        name: 'ocean-blue',
      },
    };

    return HttpResponse.json(response);
  }),

  // POST /api/color-intel/batch - Batch color analysis
  http.post(`${API_BASE}/api/color-intel/batch`, async ({ request }) => {
    const body = (await request.json()) as { colors: string[] };

    await new Promise((resolve) => setTimeout(resolve, 200));

    const results = body.colors.map((color, index) =>
      createColorValueFixture({
        seed: index,
        overrides: {
          name: `color-${index}`,
        },
      }),
    );

    return HttpResponse.json({ results });
  }),
];

/**
 * Design Token Handlers
 * Mock the design token API endpoints
 */
export const tokenHandlers = [
  // GET /api/tokens/:system - Get tokens for design system
  http.get(`${API_BASE}/api/tokens/:system`, ({ params }) => {
    const { system } = params;

    const tokens = [
      createTokenFixture({ overrides: { name: 'color-primary', namespace: system as string } }),
      createTokenFixture({ overrides: { name: 'color-secondary', namespace: system as string } }),
      createTokenFixture({ overrides: { name: 'spacing-md', category: 'spacing' } }),
      createTokenFixture({ overrides: { name: 'font-size-base', category: 'typography' } }),
    ];

    return HttpResponse.json({ tokens });
  }),

  // POST /api/tokens/validate - Validate token structure
  http.post(`${API_BASE}/api/tokens/validate`, async ({ request }) => {
    const body = await request.json();

    // Simulate validation
    return HttpResponse.json({
      valid: true,
      errors: [],
    });
  }),
];

/**
 * Error Handlers
 * Mock error scenarios for testing error handling
 */
export const errorHandlers = [
  // 404 Not Found
  http.get(`${API_BASE}/api/registry/nonexistent`, () => {
    return HttpResponse.json(
      {
        error: 'Component not found',
        code: 'COMPONENT_NOT_FOUND',
      },
      { status: 404 },
    );
  }),

  // 401 Unauthorized
  http.post(`${API_BASE}/api/registry/protected`, () => {
    return HttpResponse.json(
      {
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      },
      { status: 401 },
    );
  }),

  // 500 Server Error
  http.get(`${API_BASE}/api/error`, () => {
    return HttpResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }),

  // Network timeout simulation
  http.get(`${API_BASE}/api/slow`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return HttpResponse.json({ message: 'Slow response' });
  }),
];

/**
 * All handlers combined
 * Export this for easy MSW server setup
 */
export const handlers = [
  ...componentHandlers,
  ...colorHandlers,
  ...tokenHandlers,
  ...errorHandlers,
];
