<p align="center">
  <img src="https://raw.githubusercontent.com/real-handy/rafters/main/public/rafters.svg" alt="Rafters Logo" width="200"/>
</p>

# Rafters CLI

> CLI tool for installing Rafters design system components with embedded design intelligence for AI agents

Rafters CLI helps you add React components with built-in AI agent design intelligence patterns including cognitive load optimization, attention economics, accessibility features, and trust-building patterns.

## Quick Start

1. **Initialize Rafters in your React project:**
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

### `rafters init`

Initialize Rafters in your existing React project. This command:

- Checks for React dependencies
- Detects your package manager (pnpm/yarn/npm)
- Creates `.rafters/` configuration directory
- Installs core dependencies
- Sets up AI agent instructions
- Configures component and story directories

**Interactive setup:**
```bash
? Do you use Storybook? (y/N)
? Components directory? (./src/components/ui)
? Stories directory? (./src/stories)
```

### `rafters add <component>`

Install a component with embedded design intelligence:

```bash
npx rafters add button
npx rafters add input --force  # Overwrite existing
```

**What gets installed:**
- Component with intelligence comments
- Cognitive load analysis (1-10 scale)
- Attention economics patterns
- Accessibility features (WCAG AAA)
- Trust-building patterns
- Storybook intelligence story (if enabled)
- Updated component manifest

### `rafters list`

Show available and installed components:

```bash
npx rafters list              # Compact view
npx rafters list --details    # Detailed view with intelligence
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

## Project Structure

After initialization, Rafters creates:

```
your-project/
├── .rafters/
│   ├── config.json              # CLI configuration
│   ├── agent-instructions.md    # AI agent guidance
│   └── component-manifest.json  # Intelligence metadata
├── src/
│   ├── components/ui/           # Installed components
│   ├── lib/utils.ts            # Utility functions
│   └── stories/                # Intelligence stories (if Storybook)
```

## Configuration

`.rafters/config.json`:
```json
{
  "version": "1.0.0",
  "componentsDir": "./src/components/ui",
  "storiesDir": "./src/stories",
  "hasStorybook": true,
  "packageManager": "pnpm",
  "registry": "https://registry.rafters.dev"
}
```

## AI Agent Integration

Rafters creates `.rafters/agent-instructions.md` with guidance for AI coding assistants:

- How to use component intelligence patterns
- Cognitive load optimization guidelines  
- Accessibility-first development approach
- Trust-building interaction patterns
- Quick reference to component manifest

## Requirements

- **Node.js** 18+ 
- **React** 18+
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