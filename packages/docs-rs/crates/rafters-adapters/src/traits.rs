//! Trait definitions for framework adapters.

use std::collections::HashMap;

/// Context for transforming a component.
#[derive(Debug, Clone, Default)]
pub struct TransformContext {
    /// Import mappings: "@components/*" -> "./src/components/*"
    pub import_map: HashMap<String, String>,
}

/// Result of transforming a component to a Web Component.
#[derive(Debug, Clone)]
pub struct TransformedBlock {
    /// Web Component class definition (JavaScript)
    pub web_component: String,

    /// Custom element tag name (e.g., "button-preview")
    pub tag_name: String,

    /// Tailwind classes used (for CSS scanning)
    pub classes_used: Vec<String>,

    /// Observed attributes derived from props
    pub attributes: Vec<String>,
}

/// Errors that can occur during transformation.
#[derive(Debug, thiserror::Error)]
pub enum TransformError {
    #[error("Parse error: {0}")]
    ParseError(String),

    #[error("Transform error: {0}")]
    TransformError(String),

    #[error("Missing variant classes: component must define variantClasses Record")]
    MissingVariants,

    #[error("Invalid component structure: {0}")]
    InvalidStructure(String),
}

/// Trait for framework-specific adapters.
pub trait FrameworkAdapter: Send + Sync {
    /// Framework identifier (e.g., "react", "solid")
    fn name(&self) -> &'static str;

    /// File extensions this adapter handles
    fn extensions(&self) -> &[&'static str];

    /// Transform source component into a Web Component.
    ///
    /// # Arguments
    /// * `source` - The source code of the component
    /// * `tag_name` - The custom element tag name to use
    /// * `ctx` - Transform context with import mappings
    fn transform(
        &self,
        source: &str,
        tag_name: &str,
        ctx: &TransformContext,
    ) -> Result<TransformedBlock, TransformError>;
}
