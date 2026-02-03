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

// CSS using Rafters design tokens
// Expects Rafters vars to be loaded (--background, --foreground, --primary, etc.)
const DEFAULT_CSS: &str = r#"/* Rafters Docs Theme - Uses Rafters Design Tokens */

/* Layout tokens */
:root {
  --sidebar-width: 280px;
  --toc-width: 200px;
  --content-max-width: 800px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
  background: var(--background);
  color: var(--foreground);
  line-height: 1.6;
}

.layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  background: var(--muted);
  border-right: 1px solid var(--border);
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
  color: var(--foreground);
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
  color: var(--muted-foreground);
  text-decoration: none;
  border-radius: var(--radius, 0.375rem);
  transition: background 0.15s, color 0.15s;
}

.nav-item a:hover {
  background: var(--accent);
  color: var(--accent-foreground);
}

.nav-item.active > a {
  background: var(--primary);
  color: var(--primary-foreground);
}

.nav-children {
  list-style: none;
  margin-left: 1rem;
  margin-top: 0.25rem;
}

/* Main content */
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

.content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--foreground);
}

.content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  color: var(--foreground);
}

.content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--foreground);
}

.content p {
  margin-bottom: 1rem;
  color: var(--foreground);
}

.content a {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.content a:hover {
  color: var(--primary-hover);
}

.content strong {
  font-weight: 600;
  color: var(--foreground);
}

/* Code blocks */
.content pre {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius, 0.5rem);
  padding: 1rem;
  overflow-x: auto;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  position: relative;
}

.content code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875em;
  background: var(--muted);
  color: var(--foreground);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.content pre code {
  background: none;
  padding: 0;
  color: var(--card-foreground);
}

/* Preview container for live components */
.preview-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius, 0.5rem);
  padding: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Copy button - uses Rafters button styling */
.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: none;
  border-radius: var(--radius, 0.375rem);
  cursor: pointer;
  transition: background 0.15s;
}

.copy-btn:hover {
  background: var(--secondary-hover);
}

.copy-btn:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Table of contents */
.toc {
  position: sticky;
  top: 2rem;
  align-self: start;
}

.toc h2 {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
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
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 0.15s;
}

.toc a:hover {
  color: var(--foreground);
}

.toc-level-2 {
  padding-left: 0;
}

.toc-level-3 {
  padding-left: 1rem;
}

.toc-level-4 {
  padding-left: 2rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    left: -100%;
    z-index: 50;
    transition: left 0.3s;
    width: var(--sidebar-width);
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

/* Menu button for mobile */
.menu-btn {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  padding: 0.5rem;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius, 0.375rem);
  cursor: pointer;
}

@media (max-width: 1024px) {
  .menu-btn {
    display: block;
  }
}
"#;

const DEFAULT_JS: &str = r#"// Rafters Docs - Runtime JavaScript
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
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
      link.parentElement.classList.add('active');
    }
  });

  // Copy code button for pre blocks
  document.querySelectorAll('.content pre').forEach(pre => {
    // Skip if already has a copy button
    if (pre.querySelector('.copy-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('type', 'button');

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.textContent : pre.textContent;

      try {
        await navigator.clipboard.writeText(text || '');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      } catch (err) {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    });

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
        assert!(css.contains("--background"));
        assert!(css.contains("--primary"));
    }

    #[test]
    fn generates_js() {
        let js = AssetPipeline::generate_js();
        assert!(js.contains("addEventListener"));
        assert!(js.contains("clipboard"));
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
