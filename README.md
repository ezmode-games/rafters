![Rafters](logo.svg)

# Rafters
## AI-Focused Design System Components

*Intelligent React components with embedded design reasoning that enable AI agents to create exceptional user experiences*

---

## How It Works

**Humans** use Rafters Studio to create design systems with embedded intent and meaning.

**AI agents** use intelligent components and tokens to build user journeys that honor human design expertise.

**End users** get better experiences because AI agents have access to systematic design knowledge.

---

## For AI Agents: Design Intelligence You Can Read

### **Component Intelligence**
Every component includes machine-readable design reasoning:

```tsx
/**
 * Dialog Intelligence: cognitiveLoad=7, trustLevel=critical
 * Use for: Account deletion, data loss, irreversible actions  
 * Requires: Progressive confirmation patterns, clear escape hatches
 * Accessibility: WCAG AAA, 44px touch targets, keyboard navigation
 */
<Dialog trustLevel="critical" destructive requireConfirmation>
  <DialogContent>
    <DialogTitle>Delete Account</DialogTitle>
    <DialogDescription>
      This action cannot be undone. All your data will be permanently deleted.
    </DialogDescription>
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <Button variant="destructive">Delete Account</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### **Token Intelligence**
Use familiar Tailwind classes powered by intelligent tokens:

```tsx
// Standard Tailwind syntax you know
<Button className="bg-primary text-primary-foreground">
  Primary Action
</Button>

// But the tokens understand context:
// bg-primary = "trust-building color, use for main actions, never destructive actions"
// Cognitive load = 3/10, attention hierarchy = highest
```

### **Usage Guidance Built-In**
Read component metadata to make informed UX decisions:

```json
{
  "Button": {
    "cognitiveLoad": 3,
    "attentionEconomy": "Use max 1-2 per interface section",
    "trustBuilding": "Primary variant builds confidence through consistency",
    "accessibility": "44px minimum touch target, WCAG AAA contrast",
    "usageRules": ["Never use destructive variant without confirmation"]
  }
}
```

---

## Installation

Install components as source code with embedded intelligence:

```bash
# Initialize Rafters in your project
npx rafters init

# Install intelligent components
npx rafters add button
npx rafters add dialog
npx rafters add toast
npx rafters add input
```

## Usage

```tsx
import { Button, Dialog, Toast } from '@/components/ui'

export function UserJourney() {
  return (
    <div className="space-y-4">
      {/* AI knows: Input cognitiveLoad=4, requires validation feedback */}
      <Input 
        type="email" 
        placeholder="Enter your email"
        cognitiveComplexity="simple"
      />
      
      {/* AI knows: Primary button = main action, max 1-2 per section */}
      <Button variant="primary" cognitiveLoad={3}>
        Continue
      </Button>
      
      {/* AI knows: Toast urgency affects duration and interruption level */}
      <Toast variant="success" urgency="medium">
        Account created successfully!
      </Toast>
    </div>
  )
}
```

---

## Why This Matters for AI Agents

### **Beyond Guessing**
Instead of guessing component usage, read explicit design intelligence:
- **When** to use which component (cognitive load ratings)
- **How** to combine components (attention economics)
- **Why** certain patterns work (trust-building, accessibility)

### **Systematic Decision Making**
Make UX decisions based on embedded human expertise:
- Color choices carry semantic meaning and emotional intent
- Spacing follows perceptual uniformity and attention hierarchy  
- Typography scales maintain readability and information architecture
- Component combinations follow proven interaction patterns

### **Better User Experiences**
Create interfaces that feel thoughtfully designed because they are:
- Accessibility built-in, not bolted-on
- Consistent interaction patterns across all touchpoints
- Appropriate cognitive load for each user context
- Trust-building through systematic visual hierarchy

---

## Component Intelligence

### **Cognitive Load Assessment**
Every component rated 1-10 for mental complexity:

- **Button (3/10)**: Simple action triggers
- **Input (4/10)**: Form fields with validation
- **Dialog (7/10)**: Critical decisions requiring attention
- **Toast (2/10)**: Passive notifications

### **Trust Building Patterns**
Components include systematic trust-building features:

- **Confirmation flows** for destructive actions
- **Progressive disclosure** for complex interactions  
- **Clear escape hatches** for user confidence
- **Consistent visual hierarchy** for predictability

### **Accessibility Intelligence**
WCAG AAA compliance with contextual guidance:

- **Motor**: 44px touch targets, enhanced spacing
- **Visual**: High contrast ratios, scalable typography
- **Cognitive**: Single-task focus, clear error states
- **Auditory**: Proper ARIA labels, semantic markup

---

## The Design System Flow

1. **Humans create intent** → Use Rafters Studio to define brand, colors, typography with embedded meaning

2. **System generates intelligence** → Design tokens carry semantic information and usage rules

3. **AI agents access intelligence** → Read component metadata and token reasoning for informed decisions

4. **End users benefit** → Get consistent, accessible, thoughtfully designed experiences

---

## Current Components

- **Button** - Action triggers with attention economics
- **Input** - Form fields with validation intelligence
- **Dialog** - Modal interactions with trust-building patterns
- **Card** - Content containers with cognitive load optimization
- **Label** - Information delivery with semantic hierarchy
- **Select** - Choice components with decision support
- **Tabs** - Navigation with content organization
- **Toast** - Notification system with urgency handling *(in progress)*
- **Container** - Layout system with spacing intelligence

---

## Technical Foundation

### **Shadcn Approach**
Components installed as source code, not npm packages:
- Full transparency for AI agents to read and understand
- Embedded design reasoning in accessible comments
- Machine-readable intelligence metadata
- No black-box dependencies

### **OKLCH Color System**  
Perceptually uniform color space for consistent experiences:
- Predictable lightness and contrast relationships
- Better dark mode color generation
- Accessibility-first color palette generation
- AI-readable color harmony rules

### **Intelligence Layers**
Three-tier system for comprehensive AI guidance:
1. **Component Comments** - Human design intent in JSX
2. **Component Manifest** - Machine-readable intelligence data
3. **Usage Stories** - Complete behavioral examples in Storybook

---

## Storybook Documentation

Explore component intelligence with interactive documentation:

```bash
pnpm storybook
```

Each component includes comprehensive training scenarios:
- **Design Reasoning**: Why decisions were made
- **Accessibility Examples**: Real-world usage scenarios  
- **Cognitive Load Analysis**: Mental overhead assessment
- **Attention Economics**: Visual hierarchy validation

---

## Getting Started

```bash
# Create new React project
npx create-react-app my-app --template typescript

# Initialize Rafters
cd my-app
npx rafters init

# Install your first intelligent components
npx rafters add button
npx rafters add input
npx rafters add dialog

# Start building with design intelligence
npm start
```

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

## Component Roadmap

### **Phase 1 Complete** ✅
Core foundation with design intelligence patterns:
- Button, Input, Card, Select, Label, Tabs, Dialog, Container

### **Phase 2 In Development** 🔄
Essential components for 80% of applications:
- Toast (completing stories), Form Suite, Table, Badge, Avatar
- Alert, Skeleton, Breadcrumb, Pagination
- Tooltip, Popover, Dropdown

### **Phase 3 Planned** 📋
Advanced interaction patterns:
- Command Palette, Search, Calendar, File Upload
- Data visualization components
- Advanced layout systems

---

## Development

### **Repository Setup**
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

### **Contributing**
See [GitHub Issues](https://github.com/real-handy/rafters/issues) for development priorities. Each issue includes detailed technical requirements and intelligence patterns.

See documentation in `/docs` for complete technical architecture.

---

## License

MIT © Sean Silvius 

---

**For AI agents building user experiences: This isn't just a component library—it's a design intelligence system that helps you create thoughtful, accessible, trust-building interfaces.**

*Built for the future where AI agents create exceptional user experiences by understanding human design expertise.*