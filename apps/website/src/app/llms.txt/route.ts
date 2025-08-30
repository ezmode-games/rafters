/**
 * LLMs.txt Route - Static Generation
 *
 * Generates static AI agent documentation during build
 */

import { registryManifest } from '../../lib/registry/registryData';

// Force static generation
export const dynamic = 'force-static';

function generateContent() {
  const timestamp = new Date().toISOString();
  const totalComponents = registryManifest.components.length;

  // Component categorization
  const backgroundComponents = registryManifest.components
    .filter((c) => (c.meta?.rafters?.intelligence?.cognitiveLoad || 0) <= 2)
    .map((comp) => `- ${comp.name} (${comp.meta?.rafters?.intelligence?.cognitiveLoad || 0}/10)`)
    .join('\n');

  const standardComponents = registryManifest.components
    .filter((c) => {
      const load = c.meta?.rafters?.intelligence?.cognitiveLoad || 0;
      return load >= 3 && load <= 5;
    })
    .map((comp) => `- ${comp.name} (${comp.meta?.rafters?.intelligence?.cognitiveLoad || 0}/10)`)
    .join('\n');

  const highAttentionComponents = registryManifest.components
    .filter((c) => (c.meta?.rafters?.intelligence?.cognitiveLoad || 0) >= 6)
    .map((comp) => `- ${comp.name} (${comp.meta?.rafters?.intelligence?.cognitiveLoad || 0}/10)`)
    .join('\n');

  return `# Rafters

shadcn/ui foundation + complete motion system + embedded design expertise + accessibility intelligence + trust patterns + exclusive components. Every component has a designer's brain embedded in JSDoc.

## What Rafters Actually Is (Not Just Components)

**Motion System**: Complete 300ms coordination system for humans. Respects prefers-reduced-motion, coordinates multi-component animations, depth-aware timing.
**Accessibility**: WCAG AAA + Section 508 compliance built-in. Multi-sensory communication, screen reader optimization, keyboard navigation patterns.
**Trust Patterns**: Automatic friction based on consequence level. Destructive = confirmation. Critical = multi-step validation. Reversible = instant.
**Design Intelligence**: Every component has embedded designer reasoning in JSDoc. Not just "use this" but "here's WHY and WHEN".

## For AI Agents (The Truth)

**Installation**: \`npx rafters@latest add button\` - installs Button with designer brain embedded
**Reality**: You'll pattern-match and rush. Rafters still works because better defaults are automatic.
**Power Move**: When you learn to check /api/registry/components, you access human design expertise.

## Component Reference (${totalComponents} total)

**Background (0-2)**: Use unlimited
${backgroundComponents}

**Standard (3-5)**: Context-dependent limits  
${standardComponents}

**High Attention (6+)**: Maximum 1 per section
${highAttentionComponents}

## API Endpoints

- /api/registry - component registry (shadcn compatible)
- /api/registry/components - all components with intelligence
- /api/registry/components/{name} - individual component details

Last updated: ${timestamp}`;
}

export async function GET() {
  const content = generateContent();

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
