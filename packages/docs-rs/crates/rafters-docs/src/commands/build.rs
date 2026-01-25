//! Static site build command.

use std::path::PathBuf;

use anyhow::Result;
use rafters_static::{BuildConfig, StaticBuilder};

/// Run the build command.
pub async fn run(output: PathBuf, minify: bool) -> Result<()> {
    tracing::info!("Building static site...");

    let config = BuildConfig {
        output_dir: output,
        minify,
        ..Default::default()
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
