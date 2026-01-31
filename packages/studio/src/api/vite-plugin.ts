/**
 * Studio API Vite Plugin
 *
 * Minimal ~50 line plugin providing token API endpoints:
 * - GET /api/tokens - returns tokens grouped by namespace
 * - PATCH /api/token/:ns/:name - updates a token value
 *
 * Uses singleton TokenRegistry with setChangeCallback for CSS HMR.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NodePersistenceAdapter, registryToVars, TokenRegistry } from '@rafters/design-tokens';
import type { Token } from '@rafters/shared';
import { TokenSchema } from '@rafters/shared';
import type { Plugin, ViteDevServer } from 'vite';
import { z } from 'zod';

/** Schema for POST /api/tokens request body - accepts single token or array */
const TokensRequestSchema = z.union([TokenSchema, z.array(TokenSchema)]);

let registry: TokenRegistry | null = null;
let persistence: NodePersistenceAdapter | null = null;

/** Registry activity log - tracks all operations */
interface LogEntry {
  timestamp: string;
  type: 'load' | 'add' | 'update' | 'change' | 'persist' | 'init';
  message: string;
  details?: unknown;
}
const activityLog: LogEntry[] = [];
const MAX_LOG_ENTRIES = 200;

function log(type: LogEntry['type'], message: string, details?: unknown): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    type,
    message,
    details,
  };
  activityLog.unshift(entry); // newest first
  if (activityLog.length > MAX_LOG_ENTRIES) {
    activityLog.pop();
  }
}

async function initRegistry(projectPath: string): Promise<TokenRegistry> {
  if (registry) return registry;

  log('init', `Initializing registry from ${projectPath}`);

  persistence = new NodePersistenceAdapter(projectPath);
  registry = new TokenRegistry();

  // Load all namespaces
  const namespaces = await persistence.listNamespaces();
  log('load', `Found ${namespaces.length} namespaces`, namespaces);

  for (const ns of namespaces) {
    const tokens = await persistence.loadNamespace(ns);
    log('load', `Loaded ${tokens.length} tokens from namespace "${ns}"`);
    for (const token of tokens) {
      registry.add(token);
    }
  }

  log('init', `Registry initialized with ${registry.size()} tokens`);

  // Set up change callback for CSS HMR
  const outputDir = join(projectPath, '.rafters', 'output');
  await mkdir(outputDir, { recursive: true });

  registry.setChangeCallback(async (event) => {
    if (!registry) return;
    log('change', `Registry change: ${event.type}`, event);
    const css = registryToVars(registry);
    await writeFile(join(outputDir, 'rafters.vars.css'), css);
    log('persist', 'CSS vars written to rafters.vars.css');
  });

  return registry;
}

export function studioApiPlugin(): Plugin {
  const projectPath = process.env.RAFTERS_PROJECT_PATH;

  return {
    name: 'studio-api',

    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!projectPath) {
          if (req.url?.startsWith('/api/')) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'RAFTERS_PROJECT_PATH not set' }));
            return;
          }
          return next();
        }

        // GET /api/registry/log - Activity log
        if (req.method === 'GET' && req.url === '/api/registry/log') {
          // Ensure registry is initialized so we capture initial load
          await initRegistry(projectPath);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ log: activityLog }));
          return;
        }

        // GET /api/tokens
        if (req.method === 'GET' && req.url === '/api/tokens') {
          try {
            const reg = await initRegistry(projectPath);
            const tokens = reg.list();
            const grouped: Record<string, Token[]> = {};

            for (const token of tokens) {
              const ns = token.namespace || 'default';
              if (!grouped[ns]) grouped[ns] = [];
              grouped[ns].push(token);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ tokens: grouped }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
          return;
        }

        // POST /api/tokens - Add tokens to registry (validates against TokenSchema)
        if (req.method === 'POST' && req.url === '/api/tokens') {
          let body = '';

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const parsed = TokensRequestSchema.safeParse(JSON.parse(body));
              if (!parsed.success) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid request', details: parsed.error.issues }));
                return;
              }

              const reg = await initRegistry(projectPath);

              // Normalize to array
              const tokens = Array.isArray(parsed.data) ? parsed.data : [parsed.data];

              log('update', `Upserting ${tokens.length} tokens in registry`);
              for (const token of tokens) {
                if (reg.has(token.name)) {
                  // Token exists - use set() to update and cascade dependents
                  const value = typeof token.value === 'string' ? token.value : JSON.stringify(token.value);
                  await reg.set(token.name, value);
                  log('update', `Updated existing token "${token.name}"`);
                } else {
                  // Token doesn't exist - use add() to create it
                  reg.add(token);
                  log('add', `Added new token "${token.name}"`);
                }
              }

              // Group tokens by namespace and persist each
              if (persistence) {
                const namespaces = new Set(tokens.map((t) => t.namespace));
                for (const ns of namespaces) {
                  const nsTokens = reg.list().filter((t) => t.namespace === ns);
                  await persistence.saveNamespace(ns, nsTokens);
                  log('persist', `Saved ${nsTokens.length} tokens to namespace "${ns}"`);
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: tokens.length }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // PATCH /api/token/:ns/:name
        const patchMatch = req.url?.match(/^\/api\/token\/([^/]+)\/([^/]+)$/);
        if (req.method === 'PATCH' && patchMatch) {
          const [, ns, name] = patchMatch;
          let body = '';

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const { value } = JSON.parse(body);
              if (value === undefined) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'value required' }));
                return;
              }

              const reg = await initRegistry(projectPath);
              const tokenId = `${ns}/${name}`;

              if (!reg.has(tokenId)) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Token not found' }));
                return;
              }

              // Note: reason is captured for WhyGate but updateToken only takes value
              // Future: store reason in token metadata
              log('update', `Updating token "${tokenId}"`, { value });
              reg.updateToken(tokenId, value);

              // Persist to file
              if (persistence) {
                const tokensToSave = reg.list().filter((t) => t.namespace === ns);
                await persistence.saveNamespace(ns, tokensToSave);
                log('persist', `Saved ${tokensToSave.length} tokens to namespace "${ns}"`);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
              log('update', `Token "${tokenId}" updated successfully`);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // GET /api/config - Get rafters config
        if (req.method === 'GET' && req.url === '/api/config') {
          try {
            const configPath = join(projectPath, '.rafters', 'config.rafters.json');
            const configData = await readFile(configPath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(configData);
          } catch (err) {
            // Return default config if file doesn't exist
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ onboarded: false }));
          }
          return;
        }

        // PATCH /api/config - Update rafters config
        if (req.method === 'PATCH' && req.url === '/api/config') {
          let body = '';

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const updates = JSON.parse(body);
              const configPath = join(projectPath, '.rafters', 'config.rafters.json');

              // Read existing config
              let config: Record<string, unknown> = {};
              try {
                const existing = await readFile(configPath, 'utf-8');
                config = JSON.parse(existing);
              } catch {
                // Start with empty config if file doesn't exist
              }

              // Merge updates
              config = { ...config, ...updates };

              // Write back
              await mkdir(join(projectPath, '.rafters'), { recursive: true });
              await writeFile(configPath, JSON.stringify(config, null, 2));
              log('persist', `Config updated: ${Object.keys(updates).join(', ')}`);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, config }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // GET /api/tokens/color?l=0.6&c=0.15&h=200 - Get ColorValue from Rafters API
        const colorUrl = new URL(req.url || '', 'http://localhost');
        if (req.method === 'GET' && colorUrl.pathname === '/api/tokens/color') {
          const l = colorUrl.searchParams.get('l');
          const c = colorUrl.searchParams.get('c');
          const h = colorUrl.searchParams.get('h');
          const sync = colorUrl.searchParams.get('sync') !== 'false'; // default true

          if (!l || !c || !h) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'l, c, h query params required' }));
            return;
          }

          try {
            // Format: L.LLL-C.CCC-H
            const oklchParam = `${parseFloat(l).toFixed(3)}-${parseFloat(c).toFixed(3)}-${Math.round(parseFloat(h))}`;
            const apiUrl = `https://api.rafters.studio/color/${oklchParam}?${sync ? 'sync=true' : 'adhoc=true'}`;

            log('update', `Fetching color from Rafters API: ${oklchParam}`);
            const apiRes = await fetch(apiUrl);

            if (!apiRes.ok) {
              throw new Error(`Rafters API error: ${apiRes.status}`);
            }

            const data = await apiRes.json();
            log('update', `Got ColorValue: ${data.color?.name || 'unknown'}`);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
          return;
        }

        next();
      });
    },
  };
}
