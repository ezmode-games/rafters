# Rafters
## React Components Built with Design Master Intelligence

*Beautiful, accessible, intelligent React components that embody the design mastery of Jony Ive and Nielsen Norman Group*

---

## Features

### 🧠 **Design Intelligence**
- **Semantic-First**: Every component communicates meaning before aesthetics
- **Cognitive Load Optimization**: Minimize mental overhead while maintaining functionality
- **Attention Economics**: Visual hierarchy matches functional importance

### ♿ **Accessibility Foundation**
- **WCAG AAA Compliance**: Beyond minimum requirements
- **Universal Design**: Works for motor, visual, cognitive, and auditory needs
- **Real-world Testing**: Validated with assistive technologies

### 🎨 **Systematic Design**
- **OKLCH Color Intelligence**: Perceptually uniform color systems
- **Mathematical Typography**: Scales with precision and purpose
- **Gestalt Principles**: Layouts that guide natural eye flow

---

## Installation

```bash
pnpm add rafters
# or
npm install rafters
# or
yarn add rafters
```

## Quick Start

```tsx
import { Button, Card, Input } from 'rafters'

function App() {
  return (
    <Card>
      <Input placeholder="Enter your email" />
      <Button intent="primary">Sign Up</Button>
    </Card>
  )
}
```

## Component Development

### Current Status
**Phase 1 Complete**: Core foundation components (Button, Input, Card, Select, Label, Slider, Tabs) with design intelligence patterns implemented.

**Phase 2 In Progress**: See [GitHub Issues](https://github.com/real-handy/rafters/issues) for the complete roadmap of 33 components and patterns being developed.

### Component Categories

**Core Components**: Table, Badge, Avatar, Breadcrumb, Pagination, Skeleton, Alert, Accordion, Dropdown Menu, Form Components Suite

**Layout Components**: Container, Grid, Sidebar, Header, Footer  

**Specialized Components**: Search, Calendar, File Upload, Image, Code Block, Empty State, Loading Spinner

**Interaction Components**: Dialog, Toast, Progress, Tooltip, Popover, Command Palette, Separator

**Patterns**: Form Validation, Data Fetching States, Responsive Design, Theme System

---

## Design Intelligence Features

### **Cognitive Load Assessment**
Every component is rated on cognitive complexity (1-10 scale):
```tsx
<Button cognitiveLoad={3}>Simple Action</Button>  // Low complexity
<Button cognitiveLoad={7}>Complex Workflow</Button>  // Higher complexity
```

### **Attention Economics**
Components command appropriate attention for their function:
```tsx
<Button attention="primary">Main Action</Button>     // High attention
<Button attention="secondary">Optional</Button>      // Medium attention  
<Button attention="tertiary">Helper</Button>         // Low attention
```

### **Semantic Intent**
Components communicate meaning through design:
```tsx
<Button intent="trust">Secure Payment</Button>       // Trust-building design
<Button intent="danger">Delete Account</Button>      // Careful consideration required
<Button intent="success">Complete Order</Button>     // Positive reinforcement
```

---

## Accessibility Features

### **Motor Accessibility**
- 44px minimum touch targets
- Generous spacing for easy interaction
- Keyboard navigation for all components

### **Visual Accessibility**  
- 4.5:1 contrast minimum (WCAG AA)
- Scalable text and components
- Color-blind friendly palettes

### **Cognitive Accessibility**
- Simple, clear language
- Predictable interaction patterns
- Forgiving error handling

### **Auditory Accessibility**
- Screen reader compatible
- Text alternatives for all visual information
- Clear focus indicators

---

## Storybook Documentation

Explore component intelligence with our interactive documentation:

```bash
pnpm storybook
```

Each component includes:
- **Design Reasoning**: Why decisions were made
- **Accessibility Examples**: Real-world usage scenarios  
- **Cognitive Load Analysis**: Mental overhead assessment
- **Attention Economics**: Visual hierarchy validation

---

## Design Philosophy

### **Intent → Meaning → Form → Implementation**

We don't start with visual design. We start with human needs:

1. **Intent Analysis**: What human need does this serve?
2. **Semantic Definition**: What meaning should this communicate?
3. **Cognitive Assessment**: How can we reduce mental overhead?
4. **Accessibility Intelligence**: What barriers might this create?
5. **Implementation**: Code that embodies the intelligence

### **Systems Over Solutions**
- Coherent design language, not isolated components
- Design tokens that scale across platforms  
- Consistent patterns that reduce learning overhead
- Documentation that teaches principles, not just usage

---

## Development

### Getting Started
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run Storybook
pnpm storybook

# Run tests
pnpm test
```

### AI Development Approach
This design system is built for AI development. Each component includes:
- **Intelligence Patterns**: Design reasoning encoded for AI understanding
- **Comprehensive Examples**: Storybook stories demonstrating proper usage
- **Accessibility Excellence**: WCAG AAA compliance with motor, visual, cognitive, and auditory support
- **Systematic Foundation**: Radix primitives with semantic tokens

### Contributing
See [GitHub Issues](https://github.com/real-handy/rafters/issues) for current development priorities. Each issue includes detailed technical requirements and intelligence patterns for implementation.

---

## License

MIT © Sean Silvius 

---

**"Every component should feel like it was designed by Jony Ive's attention to human psychology and Nielsen Norman Group's usability expertise."**
