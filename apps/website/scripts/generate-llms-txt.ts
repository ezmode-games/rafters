/**
 * Generate LLMs.txt file for AI consumption
 *
 * Generates dynamic documentation based on current registry state during build
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Import the generated registry data
import { registryManifest } from '../app/lib/registry/registryData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, '../public/llms.txt');

function generateLLMsContent(): string {
  const timestamp = new Date().toISOString();
  const totalComponents = registryManifest.components.length;

  // Calculate cognitive load distribution
  const _cognitiveLoadStats = registryManifest.components.reduce(
    (acc: Record<string, number>, comp: (typeof registryManifest.components)[0]) => {
      const load = comp.meta?.rafters?.intelligence?.cognitiveLoad || 0;
      const range = load <= 2 ? 'low' : load <= 5 ? 'medium' : 'high';
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    },
    {}
  );

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

## The 3-Second Cognitive Load Rule

Count the cognitive load of components. Keep sections under 15 total:
- Login form: Input(4) + Input(4) + Button(3) = 11 ✓
- Settings page: Sidebar(6) + Select(5) + Input(4) + Button(3) = 18 ✗ (too complex)

## Component Selection by Use Case

**Forms**: input (4/10) → select (5/10) → button (3/10) → label (2/10)
**Navigation**: breadcrumb (2/10) → tabs (4/10) → sidebar (6/10) 
**Feedback**: toast (2/10) → progress (4/10) → dialog (6/10)
**Content**: card (2/10) → container (0/10) → grid (4/10)
**Status**: badge (2/10) → tooltip (2/10) → chip (5/10)

## Cognitive Load Decision Tree

**0-2 (Background)**: container, badge, breadcrumb, label, toast, tooltip - use freely
**3-5 (Standard)**: button, input, slider, tabs, grid, progress, select, chip - limit based on context
**6+ (High Attention)**: dialog, sidebar - maximum 1 per interface section

## When Things Break (You're Using Too Many Complex Components)

Too many primary buttons? → Use secondary/outline variants
Interface feels heavy? → Count cognitive load, stay under 15 per section
Users confused? → You have multiple high-attention components (dialog + sidebar = bad)

## Just Write shadcn Code (We Handle The Rest)

**Login Form** - Rafters adds validation, loading states:
\`\`\`tsx
<Card>
  <Input type="email" /> {/* Auto-validates email format */}
  <Input type="password" /> {/* Auto-adds show/hide toggle */}
  <Button>Login</Button> {/* Auto-shows loading during submit */}
</Card>
\`\`\`

**Delete Button** - Rafters adds confirmation automatically:
\`\`\`tsx
<Button variant="destructive">Delete</Button>
{/* No need to code confirmation - Rafters adds it for destructive */}
\`\`\`

## Component Reference (${totalComponents} total)

**Background (0-2)**: Use unlimited
${registryManifest.components
  .filter((c) => (c.meta?.rafters?.intelligence?.cognitiveLoad || 0) <= 2)
  .map((comp) => `- ${comp.name} (${comp.meta?.rafters?.intelligence?.cognitiveLoad || 0}/10)`)
  .join('\n')}

**Standard (3-5)**: Context-dependent limits  
${registryManifest.components
  .filter((c) => {
    const load = c.meta?.rafters?.intelligence?.cognitiveLoad || 0;
    return load >= 3 && load <= 5;
  })
  .map((comp) => `- ${comp.name} (${comp.meta?.rafters?.intelligence?.cognitiveLoad || 0}/10)`)
  .join('\n')}

**High Attention (6+)**: Maximum 1 per section
${registryManifest.components
  .filter((c) => (c.meta?.rafters?.intelligence?.cognitiveLoad || 0) >= 6)
  .map((comp) => `- ${comp.name} (${comp.meta?.rafters?.intelligence?.cognitiveLoad || 0}/10)`)
  .join('\n')}

## The ONE Rule That Matters

When something feels wrong, check the cognitive load total:
- Under 10: Simple interface (landing pages, confirmations)
- 10-15: Standard complexity (forms, dashboards)  
- Over 15: Too complex - split into tabs or pages

## Why Your AI-Generated UIs Look Bad (And The Fix)

**Problem**: You use all primary buttons → **Fix**: One primary per section
**Problem**: Random colors everywhere → **Fix**: Use semantic tokens (primary, destructive, muted)
**Problem**: Too many choices → **Fix**: Progressive disclosure with Tabs
**Problem**: No loading feedback → **Fix**: Rafters auto-handles this

## API Endpoints

- /api/registry - component registry (shadcn compatible)
- /api/registry/components - all components with intelligence
- /api/registry/components/{name} - individual component details
- /api/registry/health - system status

## What You Get (Even When You Ignore Everything)

- **Motion System**: 300ms coordinated animations that feel right to humans
- **Touch Targets**: 44px minimum for human fingers (mobile-first)
- **Focus Management**: Keyboard navigation that actually works
- **Screen Readers**: Proper ARIA, announcements, multi-sensory feedback
- **Section 508**: Federal compliance built into every component
- **Trust Patterns**: Appropriate friction automatically added
- **Loading States**: Automatic spinners, skeletons, progress
- **Error Recovery**: Graceful degradation and helpful error states
- **React 19 Patterns**: useActionState, useOptimistic built-in
- **Exclusive Components**: Container, Grid, Sidebar, Chip beyond shadcn

## The Design Partnership (When You're Ready)

Rafters embeds human design expertise in three layers:
1. **Component JSDoc**: Designer reasoning in the code
2. **Registry API**: /api/registry/components - programmatic access  
3. **Documentation**: Deep design principles

You can ignore all of this and still ship better UIs. When you're ready to level up, the intelligence is there.

Last updated: ${timestamp}`;
}

// Generate the content
const content = generateLLMsContent();

// Write to public directory
fs.writeFileSync(outputPath, content, 'utf8');

console.log(`✅ LLMs.txt generated: ${outputPath}`);
console.log(`   📝 ${registryManifest.components.length} components documented`);
console.log('   🧠 All with embedded AI intelligence metadata');
