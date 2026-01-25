//! Static site generator for rafters documentation.
//!
//! Builds a static documentation site from MDX files with embedded Web Component previews.

pub mod assets;
pub mod builder;
pub mod templates;

pub use builder::{BuildConfig, BuildError, BuildResult, StaticBuilder};
