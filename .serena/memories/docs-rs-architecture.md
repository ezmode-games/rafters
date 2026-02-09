# packages/docs-rs - Rust Documentation Generator

## Overview
`rafters-docs` is a Rust-powered component documentation generator that transforms MDX files into a static site with interactive Web Component previews. The key insight: documentation previews don't need React/Solid runtimes - they just need to look right. JSX is transformed into static Web Components with Shadow DOM.

## Workspace Structure (Cargo workspace, edition 2021)
```
packages/docs-rs/
├── Cargo.toml                 # Workspace manifest
├── rust-toolchain.toml        # stable channel
├── .cargo/config.toml         # parallel builds, clippy alias
├── crates/
│   ├── rafters-mdx/           # MDX parsing (pulldown-cmark, serde_yaml)
│   ├── rafters-adapters/      # JSX -> Web Component transformation (oxc_parser, regex)
│   ├── rafters-static/        # Static site generation (minijinja, lightningcss, rayon)
│   ├── rafters-server/        # Dev server + HMR (axum, notify, tokio)
│   └── rafters-docs/          # CLI binary (clap)
├── docs/                      # Project documentation
│   ├── ARCHITECTURE.md
│   ├── DEVELOPER.md
│   └── USER_GUIDE.md
└── dist/                      # Built output
```

## Dependency Graph
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
- **Purpose**: Parse MDX files, extract YAML frontmatter, code blocks, headings/TOC
- **Key types**: `ParsedDoc`, `Frontmatter`, `CodeBlock`, `BlockMode` (Live/Editable/Source/Preview), `Language`, `TocEntry`
- **Pipeline**: frontmatter extraction -> markdown parsing (pulldown-cmark) -> code block extraction -> heading extraction
- **Code block modes**: `live` (Web Component preview), `editable` (future), `preview` (iframe), `source` (default, syntax highlight only)
- **`is_live()`**: true when mode=Live AND language is transformable (TSX/JSX)
- **Files**: lib.rs, frontmatter.rs, parser.rs, codeblock.rs

### rafters-adapters
- **Purpose**: Transform JSX source code into Web Component definitions
- **Key types**: `FrameworkAdapter` trait, `ReactAdapter`, `ComponentStructure`, `TransformedBlock`, `ComponentRegistry`, `InlineJsx`
- **React adapter extraction**: Uses regex patterns (LazyLock) to extract variantClasses, sizeClasses, baseClasses, disabledClasses, component name, observed attributes
- **variantClasses is REQUIRED** - transform fails with `MissingVariants` if absent
- **ComponentRegistry**: Scans directories for .tsx/.jsx files, skips test/stories/index files, caches parsed structures
- **InlineJsx parser**: Parses `<Button variant="primary">Click</Button>` from doc code blocks, handles self-closing, children, nested same-name components, props (string/boolean/expression)
- **`to_custom_element()`**: Converts InlineJsx to `<tag-name variant="primary">Click</tag-name>` with HTML escaping
- **Generator**: Produces ES6 class extending HTMLElement with Shadow DOM, adoptedStyleSheets for Tailwind CSS, slot-based content, observed attributes
- **Files**: lib.rs, traits.rs, react.rs, inline.rs, generator.rs, registry.rs

### rafters-static
- **Purpose**: Build complete static documentation site
- **Key types**: `StaticBuilder`, `BuildConfig`, `BuildResult`, `TemplateEngine`, `AssetPipeline`
- **Build pipeline**: discover MDX files -> parse -> sort by frontmatter order -> build navigation -> parallel render pages (Rayon) -> generate assets -> generate search index JSON -> generate sitemap.xml + robots.txt
- **Page rendering**: For each live code block, tries inline JSX parsing first (looks up component in registry), falls back to full component transform. Replaces live blocks with `<div class="preview-container">` + Web Component HTML + source code below
- **Template engine**: minijinja with base.html (layout), doc.html (content + TOC), nav.html (sidebar)
- **Asset pipeline**: Default CSS using Rafters design tokens (CSS variables), responsive layout, lightningcss minification. JS for mobile menu, active nav, copy code buttons
- **Rafters CSS integration**: Optional `rafters_css` config to include design token stylesheet
- **Files**: lib.rs, builder.rs, templates.rs, assets.rs

### rafters-server
- **Purpose**: Development server with hot module replacement
- **Key types**: `DevServer`, `DevServerConfig`, `FileWatcher`, `WatchEvent`, `HmrHub`, `HmrMessage`
- **Default port**: 7777
- **Routes**: `GET /` (index), `GET /__hmr` (WebSocket), `GET /__hmr.js` (client script), `/docs/*` (static files)
- **HMR flow**: File system (notify/inotify) -> FileWatcher thread (100ms debounce) -> classify event (MDX/Component/Other) -> WatchEvent -> broadcast via HmrHub (tokio broadcast channel) -> WebSocket -> browser
- **HMR messages**: Connected, Reload, UpdateComponent (tag_name + web_component JS), UpdateContent (path + html)
- **Component hot update**: Re-transforms changed component, sends new Web Component JS to browser, forces re-render of existing instances via connectedCallback()
- **Files**: lib.rs, server.rs, watcher.rs, websocket.rs

### rafters-docs (CLI)
- **Purpose**: CLI orchestration with clap
- **Commands**: `init` (scaffolds docs.toml + docs/), `dev` (starts dev server), `build` (static site gen), `serve` (preview built site on port 4000)
- **Config**: `docs.toml` with [docs] (dir, output, title, base_url, rafters_css), [components] (dir), [build] (minify)
- **Flags**: `--config` (path to docs.toml), `--verbose`, per-command flags
- **Files**: main.rs, commands/{mod,init,dev,build,serve}.rs

## Key Design Decisions
1. **Zero-runtime previews**: Web Components are native, no React/Solid runtime in docs
2. **Shadow DOM + adoptedStyleSheets**: Copies page-level Tailwind CSS into shadow roots
3. **Regex-based extraction (not AST)**: ReactAdapter uses regex to find variantClasses/sizeClasses patterns - simpler, works for convention-based components
4. **Inline JSX parsing**: Separate parser for doc code blocks (`<Button variant="primary">`) vs full component source parsing
5. **Parallel builds**: Rayon for page rendering across cores
6. **Component registry**: Scans source dirs, caches structures, deduplicates Web Component generation per component type
7. **Two-tier transform**: Registry lookup (preferred, for inline JSX in docs) -> fallback full source transform

## Error Handling
- Library crates use `thiserror` (typed errors)
- CLI uses `anyhow` (context-based errors)
- Error types: `FrontmatterError`, `ParseError`, `TransformError`, `RegistryError`, `BuildError`, `ServerError`

## Testing
- In-file `#[cfg(test)]` modules
- Uses `tempfile` for filesystem tests, `pretty_assertions` for diffs
- Async tests with `#[tokio::test]`
- `cargo test -p rafters-mdx` etc. for per-crate testing

## Key Dependencies
- **oxc_parser/oxc_ast** v0.72: Fast JavaScript/TypeScript parser (used in adapters but mostly regex-based extraction)
- **pulldown-cmark** v0.12: CommonMark markdown parser
- **minijinja** v2: Template engine
- **lightningcss** v1.0.0-alpha.70: CSS minification
- **axum** v0.8 + tower-http v0.6: Web server
- **notify** v8: File system watching
- **rayon** v1: Parallel processing
- **clap** v4: CLI parsing
