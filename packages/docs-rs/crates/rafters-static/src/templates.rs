//! Template engine for rendering documentation pages.

use minijinja::{context, Environment};

/// A navigation item.
#[derive(Debug, Clone, serde::Serialize)]
pub struct NavItem {
    /// Display title
    pub title: String,
    /// URL path
    pub path: String,
    /// Child items
    pub children: Vec<NavItem>,
    /// Whether this is the active page
    pub active: bool,
}

/// A table of contents entry.
#[derive(Debug, Clone, serde::Serialize)]
pub struct TocEntry {
    /// Heading text
    pub title: String,
    /// Anchor ID
    pub id: String,
    /// Heading level (1-6)
    pub level: u8,
}

/// Context for rendering a page template.
#[derive(Debug, Clone, serde::Serialize)]
pub struct Context {
    /// Page title
    pub title: String,
    /// Site title
    pub site_title: String,
    /// Rendered content HTML
    pub content: String,
    /// Navigation items
    pub nav: Vec<NavItem>,
    /// Table of contents
    pub toc: Vec<TocEntry>,
    /// Base URL
    pub base_url: String,
    /// Web Component scripts to include
    pub web_components: Vec<String>,
    /// Path to Rafters CSS (design tokens + Tailwind)
    pub rafters_css: Option<String>,
}

/// Template engine using minijinja.
pub struct TemplateEngine {
    env: Environment<'static>,
}

impl TemplateEngine {
    /// Create a new template engine with default templates.
    pub fn new() -> Self {
        let mut env = Environment::new();

        // Add base template
        env.add_template_owned("base.html".to_string(), BASE_TEMPLATE.to_string())
            .expect("Failed to add base template");

        // Add doc template
        env.add_template_owned("doc.html".to_string(), DOC_TEMPLATE.to_string())
            .expect("Failed to add doc template");

        // Add nav template
        env.add_template_owned("nav.html".to_string(), NAV_TEMPLATE.to_string())
            .expect("Failed to add nav template");

        Self { env }
    }

    /// Render a page using the specified template.
    pub fn render_page(
        &self,
        template: &str,
        context: &Context,
    ) -> Result<String, minijinja::Error> {
        let tmpl = self.env.get_template(template)?;

        tmpl.render(context! {
            title => &context.title,
            site_title => &context.site_title,
            content => &context.content,
            nav => &context.nav,
            toc => &context.toc,
            base_url => &context.base_url,
            web_components => &context.web_components,
            rafters_css => &context.rafters_css,
        })
    }
}

impl Default for TemplateEngine {
    fn default() -> Self {
        Self::new()
    }
}

const BASE_TEMPLATE: &str = r##"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }} - {{ site_title }}</title>
  {% if rafters_css %}<link rel="stylesheet" href="{{ rafters_css }}">{% endif %}
  <link rel="stylesheet" href="{{ base_url }}assets/main.css">
</head>
<body>
  <div class="layout">
    <nav class="sidebar">
      {% include "nav.html" %}
    </nav>
    <main class="main">
      {% block content %}{% endblock %}
    </main>
  </div>
  <script src="{{ base_url }}assets/main.js"></script>
  {% for wc in web_components %}
  <script type="module">{{ wc | safe }}</script>
  {% endfor %}
</body>
</html>"##;

const DOC_TEMPLATE: &str = r##"{% extends "base.html" %}

{% block content %}
<article class="doc">
  <div class="content">
    {{ content | safe }}
  </div>
</article>

{% if toc %}
<aside class="toc">
  <h2>On this page</h2>
  <ul>
  {% for entry in toc %}
    <li class="toc-level-{{ entry.level }}">
      <a href="#{{ entry.id }}">{{ entry.title }}</a>
    </li>
  {% endfor %}
  </ul>
</aside>
{% endif %}
{% endblock %}"##;

const NAV_TEMPLATE: &str = r##"<div class="nav-header">
  <a href="{{ base_url }}" class="nav-logo">{{ site_title }}</a>
</div>
<ul class="nav-list">
{% for item in nav %}
  <li class="nav-item{% if item.active %} active{% endif %}">
    <a href="{{ item.path }}">{{ item.title }}</a>
    {% if item.children %}
    <ul class="nav-children">
      {% for child in item.children %}
      <li class="nav-item{% if child.active %} active{% endif %}">
        <a href="{{ child.path }}">{{ child.title }}</a>
      </li>
      {% endfor %}
    </ul>
    {% endif %}
  </li>
{% endfor %}
</ul>"##;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn renders_basic_page() {
        let engine = TemplateEngine::new();

        let context = Context {
            title: "Button".to_string(),
            site_title: "My Docs".to_string(),
            content: "<p>Hello world</p>".to_string(),
            nav: vec![],
            toc: vec![],
            base_url: "/".to_string(),
            web_components: vec![],
            rafters_css: None,
        };

        let html = engine.render_page("doc.html", &context).unwrap();

        assert!(html.contains("<title>Button - My Docs</title>"));
        assert!(html.contains("<p>Hello world</p>"));
    }

    #[test]
    fn renders_navigation() {
        let engine = TemplateEngine::new();

        let context = Context {
            title: "Home".to_string(),
            site_title: "Docs".to_string(),
            content: "".to_string(),
            nav: vec![
                NavItem {
                    title: "Home".to_string(),
                    path: "/".to_string(),
                    children: vec![],
                    active: true,
                },
                NavItem {
                    title: "Components".to_string(),
                    path: "/components/".to_string(),
                    children: vec![NavItem {
                        title: "Button".to_string(),
                        path: "/components/button/".to_string(),
                        children: vec![],
                        active: false,
                    }],
                    active: false,
                },
            ],
            toc: vec![],
            base_url: "/".to_string(),
            web_components: vec![],
            rafters_css: None,
        };

        let html = engine.render_page("doc.html", &context).unwrap();

        assert!(html.contains("Home"));
        assert!(html.contains("Components"));
        assert!(html.contains("Button"));
    }

    #[test]
    fn includes_web_components() {
        let engine = TemplateEngine::new();

        let context = Context {
            title: "Test".to_string(),
            site_title: "Docs".to_string(),
            content: "".to_string(),
            nav: vec![],
            toc: vec![],
            base_url: "/".to_string(),
            web_components: vec!["class MyButton extends HTMLElement {}".to_string()],
            rafters_css: None,
        };

        let html = engine.render_page("doc.html", &context).unwrap();

        assert!(html.contains("class MyButton extends HTMLElement"));
    }
}
