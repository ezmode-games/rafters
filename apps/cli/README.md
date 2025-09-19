# Rafters CLI

The AI-first design intelligence CLI for modern React applications.

## Overview

Rafters CLI bridges traditional component libraries with AI-driven design reasoning. Install components with embedded cognitive load intelligence, generate semantic design tokens, and integrate directly with AI agents for intelligent design decisions.

## Installation

**No installation required!** Always use the latest version with `npx`:

```bash
npx rafters init
```

## Quick Start

```bash
# Initialize Rafters in your React project
npx rafters init

# Add components with intelligence metadata
npx rafters add button card dialog

# List installed components and status
npx rafters list

# Start AI agent integration server
npx rafters mcp
```

## Commands

### `npx rafters init`

Initialize Rafters in your project with smart framework detection.

```bash
npx rafters init [options]
```

**Options:**
- `--yes, -y` - Skip prompts and use defaults
- `--config <file>` - Use custom configuration file

**What it does:**
- Detects your framework (Next.js, Vite, Remix, CRA)
- Configures Tailwind CSS v4 integration
- Creates `.rafters/` directory with manifests
- Generates default design tokens
- Installs core dependencies

### `npx rafters add`

Add components from the Rafters registry with intelligence metadata.

```bash
npx rafters add <components...> [options]
```

**Options:**
- `--force, -f` - Overwrite existing components

**Examples:**
```bash
npx rafters add button
npx rafters add card dialog sheet --force
```

**What it does:**
- Fetches components from registry
- Installs with dependency management
- Transforms imports for your project structure
- Tracks components with cognitive load ratings

### `npx rafters list`

Show installed components and registry status.

```bash
npx rafters list [options]
```

**Options:**
- `--details, -d` - Show detailed component information

**Output includes:**
- Installation status (installed/available)
- Component intelligence metadata
- Cognitive load ratings
- Version information

### `npx rafters clean`

Clean Rafters configuration and installed components.

```bash
npx rafters clean [options]
```

**Options:**
- `--force, -f` - Skip confirmation prompts

### `npx rafters mcp`

Start Model Context Protocol server for AI agent integration.

```bash
npx rafters mcp
```

**AI Tools Available:**
- Component intelligence queries
- Token registry access
- Cognitive load validation
- Color combination analysis
- Design decision reasoning

## Configuration

Rafters creates a `.rafters/config.json` file:

```json
{
  "version": "0.1.1",
  "componentsDir": "./src/components/ui",
  "packageManager": "pnpm",
  "registry": "https://rafters.realhandy.tech/registry",
  "cssFile": "globals.css",
  "tailwindVersion": "v4",
  "tokenFormat": "tailwind"
}
```

## Component Intelligence

Every Rafters component includes embedded intelligence metadata:

- **Cognitive Load**: Measured complexity for user attention
- **Trust Levels**: Accessibility and reliability scores
- **Usage Patterns**: When and how to use components
- **Design Reasoning**: Why specific choices were made

## AI Agent Integration

The MCP server enables AI agents to:

- Query component intelligence in real-time
- Access design token registry
- Validate design decisions
- Reason about cognitive load and accessibility
- Generate context-aware component suggestions

## Framework Support

Rafters supports React 18+ projects with:

- **Next.js** (App Router, Pages Router)
- **Vite** + React
- **Remix**
- **Create React App**
- **React Router**

## Requirements

- **Node.js**: >= 22.0.0
- **Package Manager**: npm, yarn, or pnpm
- **React**: >= 19.0.0
- **TypeScript**: Recommended

## Development

```bash
# Clone the monorepo
git clone https://github.com/real-handy/rafters

# Install dependencies
pnpm install

# Build CLI
pnpm --filter=@rafters/cli build

# Run locally
node apps/cli/dist/bin.js --help

# Test with npx locally
npx . init --help
```

## License

MIT License - see LICENSE file for details.