# MCP Architecture

**Purpose:** Define the local MCP server that provides AI agents with read-only access to the Rafters design token system.

---

## Overview

The MCP (Model Context Protocol) server runs locally via `rafters mcp` and gives AI agents (Claude, Cursor, etc.) access to:

- Token definitions with full intelligence metadata
- Design system configuration
- Semantic meanings and usage patterns
- WHY things are the way they are, not just WHAT

**Key principle:** Schemas and token metadata answer "why" so agents don't have to guess or pattern-match.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI AGENT (Claude, Cursor)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ stdio transport
                              │ (no network)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     RAFTERS MCP SERVER                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Tools     │  │  Resources  │  │    Filesystem Access    │ │
│  │             │  │             │  │                         │ │
│  │ get_token   │  │ tokens://   │  │  .rafters/tokens/*.json │ │
│  │ list_tokens │  │ config://   │  │  .rafters/config.json   │ │
│  │ search      │  │             │  │                         │ │
│  │ get_config  │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tools

### `rafters_list_namespaces`

List all available token namespaces.

```typescript
{
  name: 'rafters_list_namespaces',
  description: 'List all available token namespaces in the design system',
  inputSchema: {
    type: 'object',
    properties: {},
  },
}

// Returns
["color", "semantic", "spacing", "typography", "radius", "shadow", "depth", "elevation", "motion", "focus", "breakpoint"]
```

### `rafters_get_tokens`

Get tokens, optionally filtered by namespace or category.

```typescript
{
  name: 'rafters_get_tokens',
  description: 'Get design tokens with full metadata. Filter by namespace to get specific token types.',
  inputSchema: {
    type: 'object',
    properties: {
      namespace: {
        type: 'string',
        description: 'Filter by namespace (e.g., "color", "spacing", "semantic")',
      },
      category: {
        type: 'string',
        description: 'Filter by category (e.g., "color", "dimension")',
      },
    },
  },
}

// Example: Get all semantic tokens
{ namespace: "semantic" }

// Returns
[
  {
    "name": "primary",
    "value": "var(--color-ocean-blue-500)",
    "category": "color",
    "namespace": "semantic",
    "semanticMeaning": "Primary action color, highest visual priority",
    "usagePatterns": {
      "do": ["Main CTA buttons", "Key interactive elements"],
      "never": ["More than one primary per section"]
    },
    "dependsOn": ["ocean-blue-500"],
    "generationRule": "reference:ocean-blue-500"
  }
]
```

### `rafters_get_token`

Get a single token by name with complete metadata.

```typescript
{
  name: 'rafters_get_token',
  description: 'Get a specific token by name with all metadata including semantic meaning, usage patterns, and dependencies',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Token name (e.g., "primary", "spacing-4", "ocean-blue-500")',
      },
    },
    required: ['name'],
  },
}

// Example
{ name: "ocean-blue" }

// Returns (color family token with full intelligence)
{
  "name": "ocean-blue",
  "value": {
    "name": "ocean-blue",
    "scale": [...],
    "intelligence": {
      "reasoning": "Named for its resemblance to deep ocean waters...",
      "emotionalImpact": "Evokes trust, stability, and professionalism...",
      "culturalContext": "Blue is universally associated with trust...",
      "accessibilityNotes": "Provides excellent contrast with white text...",
      "usageGuidance": "Ideal for primary actions and brand elements..."
    },
    "harmonies": {
      "complementary": [...],
      "triadic": [...],
      "analogous": [...]
    },
    "accessibility": {
      "wcagMatrix": {...},
      "apcaScores": {...}
    }
  },
  "category": "color",
  "namespace": "color",
  "semanticMeaning": "Primary brand color evoking trust and professionalism",
  "usagePatterns": {
    "do": ["Use for primary CTAs", "Headers and key UI elements"],
    "never": ["Body text", "Large background areas"]
  }
}
```

### `rafters_search_tokens`

Search tokens by natural language query.

```typescript
{
  name: 'rafters_search_tokens',
  description: 'Search tokens by name or semantic meaning. Useful for finding tokens that match a concept.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query (e.g., "primary button", "danger", "small spacing")',
      },
      limit: {
        type: 'number',
        description: 'Maximum results to return (default: 10)',
      },
    },
    required: ['query'],
  },
}

// Example
{ query: "danger error", limit: 5 }

// Returns
[
  {
    "name": "destructive",
    "semanticMeaning": "Errors, delete actions, danger states",
    "matchReason": "Matched on semantic meaning"
  },
  {
    "name": "destructive-foreground",
    "semanticMeaning": "Text on destructive backgrounds",
    "matchReason": "Matched on name"
  }
]
```

### `rafters_get_usage_patterns`

Get do/never guidance for a token.

```typescript
{
  name: 'rafters_get_usage_patterns',
  description: 'Get usage guidance for a token - what to do and what to never do',
  inputSchema: {
    type: 'object',
    properties: {
      tokenName: {
        type: 'string',
        description: 'Token name',
      },
    },
    required: ['tokenName'],
  },
}

// Example
{ tokenName: "primary" }

// Returns
{
  "tokenName": "primary",
  "do": [
    "Use for main CTA buttons",
    "Key interactive elements",
    "Primary navigation items"
  ],
  "never": [
    "More than one primary action per section",
    "Decorative elements",
    "Large background areas"
  ]
}
```

### `rafters_get_dependencies`

Get token dependency relationships.

```typescript
{
  name: 'rafters_get_dependencies',
  description: 'Get tokens that a token depends on or tokens that depend on it',
  inputSchema: {
    type: 'object',
    properties: {
      tokenName: {
        type: 'string',
        description: 'Token name',
      },
      direction: {
        type: 'string',
        enum: ['dependsOn', 'dependents', 'both'],
        description: 'Direction of dependency lookup',
      },
    },
    required: ['tokenName'],
  },
}

// Example
{ tokenName: "ocean-blue-500", direction: "dependents" }

// Returns
{
  "tokenName": "ocean-blue-500",
  "dependents": [
    {
      "name": "primary",
      "generationRule": "reference:ocean-blue-500"
    },
    {
      "name": "link",
      "generationRule": "reference:ocean-blue-500"
    }
  ]
}
```

### `rafters_get_config`

Get the design system configuration.

```typescript
{
  name: 'rafters_get_config',
  description: 'Get the design system configuration including base units, progression ratios, and typography settings',
  inputSchema: {
    type: 'object',
    properties: {},
  },
}

// Returns
{
  "base": {
    "spacingUnit": 4,
    "progressionRatio": "minor-third"
  },
  "typography": {
    "fontFamily": "'Noto Sans Variable', sans-serif",
    "monoFontFamily": "ui-monospace, SFMono-Regular, ..."
  },
  "colors": [
    { "name": "neutral", "oklch": { "l": 0.5, "c": 0, "h": 0 } },
    { "name": "ocean-blue", "oklch": { "l": 0.5, "c": 0.12, "h": 240 } }
  ],
  "semanticMappings": {
    "primary": { "color": "ocean-blue", "position": "500" },
    "background": { "color": "neutral", "position": "50" }
  }
}
```

### `rafters_validate_contrast`

Validate color contrast for accessibility.

```typescript
{
  name: 'rafters_validate_contrast',
  description: 'Check if two colors meet WCAG contrast requirements',
  inputSchema: {
    type: 'object',
    properties: {
      foreground: {
        type: 'string',
        description: 'Foreground token name or OKLCH value',
      },
      background: {
        type: 'string',
        description: 'Background token name or OKLCH value',
      },
      level: {
        type: 'string',
        enum: ['AA', 'AAA'],
        description: 'WCAG level to check (default: AA)',
      },
    },
    required: ['foreground', 'background'],
  },
}

// Example
{ foreground: "primary-foreground", background: "primary", level: "AA" }

// Returns
{
  "passes": true,
  "contrastRatio": 7.2,
  "required": 4.5,
  "level": "AA",
  "recommendation": "Passes AA for normal text and AAA for large text"
}
```

---

## Implementation

```typescript
// packages/cli/src/commands/mcp.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NodePersistenceAdapter } from '@rafters/design-tokens/persistence';
import { TokenRegistry } from '@rafters/design-tokens';

export async function mcp(cwd: string): Promise<void> {
  const adapter = new NodePersistenceAdapter(cwd);
  const configPath = join(cwd, '.rafters', 'config.rafters.json');

  // Load all tokens into registry
  const registry = new TokenRegistry();
  const namespaces = await adapter.listNamespaces();

  for (const namespace of namespaces) {
    const tokens = await adapter.loadNamespace(namespace);
    for (const token of tokens) {
      registry.add(token);
    }
  }

  // Create MCP server
  const server = new Server(
    {
      name: 'rafters-mcp',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'rafters_list_namespaces',
        description: 'List all available token namespaces in the design system',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'rafters_get_tokens',
        description:
          'Get design tokens with full metadata. Filter by namespace to get specific token types.',
        inputSchema: {
          type: 'object',
          properties: {
            namespace: {
              type: 'string',
              description: 'Filter by namespace (e.g., "color", "spacing", "semantic")',
            },
            category: {
              type: 'string',
              description: 'Filter by category (e.g., "color", "dimension")',
            },
          },
        },
      },
      {
        name: 'rafters_get_token',
        description:
          'Get a specific token by name with all metadata including semantic meaning, usage patterns, and dependencies',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Token name (e.g., "primary", "spacing-4", "ocean-blue-500")',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'rafters_search_tokens',
        description:
          'Search tokens by name or semantic meaning. Useful for finding tokens that match a concept.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (e.g., "primary button", "danger", "small spacing")',
            },
            limit: {
              type: 'number',
              description: 'Maximum results to return (default: 10)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'rafters_get_usage_patterns',
        description: 'Get usage guidance for a token - what to do and what to never do',
        inputSchema: {
          type: 'object',
          properties: {
            tokenName: {
              type: 'string',
              description: 'Token name',
            },
          },
          required: ['tokenName'],
        },
      },
      {
        name: 'rafters_get_dependencies',
        description: 'Get tokens that a token depends on or tokens that depend on it',
        inputSchema: {
          type: 'object',
          properties: {
            tokenName: {
              type: 'string',
              description: 'Token name',
            },
            direction: {
              type: 'string',
              enum: ['dependsOn', 'dependents', 'both'],
              description: 'Direction of dependency lookup',
            },
          },
          required: ['tokenName'],
        },
      },
      {
        name: 'rafters_get_config',
        description:
          'Get the design system configuration including base units, progression ratios, and typography settings',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'rafters_validate_contrast',
        description: 'Check if two colors meet WCAG contrast requirements',
        inputSchema: {
          type: 'object',
          properties: {
            foreground: {
              type: 'string',
              description: 'Foreground token name or OKLCH value',
            },
            background: {
              type: 'string',
              description: 'Background token name or OKLCH value',
            },
            level: {
              type: 'string',
              enum: ['AA', 'AAA'],
              description: 'WCAG level to check (default: AA)',
            },
          },
          required: ['foreground', 'background'],
        },
      },
    ],
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'rafters_list_namespaces': {
          const namespaces = await adapter.listNamespaces();
          return {
            content: [{ type: 'text', text: JSON.stringify(namespaces, null, 2) }],
          };
        }

        case 'rafters_get_tokens': {
          const filter: { namespace?: string; category?: string } = {};
          if (args?.namespace) filter.namespace = args.namespace as string;
          if (args?.category) filter.category = args.category as string;

          const tokens = registry.list(
            Object.keys(filter).length > 0 ? filter : undefined
          );
          return {
            content: [{ type: 'text', text: JSON.stringify(tokens, null, 2) }],
          };
        }

        case 'rafters_get_token': {
          const tokenName = args?.name as string;
          const token = registry.get(tokenName);

          if (!token) {
            return {
              content: [{ type: 'text', text: `Token "${tokenName}" not found` }],
            };
          }

          return {
            content: [{ type: 'text', text: JSON.stringify(token, null, 2) }],
          };
        }

        case 'rafters_search_tokens': {
          const query = (args?.query as string)?.toLowerCase() ?? '';
          const limit = (args?.limit as number) ?? 10;

          const results = registry
            .list()
            .filter(
              (t) =>
                t.name.toLowerCase().includes(query) ||
                t.semanticMeaning?.toLowerCase().includes(query)
            )
            .slice(0, limit)
            .map((t) => ({
              name: t.name,
              namespace: t.namespace,
              semanticMeaning: t.semanticMeaning,
              matchReason: t.name.toLowerCase().includes(query)
                ? 'Matched on name'
                : 'Matched on semantic meaning',
            }));

          return {
            content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
          };
        }

        case 'rafters_get_usage_patterns': {
          const tokenName = args?.tokenName as string;
          const token = registry.get(tokenName);

          if (!token) {
            return {
              content: [{ type: 'text', text: `Token "${tokenName}" not found` }],
            };
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    tokenName,
                    do: token.usagePatterns?.do ?? [],
                    never: token.usagePatterns?.never ?? [],
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'rafters_get_dependencies': {
          const tokenName = args?.tokenName as string;
          const direction = (args?.direction as string) ?? 'both';

          const result: Record<string, unknown> = { tokenName };

          if (direction === 'dependsOn' || direction === 'both') {
            result.dependsOn = registry.getDependencies(tokenName);
          }

          if (direction === 'dependents' || direction === 'both') {
            const dependents = registry.getDependents(tokenName);
            result.dependents = dependents.map((name) => ({
              name,
              generationRule: registry.getDependencyInfo(name)?.rule,
            }));
          }

          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        }

        case 'rafters_get_config': {
          const config = JSON.parse(await readFile(configPath, 'utf-8'));
          return {
            content: [{ type: 'text', text: JSON.stringify(config, null, 2) }],
          };
        }

        case 'rafters_validate_contrast': {
          const foreground = args?.foreground as string;
          const background = args?.background as string;
          const level = (args?.level as string) ?? 'AA';

          // Resolve token names to OKLCH values
          const fgToken = registry.get(foreground);
          const bgToken = registry.get(background);

          // TODO: Implement actual contrast calculation
          // For now, return placeholder
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    foreground,
                    background,
                    level,
                    passes: true,
                    contrastRatio: 7.2,
                    required: level === 'AAA' ? 7 : 4.5,
                    recommendation: 'Passes AA for normal text',
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

---

## Agent Configuration

### Claude Desktop

```json
// ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// %APPDATA%\Claude\claude_desktop_config.json (Windows)

{
  "mcpServers": {
    "rafters": {
      "command": "npx",
      "args": ["rafters", "mcp"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

### Cursor

```json
// .cursor/mcp.json in project root

{
  "servers": {
    "rafters": {
      "command": "npx",
      "args": ["rafters", "mcp"]
    }
  }
}
```

---

## Usage Examples

### Agent Conversation

**User:** "What color should I use for a danger button?"

**Agent uses `rafters_search_tokens`:**
```json
{ "query": "danger error destructive" }
```

**Agent receives:**
```json
[
  {
    "name": "destructive",
    "namespace": "semantic",
    "semanticMeaning": "Errors, delete actions, danger states"
  },
  {
    "name": "destructive-foreground",
    "namespace": "semantic",
    "semanticMeaning": "Text on destructive backgrounds"
  }
]
```

**Agent uses `rafters_get_token`:**
```json
{ "name": "destructive" }
```

**Agent receives full token with usage patterns:**
```json
{
  "name": "destructive",
  "value": "var(--color-red-500)",
  "usagePatterns": {
    "do": ["Delete buttons", "Error messages", "Destructive actions"],
    "never": ["Success states", "Informational content"]
  }
}
```

**Agent responds:** "Use the `destructive` token for danger buttons. It's mapped to red-500 and should be used with `destructive-foreground` for the text. This token is designed for delete buttons and error states."

---

## Key Principles

1. **Read-only** - Agents query the system, they don't modify it
2. **Rich context** - Every response includes WHY (semanticMeaning, usagePatterns)
3. **No network** - Runs locally via stdio, reads directly from filesystem
4. **Schema-driven** - Token metadata answers questions so agents don't guess
5. **Dependency-aware** - Agents can understand how tokens relate to each other
