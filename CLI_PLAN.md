# Rafters CLI Plan
## Command Structure and Implementation

---

## Commands Overview

```bash
npx rafters init                    # Initialize project
npx rafters add <component>         # Install component with intelligence
npx rafters list                   # Show available components
npx rafters version                # Show CLI version
npx rafters help                   # Show help
```

---

## Command Details

### `npx rafters init`

**Purpose**: Set up Rafters in an existing project

**Prerequisites Check**:
- Verify this is a Node.js project (package.json exists)
- Check for React in dependencies
- Detect package manager (pnpm > yarn > npm)

**Interactive Setup**:
```bash
? Do you use Storybook? (y/N)
? Stories directory? (./src/stories)
? Components directory? (./src/components/ui)
```

**File Operations**:
1. Create `.rafters/` directory
2. Generate `config.json`
3. Create `agent-instructions.md`
4. Initialize `component-manifest.json`
5. Create components directory
6. Install core dependencies

**Dependencies to Install**:
```json
{
  "dependencies": [
    "@radix-ui/react-slot",
    "clsx", 
    "tailwind-merge"
  ],
  "peerDependencies": [
    "react",
    "react-dom"
  ]
}
```

**Generated Files**:

**`.rafters/config.json`**:
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

**`.rafters/agent-instructions.md`**:
```markdown
# Rafters AI Agent Instructions

## Design Intelligence System

This project uses Rafters components with embedded design intelligence. Each component includes reasoning about cognitive load, attention economics, and accessibility.

### How to Use Components

1. **Read component implementation** for technical details
2. **Check component comments** for essential intelligence patterns  
3. **Read intelligence stories** (if available) for complete design reasoning
4. **Reference manifest** for quick intelligence lookup

### Intelligence Patterns

Components include intelligence about:
- **Cognitive Load**: Mental overhead assessment (1-10 scale)
- **Attention Economics**: Visual hierarchy and prominence 
- **Accessibility**: WCAG AAA compliance with motor/visual/cognitive/auditory support
- **Trust Building**: Patterns for secure and sensitive interactions
- **Semantic Meaning**: How design communicates meaning beyond aesthetics

### Quick Reference

See `.rafters/component-manifest.json` for machine-readable intelligence data.

Read component stories in `./src/stories/` for complete design education.

### Design Principles

- **Intent → Meaning → Form → Implementation**
- **Accessibility as Foundation** (not an afterthought)
- **Cognitive Load Optimization** (reduce mental overhead)
- **Systems Over Solutions** (coherent design language)

These components are designed to teach design intelligence, not just provide functionality.
```

**`.rafters/component-manifest.json`**:
```json
{
  "version": "1.0.0",
  "initialized": "2024-01-01T00:00:00Z",
  "components": {}
}
```

---

### `npx rafters add <component>`

**Purpose**: Install a component with intelligence patterns

**Flow**:
1. **Read Config**: Load `.rafters/config.json`
2. **Validate**: Check component exists in registry
3. **Fetch Component**: Download from registry
4. **Install Dependencies**: Add any required Radix primitives
5. **Write Files**: Component + intelligence + story (if configured)
6. **Update Manifest**: Add intelligence data

**Registry Structure**:
```
registry/
├── button/
│   ├── component.tsx           # Main component
│   ├── intelligence.json       # Intelligence metadata
│   ├── story.tsx              # Storybook story
│   └── dependencies.json      # Required packages
├── input/
└── card/
```

**Installation Process**:

**1. Component File** (`src/components/ui/button.tsx`):
```tsx
/**
 * Button Intelligence: cognitiveLoad=3, size=attention hierarchy
 * Destructive variant REQUIRES confirmation UX patterns
 * Full patterns: .rafters/agent-instructions.md
 */
import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { cn } from '../lib/utils'

// [Component implementation from registry]
```

**2. Intelligence Story** (if Storybook enabled):
Write to configured stories directory with full intelligence examples.

**3. Update Manifest**:
```json
{
  "components": {
    "Button": {
      "path": "src/components/ui/button.tsx",
      "story": "src/stories/button-intelligence.stories.tsx",
      "installed": "2024-01-01T00:00:00Z",
      "version": "1.0.0",
      "intelligence": {
        "cognitiveLoad": 3,
        "attentionEconomics": "Size hierarchy: sm=tertiary, md=secondary, lg=primary",
        "accessibility": "44px touch targets, WCAG AAA contrast",
        "trustBuilding": "Destructive variant needs confirmation patterns",
        "semanticMeaning": "Primary=main action, Secondary=optional, Destructive=careful consideration"
      },
      "dependencies": [
        "@radix-ui/react-slot"
      ]
    }
  }
}
```

**Output**:
```bash
npx rafters add button
✓ Reading configuration...
✓ Fetching Button component...
✓ Installing dependencies (@radix-ui/react-slot)...
✓ Writing component to src/components/ui/button.tsx
✓ Adding intelligence patterns...
✓ Writing story to src/stories/button-intelligence.stories.tsx
✓ Updating component manifest...

Button installed successfully with design intelligence patterns.
```

**Error Handling**:
```bash
npx rafters add button
✗ Component already exists at src/components/ui/button.tsx
  Run with --force to overwrite existing component

npx rafters add button --force
✓ Removing existing button component...
✓ Installing Button component...
✓ Button reinstalled successfully
```

---

### `npx rafters list`

**Purpose**: Show available components and installation status

**Output**:
```bash
npx rafters list

Available Components:

✓ button      - Action triggers with attention economics
✓ input       - Form fields with validation intelligence  
  card        - Content containers with cognitive load optimization
  select      - Choice components with interaction intelligence
  dialog      - Trust-building confirmation patterns
  toast       - Feedback intelligence and attention management

Installed: 2/33 components

Use 'npx rafters add <component>' to install components.
```

**With Details**:
```bash
npx rafters list --details

Installed Components:

Button (v1.0.0)
  Path: src/components/ui/button.tsx
  Story: src/stories/button-intelligence.stories.tsx
  Intelligence: Cognitive load=3, Attention economics, Trust building
  
Input (v1.0.0)  
  Path: src/components/ui/input.tsx
  Story: src/stories/input-intelligence.stories.tsx
  Intelligence: Validation patterns, Motor accessibility, Trust building

Available Components: 31 remaining
```

---

## Implementation Architecture

### CLI Structure
```
rafters-cli/
├── src/
│   ├── commands/
│   │   ├── init.ts
│   │   ├── add.ts
│   │   ├── list.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── config.ts
│   │   ├── registry.ts
│   │   ├── dependencies.ts
│   │   └── files.ts
│   ├── templates/
│   │   ├── agent-instructions.md
│   │   └── config.json
│   └── index.ts
├── package.json
└── README.md
```

### Tech Stack
- **Framework**: Node.js with TypeScript
- **CLI Framework**: Commander.js or Yargs
- **HTTP Client**: Fetch API (Node 18+)
- **File Operations**: fs-extra
- **Package Detection**: Read package.json
- **Validation**: Zod for config schemas

### Registry API
```typescript
interface ComponentRegistry {
  components: ComponentManifest[]
}

interface ComponentManifest {
  name: string
  version: string
  description: string
  intelligence: IntelligenceMetadata
  files: ComponentFiles
  dependencies: string[]
}

interface ComponentFiles {
  component: string      // TSX source
  story?: string        // Storybook story
  types?: string        // Additional types
}

interface IntelligenceMetadata {
  cognitiveLoad: number
  attentionEconomics: string
  accessibility: string
  trustBuilding: string
  semanticMeaning: string
}
```

---

## Development Phases

### Phase 1: Core CLI
- `init` command with basic setup
- `add` command for component installation
- File system operations and config management

### Phase 2: Registry Integration
- Component registry with intelligence metadata
- Dependency management and installation
- Error handling and validation

### Phase 3: Enhanced Features
- `list` command with details
- Update mechanisms
- Better error messages and help

### Phase 4: Intelligence Features
- Validate intelligence patterns
- Component customization detection
- Enhanced AI instructions

---

## Error Handling

### Common Scenarios
```bash
# Not in a Node.js project
npx rafters init
✗ Error: No package.json found. Run this in a Node.js project.

# Missing React
npx rafters init  
✗ Error: React not found in dependencies. Rafters requires React 18+.

# Component doesn't exist
npx rafters add nonexistent
✗ Error: Component 'nonexistent' not found in registry.

# Network issues
npx rafters add button
✗ Error: Failed to fetch component. Check internet connection.

# File conflicts
npx rafters add button
✗ Error: Component already exists. Use --force to overwrite.
```

### Recovery Guidance
Each error includes actionable next steps and links to documentation.

This CLI design provides a clean, predictable interface for distributing components with embedded design intelligence while respecting project ownership and customization needs.