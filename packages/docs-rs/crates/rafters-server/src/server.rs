//! Development server implementation.

use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::Arc;

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use tokio::sync::RwLock;
use tower_http::services::ServeDir;

use rafters_adapters::{FrameworkAdapter, ReactAdapter, TransformContext};
use rafters_mdx::parse_mdx;

use crate::watcher::{FileWatcher, WatchEvent};
use crate::websocket::{hmr_client_script, HmrHub, HmrMessage};

/// Configuration for the development server.
#[derive(Debug, Clone)]
pub struct DevServerConfig {
    /// Directory containing docs
    pub docs_dir: PathBuf,

    /// Directory containing components
    pub components_dir: PathBuf,

    /// Port to listen on
    pub port: u16,

    /// Host to bind to
    pub host: String,

    /// Open browser on start
    pub open: bool,
}

impl Default for DevServerConfig {
    fn default() -> Self {
        Self {
            docs_dir: PathBuf::from("docs"),
            components_dir: PathBuf::from("src/components"),
            port: 7777,
            host: "127.0.0.1".to_string(),
            open: true,
        }
    }
}

/// Errors that can occur with the server.
#[derive(Debug, thiserror::Error)]
pub enum ServerError {
    #[error("Failed to bind to {0}: {1}")]
    BindError(SocketAddr, String),

    #[error("File watch error: {0}")]
    WatchError(String),

    #[error("Transform error: {0}")]
    TransformError(String),
}

/// Shared server state.
struct ServerState {
    config: DevServerConfig,
    hmr: HmrHub,
    adapter: ReactAdapter,
}

/// Development server.
pub struct DevServer {
    config: DevServerConfig,
}

impl DevServer {
    /// Create a new development server.
    pub fn new(config: DevServerConfig) -> Self {
        Self { config }
    }

    /// Start the development server.
    pub async fn start(self) -> Result<(), ServerError> {
        let addr: SocketAddr = format!("{}:{}", self.config.host, self.config.port)
            .parse()
            .expect("Invalid address");

        let state = Arc::new(RwLock::new(ServerState {
            config: self.config.clone(),
            hmr: HmrHub::new(),
            adapter: ReactAdapter::new(),
        }));

        // Set up file watcher
        let watch_paths = vec![
            self.config.docs_dir.clone(),
            self.config.components_dir.clone(),
        ];

        let (watcher, mut rx) =
            FileWatcher::new(&watch_paths).map_err(|e| ServerError::WatchError(e.to_string()))?;

        // Spawn file watch handler
        let state_clone = Arc::clone(&state);
        tokio::spawn(async move {
            while let Some(event) = rx.recv().await {
                handle_watch_event(&state_clone, event).await;
            }
            // Keep watcher alive
            drop(watcher);
        });

        // Build router
        let app = Router::new()
            .route("/", get(index_handler))
            .route("/__hmr", get(ws_handler))
            .route("/__hmr.js", get(hmr_script_handler))
            .nest_service("/docs", ServeDir::new(&self.config.docs_dir))
            .with_state(state);

        tracing::info!("Starting dev server at http://{}", addr);

        // Open browser if configured
        if self.config.open {
            let url = format!("http://{}", addr);
            let _ = open::that(&url);
        }

        // Start server
        let listener = tokio::net::TcpListener::bind(addr)
            .await
            .map_err(|e| ServerError::BindError(addr, e.to_string()))?;

        axum::serve(listener, app)
            .await
            .map_err(|e| ServerError::BindError(addr, e.to_string()))?;

        Ok(())
    }
}

/// Handle file watch events.
async fn handle_watch_event(state: &Arc<RwLock<ServerState>>, event: WatchEvent) {
    let state = state.read().await;

    match event {
        WatchEvent::MdxModified(path) => {
            tracing::info!("MDX modified: {}", path.display());

            // For now, just trigger a full reload
            // In a more sophisticated implementation, we'd re-render just the affected page
            state.hmr.send(HmrMessage::Reload);
        }

        WatchEvent::ComponentModified(path) => {
            tracing::info!("Component modified: {}", path.display());

            // Try to re-transform the component
            if let Ok(source) = std::fs::read_to_string(&path) {
                let tag_name = path
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .map(|s| format!("{}-preview", s.to_lowercase()))
                    .unwrap_or_else(|| "component-preview".to_string());

                match state
                    .adapter
                    .transform(&source, &tag_name, &TransformContext::default())
                {
                    Ok(result) => {
                        state.hmr.send(HmrMessage::UpdateComponent {
                            tag_name: result.tag_name,
                            web_component: result.web_component,
                        });
                    }
                    Err(e) => {
                        tracing::warn!("Failed to transform component: {}", e);
                        state.hmr.send(HmrMessage::Reload);
                    }
                }
            }
        }

        WatchEvent::Created(_) | WatchEvent::Deleted(_) | WatchEvent::Modified(_) => {
            // For other changes, trigger a reload
            state.hmr.send(HmrMessage::Reload);
        }
    }
}

/// Handler for the index page.
async fn index_handler(State(state): State<Arc<RwLock<ServerState>>>) -> impl IntoResponse {
    let state = state.read().await;

    // Find index.mdx
    let index_path = state.config.docs_dir.join("index.mdx");

    let content = if index_path.exists() {
        match std::fs::read_to_string(&index_path) {
            Ok(source) => match parse_mdx(&source) {
                Ok(doc) => {
                    let title = doc
                        .frontmatter
                        .as_ref()
                        .map(|f| f.title.clone())
                        .unwrap_or_else(|| "Documentation".to_string());

                    format!(
                        r#"<h1>{}</h1>
<div class="content">{}</div>"#,
                        title,
                        render_markdown(&doc.content)
                    )
                }
                Err(e) => format!("<p>Error parsing index.mdx: {}</p>", e),
            },
            Err(e) => format!("<p>Error reading index.mdx: {}</p>", e),
        }
    } else {
        "<h1>Welcome</h1><p>Create docs/index.mdx to get started.</p>".to_string()
    };

    Html(format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rafters Docs Dev</title>
  <style>
    body {{ font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }}
    h1 {{ font-size: 2rem; }}
    pre {{ background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }}
  </style>
</head>
<body>
  {}
  <script src="/__hmr.js"></script>
</body>
</html>"#,
        content
    ))
}

/// Handler for the HMR WebSocket endpoint.
async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<RwLock<ServerState>>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_ws(socket, state))
}

/// Handle a WebSocket connection.
async fn handle_ws(mut socket: WebSocket, state: Arc<RwLock<ServerState>>) {
    let mut rx = {
        let state = state.read().await;
        state.hmr.subscribe()
    };

    // Send connected message
    let msg = serde_json::to_string(&HmrMessage::Connected).unwrap();
    if socket.send(Message::Text(msg.into())).await.is_err() {
        return;
    }

    // Forward HMR messages to the client
    while let Ok(hmr_msg) = rx.recv().await {
        let json = serde_json::to_string(&hmr_msg).unwrap();
        if socket.send(Message::Text(json.into())).await.is_err() {
            break;
        }
    }
}

/// Handler for the HMR client script.
async fn hmr_script_handler() -> impl IntoResponse {
    let script = hmr_client_script("ws://127.0.0.1:7777/__hmr");
    ([("content-type", "application/javascript")], script)
}

/// Simple markdown to HTML renderer.
fn render_markdown(content: &str) -> String {
    use pulldown_cmark::{html, Options, Parser};

    let options = Options::ENABLE_TABLES | Options::ENABLE_STRIKETHROUGH;
    let parser = Parser::new_ext(content, options);

    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    html_output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_server_with_default_config() {
        let server = DevServer::new(DevServerConfig::default());
        assert_eq!(server.config.port, 7777);
    }

    #[test]
    fn renders_markdown() {
        let md = "# Hello\n\nWorld";
        let html = render_markdown(md);

        assert!(html.contains("<h1>Hello</h1>"));
        assert!(html.contains("<p>World</p>"));
    }
}
