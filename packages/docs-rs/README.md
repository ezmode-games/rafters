# rafters-docs

Rust-powered component documentation generator with live Web Component previews.

## Overview

`rafters-docs` transforms your component library documentation from MDX files into a static site with interactive previews. Unlike traditional documentation tools that require a JavaScript runtime for component previews, rafters-docs transforms React/Solid JSX into static Web Components that work without any framework.

**Key Features:**

- **Zero-runtime previews** - Components render as Web Components with Shadow DOM
- **Hot reload** - Instant updates during development via WebSocket HMR
- **Fast builds** - Parallel processing with Rayon for large documentation sites
- **Framework agnostic** - Transform React or Solid components to static previews
- **Tailwind-ready** - `adoptedStyleSheets` API brings styles into Shadow DOM

## Quick Start

### Installation

```bash
# Build from source
cd packages/docs-rs
cargo build --release

# Binary is at target/release/rafters-docs
```

### Initialize Documentation

```bash
# In your project root
rafters-docs init

# This creates:
# - docs.toml          Configuration file
# - docs/              Documentation directory
# - docs/index.mdx     Welcome page
```

### Development Server

```bash
rafters-docs dev

# Opens http://localhost:3456 with hot reload
```

### Build Static Site

```bash
rafters-docs build

# Output: dist/docs/
```

### Preview Built Site

```bash
rafters-docs serve

# Serves dist/docs/ on http://localhost:3456
```

## Writing Documentation

### MDX Format

```mdx
---
title: Button
description: A versatile button component
order: 1
---

# Button

The Button component supports multiple variants and sizes.

## Basic Usage

```tsx preview
<Button variant="primary">Click me</Button>
```

## Variants

```tsx preview
<div className="flex gap-2">
  <Button variant="default">Default</Button>
  <Button variant="primary">Primary</Button>
  <Button variant="destructive">Destructive</Button>
</div>
```
```

### Code Block Modes

- **`static`** (default) - Syntax highlighted code only
- **`preview`** - Live Web Component preview + code
- **`live`** - Interactive preview (future)

### Frontmatter Options

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title |
| `description` | string | SEO description |
| `order` | number | Navigation order |
| `nav` | boolean | Show in navigation (default: true) |

## Configuration

### docs.toml

```toml
[docs]
# Documentation source directory
input = "docs"

# Build output directory
output = "dist/docs"

# Site title
title = "My Component Library"

# Base URL for links
base_url = "/"

# Component source directories for preview transforms
component_dirs = ["src/components"]

[server]
# Development server port
port = 3456

# Auto-open browser
open = true
```

## Architecture

```
rafters-docs/
├── rafters-mdx        MDX parsing and code block extraction
├── rafters-adapters   JSX to Web Component transformation
├── rafters-static     Static site generation
├── rafters-server     Development server with HMR
└── rafters-docs       CLI orchestration
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed technical documentation.

## Requirements

- Rust 1.75+ (uses edition 2021)
- Components using Tailwind CSS (for style adoption)
- React or Solid component syntax

## License

MIT
