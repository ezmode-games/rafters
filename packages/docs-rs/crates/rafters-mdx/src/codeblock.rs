//! Code block extraction and parsing.

/// Programming language of a code block.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum Language {
    Tsx,
    Jsx,
    TypeScript,
    JavaScript,
    Vue,
    Svelte,
    Html,
    Css,
    Json,
    Bash,
    #[default]
    Unknown,
}

impl Language {
    /// Parse language from code fence info string.
    pub fn from_info(info: &str) -> Self {
        let lang = info.split_whitespace().next().unwrap_or("");
        match lang.to_lowercase().as_str() {
            "tsx" => Self::Tsx,
            "jsx" => Self::Jsx,
            "ts" | "typescript" => Self::TypeScript,
            "js" | "javascript" => Self::JavaScript,
            "vue" => Self::Vue,
            "svelte" => Self::Svelte,
            "html" => Self::Html,
            "css" => Self::Css,
            "json" => Self::Json,
            "bash" | "sh" | "shell" => Self::Bash,
            _ => Self::Unknown,
        }
    }

    /// Check if this language can be transformed to a Web Component.
    pub fn is_transformable(&self) -> bool {
        matches!(self, Self::Tsx | Self::Jsx)
    }
}

/// Rendering mode for a code block.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum BlockMode {
    /// Render component with live preview
    Live,
    /// Interactive editing allowed
    Editable,
    /// Syntax highlight only (default)
    #[default]
    Source,
    /// Render in iframe, not editable
    Preview,
}

impl BlockMode {
    /// Parse mode from code fence info string.
    pub fn from_info(info: &str) -> Self {
        let lower = info.to_lowercase();
        if lower.contains("live") {
            Self::Live
        } else if lower.contains("editable") {
            Self::Editable
        } else if lower.contains("preview") {
            Self::Preview
        } else {
            Self::Source
        }
    }
}

/// A parsed code block from MDX.
#[derive(Debug, Clone, PartialEq)]
pub struct CodeBlock {
    /// Unique identifier for this block (format: block-{line_number})
    pub id: String,

    /// Programming language
    pub language: Language,

    /// Rendering mode
    pub mode: BlockMode,

    /// Source code content
    pub source: String,

    /// Line number where the block starts (1-indexed)
    pub line_number: usize,

    /// Optional filename hint from info string
    pub filename: Option<String>,
}

impl CodeBlock {
    /// Create a new code block.
    pub fn new(language: Language, mode: BlockMode, source: String, line_number: usize) -> Self {
        Self {
            id: format!("block-{}", line_number),
            language,
            mode,
            source,
            line_number,
            filename: None,
        }
    }

    /// Check if this block should be rendered as a live preview.
    pub fn is_live(&self) -> bool {
        self.mode == BlockMode::Live && self.language.is_transformable()
    }
}

/// Extract filename from code fence info string if present.
///
/// Supports formats like:
/// - `tsx filename="Button.tsx"`
/// - `tsx file=Button.tsx`
pub fn extract_filename(info: &str) -> Option<String> {
    // Try filename="..." format
    if let Some(start) = info.find("filename=\"") {
        let rest = &info[start + 10..];
        if let Some(end) = rest.find('"') {
            return Some(rest[..end].to_string());
        }
    }

    // Try file=... format (without quotes)
    if let Some(start) = info.find("file=") {
        let rest = &info[start + 5..];
        let end = rest.find(char::is_whitespace).unwrap_or(rest.len());
        let filename = rest[..end].trim_matches('"');
        if !filename.is_empty() {
            return Some(filename.to_string());
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_language() {
        assert_eq!(Language::from_info("tsx live"), Language::Tsx);
        assert_eq!(Language::from_info("jsx"), Language::Jsx);
        assert_eq!(Language::from_info("typescript"), Language::TypeScript);
        assert_eq!(Language::from_info("js"), Language::JavaScript);
        assert_eq!(Language::from_info("unknown"), Language::Unknown);
    }

    #[test]
    fn parses_mode() {
        assert_eq!(BlockMode::from_info("tsx live"), BlockMode::Live);
        assert_eq!(BlockMode::from_info("tsx editable"), BlockMode::Editable);
        assert_eq!(BlockMode::from_info("tsx preview"), BlockMode::Preview);
        assert_eq!(BlockMode::from_info("tsx"), BlockMode::Source);
    }

    #[test]
    fn extracts_filename() {
        assert_eq!(
            extract_filename("tsx filename=\"Button.tsx\""),
            Some("Button.tsx".to_string())
        );
        assert_eq!(
            extract_filename("tsx file=Button.tsx live"),
            Some("Button.tsx".to_string())
        );
        assert_eq!(extract_filename("tsx live"), None);
    }

    #[test]
    fn code_block_is_live() {
        let live_tsx = CodeBlock::new(Language::Tsx, BlockMode::Live, "".to_string(), 1);
        assert!(live_tsx.is_live());

        let source_tsx = CodeBlock::new(Language::Tsx, BlockMode::Source, "".to_string(), 1);
        assert!(!source_tsx.is_live());

        let live_html = CodeBlock::new(Language::Html, BlockMode::Live, "".to_string(), 1);
        assert!(!live_html.is_live());
    }
}
