# @rafters/color-utils

OKLCH color utilities, accessibility calculations, and color vision simulation for Rafters design systems.

## Overview

Single-responsibility color utilities built for AI-first design intelligence. Provides comprehensive color operations with accessibility and harmony focus, designed specifically for the Rafters Studio ecosystem.

## Features

### Accessibility
- WCAG contrast ratio calculations
- APCA (Advanced Perceptual Contrast Algorithm) support
- Color vision simulation (protanopia, deuteranopia, tritanopia)
- Accessible color palette generation

### Color Analysis
- Color temperature analysis
- Saturation and brightness metrics
- Harmony relationship detection
- Perceptual color distance calculations

### Color Conversion
- OKLCH ↔ RGB ↔ HSL conversion
- CSS color format output
- Color space transformations
- Precision-focused conversions for design systems

### Color Harmony
- Complementary color generation
- Triadic and tetradic schemes
- Analogous color palettes
- Split-complementary combinations

### Color Manipulation
- Lightness adjustments
- Saturation modifications
- Hue shifting
- Alpha channel operations

### Color Naming
- Semantic color name generation
- Context-aware naming conventions
- Design system token naming
- AI-friendly color descriptions

### Palette Generation
- Studio-compatible palette creation
- Theme-aware color scales
- Accessibility-compliant palettes
- Harmony-based color schemes

### Studio Integration
- Rafters Studio API compatibility
- Design token export formats
- AI intelligence metadata
- Component usage analytics

### Validation
- Color format validation
- Accessibility compliance checking
- Harmony rule validation
- Design system constraints

## Installation

```bash
npm install @rafters/color-utils
```

## Usage

```typescript
import {
  oklchToRgb,
  calculateContrast,
  generatePalette,
  validateAccessibility,
  createHarmony
} from '@rafters/color-utils';

// Convert OKLCH to RGB
const rgb = oklchToRgb([0.7, 0.15, 180]);

// Check accessibility
const contrast = calculateContrast('#000000', '#ffffff');
const isAccessible = validateAccessibility(contrast, 'AA');

// Generate harmonious palette
const harmony = createHarmony([0.6, 0.12, 240], 'complementary');

// Create design system palette
const palette = generatePalette({
  primary: [0.6, 0.12, 240],
  steps: 9,
  accessibility: 'AAA'
});
```

## API Reference

### Accessibility
- `calculateContrast(color1, color2)` - WCAG contrast ratio
- `validateAccessibility(contrast, level)` - WCAG compliance check
- `simulateColorVision(color, type)` - Color vision simulation

### Analysis
- `analyzeTemperature(color)` - Color temperature analysis
- `measureSaturation(color)` - Saturation metrics
- `calculateDistance(color1, color2)` - Perceptual distance

### Conversion
- `oklchToRgb(oklch)` - OKLCH to RGB conversion
- `rgbToOklch(rgb)` - RGB to OKLCH conversion
- `formatCss(color, format)` - CSS color output

### Harmony
- `createHarmony(base, scheme)` - Generate harmony schemes
- `findComplementary(color)` - Complementary color
- `createTriadic(color)` - Triadic color scheme

### Manipulation
- `adjustLightness(color, amount)` - Lightness modification
- `saturate(color, amount)` - Saturation adjustment
- `rotate(color, degrees)` - Hue rotation

### Naming
- `generateName(color)` - Semantic color naming
- `createTokenName(color, context)` - Design token naming

### Palette
- `generatePalette(options)` - Create color palettes
- `createScale(base, steps)` - Color scale generation

### Studio
- `exportToStudio(palette)` - Studio format export
- `generateMetadata(color)` - AI intelligence data

### Validation
- `isValidOklch(color)` - OKLCH format validation
- `checkHarmony(colors)` - Harmony validation
- `validateConstraints(color, rules)` - Design system validation

## Color Spaces

Built around OKLCH (Oklch) color space for:
- Perceptually uniform color operations
- Predictable lightness values
- Consistent chroma relationships
- Better color harmony generation

## Accessibility Focus

All utilities prioritize accessibility:
- WCAG 2.1 AA/AAA compliance
- APCA contrast calculations
- Color vision deficiency support
- High contrast mode compatibility

## Design System Integration

Designed for design system workflows:
- Semantic token generation
- Scale-based palette creation
- Component usage tracking
- AI-guided color decisions

## License

MIT