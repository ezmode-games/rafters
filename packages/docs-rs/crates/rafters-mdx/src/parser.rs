//! MDX document parser.

use pulldown_cmark::{CodeBlockKind, Event, Options, Parser, Tag, TagEnd};

use crate::codeblock::{extract_filename, BlockMode, CodeBlock, Language};
use crate::frontmatter::{extract_frontmatter, Frontmatter, FrontmatterError};

/// A parsed MDX document.
#[derive(Debug, Clone)]
pub struct ParsedDoc {
    /// Parsed frontmatter (if present)
    pub frontmatter: Option<Frontmatter>,

    /// Markdown content (without frontmatter)
    pub content: String,

    /// Extracted code blocks
    pub code_blocks: Vec<CodeBlock>,

    /// Table of contents entries
    pub toc: Vec<TocEntry>,
}

/// A table of contents entry.
#[derive(Debug, Clone, PartialEq)]
pub struct TocEntry {
    /// Heading text
    pub title: String,
    /// Anchor ID
    pub id: String,
    /// Heading level (1-6)
    pub level: u8,
}

/// Errors that can occur when parsing MDX.
#[derive(Debug, thiserror::Error)]
pub enum ParseError {
    #[error("Frontmatter error: {0}")]
    Frontmatter(#[from] FrontmatterError),

    #[error("Parse error at line {line}: {message}")]
    Parse { line: usize, message: String },
}

/// Parse an MDX document.
///
/// Extracts frontmatter, code blocks, and generates a table of contents.
pub fn parse_mdx(source: &str) -> Result<ParsedDoc, ParseError> {
    // Extract frontmatter first
    let (frontmatter, content) = extract_frontmatter(source)?;

    // Parse markdown to extract code blocks and headings
    let mut code_blocks = Vec::new();
    let mut toc = Vec::new();

    let options = Options::ENABLE_TABLES
        | Options::ENABLE_FOOTNOTES
        | Options::ENABLE_STRIKETHROUGH
        | Options::ENABLE_TASKLISTS;

    let parser = Parser::new_ext(content, options);

    let mut current_code_block: Option<(String, usize)> = None; // (info, line)
    let mut current_heading: Option<(u8, String)> = None; // (level, text)
    let mut line_number = 1;

    // Count lines in frontmatter to offset line numbers
    let frontmatter_lines = source.len() - content.len();
    let frontmatter_line_offset = source[..frontmatter_lines].lines().count();

    for event in parser {
        match event {
            Event::Start(Tag::CodeBlock(kind)) => {
                let info = match &kind {
                    CodeBlockKind::Fenced(info) => info.to_string(),
                    CodeBlockKind::Indented => String::new(),
                };
                current_code_block = Some((info, line_number + frontmatter_line_offset));
            }

            Event::Text(text) => {
                if let Some((ref info, start_line)) = current_code_block {
                    let language = Language::from_info(info);
                    let mode = BlockMode::from_info(info);
                    let filename = extract_filename(info);

                    let mut block = CodeBlock::new(language, mode, text.to_string(), start_line);
                    block.filename = filename;
                    code_blocks.push(block);
                } else if let Some((level, ref mut heading_text)) = current_heading {
                    heading_text.push_str(&text);
                    let _ = level; // Suppress unused warning
                }

                // Count newlines in text for line tracking
                line_number += text.matches('\n').count();
            }

            Event::End(TagEnd::CodeBlock) => {
                current_code_block = None;
            }

            Event::Start(Tag::Heading { level, .. }) => {
                current_heading = Some((level as u8, String::new()));
            }

            Event::End(TagEnd::Heading(_)) => {
                if let Some((level, title)) = current_heading.take() {
                    let id = slugify(&title);
                    toc.push(TocEntry { title, id, level });
                }
            }

            Event::SoftBreak | Event::HardBreak => {
                line_number += 1;
            }

            _ => {}
        }
    }

    Ok(ParsedDoc {
        frontmatter,
        content: content.to_string(),
        code_blocks,
        toc,
    })
}

/// Convert a heading to a URL-safe slug.
fn slugify(text: &str) -> String {
    text.to_lowercase()
        .chars()
        .map(|c| {
            if c.is_alphanumeric() {
                c
            } else if c.is_whitespace() || c == '-' || c == '_' {
                '-'
            } else {
                '\0'
            }
        })
        .filter(|c| *c != '\0')
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_complete_mdx() {
        let source = r#"---
title: Button
description: A button component
---

# Button

A clickable button.

```tsx live
<Button variant="primary">Click me</Button>
```

## Variants

Different button styles.

```tsx
<Button variant="secondary">Secondary</Button>
```
"#;

        let doc = parse_mdx(source).unwrap();

        // Check frontmatter
        let fm = doc.frontmatter.unwrap();
        assert_eq!(fm.title, "Button");
        assert_eq!(fm.description, Some("A button component".to_string()));

        // Check code blocks
        assert_eq!(doc.code_blocks.len(), 2);

        let live_block = &doc.code_blocks[0];
        assert_eq!(live_block.language, Language::Tsx);
        assert_eq!(live_block.mode, BlockMode::Live);
        assert!(live_block.source.contains("variant=\"primary\""));

        let source_block = &doc.code_blocks[1];
        assert_eq!(source_block.language, Language::Tsx);
        assert_eq!(source_block.mode, BlockMode::Source);

        // Check TOC
        assert_eq!(doc.toc.len(), 2);
        assert_eq!(doc.toc[0].title, "Button");
        assert_eq!(doc.toc[0].level, 1);
        assert_eq!(doc.toc[0].id, "button");
        assert_eq!(doc.toc[1].title, "Variants");
        assert_eq!(doc.toc[1].level, 2);
    }

    #[test]
    fn parses_without_frontmatter() {
        let source = "# Just Markdown\n\nNo frontmatter.";

        let doc = parse_mdx(source).unwrap();

        assert!(doc.frontmatter.is_none());
        assert_eq!(doc.toc.len(), 1);
        assert_eq!(doc.toc[0].title, "Just Markdown");
    }

    #[test]
    fn extracts_multiple_code_blocks() {
        let source = r#"
# Examples

```tsx live
<Button>One</Button>
```

```tsx live
<Button>Two</Button>
```

```css
.button { color: red; }
```
"#;

        let doc = parse_mdx(source).unwrap();

        assert_eq!(doc.code_blocks.len(), 3);

        let live_blocks: Vec<_> = doc.code_blocks.iter().filter(|b| b.is_live()).collect();
        assert_eq!(live_blocks.len(), 2);
    }

    #[test]
    fn slugify_works() {
        assert_eq!(slugify("Hello World"), "hello-world");
        assert_eq!(slugify("API Reference"), "api-reference");
        assert_eq!(slugify("Button (Primary)"), "button-primary");
        assert_eq!(slugify("  Multiple   Spaces  "), "multiple-spaces");
    }
}
