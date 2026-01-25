//! Frontmatter extraction and parsing.

use serde::Deserialize;

/// Parsed frontmatter from an MDX file.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct Frontmatter {
    /// Page title (required)
    pub title: String,

    /// Page description for SEO
    #[serde(default)]
    pub description: Option<String>,

    /// Component name this page documents
    #[serde(default)]
    pub component: Option<String>,

    /// Order in navigation (lower = first)
    #[serde(default)]
    pub order: Option<i32>,

    /// Whether to show in navigation
    #[serde(default = "default_true")]
    pub nav: bool,

    /// Custom slug override
    #[serde(default)]
    pub slug: Option<String>,
}

fn default_true() -> bool {
    true
}

impl Default for Frontmatter {
    fn default() -> Self {
        Self {
            title: String::new(),
            description: None,
            component: None,
            order: None,
            nav: true,
            slug: None,
        }
    }
}

/// Extract frontmatter from MDX content.
///
/// Returns the parsed frontmatter and the remaining content after the frontmatter block.
pub fn extract_frontmatter(source: &str) -> Result<(Option<Frontmatter>, &str), FrontmatterError> {
    let trimmed = source.trim_start();

    if !trimmed.starts_with("---") {
        return Ok((None, source));
    }

    // Find the closing ---
    let after_open = &trimmed[3..];
    let Some(close_pos) = after_open.find("\n---") else {
        return Err(FrontmatterError::Unclosed);
    };

    let yaml_content = &after_open[..close_pos].trim();
    let remaining = &after_open[close_pos + 4..];

    let frontmatter: Frontmatter = serde_yaml::from_str(yaml_content)
        .map_err(|e| FrontmatterError::InvalidYaml(e.to_string()))?;

    Ok((Some(frontmatter), remaining.trim_start()))
}

/// Errors that can occur when parsing frontmatter.
#[derive(Debug, thiserror::Error)]
pub enum FrontmatterError {
    #[error("Unclosed frontmatter block - missing closing ---")]
    Unclosed,

    #[error("Invalid YAML in frontmatter: {0}")]
    InvalidYaml(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_valid_frontmatter() {
        let source = r#"---
title: Button
description: A clickable button component
order: 1
---

# Button Component
"#;

        let (fm, content) = extract_frontmatter(source).unwrap();
        let fm = fm.unwrap();

        assert_eq!(fm.title, "Button");
        assert_eq!(
            fm.description,
            Some("A clickable button component".to_string())
        );
        assert_eq!(fm.order, Some(1));
        assert!(content.starts_with("# Button Component"));
    }

    #[test]
    fn handles_no_frontmatter() {
        let source = "# Just Markdown\n\nNo frontmatter here.";

        let (fm, content) = extract_frontmatter(source).unwrap();

        assert!(fm.is_none());
        assert_eq!(content, source);
    }

    #[test]
    fn errors_on_unclosed_frontmatter() {
        let source = "---\ntitle: Test\n# No closing";

        let result = extract_frontmatter(source);

        assert!(matches!(result, Err(FrontmatterError::Unclosed)));
    }

    #[test]
    fn errors_on_invalid_yaml() {
        let source = "---\ntitle: [invalid yaml\n---\n";

        let result = extract_frontmatter(source);

        assert!(matches!(result, Err(FrontmatterError::InvalidYaml(_))));
    }
}
