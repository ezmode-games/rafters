# MDX Layout System Guide

## Overview

The MDX layout system for Rafters Storybook documentation provides a systematic approach to creating well-designed, consistent documentation pages without manual layout concerns.

## Core Philosophy

Following the Container component's philosophy:
- **`mx-auto` for centering** - Automatic horizontal centering of content
- **Padding for spacing** - Internal content spacing through padding, never margins
- **Semantic HTML** - Proper document structure for accessibility
- **Design tokens** - Consistent spacing and typography using the design system

## Automatic Layout Features

### 1. Default MDX Element Styling

All standard MDX elements are automatically styled with proper centering and max-widths:

```mdx
# This heading is automatically centered with max-w-5xl mx-auto

This paragraph is automatically centered with max-w-prose mx-auto for optimal reading.

## Section headings are centered with max-w-4xl mx-auto

- Lists are automatically centered
- With proper spacing and max-width
- No manual classes needed
```

### 2. Content Containers

The system automatically wraps all MDX content in a Container component with:
- `size="5xl"` - Appropriate documentation width
- `padding="8"` - Comfortable breathing room
- `as="article"` - Semantic HTML for accessibility

## Available MDX Components

### MDXSection
For major content sections with their own container context:

```mdx
<MDXSection size="4xl" padding="6">
  Content that needs its own section container
</MDXSection>
```

### MDXContent
For content blocks that need specific max-width and centering:

```mdx
<MDXContent maxWidth="prose" center>
  Optimally sized content for reading
</MDXContent>
```

### MDXGrid
For multi-column layouts:

```mdx
<MDXGrid cols={3} gap="md">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</MDXGrid>
```

### MDXCard
For highlighted content blocks:

```mdx
<MDXCard variant="elevated">
  Important callout or feature highlight
</MDXCard>
```

### MDXHero
For documentation hero sections:

```mdx
<MDXHero gradient>
  <h1>Hero Title</h1>
  <p>Hero description text</p>
</MDXHero>
```

## Utility Classes

Additional utility classes are available for specific needs:

### Content Width Classes
- `doc-content-sm` through `doc-content-5xl` - Various max-widths with auto centering
- `doc-content-prose` - Optimal reading width with auto centering

### Grid Classes
- `doc-grid-2`, `doc-grid-3`, `doc-grid-4` - Responsive grid layouts

### Card Classes
- `doc-card` - Basic card styling
- `doc-card-hover` - Card with hover effects

### Section Classes
- `doc-section` - Standard section spacing
- `doc-section-muted` - Section with muted background

## Migration Guide

### Before (Manual Layout)
```mdx
<div className="max-w-4xl mx-auto px-6">
  <h1 className="text-center mb-4">Title</h1>
  <p className="text-center">Description</p>
</div>
```

### After (Automatic Layout)
```mdx
# Title

Description
```

The system automatically handles:
- Centering with `mx-auto`
- Appropriate max-widths
- Consistent spacing
- Semantic typography

## Best Practices

1. **Let the system handle layout** - Don't add manual `mx-auto` or max-width classes
2. **Use semantic HTML** - The system enhances standard HTML elements
3. **Leverage MDX components** - Use provided components for complex layouts
4. **Follow Container philosophy** - Padding for spacing, mx-auto for centering

## Examples

### Simple Documentation Page
```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Category/Page" />

# Page Title

Introduction paragraph automatically centered and sized.

## Section Title

Section content with proper spacing and width.

- Bullet points
- Automatically formatted
- With consistent spacing
```

### Complex Layout with Components
```mdx
import { Meta } from '@storybook/addon-docs/blocks';
import { MDXHero, MDXGrid, MDXCard } from '../.storybook/mdx-components';

<Meta title="Category/Page" />

<MDXHero gradient>
  <h1>Hero Section</h1>
  <p>Automatically centered hero content</p>
</MDXHero>

<MDXSection>
  <h2>Features</h2>
  
  <MDXGrid cols={3} gap="md">
    <MDXCard variant="elevated">
      Feature 1
    </MDXCard>
    <MDXCard variant="elevated">
      Feature 2
    </MDXCard>
    <MDXCard variant="elevated">
      Feature 3
    </MDXCard>
  </MDXGrid>
</MDXSection>
```

## Troubleshooting

### Content Not Centering
- Ensure you're not overriding with manual classes
- Check that Storybook preview.ts includes the MDX components configuration

### Custom Width Needed
- Use `MDXContent` component with specific `maxWidth` prop
- Or use utility classes like `doc-content-3xl`

### Section Spacing Issues
- Use `MDXSection` component for major sections
- Apply `doc-section` class for consistent spacing

## Summary

The MDX layout system eliminates the need for manual layout management in documentation:
- Automatic centering with `mx-auto`
- Intelligent max-widths for readability
- Consistent spacing using design tokens
- Semantic HTML for accessibility
- Container component philosophy throughout

This ensures all documentation pages are well-designed, consistent, and maintainable without manual layout work.