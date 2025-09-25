/**
 * Prediction Intelligence Service
 *
 * Provides predictive capabilities for design decisions and trends
 */

import type { ComponentIntelligence, Token } from '@rafters/shared';

export interface DesignTrend {
  name: string;
  strength: number; // 0-1
  timeline: 'emerging' | 'growing' | 'peak' | 'declining';
  relevance: number; // 0-1
  impact: 'low' | 'medium' | 'high';
}

export interface PredictionResult {
  prediction: string;
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
}

export interface DesignEvolution {
  currentState: string;
  predictedStates: Array<{
    timeframe: string;
    state: string;
    probability: number;
  }>;
  evolutionFactors: string[];
}

export class PredictionIntelligenceService {
  private trends: DesignTrend[] = [];

  constructor() {
    this.initializeTrends();
  }

  /**
   * Predict future usage patterns for a token
   */
  predictTokenEvolution(token: Token): DesignEvolution {
    const currentState = this.analyzeCurrentState(token);

    return {
      currentState,
      predictedStates: [
        {
          timeframe: '3 months',
          state: 'Stable usage with minor refinements',
          probability: 0.75,
        },
        {
          timeframe: '6 months',
          state: 'Potential semantic meaning evolution',
          probability: 0.6,
        },
        {
          timeframe: '12 months',
          state: 'Integration with emerging design patterns',
          probability: 0.45,
        },
      ],
      evolutionFactors: this.identifyEvolutionFactors(token),
    };
  }

  /**
   * Predict component composition effectiveness
   */
  predictCompositionSuccess(
    components: string[],
    targetAudience: string = 'general'
  ): PredictionResult {
    const cognitiveLoadPrediction = this.predictCognitiveLoadImpact(components);
    const usabilityPrediction = this.predictUsabilityOutcome(components, targetAudience);

    return {
      prediction: `${Math.round(usabilityPrediction * 100)}% user satisfaction predicted`,
      confidence: (cognitiveLoadPrediction + usabilityPrediction) / 2,
      timeframe: '1-3 months post-implementation',
      factors: [
        'Cognitive load distribution',
        'Component familiarity',
        'Accessibility compliance',
        'Performance characteristics',
      ],
      recommendations: this.generateCompositionRecommendations(components),
    };
  }

  /**
   * Analyze design trends impact on current tokens
   */
  analyzeTrendImpact(tokens: Token[]): {
    trendsAlignment: Record<string, number>;
    futureViability: number;
    adaptationRecommendations: string[];
  } {
    const trendsAlignment: Record<string, number> = {};

    for (const trend of this.trends) {
      trendsAlignment[trend.name] = this.calculateTrendAlignment(tokens, trend);
    }

    const futureViability = this.calculateFutureViability(trendsAlignment);

    return {
      trendsAlignment,
      futureViability,
      adaptationRecommendations: this.generateAdaptationRecommendations(trendsAlignment),
    };
  }

  /**
   * Predict user behavior patterns
   */
  predictUserBehavior(
    componentIntelligence: ComponentIntelligence[],
    userContext: { experience: 'novice' | 'intermediate' | 'expert'; domain: string }
  ): {
    interactionPatterns: Record<string, number>;
    errorProbability: number;
    completionTime: { min: number; max: number; average: number };
    satisfactionScore: number;
  } {
    const totalCognitiveLoad = componentIntelligence.reduce(
      (sum, intel) => sum + intel.cognitiveLoad,
      0
    );

    const experienceMultiplier = {
      novice: 1.5,
      intermediate: 1.0,
      expert: 0.7,
    };

    const adjustedLoad = totalCognitiveLoad * experienceMultiplier[userContext.experience];

    return {
      interactionPatterns: this.predictInteractionPatterns(componentIntelligence, userContext),
      errorProbability: Math.min(adjustedLoad / 20, 0.8), // Max 80% error probability
      completionTime: {
        min: Math.max(adjustedLoad * 2, 5), // Minimum 5 seconds
        max: Math.max(adjustedLoad * 8, 30), // Minimum 30 seconds
        average: Math.max(adjustedLoad * 4, 15), // Minimum 15 seconds
      },
      satisfactionScore: Math.max(1 - adjustedLoad / 25, 0.2), // Minimum 20% satisfaction
    };
  }

  private initializeTrends(): void {
    this.trends = [
      {
        name: 'Minimalism',
        strength: 0.8,
        timeline: 'peak',
        relevance: 0.9,
        impact: 'high',
      },
      {
        name: 'Dark Mode',
        strength: 0.85,
        timeline: 'growing',
        relevance: 0.95,
        impact: 'high',
      },
      {
        name: 'Accessibility-First',
        strength: 0.9,
        timeline: 'growing',
        relevance: 1.0,
        impact: 'high',
      },
      {
        name: 'Micro-interactions',
        strength: 0.7,
        timeline: 'peak',
        relevance: 0.8,
        impact: 'medium',
      },
      {
        name: 'Voice UI Integration',
        strength: 0.4,
        timeline: 'emerging',
        relevance: 0.6,
        impact: 'medium',
      },
    ];
  }

  private analyzeCurrentState(token: Token): string {
    if (token.category === 'color') {
      if (token.name.includes('primary')) return 'Primary brand color, high usage';
      if (token.name.includes('accent')) return 'Accent color, selective usage';
      return 'Utility color, context-dependent usage';
    }

    return 'Standard design token, stable usage';
  }

  private identifyEvolutionFactors(token: Token): string[] {
    const factors: string[] = [];

    if (token.category === 'color') {
      factors.push('Color trend shifts', 'Brand evolution', 'Accessibility requirements');
    }
    if (token.category === 'spacing') {
      factors.push('Layout pattern changes', 'Device size evolution', 'User behavior shifts');
    }

    factors.push('Technology advancement', 'User preference changes', 'Industry standards');
    return factors;
  }

  private predictCognitiveLoadImpact(components: string[]): number {
    // Simple heuristic - fewer components generally mean lower cognitive load
    const componentComplexity = components.length;
    if (componentComplexity <= 3) return 0.9;
    if (componentComplexity <= 5) return 0.7;
    if (componentComplexity <= 8) return 0.5;
    return 0.3;
  }

  private predictUsabilityOutcome(components: string[], audience: string): number {
    let score = 0.7; // Base usability score

    // Adjust based on component familiarity
    const familiarComponents = ['Button', 'Input', 'Card', 'Text', 'Image'];
    const familiarCount = components.filter((comp) =>
      familiarComponents.some((familiar) => comp.toLowerCase().includes(familiar.toLowerCase()))
    ).length;

    score += (familiarCount / components.length) * 0.2;

    // Adjust based on audience
    if (audience === 'expert') score += 0.1;
    if (audience === 'novice') score -= 0.1;

    return Math.min(Math.max(score, 0.1), 1.0);
  }

  private generateCompositionRecommendations(components: string[]): string[] {
    const recommendations: string[] = [];

    if (components.length > 7) {
      recommendations.push('Consider reducing component count to manage cognitive load');
    }

    if (components.some((comp) => comp.toLowerCase().includes('dialog'))) {
      recommendations.push('Ensure dialog components have clear escape patterns');
    }

    recommendations.push('Implement progressive disclosure where possible');
    recommendations.push('Test with target users for validation');

    return recommendations;
  }

  private calculateTrendAlignment(tokens: Token[], trend: DesignTrend): number {
    let alignment = 0.5; // Base alignment

    switch (trend.name) {
      case 'Minimalism': {
        // Check if tokens support minimalist design
        const utilityTokens = tokens.filter(
          (t) => t.name.includes('subtle') || t.name.includes('muted')
        );
        alignment = utilityTokens.length / tokens.length;
        break;
      }

      case 'Dark Mode': {
        // Check for dark mode color variants
        const darkTokens = tokens.filter(
          (t) => t.name.includes('dark') || t.value?.toString().includes('darkValue')
        );
        alignment = darkTokens.length > 0 ? 0.8 : 0.2;
        break;
      }

      case 'Accessibility-First':
        // Assume all tokens support accessibility (mock)
        alignment = 0.9;
        break;
    }

    return Math.min(Math.max(alignment, 0), 1);
  }

  private calculateFutureViability(trendsAlignment: Record<string, number>): number {
    const weights = {
      Minimalism: 0.2,
      'Dark Mode': 0.25,
      'Accessibility-First': 0.3,
      'Micro-interactions': 0.15,
      'Voice UI Integration': 0.1,
    };

    let viability = 0;
    for (const [trend, alignment] of Object.entries(trendsAlignment)) {
      const weight = weights[trend as keyof typeof weights] || 0.1;
      viability += alignment * weight;
    }

    return Math.min(Math.max(viability, 0.3), 1.0); // Minimum 30% viability
  }

  private generateAdaptationRecommendations(trendsAlignment: Record<string, number>): string[] {
    const recommendations: string[] = [];

    if (trendsAlignment['Dark Mode'] < 0.5) {
      recommendations.push('Consider adding dark mode variants for better trend alignment');
    }

    if (trendsAlignment['Accessibility-First'] < 0.8) {
      recommendations.push('Enhance accessibility features to meet growing standards');
    }

    if (trendsAlignment.Minimalism < 0.6) {
      recommendations.push('Evaluate token complexity to align with minimalist trends');
    }

    return recommendations;
  }

  private predictInteractionPatterns(
    intelligence: ComponentIntelligence[],
    userContext: { experience: string; domain: string }
  ): Record<string, number> {
    const patterns: Record<string, number> = {
      'direct-navigation': 0.6,
      'exploratory-browsing': 0.3,
      'help-seeking': 0.1,
    };

    // Adjust based on cognitive load
    const avgCognitiveLoad =
      intelligence.reduce((sum, intel) => sum + intel.cognitiveLoad, 0) / intelligence.length;

    if (avgCognitiveLoad > 3) {
      patterns['help-seeking'] += 0.2;
      patterns['direct-navigation'] -= 0.1;
    }

    if (userContext.experience === 'novice') {
      patterns['exploratory-browsing'] += 0.2;
      patterns['help-seeking'] += 0.1;
      patterns['direct-navigation'] -= 0.3;
    }

    return patterns;
  }
}
