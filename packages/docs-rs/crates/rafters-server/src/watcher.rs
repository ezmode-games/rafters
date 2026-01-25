//! File watching for hot reload.

use std::path::{Path, PathBuf};
use std::sync::mpsc;
use std::time::Duration;

use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use tokio::sync::mpsc as async_mpsc;

/// Events emitted by the file watcher.
#[derive(Debug, Clone)]
pub enum WatchEvent {
    /// MDX file was modified
    MdxModified(PathBuf),

    /// Component source was modified
    ComponentModified(PathBuf),

    /// File was created
    Created(PathBuf),

    /// File was deleted
    Deleted(PathBuf),

    /// Generic modification
    Modified(PathBuf),
}

/// File watcher for detecting changes.
pub struct FileWatcher {
    _watcher: RecommendedWatcher,
}

impl FileWatcher {
    /// Create a new file watcher for the given paths.
    ///
    /// Returns the watcher and a channel to receive events.
    pub fn new(
        paths: &[PathBuf],
    ) -> Result<(Self, async_mpsc::Receiver<WatchEvent>), std::io::Error> {
        let (sync_tx, sync_rx) = mpsc::channel();
        let (async_tx, async_rx) = async_mpsc::channel(100);

        // Create the watcher
        let mut watcher = notify::recommended_watcher(move |res: Result<notify::Event, _>| {
            if let Ok(event) = res {
                let _ = sync_tx.send(event);
            }
        })
        .map_err(std::io::Error::other)?;

        // Watch all paths
        for path in paths {
            if path.exists() {
                watcher
                    .watch(path, RecursiveMode::Recursive)
                    .map_err(std::io::Error::other)?;
            }
        }

        // Spawn a task to forward events
        let async_tx_clone = async_tx.clone();
        std::thread::spawn(move || {
            let mut last_event_time = std::time::Instant::now();
            let debounce_duration = Duration::from_millis(100);

            while let Ok(event) = sync_rx.recv() {
                // Debounce rapid events
                let now = std::time::Instant::now();
                if now.duration_since(last_event_time) < debounce_duration {
                    continue;
                }
                last_event_time = now;

                for path in event.paths {
                    let watch_event = classify_event(&path, &event.kind);
                    if let Some(e) = watch_event {
                        let _ = async_tx_clone.blocking_send(e);
                    }
                }
            }
        });

        Ok((Self { _watcher: watcher }, async_rx))
    }
}

/// Classify a notify event into a WatchEvent.
fn classify_event(path: &Path, kind: &notify::EventKind) -> Option<WatchEvent> {
    use notify::EventKind;

    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");

    match kind {
        EventKind::Create(_) => Some(WatchEvent::Created(path.to_path_buf())),
        EventKind::Remove(_) => Some(WatchEvent::Deleted(path.to_path_buf())),
        EventKind::Modify(_) => {
            if ext == "mdx" || ext == "md" {
                Some(WatchEvent::MdxModified(path.to_path_buf()))
            } else if ext == "tsx" || ext == "jsx" || ext == "ts" || ext == "js" {
                Some(WatchEvent::ComponentModified(path.to_path_buf()))
            } else {
                Some(WatchEvent::Modified(path.to_path_buf()))
            }
        }
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[tokio::test]
    async fn watches_file_changes() {
        let temp = tempdir().unwrap();
        let test_file = temp.path().join("test.mdx");

        // Create the watcher first (so it catches file creation)
        let (watcher, mut rx) = FileWatcher::new(&[temp.path().to_path_buf()]).unwrap();

        // Give inotify time to set up
        tokio::time::sleep(Duration::from_millis(100)).await;

        // Create a new file - this should trigger an event
        fs::write(&test_file, "# Created").unwrap();

        // Wait for event with timeout
        let event = tokio::time::timeout(Duration::from_secs(3), rx.recv()).await;

        // Keep watcher alive until we're done
        drop(watcher);

        // We should receive an event (create)
        assert!(event.is_ok(), "timeout waiting for file watch event");
        assert!(event.unwrap().is_some(), "channel should not be closed");
    }
}
