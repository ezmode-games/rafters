<p align="center">
  <img src="https://raw.githubusercontent.com/real-handy/rafters/main/public/rafters.svg" alt="Rafters Logo" width="200"/>
</p>

# Rafters CLI

> AI-first command-line tool for managing design system components with embedded intelligence

Lean CLI focused on project setup and component management. AI agents access design intelligence through the integrated MCP server, not CLI commands.

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
1. **Checks prerequisites** - Validates Node.js project, React 18+, Tailwind v4+
2. **Creates `.rafters/` structure** - Configuration and tokens directory
3. **Generates design tokens** - Creates complete token system or fetches from Studio
4. **Writes token files** - Saves tokens in chosen format (Tailwind, CSS, React Native)
5. **Injects CSS imports** - Updates your CSS file with design token imports
6. **Creates utils and directories** - Sets up component structure and utilities
7. **Installs dependencies** - Adds required packages (clsx, tailwind-merge, etc.)

**Usage:**
```bash
# Interactive mode (default)
npx rafters init

# Non-interactive with defaults
npx rafters init --yes

# Use configuration file
npx rafters init --config ./rafters-config.json
```

**Interactive setup:**
```bash
? Components directory: ./src/components/ui
? CSS file to inject design tokens: ./src/app/globals.css  
? Studio shortcode (leave blank for default grayscale): 
? Design token format: Tailwind CSS v4
? Package manager: pnpm
```

**Options:**
- `--yes, -y` - Use default values for all prompts (non-interactive)
- `--config <file>, -c <file>` - Use configuration from JSON answers file

**Answers File Format:**
```json
{
  "componentsDir": "./src/components/ui",
  "cssFile": "./src/app/globals.css",
  "studioShortcode": "",
  "tokenFormat": "tailwind",
  "packageManager": "pnpm"
}
```

**Framework Detection:**
Automatically detects your framework and suggests appropriate defaults:
- **Next.js**: `./src/app/globals.css`
- **Vite**: `./src/index.css`
- **React Router 7**: `./app/root.css`

**Error States:**
```bash
✗ No package.json found. Run this in a Node.js project.
✗ React not found in dependencies. Rafters requires React 18+.
✗ Tailwind v3 detected. Rafters requires Tailwind CSS v4.
✗ Rafters already initialized. Remove .rafters directory to reinitialize.
```

### `add` - Install Components

Install components with embedded AI intelligence patterns.

**What it does:**
1. **Downloads component** from Rafters registry
2. **Adds intelligence header** with cognitive load, trust levels
3. **Installs dependencies** (Radix UI, etc.)
4. **Updates local registry** in `.rafters/registry/components.json`
5. **Adds to project** at `src/components/ui/`

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

### `list` - Component Status Overview

Shows installed components, available updates, and registry components with intelligence metadata.

**What it shows:**
1. **Installed components** - Local components with version and update status
2. **Available updates** - Components with newer versions in registry
3. **Available components** - Registry components not yet installed
4. **Intelligence metadata** - Cognitive load and trust levels for each component

**Usage:**
```bash
# Compact view with update indicators
npx rafters list

Installed Components:
✓ button           v0.1.0
↑ input            v0.1.0 (update available: v0.1.2)
✓ card             v0.2.0

Available Components:
  select         - Dropdown with accessibility (load: 5/10, trust: high)
  dialog         - Modal with cognitive load management (load: 7/10, trust: critical)
  label          - Form labels with semantic relationships (load: 1/10, trust: low)

Summary: 3 installed, 3 available
Updates: 1 component(s) have updates available
Run 'rafters add input' to update

# Detailed view with full metadata
npx rafters list --details

Installed Components:

button (v0.1.0)
  Path: src/components/ui/button.tsx
  Installed: 1/27/2025
  Intelligence: Cognitive load=3/10, Size hierarchy
  ✓ Up to date
  Dependencies: @radix-ui/react-slot

input (v0.1.0)
  Path: src/components/ui/input.tsx
  Installed: 1/27/2025
  Intelligence: Cognitive load=4/10, Validation states
  ↑ Update available: v0.1.2
  Dependencies: class-variance-authority

Available Components (3 remaining):
  select (v0.1.0)
    Dropdown with accessibility and choice anxiety reduction
    Intelligence: Cognitive load=5/10, Trust level=high
    
  dialog (v0.1.1)
    Modal with cognitive load management and focus patterns
    Intelligence: Cognitive load=7/10, Trust level=critical
```

**Status Indicators:**
- `✓` - Component up to date
- `↑` - Update available
- `↗` - Development version (newer than registry)
- `?` - Component not found in registry

### `clean` - Remove Rafters Installation

Completely removes Rafters from your project, including all generated files and directories.

**What it does:**
1. **Removes `.rafters/` directory** - Deletes configuration, tokens, and registry
2. **Removes CSS imports** - Cleans up design token imports from CSS files
3. **Removes components** - Optionally removes installed UI components
4. **Clean slate** - Restores project to pre-Rafters state

**Usage:**
```bash
# Remove everything (interactive confirmation)
npx rafters clean

# Force removal without confirmation
npx rafters clean --force
```

### `mcp` - Start MCP Server

Starts the Model Context Protocol server for AI agent integration.

**What it does:**
1. **Loads design tokens** - Reads `.rafters/tokens/*.json` files
2. **Provides component intelligence** - Exposes cognitive load, trust patterns
3. **Validates color combinations** - Checks accessibility and cognitive load
4. **Calculates design metrics** - Helps AI agents make informed UX decisions

**Usage:**
```bash
# Start MCP server (runs until stopped)
npx rafters mcp
```

**MCP Tools Available to AI Agents:**
- `get_color_intelligence` - Complete color analysis and semantic meaning
- `get_component_intelligence` - Component cognitive load and usage patterns
- `validate_color_combination` - Multi-color accessibility validation
- `get_accessible_colors` - WCAG compliant color recommendations
- `calculate_cognitive_load` - Interface complexity assessment

## Components with Design Intelligence

| Component | Cognitive Load | Intelligence Features |
|-----------|----------------|----------------------|
| **Button** | 3/10 | Size hierarchy, destructive confirmation, trust patterns |
| **Input** | 4/10 | Validation intelligence, state feedback, accessibility |
| **Card** | 2/10 | Container intelligence, cognitive load optimization |
| **Select** | 5/10 | Choice anxiety reduction, interaction patterns |
| **Dialog** | 7/10 | Modal timing, focus management, trust building |
| **Label** | 1/10 | Information hierarchy, semantic relationships |

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
│   │   └── ... (18+ files)     # All generator outputs
│   ├── component-manifest.json # Installed components tracking
│   ├── config.json             # CLI configuration
│   └── agent-instructions.md   # AI usage patterns and guidelines
├── src/
│   ├── components/ui/          # Installed components go here
│   └── lib/utils.ts            # Utility functions (clsx + tailwind-merge)
└── app.css or globals.css      # CSS with injected design tokens
```

## Template Files

The CLI includes template answer files for common project setups:

```
apps/cli/templates/
├── answers-default.json        # Basic setup with npm
├── answers-nextjs.json         # Next.js optimized setup  
├── answers-vite.json           # Vite project setup
└── answers-test.json           # Testing environment setup
```

**Usage with templates:**
```bash
# Use Next.js optimized setup
npx rafters init --config ./node_modules/rafters/templates/answers-nextjs.json

# Use for automated CI/CD
npx rafters init --config ./scripts/rafters-production.json
```

## Token System

### Generated Design Tokens

Rafters creates mathematically perfect design tokens with embedded intelligence:
```json
{
  "generator": "color",
  "tokens": [
    {
      "name": "primary",
      "value": "oklch(0.45 0 0)",
      "semanticMeaning": "Primary actions and brand color",
      "cognitiveLoad": 3,
      "trustLevel": "high",
      "usageContext": ["buttons", "links", "brand"]
    }
  ]
}
```

### CSS Output

Generates Tailwind v4 compatible CSS:
```css
@theme {
  --color-primary: oklch(0.45 0.15 260);
  --color-primary-foreground: oklch(0.98 0 0);
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.618rem;
}
```

## Component Manifest

`.rafters/component-manifest.json` tracks installed components:
```json
{
  "version": "1.0.0",
  "initialized": "2025-01-27T12:00:00Z",
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
  "registry": "https://rafters.realhandy.tech/registry",
  "componentsDir": "./src/components/ui",
  "cssFile": "./src/app/globals.css",
  "tailwindVersion": "v4",
  "tokenFormat": "tailwind",
  "packageManager": "pnpm"
}
```

**Configuration Options:**
- `registry` - URL to Rafters component registry
- `componentsDir` - Directory where components are installed
- `cssFile` - CSS file for design token injection
- `tailwindVersion` - Detected Tailwind CSS version (v3/v4)
- `tokenFormat` - Format for design tokens (tailwind/css/react-native)
- `packageManager` - Detected package manager (npm/yarn/pnpm)

## MCP Server for AI Agents

The CLI includes an MCP (Model Context Protocol) server for AI agent integration:

```bash
npx rafters mcp
```

Provides AI agents with:
- Design token intelligence and semantic meaning
- Component metadata and usage patterns  
- Cognitive load calculations and trust building guidance
- Color intelligence and accessibility validation
- Systematic design reasoning for better UX decisions

## Debugging Guide

**Component not working?**
1. Check `.rafters/component-manifest.json` - is it installed?
2. Check component file has intelligence header
3. Check dependencies are installed: `pnpm install`

**Styles not applying?**
1. Check `.rafters/tokens/` - are tokens generated?
2. Check CSS file - are design token imports present?
3. Check Tailwind version - must be v4+
4. Restart your dev server after token changes

**Init command failing?**
1. Check Node.js version - must be 18+
2. Check React dependencies - must be 18+
3. Check Tailwind version - v3 is not supported
4. Remove `.rafters/` directory and try again

**Need to understand a component?**
1. Check `.rafters/agent-instructions.md` for usage patterns
2. Check component intelligence header for metadata
3. Check component manifest for installation details

**Testing configuration?**
Use the clean command to reset and try different configurations:
```bash
npx rafters clean --force
npx rafters init --config ./different-config.json
```

## Development and Testing

### Running Tests

The CLI includes comprehensive integration tests that validate real-world usage scenarios:

```bash
# Run all tests
pnpm test

# Run integration tests only  
pnpm test:integration

# Run tests in watch mode
pnpm test:watch
```

### Test Coverage

- **Integration Tests**: Real filesystem operations with framework detection
- **Command Tests**: All CLI commands with various options and error cases  
- **Template Tests**: Answer file configurations for different project types
- **Cleanup Tests**: Proper cleanup and error handling

**Test Performance Optimizations:**
- Dependency installation is automatically skipped in test/CI environments
- Integration tests run in ~6 seconds (down from 50+ seconds)
- Tests use isolated temporary directories with proper cleanup
- Real filesystem operations ensure accurate test coverage

### Development Commands

```bash
# Build the CLI
pnpm build

# Run type checking
pnpm type-check  

# Run linting
pnpm biome check

# Run all quality checks
pnpm preflight
```

### Testing with Answer Files

Create custom answer files for testing different scenarios:

```json
{
  "componentsDir": "./components",
  "cssFile": "./styles/main.css", 
  "studioShortcode": "ABC123",
  "tokenFormat": "css",
  "packageManager": "yarn"
}
```

Then test with:
```bash
npx rafters init --config ./test-answers.json
```

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