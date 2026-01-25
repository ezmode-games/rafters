//! Web Component code generator.

use crate::react::ComponentStructure;

/// Generate a Web Component class from the extracted component structure.
/// Uses adoptedStyleSheets to inherit page-level Tailwind CSS.
pub fn generate_web_component(tag_name: &str, structure: &ComponentStructure) -> String {
    let class_name = to_pascal_case(tag_name);

    let variant_entries: String = structure
        .variant_lookup
        .iter()
        .map(|(k, v)| format!("  {}: '{}',", k, escape_string(v)))
        .collect::<Vec<_>>()
        .join("\n");

    let size_entries: String = structure
        .size_lookup
        .iter()
        .map(|(k, v)| format!("  {}: '{}',", k, escape_string(v)))
        .collect::<Vec<_>>()
        .join("\n");

    let attrs_array: String = structure
        .observed_attributes
        .iter()
        .map(|a| format!("'{}'", a))
        .collect::<Vec<_>>()
        .join(", ");

    let default_variant = &structure.default_variant;
    let default_size = &structure.default_size;
    let base_classes = escape_string(&structure.base_classes);
    let disabled_classes = escape_string(&structure.disabled_classes);

    format!(
        r#"/**
 * {class_name} - Generated Web Component Preview
 * Auto-generated from {name} component
 * Tag: <{tag_name}>
 */

const variantClasses = {{
{variant_entries}
}};

const sizeClasses = {{
{size_entries}
}};

const baseClasses = '{base_classes}';
const disabledClasses = '{disabled_classes}';

// Cache for adopted stylesheets (all page stylesheets)
let cachedSheets = null;

export class {class_name} extends HTMLElement {{
  static observedAttributes = [{attrs_array}];

  #button = null;

  constructor() {{
    super();
    this.attachShadow({{ mode: 'open' }});
  }}

  connectedCallback() {{
    this.#adoptStyles();
    this.#render();
  }}

  attributeChangedCallback() {{
    this.#render();
  }}

  #adoptStyles() {{
    if (!this.shadowRoot) return;

    // Use cached sheets if available
    if (cachedSheets) {{
      this.shadowRoot.adoptedStyleSheets = cachedSheets;
      return;
    }}

    // Find and adopt page stylesheets
    const sheets = [];
    for (const sheet of document.styleSheets) {{
      try {{
        // Clone the stylesheet for adoption
        const clone = new CSSStyleSheet();
        const rules = Array.from(sheet.cssRules).map(r => r.cssText).join('\\n');
        clone.replaceSync(rules);
        sheets.push(clone);
      }} catch (e) {{
        // Cross-origin stylesheets can't be accessed, skip them
      }}
    }}

    if (sheets.length > 0) {{
      cachedSheets = sheets; // Cache all sheets
      this.shadowRoot.adoptedStyleSheets = sheets;
    }}
  }}

  #render() {{
    if (!this.shadowRoot) return;

    const variant = this.getAttribute('variant') || '{default_variant}';
    const size = this.getAttribute('size') || '{default_size}';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');

    const isDisabled = disabled || loading;

    const classes = [
      baseClasses,
      variantClasses[variant] ?? variantClasses['{default_variant}'],
      sizeClasses[size] ?? sizeClasses['{default_size}'],
      isDisabled ? disabledClasses : '',
    ]
      .filter(Boolean)
      .join(' ');

    // Clear existing button if any
    if (this.#button) {{
      this.#button.remove();
    }}

    this.#button = document.createElement('button');
    this.#button.type = 'button';
    this.#button.className = classes;
    this.#button.disabled = isDisabled;

    if (isDisabled) {{
      this.#button.setAttribute('aria-disabled', 'true');
    }}
    if (loading) {{
      this.#button.setAttribute('aria-busy', 'true');
    }}

    if (loading) {{
      const span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = 'Loading...';
      this.#button.appendChild(span);
    }} else {{
      // Use slot for content
      const slot = document.createElement('slot');
      this.#button.appendChild(slot);
    }}

    this.shadowRoot.appendChild(this.#button);
  }}
}}

// Register the custom element
if (typeof customElements !== 'undefined') {{
  customElements.define('{tag_name}', {class_name});
}}

export default {class_name};
"#,
        class_name = class_name,
        name = structure.name,
        tag_name = tag_name,
        variant_entries = variant_entries,
        size_entries = size_entries,
        base_classes = base_classes,
        disabled_classes = disabled_classes,
        attrs_array = attrs_array,
        default_variant = default_variant,
        default_size = default_size,
    )
}

/// Convert kebab-case to PascalCase.
fn to_pascal_case(s: &str) -> String {
    s.split('-')
        .map(|part| {
            let mut chars = part.chars();
            match chars.next() {
                Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
                None => String::new(),
            }
        })
        .collect()
}

/// Escape a string for JavaScript output.
fn escape_string(s: &str) -> String {
    s.replace('\\', "\\\\")
        .replace('\'', "\\'")
        .replace('\n', "\\n")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn to_pascal_case_works() {
        assert_eq!(to_pascal_case("button-preview"), "ButtonPreview");
        assert_eq!(to_pascal_case("my-component"), "MyComponent");
        assert_eq!(to_pascal_case("simple"), "Simple");
    }

    #[test]
    fn escape_string_works() {
        assert_eq!(escape_string("hello"), "hello");
        assert_eq!(escape_string("it's"), "it\\'s");
        assert_eq!(escape_string("line1\nline2"), "line1\\nline2");
    }

    #[test]
    fn generates_valid_web_component() {
        let structure = ComponentStructure {
            name: "Button".to_string(),
            variant_lookup: vec![
                (
                    "primary".to_string(),
                    "bg-primary text-primary-foreground".to_string(),
                ),
                (
                    "secondary".to_string(),
                    "bg-secondary text-secondary-foreground".to_string(),
                ),
            ],
            size_lookup: vec![
                ("sm".to_string(), "h-8 px-3".to_string()),
                ("md".to_string(), "h-10 px-4".to_string()),
            ],
            base_classes: "inline-flex items-center".to_string(),
            disabled_classes: "opacity-50".to_string(),
            default_variant: "primary".to_string(),
            default_size: "md".to_string(),
            observed_attributes: vec!["variant".to_string(), "size".to_string()],
        };

        let output = generate_web_component("my-button", &structure);

        assert!(output.contains("class MyButton extends HTMLElement"));
        assert!(output.contains("static observedAttributes"));
        assert!(output.contains("customElements.define('my-button'"));
        assert!(output.contains("bg-primary"));
        assert!(output.contains("adoptedStyleSheets"));
    }
}
