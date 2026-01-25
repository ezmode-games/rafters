//! Static site build command.

use std::fs;
use std::path::PathBuf;

use anyhow::Result;
use rafters_static::{BuildConfig, StaticBuilder};
use serde::Deserialize;

/// Configuration file structure (docs.toml).
#[derive(Debug, Deserialize, Default)]
struct ConfigFile {
    #[serde(default)]
    docs: DocsConfig,
    #[serde(default)]
    components: ComponentsConfig,
    #[serde(default)]
    build: BuildSettings,
}

#[derive(Debug, Deserialize, Default)]
struct DocsConfig {
    #[serde(default = "default_docs_dir")]
    dir: String,
    #[serde(default = "default_output")]
    output: String,
    #[serde(default = "default_title")]
    title: String,
    #[serde(default = "default_base_url")]
    base_url: String,
}

#[derive(Debug, Deserialize, Default)]
struct ComponentsConfig {
    dir: Option<String>,
}

#[derive(Debug, Deserialize, Default)]
struct BuildSettings {
    #[serde(default = "default_minify")]
    minify: bool,
}

fn default_docs_dir() -> String {
    "docs".to_string()
}
fn default_output() -> String {
    "dist".to_string()
}
fn default_title() -> String {
    "Documentation".to_string()
}
fn default_base_url() -> String {
    "/".to_string()
}
fn default_minify() -> bool {
    true
}

/// Load configuration from docs.toml if it exists.
fn load_config() -> ConfigFile {
    let config_path = PathBuf::from("docs.toml");
    if config_path.exists() {
        match fs::read_to_string(&config_path) {
            Ok(content) => match toml::from_str(&content) {
                Ok(config) => {
                    tracing::info!("Loaded config from docs.toml");
                    return config;
                }
                Err(e) => {
                    tracing::warn!("Failed to parse docs.toml: {}", e);
                }
            },
            Err(e) => {
                tracing::warn!("Failed to read docs.toml: {}", e);
            }
        }
    }
    ConfigFile::default()
}

/// Run the build command.
pub async fn run(output: Option<PathBuf>, minify: Option<bool>) -> Result<()> {
    tracing::info!("Building static site...");

    let file_config = load_config();

    let config = BuildConfig {
        docs_dir: PathBuf::from(&file_config.docs.dir),
        output_dir: output.unwrap_or_else(|| PathBuf::from(&file_config.docs.output)),
        components_dir: file_config.components.dir.map(PathBuf::from),
        minify: minify.unwrap_or(file_config.build.minify),
        base_url: file_config.docs.base_url,
        title: file_config.docs.title,
    };

    let result = StaticBuilder::new(config).build().await?;

    tracing::info!(
        "Built {} pages with {} components in {}ms",
        result.pages,
        result.components,
        result.duration_ms
    );

    tracing::info!("Output: {}", result.output_dir.display());

    Ok(())
}
