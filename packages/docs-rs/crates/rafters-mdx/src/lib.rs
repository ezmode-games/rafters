//! MDX parser with frontmatter and code block extraction.
//!
//! This crate provides functionality to parse MDX files, extract YAML frontmatter,
//! and identify code blocks marked for live preview rendering.

pub mod codeblock;
pub mod frontmatter;
pub mod parser;

pub use codeblock::{BlockMode, CodeBlock, Language};
pub use frontmatter::Frontmatter;
pub use parser::{parse_mdx, ParseError, ParsedDoc};
