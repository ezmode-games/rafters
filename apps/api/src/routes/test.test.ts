import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import app from '../index';

describe('Test API', () => {
  it('Should return 200 response with KV functionality', async () => {
    const res = await app.request('/api/test', {}, env);

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual({
      kvWorks: true,
      wrote: 'test-key',
      read: 'hello from hono',
    });
  });
});
