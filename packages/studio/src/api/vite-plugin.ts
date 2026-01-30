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
import { generateOKLCHScale, oklchToCSS } from '@rafters/color-utils';
import { NodePersistenceAdapter, registryToVars, TokenRegistry } from '@rafters/design-tokens';
import type { Token } from '@rafters/shared';
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

async function initRegistry(projectPath: string): Promise<TokenRegistry> {
  if (registry) return registry;

  persistence = new NodePersistenceAdapter(projectPath);
  registry = new TokenRegistry();

  // Load all namespaces
  const namespaces = await persistence.listNamespaces();
  for (const ns of namespaces) {
    const tokens = await persistence.loadNamespace(ns);
    for (const token of tokens) {
      registry.add(token);
    }
  }

  // Set up change callback for CSS HMR
  const outputDir = join(projectPath, '.rafters', 'output');
  await mkdir(outputDir, { recursive: true });

  registry.setChangeCallback(async () => {
    if (!registry) return;
    const css = registryToVars(registry);
    await writeFile(join(outputDir, 'rafters.vars.css'), css);
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

        // POST /api/tokens/primary - Generate and set primary color scale
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
              const scale = generateOKLCHScale(color);

              // Update each scale step as a token
              const scaleSteps = [
                '50',
                '100',
                '200',
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                '950',
              ];
              const ns = 'color';

              for (const step of scaleSteps) {
                const tokenId = `${ns}/color-primary-${step}`;
                const scaleColor = scale[step];

                if (scaleColor && reg.has(tokenId)) {
                  const cssValue = oklchToCSS(scaleColor);
                  reg.updateToken(tokenId, cssValue);
                }
              }

              // Also update the base primary token if it exists
              const baseTokenId = `${ns}/color-primary`;
              if (reg.has(baseTokenId)) {
                reg.updateToken(baseTokenId, oklchToCSS(scale['500'] ?? color));
              }

              // Persist to file
              if (persistence) {
                const tokens = reg.list().filter((t) => t.namespace === ns);
                await persistence.saveNamespace(ns, tokens);
              }

              // Log the reason for design intelligence
              console.log(`[studio] Primary color scale generated. Reason: ${reason}`);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, scale }));
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
              reg.updateToken(tokenId, value);

              // Persist to file
              if (persistence) {
                const tokens = reg.list().filter((t) => t.namespace === ns);
                await persistence.saveNamespace(ns, tokens);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
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
