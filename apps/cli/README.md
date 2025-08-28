<p align="center">
  <img src="https://raw.githubusercontent.com/real-handy/rafters/main/public/rafters.svg" alt="Rafters Logo" width="200"/>
</p>

# Rafters CLI

> Command-line tool for initializing design token systems and managing components with embedded AI intelligence

Rafters CLI helps you initialize a complete design system foundation and add React components with built-in AI agent design intelligence patterns including cognitive load optimization, attention economics, accessibility features, and trust-building patterns.

## ⚠️ CRITICAL: How Rafters Works ⚠️

**JSON FILES ARE THE SINGLE SOURCE OF TRUTH**

Rafters uses a **Generator → JSON Files → CLI** architecture:

1. **`rafters init`** → Generators create `.rafters/tokens/*.json` files with sane defaults
2. **Studio modifies JSON files** → Humans edit design tokens through Studio interface  
3. **All CLI operations** → Read from `.rafters/tokens/*.json` files (never hardcoded values)

**The `.rafters/tokens/` directory contains your complete design system:**
```
.rafters/tokens/
├── color.json          # Color system with semantic meaning
├── spacing.json        # Mathematical spacing scales  
├── z-index.json        # Layering system
├── typography.json     # Type scales and hierarchy
└── ... (18+ token files)
```

**Never edit these JSON files manually** - use Rafters Studio or regenerate with `rafters init`.

## Quick Start

1. **Initialize Rafters design system in your project:**
   ```bash
   npx rafters init
   ```

2. **Add components with design intelligence:**
   ```bash
   npx rafters add button
   npx rafters add input
   npx rafters add card
   ```

3. **List available components:**
   ```bash
   npx rafters list
   ```

## Commands

### `init` - Initialize Design System

Initialize complete design token system and prepare for component installation.

**What it does:**
1. **Checks Tailwind version** - Requires v4+, stops if v3 detected
2. **Creates `.rafters/` structure** - Configuration and tokens directory
3. **Generates stock tokens** - Runs all 18 design token generators
4. **Writes token JSONs** - Saves to `.rafters/tokens/*.json`
5. **Generates CSS** - Creates Tailwind v4 `@theme` configuration
6. **Injects into CSS** - Updates `app.css` or `globals.css`
7. **Creates component registry** - Prepares for component tracking

**Usage:**
```bash
npx rafters init

✓ Checking Tailwind version... v4.0.0 ✓
✓ Creating .rafters/ directory...
✓ Generating design tokens...
  → tokens/spacing.json (12 tokens)
  → tokens/color.json (24 tokens)
  → tokens/typography.json (8 tokens)
  ... all 18 generators
✓ Generating CSS from tokens...
✓ Injecting into app.css...
✓ Rafters initialized! Your components now have design intelligence.
```

**Error States:**
```bash
✗ Tailwind v3 detected. Rafters requires Tailwind v4+
  Please upgrade: npm install tailwindcss@next
```

**Interactive setup:**
```bash
? Do you use Storybook? (y/N)
? Components directory? (./src/components/ui)
? Stories directory? (./src/stories)
```

### `add` - Install Components

Install components with embedded AI intelligence patterns.

**What it does:**
1. **Downloads component** from Rafters registry
2. **Adds intelligence header** with cognitive load, trust levels
3. **Installs dependencies** (Radix UI, etc.)
4. **Updates local registry** in `.rafters/registry/components.json`
5. **Adds to project** at `src/components/ui/`
6. **Adds Storybook story** (if configured)

**Usage:**
```bash
npx rafters add button

✓ Installing Button component...
✓ Adding intelligence patterns...
✓ Installing dependencies: @radix-ui/react-slot
✓ Updating component registry...
✓ Button installed with design intelligence
```

**Multiple components:**
```bash
npx rafters add button input select

✓ Installing 3 components...
✓ Button installed
✓ Input installed  
✓ Select installed
✓ All components installed with design intelligence
```

### `list` - Show Available Components

Lists all components available in the Rafters registry.

```bash
npx rafters list

Available components:
  • button - Interactive button with trust patterns
  • input - Form input with validation states
  • select - Dropdown with accessibility
  • dialog - Modal with cognitive load management
  ... more components
```

## Available Components

| Component | Cognitive Load | Intelligence Features |
|-----------|----------------|----------------------|
| **Button** | 3/10 | Size hierarchy, destructive confirmation, trust patterns |
| **Input** | 4/10 | Validation intelligence, state feedback, accessibility |
| **Card** | 2/10 | Container intelligence, cognitive load optimization |
| **Select** | 5/10 | Choice anxiety reduction, interaction patterns |
| **Dialog** | 7/10 | Modal timing, focus management, trust building |
| **Label** | 1/10 | Information hierarchy, semantic relationships |
| **Tabs** | 4/10 | Content organization, navigation patterns |

## Design Intelligence Features

Every Rafters component includes embedded intelligence about:

### **Cognitive Load** (1-10 scale)
Mental overhead assessment helps you balance interface complexity.

### **Attention Economics**
Visual hierarchy patterns that guide user attention effectively.

### **Accessibility**
WCAG AAA compliance with motor, visual, cognitive, and auditory support.

### **Trust Building**
Patterns for secure interactions and sensitive data handling.

### **Semantic Meaning**
How design communicates meaning beyond just aesthetics.

## Project Structure After Init

```
your-project/
├── .rafters/                    # Rafters configuration directory
│   ├── tokens/                  # Design token JSON files
│   │   ├── color.json          # Color tokens with AI metadata
│   │   ├── spacing.json        # Spacing scale tokens
│   │   ├── typography.json     # Typography tokens
│   │   └── ... (18 files)      # All generator outputs
│   ├── registry/               # Local component tracking  
│   │   └── components.json     # Installed components manifest
│   ├── config.json             # CLI configuration
│   └── agent-instructions.md  # AI usage patterns
├── src/
│   ├── components/ui/          # Installed components go here
│   ├── lib/utils.ts            # Utility functions
│   └── stories/                # Intelligence stories (if Storybook)
└── app.css or globals.css      # CSS with injected design tokens
```

## Token System

### Stock Tokens (Grayscale Foundation)

Initial tokens are mathematically perfect grayscale:
```json
{
  "generator": "color",
  "tokens": [
    {
      "name": "primary",
      "value": "oklch(0.45 0 0)",  // Grayscale default
      "semanticMeaning": "Primary actions and brand color",
      "cognitiveLoad": 3,
      "trustLevel": "high",
      "usageContext": ["buttons", "links", "brand"]
    }
  ]
}
```

### Studio Modifications

After Studio customization, tokens include overrides:
```json
{
  "name": "primary",
  "value": "oklch(0.45 0 0)",           // Stock grayscale
  "modifiedValue": "oklch(0.45 0.15 260)", // Designer's brand blue
  "designerReasoning": "Brand blue from company logo",
  // AI metadata preserved...
}
```

### CSS Generation

Reads `.rafters/tokens/*.json` and generates:
```css
@theme {
  /* Uses modifiedValue if exists, else value */
  --color-primary: oklch(0.45 0.15 260);
  --color-primary-foreground: oklch(0.98 0 0);
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.618rem;
  /* ... all tokens */
}
```

## Local Component Registry

`.rafters/registry/components.json` tracks installed components:
```json
{
  "version": "1.0.0",
  "components": {
    "button": {
      "name": "button",
      "installedAt": "2025-01-27T12:00:00Z",
      "version": "0.1.0",
      "path": "src/components/ui/button.tsx",
      "dependencies": ["@radix-ui/react-slot"],
      "intelligence": {
        "cognitiveLoad": 3,
        "trustLevel": "high"
      }
    }
  }
}
```

## Configuration

`.rafters/config.json`:
```json
{
  "version": "1.0.0",
  "tailwindVersion": "4.0.0",
  "cssFile": "app.css",
  "componentsPath": "src/components/ui",
  "hasStorybook": true,
  "initialized": "2025-01-27T12:00:00Z"
}
```

## AI Agent Integration

Rafters creates `.rafters/agent-instructions.md` with guidance for AI coding assistants:

- How to use component intelligence patterns
- Cognitive load optimization guidelines  
- Accessibility-first development approach
- Trust-building interaction patterns
- Quick reference to component manifest

## Debugging Guide

**Component not working?**
1. Check `.rafters/registry/components.json` - is it installed?
2. Check component file has intelligence header
3. Check dependencies are installed

**Styles not applying?**
1. Check `.rafters/tokens/` - are tokens generated?
2. Check CSS file - is `@theme` injected?
3. Check Tailwind version - must be v4+

**Need to understand a component?**
1. Check `.rafters/agent-instructions.md` for usage patterns
2. Check component intelligence header for metadata
3. Check registry for installation details

## Requirements

- **Node.js** 18+ 
- **React** 18+
- **Tailwind CSS** v4+ (required)
- **Package Manager**: npm, yarn, or pnpm

## Design Philosophy

Rafters follows these principles:

1. **Intent → Meaning → Form → Implementation**
2. **Accessibility as Foundation** (not an afterthought)
3. **Cognitive Load Optimization** (reduce mental overhead)
4. **Systems Over Solutions** (coherent design language)

## Contributing

Rafters is designed to teach design intelligence, not just provide functionality. Each component embeds educational patterns about human-computer interaction.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

> "Design intelligence: Understanding the 'why' behind every pixel, interaction, and decision."