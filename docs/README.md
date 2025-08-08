![Rafters](logo.svg)
## Human-AI Design Collaboration System

*Enables designers to make complex aesthetic decisions with minimal cognitive load, then gives AI agents systematic language to execute those decisions with line, shape, and color*

---

## Features

### **Cognitive Load Reduction**
- **Mathematical Infrastructure**: Studio handles OKLCH conversions, contrast ratios, and systematic relationships gracefully
- **Graceful Complexity**: Motion design makes complex decisions feel intuitive and natural
- **Progressive Disclosure**: Complex choices revealed through manageable interaction moments

### **Accessibility Foundation**
- **WCAG AAA Compliance**: Beyond minimum requirements
- **Universal Design**: Works for motor, visual, cognitive, and auditory needs
- **Real-world Testing**: Validated with assistive technologies

### **AI Intelligence Integration**
- **Embedded Design Reasoning**: Components include human design intent for AI consumption
- **Systematic Language**: Machine-readable patterns that preserve human creative decisions
- **Mathematical Precision**: AI handles systematic consistency while honoring human aesthetic judgment

---

## Installation

Rafters uses the **shadcn approach** - components are installed as source code, not npm packages:

```bash
# Initialize Rafters in your project
npx rafters init

# Install components with design intelligence
npx rafters add button
npx rafters add input
npx rafters add card
```

## Quick Start

```tsx
// Components are now part of your codebase
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card' 
import { Input } from '@/components/ui/input'

function App() {
  return (
    <Card>
      <Input placeholder="Enter your email" />
      <Button variant="primary">Sign Up</Button>
    </Card>
  )
}
```

## Human-AI Design Collaboration

Rafters bridges human creativity and AI precision through a **three-layer system**:

### **1. Rafters Studio** (Human Experience)
**Reduces cognitive load** for complex design decisions:
- Designer chooses colors aesthetically → Studio handles OKLCH math gracefully
- Designer defines brand intent → Studio generates systematic relationships
- Designer makes refinements → Studio maintains accessibility and consistency
- **Graceful motion design** makes complex mathematical relationships feel intuitive

### **2. Component Intelligence** (AI Integration)
Each component includes **embedded human reasoning** for AI consumption:

**Component Comments** (Human Intent)
```tsx
/**
 * Designer Intent: Destructive actions need careful consideration
 * Cognitive Load: 7/10 - requires confirmation patterns  
 * Usage Context: Account deletion, data loss, irreversible actions
 */
```

**Component Manifest** (Mathematical Relationships)
```json
{
  "intelligence": {
    "contrastRatio": 4.8,
    "colorHarmony": "complementary", 
    "accessibilityZone": "AAA",
    "attentionEconomy": "high-priority"
  }
}
```

### **3. CLI Installation** (Implementation)
Install components as source code with embedded intelligence:

```bash
# Initialize human-AI design collaboration
npx rafters init

# Install components with design reasoning
npx rafters add button
npx rafters add input  
npx rafters add dialog
```

### **The Result: Systematic Design Language**
- **Humans focus** on aesthetic judgment and creative decisions
- **AI agents receive** systematic constraints and embedded reasoning
- **Components preserve** human design intent through mathematical precision
- **Teams scale** design decisions without losing creative quality

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

See [ARCHITECTURE.md](./ARCHITECTURE.md), [CLI_PLAN.md](./CLI_PLAN.md), and [WEB_CONFIGURATOR_SPEC.md](./WEB_CONFIGURATOR_SPEC.md) for complete technical documentation.

---

## License

MIT © Sean Silvius 

---

**"Every component should feel like it was designed by Jony Ive's attention to human psychology and Nielsen Norman Group's usability expertise."**
