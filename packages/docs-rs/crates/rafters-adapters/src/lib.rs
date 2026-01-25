//! Framework adapters for transforming JSX to Web Components.
//!
//! This crate provides the core transformation logic that converts React/Solid JSX
//! components into static Web Components for documentation previews.

pub mod generator;
pub mod inline;
pub mod react;
pub mod registry;
pub mod traits;

pub use generator::generate_web_component;
pub use inline::{parse_inline_jsx, to_custom_element, InlineJsx, PropValue};
pub use react::{ComponentStructure, ReactAdapter};
pub use registry::{CachedComponent, ComponentRegistry, RegistryError};
pub use traits::{FrameworkAdapter, TransformContext, TransformError, TransformedBlock};
