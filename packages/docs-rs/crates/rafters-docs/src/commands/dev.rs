//! Development server command.

use anyhow::Result;
use rafters_server::{DevServer, DevServerConfig};

/// Run the dev server.
pub async fn run(port: u16, open: bool) -> Result<()> {
    tracing::info!("Starting development server on port {}", port);

    let config = DevServerConfig {
        port,
        open,
        ..Default::default()
    };

    DevServer::new(config).start().await?;

    Ok(())
}
