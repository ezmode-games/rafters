/**
 * Component Intelligence Service
 *
 * Analyzes Rafters UI components using cognitive load theory, attention hierarchy principles,
 * and accessibility intelligence to provide Claude with deep understanding of component
 * complexity and user experience impact.
 *
 * Integrates with existing component intelligence metadata to provide sophisticated
 * analysis of attention economics and user cognitive load.
 */

import type { ComponentRegistry, Intelligence } from '@rafters/shared';
import { z } from 'zod';

// ===== SCHEMAS & TYPES =====

export const ComponentAnalysisContextSchema = z.object({
  layoutComplexity: z.number().min(1).max(10).default(1),
  userExpertise: z.enum(['novice', 'intermediate', 'expert']).default('novice'),
  taskUrgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  deviceContext: z.enum(['mobile', 'tablet', 'desktop', 'kiosk']).default('desktop'),
  accessibilityNeeds: z.array(z.string()).default([]),
});

export type ComponentAnalysisContext = z.infer<typeof ComponentAnalysisContextSchema>;

export const CompositionConstraintsSchema = z.object({
  maxCognitiveLoad: z.number().min(1).max(10).default(7),
  maxAttentionPoints: z.number().min(1).max(5).default(3),
  requiresAccessibility: z.array(z.enum(['AA', 'AAA'])).default(['AA']),
  trustLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  deviceConstraints: z
    .object({
      minTouchTarget: z.number().default(44), // 44px WCAG minimum
      maxElements: z.number().default(7), // Miller's rule
    })
    .optional(),
});

export type CompositionConstraints = z.infer<typeof CompositionConstraintsSchema>;

export const ComponentLayoutSchema = z.object({
  components: z.array(
    z.object({
      name: z.string(),
      position: z.object({ x: z.number(), y: z.number() }),
      size: z.object({ width: z.number(), height: z.number() }),
      zIndex: z.number().optional(),
    })
  ),
  viewportSize: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

export type ComponentLayout = z.infer<typeof ComponentLayoutSchema>;

export const A11yContextSchema = z.object({
  colorVisionTypes: z
    .array(z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia']))
    .default(['normal']),
  contrastLevel: z.enum(['AA', 'AAA']).default('AA'),
  screenReader: z.boolean().default(false),
  motorImpairments: z.boolean().default(false),
  cognitiveImpairments: z.boolean().default(false),
});

export type A11yContext = z.infer<typeof A11yContextSchema>;

export const IntelligenceResultSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  confidence: z.number().min(0).max(1),
  timestamp: z.string(),
});

export type IntelligenceResult<T> =
  | {
      success: true;
      data: T;
      confidence: number;
      timestamp: string;
    }
  | {
      success: false;
      error: string;
      confidence: number;
      timestamp: string;
    };

export const ComponentIntelligenceAnalysisSchema = z.object({
  cognitiveLoadScore: z.number().min(0).max(10),
  millerRuleCompliance: z.boolean(),
  attentionWeight: z.number().min(0).max(1),
  trustPatterns: z.array(z.string()),
  accessibilityGaps: z.array(z.string()),
  recommendations: z.array(
    z.object({
      type: z.enum(['cognitive', 'attention', 'accessibility', 'trust']),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      description: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
});

export type ComponentIntelligenceAnalysis = z.infer<typeof ComponentIntelligenceAnalysisSchema>;

export const OptimizedCompositionSchema = z.object({
  optimizedLayout: ComponentLayoutSchema,
  cognitiveLoadDistribution: z.array(
    z.object({
      component: z.string(),
      load: z.number(),
      justification: z.string(),
    })
  ),
  attentionFlow: z.array(
    z.object({
      step: z.number(),
      component: z.string(),
      reason: z.string(),
    })
  ),
  improvements: z.array(z.string()),
  accessibilityScore: z.number().min(0).max(100),
});

export type OptimizedComposition = z.infer<typeof OptimizedCompositionSchema>;

export const AttentionHierarchyAnalysisSchema = z.object({
  primaryAttentionTarget: z.string().optional(),
  secondaryTargets: z.array(z.string()),
  visualWeight: z.record(z.string(), z.number()),
  attentionFlow: z.array(z.string()),
  violations: z.array(
    z.object({
      type: z.enum(['competing_primary', 'weak_hierarchy', 'cognitive_overload']),
      components: z.array(z.string()),
      severity: z.enum(['warning', 'error']),
      suggestion: z.string(),
    })
  ),
});

export type AttentionHierarchyAnalysis = z.infer<typeof AttentionHierarchyAnalysisSchema>;

export const AccessibilityAnalysisSchema = z.object({
  wcagCompliance: z.object({
    level: z.enum(['A', 'AA', 'AAA', 'FAIL']),
    violations: z.array(
      z.object({
        guideline: z.string(),
        description: z.string(),
        impact: z.enum(['minor', 'moderate', 'serious', 'critical']),
        suggestion: z.string(),
      })
    ),
  }),
  colorVisionAnalysis: z.record(
    z.string(),
    z.object({
      accessible: z.boolean(),
      contrastRatio: z.number(),
      recommendations: z.array(z.string()),
    })
  ),
  touchTargetAnalysis: z.object({
    compliant: z.boolean(),
    minSize: z.number(),
    violations: z.array(z.string()),
  }),
  cognitiveAccessibility: z.object({
    score: z.number().min(0).max(100),
    simplificationSuggestions: z.array(z.string()),
  }),
});

export type AccessibilityAnalysis = z.infer<typeof AccessibilityAnalysisSchema>;

// ===== COGNITIVE LOAD MODEL =====

export class CognitiveLoadModel {
  private readonly MILLER_RULE_LIMIT = 7;
  private readonly ATTENTION_SPAN_WEIGHTS = {
    primary: 1.0,
    secondary: 0.6,
    tertiary: 0.3,
  };

  /**
   * Calculate cognitive load using Miller's 7±2 rule
   */
  calculateCognitiveLoad(elements: number, interactions: number, complexity: number): number {
    const baseLoad = Math.min(elements / this.MILLER_RULE_LIMIT, 1.0) * 4;
    const interactionLoad = Math.min(interactions / 3, 1.0) * 3;
    const complexityLoad = (complexity / 10) * 3;

    return Math.min(baseLoad + interactionLoad + complexityLoad, 10);
  }

  /**
   * Assess Miller's rule compliance
   */
  assessMillerCompliance(elementCount: number): boolean {
    return elementCount <= this.MILLER_RULE_LIMIT;
  }

  /**
   * Calculate attention weight based on component hierarchy
   */
  calculateAttentionWeight(
    _componentName: string,
    intelligence: Intelligence,
    _context: ComponentAnalysisContext
  ): number {
    const attentionEconomics = intelligence.attentionEconomics.toLowerCase();

    if (attentionEconomics.includes('primary')) {
      return this.ATTENTION_SPAN_WEIGHTS.primary;
    }
    if (attentionEconomics.includes('secondary')) {
      return this.ATTENTION_SPAN_WEIGHTS.secondary;
    }
    return this.ATTENTION_SPAN_WEIGHTS.tertiary;
  }
}

// ===== COMPONENT INTELLIGENCE SERVICE =====

export class ComponentIntelligenceService {
  private cognitiveModel: CognitiveLoadModel;

  constructor() {
    this.cognitiveModel = new CognitiveLoadModel();
  }

  /**
   * Analyze component intelligence with cognitive load assessment
   */
  async analyzeComponent(
    componentName: string,
    intelligence: Intelligence,
    context: Partial<ComponentAnalysisContext> = {}
  ): Promise<IntelligenceResult<ComponentIntelligenceAnalysis>> {
    try {
      const validatedContext = ComponentAnalysisContextSchema.parse(context);

      // Extract cognitive elements from intelligence metadata
      const cognitiveLoad = intelligence.cognitiveLoad;
      const attentionWeight = this.cognitiveModel.calculateAttentionWeight(
        componentName,
        intelligence,
        validatedContext
      );

      // Analyze trust patterns
      const trustPatterns = this.extractTrustPatterns(intelligence.trustBuilding);

      // Identify accessibility gaps
      const accessibilityGaps = this.identifyAccessibilityGaps(
        intelligence.accessibility,
        validatedContext
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        componentName,
        intelligence,
        validatedContext,
        cognitiveLoad,
        attentionWeight
      );

      const analysis: ComponentIntelligenceAnalysis = {
        cognitiveLoadScore: cognitiveLoad,
        millerRuleCompliance: cognitiveLoad <= 7,
        attentionWeight,
        trustPatterns,
        accessibilityGaps,
        recommendations,
      };

      return {
        success: true,
        data: analysis,
        confidence: 0.9,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Component analysis failed: ${error instanceof Error ? error.message : String(error)}`,
        confidence: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Optimize component composition for cognitive load
   */
  async optimizeComposition(
    components: readonly ComponentRegistry[],
    constraints: Partial<CompositionConstraints> = {}
  ): Promise<IntelligenceResult<OptimizedComposition>> {
    try {
      const validatedConstraints = CompositionConstraintsSchema.parse(constraints);

      // Calculate total cognitive load
      const totalCognitiveLoad = components.reduce(
        (sum, comp) => sum + comp.meta.rafters.intelligence.cognitiveLoad,
        0
      );

      if (totalCognitiveLoad > validatedConstraints.maxCognitiveLoad) {
        // Optimize by reducing cognitive load
        const optimizedComponents = this.reduceCompositionComplexity(
          components,
          validatedConstraints
        );

        const optimizedLayout = this.generateOptimizedLayout(optimizedComponents);
        const cognitiveLoadDistribution = this.calculateLoadDistribution(optimizedComponents);
        const attentionFlow = this.calculateAttentionFlow(optimizedComponents);

        const composition: OptimizedComposition = {
          optimizedLayout,
          cognitiveLoadDistribution,
          attentionFlow,
          improvements: [
            `Reduced cognitive load from ${totalCognitiveLoad} to ${cognitiveLoadDistribution.reduce((sum, item) => sum + item.load, 0)}`,
            'Optimized attention hierarchy for better user flow',
            "Applied Miller's 7±2 rule for element grouping",
          ],
          accessibilityScore: this.calculateAccessibilityScore(optimizedComponents),
        };

        return {
          success: true,
          data: composition,
          confidence: 0.85,
          timestamp: new Date().toISOString(),
        };
      }

      // Composition already optimal
      const layout = this.generateOptimizedLayout(components);
      const composition: OptimizedComposition = {
        optimizedLayout: layout,
        cognitiveLoadDistribution: this.calculateLoadDistribution(components),
        attentionFlow: this.calculateAttentionFlow(components),
        improvements: ['Composition already optimized for cognitive load'],
        accessibilityScore: this.calculateAccessibilityScore(components),
      };

      return {
        success: true,
        data: composition,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Composition optimization failed: ${error instanceof Error ? error.message : String(error)}`,
        confidence: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Assess attention hierarchy in layout
   */
  async assessAttentionHierarchy(
    layout: ComponentLayout
  ): Promise<IntelligenceResult<AttentionHierarchyAnalysis>> {
    try {
      const validatedLayout = ComponentLayoutSchema.parse(layout);

      // Validate viewport size
      if (validatedLayout.viewportSize.width <= 0 || validatedLayout.viewportSize.height <= 0) {
        throw new Error('Invalid viewport size: width and height must be positive');
      }

      // Analyze attention hierarchy
      const visualWeights: Record<string, number> = {};
      const attentionFlow: string[] = [];
      let primaryTarget: string | undefined;
      const secondaryTargets: string[] = [];

      // Calculate visual weights based on position and size
      for (const component of validatedLayout.components) {
        const weight = this.calculateVisualWeight(component, validatedLayout.viewportSize);
        visualWeights[component.name] = weight;

        if (weight > 0.7 && !primaryTarget) {
          primaryTarget = component.name;
        } else if (weight > 0.4) {
          secondaryTargets.push(component.name);
        }
      }

      // Generate attention flow (F-pattern for Western cultures)
      const sortedComponents = validatedLayout.components.sort(
        (a, b) => a.position.y - b.position.y || a.position.x - b.position.x
      );

      for (const component of sortedComponents) {
        attentionFlow.push(component.name);
      }

      // Identify violations
      const violations = this.identifyAttentionViolations(
        validatedLayout.components,
        visualWeights
      );

      const analysis: AttentionHierarchyAnalysis = {
        primaryAttentionTarget: primaryTarget,
        secondaryTargets,
        visualWeight: visualWeights,
        attentionFlow,
        violations,
      };

      return {
        success: true,
        data: analysis,
        confidence: 0.88,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Attention hierarchy assessment failed: ${error instanceof Error ? error.message : String(error)}`,
        confidence: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Validate accessibility compliance
   */
  async validateAccessibility(
    _componentName: string,
    intelligence: Intelligence,
    context: Partial<A11yContext> = {}
  ): Promise<IntelligenceResult<AccessibilityAnalysis>> {
    try {
      const validatedContext = A11yContextSchema.parse(context);

      // WCAG compliance analysis
      const wcagCompliance = this.analyzeWCAGCompliance(intelligence, validatedContext);

      // Color vision analysis
      const colorVisionAnalysis = this.analyzeColorVision(intelligence, validatedContext);

      // Touch target analysis
      const touchTargetAnalysis = this.analyzeTouchTargets(intelligence, validatedContext);

      // Cognitive accessibility
      const cognitiveAccessibility = this.analyzeCognitiveAccessibility(intelligence);

      const analysis: AccessibilityAnalysis = {
        wcagCompliance,
        colorVisionAnalysis,
        touchTargetAnalysis,
        cognitiveAccessibility,
      };

      return {
        success: true,
        data: analysis,
        confidence: 0.92,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Accessibility validation failed: ${error instanceof Error ? error.message : String(error)}`,
        confidence: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private extractTrustPatterns(trustBuilding: string): string[] {
    const patterns: string[] = [];
    const lowerTrust = trustBuilding.toLowerCase();

    if (lowerTrust.includes('confirmation')) patterns.push('confirmation_pattern');
    if (lowerTrust.includes('loading')) patterns.push('loading_state');
    if (lowerTrust.includes('feedback')) patterns.push('visual_feedback');
    if (lowerTrust.includes('error')) patterns.push('error_prevention');
    if (lowerTrust.includes('undo')) patterns.push('reversibility');

    return patterns;
  }

  private identifyAccessibilityGaps(
    accessibility: string,
    context: ComponentAnalysisContext
  ): string[] {
    const gaps: string[] = [];
    const lowerA11y = accessibility.toLowerCase();

    if (!lowerA11y.includes('wcag')) gaps.push('wcag_compliance_unspecified');
    if (!lowerA11y.includes('keyboard')) gaps.push('keyboard_navigation');
    if (!lowerA11y.includes('screen reader')) gaps.push('screen_reader_support');
    if (!lowerA11y.includes('contrast')) gaps.push('color_contrast');
    if (context.deviceContext === 'mobile' && !lowerA11y.includes('touch')) {
      gaps.push('touch_target_size');
    }

    return gaps;
  }

  private generateRecommendations(
    _componentName: string,
    intelligence: Intelligence,
    context: ComponentAnalysisContext,
    cognitiveLoad: number,
    attentionWeight: number
  ): ComponentIntelligenceAnalysis['recommendations'] {
    const recommendations: ComponentIntelligenceAnalysis['recommendations'] = [];

    // Cognitive load recommendations
    if (cognitiveLoad > 7) {
      recommendations.push({
        type: 'cognitive',
        priority: 'high',
        description: `Cognitive load (${cognitiveLoad}/10) exceeds Miller's rule. Consider simplifying or breaking into smaller components.`,
        confidence: 0.9,
      });
    }

    // Attention recommendations
    if (
      attentionWeight > 0.8 &&
      intelligence.attentionEconomics.toLowerCase().includes('primary')
    ) {
      recommendations.push({
        type: 'attention',
        priority: 'medium',
        description:
          'High attention weight detected. Ensure only one primary attention target per section.',
        confidence: 0.85,
      });
    }

    // Accessibility recommendations
    if (
      intelligence.accessibility.toLowerCase().includes('aa') &&
      context.userExpertise === 'novice'
    ) {
      recommendations.push({
        type: 'accessibility',
        priority: 'high',
        description: 'Consider AAA compliance for novice users to improve usability.',
        confidence: 0.8,
      });
    }

    // Trust recommendations
    if (intelligence.trustBuilding.toLowerCase().includes('destructive')) {
      recommendations.push({
        type: 'trust',
        priority: 'critical',
        description:
          'Destructive action detected. Ensure confirmation patterns and clear error states.',
        confidence: 0.95,
      });
    }

    return recommendations;
  }

  private reduceCompositionComplexity(
    components: readonly ComponentRegistry[],
    constraints: CompositionConstraints
  ): ComponentRegistry[] {
    // Sort components by cognitive load (ascending)
    const sortedComponents = [...components].sort(
      (a, b) =>
        a.meta.rafters.intelligence.cognitiveLoad - b.meta.rafters.intelligence.cognitiveLoad
    );

    const optimized: ComponentRegistry[] = [];
    let totalLoad = 0;

    for (const component of sortedComponents) {
      const componentLoad = component.meta.rafters.intelligence.cognitiveLoad;
      if (totalLoad + componentLoad <= constraints.maxCognitiveLoad) {
        optimized.push(component);
        totalLoad += componentLoad;
      }
    }

    return optimized;
  }

  private generateOptimizedLayout(components: readonly ComponentRegistry[]): ComponentLayout {
    // Generate a simple optimal layout based on attention hierarchy
    const layoutComponents = components.map((component, index) => ({
      name: component.name,
      position: {
        x: (index % 3) * 300, // Simple grid layout
        y: Math.floor(index / 3) * 200,
      },
      size: {
        width: 280,
        height: 180,
      },
    }));

    return {
      components: layoutComponents,
      viewportSize: {
        width: 1200,
        height: 800,
      },
    };
  }

  private calculateLoadDistribution(components: readonly ComponentRegistry[]) {
    return components.map((component) => ({
      component: component.name,
      load: component.meta.rafters.intelligence.cognitiveLoad,
      justification: `Component cognitive load based on intelligence metadata: ${component.meta.rafters.intelligence.attentionEconomics}`,
    }));
  }

  private calculateAttentionFlow(components: readonly ComponentRegistry[]) {
    // Sort by attention hierarchy (primary first)
    const sorted = [...components].sort((a, b) => {
      const aEcon = a.meta.rafters.intelligence.attentionEconomics.toLowerCase();
      const bEcon = b.meta.rafters.intelligence.attentionEconomics.toLowerCase();

      if (aEcon.includes('primary') && !bEcon.includes('primary')) return -1;
      if (!aEcon.includes('primary') && bEcon.includes('primary')) return 1;
      if (aEcon.includes('secondary') && bEcon.includes('tertiary')) return -1;
      if (aEcon.includes('tertiary') && bEcon.includes('secondary')) return 1;

      return 0;
    });

    return sorted.map((component, index) => ({
      step: index + 1,
      component: component.name,
      reason: `${component.meta.rafters.intelligence.attentionEconomics} attention level`,
    }));
  }

  private calculateAccessibilityScore(components: readonly ComponentRegistry[]): number {
    let totalScore = 0;
    let componentCount = 0;

    for (const component of components) {
      const a11y = component.meta.rafters.intelligence.accessibility.toLowerCase();
      let score = 60; // Base score

      if (a11y.includes('wcag aaa')) score = 100;
      else if (a11y.includes('wcag aa')) score = 85;
      else if (a11y.includes('wcag a')) score = 70;

      if (a11y.includes('keyboard')) score += 5;
      if (a11y.includes('screen reader')) score += 5;
      if (a11y.includes('high contrast')) score += 5;

      totalScore += Math.min(score, 100);
      componentCount++;
    }

    return componentCount > 0 ? Math.round(totalScore / componentCount) : 0;
  }

  private calculateVisualWeight(
    component: ComponentLayout['components'][0],
    viewportSize: { width: number; height: number }
  ): number {
    // Calculate visual weight based on position, size, and viewport
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;

    // Distance from center (normalized)
    const centerDistance = Math.sqrt(
      (component.position.x - centerX) ** 2 + (component.position.y - centerY) ** 2
    );
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const centerWeight = 1 - centerDistance / maxDistance;

    // Size weight (normalized)
    const sizeWeight =
      (component.size.width * component.size.height) / (viewportSize.width * viewportSize.height);

    // Z-index weight (give more importance to z-index)
    const zWeight = (component.zIndex || 0) / 10;

    return Math.min(centerWeight * 0.3 + sizeWeight * 0.3 + zWeight * 0.4, 1.0);
  }

  private identifyAttentionViolations(
    components: ComponentLayout['components'],
    visualWeights: Record<string, number>
  ) {
    const violations: AttentionHierarchyAnalysis['violations'] = [];

    // Check for competing primary attention targets
    const primaryTargets = components.filter((comp) => visualWeights[comp.name] > 0.7);
    if (primaryTargets.length > 1) {
      violations.push({
        type: 'competing_primary',
        components: primaryTargets.map((comp) => comp.name),
        severity: 'error',
        suggestion: 'Reduce visual weight of secondary elements to establish clear hierarchy',
      });
    }

    // Check for weak hierarchy (all elements similar weight) - only if no competing primary
    if (violations.length === 0) {
      const weights = Object.values(visualWeights);
      const maxWeight = Math.max(...weights);
      const minWeight = Math.min(...weights);
      if (maxWeight - minWeight < 0.3) {
        violations.push({
          type: 'weak_hierarchy',
          components: components.map((comp) => comp.name),
          severity: 'warning',
          suggestion: 'Increase contrast between primary and secondary elements',
        });
      }
    }

    return violations;
  }

  private analyzeWCAGCompliance(intelligence: Intelligence, _context: A11yContext) {
    const a11y = intelligence.accessibility.toLowerCase();
    let level: 'A' | 'AA' | 'AAA' | 'FAIL' = 'FAIL';
    const violations: AccessibilityAnalysis['wcagCompliance']['violations'] = [];

    if (a11y.includes('wcag aaa')) level = 'AAA';
    else if (a11y.includes('wcag aa')) level = 'AA';
    else if (a11y.includes('wcag a')) level = 'A';

    if (level === 'FAIL') {
      violations.push({
        guideline: 'WCAG 2.1',
        description: 'No WCAG compliance specified',
        impact: 'critical',
        suggestion: 'Ensure component meets at least WCAG AA standards',
      });
    }

    if (!a11y.includes('keyboard')) {
      violations.push({
        guideline: 'WCAG 2.1.1',
        description: 'Keyboard navigation not specified',
        impact: 'serious',
        suggestion: 'Ensure all interactive elements are keyboard accessible',
      });
    }

    return { level, violations };
  }

  private analyzeColorVision(intelligence: Intelligence, context: A11yContext) {
    const analysis: Record<
      string,
      {
        accessible: boolean;
        contrastRatio: number;
        recommendations: string[];
      }
    > = {};

    for (const visionType of context.colorVisionTypes) {
      analysis[visionType] = {
        accessible: intelligence.accessibility.toLowerCase().includes('contrast'),
        contrastRatio: 4.5, // Default assumption for AA
        recommendations: visionType !== 'normal' ? ['Test with color vision simulation tools'] : [],
      };
    }

    return analysis;
  }

  private analyzeTouchTargets(intelligence: Intelligence, _context: A11yContext) {
    const a11y = intelligence.accessibility.toLowerCase();
    const hasMinSize = a11y.includes('44px') || a11y.includes('touch target');

    return {
      compliant: hasMinSize,
      minSize: hasMinSize ? 44 : 32, // Assume 32px if not specified
      violations: hasMinSize ? [] : ['Touch target size below 44px minimum'],
    };
  }

  private analyzeCognitiveAccessibility(intelligence: Intelligence) {
    const cognitiveLoad = intelligence.cognitiveLoad;
    const score = Math.max(0, 100 - (cognitiveLoad - 1) * 12); // Penalty for high cognitive load

    const suggestions: string[] = [];
    if (cognitiveLoad > 5) {
      suggestions.push('Simplify component interactions');
      suggestions.push('Add progressive disclosure patterns');
    }
    if (cognitiveLoad > 7) {
      suggestions.push('Consider breaking into multiple smaller components');
    }

    return { score, simplificationSuggestions: suggestions };
  }
}
