# Developer Guide

Guide for contributors to rafters-docs.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Building](#building)
- [Testing](#testing)
- [Adding Features](#adding-features)
- [Code Style](#code-style)
- [Debugging](#debugging)
- [Release Process](#release-process)

## Development Setup

### Prerequisites

- Rust 1.75 or later
- Cargo (comes with Rust)
- Git

### Clone and Build

```bash
cd packages/docs-rs
cargo build
```

### IDE Setup

**VS Code:**
- Install `rust-analyzer` extension
- Install `Even Better TOML` for Cargo.toml

**Recommended settings:**
```json
{
  "rust-analyzer.cargo.features": "all",
  "rust-analyzer.checkOnSave.command": "clippy"
}
```

## Project Structure

```
packages/docs-rs/
├── Cargo.toml              # Workspace manifest
├── Cargo.lock              # Dependency lock file
├── rust-toolchain.toml     # Rust version pinning
├── .cargo/
│   └── config.toml         # Cargo configuration
├── crates/
│   ├── rafters-mdx/        # MDX parsing
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs      # Public API
│   │       ├── parser.rs   # Main parser
│   │       ├── frontmatter.rs
│   │       └── codeblock.rs
│   ├── rafters-adapters/   # JSX transformation
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── react.rs    # React adapter
│   │       └── generator.rs
│   ├── rafters-static/     # Static site generator
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── builder.rs
│   │       ├── templates.rs
│   │       └── assets.rs
│   ├── rafters-server/     # Dev server
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── server.rs
│   │       ├── watcher.rs
│   │       └── websocket.rs
│   └── rafters-docs/       # CLI
│       ├── Cargo.toml
│       └── src/
│           ├── main.rs
│           ├── config.rs
│           └── commands/
│               ├── init.rs
│               ├── dev.rs
│               ├── build.rs
│               └── serve.rs
└── docs/
    ├── ARCHITECTURE.md
    ├── USER_GUIDE.md
    └── DEVELOPER.md
```

## Building

### Debug Build

```bash
cargo build
```

Binary at `target/debug/rafters-docs`

### Release Build

```bash
cargo build --release
```

Binary at `target/release/rafters-docs`

### Build Specific Crate

```bash
cargo build -p rafters-mdx
cargo build -p rafters-adapters
```

### Check Without Building

```bash
cargo check
```

## Testing

### Run All Tests

```bash
cargo test
```

### Run Tests for Specific Crate

```bash
cargo test -p rafters-mdx
cargo test -p rafters-adapters
cargo test -p rafters-server
cargo test -p rafters-static
```

### Run Specific Test

```bash
cargo test -p rafters-mdx parses_complete_mdx
```

### Run Tests with Output

```bash
cargo test -- --nocapture
```

### Test Coverage

```bash
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

### Writing Tests

Each crate has tests in the same file as the code:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_name() {
        // Arrange
        let input = "test input";

        // Act
        let result = function_under_test(input);

        // Assert
        assert_eq!(result, expected);
    }
}
```

For async tests:

```rust
#[tokio::test]
async fn async_test() {
    let result = async_function().await;
    assert!(result.is_ok());
}
```

## Adding Features

### Adding a New Adapter

1. Create new file in `rafters-adapters/src/`:

```rust
// solid.rs
use crate::{AdapterError, ComponentInfo, FrameworkAdapter};

pub struct SolidAdapter;

impl FrameworkAdapter for SolidAdapter {
    fn parse(&self, source: &str, tag_name: &str) -> Result<ComponentInfo, AdapterError> {
        // Implementation
    }
}
```

2. Export from `lib.rs`:

```rust
mod solid;
pub use solid::SolidAdapter;
```

3. Add tests:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_solid_component() {
        let adapter = SolidAdapter;
        let source = r#"..."#;
        let result = adapter.parse(source, "my-component");
        assert!(result.is_ok());
    }
}
```

### Adding a CLI Command

1. Create command module in `rafters-docs/src/commands/`:

```rust
// validate.rs
use anyhow::Result;
use crate::config::Config;

pub async fn run(config: &Config) -> Result<()> {
    println!("Validating documentation...");
    // Implementation
    Ok(())
}
```

2. Add to CLI in `main.rs`:

```rust
#[derive(Subcommand)]
enum Commands {
    // ... existing commands
    /// Validate documentation files
    Validate,
}

// In run():
Commands::Validate => commands::validate::run(&config).await,
```

3. Export from `commands/mod.rs`:

```rust
pub mod validate;
```

### Adding Template Helpers

In `rafters-static/src/templates.rs`:

```rust
impl TemplateEngine {
    pub fn new() -> Self {
        let mut env = Environment::new();

        // Add custom filter
        env.add_filter("uppercase", |s: String| s.to_uppercase());

        // Add custom function
        env.add_function("now", || {
            chrono::Utc::now().to_rfc3339()
        });

        // ... rest of setup
    }
}
```

## Code Style

### Formatting

```bash
cargo fmt
```

### Linting

```bash
cargo clippy
```

### Guidelines

1. **Error Handling**
   - Use `thiserror` for library errors
   - Use `anyhow` for application errors
   - Provide context with `.context("message")`

2. **Documentation**
   - Document all public items
   - Use `///` for doc comments
   - Include examples where helpful

3. **Naming**
   - Types: `PascalCase`
   - Functions/methods: `snake_case`
   - Constants: `SCREAMING_SNAKE_CASE`
   - Modules: `snake_case`

4. **Imports**
   - Group: std, external crates, internal crates, local modules
   - Use explicit imports over globs

5. **Testing**
   - Test public API surface
   - Use descriptive test names
   - One assertion per test when practical

## Debugging

### Enable Debug Logging

```bash
RUST_LOG=debug cargo run -- dev
```

Levels: `error`, `warn`, `info`, `debug`, `trace`

### Per-Crate Logging

```bash
RUST_LOG=rafters_server=debug,rafters_mdx=info cargo run -- dev
```

### Debug Build with Symbols

```bash
RUSTFLAGS="-C debuginfo=2" cargo build
```

### Using debugger

**VS Code:**
1. Install `CodeLLDB` extension
2. Add launch configuration:

```json
{
  "type": "lldb",
  "request": "launch",
  "name": "Debug rafters-docs",
  "program": "${workspaceFolder}/target/debug/rafters-docs",
  "args": ["dev"],
  "cwd": "${workspaceFolder}"
}
```

### Common Issues

**Linker Errors:**
```bash
# Remove any custom linker settings
rm .cargo/config.toml
cargo clean
cargo build
```

**Dependency Conflicts:**
```bash
cargo update
cargo clean
cargo build
```

**Test Flakiness:**
- Increase timeouts for async tests
- Use `tokio::time::sleep` instead of `std::thread::sleep`
- Check for race conditions in file watcher tests

## Release Process

### Version Bump

Update version in all `Cargo.toml` files:

```toml
[package]
version = "0.2.0"
```

### Changelog

Update `CHANGELOG.md`:

```markdown
## [0.2.0] - 2024-01-15

### Added
- New feature description

### Changed
- Changed behavior description

### Fixed
- Bug fix description
```

### Create Release

```bash
# Ensure tests pass
cargo test

# Build release
cargo build --release

# Tag release
git tag v0.2.0
git push origin v0.2.0
```

### Publish to crates.io (future)

```bash
cargo publish -p rafters-mdx
cargo publish -p rafters-adapters
cargo publish -p rafters-static
cargo publish -p rafters-server
cargo publish -p rafters-docs
```

## Crate Responsibilities

### rafters-mdx

**Owns:**
- MDX file parsing
- Frontmatter extraction
- Code block identification
- Heading extraction for TOC

**Does Not Own:**
- HTML rendering (uses pulldown-cmark)
- YAML parsing (uses serde_yaml)

### rafters-adapters

**Owns:**
- JSX to Web Component transformation
- Variant/size class extraction
- Web Component code generation

**Does Not Own:**
- JSX parsing (uses oxc-parser)
- Runtime behavior of Web Components

### rafters-static

**Owns:**
- Site build orchestration
- Template rendering
- Asset pipeline
- Search index generation

**Does Not Own:**
- MDX parsing (uses rafters-mdx)
- JSX transformation (uses rafters-adapters)
- Template engine (uses minijinja)

### rafters-server

**Owns:**
- HTTP server
- WebSocket HMR
- File watching
- Live page rendering

**Does Not Own:**
- HTTP framework (uses axum)
- File watching implementation (uses notify)

### rafters-docs

**Owns:**
- CLI interface
- Configuration loading
- Command orchestration

**Does Not Own:**
- Build logic (uses rafters-static)
- Dev server logic (uses rafters-server)

## Performance Profiling

### Build Time Analysis

```bash
cargo build --timings
# Opens target/cargo-timings/cargo-timing.html
```

### Runtime Profiling

```bash
cargo install flamegraph
cargo flamegraph --bin rafters-docs -- build
```

### Benchmark Specific Operations

```rust
#[cfg(test)]
mod benches {
    use test::Bencher;

    #[bench]
    fn bench_parse_mdx(b: &mut Bencher) {
        let input = include_str!("../fixtures/large.mdx");
        b.iter(|| parse_mdx(input));
    }
}
```

Run with:
```bash
cargo bench
```

## Troubleshooting Development

### Cargo Cache Issues

```bash
cargo clean
rm -rf ~/.cargo/registry/cache
cargo build
```

### Lock File Conflicts

```bash
cargo update
git add Cargo.lock
```

### IDE Not Finding Types

```bash
# Rebuild proc macros
cargo clean -p oxc_ast_macros
cargo build
```

### Tests Timeout

Increase test timeout:

```rust
#[tokio::test(flavor = "multi_thread")]
async fn slow_test() {
    tokio::time::timeout(
        Duration::from_secs(30),
        async_operation()
    ).await.unwrap();
}
```
