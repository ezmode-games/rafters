//! WebSocket-based hot module replacement.

use serde::{Deserialize, Serialize};
use tokio::sync::broadcast;

/// Messages sent to clients for hot reload.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum HmrMessage {
    /// Full page reload
    Reload,

    /// Update a specific component preview
    UpdateComponent {
        /// Custom element tag name
        tag_name: String,
        /// New Web Component code
        web_component: String,
    },

    /// Update page content
    UpdateContent {
        /// Page path
        path: String,
        /// New HTML content
        html: String,
    },

    /// Connection established
    Connected,
}

/// Hub for broadcasting HMR messages to all connected clients.
#[derive(Debug, Clone)]
pub struct HmrHub {
    sender: broadcast::Sender<HmrMessage>,
}

impl HmrHub {
    /// Create a new HMR hub.
    pub fn new() -> Self {
        let (sender, _) = broadcast::channel(100);
        Self { sender }
    }

    /// Send a message to all connected clients.
    pub fn send(&self, msg: HmrMessage) {
        // Ignore send errors (no receivers)
        let _ = self.sender.send(msg);
    }

    /// Subscribe to HMR messages.
    pub fn subscribe(&self) -> broadcast::Receiver<HmrMessage> {
        self.sender.subscribe()
    }

    /// Get the number of active subscribers.
    pub fn subscriber_count(&self) -> usize {
        self.sender.receiver_count()
    }
}

impl Default for HmrHub {
    fn default() -> Self {
        Self::new()
    }
}

/// Generate the client-side HMR script.
///
/// # Security Note
///
/// This script dynamically executes Web Component code for hot module replacement.
/// This is a DEVELOPMENT-ONLY feature where:
/// - Code comes exclusively from the local dev server (localhost)
/// - The dev server only serves code from the user's own project
/// - This pattern is standard in dev tools (Vite, Webpack, Parcel, etc.)
/// - Production builds do NOT include this script
pub fn hmr_client_script(ws_url: &str) -> String {
    format!(
        r#"
(function() {{
  'use strict';

  const ws = new WebSocket('{}');
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;

  ws.onopen = function() {{
    console.log('[HMR] Connected');
    reconnectAttempts = 0;
  }};

  ws.onmessage = function(event) {{
    const msg = JSON.parse(event.data);
    console.log('[HMR]', msg.type);

    switch (msg.type) {{
      case 'reload':
        location.reload();
        break;

      case 'update_component':
        try {{
          // SECURITY: This executes code from the LOCAL dev server only.
          // This is standard HMR practice (see Vite, Webpack HMR).
          // Production builds do not include this script.
          const script = document.createElement('script');
          script.type = 'module';
          script.textContent = msg.web_component;
          document.head.appendChild(script);
          
          // Force re-render of existing instances
          document.querySelectorAll(msg.tag_name).forEach(function(el) {{
            if (el.connectedCallback) {{
              el.connectedCallback();
            }}
          }});
        }} catch (e) {{
          console.error('[HMR] Failed to update component:', e);
          location.reload();
        }}
        break;

      case 'update_content':
        const article = document.querySelector('article');
        if (article) {{
          article.innerHTML = msg.html;
        }} else {{
          location.reload();
        }}
        break;

      case 'connected':
        console.log('[HMR] Server acknowledged connection');
        break;
    }}
  }};

  ws.onclose = function() {{
    console.log('[HMR] Disconnected');
    if (reconnectAttempts < maxReconnectAttempts) {{
      reconnectAttempts++;
      setTimeout(function() {{
        console.log('[HMR] Reconnecting...');
        location.reload();
      }}, 1000 * reconnectAttempts);
    }}
  }};

  ws.onerror = function(e) {{
    console.error('[HMR] WebSocket error:', e);
  }};
}})();
"#,
        ws_url
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hub_broadcasts_messages() {
        let hub = HmrHub::new();
        let mut rx = hub.subscribe();

        hub.send(HmrMessage::Reload);

        // Try to receive (non-blocking for test)
        match rx.try_recv() {
            Ok(HmrMessage::Reload) => {}
            _ => panic!("Expected Reload message"),
        }
    }

    #[test]
    fn serializes_messages() {
        let msg = HmrMessage::UpdateComponent {
            tag_name: "my-button".to_string(),
            web_component: "class MyButton {}".to_string(),
        };

        let json = serde_json::to_string(&msg).unwrap();

        assert!(json.contains("update_component"));
        assert!(json.contains("my-button"));
    }
}
