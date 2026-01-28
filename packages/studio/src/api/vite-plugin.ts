/**
 * Vite Plugin for Studio API
 *
 * Serves API routes for the Studio frontend to access token data.
 * Reads project path from RAFTERS_PROJECT_PATH environment variable.
 */

import type { Plugin, ViteDevServer } from 'vite';
import {
  getTokenDependents,
  initializeStudioCss,
  loadProjectTokens,
  regenerateAllOutputs,
  saveTokenUpdate,
  updateSingleToken,
} from './token-loader';
import { writeQueue } from './write-queue';

/**
 * SSE client management for live token update broadcasting.
 * Each connected client gets a writable ServerResponse.
 */
const sseClients = new Set<import('node:http').ServerResponse>();

/** Broadcast a token change event to all connected SSE clients */
export function broadcastTokenChange(namespace: string): void {
  const data = JSON.stringify({ type: 'token-change', namespace, timestamp: Date.now() });
  for (const client of sseClients) {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

export function studioApiPlugin(): Plugin {
  return {
    name: 'studio-api',
    configureServer(server: ViteDevServer) {
      const projectPath = process.env.RAFTERS_PROJECT_PATH;

      if (!projectPath) {
        console.warn('[studio] RAFTERS_PROJECT_PATH not set, API routes will return empty data');
      } else {
        // Initialize split CSS files for HMR on server start
        initializeStudioCss(projectPath).catch((err) => {
          console.error('[studio] Failed to initialize CSS:', err);
        });
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

      // GET /api/dependents/:tokenName - Get tokens that depend on a given token
      server.middlewares.use('/api/dependents/', async (req, res, next) => {
        if (req.method !== 'GET') {
          next();
          return;
        }

        const rawPath = req.url?.slice(1).split('?')[0] ?? '';
        const tokenName = rawPath ? decodeURIComponent(rawPath) : '';
        if (!tokenName) {
          next();
          return;
        }

        try {
          if (!projectPath) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ dependents: [] }));
            return;
          }

          const dependents = await getTokenDependents(projectPath, tokenName);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ tokenName, dependents }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[studio] Failed to get dependents for ${tokenName}:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message }));
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

      // GET /api/events - Server-Sent Events for live token updates
      server.middlewares.use('/api/events', (req, res, next) => {
        if (req.method !== 'GET') {
          next();
          return;
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.flushHeaders();

        // Send initial connection event
        res.write('data: {"type":"connected"}\n\n');

        sseClients.add(res);

        req.on('close', () => {
          sseClients.delete(res);
        });
      });

      // POST /api/save/all - Regenerate all output files
      server.middlewares.use('/api/save/all', async (req, res, next) => {
        if (req.method !== 'POST') {
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

          await writeQueue.drainThenRun(() => regenerateAllOutputs(projectPath));

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.error('[studio] Failed to regenerate outputs:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message }));
        }
      });

      // PATCH /api/token/:namespace/:name - Update a single token with reason
      server.middlewares.use('/api/token/', async (req, res, next) => {
        if (req.method !== 'PATCH') {
          next();
          return;
        }

        // Extract namespace/name from URL: /api/token/color/primary-500
        const urlParts = req.url?.replace('/', '').split('?')[0].split('/');
        if (!urlParts || urlParts.length < 2) {
          next();
          return;
        }

        const namespace = urlParts[0];
        const tokenName = urlParts.slice(1).join('/'); // Handle names with slashes

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

          const { value, reason } = JSON.parse(body);

          // Validate required fields
          if (value === undefined) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing required field: value' }));
            return;
          }

          if (!reason || typeof reason !== 'string' || reason.trim() === '') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing required field: reason' }));
            return;
          }

          // Use write queue to serialize updates
          const updatedToken = await writeQueue.enqueue(namespace, () =>
            updateSingleToken(projectPath, namespace, {
              name: tokenName,
              value,
              reason: reason.trim(),
            }),
          );

          broadcastTokenChange(namespace);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, token: updatedToken }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[studio] Failed to update token ${namespace}/${tokenName}:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}
