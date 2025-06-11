# Rafters Component Library

## Grayscale Foundation Components
*Every component, every state, every variant - in simple gray*

Use radix for all primatives

### 🎯 Form Components
Essential for the Rafters setup interface and user projects.

- **Button** - primary, secondary, destructive, outline, ghost, link
- **Input** - text, email, password, number, search
- **Textarea** - multi-line text input with resize options
- **Select** - dropdown selection with search and multi-select
- **Checkbox** - single and group selections
- **Radio Group** - mutually exclusive options
- **Switch** - boolean toggle states
- **Slider** - range selection (perfect for Rafters' design controls)
- **Label** - accessible form labeling
- **Form** - form container with validation states

### 🧭 Navigation Components
For Rafters' interface and user project navigation.

- **Tabs** - horizontal and vertical tab navigation
- **Breadcrumb** - hierarchical navigation trail
- **Pagination** - data set navigation
- **Menu** - dropdown and context menus
- **Menubar** - horizontal menu navigation
- **Navigation Menu** - complex navigation structures
- **Command** - command palette (great for Rafters' component search)

### 📢 Feedback Components
User communication and status indication.

- **Alert** - info, warning, error, success messages
- **Toast** - temporary notifications
- **Dialog** - modal dialogs and confirmations
- **Popover** - contextual information overlays
- **Tooltip** - hover information
- **Progress** - loading and completion indicators
- **Skeleton** - loading state placeholders
- **Sonner** - modern toast notifications

### 📊 Data Display Components
Showcasing information and content.

- **Card** - content containers (perfect for component previews)
- **Table** - data tables with sorting and selection
- **Badge** - status and category indicators
- **Avatar** - user and entity representation
- **Calendar** - date selection and display
- **Carousel** - content slides and galleries
- **Chart** - data visualization (for design system metrics)

### 🎨 Layout Components
Structure and organization.

- **Container** - content width and centering
- **Separator** - visual content division
- **Accordion** - collapsible content sections
- **Collapsible** - expandable content areas
- **Resizable** - user-adjustable layout panels
- **Scroll Area** - custom scrollbar styling
- **Sheet** - slide-out panels and sidebars

### 🎭 Specialized Components
Advanced functionality for rich interfaces.

- **Aspect Ratio** - responsive media containers
- **Hover Card** - rich hover interactions
- **Context Menu** - right-click interactions
- **Drawer** - mobile-friendly slide panels
- **Combobox** - searchable select input
- **Date Picker** - calendar-based date selection
- **Toggle** - state switching controls
- **Toggle Group** - mutually exclusive toggles

## Implementation Priority

### Phase 1: Core Foundation (Week 1)
*Essential for Rafters app itself*

1. **Button** - primary interaction element
2. **Input** - color pickers, text inputs
3. **Select** - font selection, option choosing
4. **Slider** - design system value controls
5. **Card** - component preview containers
6. **Label** - accessible form controls
7. **Tabs** - organize setup sections

### Phase 2: Enhanced Interface (Week 2)
*Rich Rafters experience*

1. **Dialog** - confirmation modals
2. **Toast** - feedback notifications
3. **Progress** - setup completion indication
4. **Tooltip** - interface guidance
5. **Popover** - contextual help
6. **Command** - component search
7. **Separator** - section division

### Phase 3: Advanced Features (Week 3)
*Professional polish*

1. **Table** - design token overview
2. **Calendar** - project timeline
3. **Accordion** - organized settings
4. **Scroll Area** - component library browsing
5. **Sheet** - detailed configuration panels
6. **Badge** - status and category tags
7. **Avatar** - user representation

### Phase 4: Specialized Tools (Week 4)
*Power user features*

1. **Resizable** - layout customization
2. **Chart** - design system analytics
3. **Date Picker** - project planning
4. **Carousel** - component showcases
5. **Hover Card** - rich component info
6. **Context Menu** - advanced actions
7. **Combobox** - advanced search

## Dogfooding Strategy

### Rafters App Uses Rafters Components
- **Setup Interface**: Sliders, color pickers, selects built with our own components
- **Component Preview**: Cards, tabs, and layout components showcase themselves
- **Documentation**: Tables, accordions, and tooltips explain the system
- **Export/Import**: Forms, dialogs, and progress indicators for system management

### Validation Benefits
- **Real-world Testing**: Every component gets used in production
- **Design Consistency**: Rafters interface demonstrates the system quality
- **User Confidence**: "If it's good enough for Rafters, it's good enough for my project"
- **Continuous Improvement**: Daily use reveals edge cases and improvements

### Component Showcase
Each component in the Rafters interface becomes a live demo:
- Users see the component in action
- Immediate understanding of capabilities
- Natural learning through interaction
- Built-in documentation through usage

## Technical Implementation

### Grayscale Foundation
```tsx
// Every component starts completely unstyled
export function Button({ variant, size, ...props }) {
  return (
    <button
      className={cn(
        // Base functionality only - no visual opinions
        'inline-flex items-center justify-center',
        'focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        // Variants applied through design tokens
        variant && `button--${variant}`,
        size && `button--${size}`
      )}
      {...props}
    />
  )
}
```

### Token Integration
```css
/* Generated from user's Rafters setup */
.button--primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-radius: var(--radius-base);
  padding: var(--spacing-button-y) var(--spacing-button-x);
}

.button--secondary {
  background: var(--color-secondary);
  color: var(--color-secondary-foreground);
  border: 1px solid var(--color-border);
}
```

This approach gives us:
- **Complete Foundation**: Every component type covered
- **Systematic Organization**: Logical grouping and prioritization  
- **Dogfooding Validation**: Rafters uses what it builds
- **Progressive Enhancement**: Start simple, add sophistication
- **AI-Friendly Structure**: Predictable patterns and consistent naming