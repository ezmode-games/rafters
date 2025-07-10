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

## Components

### Core Components
- **Button**: Action triggers with attention economics
- **Input**: Form fields with validation intelligence
- **Card**: Content containers with cognitive load optimization
- **Select**: Choice components with interaction intelligence

### Layout Components  
- **Layout**: Grid systems with mathematical precision
- **Tabs**: Navigation with wayfinding intelligence

### Form Components
- **Label**: Typography with semantic meaning
- **Slider**: Range inputs with motor accessibility

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

## Contributing

We welcome contributions that advance design intelligence:

1. **Follow Design Intelligence Principles**
2. **Include Accessibility Testing**
3. **Document Design Reasoning**
4. **Validate Cognitive Load Impact**

See [COMPONENT_DEVELOPMENT_BRIEFING.md](./COMPONENT_DEVELOPMENT_BRIEFING.md) for detailed guidelines.

---

## License

MIT © Sean Silvius 

---

**"Every component should feel like it was designed by Jony Ive's attention to human psychology and Nielsen Norman Group's usability expertise."**
