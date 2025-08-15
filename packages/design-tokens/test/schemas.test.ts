/**
 * Tests for all token schemas and their integration
 */

import { describe, expect, it } from 'vitest';
import {
  BorderSystemSchema,
  ColorSystemSchema,
  GrayscaleDesignSystemSchema,
  MotionSystemSchema,
  OpacitySystemSchema,
  RingSystemSchema,
  ShadowSystemSchema,
  SpacingSystemSchema,
  StateSystemSchema,
  TypographySystemSchema,
  defaultGrayscaleSystem,
} from '../src/grayscale';

describe('Color System Schema', () => {
  it('validates and parses color tokens correctly', () => {
    const colorSystem = defaultGrayscaleSystem.colors;

    expect(colorSystem.primary).toBeDefined();
    expect(colorSystem.secondary).toBeDefined();
    expect(colorSystem.background).toBeDefined();
    expect(colorSystem.foreground).toBeDefined();
    expect(colorSystem.destructive).toBeDefined();

    // Check token structure
    expect(colorSystem.primary.name).toContain('--color-');
    expect(colorSystem.primary.category).toBe('color');
    expect(colorSystem.primary.value).toMatch(/oklch\(/);
  });
});

describe('Typography System Schema', () => {
  it('validates and parses typography tokens correctly', () => {
    const typographySystem = defaultGrayscaleSystem.typography;

    expect(typographySystem.fontFamily).toBeDefined();
    expect(typographySystem.fontFamilyMono).toBeDefined();
    expect(typographySystem.hero).toBeDefined();
    expect(typographySystem.display).toBeDefined();

    // Check token structure
    expect(typographySystem.fontFamily.category).toBe('typography');
    expect(typographySystem.fontFamily.name).toContain('--font-');
  });
});

describe('Spacing System Schema', () => {
  it('validates and parses spacing tokens correctly', () => {
    const spacingSystem = defaultGrayscaleSystem.spacing;

    expect(spacingSystem.minimal).toBeDefined();
    expect(spacingSystem.tight).toBeDefined();
    expect(spacingSystem.base).toBeDefined();
    expect(spacingSystem.comfortable).toBeDefined();
    expect(spacingSystem.generous).toBeDefined();
    expect(spacingSystem.architectural).toBeDefined();

    // Check golden ratio progression
    expect(spacingSystem.minimal.semanticGroup).toBe('golden-ratio');
    expect(spacingSystem.base.semanticGroup).toBe('core');
    expect(spacingSystem.architectural.semanticGroup).toBe('golden-ratio');

    // Check values follow golden ratio
    expect(spacingSystem.minimal.value).toMatch(/rem$/);
    expect(spacingSystem.base.value).toBe('1rem');
  });
});

describe('State System Schema', () => {
  it('validates and parses state tokens correctly', () => {
    const stateSystem = defaultGrayscaleSystem.state;

    // Opacity states
    expect(stateSystem.hover).toBeDefined();
    expect(stateSystem.active).toBeDefined();
    expect(stateSystem.disabled).toBeDefined();
    expect(stateSystem.loading).toBeDefined();

    // Scale states
    expect(stateSystem.scaleActive).toBeDefined();
    expect(stateSystem.scalePressed).toBeDefined();
    expect(stateSystem.scaleHoverSubtle).toBeDefined();

    // Check AI intelligence metadata
    expect(stateSystem.hover.aiIntelligence?.cognitiveLoad).toBe(2);
    expect(stateSystem.hover.aiIntelligence?.trustLevel).toBe('high');
    expect(stateSystem.disabled.aiIntelligence?.cognitiveLoad).toBe(5);
  });
});

describe('Motion System Schema', () => {
  it('validates and parses motion tokens correctly', () => {
    const motionSystem = defaultGrayscaleSystem.motion;

    expect(motionSystem.timing).toBeDefined();
    expect(motionSystem.easing).toBeDefined();

    // Check timing tokens
    expect(motionSystem.timing.instant).toBeDefined();
    expect(motionSystem.timing.fast).toBeDefined();
    expect(motionSystem.timing.standard).toBeDefined();
    expect(motionSystem.timing.deliberate).toBeDefined();
    expect(motionSystem.timing.slow).toBeDefined();
    expect(motionSystem.timing.dramatic).toBeDefined();

    // Check easing tokens
    expect(motionSystem.easing.linear).toBeDefined();
    expect(motionSystem.easing.smooth).toBeDefined();
    expect(motionSystem.easing.accelerating).toBeDefined();
    expect(motionSystem.easing.decelerating).toBeDefined();
    expect(motionSystem.easing.bouncy).toBeDefined();
    expect(motionSystem.easing.snappy).toBeDefined();

    // Check token structure
    expect(motionSystem.timing.fast.category).toBe('timing');
    expect(motionSystem.easing.smooth.category).toBe('easing');
    expect(motionSystem.timing.standard.semanticGroup).toBe('core');
    expect(motionSystem.easing.bouncy.semanticGroup).toBe('semantic-state');
  });

  it('has proper AI intelligence for motion tokens', () => {
    const motionSystem = defaultGrayscaleSystem.motion;

    // Check timing intelligence
    expect(motionSystem.timing.instant.aiIntelligence?.cognitiveLoad).toBe(1);
    expect(motionSystem.timing.dramatic.aiIntelligence?.cognitiveLoad).toBe(9);
    expect(motionSystem.timing.standard.aiIntelligence?.trustLevel).toBe('high');

    // Check easing intelligence
    expect(motionSystem.easing.linear.aiIntelligence?.cognitiveLoad).toBe(1);
    expect(motionSystem.easing.bouncy.aiIntelligence?.cognitiveLoad).toBe(5);
  });
});

describe('Border System Schema', () => {
  it('validates and parses border tokens correctly', () => {
    const borderSystem = defaultGrayscaleSystem.border;

    expect(borderSystem.widthStandard).toBeDefined();
    expect(borderSystem.widthEnhanced).toBeDefined();
    expect(borderSystem.widthProminent).toBeDefined();
    expect(borderSystem.opacityStandard).toBeDefined();

    // Check values
    expect(borderSystem.widthStandard.value).toBe('1px');
    expect(borderSystem.opacityStandard.value).toBe('0.3');
  });
});

describe('Shadow System Schema', () => {
  it('validates and parses shadow tokens correctly', () => {
    const shadowSystem = defaultGrayscaleSystem.shadow;

    expect(shadowSystem.sm).toBeDefined();
    expect(shadowSystem.default).toBeDefined();
    expect(shadowSystem.md).toBeDefined();
    expect(shadowSystem.lg).toBeDefined();

    // Check shadow values contain proper syntax
    expect(shadowSystem.default.value).toContain('rgb');
    expect(shadowSystem.md.value).toContain('rgb');
  });
});

describe('Ring System Schema', () => {
  it('validates and parses ring tokens correctly', () => {
    const ringSystem = defaultGrayscaleSystem.ring;

    expect(ringSystem.widthStandard).toBeDefined();
    expect(ringSystem.widthEnhanced).toBeDefined();
    expect(ringSystem.offsetStandard).toBeDefined();
    expect(ringSystem.opacityStandard).toBeDefined();

    // Check values
    expect(ringSystem.widthStandard.value).toBe('2px');
    expect(ringSystem.opacityStandard.value).toBe('0.5');
  });
});

describe('Opacity System Schema', () => {
  it('validates and parses opacity tokens correctly', () => {
    const opacitySystem = defaultGrayscaleSystem.opacity;

    expect(opacitySystem.bgSubtle).toBeDefined();
    expect(opacitySystem.bgStandard).toBeDefined();
    expect(opacitySystem.bgEnhanced).toBeDefined();
    expect(opacitySystem.bgProminent).toBeDefined();

    // Check opacity values are between 0 and 1
    expect(Number.parseFloat(opacitySystem.bgSubtle.value)).toBeGreaterThan(0);
    expect(Number.parseFloat(opacitySystem.bgSubtle.value)).toBeLessThan(1);
    expect(Number.parseFloat(opacitySystem.bgProminent.value)).toBeGreaterThan(0);
    expect(Number.parseFloat(opacitySystem.bgProminent.value)).toBeLessThan(1);
  });
});

describe('Complete Grayscale Design System Schema', () => {
  it('validates and parses the complete system correctly', () => {
    const system = defaultGrayscaleSystem;

    // Check all subsystems exist
    expect(system.colors).toBeDefined();
    expect(system.typography).toBeDefined();
    expect(system.spacing).toBeDefined();
    expect(system.state).toBeDefined();
    expect(system.motion).toBeDefined();
    expect(system.border).toBeDefined();
    expect(system.shadow).toBeDefined();
    expect(system.ring).toBeDefined();
    expect(system.opacity).toBeDefined();
    expect(system.meta).toBeDefined();
  });

  it('calculates cross-system intelligence metrics correctly', () => {
    const system = defaultGrayscaleSystem;
    const meta = system.meta;

    // Check calculated metrics
    expect(meta.overallCognitiveLoad).toBeGreaterThan(0);
    expect(meta.designCoherence).toBe(10); // Perfect coherence for default system
    expect(meta.accessibilityScore).toBe(3.8); // Calculated accessibility score for default system

    // Check intelligence features
    expect(meta.intelligenceFeatures).toContain('automatic-contrast');
    expect(meta.intelligenceFeatures).toContain('golden-ratio-harmony');
    expect(meta.intelligenceFeatures).toContain('cognitive-load-tracking');
    expect(meta.intelligenceFeatures).toContain('trust-building-optimization');
    expect(meta.intelligenceFeatures).toContain('accessibility-compliance');
    expect(meta.intelligenceFeatures).toContain('semantic-color-mapping');
  });

  it('ensures motion system is properly integrated', () => {
    const system = defaultGrayscaleSystem;

    // Check motion tokens are included in cross-system calculations
    const allTokens = [
      ...Object.values(system.colors),
      ...Object.values(system.typography),
      ...Object.values(system.spacing),
      ...Object.values(system.state),
      ...Object.values(system.motion.timing),
      ...Object.values(system.motion.easing),
      ...Object.values(system.border),
      ...Object.values(system.shadow),
      ...Object.values(system.ring),
      ...Object.values(system.opacity),
    ];

    const motionTokens = allTokens.filter(
      (token) => token.category === 'timing' || token.category === 'easing'
    );

    expect(motionTokens.length).toBeGreaterThan(0);
    expect(motionTokens.every((token) => token.semanticGroup)).toBe(true);
  });
});
