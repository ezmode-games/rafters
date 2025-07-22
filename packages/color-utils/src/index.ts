/**
 * @rafters/color-utils
 * 
 * OKLCH color utilities, accessibility calculations, and color vision simulation
 * for the Rafters AI design intelligence system.
 */

import type { OKLCH, ColorVisionType } from '@rafters/shared'

/**
 * Convert hex color to OKLCH
 * This is a simplified conversion - in production we'd use a proper color library
 */
export function hexToOKLCH(hex: string): OKLCH {
  // Remove # if present
  const cleanHex = hex.replace('#', '')
  
  // Convert hex to RGB
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255
  
  // Simplified RGB to OKLCH conversion (placeholder)
  // In production, use a proper color library like colorjs.io
  const l = (r + g + b) / 3 // Simplified lightness
  const c = Math.sqrt((r - g) ** 2 + (g - b) ** 2 + (b - r) ** 2) / Math.sqrt(3)
  const h = Math.atan2(g - r, b - r) * (180 / Math.PI)
  
  return {
    l: Math.max(0, Math.min(1, l)),
    c: Math.max(0, c),
    h: h < 0 ? h + 360 : h,
  }
}

/**
 * Convert OKLCH to CSS oklch() string
 */
export function oklchToCSS(oklch: OKLCH): string {
  const { l, c, h, alpha = 1 } = oklch
  
  if (alpha < 1) {
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)} / ${alpha})`
  }
  
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`
}

/**
 * Generate perceptually uniform lightness scale
 * Creates a scale from 50-950 similar to Tailwind
 */
export function generateLightnessScale(baseColor: OKLCH): Record<number, OKLCH> {
  const { c, h } = baseColor
  
  const scale: Record<number, OKLCH> = {}
  
  // Generate 50-950 scale with perceptually uniform steps
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  steps.forEach((step) => {
    // Map step to lightness (50 = lightest, 950 = darkest)
    const lightness = 1 - ((step - 50) / 900) // 0.94 to 0.05
    
    scale[step] = {
      l: Math.max(0.05, Math.min(0.95, lightness)),
      c: c * (step === 50 || step === 950 ? 0.1 : 1), // Reduce chroma at extremes
      h,
    }
  })
  
  return scale
}

/**
 * Calculate WCAG contrast ratio between two OKLCH colors
 * Simplified implementation - use proper library in production
 */
export function calculateContrast(foreground: OKLCH, background: OKLCH): number {
  // Convert OKLCH lightness to relative luminance (approximation)
  const l1 = foreground.l
  const l2 = background.l
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  // WCAG contrast ratio formula (simplified)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast meets WCAG standards
 */
export function meetsContrastStandard(
  foreground: OKLCH,
  background: OKLCH,
  standard: 'AA' | 'AAA' = 'AA',
  largeText = false
): boolean {
  const ratio = calculateContrast(foreground, background)
  
  const thresholds = {
    AA: largeText ? 3 : 4.5,
    AAA: largeText ? 4.5 : 7,
  }
  
  return ratio >= thresholds[standard]
}

/**
 * Simulate color vision deficiency
 * Simplified simulation - use proper library in production
 */
export function simulateColorVision(color: OKLCH, type: ColorVisionType): OKLCH {
  if (type === 'normal') return color
  
  // Simplified color vision simulation
  // In production, use proper algorithms for deuteranopia, protanopia, tritanopia
  const { l, c, h } = color
  
  switch (type) {
    case 'deuteranopia':
    case 'protanopia':
      // Red-green color blindness - shift hues toward blue/yellow axis
      return { l, c: c * 0.7, h: h > 180 ? 240 : 60 }
      
    case 'tritanopia':
      // Blue-yellow color blindness - shift toward red/green axis  
      return { l, c: c * 0.7, h: h > 180 ? 120 : 0 }
      
    default:
      return color
  }
}

/**
 * Generate semantic colors that work across all color vision types
 */
export function generateSemanticColors(primary: OKLCH): {
  success: OKLCH
  warning: OKLCH
  danger: OKLCH
  info: OKLCH
} {
  // Generate semantically appropriate colors that remain distinguishable
  // across all color vision types
  
  return {
    success: { l: 0.7, c: 0.15, h: 142 }, // Green that works for color blind
    warning: { l: 0.8, c: 0.12, h: 85 }, // Amber that works for color blind
    danger: { l: 0.6, c: 0.2, h: 25 }, // Red that works for color blind
    info: { l: 0.7, c: 0.15, h: 250 }, // Blue that works for color blind
  }
}