//! Preview server command.

use std::net::SocketAddr;
use std::path::PathBuf;

use anyhow::{Context, Result};
use axum::Router;
use tower_http::services::ServeDir;

/// Run the serve command.
pub async fn run(port: u16, dir: PathBuf) -> Result<()> {
    if !dir.exists() {
        anyhow::bail!(
            "Directory not found: {}. Run 'rafters-docs build' first.",
            dir.display()
        );
    }

    let addr: SocketAddr = format!("127.0.0.1:{}", port)
        .parse()
        .context("Invalid address")?;

    tracing::info!("Serving {} at http://{}", dir.display(), addr);

    let app = Router::new().fallback_service(ServeDir::new(&dir));

    let listener = tokio::net::TcpListener::bind(addr).await?;

    // Open browser
    let url = format!("http://{}", addr);
    let _ = open::that(&url);

    axum::serve(listener, app).await?;

    Ok(())
}
