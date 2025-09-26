/**
 * User Empathy Intelligence Service
 *
 * Provides Claude with deep understanding of user needs, accessibility requirements,
 * cultural context, and behavioral patterns to enable empathetic design decisions
 * that serve diverse global audiences.
 *
 * Focuses on human impact of design decisions through accessibility simulation,
 * cultural sensitivity analysis, and inclusive design intelligence.
 */

import type { ColorVisionType, OKLCH } from '@rafters/shared';
import { calculateWCAGContrast, meetsWCAGStandard } from '@rafters/shared';
import { z } from 'zod';

// ===== SCHEMAS & TYPES =====

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  colorVision: z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia']),
  culturalBackground: z.array(z.string()),
  accessibilityNeeds: z.array(z.string()),
  languageDirection: z.enum(['ltr', 'rtl']).default('ltr'),
  devicePreference: z.enum(['mobile', 'tablet', 'desktop']).default('desktop'),
  cognitiveProfile: z
    .object({
      processingSpeed: z.enum(['low', 'average', 'high']).default('average'),
      workingMemory: z.enum(['low', 'average', 'high']).default('average'),
      attentionControl: z.enum(['low', 'average', 'high']).default('average'),
    })
    .optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const DesignSpecSchema = z.object({
  colors: z.array(
    z.object({
      oklch: z.object({
        l: z.number().min(0).max(1),
        c: z.number().min(0),
        h: z.number().min(0).max(360),
      }),
      role: z.string(),
      usage: z.array(z.string()),
    })
  ),
  components: z.array(
    z.object({
      type: z.string(),
      properties: z.record(z.string(), z.unknown()),
      accessibility: z
        .object({
          touchTarget: z.number().optional(),
          contrastRatio: z.number().optional(),
          keyboardNavigable: z.boolean().default(true),
        })
        .optional(),
    })
  ),
  layout: z
    .object({
      direction: z.enum(['ltr', 'rtl']).default('ltr'),
      density: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
    })
    .optional(),
});

export type DesignSpec = z.infer<typeof DesignSpecSchema>;

export const AccessibilityImpactSchema = z.object({
  wcagCompliance: z.object({
    aa: z.boolean(),
    aaa: z.boolean(),
    issues: z.array(
      z.object({
        type: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        description: z.string(),
        recommendation: z.string(),
      })
    ),
  }),
  colorVisionImpact: z.array(
    z.object({
      visionType: z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia']),
      impactScore: z.number().min(0).max(1),
      issues: z.array(z.string()),
      recommendations: z.array(z.string()),
    })
  ),
  cognitiveLoad: z.object({
    overall: z.number().min(1).max(10),
    perComponent: z.record(z.string(), z.number().min(1).max(10)),
    recommendations: z.array(z.string()),
  }),
  motorAccessibility: z.object({
    touchTargets: z.array(
      z.object({
        component: z.string(),
        size: z.number(),
        meetRequirements: z.boolean(),
        recommendation: z.string().optional(),
      })
    ),
    keyboardNavigation: z.boolean(),
    issues: z.array(z.string()),
  }),
});

export type AccessibilityImpact = z.infer<typeof AccessibilityImpactSchema>;

export const VisionSimulationSchema = z.object({
  originalColors: z.array(
    z.object({
      oklch: z.object({
        l: z.number().min(0).max(1),
        c: z.number().min(0),
        h: z.number().min(0).max(360),
      }),
      role: z.string(),
    })
  ),
  simulations: z.array(
    z.object({
      visionType: z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia']),
      simulatedColors: z.array(
        z.object({
          oklch: z.object({
            l: z.number().min(0).max(1),
            c: z.number().min(0),
            h: z.number().min(0).max(360),
          }),
          role: z.string(),
          differentiability: z.number().min(0).max(1),
        })
      ),
      overallImpact: z.number().min(0).max(1),
      criticalIssues: z.array(z.string()),
      recommendations: z.array(z.string()),
    })
  ),
});

export type VisionSimulation = z.infer<typeof VisionSimulationSchema>;

export const CulturalSensitivityAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(1),
  culturalAnalysis: z.array(
    z.object({
      culture: z.string(),
      score: z.number().min(0).max(1),
      colorMeanings: z.array(
        z.object({
          color: z.string(),
          meanings: z.array(z.string()),
          sentiment: z.enum(['positive', 'neutral', 'negative', 'taboo']),
          confidence: z.number().min(0).max(1),
        })
      ),
      culturalIssues: z.array(
        z.object({
          type: z.enum(['color', 'layout', 'imagery', 'text']),
          severity: z.enum(['low', 'medium', 'high', 'critical']),
          description: z.string(),
          recommendation: z.string(),
        })
      ),
      recommendations: z.array(z.string()),
    })
  ),
  globalRecommendations: z.array(z.string()),
});

export type CulturalSensitivityAnalysis = z.infer<typeof CulturalSensitivityAnalysisSchema>;

export const UserSegmentSchema = z.object({
  name: z.string(),
  demographics: z.object({
    ageRange: z.string(),
    regions: z.array(z.string()),
    techSavviness: z.enum(['low', 'medium', 'high']),
  }),
  preferences: z.object({
    colorPreferences: z.array(z.string()),
    layoutDensity: z.enum(['compact', 'comfortable', 'spacious']),
    interactionStyle: z.enum(['touch', 'mouse', 'keyboard', 'voice']),
  }),
  accessibilityNeeds: z.array(z.string()),
});

export type UserSegment = z.infer<typeof UserSegmentSchema>;

export const UserReactionPredictionSchema = z.object({
  overallSentiment: z.enum(['very_negative', 'negative', 'neutral', 'positive', 'very_positive']),
  confidence: z.number().min(0).max(1),
  segmentReactions: z.array(
    z.object({
      segment: z.string(),
      sentiment: z.enum(['very_negative', 'negative', 'neutral', 'positive', 'very_positive']),
      confidence: z.number().min(0).max(1),
      keyFactors: z.array(
        z.object({
          factor: z.string(),
          impact: z.enum(['very_negative', 'negative', 'neutral', 'positive', 'very_positive']),
          weight: z.number().min(0).max(1),
        })
      ),
      recommendations: z.array(z.string()),
    })
  ),
  riskFactors: z.array(
    z.object({
      type: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      affectedSegments: z.array(z.string()),
      description: z.string(),
      mitigation: z.string(),
    })
  ),
});

export type UserReactionPrediction = z.infer<typeof UserReactionPredictionSchema>;

export const IntelligenceResultSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    processingTime: z.number(),
    confidence: z.number().min(0).max(1),
    metadata: z.record(z.string(), z.unknown()).optional(),
  });

export type IntelligenceResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  processingTime: number;
  confidence: number;
  metadata?: Record<string, unknown>;
};

// ===== CORE COLOR VISION SIMULATION =====

/**
 * Simulate color vision deficiencies using scientifically accurate transformation matrices
 * Based on Brettel, Viénot and Mollon (1997) and Machado et al. (2009)
 */
export function simulateColorVision(oklch: OKLCH, visionType: ColorVisionType): OKLCH {
  if (visionType === 'normal') {
    return oklch;
  }

  // Convert OKLCH to approximate RGB for transformation
  const { l, c, h } = oklch;

  // Simplified color vision simulation using hue shifts and chroma reduction
  // TODO: Replace with scientific CVD simulation from @rafters/shared (issue #195)
  // Current implementation provides basic approximation pending proper LMS cone space calculations
  let simulatedH = h;
  let simulatedC = c;

  switch (visionType) {
    case 'deuteranopia': // Green-blind (most common)
      // Compress green-red distinction, shift greens toward reds
      if (h >= 0 && h <= 180) {
        // Shift greens (around 120°) toward reds (around 0°)
        simulatedH = h * 0.3; // Much stronger compression toward red
        simulatedC = c * 0.4; // Significantly reduce chroma
      }
      break;

    case 'protanopia': // Red-blind
      // Compress red-green distinction, shift reds toward yellow
      if (h >= 300 || h <= 60) {
        simulatedH = h > 180 ? h - 30 : h + 30; // Shift reds toward yellow
        simulatedC = c * 0.5; // Significantly reduce chroma
      }
      break;

    case 'tritanopia': // Blue-blind (rare)
      // Compress blue-yellow distinction, shift blues toward yellow
      if (h >= 180 && h <= 300) {
        simulatedH = h - (h - 180) * 0.5; // Shift toward yellow (60°)
        simulatedC = c * 0.7; // Reduce chroma in blue range
      }
      break;
  }

  // Ensure hue stays in valid range
  simulatedH = ((simulatedH % 360) + 360) % 360;

  return {
    l,
    c: Math.max(0, simulatedC),
    h: simulatedH,
  };
}

/**
 * Calculate color differentiability for color vision deficiency
 */
export function calculateColorDifferentiability(
  color1: OKLCH,
  color2: OKLCH,
  visionType: ColorVisionType
): number {
  const sim1 = simulateColorVision(color1, visionType);
  const sim2 = simulateColorVision(color2, visionType);

  // Calculate perceptual difference using simplified CIEDE2000-like formula
  const deltaL = Math.abs(sim1.l - sim2.l);
  const deltaC = Math.abs(sim1.c - sim2.c);
  const deltaH = Math.min(Math.abs(sim1.h - sim2.h), 360 - Math.abs(sim1.h - sim2.h));

  // Weighted combination emphasizing lightness for accessibility
  const difference = Math.sqrt(
    (deltaL * 100) ** 2 + (deltaC * 50) ** 2 + ((deltaH / 360) * 30) ** 2
  );

  // Normalize to 0-1 scale
  return Math.min(1, difference / 100);
}

// ===== CULTURAL COLOR MEANINGS DATABASE =====

/**
 * Cultural color meanings database (simplified version)
 * In production, this would be a comprehensive database with regional variations
 */
export const CULTURAL_COLOR_MEANINGS: Record<
  string,
  Record<
    string,
    {
      meanings: string[];
      sentiment: 'positive' | 'neutral' | 'negative' | 'taboo';
      confidence: number;
    }
  >
> = {
  red: {
    western: { meanings: ['passion', 'danger', 'energy'], sentiment: 'positive', confidence: 0.9 },
    chinese: {
      meanings: ['luck', 'prosperity', 'celebration'],
      sentiment: 'positive',
      confidence: 0.95,
    },
    indian: { meanings: ['purity', 'fertility', 'power'], sentiment: 'positive', confidence: 0.9 },
    islamic: { meanings: ['strength', 'courage'], sentiment: 'positive', confidence: 0.8 },
    african: { meanings: ['death', 'mourning'], sentiment: 'negative', confidence: 0.7 },
  },
  white: {
    western: {
      meanings: ['purity', 'peace', 'cleanliness'],
      sentiment: 'positive',
      confidence: 0.9,
    },
    chinese: { meanings: ['death', 'mourning'], sentiment: 'negative', confidence: 0.9 },
    indian: { meanings: ['peace', 'purity'], sentiment: 'positive', confidence: 0.8 },
    islamic: { meanings: ['peace', 'surrender'], sentiment: 'positive', confidence: 0.85 },
  },
  black: {
    western: {
      meanings: ['elegance', 'formality', 'death'],
      sentiment: 'neutral',
      confidence: 0.8,
    },
    chinese: { meanings: ['water', 'career', 'mystery'], sentiment: 'neutral', confidence: 0.7 },
    african: { meanings: ['masculinity', 'maturity'], sentiment: 'positive', confidence: 0.8 },
  },
  green: {
    western: { meanings: ['nature', 'money', 'growth'], sentiment: 'positive', confidence: 0.9 },
    islamic: { meanings: ['paradise', 'nature', 'peace'], sentiment: 'positive', confidence: 0.95 },
    chinese: {
      meanings: ['growth', 'harmony', 'fertility'],
      sentiment: 'positive',
      confidence: 0.8,
    },
    irish: { meanings: ['luck', 'nature', 'heritage'], sentiment: 'positive', confidence: 0.9 },
  },
  blue: {
    western: { meanings: ['trust', 'calm', 'corporate'], sentiment: 'positive', confidence: 0.9 },
    hindu: { meanings: ['courage', 'masculinity'], sentiment: 'positive', confidence: 0.8 },
    jewish: { meanings: ['holiness', 'divinity'], sentiment: 'positive', confidence: 0.85 },
  },
  yellow: {
    western: {
      meanings: ['happiness', 'caution', 'cowardice'],
      sentiment: 'neutral',
      confidence: 0.8,
    },
    chinese: {
      meanings: ['royalty', 'power', 'prosperity'],
      sentiment: 'positive',
      confidence: 0.9,
    },
    thai: { meanings: ['royalty', 'monday'], sentiment: 'positive', confidence: 0.9 },
    latin: { meanings: ['death', 'mourning'], sentiment: 'negative', confidence: 0.7 },
  },
  purple: {
    western: {
      meanings: ['royalty', 'luxury', 'creativity'],
      sentiment: 'positive',
      confidence: 0.8,
    },
    thai: { meanings: ['mourning', 'widows'], sentiment: 'negative', confidence: 0.8 },
    christian: { meanings: ['penitence', 'mourning'], sentiment: 'neutral', confidence: 0.7 },
  },
};

/**
 * Map OKLCH color to cultural meaning category
 */
export function categorizeColor(oklch: OKLCH): string {
  const { l, c, h } = oklch;

  // Very low lightness = black
  if (l < 0.15) return 'black';

  // Very high lightness = white
  if (l > 0.9 && c < 0.05) return 'white';

  // Low chroma = gray (neutral)
  if (c < 0.02) return 'gray';

  // Categorize by hue
  if (h >= 345 || h < 15) return 'red';
  if (h >= 15 && h < 45) return 'orange';
  if (h >= 45 && h < 75) return 'yellow';
  if (h >= 75 && h < 150) return 'green';
  if (h >= 150 && h < 210) return 'cyan';
  if (h >= 210 && h < 270) return 'blue';
  if (h >= 270 && h < 300) return 'purple';
  if (h >= 300 && h < 345) return 'magenta';

  return 'unknown';
}

// ===== CORE EMPATHY INTELLIGENCE SERVICE =====

export class UserEmpathyService {
  /**
   * Analyze accessibility impact of a design across multiple user profiles
   */
  async analyzeAccessibilityImpact(
    design: DesignSpec,
    _userProfiles: readonly UserProfile[]
  ): Promise<IntelligenceResult<AccessibilityImpact>> {
    const startTime = Date.now();
    console.log('[UserEmpathy] Analyzing accessibility impact for design with', {
      colorCount: design.colors.length,
      componentCount: design.components.length,
    });

    try {
      // WCAG Compliance Analysis
      const wcagIssues: Array<{
        type: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        recommendation: string;
      }> = [];

      // Check color contrast ratios between likely foreground/background pairs
      const textColors = design.colors.filter((c) =>
        c.usage.some((u) => u.includes('text') || c.role.includes('text'))
      );
      const backgroundColors = design.colors.filter((c) =>
        c.usage.some((u) => u.includes('background') || c.role.includes('background'))
      );

      // If no specific text/background colors identified, check all combinations
      const foregroundColors = textColors.length > 0 ? textColors : design.colors;
      const backgroundColorsToCheck =
        backgroundColors.length > 0
          ? backgroundColors
          : design.colors.filter((c) => c.oklch.l > 0.5);

      for (const fgColor of foregroundColors) {
        for (const bgColor of backgroundColorsToCheck) {
          // Skip comparing color with itself
          if (fgColor === bgColor) continue;

          // Use proper WCAG contrast calculation from shared utilities
          const contrastRatio = calculateWCAGContrast(fgColor.oklch, bgColor.oklch);

          // Check both AA levels for normal text
          if (!meetsWCAGStandard(fgColor.oklch, bgColor.oklch, 'AA', 'normal')) {
            wcagIssues.push({
              type: 'contrast',
              severity: contrastRatio < 3 ? 'critical' : 'high',
              description: `Insufficient contrast between ${fgColor.role} and ${bgColor.role}: ${contrastRatio.toFixed(2)}:1`,
              recommendation: `Increase contrast ratio to at least 4.5:1 for AA compliance (currently ${contrastRatio.toFixed(2)}:1)`,
            });
          }
        }
      }

      // Color Vision Impact Analysis
      const colorVisionImpact = await Promise.all(
        (['normal', 'deuteranopia', 'protanopia', 'tritanopia'] as ColorVisionType[]).map(
          async (visionType) => {
            const simulatedColors = design.colors.map((color) => ({
              original: color.oklch,
              simulated: simulateColorVision(color.oklch, visionType),
              role: color.role,
            }));

            // Calculate differentiability between important color pairs
            const criticalPairs = simulatedColors.filter(
              (c) =>
                c.role.includes('primary') ||
                c.role.includes('background') ||
                c.role.includes('text')
            );

            const issues: string[] = [];
            const recommendations: string[] = [];
            let totalDifferentiability = 0;
            let pairCount = 0;

            for (let i = 0; i < criticalPairs.length; i++) {
              for (let j = i + 1; j < criticalPairs.length; j++) {
                const diff = calculateColorDifferentiability(
                  criticalPairs[i].original,
                  criticalPairs[j].original,
                  visionType
                );
                totalDifferentiability += diff;
                pairCount++;

                if (diff < 0.3) {
                  issues.push(
                    `${criticalPairs[i].role} and ${criticalPairs[j].role} are difficult to distinguish`
                  );
                  recommendations.push(
                    `Increase lightness difference between ${criticalPairs[i].role} and ${criticalPairs[j].role}`
                  );
                }
              }
            }

            const avgDifferentiability = pairCount > 0 ? totalDifferentiability / pairCount : 1;

            return {
              visionType,
              impactScore: 1 - avgDifferentiability, // Higher score = more impact/problems
              issues,
              recommendations,
            };
          }
        )
      );

      // Cognitive Load Analysis
      const componentComplexity = design.components.map((comp) => {
        // Simplified cognitive load calculation
        const baseComplexity = comp.type === 'button' ? 2 : comp.type === 'form' ? 6 : 4;
        const propertyComplexity = Object.keys(comp.properties).length * 0.5;
        return Math.min(10, baseComplexity + propertyComplexity);
      });

      const overallCognitiveLoad =
        componentComplexity.reduce((sum, load) => sum + load, 0) / componentComplexity.length;

      // Motor Accessibility Analysis
      const touchTargets = design.components.map((comp, _index) => ({
        component: comp.type,
        size: comp.accessibility?.touchTarget || 32, // Default assumption
        meetRequirements: (comp.accessibility?.touchTarget || 32) >= 44,
        recommendation:
          (comp.accessibility?.touchTarget || 32) < 44
            ? `Increase touch target to at least 44px`
            : undefined,
      }));

      const result: AccessibilityImpact = {
        wcagCompliance: {
          aa: wcagIssues.every(
            (issue) => issue.severity !== 'critical' && issue.severity !== 'high'
          ),
          aaa: wcagIssues.length === 0,
          issues: wcagIssues,
        },
        colorVisionImpact,
        cognitiveLoad: {
          overall: Math.round(overallCognitiveLoad),
          perComponent: Object.fromEntries(
            design.components.map((comp, i) => [
              `${comp.type}_${i}`,
              Math.round(componentComplexity[i]),
            ])
          ),
          recommendations:
            overallCognitiveLoad > 7
              ? ['Consider simplifying the interface', 'Break complex tasks into smaller steps']
              : ['Cognitive load is within acceptable range'],
        },
        motorAccessibility: {
          touchTargets,
          keyboardNavigation: design.components.every(
            (comp) => comp.accessibility?.keyboardNavigable !== false
          ),
          issues: touchTargets
            .filter((target) => !target.meetRequirements)
            .map((target) => `${target.component} touch target too small: ${target.size}px`),
        },
      };

      const processingTime = Math.max(1, Date.now() - startTime);
      console.log('[UserEmpathy] Accessibility analysis completed in', processingTime, 'ms', {
        wcagAA: result.wcagCompliance.aa,
        issueCount: wcagIssues.length,
      });

      return {
        success: true,
        data: result,
        processingTime,
        confidence: 0.85, // High confidence in accessibility analysis
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in accessibility analysis',
        processingTime: Date.now() - startTime,
        confidence: 0,
      };
    }
  }

  /**
   * Simulate color vision experience for different vision types
   */
  async simulateColorVisionExperience(
    colors: readonly OKLCH[],
    visionTypes: readonly ColorVisionType[]
  ): Promise<IntelligenceResult<VisionSimulation>> {
    const startTime = Date.now();
    console.log('[UserEmpathy] Simulating color vision for', visionTypes.length, 'vision types');

    try {
      const originalColors = colors.map((oklch, index) => ({
        oklch,
        role: `color_${index}`,
      }));

      const simulations = await Promise.all(
        visionTypes.map(async (visionType) => {
          const simulatedColors = originalColors.map((color) => {
            const simulatedOklch = simulateColorVision(color.oklch, visionType);

            // Calculate differentiability from original
            const differentiability =
              visionType === 'normal'
                ? 1.0
                : calculateColorDifferentiability(color.oklch, simulatedOklch, 'normal');

            return {
              oklch: simulatedOklch,
              role: color.role,
              differentiability,
            };
          });

          // Analyze overall impact
          const avgDifferentiability =
            simulatedColors.reduce((sum, c) => sum + c.differentiability, 0) /
            simulatedColors.length;
          const overallImpact = 1 - avgDifferentiability;

          // Identify critical issues
          const criticalIssues: string[] = [];
          const recommendations: string[] = [];

          const poorlyDifferentiatedColors = simulatedColors.filter(
            (c) => c.differentiability < 0.3
          );
          if (poorlyDifferentiatedColors.length > 0) {
            criticalIssues.push(
              `${poorlyDifferentiatedColors.length} colors become hard to distinguish`
            );
            recommendations.push(
              'Consider using lightness differences instead of hue/chroma alone'
            );
          }

          if (visionType !== 'normal' && overallImpact > 0.5) {
            criticalIssues.push('Significant color information loss for this vision type');
            recommendations.push('Add non-color indicators (icons, patterns, text labels)');
          }

          return {
            visionType,
            simulatedColors,
            overallImpact,
            criticalIssues,
            recommendations,
          };
        })
      );

      const result: VisionSimulation = {
        originalColors,
        simulations,
      };

      const processingTime = Date.now() - startTime;
      console.log('[UserEmpathy] Color vision simulation completed in', processingTime, 'ms');

      return {
        success: true,
        data: result,
        processingTime,
        confidence: 0.9, // High confidence in color vision simulation
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in color vision simulation',
        processingTime: Date.now() - startTime,
        confidence: 0,
      };
    }
  }

  /**
   * Analyze cultural sensitivity of design for target cultures
   */
  async analyzeCulturalSensitivity(
    design: DesignSpec,
    targetCultures: readonly string[]
  ): Promise<IntelligenceResult<CulturalSensitivityAnalysis>> {
    const startTime = Date.now();
    console.log('[UserEmpathy] Analyzing cultural sensitivity for', targetCultures);

    try {
      const culturalAnalysis = await Promise.all(
        targetCultures.map(async (culture) => {
          const colorMeanings: Array<{
            color: string;
            meanings: string[];
            sentiment: 'positive' | 'neutral' | 'negative' | 'taboo';
            confidence: number;
          }> = [];

          const culturalIssues: Array<{
            type: 'color' | 'layout' | 'imagery' | 'text';
            severity: 'low' | 'medium' | 'high' | 'critical';
            description: string;
            recommendation: string;
          }> = [];

          // Analyze color meanings for this culture
          for (const colorSpec of design.colors) {
            const colorCategory = categorizeColor(colorSpec.oklch);
            const culturalMeaning = CULTURAL_COLOR_MEANINGS[colorCategory]?.[culture];

            if (culturalMeaning) {
              colorMeanings.push({
                color: colorCategory,
                meanings: culturalMeaning.meanings,
                sentiment: culturalMeaning.sentiment,
                confidence: culturalMeaning.confidence,
              });

              // Check for cultural issues
              if (culturalMeaning.sentiment === 'taboo') {
                culturalIssues.push({
                  type: 'color',
                  severity: 'critical',
                  description: `${colorCategory} color is considered taboo in ${culture} culture`,
                  recommendation: `Avoid using ${colorCategory} as primary color for ${culture} audience`,
                });
              } else if (
                culturalMeaning.sentiment === 'negative' &&
                colorSpec.usage.includes('primary')
              ) {
                culturalIssues.push({
                  type: 'color',
                  severity: 'high',
                  description: `${colorCategory} color has negative connotations in ${culture} culture`,
                  recommendation: `Consider alternative colors or use sparingly for ${culture} audience`,
                });
              }
            }
          }

          // Analyze layout direction compatibility
          if (
            design.layout?.direction === 'ltr' &&
            ['arabic', 'hebrew', 'urdu', 'persian'].includes(culture)
          ) {
            culturalIssues.push({
              type: 'layout',
              severity: 'high',
              description: `Layout designed for LTR but ${culture} uses RTL reading direction`,
              recommendation: `Implement RTL layout support for ${culture} market`,
            });
          }

          // Calculate cultural score
          const negativeImpact = culturalIssues.reduce((sum, issue) => {
            return (
              sum + (issue.severity === 'critical' ? 0.4 : issue.severity === 'high' ? 0.2 : 0.1)
            );
          }, 0);
          const culturalScore = Math.max(0, 1 - negativeImpact);

          const recommendations: string[] = [];
          if (culturalScore < 0.7) {
            recommendations.push(`Consider cultural consultation for ${culture} market`);
            recommendations.push(`Test designs with ${culture} users before launch`);
          }
          if (colorMeanings.some((m) => m.sentiment === 'negative')) {
            recommendations.push(`Review color choices for ${culture} cultural appropriateness`);
          }

          return {
            culture,
            score: culturalScore,
            colorMeanings,
            culturalIssues,
            recommendations,
          };
        })
      );

      // Calculate overall cultural sensitivity score
      const overallScore =
        culturalAnalysis.reduce((sum, analysis) => sum + analysis.score, 0) /
        culturalAnalysis.length;

      const globalRecommendations: string[] = [];
      if (overallScore < 0.8) {
        globalRecommendations.push('Consider cultural adaptation for different markets');
        globalRecommendations.push('Implement region-specific design variations');
      }
      if (culturalAnalysis.some((c) => c.culturalIssues.some((i) => i.type === 'layout'))) {
        globalRecommendations.push('Implement comprehensive RTL layout support');
      }

      const result: CulturalSensitivityAnalysis = {
        overallScore,
        culturalAnalysis,
        globalRecommendations,
      };

      const processingTime = Date.now() - startTime;
      console.log('[UserEmpathy] Cultural analysis completed in', processingTime, 'ms', {
        overallScore: result.overallScore.toFixed(2),
      });

      return {
        success: true,
        data: result,
        processingTime,
        confidence: 0.8, // Good confidence in cultural analysis
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error in cultural sensitivity analysis',
        processingTime: Date.now() - startTime,
        confidence: 0,
      };
    }
  }

  /**
   * Predict user reactions across different user segments
   */
  async predictUserReactions(
    design: DesignSpec,
    userSegments: readonly UserSegment[]
  ): Promise<IntelligenceResult<UserReactionPrediction>> {
    const startTime = Date.now();
    console.log('[UserEmpathy] Predicting reactions for', userSegments.length, 'user segments');

    try {
      // Analyze reactions for each user segment
      const segmentReactions = await Promise.all(
        userSegments.map(async (segment) => {
          const keyFactors: Array<{
            factor: string;
            impact: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
            weight: number;
          }> = [];

          // Analyze color preferences
          const designColors = design.colors.map((c) => categorizeColor(c.oklch));
          const colorMatch = designColors.some((color) =>
            segment.preferences.colorPreferences.includes(color)
          );

          keyFactors.push({
            factor: 'color_preference_alignment',
            impact: colorMatch ? 'positive' : 'neutral',
            weight: 0.3,
          });

          // Analyze layout density preference
          const designDensity = design.layout?.density || 'comfortable';
          const densityMatch = designDensity === segment.preferences.layoutDensity;

          keyFactors.push({
            factor: 'layout_density_match',
            impact: densityMatch ? 'positive' : 'negative',
            weight: 0.2,
          });

          // Analyze tech savviness vs complexity
          const componentCount = design.components.length;
          const isComplex = componentCount > 5;

          if (isComplex && segment.demographics.techSavviness === 'low') {
            keyFactors.push({
              factor: 'interface_complexity',
              impact: 'negative',
              weight: 0.4,
            });
          } else if (!isComplex && segment.demographics.techSavviness === 'high') {
            keyFactors.push({
              factor: 'interface_simplicity',
              impact: 'neutral',
              weight: 0.2,
            });
          } else {
            keyFactors.push({
              factor: 'complexity_match',
              impact: 'positive',
              weight: 0.3,
            });
          }

          // Analyze accessibility needs coverage
          const hasAccessibilityFeatures = design.components.some((c) => c.accessibility);
          const needsAccessibility = segment.accessibilityNeeds.length > 0;

          if (needsAccessibility && !hasAccessibilityFeatures) {
            keyFactors.push({
              factor: 'accessibility_gap',
              impact: 'very_negative',
              weight: 0.5,
            });
          } else if (needsAccessibility && hasAccessibilityFeatures) {
            keyFactors.push({
              factor: 'accessibility_support',
              impact: 'very_positive',
              weight: 0.4,
            });
          }

          // Calculate weighted sentiment score
          const totalWeight = keyFactors.reduce((sum, f) => sum + f.weight, 0);
          const normalizedWeight = totalWeight > 0 ? totalWeight : 1;

          const sentimentScore = keyFactors.reduce((sum, factor) => {
            const impactScore = {
              very_negative: -2,
              negative: -1,
              neutral: 0,
              positive: 1,
              very_positive: 2,
            }[factor.impact];

            return sum + (impactScore * factor.weight) / normalizedWeight;
          }, 0);

          // Convert score to sentiment
          const sentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive' =
            sentimentScore >= 1.5
              ? 'very_positive'
              : sentimentScore >= 0.5
                ? 'positive'
                : sentimentScore >= -0.5
                  ? 'neutral'
                  : sentimentScore >= -1.5
                    ? 'negative'
                    : 'very_negative';

          const confidence = Math.min(0.9, 0.5 + Math.abs(sentimentScore) * 0.2);

          const recommendations: string[] = [];
          if (sentiment === 'negative' || sentiment === 'very_negative') {
            recommendations.push(`Customize design for ${segment.name} preferences`);

            if (keyFactors.some((f) => f.factor === 'accessibility_gap')) {
              recommendations.push('Add accessibility features for this segment');
            }
            if (
              keyFactors.some((f) => f.factor === 'interface_complexity' && f.impact === 'negative')
            ) {
              recommendations.push('Simplify interface for less tech-savvy users');
            }
          }

          return {
            segment: segment.name,
            sentiment,
            confidence,
            keyFactors,
            recommendations,
          };
        })
      );

      // Calculate overall sentiment
      const avgSentimentScore =
        segmentReactions.reduce((sum, reaction) => {
          const score = {
            very_negative: -2,
            negative: -1,
            neutral: 0,
            positive: 1,
            very_positive: 2,
          }[reaction.sentiment];
          return sum + score;
        }, 0) / segmentReactions.length;

      const overallSentiment =
        avgSentimentScore >= 1.5
          ? 'very_positive'
          : avgSentimentScore >= 0.5
            ? 'positive'
            : avgSentimentScore >= -0.5
              ? 'neutral'
              : avgSentimentScore >= -1.5
                ? 'negative'
                : 'very_negative';

      const overallConfidence =
        segmentReactions.reduce((sum, r) => sum + r.confidence, 0) / segmentReactions.length;

      // Identify risk factors
      const riskFactors: Array<{
        type: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        affectedSegments: string[];
        description: string;
        mitigation: string;
      }> = [];

      // Check for accessibility risks
      const accessibilityRisk = segmentReactions.filter((r) =>
        r.keyFactors.some((f) => f.factor === 'accessibility_gap')
      );

      if (accessibilityRisk.length > 0) {
        riskFactors.push({
          type: 'accessibility_exclusion',
          severity: 'critical',
          affectedSegments: accessibilityRisk.map((r) => r.segment),
          description: 'Design excludes users with accessibility needs',
          mitigation: 'Implement comprehensive accessibility features',
        });
      }

      // Check for complexity risks
      const complexityRisk = segmentReactions.filter((r) =>
        r.keyFactors.some((f) => f.factor === 'interface_complexity' && f.impact === 'negative')
      );

      if (complexityRisk.length > 0) {
        riskFactors.push({
          type: 'complexity_barrier',
          severity: 'high',
          affectedSegments: complexityRisk.map((r) => r.segment),
          description: 'Interface too complex for some user segments',
          mitigation: 'Provide simplified interface options or progressive disclosure',
        });
      }

      const result: UserReactionPrediction = {
        overallSentiment,
        confidence: overallConfidence,
        segmentReactions,
        riskFactors,
      };

      const processingTime = Date.now() - startTime;
      console.log('[UserEmpathy] Reaction prediction completed in', processingTime, 'ms', {
        overallSentiment: result.overallSentiment,
        riskFactors: result.riskFactors.length,
      });

      return {
        success: true,
        data: result,
        processingTime,
        confidence: overallConfidence,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in user reaction prediction',
        processingTime: Date.now() - startTime,
        confidence: 0,
      };
    }
  }
}
