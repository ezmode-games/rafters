//! Initialize documentation in a project.

use std::fs;
use std::path::Path;

use anyhow::{Context, Result};

/// Run the init command.
pub async fn run(yes: bool) -> Result<()> {
    tracing::info!("Initializing rafters docs...");

    let docs_dir = Path::new("docs");

    // Check if docs already exists
    if docs_dir.exists() {
        if !yes {
            tracing::warn!("docs/ directory already exists. Use --yes to overwrite.");
            return Ok(());
        }
    } else {
        fs::create_dir_all(docs_dir).context("Failed to create docs directory")?;
    }

    // Create default config
    let config_path = Path::new("docs.toml");
    if !config_path.exists() || yes {
        fs::write(config_path, DEFAULT_CONFIG).context("Failed to write docs.toml")?;
        tracing::info!("Created docs.toml");
    }

    // Create index page
    let index_path = docs_dir.join("index.mdx");
    if !index_path.exists() || yes {
        fs::write(&index_path, DEFAULT_INDEX).context("Failed to write index.mdx")?;
        tracing::info!("Created docs/index.mdx");
    }

    // Create getting-started page
    let getting_started_path = docs_dir.join("getting-started.mdx");
    if !getting_started_path.exists() || yes {
        fs::write(&getting_started_path, DEFAULT_GETTING_STARTED)
            .context("Failed to write getting-started.mdx")?;
        tracing::info!("Created docs/getting-started.mdx");
    }

    // Create components directory
    let components_dir = docs_dir.join("components");
    if !components_dir.exists() {
        fs::create_dir_all(&components_dir).context("Failed to create components directory")?;
    }

    // Create example component page
    let button_path = components_dir.join("button.mdx");
    if !button_path.exists() || yes {
        fs::write(&button_path, DEFAULT_BUTTON_DOC).context("Failed to write button.mdx")?;
        tracing::info!("Created docs/components/button.mdx");
    }

    tracing::info!("Initialization complete!");
    tracing::info!("Run 'rafters-docs dev' to start the development server.");

    Ok(())
}

const DEFAULT_CONFIG: &str = r#"# Rafters Docs Configuration

[docs]
# Source directory for documentation
dir = "docs"

# Output directory for built site
output = "dist"

# Site title
title = "My Documentation"

# Base URL (for deployment)
base_url = "/"

[components]
# Directory containing your components
dir = "src/components"

[build]
# Enable minification
minify = true
"#;

const DEFAULT_INDEX: &str = r#"---
title: Welcome
order: 1
---

# Welcome to Your Documentation

This is your documentation site, powered by **rafters docs**.

## Getting Started

Check out the [Getting Started](/getting-started/) guide to learn how to use this tool.

## Components

Browse the [Components](/components/) section to see live examples.
"#;

const DEFAULT_GETTING_STARTED: &str = r#"---
title: Getting Started
order: 2
---

# Getting Started

This guide will help you set up rafters docs for your project.

## Installation

```bash
cargo install rafters-docs
```

## Project Structure

```
your-project/
├── docs/                  # Documentation source
│   ├── index.mdx         # Home page
│   └── components/       # Component docs
├── src/
│   └── components/       # Your components
└── docs.toml             # Configuration
```

## Writing Documentation

Create `.mdx` files in the `docs/` directory. Each file needs frontmatter:

```mdx
---
title: Page Title
order: 1
---

# Your Content Here
```

## Live Code Blocks

Add `live` to code blocks to render them as interactive previews:

```tsx live
<Button variant="primary">Click me</Button>
```

## Development

Start the dev server:

```bash
rafters-docs dev
```

## Building

Build for production:

```bash
rafters-docs build
```
"#;

const DEFAULT_BUTTON_DOC: &str = r#"---
title: Button
component: Button
order: 1
---

# Button

A clickable button component.

## Usage

```tsx
import { Button } from './components/button';

<Button variant="primary">Click me</Button>
```

## Variants

The Button component supports multiple variants:

```tsx live
<Button variant="primary">Primary</Button>
```

```tsx live
<Button variant="secondary">Secondary</Button>
```

## Sizes

```tsx live
<Button size="sm">Small</Button>
```

```tsx live
<Button size="lg">Large</Button>
```

## States

### Disabled

```tsx live
<Button disabled>Disabled</Button>
```

### Loading

```tsx live
<Button loading>Loading</Button>
```
"#;
