//! Development server with hot reload for rafters docs.
//!
//! Provides a fast development server with file watching and WebSocket-based
//! hot module replacement.

pub mod server;
pub mod watcher;
pub mod websocket;

pub use server::{DevServer, DevServerConfig, ServerError};
pub use watcher::{FileWatcher, WatchEvent};
pub use websocket::{HmrHub, HmrMessage};
