//! Static site builder.

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::Instant;

use rayon::prelude::*;
use walkdir::WalkDir;

use rafters_adapters::{FrameworkAdapter, ReactAdapter, TransformContext, TransformedBlock};
use rafters_mdx::{parse_mdx, CodeBlock, Frontmatter, ParsedDoc};

use crate::assets::AssetPipeline;
use crate::templates::{Context, NavItem, TemplateEngine, TocEntry};

/// Configuration for building a static site.
#[derive(Debug, Clone)]
pub struct BuildConfig {
    /// Source docs directory
    pub docs_dir: PathBuf,

    /// Output directory
    pub output_dir: PathBuf,

    /// Minify HTML/CSS/JS output
    pub minify: bool,

    /// Base URL for the site
    pub base_url: String,

    /// Site title
    pub title: String,
}

impl Default for BuildConfig {
    fn default() -> Self {
        Self {
            docs_dir: PathBuf::from("docs"),
            output_dir: PathBuf::from("dist"),
            minify: true,
            base_url: "/".to_string(),
            title: "Documentation".to_string(),
        }
    }
}

/// Result of a build operation.
#[derive(Debug)]
pub struct BuildResult {
    /// Number of pages generated
    pub pages: usize,

    /// Number of components transformed
    pub components: usize,

    /// Total build time in milliseconds
    pub duration_ms: u64,

    /// Output directory
    pub output_dir: PathBuf,
}

/// Errors that can occur during build.
#[derive(Debug, thiserror::Error)]
pub enum BuildError {
    #[error("Failed to read docs directory: {0}")]
    ReadError(String),

    #[error("Failed to parse MDX: {path}: {message}")]
    ParseError { path: String, message: String },

    #[error("Failed to transform component: {0}")]
    TransformError(String),

    #[error("Failed to render template: {0}")]
    TemplateError(String),

    #[error("Failed to write output: {0}")]
    WriteError(String),
}

/// A page to be built.
#[derive(Debug)]
struct PageInfo {
    /// Source file path
    source_path: PathBuf,

    /// Relative path from docs dir
    relative_path: PathBuf,

    /// Output path
    output_path: PathBuf,

    /// Parsed document
    doc: ParsedDoc,
}

/// Static site builder.
pub struct StaticBuilder {
    config: BuildConfig,
    adapter: ReactAdapter,
    templates: TemplateEngine,
}

impl StaticBuilder {
    /// Create a new static builder.
    pub fn new(config: BuildConfig) -> Self {
        Self {
            config,
            adapter: ReactAdapter::new(),
            templates: TemplateEngine::new(),
        }
    }

    /// Build the static site.
    pub async fn build(&self) -> Result<BuildResult, BuildError> {
        let start = Instant::now();

        // Ensure output directory exists
        fs::create_dir_all(&self.config.output_dir)
            .map_err(|e| BuildError::WriteError(e.to_string()))?;

        // Find all MDX files
        let pages = self.discover_pages()?;

        // Build navigation from pages
        let nav = self.build_navigation(&pages);

        // Transform and render pages in parallel
        let results: Vec<Result<(usize, usize), BuildError>> = pages
            .par_iter()
            .map(|page| self.build_page(page, &nav))
            .collect();

        // Collect results
        let mut total_pages = 0;
        let mut total_components = 0;

        for result in results {
            let (pages, components) = result?;
            total_pages += pages;
            total_components += components;
        }

        // Generate assets
        self.generate_assets()?;

        // Generate search index
        self.generate_search_index(&pages)?;

        // Generate sitemap
        self.generate_sitemap(&pages)?;

        let duration = start.elapsed();

        Ok(BuildResult {
            pages: total_pages,
            components: total_components,
            duration_ms: duration.as_millis() as u64,
            output_dir: self.config.output_dir.clone(),
        })
    }

    /// Discover all MDX pages in the docs directory.
    fn discover_pages(&self) -> Result<Vec<PageInfo>, BuildError> {
        let mut pages = Vec::new();

        if !self.config.docs_dir.exists() {
            return Err(BuildError::ReadError(format!(
                "Docs directory not found: {}",
                self.config.docs_dir.display()
            )));
        }

        for entry in WalkDir::new(&self.config.docs_dir)
            .follow_links(true)
            .into_iter()
            .filter_map(|e| e.ok())
        {
            let path = entry.path();

            if !path.is_file() {
                continue;
            }

            let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
            if ext != "mdx" && ext != "md" {
                continue;
            }

            // Read and parse the file
            let content = fs::read_to_string(path)
                .map_err(|e| BuildError::ReadError(format!("{}: {}", path.display(), e)))?;

            let doc = parse_mdx(&content).map_err(|e| BuildError::ParseError {
                path: path.display().to_string(),
                message: e.to_string(),
            })?;

            // Calculate relative path
            let relative_path = path
                .strip_prefix(&self.config.docs_dir)
                .unwrap_or(path)
                .to_path_buf();

            // Calculate output path
            let output_path = self.calculate_output_path(&relative_path, &doc.frontmatter);

            pages.push(PageInfo {
                source_path: path.to_path_buf(),
                relative_path,
                output_path,
                doc,
            });
        }

        // Sort by order from frontmatter
        pages.sort_by(|a, b| {
            let order_a = a
                .doc
                .frontmatter
                .as_ref()
                .and_then(|f| f.order)
                .unwrap_or(999);
            let order_b = b
                .doc
                .frontmatter
                .as_ref()
                .and_then(|f| f.order)
                .unwrap_or(999);
            order_a.cmp(&order_b)
        });

        Ok(pages)
    }

    /// Calculate output path for a page.
    fn calculate_output_path(&self, relative: &Path, frontmatter: &Option<Frontmatter>) -> PathBuf {
        // Check for slug override
        if let Some(fm) = frontmatter {
            if let Some(slug) = &fm.slug {
                return self.config.output_dir.join(slug).join("index.html");
            }
        }

        // Convert path to output structure
        let stem = relative
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("index");

        if stem == "index" {
            // docs/index.mdx -> dist/index.html
            let parent = relative.parent().unwrap_or(Path::new(""));
            self.config.output_dir.join(parent).join("index.html")
        } else {
            // docs/button.mdx -> dist/button/index.html
            let parent = relative.parent().unwrap_or(Path::new(""));
            self.config
                .output_dir
                .join(parent)
                .join(stem)
                .join("index.html")
        }
    }

    /// Build navigation structure from pages.
    fn build_navigation(&self, pages: &[PageInfo]) -> Vec<NavItem> {
        let mut nav = Vec::new();
        let mut dirs: HashMap<PathBuf, Vec<NavItem>> = HashMap::new();

        for page in pages {
            let fm = page.doc.frontmatter.as_ref();

            // Skip pages marked as not in nav
            if let Some(f) = fm {
                if !f.nav {
                    continue;
                }
            }

            let title = fm.map(|f| f.title.clone()).unwrap_or_else(|| {
                page.relative_path
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or("Untitled")
                    .to_string()
            });

            // Calculate URL path
            let url_path = self.path_to_url(&page.output_path);

            let item = NavItem {
                title,
                path: url_path,
                children: Vec::new(),
                active: false,
            };

            // Group by parent directory
            let parent = page.relative_path.parent().unwrap_or(Path::new(""));
            dirs.entry(parent.to_path_buf()).or_default().push(item);
        }

        // Build tree structure
        if let Some(root_items) = dirs.remove(&PathBuf::new()) {
            nav.extend(root_items);
        }

        // Add subdirectories as nested items
        for (dir, items) in dirs {
            let dir_name: &str = dir
                .file_name()
                .and_then(|s: &std::ffi::OsStr| s.to_str())
                .unwrap_or("Section");

            nav.push(NavItem {
                title: capitalize(dir_name),
                path: format!("{}{}/", self.config.base_url, dir.display()),
                children: items,
                active: false,
            });
        }

        nav
    }

    /// Convert output path to URL.
    fn path_to_url(&self, path: &Path) -> String {
        let relative = path.strip_prefix(&self.config.output_dir).unwrap_or(path);

        let url = relative
            .parent()
            .map(|p| p.to_string_lossy().to_string())
            .unwrap_or_default();

        if url.is_empty() {
            self.config.base_url.clone()
        } else {
            format!("{}{}/", self.config.base_url, url)
        }
    }

    /// Build a single page.
    fn build_page(&self, page: &PageInfo, nav: &[NavItem]) -> Result<(usize, usize), BuildError> {
        let mut components_count = 0;
        let mut web_components = Vec::new();

        // Transform live code blocks to Web Components
        for block in &page.doc.code_blocks {
            if block.is_live() {
                let tag_name = format!("preview-{}", block.id);
                match self.transform_block(block, &tag_name) {
                    Ok(transformed) => {
                        web_components.push(transformed);
                        components_count += 1;
                    }
                    Err(e) => {
                        tracing::warn!(
                            "Failed to transform block {} in {}: {}",
                            block.id,
                            page.source_path.display(),
                            e
                        );
                    }
                }
            }
        }

        // Render markdown to HTML
        let content_html = self.render_markdown(&page.doc.content, &web_components);

        // Build TOC
        let toc: Vec<TocEntry> = page
            .doc
            .toc
            .iter()
            .map(|e| TocEntry {
                title: e.title.clone(),
                id: e.id.clone(),
                level: e.level,
            })
            .collect();

        // Build context
        let title = page
            .doc
            .frontmatter
            .as_ref()
            .map(|f| f.title.clone())
            .unwrap_or_else(|| "Untitled".to_string());

        let context = Context {
            title: title.clone(),
            site_title: self.config.title.clone(),
            content: content_html,
            nav: nav.to_vec(),
            toc,
            base_url: self.config.base_url.clone(),
            web_components: web_components
                .iter()
                .map(|w| w.web_component.clone())
                .collect(),
        };

        // Render template
        let html = self
            .templates
            .render_page("doc.html", &context)
            .map_err(|e: minijinja::Error| BuildError::TemplateError(e.to_string()))?;

        // Ensure output directory exists
        if let Some(parent) = page.output_path.parent() {
            fs::create_dir_all(parent).map_err(|e| BuildError::WriteError(e.to_string()))?;
        }

        // Write output
        fs::write(&page.output_path, html).map_err(|e| BuildError::WriteError(e.to_string()))?;

        Ok((1, components_count))
    }

    /// Transform a code block to a Web Component.
    fn transform_block(
        &self,
        block: &CodeBlock,
        tag_name: &str,
    ) -> Result<TransformedBlock, BuildError> {
        let ctx = TransformContext::default();

        self.adapter
            .transform(&block.source, tag_name, &ctx)
            .map_err(|e| BuildError::TransformError(e.to_string()))
    }

    /// Render markdown to HTML, replacing live blocks with Web Components.
    fn render_markdown(&self, content: &str, web_components: &[TransformedBlock]) -> String {
        use pulldown_cmark::{html, Options, Parser};

        let options = Options::ENABLE_TABLES
            | Options::ENABLE_FOOTNOTES
            | Options::ENABLE_STRIKETHROUGH
            | Options::ENABLE_TASKLISTS;

        let parser = Parser::new_ext(content, options);

        let mut html_output = String::new();
        html::push_html(&mut html_output, parser);

        // Replace live code block markers with Web Component tags
        // This is a simplified approach - in production you'd want proper AST manipulation
        for wc in web_components {
            let marker = format!("<!-- live:{} -->", wc.tag_name);
            let replacement = format!(
                "<{} variant=\"primary\">Example</{}>",
                wc.tag_name, wc.tag_name
            );
            html_output = html_output.replace(&marker, &replacement);
        }

        html_output
    }

    /// Generate static assets.
    fn generate_assets(&self) -> Result<(), BuildError> {
        let assets_dir = self.config.output_dir.join("assets");
        fs::create_dir_all(&assets_dir).map_err(|e| BuildError::WriteError(e.to_string()))?;

        // Generate main CSS
        let css = AssetPipeline::generate_css();
        let css = if self.config.minify {
            AssetPipeline::minify_css(&css).unwrap_or(css)
        } else {
            css
        };
        fs::write(assets_dir.join("main.css"), css)
            .map_err(|e| BuildError::WriteError(e.to_string()))?;

        // Generate main JS (HMR client for dev, empty for prod)
        let js = AssetPipeline::generate_js();
        fs::write(assets_dir.join("main.js"), js)
            .map_err(|e| BuildError::WriteError(e.to_string()))?;

        Ok(())
    }

    /// Generate search index.
    fn generate_search_index(&self, pages: &[PageInfo]) -> Result<(), BuildError> {
        let index: Vec<serde_json::Value> = pages
            .iter()
            .map(|page| {
                let title = page
                    .doc
                    .frontmatter
                    .as_ref()
                    .map(|f| f.title.clone())
                    .unwrap_or_default();

                let description = page
                    .doc
                    .frontmatter
                    .as_ref()
                    .and_then(|f| f.description.clone())
                    .unwrap_or_default();

                let url = self.path_to_url(&page.output_path);

                // Extract text content (simplified)
                let content = page
                    .doc
                    .content
                    .lines()
                    .filter(|l| !l.starts_with('#') && !l.starts_with("```"))
                    .take(10)
                    .collect::<Vec<_>>()
                    .join(" ");

                serde_json::json!({
                    "title": title,
                    "description": description,
                    "url": url,
                    "content": content,
                })
            })
            .collect();

        let json = serde_json::to_string_pretty(&index)
            .map_err(|e| BuildError::WriteError(e.to_string()))?;

        fs::write(self.config.output_dir.join("search-index.json"), json)
            .map_err(|e| BuildError::WriteError(e.to_string()))?;

        Ok(())
    }

    /// Generate sitemap.
    fn generate_sitemap(&self, pages: &[PageInfo]) -> Result<(), BuildError> {
        let urls: Vec<String> = pages
            .iter()
            .map(|page| {
                let url = self.path_to_url(&page.output_path);
                format!(
                    "  <url>\n    <loc>{}{}</loc>\n  </url>",
                    self.config.base_url.trim_end_matches('/'),
                    url
                )
            })
            .collect();

        let sitemap = format!(
            r#"<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{}
</urlset>"#,
            urls.join("\n")
        );

        fs::write(self.config.output_dir.join("sitemap.xml"), sitemap)
            .map_err(|e| BuildError::WriteError(e.to_string()))?;

        // Also generate robots.txt
        let robots = format!(
            "User-agent: *\nAllow: /\nSitemap: {}sitemap.xml",
            self.config.base_url
        );
        fs::write(self.config.output_dir.join("robots.txt"), robots)
            .map_err(|e| BuildError::WriteError(e.to_string()))?;

        Ok(())
    }
}

/// Capitalize first letter of a string.
fn capitalize(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
        None => String::new(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn builds_simple_site() {
        let temp = tempdir().unwrap();
        let docs = temp.path().join("docs");
        let out = temp.path().join("dist");

        fs::create_dir_all(&docs).unwrap();
        fs::write(
            docs.join("index.mdx"),
            r#"---
title: Home
---
# Welcome
"#,
        )
        .unwrap();

        let config = BuildConfig {
            docs_dir: docs,
            output_dir: out.clone(),
            ..Default::default()
        };

        let builder = StaticBuilder::new(config);
        let result = builder.build().await.unwrap();

        assert_eq!(result.pages, 1);
        assert!(out.join("index.html").exists());
    }

    #[tokio::test]
    async fn generates_search_index() {
        let temp = tempdir().unwrap();
        let docs = temp.path().join("docs");
        let out = temp.path().join("dist");

        fs::create_dir_all(&docs).unwrap();
        fs::write(
            docs.join("index.mdx"),
            "---\ntitle: Test\n---\n# Searchable Content",
        )
        .unwrap();

        let builder = StaticBuilder::new(BuildConfig {
            docs_dir: docs,
            output_dir: out.clone(),
            ..Default::default()
        });

        builder.build().await.unwrap();

        let index = fs::read_to_string(out.join("search-index.json")).unwrap();
        assert!(index.contains("Test"));
    }
}
