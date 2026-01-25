//! Framework adapters for transforming JSX to Web Components.
//!
//! This crate provides the core transformation logic that converts React/Solid JSX
//! components into static Web Components for documentation previews.

pub mod generator;
pub mod react;
pub mod traits;

pub use generator::generate_web_component;
pub use react::ReactAdapter;
pub use traits::{FrameworkAdapter, TransformContext, TransformError, TransformedBlock};
