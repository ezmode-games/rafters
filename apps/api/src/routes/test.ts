import { Hono } from 'hono';

interface CloudflareBindings {
  RAFTERS_INTEL: KVNamespace;
}

const test = new Hono<{ Bindings: CloudflareBindings }>();

test.get('/', async (c) => {
  const kv = c.env.RAFTERS_INTEL;

  // Write
  await kv.put('test-key', 'hello from hono');

  // Read
  const value = await kv.get('test-key');

  return c.json({
    kvWorks: !!kv,
    wrote: 'test-key',
    read: value,
  });
});

export { test };
