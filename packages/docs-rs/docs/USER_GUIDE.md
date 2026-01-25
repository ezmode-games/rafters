# User Guide

Complete guide to using rafters-docs for component documentation.

## Table of Contents

- [Installation](#installation)
- [Project Setup](#project-setup)
- [Writing Documentation](#writing-documentation)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Building for Production](#building-for-production)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## Installation

### From Source

```bash
cd packages/docs-rs
cargo build --release

# Add to PATH or copy binary
cp target/release/rafters-docs ~/.local/bin/
```

### Verify Installation

```bash
rafters-docs --version
rafters-docs --help
```

## Project Setup

### Initialize Documentation

Run in your project root:

```bash
rafters-docs init
```

This creates:

```
your-project/
├── docs.toml           # Configuration
└── docs/
    └── index.mdx       # Welcome page
```

### Project Structure

Recommended documentation structure:

```
docs/
├── index.mdx                 # Home page
├── getting-started.mdx       # Quick start guide
├── components/
│   ├── index.mdx             # Components overview
│   ├── button.mdx            # Button documentation
│   ├── input.mdx             # Input documentation
│   └── dialog.mdx            # Dialog documentation
├── guides/
│   ├── theming.mdx           # Theming guide
│   └── accessibility.mdx     # A11y guide
└── api/
    └── hooks.mdx             # API reference
```

## Writing Documentation

### MDX Format

MDX combines Markdown with JSX code blocks:

```mdx
---
title: Button Component
description: A versatile button with multiple variants
order: 1
---

# Button

The Button component is used for actions and navigation.

## Import

```tsx static
import { Button } from '@your-lib/ui';
```

## Basic Usage

```tsx preview
<Button>Click me</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | "default" | Visual style |
| size | string | "default" | Button size |
| disabled | boolean | false | Disable interaction |
```

### Frontmatter

YAML metadata at the start of each file:

```yaml
---
title: Page Title           # Required: displayed in nav and <title>
description: SEO desc       # Optional: meta description
order: 1                    # Optional: navigation order (lower = first)
nav: true                   # Optional: show in navigation (default: true)
---
```

### Code Blocks

#### Static Code (Default)

Syntax-highlighted code display:

````mdx
```tsx
import { Button } from '@your-lib/ui';

export function App() {
  return <Button variant="primary">Save</Button>;
}
```
````

#### Preview Mode

Live component preview with code:

````mdx
```tsx preview
<Button variant="primary" size="lg">
  Large Primary Button
</Button>
```
````

This renders:
1. The component as a Web Component preview
2. The source code below (syntax highlighted)

#### Static Mode (Explicit)

Force static display:

````mdx
```tsx static
// This won't render a preview
<Button>Example</Button>
```
````

#### Filename Display

Show a filename header:

````mdx
```tsx filename="App.tsx"
export function App() {
  return <Button>Hello</Button>;
}
```
````

### Markdown Features

All standard Markdown is supported:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold** and *italic* text

- Unordered list
- Another item

1. Ordered list
2. Second item

> Blockquote

[Link text](https://example.com)

![Alt text](./image.png)

| Table | Header |
|-------|--------|
| Cell  | Cell   |

`inline code`

---
Horizontal rule
```

## Configuration

### docs.toml

```toml
[docs]
# Source directory for MDX files
input = "docs"

# Output directory for built site
output = "dist/docs"

# Site title (appears in header and <title>)
title = "My Component Library"

# Base URL for all links (use "/" for root)
base_url = "/"

# Directories containing component source files
# Used for transforming preview blocks
component_dirs = ["src/components"]

[server]
# Development server port
port = 3456

# Automatically open browser on dev start
open = true
```

### Command Line Options

```bash
# Use custom config file
rafters-docs --config ./custom.toml dev

# Enable verbose logging
rafters-docs --verbose build

# Skip browser auto-open
rafters-docs dev --no-open

# Custom port
rafters-docs dev --port 4000
```

## Development Workflow

### Start Development Server

```bash
rafters-docs dev
```

This:
1. Starts server at `http://localhost:3456`
2. Opens browser (unless `--no-open`)
3. Watches for file changes
4. Hot reloads on save

### File Watching

The dev server watches:
- `docs/**/*.mdx` - Documentation files
- `src/components/**/*` - Component source files

Changes trigger:
1. File re-parse
2. Web Component regeneration (if preview)
3. Browser reload via WebSocket

### Preview Your Changes

1. Edit an MDX file
2. Save the file
3. Browser automatically reloads
4. See changes immediately

## Building for Production

### Build Static Site

```bash
rafters-docs build
```

Output structure:

```
dist/docs/
├── index.html
├── getting-started.html
├── components/
│   ├── index.html
│   ├── button.html
│   └── ...
├── assets/
│   ├── main.css         # Minified styles
│   └── main.js          # HMR client (excluded in prod)
└── search-index.json    # Search data
```

### Preview Built Site

```bash
rafters-docs serve
```

Serves the built site locally for verification.

### Deployment

The built site is static HTML/CSS/JS. Deploy to any static host:

**Vercel:**
```bash
vercel deploy dist/docs
```

**Netlify:**
```bash
netlify deploy --dir=dist/docs
```

**GitHub Pages:**
```yaml
# .github/workflows/docs.yml
- run: rafters-docs build
- uses: peaceiris/actions-gh-pages@v3
  with:
    publish_dir: ./dist/docs
```

**Cloudflare Pages:**
```bash
wrangler pages deploy dist/docs
```

## Customization

### Custom Styles

Add custom CSS by creating `docs/assets/custom.css`:

```css
/* Override default styles */
:root {
  --color-primary: #3b82f6;
  --color-bg: #0f172a;
}

/* Custom component styles */
.doc pre {
  border-radius: 0.5rem;
}
```

### Component Theming

Preview components use your Tailwind configuration. Ensure your `tailwind.config.js` is applied during build.

### Navigation Order

Control navigation order with frontmatter:

```yaml
---
title: Getting Started
order: 0  # Appears first
---
```

```yaml
---
title: API Reference
order: 99  # Appears last
---
```

Items without `order` sort alphabetically after ordered items.

### Hide from Navigation

```yaml
---
title: Internal Notes
nav: false
---
```

## Troubleshooting

### Preview Not Rendering

**Symptom:** Code block shows but no preview appears.

**Solutions:**
1. Ensure code block uses `preview` mode: ` ```tsx preview `
2. Check component exists in `component_dirs`
3. Verify component exports variant/size classes

### Styles Missing in Preview

**Symptom:** Preview renders but Tailwind classes don't work.

**Solutions:**
1. Ensure Tailwind CSS is included in your build
2. Check that styles use `data-tailwind` attribute
3. Verify `adoptedStyleSheets` browser support

### Hot Reload Not Working

**Symptom:** Changes don't appear without manual refresh.

**Solutions:**
1. Check WebSocket connection in browser console
2. Verify file is in watched directory
3. Restart dev server

### Build Fails

**Symptom:** `rafters-docs build` exits with error.

**Solutions:**
1. Check MDX syntax (valid YAML frontmatter)
2. Verify all referenced files exist
3. Run with `--verbose` for detailed errors

### Port Already in Use

**Symptom:** "Address already in use" error.

**Solutions:**
```bash
# Use different port
rafters-docs dev --port 4000

# Or kill existing process
lsof -i :3456 | grep LISTEN | awk '{print $2}' | xargs kill
```

### Large Site Slow to Build

**Solutions:**
1. Reduce image sizes
2. Split large MDX files
3. Use `static` mode for non-essential code blocks
4. Check for circular dependencies

## Tips and Best Practices

### Documentation Structure

1. **Start simple** - One file per component
2. **Group related docs** - Use subdirectories
3. **Consistent frontmatter** - Always include title and description
4. **Order matters** - Use `order` for logical flow

### Preview Best Practices

1. **Keep previews simple** - Show one concept per preview
2. **Use realistic content** - Real text, not "Lorem ipsum"
3. **Show variants together** - Compare options side-by-side
4. **Include edge cases** - Long text, empty states, errors

### Performance

1. **Optimize images** - Compress and resize
2. **Limit previews per page** - Each adds JS bundle size
3. **Use static mode** - When preview isn't needed
4. **Split large pages** - Better for navigation and loading

### Accessibility

1. **Use semantic headings** - Proper h1, h2, h3 hierarchy
2. **Add alt text** - All images need descriptions
3. **Test keyboard nav** - Ensure previews are focusable
4. **Check color contrast** - Especially in code blocks
