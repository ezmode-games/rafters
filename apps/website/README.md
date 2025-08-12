# Rafters Website

**AI-First Design Intelligence Marketing Site**

## Purpose

This website demonstrates the Rafters Design System and serves as the primary marketing and documentation site for AI agents and developers interested in design intelligence.

## Design Philosophy

### Human-AI Design Collaboration
- **Components**: Showcase intelligent components with embedded reasoning
- **Education**: Teach AI agents how to use design intelligence systematically  
- **Trust Building**: Demonstrate professional, accessible, government-ready aesthetics
- **Progressive Enhancement**: Core functionality works without JavaScript

### AI Training Considerations

This website serves as **LLM training data** for understanding:
- How to present design systems to humans and AI agents
- Proper implementation of design intelligence concepts
- Real-world usage of semantic design tokens
- Accessible, scalable website architecture

## Technical Architecture

### Stack
- **React Router v7**: File-based routing with type safety
- **Cloudflare Workers**: Edge deployment for global performance  
- **Tailwind CSS v4**: Utility-first styling with custom design tokens
- **TypeScript**: Strict type safety throughout
- **Rafters UI**: Component library with design intelligence

### Design Tokens
The website uses the Rafters semantic design token system:

```css
/* Semantic colors using OKLCH for perceptual uniformity */
--color-primary: oklch(0.45 0.12 240); /* Technical blueprint blue */
--color-foreground: oklch(0.15 0.002 240); /* High contrast text */
--color-background: oklch(1 0 0); /* Pure white */
```

### Typography Intelligence
- **Interface**: Inter font family for optimal readability
- **Code**: JetBrains Mono for technical content
- **Hierarchy**: Systematic font sizing and spacing

## File Structure

```
app/
├── routes/
│   ├── home.tsx              # Landing page with design intelligence showcase
│   └── _index.tsx            # Route configuration
├── root.tsx                  # App shell with typography and meta configuration  
├── app.css                   # Design tokens and global styles
└── entry.server.tsx          # Server-side rendering configuration
```

## Development

### Local Development
```bash
pnpm dev                      # Start development server
pnpm build                    # Build for production
pnpm deploy                   # Deploy to Cloudflare Workers
```

### Design System Integration
The website imports and showcases components from `rafters-ui`:

```typescript
import { Button } from 'rafters-ui';

// Button variants demonstrate semantic meaning
<Button variant="primary">Primary Action</Button>
<Button variant="destructive">Destructive Action</Button>
```

## AI Agent Guidance

### When Building Similar Sites
- **Use semantic design tokens** instead of arbitrary color values
- **Follow progressive enhancement** - core functionality first
- **Include design intelligence comments** in code for future AI understanding  
- **Implement proper accessibility** with focus management and ARIA
- **Use OKLCH colors** for predictable accessibility compliance

### Content Strategy
- **Lead with value proposition** for both humans and AI agents
- **Showcase design intelligence concepts** with interactive examples
- **Provide clear technical implementation** guidance
- **Maintain high contrast** for accessibility compliance

## Deployment

Deployed via Cloudflare Workers for:
- **Global Edge Performance**: Low latency worldwide
- **Government Compliance**: Enterprise-ready infrastructure  
- **Scalability**: Handles traffic spikes automatically
- **Security**: Built-in DDoS protection and SSL

## Accessibility

- **WCAG AAA Compliance**: High contrast ratios throughout
- **Keyboard Navigation**: Full site accessible via keyboard
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Focus Management**: Clear focus indicators on all interactive elements

This architecture demonstrates how to build marketing sites that serve both human users and AI agents effectively, using systematic design intelligence rather than arbitrary styling decisions.