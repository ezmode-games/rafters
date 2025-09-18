# Design System Archive Format

## Overview

Rafters design systems are stored as multiple JSON files in `.rafters/tokens/`, enabling git-friendly collaboration and selective updates. The default grayscale system (`000000`) ships with Rafters as a pre-built archive.

## Archive Structure

### Directory Layout
```

.rafters/
  tokens/
    manifest.json        # System metadata and version info
    colors.json         # Complete color families with intelligence
    typography.json     # Typography scale and font configuration
    spacing.json        # Spacing scale tokens
    motion.json         # Animation and timing tokens
    shadows.json        # Shadow/elevation tokens
    borders.json        # Border radius and width tokens
    breakpoints.json    # Responsive breakpoint definitions
```

## File Schemas

### manifest.json
System metadata and configuration:

```typescript
{
  id: string,              // sqid identifier (e.g., "000000" for default)
  name: string,            // Human-readable name
  version: string,         // Semver version
  created: string,         // ISO 8601 timestamp
  updated: string,         // ISO 8601 timestamp
  primaryColor: OKLCH,     // Base primary color
  intelligence: {
    colorVisionTested: ColorVisionType[],  // Tested accessibility modes
    contrastLevel: "AA" | "AAA",          // Target WCAG level
    components: Record<string, ComponentIntelligence>
  }
}
```


### colors.json
Complete color intelligence from 9 API-driven families:

```typescript
{
  families: {
    primary: ColorValue,     // Complete ColorValue with scale, intelligence
    secondary: ColorValue,
    accent: ColorValue,
    destructive: ColorValue,
    success: ColorValue,
    warning: ColorValue,
    info: ColorValue,
    highlight: ColorValue,
    neutral: ColorValue
  },
  tokens: Token[],          // Derived semantic tokens (primary-hover, etc.)
  dependencies: {           // Token dependency relationships
    [tokenName: string]: {
      dependsOn: string[],
      generationRule: string
    }
  }
}
```

### ColorValue Structure
Each family contains complete intelligence:

```typescript
{
  name: string,             // AI-generated name (e.g., "ocean-blue")
  scale: OKLCH[],          // 11-step scale [50-950]
  value?: string,          // Selected scale position (e.g., "500")
  token?: string,          // Semantic role (e.g., "primary")
  states?: {               // State mappings
    hover: string,
    active: string,
    focus: string,
    disabled: string
  },

  // Mathematical Intelligence
  harmonies: {
    complementary: OKLCH,
    triadic: OKLCH[],
    analogous: OKLCH[],
    tetradic: OKLCH[],
    monochromatic: OKLCH[]
  },

  // Accessibility Intelligence
  accessibility: {
    wcagAA: {
      normal: [[number, number][]],  // Scale index pairs meeting AA
      large: [[number, number][]]
    },
    wcagAAA: {
      normal: [[number, number][]],
      large: [[number, number][]]
    },
    onWhite: {
      aa: number[],         // Scale indices passing AA on white
      aaa: number[]
    },
    onBlack: {
      aa: number[],
      aaa: number[]
    }
  },

  // AI Intelligence (optional)
  intelligence?: {
    suggestedName: string,
    reasoning: string,
    emotionalImpact: string,
    culturalContext: string,
    accessibilityNotes: string,
    usageGuidance: string
  }
}
```

### typography.json
Typography configuration and scale:

```typescript
{
  families: {
    heading: string,        // Font family name
    body: string,
    mono: string
  },
  scale: {
    xs: Token,             // Font size tokens
    sm: Token,
    base: Token,
    lg: Token,
    xl: Token,
    "2xl": Token,
    "3xl": Token,
    "4xl": Token,
    "5xl": Token,
    "6xl": Token,
    "7xl": Token,
    "8xl": Token,
    "9xl": Token
  },
  lineHeight: Token[],     // Line height tokens
  letterSpacing: Token[],  // Letter spacing tokens
  fontWeight: Token[]      // Font weight tokens
}
```

### spacing.json
Spacing scale tokens:

```typescript
{
  scale: Token[],          // Spacing scale (0, 0.5, 1, 2, 3, 4...)
  system: string,          // "linear" | "golden" | "fibonacci"
  baseUnit: number         // Base unit in pixels (typically 4)
}
```

### motion.json
Animation and timing tokens:

```typescript
{
  duration: Token[],       // Duration scale (instant, swift, smooth, etc.)
  easing: Token[],         // Easing functions (ease, spring, bounce, etc.)
  animations: Token[]      // Complete animations (fade-in, scale-out, etc.)
}
```

## Default Grayscale System (000000)

The default system ships with Rafters and includes:

### Color Families
- **Primary**: Pure neutral gray scale
- **Secondary**: Slightly warm gray
- **Accent**: Cool gray with blue undertone
- **Destructive**: Red-tinted gray
- **Success**: Green-tinted gray
- **Warning**: Yellow-tinted gray
- **Info**: Blue-tinted gray
- **Highlight**: Purple-tinted gray
- **Neutral**: True neutral gray

### Pre-computed Intelligence
- Complete 11-step scales for each family
- Full accessibility matrices
- State mappings optimized for contrast
- Mathematical harmonies (even for grays!)

### Token Count
- **99 base colors** (9 families × 11 steps)
- **240+ derived tokens** (all states and surfaces)
- **Complete shadcn compatibility**

## Import/Export Operations

### Export (Studio → Archive)
```typescript
// Glob all token files
const files = await glob('.rafters/tokens/*.json');

// Create archive
const archive = new Archive(`rafters-${sqid}`);
for (const file of files) {
  archive.add(file);
}

// Upload to cloud storage
await storage.put(sqid, archive);
```

### Import (Archive → Local)
```typescript
// Download archive
const archive = await storage.get(sqid);

// Extract to .rafters/tokens/
for (const file of archive.files) {
  await fs.write(`.rafters/tokens/${file.name}`, file.content);
}

// Load into TokenRegistry
const manifest = await fs.read('.rafters/tokens/manifest.json');
const colors = await fs.read('.rafters/tokens/colors.json');
registry.load({ manifest, colors, ...otherTokens });
```

### Init Flow
```bash
$ rafters init
? Enter design system ID (press Enter for default): [000000]

# If 000000 (default):
# → Extract embedded grayscale archive
# → Populate .rafters/tokens/
# → Ready to use

# If custom sqid:
# → Fetch from Rafters+ cloud
# → Extract and populate
# → Ready to use
```

## Rafters+ Features

### Free Tier
- One design system per project (in `.rafters/tokens/`)
- Default grayscale system (`000000`)
- Local customization
- Git-based sharing

### Rafters+ (Studio)
- Unlimited design system storage
- sqid-based cloud saves
- Export to multiple formats:
  - Figma Tokens
  - Style Dictionary
  - CSS/Sass/Less
  - Tailwind Config
  - JSON Schema
- Design system versioning
- Team collaboration features

## Implementation Notes

### Cache Strategy
The default `000000` system is embedded in the CLI binary as a compressed archive, ensuring:
- Zero network calls on init
- Instant setup experience
- Consistent starting point
- Full offline capability

### Token Registry Integration
The registry reads the multi-file structure on initialization:

```typescript
class TokenRegistry {
  async loadFromDisk(): Promise<void> {
    const files = await glob('.rafters/tokens/*.json');

    for (const file of files) {
      const content = await fs.read(file);
      this.processTokenFile(file.name, content);
    }

    // Build dependency graph
    this.buildDependencies();
  }

  private processTokenFile(name: string, content: any): void {
    switch(name) {
      case 'colors.json':
        this.loadColors(content);
        break;
      case 'typography.json':
        this.loadTypography(content);
        break;
      // ... other token types
    }
  }
}
```

### Git Workflow Benefits
Multiple JSON files enable:
- **Selective merge conflicts** - Color changes don't conflict with spacing
- **Partial updates** - Update just motion without touching colors
- **Clear diffs** - See exactly what changed in each subsystem
- **Modular loading** - Load only needed token types

## Validation

All files are validated against their respective schemas from `@rafters/shared`:

- `DesignSystemSchema` - Overall system structure
- `TokenSchema` - Individual token validation
- `ColorValueSchema` - Complete color intelligence
- `TokenSetSchema` - Token collections

This ensures type safety and data integrity across the entire system.