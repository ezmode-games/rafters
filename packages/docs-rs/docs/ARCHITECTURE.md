# Architecture

This document describes the technical architecture of rafters-docs.

## Design Philosophy

rafters-docs is built on a key insight: **documentation previews don't need to react, they just need to look and feel right**. Component previews in documentation don't need hooks, state management, or reactive updates. They need:

1. Correct visual rendering
2. CSS hover/focus/active states
3. Proper accessibility attributes

By transforming JSX into static Web Components, we eliminate the need for React/Solid runtimes in the documentation site while preserving visual fidelity.

## Crate Overview

```
packages/docs-rs/
├── Cargo.toml                 Workspace manifest
├── crates/
│   ├── rafters-mdx/           MDX parsing
│   ├── rafters-adapters/      JSX transformation
│   ├── rafters-static/        Static site generation
│   ├── rafters-server/        Development server
│   └── rafters-docs/          CLI binary
```

### Dependency Graph

```
rafters-docs (CLI)
    ├── rafters-server
    │   ├── rafters-mdx
    │   └── rafters-adapters
    └── rafters-static
        ├── rafters-mdx
        └── rafters-adapters
```

## Crate Details

### rafters-mdx

**Purpose:** Parse MDX files and extract structured content.

**Key Types:**

```rust
pub struct ParsedDoc {
    pub frontmatter: Option<Frontmatter>,
    pub content_html: String,
    pub code_blocks: Vec<CodeBlock>,
    pub headings: Vec<Heading>,
}

pub struct Frontmatter {
    pub title: String,
    pub description: Option<String>,
    pub order: Option<i32>,
    pub nav: bool,
}

pub struct CodeBlock {
    pub language: String,
    pub code: String,
    pub mode: BlockMode,
    pub filename: Option<String>,
}

pub enum BlockMode {
    Static,   // Code display only
    Preview,  // Web Component preview
    Live,     // Future: interactive
}
```

**Processing Pipeline:**

1. **Frontmatter extraction** - Parse YAML between `---` delimiters
2. **Markdown parsing** - Convert to HTML via pulldown-cmark
3. **Code block extraction** - Capture language, mode, and content
4. **Heading extraction** - Build table of contents with slugified IDs

**Implementation Notes:**

- Uses `pulldown-cmark` for CommonMark parsing
- YAML parsing via `serde_yaml`
- Code block modes specified as `tsx preview` or `tsx static`

### rafters-adapters

**Purpose:** Transform JSX source code into Web Component definitions.

**Key Types:**

```rust
pub trait FrameworkAdapter {
    fn parse(&self, source: &str, tag_name: &str) -> Result<ComponentInfo, AdapterError>;
}

pub struct ComponentInfo {
    pub tag_name: String,
    pub base_classes: String,
    pub variant_classes: HashMap<String, HashMap<String, String>>,
    pub observed_attributes: Vec<String>,
}

pub struct TransformContext {
    pub tag_name: String,
    pub source_code: String,
}

pub struct TransformedBlock {
    pub web_component: String,
    pub preview_html: String,
}
```

**React Adapter Pipeline:**

1. **Parse JSX** - Use oxc-parser to build AST
2. **Extract variants** - Find `variantClasses` Record objects
3. **Extract sizes** - Find `sizeClasses` Record objects
4. **Find base classes** - Extract class constants or classy() calls
5. **Generate Web Component** - Emit ES6 class extending HTMLElement

**Generated Web Component Structure:**

The generator creates Web Components that:
- Extend `HTMLElement` with Shadow DOM
- Observe variant/size/disabled attributes
- Adopt global Tailwind styles via `adoptedStyleSheets`
- Render with slot-based content projection

Key methods:
- `connectedCallback()` - Called when element is added to DOM
- `adoptStyles()` - Copies Tailwind CSS into Shadow DOM
- `render()` - Updates shadow root content based on attributes
- `getClasses()` - Computes CSS classes from variant/size

### rafters-static

**Purpose:** Generate static HTML documentation site.

**Key Types:**

```rust
pub struct SiteBuilder {
    config: BuildConfig,
    template_engine: TemplateEngine,
    asset_pipeline: AssetPipeline,
}

pub struct BuildConfig {
    pub input_dir: PathBuf,
    pub output_dir: PathBuf,
    pub title: String,
    pub base_url: String,
    pub component_dirs: Vec<PathBuf>,
}

pub struct Page {
    pub relative_path: PathBuf,
    pub output_path: PathBuf,
    pub content: String,
    pub frontmatter: Option<Frontmatter>,
    pub web_components: Vec<String>,
}
```

**Build Pipeline:**

1. **Discovery** - Walk input directory for `.mdx` files
2. **Parse** - Process each file through rafters-mdx
3. **Transform** - Convert preview blocks via rafters-adapters
4. **Template** - Render pages through minijinja templates
5. **Assets** - Generate and minify CSS/JS bundles
6. **Search** - Build search index JSON
7. **Write** - Output to destination directory

**Parallel Processing:**

```rust
pages.par_iter()
    .map(|page| self.render_page(page))
    .collect::<Result<Vec<_>, _>>()?;
```

Uses Rayon for parallel page rendering on multi-core systems.

**Template System:**

- Base layout with navigation sidebar
- Doc template with table of contents
- Web Component script injection
- Minijinja for template rendering

### rafters-server

**Purpose:** Development server with hot module replacement.

**Key Types:**

```rust
pub struct DevServer {
    config: ServerConfig,
    watcher: FileWatcher,
    hub: WsHub,
}

pub struct ServerConfig {
    pub port: u16,
    pub input_dir: PathBuf,
    pub component_dirs: Vec<PathBuf>,
    pub open_browser: bool,
}

pub enum WsMessage {
    Reload,
    Update { path: String, content: String },
    Error { message: String },
}
```

**HMR Architecture:**

```
┌─────────────┐     inotify      ┌─────────────┐
│  File       │ ───────────────> │   Watcher   │
│  System     │                  │   Thread    │
└─────────────┘                  └──────┬──────┘
                                        │
                                        v
┌─────────────┐   WebSocket      ┌─────────────┐
│  Browser    │ <────────────────│   WS Hub    │
│  Client     │                  │             │
└─────────────┘                  └─────────────┘
```

**Debouncing:**

File events are debounced at 100ms to prevent rapid rebuilds during saves:

```rust
if now.duration_since(last_event_time) < Duration::from_millis(100) {
    continue;
}
```

**Routes:**

| Path | Handler |
|------|---------|
| `GET /` | Redirect to first doc page |
| `GET /*.html` | Render MDX as HTML |
| `GET /assets/*` | Serve static assets |
| `WS /ws` | HMR WebSocket connection |

### rafters-docs

**Purpose:** CLI orchestration layer.

**Commands:**

| Command | Description |
|---------|-------------|
| `init` | Create docs.toml and docs/ directory |
| `dev` | Start development server |
| `build` | Generate static site |
| `serve` | Preview built site |

**Configuration Loading:**

```rust
#[derive(Deserialize)]
pub struct Config {
    pub docs: DocsConfig,
    pub server: ServerConfig,
}
```

Loaded from `docs.toml` in project root or specified via `--config`.

## Data Flow

### Build Flow

```
MDX File
    │
    v
┌─────────────────┐
│  rafters-mdx    │  Parse frontmatter, extract code blocks
└────────┬────────┘
         │
         v
┌─────────────────┐
│rafters-adapters │  Transform preview blocks to Web Components
└────────┬────────┘
         │
         v
┌─────────────────┐
│ rafters-static  │  Render templates, generate assets
└────────┬────────┘
         │
         v
    HTML + JS + CSS
```

### Dev Server Flow

```
File Change
    │
    v
┌─────────────────┐
│  FileWatcher    │  Detect .mdx or component changes
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Re-render      │  Process changed file
└────────┬────────┘
         │
         v
┌─────────────────┐
│  WS Broadcast   │  Send reload message to clients
└────────┬────────┘
         │
         v
    Browser Reload
```

## Shadow DOM Style Adoption

The key challenge with Web Components is getting Tailwind CSS styles into Shadow DOM. We solve this with the `adoptedStyleSheets` API:

1. Find the global Tailwind stylesheet in the document
2. Create a new `CSSStyleSheet` for the shadow root
3. Copy all CSS rules from the global sheet
4. Adopt the sheet into the shadow DOM

This approach:
- Reuses the existing Tailwind CSS (no duplication)
- Works with CSS custom properties (design tokens)
- Supports all Tailwind utilities including hover/focus states

## Security Considerations

The generated Web Components use controlled rendering:
- Attribute values are validated before use
- Class names are looked up from predefined maps
- User content goes through `<slot>` elements (native browser handling)
- No arbitrary HTML injection from attributes

## Performance Considerations

### Build Performance

- **Parallel rendering** - Rayon parallelizes page rendering
- **Incremental builds** - Future: only rebuild changed files
- **CSS minification** - lightningcss for fast, small output

### Runtime Performance

- **No framework runtime** - Web Components are native
- **Lazy style adoption** - Styles adopted on `connectedCallback`
- **Minimal JS** - Only Web Component definitions + HMR client

## Future Enhancements

1. **Incremental builds** - Track file hashes, skip unchanged
2. **Live mode** - Interactive previews with state
3. **Multi-framework** - Vue, Svelte adapter support
4. **Prop tables** - Auto-generate from TypeScript types
5. **Versioning** - Multi-version documentation sites
