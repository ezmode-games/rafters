/**
 * Tests for the main Rafters Registry API
 */

import { describe, expect, it } from 'vitest';
import app from '../src/index';

describe('Registry API', () => {
  it('should return API information at root endpoint', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toBe('Rafters Component Registry');
    expect(data.version).toBe('1.0.0');
    expect(data.endpoints).toBeDefined();
  });

  it('should handle 404 for unknown routes', async () => {
    const res = await app.request('/unknown');
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toBe('Not Found');
  });

  it('should include CORS headers', async () => {
    const res = await app.request('/', {
      method: 'OPTIONS',
    });

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
  });

  it('should handle errors gracefully', async () => {
    // Test error handling by mocking a service error
    const res = await app.request('/components/nonexistent');
    expect(res.status).toBe(404);
  });
});
