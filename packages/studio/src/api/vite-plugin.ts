/**
 * Studio API Vite Plugin
 *
 * Minimal ~50 line plugin providing token API endpoints:
 * - GET /api/tokens - returns tokens grouped by namespace
 * - PATCH /api/token/:ns/:name - updates a token value
 *
 * Uses singleton TokenRegistry with setChangeCallback for CSS HMR.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildColorValue, generateOKLCHScale, oklchToCSS } from '@rafters/color-utils';
import {
  DEFAULT_SYSTEM_CONFIG,
  generateColorTokens,
  NodePersistenceAdapter,
  registryToVars,
  resolveConfig,
  TokenRegistry,
} from '@rafters/design-tokens';
import type { ColorValue, Token } from '@rafters/shared';
import { OKLCHSchema } from '@rafters/shared';
import type { Plugin, ViteDevServer } from 'vite';
import { z } from 'zod';

/** Schema for POST /api/tokens/primary request body */
const PrimaryColorRequestSchema = z.object({
  color: OKLCHSchema,
  reason: z.string().min(1),
});

/** Schema for semantic color choice */
const SemanticColorChoiceSchema = z.object({
  color: OKLCHSchema,
  reason: z.string().min(1),
});

/** Schema for POST /api/tokens/semantics request body */
const SemanticColorsRequestSchema = z.object({
  colors: z.record(z.string(), SemanticColorChoiceSchema),
});

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

        // POST /api/tokens/primary - Build and set primary ColorValue
        if (req.method === 'POST' && req.url === '/api/tokens/primary') {
          let body = '';

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const parsed = PrimaryColorRequestSchema.safeParse(JSON.parse(body));
              if (!parsed.success) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid request', details: parsed.error.issues }));
                return;
              }
              const { color, reason } = parsed.data;

              const reg = await initRegistry(projectPath);
              const ns = 'color';

              log('update', `Setting primary color`, { color, reason });

              // Build full ColorValue with all intelligence from @rafters/color-utils
              const colorValue = buildColorValue(color, { token: 'primary', use: reason });
              log('add', `Built ColorValue: ${colorValue.name}`, { token: 'primary' });

              // Generate scale for the color generator
              const scale = generateOKLCHScale(color);

              // Use the color generator to create properly structured tokens
              const config = resolveConfig(DEFAULT_SYSTEM_CONFIG);
              const { tokens } = generateColorTokens(config, [
                { name: 'primary', scale, description: reason },
              ]);

              // Add all generated tokens to registry
              log('add', `Adding ${tokens.length} generated tokens to registry`);
              for (const token of tokens) {
                reg.add(token);
              }

              // Update the family token's value to include full ColorValue intelligence
              const familyTokenId = `${ns}/color-primary`;
              const familyToken = reg.get(familyTokenId);
              if (familyToken) {
                reg.add({ ...familyToken, value: colorValue as ColorValue });
              }

              // Persist to file
              if (persistence) {
                const tokensToSave = reg.list().filter((t) => t.namespace === ns);
                await persistence.saveNamespace(ns, tokensToSave);
                log('persist', `Saved ${tokensToSave.length} tokens to namespace "${ns}"`);
              }

              // Log the reason for design intelligence
              log('update', `Primary color committed: ${colorValue.name}`, { reason });
              console.log(`[studio] Primary color set: ${colorValue.name}. Reason: ${reason}`);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, colorValue }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        // POST /api/tokens/semantics - Set all semantic colors
        if (req.method === 'POST' && req.url === '/api/tokens/semantics') {
          let body = '';

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const parsed = SemanticColorsRequestSchema.safeParse(JSON.parse(body));
              if (!parsed.success) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid request', details: parsed.error.issues }));
                return;
              }
              const { colors } = parsed.data;

              const reg = await initRegistry(projectPath);
              const ns = 'color';
              const updated: string[] = [];

              // Update each semantic color
              for (const [name, { color, reason }] of Object.entries(colors)) {
                const tokenId = `${ns}/color-${name}`;

                if (reg.has(tokenId)) {
                  const cssValue = oklchToCSS(color);
                  reg.updateToken(tokenId, cssValue);
                  updated.push(name);

                  // Log for design intelligence
                  console.log(`[studio] Semantic color '${name}' set. Reason: ${reason}`);
                }
              }

              // Persist to file
              if (persistence) {
                const tokens = reg.list().filter((t) => t.namespace === ns);
                await persistence.saveNamespace(ns, tokens);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, updated }));
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

        next();
      });
    },
  };
}
