//! Asset pipeline for CSS and JavaScript processing.

/// Asset pipeline utilities.
pub struct AssetPipeline;

impl AssetPipeline {
    /// Generate the main CSS file.
    pub fn generate_css() -> String {
        DEFAULT_CSS.to_string()
    }

    /// Generate the main JavaScript file.
    pub fn generate_js() -> String {
        DEFAULT_JS.to_string()
    }

    /// Minify CSS using lightningcss.
    pub fn minify_css(css: &str) -> Result<String, String> {
        use lightningcss::stylesheet::{ParserOptions, PrinterOptions, StyleSheet};

        let stylesheet = StyleSheet::parse(css, ParserOptions::default())
            .map_err(|e| format!("CSS parse error: {}", e))?;

        let minified = stylesheet
            .to_css(PrinterOptions {
                minify: true,
                ..Default::default()
            })
            .map_err(|e| format!("CSS minify error: {}", e))?;

        Ok(minified.code)
    }
}

const DEFAULT_CSS: &str = r#"/* Rafters Docs - Generated Styles */
:root {
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;

  --sidebar-width: 280px;
  --toc-width: 200px;
  --content-max-width: 800px;

  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-bg-secondary: #1f2937;
    --color-text: #f9fafb;
    --color-text-secondary: #9ca3af;
    --color-border: #374151;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

.layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  padding: 1.5rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.nav-header {
  margin-bottom: 1.5rem;
}

.nav-logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-text);
  text-decoration: none;
}

.nav-list {
  list-style: none;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-item a {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background 0.15s, color 0.15s;
}

.nav-item a:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.nav-item.active > a {
  background: var(--color-primary);
  color: white;
}

.nav-children {
  list-style: none;
  margin-left: 1rem;
  margin-top: 0.25rem;
}

.main {
  display: grid;
  grid-template-columns: 1fr var(--toc-width);
  gap: 2rem;
  padding: 2rem;
  max-width: calc(var(--content-max-width) + var(--toc-width) + 4rem);
}

.doc {
  max-width: var(--content-max-width);
}

.doc header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
}

.content p {
  margin-bottom: 1rem;
}

.content pre {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.content code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-bg-secondary);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.content pre code {
  background: none;
  padding: 0;
}

.preview {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.toc {
  position: sticky;
  top: 2rem;
  align-self: start;
}

.toc h2 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.toc ul {
  list-style: none;
}

.toc li {
  margin-bottom: 0.25rem;
}

.toc a {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
}

.toc a:hover {
  color: var(--color-text);
}

.toc-level-3 {
  padding-left: 1rem;
}

.toc-level-4 {
  padding-left: 2rem;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    left: -100%;
    z-index: 50;
    transition: left 0.3s;
  }

  .sidebar.open {
    left: 0;
  }

  .main {
    grid-template-columns: 1fr;
  }

  .toc {
    display: none;
  }
}
"#;

const DEFAULT_JS: &str = r#"// Rafters Docs - Generated JavaScript
(function() {
  'use strict';

  // Mobile menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.querySelector('.sidebar');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Highlight current nav item
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-item a');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.parentElement.classList.add('active');
    }
  });

  // Copy code button
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.textContent || '');
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
})();
"#;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generates_css() {
        let css = AssetPipeline::generate_css();
        assert!(css.contains(":root"));
        assert!(css.contains("--color-bg"));
    }

    #[test]
    fn generates_js() {
        let js = AssetPipeline::generate_js();
        assert!(js.contains("addEventListener"));
    }

    #[test]
    fn minifies_css() {
        let css = r#"
.button {
    background-color: blue;
    padding: 10px;
}
        "#;

        let minified = AssetPipeline::minify_css(css).unwrap();

        assert!(!minified.contains('\n'));
        assert!(minified.contains(".button"));
    }
}
