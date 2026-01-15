/**
 * Vite Plugin for Studio API
 *
 * Serves API routes for the Studio frontend to access token data.
 * Reads project path from RAFTERS_PROJECT_PATH environment variable.
 */

import type { Plugin, ViteDevServer } from 'vite';
import { loadProjectTokens, saveTokenUpdate } from './token-loader';

export function studioApiPlugin(): Plugin {
  return {
    name: 'studio-api',
    configureServer(server: ViteDevServer) {
      const projectPath = process.env.RAFTERS_PROJECT_PATH;

      if (!projectPath) {
        console.warn('[studio] RAFTERS_PROJECT_PATH not set, API routes will return empty data');
      }

      // GET /api/tokens - List all tokens grouped by namespace
      server.middlewares.use('/api/tokens', async (req, res, next) => {
        if (req.method !== 'GET') {
          next();
          return;
        }

        try {
          if (!projectPath) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ namespaces: [], tokens: {} }));
            return;
          }

          const { namespaces, tokensByNamespace } = await loadProjectTokens(projectPath);

          // Convert Map to object for JSON serialization
          const tokens: Record<string, unknown[]> = {};
          for (const [ns, nsTokens] of tokensByNamespace) {
            tokens[ns] = nsTokens;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ namespaces, tokens }));
        } catch (error) {
          console.error('[studio] Failed to load tokens:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to load tokens' }));
        }
      });

      // GET /api/tokens/:namespace - Get tokens for a specific namespace
      server.middlewares.use('/api/tokens/', async (req, res, next) => {
        if (req.method !== 'GET') {
          next();
          return;
        }

        // Extract namespace from URL
        const namespace = req.url?.replace('/', '').split('?')[0];
        if (!namespace) {
          next();
          return;
        }

        try {
          if (!projectPath) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ namespace, tokens: [] }));
            return;
          }

          const { tokensByNamespace } = await loadProjectTokens(projectPath);
          const tokens = tokensByNamespace.get(namespace) || [];

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ namespace, tokens }));
        } catch (error) {
          console.error(`[studio] Failed to load namespace ${namespace}:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Failed to load namespace ${namespace}` }));
        }
      });

      // POST /api/tokens/:namespace - Update tokens in a namespace
      server.middlewares.use('/api/save/', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        // Extract namespace from URL
        const namespace = req.url?.replace('/', '').split('?')[0];
        if (!namespace) {
          next();
          return;
        }

        try {
          if (!projectPath) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No project path configured' }));
            return;
          }

          // Read body
          let body = '';
          for await (const chunk of req) {
            body += chunk;
          }

          const { tokens } = JSON.parse(body);

          await saveTokenUpdate(projectPath, namespace, tokens);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, namespace }));
        } catch (error) {
          console.error(`[studio] Failed to save namespace ${namespace}:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Failed to save namespace ${namespace}` }));
        }
      });
    },
  };
}
