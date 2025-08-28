# @rafters/shared

Shared types, schemas, and utilities for the Rafters AI design intelligence system.

## Overview

This package contains the core TypeScript types and Zod schemas used throughout the Rafters ecosystem to ensure type safety and data validation across all components, CLI tools, and design token generators.

## What's Included

### Core Types
- `ComponentManifest` - Component registry schema compatible with shadcn/ui
- `RegistryResponse` - Registry API response format
- `DesignSystem` - Complete design system configuration
- `Intelligence` - AI design intelligence metadata
- `OKLCH` - Perceptually uniform color space representation

### Validation Schemas
All types include corresponding Zod schemas for runtime validation:
- `ComponentManifestSchema`
- `RegistryResponseSchema` 
- `DesignSystemSchema`
- `IntelligenceSchema`
- `OKLCHSchema`

### AI Intelligence Framework
- Component cognitive load ratings (1-10)
- Attention economics guidance
- Accessibility compliance rules
- Trust building patterns
- Semantic meaning definitions

## Usage

```typescript
import { 
  ComponentManifestSchema, 
  type ComponentManifest,
  type Intelligence 
} from '@rafters/shared';

// Validate component data
const component = ComponentManifestSchema.parse(rawData);

// Use intelligence metadata
const intelligence: Intelligence = {
  cognitiveLoad: 3,
  attentionEconomics: "Primary action, commands highest attention",
  accessibility: "WCAG AAA compliant with proper ARIA labels",
  trustBuilding: "Consistent styling builds user confidence",
  semanticMeaning: "Core action trigger with clear intent"
};
```

## Design Intelligence System

Components in Rafters carry embedded human design reasoning that enables AI agents to make informed UX decisions:

- **Cognitive Load**: How much mental effort required (1-10 scale)
- **Attention Economics**: Visual hierarchy and focus management
- **Trust Building**: Patterns that build user confidence
- **Accessibility**: WCAG compliance and inclusive design
- **Semantic Meaning**: Clear purpose and usage context

## Integration

This package is used by:
- `@rafters/cli` - Component installation and project setup
- `@rafters/design-tokens` - Token generation and validation
- `@rafters/ui` - Component library with embedded intelligence
- Rafters website - Documentation and component registry

## License

MIT