# Rafters Studio Specification
## Design System Generator with OKLCH + Accessibility Intelligence

*Teaching AI agents design intelligence through interactive color and typography configuration*

---

## Core Mission

Create a standalone web application that transforms single inputs into complete design systems while teaching accessibility, color theory, and typography principles. The configurator must work for all color vision types and generate systems that AI agents can understand and reason about.

"I have this image in my head. it's starts as a 1px outline box on a white page that has animated artifacts like dust floating around. Kinda like the snow in the header animation on realhandy landing page. the box is clear. you can see the artifacts. It moves slowly and bounces within a hidden container, slightly. It says rafters upper left forner. There is a 15% rafters logo behind everything, just the lines, not the wordmark. You click it. color wheel, you choose a color or type it in. the wheels goes away and the box stops moving, shrinks to 128px square. It becomes the 500 scale in a color scale. they spread out left and right. We suggest two lighter and two darker tones for pallete. All full 50-900 scale. They are labled with good color names. the spacing, shadow, states just show up. The type paints itself in. You can right click and get a menu to edit anything and click the only button, save up top right."

  The 1px box floating with dust artifacts - immediate zen, meditative feeling. Sets the tone that this isn't just another config tool.

  The slow bounce in hidden container - organic movement, not mechanical. Like it's alive.

  15% logo lines behind everything - subtle branding that doesn't scream, just whispers quality.

  Click → color wheel → transformation - the box becomes the color, doesn't just get filled with it. The interface morphs based on your choice.

  Shrinks to 128px → becomes 500 scale → spreads left/right - beautiful choreography. The chosen color literally expands into a complete system.

  Two lighter, two darker suggested - you're not making them build a whole palette, just giving them the foundation and smart suggestions.

  Everything else just appears - spacing, shadows, states paint themselves in. No hunting through menus.

  Right-click to edit anything - power user access without cluttering the zen experience.

  One save button, top right - clean exit.

---

## Progressive Discovery Flow

### Initial Experience
```
🎨 Let's build your design system

□ I have exact brand colors (RGB/hex values)
□ I have one main color (need to build a scale)  
□ I need help choosing colors (guided selection)
```

**Path A**: Exact Colors → OKLCH conversion → Accessibility validation
**Path B**: Single Color Scale → OKLCH harmonies → Typography pairing  
**Path C**: Guided Selection → Semantic suggestions → Complete system

---

## Color System Generation

### Path B: Single Color → Complete System (Primary Flow)

#### Step 1: Color Input & OKLCH Conversion
```
Enter your primary brand color:
[Color picker] [Hex input] [Color name]

→ Auto-convert to OKLCH
→ Show perceptual uniformity explanation
→ "Why OKLCH matters for accessibility"
```

#### Step 2: Lightness Scale Generation
**The Foundation Challenge**: Create perceptually uniform lightness steps that work across all color vision types.

**Technical Requirements**:
- Generate 50-950 scale (similar to Tailwind)
- Maintain perceptual uniformity in OKLCH L* channel
- Calculate contrast ratios for each step
- Test against Deuteranopia/Protanopia/Tritanopia
- Show "safe zones" for text combinations

**Visual Interface**:
```
Lightness Scale Visualization:
50  ████████████████ ← Too light for text
100 ████████████████ 
200 ████████████████ ← AA Large text zone
300 ████████████████ 
400 ████████████████ ← AA Normal text zone
500 ████████████████ ← Your primary color
600 ████████████████ ← White text safe zone
700 ████████████████ 
800 ████████████████ 
900 ████████████████ 
950 ████████████████ ← Maximum contrast
```

**Accessibility Visualization**:
- Green zone: AAA contrast (7:1+)
- Amber zone: AA contrast (4.5:1+) 
- Red zone: Below AA (< 4.5:1)
- Color vision simulation overlay

#### Step 3: Harmony Generation
**The Hard Problem**: Generate complementary, triadic, and analogous colors that maintain accessibility across all color vision types.

**Harmony Types**:
1. **Complementary**: Opposite on color wheel
2. **Triadic**: Three equally spaced colors
3. **Analogous**: Adjacent colors
4. **Split-Complementary**: Base + two adjacent to complement
5. **Tetradic**: Four evenly spaced colors

**Color Vision Testing**:
```
Normal Vision    [████ ████ ████]
Deuteranopia     [████ ████ ████] ← Simulated view
Protanopia       [████ ████ ████] ← Simulated view  
Tritanopia       [████ ████ ████] ← Simulated view

✓ All harmonies remain distinguishable
✗ Red/Green harmony fails deuteranopia test
```

**Intelligence Output**:
- Why these harmonies work together
- Semantic meaning of each color choice
- Accessibility relationships between colors
- Cognitive load implications

#### Step 4: Semantic Color Assignment
```
Primary    [Your Color]     ← Main actions, brand
Secondary  [Harmony 1]      ← Optional actions  
Accent     [Harmony 2]      ← Highlights, links
Success    [Smart Green]    ← Confirmation, positive
Warning    [Smart Amber]    ← Caution, attention
Danger     [Smart Red]      ← Errors, destruction
Info       [Smart Blue]     ← Information, neutral
```

**Smart Semantic Colors**: Auto-generated based on primary, but adjusted for:
- Universal color vision accessibility
- Cultural color associations
- WCAG AAA compliance
- Emotional/psychological impact

---

## Typography System Generation

### Type Pairing Intelligence

#### Step 1: Intent Assessment
```
What type of project is this?

□ Professional/Corporate (Trust, Authority)
□ Creative/Artistic (Expression, Personality)
□ Technical/SaaS (Clarity, Efficiency)  
□ E-commerce (Conversion, Trust)
□ Editorial/Content (Readability, Hierarchy)
```

#### Step 2: Typewolf-Inspired Pairing Engine
**Curated Type Combinations** (based on Typewolf's proven pairings):

**Professional Pairings**:
- Inter + Source Serif Pro
- Work Sans + Crimson Text
- Poppins + Lora
- Nunito Sans + Merriweather

**Creative Pairings**:
- Montserrat + Open Sans
- Playfair Display + Source Sans Pro
- Oswald + Lato
- Raleway + PT Serif

**Technical Pairings**:
- Roboto + Roboto Slab
- Fira Sans + Fira Code
- IBM Plex Sans + IBM Plex Mono
- Space Grotesk + Space Mono

**E-commerce Pairings**:
- Muli + Spectral
- Karla + Libre Baskerville
- DM Sans + DM Serif Display

#### Step 3: Typographic Scale Generation
**Mathematical Progression** (φ-based or perfect fourth):
```
Display: 3.052rem   (48.83px)  ← Hero headings
H1:      2.441rem   (39.06px)  ← Page titles
H2:      1.953rem   (31.25px)  ← Section headings  
H3:      1.563rem   (25px)     ← Subsection headings
H4:      1.25rem    (20px)     ← Component headings
Body:    1rem       (16px)     ← Base reading size
Small:   0.8rem     (12.8px)   ← Captions, metadata
```

**Accessibility Integration**:
- Minimum 16px base size
- 1.5 line height for body text
- Sufficient contrast with color system
- Responsive scaling for mobile

#### Step 4: Typography Intelligence
```
Heading Font: Inter
- Clean, professional, high legibility
- Works at small sizes (accessibility)
- Neutral personality supports brand colors
- AI reasoning: "Conveys trust and clarity"

Body Font: Source Serif Pro  
- Excellent readability for long-form content
- Serif aids reading flow and comprehension
- Pairs harmoniously with Inter's geometry
- AI reasoning: "Reduces cognitive load in reading"
```

---

## Output Generation

### Tailwind v4+ CSS Export
```css
@import "tailwindcss";

@theme {
  /* Color System (OKLCH) */
  --color-primary-50: oklch(0.98 0.02 [hue]);
  --color-primary-100: oklch(0.95 0.05 [hue]);
  --color-primary-500: oklch(0.6 0.15 [hue]);  /* Your input color */
  --color-primary-900: oklch(0.3 0.12 [hue]);
  
  /* Semantic Colors */
  --color-success: oklch(0.7 0.15 142);  /* Accessible green */
  --color-warning: oklch(0.8 0.12 85);   /* Accessible amber */
  --color-danger: oklch(0.6 0.2 25);     /* Accessible red */
  
  /* Typography */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Source Serif Pro', Georgia, serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  
  /* Typographic Scale */
  --text-display: 3.052rem;
  --text-h1: 2.441rem;
  --text-h2: 1.953rem;
  --text-body: 1rem;
  --text-small: 0.8rem;
  
  /* Spacing (φ-based) */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.618rem;
  --spacing-xl: 2.618rem;
}
```

### Intelligence Documentation Export
```markdown
# Design System Intelligence

## Color Decisions
- **Primary Blue**: Conveys trust and professionalism
- **Lightness Scale**: Tested for deuteranopia, protanopia, tritanopia
- **Contrast Ratios**: All combinations meet WCAG AAA standards
- **Cognitive Load**: 5 semantic colors prevent decision fatigue

## Typography Decisions  
- **Inter + Source Serif**: Professional clarity with reading comfort
- **Scale Ratio**: 1.25 (perfect fourth) for harmonic progression
- **Accessibility**: 16px minimum, 1.5 line height, high contrast

## AI Usage Patterns
- Use primary for main actions (buttons, links)
- Use secondary for optional actions  
- Success/warning/danger for semantic feedback
- Heading font for UI, body font for content
- Scale maintains hierarchy across all screen sizes
```

---

## Technical Architecture

### Core Technologies
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4+ (for dogfooding)
- **Color Math**: OKLCH conversion libraries
- **Accessibility**: WCAG contrast calculation
- **Color Vision**: Deuteranopia/Protanopia/Tritanopia simulation

### Color Vision Simulation
```typescript
interface ColorVisionType {
  normal: string
  deuteranopia: string    // Red-green (most common)
  protanopia: string      // Red-green  
  tritanopia: string      // Blue-yellow (rare)
}

function simulateColorVision(oklch: OKLCH): ColorVisionType {
  // Convert OKLCH → RGB → Apply vision simulation → Back to OKLCH
  // Ensure harmonies remain distinguishable across all types
}
```

### Accessibility Calculations
```typescript
function calculateContrast(foreground: OKLCH, background: OKLCH): number {
  // Convert to RGB, calculate luminance, apply WCAG formula
  // Return ratio (1:1 to 21:1)
}

function findAccessibleShades(baseColor: OKLCH): AccessibilityZones {
  return {
    aaLarge: [], // 3:1+ ratios
    aaNormal: [], // 4.5:1+ ratios  
    aaa: [] // 7:1+ ratios
  }
}
```

---

## UX Principles

### Teaching Through Experience
1. **Show, Don't Tell**: Visual feedback over mathematical explanations
2. **Progressive Disclosure**: Start simple, reveal complexity as needed
3. **Real-time Feedback**: See changes immediately across all contexts
4. **AI Perspective**: "Here's how an AI agent interprets this choice"
5. **Accessibility as Default**: Make inclusive design the easy path

### Stellar Usability Requirements
- **Zero Learning Curve**: Immediate value from first interaction
- **Confidence Building**: Clear feedback on every decision
- **Error Prevention**: Impossible to create inaccessible combinations
- **Joyful Discovery**: "I didn't know I could create this"
- **Intelligence Transfer**: Users learn design principles through use

---

## Success Metrics

### Functional Success
- ✅ Generate WCAG AAA compliant color systems
- ✅ Work across all color vision types
- ✅ Export valid Tailwind v4+ CSS
- ✅ Maintain perceptual uniformity in OKLCH
- ✅ Create harmonious typography pairings

### Intelligence Success
- ✅ AI agents can understand design reasoning
- ✅ Users learn accessibility principles through interaction
- ✅ Design decisions are documented and transferable
- ✅ Systems scale coherently across projects
- ✅ Cognitive load is minimized for end users

Studio becomes the first tool that makes accessible, intelligent design systems as easy as picking a single color. The real innovation is teaching design intelligence through the creation process itself.