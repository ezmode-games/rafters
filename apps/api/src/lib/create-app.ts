import { OpenAPIHono } from '@hono/zod-openapi';
import type { Schema } from 'hono';
import { requestId } from 'hono/request-id';
import { notFound, onError } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';

import type { AppOpenAPI } from './types';

export function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(requestId());
  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route('/', router);
}
