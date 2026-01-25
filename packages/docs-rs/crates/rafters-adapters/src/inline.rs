//! Inline JSX parser for documentation code blocks.
//!
//! Parses inline JSX snippets like `<Button variant="default">Click me</Button>`
//! to extract component name, props, and children.

use regex::Regex;
use std::collections::HashMap;
use std::sync::LazyLock;

/// Parsed inline JSX element.
#[derive(Debug, Clone, PartialEq)]
pub struct InlineJsx {
    /// Component name (e.g., "Button")
    pub component: String,

    /// Props as key-value pairs
    pub props: HashMap<String, PropValue>,

    /// Children content (text or nested JSX as string)
    pub children: Option<String>,

    /// Whether self-closing
    pub self_closing: bool,
}

/// A prop value from JSX.
#[derive(Debug, Clone, PartialEq)]
pub enum PropValue {
    /// String literal: variant="default"
    String(String),
    /// Boolean (presence): disabled
    Boolean(bool),
    /// Expression: onClick={() => {}}
    Expression(String),
}

impl PropValue {
    /// Get as string if it's a string value.
    pub fn as_str(&self) -> Option<&str> {
        match self {
            PropValue::String(s) => Some(s),
            _ => None,
        }
    }
}

/// Parse inline JSX source code.
///
/// Returns the first top-level JSX element found.
pub fn parse_inline_jsx(source: &str) -> Option<InlineJsx> {
    let source = source.trim();

    // Try self-closing first: <Component prop="value" />
    if let Some(jsx) = parse_self_closing(source) {
        return Some(jsx);
    }

    // Try with children: <Component>children</Component>
    parse_with_children(source)
}

/// Parse a self-closing JSX element.
fn parse_self_closing(source: &str) -> Option<InlineJsx> {
    static RE: LazyLock<Regex> = LazyLock::new(|| {
        Regex::new(r"^<([A-Z][a-zA-Z0-9]*)\s*([^/>]*?)\s*/>").expect("Invalid self-closing regex")
    });

    let caps = RE.captures(source)?;
    let component = caps.get(1)?.as_str().to_string();
    let props_str = caps.get(2).map(|m| m.as_str()).unwrap_or("");

    Some(InlineJsx {
        component,
        props: parse_props(props_str),
        children: None,
        self_closing: true,
    })
}

/// Find the matching closing tag position, handling nested same-name components.
fn find_matching_close_tag(source: &str, component: &str, start_pos: usize) -> Option<usize> {
    let open_pattern = format!("<{}", component);
    let close_tag = format!("</{}>", component);

    let remaining = &source[start_pos..];
    let mut depth = 1;
    let mut pos = 0;

    while depth > 0 && pos < remaining.len() {
        // Look for next open or close tag
        let next_open = remaining[pos..].find(&open_pattern);
        let next_close = remaining[pos..].find(&close_tag);

        match (next_open, next_close) {
            (Some(o), Some(c)) if o < c => {
                // Check if it's a self-closing tag or an opening tag
                let tag_start = pos + o;
                let after_name = &remaining[tag_start + open_pattern.len()..];
                if after_name.starts_with("/>")
                    || after_name.starts_with(" />")
                    || after_name.starts_with('\t') && after_name.trim_start().starts_with("/>")
                {
                    // Self-closing, skip it
                    pos = tag_start + open_pattern.len();
                } else if after_name.starts_with(">")
                    || after_name.starts_with(" ")
                    || after_name.starts_with('\n')
                {
                    // Opening tag, increment depth
                    depth += 1;
                    pos = tag_start + open_pattern.len();
                } else {
                    // Not a valid tag, skip
                    pos = tag_start + 1;
                }
            }
            (Some(o), Some(c)) => {
                // Close tag comes first
                if c < o {
                    depth -= 1;
                    if depth == 0 {
                        return Some(start_pos + pos + c);
                    }
                    pos += c + close_tag.len();
                } else {
                    pos += o + 1;
                }
            }
            (None, Some(c)) => {
                // Only close tag found
                depth -= 1;
                if depth == 0 {
                    return Some(start_pos + pos + c);
                }
                pos += c + close_tag.len();
            }
            (Some(_), None) | (None, None) => {
                // No more close tags
                return None;
            }
        }
    }

    None
}

/// Parse a JSX element with children.
fn parse_with_children(source: &str) -> Option<InlineJsx> {
    static OPEN_RE: LazyLock<Regex> = LazyLock::new(|| {
        Regex::new(r"^<([A-Z][a-zA-Z0-9]*)\s*([^>]*)>").expect("Invalid open tag regex")
    });

    let open_caps = OPEN_RE.captures(source)?;
    let component = open_caps.get(1)?.as_str().to_string();
    let props_str = open_caps.get(2).map(|m| m.as_str()).unwrap_or("");
    let open_len = open_caps.get(0)?.len();

    // Find matching close tag (handles nested same-name components)
    let close_pos = find_matching_close_tag(source, &component, open_len)?;

    let children = source[open_len..close_pos].trim();
    let children = if children.is_empty() {
        None
    } else {
        Some(children.to_string())
    };

    Some(InlineJsx {
        component,
        props: parse_props(props_str),
        children,
        self_closing: false,
    })
}

/// Parse props from a props string.
fn parse_props(props_str: &str) -> HashMap<String, PropValue> {
    let mut props = HashMap::new();
    let props_str = props_str.trim();

    if props_str.is_empty() {
        return props;
    }

    // Match: name="value" or name='value' or name={expr} or name (boolean)
    static PROP_RE: LazyLock<Regex> = LazyLock::new(|| {
        Regex::new(r#"([a-zA-Z][a-zA-Z0-9]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?"#)
            .expect("Invalid prop regex")
    });

    for caps in PROP_RE.captures_iter(props_str) {
        let name = caps.get(1).unwrap().as_str().to_string();

        let value = if let Some(m) = caps.get(2) {
            // Double-quoted string
            PropValue::String(m.as_str().to_string())
        } else if let Some(m) = caps.get(3) {
            // Single-quoted string
            PropValue::String(m.as_str().to_string())
        } else if let Some(m) = caps.get(4) {
            // Expression
            PropValue::Expression(m.as_str().to_string())
        } else {
            // Boolean (just the prop name)
            PropValue::Boolean(true)
        };

        props.insert(name, value);
    }

    props
}

/// Convert parsed inline JSX to a Web Component custom element tag.
pub fn to_custom_element(jsx: &InlineJsx, tag_name: &str) -> String {
    let mut attrs = Vec::new();

    for (key, value) in &jsx.props {
        match value {
            PropValue::String(s) => {
                attrs.push(format!(r#"{}="{}""#, key, html_escape(s)));
            }
            PropValue::Boolean(true) => {
                attrs.push(key.clone());
            }
            PropValue::Boolean(false) => {}
            PropValue::Expression(_) => {
                // Skip expressions for static preview
            }
        }
    }

    let attrs_str = if attrs.is_empty() {
        String::new()
    } else {
        format!(" {}", attrs.join(" "))
    };

    match &jsx.children {
        Some(children) => {
            format!("<{tag_name}{attrs_str}>{children}</{tag_name}>")
        }
        None => {
            format!("<{tag_name}{attrs_str}></{tag_name}>")
        }
    }
}

/// Escape HTML special characters including single quotes for XSS prevention.
fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#x27;")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_self_closing() {
        let jsx = parse_inline_jsx(r#"<Button variant="primary" />"#).unwrap();

        assert_eq!(jsx.component, "Button");
        assert!(jsx.self_closing);
        assert_eq!(
            jsx.props.get("variant"),
            Some(&PropValue::String("primary".to_string()))
        );
        assert!(jsx.children.is_none());
    }

    #[test]
    fn parses_with_children() {
        let jsx = parse_inline_jsx(r#"<Button variant="default">Click me</Button>"#).unwrap();

        assert_eq!(jsx.component, "Button");
        assert!(!jsx.self_closing);
        assert_eq!(
            jsx.props.get("variant"),
            Some(&PropValue::String("default".to_string()))
        );
        assert_eq!(jsx.children, Some("Click me".to_string()));
    }

    #[test]
    fn parses_boolean_props() {
        let jsx = parse_inline_jsx(r#"<Button disabled>Disabled</Button>"#).unwrap();

        assert_eq!(jsx.props.get("disabled"), Some(&PropValue::Boolean(true)));
    }

    #[test]
    fn parses_expression_props() {
        // Note: Arrow functions with => are not supported in inline JSX parsing
        // because the > in => breaks the simple tag regex. This is acceptable
        // for documentation previews where event handlers are stripped anyway.
        let jsx = parse_inline_jsx(r#"<Button data={someValue}>Click</Button>"#).unwrap();

        assert_eq!(jsx.component, "Button");
        assert_eq!(jsx.children, Some("Click".to_string()));
        assert!(matches!(
            jsx.props.get("data"),
            Some(PropValue::Expression(_))
        ));
    }

    #[test]
    fn converts_to_custom_element() {
        let jsx = parse_inline_jsx(r#"<Button variant="primary" disabled>Click</Button>"#).unwrap();
        let html = to_custom_element(&jsx, "button-preview");

        assert!(html.contains("button-preview"));
        assert!(html.contains(r#"variant="primary""#));
        assert!(html.contains("disabled"));
        assert!(html.contains("Click"));
    }

    #[test]
    fn handles_empty_element() {
        let jsx = parse_inline_jsx(r#"<Icon name="star" />"#).unwrap();

        assert_eq!(jsx.component, "Icon");
        assert!(jsx.self_closing);
        assert_eq!(
            jsx.props.get("name"),
            Some(&PropValue::String("star".to_string()))
        );
    }
}
