//! React/JSX adapter for transforming components to Web Components.

use regex::Regex;
use std::sync::LazyLock;

use crate::generator::generate_web_component;
use crate::traits::{FrameworkAdapter, TransformContext, TransformError, TransformedBlock};

/// Extracted component structure from source code.
#[derive(Debug, Clone, Default)]
pub struct ComponentStructure {
    /// Component name (e.g., "Button")
    pub name: String,

    /// Variant classes mapping
    pub variant_lookup: Vec<(String, String)>,

    /// Size classes mapping
    pub size_lookup: Vec<(String, String)>,

    /// Base classes applied to all variants
    pub base_classes: String,

    /// Classes applied when disabled
    pub disabled_classes: String,

    /// Default variant value
    pub default_variant: String,

    /// Default size value
    pub default_size: String,

    /// Observed attributes from props
    pub observed_attributes: Vec<String>,
}

/// React/JSX to Web Component adapter.
#[derive(Debug, Default)]
pub struct ReactAdapter;

impl ReactAdapter {
    /// Create a new React adapter.
    pub fn new() -> Self {
        Self
    }

    /// Extract component structure from source code using regex patterns.
    pub fn extract_structure(&self, source: &str) -> Result<ComponentStructure, TransformError> {
        // Extract variantClasses Record (required)
        let variant_lookup = extract_record(source, "variantClasses")?;
        if variant_lookup.is_empty() {
            return Err(TransformError::MissingVariants);
        }

        // Extract sizeClasses Record (optional)
        let size_lookup = extract_record(source, "sizeClasses").unwrap_or_default();

        // Compute defaults from lookups
        let default_variant = variant_lookup
            .first()
            .map(|(k, _)| k.clone())
            .unwrap_or_else(|| "default".to_string());

        let default_size = size_lookup
            .first()
            .map(|(k, _)| k.clone())
            .unwrap_or_else(|| "default".to_string());

        Ok(ComponentStructure {
            name: extract_component_name(source).unwrap_or_else(|| "Component".to_string()),
            base_classes: extract_base_classes(source).unwrap_or_default(),
            disabled_classes: extract_disabled_classes(source)
                .unwrap_or_else(|| "opacity-50 pointer-events-none cursor-not-allowed".to_string()),
            variant_lookup,
            size_lookup,
            default_variant,
            default_size,
            observed_attributes: extract_attributes(source),
        })
    }
}

impl FrameworkAdapter for ReactAdapter {
    fn name(&self) -> &'static str {
        "react"
    }

    fn extensions(&self) -> &[&'static str] {
        &["tsx", "jsx"]
    }

    fn transform(
        &self,
        source: &str,
        tag_name: &str,
        _ctx: &TransformContext,
    ) -> Result<TransformedBlock, TransformError> {
        let structure = self.extract_structure(source)?;

        // Collect all classes used
        let mut classes_used: Vec<String> = Vec::new();

        // Add base classes
        for class in structure.base_classes.split_whitespace() {
            if !classes_used.contains(&class.to_string()) {
                classes_used.push(class.to_string());
            }
        }

        // Add variant classes
        for (_, classes) in &structure.variant_lookup {
            for class in classes.split_whitespace() {
                if !classes_used.contains(&class.to_string()) {
                    classes_used.push(class.to_string());
                }
            }
        }

        // Add size classes
        for (_, classes) in &structure.size_lookup {
            for class in classes.split_whitespace() {
                if !classes_used.contains(&class.to_string()) {
                    classes_used.push(class.to_string());
                }
            }
        }

        // Add disabled classes
        for class in structure.disabled_classes.split_whitespace() {
            if !classes_used.contains(&class.to_string()) {
                classes_used.push(class.to_string());
            }
        }

        // Generate the Web Component
        let web_component = generate_web_component(tag_name, &structure);

        Ok(TransformedBlock {
            web_component,
            tag_name: tag_name.to_string(),
            classes_used,
            attributes: structure.observed_attributes,
        })
    }
}

// Regex patterns for extraction
static COMPONENT_NAME_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?:export\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]*)")
        .expect("Invalid component name regex")
});

static RECORD_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"const\s+(\w+)\s*(?::\s*Record<[^>]+>)?\s*=\s*\{([^}]+)\}")
        .expect("Invalid record regex")
});

static ENTRY_RE: LazyLock<Regex> = LazyLock::new(|| {
    // Match: key: 'value' or key: "value"
    Regex::new(r#"(\w+)\s*:\s*['"]([^'"]*)['""]"#).expect("Invalid entry regex")
});

static BASE_CLASSES_CONCAT_RE: LazyLock<Regex> = LazyLock::new(|| {
    // Match: const baseClasses = 'string' + 'string' ...
    Regex::new(r"const\s+baseClasses\s*=\s*\n?\s*(['\x22][^;]+)")
        .expect("Invalid base classes concat regex")
});

static BASE_CLASSES_SIMPLE_RE: LazyLock<Regex> = LazyLock::new(|| {
    // Match: const baseClasses = 'simple string'
    Regex::new(r#"const\s+baseClasses\s*=\s*['"]([^'"]+)['"]"#)
        .expect("Invalid base classes simple regex")
});

static DISABLED_CLASSES_RE: LazyLock<Regex> = LazyLock::new(|| {
    // Match: disabledClasses = 'classes' or const disabledCls = 'classes'
    Regex::new(r#"(?:const\s+)?disabledCl(?:asse)?s\s*=\s*['"]([^'"]+)['"]"#)
        .expect("Invalid disabled classes regex")
});

static PROPS_INTERFACE_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"interface\s+\w*Props\s*\{([^}]+)\}").expect("Invalid props interface regex")
});

static DESTRUCTURE_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"\{\s*([^}]+)\s*\}\s*(?::\s*\w+)?\s*\)").expect("Invalid destructure regex")
});

/// Extract component name from source.
pub fn extract_component_name(source: &str) -> Option<String> {
    COMPONENT_NAME_RE
        .captures(source)
        .map(|c| c.get(1).unwrap().as_str().to_string())
}

/// Extract a Record<string, string> from source.
pub fn extract_record(source: &str, name: &str) -> Result<Vec<(String, String)>, TransformError> {
    let mut entries = Vec::new();

    for cap in RECORD_RE.captures_iter(source) {
        let record_name = cap.get(1).unwrap().as_str();
        if record_name != name {
            continue;
        }

        let content = cap.get(2).unwrap().as_str();

        for entry_cap in ENTRY_RE.captures_iter(content) {
            let key = entry_cap.get(1).unwrap().as_str().to_string();
            let value = entry_cap.get(2).unwrap().as_str().to_string();
            entries.push((key, value));
        }
    }

    Ok(entries)
}

/// Extract base classes from source.
pub fn extract_base_classes(source: &str) -> Option<String> {
    // Try concatenated format first
    if let Some(cap) = BASE_CLASSES_CONCAT_RE.captures(source) {
        let raw = cap.get(1).unwrap().as_str();
        // Parse concatenated strings like "'a' + 'b'"
        let classes = parse_concatenated_string(raw);
        if !classes.is_empty() {
            return Some(classes);
        }
    }

    // Fall back to simple format
    BASE_CLASSES_SIMPLE_RE
        .captures(source)
        .map(|c| c.get(1).unwrap().as_str().to_string())
}

/// Parse a concatenated string expression like "'a' + 'b' + 'c'".
fn parse_concatenated_string(raw: &str) -> String {
    // Match string literals in single or double quotes
    let string_re = Regex::new(r#"['"]([^'"]*)['""]"#).unwrap();

    string_re
        .captures_iter(raw)
        .map(|c| c.get(1).unwrap().as_str())
        .collect::<Vec<_>>()
        .join(" ")
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
}

/// Extract disabled classes from source.
pub fn extract_disabled_classes(source: &str) -> Option<String> {
    DISABLED_CLASSES_RE
        .captures(source)
        .map(|c| c.get(1).unwrap().as_str().to_string())
}

/// Extract observed attributes from props interface or destructuring.
pub fn extract_attributes(source: &str) -> Vec<String> {
    let mut attrs = Vec::new();

    // Common button attributes we always look for
    let common = ["variant", "size", "disabled", "loading"];
    for attr in common {
        if source.contains(attr) {
            attrs.push(attr.to_string());
        }
    }

    // Try to extract from props interface
    if let Some(cap) = PROPS_INTERFACE_RE.captures(source) {
        let content = cap.get(1).unwrap().as_str();
        for line in content.lines() {
            let line = line.trim();
            if let Some(name) = line.split([':', '?']).next() {
                let name = name.trim();
                if !name.is_empty()
                    && !attrs.contains(&name.to_string())
                    && !name.starts_with("//")
                    && name != "children"
                    && name != "className"
                    && name != "style"
                {
                    attrs.push(name.to_string());
                }
            }
        }
    }

    // Try to extract from destructuring pattern
    if let Some(cap) = DESTRUCTURE_RE.captures(source) {
        let content = cap.get(1).unwrap().as_str();
        for part in content.split(',') {
            let name = part.split(['=', ':']).next().unwrap_or("").trim();
            if !name.is_empty()
                && !attrs.contains(&name.to_string())
                && name != "children"
                && name != "className"
                && name != "style"
                && !name.starts_with("...")
            {
                attrs.push(name.to_string());
            }
        }
    }

    attrs
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_variant_classes() {
        let source = r#"
const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
};

export function Button() {
  return <button />;
}
        "#;

        let adapter = ReactAdapter::new();
        let result = adapter
            .transform(source, "button-preview", &TransformContext::default())
            .unwrap();

        assert!(result.web_component.contains("variantClasses"));
        assert!(result.web_component.contains("bg-primary"));
        assert!(result.classes_used.contains(&"bg-primary".to_string()));
    }

    #[test]
    fn extracts_concatenated_base_classes() {
        let source = r#"
const variantClasses = { default: '' };
const baseClasses =
  'inline-flex items-center ' +
  'justify-center gap-2';

export function Button() {}
        "#;

        let adapter = ReactAdapter::new();
        let structure = adapter.extract_structure(source).unwrap();

        assert!(structure.base_classes.contains("inline-flex"));
        assert!(structure.base_classes.contains("items-center"));
        assert!(structure.base_classes.contains("justify-center"));
    }

    #[test]
    fn extracts_simple_base_classes() {
        let source = r#"
const variantClasses = { default: '' };
const baseClasses = 'inline-flex items-center';

export function Button() {}
        "#;

        let adapter = ReactAdapter::new();
        let structure = adapter.extract_structure(source).unwrap();

        assert_eq!(structure.base_classes, "inline-flex items-center");
    }

    #[test]
    fn errors_on_missing_variants() {
        let source = "export function Button() { return <button />; }";

        let adapter = ReactAdapter::new();
        let result = adapter.transform(source, "button-preview", &TransformContext::default());

        assert!(matches!(result, Err(TransformError::MissingVariants)));
    }

    #[test]
    fn extracts_observed_attributes() {
        let source = r#"
const variantClasses = { default: '' };

interface ButtonProps {
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ variant, size, disabled, loading }: ButtonProps) {}
        "#;

        let adapter = ReactAdapter::new();
        let result = adapter
            .transform(source, "button-preview", &TransformContext::default())
            .unwrap();

        assert!(result.attributes.contains(&"variant".to_string()));
        assert!(result.attributes.contains(&"size".to_string()));
        assert!(result.attributes.contains(&"disabled".to_string()));
        assert!(result.attributes.contains(&"loading".to_string()));
    }

    #[test]
    fn generates_valid_tag_name() {
        let source = r#"
const variantClasses = { primary: 'bg-blue-500' };
export function Button() {}
        "#;

        let adapter = ReactAdapter::new();
        let result = adapter
            .transform(source, "my-button", &TransformContext::default())
            .unwrap();

        assert_eq!(result.tag_name, "my-button");
        assert!(result.web_component.contains("my-button"));
    }
}
