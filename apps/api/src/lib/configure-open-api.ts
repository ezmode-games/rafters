import { Scalar } from '@scalar/hono-api-reference';
import packageJSON from '../../package.json' with { type: 'json' };
import type { AppOpenAPI } from './types';

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/docs', {
    openapi: '3.1.0',
    info: {
      version: packageJSON.version,
      title: 'Rafters Design System API',
    },
  });

  app.get(
    '/reference',
    Scalar({
      url: '/docs',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    }),
  );

  // /llms.txt returns OpenAPI spec as JSON for LLM consumption
  // @scalar/openapi-to-markdown requires Node.js, doesn't work in Workers
  app.get('/llms.txt', async (c) => {
    const content = app.getOpenAPI31Document({
      openapi: '3.1.0',
      info: {
        title: 'Rafters Design System API',
        version: packageJSON.version,
      },
    });
    return c.json(content);
  });
}
