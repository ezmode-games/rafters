//! Component registry for looking up component definitions.
//!
//! Scans a components directory, parses source files, and provides
//! lookup by component name for generating Web Components.

use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};

use walkdir::WalkDir;

use crate::generator::generate_web_component;
use crate::react::{ComponentStructure, ReactAdapter};
use crate::traits::TransformedBlock;

/// A registry of component definitions.
#[derive(Debug, Default)]
pub struct ComponentRegistry {
    /// Cached component structures by name (lowercase)
    components: HashMap<String, CachedComponent>,
}

/// A cached component with its source and structure.
#[derive(Debug, Clone)]
pub struct CachedComponent {
    /// Original component name
    pub name: String,

    /// Source file path
    pub source_path: PathBuf,

    /// Extracted structure
    pub structure: ComponentStructure,

    /// Full source code
    pub source: String,
}

impl ComponentRegistry {
    /// Create a new empty registry.
    pub fn new() -> Self {
        Self::default()
    }

    /// Scan a directory for component files and populate the registry.
    pub fn scan(&mut self, components_dir: &Path) -> Result<usize, RegistryError> {
        if !components_dir.exists() {
            return Err(RegistryError::DirectoryNotFound(
                components_dir.display().to_string(),
            ));
        }

        let adapter = ReactAdapter::new();
        let mut count = 0;

        for entry in WalkDir::new(components_dir)
            .follow_links(true)
            .into_iter()
            .filter_map(|e| e.ok())
        {
            let path = entry.path();

            // Only process .tsx and .jsx files
            let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
            if ext != "tsx" && ext != "jsx" {
                continue;
            }

            // Skip test files, stories, and index files
            let filename = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
            if filename.contains(".test.")
                || filename.contains(".spec.")
                || filename.contains(".stories.")
                || filename == "index.tsx"
                || filename == "index.jsx"
            {
                continue;
            }

            // Read and parse
            let source = match fs::read_to_string(path) {
                Ok(s) => s,
                Err(_) => continue,
            };

            // Try to extract structure
            let structure = match adapter.extract_structure(&source) {
                Ok(s) => s,
                Err(_) => continue, // Skip files without variantClasses
            };

            // Use the extracted component name, or derive from filename
            let name = if structure.name.is_empty() || structure.name == "Component" {
                path.file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or("unknown")
                    .to_string()
            } else {
                structure.name.clone()
            };

            let cached = CachedComponent {
                name: name.clone(),
                source_path: path.to_path_buf(),
                structure,
                source,
            };

            // Store by lowercase name for case-insensitive lookup
            self.components.insert(name.to_lowercase(), cached);
            count += 1;
        }

        Ok(count)
    }

    /// Look up a component by name (case-insensitive).
    pub fn get(&self, name: &str) -> Option<&CachedComponent> {
        self.components.get(&name.to_lowercase())
    }

    /// Check if a component exists.
    pub fn contains(&self, name: &str) -> bool {
        self.components.contains_key(&name.to_lowercase())
    }

    /// Get all registered component names.
    pub fn names(&self) -> Vec<&str> {
        self.components.values().map(|c| c.name.as_str()).collect()
    }

    /// Generate a Web Component for a registered component.
    pub fn generate_web_component(
        &self,
        component_name: &str,
        tag_name: &str,
    ) -> Result<TransformedBlock, RegistryError> {
        let cached = self
            .get(component_name)
            .ok_or_else(|| RegistryError::ComponentNotFound(component_name.to_string()))?;

        // Collect all classes used (using HashSet for O(1) deduplication)
        let mut classes_set: HashSet<String> = HashSet::new();

        // Add base classes
        for class in cached.structure.base_classes.split_whitespace() {
            classes_set.insert(class.to_string());
        }

        // Add variant classes
        for (_, classes) in &cached.structure.variant_lookup {
            for class in classes.split_whitespace() {
                classes_set.insert(class.to_string());
            }
        }

        // Add size classes
        for (_, classes) in &cached.structure.size_lookup {
            for class in classes.split_whitespace() {
                classes_set.insert(class.to_string());
            }
        }

        // Add disabled classes
        for class in cached.structure.disabled_classes.split_whitespace() {
            classes_set.insert(class.to_string());
        }

        // Convert to Vec for the output
        let classes_used: Vec<String> = classes_set.into_iter().collect();

        let web_component = generate_web_component(tag_name, &cached.structure);

        Ok(TransformedBlock {
            web_component,
            tag_name: tag_name.to_string(),
            classes_used,
            attributes: cached.structure.observed_attributes.clone(),
        })
    }
}

/// Errors that can occur with the registry.
#[derive(Debug, thiserror::Error)]
pub enum RegistryError {
    #[error("Components directory not found: {0}")]
    DirectoryNotFound(String),

    #[error("Component not found: {0}")]
    ComponentNotFound(String),

    #[error("Failed to parse component: {0}")]
    ParseError(String),
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn scans_components_directory() {
        let temp = tempdir().unwrap();
        let comp_dir = temp.path().join("components");
        fs::create_dir_all(&comp_dir).unwrap();

        // Create a valid component file
        fs::write(
            comp_dir.join("button.tsx"),
            r#"
const variantClasses = {
  default: 'bg-primary text-white',
  secondary: 'bg-secondary text-black',
};

export function Button() {
  return <button />;
}
            "#,
        )
        .unwrap();

        let mut registry = ComponentRegistry::new();
        let count = registry.scan(&comp_dir).unwrap();

        assert_eq!(count, 1);
        assert!(registry.contains("Button"));
    }

    #[test]
    fn generates_web_component_from_registry() {
        let temp = tempdir().unwrap();
        let comp_dir = temp.path().join("components");
        fs::create_dir_all(&comp_dir).unwrap();

        fs::write(
            comp_dir.join("button.tsx"),
            r#"
const variantClasses = {
  primary: 'bg-blue-500',
};

export function Button() {}
            "#,
        )
        .unwrap();

        let mut registry = ComponentRegistry::new();
        registry.scan(&comp_dir).unwrap();

        let result = registry
            .generate_web_component("Button", "button-preview")
            .unwrap();

        assert_eq!(result.tag_name, "button-preview");
        assert!(result.web_component.contains("bg-blue-500"));
    }

    #[test]
    fn skips_test_and_story_files() {
        let temp = tempdir().unwrap();
        let comp_dir = temp.path().join("components");
        fs::create_dir_all(&comp_dir).unwrap();

        // These should be skipped
        fs::write(
            comp_dir.join("button.test.tsx"),
            "const variantClasses = { test: 'x' };",
        )
        .unwrap();
        fs::write(
            comp_dir.join("button.stories.tsx"),
            "const variantClasses = { story: 'y' };",
        )
        .unwrap();

        let mut registry = ComponentRegistry::new();
        let count = registry.scan(&comp_dir).unwrap();

        assert_eq!(count, 0);
    }
}
