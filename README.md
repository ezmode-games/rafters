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

## How Rafters Works

Rafters follows the **shadcn model** but adds design intelligence patterns:

### 🎨 **Web Configurator**
Transform grayscale foundation components into your design system:
- Configure colors, spacing, typography, borders
- Real-time preview of your design system
- Export Tailwind v4+ CSS custom properties

### 🛠️ **CLI Installation**
Install components as source code with embedded intelligence:

```bash
# Initialize in your project
npx rafters init

# Install components with design intelligence
npx rafters add button
npx rafters add input
npx rafters add dialog
```

### 🧠 **Design Intelligence Included**
Each component includes three layers of intelligence:

**1. Component Comments** (Essential patterns)
```tsx
/**
 * Button Intelligence: cognitiveLoad=3, size=attention hierarchy
 * Destructive variant REQUIRES confirmation UX patterns
 */
```

**2. Component Manifest** (Machine-readable data)
```json
{
  "intelligence": {
    "cognitiveLoad": 3,
    "attentionEconomics": "Size hierarchy: sm=tertiary, md=secondary, lg=primary",
    "accessibility": "44px touch targets, WCAG AAA contrast"
  }
}
```

**3. Intelligence Stories** (Complete education)
Full Storybook stories demonstrating design reasoning and accessibility patterns.

### ✨ **Source Code Ownership**
- Components become **your code** to customize
- No black box dependencies
- Intelligence patterns travel with the code
- Perfect for AI development

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

## Component Library

### Current Status
**Phase 1 Complete**: Core foundation components (Button, Input, Card, Select, Label, Slider, Tabs) with design intelligence patterns implemented.

**In Development**: See [GitHub Issues](https://github.com/real-handy/rafters/issues) for the complete roadmap of 33+ components being developed.

### Component Categories

**Core Components**: Table, Badge, Avatar, Breadcrumb, Pagination, Skeleton, Alert, Accordion, Dropdown Menu, Form Components Suite

**Layout Components**: Container, Grid, Sidebar, Header, Footer  

**Specialized Components**: Search, Calendar, File Upload, Image, Code Block, Empty State, Loading Spinner

**Interaction Components**: Dialog, Toast, Progress, Tooltip, Popover, Command Palette, Separator

**Patterns**: Form Validation, Data Fetching States, Responsive Design, Theme System

---

## Development

### Repository Development
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

### Contributing
See [GitHub Issues](https://github.com/real-handy/rafters/issues) for current development priorities. Each issue includes detailed technical requirements and intelligence patterns for implementation.

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [CLI_PLAN.md](./CLI_PLAN.md) for complete technical documentation.

---

## License

MIT © Sean Silvius 

---

**"Every component should feel like it was designed by Jony Ive's attention to human psychology and Nielsen Norman Group's usability expertise."**
